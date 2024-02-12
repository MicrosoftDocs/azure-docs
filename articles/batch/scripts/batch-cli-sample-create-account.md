---
title: Azure CLI Script Example - Create Batch account - Batch service | Microsoft Docs
description: Learn how to create a Batch account in Batch service mode with this Azure CLI script example. This script also shows how to query or update various properties of the account.
ms.topic: sample
ms.date: 05/24/2022
ms.custom: devx-track-azurecli, seo-azure-cli
keywords: batch, azure cli samples, azure cli code samples, azure cli script samples
---

# CLI example: Create a Batch account in Batch service mode

This script creates an Azure Batch account in Batch service mode and shows how to query or update various properties of the account. When you create a Batch account in the default Batch service mode, its compute nodes are assigned internally by the Batch
service. Allocated compute nodes are subject to a separate vCPU (core) quota and the account can be authenticated either via shared key credentials or a Microsoft Entra token.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/batch/create-account/create-account.sh" id="FullScript":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following commands. Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az batch account create](/cli/azure/batch/account#az-batch-account-create) | Creates the Batch account. |
| [az storage account create](/cli/azure/storage/account#az-storage-account-create) | Creates a storage account. |
| [az batch account set](/cli/azure/batch/account#az-batch-account-set) | Updates properties of the Batch account.  |
| [az batch account show](/cli/azure/batch/account#az-batch-account-show) | Retrieves details of the specified Batch account.  |
| [az batch account keys list](/cli/azure/batch/account/keys#az-batch-account-keys-list) | Retrieves the access keys of the specified Batch account.  |
| [az batch account login](/cli/azure/batch/account#az-batch-account-login) | Authenticates against the specified Batch account for further CLI interaction.  |
| [az group delete](/cli/azure/group#az-group-delete) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).
