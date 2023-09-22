---
title: Distribute data globally with Azure Cosmos DB
description: Learn about planet-scale geo-replication, multi-region writes, failover, and data recovery using global databases from Azure Cosmos DB, a globally distributed, multi-model database service.
author: seesharprun
ms.author: sidandrews
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 01/06/2021
ms.custom: seo-nov-2020, ignite-2022
adobe-target: true
---
# Distribute your data globally with Azure Cosmos DB
[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

Today's applications are required to be highly responsive and always online. To achieve low latency and high availability, instances of these applications need to be deployed in datacenters that are close to their users. These applications are typically deployed in multiple datacenters and are called globally distributed. Globally distributed applications need a globally distributed database that can transparently replicate the data anywhere in the world to enable the applications to operate on a copy of the data that's close to its users. 

Azure Cosmos DB is a globally distributed database system that allows you to read and write data from the local replicas of your database. Azure Cosmos DB transparently replicates the data to all the regions associated with your Azure Cosmos DB account. Azure Cosmos DB is a globally distributed database service that's designed to provide low latency, elastic scalability of throughput, well-defined semantics for data consistency, and high availability. In short, if your application needs fast response time anywhere in the world, if it's required to be always online, and needs unlimited and elastic scalability of throughput and storage, you should build your application on Azure Cosmos DB.

You can configure your databases to be globally distributed and available in [any of the Azure regions](https://azure.microsoft.com/global-infrastructure/services/?products=cosmos-db&regions=all). To lower the latency, place the data close to where your users are. Choosing the required regions depends on the global reach of your application and where your users are located. Azure Cosmos DB transparently replicates the data to all the regions associated with your Azure Cosmos DB account. It provides a single system image of your globally distributed Azure Cosmos DB database and containers that your application can read and write to locally.

> [!NOTE]
> Serverless accounts for Azure Cosmos DB can only run in a single Azure region. For more information, see [using serverless resources](serverless.md).

With Azure Cosmos DB, you can add or remove the regions associated with your account at any time. Your application doesn't need to be paused or redeployed to add or remove a region. Azure Cosmos DB is available in all five distinct Azure cloud environments available to customers:

* **Azure public** cloud, which is available globally.

* **Microsoft Azure operated by 21Vianet** is available through a unique partnership between Microsoft and 21Vianet, one of the country’s largest internet providers in China.

* **Azure Germany** provides services under a data trustee model, which ensures that customer data remains in Germany under the control of T-Systems International GmbH, a subsidiary of Deutsche Telekom, acting as the German data trustee.

* **Azure Government** is available in four regions in the United States to US government agencies and their partners.

* **Azure Government for Department of Defense (DoD)** is available in two regions in the United States to the US Department of Defense.

:::image type="content" source="./media/distribute-data-globally/deployment-topology.png" alt-text="Highly available deployment topology" border="false":::

## Key benefits of global distribution

**Build global active-active apps.** With its novel multi-region writes replication protocol, every region supports both writes and reads. The multi-region writes capability also enables:

- Unlimited elastic write and read scalability.
- 99.999% read and write availability all around the world.
- Guaranteed reads and writes served in less than 10 milliseconds at the 99th percentile.

As you add and remove regions to and from your Azure Cosmos DB account, your application does not need to be redeployed or paused, it continues to be highly available at all times.

**Build highly responsive apps.** Your application can perform near real-time reads and writes against all the regions you chose for your database. Azure Cosmos DB internally handles the data replication between regions with consistency level guarantees of the level you've selected.

**Build highly available apps.** Running a database in multiple regions worldwide increases the availability of a database. If one region is unavailable, other regions automatically handle application requests. Azure Cosmos DB offers 99.999% read and write availability for multi-region databases.

**Maintain business continuity during regional outages.** Azure Cosmos DB supports [service-managed failover](how-to-manage-database-account.md#automatic-failover) during a regional outage. During a regional outage, Azure Cosmos DB continues to maintain its latency, availability, consistency, and throughput SLAs. To help make sure that your entire application is highly available, Azure Cosmos DB offers a manual failover API to simulate a regional outage. By using this API, you can carry out regular business continuity drills.

**Scale read and write throughput globally.** You can enable every region to be writable and elastically scale reads and writes all around the world. The throughput that your application configures on an Azure Cosmos DB database or a container is provisioned across all regions associated with your Azure Cosmos DB account. The provisioned throughput is guaranteed up by [financially backed SLAs](https://azure.microsoft.com/support/legal/sla/cosmos-db/v1_3/).

**Choose from several well-defined consistency models.** The Azure Cosmos DB replication protocol offers five well-defined, practical, and intuitive consistency models. Each model has a tradeoff between consistency and performance. Use these consistency models to build globally distributed applications with ease.

## <a id="Next Steps"></a>Next steps

Read more about global distribution in the following articles:

* [Global distribution - under the hood](global-dist-under-the-hood.md)
* [How to configure multi-region writes in your applications](how-to-multi-master.md)
* [Configure clients for multihoming](how-to-manage-database-account.md#configure-multiple-write-regions)
* [Add or remove regions from your Azure Cosmos DB account](how-to-manage-database-account.md#addremove-regions-from-your-database-account)
* [Create a custom conflict resolution policy for API for NoSQL accounts](how-to-manage-conflicts.md#create-a-custom-conflict-resolution-policy)
* [Programmable consistency models in Azure Cosmos DB](consistency-levels.md)
* [Choose the right consistency level for your application](./consistency-levels.md)
* [Consistency levels across Azure Cosmos DB APIs](./consistency-levels.md)
* [Availability and performance tradeoffs for various consistency levels](./consistency-levels.md)
