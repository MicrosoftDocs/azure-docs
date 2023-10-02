---
title: Find request unit charge for a SQL query in Azure Cosmos DB
description: Find the request unit charge for SQL queries against containers created with Azure Cosmos DB, using the Azure portal, .NET, Java, Python, or Node.js. 
author: jcocchi
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.date: 06/02/2022
ms.author: jucocchi
ms.devlang: csharp, java, javascript, python
ms.custom: devx-track-js, kr2b-contr-experiment, ignite-2022, devx-track-dotnet, devx-track-extended-java, devx-track-python
---

# Find the request unit charge for operations in Azure Cosmos DB for NoSQL
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

Azure Cosmos DB supports many APIs, such as SQL, MongoDB, Cassandra, Gremlin, and Table. Each API has its own set of database operations. These operations range from simple point reads and writes to complex queries. Each database operation consumes system resources based on the complexity of the operation.

The cost of all database operations is normalized by Azure Cosmos DB and is expressed by *request units* (RU). *Request charge* is the request units consumed by all your database operations. You can think of RUs as a performance currency abstracting the system resources such as CPU, IOPS, and memory that are required to perform the database operations supported by Azure Cosmos DB. No matter which API you use to interact with your container, costs are always measured in RUs. Whether the database operation is a write, point read, or query, costs are always measured in RUs. To learn more, see [Request Units in Azure Cosmos DB](../request-units.md).

This article presents the different ways that you can find the request unit consumption for any operation run against a container in Azure Cosmos DB for NoSQL. If you're using a different API, see [API for MongoDB](../mongodb/find-request-unit-charge.md), [API for Cassandra](../cassandra/find-request-unit-charge.md), [API for Gremlin](../gremlin/find-request-unit-charge.md), and [API for Table](../table/find-request-unit-charge.md).

Currently, you can measure consumption only by using the Azure portal or by inspecting the response sent from Azure Cosmos DB through one of the SDKs. If you're using the API for NoSQL, you have multiple options for finding the request charge for an operation.

## Use the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. [Create a new Azure Cosmos DB account](quickstart-dotnet.md#create-account) and feed it with data, or select an existing Azure Cosmos DB account that already contains data.

1. Go to the **Data Explorer** pane, and then select the container you want to work on.

1. Select **New SQL Query**.

1. Enter a valid query, and then select **Execute Query**.

1. Select **Query Stats** to display the actual request charge for the request you executed.

   :::image type="content" source="../media/find-request-unit-charge/portal-sql-query.png" alt-text="Screenshot of a SQL query request charge in the Azure portal.":::

## Use the .NET SDK

# [.NET SDK V2](#tab/dotnetv2)

Objects that are returned from the [.NET SDK v2](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB/) expose a `RequestCharge` property:

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

# [.NET SDK V3](#tab/dotnetv3)

Objects that are returned from the [.NET SDK v3](https://www.nuget.org/packages/Microsoft.Azure.Cosmos/) expose a `RequestCharge` property:

[!code-csharp[](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos/tests/Microsoft.Azure.Cosmos.Tests/SampleCodeForDocs/CustomDocsSampleCode.cs?name=GetRequestCharge)]

For more information, see [Quickstart: Build a .NET web app by using a API for NoSQL account in Azure Cosmos DB](quickstart-dotnet.md).

---

## Use the Java SDK

Objects that are returned from the [Java SDK](https://mvnrepository.com/artifact/com.microsoft.azure/azure-cosmosdb) expose a `getRequestCharge()` method:

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

For more information, see [Quickstart: Build a Java application by using an Azure Cosmos DB for NoSQL account](quickstart-java.md).

## Use the Node.js SDK

Objects that are returned from the [Node.js SDK](https://www.npmjs.com/package/@azure/cosmos) expose a `headers` subobject that maps all the headers returned by the underlying HTTP API. The request charge is available under the `x-ms-request-charge` key:

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

For more information, see [Quickstart: Build a Node.js app by using an Azure Cosmos DB for NoSQL account](quickstart-nodejs.md). 

## Use the Python SDK

The `Container` object from the [Python SDK](https://pypi.org/project/azure-cosmos/) exposes a `last_response_headers` dictionary that maps all the headers returned by the underlying HTTP API for the last operation executed. The request charge is available under the `x-ms-request-charge` key:

```python
new_item = {
    "id": "70b63682-b93a-4c77-aad2-65501347265f",
    "partition_key": "61dba35b-4f02-45c5-b648-c6badc0cbd79",
    "name": "Yamba Surfboard"
}
container.create_item(new_item)

request_charge = container.client_connection.last_response_headers["x-ms-request-charge"]
```

```python
existing_item = container.read_item(
    item="70b63682-b93a-4c77-aad2-65501347265f"
    partition_key="61dba35b-4f02-45c5-b648-c6badc0cbd79"
)

request_charge = container.client_connection.last_response_headers["x-ms-request-charge"]
```

For more information, see [Quickstart: Build a Python app by using an Azure Cosmos DB for NoSQL account](quickstart-python.md). 

## Next steps

To learn about optimizing your RU consumption, see these articles:

* [Request Units in Azure Cosmos DB](../request-units.md)
* [Optimize provisioned throughput cost in Azure Cosmos DB](../optimize-cost-throughput.md)
* [Optimize query cost in Azure Cosmos DB](../optimize-cost-reads-writes.md)
* [Globally scale provisioned throughput](../request-units.md)
* [Introduction to provisioned throughput in Azure Cosmos DB](../set-throughput.md)
* [Provision throughput for a container](how-to-provision-container-throughput.md)
* [Monitor and debug with insights in Azure Cosmos DB](../use-metrics.md)
