---
title: Create a partitioned container in Azure Cosmos DB
description: Learn how to create a partitioned container in Azure Cosmos DB
services: cosmos-db
author: markjbrown

ms.service: cosmos-db
ms.topic: sample
ms.date: 11/06/2018
ms.author: mjbrown
---

# Create partitioned containers

This article explains the different ways to create a partitioned container (collection, table, graph). A partitioned container can be created using the Azure portal, Azure CLI, or supported SDKs. The examples below demonstrate how to create a container, specify the partition key and provision throughput.

## Portal

### <a id="portal-sql"></a>SQL (Core) API

1. Sign in to the Azure portal
2. Select an existing Azure Cosmos DB account
3. Click Data Explorer
4. Click New Collection
5. Create a new database or use an existing one
6. Enter a Collection Id
7. Select Unlimited Storage Capacity
8. Enter a Partition key
9. Enter a throughput
10. Click OK

![SQL API create partitioned collection](./media/create-partitioned-collection/partitioned-collection-create-sql.png)

### <a id="portal-mongodb"></a>MongoDB API

1. Sign in to the Azure portal
2. Select an existing Azure Cosmos DB account
3. Click Data Explorer
4. Click New Collection
5. Create a new database or use an existing one
6. Enter a Collection Id
7. Select Unlimited Storage Capacity
8. Enter a Shard key
9. Enter a throughput
10. Click OK

![MongoDB API create partitioned collection](./media/create-partitioned-collection/partitioned-collection-create-mongodb.png)

### <a id="portal-cassandra"></a>Cassandra API

1. Sign in to the Azure portal
2. Select an existing Azure Cosmos DB account
3. Click Data Explorer
4. Click New Table
5. Create a new Keyspace or use an existing one
6. Enter a table name
7. Enter the properties and specify a PRIMARY KEY
8. Enter a throughput
9. Click OK

![Cassandra API create partitioned collection](./media/create-partitioned-collection/partitioned-collection-create-cassandra.png)

> [!Note]
> For Cassandra API, the primary key is used as the partition key.

### <a id="portal-gremlin"></a>Gremlin API

1. Sign in to the Azure portal
2. Select an existing Azure Cosmos DB account
3. Click Data Explorer
4. Click New Graph
5. Create a new database or use an existing one
6. Enter a Graph id
7. Select Unlimited Storage capacity
8. Enter a Partition key for vertices
9. Enter a throughput
10. Click OK

![Gremlin API create partitioned collection](./media/create-partitioned-collection/partitioned-collection-create-gremlin.png)

### <a id="portal-table"></a>Table API

1. Sign in to the Azure portal
2. Select an existing Azure Cosmos DB account
3. Click Data Explorer
4. Click New Table
5. Enter a Table id
6. Select Unlimited Storage capacity
7. Enter a throughput
8. Click OK

![Table API create partitioned collection](./media/create-partitioned-collection/partitioned-collection-create-table.png)

> [!Note]
> For Table API, the partition key is specified each time you add a new row.

## CLI

### <a id="cli-sql"></a>SQL (Core) API

```azurecli-interactive
# Create a partitioned container with a partition key and 1000 RU/s
az cosmosdb collection create \
    --resource-group $resourceGroupName \
    --collection-name $containerName \
    --name $accountName \
    --db-name $databaseName \
    --partition-key-path /myPartitionKey \
    --throughput 1000
```

### <a id="cli-mongodb"></a>MongoDB API

```azurecli-interactive
# Create a partitioned collection with a shard key and 1000 RU/s
az cosmosdb collection create \
    --resource-group $resourceGroupName \
    --collection-name $collectionName \
    --name $accountName \
    --db-name $databaseName \
    --partition-key-path /myShardKey \
    --throughput 1000
```

### <a id="cli-cassandra"></a>Cassandra API

```azurecli-interactive
# Create a partitioned table with a partition (primary) key and 1000 RU/s
az cosmosdb collection create \
    --resource-group $resourceGroupName \
    --collection-name $tableName \
    --name $accountName \
    --db-name $keyspaceName \
    --partition-key-path /myPrimaryKey \
    --throughput 1000
```

### <a id="cli-gremlin"></a>Gremlin API

```azurecli-interactive
# Create a graph with a partition key and  1000 RU/s
az cosmosdb collection create \
    --resource-group $resourceGroupName \
    --collection-name $graphName \
    --name $accountName \
    --db-name $databaseName \
    --partition-key-path /myPartitionKey \
    --throughput 1000
```

### <a id="cli-table"></a>Table API

```azurecli-interactive
# Create a table with 1000 RU/s
# Note: you don't need to specify partition key as this is set in each row
az cosmosdb collection create \
    --resource-group $resourceGroupName \
    --collection-name $tableName \
    --name $accountName \
    --db-name $databaseName \
    --throughput 1000
```

## .NET

### <a id="dotnet-sql-graph"></a>SQL, Graph API

```csharp
// Create a partitioned container with a partition key and 1000 RU/s
DocumentCollection myCollection = new DocumentCollection();
myCollection.Id = "myContainerName";
myCollection.PartitionKey.Paths.Add("/myPartitionKey");

await client.CreateDocumentCollectionAsync(
    UriFactory.CreateDatabaseUri("myDatabaseName"),
    myCollection,
    new RequestOptions { OfferThroughput = 1000 });
```

### <a id="dotnet-mongodb"></a>MongoDB API

```csharp
// Create a partitioned collection with a partition key in Mongo Shell:
db.runCommand( { shardCollection: "myDatabase.myCollection", key: { myShardKey: "hashed" } } )
```

> [!Note]
> MongoDB does not have a concept of Request Units. To create a new collection with throughput use the Azure Portal or SQL API as shown in the previous example.

### <a id="dotnet-cassandra"></a>Cassandra API

```csharp
// Create a Cassandra table with a partition (primary) key and provision throughput of 1000 RU/s
session.Execute(CREATE TABLE myKeySpace.myTable(
    user_id int PRIMARY KEY,
    firstName text,
    lastName text) WITH cosmosdb_provisioned_throughput=1000);
```

## Next steps

See more articles on partitioning in Cosmos DB:

- [Partitioning in Azure Cosmos DB](partitioning-overview.md)
