---
title: Azure CLI script sample - Route traffic through a network virtual appliance | Microsoft Docs
description: Azure CLI script sample - Route traffic through a firewall network virtual appliance.
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

# Route traffic through a network virtual appliance script sample

This script sample creates a virtual network with front-end and back-end subnets. It also creates a VM with IP forwarding enabled to route traffic between the two subnets. After running the script you can deploy network software, such as a firewall application, to the VM.

You can execute the script from the Azure [Cloud Shell](https://shell.azure.com/bash), or from a local Azure CLI installation. If you use the CLI locally, this script requires that you are running version 2.0.28 or later. To find the installed version, run `az --version`. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli). If you are running the CLI locally, you also need to run `az login` to create a connection with Azure.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]


## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/virtual-network/route-traffic-through-nva/route-traffic-through-nva.sh "Route traffic through a network virtual appliance")]

## Clean up deployment 

Run the following command to remove the resource group, VM, and all related resources:

```azurecli
az group delete --name MyResourceGroup --yes
```

## Script explanation

This script uses the following commands to create a resource group, virtual network,  and network security groups. Each command in the following table links to command-specific documentation:

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group) | Creates a resource group in which all resources are stored. |
| [az network vnet create](/cli/azure/network/vnet) | Creates an Azure virtual network and front-end subnet. |
| [az network subnet create](/cli/azure/network/vnet/subnet) | Creates back-end and DMZ subnets. |
| [az network public-ip create](/cli/azure/network/public-ip) | Creates a public IP address to access the VM from the internet. |
| [az network nic create](/cli/azure/network/nic) | Creates a virtual network interface and enable IP forwarding for it. |
| [az network nsg create](/cli/azure/network/nsg) | Creates a network security group (NSG). |
| [az network nsg rule create](/cli/azure/network/nsg/rule) | Creates NSG rules that allow HTTP and HTTPS ports inbound to the VM. |
| [az network vnet subnet update](/cli/azure/network/vnet/subnet)| Associates the NSGs and route tables to subnets. |
| [az network route-table create](/cli/azure/network/route-table#az-network-route-table-create)| Creates a route table for all routes. |
| [az network route-table route create](/cli/azure/network/route-table/route#az-network-route-table-route-create)| Creates routes to route traffic between subnets and the internet through the VM. |
| [az vm create](/cli/azure/vm) | Creates a virtual machine and attaches the NIC to it. This command also specifies the virtual machine image to use and administrative credentials. |
| [az group delete](/cli/azure/group) | Deletes a resource group and all resources it contains. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional virtual network CLI script samples can be found in [Virtual network CLI samples](../cli-samples.md).
