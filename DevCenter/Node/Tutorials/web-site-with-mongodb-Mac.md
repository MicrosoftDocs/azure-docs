# Node.js Web Application with Storage on MongoDB

This tutorial shows you how to use [MongoDB] to store and access data from a [node] application hosted on [Windows Azure]. This guide assumes that you have some prior experience using node, MongoDB, and [Git].

This guide also assumes that you have access to a MongoDB server, such as the one created by following the steps in **TBD**

You will learn:

* How to use npm (node package manager) to install the node modules

* How to access MongoDB from a node application

* How to use the Windows Azure command-line tools to create a Windows Azure Website

By following this tutorial, you will build a simple web-based task-management application that allows creating, retrieving and completing tasks. The tasks are stored on a MongoDB server.
 
The project files for this tutorial will be stored in a directory named **tasklist** and the completed application will look similar to the following:

![A web page displaying an empty tasklist][node-mongo-finished]

The instructions in this article have been tested on the following platforms:

* Windows 7

* OS X **version???**

**Note**: This tutorial makes reference to the **~/node/helloworld** folder. This path indicates that the **node** directory is within the current user's home directory. If you wish to locate the application in a different location, or the path structure is different on the operating system you are using, you can substitute a different path. For example, **c:\node\helloworld** or **/home/username/node/helloworld**.

**Note**: The steps below reference the Terminal application, which is the command-line interface for OS X systems. If you are using an operating system other than OS X, substitue references to the Terminal application with the command-line interface available on your operating system.

##Prerequisites

Before following the instructions in this article, you should ensure that you have the following installed:

* [node] version 0.6.14 or higher

* [Git]

* A [MongoDB] server

* A text editor

* A web browser

##Install modules and generate scaffolding

In this section you will create a new Node application and use npm to add module packages. For the task-list application you will use the following modules:

* [Express] - An MVC framework

* [Mongoose] - A driver for communicating with MongoDB 

1. Create a new file named **tasklist** in the **~/node** directory. If the **~/node** directory does not exist, create it.

2. Start the Terminal application, and change directories to the **~/node/tasklist** directory.

3. Enter the following command to install the express and mongoose modules:

		npm install express -g
		npm install mongoose

    The output of these commands should appear similar to the following:

    ![npm install results][node-mongo-npm-results]

	**Note**: The '-g' parameter used when installing the express module installs it globally. This is done so that we can access the **express** command to generate website scaffolding without having to type in additional path information.

4. To create the scaffolding which will be used for this application, use the **express** command:

        express

	When prompted to overwrite the destination, enter **y** or **yes**. The output of this command should appear similar to the following:

    ![Express command output][node-mongo-express-results]

5. To install additional modules required by the express application, which are specified in the **package.json** file created by the **express** command, enter the following:

        npm install

    The output of this command should appear as follows:

    ![npm installing express modules output][node-mongo-express-npm-results]

##Using MongoDB in a node application

In this section you will extend the basic application created by the **express** command by adding a **task.js** file which contains the model for your tasks. You will also modify the existing **app.js** and **index.js** files to make use of the model.

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

5. Save and close the file.

## Modify server.js

1. In the **tasklist** directory, open the **server.js** file in a text editor. This file was created earlier by running the **express** command.

2. Add the following code after the `app.get` statement in the routes section. It will add a new route for submitting new tasks. We will create the **updateItem** function used by this route in the next section.

        app.post('/', routes.updateItem);

	After adding the previous line, the routes section should appear as follows:

		// Routes

		app.get('/', routes.index);
		app.post('/', routes.updateItem);

4. Replace the 'app.listen statement' at the end of the file with the code below. This configures Node to listen on the environment PORT value provided by Windows Azure when published to the cloud, or port 1337 when you run the application locally.

        app.listen(process.env.port || 1337);

## Modify the index controller

The controller defined in **index.js** will handle all requests for the task list site. This file can be found in the **routes** sub-directory of the **tasklist** directory.

1. Open **index.js** in your text editor and add the following statements at the beginning of the file. This will include the mongoose module, the **task.js** file you created earlier, and connect to the MongoDB server. 

		var mongoose = require('mongoose')
  		  , task = require('../models/taskModel.js');

		mongoose.connect('mongodb://mongodbserveraddr/tasks');

    **Note**: change the **mongodbserveraddr** in the `mongoose.connect` statement to the IP address or fully qualified domain name of your MongoDB server.

2. Replace the existing `exports.index` section with the following. This will find and display tasks stored in MongoDB.

		exports.index = function(req, res){
		  task.find({}, function(err, items){
		  	res.render('index',{title: 'My ToDo List ', tasks: items})
		  })
		};

2. Add the following code to the bottom of the file:

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

	This defines the **updateItem** route used when new tasks are submitted or existing tasks are marked as completed. When creating a new task, it uses the model defined earlier to create a new task object, and then saves the task to MongoDB. When updating an existing item, it performs an update by specifying a condition that identifies the document to be updated and the values to be updated. Finally, it redirects the user back to the index route.
 
3. Save and close the file.

###Modify the index view

1. Change directories to the **views** directory and open the **index.jade** file in a text editor.

2. Replace the contents of the **index.jade** file with the code below. This defines the view for displaying existing tasks, as well as a form for adding new tasks and marking existing ones as completed.

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

3. Save and close the file.

##Run your application locally

To test the application on your local machine, perform the following steps:

1. Open the Terminal application if it is not already open, and change directories to the **tasklist** directory.

2. To launch the application, use the following command:

        node server.js

3. Open your browser and navigate to http://127.0.0.1:1337. This should display a web page similar to the following:

    ![A webpage displaying an empty tasklist][node-mongo-finished]

4. Use the provided fields for **Item Name** and **Item Category** to enter information, and then click **Add item**.

    ![An image of the add item field with populated values.][node-mongo-add-item]

5. The page should update to display the item in the ToDo List table.

    ![An image of the new item in the list of tasks][node-mongo-list-items]

6. To complete a task, simply check the checkbox in the Complete column, and then click **Update tasks**. While there is no visual change after clicking **Update tasks**, the document entry in MongoDB has now been marked as completed.

6. In the Terminal application, press the **CTRL** and **C** keys to terminate the node session.

##Deploy your application to Windows Azure

In this section, you will install and use the Windows Azure command-line tools to create a new Windows Azure Website, and then use Git to deploy your application. To perform these steps you must have a Windows Azure subscription. If you do not already have a subscription, you can sign up for one [for free].

###Install the command-line tools

1. **TBD**: package download location and install steps.

###Import publishing settings

Before using the command-line tools with Windows Azure, you must first download a file containing information about your subscription. Perform the following steps to download and import this file.

1. Open the Terminal application if it is not already open, and change directories to the **tasklist** directory.

2. Enter the following command to launch the browser and navigate to the download page. If prompted, login with the account associated with your subscription.

		azure account download
	
	![The download page][download-publishing-settings]
	
	The file download should begin automatically; if it does not, you can click the link at the beginning of the page to manually download the file.

3. After the file download has completed, use the following command in the Terminal window to import the settings:

		azure account import <path-to-file>
		
	Specify the path and file name of the publishing settings file you downloaded in the previous step. Once the command completes, you should see output similar to the following:
	
	![The output of the import command][import-publishing-settings]

4. Once the import has completed, you should delete the publish settings file as it is no longer needed and contains sensitive information regarding your Windows Azure subscription.

###Create a Windows Azure Website

1. In the Terminal window, change directories to the **tasklist** directory if you are not already there.

2. Use the following command to create a new Windows Azure Website

		azure site create --git
		
	You will be prompted for the web site name and the datacenter that it will be located in. Provide a unique name and select the datacenter geographically close to your location.
	
	The `--git` parameter will create a Git repository on Windows Azure for this web site. It will also initialize a Git repository in the current directory if none exists. It will also create a [Git remote] named 'azure', which will be used to publish the application to Windows Azure. Finally, it will create a **web.config** file, which contains settings used by Windows Azure to host node applications.
	
	**Note**: If this command is ran from a directory that already contains a Git repository, it will not re-initialize the directory.
	
	**Note**: If the `--git` parameter is omitted, yet the directory contains a Git repository, the 'azure' remote will still be created.
	
	Once this command has completed, you will see output similar to the following. Note that the line beginning with **Website created at** contains the URL for the website.
	
	![output of the site create command][cmd-line-site-create-git]

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
		

[node]: http://nodejs.org
[MongoDB]: http://www.mongodb.org
[Git]: http://git-scm.com
[Windows Azure]: http://windowsazure.com
[Express]: http://expressjs.com
[Mongoose]: http://mongoosejs.com
[for free]: http://windowsazure.com
[Git remote]: http://gitref.org/remotes/

[node-mongo-finished]: ../media/todo_list_empty.png
[node-mongo-npm-results]: ../media/npm_install_express_mongoose.png
[node-mongo-express-results]: ../media/express_output.png
[node-mongo-express-npm-results]: ../media/npm_install_after_express.png
[node-mongo-add-items]: ../media/todo_add_item.png
[node-mongo-list-items]: ../media/todo_list_items.png
[download-publishing-settings]: /media/downloadpublish.png
[cmd-line-site-create-git]: /media/cmd-line-site-create-git.png
[git-add-commit]: /media/git-add-commit.png
[git-push-azure-master]: /media/git-push-azure-master.png