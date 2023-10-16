---
title: 'CLI: Connect an app to Azure Cosmos DB'
description: Learn how to use the Azure CLI to automate deployment and management of your App Service app. This sample shows how to connect an app to Azure Cosmos DB.
author: msangapu-msft
tags: azure-service-management

ms.assetid: bbbdbc42-efb5-4b4f-8ba6-c03c9d16a7ea
ms.devlang: azurecli
ms.topic: sample
ms.date: 04/21/2022
ms.author: msangapu
ms.custom: mvc, seodec18, devx-track-azurecli, ignite-2022
---

# Connect an App Service app to Azure Cosmos DB via the Azure CLI

This sample script creates an Azure Cosmos DB account using Azure Cosmos DB for MongoDB and an App Service app. It then links a MongoDB connection string to the web app using app settings.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/app-service/connect-to-documentdb/connect-to-documentdb.sh" id="FullScript":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following commands to create a resource group, App Service app, Azure Cosmos DB, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [`az group create`](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [`az appservice plan create`](/cli/azure/appservice/plan#az-appservice-plan-create) | Creates an App Service plan. |
| [`az webapp create`](/cli/azure/webapp#az-webapp-create) | Creates an App Service app. |
| [`az cosmosdb create`](/cli/azure/cosmosdb#az-cosmosdb-create) | Creates an Azure Cosmos DB account. |
| [`az cosmosdb list-connection-strings`](/cli/azure/cosmosdb#az-cosmosdb-list-connection-strings) | Lists connection strings for the specified Azure Cosmos DB account. |
| [`az webapp config appsettings set`](/cli/azure/webapp/config/appsettings#az-webapp-config-appsettings-set) | Creates or updates an app setting for an App Service app. App settings are exposed as environment variables for your app (see [Environment variables and app settings reference](../reference-app-settings.md)). |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional App Service CLI script samples can be found in the [Azure App Service documentation](../samples-cli.md).
