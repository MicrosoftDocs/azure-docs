---
title: Create an Azure snapshot of a virtual hard disk
description: Learn how to create a copy of an Azure VM to use as a backup or for troubleshooting issues using the portal, PowerShell, or CLI.
author: roygara
ms.author: rogarana
ms.service: azure-disk-storage
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 04/22/2022
---

# Create a snapshot of a virtual hard disk

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets

A snapshot is a full, read-only copy of a virtual hard disk (VHD). You can use a snapshot as a point-in-time backup, or to help troubleshoot virtual machine (VM) issues. You can take a snapshot of both operating system (OS) or data disk VHDs.

## Create a snapshot of a VHD

If you want to use a snapshot to create a new VM, ensure that you first cleanly shut down the VM. This action clears any processes that are in progress.

# [Portal](#tab/portal)

To create a snapshot using the Azure portal, complete these steps.

1. In the [Azure portal](https://portal.azure.com), select **Create a resource**.
1. Search for and select **Snapshot**.
1. In the **Snapshot** window, select **Create**. The **Create snapshot** window appears.
1. For **Resource group**, select an existing [resource group](../azure-resource-manager/management/overview.md#resource-groups) or enter the name of a new one.
1. Enter a **Name**, then select a **Region** and **Snapshot type** for the new snapshot. If you would like to store your snapshot in zone-resilient storage, you need to select a region that supports [availability zones](../availability-zones/az-overview.md). For a list of supporting regions, see [Azure regions with availability zones](../availability-zones/az-region.md#azure-regions-with-availability-zones).
1. For **Source subscription**, select the subscription that contains the managed disk to be backed up.
1. For **Source disk**, select the managed disk to snapshot.
1. For **Storage type**, select **Standard HDD**, unless you require zone-redundant storage or high-performance storage for your snapshot.
1. If needed, configure settings on the **Encryption**, **Networking**, and **Tags** tabs. Otherwise, default settings are used for your snapshot.
1. Select **Review + create**.

# [PowerShell](#tab/powershell)

This example requires that you use [Cloud Shell](https://shell.azure.com/bash) or install the [Azure PowerShell module](/powershell/azure/install-azure-powershell).

Follow these steps to take a snapshot with the `New-AzSnapshotConfig` and `New-AzSnapshot` cmdlets. This example assumes that you have a VM called *myVM* in the *myResourceGroup* resource group. The code sample provided creates a snapshot in the same resource group and within the same region as your source VM.

First, you'll use the [New-AzSnapshotConfig](/powershell/module/az.compute/new-azsnapshotconfig) cmdlet to create a configurable snapshot object. You can then use the [New-AzSnapshot](/powershell/module/az.compute/new-azsnapshot) cmdlet to take a snapshot of the disk.

1. Set the required parameters. Update the values to reflect your environment.

   ```azurepowershell-interactive
   $resourceGroupName = 'myResourceGroup' 
   $location = 'eastus' 
   $vmName = 'myVM'
   $snapshotName = 'mySnapshot'  
   ```

1. Use the [Get-AzVM](/powershell/module/az.compute/get-azvm) cmdlet to get the VM containing the VHD you want to copy.

   ```azurepowershell-interactive
   $vm = Get-AzVM `
       -ResourceGroupName $resourceGroupName `
       -Name $vmName
   ```

1. Create the snapshot configuration. In the example, the snapshot is of the OS disk. By default, the snapshot uses locally redundant standard storage. We recommend that you store your snapshots in standard storage instead of premium storage whatever the storage type of the parent disk or target disk. Premium snapshots incur additional cost.

   ```azurepowershell-interactive
   $snapshot =  New-AzSnapshotConfig `
       -SourceUri $vm.StorageProfile.OsDisk.ManagedDisk.Id `
       -Location $location `
       -CreateOption copy
   ```

   If you want to store your snapshot in zone-resilient storage, you must create the snapshot in a region that supports [availability zones](../availability-zones/az-overview.md) and include the `-SkuName Standard_ZRS` parameter. For a list of regions that support availability zones, see [Azure regions with availability zones](../availability-zones/az-region.md#azure-regions-with-availability-zones).

1. Take the snapshot.

   ```azurepowershell-interactive
   New-AzSnapshot `
       -Snapshot $snapshot `
       -SnapshotName $snapshotName `
       -ResourceGroupName $resourceGroupName 
   ```

1. Use the [Get-AzSnapshot](/powershell/module/az.compute/get-azsnapshot) cmdlet to verify that your snapshot exists.

    ```azurepowershell-interactive
    Get-AzSnapshot `
        -ResourceGroupName $resourceGroupName
    ```

# [Azure CLI](#tab/cli)

This example requires that you use [Cloud Shell](https://shell.azure.com/bash) or have the [Azure CLI](/cli/azure/) installed.

Follow these steps to take a snapshot with the `az snapshot create` command and the `--source-disk` parameter. This example assumes that you have a VM called *myVM* in the *myResourceGroup* resource group. The code sample provided creates a snapshot in the same resource group and within the same region as your source VM.

1. Get the disk ID with [az vm show](/cli/azure/vm#az-vm-show).

    ```azurecli-interactive
    osDiskId=$(az vm show \
       -g myResourceGroup \
       -n myVM \
       --query "storageProfile.osDisk.managedDisk.id" \
       -o tsv)
    ```

1. Take a snapshot named *osDisk-backup* using [az snapshot create](/cli/azure/snapshot#az-snapshot-create). In the example, the snapshot is of the OS disk. By default, the snapshot uses locally redundant standard storage. We recommend that you store your snapshots in standard storage instead of premium storage whatever the storage type of the parent disk or target disk. Premium snapshots incur additional cost.

    ```azurecli-interactive
    az snapshot create \
        -g myResourceGroup \
    	--source "$osDiskId" \
    	--name osDisk-backup
    ```

    If you would like to store your snapshot in zone-resilient storage, you need to create it in a region that supports [availability zones](../availability-zones/az-overview.md) and include the optional `--sku Standard_ZRS` parameter. A list of [availability zones](../availability-zones/az-region.md#azure-regions-with-availability-zones) can be found here.
    
1. Use [az snapshot list](/cli/azure/snapshot#az-snapshot-list) to verify that your snapshot exists.
    
    ```azurecli-interactive
    az snapshot list \
       -g myResourceGroup \
       -o table
    ```

---

## Next steps

To recover using a snapshot, you must create a new disk from the snapshot, then either deploy a new VM, and use the managed disk as the OS disk, or attach the disk as a data disk to an existing VM.

# [Portal](#tab/portal)

For more information, see the example in [Create a VM from a VHD by using the Azure portal](windows/create-vm-specialized-portal.md).

# [PowerShell](#tab/powershell)

For more information, see the example in [Create a Windows VM from a specialized disk by using PowerShell](windows/create-vm-specialized.md).

# [Azure CLI](#tab/cli)

For more information, see the example in [Create a complete Linux virtual machine with the Azure CLI](/previous-versions/azure/virtual-machines/scripts/virtual-machines-linux-cli-sample-create-vm-from-snapshot?toc=%2fcli%2fmodule%2ftoc.json).

---
