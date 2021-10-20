---
title: Azure CLI scripts for throughput (RU/s) operations for Azure Cosmos DB API for MongoDB resources
description: Azure CLI scripts for throughput (RU/s) operations for Azure Cosmos DB API for MongoDB resources
author: markjbrown
ms.author: mjbrown
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.topic: sample
ms.date: 10/07/2020
---

# Throughput (RU/s) operations with Azure CLI for a database or graph for Azure Cosmos DB API for MongoDB
[!INCLUDE[appliesto-mongodb-api](../../../includes/appliesto-mongodb-api.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../../../includes/azure-cli-prepare-your-environment.md)]

- This article requires version 2.12.1 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Sample script

This script creates a MongoDB database with shared throughput and collection with dedicated throughput, then updates the throughput for both. The script then migrates from standard to autoscale throughput then reads the value of the autoscale throughput after it has been migrated.

[!code-azurecli-interactive[main](../../../../../cli_scripts/cosmosdb/mongodb/throughput.sh "Throughput operations for Azure Cosmos DB API for MongoDB.")]

## Clean up deployment

After the script sample has been run, the following command can be used to remove the resource group and all resources associated with it.

```azurecli-interactive
az group delete --name $resourceGroupName
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az_group_create) | Creates a resource group in which all resources are stored. |
| [az cosmosdb create](/cli/azure/cosmosdb#az_cosmosdb_create) | Creates an Azure Cosmos DB account. |
| [az cosmosdb mongodb database create](/cli/azure/cosmosdb/mongodb/database#az_cosmosdb_mongodb_database_create) | Creates an Azure Cosmos MongoDB API database. |
| [az cosmosdb mongodb collection create](/cli/azure/cosmosdb/mongodb/collection#az_cosmosdb_mongodb_collection_create) | Creates an Azure Cosmos MongoDB API collection. |
| [az cosmosdb mongodb database throughput update](/cli/azure/cosmosdb/mongodb/database/throughput#az_cosmosdb_mongodb_database_throughput_update) | Update RUs for an Azure Cosmos MongoDB API database. |
| [az cosmosdb mongodb collection throughput update](/cli/azure/cosmosdb/mongodb/collection/throughput#az_cosmosdb_mongodb_collection_throughput_update) | Update RUs for an Azure Cosmos MongoDB API collection. |
| [az cosmosdb mongodb database throughput migrate](/cli/azure/cosmosdb/mongodb/database/throughput#az_cosmosdb_mongodb_database_throughput_migrate) | Migrate throughput for a database. |
| [az cosmosdb mongodb collection throughput migrate](/cli/azure/cosmosdb/mongodb/collection/throughput#az_cosmosdb_mongodb_collection_throughput-migrate) | Migrate throughput for a collection. |
| [az group delete](/cli/azure/resource#az_resource_delete) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure Cosmos DB CLI, see [Azure Cosmos DB CLI documentation](/cli/azure/cosmosdb).

All Azure Cosmos DB CLI script samples can be found in the [Azure Cosmos DB CLI GitHub Repository](https://github.com/Azure-Samples/azure-cli-samples/tree/master/cosmosdb).
