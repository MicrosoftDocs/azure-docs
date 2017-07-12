---
title: Introduction to Azure Cosmos DB | Microsoft Docs
description: Learn about Azure Cosmos DB. This globally-distributed multi-model database is built for low latency, elastic scalability, and high availability.
services: cosmos-db
author: mimig1
manager: jhubbard
editor: monicar
documentationcenter: ''

ms.assetid: a855183f-34d4-49cc-9609-1478e465c3b7
ms.service: cosmos-db
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 07/12/2017
ms.author: mimig
ms.custom: mvc
---

# Welcome to Azure Cosmos DB

Azure Cosmos DB is Microsoft's globally distributed, multi-model database. With the click of a button, Azure Cosmos DB enables you to elastically and independently scale throughput and storage across any number of Azure's geographic regions. It offers throughput, latency, availability, and consistency guarantees with comprehensive [service level agreements](https://aka.ms/acdbsla) (SLAs), something no other database service can offer.

![Azure Cosmos DB is Microsoft's globally distributed database service with elastic scale out, guaranteed low latency, five consistency models, and comprehensive guaranteed SLAs](./media/introduction/azure-cosmos-db.png)

## Key capabilities
As a globally distributed database service, Azure Cosmos DB provides the following capabilities to help you build scalable, globally distributed, highly responsive applications:

* **Turnkey global distribution**
    * You can [distribute your data](distribute-data-globally.md) to any number of Azure regions, with the [click of a button](tutorial-global-distribution-documentdb.md). This enables you to put your data where your users are, ensuring the lowest possible latency to your customers. 
    * Azure is constantly growing its geographical presence by bringing [new regions](https://azure.microsoft.com/en-us/regions/) online.


* **Multiple data models and popular APIs for accessing and querying data**
    * The atom-record-sequence (ARS) based data model that Azure Cosmos DB is built on natively supports multiple data models, including but not limited to document, graph, key-value, table, and columnar.
    * APIs for the following data models are available in multiple languages:
        * DocumentDB API
        * MongoDB API
        * Graph (Gremlin) API
        * Table API
        * Additional data models coming soon 

* **Elastically scale throughput and storage on demand, worldwide**
    * Easily scale database throughput at [second](request-units.md) and [minute](request-units-per-minute.md) granularities, and change it anytime you want. 
    * Scale storage size [transparently and automatically](partition-data.md) to cover your size requirements now and forever.

* [**Build highly responsive and mission-critical applications**](#low-latency) 
    * Get access to your data with single digit millisecond latencies at the 99th percentile, anywhere in the world. 

* [**Ensure "always on" availability**](#high-availability)
    * 99.99% availability within a single region.
    * Deploy to any number of [Azure regions](https://azure.microsoft.com/regions) for higher availability.
    * [Simulate a failure](regional-failover.md) of one or more regions with zero-data loss guarantees. 

* [**Write globally distributed applications, the right way**](consistency-levels.md)
    * Five consistency models models offer strong SQL-like consistency to NoSQL-like eventual consistency, and every thing in between. 
  
* [**Money back guarantees**](#sla) 
    * Your data gets there fast, or your money back. 
    * [Service level agreements](https://aka.ms/acdbsla) for availability, latency, throughput, and consistency. 

* [**No database schema/index management**](#schema-free)
    * Stop worrying about keeping your database schema and indexes in-sync with your application’s schema. We're schema-free. 

* [**Low cost of ownership**](#tco)
    * Five to ten times [more cost effective](https://aka.ms/documentdb-tco-paper) than a non-managed solution.
    * Three times cheaper than DynamoDB.

## Capability comparison

Azure Cosmos DB provides the best capabilities of relational and non-relational databases.

| Capabilities | Relational databases	| Non-relational (NoSQL) databases | 	Azure Cosmos DB |
| --- | --- | --- | --- |
| Global distribution | No | No | Yes, turnkey distribution in 30+ regions, with multi-homing APIs|
| Horizontal scale | No | Yes | Yes, you can independently scale storage and throughput | 
| Latency guarantees | No | Yes | Yes, 99% of reads in <10 ms and writes in <15 ms | 
| High availability | No | Yes | Yes, Cosmos DB is always on, has PACELC tradeoffs, and provides automatic & manual failover options|
| Data model + API | Relational + SQL | Multi-model + OSS API | Multi-model + SQL + OSS API (more coming soon) |
| SLAs | Yes | No | Yes, comprehensive SLAs for latency, throughput, consistency, availability |


## Next steps
Get started with Azure Cosmos DB with one of our quickstarts:

* [Get started with Azure Cosmos DB's DocumentDB API](create-documentdb-dotnet.md)
* [Get started with Azure Cosmos DB's MongoDB API](create-mongodb-nodejs.md)
* [Get started with Azure Cosmos DB's Graph API](create-graph-dotnet.md)
* [Get started with Azure Cosmos DB's Table API](create-table-dotnet.md)
