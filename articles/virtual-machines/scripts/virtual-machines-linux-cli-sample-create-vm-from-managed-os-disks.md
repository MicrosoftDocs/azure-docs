---
title: Azure CLI Script Sample - Create a VM by attaching a managed disk as OS disk | Microsoft Docs
description: Azure CLI Script Sample - Create a VM by attaching a managed disk as OS disk
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

# Create a virtual machine using an existing managed OS disk with CLI

This script creates a virtual machine by attaching an existing managed disk as OS disk. Use this script in preceding scenarios:
* Create a VM from an existing managed OS disk that was copied from a managed disk in different subscription
* Create a VM from an existing managed disk that was created from a specialized VHD file 
* Create a VM from an existing managed OS disk that was created from a snapshot 

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/virtual-machine/create-vm-attach-existing-managed-os-disk/create-vm-attach-existing-managed-os-disk.sh "Create VM from a managed disk")]

## Clean up deployment 

Run the following command to remove the resource group, VM, and all related resources.

```azurecli-interactive 
az group delete --name myResourceGroup
```

## Script explanation

This script uses the following commands to get managed disk properties, attach a managed disk to a new VM and create a VM. Each item in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az disk show](https://docs.microsoft.com/cli/azure/disk) | Gets managed disk properties using disk name and resource group name. Id property is used to attach a managed disk to a new VM |
| [az vm create](https://docs.microsoft.com/cli/azure/vm) | Creates a VM using a managed OS disk |
## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

Additional virtual machine CLI script samples can be found in the [Azure Linux VM documentation](../linux/cli-samples.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
