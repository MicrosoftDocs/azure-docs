<properties linkid="develop-node-how-to-sql-database" urlDisplayName="SQL Database" pageTitle="How to use SQL Database (Node.js) - Windows Azure feature guide" metaKeywords="" metaDescription="Learn how to use Windows Azure SQL Database from Node.js." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />



#How to Access Windows Azure SQL Database from Node.js

This guide will show you the basics of using the Microsoft Driver for Node.JS for SQL Server to access a Windows Azure SQL Database. The scenarios covered include **creating a SQL Database** and **connecting to a SQL Database**. This guide covers creating a SQL Database from the [Preview Management Portal][preview-portal].

##Table of contents

* [Concepts](#Concepts)
* [How to: Setup your environment](#Setup)
* [How to: Create a SQL Database](#CreateServer)
* [How to: Get SQL Database connection information](#ConnectionInfo)
* [How to: Connect to a SQL Database instance](#Connect)
* [Windows Azure deployment considerations](#Deploy)
* [Next steps](#NextSteps)

<h2 id="Concepts">Concepts</h2>

###What is Windows Azure SQL Database

Windows Azure SQL Database provides a relational database management system for Windows Azure, and is based on SQL Server technology. With SQL Database, you can easily provision and deploy relational database solutions to the cloud, and take advantage of a distributed data center that provides enterprise-class availability, scalability, and security with the benefits of built-in data protection and self-healing.

##What is the Microsoft Driver for Node.JS for SQL Server

The Microsoft Driver for Node.JS for SQL Server allows developers to access data stored in Microsoft SQL Server or Windows Azure SQL Database from a Node.js application. The driver is currently a preview release only; additional features will be integrated into the project as they are completed. For more information on the driver, see the Microsoft Driver for Node.JS for SQL Server project's [Github page] and the associated [Wiki].

<div class="dev-callout">
<b>Note</b>
<p>The Microsoft Driver for Node.JS for SQL Server is currently available as a preview release, and relies on run-time components that are only available on the Microsoft Windows and Windows Azure operating systems.</p>
</div>

<h2 id="Setup">How to: Setup your environment</h2>

###Install the SQL Server Native Client

The Microsoft SQL Server Driver for Node.js relies on the SQL Server Native Client. While the native client is automatically available when the application is deployed to Windows Azure, it may not be present in your local development environment. You can install the SQL Server Native Client from the [Microsoft SQL Server 2012 Feature Pack] download page.

<div class="dev-callout">
<b>Note</b>
<p>The SQL Server Native Client is only available for the Microsoft Windows operating system. While this driver is available natively on Windows Azure, you will be unable to test your application locally using the information in this article if you are developing on an operating system other than Microsoft Windows.</p>
</div>

###Install Node.js

Node.js can be installed from [http://nodejs.org/#download](http://nodejs.org/#download). If an installation package is not available for your operating system, you can build Node.js from source.

<h2 id="CreateServer">How to: Create a SQL Database</h2>

Follow these steps to create a Windows Azure SQL Database:

1. Login to the [Preview Management Portal][preview-portal].
2. Click the **+ New** icon on the bottom left of the portal.

	![Create New Windows Azure Website][new-website]

3. Click **SQL Database**, then **Custom Create**.

	![Custom Create a new SQL Database][custom-create]

4. Enter a value for the **NAME** of your database, select the **EDITION** (WEB or BUSINESS), select the **MAX SIZE** for your database, choose the **COLLATION**, and select **NEW SQL Database Server**. Click the arrow at the bottom of the dialog. (Note that if you have created a SQL Database before, you can choose an existing server from the **Choose a server** dropdown.)

	![Fill in SQL Database settings][database-settings]

5. Enter an administrator name and password (and confirm the password), choose the region in which your new SQL Database will be created, and check the `Allow Windows Azure Services to access the server` box.

	![Create new SQL Database server][create-server]

To see server and database information, click **SQL Databases** in the Preview Management Portal. You can then click on **DATABASES** or **SERVERS** to see relevant information.

![View server and database information][sql-dbs-servers]

<h2 id="ConnectionInfo">How to: Get SQL Database connection information</h2>

To get SQL Database connection information, click on **SQL DATABASES** in the portal, then click on the name of the database.

![View database information][go-to-db-info]

Then, click on **Show connection strings**.

![Show connection strings][show-connection-string]

In the ODBC section of the resulting window, make note of the values for connection string. This is the connection string you will use when connecting to the SQL Database from your node application. Your password will be the password you used when creating the SQL Database.

<h2 id="Connect">How to: Connect to a SQL Database instance</h2>

###Install node-sqlserver

The Microsoft Driver for Node.JS for SQL Server is available as the node-sqlserver native module. A binary version of this module is available from the [download center]. To use the binary version, perform these steps:

1. Extract the binary archive to the **node\_modules** directory for your application.
2. Run the **node-sqlserver-install.cmd** file extracted from the archive. This will create a **node-sqlserver** subdirectory under **node\_modules** and move the driver files into this new directory structure.
3. Delete the **node-sqlserver-install.cmd** file, as it is no longer needed.

  

<div class="dev-callout">
<b>Note</b>
<p>You can also install the node-sqlserver module using the npm utility; however this will invoke node-gyp to build a binary version of the module on your system.</p>
</div>

###Specify the connection string

To use the node-sqlserver, you must require it in your application and specify a connection string. The connection string should be the ODBC value returned in the [How to: Get SQL Database connection information](#ConnectionInfo) section of this article. The code should appear similar to the following:

    var sql = require('node-sqlserver');
	var conn_str = "Driver={SQL Server Native Client 10.0};Server=tcp:{dbservername}.database.windows.net,1433;Database={database};Uid={username};Pwd={password};Encrypt=yes;Connection Timeout=30;";

###Query the database

Queries can be performed by specifying a Transact-SQL statement with the **query** method. The following code creates an HTTP server and returns data from the **ID**, **Column1**, and **Column2** rows in the **Test** table when you view the web page:

	var http = require('http')
	var port = process.env.port||3000;
	http.createServer(function (req, res) {
	    sql.query(conn_str, "SELECT * FROM TestTable", function (err, results) {
	        if (err) {
	            res.writeHead(500, { 'Content-Type': 'text/plain' });
	            res.write("Got error :-( " + err);
	            res.end("");
	            return;
	        }
	        res.writeHead(200, { 'Content-Type': 'text/plain' });
	        for (var i = 0; i < results.length; i++) {
	            res.write("ID: " + results[i].ID + " Column1: " + results[i].Column1 + " Column2: " + results[i].Column2);
	        }
	        res.end("; Done.");
	    });
	}).listen(port);

While the above example illustrates how to return all rows at once in the results collection, you can also return a statement object that allows you to subscribe to events. This allows you to receive individual rows and columns as they are returned. The following example demonstrates how to do this:

	var stmt = sql.query(conn_str, "SELECT * FROM TestTable");
	stmt.on('meta', function (meta) { console.log("We've received the metadata"); });
	stmt.on('row', function (idx) { console.log("We've started receiving a row"); });
	stmt.on('column', function (idx, data, more) { console.log(idx + ":" + data);});
	stmt.on('done', function () { console.log("All done!"); });
	stmt.on('error', function (err) { console.log("We had an error: " + err); });

<h2 id="Deploy">Windows Azure deployment considerations</h2>

<div class="dev-callout">
<b>Note</b>
<p>The following information is based off of a preview release of the Microsoft Driver for Node.JS for SQL Server. The information in this section may not be the most recent information on using the node-sqlserver module with Windows Azure. For the most recent information on the <a href="https://github.com/WindowsAzure/node-sqlserver">Microsoft Driver for Node.JS for SQL Server project page</a> on Github.</p>
</div>

Windows Azure will not dynamically install the node-sqlserver module at runtime, so you must ensure that your application deployment includes a binary version of the module. You can verify that your deployment does contain a binary version of the module by ensuring that the following directory structure exists, and contains the files described below:

	application directory
		node_modules
			node-sqlserver
				lib

The **node-sqlserver** directory should contain a **package.json** file. The **lib** directory should contain a **sql.js** and a **sqlserver.node** file, which is the compiled form of the node-sqlserver module.

For more information on deploying a Node.js application to Windows Azure, see [Create and deploy a Node.js application to a Windows Azure Web Site] and [Node.js Cloud Service].

<h2 id="NextSteps">Next steps</h2>

* [Introducing the Microsoft Driver for Node.JS for SQL Server]
* [Microsoft Driver for Node.js for SQL Server on Github.com]

[Node.js Cloud Service]: /en-us/develop/nodejs/tutorials/getting-started/
[Create and deploy a Node.js application to a Windows Azure Web Site]: /en-us/develop/nodejs/tutorials/create-a-website-(mac)/
[Introducing the Microsoft Driver for Node.JS for SQL Server]: http://blogs.msdn.com/b/sqlphp/archive/2012/06/08/introducing-the-microsoft-driver-for-node-js-for-sql-server.aspx
[Github page]: https://github.com/WindowsAzure/node-sqlserver
[Microsoft Driver for Node.js for SQL Server on Github.com]: https://github.com/WindowsAzure/node-sqlserver
[Wiki]: https://github.com/WindowsAzure/node-sqlserver/wiki
[Installing Python and the SDK]: /en-us/develop/python/common-tasks/install-python/
[Microsoft SQL Server 2012 Feature Pack]: http://www.microsoft.com/en-us/download/details.aspx?id=29065
[preview-portal]: https://manage.windowsazure.com
[download center]: http://www.microsoft.com/en-us/download/details.aspx?id=29995

[new-website]: ../../Shared/Media/new_website.jpg
[custom-create]: ../../Shared/Media/create_custom_sql_db.jpg
[database-settings]: ../Media/new-sql-db.png
[create-server]: ../Media/db-server-settings.png
[sql-dbs-servers]: ../Media/sql-dbs-portal.png
[new-db-existing-server]: ../../Shared/Media/new_db_existing_server.jpg
[go-to-conn-info]: ../../Shared/Media/go_to_conn_info.jpg
[connection-string]: ../Media/connection_string.jpg
[go-to-db-info]: ../Media/go-to-db-info.png
[show-connection-string]: ../Media/show-connection-string.png