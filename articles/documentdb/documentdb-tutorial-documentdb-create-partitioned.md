---
title: Create a partitioned an Azure Cosmos DB collection | Microsoft Docs
description: Learn how to create an Azure Cosmos DB collection and partition data
services: cosmosdb
documentationcenter: ''
author: mimig1
manager: jhubbard
editor: ''
tags: ''

ms.assetid: 
ms.service: cosmosdb
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: ''
ms.date: 04/30/2017
ms.author: mimig

---

# Create a partitioned Azure Cosmos DB collection

In this tutorial, you'll learn how to create an Azure Cosmos DB account with partitioned collections. By using partitioned collections, your application is prepared to scale effortlessly as your data grows over the 10 GB cap of a single collection. [Partitioned collections](documentdb-partition-data.md) have no size limit. Just like all Azure Cosmos DB data, partitioned collections can be replicated globally, and the throughput can be scaled up and down to provide the performance you need.

In this tutorial, you'll perform the following operations using the [DocumentDB .NET SDK](documentdb-sdk-dotnet.md):

* Connect to your account
* Create a database
* Create a partitioned collection
* Create JSON documents
* Update a document
* Query partitioned collections
* Run stored procedures
* Delete a document
* Delete a database

## What are partitioned collections?

Partitioned collections are configured with a partition key property. A partition key is a property (or path) within your documents that can be used to distribute your data among multiple servers or partitions. All documents with the same partition key will be stored in the same partition. By using a partition key and partitioned collections, Azure Cosmos DB can efficiently index and query your big-data solutions.   

Learn more about partitioning and scaling in, [How to partition and scale in Azure Cosmos DB?](documentdb-partition-data.md)

## Prerequisites
Please make sure you have the following:

* An active Azure account. If you don't have one, you can sign up for a [free account](https://azure.microsoft.com/free/). 
    * Alternatively, you can use the [Azure DocumentDB Emulator](documentdb-nosql-local-emulator.md) for this tutorial.
* [Visual Studio](http://www.visualstudio.com/).

## Create database account

If you already have an account you want to use, you can skip ahead to [Setup yoru Visual Studio solution](#SetupVS). If you are using the DocumentDB Emulator, please follow the steps at [Azure DocumentDB Emulator](documentdb-nosql-local-emulator.md) to setup the emulator and skip ahead to [Setup your Visual Studio Solution](#SetupVS).

[!INCLUDE [documentdb-create-dbaccount](../../includes/documentdb-create-dbaccount.md)]

## <a id="SetupVS"></a>Setup your Visual Studio solution
1. Open **Visual Studio** on your computer.
2. On the **File** menu, select **New**, and then choose **Project**.
3. In the **New Project** dialog, select **Templates** / **Visual C#** / **Console Application**, name your project, and then click **OK**.
   ![Screen shot of the New Project window](./media/documentdb-get-started/nosql-tutorial-new-project-2.png)
4. In the **Solution Explorer**, right click on your new console application, which is under your Visual Studio solution, and then click **Manage NuGet Packages...**
    
    ![Screen shot of the Right Clicked Menu for the Project](./media/documentdb-get-started/nosql-tutorial-manage-nuget-pacakges.png)
5. In the **Nuget** tab, click **Browse**, and type **azure documentdb** in the search box.
6. Within the results, find **Microsoft.Azure.DocumentDB** and click **Install**.
   The package ID for the DocumentDB Client Library is [Microsoft.Azure.DocumentDB](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB).
   ![Screen shot of the Nuget Menu for finding DocumentDB Client SDK](./media/documentdb-get-started/nosql-tutorial-manage-nuget-pacakges-2.png)

    If you get a messages about reviewing changes to the solution, click **OK**. If you get a message about license acceptance, click **I accept**.

## <a id="Connect"></a>Add references to your project
First, add these references to your application.

```csharp
using System.Net;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Newtonsoft.Json;
```

## <a id="add-references"></a>Connect your app to your Azure Cosmos DB account

Add these two constants and your *client* variable in your application.

```csharp
private const string EndpointUrl = "<your endpoint URL>";
private const string PrimaryKey = "<your primary key>";
private DocumentClient client;
```

Next, head back to the [Azure Portal](https://portal.azure.com) to retrieve your endpoint URL and primary key. The endpoint URL and primary key are necessary for your application to understand where to connect to, and for DocumentDB to trust your application's connection.

In the Azure Portal, navigate to your DocumentDB account, and then click **Keys**.

Copy the URI from the portal and paste it into `<your endpoint URL>` in the program.cs file. Then copy the PRIMARY KEY from the portal and paste it into `<your primary key>`.

![Screen shot of the Azure Portal used by the NoSQL tutorial to create a C# console application. Shows a DocumentDB account, with the ACTIVE hub highlighted, the KEYS button highlighted on the DocumentDB account blade, and the URI, PRIMARY KEY and SECONDARY KEY values highlighted on the Keys blade][keys]

## Instantiate the DocumentClient

Create a new instance of the **DocumentClient**.

```csharp
DocumentClient client = new DocumentClient(new Uri(endpoint), authKey);
```

## Create a database

Create an Azure Cosmos DB [database](documentdb-resources.md#databases) by using the [CreateDatabaseAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createdatabaseasync.aspx) method or [CreateDatabaseIfNotExistsAsync](https://msdn.microsoft.com/library/microsoft.azure.documents.client.documentclient.createdatabaseifnotexistsasync.aspx) method of the **DocumentClient** class from the [DocumentDB .NET SDK](documentdb-sdk-dotnet.md). A database is the logical container of JSON document storage partitioned across collections.

```csharp
await client.CreateDatabaseAsync(new Database { Id = "db" });
```

## <a id="CreateColl"></a>Create a partitioned collection
> [!WARNING]
> **CreateDocumentCollectionIfNotExistsAsync** will create a new collection with reserved throughput, which has pricing implications. For more details, please visit our [pricing page](https://azure.microsoft.com/pricing/details/documentdb/).
> 
> 

A [collection](documentdb-resources.md#collections) can be created by using the [CreateDocumentCollectionAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createdocumentcollectionasync.aspx) method or [CreateDocumentCollectionIfNotExistsAsync](https://msdn.microsoft.com/library/microsoft.azure.documents.client.documentclient.createdocumentcollectionifnotexistsasync.aspx) method of the **DocumentClient** class. A collection is a container of JSON documents and associated JavaScript application logic.

```csharp
// Collection for device telemetry. Here the JSON property deviceId will be used as the partition key to 
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

> [!NOTE]
> In order to create partitioned collections using the SDK, you must specify a throughput value equal or greater than 10,100 RU/s. To set a throughput value between 2,500 and 10,000 for partitioned collections you must temporarily use the Azure portal, as these new lower values are not yet available in the SDK.
> 
> 

This method makes a REST API call to DocumentDB, and the service will provision a number of partitions based on the requested throughput. You can change the throughput of a collection as your performance needs evolve.

## <a id="CreateDoc"></a>Create JSON documents
Let's insert some JSON documents into Azure Cosmos DB. A [document](documentdb-resources.md#documents) can be created by using the [CreateDocumentAsync](https://msdn.microsoft.com/library/microsoft.azure.documents.client.documentclient.createdocumentasync.aspx) method of the **DocumentClient** class. Documents are user defined (arbitrary) JSON content. This sample class contains a device reading, and a call to CreateDocumentAsync to insert a new device reading into a collection.

 If you already have data you'd like to store in your database, you can use DocumentDB's [Data Migration tool](documentdb-import-data.md) to import the data into a database.

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
## Read data

Let's read the document by it's partition key and id. Note that the reads include a PartitionKey value (corresponding to the `x-ms-documentdb-partitionkey` request header in the REST API).

```csharp
// Read document. Needs the partition key and the ID to be specified
Document result = await client.ReadDocumentAsync(
  UriFactory.CreateDocumentUri("db", "coll", "XMS-001-FE24C"), 
  new RequestOptions { PartitionKey = new PartitionKey("XMS-0001") });

DeviceReading reading = (DeviceReading)(dynamic)result;
```

## Update data

Now let's update some data.  

```csharp
// Update the document. Partition key is not required, again extracted from the document
reading.MetricValue = 104;
reading.ReadingTime = DateTime.UtcNow;

await client.ReplaceDocumentAsync(
  UriFactory.CreateDocumentUri("db", "coll", "XMS-001-FE24C"), 
  reading);
```

## Delete data

Now lets delete delete a document by partition key and id.

```csharp
// Delete document. Needs partition key
await client.DeleteDocumentAsync(
  UriFactory.CreateDocumentUri("db", "coll", "XMS-001-FE24C"), 
  new RequestOptions { PartitionKey = new PartitionKey("XMS-0001") });
```
## Query partitioned collections

When you query data in partitioned collections, DocumentDB automatically routes the query to the partitions corresponding to the partition key values specified in the filter (if there are any). For example, this query is routed to just the partition containing the partition key "XMS-0001".

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

DocumentDB supports [aggregate functions](documentdb-sql-query.md#Aggregates) `COUNT`, `MIN`, `MAX`, `SUM` and `AVG` over partitioned collections using SQL starting with SDKs 1.12.0 and above. Queries must include a single aggregate operator, and must include a single value in the projection.

## Parallel query execution
The DocumentDB SDKs 1.9.0 and above support parallel query execution options, which allow you to perform low latency queries against partitioned collections, even when they need to touch a large number of partitions. For example, the following query is configured to run in parallel across partitions.

```csharp
// Cross-partition Order By Queries
IQueryable<DeviceReading> crossPartitionQuery = client.CreateDocumentQuery<DeviceReading>(
    UriFactory.CreateDocumentCollectionUri("db", "coll"), 
    new FeedOptions { EnableCrossPartitionQuery = true, MaxDegreeOfParallelism = 10, MaxBufferedItemCount = 100})
    .Where(m => m.MetricType == "Temperature" && m.MetricValue > 100)
    .OrderBy(m => m.MetricValue);
```
    
You can manage parallel query execution by tuning the following parameters:

* By setting `MaxDegreeOfParallelism`, you can control the degree of parallelism i.e., the maximum number of simultaneous network connections to the collection's partitions. If you set this to -1, the degree of parallelism is managed by the SDK. If the `MaxDegreeOfParallelism` is not specified or set to 0, which is the default value, there will be a single network connection to the collection's partitions.
* By setting `MaxBufferedItemCount`, you can trade off query latency and client-side memory utilization. If you omit this parameter or set this to -1, the number of items buffered during parallel query execution is managed by the SDK.

Given the same state of the collection, a parallel query will return results in the same order as in serial execution. When performing a cross-partition query that includes sorting (ORDER BY and/or TOP), the DocumentDB SDK issues the query in parallel across partitions and merges partially sorted results in the client side to produce globally ordered results.

## Execute stored procedures
You can also execute atomic transactions against documents with the same device ID, e.g. if you're maintaining aggregates or the latest state of a device in a single document. 

```csharp
await client.ExecuteStoredProcedureAsync<DeviceReading>(
    UriFactory.CreateStoredProcedureUri("db", "coll", "SetLatestStateAcrossReadings"),
    new RequestOptions { PartitionKey = new PartitionKey("XMS-001") }, 
    "XMS-001-FE24C");
```
    
In the next section, we look at how you can move to partitioned collections from single-partition collections.


## Next steps
* Want a more DocuementDB API tutorials? See [Use .NET (C#) to connect and query data with the DocumentDB API](documentdb-connect-dotnet.md) and [Build a web application with ASP.NET MVC using DocumentDB](documentdb-dotnet-application.md).
* Want to perform scale and performance testing with DocumentDB? See [Performance and Scale Testing with Azure DocumentDB](documentdb-performance-testing.md)
* Learn how to [monitor a DocumentDB account](documentdb-monitor-accounts.md).
* Run queries against our sample dataset in the [Query Playground](https://www.documentdb.com/sql/demo).

[documentdb-create-account]: documentdb-create-account.md
[keys]: media/documentdb-get-started/nosql-tutorial-keys.png
