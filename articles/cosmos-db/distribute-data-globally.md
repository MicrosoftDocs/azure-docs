---
title: Distribute data globally with Azure Cosmos DB
description: Learn about planet-scale geo-replication, multi-master, failover, and data recovery using global databases from Azure Cosmos DB, a globally distributed, multi-model database service.
services: cosmos-db
author: markjbrown
ms.author: mjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 10/26/2018
---
# Global data distribution with Azure Cosmos DB

Today’s applications are required to be highly responsive and always online. To achieve low latency and high availability, instances of these applications need to be deployed in datacenters that are close to their users. These applications are typically deployed in multiple datacenters and are called globally distributed. Globally distributed applications need a globally distributed database that can transparently replicate the data anywhere in the world to enable the applications to operate on a copy of the data that's close to its users. 

Azure Cosmos DB is a globally distributed database service that's designed to provide low latency, elastic scalability of throughput, well-defined semantics for data consistency, and high availability. In short, if your application needs guaranteed fast response time anywhere in the world, if it's required to be always online, and needs unlimited and elastic scalability of throughput and storage, consider building applications by using Azure Cosmos DB.

You can configure your databases to be globally distributed and available in any of the Azure regions. To lower the latency, place the data closer to where your users are. Choosing the required regions depends on the global reach of your application and where your users are located. Azure Cosmos DB transparently replicates the data within your account to all the regions associated with your account. It provides a single system image of your globally distributed Azure Cosmos database and containers that your application can read and write to locally. 

With Azure Cosmos DB, you can add or remove the regions associated with your account at any time. Your application doesn't need to be paused or redeployed to add or remove a region. It continues to be highly available all the time because of the multihoming capabilities that the service provides.

## Key benefits of global distribution

**Build global active-active apps.** With the multi-master feature, every region is a write region. It's also readable. The multi-master feature also guarantees:

- Unlimited elastic write scalability. 
- 99.999% read and write availability all around the world.
- Guaranteed reads and writes served in less than 10 milliseconds at the 99th percentile.

By using the Azure Cosmos DB multihoming APIs, your application is aware of the nearest region. It then can send requests to that region. The nearest region is identified without any configuration changes. As you add and remove regions from your Azure Cosmos DB account, your application doesn't need to redeploy. The application continues to be highly available.

**Build highly responsive apps.** Your application can be easily designed to perform near real-time reads and writes. It can use single-digit millisecond latencies against all the regions you chose for your database. Azure Cosmos DB internally handles the data replication between regions. As a result, the consistency level selected for the Azure Cosmos DB account is guaranteed.

Many applications benefit from the performance enhancements that come with the ability to perform multi-region (local) writes. Some applications that require strong consistency prefer to funnel all writes to a single region. For these applications, Azure Cosmos DB supports single region and multi-region configurations.

**Build highly available apps.** Running a database in several regions increases the availability of the database. If one region is unavailable, other regions automatically handle application requests. Azure Cosmos DB offers 99.999% read and write availability for multi-region databases.

**Maintain business continuity during regional outages.** Azure Cosmos DB supports [automatic failover](how-to-manage-database-account.md#automatic-failover) during a regional outage. During a regional outage, Azure Cosmos DB continues to maintain its latency, availability, consistency, and throughput SLAs. To help make sure that your entire application is highly available, Azure Cosmos DB offers a manual failover API to simulate a regional outage. By using this API, you can carry out regular business continuity drills.

**Scale read and write throughput globally.** With the multi-master feature, you can elastically scale read and write throughput all around the world. The multi-master feature guarantees the throughput that your application configures on an Azure Cosmos DB database or a container is delivered across all regions. The throughput also is protected by [financially backed SLAs](https://aka.ms/acdbsla).

**Choose from several well-defined consistency models.** The Azure Cosmos DB replication protocol offers five well-defined, practical, and intuitive consistency models. Each model has a tradeoff between consistency and performance. Use these consistency models to build globally distributed applications with ease.

## <a id="Next Steps"></a>Next steps

Read more about global distribution in the following articles:

* [Global distribution - under the hood](global-dist-under-the-hood.md)
* [Configure clients for multihoming](how-to-manage-database-account.md#configure-clients-for-multi-homing)
* [Add or remove regions from your Azure Cosmos DB account](how-to-manage-database-account.md#addremove-regions-from-your-database-account)
* [Create a custom conflict resolution policy for SQL API accounts](how-to-manage-conflicts.md#create-a-custom-conflict-resolution-policy)