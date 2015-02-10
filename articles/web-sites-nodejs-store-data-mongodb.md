<properties 
	pageTitle="Node.js website with MongoDB on a VM - Azure tutorial" 
	description="A tutorial that teaches you how to use MongoDB to store and access data from a Node application hosted on Azure." 
	services="web-sites, virtual-machines" 
	documentationCenter="nodejs" 
	authors="blackmist" 
	writer="" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="web-sites" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="nodejs" 
	ms.topic="article" 
	ms.date="09/17/2014" 
	ms.author="larryfr"/>


# Create a Node.js Application on Azure with MongoDB in a Virtual Machine

This tutorial shows you how to use [MongoDB] hosted on an Azure Virtual Machine to store data, and access the data from a [node] application hosted in an Azure Website. [MongoDB] is a popular open source, high performance NoSQL database.

You will learn:

* How to set up a virtual machine running Ubuntu and MongoDB from the VM Depot.
* How to access MongoDB from a node application
* How to use the Cross-Platform Tools for Azure to create an Azure Website

By following this tutorial, you will build a simple web-based task-management application that allows creating, retrieving and completing tasks. The tasks are stored in MongoDB.

> [AZURE.NOTE] This tutorial uses an instance of MongoDB installed on a virtual machine. If you would rather use a hosted MongoDB instance provided  by MongoLabs, see <a href="/en-us/develop/nodejs/tutorials/website-with-mongodb-mongolab/">Create a Node.js Application on Azure with MongoDB using the MongoLab Add-On</a>.
 
The project files for this tutorial will be stored in a directory named **tasklist** and the completed application will look similar to the following:

![A web page displaying an empty tasklist][node-mongo-finished]

> [AZURE.NOTE] Many of the steps below mention using the command-line. For these steps, use the command-line for your operating system, such as __Windows PowerShell__ (Windows) or __Bash__ (Unix Shell). On OS X systems you can access the command-line through the Terminal application.

##Prerequisites

The steps in this tutorial use Node.js must have a recent version of [Node.js][node] in your development environment.

Additionally, the [Git] must be available from the command-line in your development environment, as this is used to deploy the application to an Azure Website.

[AZURE.INCLUDE [create-account-and-websites-note](../includes/create-account-and-websites-note.md)]

##Create a virtual machine

<!--This tutorial assumes you have created a virtual machine in Azure. After creating the virtual machine you need to install MongoDB on the virtual machine:

* To create a Linux virtual machine and install MongoDB, see [Installing MongoDB on a Linux Virtual machine].

After you have created the virtual machine in Azure and installed MongoDB, be sure to remember the DNS name of the virtual machine ("testlinuxvm.cloudapp.net", for example) and the external port for MongoDB that you specified in the endpoint.  You will need this information later in the tutorial.-->

While it is possible to create a new VM, and then install MongoDB into it following the [MongoDB installation guides][installguides], most of this work has already been performed by the community, and is available in the VM Depot. The following steps demonstrate how to use an image from VM Depot that already has Mongo DB installed and configured. 

> [AZURE.NOTE] The community image used by this tutorial stores MongoDB data on the OS disk. While this is sufficient for tutorial purposes, storing MongoDB data on a data disk will provide greater performance. For steps on creating a new VM, including a data disk, and storing MongoDB data on the data disk, see [Install MongoDB on Linux on Azure][mongodbonazure].

1. Log in to the [Azure Management portal][azureportal], select __Virtual Machines__, select __Images__, and then select __VM Depot__.

	![screenshot of selecting VM Depot][selectdepo]

2. Select an image that includes MongoDB. In this case, I selected Ubuntu to narrow the list to only images based on the Ubuntu Linux distribution. Finally, I selected the MongoDB v2.2.3 on Hardened Ubuntu image.

	![screenshot of selected mongodb v2.2.3 on hardened ubuntu image][selectedimage]

	> [AZURE.NOTE] Be sure to select __More__ to see all information about the image. Some images may have additional configuration that is required after you have created a VM using the image.

	Click the arrow at the bottom to proceed to the next screen.

3. Select the region and storage account that will be used to store the VHD for this image. Click the check mark to continue.
	
	![screenshot of choose a storage account][selectstorage]

	> [AZURE.NOTE] This will start a copy process that copies the image from the VM Depot to the specified storage account. This can take quite a bit of time, 15 minutes or longer.

4. Once the status for the image changes to __Pending registration__, select __Register__ and enter a friendly name for the new image. Click the check mark to continue.

	![screenshot of registering an image][register]

5. Once the status for the image changes to __Available__, select __+ New__, __Virtual Machine__, __From Gallery__. When asked to __Choose an Image__, select __My Images__, and then the image created in previous steps. Click the arrow to continue.

	![screenshot of the image][myimage]

6. Provide the name of the VM, size, user name. Click the arrow to continue.

	![screenshot of the vm name, user name, etc.][vmname]

	>[AZURE.NOTE] For this tutorial, you will not need to use SSH to remotely connect to your VM. Select **Use a password** and provide a password if you are not familiar with using a certificate with SSH.
	>
	> For more information on using SSH with a Linux VM on Azure, see [How to use SSH with Linux on Azure][sshazure].

7. Select whether to use a new or existing Cloud Service, and the region that the VM will be created in. Click the arrow to continue.

	![screenshot of the vm configuration][vmconfig]

8. Set additional endpoints for the VM. Since we will be accessing MongoDB on this VM, add a new endpoint using the following information:

	* Name - MongoDB
	* Protocol - TCP
	* Public port - 27017
	* private port - 27017

	To expose the MongoDB web portal, add another endpoint using the following information:

	* Name - MongoDBWeb
	* Protocol - TCP
	* Public port - 28017
	* Private port - 28017
	
	Finally, select the check mark to configure the virtual machine.

	![screenshot of the endpoint configuration][vmendpoint]

9. Once the virtual machine status has changed to __Running__, you should be able to open a web browser to __http://&lt;YourVMDNSName&gt;.cloudapp.net:28017/__ to verify that MongoDB is running. At the bottom of the page should be a log that displays information about the service, similar to the following:

		Fri Mar  7 18:57:16 [initandlisten] MongoDB starting : pid=1019 port=27017 dbpath=/var/lib/mongodb 64-bit host=localhost.localdomain
           18:57:16 [initandlisten] db version v2.2.3, pdfile version 4.5
           18:57:16 [initandlisten] git version: f570771a5d8a3846eb7586eaffcf4c2f4a96bf08
           18:57:16 [initandlisten] build info: Linux ip-10-2-29-40 2.6.21.7-2.ec2.v1.2.fc8xen #1 SMP Fri Nov 20 17:48:28 EST 2009 x86_64 BOOST_LIB_VERSION=1_49
           18:57:16 [initandlisten] options: { config: "/etc/mongodb.conf", dbpath: "/var/lib/mongodb", logappend: "true", logpath: "/var/log/mongodb/mongodb.log" }
           18:57:16 [initandlisten] journal dir=/var/lib/mongodb/journal
           18:57:16 [initandlisten] recover : no journal files present, no recovery needed
           18:57:17 [initandlisten] waiting for connections on port 27017

	If the log displays errors, please consult the [MongoDB documentation][mongodocs] for troubleshooting steps.


##Install modules and generate scaffolding

In this section you will create a new Node application on your development environment and use npm to add module packages. For the task-list application you will use the [Express] and [Mongoose] modules. The Express module provides a Model View Controller framework for node, while Mongoose is a driver for communicating with MongoDB.

###Install express and generate scaffolding

1. From the command-line, change directories to the **tasklist** directory. If the **tasklist** directory does not exist, create it.

	> [AZURE.NOTE] This tutorial makes reference to the __tasklist__ folder. The full path to this folder is omitted, as path semantics differ between operating systems. You should create this folder in a location that is easy for you to access on your local file system, such as __~/node/tasklist__ or __c:\node\tasklist__

2. Enter the following command to install the express command.

	npm install express-generator -g
 
	> [AZURE.NOTE] When using the '-g' parameter on some operating systems, you may receive an error of ___Error: EPERM, chmod '/usr/local/bin/express'___ and a request to try running the account as an administrator. If this occurs, use the `sudo` command to run npm at a higher privilege level.

    The output of this command should appear similar to the following:

		express-generator@4.0.0 C:\Users\username\AppData\Roaming\npm\node_modules\express-generator
		├── mkdirp@0.3.5
		└── commander@1.3.2 (keypress@0.1.0)                                                                         
 
	> [AZURE.NOTE] The '-g' parameter used when installing the express module installs it globally. This is done so that we can access the ___express___ command to generate website scaffolding without having to type in additional path information.

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

3. Copy the **tasklist/bin/www** file to a file named **server.js** in the **tasklist** folder. Azure Websites expects the entry point for a Node.js application to be either **server.js** or **app.js**. Since **app.js** already exists, but is not the entry point, we must use **server.js**.

4. Modify the **server.js** file to remove one of the '.' characters from the following line.

		var app = require('../app');

	The modified line should appear as follows.

		var app = require('./app');

	This is required as the **server.js** (formerly **bin/www**,) is now in the same folder as the required **app.js** file.

###Install additional modules

The **package.json** file is one of the files created by the **express** command. This file contains a list of additional modules that are required for an Express application. Later, when you deploy this application to an Azure Website, this file will be used to determine which modules need to be installed on Azure to support your application.
	
1. From the **tasklist** folder, use the following to install the modules described in the **package.json** file:

        npm install

    The output of this command should appear similar to the following:

		debug@0.7.4 node_modules\debug
		
		cookie-parser@1.0.1 node_modules\cookie-parser
		├── cookie-signature@1.0.3
		└── cookie@0.1.0
		
		morgan@1.0.0 node_modules\morgan
		└── bytes@0.2.1
		
		body-parser@1.0.2 node_modules\body-parser
		├── qs@0.6.6
		├── raw-body@1.1.4 (bytes@0.3.0)
		└── type-is@1.1.0 (mime@1.2.11)
		
		express@4.0.0 node_modules\express
		├── methods@0.1.0
		├── parseurl@1.0.1
		├── merge-descriptors@0.0.2
		├── utils-merge@1.0.0
		├── escape-html@1.0.1
		├── cookie-signature@1.0.3
		├── fresh@0.2.2
		├── range-parser@1.0.0
		├── buffer-crc32@0.2.1
		├── qs@0.6.6
		├── cookie@0.1.0
		├── path-to-regexp@0.1.2
		├── send@0.2.0 (mime@1.2.11)
		├── type-is@1.0.0 (mime@1.2.11)
		├── accepts@1.0.0 (negotiator@0.3.0, mime@1.2.11)
		└── serve-static@1.0.1 (send@0.1.4)
		
		jade@1.3.1 node_modules\jade
		├── character-parser@1.2.0
		├── commander@2.1.0
		├── mkdirp@0.3.5
		├── monocle@1.1.51 (readdirp@0.2.5)
		├── constantinople@2.0.0 (uglify-js@2.4.13)
		├── with@3.0.0 (uglify-js@2.4.13)
		└── transformers@2.1.0 (promise@2.0.0, css@1.0.8, uglify-js@2.2.5)                                                                

	This installs all of the default modules used by an Express application.

2. Next, enter the following command to install the Mongoose module locally as well as to save an entry for it to the **package.json** file:

		npm install mongoose --save

	The output of this command should appear similar to the following:

		mongoose@3.8.8 node_modules\mongoose
		├── regexp-clone@0.0.1
		├── sliced@0.0.5
		├── muri@0.3.1
		├── hooks@0.2.1
		├── mpath@0.1.1
		├── mpromise@0.4.3
		├── ms@0.1.0
		├── mquery@0.5.3
		└── mongodb@1.3.23 (kerberos@0.0.3, bson@0.2.5)         

    > [AZURE.NOTE] You can safely ignore any message about installing the C++ bson parser.

##Using MongoDB in a node application

In this section you will extend the basic application created by the **express** command by adding a **task.js** file which contains the model for your tasks. You will also modify the existing **app.js** and create a new **tasklist.js** controller file to make use of the model.

### Create the model

1. In the **tasklist** directory, create a new directory named **models**.

2. In the **models** directory, create a new file named **task.js**. This file will contain the model for the tasks created by your application.

3. At the beginning of the **task.js** file, add the following code to reference required libraries:

        var mongoose = require('mongoose'),
	        Schema = mongoose.Schema;

4. Next, you will add code to define and export the model. This model will be used to perform interactions with the MongoDB database.

        var TaskSchema = new Schema({
	        itemName      : String,
	        itemCategory  : String,
	        itemCompleted : { type: Boolean, default: false },
	        itemDate      : { type: Date, default: Date.now }
        });

        module.exports = mongoose.model('TaskModel', TaskSchema);

5. Save and close the **task.js** file.

###Create the controller

1. In the **tasklist/routes** directory, create a new file named **tasklist.js** and open it in a text editor.

2. Add the folowing code to **tasklist.js**. This loads the mongoose module and the task model defined in **task.js**. The TaskList function is used to create the connection to the MongoDB server based on the **connection** value:

		var mongoose = require('mongoose'),
	        task = require('../models/task.js');

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

2. Add the following code to the beginning of the **app.js** file. This will initialize the **TaskList** with the connection string for the MongoDB server:

        var TaskList = require('./routes/tasklist');
		var taskList = new TaskList(process.env.MONGODB_URI);

	Note the second line; you access an environment variable that you'll configure later, which contains the connection information for your mongo instance. If you have a local mongo instance running for development purposes, you may want to temporarily set this value to "localhost" instead of process.env.MONGODB_URI.

3. Find the following lines:

		app.use('/', routes);
		app.use('/users', users);

	Replace the above two lines with the following:

    	app.get('/', taskList.showTasks.bind(taskList));
    	app.post('/addtask', taskList.addTask.bind(taskList));
    	app.post('/completetask', taskList.completeTask.bind(taskList));

	This adds the functions defined in **tasklist.js** as routes.

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

<!-- ##Run your application locally

To test the application on your local machine, perform the following steps:

1. From the command-line, change directories to the **tasklist** directory.

2. Set the MONGODB_URI environment variable on your development environment to point to the virtual machine hosting MongoDB. In the examples below, replace __mymongodb__ with your virtual machine name.

	On a Windows system, use the following to set the environment variable.

		set MONGODB_URI=mongodb://mymongodb.cloudapp.net/tasks

	On an OS X or Linux-based system, use the following to set the environment variable.

		set MONGODB_URI=mongodb://mymongodb.cloudapp.net/tasks
		export MONGODB_URI

	This will instruct the application to connect to MongoDB on the __mymongodb.cloudapp.net__ virtual machine created earlier, and to use a DB named 'tasks'.

2. Use the following command to launch the application locally:

        node app.js

3. Open a web browser and navigate to http://localhost:3000. This should display a web page similar to the following:

    ![A webpage displaying an empty tasklist][node-mongo-finished]

4. Use the provided fields for **Item Name** and **Item Category** to enter information, and then click **Add item**.

    ![An image of the add item field with populated values.][node-mongo-add-item]

5. The page should update to display the item in the ToDo List table.

    ![An image of the new item in the list of tasks][node-mongo-list-items]

6. To complete a task, simply check the checkbox in the Complete column, and then click **Update tasks**. While there is no visual change after clicking **Update tasks**, the document entry in MongoDB has now been marked as completed.

7. To stop the node process, go to the command-line and press the **CTRL** and **C** keys. -->

##Deploy your application to Azure

The steps in this section use the Azure command-line tools to create a new Azure Website, and then use Git to deploy your application. To perform these steps you must have an Azure subscription.

> [AZURE.NOTE] These steps can also be performed by using the Azure portal. For steps on using the Azure portal to deploy a Node.js application, see <a href="/en-us/develop/nodejs/tutorials/create-a-website-(mac)/">Create and deploy a Node.js application to an Azure Website</a>.

> [AZURE.NOTE] If this is the first Azure Website you have created, you must use the Azure portal to deploy this application.

###Install the Azure cross-platform command-line interface

The Azure Cross-Platform Command-Line Interface (xplat-cli) allows you to perform management operations for Azure services. If you have not already installed and configured the xplat-cli on your development environment, see [Install and configure the Azure Cross-Platform Command-Line Interface][xplatcli] for instructions.

###Create an Azure Website

1. From the command-line, change directories to the **tasklist** directory.

2. Use the following command to create a new Azure Website. Replace 'myuniquesitename' with a unique site name for your website. This value is used as part of the URL for the resulting website.

		azure site create myuniquesitename --git
		
	You will be prompted for the datacenter that the site will be located in. Select the datacenter geographically close to your location.
	
	The `--git` parameter will create a Git repository locally in the **tasklist** folder if none exists. It will also create a [Git remote] named 'azure', which will be used to publish the application to Azure. It will create an [iisnode.yml], which contains settings used by Azure to host node applications. Finally it will also create a .gitignore file to exclude the node-modules folder for being published to .git.
	
	> [AZURE.NOTE] If this command is ran from a directory that already contains a Git repository, it will not re-initialize the directory.
	
	> [AZURE.NOTE] If the '--git' parameter is omitted, yet the directory contains a Git repository, the 'azure' remote will still be created.
	
	Once this command has completed, you will see output similar to the following. Note that the line beginning with **Created website at** contains the URL for the website.

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

	> [AZURE.NOTE> If this is the first Azure Website for your subscription, you will be instructed to use the portal to create the website. For more information, see <a href="/en-us/develop/nodejs/tutorials/create-a-website-(mac)/">Create and deploy a Node.js application to Azure Websites</a>.

###Set the MONGODB_URI environment variable

The application expects the connection string for the MongoDB instance to be available in the MONGODB_URI environment variable. To set this value for the website, use the following command:

	azure site config add MONGODB_URI=mongodb://mymongodb.cloudapp.net/tasks

This will create a new application setting for the website, which will be used to populate the MONGODB_URI environment variable read by the website. Replace the value of 'mymongodb.cloudapp.net' with the name of the virtual machine that MongoDB was installed on.

###Publish the application

1. In the Terminal window, change directories to the **tasklist** directory if you are not already there.

2. Use the following commands to add, and then commit files to the local Git repository:

		git add .
		git commit -m "adding files"

3. When pushing the latest Git repository changes to the Azure Website, you must specify that the target branch is **master** as this is used for the website content.

		git push azure master
	
	You will see output similar to the following. As the deployment takes place Azure will download all npm modules. 

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
 
4. Once the push operation has completed, browse to the website by using the `azure site browse` command to view your application.

##Next steps

While the steps in this article describe using MongoDB to store information, you can also use the Azure Table Service. See [Node.js Web Application with the Azure Table Service] for more information.

To learn how to use a hosted instance of MongoDB provided by MongoLab, see [Create a Node.js Application on Azure with MongoDB using the MongoLab Add-On](/en-us/develop/nodejs/tutorials/website-with-mongodb-mongolab/).

To learn how to secure MongoDB, see [MongoDB Security][mongosecurity].

##Additional resources

[Azure command-line tool for Mac and Linux]    
[Create and deploy a Node.js application to Azure Web Sites]    
[Publishing to Azure Web Sites with Git]    

[mongosecurity]: http://docs.mongodb.org/manual/security/
[node]: http://nodejs.org
[MongoDB]: http://www.mongodb.org
[Git]: http://git-scm.com
[Express]: http://expressjs.com
[Mongoose]: http://mongoosejs.com
[for free]: /en-us/pricing/free-trial
[Git remote]: http://git-scm.com/docs/git-remote
[azure-sdk-for-node]: https://github.com/WindowsAzure/azure-sdk-for-node
[iisnode.yml]: https://github.com/WindowsAzure/iisnode/blob/master/src/samples/configuration/iisnode.yml
[Azure command-line tool for Mac and Linux]: /en-us/develop/nodejs/how-to-guides/command-line-tools/
[Azure Developer Center]: /en-us/develop/nodejs/
[Create and deploy a Node.js application to Azure Web Sites]: /en-us/develop/nodejs/tutorials/create-a-website-(mac)/
[Publishing to Azure Web Sites with Git]: /en-us/develop/nodejs/common-tasks/publishing-with-git/
[Installing MongoDB on a Linux Virtual machine]: /en-us/manage/linux/common-tasks/mongodb-on-a-linux-vm/
[Node.js Web Application with the Azure Table Service]: /en-us/develop/nodejs/tutorials/web-site-with-storage/
[node-mongo-finished]: ./media/store-mongodb-web-sites-nodejs-use-mac/todo_list_empty.png
[node-mongo-express-results]: ./media/store-mongodb-web-sites-nodejs-use-mac/express_output.png
[node-mongo-add-item]: ./media/store-mongodb-web-sites-nodejs-use-mac/todo_add_item.png
[node-mongo-list-items]: ./media/store-mongodb-web-sites-nodejs-use-mac/todo_list_items.png
[download-publishing-settings]: ./media/store-mongodb-web-sites-nodejs-use-mac/azure-account-download-cli.png
[installguides]: http://docs.mongodb.org/manual/installation/
[azureportal]: https://manage.windowsazure.com/
[mongodocs]: http://docs.mongodb.org/manual/
[xplatcli]: /en-us/documentation/articles/xplat-cli/

[selectdepo]: ./media/web-sites-nodejs-store-data-mongodb/browsedepot.png
[selectedimage]: ./media/web-sites-nodejs-store-data-mongodb/selectimage.png
[selectstorage]: ./media/web-sites-nodejs-store-data-mongodb/storageaccount.png
[register]: ./media/web-sites-nodejs-store-data-mongodb/register.png
[myimage]: ./media/web-sites-nodejs-store-data-mongodb/myimages.png
[vmname]: ./media/web-sites-nodejs-store-data-mongodb/vmname.png
[vmconfig]: ./media/web-sites-nodejs-store-data-mongodb/vmconfig.png
[vmendpoint]: ./media/web-sites-nodejs-store-data-mongodb/endpoints.png
[sshazure]: http://www.windowsazure.com/en-us/documentation/articles/linux-use-ssh-key/
[mongodbonazure]: http://docs.mongodb.org/ecosystem/tutorial/install-mongodb-on-linux-in-azure/ 