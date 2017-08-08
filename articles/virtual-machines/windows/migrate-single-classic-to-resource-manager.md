---
title: Migrate a Classic VM to an ARM Managed Disk VM | Microsoft Docs
description: Migrate a single Azure VM from the classic deployment model to Managed Disks in the Resource Manager deployment model.
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
ms.date: 06/15/2017
ms.author: cynthn

---

# Manually migrate a Classic VM to a new ARM Managed Disk VM from the VHD 


This section helps you to migrate your existing Azure VMs from the classic deployment model to [Managed Disks](../../storage/storage-managed-disks-overview.md) in the Resource Manager deployment model.


## Plan for the migration to Managed Disks

This section helps you to make the best decision on VM and disk types.


### Location

Pick a location where Azure Managed Disks are available. If you are migrating to Premium Managed Disks, also ensure that Premium storage is available in the region where you are planning to migrate to. See [Azure Services byRegion](https://azure.microsoft.com/regions/#services) for up-to-date information on available locations.

### VM sizes

If you are migrating to Premium Managed Disks, you have to update the size of the VM to Premium Storage capable size available in the region where VM is located. Review the VM sizes that are Premium Storage capable. The Azure VM size specifications are listed in [Sizes for virtual machines](sizes.md).
Review the performance characteristics of virtual machines that work with Premium Storage and choose the most appropriate VM size that best suits your workload. Make sure that there is sufficient bandwidth available on your VM to drive the disk traffic.

### Disk sizes

**Premium Managed Disks**

There are seven types of premium Managed disks that can be used with your VM and each has specific IOPs and throughput limits. Consider these limits when choosing the Premium disk type for your VM based on the needs of your application in terms of capacity, performance, scalability, and peak loads.

| Premium Disks Type  | P4    | P6    | P10   | P20   | P30   | P40   | P50   | 
|---------------------|-------|-------|-------|-------|-------|-------|-------|
| Disk size           | 128 GB| 512 GB| 128 GB| 512 GB            | 1024 GB (1 TB)    | 2048 GB (2 TB)    | 4095 GB (4 TB)    | 
| IOPS per disk       | 120   | 240   | 500   | 2300              | 5000              | 7500              | 7500              | 
| Throughput per disk | 25 MB per second  | 50 MB per second  | 100 MB per second | 150 MB per second | 200 MB per second | 250 MB per second | 250 MB per second | 

**Standard Managed Disks**

There are seven types of Standard Managed disks that can be used with your VM. Each of them have different capacity but have same IOPS and throughput limits. Choose the type of Standard Managed disks based on the capacity needs of your application.

| Standard Disk Type  | S4               | S6               | S10              | S20              | S30              | S40              | S50              | 
|---------------------|---------------------|---------------------|------------------|------------------|------------------|------------------|------------------| 
| Disk size           | 30 GB            | 64 GB            | 128 GB           | 512 GB           | 1024 GB (1 TB)   | 2048 GB (2TB)    | 4095 GB (4 TB)   | 
| IOPS per disk       | 500              | 500              | 500              | 500              | 500              | 500             | 500              | 
| Throughput per disk | 60 MB per second | 60 MB per second | 60 MB per second | 60 MB per second | 60 MB per second | 60 MB per second | 60 MB per second | 


### Disk caching policy 

**Premium Managed Disks**

By default, disk caching policy is *Read-Only* for all the Premium data disks, and *Read-Write* for the Premium operating system disk attached to the VM. This configuration setting is recommended to achieve the optimal performance for your application’s IOs. For write-heavy or write-only data disks (such as SQL Server log files), disable disk caching so that you can achieve better application performance.

### Pricing

Review the [pricing for Managed Disks](https://azure.microsoft.com/en-us/pricing/details/managed-disks/). Pricing of Premium Managed Disks is same as the Premium Unmanaged Disks. But pricing for Standard Managed Disks is different than Standard Unmanaged Disks.


## Checklist

1.  If you are migrating to Premium Managed Disks, make sure it is available in the region you are migrating to.

2.  Decide the new VM series you will be using. It should be a Premium Storage capable if you are migrating to Premium Managed Disks.

3.  Decide the exact VM size you will use which are available in the region you are migrating to. VM size needs to be large enough to support the number of data disks you have. For example, if you have four data disks, the VM must have two or more cores. Also, consider processing power, memory and network bandwidth needs.

4.  Have the current VM details handy, including the list of disks and corresponding VHD blobs.

Prepare your application for downtime. To do a clean migration, you have to stop all the processing in the current system. Only then you can get it to consistent state which you can migrate to the new platform. Downtime duration depends on the amount of data in the disks to migrate.


## Migrate the VM

Prepare your application for downtime. To do a clean migration, you have to stop all the processing in the current system. Only then you can get it to consistent state which you can migrate to the new platform. Downtime duration depends the amount of data in the disks to migrate.


1.  First, set the common parameters:

    ```powershell
	$resourceGroupName = 'yourResourceGroupName'
	
	$location = 'your location' 
	
	$virtualNetworkName = 'yourExistingVirtualNetworkName'
	
	$virtualMachineName = 'yourVMName'
	
	$virtualMachineSize = 'Standard_DS3'
	
	$adminUserName = "youradminusername"
	
	$adminPassword = "yourpassword" | ConvertTo-SecureString -AsPlainText -Force
	
	$imageName = 'yourImageName'
	
	$osVhdUri = 'https://storageaccount.blob.core.windows.net/vhdcontainer/osdisk.vhd'
	
	$dataVhdUri = 'https://storageaccount.blob.core.windows.net/vhdcontainer/datadisk1.vhd'
	
	$dataDiskName = 'dataDisk1'
	```

2.  Create a managed OS disk using the VHD from the classic VM.

    Ensure that you have provided the complete URI of the OS VHD to the $osVhdUri parameter. Also, enter **-AccountType** as **PremiumLRS** or **StandardLRS** based on type of disks (Premium or Standard) you are migrating to.

    ```powershell
	$osDisk = New-AzureRmDisk -DiskName $osDiskName -Disk (New-AzureRmDiskConfig '
	-AccountType PremiumLRS -Location $location -CreateOption Import -SourceUri $osVhdUri) '
	-ResourceGroupName $resourceGroupName
	```

3.  Attach the OS disk to the new VM.

    ```powershell
	$VirtualMachine = New-AzureRmVMConfig -VMName $virtualMachineName -VMSize $virtualMachineSize
	$VirtualMachine = Set-AzureRmVMOSDisk -VM $VirtualMachine -ManagedDiskId $osDisk.Id '
	-StorageAccountType PremiumLRS -DiskSizeInGB 128 -CreateOption Attach -Windows
	```

4.  Create a managed data disk from the data VHD file and add it to the new VM.

    ```powershell
	$dataDisk1 = New-AzureRmDisk -DiskName $dataDiskName -Disk (New-AzureRmDiskConfig '
	-AccountType PremiumLRS -Location $location -CreationDataCreateOption Import '
	-SourceUri $dataVhdUri ) -ResourceGroupName $resourceGroupName
	
	$VirtualMachine = Add-AzureRmVMDataDisk -VM $VirtualMachine -Name $dataDiskName '
	-CreateOption Attach -ManagedDiskId $dataDisk1.Id -Lun 1
	```

5.  Create the new VM by setting public IP, Virtual Network and NIC.

    ```powershell
	$publicIp = New-AzureRmPublicIpAddress -Name ($VirtualMachineName.ToLower()+'_ip') '
	-ResourceGroupName $resourceGroupName -Location $location -AllocationMethod Dynamic
	
	$vnet = Get-AzureRmVirtualNetwork -Name $virtualNetworkName -ResourceGroupName $resourceGroupName
	
	$nic = New-AzureRmNetworkInterface -Name ($VirtualMachineName.ToLower()+'_nic') '
	-ResourceGroupName $resourceGroupName -Location $location -SubnetId $vnet.Subnets[0].Id '
	-PublicIpAddressId $publicIp.Id
	
	$VirtualMachine = Add-AzureRmVMNetworkInterface -VM $VirtualMachine -Id $nic.Id
	
	New-AzureRmVM -VM $VirtualMachine -ResourceGroupName $resourceGroupName -Location $location
	```

> [!NOTE]
>There may be additional steps necessary to support your application that is not be covered by this guide.
>
>

## Next steps

- Connect to the virtual machine. For instructions, see [How to connect and log on to an Azure virtual machine running Windows](connect-logon.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

