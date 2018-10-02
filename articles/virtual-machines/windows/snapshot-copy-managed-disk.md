---
title: Create a snapshot of a VHD in Azure | Microsoft Docs
description: Learn how to create a copy of an Azure VM to use as a back up or for troubleshooting issues.
documentationcenter: ''
author: cynthn
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 15eb778e-fc07-45ef-bdc8-9090193a6d20
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 04/10/2018
ms.author: cynthn

---
# Create a snapshot

Take a snapshot of an OS or data disk VHD for backup or to troubleshoot VM issues. A snapshot is a full, read-only copy of a VHD. 

## Use Azure portal to take a snapshot 

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Starting in the upper left, click **Create a resource** and search for **snapshot**.
3. In the Snapshot blade, click **Create**.
4. Enter a **Name** for the snapshot.
5. Select an existing [Resource group](../../azure-resource-manager/resource-group-overview.md#resource-groups) or type the name for a new one. 
6. Select an Azure datacenter Location.  
7. For **Source disk**, select the Managed Disk to snapshot.
8. Select the **Account type** to use to store the snapshot. We recommend **Standard_LRS** unless you need it stored on a high performing disk.
9. Click **Create**.

## Use PowerShell to take a snapshot

The following steps show you how to get the VHD disk to be copied, create the snapshot configurations, and take a snapshot of the disk by using the [New-AzureRmSnapshot](/powershell/module/azurerm.compute/new-azurermsnapshot) cmdlet. 

Before you begin, make sure that you have the latest version of the AzureRM.Compute PowerShell module. This article requires the AzureRM module version 5.7.0 or later. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Connect-AzureRmAccount` to create a connection with Azure.

Set some parameters. 

 ```azurepowershell-interactive
$resourceGroupName = 'myResourceGroup' 
$location = 'eastus' 
$vmName = 'myVM'
$snapshotName = 'mySnapshot'  
```

Get the VM.

 ```azurepowershell-interactive
$vm = get-azurermvm `
   -ResourceGroupName $resourceGroupName `
   -Name $vmName
```

Create the snapshot configuration. In this example, we are going to snapshot the OS disk.

 ```azurepowershell-interactive
$snapshot =  New-AzureRmSnapshotConfig `
   -SourceUri $vm.StorageProfile.OsDisk.ManagedDisk.Id `
   -Location $location `
   -CreateOption copy
```
   
> [!NOTE]
> If you would like to store your snapshot in zone-resilient storage, you need to create it in a region that supports [availability zones](../../availability-zones/az-overview.md) and include the `-SkuName Standard_ZRS` parameter.   

   
Take the snapshot.

```azurepowershell-interactive
New-AzureRmSnapshot `
   -Snapshot $snapshot `
   -SnapshotName $snapshotName `
   -ResourceGroupName $resourceGroupName 
```




## Next steps

Create a virtual machine from a snapshot by creating a managed disk from a snapshot and then attaching the new managed disk as the OS disk. For more information, see the [Create a VM from a snapshot](./../scripts/virtual-machines-windows-powershell-sample-create-vm-from-snapshot.md?toc=%2fpowershell%2fmodule%2ftoc.json) sample.
