---
title: Azure CLI Script Sample - Create two VMs with an internal and external NSG | Microsoft Docs
description: Azure CLI Script Sample - Create two VMs with internal and external NSG
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
ms.date: 02/21/2017
ms.author: nepeters
---

# Secure network traffic between virtual machines

This script creates two virtual machines and secures incoming traffic to both. One virtual machine is accessible on the internet and has a network security group (NSG) configured to allow traffic on port 22 and port 80. The second virtual machine is not accessible on the internet, and has an NSG configured to only allow traffic from the first virtual machine. 

Before running this script, ensure that a connection with Azure has been created using the `az login` command. Also, an SSH public key with the name `id_rsa.pub` must be stored in the ~/.ssh directory.

This sample works in a Bash shell. For options on running Azure CLI scripts on Windows client, see [Running the Azure CLI in Windows](../virtual-machines-windows-cli-options.md).

## Create VM sample with a network security group

[!code-azurecli[main](../../../cli_scripts/virtual-machine/create-vm-nsg/create-vm-nsg.sh "Create VM with NSG")]

## Clean up deployment 

After the script sample has been run, the following command can be used to remove the Resource Group, VM, and all related resources.

```azurecli
az group delete --name myResourceGroup
```

## Script explanation

This script uses the following commands to create a resource group, virtual machine, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](https://docs.microsoft.com/cli/azure/group#create) | Creates a resource group in which all resources are stored. |
| [az network vnet create](https://docs.microsoft.com/cli/azure/network/vnet#create) | Creates an Azure virtual network and subnet. |
| [az network vnet subnet create](https://docs.microsoft.com/cli/azure/network/vnet/subnet#create) | Creates a subnet. |
| [az network public-ip create](https://docs.microsoft.com/cli/azure/network/public-ip#create) | Creates a public IP address with a static IP address and an associated DNS name. |
| [az network nsg create](https://docs.microsoft.com/cli/azure/network/nsg#create) | Creates a network security group (NSG), which is a security boundary between the internet and the virtual machine. |
| [az network nsg rule create](https://docs.microsoft.com/cli/azure/network/nsg/rule#create) | Creates an NSG rule to allow inbound traffic. |
| [az network vnet subnet update](https://docs.microsoft.com/cli/azure/network/vnet/subnet#update) | Updates an Azure subnet. In this sample, the network security groups are associated with existing subnets. |
| [az network nic create](https://docs.microsoft.com/cli/azure/network/nic#create) | Creates a virtual network card and attaches it to the virtual network, subnet, and NSG. |
| [az vm create](https://docs.microsoft.com/cli/azure/vm#create) | Creates the virtual machine and connects it to the network card, virtual network, subnet, and NSG. This command also specifies the virtual machine image to be used, and administrative credentials.  |
| [az group delete](https://docs.microsoft.com/cli/azure/vm/extension#set) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI see [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview).

Additional virtual machine CLI script samples can be found in the [Azure Linux VM documentation](../virtual-machines-linux-cli-samples.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
