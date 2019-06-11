---
title: Optimize query stats collection on an Azure Database for PostgreSQL - Single Server
description: This article describes how you can optimize query stats collection on an Azure Database for PostgreSQL - Single Server
author: dianaputnam
ms.author: dianas
ms.service: postgresql
ms.topic: conceptual
ms.date: 5/6/2019
---

# Optimize query statistics collection on an Azure Database for PostgreSQL - Single Server
This article describes how to optimize query statistics collection on an Azure Database for PostgreSQL server.

## Use pg_stats_statements
**Pg_stat_statements** is a PostgreSQL extension that's enabled by default in Azure Database for PostgreSQL. The extension provides a means to track execution statistics for all SQL statements executed by a server. This module hooks into every query execution and comes with a non-trivial performance cost. Enabling **pg_stat_statements** forces query text writes to files on disk.

If you have unique queries with long query text or you don't actively monitor **pg_stat_statements**, disable **pg_stat_statements** for best performance. To do so, change the setting to `pg_stat_statements.track = NONE`.

Some customer workloads have seen up to a 50 percent performance improvement when **pg_stat_statements** is disabled. The tradeoff you make when you disable pg_stat_statements is the inability to troubleshoot performance issues.

To set `pg_stat_statements.track = NONE`:

- In the Azure portal, go to the [PostgreSQL resource management page and select the server parameters blade](howto-configure-server-parameters-using-portal.md).

  ![PostgreSQL server parameter blade](./media/howto-optimize-query-stats-collection/pg_stats_statements_portal.png)

- Use the [Azure CLI](howto-configure-server-parameters-using-cli.md) az postgres server configuration set to `--name pg_stat_statements.track --resource-group myresourcegroup --server mydemoserver --value NONE`.

## Use the Query Store 
The [Query Store](concepts-query-store.md) feature in Azure Database for PostgreSQL provides a more effective method to track query statistics. We recommend this feature as an alternative to using *pg_stats_statements*. 

## Next steps
Consider setting `pg_stat_statements.track = NONE` in the [Azure portal](howto-configure-server-parameters-using-portal.md) or by using the [Azure CLI](howto-configure-server-parameters-using-cli.md).

For more information, see: 
- [Query Store usage scenarios](concepts-query-store-scenarios.md) 
- [Query Store best practices](concepts-query-store-best-practices.md) 
