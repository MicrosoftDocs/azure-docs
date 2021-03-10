---
title: Generate a connection string with PowerShell - Azure Database for MariaDB
description: This article provides an Azure PowerShell example to generate a connection string for connecting to Azure Database for MariaDB.
author: savjani
ms.author: pariks
ms.service: mariadb
ms.custom: mvc, devx-track-azurepowershell
ms.topic: how-to
ms.date: 8/5/2020
---

# How to generate an Azure Database for MariaDB connection string with PowerShell

This article demonstrates how to generate a connection string for an Azure Database for MariaDB
server. You can use a connection string to connect to an Azure Database for MariaDB from many
different applications.

## Requirements

This article uses the resources created in the following guide as a starting point:

* [Quickstart: Create an Azure Database for MariaDB server using PowerShell](quickstart-create-mariadb-server-database-using-azure-powershell.md)

## Get the connection string

The `Get-AzMariaDbConnectionString` cmdlet is used to generate a connection string for connecting
applications to Azure Database for MariaDB. The following example returns the connection string for a
PHP client from **mydemoserver**.

```azurepowershell-interactive
Get-AzMariaDbConnectionString -Client PHP -Name mydemoserver -ResourceGroupName myresourcegroup
```

```Output
$con=mysqli_init();mysqli_ssl_set($con, NULL, NULL, {ca-cert filename}, NULL, NULL); mysqli_real_connect($con, "mydemoserver.mariadb.database.azure.com", "myadmin@mydemoserver", {your_password}, {your_database}, 3306);
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
> [Customize Azure Database for MariaDB server parameters using PowerShell](howto-configure-server-parameters-using-powershell.md)
