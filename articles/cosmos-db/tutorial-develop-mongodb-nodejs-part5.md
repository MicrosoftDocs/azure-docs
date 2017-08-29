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
ms.date: 08/23/2017
ms.author: mimig

---
# Create a MongoDB app with Angular and Azure Cosmos DB - Part 5: Use Mongoose to connect to Azure Cosmos DB

Azure Cosmos DB is Microsoft’s globally distributed multi-model database service. With Azure Cosmos DB, can quickly create and query document, key/value, and graph databases that benefit from the global distribution and horizontal scale capabilities at the core of Azure Cosmos DB. 

This multi-part tutorial demonstrates how to create a new [MongoDB API](mongodb-introduction.md) app written in Node.js with Express and Angular and the connect it to your Azure Cosmos DB database. Azure Cosmos DB supports MongoDB client connections, so you can use Azure Cosmos DB in place of MongoDB, but use the exact same code that you use for MongoDB apps. By using Azure Cosmos DB instead of MongoDB, you benefit from the deployment, scaling, security, and super-fast reads and writes that Azure Cosmos DB provides as a managed service. 

Part 5 of the tutorial covers the following tasks:

> [!div class="checklist"]
> * Use Mongoose to connect to Azure Cosmos DB
> * Get connection string information from Azure Cosmos DB
> * Create the hero model
> * Create the hero service to get hero data
> * Run the app locally

## Video walkthrough

> [!VIDEO https://www.youtube.com/embed/sI5hw6KPPXI]


## Prerequisites

Before starting this part of the tutorial, ensure you've completed the steps in [Part 4](tutorial-develop-mongodb-nodejs-part4.md) of the tutorial.

## Use Mongoose to connect to Azure Cosmos DB

1. In a Windows Command Prompt or Mac Terminal window, pull in the Mongoose API, which is an API normally used to talk to MongoDB by using the following command:

    ```bash
    npm i mongoose --save
    ```

2. Now create a new file in your **server** folder called **mongo.js**. In the Explorer pane, right-click the **server** folder, click **New File**, and name the new file **mongo.js**. In this file, you add all of your connection info for the Azure Cosmos DB database.

3. Copy the following code into mongo.js. This code:
    * Requires Mongoose.
    * Overrides the Mongo promise to use the basic promise that's built into ES6 or ES2015 and above.
    * Calls on an env file that lets you set up certain things based on whether you're in staging, prod, or dev. We will create that file soon.
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
4. In the Explorer pane, right-click the **server** folder, click **New Folder**, and name the new folder **env**.

5. In the Explorer pane, right-click the **env** folder, click **New File**, and name the new file **environment.js**.

6. From the mongo.js file, we know we need to include the dbName, the key, and the cosmosPort, so copy the following code into **environment.js**.

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

## Get the connection string information

1. In **environment.js**, change the value of cosmosPort to 10255.

   ```javascript
   const cosmosPort = 10255;
   ```

2. In **environment.js**, change the value of dbName to the Azure Cosmos DB account name you created in [Step 4](tutorial-develop-mongodb-nodejs-part4.md). This is the `<my-cosmosdb-acct>` name from [Step 4](tutorial-develop-mongodb-nodejs-part5.md). 

3. Retrieve the primary key for the Azure Cosmos DB account by using the following CLI command in the terminal window: 

    ```azure-cli-interactive
    az cosmosdb list-keys --name <my-cosmosdb-acct> -g <my-resource-group>
    ```    
    
    * Substitute your own Azure Cosmos DB account name where you see the `<my-cosmosdb-acct>` placeholder. This is the account you created in [Step 4](tutorial-develop-mongodb-nodejs-part4.md).
    * Substitute your own resource group name where you see the `<my-resource-group>` placeholder. This is the account you created in [Step 4](tutorial-develop-mongodb-nodejs-part4.md). 

4. Copy the primary key value from the terminal window into the environment.js window into the `key` value. The value and the dbName value should be surrounded by double quotes in environment.js.

    Your app now has all the information it needs to connect to Azure Cosmos DB. This information can also be retrieved in the portal. For more information, see [Get the MongoDB connection string to customize](connect-mongodb-account.md#GetCustomConnection). The Username in the portal equates to the dbName in environments.js. 

## Create a Hero model

1.  In the Explorer pane, right-click the **server** folder, click **New File**, and name the new file **hero.model.js**.

2. Copy the following code into hero.model.js. This code:
    * Requires Mongoose.
    * Creates a new schema with an ID, name, and saying, and pull it in.
    * Creates a model using the schema.
    * Exports the model. 
    * Name the collection Heroes (instead of Heros, which would be the default name of the collection based on Mongoose plural naming rules).

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

1.  In the Explorer pane, right-click the **server** folder, click **New File**, and name the new file **hero.service.js**.

2. Copy the following code into hero.service.js. This code:
    * Gets the model you just created
    * Connects to the database
    * Creates a docquery variable that uses the hero.find method to define a query that returns all heroes.
    * Runs a query with the docquery.exec with a promise to get a list of all heroes, where the response status is 200. 
    * If the status is 500, sends back the error message
    * Because we're using modules, it get the heroes. 

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

## Add the hero service to routes.js

1. In Visual Studio Code, in **routes.js**, comment out the res.send function that sends the sample hero data and add a line to call the heroService.getHeroes function instead.

    ```javascript
    router.get('/heroes', (req, res) => {
      heroService.getHeroes(req, res);
    //  res.send(200, [
    //      {"id": 10, "name": "Starlord", "saying": "oh yeah"}
    //  ])
    });
    ```

2. In **routes.js** add a const on line 3 to get the hero service:

    ```javascript
    const heroService = require('./hero.service'); 
    ```

3. In **hero.service.js**, update the getHeroes function on line 5 to take the request and response as parameters as follows:

    ```javascript
    function getHeroes(req, res) {
    ```

    Let's take a minute to review and walk through the call chain here. First we come into the index, which sets up the node server, and notice that's setting up and defining our routes. Our routes.js file then talks to the hero service and tells it to go get our functions like getHeroes and pass the request and response. Here hero.service.js is going to grab the model and connect to Mongo, and then it's going to execute getHeroes when we call it, and return back a response of 200. Then it bubbles back out through the chain. 

## Run the app

1. Now lets run the app again. In Visual Studio Code, save all your changes, click the **Debug** button ![Debug icon in Visual Studio Code](./media/tutorial-develop-mongodb-nodejs-part5/debug-button.png) on the left side, then click the **Start Debugging** button ![Debug icon in Visual Studio Code](./media/tutorial-develop-mongodb-nodejs-part5/start-debugging-button.png).

3. Now lets flip over to the browser, open the Developer tools and the Network tab, then navigate to localhost:3000, and there's our application.

    ![New Azure Cosmos DB account in the Azure portal](./media/tutorial-develop-mongodb-nodejs-part5/azure-cosmos-db-heroes-app.png)

   There are no heroes stored in the app yet, but in the next step of the tutorial we'll add the put, push, and delete functionality so we can add, update, and delete heroes from the UI using Mongoose connections to our Azure Cosmos DB database. 

## Next steps

In this part of the tutorial, you've learned how to use Mongoose APIs to connect your heroes app to Azure Cosmos DB and we've added the get heroes functionality to the app.

> [!div class="nextstepaction"]
> [Add Post, Put, and Delete functions to the app](tutorial-develop-mongodb-nodejs-part6.md)
