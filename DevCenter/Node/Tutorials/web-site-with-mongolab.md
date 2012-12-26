<properties linkid="develop-nodejs-tutorials-web-site-with-mongodb-mongolab" urlDisplayName="Web site with MongoDB" pageTitle="Node.js web site with MongoDB on MongoLab - Windows Azure" metaKeywords="" metaDescription="Learn how to create a Node.js Windows Azure Web Site that connects to a MongoDB instance hosted on MongoLab." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />


<div chunk="../chunks/article-left-menu.md" />

# Node.js Web Application with Storage on MongoDB (MongoLab)
This tutorial shows you how to use [MongoDB] to store and access data from a [node] application hosted on Windows Azure. [MongoDB] is a popular open source, high performance NoSQL database. This tutorial assumes that you have some prior experience using node, MongoDB, and [Git].

You will learn:

* How to set up a free MongoDB instance on Windows Azure using MongoLab
* How to use npm (node package manager) to install the node modules
* How to access MongoDB from a node application
* How to use the Cross-Platform Tools for Windows Azure to create a Windows Azure Web Site

By following this tutorial, you will build a simple web-based task-management application that allows creating, retrieving and completing tasks. The tasks are stored in MongoDB.
 
The project files for this tutorial will be stored in a directory named **tasklist** and the completed application will look similar to the following:

![A web page displaying an empty tasklist][node-mongo-finished]

<div class="dev-callout">
<strong>Note</strong>
<p>This tutorial makes reference to the <strong>tasklist</strong> folder. The full path to this folder is omitted, as path semantics differ between operating systems. You should create this folder in a location that is easy for you to access on your local file system, such as <strong>~/node/tasklist</strong> or <strong>c:\node\tasklist</strong></p>
</div>

<div class="dev-callout">
<strong>Note</strong>
<p>Many of the steps below mention using the command-line. For these steps, use the command-line for your operating system, such as <strong>Windows PowerShell</strong> (Windows) or <strong>Bash</strong> (Unix Shell). On OS X systems you can access the command-line through the Terminal application.</p>
</div>

##Prerequisites

Before following the instructions in this article, you should ensure that you have the following installed:

* [node] recent version
* [Git]

<div chunk="../../Shared/Chunks/create-account-and-websites-note.md" />

##Preparation

In this section you will learn how to create a free MongoDB instance hosted in Windows Azure using MongoLab, set up your development environment, and install the MongoDB C# driver.

###Create a free MongoDB instance using MongoLabs

Visit [MongoLab] to create a free MongoDB instance hosted on Windows Azure.
![mongolab.com page showing creating a MongoDB database][mongolab-create]

After you have created a MongoDB instance in Windows Azure using MongoLab, note the connection information for your database.  You will need this information later in the tutorial.
![mongolab.com page showing connection information for database][mongolab-view]

##Install modules and generate scaffolding

In this section you will create a new Node application and use npm to add module packages. For the task-list application you will use the [Express] and [Mongoose] modules. The Express module provides a Model View Controller framework for node, while Mongoose is a driver for communicating with MongoDB.
###Install express and generate scaffolding

1. From the command-line, change directories to the **tasklist** directory. If the **tasklist** directory does not exist, create it.

2. Enter the following command to install express.

	sudo npm install express -g
 
	<div class="dev-callout">
	<strong>Note</strong>
	<p>When using the '-g' parameter on some operating systems, you may receive an error of <strong>Error: EPERM, chmod '/usr/local/bin/express'</strong> and a request to try running the account as an administrator. If this occurs, use the <strong>sudo</strong> command to run npm at a higher privilege level.</p>
	</div>

    The output of this command should appear similar to the following:

		express@2.5.9 /usr/local/lib/node_modules/express
		├── mime@1.2.4 
		├── mkdirp@0.3.0 
		├── qs@0.4.2 
		└── connect@1.8.7 
 
	<div class="dev-callout">
	<strong>Note</strong>
	<p>The '-g' parameter used when installing the express module installs it globally. This is done so that we can access the <strong>express</strong> command to generate web site scaffolding without having to type in additional path information.</p>
	</div>

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

    <div class="dev-callout">
	<strong>Note</strong>
	<p>You can safely ignore any message about installing the C++ bson parser.</p>
	</div>

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
    	  	res.redirect('/');
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
    		res.redirect('/');
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

		app.listen(process.env.port || 3000);

	<div class="dev-callout">
	<strong>Note</strong>
	<p>You must replace the connection string above with the connection string for the MongoDB server you created earlier. For example, <strong>mongodb://&lt;user&gt;:&lt;password&gt;@ds037087.mongolab.com:37087/tasks</strong>.</p>
	</div>

4. Save the **app.js** file.

###Modify the index view

1. Change directories to the **views** directory and open the **index.jade** file in a text editor.

2. Replace the contents of the **index.jade** file with the code below. This defines the view for displaying existing tasks, as well as a form for adding new tasks and marking existing ones as completed.

		h1= title
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

3. Open a web browser and navigate to http://localhost:3000. This should display a web page similar to the following:

    ![A webpage displaying an empty tasklist][node-mongo-finished]

4. Use the provided fields for **Item Name** and **Item Category** to enter information, and then click **Add item**.

    ![An image of the add item field with populated values.][node-mongo-add-item]

5. The page should update to display the item in the ToDo List table.

    ![An image of the new item in the list of tasks][node-mongo-list-items]

6. To complete a task, simply check the checkbox in the Complete column, and then click **Update tasks**. While there is no visual change after clicking **Update tasks**, the document entry in MongoDB has now been marked as completed.

7. To stop the node process, go to the command-line and press the **CTRL** and **C** keys.

##Deploy your application to Windows Azure

The steps in this section use the Windows Azure command-line tools to create a new Windows Azure Web Site, and then use Git to deploy your application. To perform these steps you must have a Windows Azure subscription.

<div class="dev-callout">
<strong>Note</strong>
<p>These steps can also be performed by using the Windows Azure portal. For steps on using the Windows Azure portal to deploy a Node.js application, see <a href="/en-us/develop/nodejs/tutorials/create-a-website-(mac)/">Create and deploy a Node.js application to a Windows Azure Web Site</a>.</p>
</div>

<div class="dev-callout">
<strong>Note</strong>
<p>If this is the first Windows Azure Web Site you have created, you must use the Windows Azure portal to deploy this application.</p>
</div>

###Install the Windows Azure command-line tool for Mac and Linux

To install the command-line tools, use the following command:
	
	sudo npm install azure-cli -g

<div class="dev-callout">
<strong>Note</strong>
<p>If you have already installed the <strong>Windows Azure SDK for Node.js</strong> from the <a href="/en-us/develop/nodejs/">Windows Azure Developer Center</a>, then the command-line tools should already be installed. For more information, see <a href="/en-us/develop/nodejs/how-to-guides/command-line-tools/">Windows Azure command-line tool for Mac and Linux</a>.</p>
</div>

<div class="dev-callout">
<strong>Note</strong>
<p>While the command-line tools were created primarily for Mac and Linux users, they are based on Node.js and should work on any system capable of running Node.</p>
</div>

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
	
	The `--git` parameter will create a Git repository locally in the **tasklist** folder if none exists. It will also create a [Git remote] named 'azure', which will be used to publish the application to Windows Azure. It will create an [iisnode.yml], which contains settings used by Windows Azure to host node applications. Finally it will also create a .gitignore file to exclude the node-modules folder for being published to .git.
	
	<div class="dev-callout">
	<strong>Note</strong>
	<p>If this command is ran from a directory that already contains a Git repository, it will not re-initialize the directory.</p>
	</div>
	
	<div class="dev-callout">
	<strong>Note</strong>
	<p>If the '--git' parameter is omitted, yet the directory contains a Git repository, the 'azure' remote will still be created.</p>
	</div>
	
	Once this command has completed, you will see output similar to the following. Note that the line beginning with **Created web site at** contains the URL for the web site.

		info:   Executing command site create
		info:   Using location southcentraluswebspace
		info:   Executing `git init`
		info:   Creating default web.config file
		info:   Creating a new web site
		info:   Created web site at  mongodbtasklist.azurewebsites.net
		info:   Initializing repository
		info:   Repository initialized
		info:   Executing `git remote add azure http://username@mongodbtasklist.azurewebsites.net/mongodbtasklist.git`
		info:   site create command OK

	<div class="dev-callout">
	<strong>Note</strong>
	<p>If this is the first Windows Azure Web Site for your subscription, you will be instructed to use the portal to create the web site. For more information, see <a href="/en-us/develop/nodejs/tutorials/create-a-website-(mac)/">Create and deploy a Node.js application to Windows Azure Web Sites</a>.</p>
	</div>

###Publish the application

1. In the Terminal window, change directories to the **tasklist** directory if you are not already there.

2. Use the following commands to add, and then commit files to the local Git repository:

		git add .
		git commit -m "adding files"

3. When pushing the latest Git repository changes to the Windows Azure Web Site, you must specify that the target branch is **master** as this is used for the web site content.

		git push azure master
	
	You will see output similar to the following. As the deployment takes place Windows Azure will download all npm modules. 

		Counting objects: 17, done.
		Delta compression using up to 8 threads.
		Compressing objects: 100% (13/13), done.
		Writing objects: 100% (17/17), 3.21 KiB, done.
		Total 17 (delta 0), reused 0 (delta 0)
		remote: New deployment received.
		remote: Updating branch 'master'.
		remote: Preparing deployment for commit id 'ef276f3042'.
		remote: Preparing files for deployment.
		remote: Running NPM.
		...
		remote: Deploying Web.config to enable Node.js activation.
		remote: Deployment successful.
		To https://username@mongodbtasklist.azurewebsites.net/MongoDBTasklist.git
 		 * [new branch]      master -> master
 
4. Once the push operation has completed, browse to the web site by using the `azure site browse` command to view your application.

##Next steps

The steps in this article describe using MongoLab to host a MongoDB instance on Windows Azure to store information, you can also use the Windows Azure Virtual Machines to host a MongoDB instance. See [Node.js Web Application with Storage on MongoDB (Virtual Machine)] for more information.

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
[Git remote]: http://git-scm.com/docs/git-remote
[azure-sdk-for-node]: https://github.com/WindowsAzure/azure-sdk-for-node
[iisnode.yml]: https://github.com/WindowsAzure/iisnode/blob/master/src/samples/configuration/iisnode.yml
[Windows Azure command-line tool for Mac and Linux]: /en-us/develop/nodejs/how-to-guides/command-line-tools/
[Windows Azure Developer Center]: /en-us/develop/nodejs/
[Create and deploy a Node.js application to Windows Azure Web Sites]: /en-us/develop/nodejs/tutorials/create-a-website-(mac)/
[Publishing to Windows Azure Web Sites with Git]: /en-us/develop/nodejs/common-tasks/publishing-with-git/
[MongoLab]: http://mongolab.com
[Node.js Web Application with Storage on MongoDB (Virtual Machine)]: /en-us/develop/nodejs/tutorials/website-with-mongodb-(mac)/
[node-mongo-finished]: ../media/todo_list_empty.png
[node-mongo-express-results]: ../media/express_output.png
[node-mongo-add-item]: ../media/todo_add_item.png
[node-mongo-list-items]: ../media/todo_list_items.png
[download-publishing-settings]: ../../Shared/Media/azure-account-download-cli.png
[import-publishing-settings]: ../media/azureimport.png
[mongolab-create]: ../media/mongolab-create.png
[mongolab-view]: ../media/mongolab-view.png
