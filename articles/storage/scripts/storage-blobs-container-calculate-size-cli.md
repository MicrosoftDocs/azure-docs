---
title: Azure CLI Script Sample - Calculate blob container size
description: Calculate the size of a container in Azure Blob storage by totaling the size of the blobs in the container.
services: storage
author: stevenmatthew
ms.service: azure-storage
ms.devlang: azurecli
ms.topic: sample
ms.date: 03/01/2022
ms.author: shaas 
ms.custom: devx-track-azurecli
---

# Calculate the size of a Blob storage container

This script calculates the size of a container in Azure Blob storage by totaling the size of the blobs in the container.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

> [!IMPORTANT]
> This CLI script provides an estimated size for the container and should not be used for billing calculations.
>
> The maximum number of blobs returned with a single listing call is 5000. If you need to return more than 5000 blobs, use a continuation token to request additional sets of results.

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/storage/calculate-container-size/calculate-container-size.sh" id="FullScript":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following commands to calculate the size of the Blob storage container. Each item in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group) | Creates a resource group in which all resources are stored. |
| [az storage blob upload](/cli/azure/storage/account) | Uploads local files to an Azure Blob storage container. |
| [az storage blob list](/cli/azure/storage/blob#az-storage-blob-list) | Lists the blobs in an Azure Blob storage container. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional storage CLI script samples can be found in the [Azure CLI samples for Azure Blob storage](../blobs/storage-samples-blobs-cli.md).
