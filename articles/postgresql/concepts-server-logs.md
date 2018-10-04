---
title: Server Logs in Azure Database for PostgreSQL
description: This article describes how Azure Database for PostgreSQL generates query and error logs, and how log retention is configured.
services: postgresql
author: rachel-msft
ms.author: raagyema
editor: jasonwhowell
ms.service: postgresql
ms.topic: conceptual
ms.date: 10/04/2018
---
# Server Logs in Azure Database for PostgreSQL 
Azure Database for PostgreSQL generates query and error logs. Query and error logs can be used to identify, troubleshoot, and repair configuration errors and suboptimal performance. (Access to transaction logs is not included). For more information, see PostgreSQL's [Error Reporting and Logging](https://www.postgresql.org/docs/current/static/runtime-config-logging.html) documentation. 

## Configure logging 
You can configure the logging on your server using the logging server parameters. On each new server **log_checkpoints** and **log_connections** are on by default. There are additional parameters you can adjust to suit your logging needs: 

![Azure Database for PostgreSQL - Logging parameters](./media/concepts-server-logs/log-parameters.png)

For more information on these parameters, see [Error Reporting and Logging](https://www.postgresql.org/docs/current/static/runtime-config-logging.html) documentation. For particularly configuring Azure Database for PostgreSQL server parameters, see [Customize server configuration parameters using Azure CLI](howto-configure-server-parameters-using-cli.md).

## Access server logs through portal or CLI
If you've enabled logs, you can access them from the Azure Database for PostgreSQL log storage using the [Azure portal](howto-configure-server-logs-in-portal.md), [Azure CLI](howto-configure-server-logs-using-cli.md), and Azure REST APIs. The log files rotate every 1 hour or 100MB size, whichever comes first. You can set the retention period for this log storage using the **log\_retention\_period** parameter associated with your server. The default value is 3 days; the maximum value is 7 days. Your server must have enough allocated storage to hold the log files. (This retention parameter does not govern Azure Diagnostic Logs.)


## Diagnostic logs
Azure Database for PostgreSQL is integrated with Azure Monitor Diagnostic Logs. Once you have enabled logs on your PostgreSQL server as described above, you can choose to have them emitted to OMS Log Analytics, Event Hubs, or Azure Storage. To learn more about how to enable diagnostic logs, see the how-to section of the [diagnostic logs documentation](../monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs.md). 


The following table describes what's in each log. Depending on the output method, the fields included and the order in which they appear may vary. 

|**Field** | **Description** |
|---|---|
| TenantId | Your tenant ID |
| SourceSystem | `Azure` |
| TimeGenerated [UTC] | Time stamp when the log was recorded in UTC |
| Type | Type of the log. Always `AzureDiagnostics` |
| SubscriptionId | GUID for the subscription that the server belongs to |
| ResourceGroup | Name of the resource group the server belongs to |
| ResourceProvider | Name of the resource provider. Always `MICROSOFT.DBFORPOSTGRESQL` |
| ResourceType | `Servers` |
| ResourceId | Resource URI |
| Resource | Name of the server |
| Category | `PostgreSQLLogs` |
| OperationName | `LogEvent` |
| errorLevel_s | Logging level, example: LOG, ERROR, NOTICE |
| Message | Primary log message | 
| Domain_s | Server version, example: postgres-10 |
| Detail | Secondary log message (if applicable) |
| ColumnName | Name of the column (if applicable) |
| SchemaName | Name of the schema (if applicable) |
| DatatypeName | Name of the datatype (if applicable) |
| LogicalServerName_s | Name of the server | 
| _ResourceId | Resource URI |

## Next steps
-Learn more about accessing logs from the [Azure portal](howto-configure-server-logs-in-portal.md) or [Azure CLI](howto-configure-server-logs-using-cli.md).
- For more information on server parameters, see [Customize server configuration parameters using Azure CLI](howto-configure-server-parameters-using-cli.md).
