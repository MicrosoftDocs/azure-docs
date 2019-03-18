---
title: workspace() expression in Azure Monitor log query | Microsoft Docs
description: The workspace expression is used in an Azure Monitor log query to retrieve data from a specific workspace in the same resource group, another resource group, or another subscription.
services: log-analytics
documentationcenter: ''
author: bwren
manager: carmonm
editor: ''
ms.assetid: 
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 09/10/2018
ms.author: bwren
---

# workspace() expression in Azure Monitor log query

The `workspace` expression is used in an Azure Monitor query to retrieve data from a specific workspace in the same resource group, another resource group, or another subscription. This is useful to include log data in an Application Insights query and to query data across multiple workspaces in a log query.


## Syntax

`workspace(`*Identifier*`)`

## Arguments

- *Identifier*: Identifies the workspace using one of the formats in the table below.

| Identifier | Description | Example
|:---|:---|:---|
| Resource Name | Human readable name of the workspace (AKA "component name") | workspace("contosoretail") |
| Qualified Name | Full name of the workspace in the form: "subscriptionName/resourceGroup/componentName" | workspace('Contoso/ContosoResource/ContosoWorkspace') |
| ID | GUID of the workspace | workspace("b438b3f6-912a-46d5-9db1-b42069242ab4") |
| Azure Resource ID | Identifier for the Azure resource | workspace("/subscriptions/e4227-645-44e-9c67-3b84b5982/resourcegroups/ContosoAzureHQ/providers/Microsoft.OperationalInsights/workspaces/contosoretail") |


## Notes

* You must have read access to the workspace.
* A related expression is `app` that allows you to query across Application Insights applications.

## Examples

```Kusto
workspace("contosoretail").Update | count
```
```Kusto
workspace("b438b4f6-912a-46d5-9cb1-b44069212ab4").Update | count
```
```Kusto
workspace("/subscriptions/e427267-5645-4c4e-9c67-3b84b59a6982/resourcegroups/ContosoAzureHQ/providers/Microsoft.OperationalInsights/workspaces/contosoretail").Event | count
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

- See the [app expression](app-expression.md) to refer to an Application Insights app.
- Read about how [Azure Monitor data](log-query-overview.md) is stored.
- Access full documentation for the [Kusto query language](/azure/kusto/query/).
