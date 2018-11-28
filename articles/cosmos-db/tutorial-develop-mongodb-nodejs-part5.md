---
title: "MongoDB, Angular, and Node tutorial for Azure - Part 5 | Microsoft Docs"
description: Part 5 of the tutorial series on creating a MongoDB app with Angular and Node on Azure Cosmos DB using the exact same APIs you use for MongoDB
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
#Customer intent: As a < type of user >, I want < what? > so that < why? >.
---

# Tutorial: Use Mongoose to connect to Azure Cosmos DB (Part 5 of Create a MongoDB app with Angular and Azure Cosmos DB)

This multi-part tutorial demonstrates how to create a Node.js app with Express and Angular, and connect it to an [Azure Cosmos DB MongoDB API](mongodb-introduction.md) account. This article describes Part 5 of the tutorial and builds on [Part 4](tutorial-develop-mongodb-nodejs-part4.md).

In this part of the tutorial, you will:

> [!div class="checklist"]
> * Use Mongoose to connect to Azure Cosmos DB.
> * Get your Azure Cosmos DB connection string.
> * Create the Hero model.
> * Create the Hero service to get Hero data.
> * Run the app locally.

<!-- Remove heading. 
## Video walkthrough
-->
Watch the following video to quickly learn the steps described in this article: 

> [!VIDEO https://www.youtube.com/embed/sI5hw6KPPXI]

<!-- Include a link to add a free Azure account here. -->
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

<!-- Prerequisites must be the first H2 section in the tutorial. -->
## Prerequisites

* Before you start this part of the tutorial, complete the steps in [Part 4](tutorial-develop-mongodb-nodejs-part4.md).

<!-- When all commands don't run in Cloud Shell, instruct the user to install the CLI locally. -->
<!-- Replace the <version #> placeholder with the specific version requirements. -->
* This part of the tutorial requires that you run the Azure CLI locally. You must have the Azure CLI \<version 2.0.4\> or later installed. Run `az --version` to find the version. If you need to install or upgrade the Azure CLI, see [Install the Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli).

<!-- Avoid the use of alert boxes in tutorials. Reformat as plain text with a bold heading.
> [!TIP]
> This tutorial walks you through the steps to build the application step-by-step. If you want to download the finished project, you can get the completed application from the [angular-cosmosdb repo](https://github.com/Azure-Samples/angular-cosmosdb) on GitHub.
-->
* This tutorial walks you through the steps to build the application step by step. If you want to download the finished project, you can get the completed application from the [angular-cosmosdb repo](https://github.com/Azure-Samples/angular-cosmosdb) on GitHub.

## Use Mongoose to connect
<!-- Add one or two transitional sentences to explain why the steps need to be performed or how they contribute to the whole. -->

1. Install the mongoose npm module, which is an API that's used to talk to MongoDB.

    ```bash
    npm i mongoose --save
    ```

1. In the **server** folder, create a file named **mongo.js**. You'll add the connection details of your Azure Cosmos DB account to this file.

1. Copy the following code into the **mongo.js** file. The code provides the following functionality:

    * Requires Mongoose.
    * Overrides the Mongo promise to use the basic promise that's built into ES6/ES2015 and later versions.
    * Calls on an env file that lets you set up certain things based on whether you're in staging, production, or development. You'll create that file in the next section.
    * Include the MongoDB connection string, which is set in the env file.
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
<!-- Add one or two transitional sentences to explain why the steps need to be performed or how they contribute to the whole. -->

1. In the **environment.js** file, change the value of `port` to 10255. (You can find your Azure Cosmos DB port in the Azure portal.)

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

    Your app now has all the information it needs to connect to Azure Cosmos DB. This information can also be retrieved in the portal. For more information, see [Get the MongoDB connection string to customize](connect-mongodb-account.md#GetCustomConnection). The username in the portal equates to the `dbName` in **environments.js** file. 

## Create a Hero model
<!-- Add one or two transitional sentences to explain why the steps need to be performed or how they contribute to the whole. -->

1. In the Explorer pane, under the **server** folder, create a file named **hero.model.js**.

1. Copy the following code into the **hero.model.js** file. The code provides the following functionality:

   * Requires Mongoose.
   * Creates a new schema with an ID, name, and saying.
   * Creates a model by using the schema.
   * Exports the model. 
   * Name the collection **Heroes** (instead of **Heros**, which is the default name of the collection based on Mongoose plural naming rules).

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
<!-- Add one or two transitional sentences to explain why the steps need to be performed or how they contribute to the whole. -->

1. In the Explorer pane, under the **server** folder, create a file named **hero.service.js**.

1. Copy the following code into the **hero.service.js** file. The code provides the following functionality:

   * Gets the model that you just created.
   * Connects to the database.
   * Creates a `docquery` variable that uses the `hero.find` method to define a query that returns all heroes.
   * Runs a query with the `docquery.exec` function with a promise to get a list of all heroes, where the response status is 200. 
   * If the status is 500, send back the error message.
   * Because we're using modules, it gets the heroes. 

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

## Add the Hero service
<!-- Add one or two transitional sentences to explain why the steps need to be performed or how they contribute to the whole. -->

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

Let's take a minute to review and walk through the call chain. First, we come into the index.js file, which sets up the node server. Notice that it sets up and defines your routes. Next, your routes.js file talks to the hero service and tells it to get your functions, like getHeroes, and pass the request and response. Here the hero.service.js gets the model and connects to Mongo. Then it executes **getHeroes** when we call it, and returns back a response of 200. Then it bubbles back out through the chain. 

## Run the app
<!-- Add one or two transitional sentences to explain why the steps need to be performed or how they contribute to the whole. -->

Let's run the app again.

1. In Visual Studio Code, save all your changes. On the left, select the **Debug** button ![Debug icon in Visual Studio Code](./media/tutorial-develop-mongodb-nodejs-part5/debug-button.png), and then select the **Start Debugging** button ![Debug icon in Visual Studio Code](./media/tutorial-develop-mongodb-nodejs-part5/start-debugging-button.png).

1. Now switch to the browser. Open the **Developer tools** and the **Network tab**. Navigate to http://localhost:3000 and there you see our application.

    ![New Azure Cosmos DB account in the Azure portal](./media/tutorial-develop-mongodb-nodejs-part5/azure-cosmos-db-heroes-app.png)

There are no heroes stored yet in the app. In the next part of this tutorial, we'll add put, push, and delete functionality. Then we can add, update, and delete heroes from the UI by using Mongoose connections to our Azure Cosmos DB database. 

<!-- Add required section. -->
## Clean up resources

<!-- Update this section as needed. -->
None. 

## Next steps

<!-- The Next steps section should contain only a single blue link and any necessary introductory text for the link.
In Part 5 of the tutorial, you completed the following tasks:

> [!div class="checklist"]
> * Used Mongoose APIs to connect your Heroes app to Azure Cosmos DB. 
> * Added the get heroes functionality to the app.
-->
Continue to Part 6 of the tutorial to add Post, Put, and Delete functions to the app:

> [!div class="nextstepaction"]
> [Part 6: Add Post, Put, and Delete functions to the app](tutorial-develop-mongodb-nodejs-part6.md)
