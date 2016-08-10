<properties
	pageTitle="Node.js web app using the Azure Table Service"
	description="This tutorial teaches you how to use the Azure Table service to store data from a Node.js application which is hosted in Azure App Service Web Apps."
	tags="azure-portal"
	services="app-service\web, storage"
	documentationCenter="nodejs"
	authors="rmcmurray"
	manager="wpickett"
	editor=""/>

<tags
	ms.service="storage"
	ms.workload="storage"
	ms.tgt_pltfrm="na"
	ms.devlang="nodejs"
	ms.topic="article"
	ms.date="06/24/2016"
	ms.author="robmcm"/>

# Node.js web app using the Azure Table Service

## Overview

This tutorial shows you how to use Table service provided by Azure Data Management to store and access data from a [node] application hosted in [Azure App Service](http://go.microsoft.com/fwlink/?LinkId=529714) Web Apps. This tutorial assumes that you have some prior experience using node and [Git].

You will learn:

* How to use npm (node package manager) to install the node modules

* How to work with the Azure Table service

* How to use the Azure CLI to create a web app.

By following this tutorial, you will build a simple web-based "to-do list" application that allows creating, retrieving and completing tasks. The tasks are stored in the Table service.

Here is the completed application:

![A web page displaying an empty tasklist][node-table-finished]

>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751), where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.

## Prerequisites

Before following the instructions in this article, ensure that you have the following installed:

* [node] version 0.10.24 or higher

* [Git]

[AZURE.INCLUDE [create-account-and-websites-note](../../includes/create-account-and-websites-note.md)]

## Create a storage account

Create an Azure storage account. The app will use this account to store the to-do items.

1.  Log into the [Azure Portal](https://portal.azure.com/).

2. Click the **New** icon on the bottom left of the portal, then click **Data + Storage** > **Storage**. Give the storage account a unique name and create a new [resource group](../resource-group-overview.md) for it.

  	![New Button](./media/storage-nodejs-use-table-storage-web-site/configure-storage.png)

	When the storage account has been created, the **Notifications** button will flash a green **SUCCESS** and the storage account's blade is open to show that it belongs to the new resource group you created.

5. In the storage account's blade, click **Settings** > **Keys**. Copy the primary access key to the clipboard.

    ![Access key][portal-storage-access-keys]


##Install modules and generate scaffolding

In this section you will create a new Node application and use npm to add module packages. For this application you will use the [Express] and [Azure] modules. The Express module provides a Model View Controller framework for node, while the Azure modules provides connectivity to the Table service.

### Install express and generate scaffolding

1. From the command line, create a new directory named **tasklist** and switch to that directory.  

2. Enter the following command to install the Express module.

		npm install express-generator@4.2.0 -g

    Depending on the operating system, you may need to put 'sudo' before the command:

		sudo npm install express-generator@4.2.0 -g

    The output appears similar to the following example:

		express-generator@4.2.0 /usr/local/lib/node_modules/express-generator
		├── mkdirp@0.3.5
		└── commander@1.3.2 (keypress@0.1.0)

	> [AZURE.NOTE] The '-g' parameter installs the module globally. That way, we can use **express** to generate web app scaffolding without having to type in additional path information.

4. To create the scaffolding for the application, enter the **express** command:

        express

	The output of this command appears similar to the following example:

		   create : .
		   create : ./package.json
		   create : ./app.js
		   create : ./public
		   create : ./public/images
		   create : ./routes
		   create : ./routes/index.js
		   create : ./routes/users.js
		   create : ./public/stylesheets
		   create : ./public/stylesheets/style.css
		   create : ./views
		   create : ./views/index.jade
		   create : ./views/layout.jade
		   create : ./views/error.jade
		   create : ./public/javascripts
		   create : ./bin
		   create : ./bin/www

		   install dependencies:
		     $ cd . && npm install

		   run the app:
		     $ DEBUG=my-application ./bin/www

	You now have several new directories and files in the **tasklist** directory.

### Install additional modules

One of the files that **express** creates is **package.json**. This file contains a list of module dependencies. Later, when you deploy the application to App Service Web Apps, this file determines which modules need to be installed on Azure.

From the command-line, enter the following command to install the modules described in the **package.json** file. You may need to use 'sudo'.

    npm install

The output of this command appears similar to the following example:

	debug@0.7.4 node_modules\debug

	cookie-parser@1.0.1 node_modules\cookie-parser
	├── cookie-signature@1.0.3
	└── cookie@0.1.0

    [...]


Next, enter the following command to install the [azure], [node-uuid], [nconf] and [async] modules:

	npm install azure-storage node-uuid async nconf --save

The **--save** flag adds entries for these modules to the **package.json** file.

The output of this command appears similar to the following example:

	async@0.9.0 node_modules\async

	node-uuid@1.4.1 node_modules\node-uuid

	nconf@0.6.9 node_modules\nconf
	├── ini@1.2.1
	├── async@0.2.9
	└── optimist@0.6.0 (wordwrap@0.0.2, minimist@0.0.10)

	[...]


## Create the application

Now we're ready to build the application.

### Create a model

A *model* is an object that represents the data in your application. For the application, the only model is a task object, which represents an item in the to-do list. Tasks will have the following fields:

- PartitionKey
- RowKey
- name (string)
- category (string)
- completed (Boolean)

**PartitionKey** and **RowKey** are used by the Table Service as table keys. For more information, see [Understanding the Table Service data model](https://msdn.microsoft.com/library/azure/dd179338.aspx).


1. In the **tasklist** directory, create a new directory named **models**.

2. In the **models** directory, create a new file named **task.js**. This file will contain the model for the tasks created by your application.

3. At the beginning of the **task.js** file, add the following code to reference required libraries:

        var azure = require('azure-storage');
  		var uuid = require('node-uuid');
		var entityGen = azure.TableUtilities.entityGenerator;

4. Add the following code to define and export the Task object. This object is responsible for connecting to the table.

  		module.exports = Task;

		function Task(storageClient, tableName, partitionKey) {
		  this.storageClient = storageClient;
		  this.tableName = tableName;
		  this.partitionKey = partitionKey;
		  this.storageClient.createTableIfNotExists(tableName, function tableCreated(error) {
		    if(error) {
		      throw error;
		    }
		  });
		};

5. Add the following code to define additional methods on the Task object, which allow interactions with data stored in the table:

		Task.prototype = {
		  find: function(query, callback) {
		    self = this;
		    self.storageClient.queryEntities(this.tableName, query, null, function entitiesQueried(error, result) {
		      if(error) {
		        callback(error);
		      } else {
		        callback(null, result.entries);
		      }
		    });
		  },

		  addItem: function(item, callback) {
		    self = this;
		    // use entityGenerator to set types
			// NOTE: RowKey must be a string type, even though
            // it contains a GUID in this example.
		    var itemDescriptor = {
		      PartitionKey: entityGen.String(self.partitionKey),
		      RowKey: entityGen.String(uuid()),
		      name: entityGen.String(item.name),
		      category: entityGen.String(item.category),
		      completed: entityGen.Boolean(false)
		    };
		    self.storageClient.insertEntity(self.tableName, itemDescriptor, function entityInserted(error) {
		      if(error){  
		        callback(error);
		      }
		      callback(null);
		    });
		  },

		  updateItem: function(rKey, callback) {
		    self = this;
		    self.storageClient.retrieveEntity(self.tableName, self.partitionKey, rKey, function entityQueried(error, entity) {
		      if(error) {
		        callback(error);
		      }
		      entity.completed._ = true;
		      self.storageClient.updateEntity(self.tableName, entity, function entityUpdated(error) {
		        if(error) {
		          callback(error);
		        }
		        callback(null);
		      });
		    });
		  }
		}

6. Save and close the **task.js** file.

### Create a controller

A *controller* handles HTTP requests and renders the HTML response.

1. In the **tasklist/routes** directory, create a new file named **tasklist.js** and open it in a text editor.

2. Add the following code to **tasklist.js**. This loads the azure and async modules, which are used by **tasklist.js**. This also defines the **TaskList** function, which is passed an instance of the **Task** object we defined earlier:

		var azure = require('azure-storage');
		var async = require('async');

		module.exports = TaskList;

3. Define a **TaskList** object.

		function TaskList(task) {
		  this.task = task;
		}


4. Add the following methods to **TaskList**:

		TaskList.prototype = {
		  showTasks: function(req, res) {
		    self = this;
		    var query = new azure.TableQuery()
		      .where('completed eq ?', false);
		    self.task.find(query, function itemsFound(error, items) {
		      res.render('index',{title: 'My ToDo List ', tasks: items});
		    });
		  },

		  addTask: function(req,res) {
		    var self = this;
		    var item = req.body.item;
		    self.task.addItem(item, function itemAdded(error) {
		      if(error) {
		        throw error;
		      }
		      res.redirect('/');
		    });
		  },

		  completeTask: function(req,res) {
		    var self = this;
		    var completedTasks = Object.keys(req.body);
		    async.forEach(completedTasks, function taskIterator(completedTask, callback) {
		      self.task.updateItem(completedTask, function itemsUpdated(error) {
		        if(error){
		          callback(error);
		        } else {
		          callback(null);
		        }
		      });
		    }, function goHome(error){
		      if(error) {
		        throw error;
		      } else {
		       res.redirect('/');
		      }
		    });
		  }
		}


### Modify app.js

1. From the **tasklist** directory, open the **app.js** file. This file was created earlier by running the **express** command.

2. At the beginning of the file, add the following to load the azure module, set the table name, partition key, and set the storage credentials used by this example:

		var azure = require('azure-storage');
		var nconf = require('nconf');
		nconf.env()
		     .file({ file: 'config.json', search: true });
		var tableName = nconf.get("TABLE_NAME");
		var partitionKey = nconf.get("PARTITION_KEY");
		var accountName = nconf.get("STORAGE_NAME");
		var accountKey = nconf.get("STORAGE_KEY");

	> [AZURE.NOTE] nconf will load the configuration values from either environment variables or the **config.json** file, which we will create later.

3. In the app.js file, scroll down to where you see the following line:

		app.use('/', routes);
		app.use('/users', users);

	Replace the above lines with the code shown below. This will initialize an instance of <strong>Task</strong> with a connection to your storage account. This is passed to the <strong>TaskList</strong>, which will use it to communicate with the Table service:

		var TaskList = require('./routes/tasklist');
		var Task = require('./models/task');
		var task = new Task(azure.createTableService(accountName, accountKey), tableName, partitionKey);
		var taskList = new TaskList(task);

		app.get('/', taskList.showTasks.bind(taskList));
		app.post('/addtask', taskList.addTask.bind(taskList));
		app.post('/completetask', taskList.completeTask.bind(taskList));

4. Save the **app.js** file.

### Modify the index view

1. Open the **tasklist/views/index.jade** file in a text editor.

2. Replace the entire contents of the file with the following code. This defines a view that displays existing tasks and includes a form for adding new tasks and marking existing ones as completed.

		extends layout

		block content
		  h1= title
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
		            td #{task.name._}
		            td #{task.category._}
		            - var day   = task.Timestamp._.getDate();
		            - var month = task.Timestamp._.getMonth() + 1;
		            - var year  = task.Timestamp._.getFullYear();
		            td #{month + "/" + day + "/" + year}
		            td
		              input(type="checkbox", name="#{task.RowKey._}", value="#{!task.completed._}", checked=task.completed._)
		    button.btn(type="submit") Update tasks
		  hr
		  form.well(action="/addtask", method="post")
		    label Item Name:
		    input(name="item[name]", type="textbox")
		    label Item Category:
		    input(name="item[category]", type="textbox")
		    br
		    button.btn(type="submit") Add item

3. Save and close **index.jade** file.

### Modify the global layout

The **layout.jade** file in the **views** directory is a global template for other **.jade** files. In this step you will modify it to use [Twitter Bootstrap](https://github.com/twbs/bootstrap), which is a toolkit that makes it easy to design a nice looking web app.

Download and extract the files for [Twitter Bootstrap](http://getbootstrap.com/). Copy the **bootstrap.min.css** file from the Bootstrap **css** folder into the **public/stylesheets** directory of your application.

From the **views** folder, open **layout.jade** and replace the entire contents with the following:

	doctype html
	html
	  head
	    title= title
	    link(rel='stylesheet', href='/stylesheets/bootstrap.min.css')
	    link(rel='stylesheet', href='/stylesheets/style.css')
	  body.app
	    nav.navbar.navbar-default
	      div.navbar-header
	      a.navbar-brand(href='/') My Tasks
	    block content

### Create a config file

To run the app locally, we'll put Azure Storage credentials into a config file. Create a file named **config.json* *with the following JSON:

	{
		"STORAGE_NAME": "<storage account name>",
		"STORAGE_KEY": "<storage access key>",
		"PARTITION_KEY": "mytasks",
		"TABLE_NAME": "tasks"
	}

Replace **storage account name** with the name of the storage account you created earlier, and replace **storage access key** with the primary access key for your storage account. For example:

	{
	    "STORAGE_NAME": "nodejsappstorage",
	    "STORAGE_KEY": "KG0oDd..."
	    "PARTITION_KEY": "mytasks",
	    "TABLE_NAME": "tasks"
	}

Save this file *one directory level higher* than the **tasklist** directory, like this:

	parent/
	  |-- config.json
	  |-- tasklist/

The reason for doing this is to avoid checking the config file into source control, where it might become public. When we deploy the app to Azure, we will use environment variables instead of a config file.


## Run the application locally

To test the application on your local machine, perform the following steps:

1. From the command-line, change directories to the **tasklist** directory.

2. Use the following command to launch the application locally:

        npm start

3. Open a web browser and navigate to http://127.0.0.1:3000.

	A web page similar to the following example appears.

	![A webpage displaying an empty tasklist][node-table-finished]

4. To create a new to-do item, enter a name and category and click **Add Item**. 

6. To mark a task as complete, check **Complete** and click **Update Tasks**.

	![An image of the new item in the list of tasks][node-table-list-items]

Even though the application is running locally, it is storing the data in the Azure Table service.

## Deploy your application to Azure

The steps in this section use the Azure command-line tools to create a new web app in App Service, and then use Git to deploy your application. To perform these steps you must have an Azure subscription.

> [AZURE.NOTE] These steps can also be performed by using the [Azure Portal](https://portal.azure.com/). See [Build and deploy a Node.js web app in Azure App Service].
>
> If this is the first web app you have created, you must use the Azure Portal to deploy this application.

To get started, install the [Azure CLI] by entering the following command from the command line:

	npm install azure-cli -g

### Import publishing settings

In this step, you will download a file containing information about your subscription.

1. Enter the following command:

		azure account download

	This command launches a browser and navigates to the download page. If prompted, log in with the account associated with your Azure subscription.

	<!-- ![The download page][download-publishing-settings] -->

	The file download begins automatically; if it does not, you can click the link at the beginning of the page to manually download the file. Save the file and note the file path.

2. Enter the following command to import the settings:

		azure account import <path-to-file>

	Specify the path and file name of the publishing settings file you downloaded in the previous step.

3. After the settings are imported, delete the publish settings file. It is no longer needed, and contains sensitive information regarding your Azure subscription.

### Create an App Service web app

1. From the command-line, change directories to the **tasklist** directory.

2. Use the following command to create a new web app.

		azure site create --git

	You will be prompted for the web app name and location. Provide a unique name and select the same geographical location as your Azure Storage account.

	The `--git` parameter creates a Git repository on Azure for this web app. It also initializes a Git repository in the current directory if none exists, and adds a [Git remote] named 'azure', which is used to publish the application to Azure. Finally, it creates a **web.config** file, which contains settings used by Azure to host node applications. If you omit the `--git` parameter but the directory contains a Git repository, the command will still create the 'azure' remote.

	Once this command has completed, you will see output similar to the following. Note that the line beginning with **Website created at** contains the URL for the web app.

		info:   Executing command site create
		help:   Need a site name
		Name: TableTasklist
		info:   Using location southcentraluswebspace
		info:   Executing `git init`
		info:   Creating default .gitignore file
		info:   Creating a new web site
		info:   Created web site at  tabletasklist.azurewebsites.net
		info:   Initializing repository
		info:   Repository initialized
		info:   Executing `git remote add azure https://username@tabletasklist.azurewebsites.net/TableTasklist.git`
		info:   site create command OK

	> [AZURE.NOTE] If this is the first App Service web app for your subscription, you will be instructed to use the Azure Portal to create the web app. For more information, see [Build and deploy a Node.js web app in Azure App Service].

### Set environment variables

In this step, you will add environment variables to your web app configuration on Azure.
From the command line, enter the following:

	azure site appsetting add
		STORAGE_NAME=<storage account name>;STORAGE_KEY=<storage access key>;PARTITION_KEY=mytasks;TABLE_NAME=tasks


Replace **<storage account name>** with the name of the storage account you created earlier, and replace **<storage access key>** with the primary access key for your storage account. (Use the same values as the config.json file that you created earlier.)

Alternatively, you can set environment variables in the [Azure Portal](https://portal.azure.com/):

1.  Open the web app's blade by clicking **Browse** > **Web Apps** > your web app name.

1.  In your web app's blade, click **All Settings** > **Application Settings**.

  	<!-- ![Top Menu](./media/storage-nodejs-use-table-storage-web-site/PollsCommonWebSiteTopMenu.png) -->

1.  Scroll down to the **App settings** section and add the key/value pairs.

  	![App Settings](./media/storage-nodejs-use-table-storage-web-site/storage-tasks-appsettings.png)

1. Click **SAVE**.


### Publish the application

To publish the app, commit the code files to Git and then push to azure/master.

1. Set your deployment credentials.

		azure site deployment user set <name> <password>

2. Add and commit your application files.

		git add .
		git commit -m "adding files"

3. Push the commit to the App Service web app:

		git push azure master

	Use **master** as the target branch. At the end of the deployment, you see a statement similar to the following example:

		To https://username@tabletasklist.azurewebsites.net/TableTasklist.git
 		 * [new branch]      master -> master

4. Once the push operation has completed, browse to the web app URL returned previously by the `azure create site` command to view your application.


## Next steps

While the steps in this article describe using the Table Service to store information, you can also use MongoDB. See [Node.js web app with MongoDB] for more information.

## Additional resources

[Azure CLI]

## What's changed
* For a guide to the change from Websites to App Service see: [Azure App Service and Its Impact on Existing Azure Services](http://go.microsoft.com/fwlink/?LinkId=529714)

<!-- URLs -->

[Build and deploy a Node.js web app in Azure App Service]: web-sites-nodejs-develop-deploy-mac.md
[Azure Developer Center]: /develop/nodejs/

[node]: http://nodejs.org
[Git]: http://git-scm.com
[Express]: http://expressjs.com
[for free]: http://windowsazure.com
[Git remote]: http://git-scm.com/docs/git-remote

[Node.js web app with MongoDB]: web-sites-nodejs-store-data-mongodb.md
[Azure CLI]: ../xplat-cli-install.md

[azure]: https://github.com/Azure/azure-sdk-for-node
[node-uuid]: https://www.npmjs.com/package/node-uuid
[nconf]: https://www.npmjs.com/package/nconf
[async]: https://www.npmjs.com/package/async

[Azure Portal]: https://portal.azure.com

[Create and deploy a Node.js application to an Azure Web Site]: web-sites-nodejs-develop-deploy-mac.md
 
<!-- Image References -->

[node-table-finished]: ./media/storage-nodejs-use-table-storage-web-site/table_todo_empty.png
[node-table-list-items]: ./media/storage-nodejs-use-table-storage-web-site/table_todo_list.png
[download-publishing-settings]: ./media/storage-nodejs-use-table-storage-web-site/azure-account-download-cli.png
[portal-new]: ./media/storage-nodejs-use-table-storage-web-site/plus-new.png
[portal-storage-account]: ./media/storage-nodejs-use-table-storage-web-site/new-storage.png
[portal-quick-create-storage]: ./media/storage-nodejs-use-table-storage-web-site/quick-storage.png
[portal-storage-access-keys]: ./media/storage-nodejs-use-table-storage-web-site/manage-access-keys.png
[go-to-dashboard]: ./media/storage-nodejs-use-table-storage-web-site/go_to_dashboard.png
[web-configure]: ./media/storage-nodejs-use-table-storage-web-site/sql-task-configure.png
[app-settings-save]: ./media/storage-nodejs-use-table-storage-web-site/savebutton.png
[app-settings]: ./media/storage-nodejs-use-table-storage-web-site/storage-tasks-appsettings.png
