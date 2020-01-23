---
title: Slow query logs - Azure Database for MariaDB
description: Describes the logs available in Azure Database for MariaDB, and the available parameters for enabling different logging levels.
author: ajlam
ms.author: andrela
ms.service: mariadb
ms.topic: conceptual
ms.date: 01/21/2020
---
# Slow query logs in Azure Database for MariaDB
In Azure Database for MariaDB, the slow query log is available to users. Access to the transaction log is not supported. The slow query log can be used to identify performance bottlenecks for troubleshooting.

For more information about the slow query log, see the MariaDB documentation for [slow query log](https://mariadb.com/kb/en/library/slow-query-log-overview/).

## Access slow query logs
You can list and download Azure Database for MariaDB slow query logs using the Azure portal, and the Azure CLI.

In the Azure portal, select your Azure Database for MariaDB server. Under the **Monitoring** heading, select the **Server Logs** page.

For more information on Azure CLI, see [Configure and access server logs using Azure CLI](howto-configure-server-logs-cli.md).

Similarly, you can pipe the logs to Azure Monitor using Diagnostic Logs. See [below](concepts-server-logs.md#diagnostic-logs) for more information.

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
- **log_output**: if "File", allows the slow query log to be written to both the local server storage and to Azure Monitor Diagnostic Logs. If "None", the slow query log will only be written to Azure Monitor Diagnostics Logs. 

> [!IMPORTANT]
> If your tables are not indexed, setting the `log_queries_not_using_indexes` and `log_throttle_queries_not_using_indexes` parameters to ON may affect MariaDB performance since all queries running against these non-indexed tables will be written to the slow query log.<br><br>
> If you plan on logging slow queries for an extended period of time, it is recommended to set `log_output` to "None". If set to "File", these logs are written to the local server storage and can affect MariaDB performance. 

See the MariaDB [slow query log documentation](https://mariadb.com/kb/en/library/slow-query-log-overview/) for full descriptions of the slow query log parameters.

## Diagnostic logs
Azure Database for MariaDB is integrated with Azure Monitor Diagnostic Logs. Once you have enabled slow query logs on your MariaDB server, you can choose to have them emitted to Azure Monitor logs, Event Hubs, or Azure Storage. To learn more about how to enable diagnostic logs, see the how to section of the [diagnostic logs documentation](../azure-monitor/platform/platform-logs-overview.md).

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

## Analyze logs in Azure Monitor Logs

Once your slow query logs are piped to Azure Monitor Logs through Diagnostic Logs, you can perform further analysis of your slow queries. Below are some sample queries to help you get started. Make sure to update the below with your server name.

- Queries longer than 10 seconds on a particular server

    ```Kusto
    AzureDiagnostics
    | where LogicalServerName_s == '<your server name>'
    | where Category == 'MySqlSlowLogs'
    | project TimeGenerated, LogicalServerName_s, event_class_s, start_time_t , query_time_d, sql_text_s 
    | where query_time_d > 10
    ```

- List top 5 longest queries on a particular server

    ```Kusto
    AzureDiagnostics
    | where LogicalServerName_s == '<your server name>'
    | where Category == 'MySqlSlowLogs'
    | project TimeGenerated, LogicalServerName_s, event_class_s, start_time_t , query_time_d, sql_text_s 
    | order by query_time_d desc
    | take 5
    ```

- Summarize slow queries by minimum, maximum, average, and standard deviation query time on a particular server

    ```Kusto
    AzureDiagnostics
    | where LogicalServerName_s == '<your server name>'
    | where Category == 'MySqlSlowLogs'
    | project TimeGenerated, LogicalServerName_s, event_class_s, start_time_t , query_time_d, sql_text_s 
    | summarize count(), min(query_time_d), max(query_time_d), avg(query_time_d), stdev(query_time_d), percentile(query_time_d, 95) by LogicalServerName_s
    ```

- Graph the slow query distribution on a particular server

    ```Kusto
    AzureDiagnostics
    | where LogicalServerName_s == '<your server name>'
    | where Category == 'MySqlSlowLogs'
    | project TimeGenerated, LogicalServerName_s, event_class_s, start_time_t , query_time_d, sql_text_s 
    | summarize count() by LogicalServerName_s, bin(TimeGenerated, 5m)
    | render timechart
    ```

- Display queries longer than 10 seconds across all MariaDB servers with Diagnostic Logs enabled

    ```Kusto
    AzureDiagnostics
    | where Category == 'MySqlSlowLogs'
    | project TimeGenerated, LogicalServerName_s, event_class_s, start_time_t , query_time_d, sql_text_s 
    | where query_time_d > 10
    ```    
    
## Next Steps
- [How to configure slow query logs from the Azure portal](howto-configure-server-logs-portal.md)
- [How to configure slow query logs from the Azure CLI](howto-configure-server-logs-cli.md)
