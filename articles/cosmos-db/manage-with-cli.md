---
title: Manage Azure Cosmos DB resources using Azure CLI
description: Use Azure CLI to manage your Azure Cosmos DB account, database and containers. 
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/23/2019
ms.author: mjbrown

---
# Manage Azure Cosmos resources using Azure CLI

The following guide describes common commands to automate management of your Azure Cosmos DB accounts, databases and containers using Azure CLI. Reference pages for all Azure Cosmos DB CLI commands are available in the [Azure CLI Reference](https://docs.microsoft.com/cli/azure/cosmosdb). You can also find more examples in [Azure CLI samples for Azure Cosmos DB](cli-samples.md), including how to create and manage Cosmos DB accounts, databases and containers for MongoDB, Gremlin, Cassandra and Table API.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this topic requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Create an Azure Cosmos DB account

To create an Azure Cosmos DB account with SQL API, Session consistency in East US and West US regions, run the following command:

```azurecli-interactive
az cosmosdb create \
   --name mycosmosdbaccount \
   --resource-group myResourceGroup \
   --kind GlobalDocumentDB \
   --default-consistency-level Session \
   --locations regionName=EastUS failoverPriority=0 isZoneRedundant=False \
   --locations regionName=WestUS failoverPriority=1 isZoneRedundant=False \
   --enable-multiple-write-locations false
```

> [!IMPORTANT]
> The Azure Cosmos account name must be lowercase.

## Create a database

To create a Cosmos DB database, run the following command:

```azurecli-interactive
az cosmosdb database create \
   --name mycosmosdbaccount \
   --db-name myDatabase \
   --resource-group myResourceGroup
```

## Create a container

To create a Cosmos DB container with RU/s of 400 and a partition key, run the following command:

```azurecli-interactive
# Create a container
az cosmosdb collection create \
   --collection-name myContainer \
   --name mycosmosdbaccount \
   --db-name myDatabase \
   --resource-group myResourceGroup \
   --partition-key-path /myPartitionKey \
   --throughput 400
```

## Change the throughput of a container

To change the throughput of a Cosmos DB container to 1000 RU/s, run the following command:

```azurecli-interactive
# Update container throughput
az cosmosdb collection update \
   --collection-name myContainer \
   --name mycosmosdbaccount \
   --db-name myDatabase \
   --resource-group myResourceGroup \
   --throughput 1000
```

## List account keys

To get the keys for your Cosmos account, run the following command:

```azurecli-interactive
# List account keys
az cosmosdb keys list \
   --name  mycosmosdbaccount \
   --resource-group myResourceGroup
```

## List connection strings

To get the connection strings for your Cosmos account, run the following command:

```azurecli-interactive
# List connection strings
az cosmosdb list-connection-strings \
   --name mycosmosdbaccount \
   --resource-group myResourceGroup
```

## Regenerate account key

To regenerate a new primary key for your Cosmos account, run the following command:

```azurecli-interactive
# Regenerate account key
az cosmosdb regenerate-key \
   --name mycosmosdbaccount \
   --resource-group myResourceGroup \
   --key-kind primary
```

## Next steps

For more information on the Azure CLI, see:

- [Install Azure CLI](/cli/azure/install-azure-cli)
- [Azure CLI Reference](https://docs.microsoft.com/cli/azure/cosmosdb)
- [Additional Azure CLI samples for Azure Cosmos DB](cli-samples.md)
