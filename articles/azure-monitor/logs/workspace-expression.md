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

## Permissions required

The permissions required to use the `workspace` expression depend on which access control mode is enabled.

### Require workspace permissions

If this access control mode is enabled, you must be granted the `Microsoft.OperationalInsights/workspaces/query/*/read` permission to the workspace.

### Use resource or workspace permissions

If this access control mode is enabled, you must be assigned to one of the following roles, which provides read access to the workspace:

- [Monitoring Contributor built-in role](../../role-based-access-control/built-in-roles.md#monitoring-contributor)
- [Monitoring Reader built-in role](../../role-based-access-control/built-in-roles.md#monitoring-reader)
- [Log Analytics Contributor built-in role](../../role-based-access-control/built-in-roles.md#log-analytics-contributor)
- [Log Analytics Reader built-in role](../../role-based-access-control/built-in-roles.md#log-analytics-reader)
- Any other [built-in role](../../role-based-access-control/built-in-roles.md) with the `Microsoft.OperationalInsights/workspaces/query/*/read` or `*/read` action
- Any [custom role](../../role-based-access-control/custom-roles.md) with the `Microsoft.OperationalInsights/workspaces/query/*/read` permission

## Syntax

`workspace(`*Identifier*`)`

### Arguments

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
