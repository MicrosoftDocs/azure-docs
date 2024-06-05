---
title: Connect and query
description: Links to quickstarts showing how to connect to your Azure Database for PostgreSQL - Flexible Server and run queries.
author: gbowerman
ms.author: guybo
ms.reviewer: maghan
ms.date: 04/27/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
---

# Connect and query overview for Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

The following document includes links to examples showing how to connect and query with Azure Database for PostgreSQL flexible server. This guide also includes TLS recommendations and extension that you can use to connect to the server in supported languages below.

## Quickstarts

| Quickstart | Description |
|---|---|
|[Pgadmin](https://www.pgadmin.org/)|You can use pgadmin to connect to the server and it simplifies the creation, maintenance and use of database objects.|
|[psql in Azure Cloud Shell](./quickstart-create-server-cli.md#connect-using-postgresql-command-line-client)|This article shows how to run [**psql**](https://www.postgresql.org/docs/current/static/app-psql.html) in [Azure Cloud Shell](../../cloud-shell/overview.md) to connect to your server and then run statements to query, insert, update, and delete data in the database.You can run **psql** if installed on your development environment|
|[Python](connect-python.md)|This quickstart demonstrates how to use Python to connect to a database and use work with database objects to query data. |
|[Django with App Service](/azure/app-service/tutorial-python-postgresql-app)|This tutorial demonstrates how to use Ruby to create a program to connect to a database and use work with database objects to query data.|

## TLS considerations for database connectivity

Transport Layer Security (TLS) is used by all drivers that Microsoft supplies or supports for connecting to databases in Azure Database for PostgreSQL flexible server. No special configuration is necessary but do enforce TLS 1.2 for newly created servers. We recommend if you are using TLS 1.0 and 1.1, then you update the TLS version for your servers. See [How to configure TLS](how-to-connect-tls-ssl.md)

## PostgreSQL extensions

Azure Database for PostgreSQL flexible server provides the ability to extend the functionality of your database using extensions. Extensions bundle multiple related SQL objects together in a single package that can be loaded or removed from your database with a single command. After being loaded in the database, extensions function like built-in features.

- [Postgres extensions](./concepts-extensions.md#extension-versions)
- [dblink and postgres_fdw](./concepts-extensions.md#dblink-and-postgres_fdw)
- [pg_prewarm](./concepts-extensions.md#pg_prewarm)
- [pg_stat_statements](./concepts-extensions.md#pg_stat_statements)

Fore more details, see [How to use PostgreSQL extensions on Azure Database for PostgreSQL - Flexible Server](concepts-extensions.md).

## Next steps

- [Migrate data using dump and restore](../howto-migrate-using-dump-and-restore.md)
- [Migrate data using import and export](../howto-migrate-using-export-and-import.md)
