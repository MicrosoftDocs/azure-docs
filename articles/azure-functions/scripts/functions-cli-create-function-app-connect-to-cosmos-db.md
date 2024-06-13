---
title: Create a function app with Azure Cosmos DB - Azure CLI
description: Azure CLI Script Sample - Create an Azure Function that connects to an Azure Cosmos DB
ms.topic: sample
ms.date: 03/24/2022
ms.custom: mvc, devx-track-azurecli
---
# Create an Azure Function that connects to an Azure Cosmos DB

This Azure Functions sample script creates a function app and connects the function to an Azure Cosmos DB database. It makes the connection using an Azure Cosmos DB endpoint and access key that it adds to app settings. The created app setting that contains the connection can be used with an [Azure Cosmos DB trigger or binding](../functions-bindings-cosmosdb.md).

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/azure-functions/create-function-app-connect-to-cosmos-db/create-function-app-connect-to-cosmos-db.sh" id="FullScript":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az-group-create) | Create a resource group with location |
| [az storage accounts create](/cli/azure/storage/account#az-storage-account-create) | Create a storage account |
| [az functionapp create](/cli/azure/functionapp#az-functionapp-create) | Creates a function app in the serverless [Consumption plan](../consumption-plan.md). |
| [az cosmosdb create](/cli/azure/cosmosdb#az-cosmosdb-create) | Create an Azure Cosmos DB database. |
| [az cosmosdb show](/cli/azure/cosmosdb#az-cosmosdb-show)| Gets the database account connection. |
| [az cosmosdb list-keys](/cli/azure/cosmosdb#az-cosmosdb-list-keys)| Gets the keys for the database. |
| [az functionapp config appsettings set](/cli/azure/functionapp/config/appsettings#az-functionapp-config-appsettings-set) | Sets the connection string as an app setting in the function app. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

More Azure Functions CLI script samples can be found in the [Azure Functions documentation](../functions-cli-samples.md).
