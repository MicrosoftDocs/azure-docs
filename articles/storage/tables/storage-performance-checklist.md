---
title: Performance and scalability checklist for Table storage - Azure Storage
description: A checklist of proven practices for use with Table storage in developing high-performance applications.
services: storage
author: tamram

ms.service: storage
ms.topic: overview
ms.date: 10/10/2019
ms.author: tamram
ms.subservice: tables
---

# Performance and scalability checklist for Table storage

Microsoft has developed a number of proven practices for developing high-performance applications with Table storage. This checklist identifies key practices that developers can follow to optimize performance. Keep these practices in mind while you are designing your application and throughout the process.

Azure Storage has scalability and performance targets for capacity, transaction rate, and bandwidth. For more information about Azure Storage scalability targets, see [Scalability and performance targets for standard storage accounts](../common/scalability-targets-standard-account.md?toc=%2fazure%2fstorage%2ftables%2ftoc.json) and [Scalability and performance targets for Table storage](scalability-targets.md).

## Checklist

This article organizes proven practices for performance into a checklist you can follow while developing your Table storage application.

| Done | Category | Design consideration |
| --- | --- | --- |
| &nbsp; |Scalability targets |[Can you design your application to use no more than the maximum number of storage accounts?](#maximum-number-of-storage-accounts) |
| &nbsp; |Scalability targets |[Are you avoiding approaching capacity and transaction limits?](#capacity-and-transaction-targets) |
| &nbsp; |Scalability targets |[Are you approaching the scalability targets for entities per second?](#targets-for-data-operations) |
| &nbsp; |Networking |[Do client-side devices have sufficiently high bandwidth and low latency to achieve the performance needed?](#throughput) |
| &nbsp; |Networking |[Do client-side devices have a high quality network link?](#link-quality) |
| &nbsp; |Networking |[Is the client application in the same region as the storage account?](#location) |
| &nbsp; |Direct Client Access |[Are you using shared access signatures (SAS) and cross-origin resource sharing (CORS) to enable direct access to Azure Storage?](#sas-and-cors) |
| &nbsp; |Batching |[Is your application batching updates by using entity group transactions?](#batch-transactions) |
| &nbsp; |.NET configuration |[Are you using .NET Core 2.1 or later for optimum performance?](#use-net-core) |
| &nbsp; |.NET configuration |[Have you configured your client to use a sufficient number of concurrent connections?](#increase-default-connection-limit) |
| &nbsp; |.NET configuration |[For .NET applications, have you configured .NET to use a sufficient number of threads?](#increase-minimum-number-of-threads) |
| &nbsp; |Parallelism |[Have you ensured that parallelism is bounded appropriately so that you don't overload your client's capabilities or approach the scalability targets?](#unbounded-parallelism) |
| &nbsp; |Tools |[Are you using the latest versions of Microsoft-provided client libraries and tools?](#client-libraries-and-tools) |
| &nbsp; |Retries |[Are you using a retry policy with an exponential backoff for throttling errors and timeouts?](#timeout-and-server-busy-errors) |
| &nbsp; |Retries |[Is your application avoiding retries for non-retryable errors?](#non-retryable-errors) |
| &nbsp; |Configuration |[Are you using JSON for your table requests?](#use-json) |
| &nbsp; |Configuration |[Have you turned off the Nagle algorithm to improve the performance of small requests?](#disable-nagle) |
| &nbsp; |Tables and partitions |[Have you properly partitioned your data?](#schema) |
| &nbsp; |Hot partitions |[Are you avoiding append-only and prepend-only patterns?](#append-only-and-prepend-only-patterns) |
| &nbsp; |Hot partitions |[Are your inserts/updates spread across many partitions?](#high-traffic-data) |
| &nbsp; |Query scope |[Have you designed your schema to allow for point queries to be used in most cases, and table queries to be used sparingly?](#query-scope) |
| &nbsp; |Query density |[Do your queries typically only scan and return rows that your application will use?](#query-density) |
| &nbsp; |Limiting returned data |[Are you using filtering to avoid returning entities that are not needed?](#limiting-the-amount-of-data-returned) |
| &nbsp; |Limiting returned data |[Are you using projection to avoid returning properties that are not needed?](#limiting-the-amount-of-data-returned) |
| &nbsp; |Denormalization |[Have you denormalized your data such that you avoid inefficient queries or multiple read requests when trying to get data?](#denormalization) |
| &nbsp; |Insert, update, and delete |[Are you batching requests that need to be transactional or can be done at the same time to reduce round-trips?](#batching) |
| &nbsp; |Insert, update, and delete |[Are you avoiding retrieving an entity just to determine whether to call insert or update?](#upsert) |
| &nbsp; |Insert, update, and delete |[Have you considered storing series of data that will frequently be retrieved together in a single entity as properties instead of multiple entities?](#storing-data-series-in-a-single-entity) |
| &nbsp; |Insert, update, and delete |[For entities that will always be retrieved together and can be written in batches (for example, time series data), have you considered using blobs instead of tables?](#storing-structured-data-in-blobs) |

## Scalability targets

If your application approaches or exceeds any of the scalability targets, it may encounter increased transaction latencies or throttling. When Azure Storage throttles your application, the service begins to return 503 (Server busy) or 500 (Operation timeout) error codes. Avoiding these errors by staying within the limits of the scalability targets is an important part of enhancing your application's performance.

For more information about scalability targets for the Table service, see [Scalability and performance targets for Table storage](scalability-targets.md).

### Maximum number of storage accounts

If you're approaching the maximum number of storage accounts permitted for a particular subscription/region combination, are you using multiple storage accounts to shard to increase ingress, egress, I/O operations per second (IOPS), or capacity? In this scenario, Microsoft recommends that you take advantage of increased limits for storage accounts to reduce the number of storage accounts required for your workload if possible. Contact [Azure Support](https://azure.microsoft.com/support/options/) to request increased limits for your storage account. For more information, see [Announcing larger, higher scale storage accounts](https://azure.microsoft.com/blog/announcing-larger-higher-scale-storage-accounts/).

### Capacity and transaction targets

If your application is approaching the scalability targets for a single storage account, consider adopting one of the following approaches:  

- Reconsider the workload that causes your application to approach or exceed the scalability target. Can you design it differently to use less bandwidth or capacity, or fewer transactions?
- If your application must exceed one of the scalability targets, then create multiple storage accounts and partition your application data across those multiple storage accounts. If you use this pattern, then be sure to design your application so that you can add more storage accounts in the future for load balancing. Storage accounts themselves have no cost other than your usage in terms of data stored, transactions made, or data transferred.
- If your application is approaching the bandwidth targets, consider compressing data on the client side to reduce the bandwidth required to send the data to Azure Storage.
    While compressing data may save bandwidth and improve network performance, it can also have negative effects on performance. Evaluate the performance impact of the additional processing requirements for data compression and decompression on the client side. Keep in mind that storing compressed data can make troubleshooting more difficult because it may be more challenging to view the data using standard tools.
- If your application is approaching the scalability targets, then make sure that you are using an exponential backoff for retries. It's best to try to avoid reaching the scalability targets by implementing the recommendations described in this article. However, using an exponential backoff for retries will prevent your application from retrying rapidly, which could make throttling worse. For more information, see the section titled [Timeout and Server Busy errors](#timeout-and-server-busy-errors).

### Targets for data operations

Azure Storage load balances as the traffic to your storage account increases, but if the traffic exhibits sudden bursts, you may not be able to get this volume of throughput immediately. Expect to see throttling and/or timeouts during the burst as Azure Storage automatically load balances your table. Ramping up slowly generally provides better results, as the system has time to load balance appropriately.

#### Entities per second (storage account)

The scalability limit for accessing tables is up to 20,000 entities (1 KB each) per second for an account. In general, each entity that is inserted, updated, deleted, or scanned counts toward this target. So a batch insert that contains 100 entities would count as 100 entities. A query that scans 1000 entities and returns 5 would count as 1000 entities.

#### Entities per second (partition)

Within a single partition, the scalability target for accessing tables is 2,000 entities (1 KB each) per second, using the same counting as described in the previous section.

## Networking

The physical network constraints of the application may have a significant impact on performance. The following sections describe some of limitations users may encounter.  

### Client network capability

Bandwidth and the quality of the network link play important roles in application performance, as described in the following sections.

#### Throughput

For bandwidth, the problem is often the capabilities of the client. Larger Azure instances have NICs with greater capacity, so you should consider using a larger instance or more VMs if you need higher network limits from a single machine. If you are accessing Azure Storage from an on premises application, then the same rule applies: understand the network capabilities of the client device and the network connectivity to the Azure Storage location and either improve them as needed or design your application to work within their capabilities.

#### Link quality

As with any network usage, keep in mind that network conditions resulting in errors and packet loss will slow effective throughput.  Using WireShark or NetMon may help in diagnosing this issue.  

### Location

In any distributed environment, placing the client near to the server delivers in the best performance. For accessing Azure Storage with the lowest latency, the best location for your client is within the same Azure region. For example, if you have an Azure web app that uses Azure Storage, then locate them both within a single region, such as US West or Asia Southeast. Co-locating resources reduces the latency and the cost, as bandwidth usage within a single region is free.  

If client applications will access Azure Storage but are not hosted within Azure, such as mobile device apps or on premises enterprise services, then locating the storage account in a region near to those clients may reduce latency. If your clients are broadly distributed (for example, some in North America, and some in Europe), then consider using one storage account per region. This approach is easier to implement if the data the application stores is specific to individual users, and does not require replicating data between storage accounts.

## SAS and CORS

Suppose that you need to authorize code such as JavaScript that is running in a user's web browser or in a mobile phone app to access data in Azure Storage. One approach is to build a service application that acts as a proxy. The user's device authenticates with the service, which in turn authorizes access to Azure Storage resources. In this way, you can avoid exposing your storage account keys on insecure devices. However, this approach places a significant overhead on the service application, because all of the data transferred between the user's device and Azure Storage must pass through the service application.

You can avoid using a service application as a proxy for Azure Storage by using shared access signatures (SAS). Using SAS, you can enable your user's device to make requests directly to Azure Storage by using a limited access token. For example, if a user wants to upload a photo to your application, then your service application can generate a SAS and send it to the user's device. The SAS token can grant permission to write to an Azure Storage resource for a specified interval of time, after which the SAS token expires. For more information about SAS, see [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-sas-overview.md).  

Typically, a web browser will not allow JavaScript in a page that is hosted by a website on one domain to perform certain operations, such as write operations, to another domain. Known as the same-origin policy, this policy prevents a malicious script on one page from obtaining access to data on another web page. However, the same-origin policy can be a limitation when building a solution in the cloud. Cross-origin resource sharing (CORS) is a browser feature that enables the target domain to communicate to the browser that it trusts requests originating in the source domain.

For example, suppose a web application running in Azure makes a request for a resource to an Azure Storage account. The web application is the source domain, and the storage account is the target domain. You can configure CORS for any of the Azure Storage services to communicate to the web browser that requests from the source domain are trusted by Azure Storage. For more information about CORS, see [Cross-origin resource sharing (CORS) support for Azure Storage](/rest/api/storageservices/Cross-Origin-Resource-Sharing--CORS--Support-for-the-Azure-Storage-Services).  
  
Both SAS and CORS can help you avoid unnecessary load on your web application.  

## Batch transactions

The Table service supports batch transactions on entities that are in the same table and belong to the same partition group. For more information, see [Performing entity group transactions](/rest/api/storageservices/performing-entity-group-transactions).

## .NET configuration

If using the .NET Framework, this section lists several quick configuration settings that you can use to make significant performance improvements.  If using other languages, check to see if similar concepts apply in your chosen language.  

### Use .NET Core

Develop your Azure Storage applications with .NET Core 2.1 or later to take advantage of performance enhancements. Using .NET Core 3.x is recommended when possible.

For more information on performance improvements in .NET Core, see the following blog posts:

- [Performance Improvements in .NET Core 3.0](https://devblogs.microsoft.com/dotnet/performance-improvements-in-net-core-3-0/)
- [Performance Improvements in .NET Core 2.1](https://devblogs.microsoft.com/dotnet/performance-improvements-in-net-core-2-1/)

### Increase default connection limit

In .NET, the following code increases the default connection limit (which is usually 2 in a client environment or 10 in a server environment) to 100. Typically, you should set the value to approximately the number of threads used by your application.  

```csharp
ServicePointManager.DefaultConnectionLimit = 100; //(Or More)  
```

Set the connection limit before opening any connections.  

For other programming languages, see that language's documentation to determine how to set the connection limit.  

For more information, see the blog post [Web Services: Concurrent Connections](https://blogs.msdn.microsoft.com/darrenj/2005/03/07/web-services-concurrent-connections/).  

### Increase minimum number of threads

If you are using synchronous calls together with asynchronous tasks, you may want to increase the number of threads in the thread pool:

```csharp
ThreadPool.SetMinThreads(100,100); //(Determine the right number for your application)  
```

For more information, see the [ThreadPool.SetMinThreads](/dotnet/api/system.threading.threadpool.setminthreads) method.  

## Unbounded parallelism

While parallelism can be great for performance, be careful about using unbounded parallelism, meaning that there is no limit enforced on the number of threads or parallel requests. Be sure to limit parallel requests to upload or download data, to access multiple partitions in the same storage account, or to access multiple items in the same partition. If parallelism is unbounded, your application can exceed the client device's capabilities or the storage account's scalability targets, resulting in longer latencies and throttling.  

## Client libraries and tools

For best performance, always use the latest client libraries and tools provided by Microsoft. Azure Storage client libraries are available for a variety of languages. Azure Storage also supports PowerShell and Azure CLI. Microsoft actively develops these client libraries and tools with performance in mind, keeps them up-to-date with the latest service versions, and ensures that they handle many of the proven performance practices internally. For more information, see the [Azure Storage reference documentation](/azure/storage/#reference).

## Handle service errors

Azure Storage returns an error when the service cannot process a request. Understanding the errors that may be returned by Azure Storage in a given scenario is helpful for optimizing performance.

### Timeout and Server Busy errors

Azure Storage may throttle your application if it approaches the scalability limits. In some cases, Azure Storage may be unable to handle a request due to some transient condition. In both cases, the service may return a 503 (Server Busy) or 500 (Timeout) error. These errors can also occur if the service is rebalancing data partitions to allow for higher throughput. The client application should typically retry the operation that causes one of these errors. However, if Azure Storage is throttling your application because it is exceeding scalability targets, or even if the service was unable to serve the request for some other reason, aggressive retries may make the problem worse. Using an exponential back off retry policy is recommended, and the client libraries default to this behavior. For example, your application may retry after 2 seconds, then 4 seconds, then 10 seconds, then 30 seconds, and then give up completely. In this way, your application significantly reduces its load on the service, rather than exacerbating behavior that could lead to throttling.  

Connectivity errors can be retried immediately, because they are not the result of throttling and are expected to be transient.  

### Non-retryable errors

The client libraries handle retries with an awareness of which errors can be retried and which cannot. However, if you are calling the Azure Storage REST API directly, there are some errors that you should not retry. For example, a 400 (Bad Request) error indicates that the client application sent a request that could not be processed because it was not in the expected form. Resending this request results the same response every time, so there is no point in retrying it. If you are calling the Azure Storage REST API directly, be aware of potential errors and whether they should be retried.

For more information on Azure Storage error codes, see [Status and error codes](/rest/api/storageservices/status-and-error-codes2).

## Configuration

This section lists several quick configuration settings that you can use to make significant performance improvements in the Table service:

### Use JSON

Beginning with storage service version 2013-08-15, the Table service supports using JSON instead of the XML-based AtomPub format for transferring table data. Using JSON can reduce payload sizes by as much as 75% and can significantly improve the performance of your application.

For more information, see the post [Microsoft Azure Tables: Introducing JSON](https://blogs.msdn.com/b/windowsazurestorage/archive/2013/12/05/windows-azure-tables-introducing-json.aspx) and [Payload Format for Table Service Operations](https://msdn.microsoft.com/library/azure/dn535600.aspx).

### Disable Nagle

Nagle's algorithm is widely implemented across TCP/IP networks as a means to improve network performance. However, it is not optimal in all circumstances (such as highly interactive environments). Nagle's algorithm has a negative impact on the performance of requests to the Azure Table service, and you should disable it if possible.

## Schema

How you represent and query your data is the biggest single factor that affects the performance of the Table service. While every application is different, this section outlines some general proven practices that relate to:

- Table design
- Efficient queries
- Efficient data updates

### Tables and partitions

Tables are divided into partitions. Every entity stored in a partition shares the same partition key and has a unique row key to identify it within that partition. Partitions provide benefits but also introduce scalability limits.

- Benefits: You can update entities in the same partition in a single, atomic, batch transaction that contains up to 100 separate storage operations (limit of 4 MB total size). Assuming the same number of entities to be retrieved, you can also query data within a single partition more efficiently than data that spans partitions (though read on for further recommendations on querying table data).
- Scalability limit: Access to entities stored in a single partition cannot be load-balanced because partitions support atomic batch transactions. For this reason, the scalability target for an individual table partition is lower than for the Table service as a whole.

Because of these characteristics of tables and partitions, you should adopt the following design principles:

- Locate data that your client application frequently updates or queries in the same logical unit of work in the same partition. For example, locate data in the same partition if your application is aggregating writes or you are performing atomic batch operations. Also, data in a single partition can be more efficiently queried in a single query than data across partitions.
- Locate data that your client application does not insert, update, or query in the same logical unit of work (that is, in a single query or batch update) in separate partitions. Keep in mind that there is no limit to the number of partition keys in a single table, so having millions of partition keys is not a problem and will not impact performance. For example, if your application is a popular website with user login, using the User ID as the partition key could be a good choice.

#### Hot partitions

A hot partition is one that is receiving a disproportionate percentage of the traffic to an account, and cannot be load balanced because it is a single partition. In general, hot partitions are created one of two ways:

#### Append Only and Prepend Only patterns

The "Append Only" pattern is one where all (or nearly all) of the traffic to a given partition key increases and decreases according to the current time. For example, suppose that your application uses the current date as a partition key for log data. This design results in all of the inserts going to the last partition in your table, and the system cannot load balance properly. If the volume of traffic to that partition exceeds the partition-level scalability target, then it will result in throttling. It's better to ensure that traffic is sent to multiple partitions, to enable load balance the requests across your table.

#### High-traffic data

If your partitioning scheme results in a single partition that just has data that is far more used than other partitions, you may also see throttling as that partition approaches the scalability target for a single partition. It's better to make sure that your partition scheme results in no single partition approaching the scalability targets.

### Querying

This section describes proven practices for querying the Table service.

#### Query scope

There are several ways to specify the range of entities to query. The following list describes each option for query scope.

- **Point queries:**- A point query retrieves exactly one entity by specifying both the partition key and row key of the entity to retrieve. These queries are efficient, and you should use them wherever possible.
- **Partition queries:** A partition query is a query that retrieves a set of data that shares a common partition key. Typically, the query specifies a range of row key values or a range of values for some entity property in addition to a partition key. These queries are less efficient than point queries, and should be used sparingly.
- **Table queries:** A table query is a query that retrieves a set of entities that does not share a common partition key. These queries are not efficient and you should avoid them if possible.

In general, avoid scans (queries larger than a single entity), but if you must scan, try to organize your data so that your scans retrieve the data you need without scanning or returning significant amounts of entities you don't need.

#### Query density

Another key factor in query efficiency is the number of entities returned as compared to the number of entities scanned to find the returned set. If your application performs a table query with a filter for a property value that only 1% of the data shares, the query will scan 100 entities for every one entity it returns. The table scalability targets discussed previously all relate to the number of entities scanned, and not the number of entities returned: a low query density can easily cause the Table service to throttle your application because it must scan so many entities to retrieve the entity you are looking for. For more information on how to avoid throttling, see the section titled [Denormalization](#denormalization).

#### Limiting the amount of data returned

When you know that a query will return entities that you don't need in the client application, consider using a filter to reduce the size of the returned set. While the entities not returned to the client still count toward the scalability limits, your application performance will improve because of the reduced network payload size and the reduced number of entities that your client application must process. Keep in mind that the scalability targets relate to the number of entities scanned, so a query that filters out many entities may still result in throttling, even if few entities are returned. For more information on making queries efficient, see the section titled [Query density](#query-density).

If your client application needs only a limited set of properties from the entities in your table, you can use projection to limit the size of the returned data set. As with filtering, projection helps to reduce network load and client processing.

#### Denormalization

Unlike working with relational databases, the proven practices for efficiently querying table data lead to denormalizing your data. That is, duplicating the same data in multiple entities (one for each key you may use to find the data) to minimize the number of entities that a query must scan to find the data the client needs, rather than having to scan large numbers of entities to find the data your application needs. For example, in an e-commerce website, you may want to find an order both by the customer ID (give me this customer's orders) and by the date (give me orders on a date). In Table Storage, it is best to store the entity (or a reference to it) twice – once with Table Name, PK, and RK to facilitate finding by customer ID, once to facilitate finding it by the date.  

### Insert, update, and delete

This section describes proven practices for modifying entities stored in the Table service.  

#### Batching

Batch transactions are known as entity group transactions in Azure Storage. All operations within an entity group transaction must be on a single partition in a single table. Where possible, use entity group transactions to perform inserts, updates, and deletes in batches. Using entity group transactions reduces the number of round trips from your client application to the server, reduces the number of billable transactions (an entity group transaction counts as a single transaction for billing purposes and can contain up to 100 storage operations), and enables atomic updates (all operations succeed or all fail within an entity group transaction). Environments with high latencies such as mobile devices will benefit greatly from using entity group transactions.  

#### Upsert

Use table **Upsert** operations wherever possible. There are two types of **Upsert**, both of which can be more efficient than a traditional **Insert** and **Update** operations:  

- **InsertOrMerge**: Use this operation when you want to upload a subset of the entity's properties, but aren't sure whether the entity already exists. If the entity exists, this call updates the properties included in the **Upsert** operation, and leaves all existing properties as they are, if the entity does not exist, it inserts the new entity. This is similar to using projection in a query, in that you only need to upload the properties that are changing.
- **InsertOrReplace**: Use this operation when you want to upload an entirely new entity, but you aren't sure whether it already exists. Use this operation when you know that the newly uploaded entity is entirely correct because it completely overwrites the old entity. For example, you want to update the entity that stores a user's current location regardless of whether or not the application has previously stored location data for the user; the new location entity is complete, and you do not need any information from any previous entity.

#### Storing data series in a single entity

Sometimes, an application stores a series of data that it frequently needs to retrieve all at once: for example, an application might track CPU usage over time in order to plot a rolling chart of the data from the last 24 hours. One approach is to have one table entity per hour, with each entity representing a specific hour and storing the CPU usage for that hour. To plot this data, the application needs to retrieve the entities holding the data from the 24 most recent hours.  

Alternatively, your application could store the CPU usage for each hour as a separate property of a single entity: to update each hour, your application can use a single **InsertOrMerge Upsert** call to update the value for the most recent hour. To plot the data, the application only needs to retrieve a single entity instead of 24, making for an efficient query. For more information on query efficiency, see the section titled [Query scope](#query-scope)).

#### Storing structured data in blobs

If you are performing batch inserts and then retrieving ranges of entities together, consider using blobs instead of tables. A good example is a log file. You can batch several minutes of logs and insert them, and then retrieve several minutes of logs at a time. In this case, performance is better if you use blobs instead of tables, since you can significantly reduce the number of objects written to or read, and also possibly the number of requests that need made.  

## Next steps

- [Scalability and performance targets for Table storage](scalability-targets.md)
- [Scalability and performance targets for standard storage accounts](../common/scalability-targets-standard-account.md?toc=%2fazure%2fstorage%2ftables%2ftoc.json)
- [Status and error codes](/rest/api/storageservices/Status-and-Error-Codes2)
