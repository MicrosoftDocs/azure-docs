---
title: Create a snapshot of a VHD using the Azure CLI 
description: Learn how to create a copy of a VHD in Azure as a back up or for troubleshooting issues.
author: roygara
manager: twooley
ms.service: virtual-machines
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 07/11/2018
ms.author: rogarana
ms.subservice: disks
---

# Create a snapshot using the portal or Azure CLI

Take a snapshot of an OS or data disk for backup or to troubleshoot VM issues. A snapshot is a full, read-only copy of a VHD. 

## Use Azure CLI 

The following example requires that you use [Cloud Shell](https://shell.azure.com/bash) or have the Azure CLI installed.

The following steps show how to take a snapshot using the **az snapshot create** command with the **--source-disk** parameter. The following example assumes that there is a VM called *myVM* in the *myResourceGroup* resource group.

Get the disk ID using [az vm show](/cli/azure/vm#az_vm_show).

```azurecli-interactive
osDiskId=$(az vm show \
   -g myResourceGroup \
   -n myVM \
   --query "storageProfile.osDisk.managedDisk.id" \
   -o tsv)
```

Take a snapshot named *osDisk-backup* using [az snapshot create](/cli/azure/snapshot#az_snapshot_create).

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

## Use Azure portal 

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Starting in the upper-left, click **Create a resource** and search for **snapshot**. Select **Snapshot** from the search results.
3. In the **Snapshot** blade, click **Create**.
4. Enter a **Name** for the snapshot.
5. Select an existing resource group or type the name for a new one. 
7. For **Source disk**, select the managed disk to snapshot.
8. Select the **Account type** to use to store the snapshot. Use **Standard HDD** unless you need it stored on a high performing SSD.
9. Click **Create**.


## Next steps

 Create a virtual machine from a snapshot by creating a managed disk from the snapshot and then attaching the new managed disk as the OS disk. For more information, see the [Create a VM from a snapshot](/previous-versions/azure/virtual-machines/scripts/virtual-machines-linux-cli-sample-create-vm-from-snapshot?toc=%2fcli%2fmodule%2ftoc.json) script.