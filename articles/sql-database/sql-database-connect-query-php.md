---
title: Use PHP to query Azure SQL database | Microsoft Docs
description: How to use PHP to create a program that connects to an Azure SQL database and query it using T-SQL statements.
services: sql-database
ms.service: sql-database
ms.subservice: development
ms.devlang: php
ms.topic: quickstart
author: CarlRabeler
ms.author: carlrab
ms.reviewer: v-masebo
manager: craigg
ms.date: 11/28/2018
---
# Quickstart: Use PHP to query an Azure SQL database

This article demonstrates how to use [PHP](http://php.net/manual/en/intro-whatis.php) to connect to an Azure SQL database. You can then use T-SQL statements to query data.

## Prerequisites

To complete this sample, make sure you have the following prerequisites:

[!INCLUDE [prerequisites-create-db](../../includes/sql-database-connect-query-prerequisites-create-db-includes.md)]

- A [server-level firewall rule](sql-database-get-started-portal-firewall.md) for the public IP address of the computer you're using

- PHP-related software installed for your operating system:

    - **MacOS**, install Homebrew and PHP, the ODBC driver and SQLCMD, then install the PHP Driver for SQL Server. See [Step 1.2, 1.3, and 2.1](https://www.microsoft.com/sql-server/developer-get-started/php/mac/).

    - **Ubuntu**, install PHP and other required packages, then install the PHP Driver for SQL Server. See [Step 1.2 and 2.1](https://www.microsoft.com/sql-server/developer-get-started/php/ubuntu/).

    - **Windows**, install PHP for IIS Express and Chocolatey, then install the ODBC driver and SQLCMD. See [Step 1.2 and 1.3](https://www.microsoft.com/sql-server/developer-get-started/php/windows/).

## Get database connection

[!INCLUDE [prerequisites-server-connection-info](../../includes/sql-database-connect-query-prerequisites-server-connection-info-includes.md)]

## Add code to query database

1. In your favorite text editor, create a new file, *sqltest.php*.  

1. Replace its contents with the following code. Then add the appropriate values for your server, database, user, and password.

   ```PHP
   <?php
       $serverName = "your_server.database.windows.net"; // update me
       $connectionOptions = array(
           "Database" => "your_database", // update me
           "Uid" => "your_username", // update me
           "PWD" => "your_password" // update me
       );
       //Establishes the connection
       $conn = sqlsrv_connect($serverName, $connectionOptions);
       $tsql= "SELECT TOP 20 pc.Name as CategoryName, p.name as ProductName
            FROM [SalesLT].[ProductCategory] pc
            JOIN [SalesLT].[Product] p
            ON pc.productcategoryid = p.productcategoryid";
       $getResults= sqlsrv_query($conn, $tsql);
       echo ("Reading data from table" . PHP_EOL);
       if ($getResults == FALSE)
           echo (sqlsrv_errors());
       while ($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)) {
        echo ($row['CategoryName'] . " " . $row['ProductName'] . PHP_EOL);
       }
       sqlsrv_free_stmt($getResults);
   ?>
   ```

## Run the code

1. At the command prompt, run the program.

   ```bash
   php sqltest.php
   ```

1. Verify the top 20 rows are returned and close the application window.

## Next steps

- [Design your first Azure SQL database](sql-database-design-first-database.md)

- [Microsoft PHP Drivers for SQL Server](https://github.com/Microsoft/msphpsql/)

- [Report issues or ask questions](https://github.com/Microsoft/msphpsql/issues)

- [Retry logic example: Connect resiliently to SQL with PHP](/sql/connect/php/step-4-connect-resiliently-to-sql-with-php)
