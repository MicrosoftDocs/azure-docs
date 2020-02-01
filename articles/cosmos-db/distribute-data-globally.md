---
title: Distribute data globally with Azure Cosmos DB
description: Learn about planet-scale geo-replication, multi-master, failover, and data recovery using global databases from Azure Cosmos DB, a globally distributed, multi-model database service.
author: markjbrown
ms.author: mjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 07/23/2019
---
# Global data distribution with Azure Cosmos DB - overview

Today’s applications are required to be highly responsive and always online. To achieve low latency and high availability, instances of these applications need to be deployed in datacenters that are close to their users. These applications are typically deployed in multiple datacenters and are called globally distributed. Globally distributed applications need a globally distributed database that can transparently replicate the data anywhere in the world to enable the applications to operate on a copy of the data that's close to its users. 

Azure Cosmos DB is a globally distributed database service that's designed to provide low latency, elastic scalability of throughput, well-defined semantics for data consistency, and high availability. In short, if your application needs guaranteed fast response time anywhere in the world, if it's required to be always online, and needs unlimited and elastic scalability of throughput and storage, you should build your application on Azure Cosmos DB.

You can configure your databases to be globally distributed and available in any of the Azure regions. To lower the latency, place the data close to where your users are. Choosing the required regions depends on the global reach of your application and where your users are located. Cosmos DB transparently replicates the data to all the regions associated with your Cosmos account. It provides a single system image of your globally distributed Azure Cosmos database and containers that your application can read and write to locally. 

With Azure Cosmos DB, you can add or remove the regions associated with your account at any time. Your application doesn't need to be paused or redeployed to add or remove a region. It continues to be highly available all the time because of the multi-homing capabilities that the service natively provides.

![Highly available deployment topology](./media/distribute-data-globally/deployment-topology.png)

## Key benefits of global distribution

**Build global active-active apps.** With its novel multi-master replication protocol, every region supports both writes and reads. The multi-master capability also enables:

- Unlimited elastic write and read scalability. 
- 99.999% read and write availability all around the world.
- Guaranteed reads and writes served in less than 10 milliseconds at the 99th percentile.

By using the Azure Cosmos DB multi-homing APIs, your application is aware of the nearest region and can send requests to that region. The nearest region is identified without any configuration changes. As you add and remove regions to and from your Azure Cosmos account, your application does not need to be redeployed or paused, it continues to be highly available at all times.

**Build highly responsive apps.** Your application can perform near real-time reads and writes against all the regions you chose for your database. Azure Cosmos DB internally handles the data replication between regions with consistency level guarantees of the level you've selected.

**Build highly available apps.** Running a database in multiple regions worldwide increases the availability of a database. If one region is unavailable, other regions automatically handle application requests. Azure Cosmos DB offers 99.999% read and write availability for multi-region databases.

**Maintain business continuity during regional outages.** Azure Cosmos DB supports [automatic failover](how-to-manage-database-account.md#automatic-failover) during a regional outage. During a regional outage, Azure Cosmos DB continues to maintain its latency, availability, consistency, and throughput SLAs. To help make sure that your entire application is highly available, Cosmos DB offers a manual failover API to simulate a regional outage. By using this API, you can carry out regular business continuity drills.

**Scale read and write throughput globally.** You can enable every region to be writable and elastically scale reads and writes all around the world. The throughput that your application configures on an Azure Cosmos database or a container is guaranteed to be delivered across all regions associated with your Azure Cosmos account. The provisioned throughput is guaranteed up by [financially backed SLAs](https://aka.ms/acdbsla).

**Choose from several well-defined consistency models.** The Azure Cosmos DB replication protocol offers five well-defined, practical, and intuitive consistency models. Each model has a tradeoff between consistency and performance. Use these consistency models to build globally distributed applications with ease.

## <a id="Next Steps"></a>Next steps

Read more about global distribution in the following articles:

* [Global distribution - under the hood](global-dist-under-the-hood.md)
* [How to configure multi-master in your applications](how-to-multi-master.md)
* [Configure clients for multihoming](how-to-manage-database-account.md#configure-multiple-write-regions)
* [Add or remove regions from your Azure Cosmos DB account](how-to-manage-database-account.md#addremove-regions-from-your-database-account)
* [Create a custom conflict resolution policy for SQL API accounts](how-to-manage-conflicts.md#create-a-custom-conflict-resolution-policy)
* [Programmable consistency models in Cosmos DB](consistency-levels.md)
* [Choose the right consistency level for your application](consistency-levels-choosing.md)
* [Consistency levels across Azure Cosmos DB APIs](consistency-levels-across-apis.md)
* [Availability and performance tradeoffs for various consistency levels](consistency-levels-tradeoffs.md)

