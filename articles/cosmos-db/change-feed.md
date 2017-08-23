---
title: Working with the change feed support in Azure Cosmos DB | Microsoft Docs
description: Use Azure Cosmos DB change feed support to track changes in documents and perform event-based processing like triggers and keeping caches and analytics systems up-to-date. 
keywords: change feed
services: cosmos-db
author: arramac
manager: jhubbard
editor: mimig
documentationcenter: ''

ms.assetid: 2d7798db-857f-431a-b10f-3ccbc7d93b50
ms.service: cosmos-db
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: rest-api
ms.topic: article
ms.date: 08/15/2017
ms.author: arramac

---
# Working with the change feed support in Azure Cosmos DB
[Azure Cosmos DB](../cosmos-db/introduction.md) is a fast and flexible globally replicated database service that is used for storing high-volume transactional and operational data with predictable single-digit millisecond latency for reads and writes. This makes it well-suited for IoT, gaming, retail, and operational logging applications. A common design pattern in these applications is to track changes made to Azure Cosmos DB data, and update materialized views, perform real-time analytics, archive data to cold storage, and trigger notifications on certain events based on these changes. The **change feed support** in Azure Cosmos DB enables you to build efficient and scalable solutions for each of these patterns.

With change feed support, Azure Cosmos DB provides a sorted list of documents within an Azure Cosmos DB collection in the order in which they were modified. This feed can be used to listen for modifications to data within the collection and perform actions such as:

* Trigger a call to an API when a document is inserted or modified
* Perform real-time (stream) processing on updates
* Synchronize data with a cache, search engine, or data warehouse

Changes in Azure Cosmos DB are persisted and can be processed asynchronously, and distributed across one or more consumers for parallel processing. Let's look at the APIs for change feed and how you can use them to build scalable real-time applications. This article shows how to work with Azure Cosmos DB change feed and the DocumentDB API. 

![Using Azure Cosmos DB change feed to power real-time analytics and event-driven computing scenarios](./media/change-feed/changefeedoverview.png)

> [!NOTE]
> Change feed support is only provided for the DocumentDB API at this time; the Graph API and Table API are not currently supported.

## Use cases and scenarios
Change feed allows for efficient processing of large datasets with a high volume of writes, and offers an alternative to querying entire datasets to identify what has changed. For example, you can perform the following tasks efficiently:

* Update a cache, search index, or a data warehouse with data stored in Azure Cosmos DB.
* Implement application-level data tiering and archival, that is, store "hot data" in Azure Cosmos DB, and age out "cold data" to [Azure Blob Storage](../storage/common/storage-introduction.md) or [Azure Data Lake Store](../data-lake-store/data-lake-store-overview.md).
* Implement batch analytics on data using [Apache Hadoop](run-hadoop-with-hdinsight.md).
* Implement [lambda pipelines on Azure](https://blogs.technet.microsoft.com/msuspartner/2016/01/27/azure-partner-community-big-data-advanced-analytics-and-lambda-architecture/) with Azure Cosmos DB. Azure Cosmos DB provides a scalable database solution that can handle both ingestion and query, and implement lambda architectures with low TCO. 
* Perform zero down-time migrations to another Azure Cosmos DB account with a different partitioning scheme.

**Lambda Pipelines with Azure Cosmos DB for ingestion and query:**

![Azure Cosmos DB based lambda pipeline for ingestion and query](./media/change-feed/lambda.png)

You can use Azure Cosmos DB to receive and store event data from devices, sensors, infrastructure, and applications, and process these events in real-time with [Azure Stream Analytics](../stream-analytics/stream-analytics-documentdb-output.md), [Apache Storm](../hdinsight/hdinsight-storm-overview.md), or [Apache Spark](../hdinsight/hdinsight-apache-spark-overview.md). 

Within your [serverless](http://azure.com/serverless) web and mobile apps, you can track events such as changes to your customer's profile, preferences, or location to trigger certain actions like sending push notifications to their devices using [Azure Functions](../azure-functions/functions-bindings-documentdb.md) or [App Services](https://azure.microsoft.com/services/app-service/). If you're using Azure Cosmos DB to build a game, you can, for example, use change feed to implement real-time leaderboards based on scores from completed games.

## How change feed works in Azure Cosmos DB
Azure Cosmos DB provides the ability to incrementally read updates made to an Azure Cosmos DB collection. This change feed has the following properties:

* Changes are persistent in Azure Cosmos DB and can be processed asynchronously.
* Changes to documents within a collection are available immediately in the change feed.
* Each change to a document appears exactly once in the change feed, and clients manage their checkpointing logic. The change feed processor library provides automatic checkpointing and "at least once" semantics.
* Only the most recent change for a given document is included in the change log. Intermediate changes may not be available.
* The change feed is sorted by order of modification within each partition key value. There is no guaranteed order across partition-key values.
* Changes can be synchronized from any point-in-time, that is, there is no fixed data retention period for which changes are available.
* Changes are available in chunks of partition key ranges. This capability allows changes from large collections to be processed in parallel by multiple consumers/servers.
* Applications can request for multiple change feeds simultaneously on the same collection.

Azure Cosmos DB's change feed is enabled by default for all accounts. You can use your [provisioned throughput](request-units.md) in your write region or any [read region](distribute-data-globally.md) to read from the change feed, just like any other operation from Azure Cosmos DB. The change feed includes inserts and update operations made to documents within the collection. You can capture deletes by setting a "soft-delete" flag within your documents in place of deletes. Alternatively, you can set a finite expiration period for your documents via the [TTL capability](time-to-live.md), for example, 24 hours and use the value of that property to capture deletes. With this solution, you have to process changes within a shorter time interval than the TTL expiration period. The change feed is available for each partition key range within the document collection, and thus can be distributed across one or more consumers for parallel processing. 

![Distributed processing of Azure Cosmos DB change feed](./media/change-feed/changefeedvisual.png)

You have a few options in how you implement a change feed in your client code. The sections that immediately follow describe how to implement the change feed using the Azure Cosmos DB REST API and the DocumentDB SDKs. However, for .NET applications, we recommend using the new [Change feed processor library](#change-feed-processor) for processing events from the change feed as it simplifies reading changes across partitions and enables multiple threads working in parallel. 

## <a id="rest-apis"></a>Working with the REST API and DocumentDB SDKs
Azure Cosmos DB provides elastic containers of storage and throughput called **collections**. Data within collections is logically grouped using [partition keys](partition-data.md) for scalability and performance. Azure Cosmos DB provides various APIs for accessing this data, including lookup by ID (Read/Get), query, and read-feeds (scans). The change feed can be obtained by populating two new request headers to the DocumentDB `ReadDocumentFeed` API, and can be processed in parallel across ranges of partition keys.

### ReadDocumentFeed API
Let's take a brief look at how ReadDocumentFeed works. Azure Cosmos DB supports reading a feed of documents within a collection via the `ReadDocumentFeed` API. For example, the following request returns a page of documents inside the `serverlogs` collection. 

	GET https://mydocumentdb.documents.azure.com/dbs/smalldb/colls/serverlogs HTTP/1.1
	x-ms-date: Tue, 22 Nov 2016 17:05:14 GMT
	authorization: type%3dmaster%26ver%3d1.0%26sig%3dgo7JEogZDn6ritWhwc5hX%2fNTV4wwM1u9V2Is1H4%2bDRg%3d
	Cache-Control: no-cache
	x-ms-consistency-level: Strong
	User-Agent: Microsoft.Azure.Documents.Client/1.10.27.5
	x-ms-version: 2016-07-11
	Accept: application/json
	Host: mydocumentdb.documents.azure.com

Results can be limited by using the `x-ms-max-item-count` header, and reads can be resumed by resubmitting the request with a `x-ms-continuation` header returned in the previous response. When performed from a single client, `ReadDocumentFeed` iterates through results across partitions serially. 

**Serial read document feed**

You can also retrieve the feed of documents using one of the supported [Azure Cosmos DB SDKs](documentdb-sdk-dotnet.md). For example, the following snippet shows how to use the [ReadDocumentFeedAsync method](/dotnet/api/microsoft.azure.documents.client.documentclient.readdocumentfeedasync?view=azure-dotnet) in .NET.

```csharp
FeedResponse<dynamic> feedResponse = null;
do
{
    feedResponse = await client.ReadDocumentFeedAsync(collection, new FeedOptions { MaxItemCount = -1 });
}
while (feedResponse.ResponseContinuation != null);
```

### Distributed execution of ReadDocumentFeed
For collections that contain terabytes of data or more, or ingest a large volume of updates, serial execution of read feed from a single client machine might not be practical. In order to support these big data scenarios, Azure Cosmos DB provides APIs to distribute `ReadDocumentFeed` calls transparently across multiple client readers/consumers. 

**Distributed Read Document Feed**

To provide scalable processing of incremental changes, Azure Cosmos DB supports a scale-out model for the change feed API based on ranges of partition keys.

* You can obtain a list of partition key ranges for a collection performing a `ReadPartitionKeyRanges` call. 
* For each partition key range, you can perform a `ReadDocumentFeed` to read documents with partition keys within that range.

### Retrieving partition key ranges for a collection
You can retrieve the partition key ranges by requesting the `pkranges` resource within a collection. For example the following request retrieves the list of partition key ranges for the `serverlogs` collection:

	GET https://querydemo.documents.azure.com/dbs/bigdb/colls/serverlogs/pkranges HTTP/1.1
	x-ms-date: Tue, 15 Nov 2016 07:26:51 GMT
	authorization: type%3dmaster%26ver%3d1.0%26sig%3dEConYmRgDExu6q%2bZ8GjfUGOH0AcOx%2behkancw3LsGQ8%3d
	x-ms-consistency-level: Session
	x-ms-version: 2016-07-11
	Accept: application/json
	Host: querydemo.documents.azure.com

This request returns the following response containing metadata about the partition key ranges:

	HTTP/1.1 200 Ok
	Content-Type: application/json
	x-ms-item-count: 25
	x-ms-schemaversion: 1.1
	Date: Tue, 15 Nov 2016 07:26:51 GMT

	{
	   "_rid":"qYcAAPEvJBQ=",
	   "PartitionKeyRanges":[
	      {
	         "_rid":"qYcAAPEvJBQCAAAAAAAAUA==",
	         "id":"0",
	         "_etag":"\"00002800-0000-0000-0000-580ac4ea0000\"",
	         "minInclusive":"",
	         "maxExclusive":"05C1CFFFFFFFF8",
	         "_self":"dbs\/qYcAAA==\/colls\/qYcAAPEvJBQ=\/pkranges\/qYcAAPEvJBQCAAAAAAAAUA==\/",
	         "_ts":1477100776
	      },
	      ...
	   ],
	   "_count": 25
	}


**Partition key range properties**:
Each partition key range includes the metadata properties in the following table:

<table>
	<tr>
		<th>Header name</th>
		<th>Description</th>
	</tr>
	<tr>
		<td>id</td>
		<td>
			<p>The ID for the partition key range. This is a stable and unique ID within each collection.</p>
			<p>Must be used in the following call to read changes by partition key range.</p>
		</td>
	</tr>
	<tr>
		<td>maxExclusive</td>
		<td>The maximum partition key hash value for the partition key range. For internal use.</td>
	</tr>
	<tr>
		<td>minInclusive</td>
		<td>The minimum partition key hash value for the partition key range. For internal use.</td>
	</tr>		
</table>

You can do this using one of the supported [Azure Cosmos DB SDKs](documentdb-sdk-dotnet.md). For example, the following snippet shows how to retrieve partition key ranges in .NET using the [ReadPartitionKeyRangeFeedAsync](/dotnet/api/microsoft.azure.documents.client.documentclient.readpartitionkeyrangefeedasync?view=azure-dotnet) method.

```csharp
string pkRangesResponseContinuation = null;
List<PartitionKeyRange> partitionKeyRanges = new List<PartitionKeyRange>();

do
{
	FeedResponse<PartitionKeyRange> pkRangesResponse = await client.ReadPartitionKeyRangeFeedAsync(
        collectionUri, 
        new FeedOptions { RequestContinuation = pkRangesResponseContinuation });

    partitionKeyRanges.AddRange(pkRangesResponse);
    pkRangesResponseContinuation = pkRangesResponse.ResponseContinuation;
}
while (pkRangesResponseContinuation != null);
```

Azure Cosmos DB supports retrieval of documents per partition key range by setting the optional `x-ms-documentdb-partitionkeyrangeid` header. 

### Performing an incremental ReadDocumentFeed
ReadDocumentFeed supports the following scenarios/tasks for incremental processing of changes in Azure Cosmos DB collections:

* Read all changes to documents from the beginning, that is, from collection creation.
* Read all changes to future updates to documents from current time, or any changes since a user-specified time.
* Read all changes to documents from a logical version of the collection (ETag). You can checkpoint your consumers based on the returned ETag from incremental read-feed requests.

The changes include inserts and updates to documents. To capture deletes, you must use a "soft delete" property within your documents, or use the [built-in TTL property](time-to-live.md) to signal a pending deletion in the change feed.

The following table lists the [request](/rest/api/documentdb/common-documentdb-rest-request-headers.md) and [response headers](/rest/api/documentdb/common-documentdb-rest-response-headers.md) for ReadDocumentFeed operations.

**Request headers for incremental ReadDocumentFeed**:

<table>
	<tr>
		<th>Header name</th>
		<th>Description</th>
	</tr>
	<tr>
		<td>A-IM</td>
		<td>Must be set to "Incremental feed", or omitted otherwise</td>
	</tr>
	<tr>
		<td>If-None-Match</td>
		<td>
			<p>No header: returns all changes from the beginning (collection creation)</p>
			<p>"*": returns all new changes to data within the collection</p>			
			<p>&lt;etag&gt;: If set to a collection ETag, returns all changes made since that logical timestamp</p>
		</td>
	</tr>
	<tr>    
		<td>If-Modified-Since</td> 
		<td>RFC 1123 time format; ignored if If-None-Match is specified</td> 
	</tr> 
	<tr>
		<td>x-ms-documentdb-partitionkeyrangeid</td>
		<td>The partition key range ID for reading data.</td>
	</tr>
</table>

**Response headers for incremental ReadDocumentFeed**:

<table>	<tr>
		<th>Header name</th>
		<th>Description</th>
	</tr>
	<tr>
		<td>etag</td>
		<td>
			<p>The logical sequence number (LSN) of last document returned in the response.</p>
			<p>Incremental ReadDocumentFeed can be resumed by resubmitting this value in If-None-Match.</p>
		</td>
	</tr>
</table>

Here's a sample request to return all incremental changes in collection from the logical version/ETag `28535` and partition key range = `16`:

	GET https://mydocumentdb.documents.azure.com/dbs/bigdb/colls/bigcoll/docs HTTP/1.1
	x-ms-max-item-count: 1
	If-None-Match: "28535"
	A-IM: Incremental feed
	x-ms-documentdb-partitionkeyrangeid: 16
	x-ms-date: Tue, 22 Nov 2016 20:43:01 GMT
	authorization: type%3dmaster%26ver%3d1.0%26sig%3dzdpL2QQ8TCfiNbW%2fEcT88JHNvWeCgDA8gWeRZ%2btfN5o%3d
	x-ms-version: 2016-07-11
	Accept: application/json
	Host: mydocumentdb.documents.azure.com

Changes are ordered by time within each partition key value within the partition key range. There is no guaranteed order across partition-key values. If there are more results than can fit in a single page, you can read the next page of results by resubmitting the request with the `If-None-Match` header with value equal to the `etag` from the previous response. If multiple documents were inserted or updated transactionally within a stored procedure or trigger, they will all be returned within the same response page.

> [!NOTE]
> With change feed, you might get more items returned in a page than specified in `x-ms-max-item-count` in the case of multiple documents inserted or updated inside a stored procedures or triggers. 

When using the .NET SDK (1.17.0), set the field `StartTime` in `ChangeFeedOptions` to directly return changed documents since `StartTime` when calling  `CreateDocumentChangeFeedQuery`. By specifying `If-Modified-Since` using the REST API, your request will return not the documents themselves, but rather the continuation token or `etag` in the response header. To return the documents modified the specified time, the continuation token `etag` must then be used in the next request with `If-None-Match` to return the actual documents. 

The .NET SDK provides the [CreateDocumentChangeFeedQuery](/dotnet/api/microsoft.azure.documents.client.documentclient.createdocumentchangefeedquery?view=azure-dotnet) and [ChangeFeedOptions](/dotnet/api/microsoft.azure.documents.client.changefeedoptions?view=azure-dotnet) helper classes to access changes made to a collection. The following snippet shows how to retrieve all changes from the beginning using the .NET SDK from a single client.

```csharp
private async Task<Dictionary<string, string>> GetChanges(
    DocumentClient client,
    string collection,
    Dictionary<string, string> checkpoints)
{
    string pkRangesResponseContinuation = null;
    List<PartitionKeyRange> partitionKeyRanges = new List<PartitionKeyRange>();

    do
    {
        FeedResponse<PartitionKeyRange> pkRangesResponse = await client.ReadPartitionKeyRangeFeedAsync(
            collectionUri, 
            new FeedOptions { RequestContinuation = pkRangesResponseContinuation });

        partitionKeyRanges.AddRange(pkRangesResponse);
        pkRangesResponseContinuation = pkRangesResponse.ResponseContinuation;
    }
    while (pkRangesResponseContinuation != null);

    foreach (PartitionKeyRange pkRange in partitionKeyRanges)
    {
        string continuation = null;
        checkpoints.TryGetValue(pkRange.Id, out continuation);

        IDocumentQuery<Document> query = client.CreateDocumentChangeFeedQuery(
            collection,
            new ChangeFeedOptions
            {
                PartitionKeyRangeId = pkRange.Id,
                StartFromBeginning = true,
                RequestContinuation = continuation,
                MaxItemCount = 1
            });

        while (query.HasMoreResults)
        {
            FeedResponse<DeviceReading> readChangesResponse = query.ExecuteNextAsync<DeviceReading>().Result;

            foreach (DeviceReading changedDocument in readChangesResponse)
            {
                Console.WriteLine(changedDocument.Id);
            }

            checkpoints[pkRange.Id] = readChangesResponse.ResponseContinuation;
        }
    }

    return checkpoints;
}
```
And the following snippet shows how to process changes in real-time with Azure Cosmos DB by using the change feed support and the preceding function. The first call returns all the documents in the collection, and the second only returns the two documents created that were created since the last checkpoint.

```csharp
// Returns all documents in the collection.
Dictionary<string, string> checkpoints = await GetChanges(client, collection, new Dictionary<string, string>());

await client.CreateDocumentAsync(collection, new DeviceReading { DeviceId = "xsensr-201", MetricType = "Temperature", Unit = "Celsius", MetricValue = 1000 });
await client.CreateDocumentAsync(collection, new DeviceReading { DeviceId = "xsensr-212", MetricType = "Pressure", Unit = "psi", MetricValue = 1000 });

// Returns only the two documents created above.
checkpoints = await GetChanges(client, collection, checkpoints);
```

You can also filter the change feed using client side logic to selectively process events. For example, here's a snippet that uses client side LINQ to process only temperature change events from device sensors.

```csharp
FeedResponse<DeviceReading> readChangesResponse = query.ExecuteNextAsync<DeviceReading>().Result;

foreach (DeviceReading changedDocument in 
    readChangesResponse.AsEnumerable().Where(d => d.MetricType == "Temperature" && d.MetricValue > 1000L))
{
    // trigger an action, like call an API
}
```

## <a id="change-feed-processor"></a>Change Feed Processor library
Another option is to use the [Azure Cosmos DB Change Feed Processor library](https://docs.microsoft.com/azure/cosmos-db/documentdb-sdk-dotnet-changefeed), which can help you easily distribute event processing from a change feed across multiple consumers. The library is great for building change feed readers on the .NET platform. Some workflows that would be simplified by using the Change Feed Processor library over the methods included in the other Cosmos DB SDKs include: 

* Pulling updates from change feed when data is stored across multiple partitions
* Moving or replicating data from one collection to another
* Parallel execution of actions triggered by updates to data and change feed 

While using the APIs in the Cosmos SDKs provides precise access to change feed updates in each partition, using the Change Feed Processor library simplifies reading changes across partitions and multiple threads working in parallel. Instead of manually reading changes from each container and saving a continuation token for each partition, the Change Feed Processor automatically manages reading changes across partitions using a lease mechanism.

The library is available as a NuGet Package: [Microsoft.Azure.Documents.ChangeFeedProcessor](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB.ChangeFeedProcessor/) and from source code as a Github [sample](https://github.com/Azure/azure-documentdb-dotnet/tree/master/samples/ChangeFeedProcessor). 

### Understanding Change Feed Processor library 

There are four main components of implementing the Change Feed Processor: the monitored collection, the lease collection, the processor host, and the consumers. 

**Monitored Collection:**
The monitored collection is the data from which the change feed is generated. Any inserts and changes to the monitored collection are reflected in the change feed of the collection. 

**Lease Collection:**
The lease collection coordinates processing the change feed across multiple workers. A separate collection is used to store the leases with one lease per partition. It is advantageous to store this lease collection on a different account with the write region closer to where the Change Feed Processor is running. A lease object contains the following attributes: 
* Owner: Specifies the host that owns the lease
* Continuation: Specifies the position (continuation token) in the change feed for a particular partition
* Timestamp: Last time lease was updated; the timestamp can be used to check whether the lease is considered expired 

**Processor Host:**
Each host determines how many partitions to process based on how many other instances of hosts have active leases. 
1.	When a host starts up, it acquires leases to balance the workload across all hosts. A host periodically renews leases, so leases remain active. 
2.	A host checkpoints the last continuation token to its lease for each read. To ensure concurrency safety, a host checks the ETag for each lease update. Other checkpoint strategies are also supported.  
3.	Upon shutdown, a host releases all leases but keeps the continuation information, so it can resume reading from the stored checkpoint later. 

At this time the number of hosts cannot be greater than the number of partitions (leases).

**Consumers:**
Consumers, or workers, are threads that perform the change feed processing initiated by each host. Each processor host can have multiple consumers. Each consumer reads the change feed from the partition it is assigned to and notifies its host of changes and expired leases.

To further understand how these four elements of Change Feed Processor work together, let's look at an example in the following diagram. The monitored collection stores documents and uses the "city" as the partition key. We see that the blue partition contains documents with the "city" field from "A-E" and so on. There are two hosts, each with two consumers reading from the four partitions in parallel. The arrows show the consumers reading from a specific spot in the change feed. In the first partition, the darker blue represents unread changes while the light blue represents the already read changes on the change feed. The hosts use the lease collection to store a "continuation" value to keep track of the current reading position for each consumer. 

![Using the Azure Cosmos DB change feed processor host](./media/change-feed/changefeedprocessornew.png)

### Using Change Feed Processor Library 
The following section explains how to use the Change Feed Processor library in the context of replicating changes from a source collection to a destination collection. Here, the source collection is the monitored collection in Change Feed Processor. 

**Install and include the Change Feed Processor NuGet package** 

Before installing Change Feed Processor NuGet Package, first install: 
* Microsoft.Azure.DocumentDB, version 1.13.1 or above 
* Newtonsoft.Json, version 9.0.1 or above
Install `Microsoft.Azure.DocumentDB.ChangeFeedProcessor` and include it as a reference.

**Create a monitored, lease and destination collection** 

In order to use the Change Feed Processor Library, the lease collection needs to be created before running the processor host(s). Again, we recommend storing a lease collection on a different account with a write region closer to where the Change Feed Processor is running. In this data movement example, we need to create the destination collection before running the Change Feed Processor host. In the sample code we call a helper method to create the monitored, leased, and destination collections if they do not already exist. 

> [!WARNING]
> Creating a collection has pricing implications, as you are reserving throughput for the application to communicate with Azure Cosmos DB. For more details, please visit the [pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/)
> 
> 

*Creating a processor host*

The `ChangeFeedProcessorHost` class provides a thread-safe, multi-process, safe runtime environment for event processor implementations that also provides checkpointing and partition lease management. To use the `ChangeFeedProcessorHost` class, you can implement `IChangeFeedObserver`. This interface contains three methods:

* `OpenAsync`: This function is called when change feed observer is opened. It can be modified to perform a specific action when consumer/observer is opened.  
* `CloseAsync`: This function is called when change feed observer is terminated. It can be modified to perform a specific action when consumer/observer is closed.  
* `ProcessChangesAsync`: This function is called when document new changes are available on change feed. It can be modified to perform a specific action upon every change feed update.  

In our example, we implement the interface `IChangeFeedObserver` through the `DocumentFeedObserver` class. Here, the `ProcessChangesAsync` function upserts (updates) a document from change feed into the destination collection. This example is useful for moving data from one collection to another in order to change the partition key of a data set. 

*Running the Processor Host*

Before beginning event processing, both change feed options and change feed host options can be customized. 
```csharp
    // Customizable change feed option and host options 
    ChangeFeedOptions feedOptions = new ChangeFeedOptions();

    // ie customize StartFromBeginning so change feed reads from beginning
    // can customize MaxItemCount, PartitonKeyRangeId, RequestContinuation, SessionToken and StartFromBeginning
    feedOptions.StartFromBeginning = true;

    ChangeFeedHostOptions feedHostOptions = new ChangeFeedHostOptions();

    // ie. customizing lease renewal interval to 15 seconds
    // can customize LeaseRenewInterval, LeaseAcquireInterval, LeaseExpirationInterval, FeedPollDelay 
    feedHostOptions.LeaseRenewInterval = TimeSpan.FromSeconds(15);

```
The specific fields that can be customized are summarized in the following tables. 

**Change Feed Options**:
<table>
	<tr>
		<th>Property Name</th>
		<th>Description</th>
	</tr>
	<tr>
		<td>MaxItemCount</td>
		<td>Gets or sets the maximum number of items to be returned in the enumeration operation in the Azure Cosmos DB database service.</td>
	</tr>
	<tr>
		<td>PartitionKeyRangeId</td>
		<td>Gets or sets the partition key range id for the current request in the Azure Cosmos DB database service.</td>
	</tr>
	<tr>
		<td>RequestContinuation</td>
		<td>Gets or sets the request continuation token in the Azure Cosmos DB database service.</td>
	</tr>
		<tr>
		<td>SessionToken</td>
		<td>Gets or sets the session token for use with session consistency in the Azure Cosmos DB database service.</td>
	</tr>
		<tr>
		<td>StartFromBeginning</td>
		<td>Gets or sets whether change feed in the Azure Cosmos DB database service should start from the beginning (true) or from current (false). By default, it starts from current (false).</td>
	</tr>
</table>

**Change Feed Host Options**:
<table>
	<tr>
		<th>Property Name</th>
		<th>Type</th>
		<th>Description</th>
	</tr>
	<tr>
		<td>LeaseRenewInterval</td>
		<td>TimeSpan</td>
		<td>The interval for all leases for partitions currently held by the ChangeFeedEventHost instance.</td>
	</tr>
	<tr>
		<td>LeaseAcquireInterval</td>
		<td>TimeSpan</td>
		<td>The interval to kick off a task to compute whether partitions are distributed evenly among known host instances.</td>
	</tr>
	<tr>
		<td>LeaseExpirationInterval</td>
		<td>TimeSpan</td>
		<td>The interval for which the lease is taken on a lease representing a partition. If the lease is not renewed within this interval, it is expired and ownership of the partition moves to another ChangeFeedEventHost instance.</td>
	</tr>
	<tr>
		<td>FeedPollDelay</td>
		<td>TimeSpan</td>
		<td>The delay between polling a partition for new changes on the feed, after all current changes are drained.</td>
	</tr>
	<tr>
		<td>CheckpointFrequency</td>
		<td>CheckpointFrequency</td>
		<td>The frequency to checkpoint leases.</td>
	</tr>
	<tr>
		<td>MinPartitionCount</td>
		<td>Int</td>
		<td>The minimum partition count for the host.</td>
	</tr>
	<tr>
		<td>MaxPartitionCount</td>
		<td>Int</td>
		<td>The maximum number of partitions the host can serve.</td>
	</tr>
	<tr>
		<td>DiscardExistingLeases</td>
		<td>Bool</td>
		<td>Whether on the start of the host all existing leases should be deleted and the host should start from scratch.</td>
	</tr>
</table>


To start event processing, instantiate `ChangeFeedProcessorHost`, providing the appropriate parameters for your Azure Cosmos DB collection. Then, call `RegisterObserverAsync` to register your `IChangeFeedObserver` (DocumentFeedObserver in this example) implementation with the runtime. At this point, the host attempts to acquire a lease on every partition key range in the Azure Cosmos DB collection using a "greedy" algorithm. These leases last for a given timeframe and must then be renewed. As new nodes, worker instances, in this case, come online, they place lease reservations and over time the load shifts between nodes as each host attempts to acquire more leases. 

In the sample code, we use a factory class (DocumentFeedObserverFactory.cs) to create an observer and the `RegistObserverFactoryAsync` to register the observer. 

```csharp
using (DocumentClient destClient = new DocumentClient(destCollInfo.Uri, destCollInfo.MasterKey))
	{
		DocumentFeedObserverFactory docObserverFactory = new DocumentFeedObserverFactory(destClient, destCollInfo);
		ChangeFeedEventHost host = new ChangeFeedEventHost(hostName, documentCollectionLocation, leaseCollectionLocation, feedOptions, feedHostOptions);

		await host.RegisterObserverFactoryAsync(docObserverFactory);

		Console.WriteLine("Running... Press enter to stop.");
		Console.ReadLine();

		await host.UnregisterObserversAsync();
	}
```
Over time, an equilibrium is established. This dynamic capability enables CPU-based auto-scaling to be applied to consumers for both scale-up and scale-down. If changes are available in Azure Cosmos DB at a faster rate than consumers can process, the CPU increase on consumers can be used to cause an auto-scale on worker instance count.

## Next steps
* Try the [Azure Cosmos DB Change feed code samples on GitHub](https://github.com/Azure/azure-documentdb-dotnet/tree/master/samples/code-samples/ChangeFeed)
* Get started coding with the [Azure Cosmos DB SDKs](documentdb-sdk-dotnet.md) or the [REST API](/rest/api/documentdb/).
