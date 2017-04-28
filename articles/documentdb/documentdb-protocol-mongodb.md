---
title: 'What is Azure Cosmos DB: API for MongoDB? | Microsoft Docs'
description: 'Learn about Azure Cosmos DB: API for MongoDB and how you can easily run existing MongoDB applications in the Azure cloud'
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
ms.date: 04/27/2017
ms.author: anhoh

---
# What is Azure Cosmos DB: API for MongoDB?

Azure Cosmos DB databases can be used as the data store for apps written for MongoDB. This means that by using existing [drivers](https://docs.mongodb.org/ecosystem/drivers/) for MongoDB databases, your application written for MongoDB can now communicate with Azure Cosmos DB and use Azure Cosmos DB databases instead of MongoDB databases. In many cases, you can switch from using MongoDB to AzureCosmos DB by simply changing a connection string. Using this functionality, customers can easily build and run MongoDB database applications in the Azure cloud - leveraging Azure Cosmos DB's fully managed and scalable NoSQL databases - while continuing to use familiar skills and tools for MongoDB.


## What is the benefit of using Azure Cosmos DB: API for MongoDB?
**No Server Management** - Azure Cosmos DB is a fully managed service, which means you do not have to manage any infrastructure or Virtual Machines yourself. Azure Cosmos DB is available in 30+ [Azure Regions](https://azure.microsoft.com/regions/services/).

**Limitless Scale** - You can scale throughput and storage independently and elastically. You can add capacity to serve millions of requests per second with ease.

**Enterprise grade** - Azure Cosmos DB supports multiple local replicas to deliver 99.99% availability and data protection in the face of local and regional failures. Azure Cosmos DB has enterprise grade [compliance certifications](https://www.microsoft.com/trustcenter) and security features. 

**MongoDB compatibility** - Azure Cosmos DB: API for MongoDB is designed for compatability with MongoDB. You can use your existing code, applications, drivers, and tools to work with Azure Cosmos DB. 

Learn more in this Azure Friday video with Scott Hanselman and Azure Cosmos DB Principal Engineering Manager, Kirill Gavrylyuk.

> [!VIDEO https://channel9.msdn.com/Shows/Azure-Friday/DocumentDB-Database-as-a-Service-for-MongoDB-Developers/player]
> 


## How to get started?

Create an Azure Cosmos DB: API for MongoDB account in the [Azure Portal](https://portal.azure.com) and swap the connection to your new account. 

*And, that's it!*

For more detailed instructions, follow [create account](documentdb-create-mongodb-account.md) and [connect to your account](documentdb-connect-mongodb-account.md).

## Next steps

Information about Azure Cosmos DB: API for MongoDB is integrated into the overall Azure Cosmos DB documentation, but here are a few pointers to get you started:
* Follow the [Connect to a MongoDB account](documentdb-connect-mongodb-account.md) tutorial to learn how to get your account connection string information.
* Follow the [Use MongoChef with Azure Cosmos DB](documentdb-mongodb-mongochef.md) tutorial to learn how to create a connection between your Azure Cosmos DB database and MongoDB app in MongoChef.
* Follow the [Migrate data to Azure Cosmos DB with protocol support for MongoDB](documentdb-mongodb-migrate.md) tutorial to import your data to an API for MongoDB database.
* Build your first API for MongoDB app using [Node.js](documentdb-mongodb-samples.md).
* Build your first API for MongoDB web app using .[NET](documentdb-mongodb-application.md).
* Connect to an API for MongoDB account using [Robomongo](documentdb-mongodb-robomongo.md).
* Learn how many RUs your operations are using with the [GetLastRequestStatistics command and the Azure portal metrics](documentdb-request-units.md#GetLastRequestStatistics).
* Learn how to [configure read preferences for globally distributed apps](documentdb-distribute-data-globally.md#ReadPreferencesAPIforMongoDB).

