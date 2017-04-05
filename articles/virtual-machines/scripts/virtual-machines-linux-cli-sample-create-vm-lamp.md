---
title: Azure CLI Script Sample - Deploy the LAMP Stack in a Load-Balanced VM Scale Set | Microsoft Docs
description: Use a custom script extension to deploy the LAMP Stack in a load=balanced VM scale set on Azure.
services: virtual-machines-linux
documentationcenter: virtual-machines
author: allclark
manager: douge
editor: tysonn
tags: azure-service-management

ms.assetid:
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 04/05/2017
ms.author: allclark
---

# Deploy the LAMP stack in a load-balanced VM scale set

This example creates a virtual machine scale set
and applies an extension that runs a custom script to deploy the LAMP stack
on each virtual machine in the scale set.

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

## Sample script

[!code-azurecli[main](../../../cli_scripts/virtual-machine/create-scaleset-php-ansible/build-stack.sh "Create VM scale set with LAMP stack")]

## Connect

Use this code to see how to connect to your VMs and your VM scale set.

[!code-azurecli[main](../../../cli_scripts/virtual-machine/create-scaleset-php-ansible/how-to-access.sh "Access the VM scale set")]

## Clean up deployment 

Run the following command to remove the resource group, the VM scale set and VMs, and all related resources.

```azurecli
az group delete -n myResourceGroup
```

## Script explanation

This script uses the following commands to create a resource group, virtual machine, availability set, load balancer, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](https://docs.microsoft.com/cli/azure/group#create) | Creates a resource group in which all resources are stored. |
| [az storage account list](https://docs.microsoft.com/cli/azure/storage/account#list) | Lists storage accounts |
| [az storage account check-name](https://docs.microsoft.com/cli/azure/storage/account#check-name) | Checks that a storage account name is valid and that it doesn't already exist |
| [az storage account keys list](https://docs.microsoft.com/cli/azure/storage/account/keys#list) | Lists keys for the storage accounts |
| [az storage blob exists](https://docs.microsoft.com/cli/azure/storage/blob#exists) | Checks whether the blob exists |
| [az storage container create](https://docs.microsoft.com/cli/azure/storage/container#create) | Creates a container in a storage account. |
| [az storage blob upload](https://docs.microsoft.com/cli/azure/storage/blob#upload) | Creates a blob in the container by uploading the VHD. |
| [az vm list](https://docs.microsoft.com/cli/azure/vm#list) | Used with `--query` check whether the VM name is in use. | 
| [az vm create](https://docs.microsoft.com/cli/azure/vm/availability-set#create) | Creates the virtual machines. |
| [az vm access set-linux-user](https://docs.microsoft.com/cli/azure/vm/access#set-linux-user) | Resets the SSH key to give the current user access to the VM. |
| [az vm list-ip-addresses](https://docs.microsoft.com/cli/azure/vm#list-ip-addresses) | Gets the IP address of the VM that was created. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview).

Additional virtual machine CLI script samples can be found in the [Azure Linux VM documentation](../linux/cli-samples.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
