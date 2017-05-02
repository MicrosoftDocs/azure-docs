---
title: Introduction to Azure Cosmos DB | Microsoft Docs
description: Learn about Azure Cosmos DB. This globally-distributed multi-model database is built for big data, elastic scalability, and high availability.
keywords: global distribution, elastic scale, planet-scale, SLAs, json database, document database, graph database, key-value database
services: cosmosdb
author: mimig1
manager: jhubbard
editor: monicar
documentationcenter: ''

ms.assetid: 
ms.service: cosmosdb
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 04/30/2017
ms.author: mimig

---

# Introduction to Azure Cosmos DB

## What is Azure Cosmos DB?

Azure Cosmos DB, formerly known as Azure DocumentDB, is Microsoft's multi-tenant, globally distributed NoSQL database service for mission-critical applications. Azure Cosmos DB was built with global distribution and horizontal scale at its core. It offers turn-key global distribution across any number of Azure regions by transparently scaling and replicating your data wherever your users are. You can elastically scale throughput and storage worldwide and pay only for the throughput and storage you need. Azure Cosmos DB guarantees single-digit millisecond latencies at the 99th percentile anywhere in the world, offers multiple well-defined consistency models to fine-tune for performance, and guaranteed high availability with multi-homing capabilities, all backed by industry-leading service level agreements (SLAs). 

Azure Cosmos DB is truly schema-agnostic. It automatically indexes data without requiring you to deal with schema and index management. Azure Cosmos DB is multi-model – it natively supports document, key-value, graph, and columnar data models. With Azure Cosmos DB, you can access your data using NoSQL APIs of your choice - DocumentDB (document), MongoDB (document), Azure Table storage (key-value), and Gremlin (graph), are all natively supported. Azure Cosmos DB is a fully managed, enterprise ready, and trustworthy service. All your data is fully and transparently encrypted  and secure by default. Azure Cosmos DB is also ISO, FedRAMP, EU, HIPAA, and PCI compliant.  

Azure Cosmos DB provides multi-model support for the following data models and APIs:

|Data model| APIs supported|
|---|---|
|Key-value (table) data| [Tables API](documentdb-table-introduction.md)|
|Document data|[Native DocumentDB support](documentdb-introduction.md) plus support for [MongoDB APIs](documentdb-protocol-mongodb.md)|
|Graph data|[Gremlin graph APIs](documentdb-graph-introduction.md)|
 
> [!NOTE]
> Currently in public preview, Azure Table storage is offered as part of Azure Cosmos DB, and supports the same capabilities as DocumentDB and graph APIs like global distribution, automatic indexing. Azure Cosmos DB will be extended to support all existing and new tables using the Azure Table storage SDKs and APIs. To learn more, see [Azure Cosmos DB: Tables API](https://aka.ms/premiumtables).

## Why use Azure Cosmos DB?
Azure Cosmos DB offers the following key capabilities and benefits:

* **Global distribution and ability to add any number of regions anywhere in the globe:** 
Azure Cosmos DB transparently replicates your data to all regions you've associated with your Azure Cosmos DB account, enabling you to develop applications that require global access to data while providing tradeoffs between consistency, availability and performance, all with corresponding guarantees. Azure Cosmos DB provides transparent regional failover with multi-homing APIs, and the ability to elastically scale throughput and storage across the globe. Learn more in [Distribute data globally with Azure Cosmos DB](documentdb-distribute-data-globally.md).

* **Elastically scalable throughput and storage:** Easily scale up or scale down your Azure Cosmos DB database to meet your application needs. Your data is stored on solid state disks (SSD) for guaranteed and predictable low latencies. Azure Cosmos DB can scale to virtually unlimited storage sizes and provisioned throughput. You can elastically scale Azure Cosmos DB with predictable performance seamlessly as your application grows. 

* **Guaranteed single-digit-ms latency:** Serve read and write requests from the nearest region while simultaneously distributing data across the globe. With its latch-free and write optimized database engine, Azure Cosmos DB guarantees less than 10-ms latencies on reads and less than 15-ms latencies on (indexed) writes at the 99th percentile. 

* **High Availability and Failovers:** Azure Cosmos DB supports both manual and automatic failovers to ensure that accounts and applications are globally available. By using Azure Cosmos DB's global replication support, you can improve end-to-end latency and ensure that your applications are highly available even in the event of region failures.

* **Tunable consistency levels:** Select from five well-defined consistency levels to achieve optimal trade-off between consistency and performance. For queries and read operations, Azure Cosmos DB offers five distinct consistency levels: strong, bounded-staleness, session, consistent prefix and eventual. These granular, well-defined consistency levels allow you to make sound trade-offs between consistency, availability, and latency. Learn more in [Using consistency levels to maximize availability and performance in Azure Cosmos DB](documentdb-consistency-levels.md).

* **No schema or indexes ever needed:** By default, Azure Cosmos DB automatically indexes all the data in the database and does not expect or require any schema or creation of secondary indices. Don't want to index everything? Don't worry, you can [opt out](documentdb-indexing-policies.md) too.

* **Industry-leading comprehensive SLAs:** Rest assured your apps are running on world-class infrastructure, with a battle-tested service, in the most trusted cloud. Azure Cosmos DB is the first and only service to offer industry-leading 99.99% SLAs for latency at the 99th percentile, guaranteed throughput, consistency and high availability.

* **Multi-model and Multi-API support:** Only Azure Cosmos DB allows you to use key-value, graph, and document data in one service, at global scale and without worrying about schema or index management. Azure Cosmos DB automatically indexes all data, and allows you to use your favorite NoSQL API including SQL, JavaScript, Gremlin, MongoDB, and Azure Table Storage to query your data. Because Azure Cosmos DB utilizes a highly concurrent, lock free, log structured indexing technology to automatically index all data content. This enables rich real-time queries without the need to specify schema hints, secondary indexes, or views. Learn more in [Query Azure Cosmos DB](documentdb-sql-query.md). 

* **Fully managed:** Eliminate the need to manage database and machine resources. As a fully managed Microsoft Azure service, you do not need to manage virtual machines, deploy and configure software, manage scaling, or deal with complex data-tier upgrades. Every database is automatically backed up and protected against regional failures. You can easily add a Azure Cosmos DB account and provision capacity as you need it, allowing you to focus on your application instead of operating and managing your database. 

## Multi-model support in Azure Cosmos DB
Azure Cosmos DB is a comprehensive database service that provides true multi-model support. If you're looking for a high performance key-value store, document database, or a graph database, Azure Cosmos DB has you covered. A common journey for a highly scalable and performant database often start with simple key-value needs, but then as your data grows and new scenario needs arise, you need more sophisticated models like documents and  graph. This often results in application re-writes or fragmented application backends, using multiple databases. With Azure Cosmos DB, you can just start using a new set of APIs and capabilities that are directly integrated with the database and leverage the more advanced capabilities for their application without any application re-write or change in their data infrastructure.  

![The new Azure Cosmos DB multi-model approach for document, table, and Gremlin graph data, and MongoDB apps](./media/documentdb-multi-model-introduction/azure-cosmos-db-overview.png)

**Popular OSS APIs**: With popular open source APIs and frameworks, it is easy for you to start developing an application and bring it to life. The challenging part is when you need to move the application into production and you need to address issues like scale, cost, availability and maintenance. In a world where applications can go viral in a matter of hours, it is not easy to plan for these challenges ahead of time. Now, you can easily lift, and shift applications built for popular NoSQL databases like MongoDB to Azure Cosmos DB without having to worry about the cost or elastic needs of your application. Also, Azure Cosmos DB provides the MongoDB, graph and tabular application the same level of enterprise guarantees for availability, performance, throughput and consistency without requiring a single line of application change. 

**Azure Table storage and Azure DocumentDB**: Azure Cosmos DB's core capabilities like query, indexing, multi-homing, and consistency levels are offered in every data model in a consistent manner with their idiomatic access patterns. Existing and new Azure Table storage accounts and Azure DocumentDB accounts are supported by Azure Cosmos DB, and Azure DocumentDB and Azure Table storage SDKs and REST APIs are supported as variants of accessing Azure Cosmos DB. Support for high-throughput Table storage accounts is in public preview.

**Graph API**: Azure Cosmos DB provides a highly scalable graph database, compatible with the Apache TinkerPop standard. Azure Cosmos DB supports storage of massive scale, globally distributed graphs, with support for fast queries, traversals, and updates using the Gremlin graph API. Graph support is in public preview.

## Globally distributed, enterprise-ready, planet scale

Azure Cosmos DB provides global distribution and the ability to add any number of regions anywhere in the globe, elastic scale-out of throughput and latency, guaranteed low latency, failover and 99.99% availability, five well-defined consistency levels, support for multi-model and popular OSS APIs, and comprehensive SLAs.

Azure Cosmos DB provides up to [three times better price performance than other managed NoSQL database services](https://aka.ms/documentdb-tco-paper) and has at least ten times better total cost of ownership (TCO) than operating an open source NoSQL database system. As a horizontally partitioned database with automatic geo-replication, Azure Cosmos DB can automatically scale throughput from 100's of requests per second to millions of requests per second, while also scaling storage automatically to petabytes across all Azure regions. With a few clicks in the Azure portal, you can launch a new Azure Cosmos DB account, scale up or down without downtime or performance degradation, and gain visibility into resource utilization and performance metrics. Azure Cosmos DB enables you to offload the administrative burdens of operating and scaling distributed databases so they don’t have to worry about hardware provisioning, setup and configuration, replication, software patching, partitioning, or cluster scaling. Azure Cosmos DB provides both a storage-optimized pricing model for applications that need large volumes of storage, and throughput-optimized pricing model for applications that need to support a large rate of queries or transactions. 
 
Azure Cosmos DB is a cloud born distributed database that gives you the best of both worlds – the performance characteristics, flexibility and ease of use of popular APIs and open source programming model along with enterprise grade availability and durability guarantees and, low capital and operational cost of managed cloud databases without any vendor lock-in. Azure Cosmos DB automatically replicates data across selected Azure regions and is highly available (99.99% SLA) and highly performant (P99 reads < 6ms & P99 writes < 10ms), while maintaining 99.999999% durability guarantee for all data. Azure Cosmos DB delivers these unprecedented guarantees in the industry, for performance and availability by using a fast SSD based latch-free database engine co-developed by Microsoft Research and leveraging patterns used in some of the largest scale out systems on planet. Completely fault tolerant and self-healing, Azure Cosmos DB uses industry leading machine learning and high scale infrastructure to automatically monitor and mitigate any issues that could impact your workload.  

With security and privacy embedded at the core of the platform, Azure Cosmos DB makes security and privacy a priority at each step, from development to incident response. All the data stored and accessed as part of Azure Cosmos DB is always encrypted at rest and in motion. As a core Azure service, Azure Cosmos DB also provides the most comprehensive compliance coverage. 

## Next steps
Already have an Azure account? Then you can get started with Azure Cosmos DB in the [Azure Portal](https://portal.azure.com/#gallery/Microsoft.DocumentDB) by [creating an Azure Cosmos DB database account](documentdb-create-account.md).

Don't have an Azure account? You can:

* Sign up for an [Azure free trial](https://azure.microsoft.com/free/), which gives you 30 days and $200 to try all the Azure services. 
* If you have an MSDN subscription, you are eligible for [$150 in free Azure credits per month](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) to use on any Azure service. 
* Download the [Azure Cosmos DB Emulator](documentdb-nosql-local-emulator.md) to develop your application locally.

Then, when you're ready to learn more, visit our [learning path](https://azure.microsoft.com/documentation/learning-paths/documentdb/) to navigate all the learning resources available to you. 

[1]: ./media/documentdb-introduction/json-database-resources1.png
