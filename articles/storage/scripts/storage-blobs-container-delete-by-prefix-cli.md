---
title: Azure CLI Script Sample - Delete containers by prefix
description: Delete Azure Storage blob containers based on a container name prefix, then clean up the deployment. See help links for commands used in the script sample.
services: storage
author: stevenmatthew
ms.service: azure-storage
ms.devlang: azurecli
ms.topic: sample
ms.date: 03/01/2022
ms.author: shaas 
ms.custom: devx-track-azurecli
---

# Use an Azure CLI script to delete containers based on container name prefix

This script first creates a few sample containers in Azure Blob storage, then deletes some of the containers based on a prefix in the container name.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/storage/delete-containers-by-prefix/delete-containers-by-prefix.sh" id="FullScript":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

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
