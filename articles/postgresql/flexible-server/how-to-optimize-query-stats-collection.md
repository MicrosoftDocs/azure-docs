---
title: Optimize query stats collection - Azure Database for PostgreSQL - flexible Server
description: This article describes how you can optimize query stats collection on an Azure Database for PostgreSQL - flexible Server
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
ms.author: assaff
author: assaff
ms.date: 03/23/2023
---

# Optimize query statistics collection on an Azure Database for PostgreSQL - flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

This article describes how to optimize query statistics collection on an Azure Database for PostgreSQL server.

## Use pg_stat_statements

**Pg_stat_statements** is a PostgreSQL extension that can be enabled in Azure Database for PostgreSQL. The extension provides a means to track execution statistics for all SQL statements executed by a server. This module hooks into every query execution and comes with a non-trivial performance cost. Enabling **pg_stat_statements** forces query text writes to files on disk.

If you have unique queries with long query text or you don't actively monitor **pg_stat_statements**, disable **pg_stat_statements** for best performance. To do so, change the setting to `pg_stat_statements.track = NONE`.

Some customer workloads have seen up to a 50 percent performance improvement when **pg_stat_statements** is disabled. The tradeoff you make when you disable pg_stat_statements is the inability to troubleshoot performance issues.

To set `pg_stat_statements.track = NONE`:

- In the Azure portal, go to the [PostgreSQL resource management page and select the server parameters blade](concepts-server-parameters.md).
- Use the [Azure CLI](connect-azure-cli.md) az postgres server configuration set to `--name pg_stat_statements.track --resource-group myresourcegroup --server mydemoserver --value NONE`.

## Use the Query Store

The [Query Store](concepts-query-store.md) feature in Azure Database for PostgreSQL provides a more effective method to track query statistics. We recommend this feature as an alternative to using *pg_stat_statements*.

## Next steps

Consider setting `pg_stat_statements.track = NONE` in the [Azure portal](concepts-server-parameters.md) or by using the [Azure CLI](connect-azure-cli.md).

For more information, see:

- [Query Store usage scenarios](concepts-query-store-scenarios.md) 
- [Query Store best practices](concepts-query-store-best-practices.md) 
