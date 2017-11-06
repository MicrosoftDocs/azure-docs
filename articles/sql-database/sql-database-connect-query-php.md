---
title: Use PHP to query Azure SQL Database | Microsoft Docs
description: This topic shows you how to use PHP to create a program that connects to an Azure SQL Database and query it using Transact-SQL statements.
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: ''

ms.assetid: 4e71db4a-a 22f-4f1c-83e5-4a34a036ecf3
ms.service: sql-database
ms.custom: mvc,develop apps
ms.workload: drivers
ms.tgt_pltfrm: na
ms.devlang: php
ms.topic: quickstart
ms.date: 08/08/2017
ms.author: carlrab

---
# Use PHP to query an Azure SQL database

This quick start tutorial demonstrates how to use [PHP](http://php.net/manual/en/intro-whatis.php) to create a program to connect to an Azure SQL database and use Transact-SQL statements to query data.

## Prerequisites

To complete this quick start tutorial, make sure you have the following:

- An Azure SQL database. This quick start uses the resources created in one of these quick starts: 

   - [Create DB - Portal](sql-database-get-started-portal.md)
   - [Create DB - CLI](sql-database-get-started-cli.md)
   - [Create DB - PowerShell](sql-database-get-started-powershell.md)

- A [server-level firewall rule](sql-database-get-started-portal.md#create-a-server-level-firewall-rule) for the public IP address of the computer you use for this quick start tutorial.

- You have installed PHP and related software for your operating system.

    - **MacOS**: Install Homebrew and PHP, install the ODBC driver and SQLCMD, and then install the PHP Driver for SQL Server. See [Steps 1.2, 1.3, and 2.1](https://www.microsoft.com/en-us/sql-server/developer-get-started/php/mac/).
    - **Ubuntu**:  Install PHP and other required packages, and then install the PHP Driver for SQL Server. See [Steps 1.2 and 2.1](https://www.microsoft.com/sql-server/developer-get-started/php/ubuntu/).
    - **Windows**: Install the newest version of PHP for IIS Express, the newest version of Microsoft Drivers for SQL Server in IIS Express, Chocolatey, the ODBC driver, and SQLCMD. See [Steps 1.2 and 1.3](https://www.microsoft.com/sql-server/developer-get-started/php/windows/).    

## SQL server connection information

Get the connection information needed to connect to the Azure SQL database. You will need the fully qualified server name, database name, and login information in the next procedures.

1. Log in to the [Azure portal](https://portal.azure.com/).
2. Select **SQL Databases** from the left-hand menu, and click your database on the **SQL databases** page. 
3. On the **Overview** page for your database, review the fully qualified server name as shown in the following image. You can hover over the server name to bring up the **Click to copy** option.  

   ![server-name](./media/sql-database-connect-query-dotnet/server-name.png) 

4. If you forget your server login information, navigate to the SQL Database server page to view the server admin name and, if necessary, reset the password.     
    
## Insert code to query SQL database

1. In your favorite text editor, create a new file, **sqltest.php**.  

2. Replace the contents with the following code and add the appropriate values for your server, database, user, and password.

   ```PHP
   <?php
   $serverName = "your_server.database.windows.net";
   $connectionOptions = array(
       "Database" => "your_database",
       "Uid" => "your_username",
       "PWD" => "your_password"
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

1. At the command prompt, run the following commands:

   ```php
   php sqltest.php
   ```

2. Verify that the top 20 rows are returned and then close the application window.

## Next steps
- [Design your first Azure SQL database](sql-database-design-first-database.md)
- [Microsoft PHP Drivers for SQL Server](https://github.com/Microsoft/msphpsql/)
- [Report issues or ask questions](https://github.com/Microsoft/msphpsql/issues)
