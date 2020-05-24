---
title: Azure CLI Script Sample - Quick Create a Windows Server 2016 VM 
description: Azure CLI Script Sample - Quick Create a Windows Server 2016 VM 
services: virtual-machines-Windows
documentationcenter: virtual-machines
author: cynthn
manager: gwallace

tags: 

ms.assetid:
ms.service: virtual-machines-windows
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: vm-Windows
ms.workload: infrastructure
ms.date: 02/23/2017
ms.author: cynthn
ms.custom: mvc
---

# Quick Create a virtual machine with the Azure CLI

This script creates an Azure Virtual Machine running Windows Server 2016. After running the script, you can access the virtual machine through a Remote Desktop connection.

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/virtual-machine/create-vm-quick/create-windows-vm-quick.sh "Quick Create VM")]

## Clean up deployment 

Run the following command to remove the resource group, VM, and all related resources.

```azurecli-interactive 
az group delete --name myResourceGroup --yes
```

## Script explanation

This script uses the following commands to create a resource group, virtual machine, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](https://docs.microsoft.com/cli/azure/group) | Creates a resource group in which all resources are stored. |
| [az vm create](https://docs.microsoft.com/cli/azure/vm) | Creates the virtual machine and connects it to the network card, virtual network, subnet, and network security group. This command also specifies the virtual machine image to be used and administrative credentials.  |
| [az group delete](https://docs.microsoft.com/cli/azure/vm/extension) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

Additional virtual machine CLI script samples can be found in the [Azure Windows VM documentation](../windows/cli-samples.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).
