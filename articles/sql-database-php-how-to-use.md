<properties 
	pageTitle="How to use SQL Database (PHP) - Azure feature guides" 
	description="Learn how to create and connect to an Azure SQL Database from PHP." 
	services="sql-database" 
	documentationCenter="php" 
	authors="tfitzmac" 
	manager="wpickett" 
	editor="mollybos"/>

<tags 
	ms.service="sql-database" 
	ms.workload="data-management" 
	ms.tgt_pltfrm="na" 
	ms.devlang="PHP" 
	ms.topic="article" 
	ms.date="03/25/2015" 
	ms.author="tomfitz"/>

#How to Access Azure SQL Database from PHP 

## Overview

This guide will show you the basics of using SQL Database from PHP. The samples are written in PHP. The scenarios covered include **creating a SQL Database** and **connecting to a SQL Database**. This guide covers creating a SQL Database from the [Management Portal][management-portal]. For information about performing these tasks from the production portal, see [Getting Started with PHP and SQL Database][prod-portal-instructions]. For more information, see the [Next Steps](#NextSteps) section.

##What is SQL Database

SQL Database provides a relational database management system for Azure, and is based on SQL Server technology. With SQL Database, you can easily provision and deploy relational database solutions to the cloud, and take advantage of a distributed data center that provides enterprise-class availability, scalability, and security with the benefits of built-in data protection and self-healing.

##<a id="Concepts"></a>Concepts
Because SQL Database is built on SQL Server technologies, accessing SQL Database from PHP is very similar to accessing SQL Server from PHP. You can develop an application locally (using SQL Server) and then connect to SQL Database by changing only the connection string. However, there are some differences between SQL Database and SQL Server that could affect your application. For more information, see [Guidelines and Limitations (SQL Database)][limitations].

The recommended approach for accessing SQL Database from PHP is to use the [Microsoft Drivers for PHP for SQL Server][download-drivers]. (The examples in this article will use these drivers.) The Microsoft Drivers for PHP for SQL Server work on Windows only.

##<a id="Setup"></a>How to: Setup your environment

The recommended way to set up your development environment is to use the [Microsoft Web Platform Installer][wpi-installer]. The Web Platform Installer will allow you to choose elements of your web development platform and automatically install and configure them. By downloading the Web Platform Installer and choosing to install WebMatrix, PHP for WebMatrix, and SQL Server Express, a complete development environment will be set up for you.

Alternatively, you can set up your environment manually:

* Install PHP and configure IIS: [http://php.net/manual/en/install.windows.iis7.php][manual-config].
* Download and install SQL Server Express: [http://www.microsoft.com/download/details.aspx?id=29062][install-sql-express]
* Download and install the [Microsoft Drivers for PHP for SQL Server][download-drivers].

##<a id="CreateServer"></a>How to: Create a SQL Database

Follow these steps to create an Azure SQL Database:

1. Login to the [Management Portal][management-portal].
2. Click **New** on the bottom left of the portal.

	![Create New Azure Web Site][new-website]

3. Click **DATA SERVICES**, **SQL DATABASE** then **QUICK CREATE**. Provide a name for the database, whether to use an existing database server or a new one, a region, and an administrator name and password.

	![Custom Create a new SQL Database][quick-create]


To see server and database information, click **SQL Databases** in the Management Portal. You can then click on **DATABASES** or **SERVERS** to see relevant information.

![View server and database information][sql-dbs-servers]

##<a id="ConnectionInfo"></a>How to: Get SQL Database connection information

To get SQL Database connection information, click on **SQL DATABASES** in the portal, then click on the name of the database.

![View database information][go-to-db-info]

Then, click on **View SQL Database connection strings for ADO.NET, ODBC, PHP, and JDBC**.

![Show connection strings][show-connection-string]

In the PHP section of the resulting window, make note of the values for **SERVER**, **DATABASE**, and **USERNAME**. Your password will be the password you used when creating the SQL Database.

##<a id="Connect"></a>How to: Connect to a SQL Database instance

The following examples show how to use the **SQLSRV** and **PDO_SQLSRV** extensions to connect to a SQL Database called `testdb`. For information about the **SQLSRV** and **PDO\_SQLSRV** APIs, see the [Microsoft Drivers for PHP for SQL Server documentation][driver-docs]. You will need information obtained from the section above. Replace `SERVER_ID` with your 10-digit server ID (which is the fist 10 characters from the SERVER value obtained in the section above), and assign the correct values (your user name and password) to the `$user` and `$pwd` variables.

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


##<a id="NextSteps"></a>Next steps
As mentioned earlier, using SQL Database is very similar to using SQL Server. Once you have established a connection to a SQL Database (as shown above), you can then use the **SQLSRV** or **PDO\_SQLSRV** APIs for inserting, retrieving, updating, and deleting data.  There are, however, some differences between SQL Database and SQL Server that could affect your application. For more information, see [Guidelines and Limitations (SQL Database)][limitations].

A sample that shows how to use SQL Database with PHP on Azure is available at <https://github.com/WindowsAzure/azure-sdk-for-php-samples/tree/master/tasklist-sqlazure>.

[download-drivers]: http://www.microsoft.com/download/en/details.aspx?id=20098
[limitations]: http://msdn.microsoft.com/library/windowsazure/ff394102.aspx
[odbc-php]: http://www.php.net/odbc
[manual-config]: http://php.net/manual/en/install.windows.iis7.php
[install-drivers]: http://php.net/manual/en/sqlsrv.requirements.php
[driver-docs]: http://msdn.microsoft.com/library/dd638075(SQL.10).aspx
[access-php-odbc]: http://social.technet.microsoft.com/wiki/contents/articles/accessing-sql-azure-from-php.aspx
[install-sql-express]: http://www.microsoft.com/download/details.aspx?id=29062
[management-portal]: https://manage.windowsazure.com
[prod-portal-instructions]: http://blogs.msdn.com/b/brian_swan/archive/2010/02/12/getting-started-with-php-and-sql-azure.aspx
[new-website]: ./media/sql-database-php-how-to-use-sql-database/plus-new.png
[custom-create]: ./media/sql-database-php-how-to-use-sql-database/create_custom_sql_db-2.png
[database-settings]: ./media/sql-database-php-how-to-use-sql-database/new-sql-db.png
[create-server]: ./media/sql-database-php-how-to-use-sql-database/db-server-settings.png
[sql-dbs-servers]: ./media/sql-database-php-how-to-use-sql-database/sql-dbs-portal.png
[wpi-installer]: http://go.microsoft.com/fwlink/?LinkId=253447
[go-to-db-info]: ./media/sql-database-php-how-to-use-sql-database/go-to-db-info.png
[show-connection-string]: ./media/sql-database-php-how-to-use-sql-database/show-connection-string-2.png
[quick-create]: ./media/sql-database-php-how-to-use-sql-database/create-new-sql.png
