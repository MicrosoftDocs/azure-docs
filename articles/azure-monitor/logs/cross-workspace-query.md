---
title: Query across resources with Azure Monitor  | Microsoft Docs
description: This article describes how you can query against resources from multiple workspaces and an Application Insights app in your subscription.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.date: 05/30/2023

---

# Create a log query across workspaces, apps, or resources in Azure Monitor

There are two methods to query data from multiple workspaces, applications, and resources:

* Explicitly by specifying the workspace, app, or resource information using the [workspace()](#use-the-workspace-expression-to-query-across-log-analytics-workspaces), [app()](#use-the-app-expression-to-query-across-classic-application-insights-applications), or [resource()](#use-the-resource-expression-to-correlate-data-between-resources) expressions.
* Implicitly by using [resource-context queries](manage-access.md#access-mode). When you query in the context of a specific resource, resource group, or a subscription, the relevant data will be fetched from all workspaces that contain data for these resources. Application Insights data that's stored in apps won't be fetched.

This article explains how to use the workspace(), app(), or resource() expressions to query data from multiple workspaces, applications, and resources. 

If you manage subscriptions in other Microsoft Entra tenants through [Azure Lighthouse](../../lighthouse/overview.md), you can include [Log Analytics workspaces created in those customer tenants](../../lighthouse/how-to/monitor-at-scale.md) in your queries.


> [!IMPORTANT]
> If you're using a [workspace-based Application Insights resource](../app/create-workspace-resource.md), telemetry is stored in a Log Analytics workspace with all other log data. Use the `workspace()` expression to write a query that includes applications in multiple workspaces. For multiple applications in the same workspace, you don't need a cross-workspace query.

## Permissions required

- You must have `Microsoft.OperationalInsights/workspaces/query/*/read` permissions to the Log Analytics workspaces you query, as provided by the [Log Analytics Reader built-in role](./manage-access.md#log-analytics-reader), for example.
- To save a query, you must have `microsoft.operationalinsights/querypacks/queries/action` permisisons to the query pack where you want to save the query, as provided by the [Log Analytics Contributor built-in role](./manage-access.md#log-analytics-contributor), for example.

## Cross-resource query limits

* The number of Application Insights components and Log Analytics workspaces that you can include in a single query is limited to 100.
* Querying across a large number of resources can substantially slow down the query.
* Cross-resource queries in log alerts are only supported in the current [scheduledQueryRules API](/rest/api/monitor/scheduledqueryrule-2018-04-16/scheduled-query-rules). If you're using the legacy Log Analytics Alerts API, you'll need to [switch to the current API](../alerts/alerts-log-api-switch.md).
* References to a cross resource, such as another workspace, should be explicit and can't be parameterized. See [Gather identifiers for Log Analytics workspaces](?tabs=workspace-identifier#gather-identifiers-for-log-analytics-workspaces-and-application-insights-resources) for examples.

## Query across workspaces, applications, and resources using functions

Follow the instructions in this section to query without using a function or by using a function.

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
> This method can't be used with log alerts because the access validation of the alert rule resources, including workspaces and applications, is performed at alert creation time. Adding new resources to the function after the alert creation isn't supported. If you prefer to use a function for resource scoping in log alerts, you must edit the alert rule in the portal or with an Azure Resource Manager template to update the scoped resources. Alternatively, you can include the list of resources in the log alert query.

## Query across Log Analytics workspaces using workspace() 

Use the `workspace()` expression in an Azure Monitor query to retrieve data from a specific workspace in the same resource group, another resource group, or another subscription. You can use this expression to include log data in an Application Insights query and to query data across multiple workspaces in a log query.

### Syntax

`workspace(`*Identifier*`)`

### Arguments

The `workspace` expression takes the following arguments.

### Identifier 

Identifies the workspace by using one of the formats in the following table.

| Identifier | Description | Example
|:---|:---|:---|
| ID | GUID of the workspace | workspace("00000000-0000-0000-0000-000000000000") |
| Azure Resource ID | Identifier for the Azure resource | workspace("/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/Contoso/providers/Microsoft.OperationalInsights/workspaces/contosoretail") |


> [!NOTE]
> We strongly recommend identifying a workspace by its unique ID or Azure Resource ID because they remove ambiguity and are more performant.

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

The `app` expression is used in an Azure Monitor query to retrieve data from a specific Application Insights app in the same resource group, another resource group, or another subscription. This is useful to include application data in an Azure Monitor log query and to query data across multiple applications in an Application Insights query.

> [!IMPORTANT]
> The app() expression is not used if you're using a [workspace-based Application Insights resource](../app/create-workspace-resource.md) since log data is stored in a Log Analytics workspace. Use the workspace() expression to write a query that includes application in multiple workspaces. For multiple applications in the same workspace, you don't need a cross workspace query.

### Syntax

`app(`*Identifier*`)`


### Arguments

- *Identifier*: Identifies the app using one of the formats in the table below.

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

- *Identifier*: Resource ID of a resource.

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
