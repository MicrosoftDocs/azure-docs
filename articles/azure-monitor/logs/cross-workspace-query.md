---
title: Query across resources with Azure Monitor  
description: Query and correlated data from multiple Log Analytics workspaces, applications, or resources using the `workspace()`, `app()`, and `resource()` Kusto Query Language (KQL) expressions.
ms.topic: how-to
author: guywi-ms
ms.author: guywild
ms.date: 12/28/2023
# Customer intent: As a data analyst, I want to write KQL queries that correlate data from multiple Log Analytics workspaces, applications, or resources, to enable my analysis.

---

# Query data across Log Analytics workspaces, applications, and resources in Azure Monitor

There are two ways to query data from multiple workspaces, applications, and resources:

* Explicitly by specifying the workspace, app, or resource information using the [workspace()](#query-across-log-analytics-workspaces-using-workspace), [app()](#query-across-classic-application-insights-applications-using-app), or [resource()](#correlate-data-between-resources-using-resource) expressions, as described in this article.
* Implicitly by using [resource-context queries](manage-access.md#access-mode). When you query in the context of a specific resource, resource group, or a subscription, the query retrieves relevant data from all workspaces that contain data for these resources. Resource-context queries don't retrieve data from classic Application Insights resources.

This article explains how to use the `workspace()`, `app()`, and `resource()` expressions to query data from multiple Log Analytics workspaces, applications, and resources. 

If you manage subscriptions in other Microsoft Entra tenants through [Azure Lighthouse](../../lighthouse/overview.md), you can include [Log Analytics workspaces created in those customer tenants](../../lighthouse/how-to/monitor-at-scale.md) in your queries.

> [!IMPORTANT]
> If you're using a [workspace-based Application Insights resource](../app/create-workspace-resource.md), telemetry is stored in a Log Analytics workspace with all other log data. Use the `workspace()` expression to query data from applications in multiple workspaces. You don't need a cross-workspace query to query data from multiple applications in the same workspace.

## Permissions required

- You must have `Microsoft.OperationalInsights/workspaces/query/*/read` permissions to the Log Analytics workspaces you query, as provided by the [Log Analytics Reader built-in role](./manage-access.md#log-analytics-reader), for example.
- To save a query, you must have `microsoft.operationalinsights/querypacks/queries/action` permissions to the query pack where you want to save the query, as provided by the [Log Analytics Contributor built-in role](./manage-access.md#log-analytics-contributor), for example.

## Limitations

* Cross-resource and cross-service queries don’t support parameterized functions and functions whose definition includes other cross-workspace or cross-service expressions, including `adx()`, `arg()`, `resource()`, `workspace()`, and `app()`.
* You can include up to 100 Log Analytics workspaces or classic Application Insights resources in a single query.
* Querying across a large number of resources can substantially slow down the query.
* Cross-resource queries in log search alerts are only supported in the current [scheduledQueryRules API](/rest/api/monitor/scheduledqueryrule-2018-04-16/scheduled-query-rules). If you're using the legacy Log Analytics Alerts API, you'll need to [switch to the current API](../alerts/alerts-log-api-switch.md).
* References to a cross resource, such as another workspace, should be explicit and can't be parameterized. 

## Query across workspaces, applications, and resources using functions

This section explains how to query workspaces, applications, and resources using functions with and without using a function.

### Query without using a function
You can query multiple resources from any of your resource instances. These resources can be workspaces and apps combined.

Example for a query across three workspaces:

```kusto
union 
  Update, 
  workspace("00000000-0000-0000-0000-000000000001").Update, 
  workspace("00000000-0000-0000-0000-000000000002").Update
| where TimeGenerated >= ago(1h)
| where UpdateState == "Needed"
| summarize dcount(Computer) by Classification
```

For more information on the union, where, and summarize operators, see [union operator](/azure/data-explorer/kusto/query/unionoperator), [where operator](/azure/data-explorer/kusto/query/summarizeoperator), and [summarize operator](/azure/data-explorer/kusto/query/summarizeoperator).

### Query by using a function
When you use cross-resource queries to correlate data from multiple Log Analytics workspaces and Application Insights components, the query can become complex and difficult to maintain. You should make use of [functions in Azure Monitor log queries](./functions.md) to separate the query logic from the scoping of the query resources. This method simplifies the query structure. The following example demonstrates how you can monitor multiple Application Insights components and visualize the count of failed requests by application name.

Create a query like the following example that references the scope of Application Insights components. The `withsource= SourceApp` command adds a column that designates the application name that sent the log. [Save the query as a function](./functions.md#create-a-function) with the alias `applicationsScoping`.

```Kusto
// crossResource function that scopes my Application Insights components
union withsource= SourceApp
app('00000000-0000-0000-0000-000000000000').requests, 
app('00000000-0000-0000-0000-000000000001').requests,
app('00000000-0000-0000-0000-000000000002').requests,
app('00000000-0000-0000-0000-000000000003').requests,
app('00000000-0000-0000-0000-000000000004').requests
```

You can now [use this function](./functions.md#use-a-function) in a cross-resource query like the following example. The function alias `applicationsScoping` returns the union of the requests table from all the defined applications. The query then filters for failed requests and visualizes the trends by application. The `parse` operator is optional in this example. It extracts the application name from the `SourceApp` property.

```Kusto
applicationsScoping 
| where timestamp > ago(12h)
| where success == 'False'
| parse SourceApp with * '(' applicationId ')' * 
| summarize count() by applicationId, bin(timestamp, 1h) 
| render timechart
```

>[!NOTE]
> This method can't be used with log search alerts because the access validation of the alert rule resources, including workspaces and applications, is performed at alert creation time. Adding new resources to the function after the alert creation isn't supported. If you prefer to use a function for resource scoping in log search alerts, you must edit the alert rule in the portal or with an Azure Resource Manager template to update the scoped resources. Alternatively, you can include the list of resources in the log search alert query.

## Query across Log Analytics workspaces using workspace() 

Use the `workspace()` expression to retrieve data from a specific workspace in the same resource group, another resource group, or another subscription. You can use this expression to include log data in an Application Insights query and to query data across multiple workspaces in a log query.

### Syntax

`workspace(`*Identifier*`)`

### Arguments

`*Identifier*`: Identifies the workspace by using one of the formats in the following table.

| Identifier | Description | Example
|:---|:---|:---|
| ID | GUID of the workspace | workspace("00000000-0000-0000-0000-000000000000") |
| Azure Resource ID | Identifier for the Azure resource | workspace("/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/Contoso/providers/Microsoft.OperationalInsights/workspaces/contosoretail") |

### Examples

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

## Query across classic Application Insights applications using app() 

Use the `app` expression to retrieve data from a specific classic Application Insights resource in the same resource group, another resource group, or another subscription.  If you're using a [workspace-based Application Insights resource](../app/create-workspace-resource.md), telemetry is stored in a Log Analytics workspace with all other log data. Use the `workspace()` expression to query data from applications in multiple workspaces. You don't need a cross-workspace query to query data from multiple applications in the same workspace.

### Syntax

`app(`*Identifier*`)`


### Arguments

`*Identifier*`: Identifies the app using one of the formats in the table below.

| Identifier | Description | Example
|:---|:---|:---|
| ID | GUID of the app | app("00000000-0000-0000-0000-000000000000") |
| Azure Resource ID | Identifier for the Azure resource |app("/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/Fabrikam/providers/microsoft.insights/components/fabrikamapp") |

### Examples

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

## Correlate data between resources using resource() 

The `resource` expression is used in a Azure Monitor query [scoped to a resource](scope.md#query-scope) to retrieve data from other resources. 


### Syntax

`resource(`*Identifier*`)`

### Arguments

`*Identifier*`: Identifies the resource, resource group, or subscription from which to correlate data.

| Identifier | Description | Example
|:---|:---|:---|
| Resource | Includes data for the resource. | resource("/subscriptions/xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcesgroups/myresourcegroup/providers/microsoft.compute/virtualmachines/myvm") |
| Resource Group or Subscription | Includes data for the resource and all resources that it contains.  | resource("/subscriptions/xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcesgroups/myresourcegroup) |


### Examples

```Kusto
union (Heartbeat),(resource("/subscriptions/xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcesgroups/myresourcegroup/providers/microsoft.compute/virtualmachines/myvm").Heartbeat) | summarize count() by _ResourceId, TenantId
```
```Kusto
union (Heartbeat),(resource("/subscriptions/xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcesgroups/myresourcegroup).Heartbeat) | summarize count() by _ResourceId, TenantId
```

## Next steps

See [Analyze log data in Azure Monitor](./log-query-overview.md) for an overview of log queries and how Azure Monitor log data is structured.
