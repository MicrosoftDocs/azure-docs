---
title: 'Quickstart: Connect using PHP - Azure Database for MySQL'
description: This quickstart provides several PHP code samples you can use to connect and query data from Azure Database for MySQL.
author: ajlam
ms.author: andrela
ms.service: mysql
ms.custom: mvc
ms.topic: quickstart
ms.date: 10/01/2020
---

# Quickstart: Use PHP to connect and query data in Azure Database for MySQL
This quickstart demonstrates how to connect to an Azure Database for MySQL using a [PHP](https://secure.php.net/manual/intro-whatis.php) application. It shows how to use SQL statements to query, insert, update, and delete data in the database. This topic assumes that you are familiar with development using PHP and that you are new to working with Azure Database for MySQL.

## Prerequisites
For this quickstart you will need: 
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/en-us/free).
- Azure Database for MySQL single server.You can use one of these quickstarts to create the server using portal or CLI. 

  |Task| How to guide|
  |:--- |:--- |
  | **Create a server**| [Portal](./quickstart-create-mysql-server-database-using-azure-portal.md) <br/> [CLI](./quickstart-create-mysql-server-database-using-azure-cli.md)
  | **Configure firewall to allow access** | [Portal](./howto-manage-firewall-using-portal.md) <br> [CLI](./howto-manage-firewall-using-cli.md)|
  
- Install latest PHP version  for your operating system. For this quickstart we will use [MySQLi](https://www.php.net/manual/en/book.mysqli.php)
    - [PHP on MacOS](https://secure.php.net/manual/install.macosx.php) 
    - [PHP on Linux](https://secure.php.net/manual/install.unix.php) 
    - [PHP on Windows](https://secure.php.net/manual/install.windows.php) 

## Get connection information
Get the connection information needed to connect to the Azure Database for MySQL. You need the fully qualified server name and login credentials.

1. Log in to the [Azure portal](https://portal.azure.com/).
2. Navigate to the Azure Databases for MySQL page. You can search for and select **Azure Database for MySQL**.

[!div class="mx-imgBorder"] :::image type="content" source="./media/quickstart-create-mysql-server-database-using-azure-portal/findazuremysqlinportal.png" alt-text="Find Azure Database for MySQL":::
2. Select your  MySQL server (such as **mydemoserver**).
3. In the **Overview** page, copy the fully qualified server name next to **Server name** and the admin user name next to **Server admin login name**. To copy the server name or host name, hover over it and select the **Copy** icon. 

> [!IMPORTANT]
> If you forgot your password, you can [reset the password](./howto-create-manage-server-portal.md#update-admin-password).

> [!NOTE]
> **Replace the host, username, password, and db_name parameters with your own values**
## Connect with MySQLi and Create a Table
Use the following code to connect. This code calls: 
- [mysqli_init](https://secure.php.net/manual/mysqli.init.php) to initialize MySQLi.
- [mysqli_real_connect](https://secure.php.net/manual/mysqli.real-connect.php) to connect to MySQL.
- [mysqli_query](https://secure.php.net/manual/mysqli.query.php) to run the query.
- [mysqli_close](https://secure.php.net/manual/mysqli.close.php) to close the connection.

```php
<?php
$host = 'mydemoserver.mysql.database.azure.com';
$username = 'myadmin@mydemoserver';
$password = 'your_password';
$db_name = 'your_database';

//Establishes the connection
$conn = mysqli_init();
mysqli_real_connect($conn, $host, $username, $password, $db_name, 3306);
if (mysqli_connect_errno($conn)) {
die('Failed to connect to MySQL: '.mysqli_connect_error());
}

// Run the create table query
if (mysqli_query($conn, '
CREATE TABLE Products (
`Id` INT NOT NULL AUTO_INCREMENT ,
`ProductName` VARCHAR(200) NOT NULL ,
`Color` VARCHAR(50) NOT NULL ,
`Price` DOUBLE NOT NULL ,
PRIMARY KEY (`Id`)
);
')) {
printf("Table created\n");
}

//Close the connection
mysqli_close($conn);
?>
```

## Insert data
Use the following code to connect and insert data by using an **INSERT** SQL statement. This code uses the methods:
- [mysqli_prepare](https://secure.php.net/manual/mysqli.prepare.php) to create a prepared insert statement
- [mysqli_stmt_bind_param](https://secure.php.net/manual/mysqli-stmt.bind-param.php) to bind the parameters for each inserted column value.
- [mysqli_stmt_execute](https://secure.php.net/manual/mysqli-stmt.execute.php)
- [mysqli_stmt_close](https://secure.php.net/manual/mysqli-stmt.close.php) to close the statement by using method

Replace the host, username, password, and db_name parameters with your own values.

```php
<?php
//Once connection is established ..Create an Insert prepared statement and run it
$product_name = 'BrandNewProduct';
$product_color = 'Blue';
$product_price = 15.5;
if ($stmt = mysqli_prepare($conn, "INSERT INTO Products (ProductName, Color, Price) VALUES (?, ?, ?)")) {
mysqli_stmt_bind_param($stmt, 'ssd', $product_name, $product_color, $product_price);
mysqli_stmt_execute($stmt);
printf("Insert: Affected %d rows\n", mysqli_stmt_affected_rows($stmt));
mysqli_stmt_close($stmt);
}

// Close the connection
mysqli_close($conn);
?>
```

## Read data
Use the following code to connect and read the data by using a **SELECT** SQL statement.  The code uses the **MySQL Improved extension** (mysqli) class included in PHP. The code uses method [mysqli_query](https://secure.php.net/manual/mysqli.query.php) perform the sql query and method [mysqli_fetch_assoc](https://secure.php.net/manual/mysqli-result.fetch-assoc.php) to fetch the resulting rows.

Replace the host, username, password, and db_name parameters with your own values.

```php
<?php
$host = 'mydemoserver.mysql.database.azure.com';
$username = 'myadmin@mydemoserver';
$password = 'your_password';
$db_name = 'your_database';

//Establishes the connection
$conn = mysqli_init();
mysqli_real_connect($conn, $host, $username, $password, $db_name, 3306);
if (mysqli_connect_errno($conn)) {
die('Failed to connect to MySQL: '.mysqli_connect_error());
}

//Run the Select query
printf("Reading data from table: \n");
$res = mysqli_query($conn, 'SELECT * FROM Products');
while ($row = mysqli_fetch_assoc($res)) {
var_dump($row);
}

//Close the connection
mysqli_close($conn);
?>
```

## Update data
Use the following code to connect and update the data by using an **UPDATE** SQL statement.

The code uses the **MySQL Improved extension** (mysqli) class included in PHP. The code uses method [mysqli_prepare](https://secure.php.net/manual/mysqli.prepare.php) to create a prepared update statement, then binds the parameters for each updated column value using method [mysqli_stmt_bind_param](https://secure.php.net/manual/mysqli-stmt.bind-param.php). The code runs the statement by using method [mysqli_stmt_execute](https://secure.php.net/manual/mysqli-stmt.execute.php) and afterwards closes the statement by using method [mysqli_stmt_close](https://secure.php.net/manual/mysqli-stmt.close.php).

Replace the host, username, password, and db_name parameters with your own values.

```php
<?php
$host = 'mydemoserver.mysql.database.azure.com';
$username = 'myadmin@mydemoserver';
$password = 'your_password';
$db_name = 'your_database';

//Establishes the connection
$conn = mysqli_init();
mysqli_real_connect($conn, $host, $username, $password, $db_name, 3306);
if (mysqli_connect_errno($conn)) {
die('Failed to connect to MySQL: '.mysqli_connect_error());
}

//Run the Update statement
$product_name = 'BrandNewProduct';
$new_product_price = 15.1;
if ($stmt = mysqli_prepare($conn, "UPDATE Products SET Price = ? WHERE ProductName = ?")) {
mysqli_stmt_bind_param($stmt, 'ds', $new_product_price, $product_name);
mysqli_stmt_execute($stmt);
printf("Update: Affected %d rows\n", mysqli_stmt_affected_rows($stmt));

//Close the connection
mysqli_stmt_close($stmt);
}

mysqli_close($conn);
?>
```


## Delete data
Use the following code to connect and read the data by using a **DELETE** SQL statement.

The code uses the **MySQL Improved extension** (mysqli) class included in PHP. The code uses method [mysqli_prepare](https://secure.php.net/manual/mysqli.prepare.php) to create a prepared delete statement, then binds the parameters for the where clause in the statement using method [mysqli_stmt_bind_param](https://secure.php.net/manual/mysqli-stmt.bind-param.php). The code runs the statement by using method [mysqli_stmt_execute](https://secure.php.net/manual/mysqli-stmt.execute.php) and afterwards closes the statement by using method [mysqli_stmt_close](https://secure.php.net/manual/mysqli-stmt.close.php).

Replace the host, username, password, and db_name parameters with your own values.

```php
<?php
$host = 'mydemoserver.mysql.database.azure.com';
$username = 'myadmin@mydemoserver';
$password = 'your_password';
$db_name = 'your_database';

//Establishes the connection
$conn = mysqli_init();
mysqli_real_connect($conn, $host, $username, $password, $db_name, 3306);
if (mysqli_connect_errno($conn)) {
die('Failed to connect to MySQL: '.mysqli_connect_error());
}

//Run the Delete statement
$product_name = 'BrandNewProduct';
if ($stmt = mysqli_prepare($conn, "DELETE FROM Products WHERE ProductName = ?")) {
mysqli_stmt_bind_param($stmt, 's', $product_name);
mysqli_stmt_execute($stmt);
printf("Delete: Affected %d rows\n", mysqli_stmt_affected_rows($stmt));
mysqli_stmt_close($stmt);
}

//Close the connection
mysqli_close($conn);
?>
```

## Next steps
> [!div class="nextstepaction"]
> [Manage Azure Database for MySQL server](./howto-create-manage-server-portal.md)
