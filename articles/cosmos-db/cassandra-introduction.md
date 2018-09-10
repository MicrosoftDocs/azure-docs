---
title: Introduction to the Azure Cosmos DB Cassandra API | Microsoft Docs
description: Learn how you can use Azure Cosmos DB to "lift-and-shift" existing applications and build new applications using Cassandra API using the Cassandra drivers and CQL you’re already familar with. 
services: cosmos-db
author: kanshiG
manager: kfile

ms.service: cosmos-db
ms.component: cosmosdb-cassandra
ms.devlang: na
ms.topic: overview
ms.date: 11/20/2017
ms.author: govindk
---

# Introduction to Azure Cosmos DB: Apache Cassandra API

Azure Cosmos DB provides the Cassandra API (preview) for applications that are written for Apache Cassandra that need premium capabilities like:

* [Scalable storage size and throughput](partition-data.md).
* [Turn-key global distribution](distribute-data-globally.md)
* Single-digit millisecond latencies at the 99th percentile.
* [Five well-defined consistency levels](consistency-levels.md)
* [Automatic indexing of data](http://www.vldb.org/pvldb/vol8/p1668-shukla.pdf) without requiring you to deal with schema and index management. 
* Guaranteed high availability, all backed by [industry-leading SLAs](https://azure.microsoft.com/support/legal/sla/cosmos-db/)

## What is the Azure Cosmos DB Apache Cassandra API?

Azure Cosmos DB can be used as the data store for apps written for [Apache Cassandra](https://cassandra.apache.org/), by using the Apache Cassandra API. This means that by using existing [Apache licensed drivers compliant with CQLv4](https://cassandra.apache.org/doc/latest/getting_started/drivers.html?highlight=driver), your application written for Cassandra can now communicate with the Azure Cosmos DB Cassandra API. In many cases, you can switch from using Apache Cassandra to using Azure Cosmos DB 's Apache Cassandra API, by simply changing a connection string. Using this functionality, you can easily build and run Cassandra API database applications in the Azure cloud with Azure Cosmos DB's global distribution and [comprehensive industry-leading SLAs](https://azure.microsoft.com/support/legal/sla/cosmos-db), while continuing to use familiar skills and tools for Cassandra API.

![Azure Cosmos DB Cassandra API](./media/cassandra-introduction/cosmosdb-cassandra.png)

The Cassandra API enables you to interact with data stored in Azure Cosmos DB using the Cassandra Query Language based tools (like CQLSH) and Cassandra client drivers you’re already familiar with. 

## What is the benefit of using Apache Cassandra API for Azure Cosmos DB?

**No operations management**: As a true fully managed service, Azure Cosmos DB ensures that Cassandra API administrators do not have to worry about managing and monitoring a myriad settings across OS, JVM, and yaml files and their interplay. Azure Cosmos DB provides monitoring of throughput, latency, storage and availability, and configurable alerts. 

**Performance management**: Azure Cosmos DB provides SLA backed low latency reads and writes for the 99th percentile. Users do not need to worry about lot of operational overhead to provide good read and write SLAs. These typically include scheduling compaction, managing tombstones, bloom filters setting, and replica lags. Azure Cosmos DB takes away the worry of managing these issues and lets you focus on the application deliverables.

**Automatic indexing**: Azure Cosmos DB automatically indexes all the columns of table in Cassandra API database. Azure Cosmos DB  does not require creation of secondary indices to speed up queries. It provides low latency read and write experience while doing automatic consistent indexing. 

**Ability to use existing code and tools**: Azure Cosmos DB provides wire protocol level compatibility with existing SDKs and tools. This compatibility ensures you can use your existing codebase with Cassandra API of Azure Cosmos DB with trivial changes.

**Throughput and storage elasticity**: Azure Cosmos platform provides elasticity of guaranteed throughput across regions via simple portal, PowerShell, or CLI operations. You can elastically scale Azure Cosmos DB Tables with predictable performance seamlessly as your application grows. Azure Cosmos DB supports Cassandra API tables that can scale to virtually unlimited storage sizes. 

**Global distribution and availability**: Azure Cosmos DB provides the ability to distribute data throughout Azure regions to enable  users with a low latency experience while ensuring availability. Azure Cosmos DB provides 99.99% availability within a region and 99.999% read availability across the regions with no operations overhead. Azure Cosmos DB is available in 30+ [Azure Regions](https://azure.microsoft.com/regions/services/). Learn more in [Distribute data globally](distribute-data-globally.md). 

**Choice of consistency**: Azure Cosmos DB provides the choice of five well-defined consistency levels to achieve optimal trade-off between consistency and performance. These consistency levels are strong, bounded-staleness, session, consistent prefix, and eventual. These granular, well-defined consistency levels allow developer to make sound trade-offs between consistency, availability, and latency. Learn more in [Using consistency levels to maximize availability and performance](consistency-levels.md). 

**Enterprise grade**: Azure cosmos DB provides [compliance certifications](https://www.microsoft.com/trustcenter) to ensure users can use the platform securely. Azure Cosmos DB also provides encryption at rest and in motion, IP firewall, and audit logs for control plane activities.  

<a id="sign-up-now"></a>
## Sign up now 

If you already have an Azure subscription, you can sign up to join the Cassandra API (preview) program in the [Azure portal](https://aka.ms/cosmosdb-cassandra-signup).  If you’re new to Azure, sign up for a [free trial](https://azure.microsoft.com/free) where you get 12 months of free access to Azure Cosmos DB. Complete the following steps to request access to the Cassandra API (preview) program.

1. In the [Azure portal](https://portal.azure.com), click **Create a resource** > **Databases** > **Azure Cosmos DB**. 

2. In the New Account page, select **Cassandra** in the API box. 

3. In the **Subscription** box, select the Azure subscription that you want to use for this account.

4. Click **Sign up to preview today**.

    ![Azure Cosmos DB Cassandra API](./media/cassandra-introduction/cassandra-sign-up.png)

3. In the Sign up to preview today pane, click **OK**. 

    Once you submit the request, the status changes to **Pending approval** in the New account pane. 

After you submit your request, wait for email notification that your request has been approved. Due to the high volume of requests, you should receive notification within a week. You do not need to create a support ticket to complete the request. Requests will be reviewed in the order in which they were received. 

## How to get started
Once you've joined the preview program, follow the Cassandra API quickstarts to create an app by using the Cassandra API:

* [Quickstart: Build a Cassandra web app with Node.js and Azure Cosmos DB](create-cassandra-nodejs.md)
* [Quickstart: Build a Cassandra web app with Java and Azure Cosmos DB](create-cassandra-java.md)
* [Quickstart: Build a Cassandra web app with .NET and Azure Cosmos DB](create-cassandra-dotnet.md)
* [Quickstart: Build a Cassandra web app with Python and Azure Cosmos DB](create-cassandra-python.md)

## Next steps

Information about the Azure Cosmos DB Cassandra API is integrated into the overall Azure Cosmos DB documentation, but here are a few pointers to get you started:

* Follow the [Quickstarts](create-cassandra-nodejs.md) to create an account and a new app by using a Git sample
* Follow the [Tutorial](tutorial-develop-cassandra-java.md) to create a new app programmatically.
* Follow the [Import Cassandra data tutorial](cassandra-import-data.md) to import your existing data into Azure Cosmos DB.
* Read the [FAQ](faq.md#cassandra).
