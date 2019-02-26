---
title: Manage Azure Cosmos DB resources using Azure CLI
description: Use Azure CLI to manage your Azure Cosmos DB account, database and containers. 
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 10/23/2018
ms.author: mjbrown

---
# Manage Azure Cosmos resources using Azure CLI

The following guide describes commands to automate management of your Azure Cosmos DB accounts, databases and containers using Azure CLI. It also includes commands to scale container throughput. Reference pages for all Azure Cosmos DB CLI commands are available in the [Azure CLI Reference](https://docs.microsoft.com/cli/azure/cosmosdb). You can also find more examples in [Azure CLI samples for Azure Cosmos DB](cli-samples.md), including how to create and manage Cosmos DB accounts, databases and containers for MongoDB, Gremlin, Cassandra and Table API.

This sample CLI script creates an Azure Cosmos DB SQL API account, database, and container.  

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this topic requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Create an Azure Cosmos DB account

To create an Azure Cosmos DB account with SQL API, Session consistency, multi-master enabled in East US and West US, open Azure CLI or cloud shell and run the following command:

```azurecli-interactive
az cosmosdb create \
   –-name "myCosmosDbAccount" \
   --resource-group "myResourceGroup" \
   --kind GlobalDocumentDB \
   --default-consistency-level "Session" \
   --locations "EastUS=0" "WestUS=1" \
   --enable-multiple-write-locations true \
```

## Create a database

To create a Cosmos DB database, open Azure CLI or cloud shell and run the following command:

```azurecli-interactive
az cosmosdb database create \
   --name "myCosmosDbAccount" \
   --db-name "myDatabase" \
   --resource-group "myResourceGroup"
```

## Create a container

To create a Cosmos DB container with RU/s of 1000 and a partition key, open Azure CLI or cloud shell and run the following command:

```azurecli-interactive
# Create a container
az cosmosdb collection create \
   --collection-name "myContainer" \
   --name "myCosmosDbAccount" \
   --db-name "myDatabase" \
   --resource-group "myResourceGroup" \
   --partition-key-path = "/myPartitionKey" \
   --throughput 1000
```

## Change the throughput of a container

To change the throughput of a Cosmos DB container to RU/s of 400, open Azure CLI or cloud shell and run the following command:

```azurecli-interactive
# Update container throughput
az cosmosdb collection update \
   --collection-name "myContainer" \
   --name "myCosmosDbAccount" \
   --db-name "myDatabase" \
   --resource-group "myResourceGroup" \
   --throughput 400
```

## List account keys

When you create an Azure Cosmos DB account, the service generates two master access keys that can be used for authentication when the Azure Cosmos DB account is accessed. By providing two access keys, Azure Cosmos DB enables you to regenerate the keys with no interruption to your Azure Cosmos DB account. Read-only keys for authenticating read-only operations are also available. There are two read-write keys (primary and secondary) and two read-only keys (primary and secondary). You can get the keys for your account by running the following command:

```azurecli-interactive
# List account keys
az cosmosdb list-keys \
   --name "myCosmosDbAccount"\
   --resource-group "myResourceGroup"
```

## List connection strings

The connection string to connect your application to the Cosmos DB account can be retrieved using the following command.

```azurecli-interactive
# List connection strings
az cosmosdb list-connection-strings \
   --name "myCosmosDbAccount"\
   --resource-group "myResourceGroup"
```

## Regenerate account key

You should change the access keys to your Azure Cosmos DB account periodically to help keep your connections more secure. Two access keys are assigned to enable you to maintain connections to the Azure Cosmos DB account using one access key while you regenerate the other access key.

```azurecli-interactive
# Regenerate account key
az cosmosdb regenerate-key \
   --name "myCosmosDbAccount"\
   --resource-group "myResourceGroup" \
   --key-kind primary
```

## Next steps

For more information on the Azure CLI, see:

- [Install Azure CLI](/cli/azure/install-azure-cli)
- [Azure CLI Reference](https://docs.microsoft.com/cli/azure/cosmosdb)
- [Additional Azure CLI samples for Azure Cosmos DB](cli-samples.md)
