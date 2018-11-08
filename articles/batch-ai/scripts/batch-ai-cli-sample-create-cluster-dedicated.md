---
title: Azure CLI Script Example - Create dedicated Batch AI cluster | Microsoft Docs
description: Azure CLI Script Example - Create and manage a Batch AI cluster of dedicated nodes (virtual machines)
services: batch-ai
documentationcenter: ''
author: dlepow
manager: jeconnoc
editor: 

ms.assetid:
ms.service: batch-ai
ms.devlang: azurecli
ms.topic: sample
ms.tgt-pltfrm: multiple
ms.workload: na
ms.date: 07/26/2018
ms.author: danlep
---

# CLI example: Create and manage a Batch AI cluster of dedicated nodes

This script demonstrates some of the commands available in the Azure CLI to create and
manage a Batch AI cluster consisting of dedicated nodes (virtual machines).

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.38 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli). 

## Example script

[!code-azurecli-interactive[main](../../../cli_scripts/batch-ai/create-cluster/create-cluster-dedicated.sh "Create Batch AI cluster - dedicated nodes")]

## Clean up deployment

Run the following commands to remove the
resource groups and all resources associated with them.

```azurecli-interactive
# Remove resource group for the cluster.
az group delete --name myResourceGroup

# Remove resource group for the auto-storage account.
az group delete --name batchaiautostorage
```

## Script explanation

This script uses the following commands. Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az batchai workspace create](/cli/azure/batchai/workspace#az-batchai-workspace-create) | Creates a Batch AI workspace. |
| [az batchai cluster create](/cli/azure/batchai/cluster#az-batchai-cluster-create) | Creates a Batch AI cluster. |
| [az batchai cluster show](/cli/azure/batchai/cluster#az-batchai-cluster-show) | Shows information about a Batch AI cluster. |
| [az batchai cluster node list](/cli/azure/batchai/cluster/node#az-batchai-cluster-show) | Lists the nodes in a Batch AI cluster. |
| [az batchai cluster resize](/cli/azure/batchai/cluster#az-batchai-cluster-resize) | Resizes the Batch AI cluster.  |
| [az group delete](/cli/azure/group#az-group-delete) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).
