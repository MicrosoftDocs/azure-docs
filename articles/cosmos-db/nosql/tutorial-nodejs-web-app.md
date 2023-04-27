---
title: 'Tutorial: Build a Node.js web app by using the JavaScript SDK to manage an API for NoSQL account in Azure Cosmos DB'
description: Learn how to use Azure Cosmos DB to store and access data from a Node.js Express web application hosted on the Web Apps feature of the Azure App Service.
author: deborahc
ms.author: dech
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: javascript
ms.topic: tutorial
ms.date: 03/28/2023
ms.custom: devx-track-js, ignite-2022
#Customer intent: As a developer, I want to build a Node.js web application to access and manage API for NoSQL account resources in Azure Cosmos DB, so that customers can better use the service.
---

# Tutorial: Build a Node.js web app by using the JavaScript SDK to manage an API for NoSQL account in Azure Cosmos DB

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

> [!div class="op_single_selector"]
>
> * [.NET](tutorial-dotnet-web-app.md)
> * [Java](tutorial-java-web-app.md)
> * [Node.js](tutorial-nodejs-web-app.md)
>

As a developer, you might have applications that use NoSQL document data. You can use an API for NoSQL account in Azure Cosmos DB to store and access this document data. This Node.js tutorial shows you how to store and access data from an API for NoSQL account in Azure Cosmos DB. The tutorial uses a Node.js Express application that's hosted on the Web Apps feature of Microsoft Azure App Service. In this tutorial, you build a web-based application (Todo app) that allows you to create, retrieve, and complete tasks. The tasks are stored as JSON documents in Azure Cosmos DB.

This tutorial demonstrates how to create an API for NoSQL account in Azure Cosmos DB by using the Azure portal. Without a credit card or an Azure subscription, you can:

* Set up a free [Try Azure Cosmos DB account](https://aka.ms/trycosmosdb).
* Build and run a web app that's built on the Node.js SDK to create a database and container.
* Add items to the container.

This tutorial uses JavaScript SDK version 3.0 and covers the following tasks:

> [!div class="checklist"]
> * Create an Azure Cosmos DB account
> * Create a new Node.js application
> * Connect the application to Azure Cosmos DB
> * Run and deploy the application to Azure

## <a name="prerequisites"></a>Prerequisites

Before following the instructions in this article, ensure that you have the following resources:

* Without an Azure subscription, a credit card, or an Azure subscription, you can set up a free [Try Azure Cosmos DB account](https://aka.ms/trycosmosdb).

  [!INCLUDE [cosmos-db-emulator-docdb-api](../includes/cosmos-db-emulator-docdb-api.md)]

* [Node.js][Node.js] version 6.10 or higher.
* [Express generator](https://www.expressjs.com/starter/generator.html) (you can install Express via `npm install express-generator -g`)
* Install [Git][Git] on your local workstation.

## <a name="create-account"></a>Create an Azure Cosmos DB account

Start by creating an Azure Cosmos DB account. If you already have an account or if you use the Azure Cosmos DB Emulator for this tutorial, you can skip to [Create a new Node.js application](#create-new-app).

[!INCLUDE [cosmos-db-create-dbaccount](../includes/cosmos-db-create-dbaccount.md)]

[!INCLUDE [cosmos-db-keys](../includes/cosmos-db-keys.md)]

## <a name="create-new-app"></a>Create a new Node.js application

Now, learn how create a basic Hello World Node.js project by using the Express framework.

1. Open your favorite terminal, such as the Node.js command prompt.

1. Navigate to the directory in which you'd like to store the new application.

1. Use the express generator to generate a new application called **todo**.

   ```bash
   express todo
   ```

1. Open the **todo** directory and install dependencies.

   ```bash
   cd todo
   npm install
   ```

1. Run the new application.

   ```bash
   npm start
   ```

1. To view your new application in a browser, go to `http://localhost:3000`.

   :::image type="content" source="./media/tutorial-nodejs-web-app/cosmos-db-node-js-express.png" alt-text="Screenshot of the Hello World application in a browser window.":::

   Stop the application by using CTRL+C in the terminal window, and select **y** to terminate the batch job.

## <a name="install-modules"></a>Install the required modules

The *package.json* file is one of the files created in the root of the project. This file contains a list of other modules that are required for your Node.js application. When you deploy this application to Azure, this file is used to determine which modules should be installed on Azure to support your application. Install two more packages for this tutorial.

1. Install the **\@azure/cosmos** module via npm.

   ```bash
   npm install @azure/cosmos
   ```

## <a name="connect-to-database"></a>Connect the Node.js application to Azure Cosmos DB

After you've completed the initial setup and configuration, learn how to write the code that the todo application requires to communicate with Azure Cosmos DB.

### Create the model

1. At the root of your project directory, create a new directory named **models**.

1. In the **models** directory, create a new file named *taskDao.js*. This file contains code required to create the database and container. It also defines methods to read, update, create, and find tasks in Azure Cosmos DB.

1. Copy the following code into the *taskDao.js* file:

   ```javascript
    // @ts-check
    const CosmosClient = require('@azure/cosmos').CosmosClient
    const debug = require('debug')('todo:taskDao')

    // For simplicity we'll set a constant partition key
    const partitionKey = undefined
    class TaskDao {
      /**
       * Manages reading, adding, and updating Tasks in Azure Cosmos DB
       * @param {CosmosClient} cosmosClient
       * @param {string} databaseId
       * @param {string} containerId
       */
      constructor(cosmosClient, databaseId, containerId) {
        this.client = cosmosClient
        this.databaseId = databaseId
        this.collectionId = containerId

        this.database = null
        this.container = null
      }

      async init() {
        debug('Setting up the database...')
        const dbResponse = await this.client.databases.createIfNotExists({
          id: this.databaseId
        })
        this.database = dbResponse.database
        debug('Setting up the database...done!')
        debug('Setting up the container...')
        const coResponse = await this.database.containers.createIfNotExists({
          id: this.collectionId
        })
        this.container = coResponse.container
        debug('Setting up the container...done!')
      }

      async find(querySpec) {
        debug('Querying for items from the database')
        if (!this.container) {
          throw new Error('Collection is not initialized.')
        }
        const { resources } = await this.container.items.query(querySpec).fetchAll()
        return resources
      }

      async addItem(item) {
        debug('Adding an item to the database')
        item.date = Date.now()
        item.completed = false
        const { resource: doc } = await this.container.items.create(item)
        return doc
      }

      async updateItem(itemId) {
        debug('Update an item in the database')
        const doc = await this.getItem(itemId)
        doc.completed = true

        const { resource: replaced } = await this.container
          .item(itemId, partitionKey)
          .replace(doc)
        return replaced
      }

      async getItem(itemId) {
        debug('Getting an item from the database')
        const { resource } = await this.container.item(itemId, partitionKey).read()
        return resource
      }
    }

    module.exports = TaskDao
   ```

1. Save and close the *taskDao.js* file.

### Create the controller

1. In the **routes** directory of your project, create a new file named *tasklist.js*.

1. Add the following code to *tasklist.js*. This code loads the CosmosClient and async modules, which are used by *tasklist.js*. This code also defines the *TaskList* class, which is passed as an instance of the *TaskDao* object we defined earlier:
   
   ```javascript
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

1. Save and close the *tasklist.js* file.

### Add config.js

1. At the root of your project directory, create a new file named *config.js*.

1. Add the following code to *config.js* file. This code defines configuration settings and values needed for our application.
   
   ```javascript
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

1. In the *config.js* file, update the values of HOST and AUTH_KEY by using the values found in the **Keys** page of your Azure Cosmos DB account on the [Azure portal](https://portal.azure.com).

1. Save and close the *config.js* file.

### Modify app.js

1. In the project directory, open the *app.js* file. This file was created earlier when the Express web application was created.

1. Add the following code to the *app.js* file. This code defines the config file to be used and loads the values into some variables that you'll use in the next sections.
   
   ```javascript
    const CosmosClient = require('@azure/cosmos').CosmosClient
    const config = require('./config')
    const TaskList = require('./routes/tasklist')
    const TaskDao = require('./models/taskDao')

    const express = require('express')
    const path = require('path')
    const logger = require('morgan')
    const cookieParser = require('cookie-parser')
    const bodyParser = require('body-parser')

    const app = express()

    // view engine setup
    app.set('views', path.join(__dirname, 'views'))
    app.set('view engine', 'jade')

    // uncomment after placing your favicon in /public
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(logger('dev'))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(cookieParser())
    app.use(express.static(path.join(__dirname, 'public')))

    //Todo App:
    const cosmosClient = new CosmosClient({
      endpoint: config.host,
      key: config.authKey
    })
    const taskDao = new TaskDao(cosmosClient, config.databaseId, config.containerId)
    const taskList = new TaskList(taskDao)
    taskDao
      .init(err => {
        console.error(err)
      })
      .catch(err => {
        console.error(err)
        console.error(
          'Shutting down because there was an error settinig up the database.'
        )
        process.exit(1)
      })

    app.get('/', (req, res, next) => taskList.showTasks(req, res).catch(next))
    app.post('/addtask', (req, res, next) => taskList.addTask(req, res).catch(next))
    app.post('/completetask', (req, res, next) =>
      taskList.completeTask(req, res).catch(next)
    )
    app.set('view engine', 'jade')

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
      const err = new Error('Not Found')
      err.status = 404
      next(err)
    })

    // error handler
    app.use(function(err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message
      res.locals.error = req.app.get('env') === 'development' ? err : {}

      // render the error page
      res.status(err.status || 500)
      res.render('error')
    })

    module.exports = app
   ```

1. Finally, save and close the *app.js* file.

## <a name="build-ui"></a>Build a user interface

Now build the user interface so that a user can interact with the application. The Express application you created in the previous sections uses **Jade** as the view engine.

1. The *layout.jade* file in the **views** directory is used as a global template for other *.jade* files. In this step, you modify it to use Twitter Bootstrap, which is a toolkit used to design a website.

1. Open the *layout.jade* file found in the **views** folder and replace the contents with the following code:

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

    This code tells the **Jade** engine to render some HTML for the application and creates a **block** called **content** where you can supply the layout for the content pages. Save and close the *layout.jade* file.

1. Open the *index.jade* file, the view used by the application. Replace the content of the file with the following code:

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

This code extends layout and provides content for the **content** placeholder you saw in the *layout.jade* file. In that layout, you created two HTML forms.

The first form contains a table for your data and a button that allows you to update items by posting to the */completeTask* method of the controller.

The second form contains two input fields and a button that allows you to create a new item by posting to the */addtask* method of the controller, which is all you need for the application to work.

## <a name="run-app-locally"></a>Run your application locally

After you've built the application, you can run it locally by using the following steps:

1. To test the application on your local machine, run `npm start` in the terminal to start your application, and then refresh the `http://localhost:3000` page. The page should now look like the following screenshot:

    :::image type="content" source="./media/tutorial-nodejs-web-app/cosmos-db-node-js-localhost.png" alt-text="Screenshot of the My Todo List application in a browser.":::

    > [!TIP]
    > If you receive an error about the indent in the *layout.jade* file or the *index.jade* file, ensure that the first two lines in both files are left-justified, with no spaces. If there are spaces before the first two lines, remove them, save both files, and then refresh your browser window.

1. Use the Item Name and Item Category fields to enter a new task, and then select **Add Item** to create a document in Azure Cosmos DB with those properties.

1. The page updates to display the newly created item in the ToDo list.

    :::image type="content" source="./media/tutorial-nodejs-web-app/cosmos-db-node-js-added-task.png" alt-text="Screenshot of the application with a new item in the ToDo list.":::

1. To complete a task, select the check box in the Complete column, and then select **Update tasks** to update the document you already created and remove it from the view.

1. To stop the application, press CTRL+C in the terminal window and then select **y** to terminate the batch job.

## <a name="deploy-app"></a>Deploy your application to App Service

After your application succeeds locally, you can deploy it to Azure App Service. In the terminal, make sure you're in the *todo* app directory. Deploy the code in your local folder (todo) by using the following [az webapp up](/cli/azure/webapp#az-webapp-up) command:

```azurecli
az webapp up --sku F1 --name <app-name>
```

Replace <app_name> with a name that's unique across all of Azure (valid characters are a-z, 0-9, and -). A good pattern is to use a combination of your company name and an app identifier. To learn more about the app deployment, see [Node.js app deployment in Azure](../../app-service/quickstart-nodejs.md?tabs=linux&pivots=development-environment-cli#deploy-to-azure).

The command might take a few minutes to complete. The command provides messages about creating the resource group, the App Service plan, and the app resource, configuring logging and doing ZIP deployment. The command provides these messages while running. It then gives you a URL to launch the app at `http://<app-name>.azurewebsites.net`, which is the app's URL on Azure.

## Clean up resources

When these resources are no longer needed, you can delete the resource group, the Azure Cosmos DB account, and all the related resources. To do so, select the resource group that you used for the Azure Cosmos DB account, select **Delete**, and then confirm the name of the resource group to delete.

## Next steps

You can use information about your existing database cluster for capacity planning.

* [Convert the number of vCores or vCPUs in your nonrelational database to Azure Cosmos DB RU/s](../convert-vcore-to-request-unit.md)
* [Estimate RU/s using the Azure Cosmos DB capacity planner - API for NoSQL](estimate-ru-with-capacity-planner.md)

> [!div class="nextstepaction"]
> [Build mobile applications with Xamarin and Azure Cosmos DB](/azure/architecture/solution-ideas/articles/gaming-using-cosmos-db)

[Node.js]: https://nodejs.org/
[Git]: https://git-scm.com/
[GitHub]: https://github.com/Azure-Samples/azure-cosmos-db-sql-api-nodejs-todo-app
