---
title:  Peer two virtual networks - Azure CLI script sample
description: Create and connect two virtual networks in the same region through the Azure network by using an Azure CLI script sample.
services: virtual-network
author: asudbring
manager: mtillman
ms.service: virtual-network
ms.devlang: azurecli
ms.topic: sample
ms.date: 02/03/2022
ms.author: allensu
ms.custom: devx-track-azurecli
---

# Peer two virtual networks with an Azure CLI script sample

This script sample creates and connects two virtual networks in the same region through the Azure network. After running the script, you have a peering between two virtual networks.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/virtual-network/peer-two-virtual-networks/peer-two-virtual-networks.sh" id="FullScript":::

## Clean up deployment

[!INCLUDE [cli-clean-up-resources.md](../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following commands to create a resource group, virtual machine, and all related resources. Each command in the following table links to command-specific documentation:

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group) | Creates a resource group in which all resources are stored. |
| [az network vnet create](/cli/azure/network/vnet) | Creates an Azure virtual network and subnet. |
| [az network vnet peering create](/cli/azure/network/vnet/peering) | Creates a peering between two virtual networks.  |
| [az group delete](/cli/azure/vm/extension) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional virtual network CLI script samples can be found in [Virtual network CLI samples](../cli-samples.md).
