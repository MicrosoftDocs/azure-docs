---
title: Request unit charges for Azure Cosmos DB as a key value store
description: Learn about the request unit charges of Azure Cosmos DB for simple write and read operations when it’s used as a key/value store.
author: SnehaGunda
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/23/2019
ms.author: sngun
ms.custom: seodec18
---

# Azure Cosmos DB as a key value store – Cost overview

Azure Cosmos DB is a globally distributed, multi-model database service for building highly available, large-scale applications easily. By default, Azure Cosmos DB automatically indexes all the data it ingests, efficiently. This enables fast and consistent [SQL](how-to-sql-query.md) (and [JavaScript](stored-procedures-triggers-udfs.md)) queries on any kind of data. 

This article describes the cost of Azure Cosmos DB for simple write and read operations when it’s used as a key/value store. Write operations include inserts, replaces, deletes, and upserts of documents. Besides guaranteeing a 99.99% availability SLA for all single region accounts and all multi-region accounts with relaxed consistency, and 99.999% read availability on all multi-region database accounts, Azure Cosmos DB offers guaranteed <10-ms latency for reads and for the (indexed) writes respectively, at the 99th percentile. 

## Why we use Request Units (RUs)

Azure Cosmos DB performance is based on the amount of provisioned [Request Units](request-units.md) (RU) for the partition. The provisioning is at a second granularity and is purchased in RUs/sec ([not to be confused with the hourly billing](https://azure.microsoft.com/pricing/details/cosmos-db/)). RUs should be considered as a currency that simplifies the provisioning of required throughput for the application. Our customers do not have to think of differentiating between read and write capacity units. The single currency model of RUs creates efficiencies to share the provisioned capacity between reads and writes. This provisioned capacity model enables the service to provide a predictable and consistent throughput, guaranteed low latency, and high availability. Finally, we use RU to model throughput, but each provisioned RU also has a defined amount of resources (Memory, Core). RU/sec is not only IOPS.

As a globally distributed database system, Cosmos DB is the only Azure service that provides an SLA on latency, throughput, and consistency in addition to high availability. The throughput you provision is applied to each of the regions associated with your Cosmos DB database account. For reads, Cosmos DB offers multiple, well-defined [consistency levels](consistency-levels.md) for you to choose from. 

The following table shows the number of RUs required to perform read and write transactions based on document size of 1 KB and 100 KBs.

|Item Size|1 Read|1 Write|
|-------------|------|-------|
|1 KB|1 RU|5 RUs|
|100 KB|10 RUs|50 RUs|

## Cost of reads and writes

If you provision 1,000 RU/sec, this amounts to 3.6-m RU/hour and will cost $0.08 for the hour (in the US and Europe). For a 1-KB size document, this means that you can consume 3.6-m reads or 0.72-m writes (3.6-m RU / 5) using your provisioned throughput. Normalized to million reads and writes, the cost would be $0.022 /m reads ($0.08 / 3.6) and $0.111/m writes ($0.08 / 0.72). The cost per million becomes minimal as shown in the table below.

|Item Size|1-m Read|1 m Write|
|-------------|-------|--------|
|1 KB|$0.022|$0.111|
|100 KB|$0.222|$1.111|


Most of the basic blob or object stores services charge $0.40 per million read transaction and $5 per million write transaction. If used optimally, Cosmos DB can be up to 98% cheaper than these other solutions (for 1-KB transactions).

## Next steps

Stay tuned for new articles on optimizing Azure Cosmos DB resource provisioning. In the meantime, feel free to use our [RU calculator](https://www.documentdb.com/capacityplanner).

