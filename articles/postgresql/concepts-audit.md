---
title: Audit logging - Azure Database for PostgreSQL - Single Server
description: Concepts for pgAudit audit logging in Azure Database for PostgreSQL - Single Server.
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.topic: conceptual
ms.date: 01/28/2020
---

# Audit logging in Azure Database for PostgreSQL - Single Server

Audit logging of database activities in Azure Database for PostgreSQL - Single Server is available through the PostgreSQL Audit Extension: [pgAudit](https://www.pgaudit.org/). pgAudit provides detailed session and/or object audit logging.

> [!NOTE]
> pgAudit is in preview on Azure Database for PostgreSQL.
> The extension can be enabled on General Purpose and Memory Optimized servers only.

If you want Azure resource-level logs for operations like compute and storage scaling, see the [Azure Activity Log](../azure-monitor/platform/platform-logs-overview.md).

## Usage considerations
By default, pgAudit log statements are emitted along with your regular log statements by using Postgres's standard logging facility. In Azure Database for PostgreSQL, these .log files can be downloaded through the Azure portal or the CLI. The maximum storage for the collection of files is 1 GB, and each file is available for a maximum of seven days (the default is three days). This service is a short-term storage option.

Alternatively, you can configure all logs to be sent to Azure Monitor Log store for later analytics in Log Analytics. If you enable Azure Monitor resource logging, your logs will be automatically sent (in JSON format) to Azure Storage, Event Hubs, and/or Azure Monitor logs, depending on your choice.

Enabling pgAudit generates a large volume of logging on a server, which has an impact on performance and log storage. We recommend that you use Azure Monitor Logs, which offers longer-term storage options, as well as analysis and alerting features. We recommend that you turn off standard logging to reduce the performance impact of additional logging:

   1. Set the parameter `logging_collector` to OFF. 
   2. Restart the server to apply this change.

To learn how to set up logging to Azure Storage, Event Hubs, or Azure Monitor logs, visit the resource logs section of the [server logs article](concepts-server-logs.md).

## Installing pgAudit

To install pgAudit, you need to include it in the server's shared preload libraries. A change to Postgres's `shared_preload_libraries` parameter requires a server restart to take effect. You can change parameters using the [Azure portal](howto-configure-server-parameters-using-portal.md), [Azure CLI](howto-configure-server-parameters-using-cli.md), or [REST API](/rest/api/postgresql/configurations/createorupdate).

Using the [Azure portal](https://portal.azure.com):

   1. Select your Azure Database for PostgreSQL server.
   2. On the sidebar, select **Server Parameters**.
   3. Search for the `shared_preload_libraries` parameter.
   4. Select **pgaudit**.
   5. Restart the server to apply the change.

   6. Connect to your server using a client (like psql) and enable the pgAudit extension
      ```SQL
      CREATE EXTENSION pgaudit;
      ```

> [!TIP]
> If you see an error, confirm that you restarted your server after saving `shared_preload_libraries`.

## pgAudit settings

pgAudit allows you to configure session or object audit logging. [Session audit logging](https://github.com/pgaudit/pgaudit/blob/master/README.md#session-audit-logging) emits detailed logs of executed statements. [Object audit logging](https://github.com/pgaudit/pgaudit/blob/master/README.md#object-audit-logging) is audit scoped to specific relations. You can choose to set up one or both types of logging. 

> [!NOTE]
> pgAudit settings are specified gloabally and cannot be specified at a database or role level.

Once you have [installed pgAudit](#installing-pgaudit), you can configure its parameters to start logging. The [pgAudit documentation](https://github.com/pgaudit/pgaudit/blob/master/README.md#settings) provides the definition of each parameter. Test the parameters first and confirm that you are getting the expected behavior.

> [!NOTE]
> Setting `pgaudit.log_client` to ON will redirect logs to a client process (like psql) instead of being written to file. This setting should generally be left disabled. <br> <br>
> `pgaudit.log_level` is only enabled when `pgaudit.log_client` is on.

> [!NOTE]
> In Azure Database for PostgreSQL, `pgaudit.log` cannot be set using a `-` (minus) sign shortcut as described in the pgAudit documentation. All required statement classes (READ, WRITE etc) should be individually specified.

### Audit log format
Each audit entry is indicated by `AUDIT:` near the beginning of the log line. The format of the rest of the entry is detailed in the [pgAudit documentation](https://github.com/pgaudit/pgaudit/blob/master/README.md#format).

If you need any other fields to satisfy your audit requirements, use the Postgres parameter `log_line_prefix`. `log_line_prefix` is a string that is output at the beginning of every Postgres log line. For example, the following `log_line_prefix` setting provides timestamp, username, database name, and process ID:

```
t=%m u=%u db=%d pid=[%p]:
```

To learn more about `log_line_prefix`, visit the [PostgreSQL documentation](https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-LOG-LINE-PREFIX).

### Getting started
To quickly get started, set `pgaudit.log` to `WRITE`, and open your logs to review the output. 

## Viewing audit logs
If you are using .log files, your audit logs will be included in the same file as your PostgreSQL error logs. You can download log files from the Azure [portal](howto-configure-server-logs-in-portal.md) or [CLI](howto-configure-server-logs-using-cli.md). 

If you are using Azure resource logging, the way you access the logs depends on which endpoint you choose. For Azure Storage, see the [logs storage account](../azure-monitor/platform/resource-logs-collect-storage.md) article. For Event Hubs, see the [stream Azure logs](../azure-monitor/platform/resource-logs-stream-event-hubs.md) article.

For Azure Monitor Logs, logs are sent to the workspace you selected. The Postgres logs use the **AzureDiagnostics** collection mode, so they can be queried from the AzureDiagnostics table. The fields in the table are described below. Learn more about querying and alerting in the [Azure Monitor Logs query](../azure-monitor/log-query/log-query-overview.md) overview.

You can use this query to get started. You can configure alerts based on queries.

Search for all Postgres logs for a particular server in the last day
```
AzureDiagnostics
| where LogicalServerName_s == "myservername"
| where TimeGenerated > ago(1d) 
| where Message contains "AUDIT:"
```

## Next steps
- [Learn about logging in Azure Database for PostgreSQL](concepts-server-logs.md)
- Learn how to set parameters using the [Azure portal](howto-configure-server-parameters-using-portal.md), [Azure CLI](howto-configure-server-parameters-using-cli.md), or [REST API](/rest/api/postgresql/configurations/createorupdate).
