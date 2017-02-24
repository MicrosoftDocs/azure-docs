---
title: High-Performance Premium Storage and Azure VM Disks | Microsoft Docs
description: Discuss high-performance Premium Storage and unmanaged and managed Azure VM disks. Azure DS-series, DSv2-series and GS-series VMs support Premium Storage.
services: storage
documentationcenter: ''
author: ramankumarlive
manager: aungoo-msft
editor: tysonn

ms.assetid: e2a20625-6224-4187-8401-abadc8f1de91
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/06/2017
ms.author: ramankum

---
# High-Performance Premium Storage and unmanaged and managed Azure VM Disks
Microsoft Azure Premium Storage delivers high-performance, low-latency disk support for virtual machines (VMs) running I/O-intensive workloads. VM disks that use Premium Storage store data on solid state drives (SSDs). You can migrate your application's VM disks to Azure Premium Storage to take advantage of the speed and performance of these disks.

An Azure VM supports attaching several premium storage disks, so that your applications can have up to 64 TB of storage per VM. With Premium Storage, your applications can achieve 80,000 input/output operations per second (IOPS) per VM and disk throughput up to 2000 MB/s per VM with extremely low latencies for read operations.

With Premium Storage, Azure offers the ability to truly lift-and-shift your demanding enterprise applications such as Dynamics AX, Dynamics CRM, Exchange Server, SharePoint Farms, and SAP Business Suite to the cloud. You can run a variety of performance intensive database workloads like SQL Server, Oracle, MongoDB, MySQL, and Redis that require consistent high performance and low latency on Premium Storage.

> [!NOTE]
> We recommend migrating any virtual machine disk requiring high IOPS to Premium Storage for the best performance for your application. If your disk does not require high IOPS, you can limit costs by maintaining it in Standard Storage, which stores virtual machine disk data on Hard Disk Drives (HDDs) instead of SSDs.
> 

There are two ways to create Premium disks for Azure VMs:

**Unmanaged disks**: 
This is the original method where you manage the storage accounts used to store the VHD files that correspond to the VM disks. VHD files are stored as page blobs in storage accounts. 

**[Azure Managed Disks](storage-managed-disks-overview.md)**: 
This feature manages the storage accounts used for the VM disks for you. You specify the type (Premium or Standard) and size of disk you need, and Azure creates and manages the disk for you. You don’t have to worry about placing the disks across multiple storage accounts in order to ensure you stay within the scalability limits for the storage accounts -- Azure handles that for you.

Even though both types of disks are available, we recommend using Managed Disks to take advantage of their many features.

To get started with Azure Premium Storage, visit [Get started for free](https://azure.microsoft.com/pricing/free-trial/). 

For information on migrating your existing VMs to Premium Storage, see [Migrating existing Azure Windows VM to Managed Disks](../virtual-machines/virtual-machines-windows-convert-unmanaged-to-managed-disks.md) or [Migrating an existing Azure Linux VM to Managed Disks](../virtual-machines/virtual-machines-linux-convert-unmanaged-to-managed-disks.md).

> [!NOTE]
> Premium Storage is currently supported in most regions. You can find the list of available regions in [Azure Services by Region](https://azure.microsoft.com/regions/#services) by looking at the regions in which the size-series VMs (DS, DSV2, Fs, and GS) are supported.
> 

## Premium Storage features

Let's take a look at some of the features of Premium Storage.

**Premium storage disks**: Azure Premium Storage supports VM disks that can be attached to specific size-series VMs, including the DS, DSv2, GS, and Fs series. You have a choice of three disk sizes -- P10 (128GiB), P20 (512GiB) and P30 (1024GiB) -- each with its own performance specifications. Depending on your application requirements you can attach one or more of these disks to your VM. In the following section on [Premium Storage Scalability and Performance Targets ](#premium-storage-scalability-and-performance-targets) we will describe the specifications in more detail.

**Premium page blob**: Premium Storage supports page blobs, which are used to store persistent unmanaged disks for VMs. Unlike Standard Storage, Premium Storage does not support block blobs, append blobs, files, tables, or queues.
 Any object placed in a premium storage account will be a page blob, and it will snap to one of the supported provisioned sizes. This is why a premium storage account is not meant for storing tiny blobs.

**Premium storage account**: To start using Premium Storage, create a premium storage account for unmanaged disks. If you prefer to use the [Azure portal](https://portal.azure.com), you can create a premium storage account by specifying the “Premium” performance tier and “Locally-redundant storage (LRS)” as the replication option. You can also create a premium storage account by specifying the type as “Premium_LRS” using the [Storage REST API](/rest/api/storageservices/fileservices/Azure-Storage-Services-REST-API-Reference) version 2014-02-14 or later; the [Service Management REST API](http://msdn.microsoft.com/library/azure/ee460799.aspx) version 2014-10-01 or later (Classic deployments); the [Azure Storage Resource Provider REST API Reference](/rest/api/storagerp)(Resource Manager deployments); and the [Azure PowerShell](../powershell-install-configure.md) version 0.8.10 or later. Learn about premium storage account limits in the following section on [Premium Storage Scalability and Performance Targets](#premium-storage-scalability-and-performance-targets.md).

**Premium Locally Redundant Storage**: A premium storage account only supports Locally Redundant Storage (LRS) as the replication option; this means it keeps three copies of the data within a single region. For considerations regarding geo replication when using Premium Storage, see the [Snapshots and Copy Blob](#snapshots-and-copy-blob) section in this article.

Azure uses the storage account as a container for your unmanaged disks. When you create an Azure DS, DSv2, GS, or Fs VM with unmanaged disks and select a premium storage account, your operating system and data disks are stored in that storage account.

## Premium Storage-supported VMs
Premium Storage supports DS-series, DSv2-series, GS-series, and Fs-series VMs. You can use both standard and premium storage disks with these VMs. You cannot use premium storage disks with VM series which are not Premium Storage-compatible.

For information on available Azure VM types and sizes for Windows VMs, see [Windows VM sizes](../virtual-machines/virtual-machines-windows-sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). For information on VM types and sizes for Linux VMs, see [Linux VM sizes](../virtual-machines/virtual-machines-linux-sizes.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

Following are some of the features of the DS, DSv2, GS, and Fs series VMs:

**Cloud Service**: DS-series VMs can be added to a cloud service that includes only DS-series VMs. Do not add DS-series VMs to an existing cloud service that includes non-DS-series VMs. You can migrate your existing VHDs to a new cloud service running only DS-series VMs. If you want to retain the same virtual IP address (VIP) for the new cloud service that hosts your DS-series VMs, use the [Reserved IP Addresses](../virtual-network/virtual-networks-instance-level-public-ip.md). GS-series VMs can be added to an existing cloud service running only GS-series VMs.

**Operating System Disk**: The VMs that can run on Premium Storage can be configured to use either a Premium or a Standard operating system (OS) disk. We recommend using a Premium Storage-based OS disk for the best experience.

**Data Disks**: You can use both Premium and Standard disks in the same VM running on Premium Storage. With Premium Storage, you can provision a VM and attach several persistent data disks to the VM. If needed, you can stripe across the disks to increase the capacity and performance of the volume.

> [!NOTE]
> If you stripe premium storage data disks using [Storage Spaces](http://technet.microsoft.com/library/hh831739.aspx), you should configure it with one column for each disk that is used. Otherwise, overall performance of the striped volume may be lower than expected due to uneven distribution of traffic across the disks. By default, the Server Manager user interface (UI) allows you to set up columns for up to 8 disks. If you have more than 8 disks, you need to use PowerShell to create the volume and also specify the number of columns manually. Otherwise, the Server Manager UI continues to use 8 columns even though you have more disks. For example, if you have 32 disks in a single stripe set, you should specify 32 columns. You can use the *NumberOfColumns* parameter of the [New-VirtualDisk](http://technet.microsoft.com/library/hh848643.aspx) PowerShell cmdlet to specify the number of columns used by the virtual disk. For more information, see [Storage Spaces Overview](http://technet.microsoft.com/library/hh831739.aspx) and [Storage Spaces Frequently Asked Questions](http://social.technet.microsoft.com/wiki/contents/articles/11382.storage-spaces-frequently-asked-questions-faq.aspx).
> 

**Cache**: VMs of the size series that support Premium Storage have a unique caching capability with which you can get high levels of throughput and latency, which exceeds underlying premium storage disk performance. You can configure the disk caching policy on the premium storage disks as ReadOnly, ReadWrite or None. The default disk caching policy is ReadOnly for all premium data disks and ReadWrite for operating system disks. Use the right configuration setting to achieve optimal performance for your application. For example, for read-heavy or read-only data disks, such as SQL Server data files, set the disk caching policy to “ReadOnly”. For write-heavy or write-only data disks, such as SQL Server log files, set the disk caching policy to “None”. Learn more about optimizing your design with Premium Storage in [Design for Performance with Premium Storage](storage-premium-storage-performance.md).

**Analytics**: To analyze the performance of VMs using disks on Premium Storage, you can enable the VM Diagnostics in the [Azure portal](https://portal.azure.com). You can refer to [Microsoft Azure Virtual Machine Monitoring with Azure Diagnostics Extension](https://azure.microsoft.com/blog/2014/09/02/windows-azure-virtual-machine-monitoring-with-wad-extension/) for details. To see the disk performance, use operating system-based tools, such as [Windows Performance Monitor](https://technet.microsoft.com/library/cc749249.aspx) for Windows VMs and [IOSTAT](http://linux.die.net/man/1/iostat) for Linux VMs.

**VM scale limits and performance**: Each Premium Storage-supported VM size has scale limits and performance specifications for IOPS, bandwidth, and the number of disks that can be attached per VM. When using premium storage disks with VMs, make sure there is sufficient IOPS and Bandwidth available on your VM to drive the disk traffic.
For example, a STANDARD_DS1 VM has dedicated bandwidth of 32 MB/s available for premium storage disk traffic. A P10 premium storage disk can providebandwidth of 100 MB/s. If a P10 premium storage disk is attached to this VM, it can only go up to 32 MB/s but not up to the 100 MB/s that the P10 disk can provide.

Currently, the largest VM on the DS-series is Standard_DS15_v2 and it can provide up to 960 MB/s across all disks. The largest VM on the GS-series is Standard_GS5 and it can give up to 2000 MB/s across all disks.
Note that these limits are for disk traffic alone, and don't include cache-hits and network traffic. There is a separate bandwidth available for VM network traffic, which is different from the dedicated bandwidth for premium storage disks.

For the most up-to-date information on maximum IOPS and throughput (bandwidth) for Premium Storage-supported VMs, see [Windows VM sizes](../virtual-machines/virtual-machines-windows-sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) or [Linux VM sizes](../virtual-machines/virtual-machines-linux-sizes.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

To learn about the premium storage disks and their IOPs and throughput limits, see the table in the [Premium Storage Scalability and Performance Targets](#premium-storage-scalability-and-performance-targets) section in this article.

## Premium Storage scalability and performance targets
In this section, we will describe all the Scalability and Performance targets you must consider when using Premium Storage.

Premium storage accounts have the following scalability targets:

| Total Account Capacity | Total Bandwidth for a Locally Redundant Storage account |
| --- | --- | 
| Disk Capacity: 35 TB <br>Snapshot capacity: 10 TB | Up to 50 gigabits per second for Inbound + Outbound |

* Inbound refers to all data (requests) being sent to a storage account.
* Outbound refers to all data (responses) being received from a storage account.

For more information, see [Azure Storage Scalability and Performance Targets](storage-scalability-targets.md).

If you are using premium storage accounts for unmanaged disks and your application exceeds the scalability targets of a single storage account, consider migrating to Managed Disks. If you don't want to migrate to Managed Disks, build your application to use multiple storage accounts, and partition your data across those storage accounts. For example, if you want to attach 51 terabyte (TB) disks across a number of VMs, spread them across two storage accounts since 35 TB is the limit for a single premium storage account. Make sure that a single premium storage account never has more than 35 TB of provisioned disks.

### Premium storage disk limits
When you provision a premium storage disk, the size of the disk determines the maximum IOPS and throughput (bandwidth). There are three types of premium storage disks: P10, P20, and P30. Each one has specific limits for IOPS and throughput as specified in the following table:

|Premium Storage Disk Type | P10 | P20 | P30 |
| --- | --- | --- | --- |
| Disk Size | 128 GiB | 512 GiB | 1024 GiB (1 TB) |
| IOPS per disk | 500 | 2300 | 5000 |
Throughput per disk | 100 MB/s | 150 MB/s | 200 MB/s |

> [!NOTE]
> Make sure that there is sufficient bandwidth available on your VM to drive the disk traffic as explained in the [Premium Storage-supported VMs](#premium-storage-supported-vms) section earlier in this article. Otherwise, your disk throughput and IOPS will be constrained to lower values based on the VM limits rather than the disk limits mentioned in the previous table.  
> 
> 

Here are some important things you must know regarding Premium Storage scalability and performance targets:

* **Provisioned Capacity and Performance**: When you provision a premium storage disk, unlike standard storage, you are guaranteed the capacity, IOPS and throughput for that disk. For example, if you create a P30 disk, Azure provisions 1024 GB storage capacity, 5000 IOPS and 200 MB/s Throughput for that disk. Your application can use all or part of the capacity and performance.

* **Disk Size**: Azure maps the disk size (rounded up) to the nearest premium storage disk option as specified in the table. For example, a disk of size 100 GiB is classified as a P10 option and can perform up to 500 IOPS, and with up to 100 MB/s throughput. Similarly, a disk of size 400 GiB is classified as a P20 and can perform up to 2300 IOPS and 150 MB/s throughput.
  
> [!NOTE]
> You can easily increase the size of existing disks. For example, you may want to increase the size of a 30 GB disk to 128GB or even 1 TB. Or you may want to convert your P20 disk to a P30 disk because you need more capacity or more IOPS and throughput. 
> 
 
* **IO Size**: The input/output (I/O) unit size is 256 KB. If the data being transferred is less than 256 KB, it is considered a single I/O unit. The larger I/O sizes are counted as multiple I/Os of size 256 KB. For example, 1100 KB I/O is counted as five I/O units.

* **Throughput**: The throughput limit includes writes to the disk as well as reads from that disk that are not served from the cache. For example, a P10 disk has 100 MB/s throughput per disk. Some examples of valid throughput for the P10 disk are,

| Max Throughput per P10 disk | Non-cache Reads from disk | Non-cache Writes to disk |
| --- | --- | --- |
| 100 MB per sec | 100 MB per sec | 0 |
| 100 MB per sec | 0 | 100 MB per sec |
| 100 MB per sec | 60 MB per sec | 40 MB per sec |

* **Cache hits**: Cache-hits are not limited by the allocated IOPS or throughput of the disk. For example, when you use a data disk with a ReadOnly cache setting on a VM supported by Premium Storage, 
Reads that are served from the cache are not subject to IOPS and throughput caps of the disk. Therefore you could get very high throughput from a disk if the workload is predominantly reads. Note that the cache is subject to separate IOPS and throughput limits at the VM level based on the VM size. DS-series VMs have roughly 4000 IOPS and 33 MB/sec per core for cache and local SSD IOs. GS-series VMs have a limit of 5000 IOPS and 50 MB/sec per core for cache and local SSD IOs. 

## Throttling
You may see throttling if your application IOPS or throughput exceed the allocated limits for a premium storage disk or if your total disk traffic across all disks on the VM exceeds the disk bandwidth limit available for the VM. To avoid throttling, we recommend that you limit the number of pending I/O requests for the disk based on the scalability and performance targets for the disk you have provisioned and based on the disk bandwidth available to the VM.  

Your application can achieve the lowest latency when it is designed to avoid throttling. On the other hand, if the number of pending I/O requests for the disk is too small, your application cannot take advantage of the maximum IOPS and throughput levels that are available to the disk.

The following examples demonstrate how to calculate the throttling levels. All calculations are based on I/O unit size of 256 KB:

### Example 1:
Your application has done 495 I/O units of 16 KB size in one second on a P10 disk. These will be counted as 495 I/O Units per second (IOPS). If you try a 2 MB I/O in the same second, the total of I/O units is equal to 495 + 8. This is because 2 MB I/O results in 2048 KB / 256 KB = 8 I/O Units when the I/O unit size is 256 KB. Since the sum of 495 + 8 exceeds the 500 IOPS limit for the disk, throttling occurs.

### Example 2:
Your application has done 400 I/O units of 256 KB size on a P10 disk. The total bandwidth consumed is (400 * 256) / 1024 = 100 MB/sec. A P10 disk has throughput limit of 100 MB per second. If your application tries to perform more I/O in that second, it gets throttled because it exceeds the allocated limit.

### Example 3:
You have a DS4 VM with two P30 disks attached. Each P30 disk is capable of 200 MB per second throughput. However, a DS4 VM has a total disk bandwidth capacity of 256 MB per second. Therefore, you cannot drive the attached disks to the maximum throughput on this DS4 VM at the same time. To resolve this, you can sustain traffic of 200 MB per second on one disk and 56 MB per second on the other disk. If the sum of your disk traffic goes over 256 MB per second, the disk traffic gets throttled.

> [!NOTE]
> If the disk traffic mostly consists of small I/O sizes, it is highly likely that your application will hit the IOPS limit before the throughput limit. On the other hand, if the disk traffic mostly consists of large I/O sizes, it is highly likely that your application will hit the throughput limit instead of the IOPS limit. You can maximize your application IOPS and throughput capacity by using optimal I/O sizes and also by limiting the number of pending I/O requests for disk.
> 

To learn about designing for high performance using Premium Storage read the article, [Design for Performance with Premium Storage](storage-premium-storage-performance.md).

## Snapshots and copy blob

To the Storage service, the VHD file is a page blob. You can take snapshots of page blobs, and copy them to another location, such as a different storage account.

### Unmanaged disks

You can create [incremental Snapshots](storage-incremental-snapshots.md) for unmanaged premium disks in the same way you use snapshots with Standard Storage. Since Premium Storage only supports Locally Redundant Storage (LRS) as the replication option, we recommend that you create snapshots and then copy those snapshots to a geo-redundant standard storage account. For more information, see [Azure Storage Redundancy Options](storage-redundancy.md).

If a disk is attached to a VM, certain API operations are not permitted on the disks. For example, you cannot perform a [Copy Blob](/rest/api/storageservices/fileservices/Copy-Blob) operation on that blob as long as the disk is attached to a VM. Instead, first create a snapshot of that blob by using the [Snapshot Blob](/rest/api/storageservices/fileservices/Snapshot-Blob) REST API method, and then perform the [Copy Blob](/rest/api/storageservices/fileservices/Copy-Blob) of the snapshot to copy the attached disk. Alternatively, you can detach the disk and then perform any necessary operations.

Following limits apply to premium storage blob snapshots:

| Premium Storage Limit | Value |
| --- | --- |
| Max. number of snapshots per blob | 100 |
| Storage account capacity for snapshots (includes data in snapshots only, and does not include data in base blob) | 10 TB |
| Min. time between consecutive snapshots | 10 minutes |

To maintain geo-redundant copies of your snapshots, you can copy snapshots from a premium storage account to a geo-redundant standard storage account by using AzCopy or Copy Blob. For more information, see [Transfer data with the AzCopy Command-Line Utility](storage-use-azcopy.md) and [Copy Blob](/rest/api/storageservices/fileservices/Copy-Blob).

For detailed information on performing REST operations against page blobs in premium storage accounts, see [Using Blob Service Operations with Azure Premium Storage](http://go.microsoft.com/fwlink/?LinkId=521969).

### Managed disks

A snapshot for a managed disk is a read-only copy of the managed disk which is stored as a standard managed disk. [Incremental Snapshots](storage-incremental-snapshots.md) are currently not supported for Managed Disks but will be supported in the future. To learn how to take a snapshot for a managed disk, please refer to [Create a copy of a VHD stored as an Azure Managed Disk by using Managed Snapshots in Windows](../virtual-machines/virtual-machines-windows-snapshot-copy-managed-disk.md) or [Create a copy of a VHD stored as an Azure Managed Disk by using Managed Snapshots in Linux](../virtual-machines/linux/virtual-machines-linux-snapshot-copy-managed-disk.md)

If a managed disk is attached to a VM, certain API operations are not permitted on the disks. For example, you cannot generate a shared access signature (SAS) to perform a copy operation while the disk is attached to a VM. Instead, first create a snapshot of the disk, and then perform the copy of the snapshot. Alternately, you can detach the disk and then generate a shared access signature (SAS) to perform the copy operation.


## Using Linux VMs with Premium Storage
Please refer to the important instructions below for configuring your Linux VMs on Premium Storage:

* For all premium storage disks with the cache setting set to either “ReadOnly” or “None”, you must disable “barriers” while mounting the file system in order to achieve the scalability targets for Premium Storage. You do not need barriers for this scenario because the writes to premium storage disks are durable for these cache settings. When the write request successfully completes, data has been written to the persistent store. Please use the following methods for disabling “barriers”, choosing the one for your file system:
  
* If you use **reiserFS**, disable barriers using the mount option “barrier=none” (For enabling barriers, use “barrier=flush”)
* If you use **ext3/ext4**, disable barriers using the mount option “barrier=0” (For enabling barriers, use “barrier=1”)
* If you use **XFS**, disable barriers using the mount option “nobarrier” (For enabling barriers, use the option “barrier”)
* For premium storage disks with cache setting “ReadWrite”, barriers should be enabled for durability of writes.
* For the volume labels to persist after VM reboot, you must update /etc/fstab with the UUID references to the disks. Also refer to [Add a managed disk to a Linux VM](../virtual-machines/virtual-machines-linux-add-disk.md).

Following are the Linux Distributions that we validated with Premium Storage. We recommend that you upgrade your VMs to at least one of these versions (or later) for better performance and stability with Premium Storage. Also, some of the versions require the latest Linux Integration Services (LIS) v4.0 for Microsoft Azure. Please follow the link provided below for download and installation. We will continue to add more images to the list as we complete additional validations. Please note, our validations showed that performance varies for these images, and it also depends on workload characteristics and settings on the images. Different images are tuned for different kinds of workloads.

| Distribution | Version | Supported Kernel | Details |
| --- | --- | --- | --- |
| Ubuntu | 12.04 | 3.2.0-75.110+ | Ubuntu-12_04_5-LTS-amd64-server-20150119-en-us-30GB |
| Ubuntu | 14.04 | 3.13.0-44.73+ | Ubuntu-14_04_1-LTS-amd64-server-20150123-en-us-30GB |
| Debian | 7.x, 8.x | 3.16.7-ckt4-1+ | &nbsp; |
| SUSE | SLES 12| 3.12.36-38.1+| suse-sles-12-priority-v20150213 <br> suse-sles-12-v20150213 |
| SUSE | SLES 11 SP4 | 3.0.101-0.63.1+ | &nbsp; |
| CoreOS | 584.0.0+| 3.18.4+ | CoreOS 584.0.0 |
| CentOS | 6.5, 6.6, 6.7, 7.0 | &nbsp; | [LIS4 Required](http://go.microsoft.com/fwlink/?LinkID=403033&clcid=0x409) <br> *See note below* |
| CentOS | 7.1+ | 3.10.0-229.1.2.el7+ | [LIS4 Recommended](http://go.microsoft.com/fwlink/?LinkID=403033&clcid=0x409) <br> *See note below* |
| RHEL | 6.8+, 7.2+ | &nbsp; | &nbsp; |
| Oracle | 6.0+, 7.2+ | &nbsp; | UEK4 or RHCK |
| Oracle | 7.0-7.1 | &nbsp; | UEK4 or RHCK w/[LIS 4.1+](http://go.microsoft.com/fwlink/?LinkID=403033&clcid=0x409) |
| Oracle | 6.4-6.7 | &nbsp; | UEK4 or RHCK w/[LIS 4.1+](http://go.microsoft.com/fwlink/?LinkID=403033&clcid=0x409) |


### LIS Drivers for Openlogic CentOS

Customers running OpenLogic CentOS VMs should run the following command to install the latest drivers:

```
sudo rpm -e hypervkvpd  ## (may return error if not installed, that's OK)
sudo yum install microsoft-hyper-v
```

A reboot will then be required to activate the new drivers.

## Pricing and Billing

When using Premium Storage, the following billing considerations apply:

* Premium storage disk / blob size
* Premium storage snapshots
* Outbound data transfers

**Premium storage disk / blob size**: Billing for a premium storage disk/blob depends on the provisioned size of the disk/blob. Azure maps the provisioned size (rounded up) to the nearest premium storage disk option as specified in the table given in the [Scalability and Performance Targets when using Premium Storage](#premium-storage-scalability-and-performance-targets) section. Each disk will map to one of the the supported provisioned sizes and will be billed accordingly. Billing for any provisioned disk is prorated hourly using the monthly price for the Premium Storage offer. For example, if you provisioned a P10 disk and deleted it after 20 hours, you are billed for the P10 offering prorated to 20 hours. This is regardless of the amount of actual data written to the disk or the IOPS/throughput used.

**Premium unmanaged disks snapshots**: Snapshots on premium unmanaged disks are billed for the additional capacity used by the snapshots. For information on snapshots, see [Creating a Snapshot of a Blob](/rest/api/storageservices/fileservices/Snapshot-Blob).

**Premium managed disks snapshots**: A snapshot of a managed disk is a read-only copy of the disk which is stored as a standard managed disk. The cost of a snapshot will be the same as a standard managed disk. For example, if you take a snapshot of a 128 GB premium managed disk, then the cost of the snapshot will be equivalent to a 128 GB standard managed disk.  

**Outbound data transfers**: [Outbound data transfers](https://azure.microsoft.com/pricing/details/data-transfers/) (data going out of Azure data centers) incur billing for bandwidth usage.

For detailed information on pricing for Premium Storage, Premium Storage-supported VMs, and Managed Disks, see:

* [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/)
* [Virtual Machines Pricing](https://azure.microsoft.com/pricing/details/virtual-machines/)
* [Managed Disks Pricing](https://azure.microsoft.com/pricing/details/managed-disks/)

## Azure Backup service support 

Virtual machines with unmanaged disks can be backed up using Azure Backup. [More details](../backup/backup-azure-vms-first-look-arm.md).

You can also use the Azure Backup service with Managed Disks to create a backup job with time-based backups, easy VM restoration and backup retention policies. You can read more about this at [Using Azure Backup service for VMs with Managed Disks](../backup/backup-introduction-to-azure-backup.md#using-managed-disk-vms-with-azure-backup). 

## Next steps
For more information about Azure Premium Storage refer to the following articles.

### Design and implement with Azure Premium Storage
* [Design for Performance with Premium Storage](storage-premium-storage-performance.md)
* [Using Blob Service Operations with Azure Premium Storage](http://go.microsoft.com/fwlink/?LinkId=521969)

### Operational guidance
* [Migrating to Azure Premium Storage](storage-migration-to-premium-storage.md)

### Blog Posts
* [Azure Premium Storage Generally Available](https://azure.microsoft.com/blog/azure-premium-storage-now-generally-available-2/)
* [Announcing the GS-Series: Adding Premium Storage Support to the Largest VMs in the Public Cloud](https://azure.microsoft.com/blog/azure-has-the-most-powerful-vms-in-the-public-cloud/)