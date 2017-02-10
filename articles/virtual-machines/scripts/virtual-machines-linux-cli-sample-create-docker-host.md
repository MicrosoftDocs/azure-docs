---
title: Azure CLI Script Sample - Create a Docker host| Microsoft Docs
description: Azure CLI Script Sample - Create a Docker host 
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
ms.date: 02/09/2017
ms.author: nepeters
---

# Create a virtual machine with Docker enabled

This sample script creates a virtual machine and then uses the Azure Docker VM extension to configure a Docker host. The Docker VM extension then creates a container running the NGINX. Finally, the script configures the Azure NSG to all inbound traffic on port 80. Once the script has been successfully run, the NGINX web server can be access through the FQDN of the Azure virtual machine.

This script needs to be run from a PowerShell console. Before running this script, ensure that a connection with Azure has been created using the `az login` command. Also, an SSH public key with the name `id_rsa.pub` must be stored in the `c:\ssh` directory.

## Create a Docker host

[!code-azurecli[main](../../../cli_scripts/virtual-machine/create-docker-host/create-docker-host.sh "Docker Host")]

## Clean up deployment 

After the script sample has been run, the follow command can be used to remove the Resource Group, VM, and all related resources.

```azurecli
az group delete --name myResourceGroup
```

## Script explanation

This script uses the following commands to create the deployment. Each item in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](https://docs.microsoft.com/en-us/cli/azure/group#create) | Creates a resource group in which all resources are stored. |
| [az storage account create](https://docs.microsoft.com/en-us/cli/azure/storage/account#create) | Creates a storage account. This is where the VM disk is stored. |
| [az network vnet create](https://docs.microsoft.com/en-us/cli/azure/network/vnet#create) | Creates an Azure virtual network and subnet. |
| [az network public-ip create](https://docs.microsoft.com/en-us/cli/azure/network/public-ip#create) | Creates a public IP address with a static IP address and an associated DNS name. |
| [az network nsg create](https://docs.microsoft.com/en-us/cli/azure/network/nsg#create) | Creates a network security group, which is a security boundary between the internet and the virtual machine. |
| [az network nsg rule create](https://docs.microsoft.com/en-us/cli/azure/network/nsg/rule#create) | Creates an NSG rule to allow inbound traffic. In this sample, port 22 is opened for SSH traffic. |
| [az network nic create](https://docs.microsoft.com/en-us/cli/azure/network/nic#create) | Creates a virtual network card and attaches it to the virtual network, subnet, and NSG. |
| [az vm create](https://docs.microsoft.com/en-us/cli/azure/vm#create) | Creates the virtual machine and connects it to the network card, virtual network, subnet, NSG. This command also specifies the virtual machine image to be used, and administrative credentials.  |
| [azure vm extension set](https://docs.microsoft.com/en-us/cli/azure/vm/extension#set) | Adds and runs a virtual machine extension to a VM. In this sample, the Docker VM extension is used to configure a Docker host.|
| [az group delete](https://docs.microsoft.com/en-us/cli/azure/vm/extension#set) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentaiton](https://docs.microsoft.com/en-us/cli/azure/overview).

Additional virtual machine CLI script samples can be found in the [Azure Linux VM documentation](../virtual-machines-linux-cli-samples.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).