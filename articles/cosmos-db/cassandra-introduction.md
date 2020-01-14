---
title: Introduction to the Azure Cosmos DB Cassandra API
description: Learn how you can use Azure Cosmos DB to "lift-and-shift" existing applications and build new applications by using the Cassandra drivers and CQL  
author: kanshiG
ms.service: cosmos-db
ms.subservice: cosmosdb-cassandra
ms.topic: overview
ms.date: 05/21/2019
ms.author: govindk
ms.reviewer: sngun
---

# Introduction to the Azure Cosmos DB Cassandra API

Azure Cosmos DB Cassandra API can be used as the data store for apps written for [Apache Cassandra](http://cassandra.apache.org). This means that by using existing [Apache drivers](http://cassandra.apache.org/doc/latest/getting_started/drivers.html?highlight=driver) compliant with CQLv4, your existing Cassandra application can now communicate with the Azure Cosmos DB Cassandra API. In many cases, you can switch from using Apache Cassandra to using Azure Cosmos DB 's Cassandra API, by just changing a connection string. 

The Cassandra API enables you to interact with data stored in Azure Cosmos DB using the Cassandra Query Language (CQL) , Cassandra-based tools (like cqlsh) and Cassandra client drivers that you’re already familiar with.

## What is the benefit of using Apache Cassandra API for Azure Cosmos DB?

**No operations management**: As a fully managed cloud service, Azure Cosmos DB Cassandra API removes the overhead of managing and monitoring a myriad of settings across OS, JVM, and yaml files and their interactions. Azure Cosmos DB provides monitoring of throughput, latency, storage, availability, and configurable alerts.

**Performance management**: Azure Cosmos DB provides guaranteed low latency reads and writes at the 99th percentile, backed up by the SLAs. Users do not have to worry about operational overhead to ensure high performance and low latency reads and writes. This means that users do not need to deal with scheduling compaction, managing tombstones, setting up bloom filters and replicas manually. Azure Cosmos DB removes the overhead to manage these issues and lets you focus on the application logic.

**Ability to use existing code and tools**: Azure Cosmos DB provides wire protocol level compatibility with existing Cassandra SDKs and tools. This compatibility ensures you can use your existing codebase with Azure Cosmos DB Cassandra API with trivial changes.

**Throughput and storage elasticity**: Azure Cosmos DB provides guaranteed throughput across all regions and can scale the provisioned throughput with Azure portal, PowerShell, or CLI operations. You can elastically scale storage and throughput for your tables as needed with predictable performance.

**Global distribution and availability**: Azure Cosmos DB provides the ability to globally distribute data across all Azure regions and serve the data locally while ensuring low latency data access and high availability. Azure Cosmos DB provides 99.99% high availability within a region and 99.999% read and write availability across multiple regions with no operations overhead. Learn more in [Distribute data globally](distribute-data-globally.md) article. 

**Choice of consistency**: Azure Cosmos DB provides the choice of five well-defined consistency levels to achieve optimal tradeoffs between consistency and performance. These consistency levels are strong, bounded-staleness, session, consistent prefix and eventual. These well-defined, practical, and intuitive consistency levels allow developers to make precise trade-offs between consistency, availability, and latency. Learn more in [consistency levels](consistency-levels.md) article. 

**Enterprise grade**: Azure cosmos DB provides [compliance certifications](https://www.microsoft.com/trustcenter) to ensure users can use the platform securely. Azure Cosmos DB also provides encryption at rest and in motion, IP firewall, and audit logs for control plane activities.

## Next steps

* You can quickly get started with building the following language-specific apps to create and manage Cassandra API data:
  - [Node.js app](create-cassandra-nodejs.md)
  - [.NET app](create-cassandra-dotnet.md)
  - [Python app](create-cassandra-python.md)

* Get started with [creating a Cassandra API account, database, and a table](create-cassandra-api-account-java.md) by using a Java application.

* [Load sample data to the Cassandra API table](cassandra-api-load-data.md) by using a Java application.

* [Query data from the Cassandra API account](cassandra-api-query-data.md) by using a Java application.

* To learn about Apache Cassandra features supported by Azure Cosmos DB Cassandra API, see [Cassandra support](cassandra-support.md) article.

* Read the [Frequently Asked Questions](faq.md#cassandra).
