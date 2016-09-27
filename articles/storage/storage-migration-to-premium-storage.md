<properties
    pageTitle="Migrating to Azure Premium Storage | Microsoft Azure"
    description="Migrate your existing virtual machines to Azure Premium Storage. Premium Storage offers high-performance, low-latency disk support for I/O-intensive workloads running on Azure Virtual Machines."
    services="storage"
    documentationCenter="na"
    authors="aungoo-msft"
    manager=""
    editor="tysonn"/>

<tags
    ms.service="storage"
    ms.workload="storage"
    ms.tgt_pltfrm="na"
    ms.devlang="na"
    ms.topic="article"
    ms.date="07/25/2016"
    ms.author="aungoo-msft"/>


# Migrating to Azure Premium Storage

## Overview

Azure Premium Storage delivers high-performance, low-latency disk support for virtual machines running I/O-intensive workloads. Virtual machine (VM) disks that use Premium Storage store data on solid state drives (SSDs). You can migrate your application's VM disks to Azure Premium Storage to take advantage of the speed and performance of these disks.

An Azure VM supports attaching several Premium Storage disks, so that your applications can have up to 64 TB of storage per VM. With Premium Storage, your applications can achieve 80,000 IOPS (input/output operations per second) per VM and 2000 MB per second disk throughput per VM with extremely low latencies for read operations.

>[AZURE.NOTE] We recommend migrating any virtual machine disk requiring high IOPS to Azure Premium Storage for the best performance for your application. If your disk does not require high IOPS, you can limit costs by maintaining it in Standard Storage, which stores virtual machine disk data on Hard Disk Drives (HDDs) instead of SSDs.

The purpose of this guide is to help new users of Azure Premium Storage better prepare to make a smooth transition from their current system to Premium Storage. The guide addresses three of the key components in this process: planning in the migration to Premium Storage, migrating existing virtual hard disks (VHDs) to Premium Storage, and creating Azure virtual machine instances in Premium Storage.

Completing the migration process in its entirety may require additional actions both before and after the steps provided in this guide. Examples include configuring virtual networks or endpoints, or making code changes within the application itself. These actions are unique to each application and you should complete them along with the steps provided in this guide to make the full transition to Premium Storage as seamless as possible.

You can find a feature overview of Premium Storage in [Premium Storage: High-Performance Storage for Azure Virtual Machine Workloads](storage-premium-storage.md).

This guide is divided into two sections covering the following two scenarios of migration:

- [Migrating VMs from other platforms to Azure Premium Storage](#migrating-vms-from-other-platforms-to-azure-premium-storage).
- [Migrating existing Azure VMs to Azure Premium Storage](#migrating-existing-azure-vms-to-azure-premium-storage).

Follow the steps specified in the relevant section depending on your scenario.

## Migrating VMs from other platforms to Azure Premium Storage

### Prerequisites
- You will need an Azure subscription. If you don’t have one, you can create a one month [free trial](https://azure.microsoft.com/pricing/free-trial/) subscription or visit [Azure Pricing](https://azure.microsoft.com/pricing/) for more options.
- To execute PowerShell cmdlets you will need the Microsoft Azure PowerShell module. See [Microsoft Azure Downloads](https://azure.microsoft.com/downloads/) to download the module.
- When you plan to use Azure VMs running on Premium Storage, you need to use the DS-series, DSv2-series or GS-series VMs. You can use both Standard and Premium Storage disks with DS-series, DSv2-series and GS-series VMs. Premium storage disks will be available with more VM types in the future. For more information on all available Azure VM disk types and sizes, see [Sizes for virtual machines](../virtual-machines/virtual-machines-windows-sizes.md) and [Sizes for Cloud Services](../cloud-services/cloud-services-sizes-specs.md).

### Considerations

#### VM sizes
The Azure VM size specifications are listed in [Sizes for virtual machines](../virtual-machines/virtual-machines-windows-sizes.md). Review the performance characteristics of virtual machines that work with Premium Storage and choose the most appropriate VM size that best suits your workload. Make sure that there is sufficient bandwidth available on your VM to drive the disk traffic.


#### Disk sizes
There are three types of disks that can be used with your VM and each has specific IOPs and throughout limits. Take into consideration these limits when choosing the disk type for your VM based on the needs of your application in terms of capacity, performance, scalability, and peak loads.

|Premium Storage Disk Type|P10|P20|P30|
|:---:|:---:|:---:|:---:|
|Disk size|128 GB|512 GB|1024 GB (1 TB)|
|IOPS per disk|500|2300|5000|
|Throughput per disk|100 MB per second|150 MB per second|200 MB per second|

#### Storage account scalability targets

Premium Storage accounts have following scalability targets in addition to the [Azure Storage Scalability and Performance Targets](storage-scalability-targets.md). If your application requirements exceed the scalability targets of a single storage account, build your application to use multiple storage accounts, and partition your data across those storage accounts.

|Total Account Capacity|Total Bandwidth for a Locally Redundant Storage Account|
|:--|:---|
|Disk capacity: 35TB<br />Snapshot capacity: 10 TB|Up to 50 gigabits per second for Inbound + Outbound|

For the more information on Premium Storage specifications, check out [Scalability and Performance Targets when using Premium Storage](storage-premium-storage.md#scalability-and-performance-targets-when-using-premium-storage).

#### Additional data disks

Depending on your workload, determine if additional data disks are necessary for your VM. You can attach several persistent data disks to your VM. If needed, you can stripe across the disks to increase the capacity and performance of the volume. If you stripe Premium Storage data disks using [Storage Spaces](http://technet.microsoft.com/library/hh831739.aspx), you should configure it with one column for each disk that is used. Otherwise, overall performance of the striped volume may be lower than expected due to uneven distribution of traffic across the disks. For Linux VMs you can use the *mdadm* utility to achieve the same. See article [Configure Software RAID on Linux](../virtual-machines/virtual-machines-linux-configure-raid.md) for details.

#### Disk caching policy
By default, disk caching policy is *Read-Only* for all the Premium data disks, and *Read-Write* for the Premium operating system disk attached to the VM. This configuration setting is recommended to achieve the optimal performance for your application’s IOs. For write-heavy or write-only data disks (such as SQL Server log files), disable disk caching so that you can achieve better application performance. The cache settings for existing data disks can be updated using [Azure Portal](https://portal.azure.com) or the *-HostCaching* parameter of the *Set-AzureDataDisk* cmdlet.

#### Location
Pick a location where Azure Premium Storage is available. See [Azure Services by Region](https://azure.microsoft.com/regions/#services) for up to date information on available locations. VMs located in the same region as the Storage account that stores the disks for VM, will give superior performance than if they are in separate regions.

#### Other Azure VM configuration settings

When creating an Azure VM you will be asked to configure certain VM settings. Remember, there are few settings that are fixed for the lifetime of the VM, while you can modify or add others later. Review these Azure VM configuration settings and make sure that these are configured appropriately to match your workload requirements.

## Prepare VHDs for Migration

The following section provides guidelines to prepare VHDs from your VM so they are ready to migrate. The VHD may be:

- A generalized operating system image that can be used to create multiple Azure VMs.
- An operating system disk that can be used with a single Azure virtual machine instance.
- A data disk that can be attached to an Azure VM for persistent storage.

### Prerequisites

To migrate your VMs, you'll need:

- An Azure subscription, a storage account, and a container in that storage account to copy your VHD to. Note that the destination storage account can be a Standard or Premium Storage account depending on your requirement.
- A tool to generalize VHD if you plan to create multiple VM instances from it. For example, sysprep for Windows or virt-sysprep for Ubuntu.
- A tool to upload the VHD file to the Storage account. See [Transfer data with the AzCopy Command-Line Utility](storage-use-azcopy.md) or use an [Azure storage explorer](http://blogs.msdn.com/b/windowsazurestorage/archive/2014/03/11/windows-azure-storage-explorers-2014.aspx). This guide describes copying your VHD using the AzCopy tool.

> [AZURE.NOTE] For optimal performance, copy your VHD by running one of these tools from an Azure VM that is in the same region as the destination storage account. If you are copying a VHD from an Azure VM in a different region, your performance may be slower.
>
> For copying a large amount of data over limited bandwidth, consider [using the Azure Import/Export service to transfer data to Blob Storage](storage-import-export-service.md); this allows you to transfer your data by shipping hard disk drives to an Azure datacenter. You can use the Azure Import/Export service to copy data to a standard storage account only. Once the data is in your standard storage account, you can use either the [Copy Blob API](https://msdn.microsoft.com/library/azure/dd894037.aspx) or AzCopy to transfer the data to your premium storage account.
>
> Note that Microsoft Azure only supports fixed size VHD files. VHDX files or dynamic VHDs are not supported. If you have a dynamic VHD, you can convert it to fixed size using the [Convert-VHD](http://technet.microsoft.com/library/hh848454.aspx) cmdlet.

### Scenarios for preparing VHDs

Below we walk through some scenarios for preparing your VHDs.

#### Generalized Operating System VHD to create multiple VM instances

If you are uploading a VHD that will be used to create multiple generic Azure VM instances, you must first generalize VHD using a sysprep utility. This applies to a VHD that is on-premises or in the cloud. Sysprep removes any machine specific information from the VHD.

>[AZURE.IMPORTANT] Take a snapshot or backup your VM before generalizing it. Running sysprep will delete the VM instance. Follow steps below to sysprep a Windows OS VHD. Note that running the Sysprep command will require you to shut down the virtual machine. For more information about Sysprep, see [Sysprep Overview](http://technet.microsoft.com/library/hh825209.aspx) or [Sysprep Technical Reference](http://technet.microsoft.com/library/cc766049.aspx).

1. Open a Command Prompt window as an administrator.
2. Enter the following command to open Sysprep:

		%windir%\system32\sysprep\sysprep.exe

4. In the System Preparation Tool, select Enter System Out-of-Box Experience (OOBE), select the Generalize check box, select **Shutdown**, and then click **OK**, as shown in the image below. This will generalize the operating system and shut down the system.

	![][1]

For an Ubuntu VM, use virt-sysprep to achieve the same. See [virt-sysprep](http://manpages.ubuntu.com/manpages/precise/man1/virt-sysprep.1.html) for more details. See also some of the open source [Linux Server Provisioning software](http://www.cyberciti.biz/tips/server-provisioning-software.html) for other Linux operating systems.

#### Unique Operating System VHD to create a single VM instance

If you have an application running on the VM which requires the machine specific data, do not generalize the VHD. A non-generalized VHD can be used to create a unique Azure VM instance. For example, if you have Domain Controller on your VHD, executing sysprep will make it ineffective as a Domain Controller. Review the applications running on your VM and impact of sysprep on them before generalizing VHD.

#### Data disk VHDs to be attached to VM instance(s)

If you have data disks in a cloud storage to be migrated you must make sure the VMs that use these data disks must be shut down. For data disks that are on-premises, create a consistent VHD.

## Copy VHDs to Azure Storage

Now that the VHD is ready, follow the steps described below to upload VHD to Azure Storage and register it as an operating system image, provisioned operating system disk, or provisioned data disk.

### Create the destination for your VHD

Create a storage account for maintaining your VHDs. Take into account the following points when planning where to store your VHDs:

- The target storage account could be standard or premium storage depending on your application requirement.
- The storage account location must be same as the DS-series, DSv2-series or GS-series Azure VMs you will create in the final stage. You could copy to a new storage account, or plan to use the same storage account based on your needs.
- Copy and save the storage account key of the destination storage account for the next stage.
- For data disks, you can choose to keep some data disks in a standard storage account (for example, disks that have cooler storage), and move disks with heavy IOPS to a premium storage account.

### Copy your VHD from the source

Below we describe some scenarios for copying your VHD.

#### Copy VHD from Azure Storage

If you are migrating VHD from a Standard Azure storage account to a Premium Azure storage account, you must copy the source path of VHD container, the VHD file name and the storage account key of the source storage account.

1. Go to **Azure Portal > Virtual Machines > Disks**.
2. Copy and save the VHD’s container URL from the Location column. The container URL will be similar to `https://myaccount.blob.core.windows.net/mycontainer/`.

#### Copy VHD from non-Azure Cloud

If you are migrating VHD from non-Azure Cloud Storage to Azure, you must first export the VHD to a local directory. Copy the complete source path of local directory where VHD is stored.

1. If you are using AWS, export the EC2 instance to a VHD in an Amazon S3 bucket. Follow the steps described in  the Amazon documentation for [Exporting Amazon EC2 Instances](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ExportingEC2Instances.html) to install the Amazon EC2 command-line interface (CLI) tool and run the command to export the EC2 instance to a VHD file.

	Be sure to use **VHD** for the DISK&#95;IMAGE&#95;FORMAT variable when running the command. The exported VHD file is saved in the Amazon S3 bucket you designate during that process.

	![][2]

2. Download the VHD file from the S3 bucket. Select the VHD file, then **Actions** > **Download**.

	![][3]|

#### Copy a VHD from On-Premise

If you are migrating VHD from an on premise environment, you will need the complete source path where VHD is stored. This could be a server location or file share.

### Copy a VHD with AzCopy

Using AzCopy you can easily upload the VHD over the Internet. Depending on the size of the VHDs, this may take time. Remember to check the storage account ingress/egress limits when using this option. See [Azure Storage Scalability and Performance Targets](storage-scalability-targets.md) for details.

1. Download and install AzCopy from here: [Latest version of AzCopy](http://aka.ms/downloadazcopy)
2. Open Azure PowerShell and go to the folder where AzCopy is installed.
3. Use the following command to copy the VHD file from "Source" to "Destination".

		AzCopy /Source: <source> /SourceKey: <source-account-key> /Dest: <destination> /DestKey: <dest-account-key> /BlobType:page /Pattern: <file-name>

	Here are descriptions of the parameters used in the AzCopy command:

 - **/Source: *&lt;source&gt;:*** Location of the folder or storage container URL that contains the VHD.
 - **/SourceKey: *&lt;source-account-key&gt;:*** Storage account key of the source storage account.
 - **/Dest: *&lt;destination&gt;:*** Storage container URL to copy the VHD to.
 - **/DestKey: *&lt;dest-account-key&gt;:*** Storage account key of the destination storage account.
 - **/BlobType: page:** Specifies that the destination is a page blob.
 - **/Pattern: *&lt;file-name&gt;:*** Specify the file name of the VHD to copy.

For details on using AzCopy tool, see [Transfer data with the AzCopy Command-Line Utility](storage-use-azcopy.md).

### Copy a VHD with PowerShell
You can also copy the VHD file using the PowerShell cmdlet Start-AzureStorageBlobCopy. Use the following command on Azure PowerShell to copy VHD. Replace the values in <> with corresponding values from your source and destination storage account. To use this command, you must have a container called vhds in your destination storage account. If the container doesn’t exist, create one before running the command.

    $sourceBlobUri = "https://sourceaccount.blob.core.windows.net/vhds/myvhd.vhd"
    $sourceContext = New-AzureStorageContext  –StorageAccountName <source-account> -StorageAccountKey <source-account-key>
    $destinationContext = New-AzureStorageContext  –StorageAccountName <dest-account> -StorageAccountKey <dest-account-key>
    Start-AzureStorageBlobCopy -srcUri $sourceBlobUri -SrcContext $sourceContext -DestContainer "vhds" -DestBlob "myvhd.vhd" -DestContext $destinationContext

### Other options for uploading a VHD

You can also upload a VHD to your storage account using one of the following means:

- [Azure Storage Copy Blob API](https://msdn.microsoft.com/library/azure/dd894037.aspx)
- [Storage Import/Export Service REST API Reference](https://msdn.microsoft.com/library/dn529096.aspx)

>[AZURE.NOTE] Import/Export can be used to copy to only standard storage account. You will need to copy from standard storage to premium storage account using a tool like AzCopy.

## Create Azure VMs using Premium Storage

After the VHD is uploaded to the desired storage account, follow the instructions in this section to register the VHD as an OS image, or OS disk depending on your scenario and then create a VM instance from it. The data disk VHD can be attached to the VM once it is created.

### Register your VHD

In order to create a VM from OS VHD or to attach a data disk to a new VM, you must first register them. Follow steps below depending on your scenario.

#### Generalized Operating System VHD to create multiple Azure VM instances

After generalized OS image VHD is uploaded to storage account, register it as an **Azure VM Image** so that you can create one or more VM instances from it. Use the following PowerShell cmdlets to register your VHD as an Azure VM OS image. Provide the complete container URL where VHD was copied to.

	Add-AzureVMImage -ImageName "OSImageName" -MediaLocation "https://storageaccount.blob.core.windows.net/vhdcontainer/osimage.vhd" -OS Windows

Copy and save the name of this new Azure VM Image. In the example above, it is *OSImageName*.

#### Unique Operating System VHD to create a single Azure VM instance

After the unique OS VHD is uploaded to storage account, register it as an **Azure OS Disk** so that you can create a VM instance from it. Use these PowerShell cmdlets to register your VHD as an Azure OS Disk. Provide the complete container URL where VHD was copied to.

	Add-AzureDisk -DiskName "OSDisk" -MediaLocation "https://storageaccount.blob.core.windows.net/vhdcontainer/osdisk.vhd" -Label "My OS Disk" -OS "Windows"

Copy and save the name of this new Azure OS Disk. In the example above, it is *OSDisk*.

#### Data Disk VHD to be attached to new Azure VM instance(s)

After the data disk VHD is uploaded to storage account, register it as an Azure Data Disk so that it can be attached to your new DS Series, DSv2 series or GS Series Azure VM instance.

Use these PowerShell cmdlets to register your VHD as an Azure Data Disk. Provide the complete container URL where VHD was copied to.

	Add-AzureDisk -DiskName "DataDisk" -MediaLocation "https://storageaccount.blob.core.windows.net/vhdcontainer/datadisk.vhd" -Label "My Data Disk"

Copy and save the name of this new Azure Data Disk. In the example above, it is *DataDisk*.

### Create an Azure DS-series, DSv2-series or GS-series VM

Once the OS image or OS disk are registered, create a new DS-series, DSv2-series or GS-series VM. You will be using the operating system image or operating system disk name that you registered. Select the VM type from the Premium Storage tier. In example below, we are using the *Standard_DS2* VM size.

>[AZURE.NOTE] Update the disk size to make sure it matches your capacity and performance requirements, and the available Azure disk sizes.

Follow the step by step PowerShell cmdlets below to create the new VM. First, set the common parameters:

	$serviceName = "yourVM"
	$location = "location-name" (e.g., West US)
	$vmSize ="Standard_DS2"
	$adminUser = "youradmin"
	$adminPassword = "yourpassword"
	$vmName ="yourVM"
	$vmSize = "Standard_DS2"

First, create a cloud service in which you will be hosting your new VMs.

	New-AzureService -ServiceName $serviceName -Location $location

Next, depending on your scenario, create the Azure VM instance from either the OS Image or OS Disk that you registered.

#### Generalized Operating System VHD to create multiple Azure VM instances

Create the one or more new DS Series Azure VM instances using the **Azure OS Image** that you registered. Specify this OS Image name in the VM configuration when creating new VM as shown below.

	$OSImage = Get-AzureVMImage –ImageName "OSImageName"

	$vm = New-AzureVMConfig -Name $vmName –InstanceSize $vmSize -ImageName $OSImage.ImageName

	Add-AzureProvisioningConfig -Windows –AdminUserName $adminUser -Password $adminPassword –VM $vm

	New-AzureVM -ServiceName $serviceName -VM $vm

#### Unique Operating System VHD to create a single Azure VM instance

Create a new DS series Azure VM instance using the **Azure OS Disk** that you registered. Specify this OS Disk name in the VM configuration when creating the new VM as shown below.

	$OSDisk = Get-AzureDisk –DiskName "OSDisk"

	$vm = New-AzureVMConfig -Name $vmName -InstanceSize $vmSize -DiskName $OSDisk.DiskName

	New-AzureVM -ServiceName $serviceName –VM $vm

Specify other Azure VM information, such as a cloud service, region, storage account, availability set, and caching policy. Note that the VM instance must be co-located with associated operating system or data disks, so the selected cloud service, region, and storage account must all be in the same location as the underlying VHDs of those disks.

### Attach data disk

Lastly, if you have registered data disk VHDs, attach them to the new DS-series, DSv2-series or GS-series Azure VM.

Use following PowerShell cmdlet to attach data disk to the new VM and specify the caching policy. In example below the caching policy is set to *ReadOnly*.

	$vm = Get-AzureVM -ServiceName $serviceName -Name $vmName

	Add-AzureDataDisk -ImportFrom -DiskName "DataDisk" -LUN 0 –HostCaching ReadOnly –VM $vm

	Update-AzureVM  -VM $vm

>[AZURE.NOTE] There may be additional steps necessary to support your application that are not be covered by this guide.

## Migrating existing Azure VMs to Azure Premium Storage

If you currently have an Azure VM that uses Standard Storage disks, follow the process below for migrating that to Premium Storage. At a high-level, the migration involves two stages:
-	Migrating the disks from Standard Storage account to a Premium Storage account
-	Converting the VM size from A/D/G to DS, DSv2 or GS needed for using Premium Storage disks.

In addition, please refer to the previous section on Considerations for understanding various optimizations you can do for Premium Storage. Depending on the optimizations that are applicable to your applications, the migration process may fall into one of the migration scenarios below.

### A simple migration
In this simple scenario, you are looking to preserve your configuration as is while migrating from Standard Storage to Premium Storage. Here you’ll move each of your disks as is and then convert the VM as well.
Benefit of this is the ease of migration; and the downside is, the resulting configuration may not be optimized for the lowest cost.

#### Preparation
1. Make sure Premium Storage is available in the region you are migrating to.
2. Decide the new VM series you will be using. It should be DS series, DSv2 series or GS series depending on the availability in the region and based on your needs.
3. Decide the exact VM size you will use. VM size needs to be large enough to support the number of data disks you have. E.g. if you have 4 data disks, the VM must have 2 or more cores. Also consider processing power, memory and network bandwidth needs.
4. Create a Premium Storage account in the target region. This is the account you will use for the new VM.
5. Have the current VM details handy, including the list of disks and corresponding VHD blobs.
6. Prepare your application for downtime. In order to do a clean migration, you have to stop all the processing in the current system. Only then you can get it to consistent state which you can migrate to the new platform. Downtime duration will depend on the amount of data in the disks to migrate.

#### Execution steps
1.	Stop the VM. As explained above, the VM needs to be fully down in order to migrate a clean state. There will be a downtime until the migration completes.

2.	Once the VM has stopped, copy each of the VHDs of that VM to your new Premium Storage account. You have to copy the OS disk VHD blob as well as all the data disk VHD blobs. For migrating we recommend use of AzCopy or CopyBlob. You can use other 3rd party tools as well if you prefer.

  Refer to the earlier sections on [Copy a VHD with AzCopy](#copy-a-vhd-with-azcopy) or [Copy a VHD with PowerShell](#copy-a-vhd-with-powershell) for the commands.

3.	Verify if the copying is complete. Wait until all the disks are copied. Once all the disks are copied over, you are ready to proceed to the next steps, for creating the new VM.
4.	Create a new OS Disk using the OS disk VHD blob that you copied in Premium Storage account. You can do this using “Add-AzureDisk” PowerShell cmdlet.

    Sample script:
          Add-AzureDisk -DiskName "NewOSDisk1" -MediaLocation "https://newpremiumstorageaccount.blob.core.windows.net/vhds/MyOSDisk.vhd" -OS "Windows"
5. Next, create your DS series VM (or DSv2 series or GS series) using the above OS disk and the data disks.

    Sample script to create a new cloud service and a new VM within that service:
        New-AzureService -ServiceName “NewServiceName” -Location “East US 2"

        New-AzureVMConfig -Name "NewDSVMName" -InstanceSize "Standard_DS2" -DiskName "NewOSDisk1" | Add-AzureProvisioningConfig -Windows | Add-AzureDataDisk -LUN 0 -DiskLabel "DataDisk1" -ImportFrom -MediaLocation "https://newpremiumstorageaccount.blob.core.windows.net/vhds/Disk1.vhd" | Add-AzureDataDisk -LUN 1 -DiskLabel "DataDisk2" -ImportFrom -MediaLocation https://newpremiumstorageaccount.blob.core.windows.net/vhds/Disk2.vhd | New-AzureVM -ServiceName "NewServiceName" –Location “East US 2”

6.	Once the new VM is up and running, access it using the same login id and password is as the original VM, and verify that everything is working as expected. All the settings, including the striped volumes would be present in the new VM.

7.	Last step is to plan backup and maintenance schedule for the new VM based on the application’s needs.

### Automation
If you have multiple VMs to migrate, automation through PowerShell scripts will be helpful. Following is a sample script that automates the migration of a VM. Note that below script is only an example and there are few assumptions made about the current VM disks. You may need to update the script to match with your specific scenario.

    <#
    .Synopsis
    This script is provided as an EXAMPLE to show how to migrate a vm from a standard storage account to a premium storage account. You can customize it according to your specific requirements.

    .Description
    The script will copy the vhds (page blobs) of the source vm to the new storage account.
    And then it will create a new vm from these copied vhds based on the inputs that you specified for the new VM.
    You can modify the script to satisfy your specific requirement but please be aware of the items specified
    in the Terms of Use section.

    .Terms of Use
    Copyright © 2015 Microsoft Corporation.  All rights reserved.

    THIS CODE AND ANY ASSOCIATED INFORMATION ARE PROVIDED “AS IS” WITHOUT WARRANTY OF ANY KIND,
    EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY
    AND/OR FITNESS FOR A PARTICULAR PURPOSE. THE ENTIRE RISK OF USE, INABILITY TO USE, OR
    RESULTS FROM THE USE OF THIS CODE REMAINS WITH THE USER.

    .Example (Save this script as Migrate-AzureVM.ps1)

    .\Migrate-AzureVM.ps1 -SourceServiceName CurrentServiceName -SourceVMName CurrentVMName –DestStorageAccount newpremiumstorageaccount -DestServiceName NewServiceName -DestVMName NewDSVMName -DestVMSize "Standard_DS2" –Location “Southeast Asia”

    .Link
    To find more information about how to set up Azure PowerShell, refer to the following links.
    http://azure.microsoft.com/documentation/articles/powershell-install-configure/
    http://azure.microsoft.com/documentation/articles/storage-powershell-guide-full/
    http://azure.microsoft.com/blog/2014/10/22/migrate-azure-virtual-machines-between-storage-accounts/

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

    # how frequently to report the copy status in sceconds
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
    Write-Host "`n[WORKITEM] - Checking Azure PowerShell module verion" -ForegroundColor Yellow
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
        Write-Host "[ERROR] - There is no valid azure subscription found in PowerShell. Please refer to this article http://azure.microsoft.com/documentation/articles/powershell-install-configure/ to connect an azure subscription. Exiting." -ForegroundColor Red
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
        Write-Host "[Warning] - Stopping the VM is a required step so that the file system is consistent when you do the copy operation. Azure does not support live migration at this time. If you’d like to create a VM from a generalized image, sys-prep the Virtual Machine before stopping it." -ForegroundColor Yellow
        $ContinueAnswer = Read-Host "`n`tDo you wish to stop $SourceVMName now? Input 'N' if you want to shut down the vm mannually and come back later.(Y/N)"
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

    # exporting the sourve vm to a configuration file, you can restore the original VM by importing this config file
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
    $sourceStorageKey = (Get-AzureStorageKey -StorageAccountName $sourceStorageAccountName).Primary
    $sourceContext = New-AzureStorageContext –StorageAccountName $sourceStorageAccountName -StorageAccountKey $sourceStorageKey

    # Create destination context
    $destStorageKey = (Get-AzureStorageKey -StorageAccountName $DestStorageAccount).Primary
    $destContext = New-AzureStorageContext –StorageAccountName $DestStorageAccount -StorageAccountKey $destStorageKey

    # Create a container of vhds if it doesn't exist
    if ((Get-AzureStorageContainer -Context $destContext -Name vhds -ErrorAction SilentlyContinue) -eq $null)
    {
        Write-Host "`n[WORKITEM] - Creating a container vhds in the destination storage account." -ForegroundColor Yellow
        New-AzureStorageContainer -Context $destContext -Name vhds
    }


    $allDisksToCopy = $sourceDataDisks
    # check if need to copy os disk
    $sourceOSVHD = $sourceOSDisk.MediaLink.Segments[2]
    if ($DataDiskOnly)
    {
        # copy data disks only, this option requires to delete the source VM so that dest VM can boot
        # from the same vhd blob.
        $ContinueAnswer = Read-Host "`n`tMoving VM requires to remove the original VM (the disks and backing vhd files will NOT be deleted) so that the new VM can boot from the same vhd. Do you wish to proceed right now? (Y/N)"
        If ($ContinueAnswer -ne "Y") { Write-Host "`n Exiting." -ForegroundColor Red;Exit }
        $destOSVHD = Get-AzureStorageBlob -Blob $sourceOSVHD -Container vhds -Context $sourceContext
        Write-Host "`n[WORKITEM] - Removing the original VM (the vhd files are NOT deleted)." -ForegroundColor Yellow
        Remove-AzureVM -Name $SourceVMName -ServiceName $SourceServiceName

        Write-Host "`n[WORKITEM] - Waiting utill the OS disk is released by source VM. This may take up to several minutes."
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
        $targetBlob = Start-AzureStorageBlobCopy -SrcContainer vhds -SrcBlob $sourceOSVHD -DestContainer vhds -DestBlob $sourceOSVHD -Context $sourceContext -DestContext $destContext -Force
        $destOSVHD = $targetBlob
    }


    # Copy all data disk vhds
    # Start all async copy requests in parallel.
    foreach($disk in $sourceDataDisks)
    {
        $blobName = $disk.MediaLink.Segments[2]
        # copy all data disks
        Write-Host "`n[WORKITEM] - Starting copying data disk $($disk.DiskName) at $(get-date)." -ForegroundColor Yellow
        $targetBlob = Start-AzureStorageBlobCopy -SrcContainer vhds -SrcBlob $blobName -DestContainer vhds -DestBlob $blobName -Context $sourceContext -DestContext $destContext -Force
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
            $copyState = Get-AzureStorageBlobCopyState -Blob $blobName -Container vhds -Context $destContext
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

    # Create a vm from the existing os disk
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

    # Edit this if you want to add more custimization to the new VM
    # $vm | Add-AzureEndpoint -Protocol tcp -LocalPort 443 -PublicPort 443 -Name 'HTTPs'
    # $vm | Set-AzureSubnet "PubSubnet","PrivSubnet"

    New-AzureVM -ServiceName $DestServiceName -VMs $vm -Location $Location

### Optimization
Your current VM configuration may be customized specifically to work well with Standard disks. For instance, to increase the performance by using many disks in a striped volume. Since Premium Storage disks provide better performance, you will be able to optimize your cost by reducing the number of disks. For example, your application may need a volume with 2000 IOPS, and you may be using a stripe set of 4 Standard storage disks to get 4 x 500 = 2000 IOPS. With Premium Storage disk, a single disk of 512 GB will be able to provide 2300 IOPS. Thus, instead of using 4 disks separately on Premium Storage, you may be able to optimize the cost by having a single disk.
Optimizations like this need to be handled on a case by case basis and requires custom steps after the migration. Also note that this process may not well work for databases and applications that depend on the disk layout defined in the setup.

#### Preparation
1.	Complete the Simple Migration as described in the earlier section. Optimizations will be performed on the new VM after the migration.
2.	Define the new disk sizes needed for the optimized configuration.
3.	Determine mapping of the current disks/volumes to the new disk specifications.

#### Execution steps:
1.	Create the new disks with the right sizes on the Premium Storage VM.
2.	Login to the VM and copy the data from the current volume to the new disk that maps to that volume. Do this for all the current volumes that need to map to a new disk.
3.	Next, change the application settings to switch to the new disks, and detach the old volumes.

###  Application migrations
Databases and other complex applications may require special steps as defined by the application provider for the migration. Please refer to respective application documentation. E.g. typically databases can be migrated through backup and restore.

## Next steps

See the following resources for specific scenarios for migrating virtual machines:

- [Migrate Azure Virtual Machines between Storage Accounts](https://azure.microsoft.com/blog/2014/10/22/migrate-azure-virtual-machines-between-storage-accounts/)
- [Create and upload a Windows Server VHD to Azure.](../virtual-machines/virtual-machines-windows-classic-createupload-vhd.md)
- [Creating and Uploading a Virtual Hard Disk that Contains the Linux Operating System](../virtual-machines/virtual-machines-linux-classic-create-upload-vhd.md)
- [Migrating Virtual Machines from Amazon AWS to Microsoft Azure](http://channel9.msdn.com/Series/Migrating-Virtual-Machines-from-Amazon-AWS-to-Microsoft-Azure)

Also see the following resources to learn more about Azure Storage and Azure Virtual Machines:

- [Azure Storage](https://azure.microsoft.com/documentation/services/storage/)
- [Azure Virtual Machines](https://azure.microsoft.com/documentation/services/virtual-machines/)
- [Premium Storage: High-Performance Storage for Azure Virtual Machine Workloads](storage-premium-storage.md)

[1]:./media/storage-migration-to-premium-storage/migration-to-premium-storage-1.png
[2]:./media/storage-migration-to-premium-storage/migration-to-premium-storage-1.png
[3]:./media/storage-migration-to-premium-storage/migration-to-premium-storage-3.png
