---
title: Provision container throughput in Azure Cosmos DB
description: Learn how to provision throughput at the container level in Azure Cosmos DB
author: markjbrown
ms.service: cosmos-db
ms.topic: sample
ms.date: 11/06/2018
ms.author: mjbrown
---

# Provision throughput on an Azure Cosmos container

This article explains how to provision throughput for a container (collection, graph, or table) in Azure Cosmos DB. You can provision throughput for a single container, or [provision for a database](how-to-provision-database-throughput.md) and share it among the containers within the database. You can provision throughput for a container by using the Azure portal, the Azure CLI, or Azure Cosmos DB SDKs.

## Provision throughput by using Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. [Create a new Azure Cosmos DB account](create-sql-api-dotnet.md#create-a-database-account), or select an existing account.

1. Open the **Data Explorer** pane, and select **New Collection**. Next, provide the following details:

   * Indicate whether you are creating a new database or using an existing one.
   * Enter a collection ID (or table or graph).
   * Enter a partition key value (for example, `/userid`).
   * Enter a throughput (for example, 1000 RUs).
   * Select **OK**.

![Screenshot of Data Explorer, with New Collection highlighted](./media/how-to-provision-container-throughput/provision-container-throughput-portal-all-api.png)

## Provision throughput by using Azure CLI

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

If you are provisioning throughput for an Azure Cosmos DB account configured with the Azure Cosmos DB API for MongoDB, use `/myShardKey` for the partition key path. If you are provisioning throughput for an Azure Cosmos DB account configured for Cassandra API, use `/myPrimaryKey` for the partition key path.

## Provision throughput by using .NET SDK

> [!Note]
> Use the SQL API to provision throughput for all APIs except for Cassandra API.

### <a id="dotnet-most"></a>SQL, MongoDB, Gremlin, and Table APIs

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

### <a id="dotnet-cassandra"></a>Cassandra API

```csharp
// Create a Cassandra table with a partition (primary) key and provision throughput of 1000 RU/s
session.Execute(CREATE TABLE myKeySpace.myTable(
    user_id int PRIMARY KEY,
    firstName text,
    lastName text) WITH cosmosdb_provisioned_throughput=1000);
```

## Next steps

See the following articles to learn about throughput provisioning in Azure Cosmos DB:

* [How to provision throughput for a database](how-to-provision-database-throughput.md)
* [Request units and throughput in Azure Cosmos DB](request-units.md)
