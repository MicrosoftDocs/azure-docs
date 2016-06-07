<properties
   pageTitle="Distribute Data Globally with DocumentDB | Microsoft Azure"
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
   
   
# Distribute Data Globally with DocumentDB

DocumentDB is designed to meet the needs of IoT applications consisting of millions of globally distributed devices or internet scale web and mobile applications that deliver highly responsive user experiences. As a globally distributed database system DocumentDB offers clear tradeoffs between consistency, availability and performance and offers corresponding guarantees. DocumentDB offers high availability, single digit low latencies, multiple [well-defined consistency levels] [consistency], transparent regional failover with multi-homing APIs, and ability to elastically scale your throughput and storage across the globe. 

Configuring DocumentDB to scale your data across the globe is easy! All you need to do is select the right consistency level among several supported [well-defined consistency models] [consistency], and associate any number of Azure regions with your database account. DocumentDB consistency levels provide clear [tradeoffs between specific consistency guarantees and performance] [consistencytradeooffs]. Selecting the right consistency level depends on specific consistency guarantee your application needs. DocumentDB automatically replicates your data across all the regions and guarantees the consistency that you have selected for your database account. 

In an event of a regional failure, DocumentDB transparently performs failover – the new [multi-homing APIs] [developingwithmultipleregions] guarantee that your app can continue to use the logical endpoints and is uninterrupted by the failover. While DocumentDB offers [99.99% availability SLAs] [sla], for the purposes of testing your application’s end to end availability properties, DocumentDB also allows you to simulate a regional failure both, [programmatically] [arm] as well as, via [Azure Portal] [manageaccount].

DocumentDB allows you to independently provision throughput and storage at any scale globally, across all the regions associated with your database account. A DocumentDB collection is the fundamental unit of scalability. A DocumentDB collection is mapped onto one or more partitions – each acting as transaction domain for the data it manages. DocumentDB automatically manages partitions which underlie a DocumentDB collection and allows you to [seamlessly scale the throughput or storage for a given collection] [pcolls]. Each partition comprising a DocumentDB collection, is made highly available by virtue of a set of local replicas. 

![Alt text; Collections span multiple partitions, each of which is replicated][1]

The partitions underlying a DocumentDB collection are automatically distributed globally and managed across all of the regions associated with your database account. The following picture illustrates how a single DocumentDB collection is globally distributed across five different Azure regions. Indeed DocumentDB allows you to scale your data across the planet with predictable low latencies, guaranteed high availability and well defined consistency.  

![Alt text; Paftitions are the building block of global availability][2]
 
The throughput and storage you have purchased for a given DocumentDB collection is automatically provisioned across all regions equally. This allows your application to seamlessly scale across the globe [paying only for the throughput and storage you have provisioned for the hour] [pricing]. For instance, if you have provisioned 1 million RUs for a DocumentDB collection, then each of the regions associated with your database account gets 1 million RUs for that collection.
DocumentDB guarantees < 10 ms read and < 15ms write latencies at P99. The read requests never span datacenter boundary to guarantee the [consistency requirements you have selected] [consistency]. The writes are always quorum committed locally before they are acknowledged to the clients. 

Finally, since DocumentDB is completely [schema-agnostic] [vldb] - you never have to worry about managing/updating schemas or secondary indexes across multiple datacenters. Your [SQL queries] [sqlqueries] continue to work while your application and data models continue to evolve.  
  

## Enabling global distribution for your databse account

Enabling global distribution for your database account
You can decide to make your data locally or globally distributed by either associating one or more Azure regions with a DocumentDB database account. You can decide to globally distribute your data or confine it to a single region by adding or removing regions to your database account at any time. Assuming you have already [created a database account] [createaccount], you need to perform the following steps for controlling how your data is distributed: 
1. [Select consistency level for your database account] [manageaccount-consistency]
2. [Add or remove Azure regions to your database account] [manageaccount-addregion]


## Additional References
* [Provisioning throughput and storage for a collection] [throughputandstorage]
* [Multi-homing APIs via REST. .NET, Java, Python, and Node SDKs] [developingwithmultipleregions]
* [Consistency Levels in DocumentDB] [consistency]
* [Availability SLAs] [sla]
* [Managing database account] [manageaccount]


[1]: ./media/documentdb-global-database/collection-partitions.png
[2]: ./media/documentdb-global-database/collection-regions.png
[3]: ./media/documentdb-global-database/documentdb_change_consistency.jpg

<!--Reference style links - using these makes the source content way more readable than using inline links-->
[pcolls]: https://azure.microsoft.com/documentation/articles/documentdb-partition-data/
[consistency]: https://azure.microsoft.com/documentation/articles/documentdb-consistency-levels/
[consistencytradeooffs]: ./documentdb-consistency-levels/#consistency-levels-and-tradeoffs
[developingwithmultipleregions]: https://azure.microsoft.com/documentation/articles/documentdb-developing-with-multiple-regions/
[createaccount]: https://azure.microsoft.com/documentation/articles/documentdb-create-account/
[manageaccount]: https://azure.microsoft.com/documentation/articles/documentdb-manage-account/
[manageaccount-consistency]: https://azure.microsoft.com/documentation/articles/documentdb-manage-account/#consistency
[manageaccount-addregion]: https://azure.microsoft.com/documentation/articles/documentdb-manage-account/#addregion
[throughputandstorage]: https://azure.microsoft.com/documentation/articles/documentdb-manage/
[arm]: https://azure.microsoft.com/en-us/documentation/articles/documentdb-automation-resource-manager-cli/
[regions]: https://azure.microsoft.com/regions/ 
[pricing]: https://azure.microsoft.com/pricing/details/documentdb/
[sla]: https://azure.microsoft.com/support/legal/sla/documentdb/ 
[vldb]: http://www.vldb.org/pvldb/vol8/p1668-shukla.pdf
[sqlqueries]: https://azure.microsoft.com/documentation/articles/documentdb-sql-query/

