---
title: Create a VM by attaching a managed disk as OS disk - CLI Sample 
description: Azure CLI Script Sample - Create a VM by attaching a managed disk as OS disk
services: virtual-machines-linux
documentationcenter: virtual-machines
author: ramankumarlive
manager: kavithag
editor: ramankum
tags: azure-service-management

ms.assetid:
ms.service: storage
ms.subservice: disks
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 02/23/2022
ms.author: ramankum
ms.custom: mvc, devx-track-azurecli
---

# Create a virtual machine using an existing managed OS disk with CLI

This script creates a virtual machine by attaching an existing managed disk as OS disk. Use this script in preceding scenarios:

* Create a VM from an existing managed OS disk that was copied from a managed disk in different subscription
* Create a VM from an existing managed disk that was created from a specialized VHD file
* Create a VM from an existing managed OS disk that was created from a snapshot

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/virtual-machine/create-vm-attach-existing-managed-os-disk/create-vm-attach-existing-managed-os-disk.sh" id="FullScript":::

## Clean up resources

Run the following command to remove the resource group, VM, and all related resources.

```azurecli-interactive
az group delete --name myResourceGroupName
```

## Sample reference

This script uses the following commands to get managed disk properties, attach a managed disk to a new VM and create a VM. Each item in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az disk show](/cli/azure/disk) | Gets managed disk properties using disk name and resource group name. Id property is used to attach a managed disk to a new VM |
| [az vm create](/cli/azure/vm) | Creates a VM using a managed OS disk |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional virtual machine CLI script samples can be found in the [Azure Linux VM documentation](../linux/cli-samples.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
