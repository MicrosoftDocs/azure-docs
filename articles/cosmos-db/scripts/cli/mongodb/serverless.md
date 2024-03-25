---
title: Create a serverless database and collection for API for MongoDB for Azure Cosmos DB
description: Create a serverless database and collection for API for MongoDB for Azure Cosmos DB
author: seesharprun
ms.author: sidandrews
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.subservice: mongodb
ms.custom: devx-track-azurecli
ms.topic: sample
ms.date: 02/21/2022
---

# Create a serverless database and collection for API for MongoDB for Azure Cosmos DB using Azure CLI

[!INCLUDE[MongoDB](../../../includes/appliesto-mongodb.md)]

The script in this article demonstrates creating a API for MongoDB serverless account database and collection.

[!INCLUDE [quickstarts-free-trial-note](../../../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This article requires version 2.30 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). If using Azure Cloud Shell, the latest version is already installed.

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/cosmosdb/mongodb/serverless.sh" id="FullScript":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az cosmosdb create](/cli/azure/cosmosdb#az-cosmosdb-create) | Creates an Azure Cosmos DB account. |
| [az cosmosdb mongodb database create](/cli/azure/cosmosdb/mongodb/database#az-cosmosdb-mongodb-database-create) | Creates an Azure Cosmos DB MongoDB API database. |
| [az cosmosdb mongodb collection create](/cli/azure/cosmosdb/mongodb/collection#az-cosmosdb-mongodb-collection-create) | Creates an Azure Cosmos DB MongoDB API collection. |
| [az group delete](/cli/azure/resource#az-resource-delete) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure Cosmos DB CLI, see [Azure Cosmos DB CLI documentation](/cli/azure/cosmosdb).
