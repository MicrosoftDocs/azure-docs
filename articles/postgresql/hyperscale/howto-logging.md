---
title: Logs - Hyperscale (Citus) - Azure Database for PostgreSQL
description: How to access database logs for Azure Database for PostgreSQL - Hyperscale (Citus)
ms.author: jonels
author: jonels-msft
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: how-to
ms.date: 9/13/2021
---

# Logs in Azure Database for PostgreSQL - Hyperscale (Citus)

[!INCLUDE[applies-to-postgresql-hyperscale](../includes/applies-to-postgresql-hyperscale.md)]

PostgreSQL database server logs are available for every node of a Hyperscale
(Citus) server group. You can ship logs to a storage server, or to an analytics
service. The logs can be used to identify, troubleshoot, and repair
configuration errors and suboptimal performance.

## Capturing logs

To access PostgreSQL logs for a Hyperscale (Citus) coordinator or worker node,
you have to enable the PostgreSQLLogs diagnostic setting. In the Azure
portal, open **Diagnostic settings**, and select **+ Add diagnostic setting**.

:::image type="content" source="../media/howto-hyperscale-logging/diagnostic-settings.png" alt-text="Add diagnostic settings button":::

Pick a name for the new diagnostics settings, check the **PostgreSQLLogs** box,
and check the **Send to Log Analytics workspace** box.  Then select **Save**.

:::image type="content" source="../media/howto-hyperscale-logging/diagnostic-create-setting.png" alt-text="Choose PostgreSQL logs":::

## Viewing logs

To view and filter the logs, we'll use Kusto queries. Open **Logs** in the
Azure portal for your Hyperscale (Citus) server group. If a query selection
dialog appears, close it:

:::image type="content" source="../media/howto-hyperscale-logging/logs-dialog.png" alt-text="Logs page with dialog box open":::

You'll then see an input box to enter queries.

:::image type="content" source="../media/howto-hyperscale-logging/logs-query.png" alt-text="Input box to query logs":::

Enter the following query and select the **Run** button.

```kusto
AzureDiagnostics
| project TimeGenerated, Message, errorLevel_s, LogicalServerName_s
```

The above query lists log messages from all nodes, along with their severity
and timestamp. You can add `where` clauses to filter the results. For instance,
to see errors from the coordinator node only, filter the error level and server
name like this:

```kusto
AzureDiagnostics
| project TimeGenerated, Message, errorLevel_s, LogicalServerName_s
| where LogicalServerName_s == 'example-server-group-c'
| where errorLevel_s == 'ERROR'
```

Replace the server name in the above example with the name of your server. The
coordinator node name has the suffix `-c` and worker nodes are named
with a suffix of `-w0`, `-w1`, and so on.

The Azure logs can be filtered in different ways. Here's how to find logs
within the past day whose messages match a regular expression.

```kusto
AzureDiagnostics
| where TimeGenerated > ago(24h)
| order by TimeGenerated desc
| where Message matches regex ".*error.*"
```

## Next steps

- [Get started with log analytics queries](../../azure-monitor/logs/log-analytics-tutorial.md)
- Learn about [Azure event hubs](../../event-hubs/event-hubs-about.md)
