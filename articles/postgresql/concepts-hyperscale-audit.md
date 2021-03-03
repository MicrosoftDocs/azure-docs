---
title: Audit logging - Azure Database for PostgreSQL - Hyperscale (Citus)
description: Concepts for pgAudit audit logging in Azure Database for PostgreSQL - Hyperscale (Citus).
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.topic: conceptual
ms.date: 01/29/2021
---

# Audit logging in Azure Database for PostgreSQL - Hyperscale (Citus)

Audit logging of database activities in Azure Database for PostgreSQL - Hyperscale (Citus) is available through the PostgreSQL Audit extension: [pgAudit](https://www.pgaudit.org/). pgAudit provides detailed session and/or object audit logging.

> [!IMPORTANT]
> pgAudit is in preview on Azure Database for PostgreSQL - Hyperscale (Citus)

If you want Azure resource-level logs for operations like compute and storage scaling, see the [Azure Activity Log](../azure-monitor/essentials/platform-logs-overview.md).

## Usage considerations
By default, pgAudit log statements are emitted along with your regular log statements by using Postgres's standard logging facility. In Azure Database for PostgreSQL - Hyperscale (Citus), you can configure all logs to be sent to Azure Monitor Log store for later analytics in Log Analytics. If you enable Azure Monitor resource logging, your logs will be automatically sent (in JSON format) to Azure Storage, Event Hubs, and/or Azure Monitor logs, depending on your choice.

## Enabling pgAudit

The pgAudit extension is pre-installed and enabled on all Hyperscale (Citus)
server group nodes. No action is required to enable it.

## pgAudit settings

pgAudit allows you to configure session or object audit logging. [Session audit logging](https://github.com/pgaudit/pgaudit/blob/master/README.md#session-audit-logging) emits detailed logs of executed statements. [Object audit logging](https://github.com/pgaudit/pgaudit/blob/master/README.md#object-audit-logging) is audit scoped to specific relations. You can choose to set up one or both types of logging. 

> [!NOTE]
> pgAudit settings are specified globally and cannot be specified at a database or role level.
>
> Also, pgAudit settings are specified per-node in a server group. To make a change on all nodes, you must apply it to each node individually.

You must configure pgAudit parameters to start logging. The [pgAudit documentation](https://github.com/pgaudit/pgaudit/blob/master/README.md#settings) provides the definition of each parameter. Test the parameters first and confirm that you are getting the expected behavior.

> [!NOTE]
> Setting `pgaudit.log_client` to ON will redirect logs to a client process (like psql) instead of being written to file. This setting should generally be left disabled. <br> <br>
> `pgaudit.log_level` is only enabled when `pgaudit.log_client` is on.

> [!NOTE]
> In Azure Database for PostgreSQL - Hyperscale (Citus), `pgaudit.log` cannot be set using a `-` (minus) sign shortcut as described in the pgAudit documentation. All required statement classes (READ, WRITE, etc.) should be individually specified.

## Audit log format
Each audit entry is indicated by `AUDIT:` near the beginning of the log line. The format of the rest of the entry is detailed in the [pgAudit documentation](https://github.com/pgaudit/pgaudit/blob/master/README.md#format).

## Getting started
To quickly get started, set `pgaudit.log` to `WRITE`, and open your server logs to review the output. 

## Viewing audit logs
The way you access the logs depends on which endpoint you choose. For Azure Storage, see the [logs storage account](../azure-monitor/essentials/resource-logs.md#send-to-azure-storage) article. For Event Hubs, see the [stream Azure logs](../azure-monitor/essentials/resource-logs.md#send-to-azure-event-hubs) article.

For Azure Monitor Logs, logs are sent to the workspace you selected. The Postgres logs use the **AzureDiagnostics** collection mode, so they can be queried from the AzureDiagnostics table. The fields in the table are described below. Learn more about querying and alerting in the [Azure Monitor Logs query](../azure-monitor/logs/log-query-overview.md) overview.

You can use this query to get started. You can configure alerts based on queries.

Search for all pgAudit entries in Postgres logs for a particular server in the last day
```kusto
AzureDiagnostics
| where LogicalServerName_s == "myservername"
| where TimeGenerated > ago(1d) 
| where Message contains "AUDIT:"
```

## Next steps

- [Learn how to setup logging in Azure Database for PostgreSQL - Hyperscale (Citus) and how to access logs](howto-hyperscale-logging.md)