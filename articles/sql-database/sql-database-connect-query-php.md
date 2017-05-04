---
title: Connect to Azure SQL Database by using PHP | Microsoft Docs
description: Presents a PHP code sample you can use to connect to and query Azure SQL Database.
services: sql-database
documentationcenter: ''
author: meet-bhagdev
manager: jhubbard
editor: ''

ms.assetid: 4e71db4a-a22f-4f1c-83e5-4a34a036ecf3
ms.service: sql-database
ms.custom: quick start connect
ms.workload: drivers
ms.tgt_pltfrm: na
ms.devlang: php
ms.topic: article
ms.date: 04/05/2017
ms.author: meetb;carlrab;sstein

---
# Azure SQL Database: Use PHP to connect and query data

Use [PHP](http://php.net/manual/en/intro-whatis.php) to connect to and query an Azure SQL database. This guide details using PHP to connect to an Azure SQL database, and then execute query, insert, update, and delete statements.

This quick start uses as its starting point the resources created in one of these quick starts:

- [Create DB - Portal](sql-database-get-started-portal.md)
- [Create DB - CLI](sql-database-get-started-cli.md)

## Configure Development Environment
### **Mac OS**
Open your terminal and enter the following commands to install **brew**, **Microsoft ODBC Driver for Mac** and the **Microsoft PHP Drivers for SQL Server**. 

```bash
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew tap microsoft/msodbcsql https://github.com/Microsoft/homebrew-msodbcsql-preview
brew update
brew install msodbcsql 
#for silent install ACCEPT_EULA=y brew install msodbcsql 
pecl install sqlsrv-4.1.7preview
pecl install pdo_sqlsrv-4.1.7preview
```

### **Linux (Ubuntu)**
Enter the following commands to install the **Microsoft ODBC Driver for Linux** and the **Microsoft PHP Drivers for SQL Server**.

```bash
sudo su
curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add -
curl https://packages.microsoft.com/config/ubuntu/16.04/prod.list > /etc/apt/sources.list.d/mssql.list
exit
sudo apt-get update
sudo apt-get install msodbcsql mssql-tools unixodbc-dev gcc g++ php-dev
sudo pecl install sqlsrv pdo_sqlsrv
sudo echo "extension= pdo_sqlsrv.so" >> `php --ini | grep "Loaded Configuration" | sed -e "s|.*:\s*||"`
sudo echo "extension= sqlsrv.so" >> `php --ini | grep "Loaded Configuration" | sed -e "s|.*:\s*||"`
```

### **Windows**
- Install PHP 7.1.1 (x64) [from WebPlatform Installer](https://www.microsoft.com/web/downloads/platform.aspx?lang=) 
- Install the [Microsoft ODBC Driver 13.1](https://www.microsoft.com/download/details.aspx?id=53339). 
- Download the non-thread safe dll's for the [Microsoft PHP Driver for SQL Server](https://pecl.php.net/package/sqlsrv/4.1.6.1/windows) and place the binaries in the PHP\v7.x\ext folder.
- Next edit your php.ini (C:\Program Files\PHP\v7.1\php.ini) file by adding the reference to the dll. For example:
      
      extension=php_sqlsrv.dll
      extension=php_pdo_sqlsrv.dll

At this point you should have the dll's registered with PHP.

## Get connection information

Get the connection string in the Azure portal. You use the connection string to connect to the Azure SQL database.

1. Log in to the [Azure portal](https://portal.azure.com/).
2. Select **SQL Databases** from the left-hand menu, and click your database on the **SQL databases** page. 
3. In the **Essentials** pane for your database, review the fully qualified server name. 

    <img src="./media/sql-database-connect-query-dotnet/server-name.png" alt="connection strings" style="width: 780px;" />
    
## Select Data
The [sqlsrv_query()](https://docs.microsoft.com/sql/connect/php/sqlsrv-query) function can be used to retrieve a result set from a query against SQL Database. This function essentially accepts any query and returns a result set that can be iterated over with the use of [sqlsrv_fetch_array()](http://php.net/manual/en/function.sqlsrv-fetch-array.php).

```PHP
<?php
$serverName = "yourserver.database.windows.net";
$connectionOptions = array(
    "Database" => "yourdatabase",
    "Uid" => "yourusername",
    "PWD" => "yourpassword"
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


## Insert data
In SQL Database the [IDENTITY](https://msdn.microsoft.com/library/ms186775.aspx) property and the [SEQUENCE](https://msdn.microsoft.com/library/ff878058.aspx) object can be used to auto-generate [primary key](https://msdn.microsoft.com/library/ms179610.aspx) values. 

```PHP
<?php
$serverName = "yourserver.database.windows.net";
$connectionOptions = array(
    "Database" => "yourdatabase",
    "Uid" => "yourusername",
    "PWD" => "yourpassword"
);
//Establishes the connection
$conn = sqlsrv_connect($serverName, $connectionOptions);
$tsql= "INSERT INTO SalesLT.Product (Name, ProductNumber, Color, StandardCost, ListPrice, SellStartDate) VALUES (?,?,?,?,?,?);";
$params = array("BrandNewProduct", "200989", "Blue", 75, 80, "7/1/2016");
$getResults= sqlsrv_query($conn, $tsql, $params);
if ($getResults == FALSE)
    echo print_r(sqlsrv_errors(), true);
else{
    $rowsAffected = sqlsrv_rows_affected($getResults);
    echo ($rowsAffected. " row(s) inserted" . PHP_EOL);
    sqlsrv_free_stmt($getResults);
}
?>
```

## Update data
The [sqlsrv_query()](https://docs.microsoft.com/sql/connect/php/sqlsrv-query) function can be used to do an [UPDATE](https://msdn.microsoft.com/library/ms177523.aspx) Transact-SQL statement to update data in your Azure SQL database.

```PHP
<?php
$serverName = "yourserver.database.windows.net";
$connectionOptions = array(
    "Database" => "yourdatabase",
    "Uid" => "yourusername",
    "PWD" => "yourpassword"
);
//Establishes the connection
$conn = sqlsrv_connect($serverName, $connectionOptions);
$tsql= "UPDATE SalesLT.Product SET ListPrice =? WHERE Name = ?";
$params = array(50,"BrandNewProduct");
$getResults= sqlsrv_query($conn, $tsql, $params);
if ($getResults == FALSE)
    echo print_r(sqlsrv_errors(), true);
else{
    $rowsAffected = sqlsrv_rows_affected($getResults);
    echo ($rowsAffected. " row(s) updated" . PHP_EOL);
    sqlsrv_free_stmt($getResults);
}
?>
```

## Delete data
The [sqlsrv_query()](https://docs.microsoft.com/sql/connect/php/sqlsrv-query) function can be used to do a [DELETE](https://msdn.microsoft.com/library/ms189835.aspx) Transact-SQL statement to delete data in your Azure SQL database.

```PHP
<?php
$serverName = "yourserver.database.windows.net";
$connectionOptions = array(
    "Database" => "yourdatabase",
    "Uid" => "yourusername",
    "PWD" => "yourpassword"
);
//Establishes the connection
$conn = sqlsrv_connect($serverName, $connectionOptions);
$tsql= "DELETE FROM SalesLT.Product WHERE Name = ?";
$params = array("BrandNewProduct");
$getResults= sqlsrv_query($conn, $tsql, $params);
if ($getResults == FALSE)
    echo print_r(sqlsrv_errors(), true);
else{
    $rowsAffected = sqlsrv_rows_affected($getResults);
    echo ($rowsAffected. " row(s) deleted" . PHP_EOL);
    sqlsrv_free_stmt($getResults);
}
```

## Next steps
* Review the [SQL Database Development Overview](sql-database-develop-overview.md).
* More information on the [Microsoft PHP Driver for SQL Server](https://github.com/Microsoft/msphpsql/).
* [File issues/ask questions](https://github.com/Microsoft/msphpsql/issues).
* Explore all the [capabilities of SQL Database](https://azure.microsoft.com/services/sql-database/).
