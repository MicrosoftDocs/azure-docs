---
title: Copy managed disk snapshot to a subscription - CLI Sample
description: Azure CLI Script Sample - Copy (or move) snapshot of a managed disk to same or different subscription with CLI
documentationcenter: storage
author: ramankumarlive
manager: kavithag
ms.service: storage
ms.subservice: disks
ms.topic: sample
ms.workload: infrastructure
ms.date: 02/23/2022
ms.author: ramankum
ms.custom: mvc
---

# Copy snapshot of a managed disk to same or different subscription with CLI

This script copies a snapshot of a managed disk to same or different subscription. Use this script for the following scenarios:

- Migrate a snapshot in Premium storage (Premium_LRS) to Standard storage (Standard_LRS or Standard_ZRS) to reduce your cost.
- Migrate a snapshot from locally redundant storage (Premium_LRS, Standard_LRS) to zone redundant storage (Standard_ZRS) to benefit from the higher reliability of ZRS storage.
- Move a snapshot to different subscription in the same region for longer retention.

> [!NOTE]
> Both subscriptions must be located under the same tenant

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/virtual-machine/copy-snapshot-to-same-or-different-subscription/copy-snapshot-to-same-or-different-subscription.sh" id="FullScript":::

## Clean up resources

Run the following command to remove the resource group, VM, and all related resources.

```azurecli-interactive
az group delete --name mySourceResourceGroupName
```

## Sample reference

This script uses following commands to create a snapshot in the target subscription using the `Id` of the source snapshot. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az snapshot show](/cli/azure/snapshot) | Gets all the properties of a snapshot using the name and resource group properties of the snapshot. The `Id` property is used to copy the snapshot to different subscription.  |
| [az snapshot create](/cli/azure/snapshot) | Copies a snapshot by creating a snapshot in different subscription using the `Id` and name of the parent snapshot.  |

## Next steps

[Create a virtual machine from a snapshot](./virtual-machines-linux-cli-sample-create-vm-from-snapshot.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional virtual machine and managed disks CLI script samples can be found in the [Azure Linux VM documentation](../linux/cli-samples.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
