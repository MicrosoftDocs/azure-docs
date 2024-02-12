---
title: 'Quickstart: Connect using PHP - Azure Database for MySQL'
description: This quickstart provides several PHP code samples you can use to connect and query data from Azure Database for MySQL.
ms.service: mysql
ms.subservice: single-server
ms.topic: quickstart
author: SudheeshGH
ms.author: sunaray
ms.custom: mvc, mode-other
ms.date: 06/20/2022
---

# Quickstart: Use PHP to connect and query data in Azure Database for MySQL

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

This quickstart demonstrates how to connect to an Azure Database for MySQL using a [PHP](https://secure.php.net/manual/intro-whatis.php) application. It shows how to use SQL statements to query, insert, update, and delete data in the database.

## Prerequisites
For this quickstart you need:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- Create an Azure Database for MySQL single server using [Azure portal](./quickstart-create-mysql-server-database-using-azure-portal.md) <br/> or [Azure CLI](./quickstart-create-mysql-server-database-using-azure-cli.md) if you do not have one.
- Based on whether you are using public or private access, complete **ONE** of the actions below to enable connectivity.

    |Action| Connectivity method|How-to guide|
    |:--------- |:--------- |:--------- |
    | **Configure firewall rules** | Public | [Portal](./how-to-manage-firewall-using-portal.md) <br/> [CLI](./how-to-manage-firewall-using-cli.md)|
    | **Configure Service Endpoint** | Public | [Portal](./how-to-manage-vnet-using-portal.md) <br/> [CLI](./how-to-manage-vnet-using-cli.md)|
    | **Configure private link** | Private | [Portal](./how-to-configure-private-link-portal.md) <br/> [CLI](./how-to-configure-private-link-cli.md) |

- [Create a database and non-admin user](./how-to-create-users.md?tabs=single-server)
- Install latest PHP version  for your operating system
    - [PHP on macOS](https://secure.php.net/manual/install.macosx.php)
    - [PHP on Linux](https://secure.php.net/manual/install.unix.php)
    - [PHP on Windows](https://secure.php.net/manual/install.windows.php)

> [!NOTE]
> We are using [MySQLi](https://www.php.net/manual/en/book.mysqli.php) library to manage connect and query the server in this quickstart.

## Get connection information
You can get the database server connection information from the Azure portal by following these steps:

1. Log in to the [Azure portal](https://portal.azure.com/).
2. Navigate to the Azure Databases for MySQL page. You can search for and select **Azure Database for MySQL**.
:::image type="content" source="./media/quickstart-create-mysql-server-database-using-azure-portal/find-azure-mysql-in-portal.png" alt-text="Find Azure Database for MySQL":::

2. Select your  MySQL server (such as **mydemoserver**).
3. In the **Overview** page, copy the fully qualified server name next to **Server name** and the admin user name next to **Server admin login name**. To copy the server name or host name, hover over it and select the **Copy** icon.

> [!IMPORTANT]
> - If you forgot your password, you can [reset the password](./how-to-create-manage-server-portal.md#update-admin-password).
> - Replace the **host, username, password,** and **db_name** parameters with your own values**

## Step 1: Connect to the server
SSL is enabled by default. You may need to download the [DigiCertGlobalRootG2 SSL certificate](https://cacerts.digicert.com/DigiCertGlobalRootG2.crt.pem) to connect from your local environment. This code calls:
- [mysqli_init](https://secure.php.net/manual/mysqli.init.php) to initialize MySQLi.
- [mysqli_ssl_set](https://www.php.net/manual/en/mysqli.ssl-set.php) to point to the SSL certificate path. This is required for your local environment but not required for App Service Web App or Azure Virtual machines.
- [mysqli_real_connect](https://secure.php.net/manual/mysqli.real-connect.php) to connect to MySQL.
- [mysqli_close](https://secure.php.net/manual/mysqli.close.php) to close the connection.


```php
$host = 'mydemoserver.mysql.database.azure.com';
$username = 'myadmin@mydemoserver';
$password = 'your_password';
$db_name = 'your_database';

//Initializes MySQLi
$conn = mysqli_init();

mysqli_ssl_set($conn,NULL,NULL, "/var/www/html/DigiCertGlobalRootG2.crt.pem", NULL, NULL);

// Establish the connection
mysqli_real_connect($conn, $host, $username, $password, $db_name, 3306, NULL, MYSQLI_CLIENT_SSL);

//If connection failed, show the error
if (mysqli_connect_errno())
{
    die('Failed to connect to MySQL: '.mysqli_connect_error());
}
```

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
- [mysqli_query](https://secure.php.net/manual/mysqli.query.php) execute the **SELECT** query
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
Use the following code delete rows by using a **DELETE** SQL statement. The code uses the methods:
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

## Clean up resources

To clean up all resources used during this quickstart, delete the resource group using the following command:

```azurecli
az group delete \
    --name $AZ_RESOURCE_GROUP \
    --yes
```

## Next steps
> [!div class="nextstepaction"]
> [Manage Azure Database for MySQL server using Portal](./how-to-create-manage-server-portal.md)<br/>

> [!div class="nextstepaction"]
> [Manage Azure Database for MySQL server using CLI](./how-to-manage-single-server-cli.md)

