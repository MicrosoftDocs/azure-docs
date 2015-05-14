<properties
	pageTitle="Premium Storage: High-Performance Storage for Azure Virtual Machine Workloads"
	description="Learn Azure Premium Storage for Disks. Learn how to create a Premium Storage account."
	services="storage"
	documentationCenter=""
	authors="Selcin"
	manager="adinah"
	editor="tysonn"/>

<tags
	ms.service="storage"
	ms.workload="storage"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/01/2015"
	ms.author="selcint"/>


# Premium Storage: High-Performance Storage for Azure Virtual Machine Workloads

## Overview

Welcome to **Azure Premium Storage Disks** for faster Virtual Machines!

With the introduction of new Premium Storage, Microsoft Azure now offers two types of durable storage: **Premium Storage** and **Standard Storage**. Premium Storage stores data on the latest technology Solid State Drives (SSDs) whereas Standard Storage stores data on Hard Disk Drives (HDDs).

Premium Storage delivers high-performance, low-latency disk support for I/O intensive workloads running on Azure Virtual Machines. You can attach several Premium Storage disks to a virtual machine (VM). With Premium Storage, your applications can have up to 32 TB of storage per VM and achieve 64,000 IOPS (input/output operations per second) per VM with extremely low latencies for read operations.

To get started with Azure Premium Storage, visit [Get started for free](http://azure.microsoft.com/en-us/pricing/free-trial/) page.

This article provides an in-depth overview of Azure Premium Storage.

## Important Things to Know About Premium Storage

The following is a list of important things to consider before or when using Premium Storage:

- To use Premium Storage, you need to have a Premium Storage account. To learn how to create a Premium Storage account, see [Creating and using Premium Storage Account for Disks](#create-and-use-a-premium-storage-account-for-a-virtual-machine-data-disk).

- Premium Storage is currently available in the [Microsoft Azure Preview Portal](https://portal.azure.com/) and accessible via the following SDK libraries: [Storage REST API](http://msdn.microsoft.com//library/azure/dd179355.aspx) version 2014-02-14 or later; [Service Management REST API](http://msdn.microsoft.com/library/azure/ee460799.aspx) version 2014-10-01 or later; and [Azure PowerShell](install-configure-powershell.md) version 0.8.10 or later.

- Premium Storage is currently available in the following regions: West US, East US 2, West Europe, East China, Southeast Asia and West Japan.

- Premium Storage supports only Azure page blobs, which are used to hold persistent disks for Azure Virtual Machines (VMs). For information on Azure page blobs, see [Understanding Block Blobs and Page Blobs](http://msdn.microsoft.com/library/azure/ee691964.aspx). Premium Storage does not support the Azure Block Blobs, Azure Files, Azure Tables, or Azure Queues.

- A Premium Storage account is locally redundant (LRS) and keeps three copies of the data within a single region.  For considerations regarding geo replication when using Premium Storage, see the [Snapshots and Copy Blob when using Premium Storage](#snapshots-and-copy-blob-when-using-premium-storage) section in this article.

- If you want to use a Premium Storage account for your VM disks, you need to use the DS-series of VMs. You can use both Standard and Premium storage disks with DS-series of VMs. But you cannot use Premium Storage disks with non-DS-series of VMs. For information on available Azure VM disk types and sizes, see [Virtual Machine and Cloud Service Sizes for Azure](http://msdn.microsoft.com/library/azure/dn197896.aspx).

- The process for setting up Premium Storage disks for a VM is similar to Standard Storage disks. You need to choose the most appropriate Premium Storage option for your Azure disks and VM. The VM size should be suitable for your workload based on the performance characteristics of the Premium offerings. For more information, see [Scalability and Performance Targets when using Premium Storage](#scalability-and-performance-targets-when-using-premium-storage).

- A premium storage account cannot be mapped to a custom domain name.

- Storage analytics is not currently supported for Premium Storage. To analyze the performance metrics of VMs using disks on Premium Storage accounts, use the operating system based tools, such as [Windows Performance Monitor](https://technet.microsoft.com/library/cc749249.aspx) for Windows VMs and [IOSTAT](http://linux.die.net/man/1/iostat) for Linux VMs.

## Using Premium Storage for Disks
You can use Premium Storage for Disks in one of two ways:

- Create a new premium storage account first and then use it when creating the VM.
- Create a new DS-series VM. While creating the VM, you can select a previously created Premium Storage account, create a new one, or let the Azure Portal to create a default premium account.

Azure uses the storage account as a container for your operating system (OS) and data disks. In other words, if you create an Azure DS-series VM and select an Azure Premium Storage account, your operating system and data disks are stored in that storage account.

To leverage the benefits of Premium Storage, create a Premium Storage account using an account type of *Premium_LRS* first. To do this, you can use the [Microsoft Azure Preview Portal](https://portal.azure.com/), [Azure PowerShell](install-configure-powershell.md), or the [Service Management REST API](http://msdn.microsoft.com/library/azure/ee460799.aspx). For step-by-step instructions, see [Creating and using Premium Storage Account for Disks](#create-and-use-a-premium-storage-account-for-a-virtual-machine-data-disk).

### Important notes:

- For details about the capacity and bandwidth limits for Premium Storage accounts, see the [Scalability and Performance Targets when using Premium Storage](#scalability-and-performance-targets-when-using-premium-storage) section. If the needs of your application exceed the scalability targets of a single storage account, build your application to use multiple storage accounts, and partition your data across those storage accounts. For example, if you want to attach 51 terabytes (TB) disks across a number of VMs, spread them across two storage accounts since 35 TB is the limit for a single Premium storage account. Make sure that a single Premium Storage account has never more than 35 TB of provisioned disks.
- By default, disk caching policy is "Read-Only" for all the Premium data disks, and "Read-Write" for the Premium operating system disk attached to the VM. This configuration setting is recommended to achieve the optimal performance for your application’s I/Os. For write-heavy or write-only data disks (such as SQL Server log files), disable disk caching so that you can achieve better application performance.
- Make sure that there is sufficient bandwidth available on your VM to drive the disk traffic. For example, a STANDARD_DS1 VM has 32 MB per second dedicated bandwidth available for Premium Storage disk traffic. That means, a P10 Premium Storage disk attached to this VM can only go up to 32 MB per second but not up to 100 MB per second that the P10 disk can provide. Similarly, a STANDARD_DS13 VM can go up to 256 MB per second across all disks. Currently, the largest VM on DS-series is STANDARD_DS14 and it can provide up to 512 MB per second across all disks.

	Note that these limits are for disk traffic alone, not including cache-hits and network traffic. There is a separate bandwidth available for VM network traffic, which is different from the dedicated bandwidth for Premium Storage disks. The following table lists the current maximum IOPS and throughput (bandwidth) values per DS-series VM across all the disks attached to the VM:

	<table border="1" cellspacing="0" cellpadding="5" style="border: 1px solid #000000;">
<tbody>
<tr>
	<td><strong>VM Size</strong></td>
	<td><strong>CPU cores</strong></td>
	<td><strong>Max. IOPS</strong></td>
	<td><strong>Max. Disk Bandwidth</strong></td>
</tr>
<tr>
	<td><strong>STANDARD_DS1</strong></td>
	<td>1</td>
	<td>3,200</td>
	<td>32 MB per second</td>
</tr>
<tr>
	<td><strong>STANDARD_DS2</strong></td>
	<td>2</td>
	<td>6,400</td>
	<td>64 MB per second</td>
</tr>
<tr>
	<td><strong>STANDARD_DS3</strong></td>
	<td>4</td>
	<td>12,800</td>
	<td>128 MB per second</td>
</tr>
<tr>
	<td><strong>STANDARD_DS4</strong></td>
	<td>8</td>
	<td>25,600</td>
	<td>256 MB per second</td>
</tr>
<tr>
	<td><strong>STANDARD_DS11</strong></td>
	<td>2</td>
	<td>6,400</td>
	<td>64 MB per second</td>
</tr>
<tr>
	<td><strong>STANDARD_DS12</strong></td>
	<td>4</td>
	<td>12,800</td>
	<td>128 MB per second</td>
</tr>
<tr>
	<td><strong>STANDARD_DS13</strong></td>
	<td>8</td>
	<td>25,600</td>
	<td>256 MB per second</td>
</tr>
<tr>
	<td><strong>STANDARD_DS14</strong></td>
	<td>16</td>
	<td>50,000</td>
	<td>512 MB per second</td>
</tr>
</tbody>
</table>

	For the most up-to-date information, see [Virtual Machine and Cloud Service Sizes for Azure](http://msdn.microsoft.com/library/azure/dn197896.aspx). To learn about the Premium storage disks and their IOPs and throughput limits, see the table in the [Scalability and Performance Targets when using Premium Storage](#scalability-and-performance-targets-when-using-premium-storage) section in this article.

> [AZURE.NOTE] Cache-hits are not limited by the allocated IOPS/Throughput of the disk. That is, when you use a data disk with ReadOnly cache setting on a DS-series VM, Reads that are served from the cache are not subject to Premium Storage disk limits. Hence you could get very high throughput from a disk if the workload is predominantly Reads. Note that, cache is subject to separate IOPS / Throughput limits at VM level based on the VM size. DS-series VMs have roughly 4000 IOPS and 33 MB/sec per core for cache and local SSD IOs.

- You can use both Premium and Standard storage disks in the same DS-series VM.
- With Premium Storage, you can provision a DS-series VM and attach several persistent data disks to a VM. If needed, you can stripe across the disks to increase the capacity and performance of the volume. If you stripe Premium Storage data disks using [Storage Spaces](http://technet.microsoft.com/library/hh831739.aspx), you should configure it with one column for each disk that is used. Otherwise, overall performance of the striped volume may be lower than expected due to uneven distribution of traffic across the disks. By default, the Server Manager user interface (UI) allows you to setup columns up to 8 disks. But if you have more than 8 disks, you need to use PowerShell to create the volume and also specify the number of columns manually. Otherwise, the Server Manager UI continues to use 8 columns even though you have more disks. For example, if you have 32 disks in a single stripe set, you should specify 32 columns. You can use the *NumberOfColumns* parameter of the [New-VirtualDisk](http://technet.microsoft.com/library/hh848643.aspx) PowerShell cmdlet to specify the number of columns used by the virtual disk. For more information, see [Storage Spaces Overview](http://technet.microsoft.com/library/jj822938.aspx) and [Storage Spaces Frequently Asked Questions](http://social.technet.microsoft.com/wiki/contents/articles/11382.storage-spaces-frequently-asked-questions-faq.aspx).
- Avoid adding DS-series VMs to an existing cloud service that includes non-DS-series VMs. A possible workaround is to migrate your existing VHDs to a new cloud service running only DS-series VMs.  If you want to retain the same virtual IP address (VIP) for the new cloud service that hosts your DS-series VMs, use the [Reserved IP Addresses](https://msdn.microsoft.com/library/azure/dn690120.aspx) feature.
- The DS-series of Azure virtual machines can be configured to use an operating system (OS) disk hosted either on a Standard Storage account or on a Premium Storage account. If you use the OS disk only for booting, you may consider using a Standard Storage based OS disk. This provides cost benefits and similar performance results similar to the Premium Storage after booting up. If you perform any additional tasks on the OS disk other than booting, use Premium Storage as it provides better performance results. For example, if your application reads/writes from/to the OS disk, using Premium Storage based OS disk provides better performance for your VM.
- You can use [Azure Cross-Platform Command-Line Interface (xplat-cli)](xplat-cli.md) with Premium Storage. To change the cache policy on one of your disks using xplat-cli, run the following command:

	`$ azure vm disk attach -h ReadOnly <VM-Name> <Disk-Name>`

	Note that the caching policy options can be ReadOnly, None, or ReadWrite. For more options, see the help by running the following command:

	`azure vm disk attach --help`


## Scalability and Performance Targets when using Premium Storage

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
	<td>100 MB per second *</td>
	<td>150 MB per second *</td>
	<td>200 MB per second *</td>
</tr>
</tbody>
</table>

> [AZURE.NOTE] Make sure that there is sufficient bandwidth available on your VM to drive the disk traffic as explained in the [Using Premium Storage for Disks](#using-premium-storage-for-disks) section earlier in this article. Otherwise, your disk throughput and IOPS will be constrained to lower values based on the VM limits rather than the disk limits mentioned in the previous table.  

Azure maps the disk size (rounded up) to the nearest Premium Storage Disk option as specified in the table. For example, a disk of size 100 GiB is classified as a P10 option and can perform up to 500 IO units per second, and with up to 100 MB per second throughput. Similarly, a disk of size 400 GiB is classified as a P20 option, and can perform up to 2300 IO units per second and up to 150 MB per second throughput.

The input/output (I/O) unit size is 256 KB. If the data being transferred is less than 256 KB, it is considered a single I/O unit. The larger I/O sizes are counted as multiple I/Os of size 256 KB. For example, 1100 KB I/O is counted as five I/O units.

The throughput limit includes writes to the disk as well as reads from that disk that are not served from the cache. For example, the sum of non-cache reads and writes should be smaller or equal to 100 MB per second for a P10 disk.  Similarly, a single P10 disk can have either 100 MB per second of non-cache reads or 100 MB per second of writes, or 60 MB per second of reads with 40 MB per second of writes as an example.

When you create your disks in Azure, select the most appropriate Premium Storage disk offering based on the needs of your application in terms of capacity, performance, scalability, and peak loads.

> [AZURE.NOTE] You can easily increase the size of existing disks. For example, if you wish to increase the size of a 30 GB disk to 128GB or to 1 TB. Or, if you wish to convert your P20 disk to a P30 disk because you need more capacity or more IOPS and throughput. You can expand the disk using “Update-AzureDisk” PowerShell commandlet with “-ResizedSizeInGB” property. For performing this action, disk needs to be detached from the VM or the VM needs to be stopped.  

The following table describes the scalability targets for Premium storage accounts:

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

For more information, see [Azure Storage Scalability and Performance Targets](http://msdn.microsoft.com/library/azure/dn249410.aspx).

## Throttling when using Premium Storage
You may see throttling if your application’s IOPS or throughput exceed the allocated limits for a Premium Storage disk or if your total disk traffic across all disks on the VM exceeds the disk bandwidth limit available for the VM. To avoid throttling, we recommend that you limit the number of pending I/O requests for disk based on based on the scalability and performance targets for the disk you have provisioned and based on the disk bandwidth available to the VM.  

Your application can achieve the lowest latency when it is designed to avoid throttling. On the other hand, if the number of pending I/O requests for the disk is too small, your application cannot take advantage of the maximum IOPS and throughput levels that are available to the disk.

The following examples demonstrate how to calculate the throttling levels:

### Example 1:
Your application has done 495 I/Os of 16 KB disk size (, which is equal to 495 I/O Units) in one second on a P10 disk. If you try a 2 MB I/O in the same second, the total of I/O units is equal to 495 + 8. This is because 2 MB I/O results in 2048 KB / 256 KB = 8 I/O Units when the I/O unit size is 256 KB. Since the sum of 495 + 8 exceeds the 500 IOPS limit for the disk, throttling occurs.

### Note:
All calculations are based on the I/O unit size of 256 KB.

### Example 2:
Your application has done 400 I/Os of 256 KB disk size on a P10 disk. The total bandwidth consumed is (400 * 256) / 1024 = 100 MB/sec. Note that 100 MB per second is the throughput limit of a P10 disk. If your application tries to perform more I/O in that second, it gets throttled because it exceeds the allocated limit.

### Example 3:
You have a DS4 VM with two P30 disks attached. Each P30 disk is capable of 200 MB per second throughput. However, a DS4 VM has a total disk bandwidth capacity of 256 MB per second. Therefore, you cannot drive the attached disks to the maximum throughput on this DS4 VM at the same time. To resolve this, you can sustain traffic of 200 MB per second on one disk and 56 MB per second on the other disk. If the sum of your disk traffic goes over 256 MB per second, the disk traffic gets throttled.

### Note:
If the disk traffic mostly consists of small I/O sizes, it is highly likely that your application will hit the IOPS limit before the throughput limit. On the other hand, if the disk traffic mostly consists of large I/O sizes, it is highly likely that your application will hit the throughput limit instead of the IOPS limit. You can maximize your application’s IOPS and throughput capacity by using optimal I/O sizes and also by limiting the number of pending I/O requests for disk.

## Snapshots and Copy Blob when using Premium Storage
You can create a snapshot for Premium Storage in the same way as you create a snapshot when using Standard Storage. Since Premium Storage is locally redundant, we recommend that you create snapshots and then copy those snapshots to a geo-redundant standard storage account. For more information, see [Azure Storage Redundancy Options](http://msdn.microsoft.com/library/azure/dn727290.aspx).

If a disk is attached to a VM, certain API operations are not permitted on the page blob backing the disk. For example, you cannot perform a [Copy Blob](http://msdn.microsoft.com/library/azure/dd894037.aspx) operation on that blob as long as the disk is attached to a VM. Instead, first create a snapshot of that blob by using the [Snapshot Blob](http://msdn.microsoft.com/library/azure/ee691971.aspx) REST API method, and then perform the [Copy Blob](http://msdn.microsoft.com/library/azure/dd894037.aspx) of the snapshot to copy the attached disk. Alternatively, you can detach the disk and then perform any necessary operations on the underlying blob.

### Important Notes:

- If the copy blob operation on Premium Storage overwrites an existing blob at the destination, the blob being overwritten must not have any snapshots.  A copy within or between premium storage accounts require that the destination blob does not have snapshots when initiating the copy.
- The number of snapshots for a single blob is limited to 100. A snapshot can be taken every 10 minutes at most.
- 10 TB is the maximum capacity for snapshots per Premium Storage account. Note that the snapshot capacity is the unique data that exists in the snapshots. In other words, the snapshot capacity does not include the base blob size.
- In order to copy a snapshot from a premium storage account to another account, you have to first do a CopyBlob of the snapshot to create a new blob in the same premium storage account. Then you can copy the new blob to other storage accounts. You can delete the intermediate blob after the copy finishes. Follow this process to copy snapshots from a premium storage account to a geo-redundant standard storage account by using AzCopy or Copy Blob. For more information, see [How to use AzCopy with Microsoft Azure Storage](storage-use-azcopy.md) and [Copy Blob](http://msdn.microsoft.com/library/azure/dd894037.aspx).
- For detailed information on performing REST operations against page blobs in Premium Storage accounts, see [Using Blob Service Operations with Azure Premium Storage](http://go.microsoft.com/fwlink/?LinkId=521969) in the MSDN library.

## Using Linux VMs with Premium Storage
Please refer to important instructions below for configuring your Linux VMs on Premium Storage:

- For all Premium Storage disks with cache setting as either “ReadOnly” or “None”, you must disable “barriers” while mounting the file system in order to achieve the scalability targets for Premium Storage. You do not need barriers for this scenario because the writes to Premium Storage backed disks are durable for these cache settings. When the write request successfully completes, data has been written to the persistent store. Please use the following methods for disabling “barriers” depending on your file system:
	- If you use **reiserFS**, disable barriers using the mount option “barrier=none” (For enabling barriers, use “barrier=flush”)
	- If you use **ext3/ext4**, disable barriers using the mount option “barrier=0” (For enabling barriers, use “barrier=1”)
	- If you use **XFS**, disable barriers using the mount option “nobarrier” (For enabling barriers, use the option “barrier”)

- For Premium Storage disks with cache setting “ReadWrite”, barriers should be enabled for durability of writes.

Following are the Linux Distributions that we validated with Premium Storage. We recommend that you upgrade your VMs to at least one of these versions (or later) for better performance and stability with Premium Storage. Also, some of the versions require the latest LIS (Linux Integration Services v4.0 for Microsoft Azure). Please follow the link provided below for download and installation. We will continue to add more images to the list as we complete additional validations. Please note, our validations showed that performance varies for these images, and it also depends on workload characteristics and settings on the images. Different images are tuned for different kinds of workload.
<table border="1" cellspacing="0" cellpadding="5" style="border: 1px solid #000000;">
<tbody>
<tr>
	<td><strong>Distribution</strong></td>
	<td><strong>Version</strong></td>
	<td><strong>Supported Kernel</strong></td>
	<td><strong>Supported Image</strong></td>
</tr>
<tr>
	<td rowspan="4"><strong>Ubuntu</strong></td>
	<td>12.04</td>
	<td>3.2.0-75.110</td>
	<td>Ubuntu-12_04_5-LTS-amd64-server-20150119-en-us-30GB</td>
</tr>
<tr>
	<td>14.04</td>
	<td>3.13.0-44.73</td>
	<td>Ubuntu-14_04_1-LTS-amd64-server-20150123-en-us-30GB</td>
</tr>
<tr>
	<td>14.10</td>
	<td>3.16.0-29.39</td>
	<td>Ubuntu-14_10-amd64-server-20150202-en-us-30GB</td>
</tr>
<tr>
	<td>15.04</td>
	<td>3.19.0-15</td>
	<td>Ubuntu-15_04-amd64-server-20150422-en-us-30GB</td>
</tr>
<tr>
	<td><strong>SUSE</strong></td>
	<td>SLES 12</td>
	<td>3.12.36-38.1</td>
	<td>suse-sles-12-priority-v20150213<br>suse-sles-12-v20150213</td>
</tr>
<tr>
	<td><strong>CoreOS</strong></td>
	<td>584.0.0</td>
	<td>3.18.4</td>
	<td>CoreOS 584.0.0</td>
</tr>
<tr>
	<td rowspan="2"><strong>CentOS</strong></td>
	<td>6.5, 6.6, 7.0</td>
	<td></td>
	<td><a href="http://go.microsoft.com/fwlink/?LinkID=403033&clcid=0x409"> LIS 4.0 Required </a></td>
</tr>
<tr>
	<td>7.1</td>
	<td>3.10.0-229.1.2.el7</td>
	<td><a href="http://go.microsoft.com/fwlink/?LinkID=403033&clcid=0x409"> LIS 4.0 Recommended </a></td>
</tr>

<tr>
	<td rowspan="2"><strong>Oracle</strong></td>
	<td>6.4</td>
	<td></td>
	<td><a href="http://go.microsoft.com/fwlink/?LinkID=403033&clcid=0x409"> LIS 4.0 Required </a></td>
</tr>
<tr>
	<td>7.0</td>
	<td></td>
	<td>Contact Support for details</td>
</tr>
</tbody>
</table>


## Pricing and Billing when using Premium Storage
When using Premium Storage, the following billing considerations apply:

- Billing for a Premium Storage disk depends on the provisioned size of the disk. Azure maps the disk size (rounded up) to the nearest Premium Storage Disk option as specified in the table given in the [Scalability and Performance Targets when using Premium Storage](#scalability-and-performance-targets-when-using-premium-storage) section. Billing for any provisioned disk is prorated hourly using the monthly price for the Premium Storage offer. For example, if you provisioned a P10 disk and deleted it after 20 hours, you are billed for the P10 offering prorated to 20 hours. This is regardless of the amount of actual data written to the disk or the IOPS/throughput used.
- Snapshots on Premium Storage are billed for the additional capacity used by the snapshots. For information on snapshots, see [Creating a Snapshot of a Blob](http://msdn.microsoft.com/library/azure/hh488361.aspx).
- [Outbound data transfers](http://azure.microsoft.com/pricing/details/data-transfers/) (data going out of Azure data centers) incur billing for bandwidth usage.

For detailed information on pricing for Premium Storage and DS-series VMs, see:

- [Azure Storage Pricing](http://azure.microsoft.com/pricing/details/storage/)
- [Virtual Machines Pricing](http://azure.microsoft.com/pricing/details/virtual-machines/)

## Create and use a Premium Storage account for a virtual machine data disk

This section demonstrates how to create a Premium Storage account using the Azure Preview Portal, Azure PowerShell, and the Azure Cross-Platform Command-Line Interface. In addition, it demonstrates a sample use case for premium storage accounts: creating a virtual machine and attaching a data disk to a virtual machine when using Premium Storage.

### Create an Azure virtual machine using Premium Storage via the Azure Preview Portal

This section shows how to create a Premium Storage account using the Azure Preview Portal.

1.	Sign in to the [Azure Preview Portal](https://portal.azure.com/). Check out the [Free Trial](http://azure.microsoft.com/pricing/free-trial/) offer if you do not have a subscription yet.


    > [AZURE.NOTE] If you log in to the Azure Management Portal, click your user account name at the top right corner of the portal. Then, click **Switch to new portal**.


2.	On the Hub menu, click **New**.

3.	Under **New**, click **Everything**. Select **Storage, cache, +backup**. From there, click **Storage** and then click **Create**.

4.	On the Storage Account blade, type a name for your storage account. Click **Pricing Tier**. On the **Recommended pricing tiers** blade, click **Browse All Pricing Tiers**. On the **Choose your pricing tier** blade, choose **Premium Locally Redundant**. Click **Select**. Note that the **Storage account** blade shows **Standard-GRS** as the **Pricing Tier** by default. After you click **Select**, the **Pricing Tier** is shown as **Premium-LRS**.

	![Pricing Tier][Image1]


5.	On the **Storage Account** blade, keep the default values for **Resource Group**, **Subscription**, **Location**, and **Diagnostics**. Click **Create**.

For a complete walk-through inside an Azure environment, see [Create a Virtual Machine Running Windows in the Azure Preview Portal](virtual-machines-windows-tutorial-azure-preview.md).

### Create an Azure virtual machine using Premium Storage via Azure PowerShell
This PowerShell example shows how to create a new Premium Storage account and attach a data disk that uses that account to a new Azure virtual machine.

1. Setup your PowerShell environment by following the steps given at [How to install and configure Azure PowerShell](install-configure-powershell.md).
2. Start the PowerShell console, connect to your subscription, and run the following PowerShell cmdlet in the console window. As seen in this PowerShell statement, you need to specify the **Type** parameter as **Premium_LRS** when you create a premium storage account.

		New-AzureStorageAccount -StorageAccountName "yourpremiumaccount" -Location "West US" -Type "Premium_LRS"

3. Next, create a new DS-Series VM and specify that you want Premium Storage by running the following PowerShell cmdlets in the console window:

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

4. If you want more disk space for your VM, attach a new data disk to an existing DS-series VM after it is created by running the following PowerShell cmdlets in the console window:

    	$storageAccount = "yourpremiumaccount"
    	$vmName ="yourVM"
    	$vm = Get-AzureVM -ServiceName $vmName -Name $vmName
    	$LunNo = 1
    	$path = "http://" + $storageAccount + ".blob.core.windows.net/vhds/" + "myDataDisk_" + $LunNo + "_PIO.vhd"
    	$label = "Disk " + $LunNo
    	Add-AzureDataDisk -CreateNew -MediaLocation $path -DiskSizeInGB 128 -DiskLabel $label -LUN $LunNo -HostCaching ReadOnly -VM $vm | Update-AzureVm

### Create an Azure virtual machine using Premium Storage via the Azure Cross-Platform Command-Line Interface

The [Azure Cross-Platform Command-Line Interface](xplat-cli.md)(xplat-cli) provides a provides a set of open source, cross-platform commands for working with the Azure Platform. The following examples show how to use xplat-cli (version 0.8.14 and later) to create a premium storage account, a new virtual machine, and attach a new data disk from a Premium Storage account.

#### Create a premium storage account

````
azure storage account create "premiumtestaccount" -l "west us" --type PLRS
````

#### Create a DS-series virtual machine

	azure vm create -z "Standard_DS2" -l "East US 2" -e 22 "premium-test-vm"
		"b39f27a8b8c64d52b05eac6a62ebad85__Ubuntu-14_10-amd64-server-20150202-en-us-30GB" -u "myusername" -p "passwd@123"

#### Display information about the virtual machine

	azure vm show premium-test-vm

#### Attach a new data disk

	azure vm disk attach-new premium-test-vm 20 https://premiumstorageaccount.blob.core.windows.net/vhd-store/data1.vhd

#### Display information about the new data disk

	azure vm disk show premium-test-vm-premium-test-vm-0-201502210429470316

## Next steps

[Using Blob Service Operations with Azure Premium Storage](http://go.microsoft.com/fwlink/?LinkId=521969)

[Create a Virtual Machine Running Windows](virtual-machines-windows-tutorial-azure-preview.md)

[Virtual Machine and Cloud Service Sizes for Azure](http://msdn.microsoft.com/library/azure/dn197896.aspx)

[Storage Documentation](http://azure.microsoft.com/documentation/services/storage/)

[MSDN Reference](http://msdn.microsoft.com/library/azure/gg433040.aspx)

[Image1]: ./media/storage-premium-storage-preview-portal/Azure_pricing_tier.png
