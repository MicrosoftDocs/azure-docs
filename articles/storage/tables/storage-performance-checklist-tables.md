---
title: Performance and scalability checklist for Table storage - Azure Storage
description: 
services: storage
author: tamram

ms.service: storage
ms.topic: overview
ms.date: 10/03/2019
ms.author: tamram
ms.subservice: tables
---

# Performance and scalability checklist for Table storage

Microsoft has developed a number of proven practices for developing high-performance applications with Table storage. This checklist identifies key practices that developers can follow to optimize performance. Keep these practices in mind while you are designing your application and throughout the process.

## Checklist

This article organizes the proven practices into a checklist you can follow while developing your Table storage application. For proven practices that are generally applicable to all of the Azure Storage services, see [Azure Storage performance and scalability checklist](../common/storage-performance-checklist.md).

| Done | Area | Category | Question |
| --- | --- | --- | --- |
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

## Scalability targets

Each of the Azure Storage services has scalability targets for capacity, transaction rate, and bandwidth. For more information about Azure Storage scalability targets, see [Azure Storage scalability and performance targets for storage accounts](storage-scalability-targets.md).

If your application approaches or exceeds any of the scalability targets, it may encounter increased transaction latencies or throttling. When Azure Storage throttles your application, the service begins to return 503 (Server busy) or 500 (Operation timeout) error codes for some storage transactions. This section discusses how to design for scalability targets, and for bandwidth scalability targets in particular. Later sections that deal with individual storage services discuss scalability targets in the context of that specific service:  

- [Blob bandwidth and requests per second](#bandwidth-and-operations-per-blob)
- [Table entities per second](#subheading24)
- [Queue messages per second](#subheading39)  

### Approaching a scalability target

If you're approaching the maximum number of storage accounts permitted for a particular subscription/region combination, evaluate your scenario and determine whether any of the following conditions apply:

- Are you using storage accounts to store unmanaged disks and adding those disks to your virtual machines (VMs)? For this scenario, Microsoft recommends using managed disks, as they handle VM disk scalability for you without the need to create and manage individual storage accounts. For more information, see [Introduction to Azure managed disks](../../virtual-machines/windows/managed-disks-overview.md)
- Are you using one storage account per customer, for the purpose of data isolation? For this scenario, Microsoft recommends using a blob container for each customer, instead of an entire storage account. Azure Storage now allows you to assign role-based access control (RBAC) roles on a per-container basis. For more information, see [Grant access to Azure blob and queue data with RBAC in the Azure portal](storage-auth-aad-rbac-portal.md).
- Are you using multiple storage accounts to shard to increase ingress, egress, IOPS, or capacity? In this scenario, Microsoft recommends that you take advantage of the increased limits for standard storage accounts to reduce the number of storage accounts required for your workload if possible. For more information, see [Announcing larger, higher scale storage accounts](https://azure.microsoft.com/blog/announcing-larger-higher-scale-storage-accounts/)

If your application is approaching the scalability targets for a single storage account, consider adopting one of the following approaches:  

- If your application hits the transaction target, consider using block blob storage accounts, which are optimized for high transaction rates and low and consistent latency. For more information, see [Azure storage account overview](storage-account-overview.md).
- Reconsider the workload that causes your application to approach or exceed the scalability target. Can you design it differently to use less bandwidth or capacity, or fewer transactions?
- If an application must exceed one of the scalability targets, then create multiple storage accounts and partition your application data across those multiple storage accounts. If you use this pattern, then be sure to design your application so that you can add more storage accounts in the future for load balancing. Storage accounts have no cost other than your usage in terms of data stored, transactions made, or data transferred.
- If your application hits the bandwidth targets, consider compressing data on the client side to reduce the bandwidth required to send the data to Azure Storage.
    While compressing data may save bandwidth and improve network performance, it can also have some negative impacts. Evaluate the performance impact of the additional processing requirements for data compression and decompression on the client side. Also be aware that storing compressed data can make troubleshooting more difficult because it may be more challenging to view the data using standard tools.
- If your application hits the scalability targets, then make sure that you are using an exponential backoff for retries (see [Retries](#subheading14)).  It's best to avoid approaching the scalability targets by implementing the recommendations described in this article. Howver, using an exponential backoff for retries will prevent your application from retrying rapidly and making the throttling worse.  


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

- [Azure Storage scalability and performance targets for storage accounts](../common/storage-scalability-targets.md)
- [Status and error codes](/rest/api/storageservices/Status-and-Error-Codes2)

