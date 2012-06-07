<properties linkid="dev-nodejs-mongodb" urldisplayname="Web App with MongoDB" headerexpose="" pagetitle="Node.js Web Application with Storage on MongoDB" metakeywords="" footerexpose="" metadescription="" umbraconavihide="0" disquscomments="1"></properties>

<div class="dev-center-os-selector"><a href="/en-us/develop/nodejs/tutorials/web-app-with-mongodb/" title="Windows Version" class="windows current">Windows</a> <a href="/en-us/develop/nodejs/tutorials/website-with-mongodb-(mac)/" title="Mac Version" class="mac">Mac</a> <span>Tutorial</span></div>

# Node.js Web Application with Storage on MongoDB

This tutorial describes how to use MongoDB to store and access data from
a Windows Azure application written in Node.js. This guide assumes that
you have some prior experience using Windows Azure and Node.js. For an
introduction to Windows Azure and Node.js, see [Node.js Web
Application]. The guide also assumes that you have some knowledge of
MongoDB. For an overview of MongoDB, see the [MongoDB website][].

In this tutorial, you will learn how to:

-   Add MongoDB support to an existing Windows Azure service that was
    created using the Windows Azure SDK.

-   Use npm to install the MongoDB driver for Node.js.

-   Use MongoDB within a Node.js application.

-   Run your MongoDB Node.js application locally using the Windows Azure
    compute emulator.

-   Publish your MongoDB Node.js application to Windows Azure.

Throughout this tutorial you will build a simple web-based
task-management application that allows retrieving and creating tasks
stored in MongoDB. MongoDB is hosted in a Windows Azure worker role, and
the web application is hosted in a web role.

The project files for this tutorial will be stored in ***C:\\node*** and
the completed application will look similar to:

![task list application screenshot][]

## Setting up the deployment environment

Before you can begin developing your Windows Azure application, you need
to get the tools and set up your development environment. For details
about getting and installing the Windows Azure SDK for Node.js, see
[Setup the Development Environment][] in the Node.js Web Application
tutorial.

NOTE: this tutorial requires Node 0.6.10 or above. The version included in the current Windows Azure SDK for Node.js may be higher; however if you
have installed a previous version of Node you will need to [upgrade to the
latest version][Setup the Development Environment].

## Install Windows Azure Tools for MongoDB and Node.js

To get MongoDB running inside Windows Azure and to create the necessary
connections between Node and MongoDB, you will need to install the
[AzureMongoDeploymentCmdlets][] package.

1.  Download and run the Windows Azure Tools for MongoDB and Node.js MSI
    from the [MongoDB download site][AzureMongoDeploymentCmdlets].

    ![Windows Azure Tools for MongoDB and Node.js Installer][]

## Launching Windows Azure PowerShell

The Windows Azure SDK includes a Windows PowerShell
environment that is configured for Windows Azure and Node development.
Installing the Windows Azure Tools for MongoDB and Node.js also
configured the enviroment to include the MongoDB Windows PowerShell
cmdlets.

1.  On the **Start** menu, click **All Programs**, click **Windows Azure**. Some of the commands require Administrator permissions, so right-click **Windows Azure PowerShell** and click **Run as administrator**.

    ![launch PowerShell environment][]

## Download the MongoDB Binary Package

1.  You must download the MongoDB binaries as a separate package, in
    addition to installing the Windows Azure Tools for MongoDB and
    Node.js. Use the **Get-AzureMongoDBBinaries** cmdlet to download the
    binaries:

        PS C:\> Get-AzureMongoDBBinaries

    You will see the following response:

    ![Get-AzureMongoDBBinaries output][]

## Create a new application

1.  Create a new **node** directory on your C drive and change to the
    c:\\node directory. If you have completed other Windows Azure
    tutorials in Node.js, this directory may already exist.

    ![create directory][]

2.  Use the **New-AzureService** cmdlet to create a new solution:

        PS C:\node> New-AzureService tasklistMongo

    You will see the following response:

    ![New-AzureService cmdlet response][]

3.  Enter the following command to add a new web role instance:

        PS C:\node\tasklistMongo> Add-AzureNodeWebRole

    You will see the following response:

    ![task list application][]

4.  Enter the following command to change to the newly generated
    directory:

        PS C:\node\tasklistMongo> cd WebRole1

5.  To get started, you will create a simple application that shows the
    status of your running MongoDB database. Run the following command
    to copy starter code into your server.js file:

        PS C:\node\tasklistMongo\WebRole1> copy "C:\Program Files (x86)\MongoDB\Windows Azure\Nodejs\Scaffolding\MongoDB\NodeIntegration\WebRole\node_modules\azureMongoEndpoints\examples\showStatusSample\mongoDbSample.js" server.js

6.  Enter the following command to open the updated file in notepad.

        PS C:\node\tasklistMongo\WebRole1> notepad server.js

    You can see that the file is querying the mongoDB database to
    display status.

7.  Close the file when you are done reviewing it.

8.  The server.js code references a worker role called ReplicaSetRole
    that hosts MongoDB. Enter the following command to create
    ReplicaSetRole (which is the default role name) as a new MongoDB
    worker role:

        PS C:\node\tasklistMongo\WebRole1> Add-AzureMongoWorkerRole

    ![Add-AzureMongoWorkerRole cmdlet response][]

9.  The final step before you can deploy is joining the roles running
    Node and MongoDB so the web application can communicate with
    MongoDB. Use the following command to integrate them.

        PS C:\node\tasklistMongo\WebRole1> Join-AzureNodeRoleToMongoRole WebRole1

    ![Join-AzureNodeRoleToMongoRole cmdlet response][]

10. The response of the **Join-AzureNodeRoleToMongoRole** command shows
    the npm (node package manager) command to use to install the MongoDB
    driver for Node.js. Run the following command to install the MongoDB
    driver:

        PS C:\node\tasklistMongo\WebRole1> npm install mongodb

11. By default your application will be configured to include one
    WebRole1 instance and one ReplicaSetRole instance. In order to
    enable MongoDB replication, you need three instances of
    ReplicaSetRole. Run the following command to specify that three
    instances of ReplicaSetRole should be created:

        PS C:\node\tasklistMongo\WebRole1> Set-AzureInstances ReplicaSetRole 3

## Running Your Application Locally in the Emulator

1.  Enter the following command to run your service in the emulator and
    launch a browser window:

        PS C:\node\tasklistMongo\WebRole1> Start-AzureEmulator -launch

    A browser will open and display content similar to the details shown
    in the screenshot below. This indicates that the service is running
    in the compute emulator and is working correctly.

    ![application running in emulator][]

    Running the application in the emulator also starts instances of
    mongod.exe and AzureEndpointsAgent.exe running on your local
    machine. You will see three console windows open for the mongod.exe
    instances, one for each replicated instance. A fourth console
    window will open for AzureEndpointsAgent.exe. Calling
    Stop-AzureEmulator will also cause the instances of these
    applications to stop.

    <div class="dev-callout">
	<b>Note</b>
	<p>In some cases, your browser window may launch and attempt
    to load the web application before your worker role instances are
    running, which will cause an error message to be displayed in the
    browser. If this occurs, refreshing the page in the browser when the
    worker role instances are running will result in the page being
    displayed correctly.</p>
	</div>

2.  To stop the compute emulator, enter the following command:

        PS C:\node\tasklistMongo\WebRole1> Stop-AzureEmulator

## Creating a Node.js application using express and other tools

In this section you will pull additional module packages into your
application using npm. You will then extend your earlier application
using the express module to build a task-list application that stores
data in MongoDB.

For the task-list application you will use the following modules (in
addition to the mongodb module that you installed earlier):

-   express - A web framework inspired by Sinatra.

-   node-uuid - A utility library for creating universally unique
    identifiers (UUIDs) (similar to GUIDs)

1.  To install the modules, enter the command below from WebRole1
    folder:

        PS C:\node\tasklistMongo\WebRole1> npm install express node-uuid

2.  You will use the scaffolding tool included with the express package,
    by entering the command below from WebRole1 folder:

        PS C:\node\tasklistMongo\WebRole1> .\node_modules\.bin\express

3.  You will be prompted to overwrite your earlier application. Enter
    **y** or **yes** to continue, and express will generate a folder
    structure for building your application.

    ![linstalling express module][]

4.  Delete your existing server.js file and rename the generated app.js
    file to server.js. This is needed because the Windows Azure web role
    in your application is configured to dispatch HTTP requests to
    server.js.

        PS C:\node\tasklistMongo\WebRole1> del server.js
        PS C:\node\tasklistMongo\WebRole1> ren app.js server.js

5.  To install the jade engine, enter the following command:

        PS C:\node\tasklistMongo\WebRole1> npm install

    npm will now download additional dependencies defined in the
    generated package.json file

## Using MongoDB in a Node application

In this section you will extend your application to create a web-based
task-list application that you will deploy to Windows Azure. The task list will
allow a user to retrieve tasks, add new tasks, and mark tasks as
completed. The application will utilize MongoDB to store task data.

### Create the connector for the MongoDB driver

1.  The *taskProvider.js* file will contain the connector for the
    MongoDB driver for the tasklist application. The MongoDB driver taps
    into the existing Windows Azure resources to provide connectivity.
    Enter the following command to create and open the taskProvider.js
    file:

        PS C:\node\tasklistMongo\WebRole1> notepad taskProvider.js

2.  At the beginning of the file add the following code to reference
    required libraries:

        var AzureMongoEndpoint = require('azureMongoEndpoints').AzureMongoEndpoint;
        var mongoDb = require('mongodb').Db;
        var mongoDbConnection = require('mongodb').Connection;
        var mongoServer = require('mongodb').Server;
        var bson = require('mongodb').BSONNative;
        var objectID = require('mongodb').ObjectID;

3.  Next, you will add code to set up the **TaskProvider** object. This
    object will be used to perform interactions with the MongoDB
    database.

        var TaskProvider = function() {
          var self = this;
          
          // Create mongodb azure endpoint
          var mongoEndpoints = new AzureMongoEndpoint('ReplicaSetRole', 'MongodPort');
          
          // Watch the endpoint for topologyChange events
          mongoEndpoints.on('topologyChange', function() {
            if (self.db) {
              self.db.close();
              self.db = null;
            }
            
            var mongoDbServerConfig = mongoEndpoints.getMongoDBServerConfig();
            self.db = new mongoDb('test', mongoDbServerConfig, {native_parser:false});
            self.db.open(function() {});
          });
          
          mongoEndpoints.on('error', function(error) {
            throw error;
          });
        };

    Note that the **mongoEndpoints** object is used to get the MongoDB
    endpoint listener. This listener keeps track of the IP addresses
    associated with the running MongoDB servers and will automatically
    be updated as MongoDB server instances come on and off line.

4.  The remaining code to finish off the MongoDB driver is fairly
    standard code that you may be familiar with from previous MongoDB
    projects:

        TaskProvider.prototype.getCollection = function(callback) {
          var self = this;

          var ensureMongoDbConnection = function(callback) {
            if (self.db.state !== 'connected') {
              self.db.open(function (error, client) {
                callback(error);
              });
            } else {
              callback(null);      
            }
          }

          ensureMongoDbConnection(function(error) {
            if (error) {
              callback(error);
            } else {
              self.db.collection('task', function(error, task_collection) {
                if (error) {
                  callback(error);
                } else {
                  callback(null, task_collection);
                }
              });
            }
          });
        };

        TaskProvider.prototype.findAll = function(callback) {
          this.getCollection(function(error, task_collection) {
            if (error) {
              callback(error)
            } else {
              task_collection.find().toArray(function(error, results) {
                if (error) {
                  callback(error)
                } else {
                  callback(null, results)
                }
              });
            }
          });
        };

        TaskProvider.prototype.save = function(tasks, callback) {
          this.getCollection(function (error, task_collection) {
            if (error) {
              callback(error)
            } else {
              if (typeof (tasks.length) == "undefined") {
                tasks = [tasks];
              }

              for (var i = 0; i < tasks.length; i++) {
                task = tasks[i];
                task.created_at = new Date();
              }
              
              task_collection.insert(tasks, function (err) {
                callback(null, tasks);
              });
            }
          });
        };

        exports.TaskProvider = TaskProvider;

5.  Save and close the taskprovider.js file.

### Modify server.js

1.  Enter the following command to open the server.js file:

        PS C:\node\tasklistMongo\WebRole1> notepad server.js

2.  Include the node-uuid, home, and azure modules. The home module does
    not exist yet, but you will create it shortly. Add the code below
    after the line that ends with express.createServer().

    ![server.js snippet][]

        var TaskProvider = require('./taskProvider').TaskProvider;
        var taskProvider = new TaskProvider();
        var Home = require('./home');
        var home = new Home(taskProvider);

3.  Replace the existing code in the route section with the code below.
    It will create a home controller instance and route all requests to
    "/" or "/home" to it.

    ![server.js snippet][1]

        //Routes
        var home = new Home(taskProvider);
        app.get('/', home.showItems.bind(home));
        app.get('/home', home.showItems.bind(home));

4.  Replace the last two lines of the file with the code below. This
    configures Node to listen on the environment PORT value provided by
    Windows Azure when published to the cloud.

    ![server.js snippet][2]

        app.listen(process.env.port);

5.  Save and close the server.js file.

## Create the home controller

The home controller will handle all requests for the task list site.

1.  Create a new home.js file in Notepad, using the command below. This
    will be the controller for handling the logic for the task list.

        PS C:\node\tasklistMongo\WebRole1> notepad home.js

2.  Replace the contents with the code below and save the file. The code
    below uses the javascript module pattern. It exports a Home
    function. The Home prototype contains the functions to handle the
    actual requests.

        module.exports = Home;
        function Home (taskProvider) {
          this.taskProvider = taskProvider;
        };
        Home.prototype = {
          showItems: function (req, res) {
            var self = this;
            this.getItems(function (error, tasklist) {
              if (!tasklist) {
                tasklist = [];
              }
              self.showResults(res, tasklist);
            });
          },
          getItems: function (callback) {
            this.taskProvider.findAll(callback);
          },
          showResults: function (res, tasklist) {
            res.render('home', { title: 'Todo list', layout: false, tasklist: tasklist });
          },
        };

    Your home controller now includes three functions:

    -   *showItems* handles the request.

    -   *getItems* uses the table client to retrieve open task items
        from your tasks table. Notice that the query can have additional
        filters applied; for example, the above query filters only show
        tasks where completed is equal to false.

    -   *showResults* calls the Express render function to render the
        page using the home view that you will create in the next
        section.

3.  Save and close the home.js file.

### Modify the home view using jade

1.  From the Windows Azure PowerShell command window, change to the views
    folder and create a new home.jade file by calling the following
    commands:

        PS C:\node\tasklistMongo\WebRole1> cd views
        PS C:\node\tasklistMongo\WebRole1\views> notepad home.jade

2.  Replace the contents of the home.jade file with the code below and
    save the file. The form below contains functionality for reading and
    updating the task items. (Note that currently the home controller
    only supports reading; you will change this later.) The form
    contains details for each item in the task list.

        html
        head
        title Index
        body
        h1 My ToDo List
        form
        table(border="1")
          tr
            td Name
            td Category
            td Date
            td Complete
            each item in tasklist
              tr
                td #{item.name}
                td #{item.category}
                td #{item.date}
                td
                  input(type="checkbox", name="completed", value="#{item.RowKey}")

3.  Save and close the home.jade file.

## Run your application locally in the emulator

1.  In the Windows Azure PowerShell window, enter the following command to
    launch your service in the compute emulator and display a web page
    that calls your service.

        PS C:\node\tasklistMongo\WebRole1\views> Start-AzureEmulator -launch

    When the emulator is running, your browser will display the
    following page, showing the structure for task items that will be
    retrieved from MongoDB:

    ![screenshot of app running in emulator][]

## Adding new task functionality

In this section you will update the application to support adding new
task items.

1.  First, add a new route to server.js. In the server.js file, add the
    following line after the last route entry for /home, and then save
    the file.

    ![server.js snippet][3]

        app.post('/home/newitem', home.newItem.bind(home));

    The routes section should now look as follows:

        // Routes
        var home = new Home(client);
        app.get('/', home.showItems.bind(home));
        app.get('/home', home.showItems.bind(home));
        app.post('/home/newitem', home.newItem.bind(home));

2.  In order to use the node-uuid module to create a unique identifier,
    add the following line at the top of the home.js file after the
    first line where the module is exported.

    ![home.js snippet][]

        var uuid = require('node-uuid');

3.  To implement the new item functionality, create a newItem function.
    In your home.js file, paste the following code after the last
    function and then save the file.

    ![home.js snippet 2][]

        newItem: function (req, res) {
          var self = this;
          var createItem = function (resp, tasklist) {
            if (!tasklist) {
              tasklist = [];
            }
            var count = tasklist.length;
            var item = req.body.item;
            item.completed = false;

            var newtasks = new Array();
            newtasks[0] = item;
            
            self.taskProvider.save(newtasks,function (error, tasks) {
            self.showItems(req, res);
            });
          };
          this.getItems(createItem);
        },

    The newItem function performs the following tasks:

    -   Extracts the posted item from the body.

    -   Inserts the item into the tasks table by calling the
        insertEntity function.

    -   Renders the page by calling the save function.

4.  Now, update the view by adding a new form to allow the user to add
    an item. In the home.jade file, paste the following code at the end
    of the file and save. Note that in Jade, whitespace is significant,
    so do not remove any of the spacing below.

        hr
        form(action="/home/newitem", method="post")
          table(border="1")
            tr
              td Item Name:
              td
                input(name="item[name]", type="textbox")
            tr
              td Item Category:
              td
                input(name="item[category]", type="textbox")
            tr
              td Item Date:
              td
                input(name="item[date]", type="textbox")
                input(type="submit", value="Add item")

5.  Because the Windows Azure emulator is already running, you can
    browse the updated application:

        PS C:\node\tasklistMongo\WebRole1\views> start http://localhost:81/home

    The browser will open and display the following page:

    ![screenshot of task list application in emulator][]

6.  Enter the following values:

    -   **Item Name:** New task functionality

    -   **Item Category:** Site work

    -   **Item Date:** 01/05/2012

7.  Then click **Add item**.

    The item will be added to your tasks table in MongoDB and displayed
    as shown in the screenshot below.

    ![task list application running in emulator][]

8.  Enter the following command to stop the Windows Azure compute
    emulator.

        PS C:\node\tasklistMongo\WebRole1\views> Stop-AzureEmulator

## Deploying the application to Windows Azure

In order to deploy your application to Windows Azure, you need an
account. Once you are logged in with your account, you can download a
Windows Azure publishing profile, which will authorize your machine to
publish deployment packages to Windows Azure using the Windows
PowerShell commands.

### Create a Windows Azure account

If you do not already have a Windows Azure account, you can sign up for
a free trial account.

1.  Open a web browser, and browse to [http://www.windowsazure.com][].

2.  To get started with a free account, click on **Free Trial** in the
    upper right corner and follow the steps

### Download the Windows Azure Publishing Settings

If this is the first Node.js application that you are deploying to
Windows Azure, you will need to install publishing settings to your
machine before deploying. For details about downloading and installing
Windows Azure publishing settings, see [Downloading the Windows Azure
Publishing Settings] in the Node.js Web Application tutorial.

### Publish the Application

1.  MongoDB requires access to a Windows Azure storage account to store
    data and replication information. Before publishing, run the
    following command to set the proper storage account. This command is
    specifying a storage account called **taskListMongo** that will be
    used to store the MongoDB data. This account will be automatically
    created if it doesn't already exist. **Subscription-1** is the
    default subscription name that is used when you create a free trial
    account. Your subscription name may be different; if so, replace
    **Subscription-1** with the name of your subscription.

        PS C:\node\tasklistMongo\WebRole1\views> Set-AzureMongoStorageAccount -StorageAccountName taskListMongo -Subscription "Subscription-1"
              

2.  Publish the application using the **Publish-AzureService** command,
    as shown below. Note that the name specified must be unique across
    all Windows Azure services. For this reason, taskListMongo is
    prefixed with Contoso, the company name, to make the service name
    unique.

        PS C:\node\tasklistMongo\WebRole1\views> Publish-AzureService -name ContosoTaskListMongo -location "North Central US" -launch
              

    After the deployment is complete, the browser will also open to the
    URL for your service and display a web page that calls your service.

## Stop and Delete the Application

Windows Azure bills role instances per hour of server time consumed, and
server time is consumed while your application is deployed, even if the
instances are not running and are in the stopped state. With your web
role plus three instances of the MongoDB worker role, your application
is currently running four Windows Azure instances.

The following steps describe how to stop and delete your application.

1.  In the Windows Azure PowerShell window, call the **Stop-AzureService**
    command to stop the service deployment created in the previous
    section:

        PS C:\node\tasklistMongo\WebRole1\views> Stop-AzureService

    Stopping the service may take several minutes. When the service is
    stopped, you will receive a message indicating that it has stopped.

2.  To delete the service, call the **Remove-AzureService** command:

        PS C:\node\tasklistMongo\WebRole1\views> Remove-AzureService
              

3.  When prompted, enter **Y** to delete the service.

    After the service has been deleted you will receive a message
    indicating that the service has been deleted.

  [Node.js Web Application]: http://www.windowsazure.com/en-us/develop/nodejs/tutorials/getting-started/
  [MongoDB website]: http://www.mongodb.org/
  [task list application screenshot]: ../Media/mongo_tutorial01.png
  [Setup the Development Environment]: http://www.windowsazure.com/en-us/develop/nodejs/tutorials/getting-started/#setup
  [AzureMongoDeploymentCmdlets]: http://downloads.mongodb.org/azure/AzureMongoDeploymentCmdlets.msi
  [Windows Azure Tools for MongoDB and Node.js Installer]: ../Media/mongo_tutorial02.png
  [launch PowerShell environment]: ../../Shared/Media/azure-powershell-menu.png
  [Get-AzureMongoDBBinaries output]: ../Media/mongo_tutorial01-1.png
  [create directory]: ../Media/getting-started-6.png
  [New-AzureService cmdlet response]: ../Media/mongo_tutorial06.png
  [task list application]: ../Media/mongo_tutorial07.png
  [Add-AzureMongoWorkerRole cmdlet response]: ../Media/mongo_tutorial08.png
  [Join-AzureNodeRoleToMongoRole cmdlet response]: ../Media/mongo_tutorial09.png
  [application running in emulator]: ../Media/mongo_tutorial10.png
  [linstalling express module]: ../Media/mongo_tutorial11.png
  [server.js snippet]: ../Media/mongo_tutorial12.png
  [1]: ../Media/mongo_tutorial13.png
  [2]: ../Media/node27.png
  [screenshot of app running in emulator]: ../Media/mongo_tutorial14.png
  [3]: ../Media/mongo_tutorial15.png
  [home.js snippet]: ../Media/mongo_tutorial16.png
  [home.js snippet 2]: ../Media/mongo_tutorial17.png
  [screenshot of task list application in emulator]: ../Media/mongo_tutorial18.png
  [task list application running in emulator]: ../Media/mongo_tutorial19.png
  [http://www.windowsazure.com]: http://www.windowsazure.com
  [Downloading the Windows Azure Publishing Settings]: http://www.windowsazure.com/en-us/develop/nodejs/tutorials/getting-started/#download_publishing_settings
