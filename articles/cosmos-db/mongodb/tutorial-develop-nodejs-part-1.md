---
title: Node.Js, Angular app using Azure Cosmos DB's API for MongoB (Part1)
description: Learn how to create a MongoDB app with Angular and Node on Azure Cosmos DB using the exact same APIs you use for MongoDB with this video based tutorial series.
author: gahl-levy
ms.service: cosmos-db
ms.subservice: mongodb
ms.devlang: javascript
ms.topic: tutorial
ms.date: 08/26/2021
ms.author: gahllevy
ms.custom: seodec18, ignite-2022, devx-track-js
ms.reviewer: mjbrown
---
# Create an Angular app with Azure Cosmos DB's API for MongoDB
[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

This multi-part tutorial demonstrates how to create a new app written in Node.js with Express and Angular and then connect it to your [Azure Cosmos DB account configured with Azure Cosmos DB's API for MongoDB](introduction.md).

Azure Cosmos DB is Microsoft’s fast NoSQL database with open APIs for any scale. It allows you to develop modern apps with SLA-backed speed and availability, automatic and instant scalability, and open source APIs for many NoSQL engines.

This multi-part tutorial covers the following tasks:

> [!div class="checklist"]
> * [Create a Node.js Express app with the Angular CLI](tutorial-develop-nodejs-part-2.md)
> * [Build the UI with Angular](tutorial-develop-nodejs-part-3.md)
> * [Create an Azure Cosmos DB account using the Azure CLI](tutorial-develop-nodejs-part-4.md) 
> * [Use Mongoose to connect to Azure Cosmos DB](tutorial-develop-nodejs-part-5.md)
> * [Add Post, Put, and Delete functions to the app](tutorial-develop-nodejs-part-6.md)

Want to do build this same app with React? See the [React tutorial video series](tutorial-develop-react.md).

## Video walkthrough

> [!VIDEO https://www.youtube.com/embed/vlZRP0mDabM]

## Finished project 

This tutorial walks you through the steps to build the application step-by-step. If you want to download the finished project, you can get the completed application from the [angular-cosmosdb repo](https://github.com/Azure-Samples/angular-cosmosdb) on GitHub.

## Next steps

In this part of the tutorial, you've done the following:

> [!div class="checklist"]
> * Seen an overview of the steps to create a MEAN.js app with Azure Cosmos DB. 

You can proceed to the next part of the tutorial to create the Node.js Express app.

> [!div class="nextstepaction"]
> [Create a Node.js Express app with the Angular CLI](tutorial-develop-nodejs-part-2.md)

Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
* If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
* If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-capacity-planner.md)
