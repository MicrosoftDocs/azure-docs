---
title: app() expression in Azure Log Analytics query | Microsoft Docs
description: The app expression is used in a Log Analytics query to retrieve data from a specific Application Insights app in the same resource group, another resource group, or another subscription.
services: log-analytics
documentationcenter: ''
author: bwren
manager: carmonm
editor: ''
ms.assetid: 
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/10/2018
ms.author: bwren
ms.component: na
---

# app() expression in Log Analytics query

The `app` expression is used in a Log Analytics query to retrieve data from a specific Application Insights app in the same resource group, another resource group, or another subscription. This is useful to include application data in a Log Analytics query and to query data across multiple applications in an Application Insights query.



## Syntax

`app(`*Identifier*`)`


## Arguments

- *Identifier*: Identifies the app using one of the formats in the table below.

| Identifier | Description | Example
|:---|:---|:---|
| Resource Name | Human readable name of the app (AKA "component name") | app("fabrikamapp") |
| Qualified Name | Full name of the app in the form: "subscriptionName/resourceGroup/componentName" | app('AI-Prototype/Fabrikam/fabrikamapp') |
| ID | GUID of the app | app("988ba129-363e-4415-8fe7-8cbab5447518") |
| Azure Resource ID | Identifier for the Azure resource |app("/subscriptions/7293b69-db12-44fc-9a66-9c2005c3051d/resourcegroups/Fabrikam/providers/microsoft.insights/components/fabrikamapp") |


## Notes

* You must have read access to the application.
* Identifying an application by its name assumes that it is unique across all accessible subscriptions. If you have multiple applications with the specified name, the query will fail because of the ambiguity. In this case you must use one of the other identifiers.
* Use the related expression [workspace](workspace-expression.md) to query across Log Analytics workspaces.

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

- See the [workspace expression](workspace-expression.md) to refer to Log Analytics workspace.
- Read about how [Log Analytics data](../../log-analytics/log-analytics-log-search.md) is stored.