<properties urlDisplayName="Learn Azure Premium Storage for Disks" pageTitle="Premium Storage: High-Performance Storage for Azure Virtual Machine Workloads" metaKeywords="Azure Storage, Premium, Storage Account, Page blobs" description="Learn Azure Premium Storage for Disks. Learn how to create a Premium Storage account." metaCanonical="" services="storage" documentationCenter="" title="Premium Storage: High-Performance Storage for Azure Virtual Machine Workloads" authors="selcint" solutions="data-management" manager="adinah" editor="tysonn" />

<tags ms.service="storage" ms.workload="storage" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="12/08/2014" ms.author="selcint" />


# Premium Storage: High-Performance Storage for Azure Virtual Machine Workloads

Welcome to the Public Preview of **Azure Premium Storage for Disks**!

With the introduction of new Premium Storage, Microsoft Azure now offers two types of durable storage: **Premium Storage** and **Standard Storage**. Premium Storage stores data on the latest technology Solid State Drives (SSDs) whereas Standard Storage stores data on Hard Disk Drives (HDDs). 

Premium Storage delivers high-performance, low-latency disk support for I/O intensive workloads running on Azure Virtual Machines. You can attach several Premium Storage disks to a virtual machine (VM). With Premium Storage, your applications can have up to 32 TB of storage per VM and achieve 50,000 IOPS (input/output operations per second) per VM with extremely low latencies for read operations. Premium Storage is currently available only for storing data on disks used by Azure Virtual Machines. 

To sign up for the Azure Premium Storage preview, visit the [Azure Preview](http://azure.microsoft.com/services/preview/) page.

This article provides an in-depth overview of Azure Premium Storage.

**Table of contents:**


* [Important Things to Know About Premium Storage](#important)

* [Using Premium Storage for Disks](#using)

* [Scalability and Performance Targets when using Premium Storage](#scale)	

* [Throttling when using Premium Storage](#throttling)	

* [Snapshots and Copy Blob when using Premium Storage](#restapi)	

* [Pricing and Billing when using Premium Storage](#pricing)	

* [Creating and using Premium Storage Account for Disks](#howto1)	

* [Additional Resources](#see)

###<a id="important">Important Things to Know About Premium Storage</a>


The following is a list of important things to consider before or when using Premium Storage:

- To use Premium Storage, you need to have a Premium Storage account. To learn how to create a Premium Storage account, see [Creating and using Premium Storage Account for Disks](#howto1).

- Premium Storage is currently available in the [Microsoft Azure Preview Portal](https://portal.azure.com/), accessible via the [Azure PowerShell](http://azure.microsoft.com/documentation/articles/install-configure-powershell/) version 0.8.10 or later; and [Service Management REST API](http://msdn.microsoft.com/library/azure/ee460799.aspx) version 2014-10-01 or later. 

- Premium Storage is available for limited preview in the following regions: West US, East US 2, and West Europe.

- Premium Storage supports only Azure page blobs, which are used to hold persistent disks for Azure Virtual Machines (VMs). For information on Azure page blobs, see [Understanding Block Blobs and Page Blobs](http://msdn.microsoft.com/library/azure/ee691964.aspx). Premium Storage does not support the Azure Block Blobs, Azure Files, Azure Tables, or Azure Queues.

- A Premium Storage account is locally redundant (LRS) and keeps three copies of the data within a single region.  For considerations regarding geo replication when using Premium Storage, see the [Snapshots and Copy Blob when using Premium Storage](#restapi) section in this article.

- If you want to use a Premium Storage account for your VM disks, you need to use the DS-series of VMs. You can use both Standard and Premium storage disks with DS-series of VMs. But you cannot use Premium Storage disks with non-DS-series of VMs. For information on available Azure VM disk types and sizes, see [Virtual Machine and Cloud Service Sizes for Azure](http://msdn.microsoft.com/library/azure/dn197896.aspx). 

- The process for setting up Premium Storage disks for a VM is similar to the Standard Storage disks. You need to choose the most appropriate Premium Storage option for your Azure disks and VM. The VM size should be suitable for your workload based on the performance characteristics of the Premium offerings. For more information, see [Scalability and Performance Targets when using Premium Storage](#scale).
 
- A premium storage account cannot be mapped to a custom domain name.

- Storage analytics is not currently supported for Premium Storage.

###<a id="using">Using Premium Storage for Disks</a>
You can use Premium Storage for Disks in one of two ways:

- Create a new premium storage account first and then use it when creating the VM.
- Create a new DS-series VM. While creating the VM, you can select a previously created Premium Storage account, create a new one, or let the Azure Portal to create a default premium account.

Azure uses the storage account as a container for your operating system and data disks. In other words, if you create an Azure DS-series VM and select an Azure Premium Storage account, your operating system and data disks are stored in that storage account.

To leverage the benefits of Premium Storage, create a Premium Storage account using an account type of *Premium_LRS* first. To do this, you can use the [Microsoft Azure Preview Portal](https://portal.azure.com/), [Azure PowerShell](http://azure.microsoft.com/documentation/articles/install-configure-powershell/), or the [Service Management REST API](http://msdn.microsoft.com/library/azure/ee460799.aspx). For step-by-step instructions, see [Creating and using Premium Storage Account for Disks](#howto1).

<h4>Important notes:</h4>

- To learn the capacity and bandwidth preview limits for Premium Storage accounts, see the [Scalability and Performance Targets when using Premium Storage](#scale) section. If the needs of your application exceed the scalability targets of a single storage account, build your application to use multiple storage accounts, and partition your data across those storage accounts. For example, if you want to attach 51 TB disks across a number of VMs, spread them across two storage accounts since 32 TB is the limit for a single Premium storage account.
- 	By default, disk caching policy is "Read-Only" for all the Premium disks attached to the VM. This configuration setting is recommended to achieve the optimal read performance for your application’s I/Os. For write-heavy or write-only disks (such as SQL Server log files), disable disk caching so that you can achieve better application performance.  
- 	Make sure that there is sufficient bandwidth available on your VM to drive the disk traffic. To learn the disk bandwidth available for each VM size, see [Virtual Machine and Cloud Service Sizes for Azure](http://msdn.microsoft.com/library/azure/dn197896.aspx).
-	You can use both Premium and Standard storage disks in the same DS-series VM.


###<a id="scale">Scalability and Performance Targets when using Premium Storage</a>
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
	<td>128 GB</td>
	<td>512 GB</td>
	<td>1024 GB (1 TB)</td>
</tr>
<tr>
	<td><strong>IOPS per disk</strong></td>
	<td>500</td>
	<td>2300</td>
	<td>5000</td>
</tr>
<tr>
	<td><strong>Throughput per disk</strong></td>
	<td>100 MB per second</td>
	<td>150 MB per second</td>
	<td>200 MB per second</td>
</tr>
</tbody>
</table>

Azure maps the disk size (rounded up) to the nearest Premium Storage Disk option as specified in the table. For example, a disk of size 100 GB is classified as a P10 option and can perform up to 500 IO units per second, and with up to 100 MB per second throughput. Similarly, a disk of size 400 GB is classified as a P20 option, and can perform up to 2300 IO units per second and up to 150 MB per second throughput.

The input/output (I/O) unit size is 256 KB. If the data being transferred is less than 256 KB, it is considered a single I/O unit. The larger I/O sizes are counted as multiple I/Os of size 256 KB. For example, 1100 KB I/O is counted as five I/O units.

The throughput limit includes both reads and writes to the disk. For example, the sum of reads and writes should be smaller or equal to 100 MB per second for a P10 disk.  Similarly, a single P10 disk can have either 100 MB per second of reads or 100 MB per second of writes, or 60 MB per second of reads with 40 MB per second of writes as an example.
 
When you create your disks in Azure, select the most appropriate Premium Storage disk offering based on the needs of your application in terms of capacity, performance, scalability, and peak loads.

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
       <li type=round>Disk capacity: 32 TB</li>
       <li type=round>Snapshot capacity: 10 TB</li>
    </ul>
	</td>
	<td>Up to 50 gigabits per second for Inbound + Outbound</td>
</tr>
</tbody>
</table>

- Inbound refers to all data (requests) being sent to a storage account.
- Outbound refers to all data (responses) being received from a storage account.

For more information, see [Azure Storage Scalability and Performance Targets](http://msdn.microsoft.com/library/dn249410.aspx).


###<a id="throttling">Throttling when using Premium Storage</a>
You may see throttling if your application’s IOPS or throughput exceed the allocated limits for a Premium Storage disk. To avoid throttling, we recommend that you limit the number of pending I/O requests for disk based on based on the scalability and performance targets for the disk you have provisioned.  

Your application can achieve the lowest latency when it is designed to avoid throttling. On the other hand, if the number of pending I/O requests for the disk is too small, your application cannot take advantage of the maximum IOPS and throughput levels that are available to the disk.

The following examples demonstrate how to calculate the throttling levels:

<h4>Example 1:</h4>
Your application has done 495 I/Os of 16 KB disk size (, which is equal to 495 I/O Units) in one second on a P10 disk. If you try a 2 MB I/O in the same second, the total of I/O units is equal to 495 + 8. This is because 2 MB I/O results in 2048 KB / 256 KB = 8 I/O Units when the I/O unit size is 256 KB. Since the sum of 495 + 8 exceeds the 500 IOPS limit for the disk, throttling occurs and you get an error. 

<h4>Note:</h4> 
All calculations are based on the I/O unit size of 256 KB.

<h4>Example 2:</h4>
Your application has done 400 I/Os of 256 KB disk size on a P10 disk. The total bandwidth consumed is (400 * 256) / 1024 = 100 MB/sec. Note that 100 MB per second is the throughput limit of P10 disk. If your application tries to perform more I/O in that second, it gets throttled because it exceeds the allocated limit.

<h4>Note:</h4>
If the disk traffic mostly consists of small I/O sizes, it is highly likely that your application will hit the IOPS limit before the throughput limit. On the other hand, if the disk traffic mostly consists of large I/O sizes, it is highly likely that your application will hit the throughput limit instead of the IOPS limit. You can maximize your application’s IOPS and throughput capacity by using optimal I/O sizes and also by limiting the number of pending I/O requests for disk.


###<a id="restapi">Snapshots and Copy Blob when using Premium Storage</a>
You can create a snapshot for Premium Storage in the same way as you create a snapshot when using Standard Storage. Since Premium Storage is locally redundant, we recommend that you create snapshots and then copy those snapshots to a geo-redundant standard storage account. For more information, see [Azure Storage Redundancy Options](http://msdn.microsoft.com/library/azure/dn727290.aspx).

If a disk is attached to a VM, certain API operations are not permitted on the page blob backing the disk. For example, you cannot perform a [Copy Blob](http://msdn.microsoft.com/library/azure/dd894037.aspx) operation on that blob as long as the disk is attached to a VM. Instead, first create a snapshot of that blob by using the [Snapshot Blob](http://msdn.microsoft.com/library/azure/ee691971.aspx) REST API method, and then perform the [Copy Blob](http://msdn.microsoft.com/library/azure/dd894037.aspx) of the snapshot to copy the attached disk. Alternatively, you can detach the disk and then perform any necessary operations on the underlying blob.

<h4>Important Notes:</h4>

- If the copy blob operation on Premium Storage overwrites an existing blob at the destination, the blob being overwritten must not have any snapshots.  A copy within or between premium storage accounts require that the destination blob does not have snapshots when initiating the copy.
- The number of snapshots for a single blob is limited to 100. A snapshot can be taken every 10 minutes at most.
- 10 TB is the maximum capacity for snapshots per Premium Storage account. Note that the snapshot capacity is the unique data that exists in the snapshots. In other words, the snapshot capacity does not include the base blob size.
- You can copy snapshots from a premium storage account to a geo-redundant standard storage account by using AzCopy or Copy Blob. For more information, see [How to use AzCopy with Microsoft Azure Storage](http://azure.microsoft.com/documentation/articles/storage-use-azcopy/) and [Copy Blob](http://msdn.microsoft.com/library/azure/dd894037.aspx).
- For detailed information on performing REST operations against page blobs in Premium Storage accounts, see [Using Blob Service Operations with Azure Premium Storage](http://go.microsoft.com/fwlink/?LinkId=521969) in the MSDN library.


###<a id="pricing">Pricing and Billing when using Premium Storage</a>
When using Premium Storage, the following billing considerations apply:

- Billing for a Premium Storage disk depends on the provisioned size of the disk. Azure maps the disk size (rounded up) to the nearest Premium Storage Disk option as specified in the table given in the [Scalability and Performance Targets when using Premium Storage](#scale) section. Billing for any provisioned disk is prorated hourly using the monthly price for the Premium Storage offer. For example, if you provisioned a P10 disk and deleted it after 20 hours, you are billed for the P10 offering prorated to 20 hours. This is regardless of the amount of actual data written to the disk or the IOPS/throughput used.
- Snapshots on Premium Storage are billed for the additional capacity used by the snapshots. For information on snapshots, see [Creating a Snapshot of a Blob](http://msdn.microsoft.com/library/azure/hh488361.aspx).
- [Outbound data transfers](http://azure.microsoft.com/pricing/details/data-transfers/) (data going out of Azure data centers) incur billing for bandwidth usage. 

For detailed information on pricing for Premium Storage and DS-series VMs, see:

- [Azure Storage Pricing](http://azure.microsoft.com/pricing/details/storage/)
- [Virtual Machines Pricing](http://azure.microsoft.com/pricing/details/virtual-machines/)

###<a id="howto1">Creating and using Premium Storage Account for Disks</a>
This section demonstrates how to create a Premium Storage account using Azure Preview Portal and Azure PowerShell. In addition, it demonstrates a sample use case for premium storage accounts: creating a virtual machine and attaching a data disk to a virtual machine when using Premium Storage.

In this section:

* [Azure Preview Portal: Create a Premium Storage account](#howto3)	

* [Azure PowerShell: Create a Premium Storage account and use it for basic VM operations](#howto2)	
 
###<a id="howto3">Azure Preview Portal: Create a Premium Storage account</a>
This section shows how to create a Premium Storage account using Azure Preview Portal.

1.	Sign in to the [Azure Preview Portal](https://portal.azure.com/). Check out the [Free Trial](http://www.windowsazure.com/pricing/free-trial/) offer if you do not have a subscription yet. 


    >[WACOM.NOTE] If you log in to the Azure Management Portal, click your account email address at the top right corner. Then, click **Switch to new portal**.
        

2.	On the Hub menu, click **New**.

3.	Under **New**, click **Everything**. Select **Storage, cache, +backup**. From there, click **Storage** and then click **Create**.

4.	On the Storage Account blade, type a name for your storage account. Click **Pricing Tier**. On the **Recommended pricing tiers** blade, click **Browse All Pricing Tiers**. On the **Choose your pricing tier** blade, choose **Premium Locally Redundant**. Click **Select**. Note that the **Storage account** blade shows **Standard-GRS** as the **Pricing Tier** by default. After you click **Select**, the **Pricing Tier** is shown as **Premium-LRS**.
	
	![Pricing Tier][Image1]

	
5.	On the **Storage Account** blade, keep the default values for **Resource Group**, **Subscription**, **Location**, and **Diagnostics**. Click **Create**.

For a complete walkthrough inside an Azure environment, see [Create a Virtual Machine Running Windows in the Azure Preview Portal](http://azure.microsoft.com/documentation/articles/virtual-machines-windows-tutorial-azure-preview/).

###<a id="howto2">Azure PowerShell: Create a Premium Storage account and use it for basic VM operations</a>
This section shows how to create a Premium Storage account and how to use it while creating a virtual machine and attaching a data disk to a VM using Azure PowerShell.

1. Setup your PowerShell environment by following the steps given at [How to install and configure Azure PowerShell](http://azure.microsoft.com/en-us/documentation/articles/install-configure-powershell/).
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

###<a id="see">Additional Resources</a>
[Using Blob Service Operations with Azure Premium Storage](http://go.microsoft.com/fwlink/?LinkId=521969)

[Create a Virtual Machine Running Windows](http://azure.microsoft.com/documentation/articles/virtual-machines-windows-tutorial-azure-preview/)

[Virtual Machine and Cloud Service Sizes for Azure](http://msdn.microsoft.com/library/azure/dn197896.aspx)

[Storage Documentation](http://azure.microsoft.com/documentation/services/storage/)

[MSDN Reference](http://msdn.microsoft.com/library/azure/gg433040.aspx)

[Image1]: ./media/storage-premium-storage-preview-portal/Azure_pricing_tier.png
