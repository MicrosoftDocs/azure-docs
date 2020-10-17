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


     |Task| How to guide|Connectivity Method|
     |:--- |:---|:---|
     | **Create a server**| [Azure Portal](./quickstart-create-mysql-server-database-using-azure-portal.md) <br/> [Azure CLI](./quickstart-create-mysql-server-database-using-azure-cli.md)|Not applicable|
     | **Configure firewall rules** | [Azure Portal](./howto-manage-firewall-using-portal.md) <br> [Azure CLI](./howto-manage-firewall-using-cli.md)|Public access secured by firewall rules|
     | **Configure Service Endpoint** | [Azure Portal](./howto-manage-vnet-using-portal.md) <br> [Azure CLI](./howto-manage-vnet-using-cli.md) | Public access secured by service endpoints|
     | **Configure private link** | [Azure Portal](./howto-configure-privatelink-portal.md) <br> [Azure CLI](./howto-configure-privatelink-cli.md) | Private access| private access
<br/>

- Install latest PHP version  for your operating system. For this quickstart we will use [MySQLi](https://www.php.net/manual/en/book.mysqli.php)
    - [PHP on MacOS](https://secure.php.net/manual/install.macosx.php)
    - [PHP on Linux](https://secure.php.net/manual/install.unix.php)
    - [PHP on Windows](https://secure.php.net/manual/install.windows.php)

## Get connection information
Get the connection information needed to connect to the Azure Database for MySQL. You need the fully qualified server name and login credentials.

1. Log in to the [Azure portal](https://portal.azure.com/).
2. Navigate to the Azure Databases for MySQL page. You can search for and select **Azure Database for MySQL**.
::image type="content" source="./media/quickstart-create-mysql-server-database-using-azure-portal/findazuremysqlinportal.png" alt-text="Find Azure Database for MySQL":::

2. Select your  MySQL server (such as **mydemoserver**).
3. In the **Overview** page, copy the fully qualified server name next to **Server name** and the admin user name next to **Server admin login name**. To copy the server name or host name, hover over it and select the **Copy** icon.

> [!IMPORTANT]
> - If you forgot your password, you can [reset the password](./howto-create-manage-server-portal.md#update-admin-password).
> - Replace the **host, username, password,** and **db_name** parameters with your own values**

## Step 1: Connect with MySQLi
Use the following code to connect. This code calls:
- [mysqli_init](https://secure.php.net/manual/mysqli.init.php) to initialize MySQLi.
- [mysqli_real_connect](https://secure.php.net/manual/mysqli.real-connect.php) to connect to MySQL.
- [mysqli_close](https://secure.php.net/manual/mysqli.close.php) to close the connection.

```php
$host = 'mydemoserver.mysql.database.azure.com';
$username = 'myadmin@mydemoserver';
$password = 'your_password';
$db_name = 'your_database';

//Initializes MySQLi
$conn = mysqli_init();

// If using  Azure Virtual machines or Azure Web App, 'mysqli-ssl_set()' is not required as the certificate is already installed on the machines.
mysqli_ssl_set($conn,NULL,NULL, "/var/www/html/DigiCertGlobalRootG2.crt.pem", NULL, NULL);

// Establish the connection
mysqli_real_connect($conn, 'mydemoserver.mysql.database.azure.com', 'myadmin@mydemoserver', 'yourpassword', 'quickstartdb', 3306, MYSQLI_CLIENT_SSL);

//If connection failed, show the error
if (mysqli_connect_errno($conn))
{
    die('Failed to connect to MySQL: '.mysqli_connect_error());
}
```
[Having issues? Let us know](https://aka.ms/mysql-doc-feedback)

## Step 2: Create a Table
Use the following code to connect. This code calls:
- [mysqli_query](https://secure.php.net/manual/mysqli.query.php) to run the query.
```php
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
```

[Having issues? Let us know](https://aka.ms/mysql-doc-feedback)

## Step 3: Insert data
Use the following code to insert data by using an **INSERT** SQL statement. This code uses the methods:
- [mysqli_prepare](https://secure.php.net/manual/mysqli.prepare.php) to create a prepared insert statement
- [mysqli_stmt_bind_param](https://secure.php.net/manual/mysqli-stmt.bind-param.php) to bind the parameters for each inserted column value.
- [mysqli_stmt_execute](https://secure.php.net/manual/mysqli-stmt.execute.php)
- [mysqli_stmt_close](https://secure.php.net/manual/mysqli-stmt.close.php) to close the statement by using method


```php
//Create an Insert prepared statement and run it
$product_name = 'BrandNewProduct';
$product_color = 'Blue';
$product_price = 15.5;
if ($stmt = mysqli_prepare($conn, "INSERT INTO Products (ProductName, Color, Price) VALUES (?, ?, ?)"))
{
    mysqli_stmt_bind_param($stmt, 'ssd', $product_name, $product_color, $product_price);
    mysqli_stmt_execute($stmt);
    printf("Insert: Affected %d rows\n", mysqli_stmt_affected_rows($stmt));
    mysqli_stmt_close($stmt);
}

```

## Step 4: Read data
Use the following code to read the data by using a **SELECT** SQL statement.  The code uses the method:
- [mysqli_query](https://secure.php.net/manual/mysqli.query.php) perform the sql query
- [mysqli_fetch_assoc](https://secure.php.net/manual/mysqli-result.fetch-assoc.php) to fetch the resulting rows.

```php
//Run the Select query
printf("Reading data from table: \n");
$res = mysqli_query($conn, 'SELECT * FROM Products');
while ($row = mysqli_fetch_assoc($res))
 {
    var_dump($row);
 }

```

## Step 5: Delete data
Use the following code delete rows by using a **DELETE** SQL statement.The code uses the methods:
- [mysqli_prepare](https://secure.php.net/manual/mysqli.prepare.php) to create a prepared delete statement
- [mysqli_stmt_bind_param](https://secure.php.net/manual/mysqli-stmt.bind-param.php) binds the parameters
- [mysqli_stmt_execute](https://secure.php.net/manual/mysqli-stmt.execute.php) executes the prepared delete statement
- [mysqli_stmt_close](https://secure.php.net/manual/mysqli-stmt.close.php) closes the statement

```php
//Run the Delete statement
$product_name = 'BrandNewProduct';
if ($stmt = mysqli_prepare($conn, "DELETE FROM Products WHERE ProductName = ?")) {
mysqli_stmt_bind_param($stmt, 's', $product_name);
mysqli_stmt_execute($stmt);
printf("Delete: Affected %d rows\n", mysqli_stmt_affected_rows($stmt));
mysqli_stmt_close($stmt);
}
```

## Next steps
> [!div class="nextstepaction"]
> [Manage Azure Database for MySQL server using Portal](./howto-create-manage-server-portal.md)<br/>

> [!div class="nextstepaction"]
> [Manage Azure Database for MySQL server using CLI](./howto-create-manage-server-cli.md)

[Cannot find what you are looking for? Let us know.](https://aka.ms/mysql-doc-feedback)
