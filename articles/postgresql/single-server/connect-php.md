---
title: 'Quickstart: Connect with PHP - Azure Database for PostgreSQL - Single Server'
description: This quickstart provides a PHP code sample you can use to connect and query data from Azure Database for PostgreSQL - Single Server.
ms.service: postgresql
ms.subservice: single-server
ms.author: sunila
author: sunilagarwal
ms.reviewer: ""
ms.custom: mvc, mode-other
ms.devlang: php
ms.topic: quickstart
ms.date: 06/24/2022
---

# Quickstart: Use PHP to connect and query data in Azure Database for PostgreSQL - Single Server

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

This quickstart demonstrates how to connect to an Azure Database for PostgreSQL using a [PHP](https://secure.php.net/manual/intro-whatis.php) application. It shows how to use SQL statements to query, insert, update, and delete data in the database. The steps in this article assume that you are familiar with developing using PHP, and are new to working with Azure Database for PostgreSQL.

## Prerequisites

This quickstart uses the resources created in either of these guides as a starting point:
- [Create DB - Portal](quickstart-create-server-database-portal.md)
- [Create DB - Azure CLI](quickstart-create-server-database-azure-cli.md)

## Install PHP

Install PHP on your own server, or create an Azure [web app](../../app-service/overview.md) that includes PHP.

### Windows

- Download [PHP 7.1.4 non-thread safe (x64) version](https://windows.php.net/download#php-7.1)
- Install PHP and refer to the [PHP manual](https://secure.php.net/manual/install.windows.php) for further configuration
- The code uses the **pgsql** class (ext/php_pgsql.dll)  that is included in the PHP installation. 
- Enabled the **pgsql** extension by editing the php.ini configuration file, typically located at `C:\Program Files\PHP\v7.1\php.ini`. The configuration file should contain a line with the text `extension=php_pgsql.so`. If it is not shown, add the text and save the file. If the text is present, but commented with a semicolon prefix, uncomment the text by removing the semicolon.

### Linux (Ubuntu)

- Download [PHP 7.1.4 non-thread safe (x64) version](https://secure.php.net/downloads.php) 
- Install PHP and refer to the [PHP manual](https://secure.php.net/manual/install.unix.php) for further configuration
- The code uses the **pgsql** class (php_pgsql.so). Install it by running `sudo apt-get install php-pgsql`.
- Enabled the **pgsql** extension by editing the `/etc/php/7.0/mods-available/pgsql.ini` configuration file. The configuration file should contain a line with the text `extension=php_pgsql.so`. If it is not shown, add the text and save the file. If the text is present, but commented with a semicolon prefix, uncomment the text by removing the semicolon.

### MacOS

- Download [PHP 7.1.4 version](https://secure.php.net/downloads.php)
- Install PHP and refer to the [PHP manual](https://secure.php.net/manual/install.macosx.php) for further configuration

## Get connection information

Get the connection information needed to connect to the Azure Database for PostgreSQL. You need the fully qualified server name and login credentials.

1. Log in to the [Azure portal](https://portal.azure.com/).
2. From the left-hand menu in Azure portal, select **All resources**, and then search for the server you have created (such as **mydemoserver**).
3. Select the server name.
4. From the server's **Overview** panel, make a note of the **Server name** and **Server admin login name**. If you forget your password, you can also reset the password from this panel.
:::image type="content" source="./media/connect-php/1-connection-string.png" alt-text="Azure Database for PostgreSQL server name":::

## Connect and create a table

Use the following code to connect and create a table using **CREATE TABLE** SQL statement, followed by **INSERT INTO** SQL statements to add rows into the table.

The code call method [pg_connect()](https://secure.php.net/manual/en/function.pg-connect.php) to connect to Azure Database for PostgreSQL. Then it calls method 
[pg_query()](https://secure.php.net/manual/en/function.pg-query.php) several times to run several commands, and [pg_last_error()](https://secure.php.net/manual/en/function.pg-last-error.php) to check the details if an error occurred each time. Then it calls method [pg_close()](https://secure.php.net/manual/en/function.pg-close.php) to close the connection.

Replace the `$host`, `$database`, `$user`, and `$password` parameters with your own values.

```php
<?php
	// Initialize connection variables.
	$host = "mydemoserver.postgres.database.azure.com";
	$database = "mypgsqldb";
	$user = "mylogin@mydemoserver";
	$password = "<server_admin_password>";

	// Initialize connection object.
	$connection = pg_connect("host=$host dbname=$database user=$user password=$password") 
		or die("Failed to create connection to database: ". pg_last_error(). "<br/>");
	print "Successfully created connection to database.<br/>";

	// Drop previous table of same name if one exists.
	$query = "DROP TABLE IF EXISTS inventory;";
	pg_query($connection, $query) 
		or die("Encountered an error when executing given sql statement: ". pg_last_error(). "<br/>");
	print "Finished dropping table (if existed).<br/>";

	// Create table.
	$query = "CREATE TABLE inventory (id serial PRIMARY KEY, name VARCHAR(50), quantity INTEGER);";
	pg_query($connection, $query) 
		or die("Encountered an error when executing given sql statement: ". pg_last_error(). "<br/>");
	print "Finished creating table.<br/>";

	// Insert some data into table.
	$name = '\'banana\'';
	$quantity = 150;
	$query = "INSERT INTO inventory (name, quantity) VALUES ($name, $quantity);";
	pg_query($connection, $query) 
		or die("Encountered an error when executing given sql statement: ". pg_last_error(). "<br/>");

	$name = '\'orange\'';
	$quantity = 154;
	$query = "INSERT INTO inventory (name, quantity) VALUES ($name, $quantity);";
	pg_query($connection, $query) 
		or die("Encountered an error when executing given sql statement: ". pg_last_error(). "<br/>");

	$name = '\'apple\'';
	$quantity = 100;
	$query = "INSERT INTO inventory (name, quantity) VALUES ($name, $quantity);";
	pg_query($connection, $query) 
		or die("Encountered an error when executing given sql statement: ". pg_last_error()). "<br/>";

	print "Inserted 3 rows of data.<br/>";

	// Closing connection
	pg_close($connection);
?>
```

## Read data

Use the following code to connect and read the data using a **SELECT** SQL statement.

The code call method [pg_connect()](https://secure.php.net/manual/en/function.pg-connect.php) to connect to Azure Database for PostgreSQL. Then it calls method [pg_query()](https://secure.php.net/manual/en/function.pg-query.php) to run the SELECT command, keeping the results in a result set, and [pg_last_error()](https://secure.php.net/manual/en/function.pg-last-error.php) to check the details if an error occurred.  To read the result set, method [pg_fetch_row()](https://secure.php.net/manual/en/function.pg-fetch-row.php) is called in a loop, once per row, and the row data is retrieved in an array `$row`, with one data value per column in each array position.  To free the result set, method [pg_free_result()](https://secure.php.net/manual/en/function.pg-free-result.php) is called. Then it calls method [pg_close()](https://secure.php.net/manual/en/function.pg-close.php) to close the connection.

Replace the `$host`, `$database`, `$user`, and `$password` parameters with your own values.

```php
<?php
	// Initialize connection variables.
	$host = "mydemoserver.postgres.database.azure.com";
	$database = "mypgsqldb";
	$user = "mylogin@mydemoserver";
	$password = "<server_admin_password>";

	// Initialize connection object.
	$connection = pg_connect("host=$host dbname=$database user=$user password=$password")
				or die("Failed to create connection to database: ". pg_last_error(). "<br/>");

	print "Successfully created connection to database. <br/>";

	// Perform some SQL queries over the connection.
	$query = "SELECT * from inventory";
	$result_set = pg_query($connection, $query) 
		or die("Encountered an error when executing given sql statement: ". pg_last_error(). "<br/>");
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

The code call method [pg_connect()](https://secure.php.net/manual/en/function.pg-connect.php) to connect to Azure Database for PostgreSQL. Then it calls method [pg_query()](https://secure.php.net/manual/en/function.pg-query.php) to run a command, and [pg_last_error()](https://secure.php.net/manual/en/function.pg-last-error.php) to check the details if an error occurred. Then it calls method [pg_close()](https://secure.php.net/manual/en/function.pg-close.php) to close the connection.

Replace the `$host`, `$database`, `$user`, and `$password` parameters with your own values.

```php
<?php
	// Initialize connection variables.
	$host = "mydemoserver.postgres.database.azure.com";
	$database = "mypgsqldb";
	$user = "mylogin@mydemoserver";
	$password = "<server_admin_password>";

	// Initialize connection object.
	$connection = pg_connect("host=$host dbname=$database user=$user password=$password")
				or die("Failed to create connection to database: ". pg_last_error(). ".<br/>");

	print "Successfully created connection to database. <br/>";

	// Modify some data in table.
	$new_quantity = 200;
	$name = '\'banana\'';
	$query = "UPDATE inventory SET quantity = $new_quantity WHERE name = $name;";
	pg_query($connection, $query) 
		or die("Encountered an error when executing given sql statement: ". pg_last_error(). ".<br/>");
	print "Updated 1 row of data. </br>";

	// Closing connection
	pg_close($connection);
?>
```

## Delete data

Use the following code to connect and read the data using a **DELETE** SQL statement.

The code call method [pg_connect()](https://secure.php.net/manual/en/function.pg-connect.php) to connect to  Azure Database for PostgreSQL. Then it calls method [pg_query()](https://secure.php.net/manual/en/function.pg-query.php) to run a command, and [pg_last_error()](https://secure.php.net/manual/en/function.pg-last-error.php) to check the details if an error occurred. Then it calls method [pg_close()](https://secure.php.net/manual/en/function.pg-close.php) to close the connection.

Replace the `$host`, `$database`, `$user`, and `$password` parameters with your own values.

```php
<?php
	// Initialize connection variables.
	$host = "mydemoserver.postgres.database.azure.com";
	$database = "mypgsqldb";
	$user = "mylogin@mydemoserver";
	$password = "<server_admin_password>";

	// Initialize connection object.
	$connection = pg_connect("host=$host dbname=$database user=$user password=$password")
			or die("Failed to create connection to database: ". pg_last_error(). ". </br>");

	print "Successfully created connection to database. <br/>";

	// Delete some data from table.
	$name = '\'orange\'';
	$query = "DELETE FROM inventory WHERE name = $name;";
	pg_query($connection, $query) 
		or die("Encountered an error when executing given sql statement: ". pg_last_error(). ". <br/>");
	print "Deleted 1 row of data. <br/>";

	// Closing connection
	pg_close($connection);
?>
```

## Clean up resources

To clean up all resources used during this quickstart, delete the resource group using the following command:

```azurecli
az group delete \
    --name $AZ_RESOURCE_GROUP \
    --yes
```

## Next steps

> [!div class="nextstepaction"]
> [Migrate your database using Export and Import](./how-to-migrate-using-export-and-import.md)
