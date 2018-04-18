---
title: Create a snapshot of a VHD in Azure | Microsoft Docs
description: Learn how to create a copy of a VHD in Azure as a back up or for troubleshooting issues.
documentationcenter: ''
author: cynthn
manager: jeconnoc
editor: ''
tags: azure-resource-manager
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: azurecli
ms.topic: article
ms.date: 03/20/2018
ms.author: cynthn
---

# Create a snapshot 

Take a snapshot of an OS or data disk for backup or to troubleshoot VM issues. A snapshot is a full, read-only copy of a VHD. 

## Use Azure CLI 

The following example requires the Azure CLI 2.0 installed and logged into your Azure account. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

The following steps show how to take a snapshot using the `az snapshot create` command with the `--source-disk` parameter. The following example assumes that there is a VM called `myVM` in the `myResourceGroup` resource group.

Get the disk ID.
```azure-cli
osDiskId=$(az vm show -g myResourceGroup -n myVM --query "storageProfile.osDisk.managedDisk.id" -o tsv)
```

Take a snapshot named *osDisk-backup*.

```azurecli-interactive
az snapshot create \
    -g myResourceGroup \
	--source "$osDiskId" \
	--name osDisk-backup
```

> [!NOTE]
> If you would like to store your snapshot in zone-resilient storage, you need to create it in a region that supports [availability zones](../../availability-zones/az-overview.md) and include the `--sku Standard_ZRS` parameter.

## Use Azure portal 

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Starting in the upper-left, click **Create a resource** and search for **snapshot**.
3. In the Snapshot blade, click **Create**.
4. Enter a **Name** for the snapshot.
5. Select an existing [Resource group](../../azure-resource-manager/resource-group-overview.md#resource-groups) or type the name for a new one. 
6. Select an Azure datacenter Location.  
7. For **Source disk**, select the Managed Disk to snapshot.
8. Select the **Account type** to use to store the snapshot. We recommend **Standard_LRS** unless you need it stored on a high performing disk.
9. Click **Create**.


## Next steps

 Create a virtual machine from a snapshot by creating a managed disk from the snapshot and then attaching the new managed disk as the OS disk. For more information, see the [Create a VM from a snapshot](./../scripts/virtual-machines-linux-cli-sample-create-vm-from-snapshot.md?toc=%2fcli%2fmodule%2ftoc.json) script.

