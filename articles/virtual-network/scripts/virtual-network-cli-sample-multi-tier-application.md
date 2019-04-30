---
title: Azure CLI script sample - Create a network for multi-tier applications | Microsoft Docs
description: Azure CLI script sample - Create a virtual network for multi-tier applications.
services: virtual-network
documentationcenter: virtual-network
author: KumudD
manager: twooley
editor: ''
tags:

ms.assetid:
ms.service: virtual-network
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm:
ms.workload: infrastructure
ms.date: 03/20/2018
ms.author: kumud

---

# Create a network for multi-tier applications script sample

This script sample creates a virtual network with front-end and back-end subnets. Traffic to the front-end subnet is limited to HTTP and SSH, while traffic to the back-end subnet is limited to MySQL, port 3306. After running the script, you have two virtual machines, one in each subnet, that you can deploy web server and MySQL software to.

You can execute the script from the Azure [Cloud Shell](https://shell.azure.com/bash), or from a local Azure CLI installation. If you use the CLI locally, this script requires that you are running version 2.0.28 or later. To find the installed version, run `az --version`. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli). If you are running the CLI locally, you also need to run `az login` to create a connection with Azure.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]


## Sample script


[!code-azurecli-interactive[main](../../../cli_scripts/virtual-network/virtual-network-multi-tier-application/virtual-network-multi-tier-application.sh  "Virtual network for multi-tier application")]

## Clean up deployment 

Run the following command to remove the resource group, VM, and all related resources:

```azurecli
az group delete --name MyResourceGroup --yes
```

## Script explanation

This script uses the following commands to create a resource group, virtual network, and network security groups. Each command in the following table links to command-specific documentation:

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group) | Creates a resource group in which all resources are stored. |
| [az network vnet create](/cli/azure/network/vnet) | Creates an Azure virtual network and front-end subnet. |
| [az network subnet create](/cli/azure/network/vnet/subnet) | Creates a back-end subnet. |
| [az network public-ip create](/cli/azure/network/public-ip) | Creates a public IP address to access the VM from the internet. |
| [az network nic create](/cli/azure/network/nic) | Creates virtual network interfaces and attaches them to the virtual network's front-end and back-end subnets. |
| [az network nsg create](/cli/azure/network/nsg) | Creates network security groups (NSG) that are associated to the front-end and back-end subnets. |
| [az network nsg rule create](/cli/azure/network/nsg/rule) |Creates NSG rules that allow or block specific ports to specific subnets. |
| [az vm create](/cli/azure/vm) | Creates virtual machines and attaches a NIC to each VM. This command also specifies the virtual machine image to use and administrative credentials. |
| [az group delete](/cli/azure/group) | Deletes a resource group and all resources it contains. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional virtual network CLI script samples can be found in [Virtual network CLI samples](../cli-samples.md).
