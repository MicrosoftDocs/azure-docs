---
title: Introduction to Azure Cosmos DB's Table API | Microsoft Docs
description: Learn how you can use Azure Cosmos DB to store and query massive volumes of key-value data with low latency using the popular OSS MongoDB APIs.
services: documentdb
author: bhanupr
manager: jhubbard
editor: monicar
documentationcenter: ''

ms.assetid: 
ms.service: documentdb
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 04/30/2017
ms.author: bhanupr

---
# Introduction to Azure Cosmos DB: Table API

Azure Cosmos DB, formerly known as Azure DocumentDB, is Microsoft's multi-tenant, globally distributed NoSQL database service for mission-critical applications. Azure Cosmos DB was built with global distribution and horizontal scale at its core. It offers turn-key global distribution across any number of Azure regions by transparently scaling and replicating your data wherever your users are. You can elastically scale throughput and storage worldwide and pay only for the throughput and storage you need. Azure Cosmos DB guarantees single-digit millisecond latencies at the 99th percentile anywhere in the world, offers multiple well-defined consistency models to fine-tune for performance, and guaranteed high availability with multi-homing capabilities, all backed by industry-leading service level agreements (SLAs). 

Azure Cosmos DB is truly schema-agnostic. It automatically indexes data without requiring you to deal with schema and index management. Azure Cosmos DB is multi-model - it natively supports document, key-value, graph, and columnar data models. With Azure Cosmos DB, you can access your data using NoSQL APIs of your choice - DocumentDB (document), MongoDB (document), Azure Table storage (key-value), and Gremlin (graph), are all natively supported. Azure Cosmos DB is a fully managed, enterprise ready, and trustworthy service. All your data is fully and transparently encrypted  and secure by default. Azure Cosmos DB is also ISO, FedRAMP, EU, HIPAA, and PCI compliant.  

Azure Cosmos DB provides the Table API for applications that need a key-value store with a schema-less design. Existing and new Azure Table storage accounts are supported by Azure Cosmos DB, and Azure Table storage SDKs and REST APIs are supported as variants of accessing Azure Cosmos DB. Azure Cosmos DB is designed to support key-value workloads that need a large volume of storage that's infrequently accessed, as well as key-value workloads that need reserved throughput, and high request rates. Azure Cosmos DB supports throughput-optimized tables (informally called "premium tables"), in public preview. You can continue to create and use storage-optimized tables using the Azure storage SDK and API.

## When to use the preview Premium Table SDK
**Low Latency** - Rely on less than 10 ms latency on reads and less than 15ms latency on writes for at least 99 percent of requests. The data is stored in solid state drives, and the requests are served from regions closest to your users by distributing your data around the world. 

**Global Distribution** - With Azure Table Storage, data is replicated to 1 region with Geo-redundant storage (GRS) or Read-access geo-redundant storage (RA-GRS) account. The secondary region is determined based on primary region and cannot be changed. With RA-GRS, you can read from secondary region. Since, replication to the secondary region is done asynchronously, this provides an eventual consistent version of the data to read from. With Premium Table SDK, customer can now replicate data to all regions, you�ve associated with your account. You can dynamically add or remove regions, configure failover priority for automatic failover, do manual failover, configure read and write regions. Besides, you can also tune consistency to well-defined relaxed consistency levels. Read [here](https://docs.microsoft.com/en-us/azure/documentdb/documentdb-distribute-data-globally#Latency-guarantees) for more details. 

**Automatic Indexing** - Azure Cosmos DB automatically indexes all the entities in the table and does not expect or require the schema or creation of secondary indices. You can also include/exclude paths to/from index.  

**Limitless Scale** - With Azure Table Storage, you can reach up to 20,000 transactions per second and scale storage elastically. With Premium Table SDK, you can scale throughput and storage independently and elastically. You can add capacity to serve millions of requests per second with ease.

**Tunable Consistency levels** - You can select from five well defined consistency levels: Strong, Session, Bounded-Staleness, Consistent Prefix and Eventual. Learn [more](https://docs.microsoft.com/en-us/azure/documentdb/documentdb-consistency-levels) to maximize availability and performance. 

## What changes with Azure Table storage?
Now a part of Azure Cosmos DB, Azure Table storage customers will be able to get guaranteed low latency, rich queries over a flexible data model, predictable performance, tunable consistency levels, and/or global distribution to provide low-latency access to any number of regions for a single table. The table summarizes Azure Table storage previously, and now as offered as an API of Azure Cosmos DB.

If you currently use Azure Table storage, we you continue to use your existing applications and tools written using the Azure Storage client libraries and APIs. You can also the new "Premium Table SDK" preview to gain access to these features for new and existing applications. We recommend using the new SDKs for all new applications.   

|  | Azure Table Storage | Azure Cosmos DB: Table storage (preview) |
| --- | --- | --- |
| Latency | Fast, but no upper bounds on latency | Single-digit millisecond latency for reads and writes, backed with <10 ms latency reads and <15 ms latency wites at the 99th percentile |
| Throughput | Highly scalable, but no dedicated throughput model. Tables have a scalability limit of 20,000 operations/s | Massively scalable with dedicated reserved throughput, that is backed by SLAs. Accounts have no upper limit on throughput, and use >10 million operations/s per collection in practice |
| Global Distribution | Single region with one optional readable secondary read region for HA. You cannot initiate failover | Accounts can be mapped to up to 30+ regions,.  |
| Indexing | Only primary index on PartitionKey and RowKey. No secondary indexes | Automatic and complete indexing on all properties, no index management |
| Query | Limited ODATA. Query execution uses index for primary key, and scans otherwise. | Expanded ODATA support to cover Azure Cosmos DB capabilities including aggregates, geo-spatial, and sorting. Queries can take advantage of automatic indexing on properties. |
| Pricing | Storage-optimized  | Throughput-optimized and Storage-optimized |


## How to get started?

Create an Azure Cosmos DB account in the [Azure Portal](https://portal.azure.com), and get started with our quickstart tutorial for the Table API.

*And, that's it!*

For more detailed instructions, follow create account and connect to your account.

## Next steps

Here are a few pointers to get you started:
* Get started with Azure Cosmos DB's Table API using existing NET Table SDK.
* Follow the connect to your account tutorial to learn how to get your account connection string information.
* Explore Azure Cosmos DB's Table API samples.