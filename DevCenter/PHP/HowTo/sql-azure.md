<properties umbracoNaviHide="0" pageTitle="How to Access Windows Azure SQL Database from PHP" metaKeywords="Windows Azure, SQL Database, PHP" metaDescription="Learn how to use PHP to access Windows Azure SQL Database." linkid="dev-php-howto-sql-database" urlDisplayName="How to Access Windows Azure SQL Database from PHP" headerExpose="" footerExpose="" disqusComments="1" />

#How to Access Windows Azure SQL Database from PHP

This guide will show you the basics of using Windows Azure SQL Database from PHP. The samples are written in PHP. The scenarios covered include **creating a server**, **creating a database**, and **connecting to a database**. This guide covers creating a server and creating a database from the [Preview Management Portal][preview-portal]. For information about performing these tasks from the production portal, see [Getting Started with PHP and SQL Azure][prod-portal-instructions]. For more information, see the [Next Steps](#NextSteps) section.

##What is Windows Azure SQL Database

Windows Azure SQL Database provides a relational database management system for the Windows Azure platform, and is based on SQL Server technology. With a SQL Database instance, you can easily provision and deploy relational database solutions to the cloud, and take advantage of a distributed data center that provides enterprise-class availability, scalability, and security with the benefits of built-in data protection and self-healing.

##Table of Contents

* [Concepts](#Concepts)
* [How to Setup Your Environment](#Setup)
* [How to Create a SQL Database Server](#CreateServer)
* [How to Create a SQL Database Instance](#CreateDatabase)
* [How to Get SQL Database Connection Information](#ConnectionInfo)
* [How to Connect to a SQL Database Instance](#Connect)
* [Next Steps](#NextSteps)

<h2 id="Concepts">Concepts</h2>
Because Windows Azure SQL Database is built on SQL Server technologies, accessing SQL Database from PHP is very similar to accessing SQL Server from PHP. You can develop an application locally (using SQL Server) and then connect to SQL Database by changing only the connection string. However, there are some differences between SQL Database and SQL Server that could affect your application. For more information, see [Guidelines and Limitations (SQL Database)][limitations].

For accessing SQL Database from Windows, the recommended approach is to use the [Microsoft Drivers for PHP for SQL Server][download-drivers]. (The examples in this article will use these drivers.) For accessing SQL Database from Linux and other non-Windows platforms, using an ODBC driver for SQL Server and the [ODBC extension for PHP][odbc-php] is recommended. For more information, see the [Next Steps](#NextSteps) section.

<h2 id="Setup">How to Setup Your Environment</h2>

The recommended way to set up your development environment is to use the [Microsoft Web Platform Installer][wpi-installer]. The Web Platform Installer will allow you to choose elements of your web development platform and automatically install and configure them. By downloading the Web Platform Installer and choosing to install WebMatrix, PHP for WebMatrix, SQL Server Express, a complete development environment will be set up for you.

Alternatively, you can set up your environment manually:

* Install PHP and configure IIS: [http://php.net/manual/en/install.windows.iis7.php][manual-config].
* Download and install SQL Server Express: [http://www.microsoft.com/en-us/download/details.aspx?id=29062][install-sql-express]
* Download and install the Microsoft Drivers for PHP for SQL Server: [http://php.net/manual/en/sqlsrv.requirements.php][install-drivers].

<h2 id="CreateServer">How to Create a SQL Database Server</h2>

Follow these steps to create a Windows Azure SQL Database:

1. Login to the [Preview Management Portal][preview-portal].
2. Click the **+ New** icon on the bottom left of the portal.

	![Create New Windows Azure Website][new-website]

3. Click **SQL Database**, then **Custom Create**.

	![Custom Create a new SQL Database][custom-create]

4. Enter a value for the **NAME** of your database, select the **EDITION** (WEB or BUSINESS), select the **MAX SIZE** for your database, choose the **COLLATION**, and select **NEW SQL Database server**. Click the arrow at the bottom of the dialog.

	![Fill in SQL Database settings][database-settings]

5. Enter an administrator name and password (and confirm the password), choose the region in which your new SQL Database server will be created, and check the `Allow Windows Azure Services to access this server` box.

	![Create new SQL Database server][create-server]

Note that the steps above create a new SQL Database server _and_ a new database. To see server and database information, click **SQL Databases** in the Preview Management Portal. You can then click on **databases** or **servers** to see relevant information.

![View server and database information][sql-dbs-servers]

To add another database to an existing server, see the next section.

<h2 id="CreateDatabase">How to Create a SQL Database Instance</h2>

The steps in the section above explain how to create a SQL Database server _and_ a database. To add a new database to an existing server, follow the same steps, but choose an existing server in step 4.

![Create new database on existing server][new-db-existing-server]

Note that step 5 will not be necessary. Your administrator name and password will be valid for the new database.

<h2 id="ConnectionInfo">How to Get SQL Database Connection Information</h2>

To get SQL Database connection information, follow these steps:

1. From the Preview Management Portal, click **SQL DATABASES**, then click on the name of the database you want to connect to.

	![SQL Databases][go-to-conn-info]

2. Click **Connection String**.

	![Connection string][connection-string]
	
3. From the **PHP** section of the resulting dialog, make note of the values for `UID`, `PWD`, `Database`, and `$serverName`. Note that if you are using the **SQLSRV** extension, the code shown can be copied and pasted into your application.

<h2 id="Connect">How to Connect to a SQL Database Instance</h2>

The following examples show how to use the **SQLSRV** and **PDO_SQLSRV** extensions to connect to an existing SQL Database instance called `tasklist`. (You will need information obtained from the section above.)Replace `SERVER_ID` with your 10-digit server ID, and assign the correct values (your user name and password) to the `$user` and `$pwd` variables.

#####SQLSRV

	$server = "tcp:SERVER_ID.database.windows.net, 1433";
	$user = "user";
	$pwd = "password";
	$db = "tasklist";

	$conn = sqlsrv_connect($server, array("UID"=>$user, "PWD"=>$pwd, "Database"=>$db));

	if($conn === false){
		die(print_r(sqlsrv_errors()));
	}

#####PDO_SQLSRV

	$server = "tcp:SERVER_ID.database.windows.net, 1433";
	$user = "user";
	$pwd = "password";
	$db = "tasklist";

	try{
		$conn = new PDO( "sqlsrv:Server= $server ; Database = $db ", $user, $pwd);
		$conn->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
	}
	catch(Exception $e){
		die(print_r($e));
	}


<h2 id="NextSteps">Next Steps</h2>
As mentioned earlier, using SQL Database is very similar to using SQL Server. Once you have established a connection to a SQL Database (as shown above), you can then use the **SQLSRV** or **PDO\_SQLSRV** APIs for inserting, retrieving, updating, and deleting data. For information about the **SQLSRV** and **PDO\_SQLSRV** APIs, see the [Microsoft Drivers for PHP for SQL Server documentation][driver-docs]. There are, however, some differences between SQL Database and SQL Server that could affect your application. For more information, see [Guidelines and Limitations (SQL Azure Database)][limitations]. 

For accessing SQL Database from Linux and other non-Windows platforms, using an ODBC driver for SQL Server and the [ODBC extension for PHP][odbc-php] is recommended. For more information, see [Installing and Using the Microsoft SQL Server ODBC Driver for Linux][install-linux-driver], [Download the Microsoft SQL Server ODBC Driver for Linux][download-linux-driver], and [Accessing SQL Azure from PHP][access-php-odbc].


[download-drivers]: http://www.microsoft.com/download/en/details.aspx?id=20098
[limitations]: http://msdn.microsoft.com/en-us/library/windowsazure/ff394102.aspx
[odbc-php]: http://www.php.net/odbc
[manual-config]: http://php.net/manual/en/install.windows.iis7.php
[install-drivers]: http://php.net/manual/en/sqlsrv.requirements.php
[driver-docs]: http://msdn.microsoft.com/en-us/library/dd638075(SQL.10).aspx
[install-linux-driver]: http://strangenut.com/blogs/dacrowlah/archive/2012/04/13/installing-and-using-the-microsoft-sql-server-odbc-driver-for-linux.aspx
[access-php-odbc]: http://social.technet.microsoft.com/wiki/contents/articles/accessing-sql-azure-from-php.aspx
[download-linux-driver]: http://www.microsoft.com/download/en/details.aspx?id=28160
[install-sql-express]: http://www.microsoft.com/en-us/download/details.aspx?id=29062
[preview-portal]: https://manage.windowsazure.com
[prod-portal-instructions]: http://blogs.msdn.com/b/brian_swan/archive/2010/02/12/getting-started-with-php-and-sql-azure.aspx
[new-website]: ../../Shared/Media/new_website.jpg
[custom-create]: ../../Shared/Media/create_custom_sql_db.jpg
[database-settings]: ../Media/database_settings.jpg
[create-server]: ../Media/create_server.jpg
[sql-dbs-servers]: ../../Shared/Media/sql_db_servers.jpg
[new-db-existing-server]: ../../Shared/Media/new_db_existing_server.jpg
[go-to-conn-info]: ../../Shared/Media/go_to_conn_info.jpg
[connection-string]: ../Media/connection_string.jpg
[wpi-installer]: http://www.microsoft.com/web/downloads/platform.aspx
