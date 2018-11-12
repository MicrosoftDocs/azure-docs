---
title: Working with the change feed support in Azure Cosmos DB 
description: Use Azure Cosmos DB change feed support to track changes in documents and perform event-based processing like triggers and keeping caches and analytics systems up-to-date. 
author: rafats

ms.service: cosmos-db
ms.topic: conceptual
ms.date: 11/06/2018
ms.author: rafats

---
# Change feed in Azure Cosmos DB

Change feed support in Azure Cosmos DB works by listening to an Azure Cosmos DB container for any changes. It then outputs the sorted list of documents that were changed in the order in which they were modified. The changes are persisted, can be processed asynchronously and incrementally, and the output can be distributed across one or more consumers for parallel processing. 

Azure Cosmos DB is well-suited for IoT, gaming, retail, and operational logging applications. A common design pattern in these applications is to use changes to the data to trigger additional actions. Examples of additional actions include:

* Triggering a notification or a call to an API, when an item is inserted or updated.
* Real-time stream processing for IoT or real-time analytics processing on operational data.
* Additional data movement by either synchronizing with a cache or a search engine or a data warehouse or archiving data to cold storage.

The change feed in Azure Cosmos DB enables you to build efficient and scalable solutions for each of these patterns, as shown in the following image:

<<<<<<< HEAD
![Using Azure Cosmos DB change feed to power real-time analytics and event-driven computing scenarios](./media/change-feed/changefeedoverview.png)
=======
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

> [!NOTE]
> Instead of `ChangeFeedOptions.PartitionKeyRangeId`, you can use `ChangeFeedOptions.PartitionKey` to specify a single partition key for which to get a change feed. For example, `PartitionKey = new PartitionKey("D8CFA2FD-486A-4F3E-8EA6-F3AA94E5BD44")`.
> 
>

If you have multiple readers, you can use **ChangeFeedOptions** to distribute read load to different threads or different clients.

And that's it, with these few lines of code you can start reading the change feed. You can get the complete code used in this article from the [GitHub repo](https://github.com/Azure/azure-documentdb-dotnet/tree/master/samples/code-samples/ChangeFeed).

In the code in step 4 above, the **ResponseContinuation** in the last line has the last logical sequence number (LSN) of the document, which you will use the next time you read new documents after this sequence number. By using the **StartTime** of the **ChangeFeedOption** you can widen your net to get the documents. So, if your **ResponseContinuation** is null, but your **StartTime** goes back in time then you will get all the documents that changed since the **StartTime**. But, if your **ResponseContinuation** has a value then system will get you all the documents since that LSN.

So, your checkpoint array is just keeping the LSN for each partition. But if you don’t want to deal with the partitions, checkpoints, LSN, start time, etc. the simpler option is to use the change feed processor library.

<a id="change-feed-processor"></a>
## Using the change feed processor library 

The [Azure Cosmos DB change feed processor library](https://docs.microsoft.com/azure/cosmos-db/sql-api-sdk-dotnet-changefeed) can help you easily distribute event processing across multiple consumers. This library simplifies reading changes across partitions and multiple threads working in parallel.

The main benefit of change feed processor library is that you don’t have to manage each partition and continuation token and you don’t have to poll each collection manually.

The change feed processor library simplifies reading changes across partitions and multiple threads working in parallel.  It automatically manages reading changes across partitions using a lease mechanism. As you can see in the following image, if you start two clients that are using the change feed processor library, they divide the work among themselves. As you continue to increase the clients, they keep dividing the work among themselves.

![Distributed processing of Azure Cosmos DB change feed](./media/change-feed/change-feed-output.png)

The left client was started first and it started monitoring all the partitions, then the second client was started, and then the first let go of some of the leases to second client. As you can see this is the nice way to distribute the work between different machines and clients.

Note that if you have two serverless Azure functions monitoring the same collection and using the same lease then the two functions may get different documents depending upon how the processor library decides to process the partitions.

<a id="understand-cf"></a>
### Understanding the change feed processor library

There are four main components of implementing the change feed processor library: the monitored collection, the lease collection, the processor host, and the consumers. 

> [!WARNING]
> Creating a collection has pricing implications, as you are reserving throughput for the application to communicate with Azure Cosmos DB. For more details, please visit the [pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/)
> 
> 

**Monitored Collection:**
The monitored collection is the data from which the change feed is generated. Any inserts and changes to the monitored collection are reflected in the change feed of the collection. 

**Lease Collection:**
The lease collection coordinates processing the change feed across multiple workers. A separate collection is used to store the leases with one lease per partition. It is advantageous to store this lease collection on a different account with the write region closer to where the change feed processor is running. A lease object contains the following attributes: 
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

To further understand how these four elements of change feed processor work together, let's look at an example in the following diagram. The monitored collection stores documents and uses the "city" as the partition key. We see that the blue partition contains documents with the "city" field from "A-E" and so on. There are two hosts, each with two consumers reading from the four partitions in parallel. The arrows show the consumers reading from a specific spot in the change feed. In the first partition, the darker blue represents unread changes while the light blue represents the already read changes on the change feed. The hosts use the lease collection to store a "continuation" value to keep track of the current reading position for each consumer. 

![Using the Azure Cosmos DB change feed processor host](./media/change-feed/changefeedprocessornew.png)

### Working with the change feed processor library

Before installing change feed processor NuGet package, first install: 

* Microsoft.Azure.DocumentDB, latest version.
* Newtonsoft.Json, latest version

Then install the [Microsoft.Azure.DocumentDB.ChangeFeedProcessor Nuget package](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB.ChangeFeedProcessor/) and include it as a reference.

To implement the change feed processor library you have to do following:

1. Implement a **DocumentFeedObserver** object, which implements **IChangeFeedObserver**.
    ```csharp
    using System;
    using System.Collections.Generic;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Azure.Documents;
    using Microsoft.Azure.Documents.ChangeFeedProcessor.FeedProcessing;
    using Microsoft.Azure.Documents.Client;

    /// <summary>
    /// This class implements the IChangeFeedObserver interface and is used to observe 
    /// changes on change feed. ChangeFeedEventHost will create as many instances of 
    /// this class as needed. 
    /// </summary>
    public class DocumentFeedObserver : IChangeFeedObserver
    {
    private static int totalDocs = 0;

        /// <summary>
        /// Initializes a new instance of the <see cref="DocumentFeedObserver" /> class.
        /// Saves input DocumentClient and DocumentCollectionInfo parameters to class fields
        /// </summary>
        /// <param name="client"> Client connected to destination collection </param>
        /// <param name="destCollInfo"> Destination collection information </param>
        public DocumentFeedObserver()
        {
            
        }

        /// <summary>
        /// Called when change feed observer is opened; 
        /// this function prints out observer partition key id. 
        /// </summary>
        /// <param name="context">The context specifying partition for this observer, etc.</param>
        /// <returns>A Task to allow asynchronous execution</returns>
        public Task OpenAsync(IChangeFeedObserverContext context)
        {
            Console.ForegroundColor = ConsoleColor.Magenta;
            Console.WriteLine("Observer opened for partition Key Range: {0}", context.PartitionKeyRangeId);
            return Task.CompletedTask;
        }

        /// <summary>
        /// Called when change feed observer is closed; 
        /// this function prints out observer partition key id and reason for shut down. 
        /// </summary>
        /// <param name="context">The context specifying partition for this observer, etc.</param>
        /// <param name="reason">Specifies the reason the observer is closed.</param>
        /// <returns>A Task to allow asynchronous execution</returns>
        public Task CloseAsync(IChangeFeedObserverContext context, ChangeFeedObserverCloseReason reason)
        {
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("Observer closed, {0}", context.PartitionKeyRangeId);
            Console.WriteLine("Reason for shutdown, {0}", reason);
            return Task.CompletedTask;
        }

        public Task ProcessChangesAsync(IChangeFeedObserverContext context, IReadOnlyList<Document> docs, CancellationToken cancellationToken)
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("Change feed: PartitionId {0} total {1} doc(s)", context.PartitionKeyRangeId, Interlocked.Add(ref totalDocs, docs.Count));
            foreach (Document doc in docs)
            {
                Console.ForegroundColor = ConsoleColor.Yellow;
                Console.WriteLine(doc.Id.ToString());
            }

            return Task.CompletedTask;
        }
    }
    ```

2. Implement a **DocumentFeedObserverFactory**, which implements a **IChangeFeedObserverFactory**.
    ```csharp
     using Microsoft.Azure.Documents.ChangeFeedProcessor.FeedProcessing;

    /// <summary>
    /// Factory class to create instance of document feed observer. 
    /// </summary>
    public class DocumentFeedObserverFactory : IChangeFeedObserverFactory
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="DocumentFeedObserverFactory" /> class.
        /// Saves input DocumentClient and DocumentCollectionInfo parameters to class fields
        /// </summary>
        public DocumentFeedObserverFactory()
        {
        }

        /// <summary>
        /// Creates document observer instance with client and destination collection information
        /// </summary>
        /// <returns>DocumentFeedObserver with client and destination collection information</returns>
        public IChangeFeedObserver CreateObserver()
        {
            DocumentFeedObserver newObserver = new DocumentFeedObserver();
            return newObserver as IChangeFeedObserver;
        }
    }
    ```

3. Define *CancellationTokenSource* and *ChangeFeedProcessorBuilder*

    ```csharp
    private readonly CancellationTokenSource cancellationTokenSource = new CancellationTokenSource();
    private readonly ChangeFeedProcessorBuilder builder = new ChangeFeedProcessorBuilder();
    ```

5. build the **ChangeFeedProcessorBuilder** after defining the relevant objects 

    ```csharp
            string hostName = Guid.NewGuid().ToString();
      
            // monitored collection info 
            DocumentCollectionInfo documentCollectionInfo = new DocumentCollectionInfo
            {
                Uri = new Uri(this.monitoredUri),
                MasterKey = this.monitoredSecretKey,
                DatabaseName = this.monitoredDbName,
                CollectionName = this.monitoredCollectionName
            };
            
            DocumentCollectionInfo leaseCollectionInfo = new DocumentCollectionInfo
                {
                    Uri = new Uri(this.leaseUri),
                    MasterKey = this.leaseSecretKey,
                    DatabaseName = this.leaseDbName,
                    CollectionName = this.leaseCollectionName
                };
            DocumentFeedObserverFactory docObserverFactory = new DocumentFeedObserverFactory();
       
            ChangeFeedProcessorOptions feedProcessorOptions = new ChangeFeedProcessorOptions();

            // ie. customizing lease renewal interval to 15 seconds
            // can customize LeaseRenewInterval, LeaseAcquireInterval, LeaseExpirationInterval, FeedPollDelay 
            feedProcessorOptions.LeaseRenewInterval = TimeSpan.FromSeconds(15);
            feedProcessorOptions.StartFromBeginning = true;

            this.builder
                .WithHostName(hostName)
                .WithFeedCollection(documentCollectionInfo)
                .WithLeaseCollection(leaseCollectionInfo)
                .WithProcessorOptions (feedProcessorOptions)
                .WithObserverFactory(new DocumentFeedObserverFactory());               
                //.WithObserver<DocumentFeedObserver>();  If no factory then just pass an observer

            var result =  await this.builder.BuildAsync();
            await result.StartAsync();
            Console.Read();
            await result.StopAsync();    
    ```

That’s it. After these few steps documents will start showing up into the **DocumentFeedObserver.ProcessChangesAsync** method.

Above code is for illustration purpose to show different kind of objects and their interaction. You have to define proper variables and initiate them with correct values. You can get the complete code used in this article from the [GitHub repo](https://github.com/Azure/azure-documentdb-dotnet/tree/master/samples/code-samples/ChangeFeedProcessorV2).

> [!NOTE]
> You should never have a master key in your code or in config file as shown in above code. Please see [how to use Key-Vault to retrive the keys](https://sarosh.wordpress.com/2017/11/23/cosmos-db-and-key-vault/).


## FAQ

### What are the different ways you can read Change Feed? and when to use each method?

There are three options for you to read change feed:

* **[Using Azure Cosmos DB SQL API .NET SDK](#sql-sdk)**
   
   By using this method, you get low level of control on change feed. You can manage the checkpoint, you can access a particular partition key etc. If you have multiple readers, you can use [ChangeFeedOptions](https://docs.microsoft.com/dotnet/api/microsoft.azure.documents.client.changefeedoptions?view=azure-dotnet) to distribute read load to different threads or different clients. .

* **[Using the Azure Cosmos DB change feed processor library](#change-feed-processor)**

   If you want to outsource lot of complexity of change feed then you can use change feed processor library. This library hides lot of complexity, but still gives you complete control on change feed. This library follows an [observer pattern](https://en.wikipedia.org/wiki/Observer_pattern), your processing function is called by the SDK. 

   If you have a high throughput change feed, you can instantiate multiple clients to read the change feed. Because you are using "change feed processor library", it will automatically divide the load among different clients. You do not have to do anything. All the complexity is handled by SDK. However, if you want to have your own load balancer, then you can implement IParitionLoadBalancingStrategy for custom partition strategy. Implement IPartitionProcessor – for custom processing changes on a partition. However, with SDK, you can process a partition range but if you want to process a particular partition key then you have to use SDK for SQL API.

* **[Using Azure Functions](#azure-functions)** 
   
   The last option Azure Function is the simplest option. We recommend using this option. When you create an Azure Cosmos DB trigger in an Azure Functions app, you select the Azure Cosmos DB collection to connect to and the function is triggered whenever a change to the collection is made. watch a [screen cast](https://www.youtube.com/watch?v=Mnq0O91i-0s&t=14s) of using Azure function and change feed

   Triggers can be created in the Azure Functions portal, in the Azure Cosmos DB portal, or programmatically. Visual Studio and VS Code has great support to write Azure Function. You can write and debug the code on your desktop, and then deploy the function with one click. For more information, see [Azure Cosmos DB: Serverless database computing using Azure Functions](serverless-computing-database.md) article.

### What is the sort order of documents in change feed?

Change feed documents comes in order of their modification time. This sort order is guaranteed only per partition.

### For a multi-region account, what happens to the change feed when the write-region fails-over? Does the change feed also failover? Would the change feed still appear contiguous or would the fail-over cause change feed to reset?
>>>>>>> 0526a15247bb2745a4dcab2cd65e40d7bffcda70

## Supported APIs and client SDKs

This feature is currently supported by the following Azure Cosmos DB APIs and client SDKs.

| **Client drivers** | **Azure CLI** | **SQL API** | **Cassandra API** | **MongoDB API** | **Gremlin API**|**Table API** |
| --- | --- | --- | --- | --- | --- | --- |
| .NET | NA | Yes | No | No | Yes | No |
|Java|NA|Yes|No|No|Yes|No|
|Python|NA|Yes|No|No|Yes|No|
|Node/JS|NA|Yes|No|No|Yes|No|

## Change feed and different operations

Today, you see all operations in the change feed. The functionality where you can control change feed, for specific operations such as updates only and not inserts is not yet available. You can add a “soft marker” on the item for updates and filter based on that when processing items in the change feed. Currently change feed doesn’t log deletes. Similar to the previous example, you can add a soft marker on the items that are being deleted, for example, you can add an attribute in the item called "deleted" and set it to "true" and set a TTL on the item, so that it can be automatically deleted. You can read the change feed for historic items, for example, items that were added five years ago. If the item is not deleted you can read the change feed as far as the origin of your container.

### Sort order of items in change feed

Change feed items come in the order of their modification time. This sort order is guaranteed per   logical partition key.

### Change feed in multi-region Azure Cosmos accounts

In a multi-region Azure Cosmos account, if a write-region fails over, change feed will work across the manual failover operation and it will be contiguous.

### Change feed and Time to Live (TTL)

If a TTL (Time to Live) property is set on an item to -1, change feed will persist forever. If the data is not deleted, it will remain in the change feed.  

### Change feed and _etag, _lsn or _ts

The _etag format is internal and you should not take dependency on it, because it can change anytime. _ts is a modification or a creation timestamp. You can use _ts for chronological comparison. _lsn is a batch id that is added for change feed only; it represents the transaction id. Many items may have same _lsn. ETag on FeedResponse is different from the _etag you see on the item. _etag is an internal identifier and is used for concurrency control tells about the 
version of the item, whereas ETag is used for sequencing the feed.

## Change feed use cases and scenarios

Change feed enables efficient processing of large datasets with a high volume of writes. Change feed also offers an alternative to querying an entire dataset to identify what has changed.

### Use cases

For example, with change feed you can perform the following tasks efficiently:

* Update a cache, update a search index, or update a data warehouse with data stored in Azure Cosmos DB.

* Implement an application-level data tiering and archival, for example, store "hot data" in Azure Cosmos DB and age out "cold data" to other storage systems, for example, [Azure Blob Storage](../storage/common/storage-introduction.md).

* Perform zero down-time migrations to another Azure Cosmos account or another Azure Cosmos container with a different logical partition key.

* Implement [lambda architecture](https://blogs.technet.microsoft.com/msuspartner/2016/01/27/azure-partner-community-big-data-advanced-analytics-and-lambda-architecture/) using Azure Cosmos DB, where Azure Cosmos DB supports both real-time, batch and query serving layers, thus enabling lambda architecture with low TCO.

* Receive and store event data from devices, sensors, infrastructure and applications, and process these events in real time, for example, using [Spark](../hdinsight/spark/apache-spark-overview.md).  The following image shows how you can implement lambda architecture using Azure Cosmos DB via change feed:

![Azure Cosmos DB-based lambda pipeline for ingestion and query](./media/change-feed/lambda.png)

### Scenarios

The following are some of the scenarios you can easily implement with change feed:

* Within your [serverless](http://azure.com/serverless) web or mobile apps, you can track events such as all the changes to your customer's profile, preferences, or their location and trigger certain actions, for example, sending push notifications to their devices using [Azure Functions](#azure-functions). 

* If you're using Azure Cosmos DB to build a game, you can, for example, use change feed to implement real-time leaderboards based on scores from completed games.


## Working with change feed

You can work with change feed using the following options:

* [Using change feed with Azure Functions](change-feed-functions.md)
* [Using change feed with change feed processor library](change-feed-processor.md) 

Change feed is available for each logical partition key within the container, and it can be distributed across one or more consumers for parallel processing as shown in the image below.

![Distributed processing of Azure Cosmos DB change feed](./media/change-feed/changefeedvisual.png)

## Features of change feed

* Change feed is enabled by default for all Azure Cosmos accounts.

* You can use your [provisioned throughput](request-units.md) to read from the change feed, just like any other Azure Cosmos DB operation, in any of the regions associated with your Azure Cosmos database.

* The change feed includes inserts and update operations made to items within the container. You can capture deletes by setting a "soft-delete" flag within your items (for example, documents) in place of deletes. Alternatively, you can set a finite expiration period for your items with the [TTL capability](time-to-live.md). For example, 24 hours and use the value of that property to capture deletes. With this solution, you have to process the changes within a shorter time interval than the TTL expiration period. 

* Each change to an item appears exactly once in the change feed, and the clients must manage the checkpointing logic. If you want to avoid the complexity of managing checkpoints, the change feed processor library provides automatic checkpointing and "at least once" semantics. See [using change feed with change feed processor library](change-feed-processor.md).

* Only the most recent change for a given item is included in the change log. Intermediate changes may not be available.

* The change feed is sorted by the order of modification within each logical partition key value. There is no guaranteed order across the partition key values.

* Changes can be synchronized from any point-in-time, that is there is no fixed data retention period for which changes are available.

* Changes are available in parallel for all logical partition keys of an Azure Cosmos container. This capability allows changes from large containers to be processed in parallel by multiple consumers.

* Applications can request multiple changes feeds on the same container simultaneously. ChangeFeedOptions.StartTime can be used to provide an initial starting point. For example, to find the continuation token corresponding to a given clock time. The ContinuationToken, if specified, wins over   the StartTime and StartFromBeginning values. The precision of ChangeFeedOptions.StartTime is ~5 secs. 

## Next steps

You can now proceed to learn more about change feed in the following articles:

* [Options to read change feed](change-feed-reading.md)
* [Using change feed with Azure Functions](change-feed-functions.md)
* [Using change feed processor library](change-feed-processor.md)