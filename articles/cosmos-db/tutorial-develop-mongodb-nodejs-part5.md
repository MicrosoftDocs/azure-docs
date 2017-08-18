---
title: "Azure Cosmos DB: Create a MEAN.js app - Part 5 | Microsoft Docs"
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
ms.date: 08/18/2017
ms.author: mimig
ms.custom: mvc

---
# Azure Cosmos DB: Create a MEAN.js app - Part 5: Use Mongoose to connect

Azure Cosmos DB is Microsoft’s globally distributed multi-model database service. You can quickly create and query document, key/value, and graph databases, all of which benefit from the global distribution and horizontal scale capabilities at the core of Azure Cosmos DB. 

This multi-part tutorial demonstrates how to create a new [MongoDB](mongodb-introduction.md) API app written in Node.js with Express and Angular and connect it to your Azure Cosmos DB database. Azure Cosmos DB supports MongoDB client connections, so you can use Azure Cosmos DB in place of Mongo, but use the exact same code that you use when you talk to Mongo. By using Azure Cosmos DB instead of MongoDB, you benefit from the deployment, scaling, security, and super-fast reads and writes that Azure Cosmos DB provides as a managed service. 

Part 3 of the tutorial covers the following tasks:

> [!div class="checklist"]
> * 

## Video walkthrough

> [!VIDEO https://www.youtube.com/embed/vlZRP0mDabM]

## Prerequisites

Before starting this part of the tutorial, ensure you've completed the steps in [Part 4](tutorial-develop-mongodb-nodejs-part4.md) of the tutorial.

## Use Mongoose to connect to Azure Cosmos DB

 1. In a Windows Command Prompt or Mac Terminal window, pull in the Mongoose API, which is an API normally used to talk to MongoDB by using the following command.

     ```
     npm i mongoose --save
     ```

2. Now create a new file in your server folder called mongo. In the Explorer pane, right click the server folder, click New File, and name the new file mongo.js. In this file we'll add all of our connection info for the Azure Cosmos DB database.

3. Copy the following code into mongo.js. This code:
    * Requires Mongoose.
    * Overrides the Mongo promise to use the basic Promise that's built into ES6 or ES2015 and above.
    * Calls on an env file that lets me set up certain things based on whether I'm in staging, prod or dev (we'll have to create that file soon).
    * Includes our MongoDB connection string, which will be set in the env file.
    * Creates a connect function that calls Mongoose.

    ```javascript
    const mongoose = require('mongoose');
    /**
     * Set to Node.js native promises
     * Per http://mongoosejs.com/docs/promises.html
     */
    mongoose.Promise = global.Promise;

    const env = require('./env/environment');

    // eslint-disable-next-line max-len
    const mongoUri = `mongodb://${env.dbName}:${env.key}@${env.dbName}.documents.azure.com:${env.cosmosPort}/?ssl=true`; //&replicaSet=globaldb`;

    function connect() {
     mongoose.set('debug', true);
     return mongoose.connect(mongoUri, { useMongoClient: true });
    }

    module.exports = {
      connect,
      mongoose
    };
    ```
3. In the Explorer pane, right click the server folder, click New Folder, and name the new folder env.

4. In the Explorer pane, right click the env folder, click New File, and name the new file environment.js.

5. From the mongo.js file, we know we need to include the dbName, the key, and the cosmosPort, so copy the following code into environment.js.

    ```javascript
    const cosmosPort = 1234; // replace with your port
    const dbName = 'your-cosmos-db-name-goes-here';
    const key = 'your-key-goes-here';

    module.exports = {
      dbName,
      key,
      cosmosPort
    };
    ```
 TODO - Complete

## Next steps

In this video, you've learned the benefits of using Azure Cosmos DB to create MEAN apps and you've learned the steps involved in creating a MEAN.js app for Azure Cosmos DB that are covered in rest of the tutorial series. 

> [!div class="nextstepaction"]
> [Add PUT, POST, and DELETE commands](tutorial-develop-mongodb-nodejs-part6.md)
