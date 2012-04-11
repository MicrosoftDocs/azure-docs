# Node.js Web Application with Storage on MongoDB

This tutorial describes how to use MongoDB to store and access data from a Windows Azure web site written in Node.js. This guide assumes that you have some prior experience using Node.js, MongoDB, and Git. For information on Node.js, see the [Node.js website]. For information on MongoDB, see the [MongoDB website]. For information on Git, see the [Git website].

This guide also assumes that you have access to a MongoDB server, such as the one created by following the steps in **TBD**

You will learn how to:

* Use npm (node package manager) to install the Mongoose module for Node.js.

* Use MongoDB within a Node.js application by using the Mongoose module.

* Publish a Node.js application as a Windows Azure Site.

Throughout this tutorial you will build a simple web-based task-management application that allows creating, retrieving and completing tasks, which are stored in MongoDB. MongoDB is hosted in a Windows Azure Virtual Machine, and the web application is hosted as a Windows Azure Site.
 
The project files for this tutorial will be stored in a directory named *tasklist* and the completed application will look similar to the following:

![Finished][]

## Setting up your deployment environment

In order to create and test a Node.js application, you will need the following:

* A text editor or Integrated Development Environment (IDE)

* A web browser

* Node 0.6.14 or above. You can find the latest installation for your platform at the [Node.js website].

* Git version control system for your operating system. You can find the latest installation for your platform at the [Git website].

Note: While the examples in this tutorial show vi and Chrome being used, any text editor or web browser should work.

## Creating a Node.js application

In this section you will create a new Node application and use npm to add module packages. This application will use the express module to build a task-list application, which will use MongoDB as storage.
 
For the task-list application you will use the following modules:

* Express - A web framework inspired by Sinatra.

* MongoDB - The driver for communicating with MongoDB.

Open the Terminal application and perform the following steps to create the application directory and install the required modules:

1. Enter the following commands to create a new **tasklist** directory and change to this directory.

	    mkdir tasklist
        cd tasklist

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

1. In the **tasklist** directory, create a new directory named **models**. In the **models** directory, create a new file named *taskModel.js*. This file will contain the model for the tasks created by your application.

2. At the beginning of the *taskModel.js* file, add the following code to reference required libraries:

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

4. Save and close the *taskModel.js* file.

## Modify app.js

1. In the **tasklist** directory, open the *app.js* file in a text editor. This file was created earlier by running the express command.

2. Add the following code after the `app.get` statement in the routes section. It will add a new route for submitting new tasks. We will create the *updateItem* function used by this route in the next section.

        app.post('/', routes.updateItem);

	After adding the previous line, the routes section should appear as follows:

		// Routes

		app.get('/', routes.index);
		app.post('/', routes.updateItem);

4. Replace the 'app.listen statement' at the end of the file with the code below. This configures Node to listen on the environment PORT value provided by Windows Azure when published to the cloud, or port 1337 when you run the application locally.

        app.listen(process.env.port || 1337);

## Modify the index controller

The controller defined in *index.js* will handle all requests for the task list site. This file can be found in the **routes** sub-directory of the **tasklist** directory.

1. Open *index.js* in your text editor and add the following statements at the beginning of the file. This will include the mongoose module, the *taskModel.js* file you created earlier, and connect to the MongoDB server. 

		var mongoose = require('mongoose')
  		  , taskModel = require('../models/taskModel.js');

		mongoose.connect('mongodb://mongodbserveraddr/tasks');

    **Note**: change the *mongodbserveraddr* in the `mongoose.connect` statement to the IP address or fully qualified domain name of your MongoDB server.

2. Replace the existing `exports.index` section with the following. This will find and display tasks stored in MongoDB.

		exports.index = function(req, res){
		  taskModel.find({}, function(err, items){
		  	res.render('index',{title: 'My ToDo List ', tasks: items})
		  })
		};

2. Add the following code to the bottom of the file. The code below defines the *updateItem* route used when new tasks are submitted or existing tasks are marked as completed. When creating a new task, it uses the model defined earlier to create a new task object, and then saves the task to MongoDB. When updating an existing item, it performs an update by specifying a condition that identifies the document to be updated and the values to be updated. Finally, it redirects the user back to the index route.


		exports.updateItem = function (req, res){
		  if(req.body.item){
		    task = new taskModel();
		    task.itemName = req.body.item.name;
		    task.itemCategory = req.body.item.category;
		    task.save(function(err){
			  if(err){
				console.log(err);
			  }
		    });
	      }else{
            for(key in req.body){
    	      conditions = { _id: key };
    	      update = { itemCompleted: req.body[key] };
    	      taskModel.update(conditions, update, function(err){
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

## Run your application locally

To test the application on your local machine, perform the following steps:

1. Open the Terminal application if it is not already open, and change directories to the tasklist directory.

2. To launch the application, use the following command:

        node app.js

3. Open your browser and navigate to http://127.0.0.1:1337. This should display a web page similar to the following:

    ![Finished][]

4. Use the provided fields for Item Name and Item Category to enter information, and then click **Add item**.

    ![AddItems][]

5. The page should update to display the item in the ToDo List table.

    ![WithItems][]

6. To complete a task, simply check the checkbox in the Complete column, and then click **Update tasks**. While there is no visual change after clicking **Update tasks**, the document entry in MongoDB has now been marked as completed.

6. In the terminal application, press Ctrl + C to terminate the node session.

## Deploy your application to Windows Azure

In this section, you will use the Windows Azure portal to create a new web site, enable the Git deployment option, and finally deploy your application to Windows Azure using Git.

### Configure your application

Before deploying the application to Windows Azure, we must add a *web.config* file to the root of the tasklist directory. This file contains settings that instruct Windows Azure on how to run your Node application, such as adding the iisnode handler and adding a rule to direct incoming requests to the *app.js* file. Using a text editor, create the *web.config* file and add the following:

    <?xml version="1.0" encoding="utf-8"?>
      <configuration>
        <appSettings>
          <add key="EMULATED" value="true" />
        </appSettings>
        <system.webServer>
          <modules runAllManagedModulesForAllRequests="false" />
          <handlers>
            <add name="iisnode" path="app.js" verb="*" modules="iisnode" />
          </handlers>
          <rewrite>
            <rules>
              <clear />
              <rule name="app" enabled="true" patternSyntax="ECMAScript" stopProcessing="true">
                  <match url="app\.js.+" negate="true" />
                  <conditions logicalGrouping="MatchAll" trackAllCaptures="false" />
                  <action type="Rewrite" url="app.js" />
              </rule>
            </rules>
          </rewrite>
        </system.webServer>
      </configuration>

Save this file to the tasklist directory.

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
