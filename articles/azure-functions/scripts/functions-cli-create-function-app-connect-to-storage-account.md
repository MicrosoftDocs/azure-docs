---
title: Create a function app with connected storage - Azure CLI
description: Azure CLI Script Sample - Create an Azure Function that connects to an Azure Storage
ms.topic: sample
ms.date: 04/20/2017
ms.custom: mvc, devx-track-azurecli
---
# Create a function app with a named Storage account connection 

This Azure Functions sample script creates a function app and connects the function to an Azure Storage account. The created app setting that contains the connection can be used with a [storage trigger or binding](../functions-bindings-storage-blob.md). 

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

 - This tutorial requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Sample script

This sample creates an Azure Function app and adds the storage connection string to an app setting.

[!code-azurecli-interactive[main](../../../cli_scripts/azure-functions/create-function-app-connect-to-storage/create-function-app-connect-to-storage-account.sh "Integrate Function App into Azure Storage Account")]

[!INCLUDE [cli-script-clean-up](../../../includes/cli-script-clean-up.md)]

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az_group_create) | Create a resource group with location. |
| [az storage account create](/cli/azure/storage/account#az_storage_account_create) | Create a storage account. |
| [az functionapp create](/cli/azure/functionapp#az_functionapp_create) | Creates a function app in the serverless [Consumption plan](../consumption-plan.md). |
| [az storage account show-connection-string](/cli/azure/storage/account#az_storage_account_show_connection_string) | Gets the connection string for the account. |
| [az functionapp config appsettings set](/cli/azure/functionapp/config/appsettings#az_functionapp_config_appsettings_set) | Sets the connection string as an app setting in the function app. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional Azure Functions CLI script samples can be found in the [Azure Functions documentation](../functions-cli-samples.md).
