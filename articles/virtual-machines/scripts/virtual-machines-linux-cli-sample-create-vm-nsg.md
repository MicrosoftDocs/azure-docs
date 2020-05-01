---
title: "CLI Sample: Create two VMs with an internal and external NSG"
description: Create two VMs with internal and external NSG to secure network traffic using the Azure CLI.
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
ms.date: 02/27/2017
ms.author: cynthn
ms.custom: mvc
---

# Secure network traffic between virtual machines using an NSG

This script creates two virtual machines and secures incoming traffic to both. One virtual machine is accessible on the internet and has a network security group (NSG) configured to allow traffic on port 22 and port 80. The second virtual machine is not accessible on the internet, and has an NSG configured to only allow traffic from the first virtual machine.

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/virtual-machine/create-vm-nsg/create-vm-nsg.sh "Create VM with NSG")]

## Clean up deployment

Run the following command to remove the resource group, VM, and all related resources.

```azurecli-interactive
az group delete --name myResourceGroup
```

## Script explanation

This script uses the following commands to create a resource group, virtual machine, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](https://docs.microsoft.com/cli/azure/group) | Creates a resource group in which all resources are stored. |
| [az network vnet create](https://docs.microsoft.com/cli/azure/network/vnet) | Creates an Azure virtual network and subnet. |
| [az network vnet subnet create](https://docs.microsoft.com/cli/azure/network/vnet/subnet) | Creates a subnet. |
| [az vm create](https://docs.microsoft.com/cli/azure/vm) | Creates the virtual machine and connects it to the network card, virtual network, subnet, and NSG. This command also specifies the virtual machine image to be used, and administrative credentials.  |
| [az network nsg rule list](https://docs.microsoft.com/cli/azure/network/nsg/rule) | Returns information about a network security group rule. In this sample, the rule name is stored in a variable for use later in the script. |
| [az network nsg rule update](https://docs.microsoft.com/cli/azure/network/nsg/rule) | Updates an NSG rule. In this sample, the back-end rule is updated to pass through traffic only from the front-end subnet. |
| [az group delete](https://docs.microsoft.com/cli/azure/vm/extension) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

Additional virtual machine CLI script samples can be found in the [Azure Linux VM documentation](../linux/cli-samples.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
