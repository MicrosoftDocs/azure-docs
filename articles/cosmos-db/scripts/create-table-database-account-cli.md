---
title: Azure CLI Script-Create an Azure Cosmos DB Table API account, database, and table | Microsoft Docs
description: Azure CLI Script Sample - Create an Azure Cosmos DB Table API account, database, and table
services: cosmos-db
documentationcenter: cosmosdb
author: markjbrown
tags: azure-cli, azure, cosmosdb, table

ms.service: cosmos-db
ms.component: cosmosdb-table
ms.custom: mvc
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: cosmosdb
ms.workload: database
ms.date: 10/26/2018
ms.author: mjbrown
---

# Azure Cosmos DB: Create an Table API account using the Azure CLI

This sample CLI script creates an Azure Cosmos DB Table API account, database, and table.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this topic requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).

## Sample script

Create an Azure Cosmos DB Table API account, database, and table

```azurecli-interactive
#!/bin/bash

# Set variables for the new Table API account, database, and table
resourceGroupName='myResourceGroup'
location='southcentralus'
accountName='myCosmosDbAccount'
databaseName='myDatabase'
tableName='myTable'

# Create a resource group
az group create \
    --name $resourceGroupName \
    --location $location

# Create a Gremlin API Cosmos DB account with multi-master enabled
az cosmosdb create \
    --resource-group $resourceGroupName \
    --name $accountName \
    --capabilities EnableTable \
    --locations "South Central US"=0 "North Central US"=1 \
    --default-consistency-level "Session" \
    --enable-multiple-write-locations true


# Create a database
az cosmosdb database create \
    --resource-group $resourceGroupName \
    --name $accountName \
    --db-name $databaseName

# Create a Table API table
az cosmosdb collection create \
    --resource-group $resourceGroupName \
    --collection-name $tableName \
    --name $accountName \
    --db-name $databaseName \
    --partition-key-path = "/myPartitionKey" \
    --throughput 1000
```

## Clean up deployment

After the script sample has been run, the following command can be used to remove the resource group and all resources associated with it.

```azurecli-interactive
az group delete --name myResourceGroup
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az cosmosdb create](/cli/azure/cosmosdb#az-cosmosdb-create) | Creates an Azure Cosmos DB account. |
| [az group delete](/cli/azure/resource#az-resource-delete) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

Additional Azure Cosmos DB CLI script samples can be found in the [Azure Cosmos DB CLI documentation](../cli-samples.md).
