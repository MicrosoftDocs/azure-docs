---
title: Introduction/Overview
titleSuffix: Azure Cosmos DB for Apache Cassandra
description: Use Azure Cosmos DB for Apache Cassandra to power existing and new applications with Cassandra drivers and CQL.
author: TheovanKraay
ms.author: thvankra
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.subservice: apache-cassandra
ms.topic: overview
ms.date: 02/28/2023
ms.custom: ignite-2022
---

# What is Azure Cosmos DB for Apache Cassandra?

[!INCLUDE[Cassandra](../includes/appliesto-cassandra.md)]

[Azure Cosmos DB](../introduction.md) is a fully managed NoSQL and relational database for modern app development.

Azure Cosmos DB for Apache Cassandra can be used as the data store for apps written for [Apache Cassandra](https://cassandra.apache.org). This compatibility means that by using existing [Apache drivers](https://cassandra.apache.org/doc/latest/cassandra/getting_started/drivers.html?highlight=driver) compliant with CQLv4, your existing Cassandra application can now communicate with the API for Cassandra. In many cases, you can switch from using Apache Cassandra to using the API for Cassandra, by just changing a connection string. The API for Cassandra enables you to interact with data stored in Azure Cosmos DB using the Cassandra Query Language (CQL), Cassandra-based tools (like cqlsh) and Cassandra client drivers that you're already familiar with.

> [!TIP]
> Want to try the API for Cassandra with no commitment? Create an Azure Cosmos DB account using [Try Azure Cosmos DB](../try-free.md) for free.

## API for Cassandra benefits

The API for Cassandra has added benefits of being built on Azure Cosmos DB:

- **No operations management**: As a fully managed cloud service, API for Cassandra removes the overhead of managing and monitoring a myriad of settings across OS, JVM, and yaml files and their interactions. Azure Cosmos DB provides monitoring of throughput, latency, storage, availability, and configurable alerts.

- **Open source standard**: Despite being a fully managed service, API for Cassandra still supports a large surface area of the native [Apache Cassandra wire protocol](support.md), allowing you to build applications on a widely used and cloud agnostic open source standard.

- **Performance management**: Azure Cosmos DB provides guaranteed low latency reads and writes at the 99th percentile, backed up by the SLAs. Users don't have to worry about operational overhead to ensure high performance and low latency reads and writes. This guarantee means that users don't need to deal with scheduling compaction, managing tombstones, setting up bloom filters and replicas manually. Azure Cosmos DB removes the overhead to manage these issues and lets you focus on the application logic.

- **Ability to use existing code and tools**: Azure Cosmos DB provides wire protocol level compatibility with existing Cassandra SDKs and tools. This compatibility ensures you can use your existing codebase with API for Cassandra while only making trivial changes.

- **Throughput and storage elasticity**: Azure Cosmos DB provides throughput across all regions and can scale the provisioned throughput with Azure portal, PowerShell, or CLI operations. You can [elastically scale](scale-account-throughput.md) storage and throughput for your tables as needed with predictable performance.

- **Global distribution and availability**: Azure Cosmos DB globally distributes data across all Azure regions and serves the data locally while ensuring low latency data access and high availability. Azure Cosmos DB provides 99.99% high availability within a region and 99.999% read and write availability across multiple regions with no operations overhead. For more information, see [distribute data globally](../distribute-data-globally.md).

- **Choice of consistency**: Azure Cosmos DB provides the choice of five well-defined consistency levels to achieve optimal tradeoffs between consistency and performance. These consistency levels are strong, bounded-staleness, session, consistent prefix and eventual. These consistency levels allow developers to make precise trade-offs between consistency, availability, and latency. For more information, see [consistency levels](../consistency-levels.md).

- **Enterprise grade**: Azure Cosmos DB provides [compliance certifications](https://www.microsoft.com/trust-center) to ensure users can use the platform securely. Azure Cosmos DB also provides encryption at rest and in motion, IP firewall, and audit logs for control plane activities.

- **Event Sourcing**: The API for Cassandra provides access to a persistent change log, the [Change Feed](change-feed.md). The change feed can facilitate event sourcing directly from the database. In Apache Cassandra, change data capture (CDC) is the only equivalent feature. CDC is merely a mechanism to flag specific tables for archival and rejecting writes to those tables once a configurable size-on-disk for the CDC log is reached. These capabilities are redundant in Azure Cosmos DB as the relevant aspects are automatically governed.


## Azure Managed Instance for Apache Cassandra

For some customers, adapting to API for Cassandra can be a challenge due to differences in behaviour and/or configuration, especially for lift-and-shift migrations. [Azure Managed Instance for Apache Cassandra](../../managed-instance-apache-cassandra/introduction.md) is a first-party Azure service for hosting and maintaining pure open-source Apache Cassandra clusters with 100% compatibility.

## Next steps

- Get started with [creating a API for Cassandra account, database, and a table](create-account-java.md) by using a Java application.
- [Load sample data to the API for Cassandra table](load-data-table.md) by using a Java application.
- [Query data from the API for Cassandra account](query-data.md) by using a Java application.
