---
title: Azure CLI Script Sample - Peer two virtual networks | Microsoft Docs
description: Azure CLI Script Sample - Peer two virtual networks
services: virtual-network
documentationcenter: virtual-network
author: KumudD
manager: mtillman
ms.service: virtual-network
ms.devlang: azurecli
ms.topic: article
ms.tgt_pltfrm:
ms.workload: infrastructure
ms.date: 07/07/2017
ms.author: kumud
---

# Peer two virtual networks

This script creates and connects two virtual networks in the same region through the Azure network. After running the script, you will create a peering between two virtual networks.

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]


## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/virtual-network/peer-two-virtual-networks/peer-two-virtual-networks.sh "Peer two networks")]

## Clean up deployment 

Run the following command to remove the resource group, VM, and all related resources.

```azurecli
az group delete --name myResourceGroup --yes
```

## Script explanation

This script uses the following commands to create a resource group, virtual machine, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](https://docs.microsoft.com/cli/azure/group) | Creates a resource group in which all resources are stored. |
| [az network vnet create](https://docs.microsoft.com/cli/azure/network/vnet) | Creates an Azure virtual network and subnet. |
| [az network vnet peering create](https://docs.microsoft.com/cli/azure/network/vnet/peering) | Creates a peering between two virtual networks.  |
| [az group delete](https://docs.microsoft.com/cli/azure/vm/extension) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

Additional networking CLI script samples can be found in the [Azure Networking Overview documentation](../cli-samples.md).
