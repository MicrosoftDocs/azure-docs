---
title: Distribute data globally with Azure Cosmos DB | Microsoft Docs
description: Learn about planet-scale geo-replication, multi-master, failover, and data recovery using global databases from Azure Cosmos DB, a globally distributed, multi-model database service.
services: cosmos-db
author: SnehaGunda
manager: kfile

ms.service: cosmos-db
ms.devlang: na
ms.topic: conceptual
ms.date: 10/26/2018
ms.author: mjbrown

---
# Global data distribution with Azure Cosmos DB

Many of today’s applications run or have ambitions to run at planet scale. They are always on and are accessible to users around the globe. Managing the global distribution of data that is used by these applications while providing high performance and high availability is a hard problem. Cosmos DB is a globally distributed database service that has been architected from the ground up to meet these challenges.

Cosmos DB is a foundational Azure service and it is available in all [Azure regions](https://azure.microsoft.com/global-infrastructure/regions/) by default. Microsoft operates Azure data centers in more than 50 regions around the world and continues to expand to meet the growing needs of the customers. Microsoft operates the Cosmos DB service 24/7, so you can focus on your applications. When you create a Cosmos DB account, you decide which region(s) it should be deployed in.

Cosmos DB customers can configure their databases to be globally distributed and available in anywhere from 1 to 50+ Azure regions. To lower the latency, you should place the data closer to your user’s location, so deciding how many regions and in which region to run depends on the global reach of your application and where your users are. Cosmos DB transparently replicates all the data within your Cosmos account to all the configured regions. Cosmos DB provides a single system image of your Cosmos database and containers, so that your application can read and write locally. With Cosmos DB, you can add or remove the regions associated with your account at any time. Your application does not need to be paused or redeployed and it continues to be highly available serving data at all times, thanks to the multi-homing capabilities that the service provides.

## Key benefits of global distribution

**Build global active-active apps, easily**: With the multi-master capability, every region is writable (in addition to being readable), enabling unlimited elastic write scalability, 99.999% read and write availability, all around the world, and guaranteed fast reads and writes served in less than 10 milliseconds, at the 99th percentile.  

Using Azure Cosmos DB's multi-homing APIs, your application always knows the nearest region and sends requests to that region. Nearest region is identified without any configuration changes. As you add and remove regions from your Cosmos DB account, your application does not need to be redeployed and it continues to be highly available.

**Build highly responsive apps**: Your application can be easily designed to perform near real-time reads and writes, with single-digit millisecond latencies, against all regions you have chosen for your database.  Azure Cosmos DB internally handles the data replication between regions in a way that guarantees the consistency level chosen for the Cosmos account.

Many applications will benefit from the performance enhancements that come with the ability to perform multi-region (local) writes. Some applications, such as those which require strong consistency, will prefer to funnel all writes to a single region. Cosmos DB supports both configurations, single region and multi-region.

**Build highly available apps**: Running a database in multiple regions improves the availability of the database. If one region is unavailable, other regions will automatically handle application requests. Azure Cosmos DB offers 99.999% read and write availability for multi-region databases.

**Business continuity during regional outages**: Azure Cosmos DB supports [automatic failover](how-to-manage-database-account.md#enable-automatic-failover-for-your-cosmos-account) during a regional outage. Moreover, during a regional outage, Cosmos DB continues to maintain its latency, availability, consistency, and throughput SLAs. To help ensure your entire app is highly available, Azure Cosmos DB offers manual failover API to simulate a regional outage. By using this API, you can perform regular business continuity drills and be ready.

**Global read and write scalability**: With multi-master capability, you can elastically scale read and write throughput all around the world. Multi-master capability guarantees that the throughput that your application configures on an Azure Cosmos DB database or a container is delivered across all regions and protected by [financially backed SLAs](https://aka.ms/acdbsla).

**Multiple, well-defined consistency models**: Azure Cosmos DB’s replication protocol is designed to offer five well-defined, practical, and intuitive consistency models each with a clear tradeoff between consistency and performance. These consistency models enable you to build correct globally distributed applications with ease.

## <a id="Next Steps"></a>Next steps

Read more about global distribution in the following articles:

* [Global distribution - under the hood](global-dist-under-the-hood.md)
* [How to configure clients for multi-homing](how-to-manage-database-account.md#configure-clients-for-multi-homing)
* [How to add/remove regions from your database](how-to-manage-database-account.md#addremove-regions-from-your-database-account)
* [How to create a custom conflict resolution policy for SQL API accounts](how-to-manage-conflicts.md#create-a-custom-conflict-resolution-policy)