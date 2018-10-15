---
title: Server logs for Azure Database for MariaDB
description: Describes the logs available in Azure Database for MariaDB, and the available parameters for enabling different logging levels.
author: rachel-msft
ms.author: raagyema
editor: jasonwhowell
services: mariadb
ms.service: mariadb
ms.topic: conceptual
ms.date: 09/24/2018
---
# Server Logs in Azure Database for MariaDB
In Azure Database for MariaDB, the slow query log is available to users. Access to the transaction log is not supported. The slow query log can be used to identify performance bottlenecks for troubleshooting.

For more information about the slow query log, see the MariaDB documentation for [slow query log](https://mariadb.com/kb/en/library/slow-query-log-overview/).

## Access server logs
You can list and download Azure Database for MariaDB server logs using the Azure portal, and the Azure CLI.

In the Azure portal, select your Azure Database for MariaDB server. Under the **Monitoring** heading, select the **Server Logs** page.

<!-- For more information on Azure CLI, see [Configure and access server logs using Azure CLI](howto-configure-server-logs-in-cli.md).-->

## Log retention
Logs are available for up to seven days from their creation. If the total size of the available logs exceeds 7 GB, then the oldest files are deleted until space is available.

Logs are rotated every 24 hours or 7 GB, whichever comes first.

## Configure logging
By default the slow query log is disabled. To enable it, set slow_query_log to ON.

Other parameters you can adjust include:

- **long_query_time**: if a query takes longer than long_query_time (in seconds) that query is logged. The default is 10 seconds.
- **log_slow_admin_statements**: if ON includes administrative statements like ALTER_TABLE and ANALYZE_TABLE in the statements written to the slow_query_log.
- **log_queries_not_using_indexes**: determines whether queries that do not use indexes are logged to the slow_query_log
- **log_throttle_queries_not_using_indexes**: This parameter limits the number of non-index queries that can be written to the slow query log. This parameter takes effect when log_queries_not_using_indexes is set to ON.

See the MariaDB [slow query log documentation](https://mariadb.com/kb/en/library/slow-query-log-overview/) for full descriptions of the slow query log parameters.

## Next Steps
- [How to configure and access server logs from the Azure portal](howto-configure-server-logs-portal.md).
