---
title: Request unit charges for Azure Cosmos DB as a key value store
description: Learn about the request unit charges of Azure Cosmos DB for simple write and read operations when it’s used as a key/value store.
author: deborahc
ms.author: dech
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.date: 08/23/2019
ms.custom: seodec18, ignite-2022
---

# Azure Cosmos DB as a key value store – cost overview
[!INCLUDE[NoSQL](includes/appliesto-nosql.md)]

Azure Cosmos DB is a globally distributed, multi-model database service for building highly available, large-scale applications easily. By default, Azure Cosmos DB automatically and efficiently indexes all the data it ingests. This enables fast and consistent [SQL](nosql/query/getting-started.md) (and [JavaScript](stored-procedures-triggers-udfs.md)) queries on the data. 

This article describes the cost of Azure Cosmos DB for simple write and read operations when it’s used as a key/value store. Write operations include inserts, replaces, deletes, and upserts of data items. Besides guaranteeing a 99.999% availability SLA for all multi-region accounts, Azure Cosmos DB offers guaranteed <10-ms latency for reads and for the (indexed) writes, at the 99th percentile. 

## Why we use Request Units (RUs)

Azure Cosmos DB performance is based on the amount of provisioned throughput expressed in [Request Units](request-units.md) (RU/s). The provisioning is at a second granularity and is purchased in RU/s ([not to be confused with the hourly billing](https://azure.microsoft.com/pricing/details/cosmos-db/)). RUs should be considered as a logical abstraction (a currency) that simplifies the provisioning of required throughput for the application. Users do not have to think of differentiating between read and write throughput. The single currency model of RUs creates efficiencies to share the provisioned capacity between reads and writes. This provisioned capacity model enables the service to provide a **predictable and consistent throughput, guaranteed low latency, and high availability**. Finally, while RU model is used to depict throughput, each provisioned RU also has a defined amount of resources (e.g., memory, cores/CPU and IOPS).

As a globally distributed database system, Azure Cosmos DB is the only Azure service that provides comprehensive SLAs covering latency, throughput, consistency and high availability. The throughput you provision is applied to each of the regions associated with your Azure Cosmos DB account. For reads, Azure Cosmos DB offers multiple, well-defined [consistency levels](consistency-levels.md) for you to choose from. 

The following table shows the number of RUs required to perform read and write operations based on a data item of size 1 KB and 100 KBs with default automatic indexing turned off. 

|Item Size|1 Read|1 Write|
|-------------|------|-------|
|1 KB|1 RU|5 RUs|
|100 KB|10 RUs|50 RUs|

## Cost of reads and writes

If you provision 1,000 RU/s, this amounts to 3.6 million RU/hour and will cost $0.08 for the hour (in the US and Europe). For a 1 KB size data item, this means that you can consume 3.6 million reads or 0.72 million writes (3.6 million RU / 5) using your provisioned throughput. Normalized to million reads and writes, the cost would be $0.022 /million of reads ($0.08 / 3.6) and $0.111/million of writes ($0.08 / 0.72). The cost per million becomes minimal as shown in the table below.

|Item Size|Cost of 1 million reads|Cost of 1 million writes|
|-------------|-------|--------|
|1 KB|$0.022|$0.111|
|100 KB|$0.222|$1.111|


Most of the basic blob or object stores services charge $0.40 per million read transaction and $5 per million write transaction. If used optimally, Azure Cosmos DB can be up to 98% cheaper than these other solutions (for 1 KB transactions).

## Next steps

* Use [RU calculator](https://cosmos.azure.com/capacitycalculator/) to estimate throughput for your workloads.
