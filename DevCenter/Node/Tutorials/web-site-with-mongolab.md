# Create a Node.js Application on Windows Azure with MongoDB using the MongoLab Add-On

Greetings, adventurers! Welcome to MongoDB-as-a-Service. In this tutorial you will:

1. [Provision the database][provision] - The Windows Azure Store [MongoLab](mongolab.com) add-on will provide you with a MongoDB database hosted in the Windows Azure cloud and managed by MongoLab's cloud database platform.
1. [Create the app][create] - It'll be a simple Node.js app for maintaining a list of tasks.
1. [Deploy the app][deploy] - By tying a few configuration hooks together, we'll make pushing our code a breeze.
1. [Manage the database][manage] - Finally, we'll show you MongoLab's web-based database management portal where you can search, visualize, and modify data with ease.

At any time throughout this tutorial, feel free to kick off an email to [support@mongolab.com](mailto:support@mongolab.com) if you have any questions.

Before continuing, ensure that you have the following installed:

* [Node.js] version 0.8.14+
* [Git]

<div chunk="../../Shared/Chunks/create-account-and-websites-note.md" />

## Quick start
If you have some familiarity with the Windows Azure Store, use this section to get a quick start. Otherwise, continue to [Provision the Database][provision] below.
 
1. Open the Windows Azure Store.  
![Store][button-store]
1. Click the MongoLab Add-On.  
![MongoLab][entry-mongolab]
1. Click your MongoLab Add-On in the Add-Ons list, and click **Connection Info**.  
![ConnectionInfoButton][button-connectioninfo]  
1. Copy the MONGOLAB_URI to your clipboard.  
![ConnectionInfoScreen][screen-connectioninfo]  
**This URI contains your database user name and password.  Treat it as sensitive information and do not share it.**
1. Add the value to the Connection Strings list in the Configuration menu of your Windows Azure Web application:  
![WebSiteConnectionStrings][focus-website-connectinfo]
1. For **Name**, enter MONGOLAB\_URI.
1. For **Value**, paste the connection string we obtained in the previous section.
1. Select **Custom** in the Type drop-down (instead of the default **SQLAzure**).
1. Run `npm install mongoose` to obtain M		ongoose, a MongoDB node driver.
1. Set up a hook in your code to obtain your MongoLab connection URI from an environment variable and connect:

        var mongoose = require('mongoose');  
 		...
 		var connectionString = process.env.CUSTOMCONNSTR_MONGOLAB_URI
 		...
 		mongoose.connect(connectionString);

Note: Windows Azure adds the **CUSTOMCONNSTR\_** prefix to the originally-declared connection string, which is why the code references **CUSTOMCONNSTR\_MONGOLAB\_URI.** instead of **MONGOLAB\_URI**.

Now, on to the full tutorial...

<h2><a name="provision"></a>Provision the database</h2>

<div chunk="../../Shared/Chunks/howto-provision-mongolab.md" />

<h2><a name="create"></a>Create the app</h2>

In this section you will set up your development environment and lay the code for a basic task list web application using Node.js, Express, and MongoDB. [Express] provides a View Controller framework for node, while [Mongoose] is a driver for communicating with MongoDB in node.

### Setup

#### Generate scaffolding and install modules

1. At the command-line, create and navigate to the **tasklist** directory. This will be your project directory.
1. Enter the following command to install express.

		npm install express -g
 
	`-g` indicates global mode, which we use to make the <strong>express</strong> module available without specifying a directory path. If you receive <strong>Error: EPERM, chmod '/usr/local/bin/express'</strong>, use <strong>sudo</strong> to run npm at a higher privilege level.

    The output of this command should appear similar to the following:

		express@2.5.9 /usr/local/lib/node_modules/express
		├── mime@1.2.4 
		├── mkdirp@0.3.0 
		├── qs@0.4.2 
		└── connect@1.8.7 
 
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
	
1. Enter the following to install the modules described in the **package.json** file:

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

	The **package.json** file is one of the files created by the **express** command. This file contains a list of additional modules that are required for an Express application. Later, when you deploy this application to a Windows Azure Web Site, this file will be used to determine which modules need to be installed on Windows Azure to support your application.

2. Next, enter the following command to install the Mongoose module locally as well as to save an entry for it to the **package.json** file:

		npm install mongoose --save

	The output of this command should appear similar to the following:

		mongoose@2.6.5 ./node_modules/mongoose
		├── hooks@0.2.1
		└── mongodb@1.0.2

    You can safely ignore any message about installing the C++ bson parser.</p>
	
### The Code

Now that our environment and scaffolding is ready, we'll extend the basic application created by the **express** command by adding a **task.js** file which contains the model for your tasks. You will also modify the existing **app.js** and create a new **tasklist.js** controller file to make use of the model.

#### Create the model

1. In the **tasklist** directory, create a new directory named **models**.

2. In the **models** directory, create a new file named **task.js**. This file will contain the model for the tasks created by your application.

3. Add the following code to the **task.js** file:

        var mongoose = require('mongoose')
	      , Schema = mongoose.Schema;

        var TaskSchema = new Schema({
	        itemName      : String
	      , itemCategory  : String
	      , itemCompleted : { type: Boolean, default: false }
	      , itemDate      : { type: Date, default: Date.now }
        });

        module.exports = mongoose.model('TaskModel', TaskSchema)

5. Save and close the **task.js** file.

#### Create the controller

1. In the **tasklist/routes** directory, create a new file named **tasklist.js** and open it in a text editor.

2. Add the folowing code to **tasklist.js**. This loads the mongoose module and the task model defined in **task.js**. The TaskList function is used to create the connection to the MongoDB server based on the **connection** value, and provides the methods **showTasks**, **addTask**, and **completeTasks**:

		var mongoose = require('mongoose')
	      , task = require('../models/task.js');

		module.exports = TaskList;

		function TaskList(connection) {
  		  mongoose.connect(connection);
		}

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

#### Modify the index view

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

#### Replace app.js

1. In the **tasklist** directory, open the **app.js** file in a text editor. This file was created earlier by running the **express** command.
1. Replace the contents with the following code. This will initialize **TaskList** with the connection string for the MongoDB server, add the functions defined in **tasklist.js** as routes, and start your app server:

		var express = require('express')
  			, routes = require('./routes')
  			, user = require('./routes/user')
  			, http = require('http')
  			, path = require('path');
		var TaskList = require('./routes/tasklist');
		var taskList = new TaskList(process.env.CUSTOMCONNSTR_MONGOLAB_URI);

		var app = express();

		app.configure(function(){
		  app.set('port', process.env.PORT || 3000);
		  app.set('views', __dirname + '/views');
		  app.set('view engine', 'jade');
		  app.use(express.favicon());
		  app.use(express.logger('dev'));
		  app.use(express.bodyParser());
		  app.use(express.methodOverride());
		  app.use(app.router);
		  app.use(express.static(path.join(__dirname, 'public')));
    	});

		app.configure('development', function(){
		  app.use(express.errorHandler());
    	});

		app.get('/', taskList.showTasks.bind(taskList));
		app.post('/addtask', taskList.addTask.bind(taskList));
		app.post('/completetask', taskList.completeTask.bind(taskList));

		http.createServer(app).listen(app.get('port'), function(){
		  console.log("Express server listening on port " + app.get('port'));
		});

1. Note the following code above:  
		
		var taskList = new TaskList(process.env.CUSTOMCONNSTR_MONGOLAB_URI); 
		
	The TaskList constructor takes a MongoDB connection URI. Here, you access an environment variable that you'll configure later. If you have a local mongo instance running for development purposes, you may want to temporarily set this value to "localhost" instead of `process.env.CUSTOMCONNSTR_MONGOLAB_URI`.  

4. Save the **app.js** file.

<h2><a name="manage"></a>Deploy the app</h2>

Now that the application has been developed, it's time to create a Windows Azure Web Site to host it, configure that web site, and deploy the code. Central to this section is the use of the MongoDB connection string (URI). You're going to configure an environment variable in your web site with this URI to keep the URI separate from your code.  You should treat the URI as sensitive information as it contains credentials to connect to your database.

The steps in this section use the Windows Azure command-line tools to create a new Windows Azure Web Site, and then use Git to deploy your application. To perform these steps you must have a Windows Azure subscription.

### Install the Windows Azure command-line tool for Mac and Linux

To install the command-line tools, use the following command:
	
	npm install azure-cli -g

If you have already installed the <strong>Windows Azure SDK for Node.js</strong> from the <a href="/en-us/develop/nodejs/">Windows Azure Developer Center</a>, then the command-line tools should already be installed. For more information, see <a href="/en-us/develop/nodejs/how-to-guides/command-line-tools/">Windows Azure command-line tool for Mac and Linux</a>.</p>

While the Windows Azure command-line tools were created primarily for Mac and Linux users, they are based on Node.js and should work on any system capable of running Node.

### Import publishing settings

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

### Create a new web site and push your code

Creating a web site in Windows Azure is very easy. If this is your first Windows Azure website, you must use the portal. If you already have at least one, then skip to step 7.

1. In the Windows Azure portal, click **New**.    
![New][button-new]
1. Select **Compute > Web Site > Quick Create**. 
![CreateSite][screen-mongolab-newwebsite]
1. Enter a URL prefix. Choose a name you prefer, but keep in mind this must be unique ('mymongoapp' will likely not be available).
1. Click **Create Web Site**.
1. When the web site creation completes, click the web site name in the web site list. The web site dashboard displays.  
![WebSiteDashboard][screen-mongolab-websitedashboard]
1. Click **Set up Git publishing** under **quick glance**, and enter your desired git user name and password. You will use this password when pushing to your website (in step 9).  
![buttonGitPublishing][button-git-publishing]
1. If you created your website using the steps above, the following command will complete the process. However, if you already have more than one Windows Azure website, you can skip the above steps and create a new web site using this same command. From your **tasklist** project directory: 

		azure site create myuniquesitename --git  
	Replace 'myuniquesitename' with the unique site name for your web site. If the web site is created as part of this command, you will be prompted for the datacenter that the site will be located in. Select the datacenter geographically close to your MongoLab database.
	
	The `--git` parameter will create:
	A. a local git repository in the **tasklist** folder, if none exists.
	A. a [Git remote] named 'azure', which will be used to publish the application to Windows Azure.
	A. an [iisnode.yml] file, which contains settings used by Windows Azure to host node applications.
	A. a .gitignore file to prevent the node-modules folder from being published to .git.  
	  
	Once this command has completed, you will see output similar to the following. Note that the line beginning with **Created website at** contains the URL for the web site.

		info:   Executing command site create
		info:   Using location southcentraluswebspace
		info:   Executing `git init`
		info:   Creating default web.config file
		info:   Creating a new web site
		info:   Created website at  mongodbtasklist.azurewebsites.net
		info:   Initializing repository
		info:   Repository initialized
		info:   Executing `git remote add azure http://gitusername@myuniquesitename.azurewebsites.net/mongodbtasklist.git`
		info:   site create command OK

1. Use the following commands to add, and then commit files to your local Git repository:

		git add .
		git commit -m "adding files"

1. Push your code:

		git push azure master  
	When pushing the latest Git repository changes to the Windows Azure Web Site, you must specify that the target branch is **master** as this is used for the web site content. If prompted for a password, enter the password you created when you set up git publishing for your webs site above.
	
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
 
You're almost done!

### Configure your environment
Remember process.env.CUSTOMCONNSTR_MONGOLAB_URI in the code? We want to populate that environment variable with the value provided to Windows Azure during your MongoLab database provisioning.

#### Get the MongoLab connection string

<div chunk="../../Shared/Chunks/howto-get-connectioninfo-mongolab.md" />

#### Add the connection string to the web site's environment variables

<div chunk="../../Shared/Chunks/howto-save-connectioninfo-mongolab.md" />

## Success!

Run `azure site browse` from your project directory to automatically open a browser, or open a browser and manually navigate to your website URL (myuniquesite.azurewebsites.net):

![A webpage displaying an empty tasklist][node-mongo-finished]

<h2><a name="manage"></a>Manage the database</h2>

<div chunk="../../Shared/Chunks/howto-access-mongolab-ui.md" />

Congratulations! You've just launched a Node.js application backed by a MongoLab-hosted MongoDB database! Now that you have a MongoLab database, you can contact [support@mongolab.com](mailto:support@mongolab.com) with any questions or concerns about your database, or for help with MongoDB or the node driver itself. Good luck out there!

[screen-mongolab-sampleapp]: ../Media/screen-mongolab-sampleapp.png
[button-website-downloadpublishprofile]: ../../Shared/Media/button-website-downloadpublishprofile.png
[screen-mongolab-websitedashboard]: ../../Shared/Media/screen-mongolab-websitedashboard.png
[screen-mongolab-newwebsite]: ../../Shared/Media/screen-mongolab-newwebsite.png
[button-new]: ../../Shared/Media/button-new.png
[button-store]: ../../Shared/Media/button-store.png
[entry-mongolab]: ../../Shared/Media/entry-mongolab.png 
[button-connectioninfo]: ../../Shared/Media/button-connectioninfo.png
[screen-connectioninfo]: ../../Shared/Media/dialog-mongolab_connectioninfo.png
[focus-website-connectinfo]: ../../Shared/Media/focus-mongolab-websiteconnectionstring.png
[provision]: #provision
[create]: #create
[deploy]: #deploy
[manage]: #manage
[button-git-publishing]: ../../Shared/Media/button-git-publishing.png

[Node.js]: http://nodejs.org
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
[node-mongo-finished]: ../media/todo_list_noframe.png
[node-mongo-express-results]: ../media/express_output.png
[download-publishing-settings]: ../../Shared/Media/azure-account-download-cli.png
[import-publishing-settings]: ../media/azureimport.png
[mongolab-create]: ../media/mongolab-create.png
[mongolab-view]: ../media/mongolab-view.png

