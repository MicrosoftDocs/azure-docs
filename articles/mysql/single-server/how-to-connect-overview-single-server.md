---
title: Connect and query - Single Server MySQL
description: Links to quickstarts showing how to connect to your Azure My SQL Database Single Server and run queries.
services: mysql
ms.service: mysql
ms.subservice: single-server
ms.topic: how-to
author: mksuni
ms.author: sumuth
ms.date: 06/20/2022
---

# Connect and query overview for Azure database for MySQL- Single Server

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

The following document includes links to examples showing how to connect and query with Azure Database for MySQL single server. This guide also includes TLS recommendations and libraries that you can use to connect to the server in supported languages below.

## Quickstarts

| Quickstart | Description |
|---|---|
|[MySQL workbench](connect-workbench.md)|This quickstart demonstrates how to use MySQL Workbench Client to connect to a database. You can then use MySQL statements to query, insert, update, and delete data in the database.|
|[Azure Cloud Shell](./quickstart-create-mysql-server-database-using-azure-cli.md#connect-to-azure-database-for-mysql-server-using-mysql-command-line-client)|This article shows how to run **mysql.exe** in [Azure Cloud Shell](../../cloud-shell/overview.md) to connect to your server and then run statements to query, insert, update, and delete data in the database.|
|[MySQL with Visual Studio](https://www.mysql.com/why-mysql/windows/visualstudio)|You can use MySQL for Visual Studio for connecting to your MySQL server. MySQL for Visual Studio integrates directly into Server Explorer making it easy to setup new connections and working with database objects.|
|[PHP](connect-php.md)|This quickstart demonstrates how to use PHP to create a program to connect to a database and use MySQL statements to query data.|
|[Java](connect-java.md)|This quickstart demonstrates how to use Java to connect to a database and then use MySQL statements to query data.|
|[Node.js](connect-nodejs.md)|This quickstart demonstrates how to use Node.js to create a program to connect to a database and use MySQL statements to query data.|
|[.NET(C#)](connect-csharp.md)|This quickstart demonstrates how to use.NET (C#) to create a C# program to connect to a database and use MySQL statements to query data.|
|[Go](connect-go.md)|This quickstart demonstrates how to use Go to connect to a database. Transact-SQL statements to query and modify data are also demonstrated.|
|[Python](connect-python.md)|This quickstart demonstrates how to use Python to connect to a database and use MySQL statements to query data. |
|[Ruby](connect-ruby.md)|This quickstart demonstrates how to use Ruby to create a program to connect to a database and use MySQL statements to query data.|
|[C++](connect-cpp.md)|This quickstart demonstrates how to use C++ to create a program to connect to a database and use  query data.|

## TLS considerations for database connectivity

Transport Layer Security (TLS) is used by all drivers that Microsoft supplies or supports for connecting to databases in Azure Database for MySQL. No special configuration is necessary but do enforce TLS 1.2 for newly created servers. We recommend if you are using TLS 1.0 and 1.1, then you update the TLS version for your servers. See [How to configure TLS](how-to-tls-configurations.md)

## Libraries

Azure Database for MySQL uses the world's most popular community edition of MySQL database. Hence, it is compatible with a wide variety of programming languages and drivers. The goal is to support the three most recent versions MySQL drivers, and efforts with authors from the open source community to constantly improve the functionality and usability of MySQL drivers continue.

See what [drivers](concepts-compatibility.md) are compatible with Azure Database for MySQL single server.

## Next steps

- [Migrate data using dump and restore](concepts-migrate-dump-restore.md)
- [Migrate data using import and export](concepts-migrate-import-export.md)
