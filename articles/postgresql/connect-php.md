---
title: Connect to Azure Database for PostgreSQL using PHP | Microsoft Docs
description: This quickstart provides a PHP code sample you can use to connect and query data from Azure Database for PostgreSQL.
services: postgresql
author: jasonwhowell
ms.author: jasonh
manager: jhubbard
editor: jasonwhowell
ms.service: postgresql-database
ms.custom: mvc
ms.devlang: php
ms.topic: hero-article
ms.date: 06/23/2017
---

# Azure Database for MySQL: Use PHP to connect and query data
This quickstart demonstrates how to connect to an Azure Database for PostgreSQL using a [PHP](http://php.net/manual/intro-whatis.php) application. It shows how to use SQL statements to query, insert, update, and delete data in the database. This article assumes you are familiar with development using PHP, but that you are new to working with Azure Database for PostgreSQL.

## Prerequisites
This quickstart uses the resources created in either of these guides as a starting point:
- [Create DB - Portal](quickstart-create-server-database-portal.md)
- [Create DB - Azure CLI](quickstart-create-server-database-azure-cli.md)

## Install PHP
Install PHP on your own server, or create an Azure [web app](https://docs.microsoft.com/en-us/azure/app-service-web/app-service-web-overview) that includes PHP.

### MacOS
- Download [PHP 7.1.4 version](http://php.net/downloads.php)
- Install PHP and refer to the [PHP manual](http://php.net/manual/install.macosx.php) for further configuration

### Linux (Ubuntu)
- Download [PHP 7.1.4 non-thread safe (x64) version](http://php.net/downloads.php) 
- Install PHP and refer to the [PHP manual](http://php.net/manual/install.unix.php) for further configuration
- The code uses the **pgsql** class (php_pgsql.so)  that is typically included in the PHP installation. If it is not included, you may run `sudo apt-get install php-pgsql` to install it.
- Enabled the **pgsql** extension by editing the php.ini configuration file. Write a new line with the text `extension=php_pgsql.so`, or uncomment an existing line with the same text by removing the semicolon prefix.

### Windows
- Download [PHP 7.1.4 non-thread safe (x64) version](http://windows.php.net/download#php-7.1)
- Install PHP and refer to the [PHP manual](http://php.net/manual/install.windows.php) for further configuration
- The code uses the **pgsql** class (ext/php_pgsql.dll)  that is included in the PHP installation. 
- Enabled the **pgsql** extension by editing the php.ini configuration file. Write a new line with the text `extension=php_pgsql.dll`, or uncomment an existing line with the same text by removing the semicolon prefix.

## Get connection information
Get the connection information needed to connect to the Azure Database for PostgreSQL. You need the fully qualified server name and login credentials.

1. Log in to the [Azure portal](https://portal.azure.com/).
2. From the left-hand menu in Azure portal, click **All resources** and search for the server you have created, such as **mypgserver-20170401**.
3. Click the server name **mypgserver-20170401**.
4. Select the server's **Overview** page. Make a note of the **Server name** and **Server admin login name**.
 ![Azure Database for PostgreSQL - Server Admin Login](./media/connect-php/1-connection-string.png)
5. If you forget your server login information, navigate to the **Overview** page to view the Server admin login name and, if necessary, reset the password.

## Connect and create a table
Use the following code to connect and create a table using **CREATE TABLE** SQL statement, followed by **INSERT INTO** SQL statements to add rows into the table.

The code call method [pg_connect()](http://php.net/manual/en/function.pg-connect.php) to connect to Azure Database for PostgreSQL. Then it calls method 
[pg_query()](http://php.net/manual/en/function.pg-query.php) several times to run several commands, and [pg_last_error()](http://php.net/manual/en/function.pg-last-error.php) to check the details if an error occurred each time. Then it calls method [pg_close()](http://php.net/manual/en/function.pg-close.php) to close the connection.

Replace the `$host`, `$database`, `$user`, and `$password` parameters with your own values. 

```php
<?php
	// Initialize connection variables.
	$host = "mypgserver-20170401.postgres.database.azure.com";
	$database = "mypgsqldb";
	$user = "mylogin@mypgserver-20170401";
	$password = "<server_admin_password>";

	// Initialize connection object.
	$connection = pg_connect("host=$host dbname=$database user=$user password=$password")
				or die("Failed to create connection to database: ". pg_last_error(). "<br/>");

	print "Successfully created connection to database.<br/>";

	// Drop previous table of same name if one exists.
	$query = "DROP TABLE IF EXISTS inventory;";
	pg_query($connection, $query) or die("Encountered an error when executing given sql statement: ". pg_last_error(). "<br/>");
	print "Finished dropping table (if existed).<br/>";

	// Create table.
	$query = "CREATE TABLE inventory (id serial PRIMARY KEY, name VARCHAR(50), quantity INTEGER);";
	pg_query($connection, $query) or die("Encountered an error when executing given sql statement: ". pg_last_error(). "<br/>");
	print "Finished creating table.<br/>";

	// Insert some data into table.
	$name = '\'banana\'';
	$quantity = 150;
	$query = "INSERT INTO inventory (name, quantity) VALUES ($1, $2);";
	pg_query_params($connection, $query, array("banana", 150));
	//pg_query($connection, $query) or die("Encountered an error when executing given sql statement: ". pg_last_error(). "<br/>");

	$name = '\'orange\'';
	$quantity = 154;
	$query = "INSERT INTO inventory (name, quantity) VALUES ($name, $quantity);";
	pg_query($connection, $query) or die("Encountered an error when executing given sql statement: ". pg_last_error(). "<br/>");

	$name = '\'apple\'';
	$quantity = 100;
	$query = "INSERT INTO inventory (name, quantity) VALUES ($name, $quantity);";
	pg_query($connection, $query) or die("Encountered an error when executing given sql statement: ". pg_last_error()). "<br/>";

	print "Inserted 3 rows of data.<br/>";

	// Closing connection
	pg_close($connection);
?>
```

## Read data
Use the following code to connect and read the data using a **SELECT** SQL statement. 

 The code call method [pg_connect()](http://php.net/manual/en/function.pg-connect.php) to connect to Azure Database for PostgreSQL. Then it calls method [pg_query()](http://php.net/manual/en/function.pg-query.php) to run the SELECT command, keeping the results in a result set, and [pg_last_error()](http://php.net/manual/en/function.pg-last-error.php) to check the details if an error occurred.  To read the result set, method [pg_fetch_row()](http://php.net/manual/en/function.pg-fetch-row.php) is called in a loop, once per row, and the row data is retrieved in an array `$row`, with one data value per column in each array position.  To free the result set, method [pg_free_result()](http://php.net/manual/en/function.pg-free-result.php) is called. Then it calls method [pg_close()](http://php.net/manual/en/function.pg-close.php) to close the connection.

Replace the `$host`, `$database`, `$user`, and `$password` parameters with your own values. 

```php
<?php
	// Initialize connection variables.
	$host = "mypgserver-20170401.postgres.database.azure.com";
	$database = "mypgsqldb";
	$user = "mylogin@mypgserver-20170401";
	$password = "<server_admin_password>";
	
	// Initialize connection object.
	$connection = pg_connect("host=$host dbname=$database user=$user password=$password")
				or die("Failed to create connection to database: ". pg_last_error(). "<br/>");

	print "Successfully created connection to database. <br/>";

	// Perform some SQL queries over the connection.
	$query = "SELECT * from inventory";
	$result_set = pg_query($connection, $query) or die("Encountered an error when executing given sql statement: ". pg_last_error(). "<br/>");
	while ($row = pg_fetch_row($result_set))
	{
		print "Data row = ($row[0], $row[1], $row[2]). <br/>";
	}

	// Free result_set
	pg_free_result($result_set);

	// Closing connection
	pg_close($connection);
?>
```

## Update data
Use the following code to connect and update the data using a **UPDATE** SQL statement.

The code call method [pg_connect()](http://php.net/manual/en/function.pg-connect.php) to connect to Azure Database for PostgreSQL. Then it calls method [pg_query()](http://php.net/manual/en/function.pg-query.php) to run a command, and [pg_last_error()](http://php.net/manual/en/function.pg-last-error.php) to check the details if an error occurred. Then it calls method [pg_close()](http://php.net/manual/en/function.pg-close.php) to close the connection.

Replace the `$host`, `$database`, `$user`, and `$password` parameters with your own values. 

```php
<?php
	// Initialize connection variables.
	$host = "mypgserver-20170401.postgres.database.azure.com";
	$database = "mypgsqldb";
	$user = "mylogin@mypgserver-20170401";
	$password = "<server_admin_password>";

	// Initialize connection object.
	$connection = pg_connect("host=$host dbname=$database user=$user password=$password")
				or die("Failed to create connection to database: ". pg_last_error(). ".<br/>");

	print "Successfully created connection to database. <br/>";

	// Modify some data in table.
	$new_quantity = 200;
	$name = '\'banana\'';
	$query = "UPDATE inventory SET quantity = $new_quantity WHERE name = $name;";
	pg_query($connection, $query) or die("Encountered an error when executing given sql statement: ". pg_last_error(). ".<br/>");
	print "Updated 1 row of data. </br>";

	// Closing connection
	pg_close($connection);
?>
```


## Delete data
Use the following code to connect and read the data using a **DELETE** SQL statement. 

 The code call method [pg_connect()](http://php.net/manual/en/function.pg-connect.php) to connect to  Azure Database for PostgreSQL. Then it calls method [pg_query()](http://php.net/manual/en/function.pg-query.php) to run a command, and [pg_last_error()](http://php.net/manual/en/function.pg-last-error.php) to check the details if an error occurred. Then it calls method [pg_close()](http://php.net/manual/en/function.pg-close.php) to close the connection.

Replace the `$host`, `$database`, `$user`, and `$password` parameters with your own values. 

```php
<?php
	// Initialize connection variables.
	$host = "mypgserver-20170401.postgres.database.azure.com";
	$database = "mypgsqldb";
	$user = "mylogin@mypgserver-20170401";
	$password = "<server_admin_password>";

	// Initialize connection object.
	$connection = pg_connect("host=$host dbname=$database user=$user password=$password")
				or die("Failed to create connection to database: ". pg_last_error(). ". </br>");

	print "Successfully created connection to database. <br/>";

	// Delete some data from table.
	$name = '\'orange\'';
	$query = "DELETE FROM inventory WHERE name = $name;";
	pg_query($connection, $query) or die("Encountered an error when executing given sql statement: ". pg_last_error(). ". <br/>");
	print "Deleted 1 row of data. <br/>";

	// Closing connection
	pg_close($connection);
?>
```

## Next steps
> [!div class="nextstepaction"]
> [Migrate your database using Export and Import](./howto-migrate-using-export-and-import.md)
