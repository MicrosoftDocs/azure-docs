---
title: Server logs for Azure Database for MariaDB
description: Describes the logs available in Azure Database for MariaDB, and the available parameters for enabling different logging levels.
author: rachel-msft
ms.author: raagyema
ms.service: mariadb
ms.topic: conceptual
ms.date: 06/12/2019
---
# Slow query logs in Azure Database for MariaDB
In Azure Database for MariaDB, the slow query log is available to users. Access to the transaction log is not supported. The slow query log can be used to identify performance bottlenecks for troubleshooting.

For more information about the slow query log, see the MariaDB documentation for [slow query log](https://mariadb.com/kb/en/library/slow-query-log-overview/).

## Access slow query logs
You can list and download Azure Database for MariaDB slow query logs using the Azure portal, and the Azure CLI.

In the Azure portal, select your Azure Database for MariaDB server. Under the **Monitoring** heading, select the **Server Logs** page.

For more information on Azure CLI, see [Configure and access server logs using Azure CLI](howto-configure-server-logs-cli.md).

## Log retention
Logs are available for up to seven days from their creation. If the total size of the available logs exceeds 7 GB, then the oldest files are deleted until space is available.

Logs are rotated every 24 hours or 7 GB, whichever comes first.

## Configure slow query logging
By default the slow query log is disabled. To enable it, set slow_query_log to ON.

Other parameters you can adjust include:

- **long_query_time**: if a query takes longer than long_query_time (in seconds) that query is logged. The default is 10 seconds.
- **log_slow_admin_statements**: if ON includes administrative statements like ALTER_TABLE and ANALYZE_TABLE in the statements written to the slow_query_log.
- **log_queries_not_using_indexes**: determines whether queries that do not use indexes are logged to the slow_query_log
- **log_throttle_queries_not_using_indexes**: This parameter limits the number of non-index queries that can be written to the slow query log. This parameter takes effect when log_queries_not_using_indexes is set to ON.

See the MariaDB [slow query log documentation](https://mariadb.com/kb/en/library/slow-query-log-overview/) for full descriptions of the slow query log parameters.

## Diagnostic logs
Azure Database for MariaDB is integrated with Azure Monitor Diagnostic Logs. Once you have enabled slow query logs on your MariaDB server, you can choose to have them emitted to Azure Monitor logs, Event Hubs, or Azure Storage. To learn more about how to enable diagnostic logs, see the how to section of the [diagnostic logs documentation](../azure-monitor/platform/diagnostic-logs-overview.md).

> [!IMPORTANT]
> This diagnostic feature for server logs is only available in the General Purpose and Memory Optimized [pricing tiers](concepts-pricing-tiers.md).

The following table describes what's in each log. Depending on the output method, the fields included and the order in which they appear may vary.

| **Property** | **Description** |
|---|---|
| `TenantId` | Your tenant ID |
| `SourceSystem` | `Azure` |
| `TimeGenerated` [UTC] | Time stamp when the log was recorded in UTC |
| `Type` | Type of the log. Always `AzureDiagnostics` |
| `SubscriptionId` | GUID for the subscription that the server belongs to |
| `ResourceGroup` | Name of the resource group the server belongs to |
| `ResourceProvider` | Name of the resource provider. Always `MICROSOFT.DBFORMARIADB` |
| `ResourceType` | `Servers` |
| `ResourceId` | Resource URI |
| `Resource` | Name of the server |
| `Category` | `MySqlSlowLogs` |
| `OperationName` | `LogEvent` |
| `Logical_server_name_s` | Name of the server |
| `start_time_t` [UTC] | Time the query began |
| `query_time_s` | Total time the query took to execute |
| `lock_time_s` | Total time the query was locked |
| `user_host_s` | Username |
| `rows_sent_s` | Number of rows sent |
| `rows_examined_s` | Number of rows examined |
| `last_insert_id_s` | [last_insert_id](https://mariadb.com/kb/en/library/last_insert_id/) |
| `insert_id_s` | Insert ID |
| `sql_text_s` | Full query |
| `server_id_s` | Server ID |
| `thread_id_s` | Thread ID |
| `\_ResourceId` | Resource URI |

## Next steps
- [How to configure and access server logs from the Azure portal](howto-configure-server-logs-portal.md).
