---
title: 'Introduction to Azure Cosmos DB: API for MongoDB | Microsoft Docs'
description: Learn how you can use Azure Cosmos DB to store and query massive volumes of JSON documents with low latency using the popular OSS MongoDB APIs.
keywords: what is MongoDB
services: cosmos-db
author: AndrewHoh
manager: jhubbard
editor: ''
documentationcenter: ''

ms.assetid: 4afaf40d-c560-42e0-83b4-a64d94671f0a
ms.service: cosmos-db
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/24/2017
ms.author: anhoh

---
# Introduction to Azure Cosmos DB: API for MongoDB

[Azure Cosmos DB](../cosmos-db/introduction.md) is Microsoft's globally distributed, multi-model database service for mission-critical applications. Azure Cosmos DB provides [turn-key global distribution](distribute-data-globally.md), [elastic scaling of throughput and storage](partition-data.md) worldwide, single-digit millisecond latencies at the 99th percentile, [five well-defined consistency levels](consistency-levels.md), and guaranteed high availability, all backed by [industry-leading SLAs](https://azure.microsoft.com/support/legal/sla/cosmos-db/). Azure Cosmos DB [automatically indexes data](http://www.vldb.org/pvldb/vol8/p1668-shukla.pdf) without requiring you to deal with schema and index management. It is multi-model and supports document, key-value, graph, and columnar data models. 

![Azure Cosmos DB: MongoDB API](./media/mongodb-introduction/cosmosdb-mongodb.png) 

Cosmos DB databases can be used as the data store for apps written for [MongoDB](https://docs.mongodb.com/manual/introduction/). This means that by using existing [drivers](https://docs.mongodb.org/ecosystem/drivers/), your application written for MongoDB can now communicate with Cosmos DB and use Cosmos DB databases instead of MongoDB databases. In many cases, you can switch from using MongoDB to Cosmos DB by simply changing a connection string. Using this functionality, you can easily build and run MongoDB database applications in the Azure cloud with Azure Cosmos DB's global distribution and [comprehensive industry leading SLAs](https://azure.microsoft.com/support/legal/sla/cosmos-db), while continuing to use familiar skills and tools for MongoDB.


## What is the benefit of using Azure Cosmos DB for MongoDB applications?

**Elastically scalable throughput and storage:** Easily scale up or down your MongoDB database to meet your application needs. Your data is stored on solid state disks (SSD) for low predictable latencies. Cosmos DB supports MongoDB collections that can scale to virtually unlimited storage sizes and provisioned throughput. You can elastically scale Cosmos DB with predictable performance seamlessly as your application grows. 

**Multi-region replication:** Cosmos DB transparently replicates your data to all regions you've associated with your MongoDB account, enabling you to develop applications that require global access to data while providing tradeoffs between consistency, availability and performance, all with corresponding guarantees. Cosmos DB provides transparent regional failover with multi-homing APIs, and the ability to elastically scale throughput and storage across the globe. Learn more in [Distribute data globally](distribute-data-globally.md).

**MongoDB compatibility**: You can use your existing MongoDB expertise, application code, and tooling. You can develop applications using MongoDB and deploy them to production using the fully managed globally distributed Cosmos DB service.

**No server management**: You don't have to manage and scale your MongoDB databases. Cosmos DB is a fully managed service, which means you do not have to manage any infrastructure or Virtual Machines yourself. Cosmos DB is available in 30+ [Azure Regions](https://azure.microsoft.com/regions/services/).

**Tunable consistency levels:** Select from five well defined consistency levels to achieve optimal trade-off between consistency and performance. For queries and read operations, Cosmos DB offers five distinct consistency levels: strong, bounded-staleness, session, consistent prefix, and eventual. These granular, well-defined consistency levels allow you to make sound trade-offs between consistency, availability, and latency. Learn more in [Using consistency levels to maximize availability and performance](consistency-levels.md).

**Automatic indexing**: By default, Cosmos DB automatically indexes all the properties within documents in your MongoDB database and does not expect or require any schema or creation of secondary indices.

**Enterprise grade** - Azure Cosmos DB supports multiple local replicas to deliver 99.99% availability and data protection in the face of local and regional failures. Azure Cosmos DB has enterprise grade [compliance certifications](https://www.microsoft.com/trustcenter) and security features. 

Learn more in this Azure Friday video with Scott Hanselman and Azure Cosmos DB Principal Engineering Manager, Kirill Gavrylyuk.

> [!VIDEO https://channel9.msdn.com/Shows/Azure-Friday/DocumentDB-Database-as-a-Service-for-MongoDB-Developers/player]
> 

## How to get started

Follow the MongoDB quickstarts to create a Cosmos DB account and migrate your existing Mongo DB application to use Cosmos DB, or build a new one:

* [Migrate an existing Node.js MongoDB web app](create-mongodb-nodejs.md).
* [Build a MongoDB API web app with .NET and the Azure portal](create-mongodb-dotnet.md)
* [Build a MongoDB API console app with Java and the Azure portal](create-mongodb-java.md)

## Next steps

Information about Azure Cosmos DB's MongoDB API is integrated into the overall Azure Cosmos DB documentation, but here are a few pointers to get you started:

* Follow the [Connect to a MongoDB account](connect-mongodb-account.md) tutorial to learn how to get your account connection string information.
* Follow the [Use MongoChef with Azure Cosmos DB](mongodb-mongochef.md) tutorial to learn how to create a connection between your Azure Cosmos DB database and MongoDB app in MongoChef.
* Follow the [Migrate data to Azure Cosmos DB with protocol support for MongoDB](mongodb-migrate.md) tutorial to import your data to an API for MongoDB database.
* Connect to an API for MongoDB account using [Robomongo](mongodb-robomongo.md).
* Learn how many RUs your operations are using with the [GetLastRequestStatistics command and the Azure portal metrics](request-units.md#GetLastRequestStatistics).
* Learn how to [configure read preferences for globally distributed apps](../cosmos-db/tutorial-global-distribution-mongodb.md).
