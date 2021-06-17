---
title: Create a function app with Azure Cosmos DB - Azure CLI
description: Azure CLI Script Sample - Create an Azure Function that connects to an Azure Cosmos DB
ms.topic: sample
ms.date: 07/03/2018
ms.custom: mvc, devx-track-azurecli
---
# Create an Azure Function that connects to an Azure Cosmos DB

This Azure Functions sample script creates a function app and connects the function to an Azure Cosmos DB database. The created app setting that contains the connection can be used with an [Azure Cosmos DB trigger or binding](../functions-bindings-cosmosdb.md).

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

 - This tutorial requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed. 

## Sample script

This sample creates an Azure Function app and adds a Cosmos DB endpoint and access key to app settings.

[!code-azurecli-interactive[main](../../../cli_scripts/azure-functions/create-function-app-connect-to-cosmos-db/create-function-app-connect-to-cosmos-db.sh "Create an Azure Function that connects to an Azure Cosmos DB")]

[!INCLUDE [cli-script-clean-up](../../../includes/cli-script-clean-up.md)]

## Script explanation

This script uses the following commands: Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az_group_create) | Create a resource group with location |
| [az storage accounts create](/cli/azure/storage/account#az_storage_account_create) | Create a storage account |
| [az functionapp create](/cli/azure/functionapp#az_functionapp_create) | Creates a function app in the serverless [Consumption plan](../consumption-plan.md). |
| [az cosmosdb create](/cli/azure/cosmosdb#az_cosmosdb_create) | Create an Azure Cosmos DB database. |
| [az cosmosdb show](/cli/azure/cosmosdb#az_cosmosdb_show)| Gets the database account connection. |
| [az cosmosdb list-keys](/cli/azure/cosmosdb#az_cosmosdb_list_keys)| Gets the keys for the database. |
| [az functionapp config appsettings set](/cli/azure/functionapp/config/appsettings#az_functionapp_config_appsettings_set) | Sets the connection string as an app setting in the function app. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional Azure Functions CLI script samples can be found in the [Azure Functions documentation](../functions-cli-samples.md).
