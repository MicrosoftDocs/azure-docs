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
# Azure Cosmos DB: Create a MEAN.js app - Part 5: Use Mongoose to connect to Azure Cosmos DB

Azure Cosmos DB is Microsoft’s globally distributed multi-model database service. You can quickly create and query document, key/value, and graph databases, all of which benefit from the global distribution and horizontal scale capabilities at the core of Azure Cosmos DB. 

This multi-part tutorial demonstrates how to create a new [MongoDB](mongodb-introduction.md) API app written in Node.js with Express and Angular and connect it to your Azure Cosmos DB database. Azure Cosmos DB supports MongoDB client connections, so you can use Azure Cosmos DB in place of Mongo, but use the exact same code that you use when you talk to Mongo. By using Azure Cosmos DB instead of MongoDB, you benefit from the deployment, scaling, security, and super-fast reads and writes that Azure Cosmos DB provides as a managed service. 

Part 5 of the tutorial covers the following tasks:

> [!div class="checklist"]
> * Using Mongoose to connect to Azure Cosmos DB
> * Retrieving connection string information from Azure Cosmos DB
> * Create the hero model
> * Create the hero service to get hero data

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

## Get the connection string information

1. In environment.js, change the value of cosmosPort to 10255.

   ```
   const cosmosPort = 10255;
   ```

2. In environment.js, change the value of dbName to the Azure Cosmos DB account name you created in [Step 4](tutorial-develop-mongodb-nodejs-part4.md). This is the `<my-cosmosdb-acct>` name from Step 4. 

3. Retrieve the primary key for the Azure Cosmos DB account by using the following CLI command in the terminal window: 

    ```azure-cli-interactive
    az cosmosdb list-keys --name <my-cosmosdb-acct> -g <my-resource-group>"
    ```    
    
    * Substitute your own Azure Cosmos DB account name where you see the `<my-cosmosdb-acct>` placeholder. This is the account you created in [Step 4](tutorial-develop-mongodb-nodejs-part4.md).
    * Substitute your own resource group name where you see the `<my-resource-group>` placeholder. This is the account you created in [Step 4](tutorial-develop-mongodb-nodejs-part4.md). 

4. Copy the primary key value from the terminal window into the environment.js window into the `key` value. The value should be surrounded by double quotes.

    Your app now has all the information it needs to connect to Azure Cosmos DB. This information can also be retrieved in the portal, see [Get the MongoDB connection string to customize](connect-mongodb-account.md#GetCustomConnection) for more information. The Username in the portal equates to the dbName in environments.js. 

## Create a Hero model

1.  In the Explorer pane, right click the server folder, click New File, and name the new file hero.model.js.

2. Copy the following code into hero.model.js. This code:
    * Requires Mongoose.
    * Create a new schema with an id, name, and saying, and pull it in
    * Create a model using the schema
    * Export the model 
    * Name the collection Heroes (instead of Heros, which would be the default name of the collection based on Mongoose plural naming rules)


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

1.  In the Explorer pane, right click the server folder, click New File, and name the new file hero.service.js.

2. Copy the following code into hero.service.js. This code:
    * Go get the model you just created
    * Connect to the database
    * Create a docquery variable that uses the hero.find method to define a query that returns all heroes
    * Run a query with the docquery.exec with a promise to get a list of all heroes, where the response status is 200 
    * If the status is 500, send back the error message
    * Because we're using modules, get the heroes 

    ```
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

## Add hero service to routes.js

1. In Visual Studio Code, in routes.js, comment out the res.send function that sent the sample hero data and call the heroService.getHeroes function instead.

    ```javascript
    router.get('/heroes', (req, res) => {
      heroService.getHeroes(req, res);
    //  res.send(200, [
    //      {"id": 10, "name": "Starlord", "saying": "oh yeah"}
    //  ])
    });
    ```

2. In routes.js add a const to get the hero service:

    const heroService = require('./hero.service'): 

3. In hero.service.js, update the getHeroes function to take the request and response as parameters as follows:

    ```
    function getHeroes(req, res) {
    ```

Let's review and walk through the chain here. First we come into the index, which sets up the node server, and notice that's setting up and defining our routes. Our routes file then talks to the hero service and says lets go get our functions like getHeroes and pass request and response. Here hero.service.js is going to grab the model, and connect to Mongo, and then it's going to execute getHeroes when we call it, and return back a response of 200. Then it will bubble back out through the chain. 

## Run the app

1. Now lets run the app again. In Visual Studio Code, save all your changes, click the Debug button ![Debug icon in Visual Studio Code](./media/tutorial-develop-mongodb-nodejs-part5/debug-button.png) on the left side, then click the Start Debugging button ![Debug icon in Visual Studio Code](./media/tutorial-develop-mongodb-nodejs-part5/start-debugging-button.png).

3. Now lets flip over to the browser and navigate to localhost:3000 and there's our application.

    ![New Azure Cosmos DB account in the Azure portal](./media/tutorial-develop-mongodb-nodejs-part5/azure-cosmos-db-heroes-app.png)

   Now there are no heroes listed in the app yet, but in our next step we'll add the inserts, updates, and deletes with our Mongoose connections to our Azure Cosmos DB database. 

## Next steps

In this video, you've learned how to use Mongoose APIs to connect your heroes app to Azure Cosmos DB. 

> [!div class="nextstepaction"]
> [Add PUT, POST, and DELETE commands](tutorial-develop-mongodb-nodejs-part6.md)
