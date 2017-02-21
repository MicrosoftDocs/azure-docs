---
title: Connect to SQL Database by using PHP on Windows | Microsoft Docs
description: Presents a sample PHP program that connects to Azure SQL Database from a Windows client, and provides links to the necessary software components needed by the client.
services: sql-database
documentationcenter: ''
author: meet-bhagdev
manager: jhubbard
editor: ''

ms.assetid: 4e71db4a-a22f-4f1c-83e5-4a34a036ecf3
ms.service: sql-database
ms.custom: development
ms.workload: drivers
ms.tgt_pltfrm: na
ms.devlang: php
ms.topic: article
ms.date: 02/13/2017
ms.author: meetb

---

# Connect to SQL Database by using PHP
[!INCLUDE [sql-database-develop-includes-selector-language-platform-depth](../../includes/sql-database-develop-includes-selector-language-platform-depth.md)]

This topic shows how to connect and query an Azure SQL Database using PHP. You can run this sample from Windows or Linux. 


## Step 1: Create a SQL database
See the [getting started page](sql-database-get-started.md) to learn how to create a sample database.  It is important you follow the guide to create an **AdventureWorks database template**. The samples shown below only work with the **AdventureWorks schema**. Once you create your database make sure you enable access to your IP address by enabling the firewall rules as described in the [getting started page](sql-database-get-started.md)

## Step 2: Configure development environment

### **Linux (Ubuntu)**
Open your terminal and navigate to a directory where you plan on creating your python script. Enter the following commands to install the **Microsoft ODBC Driver for Linux**, **pdo_sqlsrv** and **sqlsrv**. Microsoft PHP Driver for SQL Server uses the Microsoft ODBC Driver on Linux to connect to SQL Databases.

```
sudo su
curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add -
curl https://packages.microsoft.com/config/ubuntu/16.04/prod.list > /etc/apt/sources.list.d/mssql-release.list
exit
sudo apt-get update
sudo ACCEPT_EULA=Y apt-get install msodbcsql unixodbc-dev gcc g++ build-essential
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

## Step 3: Run sample code
Create a file called **sql_sample.php** and paste the following code inside it. You can run this from the command line using:

```
php sql_sample.php
```

### Connect to your SQL Database
The [sqlsrv connect](http://php.net/manual/en/function.sqlsrv-connect.php) function is used to connect to SQL Database.

```
<?php
$serverName = "yourserver.database.windows.net";
$connectionOptions = array(
	"Database" => "yourdatabase",
    "Uid" => "yourusername",
    "PWD" => "yourpassword"
    );
//Establishes the connection
$conn = sqlsrv_connect($serverName, $connectionOptions);
if($conn)
    echo "Connected!"
?>
```

### Execute an SQL SELECT statement
The [sqlsrv_query](http://php.net/manual/en/function.sqlsrv-query.php) function can be used to retrieve a result set from a query against SQL Database. 

```
<?php
$serverName = "yourserver.database.windows.net";
$connectionOptions = array(
	"Database" => "yourdatabase",
	"Uid" => "yourusername",
	"PWD" => "yourpassword"
);
//Establishes the connection
$conn = sqlsrv_connect($serverName, $connectionOptions);
if($conn)
	echo "Connected!"
$tsql = "SELECT [CompanyName] FROM SalesLT.Customer";  
$getProducts = sqlsrv_query($conn, $tsql);  
if ($getProducts == FALSE)  
	die(FormatErrors(sqlsrv_errors()));  
$productCount = 0;  
while($row = sqlsrv_fetch_array($getProducts, SQLSRV_FETCH_ASSOC))  
{  
	echo($row['CompanyName']);  
	echo("<br/>");  
	$productCount++;  
}  
sqlsrv_free_stmt($getProducts);  
sqlsrv_close($conn);    
function FormatErrors( $errors )
{
	/* Display errors. */
	echo "Error information: ";
	
	foreach ( $errors as $error )
	{
		echo "SQLSTATE: ".$error['SQLSTATE']."";
		echo "Code: ".$error['code']."";
		echo "Message: ".$error['message']."";
	}
}
?>
```

### Insert a row, pass parameters, and retrieve the generated primary key
In SQL Database the [IDENTITY](https://msdn.microsoft.com/library/ms186775.aspx) property and the [SEQUENCE](https://msdn.microsoft.com/library/ff878058.aspx) object can be used to auto-generate [primary key](https://msdn.microsoft.com/library/ms179610.aspx) values. 


```
<?php
$serverName = "yourserver.database.windows.net";
$connectionOptions = array(
	"Database" => "yourdatabase",
	"Uid" => "yourusername",
	"PWD" => "yourpassword"
);
//Establishes the connection
$conn = sqlsrv_connect($serverName, $connectionOptions);
if($conn)
	echo "Connected!"
$tsql = "INSERT SalesLT.Product (Name, ProductNumber, StandardCost, ListPrice, SellStartDate) OUTPUT INSERTED.ProductID VALUES ('SQL Server 1', 'SQL Server 2', 0, 0, getdate())";  
//Insert query  
$insertReview = sqlsrv_query($conn, $tsql);  
if($insertReview == FALSE)  
	die(FormatErrors( sqlsrv_errors()));  
echo "Product Key inserted is :";  
while($row = sqlsrv_fetch_array($insertReview, SQLSRV_FETCH_ASSOC))  
{     
	echo($row['ProductID']);  
}  
sqlsrv_free_stmt($insertReview);  
sqlsrv_close($conn);  
function FormatErrors( $errors )
{
	/* Display errors. */
	echo "Error information: ";
	foreach ( $errors as $error )
	{
		echo "SQLSTATE: ".$error['SQLSTATE']."";
		echo "Code: ".$error['code']."";
		echo "Message: ".$error['message']."";
    }
}
?>
```


## Next steps
* Review the [SQL Database Development Overview](sql-database-develop-overview.md)
* More information on the [Microsoft PHP Driver for SQL Server](https://github.com/Microsoft/msphpsql/)
* [File issues/ask questions](https://github.com/Microsoft/msphpsql/issues).

## Additional resources
* [Design Patterns for Multi-tenant SaaS Applications with Azure SQL Database](sql-database-design-patterns-multi-tenancy-saas-applications.md)
* Explore all the [capabilities of SQL Database](https://azure.microsoft.com/services/sql-database/)
