---
title: "MongoDB, React, and Node.js tutorial for Azure | Microsoft Docs"
description: Learn how to create a MongoDB app with React and Node.js on Azure Cosmos DB using the exact same APIs you use for MongoDB with this video based tutorial series. 
services: cosmos-db
author: johnpapa
manager: kfile
editor: ''

ms.service: cosmos-db
ms.component: cosmosdb-mongo
ms.devlang: nodejs
ms.topic: tutorial
ms.date: 09/05/2017
ms.author: jopapa
ms.custom: mvc

---
# Create a MongoDB app with React and Azure Cosmos DB  

This multi-part video tutorial demonstrates how to create a hero tracking app with a React front-end. The app used Node and Express for the server, connects to Azure Cosmos DB with the [MongoDB API](mongodb-introduction.md), and then connects the React front-end to the server portion of the app. The tutorial also demonstrates how to do point-and-click scaling of Azure Cosmos DB in the Azure portal and how to deploy the app to the internet so everyone can track their favorite heroes. 

[Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) supports MongoDB client connections, so you can use Azure Cosmos DB in place of MongoDB, but use the same code that you use for MongoDB apps; but with added benefits such as simple cloud deployment, scaling, and super-fast reads and writes.  

This multi-part tutorial covers the following tasks:

> [!div class="checklist"]
> * Introduction
> * Setup the project
> * Build the UI with React
> * Create an Azure Cosmos DB account using the Azure portal
> * Use Mongoose to connect to Azure Cosmos DB
> * Add React, Create, Update, and Delete operations to the app

Want to do build this same app with Angular? See the [Angular tutorial video series](tutorial-develop-mongodb-nodejs.md).

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

This video shows how to read heroes and create heroes in the Cosmos DB database, as well as how to test those methods using Postman and the React UI. 

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

Check back for an additional video in this tutorial series that will cover deploying the application and globally replicating your data.

You can proceed to the next tutorial and learn how to import MongoDB data into Azure Cosmos DB.  

> [!div class="nextstepaction"]
> [Import MongoDB data into Azure Cosmos DB](mongodb-migrate.md)
 
