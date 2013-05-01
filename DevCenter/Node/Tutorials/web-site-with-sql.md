<properties linkid="develop-nodejs-tutorials-web-site-with-sql-database" urlDisplayName="Web site with SQL Database" pageTitle="Node.js web site with SQL Database - Windows Azure tutorial" metaKeywords="" metaDescription="Learn how to create a Node.js website that accesses a SQL Database and is deployed to Windows Azure" metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div chunk="../chunks/article-left-menu.md" />

# Node.js Web Application using the Windows Azure SQL Database

This tutorial shows you how to use SQL Database provided by Windows Azure Data Management to store and access data from a [node] application hosted on Windows Azure. This tutorial assumes that you have some prior experience using node and [Git].

You will learn:

* How to use the Windows Azure Management Portal to create a Windows Azure Web Site and SQL Database

* How to use npm (node package manager) to install the node modules

* How to work with a SQL Database using the node-sqlserver module

* How to use app settings to specify run-time values for an application

By following this tutorial, you will build a simple web-based task-management application that allows creating, retrieving and completing tasks. The tasks are stored in SQL Database.
 
The project files for this tutorial will be stored in a directory named **tasklist** and the completed application will look similar to the following:

![A web page displaying an empty tasklist][node-sql-finished]

<div class="dev-callout">
<b>Note</b>
<p>The Microsoft Driver for Node.JS for SQL Server used in this tutorial is currently available as a preview release, and relies on run-time components that are only available on the Microsoft Windows and Windows Azure operating systems.</p>
</div>

<div class="dev-callout">
<strong>Note</strong>
<p>This tutorial makes reference to the <strong>tasklist</strong> folder. The full path to this folder is omitted, as path semantics differ between operating systems. You should create this folder in a location that is easy for you to access on your local file system, such as <strong>~/node/tasklist</strong> or <strong>c:\node\tasklist</strong></p>
</div>

<div class="dev-callout">
<strong>Note</strong>
<p>Many of the steps below mention using the command-line. For these steps, use the command-line for your operating system, such as <strong>cmd.exe</strong> (Windows) or <strong>Bash</strong> (Unix Shell). On OS X systems you can access the command-line through the Terminal application.</p>
</div>

##Prerequisites

Before following the instructions in this article, you should ensure that you have the following installed:

* [node] version 0.6.14 or higher

* [Git]

* Microsoft SQL Server Native Client libraries - available as part of the [Microsoft SQL Server 2012 Feature Pack]

* A text editor

* A web browser

<div chunk="../../Shared/Chunks/create-account-and-websites-note.md" />

##Create a web site with database

Follow these steps to create a Windows Azure Web Site and a SQL Database:

1. Login to the [Windows Azure Management Portal][management-portal].
2. Click the **+ New** icon on the bottom left of the portal.

	![Create New Windows Azure Website][new-website]

3. Click **WEB SITE**, then **CREATE WITH DATABASE**.

	![Custom Create a new Website][custom-create]

	Enter a value for **URL**, select **Create a New SQL Database** from the **DATABASE** dropdown,  and select the data center for your web site in the **REGION** dropdown. Click the arrow at the bottom of the dialog.

	![Fill in Website details][website-details-sqlazure]

4. Enter a value for the **NAME** of your database, select the **EDITION** [(WEB or BUSINESS)][sql-database-editions], select the **MAX SIZE** for your database, choose the **COLLATION**, and select **NEW SQL Database server**. Click the arrow at the bottom of the dialog.

	![Fill in SQL Database settings][database-settings]

5. Enter an administrator name and password (and confirm the password), choose the region in which your new SQL Database server will be created, and check the **Allow Windows Azure Services to access the server** box.

	![Create new SQL Database server][create-server]

	When the web site has been created you will see the text **Creation of Web Site ‘[SITENAME]’ completed successfully**. Now, you can enable Git publishing.

6. Click the name of the web site displayed in the list of web sites to open the web site’s Quick Start dashboard.

	![Open website dashboard][go-to-dashboard]


7. At the bottom of the Quick Start page, click **Set up Git publishing**. 

	![Set up Git publishing][setup-git-publishing]

8. To enable Git publishing, you must provide a user name and password. Make a note of the user name and password you create. (If you have set up a Git repository before, this step will be skipped.)

	![Create publishing credentials][portal-git-username-password]

	It will take a few seconds to set up your repository.

	![Creating Git repository][creating-repo]

9. When your repository is ready, you will see instructions for pushing your application files to the repository. Make note of these instructions - they will be needed later.

	![Git instructions][git-instructions]

##Get SQL Database connection information

To connect to the SQL Database instance that is running in Windows Azure Web Sites, your will need the connection information. To get SQL Database connection information, follow these steps:

1. From the Windows Azure Management Portal, click **LINKED RESOURCES**, then click the database name.

	![Linked Resources][linked-resources]

2. Click **View connection strings**.

	![Connection string][connection-string]
	
3. From the **ODBC** section of the resulting dialog, make note of the connection string as this will be used later.

##Design the task table

To create the database table used to store items for the tasklist application, perform the following steps:

1. From the Windows Azure Management Portal, select your SQL Database and then click **MANAGE** from the bottom of the page. If you receive a message stating that the current IP is not part of the firewall rules, select **OK** to add the IP address.

	![manage button][sql-azure-manage]

2. Login using the login name and password you selected when creating the database server earlier.

	![database manage login][sql-azure-login]

3. From the bottom left of the page, select **Design** and then select **New Table**.

	![New table][sql-new-table]

4. Enter 'tasks' as the **Table Name** and check **Is Identity?** for the **ID** column.

	![table name set to tasks and is identity checked][table-name-identity]

5. Change **Column1** to **name** and **Column2** to **category**. Add two new columns by clicking the **Add column** button. The first new column should be named **created** and have a type of **date**. The second new column should be named **completed** and have a type of **bit**. Both new columns should be marked as **Is Required?**.

	![completed table design][completed-table]

6. Click the **Save** button to save your changes to the table. You can now close the SQL Database management page.

##Install modules and generate scaffolding

In this section you will create a new Node application and use npm to add module packages. For the task-list application you will use the [express] and [node-sqlserver] modules. The Express module provides a Model View Controller framework for node, while the node-sqlserver module provides connectivity to Windows Azure SQL Database.

###Install express and generate scaffolding

1. From the command-line, change directories to the **tasklist** directory. If the **tasklist** directory does not exist, create it.

2. Enter the following command to install express.

		npm install express -g

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

2. Next, use the following command to add the nconf module. This module will be used by the application to read the database connection string from a configuration file.

	npm install nconf -save

2. Next, download the binary version of the Microsoft Driver for Node.JS for SQL Server from the [download center].

3. Extract the archive to the **tasklist\\node\_modules** directory.

4. Run the **msnodesql-install.cmd** file in the **tasklist\\node\_modules** directory. This will create a **msnodesql** subdirectory under **node\_modules** and move the driver files into this new directory structure.

5. Delete the **msnodesql-install.cmd** file, as it is no longer needed.

##Use SQL Database in a node application

In this section you will extend the basic application created by the **express** command modifying the existing **app.js** and create a new **index.js** files to use the database created earlier.

###Modify the controller

1. In the **tasklist/routes** directory, open the **index.js** file in a text editor.

2. Replace the existing code in the **index.js** file with the following code. This loads the msnodesql, and nconf modules, then uses nconf to load the connection string from either an environment variable named **SQL\_CONN** or an **SQL\_CONN** value in the **config.json** file.

		var sql = require('msnodesql')
		    , nconf = require('nconf');

		nconf.env()
	         .file({ file: 'config.json' });
		var conn = nconf.get("SQL_CONN");

2. Continue adding to the **index.js** file by adding the **index** and **updateItem** methods. The **index** method returns all uncompleted tasks from the database, while **updateItem** will mark selected tasks as completed.

		exports.index = function(req, res) {
		    var select = "select * from tasks where completed = 0";
		    sql.query(conn, select, function(err, items) {
		        if(err)
		            throw err;
		        res.render('index', { title: 'My ToDo List ', tasks: items });
		    });
		};

		exports.updateItem = function(req, res) {
		    var item = req.body.item;
		    if(item) {
		        var insert = "insert into tasks (name, category, created, completed) values (?, ?, GETDATE(), 0)";
		        sql.query(conn, insert, [item.name, item.category], function(err) {
		            if(err)
		                throw err;
		            res.redirect('/');
		        });
		    } else {
		        var completed = req.body.completed;
		        if(!completed.forEach)
		            completed = [completed];
		        var update = "update tasks set completed = 1 where id in (" + completed.join(",") + ")";
		        sql.query(conn, update, function(err) {
		            if(err)
		                throw err;
		            res.redirect('/');
		        });
		    }
		}

3. Save the **index.js** file.

###Modify app.js

1. In the **tasklist** directory, open the **app.js** file in a text editor. This file was created earlier by running the **express** command.

2. In the app.js file, scroll down to where you see below code.

		app.configure('development', function(){
  		app.use(express.errorHandler());
		});

3. Now insert the following code.


        app.get('/', routes.index);
		app.post('/', routes.updateItem);


 This will add a new route to the **updateItem** method you added previously in the **index.js** file. 

       		
3. Save the **app.js** file.

###Modify the index view

1. Change directories to the **views** directory and open the **index.jade** file in a text editor.

2. Replace the contents of the **index.jade** file with the code below. This defines the view for displaying existing tasks, as well as a form for adding new tasks and marking existing ones as completed.

		h1= title
		br

		form(action="/", method="post")
		  table(class="table table-striped table-bordered")
		    thead
		      tr
		        td Name
		        td Category
		        td Date
		        td Complete
		    tbody
		    each task in tasks
		      tr
		        td #{task.name}
		        td #{task.category}
		        td #{task.created}
		        td
		          input(type="checkbox", name="completed", value="#{task.ID}", checked=task.completed == 1)
		  button(type="submit", class="btn") Update tasks
		hr

		form(action="/", method="post", class="well")
		  label Item Name:
		  input(name="item[name]", type="textbox")
		  label Item Category:
		  input(name="item[category]", type="textbox")
		  br
		  button(type="submit", class="btn") Add Item

3. Save and close **index.jade** file.

###Modify the global layout

The **layout.jade** file in the **views** directory is used as a global template for other **.jade** files. In this step you will modify it to use [Twitter Bootstrap], which is a toolkit that makes it easy to design a nice looking web site.

1. Download and extract the files for [Twitter Bootstrap]. Copy the **bootstrap.min.css** file from the **bootstrap\\css** folder to the **public\\stylesheets** directory of your tasklist application.

2. From the **views** folder, open the **layout.jade** in your text editor and replace the contents with the following:

		!!!html
		html
		  head
		    title= title
		    meta(http-equiv='X-UA-Compatible', content='IE=10')
		    link(rel='stylesheet', href='/stylesheets/style.css')
		    link(rel='stylesheet', href='/stylesheets/bootstrap.min.css')
		  body(class='app')
		    div(class='navbar navbar-fixed-top')
		      .navbar-inner
		        .container
		          a(class='brand', href='/') My Tasks
		    .container!= body

3. Save the **layout.jade** file.

###Create configuration file

The **config.json** file contains the connection string used to connect to the SQL Database, and is read by the **index.js** file at run-time. To create this file, perform the following steps:

1. In the **tasklist** directory, create a new file named **config.json** and open it in a text editor.

2. The contents of the **config.json** file should appear similiar to the following:

		{
		  "SQL_CONN" : "connection_string"
		}

	Replace the **connection_string** with the ODBC connection string value returned earlier.

3. Save the file.

##Run your application locally

To test the application on your local machine, perform the following steps:

1. From the command-line, change directories to the **tasklist** directory.

2. Use the following command to launch the application locally:

        node app.js

3. Open a web browser and navigate to http://127.0.0.1:3000. This should display a web page similar to the following:

    ![A webpage displaying an empty tasklist][node-sql-empty]

4. Use the provided fields for **Item Name** and **Item Category** to enter information, and then click **Add item**.

5. The page should update to display the item in the ToDo List.

    ![An image of the new item in the list of tasks][node-sql-list-items]

6. To complete a task, simply check the checkbox in the Complete column, and then click **Update tasks**.

7. To stop the node process, go to the command-line and press the **CTRL** and **C** keys.

##Deploy your application to Windows Azure

In this section, you will use the deployment steps you received after creating the web site to publish your application to Windows Azure.

###Publish the application

1. At the command-line, change directories to the **tasklist** directory if you are not already there.

2. Use the following commands to initialize a local git repository for your application, add the application files to it, and finally push the files to Windows Azure

		git init
		git add .
		git commit -m "adding files"
		git remote add azure [URL for remote repository]
		git push azure master
	
	At the end of the deployment, you should see a statement similar to the following:
	
		To https://username@tabletasklist.azurewebsites.net/TableTasklist.git
 		 * [new branch]      master -> master

4. Once the push operation has completed, browse to **http://[site name].azurewebsites.net/** to view your application.

###Switch to an environment variable

Earlier we implemented code that looks for a **SQL_CONN** environment variable for the connection string or loads the value from the **config.json** file. In the following steps you will create a key/value pair in your web site configuration that the application real access through an environment variable.

1. From the Windows Azure Management Portal, click **Web Sites** and then select your web site.

	![Open website dashboard][go-to-dashboard]

2. Click **CONFIGURE** and then find the **app settings** section of the page. 

	![configure link][web-configure]

3. In the **app settings** section, enter **SQL_CONN** in the **KEY** field, and the ODBC connection string in the **VALUE** field. Finally, click the checkmark.

	![app settings][app-settings]

4. Finally, click the **SAVE** icon at the bottom of the page to commit this change to the run-time environment.

	![app settings save][app-settings-save]

5. From the command-line, change directories to the **tasklist** directory and enter the following command to remove the **config.json** file:

		git rm config.json
		git commit -m "Removing config file"

6. Perform the following command to deploy the changes to Windows Azure:

		git push azure master

Once the changes have been deployed to Windows Azure, your web application should continue to work as it is now reading the connection string from the **app settings** entry. To verify this, change the value for the **SQL_CONN** entry in **app settings** to an invalid value. Once you have saved this value, the web site should fail due to the invalid connection string.

##Next steps

* [Node.js Web Application with MongoDB]

* [Node.js Web Application with Table Storage]

##Additional resources

[Windows Azure command-line tool for Mac and Linux]    
[Create and deploy a Node.js application to Windows Azure Web Sites]: /en-us/develop/nodejs/tutorials/create-a-website-(mac)/
[Publishing to Windows Azure Web Sites with Git]: /en-us/develop/nodejs/common-tasks/publishing-with-git/
[Windows Azure Developer Center]: /en-us/develop/nodejs/
[Node.js Web Application with Table Storage]: /en-us/develop/nodejs/tutorials/web-site-with-storage/

[node]: http://nodejs.org
[Git]: http://git-scm.com
[express]: http://expressjs.com
[for free]: http://windowsazure.com
[Git remote]: http://git-scm.com/docs/git-remote
[azure-sdk-for-node]: https://github.com/WindowsAzure/azure-sdk-for-node
[Node.js Web Application with MongoDB]: ../website-with-mongodb-(mac)/
[Windows Azure command-line tool for Mac and Linux]: /en-us/develop/nodejs/how-to-guides/command-line-tools/
[Create and deploy a Node.js application to a Windows Azure Web Site]: ./web-site-with-mongodb-Mac
[Publishing to Windows Azure Web Sites with Git]: ../CommonTasks/publishing-with-git
[Windows Azure Portal]: http://windowsazure.com
[management-portal]: https://manage.windowsazure.com/
[node-sqlserver]: https://github.com/WindowsAzure/node-sqlserver
[Microsoft SQL Server 2012 Feature Pack]: http://www.microsoft.com/en-us/download/details.aspx?id=29065
[sql-database-editions]: http://msdn.microsoft.com/en-us/library/windowsazure/ee621788.aspx
[download center]: http://www.microsoft.com/en-us/download/details.aspx?id=29995
[Twitter Bootstrap]: http://twitter.github.com/bootstrap/

[app-settings-save]: ../media/savebutton.png
[web-configure]: ../media/sql-task-configure.png
[app-settings]: ../media/appsettings.png
[connection-string]: ../Media/connection_string.jpg
[website-details-sqlazure]: ../Media/website_details_sqlazure.jpg
[database-settings]: ../Media/database_settings.jpg
[create-server]: ../Media/create_server.jpg
[go-to-dashboard]: ../../Shared/Media/go_to_dashboard.png
[setup-git-publishing]: ../../Shared/Media/setup_git_publishing.png
[portal-git-username-password]: ../../Shared/Media/git-deployment-credentials.png
[creating-repo]: ../Media/creating_repo.jpg
[push-files]: ../Media/push_files.jpg
[git-instructions]: ../../Shared/Media/git_instructions.png
[linked-resources]: ../Media/linked_resources.jpg
[new-website]: ../../Shared/Media/new_website.jpg
[custom-create]: ../../Shared/Media/custom_create.jpg
[node-sql-finished]: ../media/sql_todo_final.png
[node-sql-empty]: ../media/sql_todo_empty.png
[node-sql-list-items]: ../media/sql_todo_list.png
[download-publishing-settings]: ../../Shared/Media/azure-account-download.png
[portal-new]: ../../Shared/Media/plus-new.png
[portal-storage-account]: ../../Shared/Media/new-storage.png
[portal-quick-create-storage]: ../../Shared/Media/quick-storage.png
[portal-storage-access-keys]: ../../Shared/Media/manage-access-keys.png
[portal-storage-manage-keys]: ../../Shared/Media/manage-keys-button.png
[sql-azure-manage]: ../media/sql-manage.png
[sql-azure-login]: ../media/sqlazurelogin.png
[sql-new-table]: ../media/new-table.png
[table-name-identity]: ../media/table-name-identity.png
[completed-table]: ../media/table-columns.png