---
title: app() expression in Azure Monitor log queries | Microsoft Docs
description: The app expression is used in an Azure Monitor log query to retrieve data from a specific Application Insights app in the same resource group, another resource group, or another subscription.
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 05/09/2019

---

# app() expression in Azure Monitor query

The `app` expression is used in an Azure Monitor query to retrieve data from a specific Application Insights app in the same resource group, another resource group, or another subscription. This is useful to include application data in an Azure Monitor log query and to query data across multiple applications in an Application Insights query.

> [!IMPORTANT]
> The app() expression is not used if you're using a [workspace-based Application Insights resource](../app/create-workspace-resource.md) since log data is stored in a Log Analytics workspace. Use the log() expression to write a query that includes application in multiple workspaces. For multiple applications in the same workspace, you don't need a cross workspace query.

## Syntax

`app(`*Identifier*`)`


## Arguments

- *Identifier*: Identifies the app using one of the formats in the table below.

| Identifier | Description | Example
|:---|:---|:---|
| Resource Name | Human readable name of the app (Also known as "component name") | app("fabrikamapp") |
| Qualified Name | Full name of the app in the form: "subscriptionName/resourceGroup/componentName" | app('AI-Prototype/Fabrikam/fabrikamapp') |
| ID | GUID of the app | app("988ba129-363e-4415-8fe7-8cbab5447518") |
| Azure Resource ID | Identifier for the Azure resource |app("/subscriptions/7293b69-db12-44fc-9a66-9c2005c3051d/resourcegroups/Fabrikam/providers/microsoft.insights/components/fabrikamapp") |


## Notes

* You must have read access to the application.
* Identifying an application by its name assumes that it is unique across all accessible subscriptions. If you have multiple applications with the specified name, the query will fail because of the ambiguity. In this case you must use one of the other identifiers.
* Use the related expression [workspace](workspace-expression.md) to query across Log Analytics workspaces.
* The app() expression is currently not supported in the search query when using the Azure portal to create a [custom log search alert rule](../platform/alerts-log.md), unless an Application Insights application is used as the resource for the alert rule.

## Examples

```Kusto
app("fabrikamapp").requests | count
```
```Kusto
app("AI-Prototype/Fabrikam/fabrikamapp").requests | count
```
```Kusto
app("b438b4f6-912a-46d5-9cb1-b44069212ab4").requests | count
```
```Kusto
app("/subscriptions/7293b69-db12-44fc-9a66-9c2005c3051d/resourcegroups/Fabrikam/providers/microsoft.insights/components/fabrikamapp").requests | count
```
```Kusto
union 
(workspace("myworkspace").Heartbeat | where Computer contains "Con"),
(app("myapplication").requests | where cloud_RoleInstance contains "Con")
| count  
```
```Kusto
union 
(workspace("myworkspace").Heartbeat), (app("myapplication").requests)
| where TimeGenerated between(todatetime("2018-02-08 15:00:00") .. todatetime("2018-12-08 15:05:00"))
```

## Next steps

- See the [workspace expression](workspace-expression.md) to refer to a Log Analytics workspace.
- Read about how [Azure Monitor data](../../azure-monitor/log-query/log-query-overview.md) is stored.
- Access full documentation for the [Kusto query language](/azure/kusto/query/).