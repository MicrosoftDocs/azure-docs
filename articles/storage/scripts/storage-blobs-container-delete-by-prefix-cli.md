---
title: Azure CLI Script Sample - Delete containers by prefix | Microsoft Docs
description: Delete Azure Storage blob containers based on a container name prefix.
services: storage
author: tamram

ms.service: storage
ms.subservice: blobs
ms.devlang: cli
ms.topic: sample
ms.date: 06/22/2017
ms.author: tamram
---

# Delete containers based on container name prefix

This script first creates a few sample containers in Azure Blob storage, then deletes some of the containers based on a prefix in the container name.

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/storage/delete-containers-by-prefix/delete-containers-by-prefix.sh?highlight=2-3 "Delete containers by prefix")]

## Clean up deployment

Run the following command to remove the resource group, remaining containers, and all related resources.

```azurecli-interactive
az group delete --name myResourceGroup
```

## Script explanation

This script uses the following commands to delete containers based on container name prefix. Each item in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group) | Creates a resource group in which all resources are stored. |
| [az storage account create](/cli/azure/storage/account) | Creates an Azure Storage account in the specified resource group. |
| [az storage container create](/cli/azure/storage/container) | Creates a container in Azure Blob storage. |
| [az storage container list](/cli/azure/storage/container) | Lists the containers in an Azure Storage account. |
| [az storage container delete](/cli/azure/storage/container) | Deletes containers in an Azure Storage account. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional storage CLI script samples can be found in the [Azure CLI samples for Azure Storage](../blobs/storage-samples-blobs-cli.md).
