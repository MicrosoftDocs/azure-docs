---
title: Migrating VMs to Azure Premium Storage | Microsoft Docs
description: Migrate your existing VMs to Azure Premium Storage. Premium Storage offers high-performance, low-latency disk support for I/O-intensive workloads running on Azure Virtual Machines.
services: storage
author: roygara

ms.service: storage
ms.topic: article
ms.date: 06/27/2017
ms.author: rogarana
ms.reviewer: yuemlu
ms.subservice: common
---

# Migrating to Azure Premium Storage (Unmanaged Disks)

> [!NOTE]
> This article discusses how to migrate a VM that uses unmanaged standard disks to a VM that uses unmanaged premium disks. We recommend that you use Azure Managed Disks for new VMs, and that you convert your previous unmanaged disks to managed disks. Managed Disks handle the underlying storage accounts so you don't have to. For more information, please see our [Managed Disks Overview](../../virtual-machines/windows/managed-disks-overview.md).
>

Azure Premium Storage delivers high-performance, low-latency disk support for virtual machines running I/O-intensive workloads. You can take advantage of the speed and performance of these disks by migrating your application's VM disks to Azure Premium Storage.

The purpose of this guide is to help new users of Azure Premium Storage better prepare to make a smooth transition from their current system to Premium Storage. The guide addresses three of the key components in this process:

* [Plan for the Migration to Premium Storage](#plan-the-migration-to-premium-storage)
* [Prepare and Copy Virtual Hard Disks (VHDs) to Premium Storage](#prepare-and-copy-virtual-hard-disks-VHDs-to-premium-storage)
* [Create Azure Virtual Machine using Premium Storage](#create-azure-virtual-machine-using-premium-storage)

You can either migrate VMs from other platforms to Azure Premium Storage or migrate existing Azure VMs from Standard Storage to Premium Storage. This guide covers steps for both two scenarios. Follow the steps specified in the relevant section depending on your scenario.

> [!NOTE]
> You can find a feature overview and pricing of premium SSDs in: [Select a disk type for IaaS VMs](../../virtual-machines/windows/disks-types.md#premium-ssd). We recommend migrating any virtual machine disk requiring high IOPS to Azure Premium Storage for the best performance for your application. If your disk does not require high IOPS, you can limit costs by maintaining it in Standard Storage, which stores virtual machine disk data on Hard Disk Drives (HDDs) instead of SSDs.
>

Completing the migration process in its entirety may require additional actions both before and after the steps provided in this guide. Examples include configuring virtual networks or endpoints or making code changes within the application itself which may require some downtime in your application. These actions are unique to each application, and you should complete them along with the steps provided in this guide to make the full transition to Premium Storage as seamless as possible.

## <a name="plan-the-migration-to-premium-storage"></a>Plan for the migration to Premium Storage
This section ensures that you are ready to follow the migration steps in this article, and helps you to make the best decision on VM and Disk types.

### Prerequisites
* You will need an Azure subscription. If you don't have one, you can create a one-month [free trial](https://azure.microsoft.com/pricing/free-trial/) subscription or visit [Azure Pricing](https://azure.microsoft.com/pricing/) for more options.
* To execute PowerShell cmdlets, you will need the Microsoft Azure PowerShell module. See [How to install and configure Azure PowerShell](/powershell/azure/overview) for the install point and installation instructions.
* When you plan to use Azure VMs running on Premium Storage, you need to use the Premium Storage capable VMs. You can use both Standard and Premium Storage disks with Premium Storage capable VMs. Premium storage disks will be available with more VM types in the future. For more information on all available Azure VM disk types and sizes, see [Sizes for virtual machines](../../virtual-machines/windows/sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) and [Sizes for Cloud Services](../../cloud-services/cloud-services-sizes-specs.md).

### Considerations
An Azure VM supports attaching several Premium Storage disks so that your applications can have up to 256 TB of storage per VM. With Premium Storage, your applications can achieve 80,000 IOPS (input/output operations per second) per VM and 2000 MB per second disk throughput per VM with extremely low latencies for read operations. You have options in a variety of VMs and Disks. This section is to help you to find an option that best suits your workload.

#### VM sizes
The Azure VM size specifications are listed in [Sizes for virtual machines](../../virtual-machines/windows/sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). Review the performance characteristics of virtual machines that work with Premium Storage and choose the most appropriate VM size that best suits your workload. Make sure that there is sufficient bandwidth available on your VM to drive the disk traffic.

#### Disk sizes
There are five types of disks that can be used with your VM and each has specific IOPs and throughput limits. Take into consideration these limits when choosing the disk type for your VM based on the needs of your application in terms of capacity, performance, scalability, and peak loads.

| Premium Disks Type  | P10   | P20   | P30            | P40            | P50            | 
|:-------------------:|:-----:|:-----:|:--------------:|:--------------:|:--------------:|
| Disk size           | 128 GB| 512 GB| 1024 GB (1 TB) | 2048 GB (2 TB) | 4095 GB (4 TB) | 
| IOPS per disk       | 500   | 2300  | 5000           | 7500           | 7500           | 
| Throughput per disk | 100 MB per second | 150 MB per second | 200 MB per second | 250 MB per second | 250 MB per second |

Depending on your workload, determine if additional data disks are necessary for your VM. You can attach several persistent data disks to your VM. If needed, you can stripe across the disks to increase the capacity and performance of the volume. (See what is Disk Striping [here](../../virtual-machines/windows/premium-storage-performance.md#disk-striping).) If you stripe Premium Storage data disks using [Storage Spaces][4], you should configure it with one column for each disk that is used. Otherwise, the overall performance of the striped volume may be lower than expected due to uneven distribution of traffic across the disks. For Linux VMs you can use the *mdadm* utility to achieve the same. See article [Configure Software RAID on Linux](../../virtual-machines/linux/configure-raid.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) for details.

#### Storage account scalability targets
Premium Storage accounts have the following scalability targets in addition to the [Azure Storage Scalability and Performance Targets](storage-scalability-targets.md). If your application requirements exceed the scalability targets of a single storage account, build your application to use multiple storage accounts, and partition your data across those storage accounts.

| Total Account Capacity | Total Bandwidth for a Locally Redundant Storage Account |
|:--- |:--- |
| Disk capacity: 35TB<br />Snapshot capacity: 10 TB |Up to 50 gigabits per second for Inbound + Outbound |

For the more information on Premium Storage specifications, check out [Azure Storage scalability and performance targets](storage-scalability-targets.md#premium-performance-storage-account-scale-limits).

#### Disk caching policy
By default, disk caching policy is *Read-Only* for all the Premium data disks, and *Read-Write* for the Premium operating system disk attached to the VM. This configuration setting is recommended to achieve the optimal performance for your application's IOs. For write-heavy or write-only data disks (such as SQL Server log files), disable disk caching so that you can achieve better application performance. The cache settings for existing data disks can be updated by using the [Azure portal](https://portal.azure.com) or the *-HostCaching* parameter of the *Set-AzureDataDisk* cmdlet.

#### Location
Pick a location where Azure Premium Storage is available. See [Azure Services by Region](https://azure.microsoft.com/regions/#services) for up-to-date information on available locations. VMs located in the same region as the Storage account that stores the disks for the VM will give much better performance than if they are in separate regions.

#### Other Azure VM configuration settings
When creating an Azure VM, you will be asked to configure certain VM settings. Remember, few settings are fixed for the lifetime of the VM, while you can modify or add others later. Review these Azure VM configuration settings and make sure that these are configured appropriately to match your workload requirements.

### Optimization
[Azure Premium Storage: Design for High Performance](../../virtual-machines/windows/premium-storage-performance.md) provides guidelines for building high-performance applications using Azure Premium Storage. You can follow the guidelines combined with performance best practices applicable to technologies used by your application.

## <a name="prepare-and-copy-virtual-hard-disks-VHDs-to-premium-storage"></a>Prepare and copy virtual hard disks (VHDs) to Premium Storage
The following section provides guidelines for preparing VHDs from your VM and copying VHDs to Azure Storage.

* [Scenario 1: "I am migrating existing Azure VMs to Azure Premium Storage."](#scenario1)
* [Scenario 2: "I am migrating VMs from other platforms to Azure Premium Storage."](#scenario2)

### Prerequisites
To prepare the VHDs for migration, you'll need:

* An Azure subscription, a storage account, and a container in that storage account to which you can copy your VHD. Note that the destination storage account can be a Standard or Premium Storage account depending on your requirement.
* A tool to generalize the VHD if you plan to create multiple VM instances from it. For example, sysprep for Windows or virt-sysprep for Ubuntu.
* A tool to upload the VHD file to the Storage account. See [Transfer data with the AzCopy Command-Line Utility](storage-use-azcopy.md) or use an [Azure storage explorer](https://blogs.msdn.com/b/windowsazurestorage/archive/2014/03/11/windows-azure-storage-explorers-2014.aspx). This guide describes copying your VHD using the AzCopy tool.

> [!NOTE]
> If you choose synchronous copy option with AzCopy, for optimal performance, copy your VHD by running one of these tools from an Azure VM that is in the same region as the destination storage account. If you are copying a VHD from an Azure VM in a different region, your performance may be slower.
>
> For copying a large amount of data over limited bandwidth, consider [using the Azure Import/Export service to transfer data to Blob Storage](../storage-import-export-service.md); this allows you to transfer your data by shipping hard disk drives to an Azure datacenter. You can use the Azure Import/Export service to copy data to a standard storage account only. Once the data is in your standard storage account, you can use either the [Copy Blob API](https://msdn.microsoft.com/library/azure/dd894037.aspx) or AzCopy to transfer the data to your premium storage account.
>
> Note that Microsoft Azure only supports fixed size VHD files. VHDX files or dynamic VHDs are not supported. If you have a dynamic VHD, you can convert it to fixed size using the [Convert-VHD](https://technet.microsoft.com/library/hh848454.aspx) cmdlet.
>
>

### <a name="scenario1"></a>Scenario 1: "I am migrating existing Azure VMs to Azure Premium Storage."
If you are migrating existing Azure VMs, stop the VM, prepare VHDs per the type of VHD you want, and then copy the VHD with AzCopy or PowerShell.

The VM needs to be completely down to migrate a clean state. There will be a downtime until the migration completes.

#### Step 1. Prepare VHDs for migration
If you are migrating existing Azure VMs to Premium Storage, your VHD may be:

* A generalized operating system image
* A unique operating system disk
* A data disk

Below we walk through these 3 scenarios for preparing your VHD.

##### Use a generalized Operating System VHD to create multiple VM instances
If you are uploading a VHD that will be used to create multiple generic Azure VM instances, you must first generalize VHD using a sysprep utility. This applies to a VHD that is on-premises or in the cloud. Sysprep removes any machine-specific information from the VHD.

> [!IMPORTANT]
> Take a snapshot or backup your VM before generalizing it. Running sysprep will stop and deallocate the VM instance. Follow steps below to sysprep a Windows OS VHD. Note that running the Sysprep command will require you to shut down the virtual machine. For more information about Sysprep, see [Sysprep Overview](https://technet.microsoft.com/library/hh825209.aspx) or [Sysprep Technical Reference](https://technet.microsoft.com/library/cc766049.aspx).
>
>

1. Open a Command Prompt window as an administrator.
2. Enter the following command to open Sysprep:

    ```
	%windir%\system32\sysprep\sysprep.exe
    ```

3. In the System Preparation Tool, select Enter System Out-of-Box Experience (OOBE), select the Generalize check box, select **Shutdown**, and then click **OK**, as shown in the image below. Sysprep will generalize the operating system and shut down the system.

    ![][1]

For an Ubuntu VM, use virt-sysprep to achieve the same. See [virt-sysprep](https://manpages.ubuntu.com/manpages/precise/man1/virt-sysprep.1.html) for more details. See also some of the open source [Linux Server Provisioning software](https://www.cyberciti.biz/tips/server-provisioning-software.html) for other Linux operating systems.

##### Use a unique Operating System VHD to create a single VM instance
If you have an application running on the VM which requires the machine specific data, do not generalize the VHD. A non-generalized VHD can be used to create a unique Azure VM instance. For example, if you have Domain Controller on your VHD, executing sysprep will make it ineffective as a Domain Controller. Review the applications running on your VM and the impact of running sysprep on them before generalizing the VHD.

##### Register data disk VHD
If you have data disks in Azure to be migrated, you must make sure the VMs that use these data disks are shut down.

Follow the steps described below to copy VHD to Azure Premium Storage and register it as a provisioned data disk.

#### Step 2. Create the destination for your VHD
Create a storage account for maintaining your VHDs. Consider the following points when planning where to store your VHDs:

* The target Premium storage account.
* The storage account location must be same as Premium Storage capable Azure VMs you will create in the final stage. You could copy to a new storage account, or plan to use the same storage account based on your needs.
* Copy and save the storage account key of the destination storage account for the next stage.

For data disks, you can choose to keep some data disks in a standard storage account (for example, disks that have cooler storage), but we strongly recommend you moving all data for production workload to use premium storage.

#### <a name="copy-vhd-with-azcopy-or-powershell"></a>Step 3. Copy VHD with AzCopy or PowerShell
You will need to find your container path and storage account key to process either of these two options. Container path and storage account key can be found in **Azure Portal** > **Storage**. The container URL will be like "https:\//myaccount.blob.core.windows.net/mycontainer/".

##### Option 1: Copy a VHD with AzCopy (Asynchronous copy)
Using AzCopy, you can easily upload the VHD over the Internet. Depending on the size of the VHDs, this may take time. Remember to check the storage account ingress/egress limits when using this option. See [Azure Storage Scalability and Performance Targets](storage-scalability-targets.md) for details.

1. Download and install AzCopy from here: [Latest version of AzCopy](https://aka.ms/downloadazcopy)
2. Open Azure PowerShell and go to the folder where AzCopy is installed.
3. Use the following command to copy the VHD file from "Source" to "Destination".

	```azcopy
	AzCopy /Source: <source> /SourceKey: <source-account-key> /Dest: <destination> /DestKey: <dest-account-key> /BlobType:page /Pattern: <file-name>
    ```

    Example:

	```azcopy
	AzCopy /Source:https://sourceaccount.blob.core.windows.net/mycontainer1 /SourceKey:key1 /Dest:https://destaccount.blob.core.windows.net/mycontainer2 /DestKey:key2 /Pattern:abc.vhd
    	```

    Here are descriptions of the parameters used in the AzCopy command:

   * **/Source: _&lt;source&gt;:_** Location of the folder or storage container URL that contains the VHD.
   * **/SourceKey: _&lt;source-account-key&gt;:_** Storage account key of the source storage account.
   * **/Dest: _&lt;destination&gt;:_** Storage container URL to copy the VHD to.
   * **/DestKey: _&lt;dest-account-key&gt;:_** Storage account key of the destination storage account.
   * **/Pattern: _&lt;file-name&gt;:_** Specify the file name of the VHD to copy.

For details on using AzCopy tool, see [Transfer data with the AzCopy Command-Line Utility](storage-use-azcopy.md).

##### Option 2: Copy a VHD with PowerShell (Synchronized copy)

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

You can also copy the VHD file using the PowerShell cmdlet Start-AzStorageBlobCopy. Use the following command on Azure PowerShell to copy VHD. Replace the values in <> with corresponding values from your source and destination storage account. To use this command, you must have a container called vhds in your destination storage account. If the container doesn't exist, create one before running the command.

```powershell
$sourceBlobUri = <source-vhd-uri>

$sourceContext = New-AzStorageContext  –StorageAccountName <source-account> -StorageAccountKey <source-account-key>

$destinationContext = New-AzStorageContext  –StorageAccountName <dest-account> -StorageAccountKey <dest-account-key>

Start-AzStorageBlobCopy -srcUri $sourceBlobUri -SrcContext $sourceContext -DestContainer <dest-container> -DestBlob <dest-disk-name> -DestContext $destinationContext
```

Example:

```powershell
C:\PS> $sourceBlobUri = "https://sourceaccount.blob.core.windows.net/vhds/myvhd.vhd"

C:\PS> $sourceContext = New-AzStorageContext  –StorageAccountName "sourceaccount" -StorageAccountKey "J4zUI9T5b8gvHohkiRg"

C:\PS> $destinationContext = New-AzStorageContext  –StorageAccountName "destaccount" -StorageAccountKey "XZTmqSGKUYFSh7zB5"

C:\PS> Start-AzStorageBlobCopy -srcUri $sourceBlobUri -SrcContext $sourceContext -DestContainer "vhds" -DestBlob "myvhd.vhd" -DestContext $destinationContext
```

### <a name="scenario2"></a>Scenario 2: "I am migrating VMs from other platforms to Azure Premium Storage."
If you are migrating VHD from non-Azure Cloud Storage to Azure, you must first export the VHD to a local directory. Have the complete source path of the local directory where VHD is stored handy, and then using AzCopy to upload it to Azure Storage.

#### Step 1. Export VHD to a local directory
##### Copy a VHD from AWS
1. If you are using AWS, export the EC2 instance to a VHD in an Amazon S3 bucket. Follow the steps described in the Amazon documentation for Exporting Amazon EC2 Instances to install the Amazon EC2 command-line interface (CLI) tool and run the create-instance-export-task command to export the EC2 instance to a VHD file. Be sure to use **VHD** for the DISK&#95;IMAGE&#95;FORMAT variable when running the **create-instance-export-task** command. The exported VHD file is saved in the Amazon S3 bucket you designate during that process.

    ```
	aws ec2 create-instance-export-task --instance-id ID --target-environment TARGET_ENVIRONMENT \
	  --export-to-s3-task DiskImageFormat=DISK_IMAGE_FORMAT,ContainerFormat=ova,S3Bucket=BUCKET,S3Prefix=PREFIX
    ```

2. Download the VHD file from the S3 bucket. Select the VHD file, then **Actions** > **Download**.

    ![][3]

##### Copy a VHD from other non-Azure cloud
If you are migrating VHD from non-Azure Cloud Storage to Azure, you must first export the VHD to a local directory. Copy the complete source path of the local directory where VHD is stored.

##### Copy a VHD from on-premises
If you are migrating VHD from an on-premises environment, you will need the complete source path where VHD is stored. The source path could be a server location or file share.

#### Step 2. Create the destination for your VHD
Create a storage account for maintaining your VHDs. Consider the following points when planning where to store your VHDs:

* The target storage account could be standard or premium storage depending on your application requirement.
* The storage account region must be same as Premium Storage capable Azure VMs you will create in the final stage. You could copy to a new storage account, or plan to use the same storage account based on your needs.
* Copy and save the storage account key of the destination storage account for the next stage.

We strongly recommend you moving all data for production workload to use premium storage.

#### Step 3. Upload the VHD to Azure Storage
Now that you have your VHD in the local directory, you can use AzCopy or AzurePowerShell to upload the .vhd file to Azure Storage. Both options are provided here:

##### Option 1: Using Azure PowerShell Add-AzureVhd to upload the .vhd file

```powershell
Add-AzureVhd [-Destination] <Uri> [-LocalFilePath] <FileInfo>
```

An example \<Uri> might be **_"https://storagesample.blob.core.windows.net/mycontainer/blob1.vhd"_**. An example \<FileInfo> might be **_"C:\path\to\upload.vhd"_**.

##### Option 2: Using AzCopy to upload the .vhd file
Using AzCopy, you can easily upload the VHD over the Internet. Depending on the size of the VHDs, this may take time. Remember to check the storage account ingress/egress limits when using this option. See [Azure Storage Scalability and Performance Targets](storage-scalability-targets.md) for details.

1. Download and install AzCopy from here: [Latest version of AzCopy](https://aka.ms/downloadazcopy)
2. Open Azure PowerShell and go to the folder where AzCopy is installed.
3. Use the following command to copy the VHD file from "Source" to "Destination".

	```azcopy
	AzCopy /Source: <source> /SourceKey: <source-account-key> /Dest: <destination> /DestKey: <dest-account-key> /BlobType:page /Pattern: <file-name>
    ```

    Example:

	```azcopy
    AzCopy /Source:https://sourceaccount.blob.core.windows.net/mycontainer1 /SourceKey:key1 /Dest:https://destaccount.blob.core.windows.net/mycontainer2 /DestKey:key2 /BlobType:page /Pattern:abc.vhd
    	```

    Here are descriptions of the parameters used in the AzCopy command:

   * **/Source: _&lt;source&gt;:_** Location of the folder or storage container URL that contains the VHD.
   * **/SourceKey: _&lt;source-account-key&gt;:_** Storage account key of the source storage account.
   * **/Dest: _&lt;destination&gt;:_** Storage container URL to copy the VHD to.
   * **/DestKey: _&lt;dest-account-key&gt;:_** Storage account key of the destination storage account.
   * **/BlobType: page:** Specifies that the destination is a page blob.
   * **/Pattern: _&lt;file-name&gt;:_** Specify the file name of the VHD to copy.

For details on using AzCopy tool, see [Transfer data with the AzCopy Command-Line Utility](storage-use-azcopy.md).

##### Other options for uploading a VHD
You can also upload a VHD to your storage account using one of the following means:

* [Azure Storage Copy Blob API](https://msdn.microsoft.com/library/azure/dd894037.aspx)
* [Azure Storage Explorer Uploading Blobs](https://azurestorageexplorer.codeplex.com/)
* [Storage Import/Export Service REST API Reference](https://msdn.microsoft.com/library/dn529096.aspx)

> [!NOTE]
> We recommend using Import/Export Service if estimated uploading time is longer than 7 days. You can use [DataTransferSpeedCalculator](https://github.com/Azure-Samples/storage-dotnet-import-export-job-management/blob/master/DataTransferSpeedCalculator.html) to estimate the time from data size and transfer unit.
>
> Import/Export can be used to copy to a standard storage account. You will need to copy from standard storage to premium storage account using a tool like AzCopy.
>
>

## <a name="create-azure-virtual-machine-using-premium-storage"></a>Create Azure VMs using Premium Storage
After the VHD is uploaded or copied to the desired storage account, follow the instructions in this section to register the VHD as an OS image, or OS disk depending on your scenario and then create a VM instance from it. The data disk VHD can be attached to the VM once it is created.
A sample migration script is provided at the end of this section. This simple script does not match all scenarios. You may need to update the script to match with your specific scenario. To see if this script applies to your scenario, see below [A Sample Migration Script](#a-sample-migration-script).

### Checklist
1. Wait until all the VHD disks copying is complete.
2. Make sure Premium Storage is available in the region you are migrating to.
3. Decide the new VM series you will be using. It should be a Premium Storage capable, and the size should be depending on the availability in the region and based on your needs.
4. Decide the exact VM size you will use. VM size needs to be large enough to support the number of data disks you have. E.g. if you have 4 data disks, the VM must have 2 or more cores. Also, consider processing power, memory and network bandwidth needs.
5. Create a Premium Storage account in the target region. This is the account you will use for the new VM.
6. Have the current VM details handy, including the list of disks and corresponding VHD blobs.

Prepare your application for downtime. To do a clean migration, you have to stop all the processing in the current system. Only then you can get it to consistent state which you can migrate to the new platform. Downtime duration will depend on the amount of data in the disks to migrate.

> [!NOTE]
> If you are creating an Azure Resource Manager VM from a specialized VHD Disk, please refer to [this template](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vm-specialized-vhd) for deploying Resource Manager VM using existing disk.
>
>

### Register your VHD
To create a VM from OS VHD or to attach a data disk to a new VM, you must first register them. Follow steps below depending on your VHD's scenario.

#### Generalized Operating System VHD to create multiple Azure VM instances
After generalized OS image VHD is uploaded to the storage account, register it as an **Azure VM Image** so that you can create one or more VM instances from it. Use the following PowerShell cmdlets to register your VHD as an Azure VM OS image. Provide the complete container URL where VHD was copied to.

```powershell
Add-AzureVMImage -ImageName "OSImageName" -MediaLocation "https://storageaccount.blob.core.windows.net/vhdcontainer/osimage.vhd" -OS Windows
```

Copy and save the name of this new Azure VM Image. In the example above, it is *OSImageName*.

#### Unique Operating System VHD to create a single Azure VM instance
After the unique OS VHD is uploaded to the storage account, register it as an **Azure OS Disk** so that you can create a VM instance from it. Use these PowerShell cmdlets to register your VHD as an Azure OS Disk. Provide the complete container URL where VHD was copied to.

```powershell
Add-AzureDisk -DiskName "OSDisk" -MediaLocation "https://storageaccount.blob.core.windows.net/vhdcontainer/osdisk.vhd" -Label "My OS Disk" -OS "Windows"
```

Copy and save the name of this new Azure OS Disk. In the example above, it is *OSDisk*.

#### Data disk VHD to be attached to new Azure VM instance(s)
After the data disk VHD is uploaded to storage account, register it as an Azure Data Disk so that it can be attached to your new DS Series, DSv2 series or GS Series Azure VM instance.

Use these PowerShell cmdlets to register your VHD as an Azure Data Disk. Provide the complete container URL where VHD was copied to.

```powershell
Add-AzureDisk -DiskName "DataDisk" -MediaLocation "https://storageaccount.blob.core.windows.net/vhdcontainer/datadisk.vhd" -Label "My Data Disk"
```

Copy and save the name of this new Azure Data Disk. In the example above, it is *DataDisk*.

### Create a Premium Storage capable VM
Once the OS image or OS disk are registered, create a new DS-series, DSv2-series or GS-series VM. You will be using the operating system image or operating system disk name that you registered. Select the VM type from the Premium Storage tier. In example below, we are using the *Standard_DS2* VM size.

> [!NOTE]
> Update the disk size to make sure it matches your capacity and performance requirements and the available Azure disk sizes.
>
>

Follow the step by step PowerShell cmdlets below to create the new VM. First, set the common parameters:

```powershell
$serviceName = "yourVM"
$location = "location-name" (e.g., West US)
$vmSize ="Standard_DS2"
$adminUser = "youradmin"
$adminPassword = "yourpassword"
$vmName ="yourVM"
$vmSize = "Standard_DS2"
```

First, create a cloud service in which you will be hosting your new VMs.

```powershell
New-AzureService -ServiceName $serviceName -Location $location
```

Next, depending on your scenario, create the Azure VM instance from either the OS Image or OS Disk that you registered.

#### Generalized Operating System VHD to create multiple Azure VM instances
Create the one or more new DS Series Azure VM instances using the **Azure OS Image** that you registered. Specify this OS Image name in the VM configuration when creating new VM as shown below.

```powershell
$OSImage = Get-AzureVMImage –ImageName "OSImageName"

$vm = New-AzureVMConfig -Name $vmName –InstanceSize $vmSize -ImageName $OSImage.ImageName

Add-AzureProvisioningConfig -Windows –AdminUserName $adminUser -Password $adminPassword –VM $vm

New-AzureVM -ServiceName $serviceName -VM $vm
```

#### Unique Operating System VHD to create a single Azure VM instance
Create a new DS series Azure VM instance using the **Azure OS Disk** that you registered. Specify this OS Disk name in the VM configuration when creating the new VM as shown below.

```powershell
$OSDisk = Get-AzureDisk –DiskName "OSDisk"

$vm = New-AzureVMConfig -Name $vmName -InstanceSize $vmSize -DiskName $OSDisk.DiskName

New-AzureVM -ServiceName $serviceName –VM $vm
```

Specify other Azure VM information, such as a cloud service, region, storage account, availability set, and caching policy. Note that the VM instance must be co-located with associated operating system or data disks, so the selected cloud service, region and storage account must all be in the same location as the underlying VHDs of those disks.

### Attach data disk
Lastly, if you have registered data disk VHDs, attach them to the new Premium Storage capable Azure VM.

Use following PowerShell cmdlet to attach data disk to the new VM and specify the caching policy. In example below the caching policy is set to *ReadOnly*.

```powershell
$vm = Get-AzureVM -ServiceName $serviceName -Name $vmName

Add-AzureDataDisk -ImportFrom -DiskName "DataDisk" -LUN 0 –HostCaching ReadOnly –VM $vm

Update-AzureVM  -VM $vm
```

> [!NOTE]
> There may be additional steps necessary to support your application that is not be covered by this guide.
>
>

### Checking and plan backup
Once the new VM is up and running, access it using the same login id and password is as the original VM, and verify that everything is working as expected. All the settings, including the striped volumes, would be present in the new VM.

The last step is to plan backup and maintenance schedule for the new VM based on the application's needs.

### <a name="a-sample-migration-script"></a>A sample migration script
If you have multiple VMs to migrate, automation through PowerShell scripts will be helpful. Following is a sample script that automates the migration of a VM. Note that below script is only an example, and there are few assumptions made about the current VM disks. You may need to update the script to match with your specific scenario.

The assumptions are:

* You are creating classic Azure VMs.
* Your source OS Disks and source Data Disks are in same storage account and same container. If your OS Disks and Data Disks are not in the same place, you can use AzCopy or Azure PowerShell to copy VHDs over storage accounts and containers. Refer to the previous step: [Copy VHD with AzCopy or PowerShell](#copy-vhd-with-azcopy-or-powershell). Editing this script to meet your scenario is another choice, but we recommend using AzCopy or PowerShell since it is easier and faster.

The automation script is provided below. Replace text with your information and update the script to match with your specific scenario.

> [!NOTE]
> Using the existing script does not preserve the network configuration of your source VM. You will need to re-config the networking settings on your migrated VMs.
>
>

```powershell
    <#
    .Synopsis
    This script is provided as an EXAMPLE to show how to migrate a VM from a standard storage account to a premium storage account. You can customize it according to your specific requirements.

    .Description
    The script will copy the vhds (page blobs) of the source VM to the new storage account.
    And then it will create a new VM from these copied vhds based on the inputs that you specified for the new VM.
    You can modify the script to satisfy your specific requirement, but please be aware of the items specified
    in the Terms of Use section.

    .Terms of Use
    Copyright © 2015 Microsoft Corporation.  All rights reserved.

    THIS CODE AND ANY ASSOCIATED INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND,
    EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY
    AND/OR FITNESS FOR A PARTICULAR PURPOSE. THE ENTIRE RISK OF USE, INABILITY TO USE, OR
    RESULTS FROM THE USE OF THIS CODE REMAINS WITH THE USER.

    .Example (Save this script as Migrate-AzureVM.ps1)

    .\Migrate-AzureVM.ps1 -SourceServiceName CurrentServiceName -SourceVMName CurrentVMName –DestStorageAccount newpremiumstorageaccount -DestServiceName NewServiceName -DestVMName NewDSVMName -DestVMSize "Standard_DS2" –Location "Southeast Asia"

    .Link
    To find more information about how to set up Azure PowerShell, refer to the following links.
    https://azure.microsoft.com/documentation/articles/powershell-install-configure/
    https://azure.microsoft.com/documentation/articles/storage-powershell-guide-full/
    https://azure.microsoft.com/blog/2014/10/22/migrate-azure-virtual-machines-between-storage-accounts/

    #>

    Param(
    # the cloud service name of the VM.
    [Parameter(Mandatory = $true)]
    [string] $SourceServiceName,

    # The VM name to copy.
    [Parameter(Mandatory = $true)]
    [String] $SourceVMName,

    # The destination storage account name.
    [Parameter(Mandatory = $true)]
    [String] $DestStorageAccount,

    # The destination cloud service name
    [Parameter(Mandatory = $true)]
    [String] $DestServiceName,

    # the destination vm name
    [Parameter(Mandatory = $true)]
    [String] $DestVMName,

    # the destination vm size
    [Parameter(Mandatory = $true)]
    [String] $DestVMSize,

    # the location of destination VM.
    [Parameter(Mandatory = $true)]
    [string] $Location,

    # whether or not to copy the os disk, the default is only copy data disks
    [Parameter(Mandatory = $false)]
    [Bool] $DataDiskOnly = $true,

    # how frequently to report the copy status in seconds
    [Parameter(Mandatory = $false)]
    [Int32] $CopyStatusReportInterval = 15,

    # the name suffix to add to new created disks to avoid conflict with source disk names
    [Parameter(Mandatory = $false)]
    [String]$DiskNameSuffix = "-prem"

    ) #end param

    #######################################################################
    #  Verify Azure PowerShell module and version
    #######################################################################

    #import the Azure PowerShell module
    Write-Host "`n[WORKITEM] - Importing Azure PowerShell module" -ForegroundColor Yellow
    $azureModule = Import-Module Azure -PassThru

    if ($azureModule -ne $null)
    {
        Write-Host "`tSuccess" -ForegroundColor Green
    }
    else
    {
        #show module not found interaction and bail out
        Write-Host "[ERROR] - PowerShell module not found. Exiting." -ForegroundColor Red
        Exit
    }


    #Check the Azure PowerShell module version
    Write-Host "`n[WORKITEM] - Checking Azure PowerShell module version" -ForegroundColor Yellow
    If ($azureModule.Version -ge (New-Object System.Version -ArgumentList "0.8.14"))
    {
        Write-Host "`tSuccess" -ForegroundColor Green
    }
    Else
    {
        Write-Host "[ERROR] - Azure PowerShell module must be version 0.8.14 or higher. Exiting." -ForegroundColor Red
        Exit
    }

    #Check if there is an azure subscription set up in PowerShell
    Write-Host "`n[WORKITEM] - Checking Azure Subscription" -ForegroundColor Yellow
    $currentSubs = Get-AzureSubscription -Current
    if ($currentSubs -ne $null)
    {
        Write-Host "`tSuccess" -ForegroundColor Green
        Write-Host "`tYour current azure subscription in PowerShell is $($currentSubs.SubscriptionName)." -ForegroundColor Green
    }
    else
    {
        Write-Host "[ERROR] - There is no valid Azure subscription found in PowerShell. Please refer to this article https://azure.microsoft.com/documentation/articles/powershell-install-configure/ to connect an Azure subscription. Exiting." -ForegroundColor Red
        Exit
    }


    #######################################################################
    #  Check if the VM is shut down
    #  Stopping the VM is a required step so that the file system is consistent when you do the copy operation.
    #  Azure does not support live migration at this time..
    #######################################################################

    if (($sourceVM = Get-AzureVM –ServiceName $SourceServiceName –Name $SourceVMName) -eq $null)
    {
        Write-Host "[ERROR] - The source VM doesn't exist in the current subscription. Exiting." -ForegroundColor Red
        Exit
    }

    # check if VM is shut down
    if ( $sourceVM.Status -notmatch "Stopped" )
    {
        Write-Host "[Warning] - Stopping the VM is a required step so that the file system is consistent when you do the copy operation. Azure does not support live migration at this time. If you'd like to create a VM from a generalized image, sys-prep the Virtual Machine before stopping it." -ForegroundColor Yellow
        $ContinueAnswer = Read-Host "`n`tDo you wish to stop $SourceVMName now? Input 'N' if you want to shut down the VM manually and come back later.(Y/N)"
        If ($ContinueAnswer -ne "Y") { Write-Host "`n Exiting." -ForegroundColor Red;Exit }
        $sourceVM | Stop-AzureVM

        # wait until the VM is shut down
        $VMStatus = (Get-AzureVM –ServiceName $SourceServiceName –Name $vmName).Status
        while ($VMStatus -notmatch "Stopped")
        {
            Write-Host "`n[Status] - Waiting VM $vmName to shut down" -ForegroundColor Green
            Sleep -Seconds 5
            $VMStatus = (Get-AzureVM –ServiceName $SourceServiceName –Name $vmName).Status
        }
    }

    # exporting the source vm to a configuration file, you can restore the original VM by importing this config file
    # see more information for Import-AzureVM
    $workingDir = (Get-Location).Path
    $vmConfigurationPath = $env:HOMEPATH + "\VM-" + $SourceVMName + ".xml"
    Write-Host "`n[WORKITEM] - Exporting VM configuration to $vmConfigurationPath" -ForegroundColor Yellow
    $exportRe = $sourceVM | Export-AzureVM -Path $vmConfigurationPath


    #######################################################################
    #  Copy the vhds of the source vm
    #  You can choose to copy all disks including os and data disks by specifying the
    #  parameter -DataDiskOnly to be $false. The default is to copy only data disk vhds
    #  and the new VM will boot from the original os disk.
    #######################################################################

    $sourceOSDisk = $sourceVM.VM.OSVirtualHardDisk
    $sourceDataDisks = $sourceVM.VM.DataVirtualHardDisks

    # Get source storage account information, not considering the data disks and os disks are in different accounts
    $sourceStorageAccountName = $sourceOSDisk.MediaLink.Host -split "\." | select -First 1
    $sourceStorageKey = (Get-AzStorageKey -StorageAccountName $sourceStorageAccountName).Primary
    $sourceContext = New-AzStorageContext –StorageAccountName $sourceStorageAccountName -StorageAccountKey $sourceStorageKey

    # Create destination context
    $destStorageKey = (Get-AzStorageKey -StorageAccountName $DestStorageAccount).Primary
    $destContext = New-AzStorageContext –StorageAccountName $DestStorageAccount -StorageAccountKey $destStorageKey

    # Create a container of vhds if it doesn't exist
    if ((Get-AzStorageContainer -Context $destContext -Name vhds -ErrorAction SilentlyContinue) -eq $null)
    {
        Write-Host "`n[WORKITEM] - Creating a container vhds in the destination storage account." -ForegroundColor Yellow
        New-AzStorageContainer -Context $destContext -Name vhds
    }


    $allDisksToCopy = $sourceDataDisks
    # check if need to copy os disk
    $sourceOSVHD = $sourceOSDisk.MediaLink.Segments[2]
    if ($DataDiskOnly)
    {
        # copy data disks only, this option requires deleting the source VM so that dest VM can boot
        # from the same vhd blob.
        $ContinueAnswer = Read-Host "`n`t[Warning] You chose to copy data disks only. Moving VM requires removing the original VM (the disks and backing vhd files will NOT be deleted) so that the new VM can boot from the same vhd. This is an irreversible action. Do you wish to proceed right now? (Y/N)"
        If ($ContinueAnswer -ne "Y") { Write-Host "`n Exiting." -ForegroundColor Red;Exit }
        $destOSVHD = Get-AzStorageBlob -Blob $sourceOSVHD -Container vhds -Context $sourceContext
        Write-Host "`n[WORKITEM] - Removing the original VM (the vhd files are NOT deleted)." -ForegroundColor Yellow
        Remove-AzureVM -Name $SourceVMName -ServiceName $SourceServiceName

        Write-Host "`n[WORKITEM] - Waiting until the OS disk is released by source VM. This may take up to several minutes."
        $diskAttachedTo = (Get-AzureDisk -DiskName $sourceOSDisk.DiskName).AttachedTo
        while ($diskAttachedTo -ne $null)
        {
            Start-Sleep -Seconds 10
            $diskAttachedTo = (Get-AzureDisk -DiskName $sourceOSDisk.DiskName).AttachedTo
        }

    }
    else
    {
        # copy the os disk vhd
        Write-Host "`n[WORKITEM] - Starting copying os disk $($disk.DiskName) at $(get-date)." -ForegroundColor Yellow
        $allDisksToCopy += @($sourceOSDisk)
        $targetBlob = Start-AzStorageBlobCopy -SrcContainer vhds -SrcBlob $sourceOSVHD -DestContainer vhds -DestBlob $sourceOSVHD -Context $sourceContext -DestContext $destContext -Force
        $destOSVHD = $targetBlob
    }


    # Copy all data disk vhds
    # Start all async copy requests in parallel.
    foreach($disk in $sourceDataDisks)
    {
        $blobName = $disk.MediaLink.Segments[2]
        # copy all data disks
        Write-Host "`n[WORKITEM] - Starting copying data disk $($disk.DiskName) at $(get-date)." -ForegroundColor Yellow
        $targetBlob = Start-AzStorageBlobCopy -SrcContainer vhds -SrcBlob $blobName -DestContainer vhds -DestBlob $blobName -Context $sourceContext -DestContext $destContext -Force
        # update the media link to point to the target blob link
        $disk.MediaLink = $targetBlob.ICloudBlob.Uri.AbsoluteUri
    }

    # Wait until all vhd files are copied.
    $diskComplete = @()
    do
    {
        Write-Host "`n[WORKITEM] - Waiting for all disk copy to complete. Checking status every $CopyStatusReportInterval seconds." -ForegroundColor Yellow
        # check status every 30 seconds
        Sleep -Seconds $CopyStatusReportInterval
        foreach ( $disk in $allDisksToCopy)
        {
            if ($diskComplete -contains $disk)
            {
                Continue
            }
            $blobName = $disk.MediaLink.Segments[2]
            $copyState = Get-AzStorageBlobCopyState -Blob $blobName -Container vhds -Context $destContext
            if ($copyState.Status -eq "Success")
            {
                Write-Host "`n[Status] - Success for disk copy $($disk.DiskName) at $($copyState.CompletionTime)" -ForegroundColor Green
                $diskComplete += $disk
            }
            else
            {
                if ($copyState.TotalBytes -gt 0)
                {
                    $percent = ($copyState.BytesCopied / $copyState.TotalBytes) * 100
                    Write-Host "`n[Status] - $('{0:N2}' -f $percent)% Complete for disk copy $($disk.DiskName)" -ForegroundColor Green
                }
            }
        }
    }
    while($diskComplete.Count -lt $allDisksToCopy.Count)

    #######################################################################
    #  Create a new vm
    #  the new VM can be created from the copied disks or the original os disk.
    #  You can ddd your own logic here to satisfy your specific requirements of the vm.
    #######################################################################

    # Create a VM from the existing os disk
    if ($DataDiskOnly)
    {
        $vm = New-AzureVMConfig -Name $DestVMName -InstanceSize $DestVMSize -DiskName $sourceOSDisk.DiskName
    }
    else
    {
        $newOSDisk = Add-AzureDisk -OS $sourceOSDisk.OS -DiskName ($sourceOSDisk.DiskName + $DiskNameSuffix) -MediaLocation $destOSVHD.ICloudBlob.Uri.AbsoluteUri
        $vm = New-AzureVMConfig -Name $DestVMName -InstanceSize $DestVMSize -DiskName $newOSDisk.DiskName
    }
    # Attached the copied data disks to the new VM
    foreach ($dataDisk in $sourceDataDisks)
    {
        # add -DiskLabel $dataDisk.DiskLabel if there are labels for disks of the source vm
        $diskLabel = "drive" + $dataDisk.Lun
        $vm | Add-AzureDataDisk -ImportFrom -DiskLabel $diskLabel -LUN $dataDisk.Lun -MediaLocation $dataDisk.MediaLink
    }

    # Edit this if you want to add more customization to the new VM
    # $vm | Add-AzureEndpoint -Protocol tcp -LocalPort 443 -PublicPort 443 -Name 'HTTPs'
    # $vm | Set-AzureSubnet "PubSubnet","PrivSubnet"

    New-AzureVM -ServiceName $DestServiceName -VMs $vm -Location $Location
```

#### <a name="optimization"></a>Optimization
Your current VM configuration may be customized specifically to work well with Standard disks. For instance, to increase the performance by using many disks in a striped volume. For example, instead of using 4 disks separately on Premium Storage, you may be able to optimize the cost by having a single disk. Optimizations like this need to be handled on a case by case basis and require custom steps after the migration. Also, note that this process may not well work for databases and applications that depend on the disk layout defined in the setup.

##### Preparation
1. Complete the Simple Migration as described in the earlier section. Optimizations will be performed on the new VM after the migration.
2. Define the new disk sizes needed for the optimized configuration.
3. Determine mapping of the current disks/volumes to the new disk specifications.

##### Execution steps
1. Create the new disks with the right sizes on the Premium Storage VM.
2. Login to the VM and copy the data from the current volume to the new disk that maps to that volume. Do this for all the current volumes that need to map to a new disk.
3. Next, change the application settings to switch to the new disks, and detach the old volumes.

For tuning the application for better disk performance, please refer to the optimizing application performance section of our [designing for high performance](../../virtual-machines/windows/premium-storage-performance.md) article.

### Application migrations
Databases and other complex applications may require special steps as defined by the application provider for the migration. Please refer to respective application documentation. E.g. typically databases can be migrated through backup and restore.

## Next steps
See the following resources for specific scenarios for migrating virtual machines:

* [Migrate Azure Virtual Machines between Storage Accounts](https://azure.microsoft.com/blog/2014/10/22/migrate-azure-virtual-machines-between-storage-accounts/)
* [Create and upload a Windows Server VHD to Azure.](../../virtual-machines/windows/upload-generalized-managed.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
* [Creating and Uploading a Linux VHD to Azure](../../virtual-machines/linux/create-upload-generic.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* [Migrating Virtual Machines from Amazon AWS to Microsoft Azure](https://channel9.msdn.com/Series/Migrating-Virtual-Machines-from-Amazon-AWS-to-Microsoft-Azure)

Also, see the following resources to learn more about Azure Storage and Azure Virtual Machines:

* [Azure Storage](https://azure.microsoft.com/documentation/services/storage/)
* [Azure Virtual Machines](https://azure.microsoft.com/documentation/services/virtual-machines/)
* [Select a disk type for IaaS VMs](../../virtual-machines/windows/disks-types.md)

[1]:./media/storage-migration-to-premium-storage/migration-to-premium-storage-1.png
[2]:./media/storage-migration-to-premium-storage/migration-to-premium-storage-1.png
[3]:./media/storage-migration-to-premium-storage/migration-to-premium-storage-3.png
[4]: https://technet.microsoft.com/library/hh831739.aspx
