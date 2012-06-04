<properties linkid="dev-nodejs-website-mongodb" urldisplayname="Node.js Website with MongoDB" headerexpose="" pagetitle="Node.js Application using MongoDB" metakeywords="Azure Node.js tutorial MongoDB, Azure Node.js, Azure Node.js tutorial" footerexpose="" metadescription="A tutorial that demonstrates a Node.js application in a Windows Azure Website, that talks to MongoDB on a Windows Azure virtual machine" umbraconavihide="0" disquscomments="1"></properties>

<div class="dev-center-os-selector"><a href="/en-us/develop/nodejs/tutorials/web-app-with-mongodb/" title="Windows Version" class="windows">Windows</a> <a href="/en-us/develop/nodejs/tutorials/website-with-mongodb-(mac)/" title="Mac Version" class="mac current">Mac</a> <span>Tutorial</span></div>

# Node.js Web Application with Storage on MongoDB

This tutorial shows you how to use [MongoDB] to store and access data from a [node] application hosted on Windows Azure. This tutorial assumes that you have some prior experience using node, MongoDB, and [Git].

This guide also assumes that you have access to a MongoDB server, such as the one created by following the steps in the [Installing MongoDB on a Linux Virtual machine] article.

You will learn:

* How to use npm (node package manager) to install the node modules

* How to access MongoDB from a node application

* How to use the Cross-Platform Tools for Windows Azure to create a Windows Azure Web Site

By following this tutorial, you will build a simple web-based task-management application that allows creating, retrieving and completing tasks. The tasks are stored in MongoDB.
 
The project files for this tutorial will be stored in a directory named **tasklist** and the completed application will look similar to the following:

![A web page displaying an empty tasklist][node-mongo-finished]

**Note**: This tutorial makes reference to the **tasklist** folder. The full path to this folder is omitted, as path semantics differ between operating systems. You should create this folder in a location that is easy for you to access on your local file system, such as **~/node/tasklist** or **c:\node\tasklist**

**Note**: Many of the steps below mention using the command-line. For these steps, use the command-line for your operating system, such as **Windows PowerShell** (Windows) or **Bash** (Unix Shell). On OS X systems you can access the command-line through the Terminal application.

##Prerequisites

Before following the instructions in this article, you should ensure that you have the following installed:

* [node] version 0.6.14 or higher

* [Git]

* A [MongoDB] server

* A text editor

* A web browser

##Install modules and generate scaffolding

In this section you will create a new Node application and use npm to add module packages. For the task-list application you will use the [Express] and [Mongoose] modules. The Express module provides a Model View Controller framework for node, while Mongoose is a driver for communicating with MongoDB.

###Install express and generate scaffolding

1. From the command-line, change directories to the **tasklist** directory. If the **tasklist** directory does not exist, create it.

2. Enter the following command to install express.

		npm install express -g

	**Note**: When using the '-g' parameter on some operating systems, you may receive an error of **Error: EPERM, chmod '/usr/local/bin/express'** and a request to try running the account as an administrator. If this occurs, use the [sudo] command to run npm at a higher privilege level.

    The output of this command should appear similar to the following:

		express@2.5.9 /usr/local/lib/node_modules/express
		├── mime@1.2.4
		├── mkdirp@0.3.0
		├── qs@0.4.2
		└── connect@1.8.7

	**Note**: The '-g' parameter used when installing the express module installs it globally. This is done so that we can access the **express** command to generate web site scaffolding without having to type in additional path information.

4. To create the scaffolding which will be used for this application, use the **express** command:

        	express

	The output of this command should appear similar to the following:

		create : .
   		create : ./package.json
   		create : ./app.js
   		create : ./public
   		create : ./public/javascripts
   		create : ./public/images
   		create : ./public/stylesheets
   		create : ./public/stylesheets/style.css
   		create : ./routes
   		create : ./routes/index.js
   		create : ./views
   		create : ./views/layout.jade
   		create : ./views/index.jade
		
   		dont forget to install dependencies:
   		$ cd . && npm install

	After this command completes, you should have several new directories and files in the **tasklist** directory.

###Install additional modules

The **package.json** file is one of the files created by the **express** command. This file contains a list of additional modules that are required for an Express application. Later, when you deploy this application to a Windows Azure Web Site, this file will be used to determine which modules need to be installed on Windows Azure to support your application.
	
1. From the command-line, change directories to the **tasklist** folder and enter the following to install the modules described in the **package.json** file:

        npm install

    The output of this command should appear similar to the following:

		express@2.5.8 ./node_modules/express
		├── mime@1.2.4
		├── qs@0.4.2
		├── mkdirp@0.3.0
		└── connect@1.8.7
		jade@0.26.0 ./node_modules/jade
		├── commander@0.5.2
		└── mkdirp@0.3.0

	This installs all of the default modules that Express needs.

2. Next, enter the following command to install the Mongoose module locally as well as to save an entry for it to the **package.json** file:

		npm install mongoose --save

	The output of this command should appear similar to the following:

		mongoose@2.6.5 ./node_modules/mongoose
		├── hooks@0.2.1
		└── mongodb@1.0.2

    **Note**: You can safely ignore any message about installing the C++ bson parser.

##Using MongoDB in a node application

In this section you will extend the basic application created by the **express** command by adding a **task.js** file which contains the model for your tasks. You will also modify the existing **app.js** and create a new **tasklist.js** controller file to make use of the model.

### Create the model

1. In the **tasklist** directory, create a new directory named **models**.

2. In the **models** directory, create a new file named **task.js**. This file will contain the model for the tasks created by your application.

3. At the beginning of the **task.js** file, add the following code to reference required libraries:

        var mongoose = require('mongoose')
	      , Schema = mongoose.Schema;

4. Next, you will add code to define and export the model. This model will be used to perform interactions with the MongoDB database.

        var TaskSchema = new Schema({
	        itemName      : String
	      , itemCategory  : String
	      , itemCompleted : { type: Boolean, default: false }
	      , itemDate      : { type: Date, default: Date.now }
        });

        module.exports = mongoose.model('TaskModel', TaskSchema)

5. Save and close the **task.js** file.

###Create the controller

1. In the **tasklist/routes** directory, create a new file named **tasklist.js** and open it in a text editor.

2. Add the folowing code to **tasklist.js**. This loads the mongoose module and the task model defined in **task.js**. The TaskList function is used to create the connection to the MongoDB server based on the **connection** value:

		var mongoose = require('mongoose')
	      , task = require('../models/task.js');

		module.exports = TaskList;

		function TaskList(connection) {
  		  mongoose.connect(connection);
		}

2. Continue adding to the **tasklist.js** file by adding the methods used to **showTasks**, **addTask**, and **completeTasks**:

		TaskList.prototype = {
  		  showTasks: function(req, res) {
      	    task.find({itemCompleted: false}, function foundTasks(err, items) {
      		  res.render('index',{title: 'My ToDo List ', tasks: items})
    		});
  		  },

  		  addTask: function(req,res) {
    		var item = req.body.item;
    		newTask = new task();
    		newTask.itemName = item.name;
    		newTask.itemCategory = item.category;
    		newTask.save(function savedTask(err){
      		  if(err) {
      		    throw err;
      		  }
    	    });
    	  	res.redirect('home');
  		  },
  

  		  completeTask: function(req,res) {
    		var completedTasks = req.body;
    		for(taskId in completedTasks) {
      		  if(completedTasks[taskId]=='true') {
        		var conditions = { _id: taskId };
        		var updates = { itemCompleted: completedTasks[taskId] };
        		task.update(conditions, updates, function updatedTask(err) {
          		  if(err) {
          		    throw err;
          		  }
        		});
      		  }
    		}
    		res.redirect('home');
  		  }
		}

3. Save the **tasklist.js** file.

### Modify app.js

1. In the **tasklist** directory, open the **app.js** file in a text editor. This file was created earlier by running the **express** command.

2. Replace the content after the `//Routes` comment with the following code. This will initialize **TaskList** with the connection string for the MongoDB server and add the  functions defined in **tasklist.js** as routes:

        var TaskList = require('./routes/tasklist');
		var taskList = new TaskList('mongodb://mongodbserver/tasks');

    	app.get('/', taskList.showTasks.bind(taskList));
    	app.post('/addtask', taskList.addTask.bind(taskList));
    	app.post('/completetask', taskList.completeTask.bind(taskList));

		app.listen(process.env.port || 1337);

	**Note**: You must replace the connection string above with the connection string for your MongoDB server. For example, **'mongodb://127.0.0.1/tasks**.

4. Save the **app.js** file.

###Modify the index view

1. Change directories to the **views** directory and open the **index.jade** file in a text editor.

2. Replace the contents of the **index.jade** file with the code below. This defines the view for displaying existing tasks, as well as a form for adding new tasks and marking existing ones as completed.

		h1= title
		  font(color="grey") (powered by Node.js and MongoDB)
		form(action="/completetask", method="post")
		  table(border="1")
		    tr
		      td Name
		      td Category
		      td Date
		      td Complete
		    each task in tasks
		      tr
		        td #{task.itemName}
		        td #{task.itemCategory}
		        - var day   = task.itemDate.getDate();
		        - var month = task.itemDate.getMonth() + 1;
		        - var year  = task.itemDate.getFullYear();
		        td #{month + "/" + day + "/" + year}
		        td
		          input(type="checkbox", name="#{task._id}", value="#{!task.itemCompleted}", checked=task.itemCompleted)
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

    ![A webpage displaying an empty tasklist][node-mongo-finished]

4. Use the provided fields for **Item Name** and **Item Category** to enter information, and then click **Add item**.

    ![An image of the add item field with populated values.][node-mongo-add-item]

5. The page should update to display the item in the ToDo List table.

    ![An image of the new item in the list of tasks][node-mongo-list-items]

6. To complete a task, simply check the checkbox in the Complete column, and then click **Update tasks**. While there is no visual change after clicking **Update tasks**, the document entry in MongoDB has now been marked as completed.

7. To stop the node process, go to the command-line and press the **CTRL** and **C** keys.

##Deploy your application to Windows Azure

The steps in this section use the Windows Azure command-line tools to create a new Windows Azure Web Site, and then use Git to deploy your application. To perform these steps you must have a Windows Azure subscription.

**Note**: These steps can also be performed by using the Windows Azure portal. For steps on using the Windows Azure portal to deploy a Node.js application, see [Create and deploy a Node.js application to a Windows Azure Web Site].

**Note**: If this is the first Windows Azure Web Site you have created, you must use the Windows Azure portal to deploy this application.

###Enable the Windows Azure Web Site feature

If you do not already have a Windows Azure subscription, you can sign up [for free]. After signing up, follow these steps to enable the Windows Azure Web Site feature.

<div chunk="../../Shared/Chunks/antares-iaas-signup.md"></div>

###Install the Windows Azure command-line tool for Mac and Linux

To install the command-line tools, use the following command:
	
	npm install azure -g

**Note**: If you have already installed the **Windows Azure SDK for Node.js** from the [Windows Azure Developer Center], then the command-line tools should already be installed. For more information, see [Windows Azure command-line tool for Mac and Linux].

**Note**: While the command-line tools were created primarily for Mac and Linux users, they are based on Node.js and should work on any system capable of running Node.

###Import publishing settings

Before using the command-line tools with Windows Azure, you must first download a file containing information about your subscription. Perform the following steps to download and import this file.

1. From the command-line, enter the following command to launch the browser and navigate to the download page. If prompted, login with the account associated with your subscription.

		azure account download
	
	![The download page][download-publishing-settings]
	
	The file download should begin automatically; if it does not, you can click the link at the beginning of the page to manually download the file.

3. After the file download has completed, use the following command to import the settings:

		azure account import <path-to-file>
		
	Specify the path and file name of the publishing settings file you downloaded in the previous step. Once the command completes, you should see output similar to the following:
	
		info:   Executing command account import
		info:   Found subscription: subscriptionname
		info:   Setting default subscription to: subscriptionname
		warn:   The '/Users/user1/.azure/publishSettings.xml' file contains sensitive information.
		warn:   Remember to delete it now that it has been imported.
		info:   Account publish settings imported successfully
		info:   account iomport command OK


4. Once the import has completed, you should delete the publish settings file as it is no longer needed and contains sensitive information regarding your Windows Azure subscription.

###Create a Windows Azure Web Site

1. From the command-line, change directories to the **tasklist** directory.

2. Use the following command to create a new Windows Azure Web Site. Replace 'myuniquesitename' with a unique site name for your web site. This value is used as part of the URL for the resulting web site.

		azure site create myuniquesitename --git
		
	You will be prompted for the datacenter that the site will be located in. Select the datacenter geographically close to your location.
	
	The `--git` parameter will create a Git repository locally in the **tasklist** folder if none exists. It will also create a [Git remote] named 'azure', which will be used to publish the application to Windows Azure. Finally, it will create a **web.config** file, which contains settings used by Windows Azure to host node applications.
	
	**Note**: If this command is ran from a directory that already contains a Git repository, it will not re-initialize the directory.
	
	**Note**: If the `--git` parameter is omitted, yet the directory contains a Git repository, the 'azure' remote will still be created.
	
	Once this command has completed, you will see output similar to the following. Note that the line beginning with **Created website at** contains the URL for the web site.

		info:   Executing command site create
		info:   Using location southcentraluswebspace
		info:   Executing `git init`
		info:   Creating default web.config file
		info:   Creating a new web site
		info:   Created website at  mongodbtasklist.azurewebsites.net
		info:   Initializing repository
		info:   Repository initialized
		info:   Executing `git remote add azure http://username@mongodbtasklist.azurewebsites.net/mongodbtasklist.git`
		info:   site create command OK

	**Note**: If this is the first Windows Azure Web Site for your subscription, you will be instructed to use the portal to create the web site. For more information, see [Create and deploy a Node.js application to Windows Azure Web Sites].

###Publish the application

1. In the Terminal window, change directories to the **tasklist** directory if you are not already there.

2. Use the following commands to add, and then commit files to the local Git repository:

		git add .
		git commit -m "adding files"

3. When pushing the latest Git repository changes to the Windows Azure Web Site, you must specify that the target branch is **master** as this is used for the web site content.

		git push azure master
	
	At the end of the deployment, you should see a statement similar to the following:
	
		To https://username@mongodbtasklist.azurewebsites.net/MongoDBTasklist.git
 		 * [new branch]      master -> master
 
4. Once the push operation has completed, browse to the web site URL returned previously by the `azure create site` command to view your application.

##Next steps

While the steps in this article describe using MongoDB to store information, you can also use the Windows Azure Table Service. See [Node.js Web Application with the Windows Azure Table Service] for more information.

##Additional resources

[Windows Azure command-line tool for Mac and Linux]    
[Create and deploy a Node.js application to Windows Azure Web Sites]    
[Publishing to Windows Azure Web Sites with Git]    


[node]: http://nodejs.org
[MongoDB]: http://www.mongodb.org
[Git]: http://git-scm.com
[Express]: http://expressjs.com
[Mongoose]: http://mongoosejs.com
[for free]: /en-us/pricing/free-trial
[Git remote]: http://gitref.org/remotes/
[azure-sdk-for-node]: https://github.com/WindowsAzure/azure-sdk-for-node
[Windows Azure command-line tool for Mac and Linux]: /en-us/develop/nodejs/how-to-guides/command-line-tools/
[Windows Azure Developer Center]: /en-us/develop/nodejs/
[Create and deploy a Node.js application to Windows Azure Web Sites]: /en-us/develop/nodejs/tutorials/create-a-website-(mac)/
[Publishing to Windows Azure Web Sites with Git]: /en-us/develop/nodejs/common-tasks/publishing-with-git/
[Installing MongoDB on a Linux Virtual machine]: /en-us/manage/linux/common-tasks/mongodb-virtual-machine/
[Node.js Web Application with the Windows Azure Table Service]: /en-us/develop/nodejs/tutorials/website-with-storage/



[node-mongo-finished]: ../media/todo_list_empty.png
[node-mongo-express-results]: ../media/express_output.png
[node-mongo-add-item]: ../media/todo_add_item.png
[node-mongo-list-items]: ../media/todo_list_items.png
[download-publishing-settings]: ../../Shared/Media/azure-account-download.png
[import-publishing-settings]: ../media/azureimport.png