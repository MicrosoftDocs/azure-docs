---
title: Optimize query stats collection
description: This article describes how you can optimize query stats collection on Azure Database for PostgreSQL - Flexible Server.
author: assaff
ms.author: assaff
ms.date: 06/21/2024
ms.service: azure-database-postgresql
ms.subservice: flexible-server
ms.topic: how-to
---

# Optimize query statistics collection on Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](~/reusable-content/ce-skilling/azure/includes/postgresql/includes/applies-to-postgresql-flexible-server.md)]

This article describes how to optimize query statistics collection on an Azure Database for PostgreSQL flexible server using pg_stat_statements extension

## Use pg_stat_statements

**Pg_stat_statements** is a PostgreSQL extension that can be enabled in Azure Database for PostgreSQL flexible server. The extension provides a means to track execution statistics for all SQL statements executed by a server. This module hooks into every query execution and comes with a non-trivial performance cost. Enabling **pg_stat_statements** forces query text writes to files on disk.

> [!NOTE]  
> `pg_stat_statements.track` is by default to NONE (i.e. disabled).

If you want to start tracking the execution statistics of all SQL statements executed by a server, then enable **pg_stat_statements**. To do so, set the value to `TOP` or `ALL`, depending on whether you want to track top-level queries or also nested queries (those executed inside a function or procedure).

To set **pg_stat_statements.track** = `TOP`

- In the Azure portal, go to the [Azure Database for PostgreSQL flexible server resource management page and select the server parameters blade](concepts-server-parameters.md).
- Use the [Azure CLI](connect-azure-cli.md) az postgres server configuration set to `--name pg_stat_statements.track --resource-group myresourcegroup --server mydemoserver --value TOP`.

## Use the Query Store

Using the [Query Store](concepts-query-store.md) feature in Azure Database for PostgreSQL flexible server offers a different way to monitor query execution statistics. To prevent performance overhead, it is recommended to utilize only one mechanism, either the pg_stat_statements extension or the Query Store.

## Next steps

- [Query Store usage scenarios](concepts-query-store-scenarios.md) 
- [Query Store best practices](concepts-query-store-best-practices.md) 
