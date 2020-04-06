---
title: Create a VM from a snapshot - CLI Sample
description: Azure CLI Script Sample - Create a VM from a snapshot
services: virtual-machines-linux
documentationcenter: virtual-machines
author: ramankumarlive
manager: kavithag
editor: ramankum
tags: azure-service-management

ms.assetid:
ms.service: virtual-machines-linux
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 05/10/2017
ms.author: ramankum
ms.custom: mvc
---

# Create a virtual machine from a snapshot with CLI

This script creates a virtual machine from a snapshot of an OS disk.

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/virtual-machine/create-vm-from-snapshot/create-vm-from-snapshot.sh "Create VM from snapshot")]

## Clean up deployment 

Run the following command to remove the resource group, VM, and all related resources.

```azurecli-interactive 
az group delete --name myResourceGroup
```

## Script explanation

This script uses the following commands to create a managed disk, virtual machine, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az snapshot show](https://docs.microsoft.com/cli/azure/snapshot) | Gets snapshot using snapshot name and resource group name. Id property of the returned object is used to create a managed disk.  |
| [az disk create](https://docs.microsoft.com/cli/azure/disk) | Creates managed disks from a snapshot using snapshot Id, disk name, storage type, and size  |
| [az vm create](https://docs.microsoft.com/cli/azure/vm) | Creates a VM using a managed OS disk |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

Additional virtual machine CLI script samples can be found in the [Azure Linux VM documentation](../linux/cli-samples.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
