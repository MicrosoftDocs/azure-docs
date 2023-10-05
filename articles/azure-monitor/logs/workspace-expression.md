---
title: workspace() expression in Azure Monitor log query | Microsoft Docs
description: The workspace expression is used in an Azure Monitor log query to retrieve data from a specific workspace in the same resource group, another resource group, or another subscription.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 04/20/2023

---

# Using the workspace() expression in Azure Monitor log query

Use the `workspace` expression in an Azure Monitor query to retrieve data from a specific workspace in the same resource group, another resource group, or another subscription. You can use this expression to include log data in an Application Insights query and to query data across multiple workspaces in a log query.

[!INCLUDE [Log Analytics agent deprecation](../../../includes/log-analytics-query-permissions.md)]

## Syntax

`workspace(`*Identifier*`)`

### Arguments

The `workspace` expression takes the following arguments.

#### Identifier 

Identifies the workspace by using one of the formats in the following table.

| Identifier | Description | Example
|:---|:---|:---|
| ID | GUID of the workspace | workspace("00000000-0000-0000-0000-000000000000") |
| Azure Resource ID | Identifier for the Azure resource | workspace("/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/Contoso/providers/Microsoft.OperationalInsights/workspaces/contosoretail") |


> [!NOTE]
> We strongly recommend identifying a workspace by its unique ID or Azure Resource ID because they remove ambiguity and are more performant.

## Examples

```Kusto
workspace("00000000-0000-0000-0000-000000000000").Update | count
```
```Kusto
workspace("/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/Contoso/providers/Microsoft.OperationalInsights/workspaces/contosoretail").Event | count
```
```Kusto
union 
( workspace("00000000-0000-0000-0000-000000000000").Heartbeat | where Computer == "myComputer"),
(app("00000000-0000-0000-0000-000000000000").requests | where cloud_RoleInstance == "myRoleInstance")
| count  
```
```Kusto
union 
(workspace("00000000-0000-0000-0000-000000000000").Heartbeat), (app("00000000-0000-0000-0000-000000000000").requests) | where TimeGenerated between(todatetime("2023-03-08 15:00:00") .. todatetime("2023-04-08 15:05:00"))
```

## Next steps

- See the [app expression](./app-expression.md), which allows you to query across Application Insights applications.
- Read about how [Azure Monitor data](./log-query-overview.md) is stored.
- Access full documentation for the [Kusto query language](/azure/kusto/query/).
