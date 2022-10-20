---
title: "MongoDB, React, and Node.js tutorial for Azure"
description: Learn how to create a MongoDB app with React and Node.js on Azure Cosmos DB using the exact same APIs you use for MongoDB with this video based tutorial series. 
author: gahl-levy
ms.service: cosmos-db
ms.subservice: mongodb
ms.devlang: javascript
ms.topic: tutorial
ms.date: 08/26/2021
ms.author: gahllevy
ms.reviewer: mjbrown
ms.custom: devx-track-js, ignite-2022
---
# Create a MongoDB app with React and Azure Cosmos DB  
[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

This multi-part video tutorial demonstrates how to create a hero tracking app with a React front-end. The app used Node and Express for the server, connects to Azure Cosmos DB database configured with the [Azure Cosmos DB's API for MongoDB](introduction.md), and then connects the React front-end to the server portion of the app. The tutorial also demonstrates how to do point-and-click scaling of Azure Cosmos DB in the Azure portal and how to deploy the app to the internet so everyone can track their favorite heroes. 

[Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) supports wire protocol compatibility with MongoDB, enabling clients to use Azure Cosmos DB in place of MongoDB.  

This multi-part tutorial covers the following tasks:

> [!div class="checklist"]
> * Introduction
> * Setup the project
> * Build the UI with React
> * Create an Azure Cosmos DB account using the Azure portal
> * Use Mongoose to connect to Azure Cosmos DB
> * Add React, Create, Update, and Delete operations to the app

Want to do build this same app with Angular? See the [Angular tutorial video series](tutorial-develop-nodejs-part-1.md).

## Prerequisites
* [Node.js](https://www.nodejs.org)

### Finished Project
Get the completed application [from GitHub](https://github.com/Azure-Samples/react-cosmosdb).

## Introduction 

In this video, Burke Holland gives an introduction to Azure Cosmos DB and walks you through the app that is created in this video series. 

> [!VIDEO https://www.youtube.com/embed/58IflnJbYJc]

## Project setup

This video shows how set up the Express and React in the same project. Burke then provides a walkthrough of the code in the project.

> [!VIDEO https://www.youtube.com/embed/ytFUPStJJds]

## Build the UI

This video shows how to create the application's user interface (UI) with React. 

> [!NOTE]
> The CSS referenced in this video can be found in the [react-cosmosdb GitHub repo](https://github.com/Azure-Samples/react-cosmosdb/blob/master/src/index.css).

> [!VIDEO https://www.youtube.com/embed/SzHzX0fTUUQ]

## Connect to Azure Cosmos DB

This video shows how to create an Azure Cosmos DB account in the Azure portal, install the MongoDB and Mongoose packages, and then connect the app to the newly created account using the Azure Cosmos DB connection string. 

> [!VIDEO https://www.youtube.com/embed/0U2jV1thfvs]

## Read and create heroes in the app

This video shows how to read heroes and create heroes in the Azure Cosmos DB database, as well as how to test those methods using Postman and the React UI. 

> [!VIDEO https://www.youtube.com/embed/AQK9n_8fsQI] 

## Delete and update heroes in the app

This video shows how to delete and update heroes from the app and display the updates in the UI. 

> [!VIDEO https://www.youtube.com/embed/YmaGT7ztTQM] 

## Complete the app

This video shows how to complete the app and finish hooking the UI up to the backend API. 

> [!VIDEO https://www.youtube.com/embed/TcSm2ISfTu8]

## Clean up resources

If you're not going to continue to use this app, use the following steps to delete all resources created by this tutorial in the Azure portal. 

1. From the left-hand menu in the Azure portal, click **Resource groups** and then click the name of the resource you created. 
2. On your resource group page, click **Delete**, type the name of the resource to delete in the text box, and then click **Delete**.

## Next steps

In this tutorial, you've learned how to:

> [!div class="checklist"]
> * Create an app with React, Node, Express, and Azure Cosmos DB 
> * Create an Azure Cosmos DB account
> * Connect the app to the Azure Cosmos DB account
> * Test the app using Postman
> * Run the application and add heroes to the database

You can proceed to the next tutorial and learn how to import MongoDB data into Azure Cosmos DB.  

> [!div class="nextstepaction"]
> [Import MongoDB data into Azure Cosmos DB](../../dms/tutorial-mongodb-cosmos-db.md?toc=%2fazure%2fcosmos-db%2ftoc.json%253ftoc%253d%2fazure%2fcosmos-db%2ftoc.json)

Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
* If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
* If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-capacity-planner.md)
