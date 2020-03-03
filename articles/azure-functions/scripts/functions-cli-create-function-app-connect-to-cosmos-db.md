---
title: Create a function app with Azure Cosmos DB - Azure CLI
description: Azure CLI Script Sample - Create an Azure Function that connects to an Azure Cosmos DB
ms.topic: sample
ms.date: 07/03/2018
ms.custom: mvc
---
# Create an Azure Function that connects to an Azure Cosmos DB

This Azure Functions sample script creates a function app and connects the function to an Azure Cosmos DB database. The created app setting that contains the connection can be used with an [Azure Cosmos DB trigger or binding](../functions-bindings-cosmosdb.md).

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you use the CLI locally, make sure that you are running the Azure CLI version 2.0 or later. To find the version, run `az --version`. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli). 

## Sample script

This sample creates an Azure Function app and adds a Cosmos DB endpoint and access key to app settings.

[!code-azurecli-interactive[main](../../../cli_scripts/azure-functions/create-function-app-connect-to-cosmos-db/create-function-app-connect-to-cosmos-db.sh "Create an Azure Function that connects to an Azure Cosmos DB")]

[!INCLUDE [cli-script-clean-up](../../../includes/cli-script-clean-up.md)]

## Script explanation

This script uses the following commands: Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az-group-create) | Create a resource group with location |
| [az storage accounts create](/cli/azure/storage/account#az-storage-account-create) | Create a storage account |
| [az functionapp create](/cli/azure/functionapp#az-functionapp-create) | Creates a function app in the serverless [Consumption plan](../functions-scale.md#consumption-plan). |
| [az cosmosdb create](/cli/azure/cosmosdb#az-cosmosdb-create) | Create an Azure Cosmos DB database. |
| [az cosmosdb show](/cli/azure/cosmosdb#az-cosmosdb-show)| Gets the database account connection. |
| [az cosmosdb list-keys](/cli/azure/cosmosdb#az-cosmosdb-list-keys)| Gets the keys for the database. |
| [az functionapp config appsettings set](/cli/azure/functionapp/config/appsettings#az-functionapp-config-appsettings-set) | Sets the connection string as an app setting in the function app. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional Azure Functions CLI script samples can be found in the [Azure Functions documentation](../functions-cli-samples.md).




