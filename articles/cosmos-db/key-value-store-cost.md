---
title: Azure Cosmos DB as a key value store – Cost overview | Microsoft Docs
description: Learn about the low cost of using Azure Cosmos DB as a key value store.
keywords: key value store
services: cosmos-db
author: ArnoMicrosoft
manager: jhubbard
editor: ''
tags: ''
documentationcenter: ''

ms.assetid: 7f765c17-8549-4509-9475-46394fc3a218
ms.service: cosmos-db
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/22/2017
ms.author: acomet
---

# Azure Cosmos DB as a key value store – Cost overview

Azure Cosmos DB is a globally distributed, multi-model database service for building highly available, large scale applications easily. By default, Azure Cosmos DB automatically indexes all the data it ingests, efficiently. This enables fast and consistent [SQL](documentdb-sql-query.md) (and [JavaScript](programming.md)) queries on any kind of data. 

This article describes the cost of Azure Cosmos DB for simple write and read operations when it’s used as a key/value store. Write operations include inserts, replaces, deletes, and upserts of documents. Besides guaranteeing 99.99% high availability, Azure Cosmos DB offers guaranteed <10 ms latency for reads and <15 ms latency for the (indexed) writes respectively, at the 99th percentile. 

## Why we use Request Units (RUs)

Azure Cosmos DB performance is based on the amount of provisioned [Request Units](request-units.md) (RU) for the partition. The provisioning is at a second granularity and is purchased in RUs/sec ([not to be confused with the hourly billing](https://azure.microsoft.com/pricing/details/cosmos-db/)). RUs should be considered as a currency that simplifies the provisioning of required throughput for the application. Our customers do not have to think of differentiating between read and write capacity units. The single currency model of RUs creates efficiencies to share the provisioned capacity between reads and writes. This provisioned capacity model enables the service to provide a predictable and consistent throughput, guaranteed low latency, and high availability. Finally, we use RU to model throughput but each provisioned RU has also a defined amount of resources (Memory, Core). RU/sec is not only IOPS.

As a globally distributed database system, Azure Cosmos DB is the only Azure service that provides an SLA on latency, throughput, and consistency in addition to high availability. The throughput you provision is applied to each of the regions associated with your Azure Cosmos DB database account. For reads, Azure Cosmos DB offers multiple, well-defined [consistency levels](consistency-levels.md) for you to choose from. 
Azure Cosmos DB is a globally distributed, multi-model database service for building highly available, large scale, [globally distributed](distribute-data-globally.md) applications easily. By default, Cosmos DB automatically indexes all the data it ingests, efficiently. This enables fast and consistent [SQL](documentdb-sql-query.md) (and [JavaScript](programming.md)) queries on any kind of data. 

This article describes the cost of Cosmos DB for simple write and read operations when it’s used as a key/value store. Write operations include inserts, replaces, deletes, and upserts of documents. Besides guaranteeing 99.99% high availability, Cosmos DB offers guaranteed <10 ms latency for reads and <15 ms latency for the (indexed) writes respectively, at the 99th percentile. 

## Why we use Request Units (RUs)

Cosmos DB performance is based on the amount of provisioned [Request Units](request-units.md) (RU) for the partition. The provisioning is at a second granularity and is purchased in RUs/sec and RUs/min ([not to be confused with the hourly billing](https://azure.microsoft.com/pricing/details/cosmos-db/)). RUs should be considered as a currency that simplifies the provisioning of required throughput for the application. Our customers do not have to think of differentiating between read and write capacity units. The single currency model of RUs creates efficiencies to share the provisioned capacity between reads and writes. This provisioned capacity model enables the service to provide a predictable and consistent throughput, guaranteed low latency, and high availability. Finally, we use RU to model throughput but each provisioned RU has also a defined amount of resources (Memory, Core). RU/sec is not only IOPS.

As a globally distributed database system, Cosmos DB is the only Azure service that provides an SLA on latency, throughput, and consistency in addition to high availability. The throughput you provision is applied to each of the regions associated with your Cosmos DB database account. For reads, Cosmos DB offers multiple, well-defined [consistency levels](consistency-levels.md) for you to choose from. 

The following table shows the number of RUs required to perform read and write transactions based on document size of 1KB and 100KBs.

|Item Size|1 Read|1 Write|
|-------------|------|-------|
|1 KB|1 RU|5 RUs|
|100 KB|10 RUs|50 RUs|

## Cost of Reads and Writes

If you provision 1,000 RU/sec, this amounts to 3.6m RU/hour and will cost $0.08 for the hour (in the US and Europe). For a 1KB size document, this means that you can consume 3.6m reads or 0.72m writes (3.6mRU / 5) using your provisioned throughput. Normalized to million reads and writes, the cost would be $0.022 /m reads ($0.08 / 3.6) and $0.111/m writes ($0.08 / 0.72). The cost per million becomes minimal as shown in the table below.

|Item Size|1m Read|1m Write|
|-------------|-------|--------|
|1 KB|$0.022|$0.111|
|100 KB|$0.222|$1.111|


Most of the basic blob or object stores services charge $0.40 per million read transaction and $5 per million write transaction. If used optimally, Cosmos DB can be up to 98% cheaper than these other solutions (for 1KB transactions).

## Next steps

Stay tuned for new articles on optimizing Cosmos DB resource provisioning. In the meantime, feel free to use our [RU calculator](https://www.documentdb.com/capacityplanner).

