---
title: Key benefits of Azure Cosmos DB global distribution
description: Learn about Azure Cosmos DB multi-master, key benefits offered by geo-replication, multi-master and use cases where it is helpful.
services: cosmos-db
author: markjbrown
manager: kfile

ms.service: cosmos-db
ms.devlang: na
ms.topic: conceptual
ms.date: 09/24/2018
ms.author: mjbrown
ms.reviewer: sngun

---

# Distribute data globally with Azure Cosmos DB

This article describes the key benefits of distributing data globally and some real-time scenarios where global data distribution is needed.

## Key benefits

The following are the key benefits available for accounts that leverage Azure Cosmos DB global data distribution capabilities:

* **Single-digit latency** – Azure Cosmos DB delivers <10 ms read and write latency at the 99th percentile, guaranteed by [financially backed SLAs](https://azure.microsoft.com/support/legal/sla/cosmos-db/).

* **5-9’s availability** – Azure Cosmos DB offers 99.999% read and write availability, guaranteed by [financially backed SLAs](https://azure.microsoft.com/support/legal/sla/cosmos-db/).

* **Flexible conflict resolution** – For customers leveraging multi-master capabilities, Azure Cosmos DB provides three modes for handling conflicts to ensure global data integrity and consistency.

* **Tunable consistency** – Azure Cosmos DB supports 5 different [consistency levels](consistency-levels.md) with global distribution in mind with support for all but strong consistency for accounts with multi-mastering capability.

* **Implicit fault tolerance** - With data replicated across multiple regions, applications can enjoy high fault tolerance against regional outages.

## Use cases

Here is just a small sample of the scenarios, which can take advantage of the globally distribution capabilities Azure Cosmos DB.

* **Social media apps** – Social media applications require low-latency, high-availability, and scalability to provide a great experience for users located around the globe.

* **IoT** - Geo-distributed edge deployments often need to track time series data from multiple locations. Each device can be homed to its closest region. When devices move to different locations, those devices can be rehomed to write to the closest available region.

* **E-Commerce** - E-Commerce requires very low-latency as well as high-availability. Geo-distribution of data with reads and writes puts data closest to users, increasing the responsiveness of applications. Availability for both reads and writes in multiple regions provides greater availability.

* **Fraud/Anomaly Detection** - Often applications that monitor user activity or account activity are globally distributed and must keep track of several events simultaneously to update scores to keep the risk metrics inline.

* **Metering** - Counting and regulating usage (such as API calls, transactions/second, minutes used) can be implemented globally with simplicity using Azure Cosmos DB multi-master. Built-in conflict resolution assures both accuracy of counts and regulation in real time.

## Next steps  

In this article, you learned about key benefits and use cases for the global data distribution capabilities of Azure Cosmos DB. Next, look at the following resources:

* [How Azure Cosmos DB enables turnkey global distribution](distribute-data-globally-turnkey.md)

* [How to configure Azure Cosmos DB global database replication](tutorial-global-distribution-sql-api.md)

* [How to enable multi-master for Azure Cosmos DB accounts](enable-multi-master.md)

* [How automatic and manual failover works in Azure Cosmos DB](regional-failover.md)

* [Understanding conflict resolution in Azure Cosmos DB](multi-master-conflict-resolution.md)

* [using multi-master with open source NoSQL databases](multi-master-oss-nosql.md)
