---
title: Server Logs in Azure Database for PostgreSQL
description: This article describes how Azure Database for PostgreSQL generates query and error logs, and how log retention is configured.
services: postgresql
author: rachel-msft
ms.author: raagyema
editor: jasonwhowell
ms.service: postgresql
ms.topic: conceptual
ms.date: 10/03/2018
---
# Server Logs in Azure Database for PostgreSQL 
Azure Database for PostgreSQL generates query and error logs. However, access to transaction logs is not supported. Query and error logs can be used to identify, troubleshoot, and repair configuration errors and suboptimal performance. For more information, see [Error Reporting and Logging](https://www.postgresql.org/docs/current/static/runtime-config-logging.html).

## Access server logs
You can list and download Azure PostgreSQL server error logs using the Azure portal, [Azure CLI](howto-configure-server-logs-using-cli.md), and Azure REST APIs.

## Log retention
You can set the retention period for system logs using the **log\_retention\_period** parameter associated with your server. The unit for this parameter is days. The default value is 3 days. The maximum value is 7 days. Your server must have enough allocated storage to contain the retained log files.
The log files rotate every one hour or 100 MB size, whichever comes first.

## Configure logging for Azure PostgreSQL server
You can enable query logging and error logging for your server. Error logs can contain auto-vacuum, connection, and checkpoint information.

You can enable query logging for your PostgreSQL DB instance by setting two server parameters: `log_statement` and `log_min_duration_statement`.

The **log\_statement** parameter controls which SQL statements are logged. We recommend setting this parameter to ***all*** to log all statements; the default value is none.

The **log\_min\_duration\_statement** parameter sets the limit in milliseconds of a statement to be logged. All SQL statements that run longer than the parameter setting are logged. This parameter is disabled and set to minus 1 (-1) by default. Enabling this parameter can be helpful in tracking down unoptimized queries in your applications.

The **log\_min\_messages** allows you to control which message levels are written to the server log. The default is WARNING. 

For more information on these settings, see [Error Reporting and Logging](https://www.postgresql.org/docs/9.6/static/runtime-config-logging.html) documentation. For particularly configuring Azure Database for PostgreSQL server parameters, see [Customize server configuration parameters using Azure CLI](howto-configure-server-parameters-using-cli.md).

## Diagnostic logs
Azure Database for PostgreSQL is integrated with [Azure Monitor Diagnostic Logs](../monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs.md). Once you have enabled logs on your PostgreSQL server as described above, you can choose to have them emitted to OMS Log Analytics, Event Hubs, or Azure Storage. To learn more about how to enable diagnostic logs, see the how-to section of the [diagnostic logs documentation](../monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs.md).

The following describes what's in each log:
|**Property** | **Description** |
|---|---|
| TenantId | Your tenant ID |
| SourceSystem | `Azure` |
| TimeGenerated [UTC] | Time stamp when the log was recorded in UTC |
| Type | Type of the log . Always `AzureDiagnostics` |
| ResourceProvider | Name of the resource provider. Always `MICROSOFT.DBFORPOSTGRESQL` |
| Resource | Name of the server |
| ResourceId | Resource URI |
| ResourceType | `Servers` |
| SubscriptionId | GUID for the subscription that the server belongs to |
| ResourceGroup | Name of the resource group the server belongs to |
| Category | `PostgreSQLLogs` |
| OperationName | LogEvent |
| errorLevel_s | Logging level e.g. LOG, ERROR, NOTICE |
| Message | Primary log message | 
| Domain_s | Server version e.g. postgres-10 |
| Detail | Secondary log message (if applicable) |
| ColumnName | Name of the column (if applicable) |
| SchemaName | Name of the schema (if applicable) |
| DatatypeName | Name of the datatype (if applicable) |
| LogicalServerName_s | Name of the server | 
| _ResourceId | Resource URI |

## Next steps
- To access logs using Azure CLI command-line interface, see [Configure and access server logs using Azure CLI](howto-configure-server-logs-using-cli.md).
- For more information on server parameters, see [Customize server configuration parameters using Azure CLI](howto-configure-server-parameters-using-cli.md).
