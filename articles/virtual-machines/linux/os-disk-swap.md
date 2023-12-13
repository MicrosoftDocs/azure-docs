---
title: Swap between OS disks using the Azure CLI '
description: Change the operating system disk used by an Azure virtual machine using the Azure CLI.
author: roygara
ms.service: azure-disk-storage
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 04/24/2018
ms.author: rogarana
ms.custom: devx-track-azurecli
---
# Change the OS disk used by an Azure VM using the Azure CLI

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets 

If you have an existing VM, but you want to swap the disk for a backup disk or another OS disk, you can use the Azure CLI to swap the OS disks. You don't have to delete and recreate the VM. You can even use a managed disk in another resource group, as long as it isn't already in use.

The VM does not need to be stopped\deallocated. The resource ID of the managed disk can be replaced with the resource ID of a different managed disk. 

Make sure that the VM size and storage type are compatible with the disk you want to attach. For example, if the disk you want to use is in Premium Storage, then the VM needs to be capable of Premium Storage (like a DS-series size).

This article requires Azure CLI version 2.0.25 or greater. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli). 


Use [az disk list](/cli/azure/disk) to get a list of the disks in your resource group.

```azurecli-interactive
az disk list \
   -g myResourceGroupDisk \
   --query '[*].{diskId:id}' \
   --output table
```


(Optional) Use [az vm stop](/cli/azure/vm) to stop\deallocate the VM before swapping the disks.

```azurecli-interactive
az vm stop \
   -n myVM \
   -g myResourceGroup
```


Use [az vm update](/cli/azure/vm#az-vm-update) with the full resource ID of the new disk for the `--osdisk` parameter 

```azurecli-interactive 
az vm update \
   -g myResourceGroup \
   -n myVM \
   --os-disk /subscriptions/<subscription ID>/resourceGroups/<resource group>/providers/Microsoft.Compute/disks/myDisk 
   ```
   
Restart the VM using [az vm start](/cli/azure/vm).

```azurecli-interactive
az vm start \
   -n myVM \
   -g myResourceGroup
```

   
**Next steps**

To create a copy of a disk, see [Snapshot a disk](snapshot-copy-managed-disk.md).
