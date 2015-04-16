<properties 
    pageTitle="Migrating to Azure Premium Storage | Microsoft Azure" 
    description="Migrate to Azure Premium Storage for high-performance, low-latency disk support for I/O intensive workloads running on Azure Virtual Machines. " 
    services="storage" 
    documentationCenter="na" 
    authors="tamram" 
    manager="adinah" 
    editor=""/>

<tags 
    ms.service="storage" 
    ms.workload="storage" 
    ms.tgt_pltfrm="na" 
    ms.devlang="na" 
    ms.topic="article" 
    ms.date="04/14/2015" 
    ms.author="tamram"/>


# Migrating to Azure Premium Storage

## Overview

Premium Storage stores data on the latest technology Solid State Drives (SSDs), delivers high-performance, low-latency disk support for I/O intensive workloads running on Azure Virtual Machines. With Premium Storage, your applications can have up to 32 TB of storage per VM and achieve 50,000 IOPS (input/output operations per second) per VM with extremely low latencies for read operations. This article gives you a guideline on how to migrate your disks, Virtual Machines (VMs) from on-premises or Standard Storage or a different cloud platform to Azure Premium Storage. To get a detailed overview of the Azure Premium Storage offering check out Premium Storage: [High-Performance Storage for Azure Virtual Machine Workloads](storage-premium-storage-preview-portal.md).

## Before You Begin 

### Prerequisites
- You will need an Azure subscription. If you don’t have one, you can create a one month [free trial](http://azure.microsoft.com/pricing/free-trial/) subscription or visit [Azure Pricing](http://azure.microsoft.com/pricing/) for more options. 
- To execute PowerShell cmdlets you will need the Microsoft Azure PowerShell module. See [Microsoft Azure Downloads](http://azure.microsoft.com/downloads/) to download the module.
- When you plan to use Azure VMs running on Premium Storage, you need to use the DS-series VMs. You can use both Standard and Premium Storage disks with DS-series VMs. Premium storage disks will be available with more VM types in the future. For more information on all available Azure VM disk types and sizes, see [Virtual Machine and Cloud Service Sizes for Azure](http://msdn.microsoft.com/library/azure/dn197896.aspx). 

### Considerations 

#### VM sizes 
Summarized below are the DS-series VM sizes and their characteristics. Review the performance characteristics of these Premium Storage offerings and choose the most appropriate option for your Azure disks and VM that best suits your workload. Make sure that there is sufficient bandwidth available on your VM to drive the disk traffic.

|VM Size|CPU cores|Max. IOPS|Max. Disk Bandwidth|
|:---:|:---:|:---:|:---:|
|**STANDARD_DS1**|1|3,200|32 MB per second|
|**STANDARD_DS2**|2|6,400|64 MB per second|
|**STANDARD_DS3**|4|12,800|128 MB per second|
|**STANDARD_DS4**|8|25,600|256 MB per second|
|**STANDARD_DS11**|2|6,400|64 MB per second|
|**STANDARD_DS12**|4|12,800|128 MB per second|
|**STANDARD_DS13**|8|25,600|256 MB per second|
|**STANDARD_DS14**|16|50,000|512 MB per second|

#### Disk sizes 
There are three types of disks that can be used with your VM and each has specific IOPs and throughout limits. Take into consideration these limits when choosing the disk type for your VM based on the needs of your application in terms of capacity, performance, scalability, and peak loads.

|Premium Storage Disk Type|P10|P20|P30|
|:---:|:---:|:---:|:---:|
|Disk size|128 GB|512 GB|1024 GB (1 TB)|
|IOPS per disk|500|2300|5000|
|Throughput per disk|100 MB per second|150 MB per second|200 MB per second|

#### Storage Account Scalability Targets

Premium Storage accounts have following scalability targets in addition to the [Azure Storage Scalability and Performance Targets](http://msdn.microsoft.com/library/azure/dn249410.aspx). If your application requirements exceed the scalability targets of a single storage account, build your application to use multiple storage accounts, and partition your data across those storage accounts.

|Total Account Capacity|Total Bandwidth for a Locally Redundant Storage Account|
|:--|:---|
|Disk capacity: 35TB<br />Snapshot capacity: 10 TB|Up to 50 gigabits per second for Inbound + Outbound|

For the more information on Premium Storage specifications, check out [Scalability and Performance Targets when using Premium Storage](storage-premium-storage-preview-portal.md#scalability-and-performance-targets-when-using-premium-storage)

#### Additional Data Disks 
Depending on your workload, determine if additional data disks are necessary for your VM. You can attach several persistent data disks to your VM. If needed, you can stripe across the disks to increase the capacity and performance of the volume. If you stripe Premium Storage data disks using [Storage Spaces](http://technet.microsoft.com/library/hh831739.aspx), you should configure it with one column for each disk that is used. Otherwise, overall performance of the striped volume may be lower than expected due to uneven distribution of traffic across the disks. For Linux VMs you can use mdadm utility to achieve the same. See article [Configure Software RAID on Linux](virtual-machines-linux-configure-raid.md) for details.

#### Disk Caching Policy 
By default, disk caching policy is "Read-Only" for all the Premium data disks, and "Read-Write" for the Premium operating system disk attached to the VM. This configuration setting is recommended to achieve the optimal performance for your application’s IOs. For write-heavy or write-only data disks (such as SQL Server log files), disable disk caching so that you can achieve better application performance. The cache settings for existing data disks can be updated using Azure Portal or the *-HostCaching* parameter of the *Set-AzureDataDisk* cmdlet.

#### Location 
Pick a location where Azure Premium Storage is available. See [Important Things to know about Premium Storage](storage-premium-storage-preview-portal.md#important-things-to-know-about-premium-storage) for up to date information on available locations. VMs located in the same region as the Storage account that stores the disks for VM, will give superior performance than if they are in separate regions. 

#### Other Azure VM configuration settings 

When creating an Azure VM you will be asked to configure certain VM settings. Remember, there are few settings that are fixed for the lifetime of the VM, while you can modify or add others later. Review these Azure VM configuration settings and make sure that these are configured appropriately to match your workload requirements. See [VM configuration settings](https://msdn.microsoft.com/library/azure/dn763935.aspx) for more details.

## Prepare VHDs for Migration 

The following section provides guidelines to prepare VHDs from your VM so they are ready to migrate. The VHD may be:
 
- A generalized operating system image that can be used to create multiple Azure VMs.  
- An operating system disk that can be used with a single Azure virtual machine instance.  
- A data disk that can be attached to an Azure VM for persistent storage.

### Prerequisites

- An Azure subscription, a storage account, and a container in that storage account to copy your VHD to. Note that the destination storage account can be a Standard or Premium Storage account depending on your requirement. 
- A Tool to generalize VHD if you plan to create multiple VM instances from it. For example, sysprep for Windows or virt-sysprep for Ubuntu. A tool to upload the VHD file to the Storage account. For example, [AzCopy](storage-use-azcopy.md) or [Azure storage explorer](http://blogs.msdn.com/b/windowsazurestorage/archive/2014/03/11/windows-azure-storage-explorers-2014.aspx). This guide describes steps using the AzCopy tool. For large amount of data with limited bandwidth, you can consider using the [Microsoft Azure Import/Export service](storage-import-export-service.md) to transfer your data by shipping hard disk drives to an Azure datacenter. Using Import/Export service you can copy data only to a standard storage account. Once the data is in your standard storage account, you will use [copy blob API](https://msdn.microsoft.com/library/azure/dd894037.aspx) or AzCopy to transfer the data to your premium storage account.
- A tool to copy your VHD can be run on an Azure VM in the same region as the VHDs.
- Microsoft Azure only supports fixed size VHD files. VHDX files or dynamic VHDs are not supported. If you have a dynamic VHD, you can convert it to fixed size using the [Convert-VHD](http://technet.microsoft.com/library/hh848454.aspx) cmdlet.

### Preparing VHDs

|Scenario|Steps|
|:---|:---|
|Generalized Operating System VHD to create multiple VM instances|<p>If you are uploading a **VHD that will be used to create multiple generic Azure VM instances**, you must first generalize VHD using a sysprep utility. This applies to a VHD that is on-premise or in the cloud. Sysprep removes any machine specific information from the VHD.</p><p>**Important:** Take a snapshot or backup your VM before generalizing it. Running sysprep will delete the VM instance.</p>Follow steps below to sysprep a Windows OS VHD:<br />Note that running the Sysprep command will require you to shut down the virtual machine. For more information about Sysprep, see [Sysprep Overview](http://technet.microsoft.com/library/hh825209.aspx) or [Sysprep Technical Reference](http://technet.microsoft.com/library/cc766049(v=ws.10).aspx). <ul><li>Open a Command Prompt window as an administrator.</li><li>Enter the following command to open Sysprep:<br />**%windir%\system32\sysprep\sysprep.exe**</li><li>In the System Preparation Tool, select Enter System Out-of-Box Experience (OOBE), select the Generalize check box, select **Shutdown**, and then click **OK**.</li><li>This will generalize the operating system and shut down the system.![][1]</li></ul>For an Ubuntu VM, use virt-sysprep to achieve the same. See [virt-sysprep](http://manpages.ubuntu.com/manpages/precise/man1/virt-sysprep.1.html) for more details. See also some of the open source [Linux Server Provisioning software](http://www.cyberciti.biz/tips/server-provisioning-software.html) for other Linux operating systems.|
|Unique Operating System VHD to create a single VM instance|If you have an application running on the VM which requires the machine specific data, do not generalize the VHD. **A non-generalized VHD can be used to create a unique Azure VM instance.** For example, if you have Domain Controller on your VHD, executing sysprep will make it ineffective as a Domain Controller. Review the applications running on your VM and impact of sysprep on them before generalizing VHD.|
|Data disk VHDs to be attached to VM instance(s)|If you have data disks in a cloud storage to be migrated you must make sure the VMs that use these data disks must be shut down. For data disks that are on-premise, create a consistent VHD.|
Now that the VHD is ready, follow the steps described in next section to upload VHD to Azure Storage and register it as an operating system image, provisioned operating system disk, or provisioned data disk.

## Copy VHDs to Azure Storage

### Source

|Scenario|Steps|
|:---|:---|
|Copying VHD from Azure Storage|If you are migrating VHD between from a Standard Azure storage account to a Premium Azure storage account, you must copy the source path of VHD container, the VHD file name and the storage account key of the source storage account.<ul><li>Go to Azure Portal > Virtual Machines > Disks</li><li>Copy and save the VHD’s container URL from the Location column, https://*AccountName*.blob.core.windows.net/*ContainerName*/</li></ul>|
|Copying VHD from non-Azure Cloud|If you are migrating VHD from non-Azure Cloud Storage to Azure, you must first export the VHD to a local directory. Copy the complete source path of local directory where VHD is stored. <ul><li>If you are using AWS, export the EC2 instance to a VHD in an Amazon S3 bucket. Follow the steps described in [Exporting Amazon EC2 Instances](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ExportingEC2Instances.html) to install the Amazon EC2 command-line interface (CLI) tool and run the command to export the EC2 instance to a VHD file. Be sure to use **VHD** for the DISK_IMAGE_FORMAT variable when running the command. The exported VHD file is saved in the Amazon S3 bucket you designate during that process.</li></ul>![][2]<ul><li>Download the VHD file from the S3 bucket. Select the VHD file > **Actions** > **Download**.</li></ul>![][3]|
|Copying a VHD from On Premise|If you are migrating VHD from an on premise environment, you will need the complete source path where VHD is stored. This could be a server location or file share.

### Destination 

Create a storage account for maintaining your VHDs. Take into account the following points when planning where to store your VHDs.

- The target storage account could be standard or premium storage depending on your application requirement. 
- The storage account location must be same as the DS-series Azure VMs you will create in the final stage. You could copy to a new storage account, or plan to use the same storage account based on your needs.
- Copy and save the storage account key of the destination storage account for the next stage.
- For data disks, you could choose to keep some data disks in a standard storage account (for example, disks that have cooler storage) and some with heavy IOPs in premium storage account.

### Copying a VHD with AzCopy

Using AzCopy you can easily upload the VHD over the Internet. Depending on the size of the VHDs, this may take time. Remember to check the storage account ingress/egress limits when using this option. You can find the Azure Storage Limits [here](azure-subscription-service-limits#storage-limits).  

1. Download and install AzCopy from here: [Latest version of AzCopy](http://aka.ms/downloadazcopy)  
2. Open Azure PowerShell and go to the folder where AzCopy is installed.  
3. Use the following command to copy the VHD file from “Source” to “Destination”. **AzCopy /Source:** *&lt;Source&gt;* **/SourceKey:** *&lt;Source-Storage-Key&gt;* **/Destination:** *&lt;Destination&gt;* **/DestKey:** *&lt;Dest-Storage-Key&gt;* **/BlobType:page /Pattern:** *&lt;File-Name&gt;*  
  - *&lt;Source&gt;:* Location of the folder or storage container URL that contains the VHD.    
 - *&lt;Source-Storage-Key&gt;:* Storage account key of the source storage account.  
 - *&lt;Destination&gt;:* Storage container URL to copy the VHD to.
 - *&lt;Dest-Storage-Key&gt;:* Storage account key of the destination storage account.
 - /BlobType:page: Specifies that the destination is a page blob.
 - *&lt;File-Name&gt;*: The name of VHD file you wish to copy.
 - /Pattern:*&lt;File-Name&gt;:* Specify the file name of the VHD that you are copying.
   
This command will copy all of the files in the *&lt;Source&gt;* to the *&lt;Destination&gt;* container. For details on using AzCopy tool, see Getting Started with the [AzCopy Command-Line Utility](storage-use-azcopy.md).
### Other options for uploading a VHD 

- [Azure Storage Copy Blob API](https://msdn.microsoft.com/library/azure/dd894037.aspx) 
- [Azure Import/Export Service](https://msdn.microsoft.com/library/dn529096.aspx) 

>[AZURE.NOTE]Import/Export can be used to copy to only standard storage account. You will need to copy from standard storage to premium storage account using a tool like AzCopy.  

## Create Azure VMs using Premium Storage

After the VHD is uploaded to the desired storage account, follow the instructions in this section to register the VHD as an OS image, or OS disk depending on your scenario and then create a VM instance from it. The data disk VHD can be attached to the VM once it is created.

### Register VHD
  
In order to create a VM from OS VHD or attach the Data VHD to a new VM, you must first register them. Follow steps below depending on your scenario.  

<table>
<tr>
<th>Scenario</th>
<th>Steps to register VHD</th>
</tr>
<tr>
<td>Generalized Operating System VHD to create multiple Azure VM instances</td>
<td><p>After generalized OS image VHD is uploaded to storage account, register it as an <b>Azure VM Image</b> so that you can create one or more VM instances from it. </p><p>Use the following PowerShell cmdlets to register your VHD as an Azure VM OS image. Provide the complete container URL where VHD was copied to.</p><p><code>Add-AzureVMImage -ImageName "OSImageName" -MediaLocation “https://storageaccount.blob.core.windows.net/vhdcontainer/osimage.vhd” -OS Windows</code></p>Copy and save the name of this new Azure VM Image. In the example above, it is “OSImageName”.</td>
</tr>
</tr>
<td>Unique Operating System VHD to create a single Azure VM instance</td>
<td><p>After the unique OS VHD is uploaded to storage account, register it as an <b>Azure OS Disk</b> so that you can create a VM instance from it.</p><p>Use these PowerShell cmdlets to register your VHD as an Azure OS Disk. Provide the complete container URL where VHD was copied to.</p><code>"https://storageaccount.blob.core.windows.net/vhdcontainer/osdisk.vhd" -Label "OS Disk" -OS "Windows"</code><p>Copy and save the name of this new Azure OS Disk. In the example above, it is “OSDisk”.</p></td>
</tr>
</tr>
<td>Data Disk VHD to be attached to new Azure VM instance(s)</td>
<td><p>After the data disk VHD is uploaded to storage account, register it as an Azure Data Disk so that it can be attached to your new DS Series Azure VM instance.</p><p>Use these PowerShell cmdlets to register your VHD as an Azure Data Disk. Provide the complete container URL where VHD was copied to.</p><code>Add-AzureDisk -DiskName "DataDisk" -MediaLocation "https://storageaccount.blob.core.windows.net/vhdcontainer/datadisk.vhd" -Label "Data Disk"</code><p>Copy and save the name of this new Azure Data Disk. In the example above, it is “DataDisk”.</p></td>
</tr>
</table>

### Create DS-series Azure VM  

Once the OS image or OS disk are registered, a new DS-series Azure VM instance can be created. You will be using the operating system image or operating system disk name that you registered. Select the VM type from the Premium Storage tier. In example below, we are using the “Standard_DS2” VM size.  

>[AZURE.NOTE] Update the disk size to make sure it matches your capacity, performance requirement and the available Azure disk sizes.  

Follow the step by step PowerShell cmdlets below to create the new VM,  

First, set the common parameters:  

	$vmSize ="Standard_DS2"
	$adminName = "youradmin"
	$adminPassword = "yourpassword"
	$vmName ="yourVM"
	$location = "East US 2"  

Second, depending on your scenario create the Azure VM instance from either the OS Image or OS Disk that you registered.

<table>
<tr>
<th>Scenario</th>
<th>Steps</th>
</tr>
<tr>
<td>Generalized Operating System VHD to create multiple Azure VM instances</td>
<td>Create the one or more new DS Series Azure VM instances using the <b>Azure OS Image</b> that you registered. Specify this OS Image name in the VM configuration when creating new VM as shown below,</br></br>
<code>$OSImage = Get-AzureVMImage –ImageName “OSImageName”  
$vm = New-AzureVMConfig -Name "NewVM" -InstanceSize
$vmSize  
-ImageName $OSImage.ImageName</code>
</br></br>
<code>Add-AzureProvisioningConfig -Windows –AdminUserName $adminUser   
-Password $adminPassword –VM $vm  
New-AzureVM -ServiceName "NewVM"</code></td></tr>  
<tr>
<td>Unique Operating System VHD to create a single Azure VM instance</td>
<td>Create a new DS series Azure VM instance using the <b>Azure OS Disk</b> that you registered. Specify this OS Disk name in the VM configuration when creating the new VM as shown below,</br></br>
<code>$OSDisk = Get-AzureDisk –DiskName “OSDisk”  
$vm = New-AzureVMConfig -Name “NewVM” -InstanceSize $vmSize  
-DiskName $OSDisk.DiskName</code>
</br></br>  
<code>Add-AzureProvisioningConfig -Windows –AdminUserName $adminUser  
-Password $adminPassword –VM $vm  
New-AzureVM -ServiceName "NewVM"</code>
</td>
</tr>
</table>

Specify other Azure VM information, such as a cloud service, region, storage account, availability set, and caching policy. Note that the VM instance must be collocated with associated operating system or data disks, so the selected cloud service, region, and storage account must all be in the same location as the underlying VHDs of those disks.  

### Attach Data Disk  

Lastly, if you have registered data disk VHDs attach them to the new DS-series Azure VM.  

Use following PowerShell cmdlet to attach data disk to the new VM and specify the caching policy. In example below the caching policy is set to ReadOnly.  

	$vmName ="yourVM"
	$vm = Get-AzureVM -ServiceName $vmName -Name $vmName
	Add-AzureDataDisk -ImportFrom -DiskName “DataDisk” -LUN 0 –HostCaching ReadOnly –VM $vm | Update-AzureVM  

>[AZURE.NOTE] There may be specific steps necessary to support your applications which may not be covered by this guide.


## Next Steps  

Check the following resources for specific scenarios for migrating virtual machines  

- [Migrate Azure Virtual Machines between Storage Accounts](http://azure.microsoft.com/blog/2014/10/22/migrate-azure-virtual-machines-between-storage-accounts/)  
- [Create and upload a Windows Server VHD to Azure.](virtual-machines-create-upload-vhd-windows-server.md)  
- [Creating and Uploading a Virtual Hard Disk that Contains the Linux Operating System](virtual-machines-linux-create-upload-vhd.md)  
- [Migrating Virtual Machines from Amazon AWS to Microsoft Azure](http://channel9.msdn.com/Series/Migrating-Virtual-Machines-from-Amazon-AWS-to-Microsoft-Azure)  

Also check following resources to learn more about Azure Storage and Azure Virtual Machines,  

- [Azure Storage](http://azure.microsoft.com/documentation/services/storage/)   
- [Azure Virtual Machines](http://azure.microsoft.com/documentation/services/virtual-machines/)  
- [Premium Storage: High-Performance Storage for Azure Virtual Machine Workloads](storage-premium-storage-preview-portal.md)  



[1]:./media/storage-migration-to-premium-storage/storage-migration-to-premium-storage-image1.png
[2]:./media/storage-migration-to-premium-storage/storage-migration-to-premium-storage-image2.png
[3]:./media/storage-migration-to-premium-storage/storage-migration-to-premium-storage-image3.png