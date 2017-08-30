---
title: "MongoDB, React and Node tutorial for Azure | Microsoft Docs"
description: Learn how to create a MongoDB app with React and Node on Azure Cosmos DB using the exact same APIs you use for MongoDB with this video based tutorial series. 
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
ms.date: 08/31/2017
ms.author: mimig
ms.custom: mvc

---
# Create a MongoDB app with React and Azure Cosmos DB  

This multi-part video tutorial demonstrates how to create a new hero tracking app with a React front-end. The app uses APIs for Node and Express, connects to the Azure Cosmos DB and the [MongoDB API](mongodb-introduction.md), and then connects the React front-end to the server portion of the app. You'll also learn how to do point and click scaling in the Azure portal and how to can deploy this app to the internet so everyone can track their favorite heroes. 

[Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) supports MongoDB client connections, so you can use Azure Cosmos DB in place of MongoDB, but use the same code that you use for MongoDB apps but with added benefits. These benefits from Azure Cosmos DB are simple cloud deployment, scaling, security, and super-fast reads and writes.  

This multi-part tutorial covers the following tasks:

> [!div class="checklist"]
> * Introduction
> * Setup your React project
> * Build the UI with Angular
> * Create an Azure Cosmos DB account using the Azure portal
> * Use Mongoose to connect to Azure Cosmos DB
> * Add Post, Put, and Delete functions to the app

## Introduction 

In this video Burke gives an introduction to Azure Cosmos DB and walks you through the app that is created in this video series. 

> [!VIDEO https://www.youtube.com/embed/mcBUdC_978A]

## Project setup

This video shows how to clone and set up the Express and React starter project. Burke then provides a walkthrough of the code in the project.

> [!VIDEO https://www.youtube.com/embed/LmAhD_ILNrk]

## Build the UI

This video shows how to modify the code in the Express and React starter project to add the custom Heroes UI. 

> [!VIDEO https://www.youtube.com/embed/NIg5VJA5BQw]

## Connect to Azure Cosmos DB

This video shows how to create an Azure Cosmos DB account in the Azure portal, install the MongoDB and Mongoose packages, and then connect the app to the newly created account using the Azure Cosmos DB connection string. 

> [!VIDEO https://www.youtube.com/embed/AiVy1RjSpG4]

## Read and create heroes in the app

This video shows how to read and create heroes from the app and display them in the UI and test it using Postman. 

> [!VIDEO https://www.youtube.com/embed/TYwYkQqPotM] 

## Delete and update heroes in the app

This video shows how to delete and update heroes from the app and display the updates in the UI. 

> [!VIDEO https://www.youtube.com/embed/mKzk_5RQz28] 

## Delete and update heroes in the app

This video shows how to hook up the read, create, delete, and update APIs to the UI. 

> [!VIDEO https://www.youtube.com/embed/mKzk_5RQz28] 

## Clean up resources

If you're not going to continue to use this app, use the following steps to delete all resources created by this tutorial in the Azure portal. 

1. From the left-hand menu in the Azure portal, click **Resource groups** and then click the name of the resource you created. 
2. On your resource group page, click **Delete**, type the name of the resource to delete in the text box, and then click **Delete**.

## Next steps

In this tutorial, you've learned how to:

> [!div class="checklist"]
> * Create an app with React, Node, Express, and Mongoose 
> * Create an Azure Cosmos DB account
> * Connect the app to the Azure Cosmos DB account
> * Test the app using Postman
> * Run the application and add heroes to the database

The final installment of this multi-part tutorial, which involves globally replicating your data, is coming soon. Check back for updates. 

You can proceed to the next tutorial and learn how to import MongoDB data into Azure Cosmos DB.  

> [!div class="nextstepaction"]
> [Import MongoDB data into Azure Cosmos DB](mongodb-migrate.md)
 