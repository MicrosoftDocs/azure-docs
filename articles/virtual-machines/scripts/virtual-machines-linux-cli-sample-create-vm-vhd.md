---
title: Azure CLI Script Sample - Create a VM with a VHD  
description: Azure CLI Script Sample - Create a VM using a virtual hard disk.
services: virtual-machines-linux
documentationcenter: virtual-machines
author: cynthn
manager: gwallace

tags: azure-service-management

ms.assetid:
ms.service: virtual-machines-linux
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 03/09/2017
ms.author: cynthn
ms.custom: mvc
---

# Create a VM with a virtual hard disk

This example creates a virtual machine using a VHD.
It creates a resource group, a storage account, and a container,
then it creates a VM by uploading the VHD to the container.
It replaces the ssh public key with your public key so that you have access to the VM.

You'll need a bootable VHD. The script looks for `~/sample.vhd`.

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/virtual-machine/create-vm-vhd/create-vm-vhd.sh "Create VM using a VHD")]

## Clean up deployment 

Run the following command to remove the resource group, VM, and all related resources.

```azurecli-interactive 
az group delete -n az-cli-vhd
```

## Script explanation

This script uses the following commands to create a resource group, virtual machine, availability set, load balancer, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](https://docs.microsoft.com/cli/azure/group) | Creates a resource group in which all resources are stored. |
| [az storage account list](https://docs.microsoft.com/cli/azure/storage/account) | Lists storage accounts |
| [az storage account check-name](https://docs.microsoft.com/cli/azure/storage/account) | Checks that a storage account name is valid and that it doesn't already exist |
| [az storage account keys list](https://docs.microsoft.com/cli/azure/storage/account/keys) | Lists keys for the storage accounts |
| [az storage blob exists](https://docs.microsoft.com/cli/azure/storage/blob) | Checks whether the blob exists |
| [az storage container create](https://docs.microsoft.com/cli/azure/storage/container) | Creates a container in a storage account. |
| [az storage blob upload](https://docs.microsoft.com/cli/azure/storage/blob) | Creates a blob in the container by uploading the VHD. |
| [az vm list](https://docs.microsoft.com/cli/azure/vm) | Used with `--query` check whether the VM name is in use. | 
| [az vm create](https://docs.microsoft.com/cli/azure/vm/availability-set) | Creates the virtual machines. |
| [az vm list-ip-addresses](https://docs.microsoft.com/cli/azure/vm#az-vm-list-ip-addresses) | Gets the IP address of the VM that was created. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

Additional virtual machine CLI script samples can be found in the [Azure Linux VM documentation](../linux/cli-samples.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
