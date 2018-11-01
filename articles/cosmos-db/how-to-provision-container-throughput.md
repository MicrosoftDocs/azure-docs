---
title: Provision container throughput in Azure Cosmos DB
description: Learn how to provision throughput at the container level in Azure Cosmos DB
services: cosmos-db
author: markjbrown

ms.service: cosmos-db
ms.topic: sample
ms.date: 11/06/2018
ms.author: mjbrown
---

# Provision throughput for a container

This article explains how to provision throughput for a container (collection, graph, table) in Azure Cosmos DB. Throughput can be provisioned for a single container. It can also be [provisioned for a database](how-to-provision-database-throughput.md) and shared among multiple containers within it. Container throughput can be provisioned using the Azure portal, Azure CLI or CosmosDB SDKs.

## Portal

1. Sign in to the Azure portal
2. Select an existing Azure Cosmos DB account
3. Click Data Explorer
4. Click New Collection
5. Create a new database or use an existing one
6. Enter a Collection Id (or table, graph)
7. Enter a throughput
8. Click OK

![SQL API provision container throughput](./media/provision-container-throughput/provision-container-throughput-portal-all-api.png)

## CLI

```azurecli-interactive
# Create a container with a partition key and provision throughput of 1000 RU/s
az cosmosdb collection create \
    --resource-group $resourceGroupName \
    --collection-name $containerName \
    --name $accountName \
    --db-name $databaseName \
    --partition-key-path /myPartitionKey \
    --throughput 1000
```

## .NET

> [!Note]
> Use the SQL API to provision database throughput for all APIs. Throughput provisioning on Cosmos DB is not supported by native 3rd party drivers.

### <a id="dotnet-all"></a>All APIs

```csharp
// Create a container with a partition key and provision throughput of 1000 RU/s
DocumentCollection myCollection = new DocumentCollection();
myCollection.Id = "myContainerName";
myCollection.PartitionKey.Paths.Add("/myPartitionKey");

await client.CreateDocumentCollectionAsync(
    UriFactory.CreateDatabaseUri("myDatabaseName"),
    myCollection,
    new RequestOptions { OfferThroughput = 1000 });
```

## Next steps

See more articles about throughput provisioning in Cosmos DB:

* [How to provision database throughput](how-to-provision-database-throughput.md)
* [Request units and throughput in Azure Cosmos DB](request-units.md)
