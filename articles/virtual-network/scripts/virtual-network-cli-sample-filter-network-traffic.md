---
title: Filter VM network traffic - Azure CLI script sample
description: Filter inbound and outbound virtual machine (VM) network traffic using an Azure CLI script sample.
services: virtual-network
documentationcenter: virtual-network
author: asudbring
manager: mtillman
ms.service: virtual-network
ms.devlang: azurecli
ms.topic: sample
ms.workload: infrastructure
ms.date: 02/03/2022
ms.author: allensu 
ms.custom: devx-track-azurecli
---

# Filter inbound and outbound VM network traffic using an Azure CLI script sample

This script sample creates a virtual network with front-end and back-end subnets. Inbound network traffic to the front-end subnet is limited to HTTP, HTTPS, and SSH, while outbound traffic to the internet from the back-end subnet is not permitted. After running the script, you will have one virtual machine with two NICs. Each NIC is connected to a different subnet.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/virtual-network/filter-network-traffic/filter-network-traffic.sh" id="FullScript":::

## Clean up deployment

[!INCLUDE [cli-clean-up-resources.md](../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following commands to create a resource group, virtual network, and network security groups. Each command in the following table links to command-specific documentation:

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group) | Creates a resource group in which all resources are stored. |
| [az network vnet create](/cli/azure/network/vnet) | Creates an Azure virtual network and front-end subnet. |
| [az network subnet create](/cli/azure/network/vnet/subnet) | Creates a back-end subnet. |
| [az network vnet subnet update](/cli/azure/network/vnet/subnet) | Associates NSGs to subnets. |
| [az network public-ip create](/cli/azure/network/public-ip) | Creates a public IP address to access the VM from the internet. |
| [az network nic create](/cli/azure/network/nic) | Creates virtual network interfaces and attaches them to the virtual network's front-end and back-end subnets. |
| [az network nsg create](/cli/azure/network/nsg) | Creates network security groups (NSG) that are associated to the front-end and back-end subnets. |
| [az network nsg rule create](/cli/azure/network/nsg/rule) |Creates NSG rules that allow or block specific ports to specific subnets. |
| [az vm create](/cli/azure/vm) | Creates virtual machines and attaches a NIC to each VM. This command also specifies the virtual machine image to use and administrative credentials. |
| [az group delete](/cli/azure/group) | Deletes a resource group and all resources it contains. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional virtual network CLI script samples can be found in [Virtual network CLI samples](../cli-samples.md).
