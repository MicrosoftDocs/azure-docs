---
title: Multi-master at global scale with Azure Cosmos DB | Microsoft Docs
description: 
services: cosmos-db
author: rimman
manager: kfile

ms.service: cosmos-db
ms.devlang: na
ms.topic: conceptual
ms.date: 05/07/2018
ms.author: rimman

---

# Multi-master at global scale with Azure Cosmos DB 
 
Developing globally distributed applications that respond with local latencies while maintaining consistent views of data worldwide is a challenging problem. Customers use globally distributed databases, because they need to improve data access latency, achieve high data availability, ensure guaranteed disaster recovery, and to meet their business requirements. Multi-master in Azure Cosmos DB provides high levels of availability (99.999%), single-digit millisecond latency to write data and scalability with built-in comprehensive and flexible conflict resolution support. These features significantly simplify development of globally distributed applications. For globally distributed applications, multi-master support is crucial. 

![Multi-master architecture](./media/multi-region-writers/multi-master-architecture.png)

With Azure Cosmos DB multi-master support, you can perform writes on containers of data (for example, collections, graphs, tables) distributed anywhere in the world. You can update data in any region that is associated with your database account. These data updates can propagate asynchronously. In addition to providing fast access and write latency to your data, multi-master also provides a practical solution for failover and load-balancing issues. In summary, with Azure Cosmos DB you get write latency of <10 ms at the 99th percentile anywhere in the world, 99.999% write and read availability anywhere in the world, and the ability to scale both write and read throughput anywhere around the world.   

> [!IMPORTANT]
> Multi-master support is in private preview, to use the preview version, [sign up](#sign-up-for-multi-master-support) now.

## Sign up for multi-master support

If you already have an Azure subscription, you can sign up to join the multi-master preview program in the Azure portal. If you’re new to Azure, sign up for a [free trial](https://azure.microsoft.com/free) where you get 12 months of free access to Azure Cosmos DB. Complete the following steps to request access to the multi-master preview program.

1. In the [Azure portal](https://portal.azure.com), click **Create a resource** > **Databases** > **Azure Cosmos DB**.  

2. In the New Account page, provide a name for your Azure Cosmos DB account, choose the API, Subscription, Resource Group and Location.  

3. Next select **Sign up to preview today** under the Multi Master Preview field.  

   ![Sign up for multi-master preview](./media/multi-region-writers/sign-up-for-multi-master-preview.png)

4. In the **Sign up to preview today** pane, click **OK**. After you submit the request, the status changes to **Pending approval** in the account creation blade.  

After you submit the request, you will receive an email notification that your request has been approved. Due to the high volume of requests, you should receive notification within a week. You do not need to create a support ticket to complete the request. Requests will be reviewed in the order in which they were received.

## A simple multi-master example – content publishing  

Let's look at a real-world scenario that describes how to use multi-master support with Azure Cosmos DB. Consider a content publishing platform built on Azure Cosmos DB. Here are some requirements that this platform must meet for a great user experience for both publishers and consumers. 

* Both authors and subscribers are spread all over the world.  

* Authors must publish (write) articles to their local (closest) region.  

* Authors have readers/subscribers of their articles who are distributed across the globe.  

* Subscribers should get a notification when new articles are published.  

* Subscribers must be able to read articles from their local region. They should also be able to add reviews to these articles.  

* Anyone including the author of the articles should be able view all the reviews attached to articles from a local region.  

Assuming millions of consumers and publishers with billions of articles, soon we have to confront the problems of scale along with guaranteeing locality of access. Such a use case is a perfect candidate for Azure Cosmos DB multi-master. 

## Benefits of having multi-master support 

Multi-master support is essential for globally distributed applications. Multi-master is composed of [multiple master regions](distribute-data-globally.md) that equally participate in a write-anywhere model (active-active pattern) and it is used to ensure that data is available at any time where you need it. Updates made to an individual region are asynchronously propagated to all other regions (which in turn are master regions in their own). Azure Cosmos DB regions operating as master regions in a multi-master configuration automatically work to converge the data of all replicas and ensure [global consistency and data integrity](consistency-levels.md). The following image shows the read/write replication for a single-master and multi-master.

![Single-master and multi-master](./media/multi-region-writers/single-vs-multi-master.png)

Implementing multi-master on your own adds burden on developers. Large-scale customers who try to implement multi-master on their own may spend hundreds of hours configuring and testing a worldwide multi-master configuration, and many have a dedicated set of engineers whose sole job is to monitor and maintain the multi-master replication. Creating and managing multi-master setup on your own  takes the time, resources away from innovating in the application itself and results in much higher costs. Azure Cosmos DB provides multi-master support "out-of-the-box" and removes this overhead from developers.  

In summary, multi-master provides the following benefits:

* **Better disaster recovery, write availability and failover**- Multi-master can be used to preserve the high-availability of a mission-critical database to a greater extent. For example, a multi-master database can replicate data from one region to a failover region when the primary region becomes unavailable due to an outage or a regional disaster. Such a failover region will serve as a fully functional master region to support the application. Multi-master provides greater "survivability" protection with regards to natural disasters, power outages, or sabotage, because remaining regions can utilize geographically different multi-masters with a guaranteed write availability > 99.999%. 

* **Improved write latency for end users** - The closer your data (that you are serving) is to the end users, the better the experience will be. For example, if you have users in Europe but your database is in the US or Australia, the added latency is approximately 140 ms and 300 ms for the respective regions. Delays are unacceptable to start with for many popular games, banking requirements, or interactive applications (web or mobile). Latency plays a huge part in customer’s perception of a high-quality experience and was proved to impact the behavior of users to some noticeable extent. As technology improves and especially with the advent of AR, VR and MR, requiring even more immersive and lifelike experiences, developers now need to produce software systems with stringent latency requirements. Therefore, having locally available applications and data (content for the apps) is more important. With multi-master in Azure Cosmos DB, performance is as fast as regular local reads and writes and enhanced globally by geo-distribution.  

* **Improved write scalability and write throughput** - Multi-master will give higher throughput, and greater utilization while offering multiple consistency models with correctness guarantees and backed up by SLAs. 

  ![Scaling write throughput with multi-master](./media/multi-region-writers/scale-write-throughput.png)

* **Better support for disconnected environments (for example, edge devices)** - Multi-master enables users to replicate all or a subset of data from an edge device to a closest region in a disconnected environment. This scenario is typical of sales force automation systems, where an individual's laptop (a disconnected device) stores a subset of data related to the individual salesperson. Master regions in the cloud that are located anywhere in the world can operate as the target of the copy from the remote edge devices.  

* **Load balancing** - With multi-master, the load across the application can be rebalanced by moving users/workloads from a heavily loaded region to regions where load is evenly distributed. Write capacity can be easily extended by adding a new region and then switching some writes to the new region. 

* **Better use of provisioned capacity** - With multi-master, for write-heavy and mixed workloads, you can saturate the provisioned capacity across multiple regions..  In some cases you can redistribute reads and writes more equally, so it requires less throughput to be provisioned, and leads to more cost savings for customers.  

* **Simpler and more resilient app architectures** - Applications moving to multi-master configuration get guaranteed data resilience.  With Azure Cosmos DB hiding all the complexity, it can substantially simplify the application design and architecture. 

* **Risk-free failover testing** - Failover testing will not have any degradation on write throughput. With multi-master, all other regions are full-masters, so failover will not have much impact on the write throughput.  

* **Lower Total Cost of Ownership(TCO) and DevOps** - Meeting scalability, performance, global distribution, recovery time objectives are often  expensive due to expensive add-ons or maintaining a back-up infrastructure that  is at rest until disaster strikes. With Azure Cosmos DB multi-master backed up by industry-leading SLAs, developers no longer require building and maintaining the "backend glue logic" themselves and get a peace of mind running their mission-critical workloads. 

## Use-cases where multi-master support is needed

There are numerous use cases for multi-master in Azure Cosmos DB: 

* **IoT** - Azure Cosmos DB multi-master allows for simplified distributed implementation of IoT data processing. Geo-distributed edge deployments that use  CRDT- conflict-free replicated data types often need to track time series data from multiple locations. Each device can be homed to one of the closest regions, and a device can travel (for example, a car) and can dynamically be rehomed to write to another region.  

* **E-Commerce** - Assuring great user experience in ecommerce scenarios needs high availability and resilience to failure scenarios. In case a region fails, user sessions, shopping carts, active wish lists need to be seamlessly picked up by another region without loss of state. In the interim, updates made by the user must be handled appropriately (example, adds, and removes from the shopping cart must transfer over). With multi-master, Azure Cosmos DB can handle such scenarios gracefully, with a smooth transition between active regions while maintaining a consistent view from the user’s standpoint. 

* **Fraud/Anomaly Detection** - Often applications that monitor user activity or account activity are globally distributed and must keep track of several events simultaneously. While creating and maintaining scores for a user, actions from different geographic regions must simultaneously update scores to keep the risk metrics inline. Azure Cosmos DB can assure developers don’t have to handle conflict scenarios at the application level. 

* **Collaboration** - For applications that rank based on popularity of articles such as  goods on sale or media to be consumed etc. Tracking popularity across geographic regions can get complicated, particularly when royalties need to be paid or real time advertising decisions to be made. Ranking, sorting, and reporting across many regions worldwide, in real time with Azure Cosmos DB allows developers to deliver features with little effort and without compromising on latencies. 

* **Metering** - Counting and regulating usage (such as API calls, transactions/second, minutes used) can be implemented globally with simplicity using Azure Cosmos DB multi-master. Built-in conflict resolution assures both accuracy of counts and regulation in real time. 

* **Personalization** - Whether you’re maintaining geographically distributed counters that trigger actions such as loyalty points awards or implementing personalized user session views, the high availability and simplified geo-distributed counting provided by Azure Cosmos DB, allows applications deliver high performance with simplicity. 

## Conflict resolution with multi-master 

With multi-master, the challenge is often that two (or more) replicas of the same record may be updated simultaneously by different writers in two or more different regions. Simultaneous writes may lead to two different versions of the same record and without built-in conflict resolution, and the application itself must perform conflict resolution to resolve this inconsistency.  

**Example** - Let’s assume that you are using Azure Cosmos DB as the persistence store for a shopping cart application and this application is deployed in two regions: East US and West US.  If approximately at the same time, a user in San Francisco adds an item to his shopping cart (for example, a book) while an inventory management process in the East US invalidates a different shopping cart item (for example, a new phone) for that same user in response to a supplier notification that the release date had been delayed. At time T1, the shopping cart records in the two regions are different. The database will use its replication and conflict resolution mechanism to resolve this inconsistency and eventually one of the two versions of the shopping cart will be selected. Using the conflict resolution heuristics most often applied by multi-master databases (for example, last write wins), it is impossible for the user or application to predict which version will be selected. In either case, data is lost or unexpected behavior may occur. If the East region version is selected, then the user’s selection of a new purchase item (that is, a book) is lost and if the West region is selected, then the previously chosen item (that is, phone) is still in the cart. Either way, information is lost. Finally, any other process inspecting the shopping cart between times T1 and T2 is going to see non-deterministic behavior as well. For example, a background process that selects the fulfillment warehouse and updates the cart shipping costs would produce results that conflict with the eventual contents of the cart. If the process is running in the West region and alternative 1 becomes reality, it would compute the shipping costs for two items, even though the cart may soon have just one item, the book. 

Azure Cosmos DB implements the logic for handling conflicting writes inside the database engine itself. Azure Cosmos DB offers **comprehensive and flexible conflict resolution support** by offering several conflict resolution models, including Automatic (CRDT- conflict-free replicated data types), Last Write Wins (LWW), and Custom (Stored Procedure) for automatic conflict resolution. The conflict resolution models provide correctness and consistency guarantees and remove the burden from developers to have to think about consistency, availability, performance, replication latency, and complex combinations of events under geo-failovers and cross-region write conflicts.  

  ![Mult-master conflict resolution](./media/multi-region-writers/multi-master-conflict-resolution-blade.png)

You will have 3 types of conflict resolution models offered by Azure Cosmos DB. The semantics of the conflict resolution models are as follows: 

**Automatic** - This is the default conflict resolution policy. Selecting this policy causes Azure Cosmos DB to automatically resolve the conflicting updates on the server side and provide strong-eventual-consistency guarantees. Internally, Azure Cosmos DB implements automatic conflict resolution by leveraging Conflict-Free-Replicated-Data Types (CRDTs) inside the database engine.  

**Last-Write-Wins (LWW)** - Choosing this policy will allow you to resolve conflicts based on either the system defined synchronized timestamp property or a custom property defined on the conflicting version of the records. The conflict resolution happens on the server side and the version with the latest timestamp is selected as the winner.  

**Custom** - You can register an application defined conflict resolution logic by registering a stored-procedure. The stored-procedure will get invoked upon detection of update conflicts under the auspices of a database transaction, on the server side. If you select the option but fail to register a stored procedure (or if the stored procedure throws an exception at runtime), you can access all of the conflicting versions via the Conflicts Feed and resolve them individually.  

## Next steps  

In this article you learnt how to use globally distributed multi-master with Azure Cosmos DB. Next, take a look at the following resources: 

* [Learn about how Azure Cosmos DB supports global distribution](distribute-data-globally.md)  

* [Learn about automatic failovers in Azure Cosmos DB](regional-failover.md)  

* [Learn about global consistency with Azure Cosmos DB](consistency-levels.md)  

* Develop with multiple regions using the Azure Cosmos DB - [SQL API](tutorial-global-distribution-sql-api.md), [MongoDB API](tutorial-global-distribution-mongodb.md), or [Table API](tutorial-global-distribution-table.md)  
