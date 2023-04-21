---
title: app() expression in Azure Monitor log queries | Microsoft Docs
description: The app expression is used in an Azure Monitor log query to retrieve data from a specific Application Insights app in the same resource group, another resource group, or another subscription.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 04/20/2023

---

# app() expression in Azure Monitor query

The `app` expression is used in an Azure Monitor query to retrieve data from a specific Application Insights app in the same resource group, another resource group, or another subscription. This is useful to include application data in an Azure Monitor log query and to query data across multiple applications in an Application Insights query.

> [!IMPORTANT]
> The app() expression is not used if you're using a [workspace-based Application Insights resource](../app/create-workspace-resource.md) since log data is stored in a Log Analytics workspace. Use the workspace() expression to write a query that includes application in multiple workspaces. For multiple applications in the same workspace, you don't need a cross workspace query.

## Syntax

`app(`*Identifier*`)`


## Arguments

- *Identifier*: Identifies the app using one of the formats in the table below.

| Identifier | Description | Example
|:---|:---|:---|
| ID | GUID of the app | app("00000000-0000-0000-0000-000000000000") |
| Azure Resource ID | Identifier for the Azure resource |app("/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/Fabrikam/providers/microsoft.insights/components/fabrikamapp") |


## Notes

* You must have read access to the application.
* Identifying an application by its ID or Azure Resource ID is strongly recommended since unique, removes ambiguity, and more performant.
* Use the related expression [workspace](../logs/workspace-expression.md) to query across Log Analytics workspaces.

## Examples

```Kusto
app("00000000-0000-0000-0000-000000000000").requests | count
```
```Kusto
app("/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/Fabrikam/providers/microsoft.insights/components/fabrikamapp").requests | count
```
```Kusto
union 
(workspace("00000000-0000-0000-0000-000000000000").Heartbeat | where Computer == "myComputer"),
(app("00000000-0000-0000-0000-000000000000").requests | where cloud_RoleInstance == "myColumnInstance")
| count  
```
```Kusto
union 
(workspace("00000000-0000-0000-0000-000000000000").Heartbeat), (app("00000000-0000-0000-0000-000000000000").requests)
| where TimeGenerated between(todatetime("2023-03-08 15:00:00") .. todatetime("2023-04-08 15:05:00"))
```

## Next steps

- See the [workspace expression](../logs/workspace-expression.md) to refer to a Log Analytics workspace.
- Read about how [Azure Monitor data](./log-query-overview.md) is stored.
- Access full documentation for the [Kusto query language](/azure/kusto/query/).
