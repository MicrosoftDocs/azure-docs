---
title: Azure CLI script sample - Route traffic through a network virtual appliance | Microsoft Docs
description: Azure CLI script sample - Route traffic through a firewall network virtual appliance.
services: virtual-network
documentationcenter: virtual-network
author: jimdial
manager: timlt
editor: tysonn
tags:

ms.assetid:
ms.service: virtual-network
ms.devlang: azurecli
ms.topic: article
ms.tgt_pltfrm:
ms.workload: infrastructure
ms.date: 07/07/2017
ms.author: timlt

---

# Route traffic through a network virtual appliance

This script sample creates a virtual network with front-end and back-end subnets. It also creates a VM with IP forwarding enabled to route traffic between the two subnets. After running the script you can deploy network software, such as a firewall application, to the VM.

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]


## Sample script


[!code-azurecli-interactive[main](../../../cli_scripts/virtual-network/route-traffic-through-nva/route-traffic-through-nva.sh "Route traffic through a network virtual appliance")]

## Clean up deployment 

Run the following command to remove the resource group, VM, and all related resources.

```azurecli
az group delete --name MyResourceGroup --yes
```

## Script explanation

This script uses the following commands to create a resource group, virtual network,  and network security groups. Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group) | Creates a resource group in which all resources are stored. |
| [az network vnet create](/cli/azure/network/vnet) | Creates an Azure virtual network and front-end subnet. |
| [az network subnet create](/cli/azure/network/vnet/subnet) | Creates back-end and DMZ subnets. |
| [az network public-ip create](/cli/azure/network/public-ip) | Creates a public IP address to access the VM from the Internet. |
| [az network nic create](/cli/azure/network/nic) | Creates a virtual network interface and enable IP forwarding for it. |
| [az network nsg create](/cli/azure/network/nsg) | Creates a network security group (NSG). |
| [az network nsg rule create](/cli/azure/network/nsg/rule) | Creates NSG rules that allow HTTP and HTTPS ports inbound to the VM. |
| [az network vnet subnet update](/cli/azure/network/vnet/subnet)| Associates the NSGs and route tables to subnets. |
| [az network route-table create](/cli/azure/network/route-table#az-network-route-table-create)| Creates a route table for all routes. |
| [az network route-table route create](/cli/azure/network/route-table/route#az-network-route-table-route-create)| Creates routes to route traffic between subnets and the Internet through the VM. |
| [az vm create](/cli/azure/vm) | Creates a virtual machine and attaches the NIC to it. This command also specifies the virtual machine image to use and administrative credentials. |
| [az group delete](/cli/azure/group) | Deletes a resource group and all resources it contains. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional networking CLI script samples can be found in the [Azure Networking Overview documentation](../cli-samples.md)
