---
title: Route traffic via network virtual appliance - Azure CLI script sample
description: Route traffic through a firewall network virtual appliance - Azure CLI script sample.
services: virtual-network
documentationcenter: virtual-network
author: asudbring
manager: twooley
ms.service: virtual-network
ms.devlang: azurecli
ms.topic: sample
ms.workload: infrastructure
ms.date: 02/03/2022
ms.author: allensu 
ms.custom: devx-track-azurecli
---

# Route traffic through a network virtual appliance - Azure CLI script sample

This script sample creates a virtual network with front-end and back-end subnets. It also creates a VM with IP forwarding enabled to route traffic between the two subnets. After running the script you can deploy network software, such as a firewall application, to the VM.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/virtual-network/route-traffic-through-nva/route-traffic-through-nva.sh" id="FullScript":::

## Clean up deployment

[!INCLUDE [cli-clean-up-resources.md](../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

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
