---
title: SAP HANA Azure virtual machine storage configurations | Microsoft Docs
description: General Storage recommendations for VM that have SAP HANA deployed.
author: msjuergent
manager: bburns
keywords: 'SAP, Azure HANA, Storage Ultra disk, Premium storage'
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: article
ms.date: 03/18/2024
ms.author: juergent
ms.custom: H1Hack27Feb2017
---

# SAP HANA Azure virtual machine storage configurations

Azure provides different types of storage that are suitable for Azure VMs that are running SAP HANA. The **SAP HANA certified Azure storage types** that can be considered for SAP HANA deployments list like: 

- Azure premium SSD or premium storage v1/v2
- [Ultra disk](../../virtual-machines/disks-enable-ultra-ssd.md)
- [Azure NetApp Files](https://azure.microsoft.com/services/netapp/) 

To learn about these disk types, see the article [Azure Storage types for SAP workload](./planning-guide-storage.md) and [Select a disk type](../../virtual-machines/disks-types.md)

Azure offers two deployment methods for VHDs on Azure Standard and premium storage v1/v2. We expect you to take advantage of [Azure managed disk](https://azure.microsoft.com/services/managed-disks/) for Azure block storage deployments. 

For a list of storage types and their SLAs in IOPS and storage throughput, review the [Azure documentation for managed disks](https://azure.microsoft.com/pricing/details/managed-disks/).

> [!IMPORTANT]
> Independent of the Azure storage type chosen, the file system that is used on that storage needs to be supported by SAP for the specific operating system and DBMS. [SAP support note #2972496](https://launchpad.support.sap.com/#/notes/2972496) lists the supported file systems for different operating systems and databases, including SAP HANA. This applies to all volumes SAP HANA might access for reading and writing for whatever task. Specifically using NFS on Azure for SAP HANA, additional restrictions of NFS versions apply as stated later in this article 


The minimum SAP HANA certified conditions for the different storage types are: 

- Azure premium storage v1 - **/hana/log** is required to be supported by Azure [Write Accelerator](../../virtual-machines/how-to-enable-write-accelerator.md). The **/hana/data** volume could be placed on premium storage v1 without Azure Write Accelerator or on Ultra disk. Azure premium storage v2 or Azure premium SSD v2 is not supporting the usage of Azure Write Accelerator
- Azure Ultra disk at least for the **/hana/log** volume. The **/hana/data** volume can be placed on either premium storage v1/v2 without Azure Write Accelerator or in order to get faster restart times Ultra disk
- **NFS v4.1** volumes on top of Azure NetApp Files for **/hana/log and /hana/data**. The volume of /hana/shared can use NFS v3 or NFS v4.1 protocol

Based on experience gained with customers, we changed the support for combining different storage types between **/hana/data** and **/hana/log**. It is supported to combine the usage of the different Azure block storages that are certified for HANA AND NFS shares based on Azure NetApp Files. For example, it's possible to put **/hana/data** onto premium storage v1 or v2 and **/hana/log** can be placed on Ultra disk storage in order to get the required low latency. If you use a volume based on ANF for **/hana/data**, **/hana/log** volume can be placed on one of the HANA certified Azure block storage types as well. Using NFS on top of ANF for one of the volumes (like **/hana/data**) and Azure premium storage v1/v2 or Ultra disk for the other volume (like **/hana/log**) is **supported**.

In the on-premises world, you rarely had to care about the I/O subsystems and its capabilities. Reason was that the appliance vendor needed to make sure that the minimum storage requirements are met for SAP HANA. As you build the Azure infrastructure yourself, you should be aware of some of these SAP issued requirements. Some of the minimum throughput characteristics that SAP is recommending, are:

- Read/write on **/hana/log** of 250 MB/sec with 1 MB I/O sizes
- Read activity of at least 400 MB/sec for **/hana/data** for 16 MB and 64 MB I/O sizes
- Write activity of at least 250 MB/sec for **/hana/data** with 16 MB and 64 MB I/O sizes

Given that low storage latency is critical for DBMS systems, even as DBMS, like SAP HANA, keep data in-memory. The critical path in storage is usually around the transaction log writes of the DBMS systems. But also operations like writing savepoints or loading data in-memory after crash recovery can be critical. Therefore, it's **mandatory** to use Azure premium storage v1/v2, Ultra disk, or ANF for **/hana/data** and **/hana/log** volumes. 


Some guiding principles in selecting your storage configuration for HANA can be listed like:

- Decide on the type of storage based on [Azure Storage types for SAP workload](./planning-guide-storage.md) and [Select a disk type](../../virtual-machines/disks-types.md)
- The overall VM I/O throughput and IOPS limits in mind when sizing or deciding for a VM. Overall VM storage throughput is documented in the article [Memory optimized virtual machine sizes](../../virtual-machines/sizes-memory.md)   
- When deciding for the storage configuration, try to stay below the overall throughput of the VM with your **/hana/data** volume configuration. SAP HANA writing savepoints, HANA can be aggressive issuing I/Os. It's easily possible to push up to throughput limits of your **/hana/data** volume when writing a savepoint. If your disk(s) that build the **/hana/data** volume have a higher throughput than your VM allows, you could run into situations where throughput utilized by the savepoint writing is interfering with throughput demands of the redo log writes. A situation that can impact the application throughput
- If you're considering using HANA System Replication, the storage used for **/hana/data** on each replica must be same and the storage type used for **/hana/log** on each replica must be same. For example, using Azure premium storage v1 for **/hana/data** with one VM and Azure Ultra disk for **/hana/data** in another VM running a replica of the same HANA System replication configuration, isn't supported


> [!IMPORTANT]
> The suggestions for the storage configurations in this or subsequent documents are meant as directions to start with. Running workload and analyzing storage utilization patterns, you might realize that you're not utilizing all the storage bandwidth or IOPS provided. You might consider downsizing on storage then. Or in contrary, your workload might need more storage throughput than suggested with these configurations. As a result, you might need to deploy more capacity, IOPS or throughput. In the field of tension between storage capacity required, storage latency needed, storage throughput and IOPS required and least expensive configuration, Azure offers enough different storage types with different capabilities and different price points to find and adjust to the right compromise for you and your HANA workload.


## Stripe sets versus SAP HANA data volume partitioning
Using Azure premium storage v1 you may hit the best price/performance ratio when you stripe the **/hana/data** and/or **/hana/log** volume across multiple Azure disks. Instead of deploying larger disk volumes that provide the more on IOPS or throughput needed. Creating a single volume across multiple Azure disks can be accomplished with LVM and MDADM volume managers, which are part of Linux. The method of striping disks is decades old and well known. As beneficial as those striped volumes are to get to the IOPS or throughput capabilities you may need, it adds complexities around managing those striped volumes. Especially in cases when the volumes need to get extended in capacity. At least for **/hana/data**, SAP introduced an alternative method that achieves the same goal as striping across multiple Azure disks. Since SAP HANA 2.0 SPS03, the HANA indexserver is able to stripe its I/O activity across multiple HANA data files, which are located on different Azure disks. The advantage is that you don't have to take care of creating and managing a striped volume across different Azure disks. The SAP HANA functionality of data volume partitioning is described in detail in:

- [The HANA Administrator's Guide](https://help.sap.com/viewer/6b94445c94ae495c83a19646e7c3fd56/2.0.05/en-US/40b2b2a880ec4df7bac16eae3daef756.html?q=hana%20data%20volume%20partitioning)
- [Blog about SAP HANA – Partitioning Data Volumes](https://blogs.sap.com/2020/10/07/sap-hana-partitioning-data-volumes/)
- [SAP Note #2400005](https://launchpad.support.sap.com/#/notes/2400005)
- [SAP Note #2700123](https://launchpad.support.sap.com/#/notes/2700123)

Reading through the details, it's apparent that applying this functionality takes away complexities of volume manager based stripe sets. You also realize that the HANA data volume partitioning isn't only working for Azure block storage, like Azure premium storage v1/v2. You can use this functionality as well to stripe across NFS shares in case these shares have IOPS or throughput limitations.  


## Linux I/O Scheduler mode
Linux has several different I/O scheduling modes. Common recommendation through Linux vendors and SAP is to reconfigure the I/O scheduler mode for disk volumes from the **mq-deadline** or **kyber** mode to the **noop** (non-multiqueue) or **none** for (multiqueue) mode if not done yet by the SLES saptune profiles. Details are referenced in: 

- [SAP Note #1984787](https://launchpad.support.sap.com/#/notes/1984787)
- [SAP Note #2578899](https://launchpad.support.sap.com/#/notes/2578899) 
- [Issue with noop setting in SLES 12 SP4](https://www.suse.com/support/kb/doc/?id=000019547)

On Red Hat, leave the settings as established by the specific tune profiles for the different SAP applications.


## Stripe sizes when using logical volume managers
If you're using LVM or mdadm to build stripe sets across several Azure premium disks, you need to define stripe sizes. These sizes differ between **/hana/data** and **/hana/log**. **Recommendation: As stripe sizes the recommendation is to use:**

- 256 KB for **/hana/data**
- 64 KB for **/hana/log**

> [!NOTE]
> The stripe size for **/hana/data** got changed from earlier recommendations calling for 64 KB or 128 KB to 256 KB based on customer experiences with more recent Linux versions. The size of 256 KB is providing slightly better performance. We also changed the recommendation for stripe sizes of **/hana/log** from 32 KB to 64 KB in order to get enough throughput with larger I/O sizes.

> [!NOTE]
> You don't need to configure any redundancy level using RAID volumes since Azure block storage keeps three images of a VHD. The usage of a stripe set with Azure premium disks is purely to configure volumes that provide sufficient IOPS and/or I/O throughput.

Accumulating multiple Azure disks underneath a stripe set, is accumulative from an IOPS and storage throughput side. So, if you put a stripe set across  over 3 x P30 Azure premium storage v1 disks, it should give you three times the IOPS and three times the storage throughput of a single Azure premium Storage v1 P30 disk.

> [!IMPORTANT]
> In case you're using LVM or mdadm as volume manager to create stripe sets across multiple Azure premium disks, the three SAP HANA FileSystems /data, /log and /shared must not be put in a default or root volume group. It's highly recommended to follow the Linux Vendors guidance which is typically to create individual Volume Groups for /data, /log and /shared.

## Considerations for the HANA shared file system

When sizing the HANA file systems, most attention is given to the data and log file HANA systems. However, **/hana/shared** also plays an important role in operating a stable HANA system, as it hosts essential components like the HANA binaries.  
If undersized, **/hana/shared** could become I/O saturated due to excessive read/write operations - for instance while writing a large dump, or during intensive tracing, or if backup is written to the **/hana/shared** file system. Latency could also increase.  

If the HANA system is in an HA configuration, slow responses from the shared file system, i.e. **/hana/shared** could cause cluster resources timeouts. These timeouts may lead to unnecessary failovers, because the HANA resource agents might incorrectly assume that the database is not available.    

The SAP guidelines for **/hana/shared** recommended  sizes would look like:

| Volume | Recommended Size | 
| --- | --- |
| /hana/shared scale-up | Min(1 TB, 1 x RAM) |
| /hana/shared scale-out | 1 x RAM of worker node<br /> per four worker nodes  |

Consult the following SAP notes for more details:  
[3288971 - FAQ: SUSE HAE/RedHat HAA Pacemaker Cluster Resource Manager in SAP HANA System Replication Environments](https://me.sap.com/notes/3288971)  
[1999930 - FAQ: SAP HANA I/O Analysis](https://me.sap.com/notes/1999930)  

As a best practice, size **/hana/shared** to avoid performance bottlenecks. 
Remember that a well-sized **/hana/shared** file system contributes to the stability and reliability of your SAP HANA system, especially in HA scenarios.
 

## Azure Premium Storage v1 configurations for HANA
For detailed HANA storage configuration recommendations using Azure premium storage v1, read the document [SAP HANA Azure virtual machine Premium SSD storage configurations](./hana-vm-premium-ssd-v1.md).  

## Azure Premium SSD v2 configurations for HANA
For detailed HANA storage configuration recommendations using Azure premium ssd v2 storage, read the document [SAP HANA Azure virtual machine Premium SSD v2 storage configurations](./hana-vm-premium-ssd-v2.md).  

## Azure Ultra disk storage configuration for SAP HANA
For detailed HANA storage configuration recommendations using Azure Ultra Disk, read the document [SAP HANA Azure virtual machine Ultra Disk storage configurations](./hana-vm-ultra-disk.md).  

## NFS v4.1 volumes on Azure NetApp Files
For detail on ANF for HANA, read the document [NFS v4.1 volumes on Azure NetApp Files for SAP HANA](./hana-vm-operations-netapp.md).  

## Next steps
For more information, see:

- [SAP HANA Azure virtual machine Premium SSD storage configurations](./hana-vm-premium-ssd-v1.md).
- [SAP HANA Azure virtual machine Ultra Disk storage configurations](./hana-vm-ultra-disk.md).
- [NFS v4.1 volumes on Azure NetApp Files for SAP HANA](./hana-vm-operations-netapp.md).
- [SAP HANA High Availability guide for Azure virtual machines](./sap-hana-availability-overview.md).
