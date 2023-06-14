---
title: Create a function app with connected storage - Azure CLI
description: Azure CLI Script Sample - Create an Azure Function that connects to an Azure Storage
ms.topic: sample
ms.date: 03/24/2022
ms.custom: mvc, devx-track-azurecli
---
# Create a function app with a named Storage account connection

This Azure Functions sample script creates a function app and connects the function to an Azure Storage account. The created app setting that contains the storage connection string can be used with a [storage trigger or binding](../functions-bindings-storage-blob.md).

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/azure-functions/create-function-app-connect-to-storage/create-function-app-connect-to-storage-account.sh" id="FullScript":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az-group-create) | Create a resource group with location. |
| [az storage account create](/cli/azure/storage/account#az-storage-account-create) | Create a storage account. |
| [az functionapp create](/cli/azure/functionapp#az-functionapp-create) | Creates a function app in the serverless [Consumption plan](../consumption-plan.md). |
| [az storage account show-connection-string](/cli/azure/storage/account#az-storage-account-show-connection-string) | Gets the connection string for the account. |
| [az functionapp config appsettings set](/cli/azure/functionapp/config/appsettings#az-functionapp-config-appsettings-set) | Sets the connection string as an app setting in the function app. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional Azure Functions CLI script samples can be found in the [Azure Functions documentation](../functions-cli-samples.md).
