# Node.js Web Application with the Windows Azure Table Service

This tutorial shows you how to use Table service provided by Windows Azure Data Management to store and access data from a [node] application hosted on Windows Azure. This tutorial assumes that you have some prior experience using node and [Git].

You will learn:

* How to use npm (node package manager) to install the node modules

* How to work with the Windows Azure Table service

* How to use the Cross-Platform Tools for Windows Azure to create a Windows Azure Website

By following this tutorial, you will build a simple web-based task-management application that allows creating, retrieving and completing tasks. The tasks are stored in the Table service.
 
The project files for this tutorial will be stored in a directory named **tasklist** and the completed application will look similar to the following:

![A web page displaying an empty tasklist][node-table-finished]

The instructions in this article have been tested on the following platforms:

* Windows 7

* Mac OS X 10.7.3

**Note**: This tutorial makes reference to the **tasklist** folder. The full path to this folder is omitted, as path semantics differ between operating systems. You should create this folder in a location that is easy for you to access on your local file system, such as **~/node/tasklist** or **c:\node\tasklist**

**Note**: Many of the steps below mention using the command-line. For these steps, use the command-line for your operating system, such as **cmd.exe** (Windows) or **Bash** (Unix Shell). On OS X systems you can access the command-line through the Terminal application.

##Prerequisites

Before following the instructions in this article, you should ensure that you have the following installed:

* [node] version 0.6.14 or higher

* [Git]

* A text editor

* A web browser

##Create a storage account

Perform the following steps to create a storage account. This account will be used by subsequent instructions in this tutorial.

1. Open your web browser and go to the [Windows Azure Portal]. If prompted, login with your Windows Azure subscription information.

	![Browser displaying the Windows Azure portal][windows-azure-portal]

2. At the bottom of the portal, click **+ NEW** and then select **Storage Account**.

	![+new][portal-new]

	![storage account][portal-storage-account]

3. Select **Quick Create**, and then enter the URL and Region/Affinity for this storage account. Since this is a tutorial and does not need to be replicated globally, uncheck **Enable Geo-Replication**. Finally, click "Create Storage Account".

	![quick create][portal-quick-create-storage]

	Make note of the URL you enter, as this will be referenced as the account name by later steps.

4. Once the storage account has been created, click **Manage Keys** at the bottom of the page. This will display the primary and secondary access keys for this storage account. Copy and save the primary access key, then click the checkmark.

	![access keys][porta-storage-access-keys]

##Install modules and generate scaffolding

In this section you will create a new Node application and use npm to add module packages. For the task-list application you will use the [Express] and [Azure] modules. The Express module provides a Model View Controller framework for node, while the Azure modules provides connectivity to the Table service.

###Install express and generate scaffolding

1. From the command-line, change directories to the **tasklist** directory. If the **tasklist** directory does not exist, create it.

2. Enter the following command to install express.

		npm install express -g

    The output of this command should appear similar to the following:

    ![npm install results][node-table-npm-results]

	**Note**: The '-g' parameter used when installing the express module installs it globally. This is done so that we can access the **express** command to generate website scaffolding without having to type in additional path information.

4. To create the scaffolding which will be used for this application, use the **express** command:

        express

	When prompted to overwrite the destination, enter **y** or **yes**. The output of this command should appear similar to the following:

    ![Express command output][node-table-express-results]

	After this command completes, you should have several new directories and files in the **tasklist** directory.

###Install additional modules

The **package.json** file is one of the files created by the **express** command. This file contains a list of additional modules that are required for this application. For this tutorial, we will be using the following additional modules:

* [azure] - provides access to Windows Azure features such as the Table service

* [node-uuid] - creates unique identifiers

* [async] - functions for asynchronous JavaScript

To add a requirement for additional modules used in this tutorial, perform the following steps:

1. Open the **package.json** file in a text editor.

2. Find the line that contains **"jade":** . Add a new line after it, which should contain the following:

		, "azure": ">= 0.5.3"
		, "node-uuid": ">= 1.3.3"
    	, "async": ">= 0.1.18"

	After this change, the file contents should appear similar to the following:

		{
	    "name": "application-name"
		  , "version": "0.0.1"
		  , "private": true
		  , "dependencies": {
		      "express": "2.5.8"
		    , "jade": ">= 0.0.1"
		    , "azure": ">= 0.5.3"
			, "node-uuid": ">= 1.3.3"
    		, "async": ">= 0.1.18"
		  }
		}

3. Save the **package.json** file.
	
4. From the command-line, change directories to the **tasklist** folder and enter the following to install the modules described in the **package.json** file:

        npm install

    The output of this command should appear as follows:

    ![npm installing express modules output][node-tableservice-express-npm-results]

##Using the Table service in a node application

In this section you will extend the basic application created by the **express** command by adding a **task.js** file which contains the model for your tasks. You will also modify the existing **app.js** and create a new **tasklist.js** file that uses the model.

### Create the model

1. In the **tasklist** directory, create a new directory named **models**.

2. In the **models** directory, create a new file named **task.js**. This file will contain the model for the tasks created by your application.

3. At the beginning of the **task.js** file, add the following code to reference required libraries:

        var azure = require('azure')
  		  , uuid = require('node-uuid');

4. Next, you will add code to define and export the Task object. This object is responsible for connecting to the table.

        module.exports = Task;

		function Task(storageClient, tableName, partitionKey) {
  		  this.storageClient = storageClient;
  		  this.tableName = tableName;
  		  this.partitionKey = partitionKey;
  
  		  this.storageClient.createTableIfNotExists(tableName, 
    		function tableCreated(err) {
      		  if(err) {
   		        throw error;
      		  }
    		});
		};

5. Next, add the following code to define additional methods on the Task object, which allow interactions with data stored in the table:

		Task.prototype = {
		  find: function(query, callback) {
		    self = this;
		    self.storageClient.queryEntities(query, 
		      function entitiesQueried(err, entities){
		        if(err) {
		          callback(err);
		        } else {
		          callback(null, entities);
		        }
		      });
		  },

		  addItem: function(item, callback) {
		    self = this;
		    item.RowKey = uuid();
		    item.PartitionKey = self.partitionKey;
		    item.completed = false;
		    self.storageClient.insertEntity(self.tableName, item, 
		      function entityInserted(error) {
		        if(error){  
		          callback(err);
		        }
		        callback(null);
		      });
		  },

		  updateItem: function(item, callback) {
		    self = this;
		    self.storageClient.queryEntity(self.tableName, self.partitionKey, item,
		      function entityQueried(err, entity) {
 		       if(err) {
		          callback(err);
		        }
		        entity.completed = true;
		        self.storageClient.updateEntity(self.tableName, entity,
		          function entityUpdated(err) {
		            if(err) {
		              callback(err);
		            }
		            callback(null);
		          });
		      });
		  }
		}

6. Save and close the **task.js** file.

###Create the controller

1. In the **tasklist/routes** directory, create a new file named **tasklist.js** and open it in a text editor.

2. Add the folowing code to **tasklist.js**. This loads the azure and async modules, which are used by **tasklist.js**. This also defines the **TaskList** function, which is passed an instance of the **Task** object we defined earlier:

		var azure = require('azure')
		  , async = require('async');

		module.exports = TaskList;

		function TaskList(task) {
		  this.task = task;
		}

2. Continue adding to the **tasklist.js** file by adding the methods used to **showTasks**, **addTask**, and **completeTasks**:

		TaskList.prototype = {
		  showTasks: function(req, res) {
		    self = this;
		    var query = azure.TableQuery
		      .select()
		      .from(self.task.tableName)
		      .where('completed eq ?', 'false');
		    self.task.find(query, function itemsFound(err, items) {
		      res.render('index',{title: 'My ToDo List ', tasks: items});
		    });
		  },

		  addTask: function(req,res) {
		    var self = this      
 		    var item = req.body.item;
		    self.task.addItem(item, function itemAdded(err) {
		      if(err) {
		        throw err;
		      }
		      res.redirect('home');
		    });
		  },
  
		  completeTask: function(req,res) {
		    var self = this;
		    var completedTasks = Object.keys(req.body);
		    async.forEach(completedTasks, function taskIterator(completedTask, callback){
		      self.task.updateItem(completedTask, function itemsUpdated(err){
		        if(err){
		          callback(err);
		        } else {
		          callback(null);
		        }
		      })
		    }, function(err){
		      if(err) {
		        throw err;
		      } else {
 		       res.redirect('home');
		      }
		    });
		  }
		}

3. Save the **tasklist.js** file.

### Modify app.js

1. In the **tasklist** directory, open the **app.js** file in a text editor. This file was created earlier by running the **express** command.

2. At the beginning of the file, add the following to load the azure module, set the table name, partitionKey, and set the storage credentials used by this example:

		var azure = require('azure');
		var tableName = 'tasks'
		  , partitionKey = 'partition'
		  , accountName = 'accountName'
		  , accountKey = 'accountKey';

	**Note**: You must replace the values **'accountName'** and **'accountKey'** with the values obtained earlier when creating your Windows Azure storage account.

3. Replace the content after the `//Routes` comment with the following code. This will initialize an instance of **Task** with a connection to your storage account. This is then passwed to the **TaskList**, which will use it to communicate with the Table service:

        var TaskList = require('./routes/tasklist');
		var Task = require('./models/tasks.js');
		var task = new Task(
		    azure.createTableService(accountName, accountKey)
		    , tableName
		    , partitionKey);
		var taskList = new TaskList(task);

		app.get('/', taskList.showTasks.bind(taskList));
		    app.post('/addtask', taskList.addTask.bind(taskList));
		    app.post('/completetask', taskList.completeTask.bind(taskList));

		app.listen(process.env.port || 1337);

4. Save the **app.js** file.

###Modify the index view

1. Change directories to the **views** directory and open the **index.jade** file in a text editor.

2. Replace the contents of the **index.jade** file with the code below. This defines the view for displaying existing tasks, as well as a form for adding new tasks and marking existing ones as completed.

		h1= title
		  font(color="grey") (powered by Node.js and Windows Azure Table Service)
		form(action="/completetask", method="post")
		  table(border="1")
		    tr
		      td Name
		      td Category
		      td Date
		      td Complete
		    each task in tasks
		      tr
		        td #{task.name}
		        td #{task.category}
		        - var day   = task.Timestamp.getDate();
		        - var month = task.Timestamp.getMonth() + 1;
		        - var year  = task.Timestamp.getFullYear();
		        td #{month + "/" + day + "/" + year}
 		       td
 		         input(type="checkbox", name="#{task.RowKey}", value="#{!task.itemCompleted}", checked=task.itemCompleted)
		  input(type="submit", value="Update tasks")
		hr
		form(action="/addtask", method="post")
		  table(border="1") 
		    tr
		      td Item Name: 
		      td 
		        input(name="item[name]", type="textbox")
		    tr
		      td Item Category: 
		      td 
		        input(name="item[category]", type="textbox")
		  input(type="submit", value="Add item")

3. Save and close **index.jade** file.

##Run your application locally

To test the application on your local machine, perform the following steps:

1. From the command-line, change directories to the **tasklist** directory.

2. Use the following command to launch the application locally:

        node app.js

3. Open a web browser and navigate to http://127.0.0.1:1337. This should display a web page similar to the following:

    ![A webpage displaying an empty tasklist][node-table-finished]

4. Use the provided fields for **Item Name** and **Item Category** to enter information, and then click **Add item**.

    ![An image of the add item field with populated values.][node-table-add-item]

5. The page should update to display the item in the ToDo List table.

    ![An image of the new item in the list of tasks][node-table-list-items]

6. To complete a task, simply check the checkbox in the Complete column, and then click **Update tasks**.

7. To stop the node process, go to the command-line and press the **CTRL** and **C** keys.

##Deploy your application to Windows Azure

In this section, you will install and use the Windows Azure command-line tools to create a new Windows Azure Website, and then use Git to deploy your application. To perform these steps you must have a Windows Azure subscription. If you do not already have a subscription, you can sign up for one [for free].

###Install the Cross-Platform Tools for Windows Azure

**TBD**: Revisit once we have a clearer idea of the install story.

To install the cross-platform tools, go to the [Windows Azure Developer Center] and select the download package for your operating system. If a package is not availble for your system, you can clone the project from the [azure-sdk-for-node] repository, and then install the tools by using `npm install /path/to/azure-sdk-for-node -g`. For more information, see [Cross-Platform Tools for Windows Azure].

###Import publishing settings

Before using the command-line tools with Windows Azure, you must first download a file containing information about your subscription. Perform the following steps to download and import this file.

1. From the command-line, change directories to the **tasklist** directory.

2. Enter the following command to launch the browser and navigate to the download page. If prompted, login with the account associated with your subscription.

		azure account download
	
	![The download page][download-publishing-settings]
	
	The file download should begin automatically; if it does not, you can click the link at the beginning of the page to manually download the file.

3. After the file download has completed, use the following command to import the settings:

		azure account import <path-to-file>
		
	Specify the path and file name of the publishing settings file you downloaded in the previous step. Once the command completes, you should see output similar to the following:
	
	![The output of the import command][import-publishing-settings]

4. Once the import has completed, you should delete the publish settings file as it is no longer needed and contains sensitive information regarding your Windows Azure subscription.

###Create a Windows Azure Website

1. From the command-line, change directories to the **tasklist** directory.

2. Use the following command to create a new Windows Azure Website

		azure site create --git
		
	You will be prompted for the website name and the datacenter that it will be located in. Provide a unique name and select the datacenter geographically close to your location.
	
	The `--git` parameter will create a Git repository on Windows Azure for this website. It will also initialize a Git repository in the current directory if none exists. It will also create a [Git remote] named 'azure', which will be used to publish the application to Windows Azure. Finally, it will create a **web.config** file, which contains settings used by Windows Azure to host node applications.
	
	**Note**: If this command is ran from a directory that already contains a Git repository, it will not re-initialize the directory.
	
	**Note**: If the `--git` parameter is omitted, yet the directory contains a Git repository, the 'azure' remote will still be created.
	
	Once this command has completed, you will see output similar to the following. Note that the line beginning with **Website created at** contains the URL for the website.
	
	![output of the site create command][cmd-line-site-create-git]

	**Note**: If this is the first Windows Azure Web Site for your subscription, you will be instructed to use the portal to create the website. For more information, see [Create and deploy a Node.js application to Windows Azure Web Sites].

###Publish the application

1. In the Terminal window, change directories to the **tasklist** directory if you are not already there.

2. Use the following commands to add, and then commit files to the local Git repository:

		git add .
		git commit -m "adding files"
		
	The output of these commands will be similar to the following:
	
	![output of git add. and git commit commands][git-add-commit]

3. When pushing the latest Git repository changes to the Windows Azure Website, you must specify that the target branch is **master** as this is used for the website content.

		git push azure master
	
	The output of this command will be similar to the following:
	
	![output of git push azure master][git-push-azure-master]

4. Once the push operation has completed, browse to the website URL returned previously by the `azure create site` command to view your application.

##Next steps

While the steps in this article describe using the Table Service to store information, you can also use MongoDB. See [Node.js Web Application with MongoDB] for more information.

##Additional resources

* [Cross-Platform Tools for Windows Azure]

* [Create and deploy a Node.js application to Windows Azure Web Sites]

* [Publishing to Windows Azure Web Sites with Git]


[node]: http://nodejs.org
[Git]: http://git-scm.com
[Express]: http://expressjs.com
[for free]: http://windowsazure.com
[Git remote]: http://gitref.org/remotes/
[azure-sdk-for-node]: https://github.com/WindowsAzure/azure-sdk-for-node
[Cross-Platform Tools for Windows Azure]: http://windowsazure.com
[Create and deploy a Node.js application to Windows Azure Web Sites]: http://windowsazure.com
[Publishing to Windows Azure Web Sites with Git]: http://windowsazure.com
[azure]: https://github.com/WindowsAzure/azure-sdk-for-node
[node-uuid]: https://github.com/broofa/node-uuid
[async]: https://github.com/caolan/async
[Windows Azure Portal]: http://windowsazure.com

[node-table-finished]: ../media/todo_list_empty.png
[node-table-npm-results]: ../media/npm_install_express_mongoose.png
[node-table-express-results]: ../media/express_output.png
[node-table-express-npm-results]: ../media/npm_install_after_express.png
[node-table-add-items]: ../media/todo_add_item.png
[node-table-list-items]: ../media/todo_list_items.png
[download-publishing-settings]: /media/downloadpublish.png
[cmd-line-site-create-git]: /media/cmd-line-site-create-git.png
[git-add-commit]: /media/git-add-commit.png
[git-push-azure-master]: /media/git-push-azure-master.png