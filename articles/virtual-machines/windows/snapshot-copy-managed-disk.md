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
ms.date: 09/28/2018
ms.author: cynthn

---
# Create a snapshot

A snapshot is a full, read-only copy of a virtual hard drive (VHD). You can take a snapshot of an OS or data disk VHD to use as a backup or to troubleshoot virtual machine (VM) issues. 

Use one of the following methods to take a snapshot:

- [Use the Azure portal to take a snapshot](#use-the-azure-portal-to-take-a-snapshot)
- [Use PowerShell to take a snapshot](#use-powershell-to-take-a-snapshot)

## Use the Azure portal to take a snapshot 

1. Sign in to the [Azure portal](https://portal.azure.com).
2. From the left menu, select **Create a resource**, and then search for and select **snapshot**.
3. In the **Snapshot** window, select **Create**. The **Create snapshot** window appears.
4. Enter a **Name** for the snapshot.
5. Select an existing [Resource group](../../azure-resource-manager/resource-group-overview.md#resource-groups) or enter the name of a new one. 
6. Select an Azure datacenter **Location**.  
7. For **Source disk**, select the managed disk to snapshot.
8. Select the **Account type** to use to store the snapshot. Select **Standard_HDD**, unless you need the snapshot stored on a high performing disk.
9. Select **Create**.

## Use PowerShell to take a snapshot

The following steps show how to copy the VHD disk, create the snapshot configuration, and take a snapshot of the disk by using the [New-AzureRmSnapshot](/powershell/module/azurerm.compute/new-azurermsnapshot) cmdlet. 

Before you begin, ensure that you have the latest version of the AzureRM.Compute PowerShell module. This article assumes an AzureRM module version 5.7.0 or later. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Connect-AzureRmAccount` to create a connection with Azure.

1. Set some parameters: 

 ```azurepowershell-interactive
$resourceGroupName = 'myResourceGroup' 
$location = 'eastus' 
$vmName = 'myVM'
$snapshotName = 'mySnapshot'  
```

2. Get the VM:

 ```azurepowershell-interactive
$vm = get-azurermvm `
   -ResourceGroupName $resourceGroupName 
   -Name $vmName
```

3. Create the snapshot configuration. For this example, the snapshot is of the OS disk:

 ```azurepowershell-interactive
$snapshot =  New-AzureRmSnapshotConfig 
   -SourceUri $vm.StorageProfile.OsDisk.ManagedDisk.Id 
   -Location $location 
   -CreateOption copy
```
   
   > [!NOTE]
   > If you would like to store your snapshot in zone-resilient storage, create it in a region that supports [availability zones](../../availability-zones/az-overview.md) and include the `-SkuName Standard_ZRS` parameter.   
   
4. Take the snapshot:

```azurepowershell-interactive
New-AzureRmSnapshot 
   -Snapshot $snapshot 
   -SnapshotName $snapshotName 
   -ResourceGroupName $resourceGroupName 
```


## Next steps

Create a virtual machine from a snapshot by creating a managed disk from a snapshot and then attaching the new managed disk as the OS disk. For more information, see the sample in [Create a VM from a snapshot with PowerShell](./../scripts/virtual-machines-windows-powershell-sample-create-vm-from-snapshot.md?toc=%2fpowershell%2fmodule%2ftoc.json).
