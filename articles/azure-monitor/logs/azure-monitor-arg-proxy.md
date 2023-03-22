---
title: Cross-resource query Azure Resource Graph by using Azure Monitor
description: Use Azure Monitor to perform cross-product queries between Azure Resource Graph, Log Analytics workspaces, and classic Application Insights applications in Azure Monitor.
author: osalzberg
ms.author: orens
ms.topic: conceptual
ms.date: 03/22/2023
ms.reviewer: osalzberg

---
# Cross-resource query Azure Resource Graph by using Azure Monitor
Azure Monitor supports cross-service queries between Azure Resource Graph, [Application Insights](../app/app-insights-overview.md), and [Log Analytics](../logs/data-platform-logs.md). You can then query your Azure Resource Graph tables by using Log Analytics or Application Insights tools and refer to it in a cross-service query. This article shows how to make a cross-service query.

## Cross query your Log Analytics or Application Insights resources and Azure Resource Graph

You can run cross-resource queries by using client tools that support Kusto queries. Examples of these tools include the Log Analytics web UI, workbooks, PowerShell, and the REST API.

Enter the `arg` pattern, followed by the Azure Resource Graph table.

```kusto
adx().Resources
```
:::image type="content" source="media/azure-arg-monitor-proxy/azure-arg-monitor-query-example.png" alt-text="Screenshot that shows an example of a cross-service query.":::

> [!NOTE]
>* Identifying the Timestamp column in the cluster isn't supported. The Log Analytics Query API won't pass along the time filter.
> * The cross-service query ability is used for data retrieval only. For more information, see [Function supportability](#function-supportability).

## Function supportability

The Azure Monitor cross-service queries support functions for Application Insights, Log Analytics, and Azure Resource Graph.
This capability enables cross-cluster queries to reference an Azure Monitor or Azure Resource Graph tabular function directly.
The following commands are supported with the cross-service query:

* `.show functions`
* `.show function {FunctionName}`
* `.show database {DatabaseName} schema as json`

## Combine Azure Resource Graph tables with a Log Analytics workspace

Use the `union` command to combine cluster tables with a Log Analytics workspace.

```kusto
union AzureActivity, arg().Resources
| take 10
```
```kusto
let CL1 = adx('https://help.kusto.windows.net/Samples').StormEvents;
union customEvents, CL1 | take 10
```
:::image type="content" source="media/azure-arg-monitor-proxy/azure-monitor-union-cross-query.png" alt-text="Screenshot that shows a cross-service query example with the union command.":::

## Next steps
* [Write queries](/azure/data-explorer/write-queries)
* [Azure Resource Graph Overview](../governance/resource-graph/overview.md)
* [Query data in Azure Monitor by using Azure Data Explorer](/azure/data-explorer/query-monitor-data)
* [Perform cross-resource log queries in Azure Monitor](../logs/cross-workspace-query.md)