---
title: Audit logs for Azure Database for MySQL
description: Describes the audit logs available in Azure Database for MySQL, and the available parameters for enabling logging levels.
author: ajlam
ms.author: andrela
ms.service: mysql
ms.topic: conceptual
ms.date: 06/11/2019
---

# Audit Logs in Azure Database for MySQL

In Azure Database for MySQL, the audit log is available to users. The audit log can be used to track database-level activity and is commonly used for compliance.

## Configure audit logging

By default the audit log is disabled. To enable it, set `audit_log_enabled` to ON.

Other parameters you can adjust include:

- **audit_log_events**: controls the events to be logged. See below table for specific audit events.
- **audit_log_exclude_users**: MySQL users to be excluded from logging.

| **Event** | **Description** |
|---|---|
| CONNECTION | - Connection initiation (successful or unsuccessful) <br> -  User reauthentication with different user/password during session <br> - Connection termination |
| DML_SELECT | SELECT queries |
| DML_NONSELECT | INSERT/DELETE/UPDATE queries |
| DML | DML = DML_SELECT + DML_NONSELECT |
| DDL | Queries like "DROP DATABASE" |
| DCL | Queries like "GRANT PERMISSION" |
| ADMIN | Queries like "SHOW STATUS" |
| GENERAL | All in DML_SELECT, DML_NONSELECT, DML, DDL, DCL, and ADMIN |
| TABLE_ACCESS | - Table read statements, such as SELECT or INSERT INTO ... SELECT <br> - Table delete statements, such as DELETE or TRUNCATE TABLE <br> - Table insert statements, such as INSERT or REPLACE <br> - Table update statements, such as UPDATE |

## Access audit logs

Audit logs are integrated with Azure Monitor Diagnostic Logs. Once you've enabled audit logs on your MySQL server, you can emit them to Azure Monitor logs, Event Hubs, or Azure Storage. To learn more about how to enable diagnostic logs in the Azure portal, see the [audit log portal article](howto-configure-audit-logs-portal.md#set-up-diagnostic-logs).

## Schema

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
| `Category` | `MySqlAuditLogs` |
| `OperationName` | `LogEvent` |
| `Logical_server_name_s` | Name of the server |
| `start_time_t` [UTC] | Time the query began |
| `query_time_s` | Total time the query took to execute |
| `lock_time_s` | Total time the query was locked |
| `user_host_s` | Username |
| `rows_sent_s` | Number of rows sent |
| `rows_examined_s` | Number of rows examined |
| `last_insert_id_s` | [last_insert_id](https://dev.mysql.com/doc/refman/8.0/en/information-functions.html#function_last-insert-id) |
| `insert_id_s` | Insert ID |
| `sql_text_s` | Full query |
| `server_id_s` | The server's ID |
| `thread_id_s` | Thread ID |
| `\_ResourceId` | Resource URI |

## Next Steps

- [How to configure audit logs in the Azure portal](howto-configure-audit-logs-portal.md)