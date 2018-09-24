---
title: Server logs for Azure Database for MySQL
description: Describes the logs available in Azure Database for MySQL, and the available parameters for enabling different logging levels.
services: mysql
author: rachel-msft
ms.author: raagyema
manager: kfile
editor: jasonwhowell
ms.service: mysql
ms.topic: article
ms.date: 09/17/2018
---
# Server Logs in Azure Database for MySQL
In Azure Database for MySQL, the slow query log is available to users. Access to the transaction log is not supported. The slow query log can be used to identify performance bottlenecks for troubleshooting. 

For more information about the MySQL slow query log, see the MySQL reference manual's [slow query log section](https://dev.mysql.com/doc/refman/5.7/en/slow-query-log.html).

## Access server logs
You can list and download Azure Database for MySQL server logs using the Azure portal, and the Azure CLI.

In the Azure portal, select your Azure Database for MySQL server. Under the **Monitoring** heading, select the **Server Logs** page.

For more information on Azure CLI, see [Configure and access server logs using Azure CLI](howto-configure-server-logs-in-cli.md).

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

See the MySQL [slow query log documentation](https://dev.mysql.com/doc/refman/5.7/en/slow-query-log.html) for full descriptions of the slow query log parameters.

## Next Steps
- [How to configure and access server logs from the Azure CLI](howto-configure-server-logs-in-cli.md).
