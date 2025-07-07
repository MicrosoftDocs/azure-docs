---
title: Azure CLI Script Sample - Rotate storage account access keys
description: Create an Azure Storage account, then retrieve and rotate its account access keys.
services: storage
author: stevenmatthew
ms.service: azure-storage
ms.devlang: azurecli
ms.topic: sample
ms.date: 03/02/2022
ms.author: shaas 
ms.custom: devx-track-azurecli
# Customer intent: "As a cloud administrator, I want to create a storage account and rotate its access keys using scripts, so that I can securely manage access credentials and maintain compliance."
---

# Create a storage account and rotate its account access keys

This script creates an Azure Storage account, displays the new storage account's access keys, then renews (rotates) the keys.

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](~/reusable-content/ce-skilling/azure/includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/storage/rotate-storage-account-keys/rotate-storage-account-keys.sh" id="FullScript":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](~/reusable-content/ce-skilling/azure/includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following commands to create the storage account and retrieve and rotate its access keys. Each item in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group) | Creates a resource group in which all resources are stored. |
| [az storage account create](/cli/azure/storage/account) | Creates an Azure Storage account in the specified resource group. |
| [az storage account keys list](/cli/azure/storage/account/keys) | Displays the storage account access keys for the specified account. |
| [az storage account keys renew](/cli/azure/storage/account/keys) | Regenerates the primary or secondary storage account access key. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional storage CLI script samples can be found in the [Azure CLI samples for Azure Blob storage](../blobs/storage-samples-blobs-cli.md).
