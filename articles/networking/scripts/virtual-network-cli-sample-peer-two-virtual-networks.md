---
title: Azure CLI Script Sample - Peer two virtual networks
description: Use an Azure CLI script sample to create and connect two virtual networks in the same region through the Azure network.
author: asudbring
ms.service: virtual-network
ms.topic: article
ms.date: 03/23/2023
ms.author: allensu 
ms.custom: devx-track-azurecli
---

# Use an Azure CLI sample script to connect two virtual networks

This script creates and connects two virtual networks in the same region through the Azure network. After running the script, you'll create a peering between two virtual networks.

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/virtual-network/peer-two-virtual-networks/peer-two-virtual-networks.sh "Peer two networks")]

## Clean up deployment 

Run the following command to remove the resource group, VM, and all related resources.

```azurecli
az group delete --name $resourceGroup --yes
```

## Script explanation

This script uses the following commands to create a resource group, virtual machine, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group) | Creates a resource group in which all resources are stored. |
| [az network vnet create](/cli/azure/network/vnet) | Creates an Azure virtual network and subnet. |
| [az network vnet peering create](/cli/azure/network/vnet/peering) | Creates a peering between two virtual networks.  |
| [az group delete](/cli/azure/vm/extension) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

More networking CLI script samples can be found in the [Azure Networking Overview documentation](../cli-samples.md).