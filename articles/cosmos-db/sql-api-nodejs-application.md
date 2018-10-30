---
title: Build a Node.js web app for Azure Cosmos DB | Microsoft Docs
description: This Node.js tutorial explores how to use Microsoft Azure Cosmos DB to store and access data from a Node.js Express web application hosted on Azure Websites.
services: cosmos-db
author: SnehaGunda

ms.service: cosmos-db
ms.component: cosmosdb-sql
ms.devlang: nodejs
ms.topic: tutorial
ms.date: 09/24/2018
ms.author: sngun

---
# <a name="_Toc395783175"></a>Build a Node.js web app using JavaScript SDK to manage Azure Cosmos DB SQL API data

> [!div class="op_single_selector"]
> * [.NET](sql-api-dotnet-application.md)
> * [Java](sql-api-java-application.md)
> * [Node.js](sql-api-nodejs-application.md)
> * [Python](sql-api-python-application.md)
> * [Xamarin](mobile-apps-with-xamarin.md)
> 

This Node.js tutorial shows you how to use Azure Cosmos DB SQL API account to store and access data from a Node.js Express application that is hosted on Azure Websites. In this tutorial, you will build a simple web-based application (Todo app), that allows you to create, retrieve, and complete tasks. The tasks are stored as JSON documents in Azure Cosmos DB. The following image shows a screen shot of the Todo application:

![Screen shot of the My Todo List application created in this Node.js tutorial](./media/sql-api-nodejs-application/cosmos-db-node-js-mytodo.png)

This tutorial demonstrates how to create an Azure Cosmos DB SQL API account using the Azure portal. You then build and run a web app that is built on the Node.js SDK to create database, container and add items to the container. This tutorial uses 2.0 version of the JavaScript SDK.

You can also get the completed sample from [GitHub][GitHub]. Just read the [Readme](https://github.com/Azure-Samples/documentdb-node-todo-app/blob/master/README.md) file for instructions on how to run the app.

## <a name="_Toc395783176"></a>Prerequisites

Before following the instructions in this article, you should ensure
that you have the following:

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. 

  [!INCLUDE [cosmos-db-emulator-docdb-api](../../includes/cosmos-db-emulator-docdb-api.md)]

* [Node.js][Node.js] version 6.10 or higher.
* [Express generator](http://www.expressjs.com/starter/generator.html) (you can install this via `npm install express-generator -g`)
* [Git][Git].

## <a name="_Toc395637761"></a>Step 1: Create an Azure Cosmos DB database account
Let's start by creating an Azure Cosmos DB account. If you already have an account or if you are using the Azure Cosmos DB Emulator for this tutorial, you can skip to [Step 2: Create a new Node.js application](#_Toc395783178).

[!INCLUDE [cosmos-db-create-dbaccount](../../includes/cosmos-db-create-dbaccount.md)]

[!INCLUDE [cosmos-db-keys](../../includes/cosmos-db-keys.md)]

## <a name="_Toc395783178"></a>Step 2: Create a new Node.js application
Now let's learn to create a basic Hello World Node.js project using the [Express](http://expressjs.com/) framework.

1. Open your favorite terminal, such as the Node.js command prompt.
2. Navigate to the directory in which you'd like to store the new application.
3. Use the express generator to generate a new application called **todo**.

   ```bash
   express todo
   ```
4. Open your new **todo** directory and install dependencies.

   ```bash
   cd todo
   npm install
   ```
5. Run your new application.

   ```bash
   npm start
   ```

6. You can view your new application by navigating your browser to [http://localhost:3000](http://localhost:3000).
   
    ![Learn Node.js - Screenshot of the Hello World application in a browser window](./media/sql-api-nodejs-application/cosmos-db-node-js-express.png)

 Stop the application by using CTRL+C in the terminal window and click **y** to terminate the batch job.

## <a name="_Toc395783179"></a>Step 3: Install the required modules

The **package.json** file is one of the files created in the root of the project. This file contains a list of additional modules that are required for your Node.js application. Later, when you deploy this application to Azure Websites, this file is used to determine which modules need to be installed on Azure to support your application. You need to install two more packages for this tutorial.

1. Open the terminal, install the **async** module via npm.

   ```bash
   npm install async --save
   ```

2. Install the **@azure/cosmos** module via npm. 

   ```bash
   npm install @azure/cosmos
   ```

## <a name="_Toc395783180"></a>Step 4: Using the Azure Cosmos DB service in a Node application
Now that you have completed the initial setup and configuration, next you will write code that is required by the todo application to communicate with Azure Cosmos DB.

### Create the model
1. At the root of your project directory, create a new directory named **models**  

2. In the **models** directory, create a new file named **taskDao.js**. This file contains code required to create the database, container and defines methods to read, update, create, and find tasks in Azure Cosmos DB. 

3. Copy the following code into the **taskDao.js** file

   ```nodejs
   // @ts-check
   const CosmosClient = require("@azure/cosmos").CosmosClient;
   const debug = require("debug")("todo:taskDao");
   class TaskDao {
     /**
      * Manages reading, adding, and updating Tasks in Cosmos DB
      * @param {CosmosClient} cosmosClient
      * @param {string} databaseId
      * @param {string} containerId
      */
     constructor(cosmosClient, databaseId, containerId) {
       this.client = cosmosClient;
       this.databaseId = databaseId;
       this.collectionId = containerId;

       this.database = null;
       this.container = null;
     }

     async init() {
       debug("Setting up the database...");
       const dbResponse = await this.client.databases.createIfNotExists({
         id: this.databaseId
       });
       this.database = dbResponse.database;
       debug("Setting up the database...done!");
       debug("Setting up the container...");
       const coResponse = await this.database.containers.createIfNotExists({
         id: this.collectionId
       });
       this.container = coResponse.container;
       debug("Setting up the container...done!");
     }

     async find(querySpec) {
       debug("Querying for items from the database");
       if (!this.container) {
         throw new Error("Collection is not initialized.");
       }
       const { result: results } = await this.container.items
        .query(querySpec)
        .toArray();
      return results;
    }

    async addItem(item) {
      debug("Adding an item to the database");
      item.date = Date.now();
      item.completed = false;
      const { body: doc } = await this.container.items.create(item);
      return doc;
    }

    async updateItem(itemId) {
      debug("Update an item in the database");
      const doc = await this.getItem(itemId);
      doc.completed = true;

      const { body: replaced } = await this.container.item(itemId).replace(doc);
      return replaced;
    }

    async getItem(itemId) {
      debug("Getting an item from the database");
      const { body } = await this.container.item(itemId).read();
      return body;
    }
  }

   module.exports = TaskDao;
   ```
4. Save and close the **taskDao.js** file.  

### Create the controller

1. In the **routes** directory of your project, create a new file named **tasklist.js**.  

2. Add the following code to **tasklist.js**. This loads the CosmosClient and async modules, which are used by **tasklist.js**. This also defines the **TaskList** class, which is passed as an instance of the **TaskDao** object we defined earlier:
   
   ```nodejs
   const TaskDao = require("../models/TaskDao");

   class TaskList {
     /**
      * Handles the various APIs for displaying and managing tasks
      * @param {TaskDao} taskDao
     */
    constructor(taskDao) {
    this.taskDao = taskDao;
    }
    async showTasks(req, res) {
      const querySpec = {
        query: "SELECT * FROM root r WHERE r.completed=@completed",
        parameters: [
          {
            name: "@completed",
            value: false
          }
        ]
      };

      const items = await this.taskDao.find(querySpec);
      res.render("index", {
        title: "My ToDo List ",
        tasks: items
      });
    }

    async addTask(req, res) {
      const item = req.body;

      await this.taskDao.addItem(item);
      res.redirect("/");
    }

    async completeTask(req, res) {
      const completedTasks = Object.keys(req.body);
      const tasks = [];

      completedTasks.forEach(task => {
        tasks.push(this.taskDao.updateItem(task));
      });

      await Promise.all(tasks);

      res.redirect("/");
    }
  }

  module.exports = TaskList;
   ```

3. Save and close the **tasklist.js** file.

### Add config.js

1. At the root of your project directory, create a new file named **config.js**. 

2. Add the following code to **config.js** file. This code defines configuration settings and values needed for our application.
   
   ```nodejs
   const config = {};

   config.host = process.env.HOST || "[the endpoint URI of your Azure Cosmos DB account]";
   config.authKey =
     process.env.AUTH_KEY || "[the PRIMARY KEY value of your Azure Cosmos DB account";
   config.databaseId = "ToDoList";
   config.containerId = "Items";

   if (config.host.includes("https://localhost:")) {
     console.log("Local environment detected");
     console.log("WARNING: Disabled checking of self-signed certs. Do not have this code in production.");
     process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
     console.log(`Go to http://localhost:${process.env.PORT || '3000'} to try the sample.`);
   }

   module.exports = config;
   ```

3. In the **config.js** file, update the values of HOST and AUTH_KEY using the values found in the Keys page of your Azure Cosmos DB account on the [Microsoft Azure portal](https://portal.azure.com). 

4. Save and close the **config.js** file.

### Modify app.js
1. In the project directory, open the **app.js** file. This file was created earlier when the Express web application was created.  

2. Add the following code to the **app.js** file. This code defines the config file to be used, and proceeds to read values out of this file into some variables which we will use soon. 
   
   ```nodejs
   const CosmosClient = require("@azure/cosmos").CosmosClient;
   const config = require("./config");
   const TaskList = require("./routes/tasklist");
   const TaskDao = require("./models/taskDao");

   const express = require("express");
   const path = require("path");
   const logger = require("morgan");
   const cookieParser = require("cookie-parser");
   const bodyParser = require("body-parser");

   const app = express();

   // view engine setup
   app.set("views", path.join(__dirname, "views"));
   app.set("view engine", "jade");

   // uncomment after placing your favicon in /public
   //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
   app.use(logger("dev"));
   app.use(bodyParser.json());
   app.use(bodyParser.urlencoded({ extended: false }));
   app.use(cookieParser());
   app.use(express.static(path.join(__dirname, "public")));

   //Todo App:
   const cosmosClient = new CosmosClient({
     endpoint: config.host,
     auth: {
       masterKey: config.authKey
     }
   });
   const taskDao = new TaskDao(cosmosClient, config.databaseId, config.containerId);
   const taskList = new TaskList(taskDao);
   taskDao
     .init(err => {
       console.error(err);
     })
     .catch(err => {
       console.error(err);
       console.error("Shutting down because there was an error settinig up the database.");
       process.exit(1);
     });

   app.get("/", (req, res, next) => taskList.showTasks(req, res).catch(next));
   app.post("/addtask", (req, res, next) => taskList.addTask(req, res).catch(next));
   app.post("/completetask", (req, res, next) => taskList.completeTask(req, res).catch(next));
   app.set("view engine", "jade");

   // catch 404 and forward to error handler
   app.use(function(req, res, next) {
     const err = new Error("Not Found");
     err.status = 404;
     next(err);
   });

   // error handler
   app.use(function(err, req, res, next) {
     // set locals, only providing error in development
     res.locals.message = err.message;
     res.locals.error = req.app.get("env") === "development" ? err : {};

     // render the error page
     res.status(err.status || 500);
     res.render("error");
   });

   module.exports = app;
   ```

3. Finally, save and close the **app.js** file, we're just about done.

## <a name="_Toc395783181"></a>Step 5: Build a user interface
Now let’s turn our attention to building the user interface so a user can actually interact with our application. The Express application we created uses **Jade** as the view engine. For more information on Jade please refer to [http://jade-lang.com/](http://jade-lang.com/).

1. The **layout.jade** file in the **views** directory is used as a global template for other **.jade** files. In this step you will modify it to use [Twitter Bootstrap](https://github.com/twbs/bootstrap), which is a toolkit that makes it easy to design a nice looking website.  

2. Open the **layout.jade** file found in the **views** folder and replace the contents with the following:

   ```html
   doctype html
   html
     head
       title= title
       link(rel='stylesheet', href='//ajax.aspnetcdn.com/ajax/bootstrap/3.3.2/css/bootstrap.min.css')
       link(rel='stylesheet', href='/stylesheets/style.css')
     body
       nav.navbar.navbar-inverse.navbar-fixed-top
         div.navbar-header
           a.navbar-brand(href='#') My Tasks
       block content
       script(src='//ajax.aspnetcdn.com/ajax/jQuery/jquery-1.11.2.min.js')
       script(src='//ajax.aspnetcdn.com/ajax/bootstrap/3.3.2/bootstrap.min.js')
   ```

    This effectively tells the **Jade** engine to render some HTML for our application and creates a **block** called **content** where we can supply the layout for our content pages.

    Save and close this **layout.jade** file.

3. Now open the **index.jade** file, the view that will be used by our application, and replace the content of the file with the following:

   ```html
   extends layout
   block content
        h1 #{title}
        br
        
        form(action="/completetask", method="post")
         table.table.table-striped.table-bordered
            tr
              td Name
              td Category
              td Date
              td Complete
            if (typeof tasks === "undefined")
              tr
                td
            else
              each task in tasks
                tr
                  td #{task.name}
                  td #{task.category}
                  - var date  = new Date(task.date);
                  - var day   = date.getDate();
                  - var month = date.getMonth() + 1;
                  - var year  = date.getFullYear();
                  td #{month + "/" + day + "/" + year}
                  td
                   if(task.completed) 
                    input(type="checkbox", name="#{task.id}", value="#{!task.completed}", checked=task.completed)
                   else
                    input(type="checkbox", name="#{task.id}", value="#{!task.completed}", checked=task.completed)
          button.btn.btn-primary(type="submit") Update tasks
        hr
        form.well(action="/addtask", method="post")
          label Item Name:
          input(name="name", type="textbox")
          label Item Category:
          input(name="category", type="textbox")
          br
          button.btn(type="submit") Add item
   ```

This extends layout, and provides content for the **content** placeholder we saw in the **layout.jade** file earlier.
   
In this layout we created two HTML forms.

The first form contains a table for our data and a button that allows us to update items by posting to **/completeTask** method of our controller.
    
The second form contains two input fields and a button that allows us to create a new item by posting to **/addtask** method of our controller.

This should be all that we need for our application to work.

## <a name="_Toc395783181"></a>Step 6: Run your application locally
1. To test the application on your local machine, run `npm start` in the terminal to start your application, then refresh your [http://localhost:3000](http://localhost:3000) browser page. The page should now look like the image below:
   
    ![Screenshot of the MyTodo List application in a browser window](./media/sql-api-nodejs-application/cosmos-db-node-js-localhost.png)

    > [!TIP]
    > If you receive an error about the indent in the layout.jade file or the index.jade file, ensure that the first two lines in both files is left justified, with no spaces. If there are spaces before the first two lines, remove them, save both files, then refresh your browser window. 

2. Use the Item, Item Name and Category fields to enter a new task and then click **Add Item**. This creates a document in Azure Cosmos DB with those properties. 
3. The page should update to display the newly created item in the ToDo
   list.
   
    ![Screenshot of the application with a new item in the ToDo list](./media/sql-api-nodejs-application/cosmos-db-node-js-added-task.png)
4. To complete a task, simply check the checkbox in the Complete column,
   and then click **Update tasks**. This updates the document you already created and removes it from the view.

5. To stop the application, press CTRL+C in the terminal window and then click **Y** to terminate the batch job.

## <a name="_Toc395783182"></a>Step 7: Deploy your application development project to Azure Websites
1. If you haven't already, enable a git repository for your Azure Website. You can find instructions on how to do this in the [Local Git Deployment to Azure App Service](../app-service/app-service-deploy-local-git.md) topic.
2. Add your Azure Website as a git remote.
   
        git remote add azure https://username@your-azure-website.scm.azurewebsites.net:443/your-azure-website.git
3. Deploy by pushing to the remote.
   
        git push azure master
4. In a few seconds, git will finish publishing your web
   application and launch a browser where you can see your handiwork
   running in Azure!

    Congratulations! You have just built your first Node.js Express Web Application using Azure Cosmos DB and published it to Azure Websites.

    If you want to download or refer to the complete reference application for this tutorial, it can be downloaded from [GitHub][GitHub].

## <a name="_Toc395637775"></a>Next steps

* Want to perform scale and performance testing with Azure Cosmos DB? See [Performance and Scale Testing with Azure Cosmos DB](performance-testing.md)
* Learn how to [monitor an Azure Cosmos DB account](monitor-accounts.md).
* Run queries against our sample dataset in the [Query Playground](https://www.documentdb.com/sql/demo).
* Explore the [Azure Cosmos DB documentation](https://docs.microsoft.com/azure/cosmos-db/).

[Node.js]: http://nodejs.org/
[Git]: http://git-scm.com/
[GitHub]: https://github.com/Azure-Samples/azure-cosmos-db-sql-api-nodejs-todo-app

