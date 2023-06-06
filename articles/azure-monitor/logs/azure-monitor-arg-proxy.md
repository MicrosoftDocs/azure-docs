---
title: Query data in Azure Resource Graph and Azure Data Explorer from Azure Monitor
description: Query data in Azure Resource Graph and Azure Data Explorer from Azure Monitor.
author: guywi-ms
ms.author: guywild
ms.topic: conceptual
ms.date: 06/05/2023
ms.reviewer: osalzberg

---
# Query data in Azure Resource Graph and Azure Data Explorer from Azure Monitor
Azure Monitor lets you query data in [Azure Resource Graph](../../governance/resource-graph/) and [Azure Data Explorer](/azure/data-explorer/data-explorer-overview.md) from your Log Analytics workspace or Application Insights resources. This article explains how to query data in Azure Resource Graph from Azure Monitor.

## Permissions

[!INCLUDE [azure-monitor-log-queries](../../../includes/azure-monitor-log-queries.md)

## Cross-query your Log Analytics or Application Insights resources and Azure Resource Graph

You can run cross-resource queries by using any client tools that support Kusto Query Language (KQL) queries, including the Log Analytics web UI, workbooks, PowerShell, and the REST API.

## Syntax

`arg(״״).<Azure-Resource-Graph-table-name>`

Enter the `arg("")` pattern, followed by the Azure Resource Graph table name.

For example:

```kusto
arg("").<Azure-Resource-Graph-table-name>
```

> [!NOTE]
>* The cross-service query ability is used for data retrieval only. For more information, see [Function supportability](#function-supportability).

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
union AzureActivity, arg("").Resources
| take 10
```
```kusto
let CL1 = arg("").Resources ;
union AzureActivity, CL1 | take 10
```

When you use the [`join` operator](/azure/data-explorer/kusto/query/joinoperator) instead of union, you're required to use a [`hint`](/azure/data-explorer/kusto/query/joinoperator#join-hints) to combine the data in Azure Resource Graph with the Log Analytics workspace. Use `Hint.remote={Direction of the Log Analytics Workspace}`. For example:

```kusto
Perf | where ObjectName == "Memory" and (CounterName == "Available MBytes Memory")
| extend _ResourceId = replace_string(replace_string(replace_string(_ResourceId, 'microsoft.compute', 'Microsoft.Compute'), 'virtualmachines','virtualMachines'),"resourcegroups","resourceGroups")
| join hint.remote=left (arg("").Resources | where type =~ 'Microsoft.Compute/virtualMachines' | project _ResourceId=id, tags) on _ResourceId | project-away _ResourceId1 | where tostring(tags.env) == "prod"
```

## Next steps
* [Write queries](/azure/data-explorer/write-queries)
* [Perform cross-resource log queries in Azure Monitor](../logs/cross-workspace-query.md)