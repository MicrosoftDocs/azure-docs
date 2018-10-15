---
title: "include file"
description: "include file"
services: storage
author: ramankumarlive
ms.service: storage
ms.topic: "include"
ms.date: 09/24/2018
ms.author: ramankum
ms.custom: "include file"
---

# High-performance Premium Storage and managed disks for VMs

Azure Premium Storage delivers high-performance, low-latency disk support for virtual machines (VMs) with input/output (I/O)-intensive workloads. VM disks that use Premium Storage store data on solid-state drives (SSDs). To take advantage of the speed and performance of premium storage disks, you can migrate existing VM disks to Premium Storage.

In Azure, you can attach several premium storage disks to a VM. Using multiple disks gives your applications up to 256 TB of storage per VM, if you use the preview sizes your application can have up to around 2 PiB of storage per VM. With Premium Storage, your applications can achieve 80,000 I/O operations per second (IOPS) per VM, and a disk throughput of up to 2,000 megabytes per second (MB/s) per VM. Read operations give you very low latencies.

With Premium Storage, Azure offers the ability to truly lift-and-shift demanding enterprise applications like Dynamics AX, Dynamics CRM, Exchange Server, SAP Business Suite, and SharePoint farms to the cloud. You can run performance-intensive database workloads in applications like SQL Server, Oracle, MongoDB, MySQL, and Redis, which require consistent high performance and low latency.

> [!NOTE]
> For the best performance for your application, we recommend that you migrate any VM disk that requires high IOPS to Premium Storage. If your disk does not require high IOPS, you can help limit costs by keeping it in standard Azure Storage. In standard storage, VM disk data is stored on hard disk drives (HDDs) instead of on SSDs.

Azure offers two ways to create premium storage disks for VMs:

* **Unmanaged disks**

    The original method is to use unmanaged disks. In an unmanaged disk, you manage the storage accounts that you use to store the virtual hard disk (VHD) files that correspond to your VM disks. VHD files are stored as page blobs in Azure storage accounts. 

* **Managed disks**

    When you choose [Azure Managed Disks](../articles/virtual-machines/windows/managed-disks-overview.md), Azure manages the storage accounts that you use for your VM disks. You specify the disk type (Premium or Standard) and the size of the disk that you need. Azure creates and manages the disk for you. You don't have to worry about placing the disks in multiple storage accounts to ensure that you stay within scalability limits for your storage accounts. Azure handles that for you.

We recommend that you choose managed disks, to take advantage of their many features.

To get started with Premium Storage, [create your free Azure account](https://azure.microsoft.com/pricing/free-trial/). 

For information about migrating your existing VMs to Premium Storage, see [Convert a Windows VM from unmanaged disks to managed disks](../articles/virtual-machines/windows/convert-unmanaged-to-managed-disks.md) or [Convert a Linux VM from unmanaged disks to managed disks](../articles/virtual-machines/linux/convert-unmanaged-to-managed-disks.md).

> [!NOTE]
> Premium Storage is available in most regions. For the list of available regions, see the row for **Disk Storage** in [Azure products available by region](https://azure.microsoft.com/regions/#services).

## Features

Here are some of the features of Premium Storage:

* **Premium storage disks**

    Premium Storage supports VM disks that can be attached to specific size-series VMs. Premium Storage supports a wide variety of Azure VMs. You have a choice of eight GA disk sizes:  P4 (32 GiB), P6 (64 GiB), P10 (128 GiB), P15 (256 GiB), P20 (512 GiB), P30 (1,024 GiB), P40 (2,048 GiB), P50 (4,095 GiB). As well as three preview disk sizes: P60 8,192 GiB (8 TiB), P70 16,348 GiB (16 TiB), P80 32,767 GiB (32 TiB). P4, P6, P15, P60, P70, and P80 disk sizes are currently only supported for Managed Disks. Each disk size has its own performance specifications. Depending on your application requirements, you can attach one or more disks to your VM. We describe the specifications in more detail in [Premium Storage scalability and performance targets](#scalability-and-performance-targets).

* **Premium page blobs**

    Premium Storage supports page blobs. Use page blobs to store persistent, unmanaged disks for VMs in Premium Storage. Unlike standard Azure Storage, Premium Storage does not support block blobs, append blobs, files, tables, or queues. Premium page blobs support six sizes from P10 to P50, and P60 (8191GiB). P60 Premium page blob is not supported to be attached as VM disks. 

    Any object placed in a premium storage account will be a page blob. The page blob snaps to one of the supported provisioned sizes. This is why a premium storage account is not intended to be used to store tiny blobs.

* **Premium storage account**

    To start using Premium Storage, create a premium storage account for unmanaged disks. In the [Azure portal](https://portal.azure.com), to create a premium storage account, choose the **Premium** performance tier. Select the **Locally-redundant storage (LRS)** replication option. You also can create a premium storage account by setting the performance tier to **Premium_LRS**. To change the performance tier, use one of the following approaches:
     
    - [PowerShell for Azure Storage](../articles/storage/common/storage-powershell-guide-full.md#manage-the-storage-account)
    - [Azure CLI for Azure Storage](../articles/storage/common/storage-azure-cli.md#manage-storage-accounts)
    - [Azure Storage Resource Provider REST API](https://docs.microsoft.com/rest/api/storagerp) (for Azure Resource Manager deployments) or one of the Azure Storage resource provider client libraries

    To learn about premium storage account limits, see [Premium Storage scalability and performance targets](#premium-storage-scalability-and-performance-targets).

* **Premium locally redundant storage**

    A premium storage account supports only locally redundant storage as the replication option. Locally redundant storage keeps three copies of the data within a single region. For regional disaster recovery, you must back up your VM disks in a different region by using [Azure Backup](../articles/backup/backup-introduction-to-azure-backup.md). You also must use a geo-redundant storage (GRS) account as the backup vault. 

    Azure uses your storage account as a container for your unmanaged disks. When you create an Azure VM that supports Premium Storage with unmanaged disks, and you select a premium storage account, your operating system and data disks are stored in that storage account.

## Supported VMs

Premium Storage is supported on a wide variety of Azure VMs. You can use standard and premium storage disks with these VM types. You cannot use premium storage disks with VM series that are not Premium Storage-compatible.


For information about VM types and sizes in Azure for Windows, see [Windows VM sizes](../articles/virtual-machines/windows/sizes.md). For information about VM types and sizes in Azure for Linux, see [Linux VM sizes](../articles/virtual-machines/linux/sizes.md).

These are some of the features supported on premium storage enabled VMs:

* **Availability Set**

    Using the example of a DS-series VMs, you can add a DS-series VM to a cloud service that has only DS-series VMs. Do not add DS-series VMs to an existing cloud service that has any type other than DS-series VMs. You can migrate your existing VHDs to a new cloud service that runs only DS-series VMs. If you want to use the same virtual IP address for the new cloud service that hosts your DS-series VMs, use [reserved IP addresses](../articles/virtual-network/virtual-networks-instance-level-public-ip.md).

* **Operating system disk**

    You can set up your Premium Storage VM to use either a premium or a standard operating system disk. For the best experience, we recommend using a Premium Storage-based operating system disk.

* **Data disks**

    You can use premium and standard disks in the same Premium Storage VM. With Premium Storage, you can provision a VM and attach several persistent data disks to the VM. If needed, to increase the capacity and performance of the volume, you can stripe across your disks.

    > [!NOTE]
    > If you stripe premium storage data disks by using [Storage Spaces](http://technet.microsoft.com/library/hh831739.aspx), set up Storage Spaces with 1 column for each disk that you use. Otherwise, overall performance of the striped volume might be lower than expected because of uneven distribution of traffic across the disks. By default, in Server Manager, you can set up columns for up to 8 disks. If you have more than 8 disks, use PowerShell to create the volume. Specify the number of columns manually. Otherwise, the Server Manager UI continues to use 8 columns, even if you have more disks. For example, if you have 32 disks in a single stripe set, specify 32 columns. To specify the number of columns the virtual disk uses, in the [New-VirtualDisk](http://technet.microsoft.com/library/hh848643.aspx) PowerShell cmdlet, use the *NumberOfColumns* parameter. For more information, see [Storage Spaces Overview](http://technet.microsoft.com/library/hh831739.aspx) and [Storage Spaces FAQs](http://social.technet.microsoft.com/wiki/contents/articles/11382.storage-spaces-frequently-asked-questions-faq.aspx).
    >
    > 

* **Cache**

    Virtual Machines (VMs) that support Premium Storage have a unique caching capability for higher levels of throughput and reduced latency. Their caching capability exceeds underlying premium storage disk performance. Not all VMs support caching however, so please review the VM specifications for the VM sizes you are interested for more information.  VMs that do support caching will indicate this in their spec with a "Max cached and temp storage throughput" measurement.  They are also specified directly under the VM title.
    
    With caching, you can set the disk caching policy on premium storage disks to **ReadOnly**, **ReadWrite**, or **None**. The default disk caching policy is **ReadOnly** for all premium data disks, and **ReadWrite** for operating system disks. For optimal performance for your application please remember to use the correct cache setting. 
    
    As an example, for read-heavy or read-only data disks, such as SQL Server data files, set the disk caching policy to **ReadOnly**. For write-heavy or write-only data disks, such as SQL Server log files, set the disk caching policy to **None**. 
    
    To learn more about optimizing your design with Premium Storage, see [Design for performance with Premium Storage](../articles/virtual-machines/windows/premium-storage-performance.md).

* **Analytics**

    To analyze VM performance by using disks in Premium Storage, turn on VM diagnostics in the [Azure portal](https://portal.azure.com). For more information, see [Azure VM monitoring with Azure Diagnostics Extension](https://azure.microsoft.com/blog/2014/09/02/windows-azure-virtual-machine-monitoring-with-wad-extension/). 

    To see disk performance, use operating system-based tools like [Windows Performance Monitor](https://technet.microsoft.com/library/cc749249.aspx) for Windows VMs and the [iostat](http://linux.die.net/man/1/iostat) command for Linux VMs.

* **VM scale limits and performance**

    Each Premium Storage-supported VM size has scale limits and performance specifications for IOPS, bandwidth, and the number of disks that can be attached per VM. When you use premium storage disks with VMs, make sure that there is sufficient IOPS and bandwidth on your VM to drive disk traffic.

    For example, a STANDARD_DS1 VM has a dedicated bandwidth of 32 MB/s for premium storage disk traffic. A P10 premium storage disk can provide a bandwidth of 100 MB/s. If a P10 premium storage disk is attached to this VM, it can only go up to 32 MB/s. It cannot use the maximum 100 MB/s that the P10 disk can provide.

    Currently, the largest VM in the DS-series is the Standard_DS15_v2. The Standard_DS15_v2 can provide up to 960 MB/s across all disks. The largest VM in the GS-series is the Standard_GS5. The Standard_GS5 can provide up to 2,000 MB/s across all disks.

    These limits are for disk traffic only. These limits don't include cache hits and network traffic. A separate bandwidth is available for VM network traffic. Bandwidth for network traffic is different from the dedicated bandwidth used by premium storage disks.

    For the most up-to-date information about maximum IOPS and throughput (bandwidth) for Premium Storage-supported VMs, see [Windows VM sizes](../articles/virtual-machines/windows/sizes.md) or [Linux VM sizes](../articles/virtual-machines/linux/sizes.md).

    For more information about premium storage disks and their IOPS and throughput limits, see the table in the next section.

## Scalability and performance targets
In this section, we describe the scalability and performance targets to consider when you use Premium Storage.

Premium storage accounts have the following scalability targets:

| Total account capacity | Total bandwidth for a locally redundant storage account |
| --- | --- | 
| Disk capacity: 35 TB <br>Snapshot capacity: 10 TB | Up to 50 gigabits per second for inbound<sup>1</sup> + outbound<sup>2</sup> |

<sup>1</sup> All data (requests) that are sent to a storage account

<sup>2</sup> All data (responses) that are received from a storage account

For more information, see [Azure Storage scalability and performance targets](../articles/storage/common/storage-scalability-targets.md).

If you are using premium storage accounts for unmanaged disks and your application exceeds the scalability targets of a single storage account, you might want to migrate to managed disks. If you don't want to migrate to managed disks, build your application to use multiple storage accounts. Then, partition your data across those storage accounts. For example, if you want to attach 51-TB disks across multiple VMs, spread them across two storage accounts. 35 TB is the limit for a single premium storage account. Make sure that a single premium storage account never has more than 35 TB of provisioned disks.

### Premium Storage disk limits
When you provision a premium storage disk, the size of the disk determines the maximum IOPS and throughput (bandwidth). Azure offers eight GA types of premium storage disks: P4 (Managed Disks only), P6 (Managed Disks only), P10, P15 (Managed Disks only), P20, P30, P40, and P50. As well as three preview disk sizes: P60, P70, and P80. Each premium storage disk type has specific limits for IOPS and throughput. Limits for the disk types are described in the following table:

| Premium Disks Type  | P4    | P6    | P10   | P15   | P20   | P30   | P40   | P50   | P60   | P70   | P80   |
|---------------------|-------|-------|-------|-------|-------|-------|-------|-------||-------||-------||-------|
| Disk size           | 32 GiB| 64 GiB| 128 GiB| 256 GiB| 512 GiB            | 1024 GiB (1 TiB)    | 2048 GiB (2 TiB)    | 4095 GiB (4 TiB)    | 8192 GiB (8 TiB)    | 16,384 GiB (16 TiB)    | 32,767 GiB (32 TiB)    |
| IOPS per disk       | 120   | 240   | 500   | 1100   | 2300              | 5000              | 7500              | 7500              | 12,500              | 15,000              | 20,000              |
| Throughput per disk | 25 MB per second  | 50 MB per second  | 100 MB per second | 125 MB per second | 150 MB per second | 200 MB per second | 250 MB per second | 250 MB per second | 480 MB per second | 750 MB per second | 750 MB per second |

> [!NOTE]
> Make sure sufficient bandwidth is available on your VM to drive disk traffic, as described in [Premium Storage-supported VMs](#premium-storage-supported-vms). Otherwise, your disk throughput and IOPS is constrained to lower values. Maximum throughput and IOPS are based on the VM limits, not on the disk limits described in the preceding table.  
> Azure has designed Premium Storage platform to be massively parallel. Designing your application to be multi-threaded will help to achieve the high performance target offered on the larger disk sizes.

Here are some important things to know about Premium Storage scalability and performance targets:

* **Provisioned capacity and performance**

    When you provision a premium storage disk, unlike standard storage, you are guaranteed the capacity, IOPS, and throughput of that disk. For example, if you create a P50 disk, Azure provisions 4,095-GB storage capacity, 7,500 IOPS, and 250-MB/s throughput for that disk. Your application can use all or part of the capacity and performance.

* **Disk size**

    Azure maps the disk size (rounded up) to the nearest premium storage disk option, as specified in the table in the preceding section. For example, a disk size of 100 GB is classified as a P10 option. It can perform up to 500 IOPS, with up to 100-MB/s throughput. Similarly, a disk of size 400 GB is classified as a P20. It can perform up to 2,300 IOPS, with 150-MB/s throughput.

    > [!NOTE]
    > You can easily increase the size of existing disks. For example, you might want to increase the size of a 30-GB disk to 128 GB, or even to 1 TB. Or, you might want to convert your P20 disk to a P30 disk because you need more capacity or more IOPS and throughput. 

* **I/O size**

    The size of an I/O is 256 KB. If the data being transferred is less than 256 KB, it is considered 1 I/O unit. Larger I/O sizes are counted as multiple I/Os of size 256 KB. For example, 1,100 KB I/O is counted as 5 I/O units.

* **Throughput**

    The throughput limit includes writes to the disk, and it includes disk read operations that aren't served from the cache. For example, a P10 disk has 100-MB/s throughput per disk. Some examples of valid throughput for a P10 disk are shown in the following table:

    | Max throughput per P10 disk | Non-cache reads from disk | Non-cache writes to disk |
    | --- | --- | --- |
    | 100 MB/s | 100 MB/s | 0 |
    | 100 MB/s | 0 | 100 MB/s |
    | 100 MB/s | 60 MB/s | 40 MB/s |

* **Cache hits**

    Cache hits are not limited by the allocated IOPS or throughput of the disk. For example, when you use a data disk with a **ReadOnly** cache setting on a VM that is supported by Premium Storage, 
    reads that are served from the cache are not subject to the IOPS and throughput caps of the disk. If the workload of a disk is predominantly reads, you might get very high throughput. The cache is subject to separate IOPS and throughput limits at the VM level, based on the VM size. DS-series VMs have roughly 4,000 IOPS and 33-MB/s throughput per core for cache and local SSD I/Os. GS-series VMs have a limit of 5,000 IOPS and 50-MB/s throughput per core for cache and local SSD I/Os.

## Throttling

Throttling might occur, if your application IOPS or throughput exceeds the allocated limits for a premium storage disk. Throttling also might occur if your total disk traffic across all disks on the VM exceeds the disk bandwidth limit available for the VM. To avoid throttling, we recommend that you limit the number of pending I/O requests for the disk. Use a limit based on scalability and performance targets for the disk you have provisioned, and on the disk bandwidth available to the VM.  

Your application can achieve the lowest latency when it is designed to avoid throttling. However, if the number of pending I/O requests for the disk is too small, your application cannot take advantage of the maximum IOPS and throughput levels that are available to the disk.

The following examples demonstrate how to calculate throttling levels. All calculations are based on an I/O unit size of 256 KB.

### Example 1

Your application has processed 495 I/O units of 16-KB size in one second on a P10 disk. The I/O units are counted as 495 IOPS. If you try a 2-MB I/O in the same second, the total of I/O units is equal to 495 + 8 IOPS. This is because 2 MB I/O = 2,048 KB / 256 KB = 8 I/O units, when the I/O unit size is 256 KB. Because the sum of 495 + 8 exceeds the 500 IOPS limit for the disk, throttling occurs.

### Example 2

Your application has processed 400 I/O units of 256-KB size on a P10 disk. The total bandwidth consumed is (400 &#215; 256) / 1,024 KB = 100 MB/s. A P10 disk has a throughput limit of 100 MB/s. If your application tries to perform more I/O operations in that second, it is throttled because it exceeds the allocated limit.

### Example 3

You have a DS4 VM with two P30 disks attached. Each P30 disk is capable of 200-MB/s throughput. However, a DS4 VM has a total disk bandwidth capacity of 256 MB/s. You cannot drive both attached disks to the maximum throughput on this DS4 VM at the same time. To resolve this, you can sustain traffic of 200 MB/s on one disk and 56 MB/s on the other disk. If the sum of your disk traffic goes over 256 MB/s, disk traffic is throttled.

> [!NOTE]
> If your disk traffic mostly consists of small I/O sizes, your application likely will hit the IOPS limit before the throughput limit. However, if the disk traffic mostly consists of large I/O sizes, your application likely will hit the throughput limit first, instead of the IOPS limit. You can maximize your application's IOPS and throughput capacity by using optimal I/O sizes. Also, you can limit the number of pending I/O requests for a disk.

To learn more about designing for high performance by using Premium Storage, see [Design for performance with Premium Storage](../articles/virtual-machines/windows/premium-storage-performance.md).

## Snapshots and Copy Blob

To the Storage service, the VHD file is a page blob. You can take snapshots of page blobs, and copy them to another location, such as to a different storage account.

### Unmanaged disks

Create [incremental snapshots](../articles/virtual-machines/linux/incremental-snapshots.md) for unmanaged premium disks the same way you use snapshots with standard storage. Premium Storage supports only locally redundant storage as the replication option. We recommend that you create snapshots, and then copy the snapshots to a geo-redundant standard storage account. For more information, see [Azure Storage redundancy options](../articles/storage/common/storage-redundancy.md).

If a disk is attached to a VM, some API operations on the disk are not permitted. For example, you cannot perform a [Copy Blob](/rest/api/storageservices/Copy-Blob) operation on that blob if the disk is attached to a VM. Instead, first create a snapshot of that blob by using the [Snapshot Blob](/rest/api/storageservices/Snapshot-Blob) REST API. Then, perform the [Copy Blob](/rest/api/storageservices/Copy-Blob) of the snapshot to copy the attached disk. Alternatively, you can detach the disk, and then perform any necessary operations.

The following limits apply to premium storage blob snapshots:

| Premium storage limit | Value |
| --- | --- |
| Maximum number of snapshots per blob | 100 |
| Storage account capacity for snapshots<br>(Includes data in snapshots only. Does not include data in base blob.) | 10 TB |
| Minimum time between consecutive snapshots | 10 minutes |

To maintain geo-redundant copies of your snapshots, you can copy snapshots from a premium storage account to a geo-redundant standard storage account by using AzCopy or Copy Blob. For more information, see [Transfer data with the AzCopy command-line utility](../articles/storage/common/storage-use-azcopy.md) and [Copy Blob](/rest/api/storageservices/Copy-Blob).

For detailed information about performing REST operations against page blobs in a premium storage account, see [Blob service operations with Azure Premium Storage](http://go.microsoft.com/fwlink/?LinkId=521969).

### Managed disks

A snapshot for a managed disk is a read-only copy of the managed disk. The snapshot is stored as a standard managed disk. Currently, [incremental snapshots](../articles/virtual-machines/windows/incremental-snapshots.md) are not supported for managed disks. To learn how to take a snapshot for a managed disk, see [Create a copy of a VHD stored as an Azure managed disk by using managed snapshots in Windows](../articles/virtual-machines/windows/snapshot-copy-managed-disk.md) or [Create a copy of a VHD stored as an Azure managed disk by using managed snapshots in Linux](../articles/virtual-machines/linux/snapshot-copy-managed-disk.md).

If a managed disk is attached to a VM, some API operations on the disk are not permitted. For example, you cannot generate a shared access signature (SAS) to perform a copy operation while the disk is attached to a VM. Instead, first create a snapshot of the disk, and then perform the copy of the snapshot. Alternately, you can detach the disk and then generate an SAS to perform the copy operation.


## Premium Storage for Linux VMs
You can use the following information to help you set up your Linux VMs in Premium Storage:

To achieve scalability targets in Premium Storage, for all premium storage disks with cache set to **ReadOnly** or **None**, you must disable "barriers" when you mount the file system. You don't need barriers in this scenario because the writes to premium storage disks are durable for these cache settings. When the write request successfully finishes, data has been written to the persistent store. To disable "barriers," use one of the following methods. Choose the one for your file system:
  
* For **reiserFS**, to disable barriers, use the  `barrier=none` mount option. (To enable barriers, use `barrier=flush`.)
* For **ext3/ext4**, to disable barriers, use the `barrier=0` mount option. (To enable barriers, use `barrier=1`.)
* For **XFS**, to disable barriers, use the `nobarrier` mount option. (To enable barriers, use `barrier`.)
* For premium storage disks with cache set to **ReadWrite**, enable barriers for write durability.
* For volume labels to persist after you restart the VM, you must update /etc/fstab with the universally unique identifier (UUID) references to the disks. For more information, see [Add a managed disk to a Linux VM](../articles/virtual-machines/linux/add-disk.md).

The following Linux distributions have been validated for Azure Premium Storage. For better performance and stability with Premium Storage, we recommend that you upgrade your VMs to one of these versions, at a minimum (or to a later version). Some of the versions require the latest Linux Integration Services (LIS), v4.0, for Azure. To download and install a distribution, follow the link listed in the following table. We add images to the list as we complete validation. Note that our validations show that performance varies for each image. Performance depends on workload characteristics and your image settings. Different images are tuned for different kinds of workloads.

| Distribution | Version | Supported kernel | Details |
| --- | --- | --- | --- |
| Ubuntu | 12.04 | 3.2.0-75.110+ | Ubuntu-12_04_5-LTS-amd64-server-20150119-en-us-30GB |
| Ubuntu | 14.04 | 3.13.0-44.73+ | Ubuntu-14_04_1-LTS-amd64-server-20150123-en-us-30GB |
| Debian | 7.x, 8.x | 3.16.7-ckt4-1+ | &nbsp; |
| SUSE | SLES 12| 3.12.36-38.1+| suse-sles-12-priority-v20150213 <br> suse-sles-12-v20150213 |
| SUSE | SLES 11 SP4 | 3.0.101-0.63.1+ | &nbsp; |
| CoreOS | 584.0.0+| 3.18.4+ | CoreOS 584.0.0 |
| CentOS | 6.5, 6.6, 6.7, 7.0 | &nbsp; | [LIS4 required](http://go.microsoft.com/fwlink/?LinkID=403033&clcid=0x409) <br> *See note in the next section* |
| CentOS | 7.1+ | 3.10.0-229.1.2.el7+ | [LIS4 recommended](http://go.microsoft.com/fwlink/?LinkID=403033&clcid=0x409) <br> *See note in the next section* |
| Red Hat Enterprise Linux (RHEL) | 6.8+, 7.2+ | &nbsp; | &nbsp; |
| Oracle | 6.0+, 7.2+ | &nbsp; | UEK4 or RHCK |
| Oracle | 7.0-7.1 | &nbsp; | UEK4 or RHCK w/[LIS 4.1+](http://go.microsoft.com/fwlink/?LinkID=403033&clcid=0x409) |
| Oracle | 6.4-6.7 | &nbsp; | UEK4 or RHCK w/[LIS 4.1+](http://go.microsoft.com/fwlink/?LinkID=403033&clcid=0x409) |


### LIS drivers for OpenLogic CentOS

If you are running OpenLogic CentOS VMs, run the following command to install the latest drivers:

```
sudo rpm -e hypervkvpd  ## (Might return an error if not installed. That's OK.)
sudo yum install microsoft-hyper-v
```

To activate the new drivers, restart the VM.

## Pricing and billing

When you use Premium Storage, the following billing considerations apply:

* **Premium storage disk and blob size**

    Billing for a premium storage disk or blob depends on the provisioned size of the disk or blob. Azure maps the provisioned size (rounded up) to the nearest premium storage disk option. For details, see the table in [Premium Storage scalability and performance targets](#premium-storage-scalability-and-performance-targets). Each disk maps to a supported provisioned disk size, and is billed accordingly. Billing for any provisioned disk is prorated hourly by using the monthly price for the Premium Storage offer. For example, if you provisioned a P10 disk and deleted it after 20 hours, you are billed for the P10 offering prorated to 20 hours. This is regardless of the amount of actual data written to the disk or the IOPS and throughput used.

* **Premium unmanaged disks snapshots**

    Snapshots on premium unmanaged disks are billed for the additional capacity used by the snapshots. For more information about snapshots, see [Create a snapshot of a blob](/rest/api/storageservices/Snapshot-Blob).

* **Premium managed disks snapshots**

    A snapshot of a managed disk is a read-only copy of the disk. The disk is stored as a standard managed disk. A snapshot costs the same as a standard managed disk. For example, if you take a snapshot of a 128-GB premium managed disk, the cost of the snapshot is equivalent to a 128-GB standard managed disk.  

* **Outbound data transfers**

    [Outbound data transfers](https://azure.microsoft.com/pricing/details/data-transfers/) (data going out of Azure datacenters) incur billing for bandwidth usage.

For detailed information about pricing for Premium Storage, Premium Storage-supported VMs, and managed disks, see these articles:

* [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/)
* [Virtual Machines pricing](https://azure.microsoft.com/pricing/details/virtual-machines/)
* [Managed disks pricing](https://azure.microsoft.com/pricing/details/managed-disks/)

## Azure Backup support

For regional disaster recovery, you must back up your VM disks in a different region by using [Azure Backup](../articles/backup/backup-introduction-to-azure-backup.md) and a GRS storage account as a backup vault.

To create a backup job with time-based backups, easy VM restoration, and backup retention policies, use Azure Backup. You can use Backup both with unmanaged and managed disks. For more information, see [Azure Backup for VMs with unmanaged disks](../articles/backup/backup-azure-vms-first-look-arm.md) and [Azure Backup for VMs with managed disks](../articles/backup/backup-introduction-to-azure-backup.md#using-managed-disk-vms-with-azure-backup). 

## Next steps

For more information about Premium Storage, see the following articles.
