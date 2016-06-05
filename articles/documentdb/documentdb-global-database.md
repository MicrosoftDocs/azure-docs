<properties
   pageTitle="Distribute Data Globally with Document DB | Microsoft Azure"
   description="Learn about planet-scale geo-replication, failover, and data recovery using global databases from Azure DocumentDB, a fully managed NoSQL database service."
   services="documentdb"
   documentationCenter=""
   authors="kiratp"
   manager="jhubbard"
   editor=""/>

<tags
   ms.service="documentdb"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="05/31/2016"
   ms.author="kipandya"/>
   
   
# Distribute Data Globally with Document DB

DocumentDB is designed to meet the needs of IoT applications consisting of millions of globally distributed devices or internet scale web and mobile applications that deliver highly responsive user experiences. As a globally distributed database system, DocumentDB offers high availability, single digit low latencies, multiple well-defined consistency levels, transparent regional failover with multi-homing APIs, and ability to elastically scale your throughput and storage across the globe. 

Configuring DocumentDB to scale your data across the globe is easy! All you need to do is select a consistency level among several well-defined consistency models, and associate any number of Azure regions with your database account. DocumentDB automatically replicates your data across all the regions and guarantees the consistency that you have selected for your database account. 

In an event of a regional failure, DocumentDB transparently performs failover – the new multi-homing APIs guarantee that your app can continue to use the logical endpoints and is uninterrupted by the failover. While DocumentDB offers 99.99 availability SLAs, for the purposes of testing your application’s end to end availability properties, DocumentDB also allows you to simulate a regional failure both, programmatically as well as, via Azure Portal.

DocumentDB allows you to provision throughput and storage independently at any scale globally, across all the regions associated with your database account. The throughput and storage you have purchased is automatically provisioned across all regions equally. This allows your application to seamlessly scale across the globe paying only for the throughput and storage you have provisioned for the hour. For instance, if you have provisioned 1 million RUs for a DocumentDB collection, then each of the regions associated with your database account gets 1 million RUs for that collection.

DocumentDB guarantees "<" 10 ms read and < 15ms write latencies at P99. The read requests never span datacenter boundary to guarantee the consistency requirements you have selected. The writes are always quorum committed locally before they are acknowledged to the clients. 

Finally, since DocumentDB is completely schema-agnostic - you never have to worry about managing/updating schemas or secondary indexes across datacenters. Your SQL queries continue to work while your application and data models continue to evolve.  


## Considerations for configuring global databases

For each of your existing or new DocumentDB database accounts, you can configure data to be replicated and available in multiple Azure regions. Global databases can be configured to span many Azure regions and regions can be added or removed throughout the lifespan of a database account. This section provides an overview of the considerations to take into account when configuring your global databases.\

**Throughput:** For each global database, the throughput reserved for a collection applies to each replicated instance of the collection; the throughput is not divided amongst your global databases. For example, if you have a collection with 10,000 [RU/s](documentdb-request-units.md) provisioned, this collection is able to serve up to 10,000 RU/s in each of the configured regions for a global database. This ensures that application code running in each region has reserved and predictable database throughput. Read more in [Throughput and performance](#throughput-and-performance).

**Read region preference:** By using the DocumentDB client SDKs, regionally deployed applications can specify the preferred regions from which to serve database reads. If one or more region fails, is taken offline, or is unreachable for the client, the client will automatically fail over down this list of preferred regions until a region is found that is serving requests. Read more in [Developing with global databases](#developing-with-global-databases).

**Write region preference:** Writes go to a single region at any given time. The service allows you to set your preferred order of write region selection in the Azure portal, as shown in [Selecting regions](#adding-regions). Once this is set, the service will select the top most region in this list as the write region. If one or more regions fail, the service will automatically select the first available region down the list as the write region. Read more in [Write region selection](#write-region-selection)

**Consistency:** With global databases, the benefits of weakened consistency become more relevant as data is geographically distributed for application use. Global databases dramatically simplify how you deliver highly available, multi-region applications by offering several well-defined data consistency levels to choose from in addition to supporting eventual consistency. Read more in [Tuning consistency](#tuning-consistency).

Once the global database is set up, there is no further day-to-day management necessary. The service will handle global availability of your data, and in the case of a regional failure, automatically handle failing over and recovering with minimal loss in availability.

## Throughput and performance

When you add one or more regions to a database account, each region is provisioned with the same throughput on a per-collection basis. This means that each collection has an independent, identical RU budget in each region. 

When a read or write operation is performed on a collection in a region, it will consume RUs from that collection's budget in that specific region only. Unlike other distributed database systems, the RU charge for write operations does not increase as the number of regions is increased. Also, there is no additional RU charge for receiving and persisting the replicated writes at the receiving regions. 

For example, assume that the client was performing 10 RU reads and 50 RU writes against a single region Database Account. Now, when additional regions are added to this database account, the RU charge for those same operations does not change. Each write will continue to be charged 50 RUs from the collection RU budget in the write region only (no impact on other regions). Similarly, each read will be charged 10 RUs from the budget of the collection in the region serving the operation, with no impact to other regions.


## SLA

Please refer to the [DocumentDB SLA] [sla] page for more info

## Pricing

Please refer to the [DocumentDB Pricing] [pricing] for pricing information.



[3]: ./media/documentdb-global-database/documentdb_change_consistency.jpg

<!--Reference style links - using these makes the source content way more readable than using inline links-->
[pcolls]: https://azure.microsoft.com/documentation/articles/documentdb-partition-data/
[consistency]: https://azure.microsoft.com/documentation/articles/documentdb-consistency-levels/
[regions]: https://azure.microsoft.com/regions/ 
[pricing]: https://azure.microsoft.com/pricing/details/documentdb/
[sla]: https://azure.microsoft.com/support/legal/sla/documentdb/ 


