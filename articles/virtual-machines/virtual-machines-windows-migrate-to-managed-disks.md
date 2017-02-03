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

Azure managed disks removes the need of managing [Storage accounts](https://docs.microsoft.com/en-us/azure/storage/storage-introduction) for Azure VMs. You only have specify the type ([Premium](https://docs.microsoft.com/en-us/azure/storage/storage-premium-storage-performance) or [Standard](xxx.md) and size of disk you need, and Azure will create and manage the disk for you. Moreover, migrate your existing Azure VMs to Managed Disks to benefit from  better reliability of VMs in an Availability Set. It ensures that the disks of different VMs in an Availability Set will be sufficiently isolated from each other to avoid single point of failures. It automatically places disks of different VMs in an Availability Set in different Storage scale units (stamps) which limits the impact of single Storage scale unit failures caused due to hardware and software failures.

If you are currently using Standard storage option for your Disks, migrate to Premium Managed Disks to take advantage of speed and performance of these Disks. [Premium Managed Disks](https://docs.microsoft.com/en-us/azure/storage/storage-premium-storage-performance) are stored on Solid State Drives (SSD) which deliver high-performance, low-latency disk support for virtual machines running I/O-intensive workloads.

You can migrate to Managed Disks in following scenarios:

-   Migrate existing Azure VMs on Premium Unmanaged Disks to Premium Managed Disks

-   Migrate existing Azure VMs on Standard Unmanaged Disks to Standard Managed Disks

-   Migrate existing Azure VMs on Standard Unmanaged Disks to Premium Managed Disks

-   Migrate existing Azure classic VMs to Premium/Standard Managed Disks 


This guide covers steps for all the above scenarios. Follow the steps specified in the relevant section depending on your scenario.

## Plan for the migration to Managed Disks

This section helps you to make the best decision on VM and disk types.

**Prerequisites**

-   You will need the Microsoft Azure PowerShell module. See [How to install and configure Azure PowerShell](https://docs.microsoft.com/en-us/powershell/azureps-cmdlets-docs) for installation instructions.

## Location

Pick a location where Azure Managed Disks are available. If you are migrating to Premium Managed Disks, also ensure that Premium storage is available in the region where you are planning to migrate to. See [Azure Services byRegion](https://azure.microsoft.com/regions/#services) for up-to-date information on available locations.

## VM sizes

If you are migrating to Premium Managed Disks, you have to update the size of the VM to Premium Storage capable size available in the region where VM is located. Review the VM sizes that are Premium Storage capable. The Azure VM size specifications are listed in [Sizes for virtual machines](virtual-machines-windows-sizes.md).
Review the performance characteristics of virtual machines that work with Premium Storage and choose the most appropriate VM size that best suits your workload. Make sure that there is sufficient bandwidth available on your VM to drive the disk traffic.

## Disk sizes

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

## Disk caching policy 

**Premium Managed Disks**

By default, disk caching policy is *Read-Only* for all the Premium data disks, and *Read-Write* for the Premium operating system disk attached to the VM. This configuration setting is recommended to achieve the optimal performance for your application’s IOs. For write-heavy or write-only data disks (such as SQL Server log files), disable disk caching so that you can achieve better application performance.

## Pricing**

Review the [pricing for Managed Disks](https://azure.microsoft.com/en-us/pricing/details/storage/disks/). Pricing of Premium Managed Disks is same as the Premium Unmanaged Disks. But pricing for Standard Managed Disks is different than Standard Unmanaged Disks.


## Migrate existing Azure VMs to Managed Disks of the same storage type

This section covers how to migrate your existing Azure VMs from unmanaged disks in storage accounts to managed disks when you will be using the same storage type. You can use this process to go from Premium (SDD) unmanaged disks to Premium managed disks or from standard (HDD) unmanaged disks to standard managed disks. The process converts both the OS disk and any attached data disks from using a unmanaged disks in a storage account to using managed disks. requires a restart of the VM, so you can schedule the migration of your VMs during a pre-existing maintenance window.

Test the migration process by migrating a test virtual machine before performing the migration in production as the migration process is not reversible.

- Convert a VM from unmanaged disks to managed disks (virtual-machines-windows-convert-unmanaged-to-managed-disks.md )



## Migrate existing Azure VMs using Standard Unmanaged Disks to Premium Managed Disks

This section will show you how to convert your existing Azure VMs on Standard unmanaged disks to Premium managed disks. 

This process will require the VM to restart few times. You can schedule the migration of your VMs during a pre-existing maintenance window.

**Note:** Test the migration process by migrating a test virtual machine before performing the migration in production as the migration process is not reversible.


1.  Stop the VM

2.  Update the size of the VM to a Premium Storage capable size

3.  Convert Unmanaged Disks to Managed Disks

4.  Upgrade the Storage of the disks to Premium

Prepare your application for downtime. To do a clean migration, you have to stop all the processing in the current system. Only then you can get it to consistent state which you can migrate to the new platform.

**Note:**

Update the VM size to make sure it matches your capacity and performance requirements.

Follow the step by step PowerShell cmdlets below to create the new VM.

1.  First, set the common parameters. Make sure the [VM size](virtual-machines-windows-sizes.md) you select supports Premium storage.

    ```powershell
    $resourceGroupName = 'YourResourceGroupName'
	$vmName = 'YourVMName'
	$size = 'Standard_DS2_v2'
	```
1.  Get the VM with Unmanaged disks

    ```powershell
    $vm = Get-AzureRmVM -Name $vmName -ResourceGroupName $resourceGroupName
    ```
	
1.  Stop (Deallocate) the VM.

    ```powershell
	Stop-AzureRmVM -ResourceGroupName $resourceGroupName -VMName $vmName -Force
	```

1.  Update the size of the VM to Premium Storage capable size available in the region where VM is located.

    ```powershell
	$vm.HardwareProfile.VmSize = $size
	Update-AzureRmVM -VM $vm -ResourceGroupName $resourceGroupName
	```

1.  Convert virtual machine with Unmanaged disks to Managed Disks.

    Note: If you get internal server error while executing preceding command,
    please retry the command 2-3 times before reaching out to our support team.

    ```powershell
	ConvertTo-AzureRmVMManagedDisk -ResourceGroupName $resourceGroupName -VMName
	```

1.  Stop (Deallocate) the VM.

    ```powershell
    Stop-AzureRmVM -ResourceGroupName $resourceGroupName -VMName $vmName -Force
	```

2.  Upgrade all the disks to Premium Storage

    ```powershell
	$vmDisks = Get-AzureRmDisk -ResourceGroupName $resourceGroupName 
	foreach ($disk in $vmDisks) 
	    {
	    if($disk.OwnerId -eq $vm.Id)
		    {
		     $diskUpdateConfig = New-AzureRmDiskUpdateConfig –AccountType StandardLRS
			 Update-AzureRmDisk -DiskUpdate $diskUpdateConfig -ResourceGroupName $resourceGroupName -DiskName $disk.Name
			}
		}
    ```


















## Migrate existing Azure Classic VMs to Managed Disks


This section will help you to migrate your existing Azure Classic VMs to Managed Disks. New VMs will be created in the migration process using the VHD files of the existing VMs. Also, VHD files of the existing Classic VMs are not copied to a different storage account in the process due to which entire migration process will be completed in minutes. The amount of downtime will be the time to create new VMs with Managed Disks, which generally takes minutes. Prepare your application for downtime. To do a clean migration, you have to stop all the processing in the current system. Only then you can get it to consistent state which you can migrate to the new platform. 


**Note:** Test the migration process by migrating a test virtual machine before
performing the migration in production as the migration process is not
reversible.

**Prepare virtual hard disks (VHDs) for the migration** 


If you are migrating existing Azure Classic VMs to Managed Disks, your VHD may
be:

-   A generalized operating system image

-   A unique operating system disk

-   A data disk

Below we walk through these 3 scenarios for preparing your VHD.

**Use a generalized Operating System VHD to create multiple VM instances**

If you are uploading a VHD that will be used to create multiple generic Azure VM instances, you must first generalize VHD using a sysprep utility. Sysprep removes any machine-specific information from the VHD.

[!IMPORTANT] Take a snapshot or backup your VM before generalizing it. Running sysprep will stop and deallocate the VM instance. Follow steps below to sysprep a Windows OS VHD. Note that running the Sysprep command will require you to shut down the virtual machine. For more information about Sysprep, see [Sysprep Overview](http://technet.microsoft.com/library/hh825209.aspx) or [Sysprep Technical Reference](http://technet.microsoft.com/library/cc766049.aspx).

1.  Open a Command Prompt window as an administrator.

2.  Enter the following command to open Sysprep:

    %windir%\\system32\\sysprep\\sysprep.exe

3.  In the System Preparation Tool, select Enter System Out-of-Box Experience (OOBE), select the Generalize check box, select **Shutdown**, and then click **OK**, as shown in the image below. Sysprep will generalize the operating system and shut down the system.

>   [./media/image1.png](./media/image1.png)

>   https://github.com/Microsoft/azure-docs/raw/master/articles/storage/media/storage-migration-to-premium-storage/migration-to-premium-storage-1.png

For an Ubuntu VM, use virt-sysprep to achieve the same. See [virt-sysprep](http://manpages.ubuntu.com/manpages/precise/man1/virt-sysprep.1.html) for more details. See also some of the open source [Linux Server Provisioning software](http://www.cyberciti.biz/tips/server-provisioning-software.html) for other Linux operating systems.

**Use a unique Operating System VHD to create a single VM instance**

If you have an application running on the VM which requires the machine specific data, do not generalize the VHD. A non-generalized VHD can be used to create a unique Azure VM instance. For example, if you have Domain Controller on your VHD, executing sysprep will make it ineffective as a Domain Controller. Review the applications running on your VM and the impact of running sysprep on them before generalizing the VHD.

**Data disk VHD**

If you have data disks in Azure to be migrated, you must make sure the VMs that
use these data disks are shut down.

Create a new Azure VM using Managed Disks
-----------------------------------------

After you have prepared VHD files for migration, follow the instructions in this
section to create a VM Image or OS Disk using the OS VHD file depending on your
scenario and then create a VM instance from it. You can also create data Disks
from data VHDs and attach to new VMs.

### Checklist

1.  If you are migrating to Premium Managed Disks, make sure it is available in
    the region you are migrating to.

2.  Decide the new VM series you will be using. It should be a Premium Storage
    capable if you are migrating to Premium Managed Disks.

3.  Decide the exact VM size you will use which are available in the region you
    are migrating to. VM size needs to be large enough to support the number of
    data disks you have. E.g. if you have 4 data disks, the VM must have 2 or
    more cores. Also, consider processing power, memory and network bandwidth
    needs.

4.  Have the current VM details handy, including the list of disks and
    corresponding VHD blobs.

### Generalized (sysprepped) OS VHD and data VHDs to create multiple Azure VM instances

Create a VM Image using your generalized OS VHD and data Disks using data VHDs
so that you can create one or more VM instances from the Image and data Disks.

**Note:**

Update the VM size to make sure it matches your capacity and performance
requirements.

Follow the step by step PowerShell cmdlets below to create the new VM.

1.  First, set the common parameters:

>   \$resourceGroupName = 'yourResourceGroupName'

>   \$location = 'locationName' \#(e.g., southeastasia)

>   \$virtualNetworkName = 'yourExistingVirtualNetworkName'

>   \$virtualMachineName = 'yourVMName'

>   \$virtualMachineSize = 'Standard\_DS3'

>   \$adminUserName = "youradmin"

>   \$adminPassword = "yourpassword" \| ConvertTo-SecureString -AsPlainText
>   -Force

>   \$imageName = 'yourImageName'

>   \$osVhdUri =
>   'https://storageaccount.blob.core.windows.net/vhdcontainer/osdisk.vhd'

>   \$dataVhdUri =
>   'https://storageaccount.blob.core.windows.net/vhdcontainer/datadisk1.vhd'

>   \$dataDiskName = 'yourDataDiskName'

1.  Create a VM Image using your generalized OS VHD.

>   **Note**: Managed Disks support creating a managed custom Image, a top-level
>   ARM resource. You can choose to create an image from your custom VHD or from
>   your VMs. You can use the custom image to create multiple virtual machines
>   in the same region.

Ensure that you have provided the complete URI of the OS VHD to the \$osVhdUri
parameter.

>   \$imageConfig = New-AzureRmImageConfig -Location \$location

>   \$imageConfig = Set-AzureRmImageOsDisk -Image \$imageConfig -OsType Windows
>   -OsState Generalized -BlobUri \$osVhdUri

>   \$image = New-AzureRmImage -ImageName \$imageName -ResourceGroupName
>   \$resourceGroupName -Image \$imageConfig

1.  Set the created VM Image as source Image for the new machine

    \$VirtualMachine = New-AzureRmVMConfig -VMName \$virtualMachineName -VMSize
    \$virtualMachineSize

    \$VirtualMachine = Set-AzureRmVMSourceImage -VM \$VirtualMachine -Id
    \$image.Id

2.  Set the OS disk configuration. Enter the storage type (Premium or Standard),
    size of the OS disk

    \$VirtualMachine = Set-AzureRmVMOSDisk -VM \$VirtualMachine 
    -ManagedDiskStorageAccountType PremiumLRS -DiskSizeInGB 128 -CreateOption
    FromImage -Caching ReadWrite

3.  Create a data Disk from the data VHD file and add it to the new VM

    **Note**:

    Please enter the Disk Size as per the storage capacity and performance you
    require for your application. Also, enter AccountType as PremiumLRS or
    StandardLRS based on type of disks (Premium or Standard) you are migrating
    to.

>   \$dataDisk1 = New-AzureRmDisk -DiskName \$dataDiskName -Disk
>   (New-AzureRmDiskConfig -AccountType PremiumLRS -Location \$location
>   -CreationDataCreateOption Empty -DiskSizeGB 128) -ResourceGroupName
>   \$resourceGroupName

>   \$VirtualMachine = Add-AzureRmVMDataDisk -VM \$VirtualMachine -Name
>   \$dataDiskName -CreateOption Attach -ManagedDiskId \$dataDisk1.Id -Lun 1

1.  Create the new VM by setting public IP, Virtual Network, NIC

    \$publicIp = New-AzureRmPublicIpAddress -Name
    (\$VirtualMachineName.ToLower()+'\_ip') -ResourceGroupName
    \$resourceGroupName -Location \$location -AllocationMethod Dynamic

    \$vnet = Get-AzureRmVirtualNetwork -Name \$virtualNetworkName
    -ResourceGroupName \$resourceGroupName

    \$nic = New-AzureRmNetworkInterface -Name
    (\$VirtualMachineName.ToLower()+'\_nic') -ResourceGroupName
    \$resourceGroupName -Location \$location -SubnetId \$vnet.Subnets[0].Id
    -PublicIpAddressId \$publicIp.Id

    \$VirtualMachine = Add-AzureRmVMNetworkInterface -VM \$VirtualMachine -Id
    \$nic.Id

    \$VirtualMachine = Set-AzureRmVMOperatingSystem -VM \$VirtualMachine
    -Windows -ComputerName \$virtualMachineName -Credential (New-Object
    -TypeName System.Management.Automation.PSCredential -ArgumentList
    \$adminUserName, \$adminPassword ) -EnableAutoUpdate

    New-AzureRmVM -VM \$VirtualMachine -ResourceGroupName \$resourceGroupName
    -Location \$location

## Specialized (non-sysprepped) OS VHD and data VHD to create a single Azure VM instance

Create an OS disk using your specialized OS VHD and data Disks using data VHDs
so that you can create a new VM instance from the OS and data Disks.

**Note:**

Update the VM size to make sure it matches your capacity and performance
requirements.

Follow the step by step PowerShell cmdlets below to create the new VM.

1.  First, set the common parameters:

>   \$resourceGroupName = 'yourResourceGroupName'

>   \$location = 'locationName' \#(e.g., southeastasia)

>   \$virtualNetworkName = 'yourExistingVirtualNetworkName'

>   \$virtualMachineName = 'yourVMName'

>   \$virtualMachineSize = 'Standard\_DS3'

>   \$adminUserName = "youradmin"

>   \$adminPassword = "yourpassword" \| ConvertTo-SecureString -AsPlainText
>   -Force

>   \$imageName = 'yourImageName'

>   \$osVhdUri =
>   'https://storageaccount.blob.core.windows.net/vhdcontainer/osdisk.vhd'

>   \$dataVhdUri =
>   'https://storageaccount.blob.core.windows.net/vhdcontainer/datadisk1.vhd'

>   \$dataDiskName = 'dataDisk1'

1.  Create an OS disk using your specialized (non-sysprepped) OS VHD

    Ensure that you have provided the complete URI of the OS VHD to the
    \$osVhdUri parameter. Also, enter AccountType as PremiumLRS or StandardLRS
    based on type of disks (Premium or Standard) you are migrating to.

>   \$osDisk = New-AzureRmDisk -DiskName \$osDiskName -Disk
>   (New-AzureRmDiskConfig -AccountType PremiumLRS -Location \$location
>   -CreationDataCreateOption Import -SourceUri \$osVhdUri) -ResourceGroupName
>   \$resourceGroupName

1.  Attach the created OS disk to the new VM

    Note:

    Please enter the Disk Size as per the storage capacity and performance you
    require for your application. Also, enter AccountType as PremiumLRS or
    StandardLRS based on type of disks (Premium or Standard) you are migrating
    to.

>   \$VirtualMachine = New-AzureRmVMConfig -VMName \$virtualMachineName -VMSize
>   \$virtualMachineSize

>   \$VirtualMachine = Set-AzureRmVMOSDisk -VM \$VirtualMachine -ManagedDiskId
>   \$osDisk.Id -ManagedDiskStorageAccountType PremiumLRS -DiskSizeInGB 128
>   -CreateOption Attach -Windows

1.  Create a data disk from the data VHD file and add it to the new VM

    **Note**:

    Please enter the Disk Size as per the storage capacity and performance you
    require for your application. Also, enter AccountType as PremiumLRS or
    StandardLRS based on type of disks (Premium or Standard) you are migrating
    to.

>   \$dataDisk1 = New-AzureRmDisk -DiskName \$dataDiskName -Disk
>   (New-AzureRmDiskConfig -AccountType PremiumLRS -Location \$location
>   -CreationDataCreateOption Import -SourceUri \$dataVhdUri )
>   -ResourceGroupName \$resourceGroupName

>   \$VirtualMachine = Add-AzureRmVMDataDisk -VM \$VirtualMachine -Name
>   \$dataDiskName -CreateOption Attach -ManagedDiskId \$dataDisk1.Id -Lun 1

1.  Create the new VM by setting public IP, Virtual Network, NIC

    \$publicIp = New-AzureRmPublicIpAddress -Name
    (\$VirtualMachineName.ToLower()+'\_ip') -ResourceGroupName
    \$resourceGroupName -Location \$location -AllocationMethod Dynamic

    \$vnet = Get-AzureRmVirtualNetwork -Name \$virtualNetworkName
    -ResourceGroupName \$resourceGroupName

    \$nic = New-AzureRmNetworkInterface -Name
    (\$VirtualMachineName.ToLower()+'\_nic') -ResourceGroupName
    \$resourceGroupName -Location \$location -SubnetId \$vnet.Subnets[0].Id
    -PublicIpAddressId \$publicIp.Id

    \$VirtualMachine = Add-AzureRmVMNetworkInterface -VM \$VirtualMachine -Id
    \$nic.Id

    New-AzureRmVM -VM \$VirtualMachine -ResourceGroupName \$resourceGroupName
    -Location \$location

**Note:**

There may be additional steps necessary to support your application that is not
be covered by this guide.

Checking and plan backup
========================

Once the new VM is up and running, access it using the same login id and
password is as the original VM, and verify that everything is working as
expected. All the settings, including the striped volumes, would be present in
the new VM.

The last step is to plan backup and maintenance schedule for the new VM based on
the application's needs.

Application migrations
======================

Databases and other complex applications may require special steps as defined by
the application provider for the migration. Please refer to respective
application documentation. E.g. typically databases can be migrated through
backup and restore.

## Next steps


Learn more about Azure VM Disks and Azure Virtual Machines:

-   [Managed Disks
    Overview](https://microsoft.sharepoint.com/teams/AzureStorage/Private%20Test/2016/Managed%20Disks/GA/Managed%20DIsks%20Overview%20Page)

-   [Premium
    Storage](https://docs.microsoft.com/en-us/azure/storage/storage-premium-storage-performance)

-   [Standard
    Storage](https://microsoft.sharepoint.com/teams/AzureStorage/Private%20Test/2016/Managed%20Disks/GA/TBD)

-   [Disks
    Pricing](https://azure.microsoft.com/en-us/pricing/details/storage/disks/)

-   [Azure Virtual
    Machines](https://azure.microsoft.com/documentation/services/virtual-machines/)

-   [Premium Storage: High-Performance Storage for Azure Virtual Machine
    Workloads](https://docs.microsoft.com/en-us/azure/storage/storage-premium-storage)
