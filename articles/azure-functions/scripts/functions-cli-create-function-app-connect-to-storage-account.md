---
title: Create a function app with connected storage - Azure CLI
description: Azure CLI Script Sample - Create an Azure Function that connects to an Azure Storage
ms.topic: sample
ms.date: 04/20/2017
ms.custom: mvc
---
# Create a function app with a named Storage account connection 

This Azure Functions sample script creates a function app and connects the function to an Azure Storage account. The created app setting that contains the connection can be used with a [storage trigger or binding](../functions-bindings-storage-blob.md). 

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you use the CLI locally, make sure that you are running the Azure CLI version 2.0 or later. To find the version, run `az --version`. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli). 

## Sample script

This sample creates an Azure Function app and adds the storage connection string to an app setting.

[!code-azurecli-interactive[main](../../../cli_scripts/azure-functions/create-function-app-connect-to-storage/create-function-app-connect-to-storage-account.sh "Integrate Function App into Azure Storage Account")]

[!INCLUDE [cli-script-clean-up](../../../includes/cli-script-clean-up.md)]

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az-group-create) | Create a resource group with location. |
| [az storage account create](/cli/azure/storage/account#az-storage-account-create) | Create a storage account. |
| [az functionapp create](/cli/azure/functionapp#az-functionapp-create) | Creates a function app in the serverless [Consumption plan](../functions-scale.md#consumption-plan). |
| [az storage account show-connection-string](/cli/azure/storage/account#az-storage-account-show-connection-string) | Gets the connection string for the account. |
| [az functionapp config appsettings set](/cli/azure/functionapp/config/appsettings#az-functionapp-config-appsettings-set) | Sets the connection string as an app setting in the function app. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional Azure Functions CLI script samples can be found in the [Azure Functions documentation](../functions-cli-samples.md).
