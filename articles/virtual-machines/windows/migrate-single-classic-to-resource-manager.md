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


# Migrate a classic VM to use a Managed Disk 


This article covers that basic steps to migrate your existing Azure VMs from the classic deployment model to [Managed Disks](managed-disks-overview.md) in the Resource Manager deployment model.



## Checklist

1.  If you are migrating to managed disks in Premium storage, make sure it is available in the region you are migrating to.

2.  Decide the new [VM size](sizes.md) series you will be using. It should be a Premium Storage capable if you are migrating to Premium Managed Disks.

3.  Decide the exact VM size you will use which are available in the region you are migrating to. VM size needs to be large enough to support the number of data disks you have. For example, if you have four data disks, the VM must have two or more cores. Also, consider processing power, memory, and network bandwidth needs.

4.  Have the current VM details handy, including the list of disks and corresponding VHD blobs.

Prepare your application for downtime. To do a clean migration, you have to stop all the processing in the current system. Only then you can get it to consistent state, which you can migrate to the new platform. Downtime duration depends on the amount of data in the disks to migrate.


## Migrate the VM

Prepare your application for downtime. To do a clean migration, you have to stop all the processing in the current system. Downtime duration depends the amount of data in the disks to migrate.

This part requires the Azure PowerShell module version 6.0.0 or later. Run ` Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). You also need to run `Connect-AzureRmAccount` to create a connection with Azure.


Create variables for common parameters.


```powershell
$resourceGroupName = 'yourResourceGroupName'
$location = 'your location' 
$virtualNetworkName = 'yourExistingVirtualNetworkName'
$virtualMachineName = 'yourVMName'
$virtualMachineSize = 'Standard_DS3'
$adminUserName = "youradminusername"
$adminPassword = "yourpassword" | ConvertTo-SecureString -AsPlainText -Force
$osVhdUri = 'https://storageaccount.blob.core.windows.net/vhdcontainer/osdisk.vhd'
$dataVhdUri = 'https://storageaccount.blob.core.windows.net/vhdcontainer/datadisk1.vhd'
$dataDiskName = 'dataDisk1'
```


Create a managed OS disk using the VHD from the classic VM. Make sure that you have provided the complete URI of the OS VHD to the $osVhdUri parameter. Also, enter **-AccountType** as **Premium_LRS** or **Standard_LRS** based on type of disks (premium or standard) you are migrating to.


```powershell
$osDisk = New-AzureRmDisk -DiskName $osDiskName '
   -Disk (New-AzureRmDiskConfig '
   -AccountType Premium_LRS '
   -Location $location '
   -CreateOption Import '
   -SourceUri $osVhdUri) '
   -ResourceGroupName $resourceGroupName
```

Attach the OS disk to the new VM.

```powershell
$VirtualMachine = New-AzureRmVMConfig -VMName $virtualMachineName -VMSize $virtualMachineSize
$VirtualMachine = Set-AzureRmVMOSDisk '
   -VM $VirtualMachine '
   -ManagedDiskId $osDisk.Id '
   -StorageAccountType Premium_LRS '
   -DiskSizeInGB 128 '
   -CreateOption Attach -Windows
```

Create a managed data disk from the data VHD file and add it to the new VM.

```powershell
$dataDisk1 = New-AzureRmDisk '
   -DiskName $dataDiskName '
   -Disk (New-AzureRmDiskConfig '
   -AccountType Premium_LRS '
   -Location $location '
   -CreationOption Import '
   -SourceUri $dataVhdUri ) '
   -ResourceGroupName $resourceGroupName
	
$VirtualMachine = Add-AzureRmVMDataDisk '
   -VM $VirtualMachine '
   -Name $dataDiskName '
   -CreateOption Attach '
   -ManagedDiskId $dataDisk1.Id '
   -Lun 1
```

Create the new VM by setting public IP, virtual network, and NIC.

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

