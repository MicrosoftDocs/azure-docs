---
title: "Azure Cosmos DB: Create a MEAN.js app - Part 2 | Microsoft Docs"
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
ms.date: 08/15/2017
ms.author: mimig
ms.custom: mvc

---
# Create a MEAN.js app with Azure Cosmos DB - Part 2: Create the Angular project

Azure Cosmos DB is Microsoft’s globally distributed multi-model database service. You can quickly create and query document, key/value, and graph databases, all of which benefit from the global distribution and horizontal scale capabilities at the core of Azure Cosmos DB. 

This multi-part tutorial demonstrates how to create a new [MongoDB](mongodb-introduction.md) API app written in Node.js with Express and Angular and connect it to your Azure Cosmos DB database. Azure Cosmos DB supports MongoDB client connections, so you can use Azure Cosmos DB in place of Mongo, but use the exact same code that you use when you talk to Mongo. By using Azure Cosmos DB instead of MongoDB, you benefit from the deployment, scaling, security, and super-fast reads and writes that Azure Cosmos DB provides as a managed service. 

Part 2 of the tutorial covers the following tasks:

> [!div class="checklist"]
> * Install the angular CLI
> * Run the angular CLI


> [!VIDEO https://www.youtube.com/embed/lIwJIYcGSUg]

## Prerequisites

Before starting this part of the tutorial, ensure you've watched the [introduction video](tutorial-develop-mongodb-nodejs.md).

This tutorial also requires: 
* [Node.js](https://nodejs.org/download/current/) version 8.3.0 or above.
* [Postman](https://www.getpostman.com/)

## Install the Angular and Azure CLIs

1. Open a Windows Command Prompt or Mac Terminal window and install the Angular CLI.

    ```bash
    npm install -g @angular/cli
    ```

2. Install the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli).

## Use Angular CLI to create a new project

1. At the command prompt, run the following code to create a new project with Angular CLI, install the source code in src/client folder (-sd src/client), and use the minimal setup (--minimal).

    ```bash
    ng new angular-cosmosdb -sd src/client --minimal --style scss
    ```

2. Once the command completes, change directories into the src/client folder, and open the folder in Visual Studio Code.

    ```bash
    cd angular-cosmosdb
    code .
    ```

## Create a server folder

1. In Visual Studio Code, in the Explorer pane, right click the src folder, click New Folder, and name the new folder server.
2. In the Explorer pane, right click the server folder, click New File, and name the new file index.js.
3. At the command prompt, install the new folder and file.

    ```bash
    npm i express body-parser --save
    ```

4. In Visual Studio Code, copy the following code into the index.js file. This code:
    * Creates express
    * Pulls in the body-parser
    * Use a built in feature called path
    * Sets root variables to make it easier to find where our code is located
    * Sets up a port
    * Cranks up express
    * Tells the app how to use the middleware that were going to be using to serve up the server
    * Serves everything that's in the dist folder so all that's going to be static content
    * Serves up the actual application, and does a get on anything that falls through to pass up and serve to index.html

    ```node
    const express = require('express');
    const bodyParser = require('body-parser');
    const path = require('path');
    const routes = require('./routes');

    const root = './';
    const port = process.env.PORT || '3000';
    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static(path.join(root, 'dist')));
    app.use('/api', routes);
    app.get('*', (req, res) => {
      res.sendFile('dist/index.html', {root});
    });

    app.listen(port, () => console.log(`API running on localhost:${port}`));
    ```

5. In Visual Studio Code, in the Explorer pane, right click the server folder, and then click New file. Name the new file routes.js. This code:
    * Refers to the router
    * Get the heroes

    ```node
    const express = require('express');
    const router = express.Router();

    router.get('/heroes', (req, res) => {
     res.send(200, [
         {"id": 10, "name": "Starlord", "saying": "oh yeah"}
     ])

    module.exports=router;
    ```

6. In Visual Studio Code, click the Debug button ![Debug icon in Visual Studio Code](./media/tutorial-develop-mongodb-nodejs-part2/debug-button.png).

7. In the Debug box, select Add Configuration. 

   The new launch.json file opens in Visual Studio Code.

8. On line 11, change `"program": "${file}"` to `"program": "${workspaceRoot}/src/server/index.js"`.

9. Click the Start Debugging button ![Debug icon in Visual Studio Code](./media/tutorial-develop-mongodb-nodejs-part2/start-debugging-button.png).

## Use Postman to test the app

1. Now open Postman and put `http://localhost:3000/api/heroes` in the GET box. 

2. Click the Send button and get the json response from the app. This shows the app is up and running. 

    ```json
    [
        {
            "id": 10,
            "name": "Starlord",
            "saying": "oh yeah"
        }
    ]
    ```

## Next steps

In this video, you've created a Node.js project using the Angular CLI and you've tested it using Postman. 

> [!div class="nextstepaction"]
> [Build an Angular UI](tutorial-develop-mongodb-nodejs-part3.md)
