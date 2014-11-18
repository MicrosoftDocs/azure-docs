<properties urlDisplayName="Website with Storage" pageTitle="Node.js website with table storage | Microsoft Azure" metaKeywords="Azure table storage Node.js, Azure Node.js application, Azure Node.js tutorial, Azure Node.js example" description="A tutorial that teaches you how to use the Azure Table service to store data from a Node application hosted on an Azure website." metaCanonical="" services="web-sites,storage" documentationCenter="nodejs" title="Node.js Web Application using the Azure Table Service" authors="larryfr" solutions="" manager="wpickett" editor="" />

<tags ms.service="storage" ms.workload="storage" ms.tgt_pltfrm="na" ms.devlang="nodejs" ms.topic="article" ms.date="09/17/2014" ms.author="mwasson" />





# Node.js Web Application using the Azure Table Service

This tutorial shows you how to use Table service provided by Azure Data Management to store and access data from a [node] application hosted on Azure. This tutorial assumes that you have some prior experience using node and [Git].

You will learn:

* How to use npm (node package manager) to install the node modules

* How to work with the Azure Table service

* How to use the Azure command-line tool for Mac and Linux to create an Azure Website

By following this tutorial, you will build a simple web-based task-management application that allows creating, retrieving and completing tasks. The tasks are stored in the Table service.
 
The project files for this tutorial will be stored in a directory named **tasklist** and the completed application will look similar to the following:

![A web page displaying an empty tasklist][node-table-finished]

> [WACOM.NOTE] This tutorial makes reference to the **tasklist** folder. The full path to this folder is omitted, as path semantics differ between operating systems. You should create this folder in a location that is easy for you to access on your local file system, such as **~/node/tasklist** or **c:\node\tasklist**.

> [WACOM.NOTE] Many of the steps below mention using the command-line. For these steps, use the command-line for your operating system, such as **cmd.exe** (Windows) or **Bash** (Unix Shell). On OS X systems you can access the command-line through the Terminal application.

##Prerequisites

Before following the instructions in this article, you should ensure that you have the following installed:

* [node] version 0.10.24 or higher

* [Git]

* A text editor

* A web browser

[WACOM.INCLUDE [create-account-and-websites-note](../includes/create-account-and-websites-note.md)]

##Create a storage account

Perform the following steps to create a storage account. This account will be used by subsequent instructions in this tutorial.

1. Open your web browser and go to the [Azure Portal]. If prompted, login with your Azure subscription information.

2. At the bottom of the portal, click **+ NEW** and then select **Storage Account**.

	![+new][portal-new]

	![storage account][portal-storage-account]

3. Select **Quick Create**, and then enter the URL and Region/Affinity for this storage account. Since this is a tutorial and does not need to be replicated globally, uncheck **Enable Geo-Replication**. Finally, click "Create Storage Account".

	![quick create][portal-quick-create-storage]

	Make note of the URL you enter, as this will be referenced as the account name by later steps.

4. Once the storage account has been created, click **Manage Keys** at the bottom of the page. This will display the primary and secondary access keys for this storage account. Copy and save the primary access key, then click the checkmark.

	![access keys][portal-storage-access-keys]

##Install modules and generate scaffolding

In this section you will create a new Node application and use npm to add module packages. For the task-list application you will use the [Express] and [Azure] modules. The Express module provides a Model View Controller framework for node, while the Azure modules provides connectivity to the Table service.

###Install express and generate scaffolding

1. From the command-line, change directories to the **tasklist** directory. If the **tasklist** directory does not exist, create it.

2. Enter the following to install the express command.

		npm install express-generator@4.2.0 -g

    > [WACOM.NOTE] When using the '-g' parameter on some operating systems, you may receive an error of **Error: EPERM, chmod '/usr/local/bin/express'** and a request to try running the account as an administrator. If this occurs, use the **sudo** command to run npm at a higher privilege level.

    The output of this command should appear similar to the following:

		express-generator@4.2.0 C:\Users\username\AppData\Roaming\npm\node_modules\express-generator
		├── mkdirp@0.3.5
		└── commander@1.3.2 (keypress@0.1.0)

	> [WACOM.NOTE] The '-g' parameter used when installing the express module installs it globally. This is done so that we can access the **express** command to generate website scaffolding without having to type in additional path information.**

4. To create the scaffolding which will be used for this application, use the **express** command:

        express

	The output of this command should appear similar to the following:

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

	After this command completes, you should have several new directories and files in the **tasklist** directory.

###Install additional modules

The **package.json** file is one of the files created by the **express** command. This file contains a list of additional modules that are required for an Express application. Later, when you deploy this application to an Azure Website, this file will be used to determine which modules need to be installed on Azure to support your application.

1. From the command-line, change directories to the **tasklist** folder and enter the following to install the modules described in the **package.json** file:

        npm install

    The output of this command should appear similar to the following:

		debug@0.7.4 node_modules\debug
		
		static-favicon@1.0.2 node_modules\static-favicon
		
		morgan@1.0.1 node_modules\morgan
		└── bytes@0.3.0
		
		cookie-parser@1.0.1 node_modules\cookie-parser
		├── cookie-signature@1.0.3
		└── cookie@0.1.0
		
		body-parser@1.0.2 node_modules\body-parser
		├── qs@0.6.6
		├── raw-body@1.1.7 (string_decoder@0.10.25-1, bytes@1.0.0)
		└── type-is@1.1.0 (mime@1.2.11)
		
		express@4.2.0 node_modules\express
		├── parseurl@1.0.1
		├── merge-descriptors@0.0.2
		├── utils-merge@1.0.0
		├── cookie@0.1.2
		├── escape-html@1.0.1
		├── cookie-signature@1.0.3
		├── debug@0.8.1
		├── fresh@0.2.2
		├── qs@0.6.6
		├── range-parser@1.0.0
		├── methods@1.0.0
		├── buffer-crc32@0.2.1
		├── serve-static@1.1.0
		├── path-to-regexp@0.1.2
		├── send@0.3.0 (debug@0.8.0, mime@1.2.11)
		├── type-is@1.1.0 (mime@1.2.11)
		└── accepts@1.0.1 (negotiator@0.4.7, mime@1.2.11)
		
		jade@1.3.1 node_modules\jade
		├── commander@2.1.0
		├── character-parser@1.2.0
		├── mkdirp@0.3.5
		├── monocle@1.1.51 (readdirp@0.2.5)
		├── constantinople@2.0.1 (uglify-js@2.4.15)
		├── transformers@2.1.0 (promise@2.0.0, css@1.0.8, uglify-js@2.2.5)
		└── with@3.0.0 (uglify-js@2.4.15)


	This installs all of the default modules that Express needs.

2. Next, enter the following command to install the [azure], [node-uuid], [nconf] and [async] modules locally as well as to save an entry for them to the **package.json** file:

		npm install azure-storage node-uuid async nconf --save

	The output of this command should appear similar to the following:

		async@0.9.0 node_modules\async

		node-uuid@1.4.1 node_modules\node-uuid
		
		nconf@0.6.9 node_modules\nconf
		├── ini@1.2.1
		├── async@0.2.9
		└── optimist@0.6.0 (wordwrap@0.0.2, minimist@0.0.10)
		
		azure-storage@0.3.0 node_modules\azure-storage
		├── extend@1.2.1
		├── xmlbuilder@0.4.3
		├── mime@1.2.11
		├── validator@3.1.0
		├── underscore@1.4.4
		├── xml2js@0.2.7 (sax@0.5.2)
		└── request@2.27.0 (forever-agent@0.5.2, aws-sign@0.3.0, json-stringify-safe@5.0.0, tunnel-agent@0.3.0, qs@0.6.6, oauth-sign@0.3.0, cookie-jar@0.3.0, form-data@0.1.4, hawk@1.0.0, http-signature@0.10.0)

##Using the Table service in a node application

In this section you will extend the basic application created by the **express** command by adding a **task.js** file which contains the model for your tasks. You will also modify the existing **app.js** and create a new **tasklist.js** file that uses the model.

### Create the model

1. In the **tasklist** directory, create a new directory named **models**.

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

###Create the controller

1. In the **tasklist/routes** directory, create a new file named **tasklist.js** and open it in a text editor.

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
		    var query = new azure.TableQuery()
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

1. In the **tasklist** directory, open the **app.js** file in a text editor. This file was created earlier by running the **express** command.

2. At the beginning of the file, add the following to load the azure module, set the table name, partitionKey, and set the storage credentials used by this example:

		var azure = require('azure-storage');
		var nconf = require('nconf');
		nconf.env()
		     .file({ file: 'config.json'});
		var tableName = nconf.get("TABLE_NAME");
		var partitionKey = nconf.get("PARTITION_KEY");
		var accountName = nconf.get("STORAGE_NAME");
		var accountKey = nconf.get("STORAGE_KEY");

	> [WACOM.NOTE] nconf will load the configuration values from either environment variables or the **config.json** file, which we will create later.

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

###Modify the index view

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

###Modify the global layout

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

###Create configuration file

The **config.json** file contains the connection string used to connect to the SQL Database, and is read by the application at run-time. To create this file, perform the following steps:

1. In the **tasklist** directory, create a new file named **config.json** and open it in a text editor.

2. The contents of the **config.json** file should appear similiar to the following:

		{
			"STORAGE_NAME": "storage account name",
			"STORAGE_KEY": "storage access key",
			"PARTITION_KEY": "mytasks",
			"TABLE_NAME": "tasks"
		}

	Replace the **storage account name** with the name of the storage account you created earlier. Replace the **storage access key** with the primary access key for your storage account.

3. Save the file.

##Run your application locally

To test the application on your local machine, perform the following steps:

1. From the command-line, change directories to the **tasklist** directory.

2. Use the following command to launch the application locally:

        npm start

3. Open a web browser and navigate to http://127.0.0.1:3000. This should display a web page similar to the following:

    ![A webpage displaying an empty tasklist][node-table-finished]

4. Use the provided fields for **Item Name** and **Item Category** to enter information, and then click **Add item**.

5. The page should update to display the item in the ToDo List table.

    ![An image of the new item in the list of tasks][node-table-list-items]

6. To complete a task, simply check the checkbox in the Complete column, and then click **Update tasks**.

7. To stop the node process, go to the command-line and press the **CTRL** and **C** keys.

##Deploy your application to Azure

The steps in this section use the Azure command-line tools to create a new Azure Website, and then use Git to deploy your application. To perform these steps you must have an Azure subscription.

> [WACOM.NOTE] These steps can also be performed by using the Azure portal. For steps on using the Azure portal to deploy a Node.js application, see [Create and deploy a Node.js application to an Azure Web Site].

> [WACOM.NOTE] If this is the first Azure Website you have created, you must use the Azure portal to deploy this application.

###Create an Azure subscription

If you do not already have an Azure subscription, you can sign up [for free]. After signing up, follow these steps to continue this tutorial.

[WACOM.INCLUDE [antares-iaas-signup](../includes/antares-iaas-signup.md)]

###Install the Azure command-line tool for Mac and Linux

To install the command-line tools, use the following command:
	
	npm install azure-cli -g

> [WACOM.NOTE] For more information, see [Install and configure the Azure Cross-Platform Command-Line Interface](/en-us/documentation/articles/xplat-cli/);

> [WACOM.NOTE] While the command-line tools were created primarily for Mac and Linux users, they are based on Node.js and should work on any system capable of running Node.

###Import publishing settings

Before using the command-line tools with Azure, you must first download a file containing information about your subscription. Perform the following steps to download and import this file.

1. From the command-line, change directories to the **tasklist** directory.

2. Enter the following command to launch the browser and navigate to the download page. If prompted, login with the account associated with your subscription.

		azure account download
	
	![The download page][download-publishing-settings]
	
	The file download should begin automatically; if it does not, you can click the link at the beginning of the page to manually download the file.

3. After the file download has completed, use the following command to import the settings:

		azure account import <path-to-file>
		
	Specify the path and file name of the publishing settings file you downloaded in the previous step. Once the command completes, you should see output similar to the following:
	
		info:   Executing command account import
		info:   Setting service endpoint to: management.core.windows.net
		info:   Setting service port to: 443
		info:   Found subscription: YourSubscription
		info:   Setting default subscription to: YourSubscription
		warn:   The 'C:\users\username\downloads\YourSubscription-6-7-2012-credentials.publishsettings' file contains sensitive information.
		warn:   Remember to delete it now that it has been imported.
		info:   Account publish settings imported successfully
		info:   account import command OK

4. Once the import has completed, you should delete the publish settings file as it is no longer needed and contains sensitive information regarding your Azure subscription.

###Create an Azure Website

1. From the command-line, change directories to the **tasklist** directory.

2. Use the following command to create a new Azure Website

		azure site create --git
		
	You will be prompted for the website name and the datacenter that it will be located in. Provide a unique name and select the datacenter geographically close to your location.
	
	The `--git` parameter will create a Git repository on Azure for this website. It will also initialize a Git repository in the current directory if none exists. It will also create a [Git remote] named 'azure', which will be used to publish the application to Azure. Finally, it will create a **web.config** file, which contains settings used by Azure to host node applications.
	
	> [WACOM.NOTE] If this command is ran from a directory that already contains a Git repository, it will not re-initialize the directory.
	
	> [WACOM.NOTE] If the `--git` parameter is omitted, yet the directory contains a Git repository, the 'azure' remote will still be created.
	
	Once this command has completed, you will see output similar to the following. Note that the line beginning with **Website created at** contains the URL for the website.
	
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

	> [WACOM.NOTE] If this is the first Azure Website for your subscription, you will be instructed to use the portal to create the website. For more information, see [Create and deploy a Node.js application to an Azure Website].

###Publish the application

1. In the Terminal window, change directories to the **tasklist** directory if you are not already there.

2. Use the following commands to add, and then commit files to the local Git repository:

		git add .
		git commit -m "adding files"

3. When pushing the latest Git repository changes to the Azure Website, you must specify that the target branch is **master** as this is used for the website content.

		git push azure master
	
	At the end of the deployment, you should see a statement similar to the following:
	
		To https://username@tabletasklist.azurewebsites.net/TableTasklist.git
 		 * [new branch]      master -> master

4. Once the push operation has completed, browse to the website URL returned previously by the `azure create site` command to view your application.

###Switch to an environment variable

Earlier we implemented code that looks for a environment variables or loads the value from the **config.json** file. In the following steps you will create key/value pairs in your website configuration that the application real access through an environment variable.

1. From the Management Portal, click **Websites** and then select your website.

	![Open website dashboard][go-to-dashboard]

2. Click **CONFIGURE** and then find the **app settings** section of the page. 

	![configure link][web-configure]

3. In the **app settings** section, enter **STORAGE_NAME** in the **KEY** field, and the name of your storage account in the **VALUE** field. Click the checkmark to move to the next field. Repeat this process for the following keys and values:

	* **STORAGE_KEY** - the access key for your storage account
	
	* **PARTITION_KEY** - 'mytasks'

	* **TABLE_NAME** - 'tasks'

	![app settings][app-settings]

4. Finally, click the **SAVE** icon at the bottom of the page to commit this change to the run-time environment.

	![app settings save][app-settings-save]

5. From the command-line, change directories to the **tasklist** directory and enter the following command to remove the **config.json** file:

		git rm config.json
		git commit -m "Removing config file"

6. Perform the following command to deploy the changes to Azure:

		git push azure master

Once the changes have been deployed to Azure, your web application should continue to work as it is now reading the connection string from the **app settings** entry. To verify this, change the value for the **STORAGE_KEY** entry in **app settings** to an invalid value. Once you have saved this value, the website should fail due to the invalid storage access key setting.

##Next steps

While the steps in this article describe using the Table Service to store information, you can also use MongoDB. See [Node.js Web Application with MongoDB] for more information.

##Additional resources

[Azure command-line tool for Mac and Linux]    
[Create and deploy a Node.js application to Azure Web Sites]: /en-us/documentation/articles/web-sites-nodejs-develop-deploy-mac/
[Publishing to Azure Web Sites with Git]: /en-us/documentation/articles/web-sites-publish-source-control/
[Azure Developer Center]: /en-us/develop/nodejs/


[node]: http://nodejs.org
[Git]: http://git-scm.com
[Express]: http://expressjs.com
[for free]: http://windowsazure.com
[Git remote]: http://git-scm.com/docs/git-remote

[Node.js Web Application with MongoDB]: /en-us/documentation/articles/web-sites-nodejs-store-data-mongodb/
[Azure command-line tool for Mac and Linux]: /en-us/documentation/articles/xplat-cli/

[Publishing to Azure Web Sites with Git]: /en-us/documentation/articles/web-sites-publish-source-control/
[azure]: https://github.com/Azure/azure-sdk-for-node


[Azure Portal]: http://windowsazure.com


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

[Create and deploy a Node.js application to an Azure Web Site]: /en-us/documentation/articles/web-sites-nodejs-develop-deploy-mac/
