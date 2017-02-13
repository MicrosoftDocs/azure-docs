---
title: Azure CLI Script Sample - Quick Create a Linux VM | Microsoft Docs
description: Azure CLI Script Sample - Quick Create a Linux VM 
services: virtual-machines-linux
documentationcenter: virtual-machines
author: neilpeterson
manager: timlt
editor: tysonn
tags: azure-service-management

ms.assetid:
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 02/10/2017
ms.author: nepeters
---

# Quick Create a virtual machine with the Azure CLI

The sample script provided here creates an Azure Virtual Machine with an Ubuntu operating system in the West Europe Azure region. Included in the deployment are all associated resources such as storage and networking components. Once the script has been successfully run, the virtual Machine can be accessed over SSH. The below script has been written to run in Bash. For options on running Azure CLI scripts on Windows, see [Running the Azure CLI in Windows](./virtual-machines-windows-cli.md).

Before running this script, ensure that a connection with Azure has been created using the `az login` command. Also, an SSH public key with the name `id_rsa.pub` must be stored in the ~/.ssh directory.

## Create VM sample

[!code-azurecli[main](../../../cli_scripts/virtual-machine/create-vm-quick/create-vm-quick.sh "Quick Create VM")]

## Clean up deployment 

After the script sample has been run, the follow command can be used to remove the Resource Group, VM, and all related resources.

```azurecli
az group delete --name myResourceGroup
```

## Script explanation

This script uses the following commands to create a resource group, virtual machine, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](https://docs.microsoft.com/en-us/cli/azure/group#create) | Creates a resource group in which all resources are stored. |
| [az vm create](https://docs.microsoft.com/en-us/cli/azure/vm#create) | Creates the virtual machine and connects it to the network card, virtual network, subnet, NSG. This command also specifies the virtual machine image to be used, and administrative credentials.  |
| [az group delete](https://docs.microsoft.com/en-us/cli/azure/vm/extension#set) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/en-us/cli/azure/overview).

Additional virtual machine CLI script samples can be found in the [Azure Linux VM documentation](../virtual-machines-linux-cli-samples.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).