---
title: Generate a connection string with PowerShell - Azure Database for PostgreSQL
description: This article provides an Azure PowerShell example to generate a connection string for connecting to Azure Database for PostgreSQL.
ms.service: postgresql
ms.subservice: single-server
ms.topic: how-to
ms.author: sunila
author: sunilagarwal
ms.reviewer: ""
ms.custom: mvc, devx-track-azurepowershell
ms.date: 06/24/2022
---

# How to generate an Azure Database for PostgreSQL connection string with PowerShell

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

This article demonstrates how to generate a connection string for an Azure Database for PostgreSQL
server. You can use a connection string to connect to an Azure Database for PostgreSQL from many
different applications.

## Requirements

This article uses the resources created in the following guide as a starting point:

* [Quickstart: Create an Azure Database for PostgreSQL server using PowerShell](quickstart-create-postgresql-server-database-using-azure-powershell.md)

## Get the connection string

The `Get-AzPostgreSqlConnectionString` cmdlet is used to generate a connection string for connecting
applications to Azure Database for PostgreSQL. The following example returns the connection string
for a PHP client from **mydemoserver**.

```azurepowershell-interactive
Get-AzPostgreSqlConnectionString -Client PHP -Name mydemoserver -ResourceGroupName myresourcegroup
```

```Output
host=mydemoserver.postgres.database.azure.com port=5432 dbname={your_database} user=myadmin@mydemoserver password={your_password} sslmode=require
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
> [Customize Azure Database for PostgreSQL server parameters using PowerShell](how-to-configure-server-parameters-using-powershell.md)
