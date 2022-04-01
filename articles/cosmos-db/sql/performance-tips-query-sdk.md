---
title: Azure Cosmos DB performance tips for queries using the Azure Cosmos DB SDK
description: Learn query configuration options to help improve performance using the Azure Cosmos DB SDK.
author: ealsur
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: how-to
ms.date: 03/31/2022
ms.author: maquaran
ms.devlang:  csharp, java
ms.custom: devx-track-dotnet, devx-track-java
zone_pivot_groups: programming-languages-set-cosmos
---

# Query performance tips for Azure Cosmos DB SDKs
[!INCLUDE[appliesto-sql-api](../includes/appliesto-sql-api.md)]

Azure Cosmos DB is a fast, flexible distributed database that scales seamlessly with guaranteed latency and throughput levels. You don't have to make major architecture changes or write complex code to scale your database with Azure Cosmos DB. Scaling up and down is as easy as making a single API call. To learn more, see [provision container throughput](how-to-provision-container-throughput.md) or [provision database throughput](how-to-provision-database-throughput.md).

::: zone pivot="programming-language-csharp"
Because Azure Cosmos DB is accessed via network calls, you can make client-side optimizations to achieve peak performance when you use the [SQL .NET SDK](sql-api-sdk-dotnet-standard.md).

## Reduce Query Plan calls

To execute a query, a query plan needs to be built. This in general represents a network request to the Azure Cosmos DB Gateway, which adds to the latency of the query operation. There are two ways to remove this request and reduce the latency of the query operation:

### Use local Query Plan generation

The SQL SDK includes a native ServiceInterop.dll to parse and optimize queries locally. ServiceInterop.dll is supported only on the **Windows x64** platform. The following types of applications use 32-bit host processing by default. To change host processing to 64-bit processing, follow these steps, based on the type of your application:

- For executable applications, you can change host processing by setting the [platform target](/visualstudio/ide/how-to-configure-projects-to-target-platforms?preserve-view=true) to **x64**  in the **Project Properties** window, on the **Build** tab.

- For VSTest-based test projects, you can change host processing by selecting **Test** > **Test Settings** > **Default Processor Architecture as X64** on the Visual Studio **Test** menu.

- For locally deployed ASP.NET web applications, you can change host processing by selecting **Use the 64-bit version of IIS Express for web sites and projects** under **Tools** > **Options** > **Projects and Solutions** > **Web Projects**.

- For ASP.NET web applications deployed on Azure, you can change host processing by selecting the **64-bit** platform in **Application settings** in the Azure portal.

> [!NOTE] 
> By default, new Visual Studio projects are set to **Any CPU**. We recommend that you set your project to **x64** so it doesn't switch to **x86**. A project set to **Any CPU** can easily switch to **x86** if an x86-only dependency is added.<br/>
> ServiceInterop.dll needs to be in the folder that the SDK DLL is being executed from. This should be a concern only if you manually copy DLLs or have custom build/deployment systems.

### Use single partition queries

# [V3 .NET SDK](#tab/v3)

For queries that target a Partition Key by setting the [PartitionKey](/dotnet/api/microsoft.azure.cosmos.queryrequestoptions.partitionkey) property in `QueryRequestOptions` and contain no aggregations (including Distinct, DCount, Group By):

```cs
using (FeedIterator<MyItem> feedIterator = container.GetItemQueryIterator<MyItem>(
    "SELECT * FROM c WHERE c.city = 'Seattle'",
    requestOptions: new QueryRequestOptions() { PartitionKey = new PartitionKey("Washington")}))
{
    // ...
}
```

# [V2 .NET SDK](#tab/v2)

For queries that target a Partition Key by setting the [PartitionKey](/dotnet/api/microsoft.azure.documents.client.feedoptions.partitionkey) property in `FeedOptions` and contain no aggregations (including Distinct, DCount, Group By):

```cs
IDocumentQuery<dynamic> query = client.CreateDocumentQuery(
    UriFactory.CreateDocumentCollectionUri(DatabaseName, CollectionName), 
    "SELECT * FROM c WHERE c.city = 'Seattle'", 
    new FeedOptions 
    { 
        PartitionKey = new PartitionKey("Washington")
    }).AsDocumentQuery();
```

---

> [!NOTE]
> Cross-partition queries require the SDK to visit all existing partitions to check for results. The more [physical partitions](../partitioning-overview.md#physical-partitions) the container has, the slowed they can potentially be.

### Avoid recreating the iterator unnecessarily

When all the query results are consumed by the current component, you don't need to re-create the iterator with the continuation for every page. Always prefer to drain the query fully unless the pagination is controlled by another calling component:

# [V3 .NET SDK](#tab/v3)

```cs
using (FeedIterator<MyItem> feedIterator = container.GetItemQueryIterator<MyItem>(
    "SELECT * FROM c WHERE c.city = 'Seattle'",
    requestOptions: new QueryRequestOptions() { PartitionKey = new PartitionKey("Washington")}))
{
    while (feedIterator.HasMoreResults) 
    {
        foreach(MyItem document in await feedIterator.ReadNextAsync())
        {
            // Iterate through documents
        }
    }
}
```

# [V2 .NET SDK](#tab/v2)

```cs
IDocumentQuery<dynamic> query = client.CreateDocumentQuery(
    UriFactory.CreateDocumentCollectionUri(DatabaseName, CollectionName), 
    "SELECT * FROM c WHERE c.city = 'Seattle'", 
    new FeedOptions 
    { 
        PartitionKey = new PartitionKey("Washington")
    }).AsDocumentQuery();
while (query.HasMoreResults) 
{
    foreach(Document document in await queryable.ExecuteNextAsync())
    {
        // Iterate through documents
    }
}
```

---

## Tune the degree of parallelism

# [V3 .NET SDK](#tab/v3)

For queries, tune the [MaxConcurrency](/dotnet/api/microsoft.azure.cosmos.queryrequestoptions.maxconcurrency) property in `QueryRequestOptions` to identify the best configurations for your application, especially if you perform cross-partition queries (without a filter on the partition-key value). `MaxConcurrency` controls the maximum number of parallel tasks, that is, the maximum of partitions to be visited in parallel.

```cs
using (FeedIterator<MyItem> feedIterator = container.GetItemQueryIterator<MyItem>(
    "SELECT * FROM c WHERE c.city = 'Seattle'",
    requestOptions: new QueryRequestOptions() { 
        PartitionKey = new PartitionKey("Washington"),
        MaxConcurrency = -1 }))
{
    // ...
}
```

# [V2 .NET SDK](#tab/v2)

For queries, tune the [MaxDegreeOfParallelism](/dotnet/api/microsoft.azure.documents.client.feedoptions.maxdegreeofparallelism) property in `FeedOptions` to identify the best configurations for your application, especially if you perform cross-partition queries (without a filter on the partition-key value). `MaxDegreeOfParallelism` controls the maximum number of parallel tasks, that is, the maximum of partitions to be visited in parallel.

```cs
IDocumentQuery<dynamic> query = client.CreateDocumentQuery(
    UriFactory.CreateDocumentCollectionUri(DatabaseName, CollectionName), 
    "SELECT * FROM c WHERE c.city = 'Seattle'", 
    new FeedOptions 
    { 
        MaxDegreeOfParallelism = -1, 
        EnableCrossPartitionQuery = true 
    }).AsDocumentQuery();
```

---

Let's assume that
* D = Default Maximum number of parallel tasks (= total number of processors in the client machine)
* P = User-specified maximum number of parallel tasks
* N = Number of partitions that needs to be visited for answering a query

Following are implications of how the parallel queries would behave for different values of P.
* (P == 0) => Serial Mode
* (P == 1) => Maximum of one task
* (P > 1) => Min (P, N) parallel tasks
* (P < 1) => Min (N, D) parallel tasks

## Tune the page size

When you issue a SQL query, the results are returned in a segmented fashion if the result set is too large. By default, results are returned in chunks of 100 items or 1 MB, whichever limit is hit first.

> [!NOTE] 
> The `MaxItemCount` property shouldn't be used just for pagination. Its main use is to improve the performance of queries by reducing the maximum number of items returned in a single page. 

# [V3 .NET SDK](#tab/v3)

You can also set the page size by using the available Azure Cosmos DB SDKs. The [MaxItemCount](/dotnet/api/microsoft.azure.cosmos.queryrequestoptions.maxitemcount) property in `QueryRequestOptions` allows you to set the maximum number of items to be returned in the enumeration operation. When `MaxItemCount` is set to -1, the SDK automatically finds the optimal value, depending on the document size. For example:

```cs
using (FeedIterator<MyItem> feedIterator = container.GetItemQueryIterator<MyItem>(
    "SELECT * FROM c WHERE c.city = 'Seattle'",
    requestOptions: new QueryRequestOptions() { 
        PartitionKey = new PartitionKey("Washington"),
        MaxItemCount = 1000}))
{
    // ...
}
```

# [V2 .NET SDK](#tab/v2)

You can also set the page size by using the available Azure Cosmos DB SDKs. The [MaxItemCount](/dotnet/api/microsoft.azure.documents.client.feedoptions.maxitemcount) property in `FeedOptions` allows you to set the maximum number of items to be returned in the enumeration operation. When `MaxItemCount` is set to -1, the SDK automatically finds the optimal value, depending on the document size. For example:

```csharp
IQueryable<dynamic> authorResults = client.CreateDocumentQuery(
    UriFactory.CreateDocumentCollectionUri(DatabaseName, CollectionName), 
    "SELECT p.Author FROM Pages p WHERE p.Title = 'About Seattle'", 
    new FeedOptions { MaxItemCount = 1000 });
```

---

When a query is executed, the resulting data is sent within a TCP packet. If you specify too low a value for `MaxItemCount`, the number of trips required to send the data within the TCP packet is high, which affects performance. So if you're not sure what value to set for the `MaxItemCount` property, it's best to set it to -1 and let the SDK choose the default value.

## Tune the buffer size

# [V3 .NET SDK](#tab/v3)

Parallel query is designed to pre-fetch results while the current batch of results is being processed by the client. This pre-fetching helps improve the overall latency of a query. The [MaxBufferedItemCount](/dotnet/api/microsoft.azure.cosmos.queryrequestoptions.maxbuffereditemcount) property in `QueryRequestOptions` limits the number of pre-fetched results. Set `MaxBufferedItemCount` to the expected number of results returned (or a higher number) to allow the query to receive the maximum benefit from pre-fetching. If you set this value to -1, the system will automatically determine the number of items to buffer.

```cs
using (FeedIterator<MyItem> feedIterator = container.GetItemQueryIterator<MyItem>(
    "SELECT * FROM c WHERE c.city = 'Seattle'",
    requestOptions: new QueryRequestOptions() { 
        PartitionKey = new PartitionKey("Washington"),
        MaxBufferedItemCount = -1}))
{
    // ...
}
```

# [V2 .NET SDK](#tab/v2)

Parallel query is designed to pre-fetch results while the current batch of results is being processed by the client. This pre-fetching helps improve the overall latency of a query. The [MaxBufferedItemCount](/dotnet/api/microsoft.azure.documents.client.feedoptions.maxbuffereditemcount) property in `FeedOptions` limits the number of pre-fetched results. Set `MaxBufferedItemCount` to the expected number of results returned (or a higher number) to allow the query to receive the maximum benefit from pre-fetching. If you set this value to -1, the system will automatically determine the number of items to buffer.

```csharp
IQueryable<dynamic> authorResults = client.CreateDocumentQuery(
    UriFactory.CreateDocumentCollectionUri(DatabaseName, CollectionName), 
    "SELECT p.Author FROM Pages p WHERE p.Title = 'About Seattle'", 
    new FeedOptions { MaxBufferedItemCount = -1 });
```

---

Pre-fetching works the same way regardless of the degree of parallelism, and there's a single buffer for the data from all partitions.

::: zone-end

## Next steps

To learn more about performance using the .NET SDK:

* [Performance tips for Azure Cosmos DB .NET V3 SDK](performance-tips-dotnet-sdk-v3-sql.md)
* [Performance tips for Azure Cosmos DB .NET V2 SDK](performance-tips.md)

::: zone pivot="programming-language-java"

TBD

::: zone-end