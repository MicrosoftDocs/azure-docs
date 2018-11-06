---
title: Migrate a Classic VM to a Managed Disk VM | Microsoft Docs
description: Migrate a single Azure VM from the classic deployment model to Managed Disks in the Resource Manager deployment model.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 11/06/2018
ms.author: cynthn

---

# Manually migrate a Classic VM to a new resource manager Managed Disk VM from a VHD 


This article covers that basic steps to migrate your existing Azure VMs from the classic deployment model to [Managed Disks](managed-disks-overview.md) in the Resource Manager deployment model.


## Plan for the migration to Managed Disks

This section helps you to make the best decision on VM and disk types.


### Location

Pick a location where Azure Managed Disks are available. If you are migrating to Premium Managed Disks, also ensure that Premium storage is available in the region where you are planning to migrate to. See [Azure Services byRegion](https://azure.microsoft.com/regions/#services) for up-to-date information on available locations.

### VM sizes

If you are migrating to Premium Managed Disks, you have to update the size of the VM to Premium Storage capable size available in the region where VM is located. Review the VM sizes that are Premium Storage capable. The Azure VM size specifications are listed in [Sizes for virtual machines](sizes.md).
Review the performance characteristics of virtual machines that work with Premium Storage and choose the most appropriate VM size that best suits your workload. Make sure that there is sufficient bandwidth available on your VM to drive the disk traffic.

### Disk sizes

Azure Managed Disks offers three storage type options: [Premium SSD](../windows/premium-storage.md), [Standard SSD](../windows/disks-standard-ssd.md), and [Standard HDD](../windows/standard-storage.md). Within each type, there are several size options that can be used with your VM and each has specific IOPs and throughput limits. Consider these limits when choosing the disk type for your VM based on the needs of your application in terms of capacity, performance, scalability, and peak loads.


### Disk caching policy 

**Premium Managed Disks**

By default, disk caching policy is *Read-Only* for all the Premium data disks, and *Read-Write* for the Premium operating system disk attached to the VM. This configuration setting is recommended to achieve the optimal performance for your application’s IOs. For write-heavy or write-only data disks (such as SQL Server log files), disable disk caching so that you can achieve better application performance.

### Pricing

Review the [pricing for Managed Disks](https://azure.microsoft.com/pricing/details/managed-disks/). Pricing of Premium Managed Disks is same as the Premium Unmanaged Disks. But pricing for Standard Managed Disks is different than Standard Unmanaged Disks.


## Checklist

1.  If you are migrating to Premium Managed Disks, make sure it is available in the region you are migrating to.

2.  Decide the new [VM size](sizes.md) series you will be using. It should be a Premium Storage capable if you are migrating to Premium Managed Disks.

3.  Decide the exact VM size you will use which are available in the region you are migrating to. VM size needs to be large enough to support the number of data disks you have. For example, if you have four data disks, the VM must have two or more cores. Also, consider processing power, memory and network bandwidth needs.

4.  Have the current VM details handy, including the list of disks and corresponding VHD blobs.

Prepare your application for downtime. To do a clean migration, you have to stop all the processing in the current system. Only then you can get it to consistent state which you can migrate to the new platform. Downtime duration depends on the amount of data in the disks to migrate.


## Migrate the VM

Prepare your application for downtime. To do a clean migration, you have to stop all the processing in the current system. Only then you can get it to consistent state which you can migrate to the new platform. Downtime duration depends the amount of data in the disks to migrate.

This part requires the Azure PowerShell module version 6.0.0 or later. Run ` Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). You also need to run `Connect-AzureRmAccount` to create a connection with Azure.


1.  First, set the common parameters:

    ```azurepowershell-interactive
	$resourceGroupName = 'myResourceGroupName'
	$location = 'East US' 
	$virtualNetworkName = 'myVNetName'
	$virtualMachineName = 'myVMN'
	$virtualMachineSize = 'Standard_DS3'
	$adminUserName = "myAdminUserName"
	$adminPassword = "myPassword" | ConvertTo-SecureString -AsPlainText -Force
	$imageName = 'myImage'
	$osVhdUri = 'https://mystorageaccount.blob.core.windows.net/vhdcontainer/osdisk.vhd'
	$dataVhdUri = 'https://mystorageaccount.blob.core.windows.net/vhdcontainer/datadisk1.vhd'
	$dataDiskName = 'myDataDisk1'
	```

2.  Create a managed OS disk using the VHD from the classic VM.

    Ensure that you have provided the complete URI of the OS VHD to the $osVhdUri parameter. Also, enter **-AccountType** as **Premium_LRS** or **Standard_LRS** based on type of disks (Premium or Standard) you are migrating to.

    ```azurepowershell-interactive
	$osDisk = New-AzureRmDisk '
	   -ResourceGroupName $resourceGroupName'
	   -DiskName $osDiskName '
	   -Disk (New-AzureRmDiskConfig '
	        -AccountType Premium_LRS '
			-Location $location '
			-CreateOption Import '
			-SourceUri $osVhdUri) 
	
	```

3.  Attach the OS disk to the new VM.

    ```powershell
	$VirtualMachine = New-AzureRmVMConfig '
	   -VMName $virtualMachineName '
	   -VMSize $virtualMachineSize
	$VirtualMachine = Set-AzureRmVMOSDisk '
	   -VM $VirtualMachine '
	   -ManagedDiskId $osDisk.Id '
	   -StorageAccountType Premium_LRS '
	   -DiskSizeInGB 128 '
	   -CreateOption Attach '
	   -Windows
	```

4.  Create a managed data disk from the data VHD file and add it to the new VM.

    ```powershell
	$dataDisk1 = New-AzureRmDisk '
	   -ResourceGroupName $resourceGroupName
	   -DiskName $dataDiskName '
	   -Disk (New-AzureRmDiskConfig '
	      -AccountType Premium_LRS '
		  -Location $location '
		  -CreationDataCreateOption Import '
		  -SourceUri $dataVhdUri ) 
	$VirtualMachine = Add-AzureRmVMDataDisk '
	   -VM $VirtualMachine '
	   -Name $dataDiskName '
	   -CreateOption Attach '
	   -ManagedDiskId $dataDisk1.Id '
	   -Lun 1
	```

5.  Create the new VM by setting public IP, Virtual Network and NIC.

    ```powershell
	$publicIp = New-AzureRmPublicIpAddress '
	   -Name ($VirtualMachineName.ToLower()+'_ip') '
	   -ResourceGroupName $resourceGroupName '
	   -Location $location '
	   -AllocationMethod Dynamic
	
	$vnet = Get-AzureRmVirtualNetwork '
	   -Name $virtualNetworkName '
	   -ResourceGroupName $resourceGroupName
	
	$nic = New-AzureRmNetworkInterface '
	   -Name ($VirtualMachineName.ToLower()+'_nic') '
	   -ResourceGroupName $resourceGroupName '
	   -Location $location '
	   -SubnetId $vnet.Subnets[0].Id '
	   -PublicIpAddressId $publicIp.Id
	
	$VirtualMachine = Add-AzureRmVMNetworkInterface '
	   -VM $VirtualMachine '
	   -Id $nic.Id
	
	New-AzureRmVM -VM $VirtualMachine '
	   -ResourceGroupName $resourceGroupName '
	   -Location $location
	```


## Next steps

- Connect to the virtual machine. For instructions, see [How to connect and log on to an Azure virtual machine running Windows](connect-logon.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

