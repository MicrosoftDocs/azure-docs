---
title: Slow query logs - Azure Database for MySQL
description: Describes the slow query logs available in Azure Database for MySQL, and the available parameters for enabling different logging levels.
author: ajlam
ms.author: andrela
ms.service: mysql
ms.topic: conceptual
ms.date: 4/13/2020
---
# Slow query logs in Azure Database for MySQL
In Azure Database for MySQL, the slow query log is available to users. Access to the transaction log is not supported. The slow query log can be used to identify performance bottlenecks for troubleshooting.

For more information about the MySQL slow query log, see the MySQL reference manual's [slow query log section](https://dev.mysql.com/doc/refman/5.7/en/slow-query-log.html).

## Configure slow query logging 
By default the slow query log is disabled. To enable it, set `slow_query_log` to ON. This can be enabled using the Azure portal or Azure CLI. 

Other parameters you can adjust include:

- **long_query_time**: if a query takes longer than long_query_time (in seconds) that query is logged. The default is 10 seconds.
- **log_slow_admin_statements**: if ON includes administrative statements like ALTER_TABLE and ANALYZE_TABLE in the statements written to the slow_query_log.
- **log_queries_not_using_indexes**: determines whether queries that do not use indexes are logged to the slow_query_log
- **log_throttle_queries_not_using_indexes**: This parameter limits the number of non-index queries that can be written to the slow query log. This parameter takes effect when log_queries_not_using_indexes is set to ON.
- **log_output**: if "File", allows the slow query log to be written to both the local server storage and to Azure Monitor Diagnostic Logs. If "None", the slow query log will only be written to Azure Monitor Diagnostics Logs. 

> [!IMPORTANT]
> If your tables are not indexed, setting the `log_queries_not_using_indexes` and `log_throttle_queries_not_using_indexes` parameters to ON may affect MySQL performance since all queries running against these non-indexed tables will be written to the slow query log.<br><br>
> If you plan on logging slow queries for an extended period of time, it is recommended to set `log_output` to "None". If set to "File", these logs are written to the local server storage and can affect MySQL performance. 

See the MySQL [slow query log documentation](https://dev.mysql.com/doc/refman/5.7/en/slow-query-log.html) for full descriptions of the slow query log parameters.

## Access slow query logs
There are two options for accessing slow query logs in Azure Database for MySQL: local server storage or Azure Monitor Diagnostic Logs. This is set using the `log_output` parameter.

For local server storage, you can list and download slow query logs using the Azure portal or the Azure CLI. In the Azure portal, navigate to your server in the Azure portal. Under the **Monitoring** heading, select the **Server Logs** page. For more information on Azure CLI, see [Configure and access slow query logs using Azure CLI](howto-configure-server-logs-in-cli.md). 

Azure Monitor Diagnostic Logs allows you to pipe slow query logs to Azure Monitor Logs (Log Analytics), Azure Storage, or Event Hubs. See [below](concepts-server-logs.md#diagnostic-logs) for more information.

## Local server storage log retention
When logging to the server's local storage, logs are available for up to seven days from their creation. If the total size of the available logs exceeds 7 GB, then the oldest files are deleted until space is available.

Logs are rotated every 24 hours or 7 GB, whichever comes first.

> [!Note]
> The above log retention does not apply to logs that are piped using Azure Monitor Diagnostic Logs. You can change the retention period for the data sinks being emitted to (ex. Azure Storage).

## Diagnostic logs
Azure Database for MySQL is integrated with Azure Monitor Diagnostic Logs. Once you have enabled slow query logs on your MySQL server, you can choose to have them emitted to Azure Monitor logs, Event Hubs, or Azure Storage. To learn more about how to enable diagnostic logs, see the how to section of the [diagnostic logs documentation](../azure-monitor/platform/platform-logs-overview.md).

The following table describes what's in each log. Depending on the output method, the fields included and the order in which they appear may vary.

| **Property** | **Description** |
|---|---|
| `TenantId` | Your tenant ID |
| `SourceSystem` | `Azure` |
| `TimeGenerated` [UTC] | Time stamp when the log was recorded in UTC |
| `Type` | Type of the log. Always `AzureDiagnostics` |
| `SubscriptionId` | GUID for the subscription that the server belongs to |
| `ResourceGroup` | Name of the resource group the server belongs to |
| `ResourceProvider` | Name of the resource provider. Always `MICROSOFT.DBFORMYSQL` |
| `ResourceType` | `Servers` |
| `ResourceId` | Resource URI |
| `Resource` | Name of the server |
| `Category` | `MySqlSlowLogs` |
| `OperationName` | `LogEvent` |
| `Logical_server_name_s` | Name of the server |
| `start_time_t` [UTC] | Time the query began |
| `query_time_s` | Total time in seconds the query took to execute |
| `lock_time_s` | Total time in seconds the query was locked |
| `user_host_s` | Username |
| `rows_sent_s` | Number of rows sent |
| `rows_examined_s` | Number of rows examined |
| `last_insert_id_s` | [last_insert_id](https://dev.mysql.com/doc/refman/8.0/en/information-functions.html#function_last-insert-id) |
| `insert_id_s` | Insert ID |
| `sql_text_s` | Full query |
| `server_id_s` | The server's ID |
| `thread_id_s` | Thread ID |
| `\_ResourceId` | Resource URI |

> [!Note]
> For `sql_text`, log will be truncated if it exceeds 2048 characters.

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

- Display queries longer than 10 seconds across all MySQL servers with Diagnostic Logs enabled

    ```Kusto
    AzureDiagnostics
    | where Category == 'MySqlSlowLogs'
    | project TimeGenerated, LogicalServerName_s, event_class_s, start_time_t , query_time_d, sql_text_s 
    | where query_time_d > 10
    ```    
    
## Next Steps
- [How to configure slow query logs from the Azure portal](howto-configure-server-logs-in-portal.md)
- [How to configure slow query logs from the Azure CLI](howto-configure-server-logs-in-cli.md).
