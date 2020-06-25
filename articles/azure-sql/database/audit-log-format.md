---
title: SQL Database audit log format
description: Understand how Azure SQL Database audit logs are structured.
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.topic: conceptual
author: DavidTrigano
ms.author: datrigan
ms.reviewer: vanto
ms.custom: sqldbrb=1
ms.date: 06/03/2020
---

# SQL Database audit log format

[!INCLUDE[appliesto-sqldb-asa](../includes/appliesto-sqldb-sqlmi-asa.md)]

[Azure SQL Database auditing](auditing-overview.md) tracks database events and writes them to an audit log in your Azure storage account, or sends them to Event Hub or Log Analytics for downstream processing and analysis.

## Naming conventions

### Blob audit

Audit logs stored in Azure Blob storage are stored in a container named `sqldbauditlogs` in the Azure storage account. The directory hierarchy within the container is of the form `<ServerName>/<DatabaseName>/<AuditName>/<Date>/`. The Blob file name format is `<CreationTime>_<FileNumberInSession>.xel`, where `CreationTime` is in UTC `hh_mm_ss_ms` format, and `FileNumberInSession` is a running index in case session logs spans across multiple Blob files.

For example, for database `Database1` on `Server1` the following is a possible valid path:

    Server1/Database1/SqlDbAuditing_ServerAudit_NoRetention/2019-02-03/12_23_30_794_0.xel

[Read-only Replicas](read-scale-out.md) audit logs are stored in the same container. The directory hierarchy within the container is of the form `<ServerName>/<DatabaseName>/<AuditName>/<Date>/RO/`. The Blob file name shares the same format. The Audit Logs of Read-only Replicas are stored in the same container.


### Event Hub

Audit events are written to the namespace and event hub that was defined during auditing configuration, and are captured in the body of [Apache Avro](https://avro.apache.org/) events and stored using JSON formatting with UTF-8 encoding. To read the audit logs, you can use [Avro Tools](../../event-hubs/event-hubs-capture-overview.md#use-avro-tools) or similar tools that process this format.

### Log Analytics

Audit events are written to Log Analytics workspace defined during auditing configuration, to the `AzureDiagnostics` table with the category `SQLSecurityAuditEvents`. For additional useful information about Log Analytics search language and commands, see [Log Analytics search reference](../../azure-monitor/log-query/log-query-overview.md).

## <a id="subheading-1"></a>Audit log fields

| Name (blob) | Name (Event Hubs/Log Analytics) | Description | Blob type | Event Hubs/Log Analytics type |
|-------------|---------------------------------|-------------|-----------|-------------------------------|
| action_id | action_id_s | ID of the action | varchar(4) | string |
| action_name | action_name_s | Name of the action | N/A | string |
| additional_information | additional_information_s | Any additional information about the event, stored as XML | nvarchar(4000) | string |
| affected_rows | affected_rows_d | Number of rows affected by the query | bigint | int |
| application_name | application_name_s| Name of client application | nvarchar(128) | string |
| audit_schema_version | audit_schema_version_d | Always 1 | int | int |
| class_type | class_type_s | Type of auditable entity that the audit occurs on | varchar(2) | string |
| class_type_desc | class_type_description_s | Description of auditable entity that the audit occurs on | N/A | string |
| client_ip | client_ip_s | Source IP of the client application | nvarchar(128) | string |
| connection_id | N/A | ID of the connection in the server | GUID | N/A |
| data_sensitivity_information | data_sensitivity_information_s | Information types and sensitivity labels returned by the audited query, based on the classified columns in the database. Learn more about [Azure SQL Database data discover and classification](data-discovery-and-classification-overview.md) | nvarchar(4000) | string |
| database_name | database_name_s | The database context in which the action occurred | sysname | string |
| database_principal_id | database_principal_id_d | ID of the database user context that the action is performed in | int | int |
| database_principal_name | database_principal_name_s | Name of the database user context in which the action is performed | sysname | string |
| duration_milliseconds | duration_milliseconds_d | Query execution duration in milliseconds | bigint | int |
| event_time | event_time_t | Date and time when the auditable action is fired | datetime2 | datetime |
| host_name | N/A | Client host name | string | N/A |
| is_column_permission | is_column_permission_s | Flag indicating if this is a column level permission. 1 = true, 0 = false | bit | string |
| N/A | is_server_level_audit_s | Flag indicating if this audit is at the server level | N/A | string |
| object_ id | object_id_d | The ID of the entity on which the audit occurred. This includes the : server objects, databases, database objects, and schema objects. 0 if the entity is the server itself or if the audit is not performed at an object level | int | int |
| object_name | object_name_s | The name of the entity on which the audit occurred. This includes the : server objects, databases, database objects, and schema objects. 0 if the entity is the server itself or if the audit is not performed at an object level | sysname | string |
| permission_bitmask | permission_bitmask_s | When applicable, shows the permissions that were granted, denied, or revoked | varbinary(16) | string |
| response_rows | response_rows_d | Number of rows returned in the result set | bigint | int |
| schema_name | schema_name_s | The schema context in which the action occurred. NULL for audits occurring outside a schema | sysname | string |
| N/A | securable_class_type_s | Securable object that maps to the class_type being audited | N/A | string |
| sequence_group_id | sequence_group_id_g | Unique identifier | varbinary | GUID |
| sequence_number | sequence_number_d | Tracks the sequence of records within a single audit record that was too large to fit in the write buffer for audits | int | int |
| server_instance_name | server_instance_name_s | Name of the server instance where the audit occurred | sysname | string |
| server_principal_id | server_principal_id_d | ID of the login context in which the action is performed | int | int |
| server_principal_name | server_principal_name_s | Current login | sysname | string |
| server_principal_sid | server_principal_sid_s | Current login SID | varbinary | string |
| session_id | session_id_d | ID of the session on which the event occurred | smallint | int |
| session_server_principal_name | session_server_principal_name_s | Server principal for session | sysname | string |
| statement | statement_s | T-SQL statement that was executed (if any) | nvarchar(4000) | string |
| succeeded | succeeded_s | Indicates whether the action that triggered the event succeeded. For  events other than login and batch, this only reports whether the permission check succeeded or failed, not the operation. 1 = success, 0 = fail | bit | string |
| target_database_principal_id | target_database_principal_id_d | The database principal the GRANT/DENY/REVOKE operation is performed on. 0 if not applicable | int | int |
| target_database_principal_name | target_database_principal_name_s | Target user of action. NULL if not applicable | string | string |
| target_server_principal_id | target_server_principal_id_d | Server principal that the GRANT/DENY/REVOKE operation is performed on. Returns 0 if not applicable | int | int |
| target_server_principal_name | target_server_principal_name_s | Target login of action. NULL if not applicable | sysname | string |
| target_server_principal_sid | target_server_principal_sid_s | SID of target login. NULL if not applicable | varbinary | string |
| transaction_id | transaction_id_d | SQL Server only (starting with 2016) - 0 for Azure SQL Database | bigint | int |
| user_defined_event_id | user_defined_event_id_d | User defined event ID passed as an argument to sp_audit_write. NULL for system events (default) and non-zero for user-defined event. For more information, see [sp_audit_write (Transact-SQL)](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-audit-write-transact-sql) | smallint | int |
| user_defined_information | user_defined_information_s | User defined information passed as an argument to sp_audit_write. NULL for system events (default) and non-zero for user-defined event. For more information, see [sp_audit_write (Transact-SQL)](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-audit-write-transact-sql) | nvarchar(4000) | string |

## Next steps

Learn more about [Azure SQL Database auditing](auditing-overview.md).
