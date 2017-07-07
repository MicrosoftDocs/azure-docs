---
title: Partitioning and scaling in Azure Cosmos DB | Microsoft Docs
description: Learn about how partitioning works in Azure Cosmos DB, how to configure partitioning and partition keys, and how to pick the right partition key for your application.
services: cosmos-db
author: arramac
manager: jhubbard
editor: monicar
documentationcenter: ''

ms.assetid: 702c39b4-1798-48dd-9993-4493a2f6df9e
ms.service: cosmos-db
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/24/2017
ms.author: arramac
ms.custom: H1Hack27Feb2017

---
# Partitioning in Azure Cosmos DB using the DocumentDB API

[Microsoft Azure Cosmos DB](../cosmos-db/introduction.md) is a global distributed, multi-model database service designed to help you achieve fast, predictable performance and scale seamlessly along with your application as it grows. 

This article provides an overview of how to work with partitioning of Cosmos DB containers with the DocumentDB API. See [partitioning and horizontal scaling](../cosmos-db/partition-data.md) for an overview of concepts and best practices for partitioning with any Azure Cosmos DB API. 

To get started with code, download the project from [Github](https://github.com/Azure/azure-documentdb-dotnet/tree/a2d61ddb53f8ab2a23d3ce323c77afcf5a608f52/samples/documentdb-benchmark). 

After reading this article, you will be able to answer the following questions:   

* How does partitioning work in Azure Cosmos DB?
* How do I configure partitioning in Azure Cosmos DB
* What are partition keys, and how do I pick the right partition key for my application?

To get started with code, download the project from [Azure Cosmos DB Performance Testing Driver Sample](https://github.com/Azure/azure-documentdb-dotnet/tree/a2d61ddb53f8ab2a23d3ce323c77afcf5a608f52/samples/documentdb-benchmark). 

<!-- placeholder until we have a permanent solution-->
<a name="partition-keys"></a>
<a name="single-partition-and-partitioned-collections"></a>
<a name="migrating-from-single-partition"></a>
## Partition keys
In the DocumentDB API, you specify the partition key definition in the form of a JSON path. The following table shows examples of partition key definitions and the values corresponding to each. The partition key is specified as a path, e.g. `/department` represents the property department. 

<table border="0" cellspacing="0" cellpadding="0">
    <tbody>
        <tr>
            <td valign="top"><p><strong>Partition Key</strong></p></td>
            <td valign="top"><p><strong>Description</strong></p></td>
        </tr>
        <tr>
            <td valign="top"><p>/department</p></td>
            <td valign="top"><p>Corresponds to the value of doc.department where doc is the item.</p></td>
        </tr>
        <tr>
            <td valign="top"><p>/properties/name</p></td>
            <td valign="top"><p>Corresponds to the value of doc.properties.name where doc is the item (nested property).</p></td>
        </tr>
        <tr>
            <td valign="top"><p>/id</p></td>
            <td valign="top"><p>Corresponds to the value of doc.id (id and partition key are the same property).</p></td>
        </tr>
        <tr>
            <td valign="top"><p>/"department name"</p></td>
            <td valign="top"><p>Corresponds to the value of doc["department name"] where doc is the item.</p></td>
        </tr>
    </tbody>
</table>

> [!NOTE]
> The syntax for partition key is similar to the path specification for indexing policy paths with the key difference that the path corresponds to the property instead of the value, i.e. there is no wild card at the end. For example, you would specify /department/? to index the values under department, but specify /department as the partition key definition. The partition key is implicitly indexed and cannot be excluded from indexing using indexing policy overrides.
> 
> 

Let's look at how the choice of partition key impacts the performance of your application.

## Working with the DocumentDB SDKs
Azure Cosmos DB added support for automatic partitioning with [REST API version 2015-12-16](/rest/api/documentdb/). In order to create partitioned containers, you must download SDK versions 1.6.0 or newer in one of the supported SDK platforms (.NET, Node.js, Java, Python, MongoDB). 

### Creating containers
The following sample shows a .NET snippet to create a container to store device telemetry data of 20,000 request units per second of throughput. The SDK sets the OfferThroughput value (which in turn sets the `x-ms-offer-throughput` request header in the REST API). Here we set the `/deviceId` as the partition key. The choice of partition key is saved along with the rest of the container metadata like name and indexing policy.

For this sample, we picked `deviceId` since we know that (a) since there are a large number of devices, writes can be distributed across partitions evenly and allowing us to scale the database to ingest massive volumes of data and (b) many of the requests like fetching the latest reading for a device are scoped to a single deviceId and can be retrieved from a single partition.

```csharp
DocumentClient client = new DocumentClient(new Uri(endpoint), authKey);
await client.CreateDatabaseAsync(new Database { Id = "db" });

// Container for device telemetry. Here the property deviceId will be used as the partition key to 
// spread across partitions. Configured for 10K RU/s throughput and an indexing policy that supports 
// sorting against any number or string property.
DocumentCollection myCollection = new DocumentCollection();
myCollection.Id = "coll";
myCollection.PartitionKey.Paths.Add("/deviceId");

await client.CreateDocumentCollectionAsync(
    UriFactory.CreateDatabaseUri("db"),
    myCollection,
    new RequestOptions { OfferThroughput = 20000 });
```

This method makes a REST API call to Cosmos DB, and the service will provision a number of partitions based on the requested throughput. You can change the throughput of a container as your performance needs evolve. 

### Reading and writing items
Now, let's insert data into Cosmos DB. Here's a sample class containing a device reading, and a call to CreateDocumentAsync to insert a new device reading into a container. This is an example leveraging the DocumentDB API:

```csharp
public class DeviceReading
{
    [JsonProperty("id")]
    public string Id;

    [JsonProperty("deviceId")]
    public string DeviceId;

    [JsonConverter(typeof(IsoDateTimeConverter))]
    [JsonProperty("readingTime")]
    public DateTime ReadingTime;

    [JsonProperty("metricType")]
    public string MetricType;

    [JsonProperty("unit")]
    public string Unit;

    [JsonProperty("metricValue")]
    public double MetricValue;
  }

// Create a document. Here the partition key is extracted as "XMS-0001" based on the collection definition
await client.CreateDocumentAsync(
    UriFactory.CreateDocumentCollectionUri("db", "coll"),
    new DeviceReading
    {
        Id = "XMS-001-FE24C",
        DeviceId = "XMS-0001",
        MetricType = "Temperature",
        MetricValue = 105.00,
        Unit = "Fahrenheit",
        ReadingTime = DateTime.UtcNow
    });
```

Let's read the item by its partition key and id, update it, and then as a final step, delete it by partition key and id. Note that the reads include a PartitionKey value (corresponding to the `x-ms-documentdb-partitionkey` request header in the REST API).

```csharp
// Read document. Needs the partition key and the ID to be specified
Document result = await client.ReadDocumentAsync(
  UriFactory.CreateDocumentUri("db", "coll", "XMS-001-FE24C"), 
  new RequestOptions { PartitionKey = new PartitionKey("XMS-0001") });

DeviceReading reading = (DeviceReading)(dynamic)result;

// Update the document. Partition key is not required, again extracted from the document
reading.MetricValue = 104;
reading.ReadingTime = DateTime.UtcNow;

await client.ReplaceDocumentAsync(
  UriFactory.CreateDocumentUri("db", "coll", "XMS-001-FE24C"), 
  reading);

// Delete document. Needs partition key
await client.DeleteDocumentAsync(
  UriFactory.CreateDocumentUri("db", "coll", "XMS-001-FE24C"), 
  new RequestOptions { PartitionKey = new PartitionKey("XMS-0001") });
```

### Querying partitioned containers
When you query data in partitioned containers, Cosmos DB automatically routes the query to the partitions corresponding to the partition key values specified in the filter (if there are any). For example, this query is routed to just the partition containing the partition key "XMS-0001".

```csharp
// Query using partition key
IQueryable<DeviceReading> query = client.CreateDocumentQuery<DeviceReading>(
    UriFactory.CreateDocumentCollectionUri("db", "coll"))
    .Where(m => m.MetricType == "Temperature" && m.DeviceId == "XMS-0001");
```
    
The following query does not have a filter on the partition key (DeviceId) and is fanned out to all partitions where it is executed against the partition's index. Note that you have to specify the EnableCrossPartitionQuery (`x-ms-documentdb-query-enablecrosspartition` in the REST API) to have the SDK to execute a query across partitions.

```csharp
// Query across partition keys
IQueryable<DeviceReading> crossPartitionQuery = client.CreateDocumentQuery<DeviceReading>(
    UriFactory.CreateDocumentCollectionUri("db", "coll"), 
    new FeedOptions { EnableCrossPartitionQuery = true })
    .Where(m => m.MetricType == "Temperature" && m.MetricValue > 100);
```

Cosmos DB supports [aggregate functions](documentdb-sql-query.md#Aggregates) `COUNT`, `MIN`, `MAX`, `SUM` and `AVG` over partitioned containers using SQL starting with SDKs 1.12.0 and above. Queries must include a single aggregate operator, and must include a single value in the projection.

### Parallel query execution
The Cosmos DB SDKs 1.9.0 and above support parallel query execution options, which allow you to perform low latency queries against partitioned collections, even when they need to touch a large number of partitions. For example, the following query is configured to run in parallel across partitions.

```csharp
// Cross-partition Order By Queries
IQueryable<DeviceReading> crossPartitionQuery = client.CreateDocumentQuery<DeviceReading>(
    UriFactory.CreateDocumentCollectionUri("db", "coll"), 
    new FeedOptions { EnableCrossPartitionQuery = true, MaxDegreeOfParallelism = 10, MaxBufferedItemCount = 100})
    .Where(m => m.MetricType == "Temperature" && m.MetricValue > 100)
    .OrderBy(m => m.MetricValue);
```
    
You can manage parallel query execution by tuning the following parameters:

* By setting `MaxDegreeOfParallelism`, you can control the degree of parallelism i.e., the maximum number of simultaneous network connections to the container's partitions. If you set this to -1, the degree of parallelism is managed by the SDK. If the `MaxDegreeOfParallelism` is not specified or set to 0, which is the default value, there will be a single network connection to the container's partitions.
* By setting `MaxBufferedItemCount`, you can trade off query latency and client-side memory utilization. If you omit this parameter or set this to -1, the number of items buffered during parallel query execution is managed by the SDK.

Given the same state of the collection, a parallel query will return results in the same order as in serial execution. When performing a cross-partition query that includes sorting (ORDER BY and/or TOP), the DocumentDB SDK issues the query in parallel across partitions and merges partially sorted results in the client side to produce globally ordered results.

### Executing stored procedures
You can also execute atomic transactions against documents with the same device ID, e.g. if you're maintaining aggregates or the latest state of a device in a single item. 

```csharp
await client.ExecuteStoredProcedureAsync<DeviceReading>(
    UriFactory.CreateStoredProcedureUri("db", "coll", "SetLatestStateAcrossReadings"),
    new RequestOptions { PartitionKey = new PartitionKey("XMS-001") }, 
    "XMS-001-FE24C");
```
   
In the next section, we look at how you can move to partitioned containers from single-partition containers.

## Next steps
In this article, we provided an overview of how to work with partitioning of Cosmos DB containers with the DocumentDB API. Also see [partitioning and horizontal scaling](../cosmos-db/partition-data.md) for an overview of concepts and best practices for partitioning with any Azure Cosmos DB API. 

* Perform scale and performance testing with Cosmos DB. See [Performance and Scale Testing with Azure Cosmos DB](performance-testing.md) for a sample.
* Get started coding with the [SDKs](documentdb-sdk-dotnet.md) or the [REST API](/rest/api/documentdb/)
* Learn about [provisioned throughput in Azure Cosmos DB](request-units.md)

