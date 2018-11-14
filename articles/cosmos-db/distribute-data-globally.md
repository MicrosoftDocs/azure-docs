---
title: Distribute data globally with Azure Cosmos DB | Microsoft Docs
description: Learn about planet-scale geo-replication, multi-master, failover, and data recovery by using global databases from Azure Cosmos DB, a globally distributed, multi-model database service.
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

Many of today’s applications run at planet scale. These applications are always on and accessible to users all around the globe. It's a challenge to manage the global distribution of data that's used by these applications and provide high performance and high availability. Azure Cosmos DB is a globally distributed database service that's designed to provide high performance and high availability. Azure Cosmos DB is best suited for these real-time applications.

Azure Cosmos DB is a foundational Azure service. It's available in all [Azure regions](https://azure.microsoft.com/global-infrastructure/regions/) by default. Microsoft operates Azure data centers in more than 54 regions around the world. The number of regions continues to expand to meet the growing needs of customers. When you create an Azure Cosmos DB account, you decide on the regions where it should be deployed. Microsoft operates the Azure Cosmos DB service 24/7 so that you can focus on your applications.

You can configure your databases to be globally distributed and available in any of the Azure regions. To lower the latency, place the data closer to your user’s location. Choosing the required regions depends on the global reach of your application and where your users are located. Azure Cosmos DB transparently replicates the data within your account to all the configured regions. It provides a single system image of your Azure Cosmos DB database and containers by which your application can read and write locally. 

With Azure Cosmos DB, you can add or remove the regions associated with your account at any time. Your application doesn't need to pause or be redeployed to add or remove a region. It continues to be highly available all the time because of the multi-homing capabilities that the service provides.

## Key benefits of global distribution

**Build global active-active apps.** With the multi-master capability, every region is a write region. It's also readable. The multi-master feature also guarantees:

- Unlimited elastic write scalability. 
- 99.999% read and write availability all around the world.
- Guaranteed reads and writes served in less than 10 milliseconds at the 99th percentile.

By using the Azure Cosmos DB multi-homing APIs, your application is aware of the nearest region. It then can send requests to that region. The nearest region is identified without any configuration changes. As you add and remove regions from your account, your application doesn't need to be redeployed. Your application continues to be highly available.

**Build highly responsive apps.** Your application can be easily designed to perform near real-time reads and writes. It can use single-digit millisecond latencies against all the regions you chose for your database. Azure Cosmos DB internally handles the data replication between regions. As a result, the consistency level selected for the Azure Cosmos DB account is guaranteed.

Many applications benefit from the performance enhancements that come with the ability to perform multi-region (local) writes. Some applications that require strong consistency prefer to funnel all writes to a single region. To support these applications, Azure Cosmos DB supports single region and multi-region configurations.

**Build highly available apps.** Running a database in multiple regions increases the availability of the database. If one region is unavailable, other regions automatically handle application requests. Azure Cosmos DB offers 99.999% read and write availability for multi-region databases.

**Maintain business continuity during regional outages**: Azure Cosmos DB supports [automatic failover](how-to-manage-database-account.md#automatic-failover) during a regional outage. During a regional outage, Cosmos DB continues to maintain its latency, availability, consistency, and throughput SLAs. To help ensure your entire application is highly available, Azure Cosmos DB offers a manual failover API to simulate a regional outage. By using this API, you can perform regular business continuity drills.

**Scale read and write throughput globally.** With multi-master capability, you can elastically scale read and write throughput all around the world. Multi-master capability guarantees that the throughput that your application configures on an Azure Cosmos DB database or a container is delivered across all regions and protected by [financially backed SLAs](https://aka.ms/acdbsla).

**Choose from several well-defined consistency models.** The Azure Cosmos DB replication protocol offers five well-defined, practical, and intuitive consistency models. Each model has a tradeoff between consistency and performance. Use these consistency models to build globally distributed applications with ease.

## <a id="Next Steps"></a>Next steps

Read more about global distribution in the following articles:

* [Global distribution - under the hood](global-dist-under-the-hood.md)
* [Configure clients for multi-homing](how-to-manage-database-account.md#configure-clients-for-multi-homing)
* [Add or remove regions from your Azure Cosmos DB account](how-to-manage-database-account.md#addremove-regions-from-your-database-account)
* [Create a custom conflict resolution policy for SQL API accounts](how-to-manage-conflicts.md#create-a-custom-conflict-resolution-policy)