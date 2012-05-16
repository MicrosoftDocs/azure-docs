<properties umbraconavihide="0" pagetitle="Web App with Storage" metakeywords="Azure Node.js hello world tutorial, Azure Node.js hello world, Azure Node.js Getting Started tutorial, Azure Node.js tutorial, Azure Node.js Express tutorial" metadescription="A tutorial that builds on the Web App with Express tutorial by adding Windows Azure Storage services and the Azure module." linkid="dev-nodejs-basic-web-app-with-storage" urldisplayname="Web App with Storage" headerexpose footerexpose disquscomments="1"></properties>

# Node.js Web Application using Storage

In this tutorial, you will extend the application created in the
[Node.js Web Application using Express][] tutorial by using the Windows
Azure Client Libraries for Node.js to work with storage services. You
will extend your application to create a web-based task-list application
that you can deploy to Windows Azure. The task list allows a user to
retrieve tasks, add new tasks, and mark tasks as completed.

The task items are stored in Windows Azure Storage. Windows Azure
Storage provides unstructured data storage that is fault-tolerant and
highly available. Windows Azure Storage includes several data structures
where you can store and access data, and you can leverage the storage
services from the APIs included in the Windows Azure SDK for Node.js or
via REST APIs. For more information, see [Storing and Accessing Data in
Windows Azure][].

This tutorial assumes that you have completed the [Node.js Web
Application][] and [Node.js with Express][Node.js Web Application using
Express] tutorials.

You will learn:

-   How to work with the Jade template engine
-   How to work with Windows Azure Storage services

A screenshot of the completed application is below:

![The completed web page in internet explorer][]

## Setting Storage Credentials in Web.Config

To access Windows Azure Storage, you need to pass in storage
credentials. To do this, you utilize web.config application settings.
Those settings will be passed as environment variables to Node, which
are then read by the Windows Azure SDK.

**Note**: Storage credentials are only used when the application is
deployed to Windows Azure. When running in the emulator, the application
will use the storage emulator.

Perform the following steps to retrieve the storage account credentials
and add them to the web.config settings:

1.  If it is not already open, start the Windows Azure PowerShell for
    Node.js from the **Start** menu by expanding **All Programs, Windows
    Azure SDK Node.js - November 2011**, right-click **Windows Azure
    PowerShell for Node.js**, and then select **Run As Administrator**.

2.  Change directories to the folder containing your application. For
    example, C:\\node\\tasklist\\WebRole1.

3.  From the Windows Powershell window enter the following cmdlet to
    retrieve the storage account information:

        PS C:\node\tasklist\WebRole1> Get-AzureStorageAccounts

    This retrieves the list of storage accounts and account keys
    associated with your hosted service.

    **Note**: Since the Windows Azure SDK for Node.js creates a storage
    account when you deploy a service, a storage account should already
    exist from deploying your application in the previous guides.

4.  Open the web.cloud.config file containing the environment settings
    that are used when the application is deployed to Windows Azure:

        PS C:\node\tasklist\WebRole1> notepad web.cloud.config

5.  Insert the following block under **configuration** element,
    substituting {STORAGE ACCOUNT} and {STORAGE ACCESS KEY} with the
    account name and the primary key for the storage account you want to
    use for deployment:

        <appSettings>
          <add key="AZURE_STORAGE_ACCOUNT" value="{STORAGE ACCOUNT}"/>
          <add key="AZURE_STORAGE_ACCESS_KEY" value="{STORAGE ACCESS KEY}"/>
        </appSettings>

    ![The web.cloud.config file contents][]

6.  Save the file and close notepad.

## Install Modules

In order to use Windows Azure Storage services, you must install the
Azure module for node. You must also install the node-uuid module, as
this will be used to generate universally unique identifiers (UUIDs). To
install these modules, enter the command below:

    PS C:\node\tasklist\WebRole1> npm install node-uuid azure

After the command completes, the modules have been added to the
**node\_modules** folder. Perform the following steps to make use of
these modules in your application:

1.  Open the server.js file:

        PS C:\node\tasklist\WebRole1> notepad server.js

2.  Add the code below after the line that ends with
    express.createServer() to include the node-uuid, home, and azure
    modules. The home module does not exist yet, but you will create it
    shortly.

    ![The server.js code with line 'var app = modules.exports =
    express.createServer();' highlighted][]

        var uuid = require('node-uuid');
        var Home = require('./home');
        var azure = require('azure');

3.  Add code to create a storage table client passing in storage account
    and access key information.

    **Note**: When running in the emulator, the SDK will automatically
    use the emulator even though storage account information has been
    provided via web.config.

        var client = azure.createTableService();

4.  Next, create a table in Windows Azure Storage called tasks. The
    logic below creates a new table if it doesn't exist, and populates
    the table with some default data.

        //table creation
        client.createTableIfNotExists('tasks', function(error){
            if(error){
                throw error;
            }

            var item = {
                name: 'Add readonly task list',
                category: 'Site work',
                date: '12/01/2011',
                RowKey: uuid(),
                PartitionKey: 'partition1',
                completed: false
            };

            client.insertEntity('tasks', item, function(){});

        });

5.  Replace the existing code in the route section with the code below,
    which creates a home controller instance and routes all requests to
    **/** or **/home** to it.

    ![The server.js file with the lines containing //routes app.get('/',
    routes.index); app.get('/home',function(req,res){ res.render('home',
    { title: 'Home'});}); selected.][]

        var home = new Home(client);
        app.get('/', home.showItems.bind(home));
        app.get('/home', home.showItems.bind(home));

    Notice that instead of handling the request inline, you are now
    delegating the command to a Home object. The **bind** command is
    necessary to ensure that these references are properly resolved
    locally within the home controller.

## Creating the Home Controller

You must now create a home controller, which handles all requests for
the task list site. Perform the following steps to create the
controller:

1.  Create a new home.js file in Notepad. This file will contain the
    controller code that hands the logic for the task list.

        PS C:\node\tasklist\WebRole1> notepad home.js

2.  Replace the contents with the code below and save the file. The code
    below uses the javascript module pattern. It exports a Home
    function. The Home prototype contains the functions to handle the
    actual requests.

        var azure=require('azure');
        module.exports = Home;

        function Home (client) {
            this.client = client;
        };

        Home.prototype = {
            showItems: function (req, res) {
                var self = this;
                this.getItems(false, function (resp, tasklist) {
                    if (!tasklist) {
                        tasklist = [];
                    }			
                    self.showResults(res, tasklist);
                });
            },

            getItems: function (allItems, callback) {
                var query = azure.TableQuery
                    .select()
                    .from('tasks');
        	
                if (!allItems) {
                    query = query.where('completed eq ?', 'false');
                }
                this.client.queryEntities(query, callback);
             },

             showResults: function (res, tasklist) {
                res.render('home', { 
                    title: 'Todo list', 
                    layout: false, 
                    tasklist: tasklist });
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

### Modifying the Home View

The Jade template engine uses a markup syntax that is less verbose than
HTML and it is the default engine for working with Express. Perform the
following steps to create a view that supports displaying task-list
items:

1.  From the Windows PowerShell command window, edit home.jade file by
    using the following command:

        PS C:\node\tasklist\WebRole1\views> notepad home.jade

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

## Running the Application in the Compute Emulator

1.  In the Windows PowerShell window, enter the following cmdlet to
    launch your service in the compute emulator and display a web page
    that calls your service.

        PS C:\node\tasklist\WebRole1> Start-AzureEmulator -launch

    Your browser displays the following page, showing the task item that
    was retrieved from Windows Azure Storage:

    ![Internet explorer displaying a 'My Tasklist' page with one item in
    a table.][]

## Adding New Task Functionality

In this section you update the application to support adding new task
items.

### Adding a New Route to Server.js

In the server.js file, add the following line after the last route entry
for**/home**, and then save the file.

![The server.js file with the line containing app.get('/home',
home.showItems.bind(home)); highlighted.][]

        app.post('/home/newitem', home.newItem.bind(home));

The routes section should now look as follows:

       // Routes

       var home = new Home(client);
       app.get('/', home.showItems.bind(home));
       app.get('/home', home.showItems.bind(home));
       app.post('/home/newitem', home.newItem.bind(home));

### Adding the Node-UUID Module

To use the node-uuid module to create a unique identifier, add the
following line at the top of the home.js file after the first line where
the module is exported.

![The home.js file with the line module.exports = Home highlighted.][]

       var uuid = require('node-uuid');

### Adding the New Item Function to Home Controller

To implement the new item functionality, create a **newItem** function.
In your home.js file, paste the following code after the last function
and then save the file.

![The showresults: function is highlighted][]

       newItem: function (req, res) {
           var self = this;
           var createItem = function (resp, tasklist) {
               if (!tasklist) {
                   tasklist = [];
               }

               var count = tasklist.length;

               var item = req.body.item;
               item.RowKey = uuid();
               item.PartitionKey = 'partition1';
               item.completed = false;

               self.client.insertEntity('tasks', item, function (error) {
                   if(error){  
                       throw error;
                   }
                   self.showItems(req, res);
               });
           };

           this.getItems(true, createItem);
       },

The **newItem** function performs the following tasks:

-   Extracts the posted item from the body.
-   Sets the **RowKey** and **PartitionKey** values for the new item.
    These values are required to insert the item into the Windows Azure
    table. A UUID is generated for the **RowKey** value.
-   Inserts the item into the tasks table by calling the
    **insertEntity** function.
-   Renders the page by calling the **getItems** function.

### Adding the New Item Form to the Home View

Now, update the view by adding a new form to allow the user to add an
item. In the home.jade file, paste the following code at the end of the
file and save. Note that in Jade, whitespace is significant, so do not
remove any of the spacing below.

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

### Running the Application in the Emulator

1.  Because the Windows Azure emulator is already running, you can
    browse the updated application:

        PS C:\node\tasklist\WebRole1> start http://localhost:81/home

    The browser opens and displays the following page:

    ![A web paged titled My Task List with a table containing tasks and
    fields to add a new task.][]image

2.  Enter for **Item Name:** "New task functionality", **Item
    Category:** "Site work"?, and for **Item Date:** "12/02/2011". Then
    click **Add item**.

    The item is added to your tasks table in Windows Azure Storage and
    displayed as shown in the screenshot below.

![A web page titled My Task List with a table containing tasks, after
you have added a task to the list.][]image

## Re-Publishing the Application to Windows Azure

Now that the application is completed, publish it to Windows Azure by
updating the deployment to the existing hosted service.

1.  In the Windows PowerShell window, call the following cmdlet to
    redeploy your hosted service to Windows Azure. Your storage settings
    and location were previous saved and do not need to be re-entered.

        PS C:\node\tasklist\WebRole1> Publish-AzureService -launch

    After the deployment is complete, the following response appears:

    ![the status messages displayed during deployment.][]

    As before, because you specified the **-launch** option, the browser
    opens and displays your application running in Windows Azure when
    publishing is completed.

    ![A browser window displaying the My Task List page. The URL
    indicates the page is now being hosted on Windows Azure.][]

## Stopping and Deleting Your Application

After deploying your application, you may want to disable it so you can
avoid costs or build and deploy other applications within the free trial
time period.

Windows Azure bills web role instances per hour of server time consumed.
Server time is consumed once your application is deployed, even if the
instances are not running and are in the stopped state.

The following steps show you how to stop and delete your application.

1.  In the Windows PowerShell window, stop the service deployment
    created in the previous section with the following cmdlet:

        PS C:\node\tasklist\WebRole1> Stop-AzureService

    Stopping the service may take several minutes. When the service is
    stopped, you receive a message indicating that it has stopped.

    ![Status messages indicating the service has stopped.][]

2.  To delete the service, call the following cmdlet:

        PS C:\node\tasklist\WebRole1> Remove-AzureService

3.  When prompted, enter **Y** to delete the service.

    Deleting the service may take several minutes. After the service has
    been deleted you receive a message indicating that the service was
    deleted.

    ![Status messages indicating the service has been deleted.][]

  [Node.js Web Application using Express]: http://www.windowsazure.com/en-us/develop/nodejs/tutorials/web-app-with-express/
  [Storing and Accessing Data in Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx
  [Node.js Web Application]: http://www.windowsazure.com/en-us/develop/nodejs/tutorials/getting-started/
  [The completed web page in internet explorer]: ../../../DevCenter/Node/Media/getting-started-1.png
  [The web.cloud.config file contents]: ../../../DevCenter/Node/Media/node37.png
  [The server.js code with line 'var app = modules.exports = express.createServer();' highlighted]: ../../../DevCenter/Node/Media/node38.png
  [The server.js file with the lines containing //routes app.get('/', routes.index); app.get('/home',function(req,res){ res.render('home', { title: 'Home'});}); selected.]: ../../../DevCenter/Node/Media/node39.png
  [Internet explorer displaying a 'My Tasklist' page with one item in a table.]: ../../../DevCenter/Node/Media/node40.png
  [The server.js file with the line containing app.get('/home', home.showItems.bind(home)); highlighted.]: ../../../DevCenter/Node/Media/node41.png
  [The home.js file with the line module.exports = Home highlighted.]: ../../../DevCenter/Node/Media/node42.png
  [The showresults: function is highlighted]: ../../../DevCenter/Node/Media/node43.png
  [A web paged titled My Task List with a table containing tasks and fields to add a new task.]: ../../../DevCenter/Node/Media/node44.png
  [A web page titled My Task List with a table containing tasks, after you have added a task to the list.]: ../../../DevCenter/Node/Media/node45.png
  [the status messages displayed during deployment.]: ../../../DevCenter/Node/Media/node46.png
  [A browser window displaying the My Task List page. The URL indicates the page is now being hosted on Windows Azure.]: ../../../DevCenter/Node/Media/node47.png
  [Status messages indicating the service has stopped.]: ../../../DevCenter/Node/Media/node48.png
  [Status messages indicating the service has been deleted.]: ../../../DevCenter/Node/Media/node49.png
