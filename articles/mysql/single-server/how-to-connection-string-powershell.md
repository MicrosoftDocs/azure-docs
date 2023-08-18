---
title: Generate a connection string with PowerShell - Azure Database for MySQL
description: This article provides an Azure PowerShell example to generate a connection string for connecting to Azure Database for MySQL.
ms.service: mysql
ms.subservice: single-server
author: SudheeshGH
ms.author: sunaray
ms.custom: mvc, devx-track-azurepowershell
ms.topic: how-to
ms.date: 06/20/2022
---

# How to generate an Azure Database for MySQL connection string with PowerShell

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

This article demonstrates how to generate a connection string for an Azure Database for MySQL
server. You can use a connection string to connect to an Azure Database for MySQL from many
different applications.

## Requirements

This article uses the resources created in the following guide as a starting point:

* [Quickstart: Create an Azure Database for MySQL server using PowerShell](quickstart-create-mysql-server-database-using-azure-powershell.md)

## Get the connection string

The `Get-AzMySqlConnectionString` cmdlet is used to generate a connection string for connecting
applications to Azure Database for MySQL. The following example returns the connection string for a
PHP client from **mydemoserver**.

```azurepowershell-interactive
Get-AzMySqlConnectionString -Client PHP -Name mydemoserver -ResourceGroupName myresourcegroup
```

```Output
$con=mysqli_init();mysqli_ssl_set($con, NULL, NULL, {ca-cert filename}, NULL, NULL); mysqli_real_connect($con, "mydemoserver.mysql.database.azure.com", "myadmin@mydemoserver", {your_password}, {your_database}, 3306);
```

Valid values for the `Client` parameter include:

* ADO&#46;NET
* JDBC
* Node.js
* PHP
* Python
* Ruby
* WebApp

## Next steps

> [!div class="nextstepaction"]
> [Customize Azure Database for MySQL server parameters using PowerShell](how-to-configure-server-parameters-using-powershell.md)
