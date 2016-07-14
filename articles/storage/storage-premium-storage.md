<properties
	pageTitle="Premium Storage: High-Performance Storage for Azure Virtual Machine Workloads | Microsoft Azure"
	description="Premium Storage offers high-performance, low-latency disk support for I/O-intensive workloads running on Azure Virtual Machines. Azure DS-series, DSv2-series and GS-series VMs support Premium Storage."
	services="storage"
	documentationCenter=""
	authors="ms-prkhad"
	manager=""
	editor="tysonn"/>

<tags
	ms.service="storage"
	ms.workload="storage"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/23/2016"
	ms.author="prkhad"/>


# Premium Storage: High-Performance Storage for Azure Virtual Machine Workloads

## Overview

Azure Premium Storage delivers high-performance, low-latency disk support for virtual machines running I/O-intensive workloads. Virtual machine (VM) disks that use Premium Storage store data on solid state drives (SSDs). You can migrate your application's VM disks to Azure Premium Storage to take advantage of the speed and performance of these disks.

An Azure VM supports attaching several Premium Storage disks, so that your applications can have up to 64 TB of storage per VM. With Premium Storage, your applications can achieve 80,000 IOPS (input/output operations per second) per VM and 2000 MB per second disk throughput per VM with extremely low latencies for read operations.

With Premium Storage, Azure offers the ability to truly lift-and-shift your demanding enterprise applications like, Dynamics AX, Dynamics CRM, Exchange Server, SharePoint Farms, and SAP Business Suite, to the cloud. You can run a variety of performance intensive database workloads like SQL Server, Oracle, MongoDB, MySQL, Redis, that require consistent high performance and low latency on Premium Storage.

>[AZURE.NOTE] We recommend migrating any virtual machine disk requiring high IOPS to Azure Premium Storage for the best performance for your application. If your disk does not require high IOPS, you can limit costs by maintaining it in Standard Storage, which stores virtual machine disk data on Hard Disk Drives (HDDs) instead of SSDs.

To get started with Azure Premium Storage, visit [Get started for free](https://azure.microsoft.com/pricing/free-trial/) page. For information on migrating your existing virtual machines to Premium Storage, see [Migrating to Azure Premium Storage](storage-migration-to-premium-storage.md).

>[AZURE.NOTE] Premium Storage is currently supported in some regions. You can find the list of available regions in [Azure Services by Region](https://azure.microsoft.com/regions/#services).

## Premium Storage Features

**Premium Storage Disks**: Azure Premium Storage supports VM disks that can be attached to DS, DSv2 or GS series Azure VMs. When using Premium Storage you have a choice of three disk sizes namely, P10 (128GiB), P20 (512GiB) and P30 (1024GiB), each with its own performance specifications. Depending on your application requirement you can attach one or more of these disks to your DS, DSv2 or GS series VM. In the following section on [Premium Storage Scalability and Performance Targets ](#premium-storage-scalability-and-performance-targets) we will describe the specifications in more detail.

**Premium Page Blob**: Premium Storage supports Azure Page Blobs, which are used to hold persistent disks for Azure Virtual Machines (VMs). Currently, Premium Storage does not support Azure Block Blobs, Azure Append Blobs, Azure Files, Azure Tables, or Azure Queues. Any other object placed in a Premium Storage account will be a Page Blob, and it will snap to one of the the supported provisioned sizes. Heance Premium Storage account is not meant for storing tiny blobs.

**Premium Storage account**: To start using Premium Storage, you must create a Premium Storage account. If you prefer to use the [Azure portal](https://portal.azure.com), you can create a Premium Storage account by specifying the “Premium” performance tier and “Locally-redundant storage (LRS)” as the replication option. You can also create a Premium Storage account by specifying the type as “Premium_LRS” using the [Storage REST API](http://msdn.microsoft.com//library/azure/dd179355.aspx) version 2014-02-14 or later; the [Service Management REST API](http://msdn.microsoft.com/library/azure/ee460799.aspx) version 2014-10-01 or later (Classic deployments); the [Azure Storage Resource Provider REST API Reference](http://msdn.microsoft.com/library/azure/mt163683.aspx) (Resource Manager deployments); and the [Azure PowerShell](../powershell-install-configure.md) version 0.8.10 or later. Learn about premium storage account limits in the following section on [Premium Storage Scalability and Performance Targets](#premium-storage-scalability-and-performance-targets).

**Premium Locally Redundant Storage**: A Premium Storage account only supports Locally Redundant Storage (LRS) as the replication option and keeps three copies of the data within a single region. For considerations regarding geo replication when using Premium Storage, see the [Snapshots and Copy Blob](#snapshots-and-copy-blob) section in this article.

Azure uses the storage account as a container for your operating system (OS) and data disks. When you create an Azure DS, DSv2 or GS VM and select an Azure Premium Storage account, your operating system and data disks are stored in that storage account.

You can use Premium Storage for Disks in one of two ways:
- First, create a new premium storage account. Next, when creating a new DS, DSv2 or GS VM, select the premium storage account in the Storage configuration settings. OR,
- When creating a new DS, DSv2 or GS VM create a new premium storage account in Storage configuration settings, or let Azure portal create a default premium storage account.

For step-by-step instructions, see the [Quick Start](#quick-start) section later in this article.

>[AZURE.NOTE] A premium storage account cannot be mapped to a custom domain name.

## DS, DSv2 and GS series VMs

Premium Storage supports DS-series, DSv2-series and GS-series Azure Virtual Machines (VMs). You can use both Standard and Premium storage disks with DS-series, DSv2-series or GS-series of VMs. But you cannot use Premium Storage disks with non-DS-series or non-GS-series of VMs. 

For information on available Azure VM types and sizes for Windows VMs, see [Windows VM sizes](../virtual-machines/virtual-machines-windows-sizes.md). For information on VM types and sizes for Linux VMs, see [Linux VM sizes](../virtual-machines/virtual-machines-linux-sizes.md). 

Following are some of the features of DS, DSv2 and GS series VMs:

**Cloud Service**: DS-series VMs can be added to a cloud service that includes only DS-series VMs. Do not add DS-series VMs to an existing cloud service that includes non-DS-series VMs. You can migrate your existing VHDs to a new cloud service running only DS-series VMs. If you want to retain the same virtual IP address (VIP) for the new cloud service that hosts your DS-series VMs, use the [Reserved IP Addresses](../virtual-network/virtual-networks-instance-level-public-ip.md). GS-series VMs can be added to an existing cloud service running only G-series VMs.

**Operating System Disk**: The DS-series, DSv2-series and GS-series Azure virtual machines can be configured to use an operating system (OS) disk hosted either on a Standard Storage account or on a Premium Storage account. We recommend using Premium Storage based OS disk for best experience.

**Data Disks**: You can use both Premium and Standard storage disks in the same DS-series VM, DSv2-series VM or GS-series VM. With Premium Storage, you can provision a DS, DSv2 or GS-series VM and attach several persistent data disks to the VM. If needed, you can stripe across the disks to increase the capacity and performance of the volume.

> [AZURE.NOTE] If you stripe Premium Storage data disks using [Storage Spaces](http://technet.microsoft.com/library/hh831739.aspx), you should configure it with one column for each disk that is used. Otherwise, overall performance of the striped volume may be lower than expected due to uneven distribution of traffic across the disks. By default, the Server Manager user interface (UI) allows you to setup columns up to 8 disks. But if you have more than 8 disks, you need to use PowerShell to create the volume and also specify the number of columns manually. Otherwise, the Server Manager UI continues to use 8 columns even though you have more disks. For example, if you have 32 disks in a single stripe set, you should specify 32 columns. You can use the *NumberOfColumns* parameter of the [New-VirtualDisk](http://technet.microsoft.com/library/hh848643.aspx) PowerShell cmdlet to specify the number of columns used by the virtual disk. For more information, see [Storage Spaces Overview](http://technet.microsoft.com/library/hh831739.aspx) and [Storage Spaces Frequently Asked Questions](http://social.technet.microsoft.com/wiki/contents/articles/11382.storage-spaces-frequently-asked-questions-faq.aspx).

**Cache**: DS, DSv2 and GS series VMs have a unique caching capability with which you can get high levels of throughput and latency, which exceeds underlying Premium Storage disk performance. You can configure disk caching policy on the Premium Storage disks as ReadOnly, ReadWrite or None. The default disk caching policy is ReadOnly for all premium data disks and ReadWrite for operating system disks. Use the right configuration setting to achieve optimal performance for your application. For example, for read heavy or read only data disks, such as SQL Server data files, set disk caching policy to “ReadOnly”. For write heavy or write only data disks, such as SQL Server log files, set disk caching policy to “None”. Learn more about optimizing your design with Premium Storage in [Design for Performance with Premium Storage](storage-premium-storage-performance.md).

**Analytics**: To analyze the performance of VMs using disks on Premium Storage accounts, you can enable the Azure VM Diagnostics in the Azure portal. Refer to [Microsoft Azure Virtual Machine Monitoring with Azure Diagnostics Extension](https://azure.microsoft.com/blog/2014/09/02/windows-azure-virtual-machine-monitoring-with-wad-extension/) for details. To see the disk performance, use operating system based tools, such as [Windows Performance Monitor](https://technet.microsoft.com/library/cc749249.aspx) for Windows VMs and [IOSTAT](http://linux.die.net/man/1/iostat) for Linux VMs.

**VM scale limits and performance**: Each DS-series, DSv2-series and GS-series VM size has scale limits and performance specification for IOPS, bandwidth and number of disks that can be attached per VM. When using premium storage disks with DS, DSv2 or GS series VMs, make sure there is sufficient IOPS and Bandwidth available on your VM to drive the disk traffic.
For example, a STANDARD_DS1 VM has 32 MB per second dedicated bandwidth available for Premium Storage disk traffic. A P10 premium storage disk can provide 100 MB per second bandwidth. If a P10 Premium Storage disk were attached to this VM, it can only go up to 32 MB per second but not up to 100 MB per second that the P10 disk can provide.

Currently, the largest VM on DS-series is STANDARD_DS14 and it can provide up to 512 MB per second across all disks. The largest VM on GS-series is STANDARD_GS5 and it can give up to 2000 MB per second across all disks.
Note that these limits are for disk traffic alone, not including cache-hits and network traffic. There is a separate bandwidth available for VM network traffic, which is different from the dedicated bandwidth for Premium Storage disks.

For the most up-to-date information on maximum IOPS and throughput (bandwidth) for DS-series, DSv2-series and GS-series VMs, see [Windows VM sizes](../virtual-machines/virtual-machines-windows-sizes.md) or [Linux VM sizes](../virtual-machines/virtual-machines-linux-sizes.md). 

To learn about the Premium storage disks and their IOPs and throughput limits, see the table in the [Premium Storage Scalability and Performance Targets](#premium-storage-scalability-and-performance-targets) section in this article.

## Premium Storage Scalability and Performance Targets

In this section, we will describe all the Scalability and Performance targets you must consider when using Premium Storage.

### Premium Storage account limits

Premium Storage accounts have following scalability targets:

<table border="1" cellspacing="0" cellpadding="5" style="border: 1px solid #000000;">
<tbody>
<tr>
	<td><strong>Total Account Capacity</strong></td>
	<td><strong>Total Bandwidth for a Locally Redundant Storage Account</strong></td>
</tr>
<tr>
	<td>
	<ul>
       <li type=round>Disk capacity: 35 TB</li>
       <li type=round>Snapshot capacity: 10 TB</li>
    </ul>
	</td>
	<td>Up to 50 gigabits per second for Inbound + Outbound</td>
</tr>
</tbody>
</table>

- Inbound refers to all data (requests) being sent to a storage account.
- Outbound refers to all data (responses) being received from a storage account.

For more information, see [Azure Storage Scalability and Performance Targets](storage-scalability-targets.md).

If the needs of your application exceed the scalability targets of a single storage account, build your application to use multiple storage accounts, and partition your data across those storage accounts. For example, if you want to attach 51 terabytes (TB) disks across a number of VMs, spread them across two storage accounts since 35 TB is the limit for a single Premium Storage account. Make sure that a single Premium Storage account has never more than 35 TB of provisioned disks.

### Premium Storage Disks Limits

When you provision a disk against a Premium Storage account, how much input/output operations per second (IOPS) and throughput (bandwidth) it can get depends on the size of the disk. Currently, there are three types of Premium Storage disks: P10, P20, and P30. Each one has specific limits for IOPS and throughput as specified in the following table:

<table border="1" cellspacing="0" cellpadding="5" style="border: 1px solid #000000;">
<tbody>
<tr>
	<td><strong>Premium Storage Disk Type</strong></td>
	<td><strong>P10</strong></td>
	<td><strong>P20</strong></td>
	<td><strong>P30</strong></td>
</tr>
<tr>
	<td><strong>Disk size</strong></td>
	<td>128 GiB</td>
	<td>512 GiB</td>
	<td>1024 GiB (1 TB)</td>
</tr>
<tr>
	<td><strong>IOPS per disk</strong></td>
	<td>500</td>
	<td>2300</td>
	<td>5000</td>
</tr>
<tr>
	<td><strong>Throughput per disk</strong></td>
	<td>100 MB per second </td>
	<td>150 MB per second </td>
	<td>200 MB per second </td>
</tr>
</tbody>
</table>

> [AZURE.NOTE] Make sure that there is sufficient bandwidth available on your VM to drive the disk traffic as explained in the [DS, DSv2 and GS-series VMs](#ds-dsv2-and-gs-series-vms) section earlier in this article. Otherwise, your disk throughput and IOPS will be constrained to lower values based on the VM limits rather than the disk limits mentioned in the previous table.  

Here are some important things you must know regarding Premium Storage scalability and performance targets:

- **Provisioned Capacity and Performance**: When you provision a premium storage disk, unlike standard storage, you are guaranteed the Capacity, IOPS and Throughput for that disk. For example, if you create a P30 disk, Azure provisions 1024 GB storage capacity, 5000 IOPS and 200 MB per second Throughput for that disk. Your application can use all or part of the capacity and performance.

- **Disk Size**: Azure maps the disk size (rounded up) to the nearest Premium Storage Disk option as specified in the table. For example, a disk of size 100 GiB is classified as a P10 option and can perform up to 500 IO units per second, and with up to 100 MB per second throughput. Similarly, a disk of size 400 GiB is classified as a P20 option, and can perform up to 2300 IO units per second and up to 150 MB per second throughput.

	> [AZURE.NOTE] You can easily increase the size of existing disks. For example, if you wish to increase the size of a 30 GB disk to 128GB or to 1 TB. Or, if you wish to convert your P20 disk to a P30 disk because you need more capacity or more IOPS and throughput. You can expand the disk using "Update-AzureDisk" PowerShell commandlet with "-ResizedSizeInGB" property. For performing this action, disk needs to be detached from the VM or the VM needs to be stopped.

- **IO Size**: The input/output (I/O) unit size is 256 KB. If the data being transferred is less than 256 KB, it is considered a single I/O unit. The larger I/O sizes are counted as multiple I/Os of size 256 KB. For example, 1100 KB I/O is counted as five I/O units.

- **Throughput**: The throughput limit includes writes to the disk as well as reads from that disk that are not served from the cache. For example, a P10 disk has 100 MB per second throughput per disk. Some examples of valid throughput for the P10 disk are,
<table border="1" cellspacing="0" cellpadding="5" style="border: 1px solid #000000;">
<tbody>
<tr>
	<td><strong>Max Throughput per P10 disk</strong></td>
	<td><strong>Non-cache Reads from disk</strong></td>
	<td><strong>Non-cache Writes to disk</strong></td>
</tr>
<tr>
	<td>100 MB per sec</td>
	<td>100 MB per sec</td>
	<td>0</td>
</tr>
<tr>
	<td>100 MB per sec</td>
	<td>0</td>
	<td>100 MB per sec</td>
</tr>
<tr>
	<td>100 MB per second </td>
	<td>60 MB per second </td>
	<td>40 MB per second </td>
</tr>
</tbody>
</table>

- **Cache hits**: Cache-hits are not limited by the allocated IOPS/Throughput of the disk. For example, when you use a data disk with ReadOnly cache setting on a DS-series VM, DSv2-series or GS-series VM, Reads that are served from the cache are not subject to Premium Storage disk limits. Hence you could get very high throughput from a disk if the workload is predominantly Reads. Note that, cache is subject to separate IOPS / Throughput limits at VM level based on the VM size. DS-series VMs have roughly 4000 IOPS and 33 MB/sec per core for cache and local SSD IOs. GS-series VMs have a limit of 5000 IOPS and 50 MB/sec per core for cache and local SSD IOs.

## Throttling
You may see throttling if your application IOPS or throughput exceed the allocated limits for a Premium Storage disk or if your total disk traffic across all disks on the VM exceeds the disk bandwidth limit available for the VM. To avoid throttling, we recommend that you limit the number of pending I/O requests for disk based on the scalability and performance targets for the disk you have provisioned and based on the disk bandwidth available to the VM.  

Your application can achieve the lowest latency when it is designed to avoid throttling. On the other hand, if the number of pending I/O requests for the disk is too small, your application cannot take advantage of the maximum IOPS and throughput levels that are available to the disk.

The following examples demonstrate how to calculate the throttling levels. All calculations are based on I/O unit size of 256 KB:

### Example 1:
Your application has done 495 I/O units of 16 KB size in one second on a P10 disk. These will be counted as 495 I/O Units per second (IOPS). If you try a 2 MB I/O in the same second, the total of I/O units is equal to 495 + 8. This is because 2 MB I/O results in 2048 KB / 256 KB = 8 I/O Units when the I/O unit size is 256 KB. Since the sum of 495 + 8 exceeds the 500 IOPS limit for the disk, throttling occurs.

### Example 2:
Your application has done 400 I/O units of 256 KB size on a P10 disk. The total bandwidth consumed is (400 * 256) / 1024 = 100 MB/sec. A P10 disk has throughput limit of 100 MB per second. If your application tries to perform more I/O in that second, it gets throttled because it exceeds the allocated limit.

### Example 3:
You have a DS4 VM with two P30 disks attached. Each P30 disk is capable of 200 MB per second throughput. However, a DS4 VM has a total disk bandwidth capacity of 256 MB per second. Therefore, you cannot drive the attached disks to the maximum throughput on this DS4 VM at the same time. To resolve this, you can sustain traffic of 200 MB per second on one disk and 56 MB per second on the other disk. If the sum of your disk traffic goes over 256 MB per second, the disk traffic gets throttled.

>[AZURE.NOTE] If the disk traffic mostly consists of small I/O sizes, it is highly likely that your application will hit the IOPS limit before the throughput limit. On the other hand, if the disk traffic mostly consists of large I/O sizes, it is highly likely that your application will hit the throughput limit instead of the IOPS limit. You can maximize your application IOPS and throughput capacity by using optimal I/O sizes and also by limiting the number of pending I/O requests for disk.

To learn about designing for high performance using Premium Storage read the article, [Design for Performance with Premium Storage](storage-premium-storage-performance.md).

## Snapshots and Copy Blob
You can create a snapshot for Premium Storage in the same way as you create a snapshot when using Standard Storage. Since Premium Storage only supports Locally Redundant Storage (LRS) as the replication option, we recommend that you create snapshots and then copy those snapshots to a geo-redundant standard storage account. For more information, see [Azure Storage Redundancy Options](storage-redundancy.md).

If a disk is attached to a VM, certain API operations are not permitted on the page blob backing the disk. For example, you cannot perform a [Copy Blob](http://msdn.microsoft.com/library/azure/dd894037.aspx) operation on that blob as long as the disk is attached to a VM. Instead, first create a snapshot of that blob by using the [Snapshot Blob](http://msdn.microsoft.com/library/azure/ee691971.aspx) REST API method, and then perform the [Copy Blob](http://msdn.microsoft.com/library/azure/dd894037.aspx) of the snapshot to copy the attached disk. Alternatively, you can detach the disk and then perform any necessary operations on the underlying blob.

Following limits apply to Premium Storage blob snapshots:
<table border="1" cellspacing="0" cellpadding="5" style="border: 1px solid #000000;">
<tbody>
<tr>
	<td><strong>Premium Storage Limit</strong></td>
	<td><strong>Value</strong></td>
</tr>
<tr>
	<td>Max. number of snapshots per blob</td>
	<td>100</td>
</tr>
<tr>
	<td>Storage account capacity for snapshots
	(Includes data in snapshots only, and does not include data in base blob)</td>
	<td>10 TB</td>
</tr>
<tr>
	<td>Min. time between consecutive snapshots</td>
	<td>10 minutes</td>
</tr>
</tbody>
</table>

To maintain geo-redundant copies of your snapshots, you can copy snapshots from a Premium Storage account to a geo-redundant standard storage account by using AzCopy or Copy Blob. For more information, see [Transfer data with the AzCopy Command-Line Utility](storage-use-azcopy.md) and [Copy Blob](http://msdn.microsoft.com/library/azure/dd894037.aspx).

For detailed information on performing REST operations against page blobs in Premium Storage accounts, see [Using Blob Service Operations with Azure Premium Storage](http://go.microsoft.com/fwlink/?LinkId=521969) in the MSDN library.

## Using Linux VMs with Premium Storage
Please refer to important instructions below for configuring your Linux VMs on Premium Storage:

- For all Premium Storage disks with cache setting as either “ReadOnly” or “None”, you must disable “barriers” while mounting the file system in order to achieve the scalability targets for Premium Storage. You do not need barriers for this scenario because the writes to Premium Storage backed disks are durable for these cache settings. When the write request successfully completes, data has been written to the persistent store. Please use the following methods for disabling “barriers” depending on your file system:
	- If you use **reiserFS**, disable barriers using the mount option “barrier=none” (For enabling barriers, use “barrier=flush”)
	- If you use **ext3/ext4**, disable barriers using the mount option “barrier=0” (For enabling barriers, use “barrier=1”)
	- If you use **XFS**, disable barriers using the mount option “nobarrier” (For enabling barriers, use the option “barrier”)

- For Premium Storage disks with cache setting “ReadWrite”, barriers should be enabled for durability of writes.
- For the volume labels to persist after VM reboot, you must update /etc/fstab with the UUID references to the disks. Also refer to [How to Attach a Data Disk to a Linux Virtual Machine](../virtual-machines/virtual-machines-linux-classic-attach-disk.md)

Following are the Linux Distributions that we validated with Premium Storage. We recommend that you upgrade your VMs to at least one of these versions (or later) for better performance and stability with Premium Storage. Also, some of the versions require the latest LIS (Linux Integration Services v4.0 for Microsoft Azure). Please follow the link provided below for download and installation. We will continue to add more images to the list as we complete additional validations. Please note, our validations showed that performance varies for these images, and it also depends on workload characteristics and settings on the images. Different images are tuned for different kinds of workload.
<table border="1" cellspacing="0" cellpadding="5" style="border: 1px solid #000000;">
<tbody>
<tr>
	<td><strong>Distribution</strong></td>
	<td><strong>Version</strong></td>
	<td><strong>Supported Kernel</strong></td>
	<td><strong>Details</strong></td>
</tr>
<tr>
	<td rowspan="2"><strong>Ubuntu</strong></td>
	<td>12.04</td>
	<td>3.2.0-75.110+</td>
	<td>Ubuntu-12_04_5-LTS-amd64-server-20150119-en-us-30GB</td>
</tr>
<tr>
	<td>14.04+</td>
	<td>3.13.0-44.73+</td>
	<td>Ubuntu-14_04_1-LTS-amd64-server-20150123-en-us-30GB</td>
</tr>
<tr>
	<td><strong>Debian</strong></td>
	<td>7.x, 8.x</td>
	<td>3.16.7-ckt4-1+</td>
    <td> </td>
</tr>
<tr>
	<td rowspan="2"><strong>SUSE</strong></td>
	<td>SLES 12</td>
	<td>3.12.36-38.1+</td>
	<td>suse-sles-12-priority-v20150213<br>suse-sles-12-v20150213</td>
</tr>
<tr>
	<td>SLES 11 SP4</td>
    <td>3.0.101-0.63.1+</td>
    <td> </td>
</tr>
<tr>
	<td><strong>CoreOS</strong></td>
	<td>584.0.0+</td>
	<td>3.18.4+</td>
	<td>CoreOS 584.0.0</td>
</tr>
<tr>
	<td rowspan="2"><strong>CentOS</strong></td>
	<td>6.5, 6.6, 6.7, 7.0</td>
	<td></td>
	<td>
		<a href="http://go.microsoft.com/fwlink/?LinkID=403033&clcid=0x409"> LIS4 Required </a> <br/>
		*See note below*
	</td>
</tr>
<tr>
	<td>7.1+</td>
	<td>3.10.0-229.1.2.el7+</td>
	<td>
		<a href="http://go.microsoft.com/fwlink/?LinkID=403033&clcid=0x409"> LIS4 Recommended </a> <br/>
		*See note below*
	</td>
</tr>
<tr>
	<td><strong>RHEL</strong></td>
	<td>6.8+, 7.2+</td>
	<td> </td>
	<td></td>
</tr>
<tr>
	<td rowspan="3"><strong>Oracle</strong></td>
    <td>6.8+, 7.2+</td>
    <td> </td>
    <td> UEK4 or RHCK </td>

</tr>
<tr>
	<td>7.0-7.1</td>
	<td> </td>
	<td>UEK4 or RHCK w/<a href="http://go.microsoft.com/fwlink/?LinkID=403033&clcid=0x409">LIS 4.1+</a></td>
</tr>
<tr>
	<td>6.4-6.7</td>
	<td></td>
	<td>UEK4 or RHCK w/<a href="http://go.microsoft.com/fwlink/?LinkID=403033&clcid=0x409">LIS 4.1+</a></td>
</tr>
</tbody>
</table>


### LIS Drivers for Openlogic CentOS

Customers running OpenLogic CentOS VMs should run the following command to install the latest drivers:

	sudo rpm -e hypervkvpd  ## (may return error if not installed, that's OK)
	sudo yum install microsoft-hyper-v

A reboot will then be required to activate the new drivers.

## Pricing and Billing
When using Premium Storage, the following billing considerations apply:
- Premium Storage Disk / Blob Size
- Premium Storage Snapshots
- Outbound data transfers

**Premium Storage Disk / Blob Size**: Billing for a Premium Storage disk/blob depends on the provisioned size of the disk/blob. Azure maps the provisioned size (rounded up) to the nearest Premium Storage Disk option as specified in the table given in the [Scalability and Performance Targets when using Premium Storage](#premium-storage-scalability-and-performance-targets) section. All objects stored in a Premium Storage account will map to one of the the supported provisioned sizes and will be billed accordingly. Hence avoid using Premium Storage account for storing tiny blobs. Billing for any provisioned disk/blob is prorated hourly using the monthly price for the Premium Storage offer. For example, if you provisioned a P10 disk and deleted it after 20 hours, you are billed for the P10 offering prorated to 20 hours. This is regardless of the amount of actual data written to the disk or the IOPS/throughput used.

**Premium Storage Snapshots**: Snapshots on Premium Storage are billed for the additional capacity used by the snapshots. For information on snapshots, see [Creating a Snapshot of a Blob](http://msdn.microsoft.com/library/azure/hh488361.aspx).

**Outbound data transfers**: [Outbound data transfers](https://azure.microsoft.com/pricing/details/data-transfers/) (data going out of Azure data centers) incur billing for bandwidth usage.

For detailed information on pricing for Premium Storage,  DS-series VMs, DSv2-series VMs and GS-series VMs, see:

- [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/)
- [Virtual Machines Pricing](https://azure.microsoft.com/pricing/details/virtual-machines/)

## Quick Start

## Create and use a Premium Storage account for a virtual machine data disk

In this section we will demonstrate the following scenarios using Azure portal, Azure PowerShell and Azure CLI:

- How to create a Premium Storage account.
- How to create a virtual machine and attach a data disk to the virtual machine when using Premium Storage.
- How to change disk caching policy of a data disk attached to a virtual machine.

### Create an Azure virtual machine using Premium Storage via the Azure portal

#### I. Create a Premium Storage account in Azure portal

This section shows how to create a Premium Storage account using the Azure portal.

1.	Sign in to the [Azure portal](https://portal.azure.com). Check out the [Free Trial](https://azure.microsoft.com/pricing/free-trial/) offer if you do not have a subscription yet.

2. On the Hub menu, select **New** -> **Data + Storage** -> **Storage account**.

3. Enter a name for your storage account.

	> [AZURE.NOTE] Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only.
	>  
	> Your storage account name must be unique within Azure. The Azure portal will indicate if the storage account name you select is already in use.

4. Specify the deployment model to be used: **Resource Manager** or **Classic**. **Resource Manager** is the recommended deployment model. For more information, see [Understanding Resource Manager deployment and classic deployment](../resource-manager-deployment-model.md).

5. Specify the performance tier for the storage account as **Premium**.

6. **Locally-redundant storage (LRS)** is the only available replication option with Premium Storage. For more details on Azure Storage replication options, see [Azure Storage replication](storage-redundancy.md).

7. Select the subscription in which you want to create the new storage account.

8. Specify a new resource group or select an existing resource group. For more information on resource groups, see [Azure Resource Manager overview](../resource-group-overview.md).

9. Select the geographic location for your storage account. You can confirm whether Premium Storage is available in the selected Location by referring to [Azure Services by Region](https://azure.microsoft.com/regions/#services).

10. Click **Create** to create the storage account.

#### II. Create an Azure virtual machine via Azure portal

You must create a DS, DSv2 or GS series VM to be able to use Premium Storage. Follow the steps in [Create a Windows virtual machine in the Azure portal](../virtual-machines/virtual-machines-windows-hero-tutorial.md) to create a new DS, DSv2 or GS virtual machine.

#### III. Attach a premium storage data disk via Azure portal

1. Find the new or existing DS, DSv2 or GS VM in Azure portal.
2. In the VM **All Settings**, go to **Disks** and click on **Attach New**.
3. Enter the name of your data disk and select the **Type** as **Premium**. Select the desired **Size** and **Host caching** setting.

	![Premium Disk][Image1]

See more detailed steps in [How to attach a data disk in Azure portal](../virtual-machines/virtual-machines-windows-attach-disk-portal.md).

#### IV. Change disk caching policy via Azure portal

1. Find the new or existing DS, DSv2 or GS VM in Azure portal.
2. In the VM All Settings, go to Disks and click on the disk you wish to change.
3. Change the Host caching option to the desired value, None or ReadOnly or ReadWrite

### Create an Azure virtual machine using Premium Storage via Azure PowerShell

#### I. Create a Premium Storage account in Azure PowerShell

This PowerShell example shows how to create a new Premium Storage account and attach a data disk that uses that account to a new Azure virtual machine.

1. Setup your PowerShell environment by following the steps given at [How to install and configure Azure PowerShell](../powershell-install-configure.md).
2. Start the PowerShell console, connect to your subscription, and run the following PowerShell cmdlet in the console window. As seen in this PowerShell statement, you need to specify the **Type** parameter as **Premium_LRS** when you create a Premium Storage account.

		New-AzureStorageAccount -StorageAccountName "yourpremiumaccount" -Location "West US" -Type "Premium_LRS"

#### II. Create an Azure virtual machine via Azure PowerShell

Next, create a new DS-Series VM and specify that you want Premium Storage by running the following PowerShell cmdlets in the console window. You can create a GS-series VM using the same steps. Specify the appropriate VM size in the commands. For e.g. Standard_GS2:

    	$storageAccount = "yourpremiumaccount"
    	$adminName = "youradmin"
    	$adminPassword = "yourpassword"
    	$vmName ="yourVM"
    	$location = "West US"
    	$imageName = "a699494373c04fc0bc8f2bb1389d6106__Windows-Server-2012-R2-201409.01-en.us-127GB.vhd"
    	$vmSize ="Standard_DS2"
    	$OSDiskPath = "https://" + $storageAccount + ".blob.core.windows.net/vhds/" + $vmName + "_OS_PIO.vhd"
    	$vm = New-AzureVMConfig -Name $vmName -ImageName $imageName -InstanceSize $vmSize -MediaLocation $OSDiskPath
    	Add-AzureProvisioningConfig -Windows -VM $vm -AdminUsername $adminName -Password $adminPassword
    	New-AzureVM -ServiceName $vmName -VMs $VM -Location $location

#### III. Attach a premium storage data disk via Azure PowerShell

If you want more disk space for your VM, attach a new data disk to an existing DS-series VM, DSv2-series VM or GS-series VM after it is created by running the following PowerShell cmdlets in the console window:

    	$storageAccount = "yourpremiumaccount"
    	$vmName ="yourVM"
    	$vm = Get-AzureVM -ServiceName $vmName -Name $vmName
    	$LunNo = 1
    	$path = "http://" + $storageAccount + ".blob.core.windows.net/vhds/" + "myDataDisk_" + $LunNo + "_PIO.vhd"
    	$label = "Disk " + $LunNo
    	Add-AzureDataDisk -CreateNew -MediaLocation $path -DiskSizeInGB 128 -DiskLabel $label -LUN $LunNo -HostCaching ReadOnly -VM $vm | Update-AzureVm

#### IV. Change disk caching policy via Azure PowerShell

To update the disk caching policy, note the LUN number of the data disk attached. Run the following command to update data disk attached at LUN number 2, to ReadOnly.

		Get-AzureVM "myservice" -name "MyVM" | Set-AzureDataDisk -LUN 2 -HostCaching ReadOnly | Update-AzureVM

### Create an Azure virtual machine using Premium Storage via the Azure Command-Line Interface

The [Azure Command-Line Interface](../xplat-cli-install.md)(Azure CLI) provides a provides a set of open source, cross-platform commands for working with the Azure Platform. The following examples show how to use Azure CLI (version 0.8.14 and later) to create a Premium Storage account, a new virtual machine, and attach a new data disk from a Premium Storage account.

#### I. Create a Premium Storage account via Azure CLI

````
azure storage account create "premiumtestaccount" -l "west us" --type PLRS
````

#### II. Create a DS-series virtual machine via Azure CLI

	azure vm create -z "Standard_DS2" -l "west us" -e 22 "premium-test-vm"
		"b39f27a8b8c64d52b05eac6a62ebad85__Ubuntu-14_10-amd64-server-20150202-en-us-30GB" -u "myusername" -p "passwd@123"

Display information about the virtual machine

	azure vm show premium-test-vm

#### III. Attach a new premium data disk via Azure CLI

	azure vm disk attach-new premium-test-vm 20 https://premiumstorageaccount.blob.core.windows.net/vhd-store/data1.vhd

Display information about the new data disk

	azure vm disk show premium-test-vm-premium-test-vm-0-201502210429470316

#### IV. Change disk caching policy

To change the cache policy on one of your disks using Azure CLI, run the following command:

		$ azure vm disk attach -h ReadOnly <VM-Name> <Disk-Name>

Note that the caching policy options can be ReadOnly, None, or ReadWrite. For more options, see the help by running the following command:

		azure vm disk attach --help

## FAQs

1. **Can I attach both premium and standard data disks to a DS, DSv2 or GS series VM?**

	Yes. You can attach both premium and standard data disks to a DS, DSv2 or GS series VM.

2. **Can I attach both premium and standard data disks to a D, Dv2 or G series VM?**

	No. You can only attach a standard data disk to all VMs that are not DS, DSv2 or GS series.

3. **If I create a premium data disk from an existing VHD that was 80 GB in size, how much will that cost me?**

	A premium data disk created from 80 GB VHD will be treated as the next available premium disk size, a P10 disk. You will be charged as per the P10 disk pricing.

4. **Are there any transaction costs when using Premium Storage?**

	There is a fixed cost for each disk size which comes provisioned with certain number of IOPS and Throughput. The only other costs are outbound bandwidth and snapshots capacity, if applicable. See [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/) for more details.

5. **Where can I store boot diagnostics for my DS, DSv2 or GS series VM?**

	Create a standard storage account to store the boot diagnostics of your DS, DSv2 or GS series VM.

6. **How many IOPS and Throughput can I get from the disk cache?**

	The combined limits for cache and local SSD for a DS series are 4000 IOPS per core and 33 MB per second per core. GS series offers 5000 IOPS per core and 50 MB per second per core.

7. **What is the local SSD in a DS, DSv2 or GS series VM?**

	The local SSD is a temporary storage that is included with a DS, DSv2 or GS series VM. There is no extra cost for this temporary storage. It is recommended that you do not use this temporary storage or local SSD for storing your application data as it is not persisted in Azure Blob Storage.

8. **Can I convert my standard storage account to a Premium Storage account?**

	No. It is not possible to convert standard storage account to Premium Storage account or vice versa. You must create a new storage account with the desired type and copy data to new storage account, if applicable.

9. **How can I convert my D series VM to a DS series VM?**

	Please refer to the migration guide, [Migrating to Azure Premium Storage](storage-migration-to-premium-storage.md) to move your workload from a D series VM using standard storage account to a DS series VM using Premium Storage account.

## Next steps

For more information about Azure Premium Storage refer to the following articles.

### Design and implement with Azure Premium Storage

- [Design for Performance with Premium Storage](storage-premium-storage-performance.md)
- [Using Blob Service Operations with Azure Premium Storage](http://go.microsoft.com/fwlink/?LinkId=521969)

### Operational guidance

- [Migrating to Azure Premium Storage](storage-migration-to-premium-storage.md)

### Blog Posts

- [Azure Premium Storage Generally Available](https://azure.microsoft.com/blog/azure-premium-storage-now-generally-available-2/)
- [Announcing the GS-Series: Adding Premium Storage Support to the Largest VMs in the Public Cloud](https://azure.microsoft.com/blog/azure-has-the-most-powerful-vms-in-the-public-cloud/)

[Image1]: ./media/storage-premium-storage/Azure_attach_premium_disk.png
