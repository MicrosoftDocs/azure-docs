# Node.js Web Application with Storage on MongoDB

This tutorial describes how to use MongoDB to store and access data from a Node.js application hosted as a Windows Azure Web Site. This guide assumes that you have some prior experience using Node.js, MongoDB, and Git. For information on Node.js, see the [Node.js website]. For information on MongoDB, see the [MongoDB website]. For information on Git, see the [Git website].

This guide also assumes that you have access to a MongoDB server, such as the one created by following the steps in **TBD**

You will learn how to:

* Use npm (node package manager) to install the Mongoose module for Node.js.

* Use MongoDB within a Node.js application through the Mongoose module.

* Publish a Node.js application as a Windows Azure Web Site.

Throughout this tutorial you will build a simple web-based task-management application that allows creating, retrieving and completing tasks, which are stored in MongoDB. MongoDB is hosted in a Windows Azure Virtual Machine, and the web application is hosted as a Windows Azure Site.
 
The project files for this tutorial will be stored in a directory named *tasklist* and the completed application will look similar to the following:

![Finished][]

## Setting up your deployment environment

In order to create and test a Node.js application, you will need the following:

* The Windows Azure SDK for Node.js

* Git version control system for your operating system. You can find the latest installation for your platform at the [Git website].

## Creating a Node.js application

In this section you will create a new Node application and use npm to add module packages. This application will use the express module to build a task-list application, which will use MongoDB as storage.
 
For the task-list application you will use the following modules:

* Express - A web framework inspired by Sinatra.

* MongoDB - The driver for communicating with MongoDB.

**TODO: Revisit these steps once the new powershell stuff is available/stable**

1. On the Start menu, click **All Programs**, **Windows Azure SDK Node.js**, right-click W**indows Azure PowerShell for Node.js**, and then select Run As Administrator. Opening your Windows PowerShell environment this way ensures that all of the Node command-line tools are available. Running with elevated privileges avoids extra prompts when working with the Windows Azure Emulator.

	    PS C:\> mkdir c:\node
        PS C:\> cd c:\node

2. Enter the following cmdlet to create a new solution:

		ps C:\node> New-AzureService tasklist

	You will see the following response:

	**(TODO Screenshot)**

3. Enter the following command to install the express and mongoose modules:

        npm install express mongoose

    The output of these commands should appear similar to the following:

    ![npmInstall][]

4. To create the scaffolding which will be used for this application, issue the express command. When prompted to overwrite the destination, enter **y** or **yes**. The output of this command should appear similar to the following:

        ./node_modules/express/bin/express

    **Note**: On a Windows system the express command should be ran from .\node_modules\.\bin\express instead.

    The output of this command should appear as follows:

    ![ExpressOutput][]

5. To install additional modules required by the express application, enter the following command:

        npm install

    The output of this command should appear as follows:

    ![npmInstallAfterExpress][]

## Using MongoDB in a Node Application

In this section you will extend the basic application created by the express command, creating a web-based task-list application that you will deploy to Windows Azure. The task list will allow a user to retrieve tasks and add new tasks. The application will utilize MongoDB to store task data.

### Create the model

1. In the **tasklist** directory, create a new directory named **models** by using the following command:

		PS C:\node\tasklist> mkdir models


2. Start notepad.exe and create a new file named *task.js* in the **models** directory. This file will contain the model for the tasks created by your application.

		PS C:\node\tasklist> notepad.exe task.js

	When prompted to create the file, select **Yes**.

2. At the beginning of the *task.js* file, add the following code to reference required libraries:

        var mongoose = require('mongoose')
	      , Schema = mongoose.Schema;

3. Next, you will add code to define and export the model. This model will be used to perform interactions with the MongoDB database.

        var TaskSchema = new Schema({
	        itemName      : String
	      , itemCategory  : String
	      , itemCompleted : { type: Boolean, default: false }
	      , itemDate      : { type: Date, default: Date.now }
        });

        module.exports = mongoose.model('TaskModel', TaskSchema)

4. Save and close the *task.js* file.

## Modify server.js

**TODO: Revisit periodically and see if express starts generating server.js instead of app.js**

1. In the **tasklist** directory, rename the *app.js* file to *server.js*:

		rn app.js server.js

2. open the *server.js* file in notepad and add the following code after the `app.get` statement in the routes section. It will add a new route for submitting new tasks. We will create the *updateItem* function used by this route in the next section.

        app.post('/', routes.updateItem);

	After adding the previous line, the routes section should appear as follows:

		// Routes

		app.get('/', routes.index);
		app.post('/', routes.updateItem);

4. Replace the 'app.listen statement' at the end of the file with the code below. This configures Node to listen on the environment PORT value provided by Windows Azure when published to the cloud, or port 1337 when ran directly using node.exe.

        app.listen(process.env.port || 1337);

## Modify the index controller

The controller defined in *index.js* will handle all requests for the task list site. This file can be found in the **routes** sub-directory of the **tasklist** directory.

1. Open *index.js* in notepad and add the following statements at the beginning of the file. This will include the mongoose module, the *task.js* file you created earlier, and connect to the MongoDB server. 

		var mongoose = require('mongoose')
  		  , task = require('../models/taskModel.js');

		mongoose.connect('mongodb://mongodbserveraddr/tasks');

    **Note**: change the *mongodbserveraddr* in the `mongoose.connect` statement to the IP address or fully qualified domain name of your MongoDB server.

2. Replace the existing `exports.index` section with the following. This will find and display tasks stored in MongoDB.

		exports.index = function(req, res){
		  task.find({}, function(err, items){
		  	res.render('index',{title: 'My ToDo List ', tasks: items})
		  })
		};

2. Add the following code to the bottom of the file. The code below defines the *updateItem* route used when new tasks are submitted or existing tasks are marked as completed. When creating a new task, it uses the model defined earlier to create a new task object, and then saves the task to MongoDB. When updating an existing item, it performs an update by specifying a condition that identifies the document to be updated and the values to be updated. Finally, it redirects the user back to the index route.


		exports.updateItem = function (req, res){
		  if(req.body.item){
		    newTask = new task();
		    newTask.itemName = req.body.item.name;
		    newTask.itemCategory = req.body.item.category;
		    newTask.save(function(err){
			  if(err){
				console.log(err);
			  }
		    });
	      }else{
            for(key in req.body){
    	      conditions = { _id: key };
    	      update = { itemCompleted: req.body[key] };
    	      task.update(conditions, update, function(err){
    		    if(err){
    			  console.log(err);
    		    }
    	      });
            }
	      }
	      res.redirect('home');
        }
 
3. Save and close the index.js file.

### Modify the index view

1. Change directories to the **views** directory and open the *index.jade* file in a text editor.

2. Replace the contents of the *index.jade* file with the code below. This defines the view for displaying existing tasks, as well as a form for adding new tasks and marking existing ones as completed.

		h1= title
		  font(color="grey") (powered by Node.js and MongoDB on Azure)
		form(action="/", method="post")
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
		form(action="/", method="post")
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

3. Save and close the *index.jade* file.

## Run Your Application Locally in the Emulator

One of the tools installed by the Windows Azure SDK is the Windows Azure compute emulator, which allows you to test your application locally. The compute emulator simulates the environment your application will run in when it is deployed to the cloud, including providing access to services like Windows Azure Table Storage. This means you can test your application without having to actually deploy it.
 1.
Close Notepad and switch back to the Windows PowerShell window. Enter the following cmdlet to run your service in the emulator and launch a browser window:
 PS C:\node\tasklist\WebRole1> Start-AzureEmulator -launch 
The –launch parameter specifies that the tools should automatically open a browser window and display the application once it is running in the emulator. A browser opens and displays “Hello World,” as shown in the screenshot below. This indicates that the service is running in the compute emulator and is working correctly.
 A web browser displaying the Hello World web page
 2.
To stop the compute emulator, you can access it (as well as the storage emulator, which you will leverage later in this tutorial) from the Windows taskbar as shown in the screenshot below:

## Deploy Your Application to Windows Azure

**TODO: Refactor once I know the cmdlets for publishing to antares**

In this section, you will use the Windows Azure portal to create a new web site, enable the Git deployment option, and finally deploy your application to Windows Azure using Git.


### Create a new web site

1. Open your web browser, navigate to the [Windows Azure portal], and then sign in. After signing in, you should see a web page similar to the following:

	(TODO Insert Screenshot)

2. Select **+ New** at the bottom of the page, then select **Web Site** and **Quick Create**. In the form, enter a name for the web site and select your subscription and the region in which to create this web site. Finally, select **Create Web Site**.

    (TODO Insert Screenshot)

3. Once the web site status changes to Running, select the name of the web site to display the dashboard for this site.

    (TODO Insert Screenshot)

3. In the lower left corner of the dashboard, select **Setup Git Publishing**.

    (TODO Insert Screenshot)

4. After the Git repository has been provisioned, you will be presented with the steps to initialize a Git repository for your Node application, as well as the steps to publish to your Windows Azure web site. Keep this page open as we will use this information in the next section.

### Git Deploy

1. Open the Terminal application if it is not already open, and change directories to the tasklist directory.

2. Issue the following commands to initialize a Git repository in this directory, and perform an initial commit of all the files:

        git init
        git add .
        git commit -m "Initial commit"

    This should return results similar to the following:

    (TODO Insert screenshot)

3. To add the Windows Azure web site you configured previously as a remote repository and deploy your application, use the commands displayed in your web browser from the previous section. These steps should appear similar to the following:

        git remote add azure https://larryfr@repository.sporf.antdf0.antares-test.windows-int.net/sporf.git
        git push azure master 

    This should return results similar to the following:

    (TODO Insert screenshot)

4. After the git push completes, you should notice your browser update to display a message confirming the deployment. This should appear similar to the following:

    (TODO Insert screenshot)

5. At this point, your web application should be available. To find the URL of the Windows Azure site at which your application is hosted, select the **Dashboard** link for your web site and then find the site URL in the **quick glance** section.

    (TODO Insert screenshot)

** Web Site Management

Using the web site dashboard, you can perform management tasks such as monitoring, pausing, or deleting your application. Additionally you can configure hosting and deployment options, as well as scale your application. For more information on using the dashboard, see **TBD**

[Node.js website]: http://nodejs.org
[MongoDB website]: http://www.mongodb.org
[Git website]: http://git-scm.com
[Windows Azure portal]: TBD

[Finished]: /media/todo_list_empty.png
[ExpressOutput]: /media/express_output.png
[npmInstall]: /media/npm_install_express_mongoose.png
[npmInstallAfterExpress]: ../media/npm_install_after_express.png
[AddItems]: /media/todo_add_item.png
[WithItems]: /media/todo_list_items.png
