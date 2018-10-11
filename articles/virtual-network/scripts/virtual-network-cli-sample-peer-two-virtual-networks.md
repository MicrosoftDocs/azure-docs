---
title: Azure CLI script sample - Peer two virtual networks | Microsoft Docs
description: Azure CLI script sample - Peer two virtual networks.
services: virtual-network
documentationcenter: virtual-network
author: jimdial
manager: jeconnoc
editor: ''
tags:

ms.assetid:
ms.service: virtual-network
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm:
ms.workload: infrastructure
ms.date: 03/20/2018
ms.author: jdial
---

# Peer two virtual networks script sample

This script sample creates and connects two virtual networks in the same region through the Azure network. After running the script, you have a peering between two virtual networks.

You can execute the script from the Azure [Cloud Shell](https://shell.azure.com/bash), or from a local Azure CLI installation. If you use the CLI locally, this script requires that you are running version 2.0.28 or later. To find the installed version, run `az --version`. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli). If you are running the CLI locally, you also need to run `az login` to create a connection with Azure.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]


## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/virtual-network/peer-two-virtual-networks/peer-two-virtual-networks.sh "Peer two networks")]

## Clean up deployment 

Run the following command to remove the resource group, VM, and all related resources:

```azurecli
az group delete --name myResourceGroup --yes
```

## Script explanation

This script uses the following commands to create a resource group, virtual machine, and all related resources. Each command in the following table links to command-specific documentation:

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az_group_create) | Creates a resource group in which all resources are stored. |
| [az network vnet create](/cli/azure/network/vnet#az_network_vnet_create) | Creates an Azure virtual network and subnet. |
| [az network vnet peering create](/cli/azure/network/vnet/peering#az_network_vnet_peering_create) | Creates a peering between two virtual networks.  |
| [az group delete](/cli/azure/vm/extension#az_vm_extension_set) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

Additional virtual network CLI script samples can be found in [Virtual network CLI samples](../cli-samples.md).
