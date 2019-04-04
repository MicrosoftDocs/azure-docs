---
title: Find the request unit (RU) charge in Azure Cosmos DB
description: Learn how to find the request unit charge for any operation executed against an Azure Cosmos container
author: ThomasWeiss
ms.service: cosmos-db
ms.topic: sample
ms.date: 03/21/2019
ms.author: thweiss
---

# Find the request unit (RU) charge in Azure Cosmos DB

This article presents the different ways to find the [request unit](request-units.md) consumption for any operation executed against an Azure Cosmos container. It's currently possible to measure this consumption either by using the Azure portal or by inspecting the response sent back from Azure Cosmos DB through one of the SDKs.

## Core API

### Use the Azure portal

The Azure portal currently lets you find the request charge for a SQL query only.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. [Create a new Azure Cosmos DB account](create-sql-api-dotnet.md#create-account) and feed it with data, or select an existing account that already contains data.

1. Open the **Data Explorer** pane and select the container that you want to work on.

1. Click on **New SQL Query**.

1. Enter a valid query then click on **Execute Query**.

1. Click on **Query Stats** to display the actual request charge for the request you have just executed.

![Screenshot of SQL query request charge on Azure portal](./media/find-request-unit-charge/portal-sql-query.png)

### Use the .NET SDK V2

Objects returned from the [.NET SDK v2](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB/) (see [this quickstart](create-sql-api-dotnet.md) regarding its usage) expose a `RequestCharge` property.

```csharp
ResourceResponse<Document> fetchDocumentResponse = await client.ReadDocumentAsync(
    UriFactory.CreateDocumentUri("database", "container", "itemId"),
    new RequestOptions
    {
        PartitionKey = new PartitionKey("partitionKey")
    });
var requestCharge = fetchDocumentResponse.RequestCharge;

StoredProcedureResponse<string> storedProcedureCallResponse = await client.ExecuteStoredProcedureAsync<string>(
    UriFactory.CreateStoredProcedureUri("database", "container", "storedProcedureId"),
    new RequestOptions
    {
        PartitionKey = new PartitionKey("partitionKey")
    });
requestCharge = storedProcedureCallResponse.RequestCharge;

IDocumentQuery<dynamic> query = client.CreateDocumentQuery(
    UriFactory.CreateDocumentCollectionUri("database", "container"),
    "SELECT * FROM c",
    new FeedOptions
    {
        PartitionKey = new PartitionKey("partitionKey")
    }).AsDocumentQuery();
while (query.HasMoreResults)
{
    FeedResponse<dynamic> queryResponse = await query.ExecuteNextAsync<dynamic>();
    requestCharge = queryResponse.RequestCharge;
}
```

### Use the Java SDK

Objects returned from the [Java SDK](https://mvnrepository.com/artifact/com.microsoft.azure/azure-cosmosdb) (see [this quickstart](create-sql-api-java.md) regarding its usage) expose a `getRequestCharge()` method.

```java
RequestOptions requestOptions = new RequestOptions();
requestOptions.setPartitionKey(new PartitionKey("partitionKey"));

Observable<ResourceResponse<Document>> readDocumentResponse = client.readDocument(String.format("/dbs/%s/colls/%s/docs/%s", "database", "container", "itemId"), requestOptions);
readDocumentResponse.subscribe(result -> {
    double requestCharge = result.getRequestCharge();
});

Observable<StoredProcedureResponse> storedProcedureResponse = client.executeStoredProcedure(String.format("/dbs/%s/colls/%s/sprocs/%s", "database", "container", "storedProcedureId"), requestOptions, null);
storedProcedureResponse.subscribe(result -> {
    double requestCharge = result.getRequestCharge();
});

FeedOptions feedOptions = new FeedOptions();
feedOptions.setPartitionKey(new PartitionKey("partitionKey"));

Observable<FeedResponse<Document>> feedResponse = client
    .queryDocuments(String.format("/dbs/%s/colls/%s", "database", "container"), "SELECT * FROM c", feedOptions);
feedResponse.forEach(result -> {
    double requestCharge = result.getRequestCharge();
});
```

### Use the Node.js SDK

Objects returned from the [Node.js SDK](https://www.npmjs.com/package/@azure/cosmos) (see [this quickstart](create-sql-api-nodejs.md) regarding its usage) expose a `headers` sub-object that maps all the headers returned by the underlying HTTP API. The request charge is available under the `x-ms-request-charge` key.

```javascript
const item = await client
    .database('database')
    .container('container')
    .item('itemId', 'partitionKey')
    .read();
var requestCharge = item.headers['x-ms-request-charge'];

const storedProcedureResult = await client
    .database('database')
    .container('container')
    .storedProcedure('storedProcedureId')
    .execute({
        partitionKey: 'partitionKey'
    });
requestCharge = storedProcedureResult.headers['x-ms-request-charge'];

const query = client.database('database')
    .container('container')
    .items
    .query('SELECT * FROM c', {
        partitionKey: 'partitionKey'
    });
while (query.hasMoreResults()) {
    var result = await query.executeNext();
    requestCharge = result.headers['x-ms-request-charge'];
}
```

### Use the Python SDK

The `CosmosClient` object from the [Python SDK](https://pypi.org/project/azure-cosmos/) (see [this quickstart](create-sql-api-python.md) regarding its usage) exposes a `last_response_headers` dictionary that maps all the headers returned by the underlying HTTP API for the last operation executed. The request charge is available under the `x-ms-request-charge` key.

```python
response = client.ReadItem('dbs/database/colls/container/docs/itemId', { 'partitionKey': 'partitionKey' })
request_charge = client.last_response_headers['x-ms-request-charge']

response = client.ExecuteStoredProcedure('dbs/database/colls/container/sprocs/storedProcedureId', None, { 'partitionKey': 'partitionKey' })
request_charge = client.last_response_headers['x-ms-request-charge']
```

## Azure Cosmos DB's API for MongoDB

Request unit charge is exposed by a custom [database command](https://docs.mongodb.com/manual/reference/command/) named `getLastRequestStatistics`. This command returns a document containing the name of the last operation executed, its request charge and its duration.

### Use the Azure portal

The Azure portal currently lets you find the request charge for a query only.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. [Create a new Azure Cosmos DB account](create-mongodb-dotnet.md#create-a-database-account) and feed it with data, or select an existing account that already contains data.

1. Open the **Data Explorer** pane and select the collection that you want to work on.

1. Click on **New Query**.

1. Enter a valid query then click on **Execute Query**.

1. Click on **Query Stats** to display the actual request charge for the request you have just executed.

![Screenshot of MongoDB query request charge on Azure portal](./media/find-request-unit-charge/portal-mongodb-query.png)

### Use the MongoDB .NET driver

When using the [official MongoDB .NET driver](https://docs.mongodb.com/ecosystem/drivers/csharp/) (see [this quickstart](create-mongodb-dotnet.md) regarding its usage), commands can be executed by calling the `RunCommand` method on a `IMongoDatabase` object. This method requires an implementation of the `Command<>` abstract class.

```csharp
class GetLastRequestStatisticsCommand : Command<Dictionary<string, object>>
{
    public override RenderedCommand<Dictionary<string, object>> Render(IBsonSerializerRegistry serializerRegistry)
    {
        return new RenderedCommand<Dictionary<string, object>>(new BsonDocument("getLastRequestStatistics", 1), serializerRegistry.GetSerializer<Dictionary<string, object>>());
    }
}

Dictionary<string, object> stats = database.RunCommand(new GetLastRequestStatisticsCommand());
double requestCharge = (double)stats["RequestCharge"];
```

### Use the MongoDB Java driver

When using the [official MongoDB Java driver](http://mongodb.github.io/mongo-java-driver/) (see [this quickstart](create-mongodb-java.md) regarding its usage), commands can be executed by calling the `runCommand` method on a `MongoDatabase` object.

```java
Document stats = database.runCommand(new Document("getLastRequestStatistics", 1));
Double requestCharge = stats.getDouble("RequestCharge");
```

### Use the MongoDB Node.js driver

When using the [official MongoDB Node.js driver](https://mongodb.github.io/node-mongodb-native/) (see [this quickstart](create-mongodb-nodejs.md) regarding its usage), commands can be executed by calling the `command` method on a `Db` object.

```javascript
db.command({ getLastRequestStatistics: 1 }, function(err, result) {
    assert.equal(err, null);
    const requestCharge = result['RequestCharge'];
});
```

## Cassandra API

When performing operations against Azure Cosmos DB's Cassandra API, request unit charge is returned in the incoming payload as a field named `RequestCharge`.

### Use the .NET SDK

When using the [.NET SDK](https://www.nuget.org/packages/CassandraCSharpDriver/) (see [this quickstart](create-cassandra-dotnet.md) regarding its usage), the incoming payload can be retrieved under the `Info` property of a `RowSet` object.

```csharp
RowSet rowSet = session.Execute("SELECT table_name FROM system_schema.tables;");
double requestCharge = BitConverter.ToDouble(rowSet.Info.IncomingPayload["RequestCharge"], 0);
```

### Use the Java SDK

When using the [Java SDK](https://mvnrepository.com/artifact/com.datastax.cassandra/cassandra-driver-core) (see [this quickstart](create-cassandra-java.md) regarding its usage), the incoming payload can be retrieved by calling the `getExecutionInfo()` method on a `ResultSet` object.

```java
ResultSet resultSet = session.execute("SELECT table_name FROM system_schema.tables;");
Double requestCharge = resultSet.getExecutionInfo().getIncomingPayload().get("RequestCharge").getDouble();
```

## Gremlin API

### Use drivers and SDK

Headers returned by the Gremlin API are mapped to custom status attributes which are currently surfaced by the Gremlin .NET and Java SDK. The request charge is available under the `x-ms-request-charge` key.

### Use the .NET SDK

When using the [Gremlin.NET SDK](https://www.nuget.org/packages/Gremlin.Net/) (see [this quickstart](create-graph-dotnet.md) regarding its usage), status attributes are available under the `StatusAttributes` property of the `ResultSet<>` object.

```csharp
ResultSet<dynamic> results = client.SubmitAsync<dynamic>("g.V().count()").Result;
double requestCharge = (double)results.StatusAttributes["x-ms-request-charge"];
```

### Use the Java SDK

When using the [Gremlin Java SDK](https://mvnrepository.com/artifact/org.apache.tinkerpop/gremlin-driver) (see [this quickstart](create-graph-java.md) regarding its usage), status attributes can be retrieved by calling the `statusAttributes()` method on the `ResultSet` object.

```java
ResultSet results = client.submit("g.V().count()");
Double requestCharge = (Double)results.statusAttributes().get().get("x-ms-request-charge");
```

## Table API

The only SDK currently returning request unit charge for table operations is the [.NET Standard SDK](https://www.nuget.org/packages/Microsoft.Azure.Cosmos.Table) (see [this quickstart](create-table-dotnet.md) regarding its usage). The `TableResult` object exposes a `RequestCharge` property that gets populated by the SDK when used against Azure Cosmos DB's Table API.

```csharp
CloudTable tableReference = client.GetTableReference("table");
TableResult tableResult = tableReference.Execute(TableOperation.Insert(new DynamicTableEntity("partitionKey", "rowKey")));
if (tableResult.RequestCharge.HasValue) // would be false when using Azure Storage Tables
{
    double requestCharge = tableResult.RequestCharge.Value;
}
```

## Next steps

See the following articles to learn about optimizing your request unit consumption:

* [Optimize provisioned throughput cost in Azure Cosmos DB](optimize-cost-throughput.md)
* [Optimize query cost in Azure Cosmos DB](optimize-cost-queries.md)