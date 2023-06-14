---
title: Connect and query - Single Server PostgreSQL
description: Links to quickstarts showing how to connect to your Azure Database for PostgreSQL Single Server and run queries.
ms.service: postgresql
ms.subservice: single-server
ms.topic: how-to
ms.author: sunila
author: sunilagarwal
ms.reviewer: ""
ms.date: 06/24/2022
---

# Connect and query overview for Azure database for PostgreSQL- Single Server

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

The following document includes links to examples showing how to connect and query with Azure Database for PostgreSQL Single Server. This guide also includes TLS recommendations and extension that you can use to connect to the server in supported languages below.

## Quickstarts

| Quickstart | Description |
|---|---|
|[Pgadmin](https://www.pgadmin.org/)|You can use pgadmin to connect to the server and it simplifies the creation, maintenance and use of database objects.|
|[psql in Azure Cloud Shell](quickstart-create-server-database-azure-cli.md#connect-to-the-azure-database-for-postgresql-server-by-using-psql)|This article shows how to run [**psql**](https://www.postgresql.org/docs/current/static/app-psql.html) in [Azure Cloud Shell](../../cloud-shell/overview.md) to connect to your server and then run statements to query, insert, update, and delete data in the database.You can run **psql** if installed on your development environment|
|[PostgreSQL with VS Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb)|Azure Databases extension for VS Code (Preview) allows you to browse and query your PostgreSQL server both locally and in the cloud using scrapbooks with rich Intellisense. |
|[PHP](connect-php.md)|This quickstart demonstrates how to use PHP to create a program to connect to a database and use work with database objects to query data.|
|[Java](connect-java.md)|This quickstart demonstrates how to use Java to connect to a database and then use work with database objects to query data.|
|[Node.js](connect-nodejs.md)|This quickstart demonstrates how to use Node.js to create a program to connect to a database and use work with database objects to query data.|
|[.NET(C#)](connect-csharp.md)|This quickstart demonstrates how to use.NET (C#) to create a C# program to connect to a database and use work with database objects to query data.|
|[Go](connect-go.md)|This quickstart demonstrates how to use Go to connect to a database. Transact-SQL statements to query and modify data are also demonstrated.|
|[Python](connect-python.md)|This quickstart demonstrates how to use Python to connect to a database and use work with database objects to query data. |
|[Ruby](connect-ruby.md)|This quickstart demonstrates how to use Ruby to create a program to connect to a database and use work with database objects to query data.|

## TLS considerations for database connectivity

Transport Layer Security (TLS) is used by all drivers that Microsoft supplies or supports for connecting to databases in Azure Database for PostgreSQL. No special configuration is necessary but do enforce TLS 1.2 for newly created servers. We recommend if you are using TLS 1.0 and 1.1, then you update the TLS version for your servers. See [How to configure TLS](how-to-tls-configurations.md)

## PostgreSQL extensions

PostgreSQL provides the ability to extend the functionality of your database using extensions. Extensions bundle multiple related SQL objects together in a single package that can be loaded or removed from your database with a single command. After being loaded in the database, extensions function like built-in features.

- [Postgres 11 extensions](./concepts-extensions.md#postgres-11-extensions)
- [Postgres 10 extensions](./concepts-extensions.md#postgres-10-extensions)
- [Postgres 9.6 extensions](./concepts-extensions.md#postgres-96-extensions)

Fore more details, see [How to use PostgreSQL extensions on Single server](concepts-extensions.md).

## Next steps

- [Migrate data using dump and restore](how-to-migrate-using-dump-and-restore.md)
- [Migrate data using import and export](how-to-migrate-using-export-and-import.md)
