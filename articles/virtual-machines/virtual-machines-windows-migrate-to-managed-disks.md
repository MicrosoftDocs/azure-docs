---
title: Migrate to managed disks in Azure | Microsoft Docs
description: Migrate virtual machines created using storage accounts to use managed disks.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 1/19/2017
ms.author: cynthn

---

# Migrate to managed disks in Azure

Azure Managed Disks remove the need to mange Storage Accounts for Azure VMs. You have to only specify the storage type, either ([Premium](https://docs.microsoft.com/en-us/azure/storage/storage-premium-storage-performance) or Standard, and size of disk you need. Azure will create and manage the disk for you. Migrate your existing Azure VMs to Managed Disks to get away from day-to-day management of Storage accounts for your VMs.

If you are currently using the Standard storage option for your VM disks, you can migrate to Premium Managed Disks to take advantage of speed and performance of these Disks. [Premium Managed Disks](https://docs.microsoft.com/en-us/azure/storage/storage-premium-storage-performance) are Solid State Drive (SSD) based storage which delivers high-performance, low-latency disk support for virtual machines running I/O-intensive workloads.

You can migrate to Managed Disks in following scenarios:

- VMs on Premium storage account based disks to Premium Managed Disks

- VMs on Standard storage acocunt based disks to Standard Managed Disks

- VMs on Standard storage account based disks to Premium Managed Disks

- VMs created in the classic deployment model to Premium or Standard Managed Disks in the Resource Manager model


## Plan for the migration to Managed Disks

Make sure you are ready to follow the migration steps and to make the best decisions on VM and Disk types.

An Azure VM supports attaching several Managed disks so that your applications can have up to 64 TB of storage per VM. For example, with Premium Managed Disks, your applications can achieve 80,000 IOPS (input/output operations per second) per VM and 2000 MB per second disk throughput per VM with extremely low latencies for read operations. You have options in a variety of VMs and Disks. This section is to help you to find an option that best suits your workload.

### VM sizes

The Azure VM size specifications are listed in [Sizes for virtual machines](https://docs.microsoft.com/en-us/azure/virtual-machines/virtual-machines-windows-sizes?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). Review the performance characteristics of virtual machines that work with Premium and Standard Storage to choose the most appropriate VM size that best suits your workload. Make sure that there is sufficient bandwidth available on your VM to drive the disk traffic.


### Disk Sizes

**Premium Managed Disks**

There are three types of Premium Managed disks that can be used with your VM and each has specific IOPs and throughput limits. Take into consideration these limits when choosing the Premium disk type for your VM based on the needs of your application in terms of capacity, performance, scalability, and peak loads.

| Premium Disks Type  | P10               | P20               | P30               |
|---------------------|-------------------|-------------------|-------------------|
| Disk size           | 128 GB            | 512 GB            | 1024 GB (1 TB)    |
| IOPS per disk       | 500               | 2300              | 5000              |
| Throughput per disk | 100 MB per second | 150 MB per second | 200 MB per second |

**Standard Managed Disks**

There are five types of Standard Managed disks that can be used with your VM. Each of them have different capacity but have same IOPS and throughput limits. Choose the type of Standard Managed disks based on the capacity needs of your application.

| Standard Disk Type  | S4               | S6               | S10              | S20              | S30              |
|---------------------|------------------|------------------|------------------|------------------|------------------|
| Disk size           | 30 GB            | 64 GB            | 128 GB           | 512 GB           | 1024 GB (1 TB)   |
| IOPS per disk       | 500              | 500              | 500              | 500              | 500              |
| Throughput per disk | 60 MB per second | 60 MB per second | 60 MB per second | 60 MB per second | 60 MB per second |

Depending on your workload, determine if additional data disks are necessary for your VM. You can attach several persistent data disks to your VM. If needed, you can stripe across the disks to increase the capacity and performance of the volume. (See what is Disk Striping [here](https://docs.microsoft.com/en-us/azure/storage/storage-premium-storage-performance#disk-striping).) If you stripe Premium Managed data disks using [Storage Spaces](http://technet.microsoft.com/library/hh831739.aspx), you should configure it with one column for each disk that is used. Otherwise, the overall performance of the striped volume may be lower than expected due to uneven distribution of traffic across the disks. For Linux VMs you can use the *mdadm* utility to achieve the same. See article [Configure Software RAID on Linux](https://docs.microsoft.com/en-us/azure/virtual-machines/virtual-machines-linux-configure-raid?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) for details.

###Disk caching policy

**Premium Managed Disks**

By default, disk caching policy is *Read-Only* for all the Premium data disks, and *Read-Write* for the Premium operating system disk attached to the VM. This configuration setting is recommended to achieve the optimal performance for your application’s IOs. For write-heavy or write-only data disks (such as SQL Server log files), disable disk caching so that you can achieve better application performance. The cache settings for existing data disks can be updated using [Azure Portal](https://portal.azure.com/) or the *-HostCaching* parameter of the *Set-AzureDataDisk* cmdlet.

**Standard Managed Disks**

[TBD](xxx.md)

### Location

Pick a location where Azure Managed Disks are available. If you are migrating to Premium Managed Disks, also ensure that Premium storage is available in the region where you are planning to migrate to. See [Azure Services by Region](https://azure.microsoft.com/regions/#services) for up-to-date information on available locations.


### Optimization

[Azure Premium Storage: Design for High Performance](https://docs.microsoft.com/en-us/azure/storage/storage-premium-storage-performance) provides guidelines for building high-performance applications using Azure Premium Storage. You can follow the guidelines combined with performance best practices applicable to technologies used by your application.




<span id="prepare-and-copy-virtual-hard-disks-VHDs" class="anchor"><span id="_Toc471211691" class="anchor"></span></span>Migrate existing Azure VMs on Premium Non-Managed Disks to Premium Managed Disks
=========================================================================================================================================================================================================

This section will help you to migrate your existing Azure VMs on Premium Non-Managed Disks to Premium Managed Disks.

You have to take following steps for this migration:

Plan for the migration 
-----------------------

Please go through the section **“**Plan for the migration to Managed Disks” and ensure that you have completed all the pre-requisites and evaluated all the consideration mentioned in the section.

Perform the migration 
----------------------

**TBD (Feature in-progress)**

<span id="create-azure-virtual-machine-using-premi" class="anchor"><span id="_Toc471211694" class="anchor"></span></span>Migrate existing Azure VMs on Standard Non-Managed Disks to Standard Managed Disks
===========================================================================================================================================================================================================

This section will help you to migrate your existing Azure VMs on Standard Non-Managed Disks to Standard Managed Disks.

You have to take following steps for this migration:

Plan for the migration 
-----------------------

Please go through the section **“**Plan for the migration to Managed Disks” and ensure that you have completed all the pre-requisites and evaluated all the consideration mentioned in the section.

Perform the migration 
----------------------

**TBD (Feature in-progress)**










Migrate existing Azure Classic VMs to Managed Disks
===================================================

This section will help you to migrate your existing Azure Classic VMs to Managed Disks.

You have to take following steps for this migration:

Plan for the migration 
-----------------------

Please go through the section **“**Plan for the migration to Managed Disks” and ensure that you have completed all the pre-requisites and evaluated all the consideration mentioned in the section.

Prepare virtual hard disks (VHDs) for the migration
---------------------------------------------------

If you are migrating existing Azure Classic VMs to Managed Disks, your VHD may be:

-   A generalized operating system image

-   A unique operating system disk

-   A data disk

Below we walk through these 3 scenarios for preparing your VHD.

**Use a generalized Operating System VHD to create multiple VM instances**

If you are uploading a VHD that will be used to create multiple generic Azure VM instances, you must first generalize VHD using a sysprep utility. Sysprep removes any machine-specific information from the VHD.

\[!IMPORTANT\] Take a snapshot or backup your VM before generalizing it. Running sysprep will stop and deallocate the VM instance. Follow steps below to sysprep a Windows OS VHD. Note that running the Sysprep command will require you to shut down the virtual machine. For more information about Sysprep, see [Sysprep Overview](http://technet.microsoft.com/library/hh825209.aspx) or [Sysprep Technical Reference](http://technet.microsoft.com/library/cc766049.aspx).

1.  Open a Command Prompt window as an administrator.

2.  Enter the following command to open Sysprep:

    %windir%\\system32\\sysprep\\sysprep.exe

3.  In the System Preparation Tool, select Enter System Out-of-Box Experience (OOBE), select the Generalize check box, select **Shutdown**, and then click **OK**, as shown in the image below. Sysprep will generalize the operating system and shut down the system.

> <img src="./media/image1.png" width="436" height="237" />

For an Ubuntu VM, use virt-sysprep to achieve the same. See [virt-sysprep](http://manpages.ubuntu.com/manpages/precise/man1/virt-sysprep.1.html) for more details. See also some of the open source [Linux Server Provisioning software](http://www.cyberciti.biz/tips/server-provisioning-software.html) for other Linux operating systems.

**Use a unique Operating System VHD to create a single VM instance**

If you have an application running on the VM which requires the machine specific data, do not generalize the VHD. A non-generalized VHD can be used to create a unique Azure VM instance. For example, if you have Domain Controller on your VHD, executing sysprep will make it ineffective as a Domain Controller. Review the applications running on your VM and the impact of running sysprep on them before generalizing the VHD.

**Data disk VHD**

If you have data disks in Azure to be migrated, you must make sure the VMs that use these data disks are shut down.

Create a new Azure VM using Managed Disks
-----------------------------------------

After you have prepared VHD files for migration, follow the instructions in this section to create a VM Image or OS Disk using the OS VHD file depending on your scenario and then create a VM instance from it. You can also create data Disks from data VHDs and attach to new VMs.

### Checklist

1.  If you are migrating to Premium Managed Disks, make sure it is available in the region you are migrating to.

2.  Decide the new VM series you will be using. It should be a Premium Storage capable if you are migrating to Premium Managed Disks.

3.  Decide the exact VM size you will use which are available in the region you are migrating to. VM size needs to be large enough to support the number of data disks you have. E.g. if you have 4 data disks, the VM must have 2 or more cores. Also, consider processing power, memory and network bandwidth needs.

4.  Have the current VM details handy, including the list of disks and corresponding VHD blobs.

Prepare your application for downtime. To do a clean migration, you have to stop all the processing in the current system. Only then you can get it to consistent state which you can migrate to the new platform. Downtime duration will depend on the amount of data in the disks to migrate.

### Generalized (sysprepped) OS VHD and data VHDs to create multiple Azure VM instances

Create a VM Image using your generalized OS VHD and data Disks using data VHDs so that you can create one or more VM instances from the Image and data Disks.

**Note:**

Update the VM size to make sure it matches your capacity and performance requirements.

Follow the step by step PowerShell cmdlets below to create the new VM.

1.  First, set the common parameters:

> $resourceGroupName = 'yourResourceGroupName'
>
> $location = 'locationName' \#(e.g., southeastasia)
>
> $virtualNetworkName = 'yourExistingVirtualNetworkName'
>
> $virtualMachineName = 'yourVMName'
>
> $virtualMachineSize = 'Standard\_DS3'
>
> $adminUserName = "youradmin"
>
> $adminPassword = "yourpassword" | ConvertTo-SecureString -AsPlainText -Force
>
> $imageName = 'yourImageName'
>
> $osVhdUri = 'https://storageaccount.blob.core.windows.net/vhdcontainer/osdisk.vhd'
>
> $dataVhdUri = 'https://storageaccount.blob.core.windows.net/vhdcontainer/datadisk1.vhd'
>
> $dataDiskName = 'yourDataDiskName'

1.  Create a VM Image using your generalized OS VHD

    Ensure that you have provided the complete URI of the OS VHD to the $osVhdUri parameter.

> $imageConfig = New-AzureRmImageConfig -Location $location
>
> $imageConfig = Set-AzureRmImageOsDisk -Image $imageConfig -OsType Windows -OsState Generalized -BlobUri $osVhdUri
>
> $image = New-AzureRmImage -ImageName $imageName -ResourceGroupName $resourceGroupName -Image $imageConfig

1.  Set the created VM Image as source Image for the new machine

    $VirtualMachine = New-AzureRmVMConfig -VMName $virtualMachineName -VMSize $virtualMachineSize

    $VirtualMachine = Set-AzureRmVMSourceImage -VM $VirtualMachine -Id $image.Id

2.  Set the OS disk configuration. Enter the storage type (Premium or Standard), size of the OS disk

    $VirtualMachine = Set-AzureRmVMOSDisk -VM $VirtualMachine  -ManagedDiskStorageAccountType PremiumLRS -DiskSizeInGB 128 -CreateOption FromImage -Caching ReadWrite

3.  Create a data Disk from the data VHD file and add it to the new VM

    **Note**:

    Please enter the Disk Size as per the storage capacity and performance you require for your application. Also, enter AccountType as PremiumLRS or StandardLRS based on type of disks (Premium or Standard) you are migrating to.

> $dataDisk1 = New-AzureRmDisk -DiskName $dataDiskName -Disk (New-AzureRmDiskConfig -AccountType PremiumLRS -Location $location -CreationDataCreateOption Empty -DiskSizeGB 128) -ResourceGroupName $resourceGroupName
>
> $VirtualMachine = Add-AzureRmVMDataDisk -VM $VirtualMachine -Name $dataDiskName -CreateOption Attach -ManagedDiskId $dataDisk1.Id -Lun 1

1.  Create the new VM by setting public IP, Virtual Network, NIC

    $publicIp = New-AzureRmPublicIpAddress -Name ($VirtualMachineName.ToLower()+'\_ip') -ResourceGroupName $resourceGroupName -Location $location -AllocationMethod Dynamic

    $vnet = Get-AzureRmVirtualNetwork -Name $virtualNetworkName -ResourceGroupName $resourceGroupName

    $nic = New-AzureRmNetworkInterface -Name ($VirtualMachineName.ToLower()+'\_nic') -ResourceGroupName $resourceGroupName -Location $location -SubnetId $vnet.Subnets\[0\].Id -PublicIpAddressId $publicIp.Id

    $VirtualMachine = Add-AzureRmVMNetworkInterface -VM $VirtualMachine -Id $nic.Id

    $VirtualMachine = Set-AzureRmVMOperatingSystem -VM $VirtualMachine -Windows -ComputerName $virtualMachineName -Credential (New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList $adminUserName, $adminPassword ) -EnableAutoUpdate

    New-AzureRmVM -VM $VirtualMachine -ResourceGroupName $resourceGroupName -Location $location

### Specialized (non-sysprepped) OS VHD and data VHD to create a single Azure VM instance

Create an OS disk using your specialized OS VHD and data Disks using data VHDs so that you can create a new VM instance from the OS and data Disks.

**Note:**

Update the VM size to make sure it matches your capacity and performance requirements.

Follow the step by step PowerShell cmdlets below to create the new VM.

1.  First, set the common parameters:

> $resourceGroupName = 'yourResourceGroupName'
>
> $location = 'locationName' \#(e.g., southeastasia)
>
> $virtualNetworkName = 'yourExistingVirtualNetworkName'
>
> $virtualMachineName = 'yourVMName'
>
> $virtualMachineSize = 'Standard\_DS3'
>
> $adminUserName = "youradmin"
>
> $adminPassword = "yourpassword" | ConvertTo-SecureString -AsPlainText -Force
>
> $imageName = 'yourImageName'
>
> $osVhdUri = 'https://storageaccount.blob.core.windows.net/vhdcontainer/osdisk.vhd'
>
> $dataVhdUri = 'https://storageaccount.blob.core.windows.net/vhdcontainer/datadisk1.vhd'
>
> $dataDiskName = 'dataDisk1'

1.  Create an OS disk using your specialized (non-sysprepped) OS VHD

    Ensure that you have provided the complete URI of the OS VHD to the $osVhdUri parameter. Also, enter AccountType as PremiumLRS or StandardLRS based on type of disks (Premium or Standard) you are migrating to.

> $osDisk = New-AzureRmDisk -DiskName $osDiskName -Disk (New-AzureRmDiskConfig -AccountType PremiumLRS -Location $location -CreationDataCreateOption Import -SourceUri $osVhdUri) -ResourceGroupName $resourceGroupName

1.  Attach the created OS disk to the new VM

    Note:

    Please enter the Disk Size as per the storage capacity and performance you require for your application. Also, enter AccountType as PremiumLRS or StandardLRS based on type of disks (Premium or Standard) you are migrating to.

> $VirtualMachine = New-AzureRmVMConfig -VMName $virtualMachineName -VMSize $virtualMachineSize
>
> $VirtualMachine = Set-AzureRmVMOSDisk -VM $VirtualMachine -ManagedDiskId $osDisk.Id -ManagedDiskStorageAccountType PremiumLRS -DiskSizeInGB 128 -CreateOption Attach -Windows

1.  Create a data disk from the data VHD file and add it to the new VM

    **Note**:

    Please enter the Disk Size as per the storage capacity and performance you require for your application. Also, enter AccountType as PremiumLRS or StandardLRS based on type of disks (Premium or Standard) you are migrating to.

> $dataDisk1 = New-AzureRmDisk -DiskName $dataDiskName -Disk (New-AzureRmDiskConfig -AccountType PremiumLRS -Location $location -CreationDataCreateOption Import -SourceUri $dataVhdUri ) -ResourceGroupName $resourceGroupName
>
> $VirtualMachine = Add-AzureRmVMDataDisk -VM $VirtualMachine -Name $dataDiskName -CreateOption Attach -ManagedDiskId $dataDisk1.Id -Lun 1

1.  Create the new VM by setting public IP, Virtual Network, NIC

    $publicIp = New-AzureRmPublicIpAddress -Name ($VirtualMachineName.ToLower()+'\_ip') -ResourceGroupName $resourceGroupName -Location $location -AllocationMethod Dynamic

    $vnet = Get-AzureRmVirtualNetwork -Name $virtualNetworkName -ResourceGroupName $resourceGroupName

    $nic = New-AzureRmNetworkInterface -Name ($VirtualMachineName.ToLower()+'\_nic') -ResourceGroupName $resourceGroupName -Location $location -SubnetId $vnet.Subnets\[0\].Id -PublicIpAddressId $publicIp.Id

    $VirtualMachine = Add-AzureRmVMNetworkInterface -VM $VirtualMachine -Id $nic.Id

    New-AzureRmVM -VM $VirtualMachine -ResourceGroupName $resourceGroupName -Location $location

**Note:**

There may be additional steps necessary to support your application that is not be covered by this guide.

Checking and plan backup
========================

Once the new VM is up and running, access it using the same login id and password is as the original VM, and verify that everything is working as expected. All the settings, including the striped volumes, would be present in the new VM.

The last step is to plan backup and maintenance schedule for the new VM based on the application's needs.

<span id="a-sample-migration-script" class="anchor"><span id="optimization" class="anchor"><span id="_Toc471211708" class="anchor"></span></span></span>Application migrations
==============================================================================================================================================================================

Databases and other complex applications may require special steps as defined by the application provider for the migration. Please refer to respective application documentation. E.g. typically databases can be migrated through backup and restore.

Next steps
==========

Learn more about Azure VM Disks and Azure Virtual Machines:

-   [Managed Disks Overview](https://microsoft.sharepoint.com/teams/AzureStorage/Private%20Test/2016/Managed%20Disks/GA/Managed%20DIsks%20Overview%20Page)

-   [Premium Storage](https://docs.microsoft.com/en-us/azure/storage/storage-premium-storage-performance)

-   [Standard Storage](https://microsoft.sharepoint.com/teams/AzureStorage/Private%20Test/2016/Managed%20Disks/GA/TBD)

-   [Disks Pricing](https://azure.microsoft.com/en-us/pricing/details/storage/disks/)

-   [Azure Virtual Machines](https://azure.microsoft.com/documentation/services/virtual-machines/)

-   [Premium Storage: High-Performance Storage for Azure Virtual Machine Workloads](https://docs.microsoft.com/en-us/azure/storage/storage-premium-storage)
