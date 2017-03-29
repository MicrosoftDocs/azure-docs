---
title: Azure DocumentDB as a key value store – Cost overview | Microsoft Docs
description: Learn about the low cost of using Azure DocumentDB as a key value store.
keywords: key value store
services: documentdb
author: ArnoMicrosoft
manager: jhubbard
editor: ''
tags: ''
documentationcenter: ''

ms.assetid: 7f765c17-8549-4509-9475-46394fc3a218
ms.service: documentdb
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/30/2017
ms.author: acomet
---

# DocumentDB as a key value store – Cost overview

Azure DocumentDB is a fully managed, globally distributed NoSQL database service for building highly available, large scale, [globally distributed](documentdb-distribute-data-globally.md) applications easily. By default, DocumentDB automatically indexes all the data it ingests, efficiently. This enables fast and consistent [SQL](documentdb-sql-query.md) (and [JavaScript](documentdb-programming.md)) queries on any kind of data. 

This article describes the cost of DocumentDB for simple write and read operations when it’s used as a key/value store. Write operations include inserts, replaces, deletes, and upserts of documents. Besides guaranteeing 99.99% high availability, DocumentDB offers guaranteed <10 ms latency for reads and <15 ms latency for the (indexed) writes respectively, at the 99th percentile. 

## Why we use Request Units (RUs)

DocumentDB performance is based on the amount of provisioned [Request Units](documentdb-request-units.md) (RU) for the partition. The provisioning is at a second granularity and is purchased in RUs/sec ([not to be confused with the hourly billing](https://azure.microsoft.com/pricing/details/documentdb/)). RUs should be considered as a currency that simplifies the provisioning of required throughput for the application. Our customers do not have to think of differentiating between read and write capacity units. The single currency model of RUs creates efficiencies to share the provisioned capacity between reads and writes. This provisioned capacity model enables the service to provide a predictable and consistent throughput, guaranteed low latency, and high availability. Finally, we use RU to model throughput but each provisioned RU has also a defined amount of resources (Memory, Core). RU/sec is not only IOPS.

As a globally distributed database system, DocumentDB is the only Azure service that provides an SLA on latency, throughput, and consistency in addition to high availability. The throughput you provision is applied to each of the regions associated with your DocumentDB database account. For reads, DocumentDB offers multiple, well-defined [consistency levels](documentdb-consistency-levels.md) for you to choose from. 

The following table shows the number of RUs required to perform read and write transactions based on document size of 1KB and 100KBs.

|Document Size|1 Read|1 Write|
|-------------|------|-------|
|1 KB|1 RU|5 RUs|
|100 KB|10 RUs|50 RUs|

## Cost of Reads and Writes

If you provision 1,000 RU/sec, this amounts to 3.6m RU/hour and will cost $0.08 for the hour (in the US and Europe). For a 1KB size document, this means that you can consume 3.6m reads or 0.72m writes (3.6mRU / 5) using your provisioned throughput. Normalized to million reads and writes, the cost would be $0.022 /m reads ($0.08 / 3.6) and $0.111/m writes ($0.08 / 0.72). The cost per million becomes minimal as shown in the table below.

|Document Size|1m Read|1m Write|
|-------------|-------|--------|
|1 KB|$0.022|$0.111|
|100 KB|$0.222|$1.111|

Most of the basic blob or object stores services charge $0.40 per million read transaction and $5 per million write transaction. If used optimally, DocumentDB can be up to 98% cheaper than these other solutions (for 1KB transactions).

## Next steps

Stay tuned for new articles on optimizing DocumentDB resource provisioning. In the meantime, feel free to use our [RU calculator](https://www.documentdb.com/capacityplanner).
