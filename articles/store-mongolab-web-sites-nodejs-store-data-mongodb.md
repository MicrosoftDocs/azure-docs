<properties 
	pageTitle="Create a Node.js web app on Azure with MongoDB using the MongoLab add-on" 
	description="Learn how to create a Node.js web app in Azure App Service that connects to a MongoDB instance hosted on MongoLab." 
	tags="azure-classic-portal"
	services="app-service\web, virtual-machines" 
	documentationCenter="nodejs" 
	authors="chrisckchang" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="app-service-web" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="nodejs" 
	ms.topic="article" 
	ms.date="04/20/2014" 
	ms.author="mwasson"/>






# Create a Node.js web app on Azure with MongoDB using the MongoLab add-on


<p><em>By Eric Sedor, MongoLab</em></p>

Greetings, adventurers! Welcome to MongoDB-as-a-Service. In this tutorial you will:

1. [Provision the database][provision] - The Azure Marketplace [MongoLab](http://mongolab.com) add-on will provide you with a MongoDB database hosted in the Azure cloud and managed by MongoLab's cloud database platform.
2. [Create the app][create] - It'll be a simple Node.js app for maintaining a list of tasks.
3. [Deploy the app][deploy] - By tying a few configuration hooks together, we'll make pushing our code to [Azure App Service Web Apps](http://go.microsoft.com/fwlink/?LinkId=529714) a breeze.
4. [Manage the database][manage] - Finally, we'll show you MongoLab's web-based database management portal where you can search, visualize, and modify data with ease.

At any time throughout this tutorial, feel free to kick off an email to [support@mongolab.com](mailto:support@mongolab.com) if you have any questions.

Before continuing, ensure that you have the following installed:

* [Node.js] version 0.10.29+

* [Git]

[AZURE.INCLUDE [create-account-and-websites-note](../includes/create-account-and-websites-note.md)]

## Quick start
If you have some familiarity with the Azure Store, use this section to get a quick start. Otherwise, continue to [Provision the Database][provision] below.
 
1. Open the Azure Marketplace by clicking **New** > **Marketplace**.  
<!-- ![Store][button-store] -->
2. Click the **MongoLab** add-on.  
![MongoLab][entry-mongolab]
3. Click your **MongoLab** add-on in the Add-Ons list, and click **Connection Info**.  
![ConnectionInfoButton][button-connectioninfo]  
4. Copy the **MONGOLAB_URI** to your clipboard.  
![ConnectionInfoScreen][screen-connectioninfo]
  
	>[AZURE.NOTE] This URI contains your database user name and password.  Treat it as sensitive information and do not share it.

5. Add the value to the **Connection Strings** list in the **Configuration** menu of your web app in Azure App Service:  
![WebAppConnectionStrings][focus-website-connectinfo]
6. For **Name**, enter **MONGOLAB\_URI**.
7. For **Value**, paste the connection string we obtained in the previous section.
8. Select **Custom** in the Type drop-down (instead of the default **SQLAzure**).
9. Run `npm install mongoose` to obtain Mongoose, a MongoDB node driver.
10. Set up a hook in your code to obtain your MongoLab connection URI from an environment variable and connect:

        var mongoose = require('mongoose');  
 		...
 		var connectionString = process.env.CUSTOMCONNSTR_MONGOLAB_URI
 		...
 		mongoose.connect(connectionString);

Note: Azure adds the **CUSTOMCONNSTR\_** prefix to the originally-declared connection string, which is why the code references **CUSTOMCONNSTR\_MONGOLAB\_URI.** instead of **MONGOLAB\_URI**.

Now, on to the full tutorial...

<a name="provision"></a>
## Provision the database

[AZURE.INCLUDE [howto-provision-mongolab](../includes/howto-provision-mongolab.md)]

<a name="create"></a>
## Create the app

In this section you will set up your development environment and lay the code for a basic task list web application using Node.js, Express, and MongoDB. [Express] provides a View Controller framework for node, while [Mongoose] is a driver for communicating with MongoDB in node.

### Setup

#### Generate scaffolding and install modules

1. At the command-line, create and navigate to the **tasklist** directory. This will be your project directory.
2. Enter the following command to install express.

		npm install express -g
 
	`-g` indicates global mode, which we use to make the <strong>express</strong> module available without specifying a directory path. If you receive <strong>Error: EPERM, chmod '/usr/local/bin/express'</strong>, use <strong>sudo</strong> to run npm at a higher privilege level.

    The output of this command should appear similar to the following:

		express@4.9.1 C:\Users\mongolab\AppData\Roaming\npm\node_modules\express
		├── merge-descriptors@0.0.2
		├── utils-merge@1.0.0
		├── fresh@0.2.4
		├── cookie@0.1.2
		├── range-parser@1.0.2
		├── escape-html@1.0.1
		├── cookie-signature@1.0.5
		├── finalhandler@0.2.0
		├── vary@1.0.0
		├── media-typer@0.3.0
		├── parseurl@1.3.0
		├── serve-static@1.6.2
		├── methods@1.1.0
		├── path-to-regexp@0.1.3
		├── depd@0.4.5
		├── qs@2.2.3
		├── on-finished@2.1.0 (ee-first@1.0.5)
		├── debug@2.0.0 (ms@0.6.2)
		├── proxy-addr@1.0.1 (ipaddr.js@0.1.2)
		├── etag@1.3.1 (crc@3.0.0)
		├── send@0.9.2 (destroy@1.0.3, ms@0.6.2, mime@1.2.11)
		├── accepts@1.1.0 (negotiator@0.4.7, mime-types@2.0.1)
		└── type-is@1.5.1 (mime-types@2.0.1)
 
3. To create the scaffolding which will be used for this application, use the **express** command:

    	express

    Note that this tutorial is using Express v4.x.x. If you already have the Express 3 app generator installed on your system, you should first uninstall it:

    	npm uninstall -g express

    Now install the new generator for version 4.x.x:

    	npm install -g express-generator

	Once the **express** command runs, the output should appear similar to the following:

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
		create : ./routes/users.js
		create : ./views
		create : ./views/index.jade
		create : ./views/layout.jade
		create : ./views/error.jade
		create : ./bin
		create : ./bin/www

		install dependencies:
		$ cd . && npm install


	After this command completes, you should have several new directories and files in the **tasklist** directory.
	
4. Enter the following to install the modules described in the **package.json** file:

        npm install

    The output of this command should appear similar to the following:

		cookie-parser@1.3.3 node_modules/cookie-parser
		├── cookie@0.1.2
		└── cookie-signature@1.0.5

		debug@2.0.0 node_modules/debug
		└── ms@0.6.2

		serve-favicon@2.1.4 node_modules/serve-favicon
		├── ms@0.6.2
		├── fresh@0.2.4
		└── etag@1.3.1 (crc@3.0.0)

		morgan@1.3.1 node_modules/morgan
		├── basic-auth@1.0.0
		├── depd@0.4.5
		└── on-finished@2.1.0 (ee-first@1.0.5)

		express@4.9.1 node_modules/express
		├── utils-merge@1.0.0
		├── merge-descriptors@0.0.2
		├── cookie@0.1.2
		├── fresh@0.2.4
		├── escape-html@1.0.1
		├── range-parser@1.0.2
		├── cookie-signature@1.0.5
		├── finalhandler@0.2.0
		├── vary@1.0.0
		├── media-typer@0.3.0
		├── serve-static@1.6.2
		├── parseurl@1.3.0
		├── methods@1.1.0
		├── path-to-regexp@0.1.3
		├── depd@0.4.5
		├── qs@2.2.3
		├── etag@1.3.1 (crc@3.0.0)
		├── on-finished@2.1.0 (ee-first@1.0.5)
		├── proxy-addr@1.0.1 (ipaddr.js@0.1.2)
		├── send@0.9.2 (destroy@1.0.3, ms@0.6.2, mime@1.2.11)
		├── type-is@1.5.1 (mime-types@2.0.1)
		└── accepts@1.1.0 (negotiator@0.4.7, mime-types@2.0.1)

		body-parser@1.8.2 node_modules/body-parser
		├── media-typer@0.3.0
		├── raw-body@1.3.0
		├── bytes@1.0.0
		├── depd@0.4.5
		├── on-finished@2.1.0 (ee-first@1.0.5)
		├── qs@2.2.3
		├── iconv-lite@0.4.4
		└── type-is@1.5.1 (mime-types@2.0.1)

		jade@1.6.0 node_modules/jade
		├── character-parser@1.2.0
		├── commander@2.1.0
		├── void-elements@1.0.0
		├── mkdirp@0.5.0 (minimist@0.0.8)
		├── monocle@1.1.51 (readdirp@0.2.5)
		├── transformers@2.1.0 (promise@2.0.0, css@1.0.8, uglify-js@2.2.5)
		├── constantinople@2.0.1 (uglify-js@2.4.15)
		└── with@3.0.1 (uglify-js@2.4.15)

	The **package.json** file is one of the files created by the **express** command. This file contains a list of additional modules that are required for an Express application. Later, when you deploy this application to Azure App Service Web Apps, this file will be used to determine which modules need to be installed on Azure to support your application.

5. Next, enter the following command to install the Mongoose module locally as well as to save an entry for it to the **package.json** file:

		npm install mongoose --save

	The output of this command should appear similar to the following:

		mongoose@3.8.16 node_modules/mongoose
		├── regexp-clone@0.0.1
		├── muri@0.3.1
		├── sliced@0.0.5
		├── hooks@0.2.1
		├── mpath@0.1.1
		├── mpromise@0.4.3
		├── ms@0.1.0
		├── mquery@0.8.0 (debug@0.7.4)
		└── mongodb@1.4.9 (readable-stream@1.0.31, kerberos@0.0.3, bson@0.2.12)
	
### The Code

Now that our environment and scaffolding is ready, we'll extend the basic application created by the **express** command by adding a **task.js** file which contains the model for your tasks. You will also modify the existing **app.js** and create a new **tasklist.js** controller file to make use of the model.

#### Create the model

1. In the **tasklist** directory, create a new directory named **models**.

2. In the **models** directory, create a new file named **task.js**. This file will contain the model for the tasks created by your application.

3. Add the following code to the **task.js** file:

        var mongoose = require('mongoose'), 
          Schema = mongoose.Schema;

        var TaskSchema = new Schema({
	      itemName      : String, 
	      itemCategory  : String, 
	      itemCompleted : { type: Boolean, default: false },
	      itemDate      : { type: Date, default: Date.now }
        });

        module.exports = mongoose.model('TaskModel', TaskSchema);

5. Save and close the **task.js** file.

#### Create the controller

1. In the **tasklist/routes** directory, create a new file named **tasklist.js** and open it in a text editor.

2. Add the following code to **tasklist.js**. This loads the mongoose module and the task model defined in **task.js**. The TaskList function is used to create the connection to the MongoDB server based on the **connection** value, and provides the methods **showTasks**, **addTask**, and **completeTasks**:

		var mongoose = require('mongoose'), 
 		  task = require('../models/task.js');

		module.exports = TaskList;

		function TaskList(connection) {
		  mongoose.connect(connection);
		}

		TaskList.prototype = {
		  showTasks: function(req, res) {
		    task.find({ itemCompleted : false }, function foundTasks(err, items) {
		    res.render('index', { title: 'My ToDo List', tasks: items })
		    });
		  },

		  addTask: function(req,res) {
		    var item = req.body;
		    var newTask = new task();
		    newTask.itemName = item.itemName;
		    newTask.itemCategory = item.itemCategory;
		    newTask.save(function savedTask(err) {
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

#### Modify the index view

1. Change directories to the **views** directory and open the **index.jade** file in a text editor.

2. Replace the contents of the **index.jade** file with the code below. This defines the view for displaying existing tasks, as well as a form for adding new tasks and marking existing ones as completed.

		h1 #{title}
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
		        input(name="itemName", type="textbox")
		    tr
		      td Item Category: 
		      td 
		        input(name="itemCategory", type="textbox")
		  input(type="submit", value="Add item")

3. Save and close **index.jade** file.

#### Replace app.js

1. In the **tasklist** directory, open the **app.js** file in a text editor. This file was created earlier by running the **express** command.
2. Add the following code to the beginning of the **app.js** file. This will initialize **TaskList** with the connection string for the MongoDB server:

		var TaskList = require('./routes/tasklist');
		var taskList = new TaskList(process.env.CUSTOMCONNSTR_MONGOLAB_URI);

 	Note the second line; you access an environment variable that you'll configure later, which contains the connection information for your mongo instance. If you have a local mongo instance running for development purposes, you may want to temporarily set this value to "localhost" instead of `process.env.CUSTOMCONNSTR_MONGOLAB_URI`.

3. Find these lines:
		
		app.use('/', routes);
		app.use('/users', users);

	And replace them with:

		app.get('/', taskList.showTasks.bind(taskList));
		app.post('/addtask', taskList.addTask.bind(taskList));
		app.post('/completetask', taskList.completeTask.bind(taskList));

	This adds the functions defined in **tasklist.js** as routes.

4. To initialize your app, go to the bottom of your **app.js** file and add the following line:

		app.listen(3000); // Listen on port 3000
		module.exports = app;

5. Save the **app.js** file.

<a name="deploy"></a>
## Deploy the app

Now that the application has been developed, it's time to create a web app in Azure App Service to host it, configure that web app, and deploy the code. Central to this section is the use of the MongoDB connection string (URI). You're going to configure an environment variable in your web app with this URI to keep the URI separate from your code.  You should treat the URI as sensitive information as it contains credentials to connect to your database.

The steps in this section use the Azure command-line tools to create a new web app in Azure App Service, and then use Git to deploy your application. To perform these steps you must have an Azure subscription.

### Install the Azure command-line tool for Mac and Linux

To install the command-line tools, use the following command:
	
	npm install azure-cli -g

If you have already installed the <strong>Azure SDK for Node.js</strong> from the <a href="/develop/nodejs/">Azure Developer Center</a>, then the command-line tools should already be installed. For more information, see <a href="virtual-machines-command-line-tools.md">Azure command-line tool for Mac and Linux</a>.

While the Azure command-line tools were created primarily for Mac and Linux users, they are based on Node.js and should work on any system capable of running Node.

### Import publishing settings

Before using the command-line tools with Azure, you must first download a file containing information about your subscription. Perform the following steps to download and import this file.

1. From the command-line, enter the following command to launch the browser and navigate to the download page. If prompted, login with the account associated with your subscription.

		azure account download
	
	![The download page][download-publishing-settings]
	
	The file download should begin automatically; if it does not, you can click the link at the beginning of the page to manually download the file.

2. After the file download has completed, use the following command to import the settings:

		azure account import <path-to-file>
		
	Specify the path and file name of the publishing settings file you downloaded in the previous step. Once the command completes, you should see output similar to the following:
	
		info:   Executing command account import
		info:   Found subscription: subscriptionname
		info:   Setting default subscription to: subscriptionname
		warn:   The '/Users/mongolab/.azure/publishSettings.xml' file contains sensitive information.
		warn:   Remember to delete it now that it has been imported.
		info:   Account publish settings imported successfully
		info:   account import command OK


3. Once the import has completed, you should delete the publish settings file as it is no longer needed and contains sensitive information regarding your Azure subscription.

### Create a new web app and push your code

Creating a web app in Azure App Service is very easy. If this is your first Azure web app, you must use the portal. If you already have at least one, then skip to step 7.

1. In the Azure portal, click **New**.    
![New][button-new]
2. Select **Compute > Web app > Quick Create**. 
<!-- ![Create Web App][screen-mongolab-newwebsite] -->
3. Enter a URL prefix. Choose a name you prefer, but keep in mind this must be unique ('mymongoapp' will likely not be available).
4. Click **Create web app**.
5. When the web app creation completes, click the web app name in the web apps list. The Web App dashboard displays.
<!-- ![Web App Dashboard][screen-mongolab-websitedashboard] -->
6. Click **Set up deployment from source control** under **quick glance**, select GitHub, and enter your desired git user name and password. You will use this password when pushing to your web app (in step 9).  
7. If you created your web app using the steps above, the following command will complete the process. However, if you already have more than one web app, you can skip the above steps and create a new web app using this same command. From your **tasklist** project directory: 

		azure site create myuniquewebappname --git  
	Replace 'myuniquewebappname' with the unique name for your web app. If the web app is created as part of this command, you will be prompted for the datacenter that the web app will be located in. Select the datacenter geographically close to your MongoLab database.
	
	The `--git` parameter will create:
	* a local git repository in the **tasklist** folder, if none exists.
	* a [Git remote] named 'azure', which will be used to publish the application to Azure.
	* an [iisnode.yml] file, which contains settings used by Azure to host node applications.
	* a .gitignore file to prevent the node-modules folder from being published to .git.  
	  
	Once this command has completed, you will see output similar to the following. Note that the line beginning with **Created site at** contains the URL for the web app.

		info:   Executing command site create
		info:   Using location southcentraluswebspace
		info:   Executing `git init`
		info:   Creating default web.config file
		info:   Creating a new web site
		info:   Created web site at  mongodbtasklist.azurewebsites.net
		info:   Initializing repository
		info:   Repository initialized
		info:   Executing `git remote add azure http://gitusername@myuniquewebappname.azurewebsites.net/mongodbtasklist.git`
		info:   site create command OK

8. Use the following commands to add, and then commit files to your local Git repository:

		git add .
		git commit -m "adding files"

9. Push your code:

		git push azure master  

	When pushing the latest Git repository changes to the web app in Azure App Service, you must specify that the target branch is **master** as this is used for the web app content. If prompted for a password, enter the password you created when you set up git publishing for your web app above.
	
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
 
You're almost done!

### Configure your environment
Remember process.env.CUSTOMCONNSTR\_MONGOLAB\_URI in the code? We want to populate that environment variable with the value provided to Azure during your MongoLab database provisioning.

#### Get the MongoLab connection string

[AZURE.INCLUDE [howto-get-connectioninfo-mongolab](../includes/howto-get-connectioninfo-mongolab.md)]

#### Add the connection string to the web app's environment variables

[AZURE.INCLUDE [howto-save-connectioninfo-mongolab](../includes/howto-save-connectioninfo-mongolab.md)]

## Success!

Run `azure site browse` from your project directory to automatically open a browser, or open a browser and manually navigate to your web app URL (myuniquewebappname.azurewebsites.net):

![A webpage displaying an empty tasklist][node-mongo-finished]

<a name="manage"></a>
## Manage the database

[AZURE.INCLUDE [howto-access-mongolab-ui](../includes/howto-access-mongolab-ui.md)]

Congratulations! You've just launched a Node.js application backed by a MongoLab-hosted MongoDB database! Now that you have a MongoLab database, you can contact [support@mongolab.com](mailto:support@mongolab.com) with any questions or concerns about your database, or for help with MongoDB or the node driver itself. Good luck out there!

## What's changed
* For a guide to the change from Websites to App Service see: [Azure App Service and Its Impact on Existing Azure Services](http://go.microsoft.com/fwlink/?LinkId=529714)
* For a guide to the change of the old portal to the new portal see: [Reference for navigating the preview portal](http://go.microsoft.com/fwlink/?LinkId=529715)

>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751), where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.


[screen-mongolab-websitedashboard]: ./media/store-mongolab-web-sites-nodejs-store-data-mongodb/screen-mongolab-websitedashboard.png
[screen-mongolab-newwebsite]: ./media/store-mongolab-web-sites-nodejs-store-data-mongodb/screen-mongolab-newwebsite.png
[button-new]: ./media/store-mongolab-web-sites-nodejs-store-data-mongodb/button-new.png
[button-store]: ./media/store-mongolab-web-sites-nodejs-store-data-mongodb/button-store.png
[entry-mongolab]: ./media/store-mongolab-web-sites-nodejs-store-data-mongodb/entry-mongolab.png 
[button-connectioninfo]: ./media/store-mongolab-web-sites-nodejs-store-data-mongodb/button-connectioninfo.png
[screen-connectioninfo]: ./media/store-mongolab-web-sites-nodejs-store-data-mongodb/dialog-mongolab_connectioninfo.png
[focus-website-connectinfo]: ./media/store-mongolab-web-sites-nodejs-store-data-mongodb/focus-mongolab-websiteconnectionstring.png
[provision]: #provision
[create]: #create
[deploy]: #deploy
[manage]: #manage
[Node.js]: http://nodejs.org
[MongoDB]: http://www.mongodb.org
[Git]: http://git-scm.com
[Express]: http://expressjs.com
[Mongoose]: http://mongoosejs.com
[for free]: /pricing/free-trial
[Git remote]: http://git-scm.com/docs/git-remote
[azure-sdk-for-node]: https://github.com/WindowsAzure/azure-sdk-for-node
[iisnode.yml]: https://github.com/WindowsAzure/iisnode/blob/master/src/samples/configuration/iisnode.yml
[Azure command-line tool for Mac and Linux]: virtual-machines-command-line-tools.md
[Azure Developer Center]: /develop/nodejs/
[Create and deploy a Node.js application to Azure Web Sites]: /develop/nodejs/tutorials/create-a-website-(mac)/
[Continuous deployment using GIT in Azure App Service]: web-sites-publish-source-control.md
[MongoLab]: http://mongolab.com
[Node.js Web Application with Storage on MongoDB (Virtual Machine)]: /develop/nodejs/tutorials/website-with-mongodb-(mac)/
[node-mongo-finished]: ./media/store-mongolab-web-sites-nodejs-store-data-mongodb/todo_list_noframe.png
[node-mongo-express-results]: ./media/store-mongolab-web-sites-nodejs-store-data-mongodb/express_output.png
[download-publishing-settings]: ./media/store-mongolab-web-sites-nodejs-store-data-mongodb/azure-account-download-cli.png
[import-publishing-settings]: ./media/store-mongolab-web-sites-nodejs-store-data-mongodb/azureimport.png
[mongolab-create]: ./media/store-mongolab-web-sites-nodejs-store-data-mongodb/mongolab-create.png
[mongolab-view]: ./media/store-mongolab-web-sites-nodejs-store-data-mongodb/mongolab-view.png



