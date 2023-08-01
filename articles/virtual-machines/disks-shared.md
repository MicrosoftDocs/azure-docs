---
title: Share an Azure managed disk across VMs
description: Learn about sharing Azure managed disks across multiple Linux VMs.
author: roygara
ms.service: azure-disk-storage
ms.topic: conceptual
ms.date: 07/12/2023
ms.author: rogarana
---

# Share an Azure managed disk

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

Azure shared disks is a feature for Azure managed disks that allow you to attach a managed disk to multiple virtual machines (VMs) simultaneously. Attaching a managed disk to multiple VMs allows you to either deploy new or migrate existing clustered applications to Azure.

Shared disks require a cluster manager, like Windows Server Failover Cluster (WSFC), or Pacemaker, that handles cluster node communication and write locking. Shared managed disks don't natively offer a fully managed file system that can be accessed using SMB/NFS.

## How it works

VMs in the cluster can read or write to their attached disk based on the reservation chosen by the clustered application using [SCSI Persistent Reservations](https://www.t10.org/members/w_spc3.htm) (SCSI PR). SCSI PR is an industry standard used by applications running on Storage Area Network (SAN) on-premises. Enabling SCSI PR on a managed disk allows you to migrate these applications to Azure as-is.

Shared managed disks offer shared block storage that can be accessed from multiple VMs, these are exposed as logical unit numbers (LUNs). LUNs are then presented to an initiator (VM) from a target (disk). These LUNs look like direct-attached-storage (DAS) or a local drive to the VM.

## Limitations

[!INCLUDE [virtual-machines-disks-shared-limitations](../../includes/virtual-machines-disks-shared-limitations.md)]

### Operating system requirements

Shared disks support several operating systems. See the [Windows](#windows) or [Linux](#linux) sections for the supported operating systems.

## Billing implications

When you share a disk, your billing could be impacted in two different ways, depending on the type of disk.

For shared premium SSD disks, in addition to cost of the disk's tier, there's an extra charge that increases with each VM the SSD is mounted to. See [managed disks pricing](https://azure.microsoft.com/pricing/details/managed-disks/) for details.

Ultra disks don't have an extra charge for each VM that they're mounted to. They're billed on the total IOPS and MB/s that the disk is configured for. Normally, an ultra disk has two performance throttles that determine its total IOPS/MB/s. However, when configured as a shared ultra disk, two more performance throttles are exposed, for a total of four. These two additional throttles allow for increased performance at an extra expense and each meter has a default value, which raises the performance and cost of the disk.

The four performance throttles a shared ultra disk has are diskIOPSReadWrite, diskMB/sReadWrite, diskIOPSReadOnly, and diskMB/sReadOnly. Each performance throttle can be configured to change the performance of your disk. The performance for shared ultra disk is calculated in the following ways: total provisioned IOPS (diskIOPSReadWrite + diskIOPSReadOnly) and for total provisioned throughput MB/s (diskMB/sReadWrite + diskMB/sReadOnly).

Once you've determined your total provisioned IOPS and total provisioned throughput, you can use them in the [pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=managed-disks) to determine the cost of an ultra shared disk.

## Disk sizes

[!INCLUDE [virtual-machines-disks-shared-sizes](../../includes/virtual-machines-disks-shared-sizes.md)]

## Sample workloads

### Windows

Azure shared disks are supported on Windows Server 2008 and newer. Most Windows-based clustering builds on WSFC, which handles all core infrastructure for cluster node communication, allowing your applications to take advantage of parallel access patterns. WSFC enables both CSV and non-CSV-based options depending on your version of Windows Server. For details, refer to [Create a failover cluster](/windows-server/failover-clustering/create-failover-cluster).

Some popular applications running on WSFC include:

- [Create an FCI with Azure shared disks (SQL Server on Azure VMs)](/azure/azure-sql/virtual-machines/windows/failover-cluster-instance-azure-shared-disks-manually-configure)
    - [Migrate your failover cluster instance to SQL Server on Azure VMs with shared disks](/azure/azure-sql/migration-guides/virtual-machines/sql-server-failover-cluster-instance-to-sql-on-azure-vm)
- Scale-out File Server (SoFS) [template](https://aka.ms/azure-shared-disk-sofs-template)
- SAP ASCS/SCS [template](https://aka.ms/azure-shared-disk-sapacs-template)
- File Server for General Use (IW workload)
- Remote Desktop Server User Profile Disk (RDS UPD)

### Linux

Azure shared disks are supported on:
- [SUSE SLE HA 15 SP1 and above](https://www.suse.com/c/azure-shared-disks-excercise-w-sles-for-sap-or-sle-ha/)
- [Ubuntu 18.04 and above](https://discourse.ubuntu.com/t/ubuntu-high-availability-corosync-pacemaker-shared-disk-environments/14874)
- Red Hat Enterprise Linux (RHEL) ([support policy](https://access.redhat.com/articles/3444601))
    - [RHEL 7.9](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/deploying_red_hat_enterprise_linux_7_on_public_cloud_platforms/configuring-rhel-high-availability-on-azure_cloud-content)
    - [RHEL 8.3 and above](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/deploying_red_hat_enterprise_linux_8_on_public_cloud_platforms/configuring-rhel-high-availability-on-azure_cloud-content)
- [Oracle Enterprise Linux](https://docs.oracle.com/en/operating-systems/oracle-linux/8/availability/)

Linux clusters can use cluster managers such as [Pacemaker](https://wiki.clusterlabs.org/wiki/Pacemaker). Pacemaker builds on [Corosync](http://corosync.github.io/corosync/), enabling cluster communications for applications deployed in highly available environments. Some common clustered filesystems include [ocfs2](https://oss.oracle.com/projects/ocfs2/) and [gfs2](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/global_file_system_2/ch-overview-gfs2). You can use SCSI Persistent Reservation (SCSI PR) and/or STONITH Block Device (SBD) based clustering models for arbitrating access to the disk. When using SCSI PR, you can manipulate reservations and registrations using utilities such as [fence_scsi](https://manpages.ubuntu.com/manpages/kinetic/man8/fence_scsi.8.html) and [sg_persist](https://linux.die.net/man/8/sg_persist).

## Persistent reservation flow

The following diagram illustrates a sample 2-node clustered database application that uses SCSI PR to enable failover from one node to the other.

![Two node cluster consisting of Azure VM1, VM2, and a disk shared between them. An application running on the cluster handles access to the disk.](media/virtual-machines-disks-shared-disks/shared-disk-updated-two-node-cluster-diagram.png)

The flow is as follows:

1. The clustered application running on both Azure VM1 and VM2 registers its intent to read or write to the disk.
1. The application instance on VM1 then takes exclusive reservation to write to the disk.
1. This reservation is enforced on your Azure disk and the database can now exclusively write to the disk. Any writes from the application instance on VM2 won't succeed.
1. If the application instance on VM1 goes down, the instance on VM2 can now initiate a database failover and take-over of the disk.
1. This reservation is now enforced on the Azure disk and the disk will no longer accept writes from VM1. It will only accept writes from VM2.
1. The clustered application can complete the database failover and serve requests from VM2.

The following diagram illustrates another common clustered workload consisting of multiple nodes reading data from the disk for running parallel processes, such as training of machine learning models.

![Four node VM cluster, each node registers intent to write, application takes exclusive reservation to properly handle write results](media/virtual-machines-disks-shared-disks/shared-disk-updated-machine-learning-trainer-model.png)

The flow is as follows:

1. The clustered application running on all VMs registers the intent to read or write to the disk.
1. The application instance on VM1 takes an exclusive reservation to write to the disk while opening up reads to the disk from other VMs.
1. This reservation is enforced on your Azure disk.
1. All nodes in the cluster can now read from the disk. Only one node writes back results to the disk, on behalf of all nodes in the cluster.

### Ultra Disk and Premium SSD v2 reservation flow

Both Ultra disks and Premium SSD v2 managed disks offer two extra throttles, giving each of them a total of four throttles. Due to this, the reservation flow can work as described in the earlier section, or it can throttle and distribute performance more granularly.

:::image type="content" source="media/virtual-machines-disks-shared-disks/ultra-reservation-table.png" alt-text="An image of a table that depicts the `ReadOnly` or `Read/Write` access for Reservation Holder, Registered, and Others.":::

## Performance throttles

### Premium SSD performance throttles

With premium SSD, the disk IOPS and throughput is fixed, for example, IOPS of a P30 is 5000. This value remains whether the disk is shared across 2 VMs or 5 VMs. The disk limits can be reached from a single VM or divided across two or more VMs. 

### Ultra Disk and Premium SSD v2 performance throttles

Both Ultra Disks and Premium SSD v2 managed disks have the unique capability of allowing you to set your performance by exposing modifiable attributes and allowing you to modify them. By default, there are only two modifiable attributes but, shared Ultra Disks and shared Premium SSD v2 managed disks have two more attributes. Ultra Disks and Premium SSD v2 split these attributes across each attached VM. For some examples on how this distribution of capacity, IOPS, and throughput works, see the [Examples](#examples) section.


|Attribute  |Description  |
|---------|---------|
|DiskIOPSReadWrite (Read/write disk IOPS)     |The total number of IOPS allowed across all VMs mounting the shared disk with write access.         |
|DiskMB/sReadWrite (Read/write disk throughput)    |The total throughput (MB/s) allowed across all VMs mounting the shared disk with write access.         |
|DiskIOPSReadOnly* (Read-only disk IOPS)    |The total number of IOPS allowed across all VMs mounting the shared disk as `ReadOnly`.         |
|DiskMB/sReadOnly* (Read-only disk throughput)    |The total throughput (MB/s) allowed across all VMs mounting the shared disk as `ReadOnly`.         |

\* Applies to shared Ultra Disks and shared Premium SSD v2 managed disks only

The following formulas explain how the performance attributes can be set, since they're user modifiable:

- DiskIOPSReadWrite (Read/write disk IOPS):
    - Has a baseline minimum IOPS of 100, for disks 100 GiB and smaller.
        - For disks larger than 100 GiB, the baseline minimum IOPS you can set increases by 1 per GiB. So the lowest you can set DiskIOPSReadWrite for a 101 GiB disk is 101 IOPS.
    - The maximum you can set this attribute is determined by the size of your disk, the formula is 300 * GiB, up to a maximum of 160,000.
- DiskMB/sReadWrite (Read/write disk throughput)
    - The minimum throughput (MB/s) of this attribute is determined by your IOPS, the formula is 4 KiB per second per IOPS. So if you had 101 IOPS, the minimum MB/s you can set is 1.
    - The maximum you can set this attribute is determined by the amount of IOPS you set, the formula is 256 KiB per second per IOPS, up to a maximum of 4,000 MB/s.
- DiskIOPSReadOnly (Read-only disk IOPS)
    - The minimum baseline IOPS for this attribute is 100. For DiskIOPSReadOnly, the baseline doesn't increase with disk size.
    - The maximum you can set this attribute is determined by the size of your disk, the formula is 300 * GiB, up to a maximum of 160,000.
- DiskMB/sReadOnly (Read-only disk throughput)
    - The minimum throughput (MB/s) for this attribute is 1. For DiskMB/sReadOnly, the baseline doesn't increase with IOPS.
    - The maximum you can set this attribute is determined by the amount of IOPS you set, the formula is 256 KiB per second per IOPS, up to a maximum of 4,000 MB/s.

#### Examples

The following examples depict a few scenarios that show how the throttling can work with shared ultra disks, specifically.

##### Two nodes cluster using cluster shared volumes

The following is an example of a 2-node WSFC using clustered shared volumes. With this configuration, both VMs have simultaneous write-access to the disk, which results in the `ReadWrite` throttle being split across the two VMs and the `ReadOnly` throttle not being used.

:::image type="content" source="media/virtual-machines-disks-shared-disks/ultra-two-node-example.png" alt-text="CSV two node ultra example":::

##### Two node cluster without cluster share volumes

The following is an example of a 2-node WSFC that isn't using clustered shared volumes. With this configuration, only one VM has write-access to the disk. This results in the `ReadWrite` throttle being used exclusively for the primary VM and the `ReadOnly` throttle only being used by the secondary.

:::image type="content" source="media/virtual-machines-disks-shared-disks/ultra-two-node-no-csv.png" alt-text="CSV two nodes no csv ultra disk example":::

##### Four node Linux cluster

The following is an example of a 4-node Linux cluster with a single writer and three scale-out readers. With this configuration, only one VM has write-access to the disk. This results in the `ReadWrite` throttle being used exclusively for the primary VM and the `ReadOnly` throttle being split by the secondary VMs.

:::image type="content" source="media/virtual-machines-disks-shared-disks/ultra-four-node-example.png" alt-text="Four node ultra throttling example":::

##### Shared Ultra Disk and Premium SSD v2 pricing

Both shared Ultra Disks and shared Premium SSD v2 managed disks are priced based on provisioned capacity, total provisioned IOPS (diskIOPSReadWrite + diskIOPSReadOnly) and total provisioned Throughput MB/s (diskMB/sReadWrite + diskMB/sReadOnly). There's no extra charge for each additional VM mount. For example, a shared Ultra Disk with the following configuration (diskSizeGB: 1024, DiskIOPSReadWrite: 10000, DiskMB/sReadWrite: 600, DiskIOPSReadOnly: 100, DiskMB/sReadOnly: 1) is charged with 1024 GiB, 10100 IOPS, and 601 MB/s regardless of whether it is mounted to two VMs or five VMs.

## Next steps

If you're interested in enabling and using shared disks for your managed disks, proceed to our article [Enable shared disk](disks-shared-enable.md)

If you've additional questions, see the [shared disks](faq-for-disks.yml#azure-shared-disks) section of the FAQ.