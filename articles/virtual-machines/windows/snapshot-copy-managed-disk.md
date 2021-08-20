---
title: Create a snapshot of a virtual hard drive using the portal, PowerShell, or Azure CLI
description: Learn how to create a copy of an Azure VM to use as a back up or for troubleshooting issues using the portal, PowerShell, or CLI.
author: roygara
ms.author: rogarana
manager: twooley
ms.service: storage
ms.subservice: disks
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 08/20/2021
---
# Create a snapshot of a virtual hard drive

A snapshot is a full, read-only copy of a virtual hard drive (VHD). You can take a snapshot of an operating system (OS) or data disk VHD to use as a backup, or to troubleshoot virtual machine (VM) issues.

If you are going to use the snapshot to create a new VM, we recommend that you cleanly shut down the VM before taking a snapshot, to clear out any processes that are in progress.

# [Azure Portal](#tab/portal)

To create a snapshot using the Azure portal, complete these steps:

1. On the [Azure portal](https://portal.azure.com), select **Create a resource**.
1. Search for and select **Snapshot**.
1. In the **Snapshot** pane, select **Create**. The **Create snapshot** window appears.
1. Select a [Resource group](../../azure-resource-manager/management/overview.md#resource-groups) or enter the name of a new one.
1. Enter a **Name**, **Region**, and **Snapshot type** for the new snapshot.
1. For **Source subscription**, select the subscription which contains the managed disk to be backed up.
1. For **Source disk**, select the managed disk to snapshot.
1. For **Storage type**, select **Standard_HDD**, unless you need the snapshot to be stored on a high-performing disk.
1. Click Select the **Review** button, and then click **Create**.

# [PowerShell](#tab/powershell)

These steps show how to copy the VHD disk and create the snapshot configuration using PowerShell. You can then take a snapshot of the disk by using the [New-AzSnapshot](/powershell/module/az.compute/new-azsnapshot) cmdlet.

1. Set some parameters:

   ```azurepowershell-interactive
   $resourceGroupName = 'myResourceGroup' 
   $location = 'eastus' 
   $vmName = 'myVM'
   $snapshotName = 'mySnapshot'  
   ```

2. Get the VM:

   ```azurepowershell-interactive
   $vm = Get-AzVM `
       -ResourceGroupName $resourceGroupName `
       -Name $vmName
   ```

3. Create the snapshot configuration. For this example, the snapshot is of the OS disk:

   ```azurepowershell-interactive
   $snapshot =  New-AzSnapshotConfig `
       -SourceUri $vm.StorageProfile.OsDisk.ManagedDisk.Id `
       -Location $location `
       -CreateOption copy
   ```
   
   > [!NOTE]
   > If you would like to store your snapshot in zone-resilient storage, create it in a region that supports [availability zones](../../availability-zones/az-overview.md) and include the `-SkuName Standard_ZRS` parameter.

4. Take the snapshot:

   ```azurepowershell-interactive
   New-AzSnapshot `
       -Snapshot $snapshot `
       -SnapshotName $snapshotName `
       -ResourceGroupName $resourceGroupName 
   ```

# [Azure CLI](#tab/cli)

This example requires that you use [Cloud Shell](https://shell.azure.com/bash) or have the [Azure CLI][https://docs.microsoft.com/en-us/cli/azure/] installed.

Use these steps to take a snapshot with the **az snapshot create** command and the **--source-disk** parameter. This example assumes that you have a VM called *myVM* in the *myResourceGroup* resource group.

First, get the disk ID using [az vm show](/cli/azure/vm#az_vm_show).

```azurecli-interactive
osDiskId=$(az vm show \
   -g myResourceGroup \
   -n myVM \
   --query "storageProfile.osDisk.managedDisk.id" \
   -o tsv)
```

Next, take a snapshot named *osDisk-backup* using [az snapshot create](/cli/azure/snapshot#az_snapshot_create).

```azurecli-interactive
az snapshot create \
    -g myResourceGroup \
	--source "$osDiskId" \
	--name osDisk-backup
```

> [!NOTE]
> If you would like to store your snapshot in zone-resilient storage, you need to create it in a region that supports [availability zones](../../availability-zones/az-overview.md) and include the **--sku Standard_ZRS** parameter.

You can see a list of the snapshots using [az snapshot list](/cli/azure/snapshot#az_snapshot_list).

```azurecli-interactive
az snapshot list \
   -g myResourceGroup \
   - table
```

## Next steps

Create a virtual machine from a snapshot: Create a managed disk from a snapshot and then attach the new managed disk as the OS disk. For more information, see the example in [Create a VM from a snapshot with PowerShell](/previous-versions/azure/virtual-machines/scripts/virtual-machines-windows-powershell-sample-create-vm-from-snapshot).
