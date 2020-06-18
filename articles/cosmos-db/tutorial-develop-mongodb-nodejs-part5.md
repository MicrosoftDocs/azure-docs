---
title: Connect the Angular app to Azure Cosmos DB's API for MongoDB using Mongoose
description: This tutorial describes how to build a Node.js application by using Angular and Express to manage the data stored in Cosmos DB. In this part, you use Mongoose to connect to Azure Cosmos DB.
author: johnpapa
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.devlang: nodejs
ms.topic: tutorial
ms.date: 12/26/2018
ms.author: jopapa
ms.custom: seodec18
ms.reviewer: sngun
#Customer intent: As a developer, I want to build a Node.js application, so that I can manage the data stored in Cosmos DB.
---

# Create an Angular app with Azure Cosmos DB's API for MongoDB - Use Mongoose to connect to Cosmos DB

This multi-part tutorial demonstrates how to create a Node.js app with Express and Angular, and connect it to it to your [Cosmos account configured with Cosmos DB's API for MongoDB](mongodb-introduction.md). This article describes Part 5 of the tutorial and builds on [Part 4](tutorial-develop-mongodb-nodejs-part4.md).

In this part of the tutorial, you will:

> [!div class="checklist"]
> * Use Mongoose to connect to Cosmos DB.
> * Get your Cosmos DB connection string.
> * Create the Hero model.
> * Create the Hero service to get Hero data.
> * Run the app locally.

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

* Before you start this tutorial, complete the steps in [Part 4](tutorial-develop-mongodb-nodejs-part4.md).

* This tutorial requires that you run the Azure CLI locally. You must have the Azure CLI version 2.0 or later installed. Run `az --version` to find the version. If you need to install or upgrade the Azure CLI, see [Install the Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli).

* This tutorial walks you through the steps to build the application step by step. If you want to download the finished project, you can get the completed application from the [angular-cosmosdb repo](https://github.com/Azure-Samples/angular-cosmosdb) on GitHub.

## Use Mongoose to connect

Mongoose is an object data modeling (ODM) library for MongoDB and Node.js. You can use Mongoose to connect to your Azure Cosmos DB account. Use the following steps to install Mongoose and connect to Azure Cosmos DB:

1. Install the mongoose npm module, which is an API that's used to talk to MongoDB.

    ```bash
    npm i mongoose --save
    ```

1. In the **server** folder, create a file named **mongo.js**. You'll add the connection details of your Azure Cosmos DB account to this file.

1. Copy the following code into the **mongo.js** file. The code provides the following functionality:

   * Requires Mongoose.
   * Overrides the Mongo promise to use the basic promise that's built into ES6/ES2015 and later versions.
   * Calls on an env file that lets you set up certain things based on whether you're in staging, production, or development. You'll create that file in the next section.
   * Includes the MongoDB connection string, which is set in the env file.
   * Creates a connect function that calls Mongoose.

     ```javascript
     const mongoose = require('mongoose');
     /**
     * Set to Node.js native promises
     * Per https://mongoosejs.com/docs/promises.html
     */
     mongoose.Promise = global.Promise;

     const env = require('./env/environment');

     // eslint-disable-next-line max-len
     const mongoUri = `mongodb://${env.accountName}:${env.key}@${env.accountName}.documents.azure.com:${env.port}/${env.databaseName}?ssl=true`;

     function connect() {
     mongoose.set('debug', true);
     return mongoose.connect(mongoUri, { useMongoClient: true });
     }

     module.exports = {
     connect,
     mongoose
     };
     ```
    
1. In the Explorer pane, under **server**, create a folder named **environment**. In the **environment** folder, create a file named **environment.js**.

1. From the mongo.js file, we need to include values for the `dbName`, the `key`, and the `cosmosPort` parameters. Copy the following code into the **environment.js** file:

    ```javascript
    // TODO: replace if yours are different
    module.exports = {
      accountName: 'your-cosmosdb-account-name-goes-here',
      databaseName: 'admin', 
      key: 'your-key-goes-here',
      port: 10255
    };
    ```

## Get the connection string

To connect your application to Azure Cosmos DB, you need to update the configuration settings for the application. Use the following steps to update the settings: 

1. In the Azure portal, get the port number, Azure Cosmos DB account name, and primary key values for your Azure Cosmos DB account.

1. In the **environment.js** file, change the value of `port` to 10255. 

    ```javascript
    const port = 10255;
    ```

1. In the **environment.js** file, change the value of `accountName` to the name of the Azure Cosmos DB account that you created in [Part 4](tutorial-develop-mongodb-nodejs-part4.md) of the tutorial. 

1. Retrieve the primary key for the Azure Cosmos DB account by using the following CLI command in the terminal window: 

    ```azure-cli-interactive
    az cosmosdb list-keys --name <cosmosdb-name> -g myResourceGroup
    ```    
    
    \<cosmosdb-name> is the name of the Azure Cosmos DB account that you created in [Part 4](tutorial-develop-mongodb-nodejs-part4.md) of the tutorial.

1. Copy the primary key into the **environment.js** file as the `key` value.

Now your application has all the necessary information to connect to Azure Cosmos DB. 

## Create a Hero model

Next, you need to define the schema of the data to store in Azure Cosmos DB by defining a model file. Use the following steps to create a _Hero model_ that defines the schema of the data:

1. In the Explorer pane, under the **server** folder, create a file named **hero.model.js**.

1. Copy the following code into the **hero.model.js** file. The code provides the following functionality:

   * Requires Mongoose.
   * Creates a new schema with an ID, name, and saying.
   * Creates a model by using the schema.
   * Exports the model. 
   * Names the collection **Heroes** (instead of **Heros**, which is the default name of the collection based on Mongoose plural naming rules).

   ```javascript
   const mongoose = require('mongoose');

   const Schema = mongoose.Schema;

   const heroSchema = new Schema(
     {
       id: { type: Number, required: true, unique: true },
       name: String,
       saying: String
     },
     {
       collection: 'Heroes'
     }
   );

   const Hero = mongoose.model('Hero', heroSchema);

   module.exports = Hero;
   ```

## Create a Hero service

After you create the hero model, you need to define a service to read the data, and perform list, create, delete, and update operations. Use the following steps to create a _Hero service_ that queries the data from Azure Cosmos DB:

1. In the Explorer pane, under the **server** folder, create a file named **hero.service.js**.

1. Copy the following code into the **hero.service.js** file. The code provides the following functionality:

   * Gets the model that you created.
   * Connects to the database.
   * Creates a `docquery` variable that uses the `hero.find` method to define a query that returns all heroes.
   * Runs a query with the `docquery.exec` function with a promise to get a list of all heroes, where the response status is 200. 
   * Sends back the error message if the status is 500.
   * Gets the heroes because we're using modules. 

   ```javascript
   const Hero = require('./hero.model');

   require('./mongo').connect();

   function getHeroes() {
     const docquery = Hero.find({});
     docquery
       .exec()
       .then(heroes => {
         res.status(200).json(heroes);
       })
       .catch(error => {
         res.status(500).send(error);
         return;
       });
   }

   module.exports = {
     getHeroes
   };
   ```

## Configure routes

Next, you need to set up routes to handle the URLs for get, create, read, and delete requests. The routing methods specify callback functions (also called _handler functions_). These functions are called when the application receives a request to the specified endpoint and HTTP method. Use the following steps to add the Hero service and to define your routes:

1. In Visual Studio Code, in the **routes.js** file, comment out the `res.send` function that sends the sample hero data. Add a line to call the `heroService.getHeroes` function instead.

    ```javascript
    router.get('/heroes', (req, res) => {
      heroService.getHeroes(req, res);
    //  res.send(200, [
    //      {"id": 10, "name": "Starlord", "saying": "oh yeah"}
    //  ])
    });
    ```

1. In the **routes.js** file, `require` the hero service:

    ```javascript
    const heroService = require('./hero.service'); 
    ```

1. In the **hero.service.js** file, update the `getHeroes` function to take the `req` and `res` parameters as follows:

    ```javascript
    function getHeroes(req, res) {
    ```

Let's take a minute to review and walk through the previous code. First, we come into the index.js file, which sets up the node server. Notice that it sets up and defines your routes. Next, your routes.js file talks to the hero service and tells it to get your functions, like **getHeroes**, and pass the request and response. The hero.service.js file gets the model and connects to Mongo. Then it executes **getHeroes** when we call it, and returns back a response of 200. 

## Run the app

Next, run the app by using the following steps:

1. In Visual Studio Code, save all your changes. On the left, select the **Debug** button ![Debug icon in Visual Studio Code](./media/tutorial-develop-mongodb-nodejs-part5/debug-button.png), and then select the **Start Debugging** button ![Debug icon in Visual Studio Code](./media/tutorial-develop-mongodb-nodejs-part5/start-debugging-button.png).

1. Now switch to the browser. Open the **Developer tools** and the **Network tab**. Go to `http://localhost:3000`, and there you see our application.

    ![New Azure Cosmos DB account in the Azure portal](./media/tutorial-develop-mongodb-nodejs-part5/azure-cosmos-db-heroes-app.png)

There are no heroes stored yet in the app. In the next part of this tutorial, we'll add put, push, and delete functionality. Then we can add, update, and delete heroes from the UI by using Mongoose connections to our Azure Cosmos database. 

## Clean up resources

When you no longer need the resources, you can delete the resource group, Azure Cosmos DB account, and all the related resources. Use the following steps to delete the resource group:

 1. Go to the resource group where you created the Azure Cosmos DB account.
 1. Select **Delete resource group**.
 1. Confirm the name of the resource group to delete, and select **Delete**.

## Next steps

Continue to Part 6 of the tutorial to add Post, Put, and Delete functions to the app:

> [!div class="nextstepaction"]
> [Part 6: Add Post, Put, and Delete functions to the app](tutorial-develop-mongodb-nodejs-part6.md)
