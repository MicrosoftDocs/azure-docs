---
title: 'Quickstart: Connect using PHP'
description: This quickstart provides several PHP code samples you can use to connect and query data from Azure Database for MySQL - Flexible Server.
ms.service: mysql
ms.subservice: flexible-server
ms.topic: quickstart
author: shreyaaithal
ms.author: shaithal
ms.custom: mvc, mode-other
ms.date: 05/03/2023
---

# Use PHP with Azure Database for MySQL - Flexible Server

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]
This quickstart demonstrates how to connect to Azure Database for MySQL flexible server using a [PHP](https://secure.php.net/manual/intro-whatis.php) application. It shows how to use SQL statements to query, insert, update, and delete data in the database. This article assumes that you are familiar with development using PHP and that you are new to working with Azure Database for MySQL flexible server.

## Prerequisites

This quickstart uses the resources created in either of these guides as a starting point:

- [Create an Azure Database for MySQL flexible server instance using Azure portal](./quickstart-create-server-portal.md)
- [Create an Azure Database for MySQL flexible server instance using Azure CLI](./quickstart-create-server-cli.md)

## Preparing your client workstation

1. If you created your flexible server with *Private access (VNet Integration)*, you will need to connect to your server from a resource within the same VNet as your server. You can create a virtual machine and add it to the VNet created with your flexible server. Refer to [Create and manage an Azure Database for MySQL flexible server virtual network using Azure CLI](./how-to-manage-virtual-network-cli.md).

2. If you created your flexible server with *Public access (allowed IP addresses)*, you can add your local IP address to the list of firewall rules on your server. Refer to [Create and manage Azure Database for MySQL flexible server firewall rules using the Azure CLI](./how-to-manage-firewall-cli.md).

### Install PHP

Install PHP on your own server, or create an Azure [web app](../../app-service/overview.md) that includes PHP.  Refer to [create and manage firewall rules](./how-to-manage-firewall-portal.md) to learn how to create firewall rules.

#### [macOS](#tab/macos)

1. Download [PHP 7.1.4 version](https://secure.php.net/downloads.php).
2. Install PHP and refer to the [PHP manual](https://secure.php.net/manual/install.macosx.php) for further configuration.

#### [Linux](#tab/linux)

1. Download [PHP 7.1.4 non-thread safe (x64) version](https://secure.php.net/downloads.php).
2. Install PHP and refer to the [PHP manual](https://secure.php.net/manual/install.unix.php) for further configuration.

#### [Windows](#tab/windows)

1. Download [PHP 7.1.4 non-thread safe (x64) version](https://windows.php.net/download#php-7.1).
2. Install PHP and refer to the [PHP manual](https://secure.php.net/manual/install.windows.php) for further configuration.

---

## Get connection information

Get the connection information needed to connect to the Azure Database for MySQL flexible server instance. You need the fully qualified server name and sign in credentials.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. From the left-hand menu in Azure portal, select **All resources**, and then search for the server you have created (such as **mydemoserver**).
3. Select the server name.
4. From the server's **Overview** panel, make a note of the **Server name** and **Server admin login name**. If you forget your password, you can also reset the password from this panel.
 <!---:::image type="content" source="./media/connect-php/1_server-overview-name-login.png" alt-text="Azure Database for MySQL flexible server instance name":::--->

## Connecting to flexible server using TLS/SSL in PHP

To establish a encrypted connection to your flexible server over TLS/SSL from your application, refer to the following code samples. You can download the certificate needed to communicate over TLS/SSL from [https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem](https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem)

```php using SSL
$conn = mysqli_init();
mysqli_ssl_set($conn,NULL,NULL, "/var/www/html/DigiCertGlobalRootCA.crt.pem", NULL, NULL);
mysqli_real_connect($conn, 'mydemoserver.mysql.database.azure.com', 'myadmin', 'yourpassword', 'quickstartdb', 3306, MYSQLI_CLIENT_SSL);
if (mysqli_connect_errno($conn)) {
die('Failed to connect to MySQL: '.mysqli_connect_error());
}
```

## Connect and create a table

Use the following code to connect and create a table by using **CREATE TABLE** SQL statement.

The code uses the **MySQL Improved extension** (mysqli) class included in PHP. The code calls methods [mysqli_init](https://secure.php.net/manual/mysqli.init.php) and [mysqli_real_connect](https://secure.php.net/manual/mysqli.real-connect.php) to connect to MySQL. Then it calls method [mysqli_query](https://secure.php.net/manual/mysqli.query.php) to run the query. Then it calls method [mysqli_close](https://secure.php.net/manual/mysqli.close.php) to close the connection.

Replace the host, username, password, and db_name parameters with your own values.

```php
<?php
$host = 'mydemoserver.mysql.database.azure.com';
$username = 'myadmin';
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

Use the following code to connect and insert data by using an **INSERT** SQL statement.

The code uses the **MySQL Improved extension** (mysqli) class included in PHP. The code uses method [mysqli_prepare](https://secure.php.net/manual/mysqli.prepare.php) to create a prepared insert statement, then binds the parameters for each inserted column value using method [mysqli_stmt_bind_param](https://secure.php.net/manual/mysqli-stmt.bind-param.php). The code runs the statement by using method [mysqli_stmt_execute](https://secure.php.net/manual/mysqli-stmt.execute.php) and afterwards closes the statement by using method [mysqli_stmt_close](https://secure.php.net/manual/mysqli-stmt.close.php).

Replace the host, username, password, and db_name parameters with your own values.

```php
<?php
$host = 'mydemoserver.mysql.database.azure.com';
$username = 'myadmin';
$password = 'your_password';
$db_name = 'your_database';

//Establishes the connection
$conn = mysqli_init();
mysqli_real_connect($conn, $host, $username, $password, $db_name, 3306);
if (mysqli_connect_errno($conn)) {
die('Failed to connect to MySQL: '.mysqli_connect_error());
}

//Create an Insert prepared statement and run it
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
$username = 'myadmin';
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
$username = 'myadmin';
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
$username = 'myadmin';
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

- [Encrypted connectivity using Transport Layer Security (TLS 1.2) in Azure Database for MySQL flexible server](./how-to-connect-tls-ssl.md).
- Learn more about [Networking in Azure Database for MySQL flexible server](./concepts-networking.md).
- [Create and manage Azure Database for MySQL flexible server firewall rules using the Azure portal](./how-to-manage-firewall-portal.md).
- [Create and manage Azure Database for MySQL flexible server virtual network using Azure portal](./how-to-manage-virtual-network-portal.md).
