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

# Provision throughput for an Azure Cosmos DB container

This article explains how to provision throughput for a container (collection, graph, table) in Azure Cosmos DB. You can provision throughput for a single container or [provision for a database](how-to-provision-database-throughput.md) and share it among the containers within the database. You can provision throughput for a container by using the Azure portal, Azure CLI, or CosmosDB SDKs.

## Provision throughput using Azure portal

1. Sign in to [Azure portal](https://portal.azure.com/).

1. [Create a new Cosmos DB account](create-sql-api-dotnet.md#create-a-database-account) or select an existing account.

1. Open the **Data Explorer** pane and select **New Collection**. Next fill the form with the following details:

   * Create a new database or use an existing one.
   * Enter a Collection Id (or table, graph).
   * Enter a throughput, for example 1000 RUs.
   * Select **OK**.

![SQL API provision container throughput](./media/how-to-provision-container-throughput/provision-container-throughput-portal-all-api.png)

## Provision throughput using Azure CLI

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

If you are provisioning throughput for MongoDB API account, use '/myShardKey' for the partition key path and when provisioning throughput for Cassandra API account, use '/myPrimaryKey' for the partition key path.

## Provision throughput using .NET SDK

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

See the following articles to learn about throughput provisioning in Cosmos DB:

* [How to provision throughput for a database](how-to-provision-database-throughput.md)
* [Request units and throughput in Azure Cosmos DB](request-units.md)
