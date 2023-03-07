---
title: Copy managed disks to same or different subscription - CLI Sample
description: Azure CLI Script Sample - Copy (or move) managed disks to the same or a different subscription
documentationcenter: storage
author: ramankumarlive
manager: kavithag
ms.service: storage
ms.subservice: disks
ms.devlang: azurecli
ms.topic: sample
ms.workload: infrastructure
ms.date: 02/23/2022
ms.author: ramankum
ms.custom: mvc
---

# Copy managed disks to same or different subscription with CLI

This script copies a managed disk to same or different subscription but in the same region. The copy works only when the subscriptions are part of the same Azure AD tenant.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/virtual-machine/copy-managed-disks-to-same-or-different-subscription/copy-managed-disks-to-same-or-different-subscription.sh" id="FullScript":::

## Clean up resources

Run the following command to remove the resource group, VM, and all related resources.

```azurecli-interactive
az group delete --name mySourceResourceGroupName
```

## Sample reference

This script uses following commands to create a new managed disk in the target subscription using the `Id` of the source managed disk. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az disk show](/cli/azure/disk) | Gets all the properties of a managed disk using the name and resource group properties of the managed disk. The `Id` property is used to copy the managed disk to different subscription.  |
| [az disk create](/cli/azure/disk) | Copies a managed disk by creating a new managed disk in different subscription using the `Id` and name the parent managed disk.  |

## Next steps

[Create a virtual machine from a managed disk](./virtual-machines-linux-cli-sample-create-vm-from-managed-os-disks.md?toc=%2fpowershell%2fmodule%2ftoc.json)

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional virtual machine and managed disks CLI script samples can be found in the [Azure Linux VM documentation](../linux/cli-samples.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
