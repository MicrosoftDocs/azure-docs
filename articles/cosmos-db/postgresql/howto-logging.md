---
title: Logs - Azure Cosmos DB for PostgreSQL
description: How to access database logs for Azure Cosmos DB for PostgreSQL
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 9/21/2022
---

# Logs in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

PostgreSQL database server logs are available for every node of a
cluster. You can ship logs to a storage server, or to an analytics
service. The logs can be used to identify, troubleshoot, and repair
configuration errors and suboptimal performance.

## Capture logs

To access PostgreSQL logs for a coordinator or worker node,
you have to enable the PostgreSQL Server Logs diagnostic setting. On your cluster's page in the Azure portal, select **Diagnostic settings** from the left menu, and then select **Add diagnostic setting**.

:::image type="content" source="media/howto-logging/diagnostic-settings.png" alt-text="Screenshot that shows Add diagnostic setting.":::

Enter a name for the new diagnostic setting, select the **PostgreSQL Server Logs** box,
and check the **Send to Log Analytics workspace** box.  Then select **Save**.

:::image type="content" source="media/howto-logging/diagnostic-create-setting.png" alt-text="Screenshot that shows settings for the diagnostic setting.":::

## View logs

To view and filter the logs, you use Kusto queries. On your cluster's page in the Azure portal, select **Logs** from the left menu. Close the opening splash screen and the query selection screen.

:::image type="content" source="media/howto-logging/logs-dialog.png" alt-text="Screenshot that shows closing the opening query selection screen.":::

Paste the following query into the query input box, and then select **Run**.

```kusto
AzureDiagnostics
| project TimeGenerated, Message, errorLevel_s, LogicalServerName_s
```

:::image type="content" source="media/howto-logging/logs-query.png" alt-text="Screenshot that shows the query input box.":::

The preceding query lists log messages from all nodes, along with their severity
and timestamp. You can add `where` clauses to filter the results. For instance,
to see errors from the coordinator node only, filter the error level and server
name like in the following query. Replace the server name with the name of your server. 

```kusto
AzureDiagnostics
| project TimeGenerated, Message, errorLevel_s, LogicalServerName_s
| where LogicalServerName_s == 'example-cluster-c'
| where errorLevel_s == 'ERROR'
```

The coordinator node name has the suffix `-c` and worker nodes are named
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
- Learn about [Azure Event Hubs](../../event-hubs/event-hubs-about.md)
