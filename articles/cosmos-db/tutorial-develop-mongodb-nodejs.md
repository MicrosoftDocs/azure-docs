---
title: Azure Cosmos DB: Create a MEAN.js app with the MongoDB API, Express, Angular and Node.js | Microsoft Docs
description: Learn how to create a MEAN.js app for Azure Cosmos DB using the exact same APIs you use for MongoDB. 
services: cosmos-db
documentationcenter: ''
author: mimig1
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: cosmos-db
ms.workload: 
ms.tgt_pltfrm: na
ms.devlang: nodejs
ms.topic: hero-article
ms.date: 08/11/2017
ms.author: mimig
ms.custom: mvc

---
# Azure Cosmos DB: Create a MEAN.js app 

Azure Cosmos DB is Microsoft’s globally distributed multi-model database service. You can quickly create and query document, key/value, and graph databases, all of which benefit from the global distribution and horizontal scale capabilities at the core of Azure Cosmos DB. 

This multi-part tutorial demonstrates how to create a new [MongoDB](mongodb-introduction.md) API app written in Node.js with Express and Angular and connect it to your Azure Cosmos DB database. Azure Cosmos DB supports MongoDB client connections, so you can use Azure Cosmos DB in place of Mongo, but use the exact same code that you use when you talk to Mongo. By using Azure Cosmos DB instead of MongoDB, you benefit from the deployment, scaling, security, and super-fast reads and writes that Azure Cosmos DB provides as a managed service. 

This tutorial covers the following tasks:

> [!div class="checklist"]
> * [Part 2: Create a Node.js app with Express and Angular]
> * Create an Azure Cosmos DB account 
> * Use Mongoose to handle MongoDB API connections
> * Deploy the app
> * Query the app
> * Add PUT, POST, and DELETE commands

> [!VIDEO https://www.youtube.com/embed/vlZRP0mDabM]

## Prerequisites 
In addition to Azure CLI, you need [Node.js](https://nodejs.org/) and [Git](http://www.git-scm.com/downloads) installed locally to run `npm` and `git` commands.

You should have working knowledge of Node.js. This quickstart is not intended to help you with developing Node.js applications in general.


## Next steps

In this quickstart, you've learned how to create an Azure Cosmos DB account and create a MongoDB collection using the Data Explorer. You can now migrate your MongoDB data to Azure Cosmos DB.  

> [!div class="nextstepaction"]
> [Create the Node.js and Express App](mongodb-migrate.md)
