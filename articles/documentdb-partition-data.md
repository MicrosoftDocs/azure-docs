<properties      
    pageTitle="Partitioning data in DocumentDB | Azure"      
    description="Learn about how to partition data in DocumentDB, and when to use Hash, Range and Lookup partitioning."          
    services="documentdb"      
    authors="arramac"      
    manager="johnmac"      
    editor="monicar"      
    documentationCenter=""/> 
<tags      
    ms.service="documentdb"      
    ms.workload="data-services"      
    ms.tgt_pltfrm="na"      
    ms.devlang="na"      
    ms.topic="article"      
    ms.date="02/20/2015"      
    ms.author="arramac"/> 

# Partitioning data in DocumentDB

[Microsoft Azure DocumentDB](../../services/documentdb/) is designed to help you achieve fast, predictable performance and *scale-out* seamlessly along with your application as it grows. DocumentDB has been used to power high-scale production services at Microsoft like the User Data Store that powers the MSN suite of web and mobile apps. 

You can achieve near-infinite scale in terms of storage and throughput for your DocumentDB application by horizontally partitioning your data - a concept commonly referred to as **sharding**.  DocumentDB accounts can be scaled linearly with cost via stackable units a.k.a. **collections**. How you best partition your data across collections will depend on your data format and access patterns. 

After reading this article you will be able to answer the following questions:   

 - What is hash, range and lookup partitioning?
 - When would you use each partitioning technique and why?
 - How do you go about building a partitioned application on Azure DocumentDB?

## Collections = Partitions

Before we dive deeper on data partitioning techniques, it is important to understand what a collection is and what it isn't. As you may already know, a collection is a container for your JSON documents. Collections in DocumentDB are not just *logical* containers, but also *physical* containers. They are the transaction boundary for stored procedures and triggers, and the entry point to queries and CRUD operations. Each collection is assigned a reserved amount of throughput which is not shared with other collections in the same account. Therefore you can scale out your application both in terms of storage and throughput by adding more collections, and then distributing your documents across them.

Collections are not the same as tables in relational databases. Collections do not enforce schema. Therefore you can store different types of documents with diverse schemas in the same collection. You can however choose to use collections to store objects of a single type like you would with tables. The best model depends only on how the data appears together in queries and transactions.

## Partitioning with DocumentDB

The most common techniques used for partitioning data with Azure DocumentDB are *range partitioning*, *lookup partitioning*, and *hash partitioning*. Usually you designate a single JSON property name within your document as your partition key like "timestamp" or "userID". In some cases, this might instead be an inner JSON property, or a different property name for each distinct type of document.

Let's take a look at these techniques in some more detail.

## Range partitioning

In range partitioning, partitions are assigned based on whether the partition key is within a certain range. This is commonly used for partitioning with *time stamp* properties (e.g., eventTime between Feb 1, 2015 and Feb 2, 2015). 

> [AZURE.TIP] You should use Range partitioning if your queries are restricted to specifc range values against the partition key.

## Lookup partitioning

In lookup partitioning, partitions are assigned based on a lookup map that assigns discrete partition values to specific partitions a.k.a. a partition or shard map. This is commonly used for partitioning by region (e.g. the partition for Scandinavia contains Norway, Denmark, and Sweden).

> [AZURE.TIP] Lookup partitioning offers the highest degree of control in managing a multi-tenant application. You can assign multiple tenants to a single collection, single tenant to a single collection, or even a single tenant across multiple collections. 

## Hash partitioning

In hash partitioning, partitions are assigned based on the value of a hash function, allowing you to evenly distribute requests and data across a number of partitions. This is commonly used to partition data produced or consumed from a large number of distinct clients, and is useful for storing user profiles, catalog items, and IoT ("Internet of Things") telemetry data. 

> [AZURE.TIP] You should use hash partitioning whenever there are too many entities to enumerate through lookup partitioning (e.g. users or devices) and the request rate is fairly uniform across entities.

## Choosing the right partitioning technique

So which partitioning technique is right for you? It depends on the type of data and your common access patterns. Picking the right partitioning technique at design time allows you to avoid technical debt, and handle growth in data size and request volumes.

- **Range partitioning** is generally used in the context of dates, as it gives you an easy and natural mechanism for aging out partitions by timestamp. It is also useful when queries are generally constrained to a time range since that is aligned with the partitioning boundaries. 
- **Lookup partitioning** allows you to group and organize unordered and unrelated sets of data in a natural way e.g., group tenants by organization or states by geographic region. Lookup also offers fine-grained control for migrating data between collections. 
- **Hash partitioning** is useful for uniform load balancing of requests to make effective use of your provisioned storage and throughput. Using *consistent hashing* algorithms allow you to minimize the amount of data that has to be moved when adding or removing a partition.

You don't have to choose just one partitioning technique. A *composite* of these techniques can also be useful depending on the scenario. For example, if you're storing vehicle telemetry data, a good approach would be to partition device telemetry data by range on timestamp for easy manageability of partitions, then sub-partition on VIN (vehicle identification number) in order to scale-out for throughput (range-hash composite partitioning).

## Developing a partitioned application
There are three key design areas to look at when developing a partitioned application on DocumentDB.

- How you route your creates and reads (including queries) to the right collections.
- How you persist and retrieve your partition resolution configuration, a.k.a. partition maps.
- How you add/remove partitions as your data and request volume increases.

Let's take a closer look at each of these areas.

## Routing creates and queries

Routing document creation requests is straight-forward for all three techniques we've discussed so far. The document is created on the partition from the hash, lookup, or range value corresponding to the partition key.

Queries and reads should typically be scoped to a single partition key, so queries can be fanned out to only the matching partitions. Queries across all data however, would require you to *fan-out* the request across multiple partitions, then merge the results. Keep in mind that some queries might have to perform custom logic to merge results for e.g. when fetching the top N results.

## Managing your partition map

You also need to decide how you will store your partition map, how your clients load it and receive updates when it changes, and how it is shared across multiple clients. If the partition map does not change often, you can simply save it in your application config file. 

If not, you can store it in any persistent store. A common design pattern we've seen in production is to serialize partition maps as JSON, and store them within DocumentDB collections as well. Clients can then cache the map in order to avoid the extra round trips, and then poll for changes periodically. If your clients might modify the shard map, ensure that they use a consistent naming schema and use optimistic concurrency (eTags) to allow consistent updates to the partition map.

## Adding and removing partitions

With DocumentDB, you can add and remove create collections at any time and use them to store new incoming data or re-balance data available on existing collections. Review the [Limits](documentdb-limits.md) page for the number of collections. You can always call us to increase these limits.

Adding and removing a new partition with lookup and range partitioning is straightforward. For example, adding a new geographic region or new time range for recent data, you just need to append the new partitions to the partition map. Splitting an existing partition into multiple partitions, or merge two partitions requires a little more effort. You need to either 

- Take the shard offline for reads.
- Route reads to both the partitions using the old partitioning configuration as well as the new partitioning configuration during migration. Note that transactions and consistency level guarantees will not be available until migration is complete.

Hashing is relatively more complicated for adding and removing partitions. Simple hashing techniques will cause shuffling, and require most of the data to get moved around. Using **consistent hashing** ensures that only a fraction of data needs to get moved.

A relatively easy way to add new partitions without requiring data movement is to  "spill over" your data to a fresh collection, and then fan-out requests across both the old and new collections. This approach, however, should be used only in rare situations (e.g. spill over in peak time workloads and to hold data temporarily until it can be moved).

## Next Steps
In this article, we've introduced some common techniques on how you can partition data with DocumentDB, and when to use which technique or combination of techniques. Get started with one of the [supported SDKs](https://msdn.microsoft.com/library/azure/dn781482.aspx), and contact us through the [MSDN support forums](https://social.msdn.microsoft.com/forums/azure/home?forum=AzureDocumentDB) if you have questions.

