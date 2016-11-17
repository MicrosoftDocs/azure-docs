---
title: DocumentDB protocol support for MongoDB | Microsoft Docs
description: Learn about DocumentDB protocol support for MongoDB, now available in public preview.
keywords: mongodb
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
ms.date: 11/17/2016
ms.author: anhoh

---
# DocumentDB protocol support for MongoDB

## What is DocumentDB protocol support for MongoDB?
DocumentDB databases can now be used as the data store for apps written for MongoDB. Using existing [drivers](https://docs.mongodb.org/ecosystem/drivers/) for MongoDB, applications can easily and transparently communicate with DocumentDB, in many cases by simply changing a connection string.  Using this preview functionality, customers can easily build and run applications in the Azure cloud - leveraging DocumentDB's fully managed and scalable NoSQL databases - while continuing to use familiar skills and tools for MongoDB.

## What are the benefits of using DocumentDB protocol support for MongoDB?
**No Server Management** - DocumentDB is a fully managed service, which means you do not have to manage any infrastructure or Virtual Machines yourself. DocumentDB is available in 20+ [Azure Regions](https://azure.microsoft.com/regions/services/).

**Limitless Scale** - You can scale throughput and storage independently and elastically. You can add capacity to serve millions of requests per second with ease.

**Enterprise grade** - DocumentDB supports multiple local replicas to deliver 99.99% availability and data protection in the face of local and regional failures. DocumentDB has enterprise grade [compliance certifications](https://www.microsoft.com/trustcenter) and security features. 

## How to get started?
Create a DocumentDB account with protocol support for MongoDB in the (Azure Portal)[https://portal.azure.com] and swap the connection to your new account. 

*And, that's it!*

For more detailed instructions, follow [create account](documentdb-create-mongodb-account.md) and [connect to your account](documentdb-connect-mongodb-account.md).

## Next steps
* Learn how to [create](documentdb-create-mongodb-account.md) a DocumentDB account with protocol support for MongoDB.
* Learn how to [connect](documentdb-connect-mongodb-account.md) to a DocumentDB account with protocol support for MongoDB.
* Learn how to [use MongoChef](documentdb-mongodb-mongochef.md) with a DocumentDB account with protocol support for MongoDB.
* Explore DocumentDB with protocol support for MongoDB [samples](documentdb-mongodb-samples.md).

