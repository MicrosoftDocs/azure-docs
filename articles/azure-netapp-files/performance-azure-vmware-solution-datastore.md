---
title: Azure VMware Solution datastore performance considerations for Azure NetApp Files | Microsoft Docs
description: Describes considerations for Azure VMware Solution (AVS) datastore design and sizing when used with Azure NetApp Files.
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 05/15/2023
ms.author: anfdocs
---
# Azure VMware Solution datastore performance considerations for Azure NetApp Files 

This article provides performance considerations for Azure VMware Solution (AVS) datastore design and sizing when used with Azure NetApp Files. This content is applicable to a virtualization administrator, cloud architect, or storage architect. 

The considerations outlined in this article help you achieve the highest levels of performance from your applications with optimized cost efficiency. 

Azure NetApp Files provides an instantly scalable, high performance, and highly reliable storage service for AVS.  The tests included various different configurations between AVS and Azure NetApp Files.  The tests were able to drive over 10,500 MiB/s and over 585,000 input/output operations per second (IOPS) with only four AVS/ESXi hosts and a single Azure NetApp Files capacity pool. 
 
## Achieving higher storage performance for AVS using Azure NetApp Files   

Provisioning multiple, potentially larger, datastores at one service level may cost less while also providing increased performance. The reason is due to the distribution of load across multiple TCP streams from AVS hosts to several datastores. You can use the [Azure NetApp Files datastore for Azure VMware Solution TCO Estimator](https://aka.ms/anfavscalc) to calculate potential cost savings  by uploading an RVTools report or entering manual average VM sizing. 

When you determine how to configure datastores, the easiest solution from a management perspective is to create a single Azure NetApp Files datastore, mount it, and put all your VMs in. This strategy works well for many situations, until more throughput or IOPS is required. To identify the different boundaries, the tests used a synthetic workload generator, the program [`fio`](https://github.com/axboe/fio) , to evaluate a range of workloads for each of these scenarios. This analysis can help you determine how to provision Azure NetApp Files volumes as datastores to maximize performance and optimize costs. 

## Before you begin 

For Azure NetApp Files performance data, see: 

* [Azure NetApp Files: Getting the Most Out of Your Cloud Storage](https://cloud.netapp.com/hubfs/Resources/ANF%20PERFORMANCE%20TESTING%20IN%20TEMPLATE.pdf)

    On an AVS host, a single network connection is established per NFS datastore akin to using `nconnect=1` on the Linux tests referenced in Section 6 (*The Tuning Options*). This fact is key to understanding how AVS scales performance so well across multiple datastores. 

* [Azure NetApp Files datastore performance benchmarks for Azure VMware Solution](performance-benchmarks-azure-vmware-solution.md)


## Test methodology 

This section describes the methodology used for the tests. 

### Test scenarios and iterations

This testing follows the "four-corners" methodology, which includes both read operations and write operations for each sequential and random input/output (IO). The variables of the tests include one-to-many AVS hosts, Azure NetApp Files datastores, VMs (per host), and VM disks (VMDKs) per VM. The following scaling datapoints were selected to find the maximum throughput and IOPS for the given scenarios:
* Scaling VMDKs, each on their own datastore for a single VM.
* Scaling number of VMs per host on a single Azure NetApp Files datastore.
* Scaling number of AVS hosts, each with one VM sharing a single Azure NetApp Files datastore.
* Scaling number of Azure NetApp Files datastores, each with one VMDK equally spread across AVS hosts. 

Testing both small and large block operations and iterating through sequential and random workloads ensure the testing of all components in the compute, storage, and network stacks to the "edge". To cover the four corners with block size and randomization, the following common combinations are used:
* 64 KB sequential tests
    * Large file streaming workloads commonly read and write in large block sizes, as well as being the default MSSQL extent size. 
    * Large block tests typically produce the highest throughput (in MiB/s).
* 8 KB random tests
    * This setting is the commonly used block size for database software, including software from Microsoft, Oracle, and PostgreSQL.
    * Small block tests typically produce the highest number of IOPS.

> [!NOTE]
> This article addresses only  the testing of Azure NetApp Files. It doesn't cover the vSAN storage included with AVS.

### Environment details 

The results in this article were achieved using the following environment configuration:   

* AVS hosts:
    * Size: [AV36](../azure-vmware/introduction.md#av36p-and-av52-node-sizes-available-in-azure-vmware-solution) 
    * Host count: 4
    * VMware ESXi version 7u3
* AVS private cloud connectivity: UltraPerformance gateway with FastPath
* Guest VMs: 
    * Operating system: Ubuntu 20.04
    * CPUs/Memory: 16 vCPU / 64-GB memory
    * Virtual LSI SAS SCSI controller with 16-GB OS disk on AVS vSAN datastore
    * Paravirtual SCSI controller for test VMDKs
    * LVM/Disk configurations:
        * One physical volume per disk
        * One volume group per physical volume
        * One logical partition per volume group
        * One XFS file system per logical partition
* AVS to Azure NetApp Files protocol: [NFS version 3](../azure-vmware/attach-azure-netapp-files-to-azure-vmware-solution-hosts.md?tabs=azure-portal#faqs) 
* Workload generator: `fio` version 3.16
* Fio scripts: [`fio-parser`](https://github.com/mchad1/fio-parser)
 
## Test results  

This section describes the results of the performed tests.

### Single-VM scaling 

When you configure datastore-presented storage on an AVS virtual machine, you should consider the impact of file-system layout. Configuring multiple VMDKs spread across multiple datastores provides for the highest amounts of available bandwidth. Configuring one-to-many VMDKs placed on a single datastore ensures the greatest simplicity when it comes to backups and DR operations, but at the cost of a lower performance ceiling. The empirical data provided in this article helps you with the decisions.

To maximize performance, it's common to scale a single VM across multiple VMDKs and place those VMDKs across multiple datastores. A single VM with just one or two VMDKs can be throttled by one NFS datastore as it's mounted via a single TCP connection to a given AVS host. 

For example, engineers often provision a VMDK for a database log and then provision one-to-many VMDKs for database files. With multiple VMDKs, there are two options. The first option is using each VDMK as an individual file system. The second option is using a storage-management utility such as LVM, MSSQL Filegroups, or Oracle ASM to balance IO by striping across VMDKs. When VMDKs are used as individual file systems, distributing workloads across multiple datastores is a manual effort and can be cumbersome. Using storage management utilities to spread the files across VMDKs enables workload scalability. 

If you stripe volumes across multiple disks, ensure the backup software or disaster recovery software supports backing up multiple virtual disks simultaneously. As individual writes are striped across multiple disks, the file system needs to ensure disks are "frozen" during snapshot or backup operations.  Most modern file systems include a freeze or snapshot operation such as `xfs` (`xfs_freeze`) and NTFS (volume shadow copies), which backup software can take advantage of. 

To understand how well a single AVS VM scales as more virtual disks are added, tests were performed with one, two, four, and eight datastores (each containing a single VMDK). The following diagram shows a single disk averaged around 73,040 IOPS (scaling from 100% write / 0% read, to 0% write / 100% read). When this test was increased to two drives, performance increased by 75.8% to 128,420 IOPS. Increasing to four drives began to show diminishing returns of what a single VM, sized as tested, could push.  The peak IOPS observed were 147,000 IOPS with 100% random reads. 

:::image type="content" source="../media/azure-netapp-files/performance-azure-vmware-datastore-scale-single-multiple.png" alt-text="Diagram that shows single VM scaling to multiple datastores." lightbox="../media/azure-netapp-files/performance-azure-vmware-datastore-scale-single-multiple.png":::

### Single-host scaling – Single datastore 

It scales poorly to increase the number of VMs driving IO to a single datastore from a single host. This fact is due to the single network flow. When maximum performance is reached for a given workload, it's often the result of a single queue used along the way to the host's single NFS datastore over a single TCP connection. Using an 8-KB block size, total IOPS increased between 3% and 16% when scaling from one VM with a single VMDK to four VMs with 16 total VMDKs (four per VM, all on a single datastore). 

Increasing the block size (to 64 KB) for large block workloads had comparable results, reaching a peak of 2148 MiB/s (single VM, single VMDK) and 2138 MiB/s (4 VMs, 16 VMDKs). 

:::image type="content" source="../media/azure-netapp-files/performance-azure-vmware-datastore-scale-single-host.png" alt-text="Diagram that shows scaling VMs on a single datastore host." lightbox="../media/azure-netapp-files/performance-azure-vmware-datastore-scale-single-host.png":::

### Single-host scaling – Multiple datastores

From the context of a single AVS host, while a single datastore allowed the VMs to drive about 76,000 IOPS, spreading the workloads across two datastores increased total throughput by 76% on average. Moving beyond two datastores to four resulted in a 163% increase (over one datastore, a 49% increase from two to four) as shown in the following diagram. Even though there were still performance gains, increasing beyond eight datastores showed diminishing returns.

:::image type="content" source="../media/azure-netapp-files/performance-azure-vmware-datastore-scale-single-host-four-vm.png" alt-text="Diagram that shows scaling VMs on a single datastore host with four VMs." lightbox="../media/azure-netapp-files/performance-azure-vmware-datastore-scale-single-host-four-vm.png":::

### Multi-host scaling – Single datastore 

A single datastore from a single host produced over 2000 MiB/s of sequential 64-KB throughput. Distributing the same workload across all four hosts produced a peak gain of 135% driving over 5000 MiB/s. This outcome likely represents the upper ceiling of a single Azure NetApp Files volume throughput performance.

:::image type="content" source="../media/azure-netapp-files/performance-azure-vmware-datastore-throughput-single-volume.png" alt-text="Diagram that shows throughput scaling on a single Azure NetApp Files volume." lightbox="../media/azure-netapp-files/performance-azure-vmware-datastore-throughput-single-volume.png":::

Decreasing the block size from 64 KB to 8 KB and rerunning the same iterations resulted in four VMs producing 195,000 IOPS, as shown the following diagram. Performance scales as both the number of hosts and the number of datastores increase, because the number of network flows increases. The performance increases by scaling the number of hosts multiplied by the number of datastores, because the count of network flows is a factor of hosts times datastores. 

:::image type="content" source="../media/azure-netapp-files/performance-azure-vmware-datastore-network-flows.png" alt-text="Formula that shows the calculation of total network flows." lightbox="../media/azure-netapp-files/performance-azure-vmware-datastore-network-flows.png":::

:::image type="content" source="../media/azure-netapp-files/performance-azure-vmware-scale-single-datastore.png" alt-text="Diagram that shows IOPS scaling on a single Azure NetApp Files datastore." lightbox="../media/azure-netapp-files/performance-azure-vmware-scale-single-datastore.png":::

### Multi-host scaling – Multiple datastores

A single datastore with four VMs spread across four hosts produced over 5000 MiB/s of sequential 64-KB IO. For more demanding workloads, each VM is moved to a dedicated datastore, producing over 10,500 MiB/s in total, as shown in the following diagram. 

:::image type="content" source="../media/azure-netapp-files/performance-azure-vmware-scale-four-hosts.png" alt-text="Diagram that shows scaling datastores on four hosts." lightbox="../media/azure-netapp-files/performance-azure-vmware-scale-four-hosts.png":::

For small-block, random workloads, a single datastore produced 195,000 random 8-KB IOPS.  Scaling to four datastores produced over 530,000 random 8K IOPS. 

:::image type="content" source="../media/azure-netapp-files/performance-azure-vmware-scale-four-hosts-8k.png" alt-text="Diagram that shows scaling datastores on four hosts with 8k block size." lightbox="../media/azure-netapp-files/performance-azure-vmware-scale-four-hosts-8k.png":::

## Implications and recommendations

This section discusses why *spreading your VMs across multiple datastores has substantial performance benefits.* 

As shown in the [test results](#test-results), the performance capabilities of Azure NetApp Files are abundant: 

* Testing shows that one datastore can drive an average **~148,980 8-KB IOPS or ~4147 MiB/s** with 64-KB IOPS (average of all the write%/read% tests) from a four-host configuration. 
* One VM on one datastore – 
    * If you have individual VMs that may need more than **~75K 8-KB IOPS or over ~1700 MiB/s**, spread the file systems over multiple VMDKs to scale the VMs storage performance.
* One VM on multiple datastores – A Single VM across 8 datastores achieved up to **~147,000 8-KB IOPS or ~2786 MiB/s** with a 64 KB block size.
* One host - Each host was able to support an average **~198,060 8-KB IOPS or ~2351 MiB/s** if you use at least 4 VMs per host with at least 4 Azure NetApp Files datastores.  So you have the option to balance provisioning enough datastores for maximum, potentially bursting, performance, versus complication of management and cost.

### Recommendations 

When the performance capabilities of a single datastore are insufficient, spread your VMs across multiple datastores to scale even further. Simplicity is often best, but performance and scalability may justify the added but limited complexity.
  
Four Azure NetApp Files datastores provide up of 10 GBps of usable bandwidth for large sequential IO or the capability to drive up to 500K 8K-random IOPS. While one datastore may be sufficient for many performance needs, for best performance, start with a minimum of four datastores. 

For granular performance tuning, both Windows and Linux guest operating systems allow for striping across multiple disks. As such, you should stripe file systems across multiple VMDKs spread across multiple datastores.  However, if application snapshot consistency is an issue and can't be overcome with LVM or storage spaces, consider mounting Azure NetApp Files from the guest operating system or investigate application-level scaling, of which Azure has many great options. 

If you stripe volumes across multiple disks, ensure the backup software or disaster recovery software supports backing up multiple virtual disks simultaneously.  As individual writes are striped across multiple disks, the file system needs to ensure disks are "frozen" during the snapshot or backup operations.  Most modern file systems include a freeze or snapshot operation such as xfs (xfs_freeze) and NTFS (volume shadow copies), which backup software can take advantage of. 

Because Azure NetApp Files bills for provisioned capacity at the capacity pool rather than allocated capacity (datastores), you will, for example, pay the same for 4x20TB datastores or 20x4TB datastores. If you need to, you can tweak capacity and performance of datastores on-demand, [dynamically via the Azure API/console](dynamic-change-volume-service-level.md). 

For example, as you approach the end of a fiscal year you find that you need more storage performance on Standard datastore. You can increase the datastores' service level for a month to enable all VMs on those datastores to have more performance available to them, while maintaining other datastores at a lower service level. You not only save cost but gain more performance by having workloads spread among more TCP connections between each datastore to each AVS host. 

You can monitor your datastore metrics through vCenter or through the Azure API/Console. From vCenter, you can monitor a datastore's aggregate average IOPS in the [Performance/Advanced Charts](https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.vsphere.monitoring.doc/GUID-B3D99B36-E856-41A5-84DB-9B7C8FABCF83.html) , as long as you enable Storage IO Control Metrics collection on the datastore. The Azure [API](monitor-volume-capacity.md#using-rest-api) and [console](monitor-azure-netapp-files.md)  present metrics for `WriteIops`, `ReadIops`, `ReadThroughput`, and `WriteThroughput`, among others, to measure your workloads at the datastore level. With Azure metrics, you can set alert rules with actions to automatically resize a datastore via an Azure function, a webhook, or other actions. 

## Next steps  

* [Striping Disks in Azure](../virtual-machines/premium-storage-performance.md#disk-striping)
* [Creating striped volumes in Windows Server](/windows-server/administration/windows-commands/create-volume-stripe)
* [Azure VMware Solution storage concepts](../azure-vmware/concepts-storage.md)
* [Attach Azure NetApp Files datastores to Azure VMware Solution hosts](../azure-vmware/attach-azure-netapp-files-to-azure-vmware-solution-hosts.md)
* [Attach Azure NetApp Files to Azure VMware Solution VMs](../azure-vmware/netapp-files-with-azure-vmware-solution.md)
* [Performance considerations for Azure NetApp Files](azure-netapp-files-performance-considerations.md)
* [Linux NFS mount options best practices for Azure NetApp Files](performance-linux-mount-options.md)
