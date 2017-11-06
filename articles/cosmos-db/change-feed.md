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
ms.devlang: 
ms.topic: article
ms.date: 10/10/2017
ms.author: arramac

---
# Working with the change feed support in Azure Cosmos DB

[Azure Cosmos DB](../cosmos-db/introduction.md) is a fast and flexible globally replicated database, well-suited for IoT, gaming, retail, and operational logging applications. A common design pattern in these applications is to use changes to the data to kick off additional actions. These additional actions could be any of the following: 

* Triggering a notification or a call to an API when a document is inserted or modified.
* Stream processing for IoT or performing analytics.
* Additional data movement by synchronizing with a cache, search engine, or data warehouse, or archiving data to cold storage.

The **change feed support** in Azure Cosmos DB enables you to build efficient and scalable solutions for each of these patterns, as shown in the following image:

![Using Azure Cosmos DB change feed to power real-time analytics and event-driven computing scenarios](./media/change-feed/changefeedoverview.png)

> [!NOTE]
> Change feed support is provided for all data models and containers in Azure Cosmos DB. However, the change feed is read using the DocumentDB client and serializes items into JSON format. Because of the JSON formatting, MongoDB clients will experience a mismatch between BSON formatted documents and the JSON formatted change feed. 

## How does change feed work?

Change feed support in Azure Cosmos DB works by listening to an Azure Cosmos DB collection for any changes. It then outputs the sorted list of documents that were changed in the order in which they were modified. The changes are persisted, can be processed asynchronously and incrementally, and the output can be distributed across one or more consumers for parallel processing. 

You can read the change feed in three different ways, as discussed later in this article:

1.	[Using Azure Functions](#azure-functions)
2.	[Using the Azure Cosmos DB SDK](#rest-apis)
3.	[Using the Azure Cosmos DB Change Feed Processor library](#change-feed-processor)

The change feed is available for each partition key range within the document collection, and thus can be distributed across one or more consumers for parallel processing as shown in the following image.

![Distributed processing of Azure Cosmos DB change feed](./media/change-feed/changefeedvisual.png)

Additional details:
* Change feed is enabled by default for all accounts.
* You can use your [provisioned throughput](request-units.md) in your write region or any [read region](distribute-data-globally.md) to read from the change feed, just like any other Azure Cosmos DB operation.
* The change feed includes inserts and update operations made to documents within the collection. You can capture deletes by setting a "soft-delete" flag within your documents in place of deletes. Alternatively, you can set a finite expiration period for your documents via the [TTL capability](time-to-live.md), for example, 24 hours and use the value of that property to capture deletes. With this solution, you have to process changes within a shorter time interval than the TTL expiration period.
* Each change to a document appears exactly once in the change feed, and clients manage their checkpointing logic. The change feed processor library provides automatic checkpointing and "at least once" semantics.
* Only the most recent change for a given document is included in the change log. Intermediate changes may not be available.
* The change feed is sorted by order of modification within each partition key value. There is no guaranteed order across partition-key values.
* Changes can be synchronized from any point-in-time, that is, there is no fixed data retention period for which changes are available.
* Changes are available in chunks of partition key ranges. This capability allows changes from large collections to be processed in parallel by multiple consumers/servers.
* Applications can request multiple change feeds simultaneously on the same collection.

## Use cases and scenarios

The change feed enables efficient processing of large datasets with a high volume of writes, and offers an alternative to querying an entire dataset to identify what has changed. 

For example, with a change feed, you can perform the following tasks efficiently:

* Update a cache, search index, or a data warehouse with data stored in Azure Cosmos DB.
* Implement application-level data tiering and archival, that is, store "hot data" in Azure Cosmos DB, and age out "cold data" to [Azure Blob Storage](../storage/common/storage-introduction.md) or [Azure Data Lake Store](../data-lake-store/data-lake-store-overview.md).
* Implement batch analytics on data using [Apache Hadoop](run-hadoop-with-hdinsight.md).
* Perform zero down-time migrations to another Azure Cosmos DB account with a different partitioning scheme.
* Implement [lambda pipelines on Azure](https://blogs.technet.microsoft.com/msuspartner/2016/01/27/azure-partner-community-big-data-advanced-analytics-and-lambda-architecture/) with Azure Cosmos DB. Azure Cosmos DB provides a scalable database solution that can handle both ingestion and query, and implement lambda architectures with low TCO. 
* Receive and store event data from devices, sensors, infrastructure, and applications, and process these events in real time with [Azure Stream Analytics](../stream-analytics/stream-analytics-documentdb-output.md), [Apache Storm](../hdinsight/hdinsight-storm-overview.md), or [Apache Spark](../hdinsight/hdinsight-apache-spark-overview.md). 

The following image shows how lambda pipelines that both ingest and query using Azure Cosmos DB can use change feed support: 

![Azure Cosmos DB-based lambda pipeline for ingestion and query](./media/change-feed/lambda.png)

Also, within your [serverless](http://azure.com/serverless) web and mobile apps, you can track events such as changes to your customer's profile, preferences, or location to trigger certain actions like sending push notifications to their devices using [Azure Functions](#azure-functions). If you're using Azure Cosmos DB to build a game, you can, for example, use change feed to implement real-time leaderboards based on scores from completed games.

<a id="azure-functions"></a>
## Using Azure Functions 

If you're using Azure Functions, the simplest way to connect to an Azure Cosmos DB change feed is to add an Azure Cosmos DB trigger to your Azure Functions app. When you create an Azure Cosmos DB trigger in an Azure Functions app, you select the Azure Cosmos DB collection to connect to, and the function is triggered whenever a change to the collection is made. 

Triggers can be created in the Azure Functions portal, in the Azure Cosmos DB portal, or programmatically. For more information, see [Azure Cosmos DB: Serverless database computing using Azure Functions](serverless-computing-database.md).

<a id="rest-apis"></a>
## Using the SDK

The [DocumentDB SDK](documentdb-sdk-dotnet.md) for Azure Cosmos DB gives you all the power to read and manage a change feed. But with great power comes lots of responsibilities, too. If you want to manage checkpoints, deal with document sequence numbers, and have granular control over partition keys, then using the SDK may be the right approach.

This section walks through how to use the DocumentDB SDK to work with a change feed.

1. Start by reading the following resources from appconfig. Instructions on retrieving the endpoint and authorization key are available in [Update your connection string](create-documentdb-dotnet.md#update-your-connection-string).

    ``` csharp
    DocumentClient client;
    string DatabaseName = ConfigurationManager.AppSettings["database"];
    string CollectionName = ConfigurationManager.AppSettings["collection"];
    string endpointUrl = ConfigurationManager.AppSettings["endpoint"];
    string authorizationKey = ConfigurationManager.AppSettings["authKey"];
    ```

2. Create the client as follows:

    ```csharp
    using (client = new DocumentClient(new Uri(endpointUrl), authorizationKey,
    new ConnectionPolicy { ConnectionMode = ConnectionMode.Direct, ConnectionProtocol = Protocol.Tcp }))
    {
    }
    ```

3. Get the partition key ranges:

    ```csharp
    FeedResponse pkRangesResponse = await client.ReadPartitionKeyRangeFeedAsync(
        collectionUri,
        new FeedOptions
            {RequestContinuation = pkRangesResponseContinuation });
     
    partitionKeyRanges.AddRange(pkRangesResponse);
    pkRangesResponseContinuation = pkRangesResponse.ResponseContinuation;
    ```

4. Call ExecuteNextAsync for every partition key range:

    ```csharp
    foreach (PartitionKeyRange pkRange in partitionKeyRanges){
        string continuation = null;
        checkpoints.TryGetValue(pkRange.Id, out continuation);
        IDocumentQuery<Document> query = client.CreateDocumentChangeFeedQuery(
            collectionUri,
            new ChangeFeedOptions
            {
                PartitionKeyRangeId = pkRange.Id,
                StartFromBeginning = true,
                RequestContinuation = continuation,
                MaxItemCount = -1,
                // Set reading time: only show change feed results modified since StartTime
                StartTime = DateTime.Now - TimeSpan.FromSeconds(30)
            });
        while (query.HasMoreResults)
            {
                FeedResponse<dynamic> readChangesResponse = query.ExecuteNextAsync<dynamic>().Result;
    
                foreach (dynamic changedDocument in readChangesResponse)
                    {
                         Console.WriteLine("document: {0}", changedDocument);
                    }
                checkpoints[pkRange.Id] = readChangesResponse.ResponseContinuation;
            }
    }
    ```

If you have multiple readers, you can use **ChangeFeedOptions** to distribute read load to different threads or different clients.

And that's it, with these few lines of code you can start reading the change feed. You can get the complete code used in this article from the [azure-cosmos-db-DocumentFeed GitHub repo](https://github.com/rsarosh/azure-cosmos-db-DocumentFeed).

In the code in step 4 above, the **ResponseContinuation** in the last line has the last logical sequence number (LSN) of the document, which you will use the next time you read new documents after this sequence number. By using the **StartTime** of the **ChangeFeedOption** you can widen your net to get the documents. So, if your **ResponseContinuation** is null, but your **StartTime** goes back in time then you will get all the documents that changed since the **StartTime**. But, if your **ResponseContinuation** has a value then system will get you all the documents since that LSN.

So, your checkpoint array is just keeping the LSN for each partition. But if you don’t want to deal with the partitions, checkpoints, LSN, start time, etc. the simpler option is to use the Change Feed Processor Library.

<a id="change-feed-processor"></a>
## Using the Change Feed Processor library 

The [Azure Cosmos DB Change Feed Processor library](https://docs.microsoft.com/azure/cosmos-db/documentdb-sdk-dotnet-changefeed) can help you easily distribute event processing across multiple consumers. This library simplifies reading changes across partitions and multiple threads working in parallel.

The main benefit of Change Feed Processor library is that you don’t have to manage each partition and continuation token and you don’t have to poll each collection manually.

The Change Feed Processor library simplifies reading changes across partitions and multiple threads working in parallel.  It automatically manages reading changes across partitions using a lease mechanism. As you can see in the following image, if you start two clients that are using the Change Feed Processor library, they divide the work among themselves. As you continue to increase the clients, they keep dividing the work among themselves.

![Distributed processing of Azure Cosmos DB change feed](./media/change-feed/change-feed-output.png)

The left client was started first and it started monitoring all the partitions, then the second client was started, and then the first let go of some of the leases to second client. As you can see this is the nice way to distribute the work between different machines and clients.

Note that if you have two serverless Azure funtions monitoring the same collection and using the same lease then the two functions may get different documents depending upon how the processor library decides to processs the partitions.

### Understanding the Change Feed Processor library

There are four main components of implementing the Change Feed Processor: the monitored collection, the lease collection, the processor host, and the consumers. 

> [!WARNING]
> Creating a collection has pricing implications, as you are reserving throughput for the application to communicate with Azure Cosmos DB. For more details, please visit the [pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/)
> 
> 

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

### Working with the Change Feed Processor library

Before installing Change Feed Processor NuGet package, first install: 

* Microsoft.Azure.DocumentDB, version 1.13.1 or above 
* Newtonsoft.Json, version 9.0.1 or above

Then install the [Microsoft.Azure.DocumentDB.ChangeFeedProcessor Nuget package](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB.ChangeFeedProcessor/) and include it as a reference.

To implement the Change Feed Processor library you have to do following:

1. Implement a **DocumentFeedObserver** object, which implements **IChangeFeedObserver**.

2. Implement a **DocumentFeedObserverFactory**, which implements a **IChangeFeedObserverFactory**.

3. In the **CreateObserver** method of **DocumentFeedObserverFacory**, instantiate the **ChangeFeedObserver** that you created in step 1 and return it.

    ```
    public IChangeFeedObserver CreateObserver()
    {
              DocumentFeedObserver newObserver = new DocumentFeedObserver(this.client, this.collectionInfo);
              return newObserver;
    }
    ```

4. Instantiate **DocumentObserverFactory**.

5. Instantiate a **ChangeFeedEventHost**:

    ```csharp
    ChangeFeedEventHost host = new ChangeFeedEventHost(
                     hostName,
                     documentCollectionLocation,
                     leaseCollectionLocation,
                     feedOptions,
                     feedHostOptions);
    ```

6. Register the **DocumentFeedObserverFactory** with host.

The code for steps 4 through 6 is: 

```
ChangeFeedOptions feedOptions = new ChangeFeedOptions();
feedOptions.StartFromBeginning = true;

ChangeFeedHostOptions feedHostOptions = new ChangeFeedHostOptions();
 
// Customizing lease renewal interval to 15 seconds.
// Can customize LeaseRenewInterval, LeaseAcquireInterval, LeaseExpirationInterval, FeedPollDelay
feedHostOptions.LeaseRenewInterval = TimeSpan.FromSeconds(15);
 
using (DocumentClient destClient = new DocumentClient(destCollInfo.Uri, destCollInfo.MasterKey))
{
        DocumentFeedObserverFactory docObserverFactory = new DocumentFeedObserverFactory(destClient, destCollInfo);
        ChangeFeedEventHost host = new ChangeFeedEventHost(hostName, documentCollectionLocation, leaseCollectionLocation, feedOptions, feedHostOptions);
        await host.RegisterObserverFactoryAsync(docObserverFactory);
        await host.UnregisterObserversAsync();
}
```

That’s it. After these few steps documents will start coming into the **DocumentFeedObserver ProcessChangesAsync** method.

## Next steps

For more information about using Azure Cosmos DB with Azure Functions see [Azure Cosmos DB: Serverless database computing using Azure Functions](serverless-computing-database.md).

For more information on using the Change Feed Processor library, use the following resources:

* [Information page](documentdb-sdk-dotnet-changefeed.md) 
* [Nuget package](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB.ChangeFeedProcessor/)
* [Sample code showing steps 1-6 above](https://github.com/rsarosh/Cosmos-ChangeFeedProcessor)
* [Additional samples on GitHub](https://github.com/Azure/azure-documentdb-dotnet/tree/master/samples/ChangeFeedProcessor)

For more information on using the change feed via the SDK, use the following resources:

* [SDK information page](documentdb-sdk-dotnet.md)
