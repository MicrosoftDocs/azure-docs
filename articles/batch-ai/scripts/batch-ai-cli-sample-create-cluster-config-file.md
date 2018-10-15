---
title: Azure CLI Script Example - Create a Batch AI cluster with a config file | Microsoft Docs
description: Azure CLI Script Example - Create a Batch AI cluster by specifying configuration settings in a JSON file.
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
ms.date: 08/16/2018
ms.author: danlep
---

# CLI example: Create a Batch AI cluster using a cluster configuration file

This script demonstrates how to use a JSON configuration file to specify settings for a Batch AI cluster. Use these settings instead of corresponding command line parameters for `az batchai cluster create`. A configuration file is useful when you need to mount multiple file systems on the cluster nodes or want to use an identical configuration in several clusters.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.38 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli). 

## Example script

[!code-azurecli-interactive[main](../../../cli_scripts/batch-ai/create-cluster/create-cluster-config-file.sh "Create Batch AI cluster - configuration file")]

## Clean up deployment

Run the following commands to remove the
resource groups and all resources associated with them.

```azurecli-interactive
# Remove resource group for the cluster.
az group delete --name myResourceGroup
```

## Script explanation

This script uses the following commands. Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az storage account create](/cli/azure/storage/account#az-storage-account-create) | Creates a storage account. |
| [az storage share create](/cli/azure/storage/share#az-storage-share-create) | Creates a file share in a storage account. |
| [az batchai workspace create](/cli/azure/batchai/workspace#az-batchai-workspace-create) | Creates a Batch AI workspace. |
| [az batchai cluster create](/cli/azure/batchai/cluster#az-batchai-cluster-create) | Creates a Batch AI cluster. |
| [az batchai cluster show](/cli/azure/batchai/cluster#az-batchai-cluster-show) | Shows information about a Batch AI cluster. |
| [az group delete](/cli/azure/group#az-group-delete) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).
