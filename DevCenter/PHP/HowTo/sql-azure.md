<properties linkid="develop-php-sql-database" urlDisplayName="SQL Database" pageTitle="How to use SQL Database (PHP) - Windows Azure feature guides" metaKeywords="Azure SQL Database PHP, SQL Database PHP" metaDescription="Learn how to create and connect to a Windows Azure SQL Database from PHP." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />

<div chunk="../chunks/article-left-menu.md" />

#How to Access Windows Azure SQL Database from PHP

This guide will show you the basics of using Windows Azure SQL Database from PHP. The samples are written in PHP. The scenarios covered include **creating a SQL Database** and **connecting to a SQL Database**. This guide covers creating a SQL Database from the [Management Portal][preview-portal]. For information about performing these tasks from the production portal, see [Getting Started with PHP and SQL Database][prod-portal-instructions]. For more information, see the [Next Steps](#NextSteps) section.

##What is Windows Azure SQL Database

Windows Azure SQL Database provides a relational database management system for Windows Azure, and is based on SQL Server technology. With SQL Database, you can easily provision and deploy relational database solutions to the cloud, and take advantage of a distributed data center that provides enterprise-class availability, scalability, and security with the benefits of built-in data protection and self-healing.

##Table of contents

* [Concepts](#Concepts)
* [How to: Setup your environment](#Setup)
* [How to: Create a SQL Database](#CreateServer)
* [How to: Get SQL Database connection information](#ConnectionInfo)
* [How to: Connect to a SQL Database instance](#Connect)
* [Next steps](#NextSteps)

<h2><a id="Concepts"></a>Concepts</h2>
Because Windows Azure SQL Database is built on SQL Server technologies, accessing SQL Database from PHP is very similar to accessing SQL Server from PHP. You can develop an application locally (using SQL Server) and then connect to SQL Database by changing only the connection string. However, there are some differences between SQL Database and SQL Server that could affect your application. For more information, see [Guidelines and Limitations (SQL Database)][limitations].

The recommended approach for accessing SQL Database from PHP is to use the [Microsoft Drivers for PHP for SQL Server][download-drivers]. (The examples in this article will use these drivers.) The Microsoft Drivers for PHP for SQL Server work on Windows only.

<h2><a id="Setup"></a>How to: Setup your environment</h2>

The recommended way to set up your development environment is to use the [Microsoft Web Platform Installer][wpi-installer]. The Web Platform Installer will allow you to choose elements of your web development platform and automatically install and configure them. By downloading the Web Platform Installer and choosing to install WebMatrix, PHP for WebMatrix, and SQL Server Express, a complete development environment will be set up for you.

Alternatively, you can set up your environment manually:

* Install PHP and configure IIS: [http://php.net/manual/en/install.windows.iis7.php][manual-config].
* Download and install SQL Server Express: [http://www.microsoft.com/en-us/download/details.aspx?id=29062][install-sql-express]
* Download and install the Microsoft Drivers for PHP for SQL Server: [http://php.net/manual/en/sqlsrv.requirements.php][install-drivers].

<h2><a id="CreateServer"></a>How to: Create a SQL Database</h2>

Follow these steps to create a Windows Azure SQL Database:

1. Login to the [Management Portal][preview-portal].
2. Click the **+ NEW** icon on the bottom left of the portal.

	![Create New Windows Azure Web Site][new-website]

3. Click **DATA SERVICES**, **SQL DATABASE** then **CUSTOM CREATE**.

	![Custom Create a new SQL Database][custom-create]

4. Enter a value for the **NAME** of your database, select the **EDITION** (WEB or BUSINESS), select the **MAX SIZE** for your database, choose the **COLLATION**, and select **NEW SQL Database Server**. Click the arrow at the bottom of the dialog. (Note that if you have created a SQL Database before, you can choose an existing server from the **Choose a server** dropdown.)

	![Fill in SQL Database settings][database-settings]

5. Enter an administrator name and password (and confirm the password), choose the region in which your new SQL Database will be created, and check the `Allow Windows Azure Services to access the server` box.

	![Create new SQL Database server][create-server]

To see server and database information, click **SQL Databases** in the Management Portal. You can then click on **DATABASES** or **SERVERS** to see relevant information.

![View server and database information][sql-dbs-servers]

<h2><a id="#ConnectionInfo"></a>How to: Get SQL Database connection information</h2>

To get SQL Database connection information, click on **SQL DATABASES** in the portal, then click on the name of the database.

![View database information][go-to-db-info]

Then, click on **View SQL Database connection strings for ADO.NET, ODBC, PHP, and JDBC**.

![Show connection strings][show-connection-string]

In the PHP section of the resulting window, make note of the values for **SERVER**, **DATABASE**, and **USERNAME**. Your password will be the password you used when creating the SQL Database.

<h2><a id="Connect"></a>How to: Connect to a SQL Database instance</h2>

The following examples show how to use the **SQLSRV** and **PDO_SQLSRV** extensions to connect to a SQL Database called `testdb`. You will need information obtained from the section above. Replace `SERVER_ID` with your 10-digit server ID (which is the fist 10 characters from the SERVER value obtained in the section above), and assign the correct values (your user name and password) to the `$user` and `$pwd` variables.

#####SQLSRV

	$server = "tcp:<value of SERVER from section above>";
	$user = "<value of USERNAME from section above>"@SERVER_ID;
	$pwd = "password";
	$db = "testdb";

	$conn = sqlsrv_connect($server, array("UID"=>$user, "PWD"=>$pwd, "Database"=>$db));

	if($conn === false){
		die(print_r(sqlsrv_errors()));
	}

#####PDO_SQLSRV

	$server = "tcp:<value of SERVER from section above>";
	$user = "<value of USERNAME from section above>"@SERVER_ID;
	$pwd = "password";
	$db = "testdb";

	try{
		$conn = new PDO( "sqlsrv:Server= $server ; Database = $db ", $user, $pwd);
		$conn->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
	}
	catch(Exception $e){
		die(print_r($e));
	}


<h2><a id="NextSteps"></a>Next steps</h2>
As mentioned earlier, using SQL Database is very similar to using SQL Server. Once you have established a connection to a SQL Database (as shown above), you can then use the **SQLSRV** or **PDO\_SQLSRV** APIs for inserting, retrieving, updating, and deleting data. For information about the **SQLSRV** and **PDO\_SQLSRV** APIs, see the [Microsoft Drivers for PHP for SQL Server documentation][driver-docs]. There are, however, some differences between SQL Database and SQL Server that could affect your application. For more information, see [Guidelines and Limitations (SQL Database)][limitations].

[download-drivers]: http://www.microsoft.com/download/en/details.aspx?id=20098
[limitations]: http://msdn.microsoft.com/en-us/library/windowsazure/ff394102.aspx
[odbc-php]: http://www.php.net/odbc
[manual-config]: http://php.net/manual/en/install.windows.iis7.php
[install-drivers]: http://php.net/manual/en/sqlsrv.requirements.php
[driver-docs]: http://msdn.microsoft.com/en-us/library/dd638075(SQL.10).aspx
[access-php-odbc]: http://social.technet.microsoft.com/wiki/contents/articles/accessing-sql-azure-from-php.aspx
[install-sql-express]: http://www.microsoft.com/en-us/download/details.aspx?id=29062
[preview-portal]: https://manage.windowsazure.com
[prod-portal-instructions]: http://blogs.msdn.com/b/brian_swan/archive/2010/02/12/getting-started-with-php-and-sql-azure.aspx
[new-website]: ../../Shared/Media/plus-new.png
[custom-create]: ../../Shared/Media/create_custom_sql_db-2.png
[database-settings]: ../Media/new-sql-db.png
[create-server]: ../Media/db-server-settings.png
[sql-dbs-servers]: ../Media/sql-dbs-portal.png
[new-db-existing-server]: ../../Shared/Media/new_db_existing_server.jpg
[go-to-conn-info]: ../../Shared/Media/go_to_conn_info.jpg
[connection-string]: ../Media/connection_string.jpg
[wpi-installer]: http://go.microsoft.com/fwlink/?LinkId=253447
[go-to-db-info]: ../Media/go-to-db-info.png
[show-connection-string]: ../Media/show-connection-string-2.png

