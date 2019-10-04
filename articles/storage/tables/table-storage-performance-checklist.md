---
title: Azure Table storage performance and scalability checklist - Azure Storage
description: 
services: storage
author: tamram

ms.service: storage
ms.topic: overview
ms.date: 10/03/2019
ms.author: tamram
ms.subservice: tables
---

# Azure Table storage performance and scalability checklist

In addition to the proven practices for [All Services](#allservices) described previously, the following proven practices apply specifically to the Table service.  

## Checklist

This article organizes the proven practices into a checklist you can follow while developing your application. Proven practices applicable to:  

- All Azure Storage services (blobs, tables, queues, and files)
- Tables

| Done | Area | Category | Question |
| --- | --- | --- | --- |
| &nbsp; | All Services |Scalability Targets |[Is your application designed to avoid approaching the scalability targets?](#scalability-targets) |
| &nbsp; | All Services |Scalability Targets |[Is your naming convention designed to enable better load-balancing?](#partition-naming-convention) |
| &nbsp; | All Services |Networking |[Do client side devices have sufficiently high bandwidth and low latency to achieve the performance needed?](#throughput) |
| &nbsp; | All Services |Networking |[Do client side devices have a high enough quality link?](#link-quality) |
| &nbsp; | All Services |Networking |[Is the client application located "near" the storage account?](#location) |
| &nbsp; | All Services |Content Distribution |[Are you using a CDN for content distribution?](#content-distribution) |
| &nbsp; | All Services |Direct Client Access |[Are you using SAS and CORS to allow direct access to storage instead of proxy?](#sas-and-cors) |
| &nbsp; | All Services |Caching |[Is your application caching data that is repeatedly used and changes rarely?](#reading-data) |
| &nbsp; | All Services |Caching |[Is your application batching updates (caching them client side and then uploading in larger sets)?](#uploading-data-in-batches) |
| &nbsp; | All Services |.NET Configuration |[Have you configured your client to use a sufficient number of concurrent connections?](#increase-default-connection-limit) |
| &nbsp; | All Services |.NET Configuration |[Have you configured .NET to use a sufficient number of threads?](#increase-minimum-number-of-threads) |
| &nbsp; | All Services |.NET Configuration |[Are you using .NET 4.5 or later, which has improved garbage collection?](##take-advantage-of-improved-garbage-collection) |
| &nbsp; | All Services |Parallelism |[Have you ensured that parallelism is bounded appropriately so that you don't overload either your client capabilities or the scalability targets?](#unbounded-parallelism) |
| &nbsp; | All Services |Tools |[Are you using the latest version of Microsoft provided client libraries and tools?](#client-libraries-and-tools) |
| &nbsp; | All Services |Retries |[Are you using an exponential backoff retry policy for throttling errors and timeouts?](#throttling-and-server-busy-errors) |
| &nbsp; | All Services |Retries |[Is your application avoiding retries for non-retryable errors?](#non-retryable-errors) |
| &nbsp; | Blobs |Scalability Targets |[Do you have a large number of clients accessing a single object concurrently?](#multiple-clients-accessing-a-single-object-concurrently) |
| &nbsp; | Tables |Scalability Targets |[Are you approaching the scalability targets for entities per second?](#table-specific-scalability-targets) |
| &nbsp; | Tables |Configuration |[Are you using JSON for your table requests?](#use-json) |
| &nbsp; | Tables |Configuration |[Have you turned off the Nagle algorithm to improve the performance of small requests?](#disable-nagle) |
| &nbsp; | Tables |Tables and Partitions |[Have you properly partitioned your data?](#schema) |
| &nbsp; | Tables |Hot Partitions |[Are you avoiding append-only and prepend-only patterns?](#append-only-and-prepend-only-patterns) |
| &nbsp; | Tables |Hot Partitions |[Are your inserts/updates spread across many partitions?](#high-traffic-data) |
| &nbsp; | Tables |Query Scope |[Have you designed your schema to allow for point queries to be used in most cases, and table queries to be used sparingly?](#query-scope) |
| &nbsp; | Tables |Query Density |[Do your queries typically only scan and return rows that your application will use?](#query-density) |
| &nbsp; | Tables |Limiting Returned Data |[Are you using filtering to avoid returning entities that are not needed?](#limiting-the-amount-of-data-returned) |
| &nbsp; | Tables |Limiting Returned Data |[Are you using projection to avoid returning properties that are not needed?](#limiting-the-amount-of-data-returned) |
| &nbsp; | Tables |Denormalization |[Have you denormalized your data such that you avoid inefficient queries or multiple read requests when trying to get data?](#denormalization) |
| &nbsp; | Tables |Insert/Update/Delete |[Are you batching requests that need to be transactional or can be done at the same time to reduce round-trips?](#batching) |
| &nbsp; | Tables |Insert/Update/Delete |[Are you avoiding retrieving an entity just to determine whether to call insert or update?](#upsert) |
| &nbsp; | Tables |Insert/Update/Delete |[Have you considered storing series of data that will frequently be retrieved together in a single entity as properties instead of multiple entities?](#storing-data-series-in-a-single-entity) |
| &nbsp; | Tables |Insert/Update/Delete |[For entities that will always be retrieved together and can be written in batches (for example, time series data), have you considered using blobs instead of tables?](#storing-structured-data-in-blobs) |

## Table-specific scalability targets

In addition to the bandwidth limitations of an entire storage account, tables have the following specific scalability limit. The system will load balance as your traffic increases, but if your traffic has sudden bursts, you may not be able to get this volume of throughput immediately. If your pattern has bursts, you should expect to see throttling and/or timeouts during the burst as the storage service automatically load balances out your table. Ramping up slowly generally has better results as it gives the system time to load balance appropriately.

### Entities per second (storage account)

The scalability limit for accessing tables is up to 20,000 entities (1 KB each) per second for an account. In general, each entity that is inserted, updated, deleted, or scanned counts toward this target. So a batch insert that contains 100 entities would count as 100 entities. A query that scans 1000 entities and returns 5 would count as 1000 entities.

### Entities per second (partition)

Within a single partition, the scalability target for accessing tables is 2,000 entities (1 KB each) per second, using the same counting as described in the previous section.

## Configuration

This section lists several quick configuration settings that you can use to make significant performance improvements in the Table service:

### Use JSON

Beginning with storage service version 2013-08-15, the Table service supports using JSON instead of the XML-based AtomPub format for transferring table data. This can reduce payload sizes by as much as 75% and can significantly improve the performance of your application.

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

- Data that your client application frequently updated or queried in the same logical unit of work should be located in the same partition. This may be because your application is aggregating writes, or because you want to take advantage of atomic batch operations. Also, data in a single partition can be more efficiently queried in a single query than data across partitions.
- Data that your client application does not insert/update or query in the same logical unit of work (single query or batch update) should be located in separate partitions. One important note is that there is no limit to the number of partition keys in a single table, so having millions of partition keys is not a problem and will not impact performance. For example, if your application is a popular website with user login, using the User ID as the partition key could be a good choice.

#### Hot partitions

A hot partition is one that is receiving a disproportionate percentage of the traffic to an account, and cannot be load balanced because it is a single partition. In general, hot partitions are created one of two ways:

#### Append Only and Prepend Only patterns

The "Append Only" pattern is one where all (or nearly all) of the traffic to a given PK increases and decreases according to the current time. An example is if your application used the current date as a partition key for log data. This results in all of the inserts going to the last partition in your table, and the system cannot load balance because all of the writes are going to the end of your table. If the volume of traffic to that partition exceeds the partition-level scalability target, then it will result in throttling. It's better to ensure that traffic is sent to multiple partitions, to enable load balance the requests across your table.

#### High-traffic data

If your partitioning scheme results in a single partition that just has data that is far more used than other partitions, you may also see throttling as that partition approaches the scalability target for a single partition. It's better to make sure that your partition scheme results in no single partition approaching the scalability targets.

### Querying

This section describes proven practices for querying the Table service.

#### Query scope

There are several ways to specify the range of entities to query. The following list describes each option for query scope.

- **Point queries:**- A point query retrieves exactly one entity. It does this by specifying both the partition key and row key of the entity to retrieve. These queries are efficient, and you should use them wherever possible.
- **Partition queries:** A partition query is a query that retrieves a set of data that shares a common partition key. Typically, the query specifies a range of row key values or a range of values for some entity property in addition to a partition key. These are less efficient than point queries, and should be used sparingly.
- **Table queries:** A table query is a query that retrieves a set of entities that does not share a common partition key. These queries are not efficient and you should avoid them if possible.

In general, avoid scans (queries larger than a single entity), but if you must scan, try to organize your data so that your scans retrieve the data you need without scanning or returning significant amounts of entities you don't need.

#### Query density

Another key factor in query efficiency is the number of entities returned as compared to the number of entities scanned to find the returned set. If your application performs a table query with a filter for a property value that only 1% of the data shares, the query will scan 100 entities for every one entity it returns. The table scalability targets discussed previously all relate to the number of entities scanned, and not the number of entities returned: a low query density can easily cause the Table service to throttle your application because it must scan so many entities to retrieve the entity you are looking for. For more information on how to avoid throttling, see the section titled [Denormalization](#denormalization).

#### Limiting the amount of data returned

When you know that a query will return entities that you don't need in the client application, consider using a filter to reduce the size of the returned set. While the entities not returned to the client still count toward the scalability limits, your application performance will improve because of the reduced network payload size and the reduced number of entities that your client application must process. Keep in mind that the scalability targets relate to the number of entities scanned, so a query that filters out many entities may still result in throttling, even if few entities are returned. For more information on making queries efficient, see the section titled [Query density](#query-density).

If your client application needs only a limited set of properties from the entities in your table, you can use projection to limit the size of the returned data set. As with filtering, this helps to reduce network load and client processing.

#### Denormalization

Unlike working with relational databases, the proven practices for efficiently querying table data lead to denormalizing your data. That is, duplicating the same data in multiple entities (one for each key you may use to find the data) to minimize the number of entities that a query must scan to find the data the client needs, rather than having to scan large numbers of entities to find the data your application needs. For example, in an e-commerce website, you may want to find an order both by the customer ID (give me this customer's orders) and by the date (give me orders on a date). In Table Storage, it is best to store the entity (or a reference to it) twice – once with Table Name, PK, and RK to facilitate finding by customer ID, once to facilitate finding it by the date.  

### Insert/Update/Delete

This section describes proven practices for modifying entities stored in the Table service.  

#### Batching

Batch transactions are known as Entity Group Transactions (ETG) in Azure Storage; all the operations within an ETG must be on a single partition in a single table. Where possible, use ETGs to perform inserts, updates, and deletes in batches. This reduces the number of round trips from your client application to the server, reduces the number of billable transactions (an ETG counts as a single transaction for billing purposes and can contain up to 100 storage operations), and enables atomic updates (all operations succeed or all fail within an ETG). Environments with high latencies such as mobile devices will benefit greatly from using ETGs.  

#### Upsert

Use table **Upsert** operations wherever possible. There are two types of **Upsert**, both of which can be more efficient than a traditional **Insert** and **Update** operations:  

- **InsertOrMerge**: Use this when you want to upload a subset of the entity's properties, but aren't sure whether the entity already exists. If the entity exists, this call updates the properties included in the **Upsert** operation, and leaves all existing properties as they are, if the entity does not exist, it inserts the new entity. This is similar to using projection in a query, in that you only need to upload the properties that are changing.
- **InsertOrReplace**: Use this when you want to upload an entirely new entity, but you aren't sure whether it already exists. You should only use this when you know that the newly uploaded entity is entirely correct because it completely overwrites the old entity. For example, you want to update the entity that stores a user's current location regardless of whether or not the application has previously stored location data for the user; the new location entity is complete, and you do not need any information from any previous entity.

#### Storing data series in a single entity

Sometimes, an application stores a series of data that it frequently needs to retrieve all at once: for example, an application might track CPU usage over time in order to plot a rolling chart of the data from the last 24 hours. One approach is to have one table entity per hour, with each entity representing a specific hour and storing the CPU usage for that hour. To plot this data, the application needs to retrieve the entities holding the data from the 24 most recent hours.  

Alternatively, your application could store the CPU usage for each hour as a separate property of a single entity: to update each hour, your application can use a single **InsertOrMerge Upsert** call to update the value for the most recent hour. To plot the data, the application only needs to retrieve a single entity instead of 24, making for an efficient query. For more information on query efficiency, see the section titled [Query scope](#query-scope)).

#### Storing structured data in blobs

Sometimes structured data feels like it should go in tables, but ranges of entities are always retrieved together and can be batch inserted. A good example of this is a log file. In this case, you can batch several minutes of logs, insert them, and then you are always retrieving several minutes of logs at a time as well. In this case, for performance, it's better to use blobs instead of tables, since you can significantly reduce the number of objects written/returned, as well as usually the number of requests that need made.  

## Next steps

[Azure Storage scalability and performance targets for storage accounts](../common/storage-scalability-targets.md)
