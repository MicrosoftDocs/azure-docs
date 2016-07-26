<properties
   pageTitle="Distribute data globally with DocumentDB | Microsoft Azure"
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
   ms.date="07/25/2016"
   ms.author="kipandya"/>
   
   
# Distribute data globally with DocumentDB

> [AZURE.NOTE] Global distribution of DocumentDB databases is generally available and automatically enabled for any newly created DocumentDB accounts. We are working to enable global distribution on all existing accounts, but in the interim, if you want global distribution enabled on your account, please [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) and we’ll enable it for you now.

Azure DocumentDB is designed to meet the needs of IoT applications consisting of millions of globally distributed devices and internet scale applications that deliver highly responsive experiences to users across the world. These database systems face the challenge of achieving low latency access to application data from multiple geographic regions with well-defined data consistency and availability guarantees. As a globally distributed database system, DocumentDB simplifies the global distribution of data by offering fully managed, multi-region database accounts that provide clear tradeoffs between consistency, availability and performance, all with corresponding guarantees. DocumentDB database accounts are offered with high availability, single digit ms latencies, multiple [well-defined consistency levels] [consistency], transparent regional failover with multi-homing APIs, and the ability to elastically scale throughput and storage across the globe. 

  
## Configuring multi-region accounts

Configuring your DocumentDB account to scale across the globe can be done in less than a minute through the Azure Portal. All you need to do is select the right consistency level among several supported well-defined consistency levels, and associate any number of Azure regions with your database account. DocumentDB consistency levels provide clear tradeoffs between specific consistency guarantee and performance. 

![DocumentDB offers multiple, well defined (relaxed) consistency models to choose from][1]

DocumentDB offers multiple, well defined (relaxed) consistency models to choose from.

Selecting the right consistency level depends on data consistency guarantee your application needs. DocumentDB automatically replicates your data across all specified regions and guarantees the consistency that you have selected for your database account. 


## Using multi-region failover 

Azure DocumentDB is able to transparently failover database accounts across multiple Azure regions – the new [multi-homing APIs][developingwithmultipleregions] guarantee that your app can continue to use a logical endpoint and is uninterrupted by the failover. Failover is controlled by you, providing the flexibility to rehome your database account in the event any of range of possible failure conditions occur, including application, infrastructure, service or regional failures (real or simulated). In the event of a DocumentDB regional failure, the service will transparently fail over your database account and your application continues to access data without losing availability. While DocumentDB offers [99.99% availability SLAs][sla], you can test your application’s end to end availability properties by simulating a regional failure both, [programmatically][arm] as well as through the Azure Portal.


## Scaling across the planet
DocumentDB allows you to independently provision throughput and consume storage for each DocumentDB collection at any scale, globally across all the regions associated with your database account. A DocumentDB collection is automatically distributed globally and managed across all of the regions associated with your database account. Collections within your database account can be distributed across any of the Azure regions in which the [DocumentDB service is available][serviceregions]. 

The throughput purchased and storage consumed for each DocumentDB collection is automatically provisioned across all regions equally. This allows your application to seamlessly scale across the globe [paying only for the throughput and storage you are using within each hour][pricing]. For instance, if you have provisioned 2 million RUs for a DocumentDB collection, then each of the regions associated with your database account gets 2 million RUs for that collection. This is illustrated below.

![Scaling throughput for a DocumentDB collection across four regions][2]

DocumentDB guarantees < 10 ms read and < 15 ms write latencies at P99. The read requests never span datacenter boundary to guarantee the [consistency requirements you have selected][consistency]. The writes are always quorum committed locally before they are acknowledged to the clients. 
Each database account is configured with write region priority. The region designated with highest priority will act as the current write region for the account. All SDKs will transparently route database account writes to the current write region. 

Finally, since DocumentDB is completely [schema-agnostic][vldb] - you never have to worry about managing/updating schemas or secondary indexes across multiple datacenters. Your [SQL queries][sqlqueries] continue to work while your application and data models continue to evolve. 


## Enabling global distribution 

You can decide to make your data locally or globally distributed by either associating one or more Azure regions with a DocumentDB database account. You can decide to globally distribute your data or confine it to a single region by adding or removing regions to your database account at any time. DocumentDB database accounts that support multi-region assignment can be created through the Azure Marketplace by selecting ‘DocumentDB – Multi-Region Database Account’. 



## Next steps

Learn more about the distributing data globally with DocumentDB in the following articles:

* [Provisioning throughput and storage for a collection] [throughputandstorage]
* [Multi-homing APIs via REST. .NET, Java, Python, and Node SDKs] [developingwithmultipleregions]
* [Consistency Levels in DocumentDB] [consistency]
* [Availability SLAs] [sla]
* [Managing database account] [manageaccount]

[1]: ./media/documentdb-distribute-data-globally/consistency-tradeoffs.png
[2]: ./media/documentdb-distribute-data-globally/collection-regions.png

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
[serviceregions]: https://azure.microsoft.com/en-us/regions/#services 
[pricing]: https://azure.microsoft.com/pricing/details/documentdb/
[sla]: https://azure.microsoft.com/support/legal/sla/documentdb/ 
[vldb]: http://www.vldb.org/pvldb/vol8/p1668-shukla.pdf
[sqlqueries]: https://azure.microsoft.com/documentation/articles/documentdb-sql-query/

