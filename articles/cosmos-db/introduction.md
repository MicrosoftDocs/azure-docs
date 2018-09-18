---
title: Introduction to Azure Cosmos DB | Microsoft Docs
description: Learn about Azure Cosmos DB. This globally-distributed multi-model database is built for low latency, elastic scalability, high availability, and offers native support for NoSQL data.
services: cosmos-db
author: SnehaGunda
manager: kfile

ms.service: cosmos-db
ms.devlang: na
ms.topic: overview
ms.date: 04/08/2018
ms.author: sngun
ms.custom: mvc
---

# Welcome to Azure Cosmos DB

Azure Cosmos DB is Microsoft's globally distributed, multi-model database. With the click of a button, Azure Cosmos DB enables you to elastically and independently scale throughput and storage across any number of Azure's geographic regions. It offers throughput, latency, availability, and consistency guarantees with comprehensive [service level agreements](https://aka.ms/acdbsla) (SLAs), something no other database service can offer. You can [Try Azure Cosmos DB for Free](https://azure.microsoft.com/try/cosmosdb/) without an Azure subscription, free of charge and commitments.

> [!div class="nextstepaction"]
> [Try Azure Cosmos DB for Free](https://azure.microsoft.com/try/cosmosdb/)

![Azure Cosmos DB is Microsoft's globally distributed database service with elastic scale-out, guaranteed low latency, five consistency models, and comprehensive guaranteed SLAs](./media/introduction/azure-cosmos-db.png)

## Key capabilities
As a globally distributed, multi-model database service, Azure Cosmos DB makes it easy to build scalable, highly responsive applications at global scale:

* **Turnkey global distribution**
    * You can [distribute your data](distribute-data-globally.md) to any number of [Azure regions](https://azure.microsoft.com/regions/), with the [click of a button](tutorial-global-distribution-sql-api.md). This enables you to put your data where your users are, ensuring the lowest possible latency to your customers. 
    * Using Azure Cosmos DB's multi-homing APIs, the app always knows where the nearest region is and sends requests to the nearest data center. All of this is possible with no config changes. You set your write-region and as many read-regions as you want, and the rest is handled for you.
    * As you add and remove regions to your Azure Cosmos DB database, your application does not need to be redeployed and continues to be highly available thanks to the multi-homing API capability.

* **Multiple data models and popular APIs for accessing and querying data**
    * The atom-record-sequence (ARS) based data model that Azure Cosmos DB is built on natively supports multiple data models, including but not limited to document, graph, key-value, table, and column-family data models.
    * APIs for the following data models are supported with SDKs available in multiple languages:
        * [SQL API](sql-api-introduction.md): A schema-less JSON database engine with rich SQL querying capabilities.
        * [MongoDB API](mongodb-introduction.md): A massively scalable *MongoDB-as-a-Service* powered by Azure Cosmos DB platform. Compatible with existing MongoDB libraries, drivers, tools, and applications.
        * [Cassandra API](cassandra-introduction.md): A globally distributed Cassandra-as-a-Service powered by Azure Cosmos DB platform. Compatible with existing [Apache Cassandra](https://cassandra.apache.org/) libraries, drivers, tools, and applications.
        * [Gremlin API](graph-introduction.md): A fully managed, horizontally scalable graph database service that makes it easy to build and run applications that work with highly connected datasets supporting Open Gremlin APIs (based on the [Apache TinkerPop specification](http://tinkerpop.apache.org/), Apache Gremlin).
        * [Table API](table-introduction.md): A key-value database service built to provide premium capabilities (for example, automatic indexing, guaranteed low latency, global distribution) to existing Azure Table storage applications without making any app changes.
        * Additional data models and APIs are coming soon!

* **Elastically and independently scale throughput and storage on demand and worldwide**
    * Easily scale database throughput at a [per-second](request-units.md) granularity, and change it anytime you want. 
    * Scale storage size [transparently and automatically](partition-data.md) to handle your size requirements now and forever.

* **Build highly responsive and mission-critical applications**
    * Azure Cosmos DB guarantees end-to-end low latency at the 99th percentile to its customers. 
    * For a typical 1KB item, Cosmos DB guarantees end-to-end latency of reads under 10 ms and indexed writes under 15 ms at the 99th percentile, within the same Azure region. The median latencies are significantly lower (under 5 ms).

* **Ensure "always on" availability**
    * 99.99% availability SLA for all single region database accounts, and all 99.999% read availability on all multi-region database accounts.
    * Deploy to any number of [Azure regions](https://azure.microsoft.com/regions) for higher availability and better performance.
    * Dynamically set priorities to regions and [simulate a failure](regional-failover.md) of one or more regions with zero-data loss guarantees to test the end-to-end availability for the entire app (beyond just the database). 

* **Write globally distributed applications, the right way**
    * Five well-defined, practical, and intuitive [consistency models](consistency-levels.md) provide a spectrum of strong SQL-like consistency all the way to the relaxed NoSQL-like eventual consistency, and everything in-between. 
  
* **Money back guarantees**
    * Industry-leading, financially backed, comprehensive [service level agreements](https://aka.ms/acdbsla) (SLAs) for availability, latency, throughput, and consistency for your mission-critical data. 

* **No database schema/index management**
    * Rapidly iterate the schema of your application without worrying about database schema and/or index management.
    * Azure Cosmos DB’s database engine is fully schema-agnostic – it automatically indexes all the data it ingests without requiring any schema or indexes and serves blazing fast queries. 

* **Low cost of ownership**
    * Five to ten times more cost effective than a non-managed solution or an on-prem NoSQL solution.
    * Three times cheaper than AWS DynamoDB or Google Spanner.

## Capability comparison

Azure Cosmos DB provides the best capabilities of traditional relational and non-relational databases.

| Capabilities | Relational databases	| Non-relational (NoSQL) databases | 	Azure Cosmos DB |
| --- | --- | --- | --- |
| Global distribution | No | No | Yes, turnkey distribution in 30+ regions, with multi-homing APIs|
| Horizontal scale | No | Yes | Yes, you can independently scale storage and throughput | 
| Latency guarantees | No | Yes | Yes, 99% of reads in <10 ms and writes in <15 ms | 
| High availability | No | Yes | Yes, Azure Cosmos DB is always on, has well-defined PACELC tradeoffs, and offers automatic and manual failover options|
| Data model + API | Relational + SQL | Multi-model + OSS API | Multi-model + SQL + OSS API (more coming soon) |
| SLAs | Yes | No | Yes, comprehensive SLAs for latency, throughput, consistency, availability |

## Solutions that benefit from Azure Cosmos DB

Any [web, mobile, gaming, and IoT application](use-cases.md) that needs to handle massive amounts of data, reads, and writes at a [global](distribute-data-globally.md) scale with near-real response times for a variety of data will benefit from Azure Cosmos DB's [guaranteed](https://azure.microsoft.com/support/legal/sla/cosmos-db/) high availability, high throughput, low latency, and tunable consistency. Learn about how Azure Cosmos DB can be applied to [IoT and telematics](use-cases.md#iot-and-telematics), [Retail and marketing](use-cases.md#retail-and-marketing), [Gaming](use-cases.md#gaming) and [Web and mobile applications](use-cases.md#web-and-mobile-applications).

## Next steps
Get started with Azure Cosmos DB with one of our quickstarts:

* [Get started with Azure Cosmos DB SQL API](create-sql-api-dotnet.md)
* [Get started with Azure Cosmos DB MongoDB API](create-mongodb-nodejs.md)
* [Get started with Azure Cosmos DB Cassandra API](create-cassandra-dotnet.md)
* [Get started with Azure Cosmos DB Gremlin API](create-graph-dotnet.md)
* [Get started with Azure Cosmos DB Table API](create-table-dotnet.md)

> [!div class="nextstepaction"]
> [Try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/)
