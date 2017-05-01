---
title: 'Introduction to Azure Cosmos DB: MongoDB API | Microsoft Docs'
description: Learn how you can use Azure Cosmos DB to store and query massive volumes of JSON documents with low latency using the popular OSS MongoDB APIs.
keywords: what is MongoDB
services: documentdb
author: AndrewHoh
manager: jhubbard
editor: ''
documentationcenter: ''

ms.assetid: 4afaf40d-c560-42e0-83b4-a64d94671f0a
ms.service: documentdb
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/30/2017
ms.author: anhoh

---
# Introduction to Azure Cosmos DB: MongoDB API

Azure Cosmos DB, formerly known as Azure DocumentDB, is Microsoft's multi-tenant, globally distributed NoSQL database service for mission-critical applications. Azure Cosmos DB was built with global distribution and horizontal scale at its core. It offers turn-key global distribution across any number of Azure regions by transparently scaling and replicating your data wherever your users are. You can elastically scale throughput and storage worldwide and pay only for the throughput and storage you need. Azure Cosmos DB guarantees single-digit millisecond latencies at the 99th percentile anywhere in the world, offers multiple well-defined consistency models to fine-tune for performance, and guaranteed high availability with multi-homing capabilities, all backed by industry-leading service level agreements (SLAs). 

Azure Cosmos DB is truly schema-agnostic. It automatically indexes data without requiring you to deal with schema and index management. Azure Cosmos DB is multi-model – it natively supports document, key-value, graph, and columnar data models. With Azure Cosmos DB, you can access your data using NoSQL APIs of your choice - DocumentDB (document), MongoDB (document), Azure Table storage (key-value), and Gremlin (graph), are all natively supported. Azure Cosmos DB is a fully managed, enterprise ready, and trustworthy service. All your data is fully and transparently encrypted  and secure by default. Azure Cosmos DB is also ISO, FedRAMP, EU, HIPAA, and PCI compliant.  

Azure Cosmos DB databases can be used as the data store for apps written for MongoDB. This means that by using existing [drivers](https://docs.mongodb.org/ecosystem/drivers/) for MongoDB databases, your application written for MongoDB can now communicate with Azure Cosmos DB and use Azure Cosmos DB databases instead of MongoDB databases. In many cases, you can switch from using MongoDB to AzureCosmos DB by simply changing a connection string. Using this functionality, customers can easily build and run MongoDB database applications in the Azure cloud - leveraging Azure Cosmos DB's fully managed and scalable NoSQL databases - while continuing to use familiar skills and tools for MongoDB.


## What is the benefit of using Azure Cosmos DB: API for MongoDB?

* **Elastically scalable throughput and storage:** Easily scale up or scale down your MongoDB database to meet your application needs. Your data is stored on solid state disks (SSD) for low predictable latencies. Azure Cosmos DB supports MongoDB collections that can scale to virtually unlimited storage sizes and provisioned throughput. You can elastically scale DocumentDB with predictable performance seamlessly as your application grows. 

* **Multi-region replication:** Azure Cosmos DB transparently replicates your data to all regions you've associated with your MongoDB account, enabling you to develop applications that require global access to data while providing tradeoffs between consistency, availability and performance, all with corresponding guarantees. DocumentDB provides transparent regional failover with multi-homing APIs, and the ability to elastically scale throughput and storage across the globe. Learn more in [Distribute data globally](documentdb-distribute-data-globally.md).

**MongoDB compatibility**: You can use your existing MongoDB expertise, application code, and tooling. You can develop applications using MongoDB and deploy them to production using the fully managed globally distributed Azure Cosmos DB service.

**No server management**: You don't have to manage and scale your MongoDB databases. Azure Cosmos DB is a fully managed service, which means you do not have to manage any infrastructure or Virtual Machines yourself. Azure Cosmos DB is available in 30+ [Azure Regions](https://azure.microsoft.com/regions/services/).

* **Tunable consistency levels:** Select from five well defined consistency levels to achieve optimal trade-off between consistency and performance. For queries and read operations, DocumentDB offers five distinct consistency levels: strong, bounded-staleness, session, consistent prefix, and eventual. These granular, well-defined consistency levels allow you to make sound trade-offs between consistency, availability, and latency. Learn more in [Using consistency levels to maximize availability and performance](documentdb-consistency-levels.md).

* **Automatic indexing**: By default, Azure Cosmos DB automatically indexes all the properties within documents in your MongoDB database and does not expect or require any schema or creation of secondary indices.

**Enterprise grade** - Azure Cosmos DB supports multiple local replicas to deliver 99.99% availability and data protection in the face of local and regional failures. Azure Cosmos DB has enterprise grade [compliance certifications](https://www.microsoft.com/trustcenter) and security features. 

Learn more in this Azure Friday video with Scott Hanselman and Azure Cosmos DB Principal Engineering Manager, Kirill Gavrylyuk.

> [!VIDEO https://channel9.msdn.com/Shows/Azure-Friday/DocumentDB-Database-as-a-Service-for-MongoDB-Developers/player]
> 


## How to get started?

Create an Azure Cosmos DB account in the [Azure Portal](https://portal.azure.com) and swap the MongoDB connection string to your new account. 

*And, that's it!*

For more detailed instructions, follow [create account](documentdb-create-mongodb-account.md) and [connect to your account](documentdb-connect-mongodb-account.md).

## Next steps

Information about Azure Cosmos DB's MongoDB API is integrated into the overall Azure Cosmos DB documentation, but here are a few pointers to get you started:

* Follow the [Connect to a MongoDB account](documentdb-connect-mongodb-account.md) tutorial to learn how to get your account connection string information.
* Follow the [Use MongoChef with Azure Cosmos DB](documentdb-mongodb-mongochef.md) tutorial to learn how to create a connection between your Azure Cosmos DB database and MongoDB app in MongoChef.
* Follow the [Migrate data to Azure Cosmos DB with protocol support for MongoDB](documentdb-mongodb-migrate.md) tutorial to import your data to an API for MongoDB database.
* Build your first API for MongoDB app using [Node.js](documentdb-mongodb-samples.md).
* Build your first API for MongoDB web app using .[NET](documentdb-mongodb-application.md).
* Connect to an API for MongoDB account using [Robomongo](documentdb-mongodb-robomongo.md).
* Learn how many RUs your operations are using with the [GetLastRequestStatistics command and the Azure portal metrics](documentdb-request-units.md#GetLastRequestStatistics).
* Learn how to [configure read preferences for globally distributed apps](documentdb-distribute-data-globally.md#ReadPreferencesAPIforMongoDB).

