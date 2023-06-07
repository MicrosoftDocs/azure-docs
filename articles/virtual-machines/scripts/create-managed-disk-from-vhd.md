---
title: Create a managed disk from a VHD file in the same account - CLI sample
description: Azure CLI Script Sample - Create a managed disk from a VHD file in a storage account in the same subscription
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
ms.custom: mvc, devx-track-azurecli
---

# Create a managed disk from a VHD file in a storage account in the same subscription with CLI (Linux)

This script creates a managed disk from a VHD file in a storage account in the same subscription. Use this script to import a specialized (not generalized/sysprepped) VHD to managed OS disk to create a virtual machine. Or, use it to import a data VHD to managed data disk.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/virtual-machine/create-managed-data-disks-from-vhd/create-managed-data-disks-from-vhd.sh" id="FullScript":::

## Clean up resources

Run the following command to remove the resource group, VM, and all related resources.

```azurecli-interactive
az group delete --name myResourceGroupName
```

## Sample reference

This script uses following commands to create a managed disk from a VHD. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az disk create](/cli/azure/disk) | Creates a managed disk using URI of a VHD in a storage account in the same subscription |

## Next steps

[Create a virtual machine by attaching a managed disk as OS disk](./virtual-machines-linux-cli-sample-create-vm-from-managed-os-disks.md?toc=%2fcli%2fmodule%2ftoc.json)

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional virtual machine and managed disks CLI script samples can be found in the [Azure Linux VM documentation](../linux/cli-samples.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
