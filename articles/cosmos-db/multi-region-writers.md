---
title: Multi-master at global scale with Azure Cosmos DB | Microsoft Docs
description: 
services: cosmos-db
author: rimman
manager: kfile

ms.service: cosmos-db
ms.devlang: na
ms.topic: conceptual
ms.date: 09/18/2018
ms.author: rimman

---

# Azure Cosmos DB multi-master


With Azure Cosmos DB multi-master support, you can perform writes on any container (i.e., collections, graphs, tables) in a write-enabled region. Data written to one region is propagated to all other regions. Multi-master is available for all API’s, including SQL, MongoDB, Cassandra, Graph and Table.

Azure Cosmos DB multi-master is composed of multiple master regions that equally participate in a write-anywhere model. Azure Cosmos DB regions operating as master regions in a multi-master configuration automatically work to converge the data of all replicas and ensure global consistency and data integrity.

## Key benefits

Following are the key benefits available for accounts that have multi-master enabled:

* **Single-digit write latency** – Azure Cosmos DB now delivers <10 ms write latency at the 99th percentile (In addition to <10 ms read latencies), guaranteed by the financially-backed SLAs.

* **5-9’s write availability** – Azure Cosmos DB now offers 99.999% write availability (in addition to 99.999% read availability, guaranteed by the financially-backed SLAs.

* **Unlimited write scalability and throughput** –  With multi-master in Azure Cosmos DB, you can write to every region. Multi-master provides unlimited write scalability and throughput to support billions of devices.

* **Built-in conflict resolution** – Multi-master in Azure Cosmos DB provides 3 modes for handling conflicts to ensure global data integrity and consistency.


* **Load balancing** - With multi-master, workloads can be balanced and write capacity can be easily extended by adding a new region and switching some writes to the new region. 

* **Risk-free failover testing** - With multi-master, every region is a write region so, failover testing will have little impact on the write throughput. 

* **Lower Total Cost of Ownership (TCO)** – With Azure Cosmos DB multi-master that is backed up by industry-leading SLAs, developers no longer require building and maintaining the “backend glue logic” themselves for building active-active databases and get a peace of mind running their mission-critical workloads. 

## Use-cases where multi-master support is needed 

* **Social media apps** – Social media applications require low-latency, high-availability and scalability to provide a great experience for users located around the globe. Azure Cosmos DB multi-master puts data closer to users for lower latency. Multiple write locations provide high-availability with the ability to seamlessly write to another region and the ability for regions to scale independently depending on usage. 

* **IoT** - Azure Cosmos DB multi-master simplifies data processing for IoT applications. Geo-distributed edge deployments often need to track time series data from multiple locations. Each device can be homed to its closest region. As devices travel, (i.e., a car, aircraft, train) devices can dynamically be rehomed to write to another region. 

* **E-Commerce** - Ecommerce requires very low-latency as well as high-availability. Multi-master allows users to write to data in a region closest to them increasing the responsiveness of applications. 

* **Fraud/Anomaly Detection** - Often applications that monitor user activity or account activity are globally distributed and must keep track of several events simultaneously to update scores to keep the risk metrics inline. Built-in conflict resolution support with Azure Cosmos DB multi-master can help developers manage these conflict scenarios gracefully. 

* **Metering** - Counting and regulating usage (such as API calls, transactions/second, minutes used) can be implemented globally with simplicity using Azure Cosmos DB multi-master. Built-in conflict resolution assures both accuracy of counts and regulation in real time. 

* **Personalization** - Whether you’re maintaining geographically distributed counters that trigger actions such as loyalty points awards or implementing personalized user session views, the high availability and simplified geo-distributed counting provided by Azure Cosmos DB, allows applications deliver high performance with simplicity. 

## Next steps  

In this article you learned about multi-master support for Azure Cosmos DB. Next, look at the following resources:

* [Enable Azure Cosmos DB multi-master](enable-multi-master.md) 

* [Conflict resolution for Azure Cosmos DB multi-master](multi-master-conflict-resolution.md) 

 
