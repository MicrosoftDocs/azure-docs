<properties 
	pageTitle="Web app with table storage (Node.js) | Microsoft Azure" 
	description="A tutorial that builds on the Web App with Express tutorial by adding Azure Storage services and the Azure module." 
	services="cloud-services, storage" 
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

# Node.js Web Application using Storage

## Overview

In this tutorial, you will extend the application created in the
[Node.js Web Application using Express] tutorial by using the Microsoft
Azure Client Libraries for Node.js to work with data management services. You
will extend your application to create a web-based task-list application
that you can deploy to Azure. The task list allows a user to
retrieve tasks, add new tasks, and mark tasks as completed.

The task items are stored in Azure Storage. Azure
Storage provides unstructured data storage that is fault-tolerant and
highly available. Azure Storage includes several data structures
where you can store and access data, and you can leverage the storage
services from the APIs included in the Azure SDK for Node.js or
via REST APIs. For more information, see [Storing and Accessing Data in Azure].

This tutorial assumes that you have completed the [Node.js Web
Application] and [Node.js with Express][Node.js Web Application using Express] tutorials.

You will learn:

-   How to work with the Jade template engine
-   How to work with Azure Data Management services

A screenshot of the completed application is below:

![The completed web page in internet explorer](./media/storage-nodejs-use-table-storage-cloud-service-app/getting-started-1.png)

## Setting Storage Credentials in Web.Config

To access Azure Storage, you need to pass in storage
credentials. To do this, you utilize web.config application settings.
Those settings will be passed as environment variables to Node, which
are then read by the Azure SDK.

> [AZURE.NOTE] Storage credentials are only used when the application is
deployed to Azure. When running in the emulator, the application
will use the storage emulator.

Perform the following steps to retrieve the storage account credentials
and add them to the web.config settings:

1.  If it is not already open, start the Azure PowerShell from the **Start** menu by expanding **All Programs, Azure**, right-click **Azure PowerShell**, and then select **Run As Administrator**.

2.  Change directories to the folder containing your application. For example, C:\\node\\tasklist\\WebRole1.

3.  From the Azure Powershell window enter the following cmdlet to retrieve the storage account information:

        PS C:\node\tasklist\WebRole1> Get-AzureStorageAccounts

	This retrieves the list of storage accounts and account keys associated with your hosted service.

	> [AZURE.NOTE] Since the Azure SDK creates a storage account when you deploy a service, a storage account should already exist from deploying your application in the previous guides.

4.  Open the **ServiceDefinition.csdef** file containing the environment settings that are used when the application is deployed to Azure:

        PS C:\node\tasklist> notepad ServiceDefinition.csdef

5.  Insert the following block under **Environment** element, substituting {STORAGE ACCOUNT} and {STORAGE ACCESS KEY} with the account name and the primary key for the storage account you want to use for deployment:

        <Variable name="AZURE_STORAGE_ACCOUNT" value="{STORAGE ACCOUNT}" />
        <Variable name="AZURE_STORAGE_ACCESS_KEY" value="{STORAGE ACCESS KEY}" />

	![The web.cloud.config file contents](./media/storage-nodejs-use-table-storage-cloud-service-app/node37.png)

6.  Save the file and close notepad.

### Install additional modules

2. Use the following command to install the [azure], [node-uuid], [nconf] and [async] modules locally as well as to save an entry for them to the **package.json** file:

		PS C:\node\tasklist\WebRole1> npm install azure-storage node-uuid async nconf --save

	The output of this command should appear similar to the following:

		node-uuid@1.4.1 node_modules\node-uuid

		nconf@0.6.9 node_modules\nconf
		├── ini@1.1.0
		├── async@0.2.9
		└── optimist@0.6.0 (wordwrap@0.0.2, minimist@0.0.8)

        azure-storage@0.1.0 node_modules\azure-storage
		├── extend@1.2.1
		├── xmlbuilder@0.4.3
		├── mime@1.2.11
		├── underscore@1.4.4
		├── validator@3.1.0
		├── node-uuid@1.4.1
		├── xml2js@0.2.7 (sax@0.5.2)
		└── request@2.27.0 (json-stringify-safe@5.0.0, tunnel-agent@0.3.0, aws-sign@0.3.0, forever-agent@0.5.2, qs@0.6.6, oauth-sign@0.3.0, cookie-jar@0.3.0, hawk@1.0.0, form-data@0.1.3, http-signature@0.10.0)

##Using the Table service in a node application

In this section you will extend the basic application created by the **express** command by adding a **task.js** file which contains the model for your tasks. You will also modify the existing **app.js** and create a new **tasklist.js** file that uses the model.

### Create the model

1. In the **WebRole1** directory, create a new directory named **models**.

2. In the **models** directory, create a new file named **task.js**. This file will contain the model for the tasks created by your application.

3. At the beginning of the **task.js** file, add the following code to reference required libraries:

        var azure = require('azure-storage');
  		var uuid = require('node-uuid');
		var entityGen = azure.TableUtilities.entityGenerator;

4. Next, you will add code to define and export the Task object. This object is responsible for connecting to the table.

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

5. Next, add the following code to define additional methods on the Task object, which allow interactions with data stored in the table:

		Task.prototype = {
		  find: function(query, callback) {
		    self = this;
		    self.storageClient.queryEntities(query, function entitiesQueried(error, result) {
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

### Create the controller

1. In the **WebRole1/routes** directory, create a new file named **tasklist.js** and open it in a text editor.

2. Add the following code to **tasklist.js**. This loads the azure and async modules, which are used by **tasklist.js**. This also defines the **TaskList** function, which is passed an instance of the **Task** object we defined earlier:

		var azure = require('azure-storage');
		var async = require('async');

		module.exports = TaskList;

		function TaskList(task) {
		  this.task = task;
		}

2. Continue adding to the **tasklist.js** file by adding the methods used to **showTasks**, **addTask**, and **completeTasks**:

		TaskList.prototype = {
		  showTasks: function(req, res) {
		    self = this;
		    var query = azure.TableQuery()
		      .where('completed eq ?', false);
		    self.task.find(query, function itemsFound(error, items) {
		      res.render('index',{title: 'My ToDo List ', tasks: items});
		    });
		  },

		  addTask: function(req,res) {
		    var self = this      
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

3. Save the **tasklist.js** file.

### Modify app.js

1. In the **WebRole1** directory, open the **app.js** file in a text editor. 

2. At the beginning of the file, add the following to load the azure module and set the table name and partition key:

		var azure = require('azure-storage');
		var tableName = 'tasks';
		var partitionKey = 'hometasks';

3. In the app.js file, scroll down to where you see the following line:

		app.use('/', routes);
		app.use('/users', users);

	Replace the above lines with the code shown below. This will initialize an instance of <strong>Task</strong> with a connection to your storage account. This is passed to the <strong>TaskList</strong>, which will use it to communicate with the Table service:

		var TaskList = require('./routes/tasklist');
		var Task = require('./models/task');
		var task = new Task(azure.createTableService(), tableName, partitionKey);
		var taskList = new TaskList(task);

		app.get('/', taskList.showTasks.bind(taskList));
		app.post('/addtask', taskList.addTask.bind(taskList));
		app.post('/completetask', taskList.completeTask.bind(taskList));
	
4. Save the **app.js** file.

### Modify the index view

1. Change directories to the **views** directory and open the **index.jade** file in a text editor.

2. Replace the contents of the **index.jade** file with the code below. This defines the view for displaying existing tasks, as well as a form for adding new tasks and marking existing ones as completed.

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
		      if tasks != []
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

The **layout.jade** file in the **views** directory is used as a global template for other **.jade** files. In this step you will modify it to use [Twitter Bootstrap](https://github.com/twbs/bootstrap), which is a toolkit that makes it easy to design a nice looking website.

1. Download and extract the files for [Twitter Bootstrap](http://getbootstrap.com/). Copy the **bootstrap.min.css** file from the **bootstrap\\dist\\css** folder to the **public\\stylesheets** directory of your tasklist application.

2. From the **views** folder, open the **layout.jade** in your text editor and replace the contents with the following:

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

3. Save the **layout.jade** file.

### Running the Application in the Emulator

Use the following command to start the application in the emulator.

	PS C:\node\tasklist\WebRole1> start-azureemulator -launch

The browser will open and displays the following page:

![A web paged titled My Task List with a table containing tasks and fields to add a new task.](./media/storage-nodejs-use-table-storage-cloud-service-app/node44.png)

Use the form to add items, or remove existing items by marking them as completed.

## Publishing the Application to Azure


In the Windows PowerShell window, call the following cmdlet to redeploy your hosted service to Azure.

    PS C:\node\tasklist\WebRole1> Publish-AzureServiceProject -name myuniquename -location datacentername -launch

Replace **myuniquename** with a unique name for this application. Replace **datacentername** with the name of an Azure data center, such as **West US**.

After the deployment is complete, you should see a response similar to the following:

	PS C:\node\tasklist> publish-azureserviceproject -servicename tasklist -location "West US"
	WARNING: Publishing tasklist to Microsoft Azure. This may take several minutes...
	WARNING: 2:18:42 PM - Preparing runtime deployment for service 'tasklist'
	WARNING: 2:18:42 PM - Verifying storage account 'tasklist'...
	WARNING: 2:18:43 PM - Preparing deployment for tasklist with Subscription ID: 65a1016d-0f67-45d2-b838-b8f373d6d52e...
	WARNING: 2:19:01 PM - Connecting...
	WARNING: 2:19:02 PM - Uploading Package to storage service larrystore...
	WARNING: 2:19:40 PM - Upgrading...
	WARNING: 2:22:48 PM - Created Deployment ID: b7134ab29b1249ff84ada2bd157f296a.
	WARNING: 2:22:48 PM - Initializing...
	WARNING: 2:22:49 PM - Instance WebRole1_IN_0 of role WebRole1 is ready.
	WARNING: 2:22:50 PM - Created Website URL: http://tasklist.cloudapp.net/.

As before, because you specified the **-launch** option, the browser opens and displays your application running in Azure when publishing is completed.

![A browser window displaying the My Task List page. The URL indicates the page is now being hosted on Azure.](./media/storage-nodejs-use-table-storage-cloud-service-app/getting-started-1.png)

## Stopping and Deleting Your Application

After deploying your application, you may want to disable it so you can
avoid costs or build and deploy other applications within the free trial
time period.

Azure bills web role instances per hour of server time consumed.
Server time is consumed once your application is deployed, even if the
instances are not running and are in the stopped state.

The following steps show you how to stop and delete your application.

1.  In the Windows PowerShell window, stop the service deployment
    created in the previous section with the following cmdlet:

        PS C:\node\tasklist\WebRole1> Stop-AzureService

	Stopping the service may take several minutes. When the service is stopped, you receive a message indicating that it has stopped.

3.  To delete the service, call the following cmdlet:

        PS C:\node\tasklist\WebRole1> Remove-AzureService contosotasklist

	When prompted, enter **Y** to delete the service.

	Deleting the service may take several minutes. After the service has been deleted you receive a message indicating that the service was deleted.

  [Node.js Web Application using Express]: http://azure.microsoft.com/develop/nodejs/tutorials/web-app-with-express/
  [Storing and Accessing Data in Azure]: http://msdn.microsoft.com/library/azure/gg433040.aspx
  [Node.js Web Application]: http://azure.microsoft.com/develop/nodejs/tutorials/getting-started/
 
 
