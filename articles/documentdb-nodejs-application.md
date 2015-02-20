<properties 
	pageTitle="Build a Node.js web application using DocumentDB | Azure" 
	description="Learn how to use Microsoft Azure DocumentDB to store and access data from a Node.js application hosted on Azure." 
	services="documentdb" 
	documentationCenter="" 
	authors="ryancrawcour" 
	manager="jhubbard" 
	editor="cgronlun"/>

<tags 
	ms.service="documentdb" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="hero-article" 
	ms.date="02/20/2015" 
	ms.author="ryancraw"/>

# <a name="_Toc395783175"></a>Build a Node.js web application using DocumentDB

This tutorial shows you how to use the Azure DocumentDB service to store and access data from a Node.js Express application hosted on Azure Websites.

After completing this tutorial, you'll be able to answer the following questions:

- How do I use the Node.js tools for Visual Studio?
- How do I work with DocumentDB using the documentdb npm module?
- How do I deploy the web application to Azure Websites?

By following this tutorial, you will build a simple web-based
task-management application that allows creating, retrieving and
completing of tasks. The tasks will be stored as JSON documents in Azure
DocumentDB.

![Screen shot of the My Todo List application created in this tutorial](./media/documentdb-nodejs-application/image1.png)

Don't have time to complete the tutorial and just want to get the complete solution from Github? Not a problem, get it [here][].

## <a name="_Toc395783176"></a>Prerequisites

> [AZURE.TIP] This tutorial assumes that you have some prior experience using Node.js and Azure Websites.

Before following the instructions in this article, you should ensure
that you have the following:

- An active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](../../pricing/free-trial/).
- [Node.js][] version v0.10.29 or higher.
- [Git][].
- [Visual Studio 2013][] with update 3, or higher. 
- [Node.js Tools for Visual Studio][].

> [AZURE.NOTE] While we are using Visual Studio to build, debug, and deploy our Node.js project in this tutorial you can use whichever editor you prefer and run Node.js directly on whichever platform you choose in the way you would normally run a Node.js project. You can then use the [Azure CLI][] tools to deploy your application to Azure Websites.

## <a name="_Toc395637761"></a>Step 1: Create a DocumentDB database account

Let's start by creating a DocumentDB account. If you already have an account, you can skip to [Step 2: Create a new Node.js application](#_Toc395637762).

[AZURE.INCLUDE [documentdb-create-dbaccount](../includes/documentdb-create-dbaccount.md)]

[AZURE.INCLUDE [documentdb-keys](../includes/documentdb-keys.md)]

<a name="_Toc395783178"></a>Step 2: Create a new Node.js application
------------------------------------------------------
Now let's create a basic Hello World Node.js project.

1. In Visual Studio, on the **File** menu, point to **New**, and then click **Project**. 
2. In the New Project window, navigate to the Node.js templates, and then select **Basic Azure Node.js Express 4 Application**.

	![Screenshot of the New Project window with Basic Microsoft Azure Express Application highlighted](./media/documentdb-nodejs-application/image10.png)

	This creates a basic Express application for you. If you get prompted to install dependencies select **Yes**. This will install all the npm packages that are required for a new Express application.

3. Once this is complete the **Solution Explorer** should resemble the
following.

	![Screenshot of Solution Explorer](./media/documentdb-nodejs-application/image11.png)

	This shows you that you have Express, Jade, and Stylus installed.

4. If you hit F5 in Visual Studio it should build the project, start
Node.js, and display a browser with the Express equivalent of “Hello
World”.

	![Screenshot of the Hello World application in a browser window](./media/documentdb-nodejs-application/image12.png)

5. Hit Shift+F5 to stop debugging and close the browser.

## <a name="_Toc395783179"></a>Step 3: Install additional modules

The **package.json** file is one of the files created in the root of the
project. This file contains a list of additional modules that are
required for an Express application. Later, when you deploy this
application to an Azure Website, this file is used to determine
which modules need to be installed on Azure to support your application.

![Screenshot of the package.json tab](./media/documentdb-nodejs-application/image13.png)

We still need to install three more packages for this tutorial.

1. In Solution Explorer, right click on **npm** and select **Install New npm
Packages**.
	![Screenshot of the Install New npm Packages menu option](./media/documentdb-nodejs-application/image14.png)

2. In the **Install New npm Packages** window, type **nconf** to search for
the module. This module will be used by the application to read the
database configuration values from a configuration file.
	![Screenshot of the Install New npm Packages window](./media/documentdb-nodejs-application/image15.png)

3. Next, install the **async** module in the same way by searching for **async**. 
5. Finally, install the Azure DocumentDB module in the same way by searching for **documentdb**. This is the module where all the DocumentDB magic happens.
6. When prompted to reload the package.json file, click **Yes**.

7. Once you have installed these three additional modules, and dependencies, they should show up in Solution Explorer under the **npm**
module.

	![Screenshot of the new modules under the npm module](./media/documentdb-nodejs-application/image16.png)

8. A quick check of the **package.json** file of the application should
show the additional modules, This file will tell Azure later which
packages it need to be download and installed when running your
application.

9. Edit the package.json file, if required, to resemble the example below.

	![Screenshot of the package.json tab](./media/documentdb-nodejs-application/image17.png)

       This tells Node (and Azure later) that your application depends on these additional modules.

## <a name="_Toc395783180"></a>Step 4: Using the DocumentDB service in a node application

That takes care of all the initial setup and configuration, now let’s get down to why we’re here, and that’s to write some code using Azure DocumentDB.

### Create the model

1. In the project directory, create a new directory named **models**.
2. In the **models** directory, create a new file named **task.js**. This file will contain the model for the tasks created by our application.
3. In the same **models** directory, create another new file named **utils.js**. This file will contain some useful, reusable, code that we will use throughout our application. 
4. Copy the following code in to **utils.js**

		var DocumentDBClient = require('documentdb').DocumentClient;
		
		var Utils = {
		    getOrCreateDatabase: function (client, databaseId, callback) {
		        var querySpec = {
		            query: 'SELECT * FROM root r WHERE r.id=@id',
		            parameters: [
		                {
		                    name: '@id',
		                    value: databaseId
		                }
		            ]
		        };
		
		        client.queryDatabases(querySpec).toArray(function (err, results) {
		            if (err) {
		                callbackk(err);
		            }
		
		            if (!err && results.length === 0) {
		                client.createDatabase({ id: databaseId }, function (err, created) {
		                    callback(null, created);
		                });
		            } else {
		                callback(null, results[0]);
		            }
		        });
		    },
		
		    getOrCreateCollection: function (client, databaseLink, collectionId, callback){
		        var querySpec = {
		            query: 'SELECT * FROM root r WHERE r.id=@id',
		            parameters: [
		                {
		                    name: '@id',
		                    value: collectionId
		                }
		            ]
		        };
		
		        client.queryCollections(databaseLink, querySpec).toArray(function (err, results) {
		            if (err) {
		                callback (err);
		            }
		
		            if (!err && results.length === 0) {
		                client.createCollection(databaseLink, { id: collectionId }, function (err, created) {
		                    callback(null, created);
		                });
		            } else {
		                callback(null, results[0]);
		            }
		        });
		    }
		}
		
		module.exports = Utils;
		
3. Save and close the **utils.js** file.

4. At the beginning of the **task.js** file, add the following code to reference the **DocumentDBClient** and the **utils.js** we created above:

        var DocumentDBClient = require('documentdb').DocumentClient;
		var utils = require('./utils.js');

		module.exports = Task;

4. Next, you will add code to define and export the Task object. This is responsible for initializing our Task object and setting up the Database and Document Collection we will use.

		function Task(documentDBClient, databaseId, collectionId){   
		    this.client = documentDBClient;
			this.databaseId = databaseId;
			this.collectionId = collectionId;
			
		    this.database = null;
		    this.collection = null; 
		}
		
5. Next, add the following code to define additional methods on the Task object, which allow interactions with data stored in DocumentDB.

		Task.prototype = {
		    init: function (callback) {
		        var self = this;
		        
		        utils.getOrCreateDatabase(self.client, self.databaseId, function (err, db) {
		            if (err) {
		                callback(err);
		            }
		            
		            self.database = db;
		            utils.getOrCreateCollection(self.client, self.database._self, self.collectionId, function (err, coll) {
		                if (err) {
		                    callback(err);
		                }
		                
		                self.collection = coll;
		                callback(null);
		            })
		        });
		    },
					
		    find: function (querySpec, callback) {
		        var self = this;
		
		        self.client.queryDocuments(self.collection._self, querySpec).toArray(function (err, results) {
		            if (err) {
		                callback(err);
		            } else {
		                callback(null, results);
		            }
		        });
		    },
		    
		    addItem: function (item, callback) {
		        var self = this;
		        item.date = Date.now();
		        item.completed = false;
		        self.client.createDocument(self.collection._self, item, function (err, doc) {
		            if (err) {
		                callback(err);
		            } else {                
		                callback(null);
		            }
		        });
		    },
		
		    updateItem: function (itemId, callback){
		        var self = this;
		
		        self.getItem(itemId, function (err, doc) {
		            if (err) {
		                callback(err);
		            } else {
		                doc.completed = true;
		                self.client.replaceDocument(doc._self, doc, function (err, replaced) {
		                    if (err) {
		                        callback(err);
		                    } else {
		                        callback(null);
		                    }
		                });
		            }
		        });
		    },
		
		    getItem: function (itemId, callback){
		        var self = this;
		        
		        var querySpec = {
		            query: 'SELECT * FROM root r WHERE r.id=@id',
		            parameters: [
		                {
		                    name: '@id',
		                    value: itemId
		                }
		            ]
		        };
		
		        self.client.queryDocuments(self.collection._self, querySpec).toArray(function (err, results) {
		            if (err) {
		                callback(err);
		            } else {                
		                callback(null, results[0]);
		            }
		        });
		    }
		}

6. Save and close the **task.js** file. 

### Create the controller

1. In the **routes** directory of your project, create a new file named **tasklist.js**. 
2. Add the following code to **tasklist.js**. This loads the DocumentDBClient and async modules, which are used by **tasklist.js**. This also defined the **TaskList** function, which is passed an instance of the **Task** object we defined earlier:

		var DocumentDBClient = require('documentdb').DocumentClient;
		var async = require('async');
		
		module.exports = TaskList;
		
		function TaskList(task){
		    this.task = task;
		}

3. Continue adding to the **tasklist.js** file by adding the methods used to **showTasks, addTask**, and **completeTasks**:

		TaskList.prototype = {
		    showTasks: function (req, res) {
		        var self = this;
		
		        var querySpec = {
		            query: 'SELECT * FROM root r WHERE r.completed=@completed',
		            parameters: [
		                {
		                    name: '@completed',
		                    value: false
		                }
		            ]
		        };
		
		        self.task.find(querySpec, function (err, items) {
		            if (err) {
		                throw (err);
		            }
		
		            res.render('index', { title: 'My ToDo List ', tasks: items });
		        });
		    },
		
		    addTask: function (req, res){        
		        var self = this;        
		        var item = req.body;
		        
		        self.task.addItem(item, function (err) {
		            if (err) {
		                throw (err);
		            }
		
		            res.redirect('/');
		        });      
		    },
		
		    completeTask: function (req, res){
		        var self = this;
		        var completedTasks = Object.keys(req.body);
		
		        async.forEach(completedTasks, function taskIterator(completedTask, callback) {
		            self.task.updateItem(completedTask, function (err) {
		                if (err) {
		                    callback(err);
		                } else {
		                    callback(null);
		                }
		            });
		        }, function goHome(err) {
		            if (err) {
		                throw err;
		            } else {
		                res.redirect('/');
		            }
		        });
		    }
		}

4. Save and close the **tasklist.js** file.
 
### Add config.json

1. In your project directory create a new file named **config.json**.
2. Add the following to **config.json**. This defines configuration settings and values needed for our application.

		{
		    "HOST"       : "[the URI value from the DocumentDB Keys blade on http://portal.azure.com]",
		    "AUTH_KEY"   : "[the PRIMARY KEY value from the DocumentDB Keys blade on http://portal.azure.com]",
		    "DATABASE"   : "ToDoList",
		    "COLLECTION" : "Items"
		}

3. In the **config.json** file, update the values of HOST and AUTH_KEY using the values found in the Keys blade of your DocumentDB account on the [Azure Preview portal](http://portal.azure.com):
 - Change the value of HOST to the URI value retrieved from the Keys blade.
 - Change the value of AUTH_KEY to the PRIMARY KEY value retrieved from the Keys blade. 

4. Save and close the **config.json** file.
 
### Modify app.js

1. In the project directory, open the **app.js** file. This file was created earlier when the Express web application was created.
2. Add the following code to the top of **app.js**
	
		var DocumentDBClient = require('documentdb').DocumentClient;
		var nconf = require('nconf');
		
		nconf.env().file({ file: 'config.json' });
		
		var host = nconf.get("HOST");
		var authKey = nconf.get("AUTH_KEY");
		var databaseId = nconf.get("DATABASE");
		var collectionId = nconf.get("COLLECTION");

3. This code defines the config file to be used, and proceeds to read values out of this file in to some variables we will use soon.
4. Find the following two lines in **app.js** file:

		app.use('/', routes);
		app.use('/users', users); 

6. Replace everything, inclusive of the two lines above, up to the end of the file with:
		
		var TaskList = require('./routes/tasklist');
		var Task = require('./models/task');
		var task = new Task(new DocumentDBClient(host, { masterKey: authKey }), databaseId, collectionId);
		task.init(function () {
		    var taskList = new TaskList(task);
		    app.get('/', taskList.showTasks.bind(taskList));
		    app.post('/addtask', taskList.addTask.bind(taskList));
		    app.post('/completetask', taskList.completeTask.bind(taskList));
		    
		    // catch 404 and forward to error handler
		    app.use(function (req, res, next) {
		        var err = new Error('Not Found');
		        err.status = 404;
		        next(err);
		    });
		    
		    // error handlers
		    
		    // development error handler
		    // will print stacktrace
		    if (app.get('env') === 'development') {
		        app.use(function (err, req, res, next) {
		            res.status(err.status || 500);
		            res.render('error', {
		                message: err.message,
		                error: err
		            });
		        });
		    }
		    
		    // production error handler
		    // no stacktraces leaked to user
		    app.use(function (err, req, res, next) {
		        res.status(err.status || 500);
		        res.render('error', {
		            message: err.message,
		            error: {}
		        });
		    });
		});

		module.exports = app;

6. These lines define a new instance of our **Task** object, with a new connection to DocumentDB (using the values read from the **config.json**), initialize the task object and then bind form actions to methods on our **TaskList** controller. 

7. Finally, save and close the **app.js** file, we're just about done.
 
## <a name="_Toc395783181"></a>Step 5: Build a user interface

Now let’s turn our attention to building the user interface so a user can actually interact with our application. The Express application we created uses **Jade** as the view engine. For more information on Jade please refer to <a href="http://jade-lang.com/">http://jade-lang.com/</a>.

1. The **layout.jade** file in the **views** directory is used as a global template for other **.jade** files. In this step you will modify it to use [Twitter Bootstrap](https://github.com/twbs/bootstrap), which is a toolkit that makes it easy to design a nice looking website. 
2. Download and extract the files for [Twitter Bootstrap](https://github.com/twbs/bootstrap). Copy the **bootstrap.min.css** file from the **bootstrap\dist\css** folder to the **public\stylesheets** directory of your application. 
3. Open the **layout.jade** file found in the **views** folder and replace the contents with the following;
	
		doctype html
		html
		  head
		    title #{title}
		    link(rel='stylesheet', href='/stylesheets/bootstrap.min.css')
		    link(rel='stylesheet', href='/stylesheets/style.css')
		  body.app
		    nav.navbar.navbar-default
		      div.navbar-header
		        a.navbar-brand(href='/') My Tasks
		    block content

	This effectively tells the **Jade** engine to render some HTML for our application and creates a **block** called **content** where we can supply the layout for our content pages.
	Save and close this **layout.jade** file.

4. Now open the **index.jade** file, the view that will be used by our application, and replace the content of the file with the following:

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
		              input(type="checkbox", name="#{task.id}", value="#{!task.completed}", checked=task.completed)
		    button.btn(type="submit") Update tasks
		  hr
		  form.well(action="/addtask", method="post")
		    label Item Name: 
		    input(name="name", type="textbox")
		    label Item Category: 
		    input(name="category", type="textbox")
		    br
		    button.btn(type="submit") Add item

	This extends layout, and provides content for the **content** placeholder we saw in the layout.jade file earlier.
	
	In this layout we created two HTML forms. 
	The first form contains a table for our data and a button that allows us to update items by posting to **/completetask** method of our controller.
	The second form contains two input fields and a button that allows us to create a new item by posting to **/addtask** method of our controller.
	
	This should be all that we need for our application to work.

5. Open the **style.styl** file in **public\stylesheets** directory and replace the code with the following:

		body
		  padding: 50px
		  font: 14px "Lucida Grande", Helvetica, Arial, sans-serif
		a
		  color: #00B7FF
		  
		.well label 
		    display: block
		
		.well input
		    margin-bottom:5px
		
		.btn
		    margin-top: 5px
		    border: outset 1px rgba(200, 200, 200, 1)

	Save and close this **style.styl** file.

## <a name="_Toc395783181"></a>Step 6: Run your application locally

1. To test the application on your local machine, hit F5 in Visual Studio
and it should build the app, start Node.js and launch a browser with a
page that looks like the image below:

	![Screenshot of the MyTodo List application in a browser window](./media/documentdb-nodejs-application/image18.png)


2. Use the provided fields for Item, Item Name and Category to enter
information, and then click **Add Item**.

3. The page should update to display the newly created item in the ToDo
list.

	![Screenshot of the application with a new item in the ToDo list](./media/documentdb-nodejs-application/image19.png)

4. To complete a task, simply check the checkbox in the Complete column,
and then click **Update tasks**.

## <a name="_Toc395783182"></a>Step 7: Deploy your application to Azure Websites

With the Node.js Tools for Visual Studio installed deploying to Azure
Websites is easily accomplished in a few short steps.

1. Right click on your project and select **Publish**.

	![Screenshot of the Publish menu option](./media/documentdb-nodejs-application/image20.png)

2. Follow the **Publish Web** wizard to provide the required configuration for
your Azure Website. The wizard will let you either choose an existing
website to update, or to create a new website.

	> [AZURE.NOTE] Website names cannot include periods in the Site name box of the web publishing wizard. So if you created this tutorial using todo.node as a project name, replace the period with another character in the Site name box; for example, todo-node. 

3. Once you have supplied the necessary configuration just hit **Publish**.

	![Screenshot of the Publish Web window](./media/documentdb-nodejs-application/image21.png)

4. And Visual Studio will connect to your Azure subscription and publish
this Node.js application.

5. In a few seconds, Visual Studio will finish publishing your web
application and launch a browser where you can see your handy work
running in Azure!

## <a name="_Toc395637775"></a>Next steps

Congratulations! You have just built your first Node.js Express Web
Application using Azure DocumentDB and published it to Azure Websites.

The source code for the complete reference application can be downloaded [here][].

  [Node.js]: http://nodejs.org/
  [Git]: http://git-scm.com/
  [Visual Studio 2013]: http://msdn.microsoft.com/en-us/vstudio/cc136611.aspx
  [Node.js Tools for Visual Studio]: https://nodejstools.codeplex.com/
  [here]: https://github.com/Azure/azure-documentdb-node/tree/master/core_sdk/tutorial/todo
  [Azure CLI]: http://azure.microsoft.com/en-us/documentation/articles/xplat-cli/
  [Azure Management Portal]: http://portal.azure.com
