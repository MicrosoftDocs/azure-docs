---
title: Query across resources with Azure Monitor  | Microsoft Docs
description: This article describes how you can query against resources from multiple workspaces and an Application Insights app in your subscription.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 05/30/2023

---

# Create a log query across multiple workspaces and apps in Azure Monitor

Azure Monitor Logs support querying across multiple Log Analytics workspaces and Application Insights apps in the same resource group, another resource group, or another subscription. This capability provides you with a systemwide view of your data.

If you manage subscriptions in other Azure Active Directory (Azure AD) tenants through [Azure Lighthouse](../../lighthouse/overview.md), you can include [Log Analytics workspaces created in those customer tenants](../../lighthouse/how-to/monitor-at-scale.md) in your queries.

There are two methods to query data that's stored in multiple workspaces and apps:

* Explicitly by specifying the workspace and app information. This technique is used in this article.
* Implicitly by using [resource-context queries](manage-access.md#access-mode). When you query in the context of a specific resource, resource group, or a subscription, the relevant data will be fetched from all workspaces that contain data for these resources. Application Insights data that's stored in apps won't be fetched.

> [!IMPORTANT]
> If you're using a [workspace-based Application Insights resource](../app/create-workspace-resource.md), telemetry is stored in a Log Analytics workspace with all other log data. Use the `workspace()` expression to write a query that includes applications in multiple workspaces. For multiple applications in the same workspace, you don't need a cross-workspace query.

## Permissions required

- You must have `Microsoft.OperationalInsights/workspaces/query/*/read` permissions to the Log Analytics workspaces you query, as provided by the [Log Analytics Reader built-in role](./manage-access.md#log-analytics-reader), for example.
- To save a query, you must have `microsoft.operationalinsights/querypacks/queries/action` permisisons to the query pack where you want to save the query, as provided by the [Log Analytics Contributor built-in role](./manage-access.md#log-analytics-contributor), for example.

## Cross-resource query limits

* The number of Application Insights components and Log Analytics workspaces that you can include in a single query is limited to 100.
* Cross-resource queries in log alerts are only supported in the current [scheduledQueryRules API](/rest/api/monitor/scheduledqueryrule-2018-04-16/scheduled-query-rules). If you're using the legacy Log Analytics Alerts API, you'll need to [switch to the current API](../alerts/alerts-log-api-switch.md).
* References to a cross resource, such as another workspace, should be explicit and can't be parameterized. See [Gather identifiers for Log Analytics workspaces](?tabs=workspace-identifier#gather-identifiers-for-log-analytics-workspaces-and-application-insights-resources) for examples.

## Gather identifiers for Log Analytics workspaces and Application Insights resources

To reference another workspace in your query, use the [workspace](../logs/workspace-expression.md) identifier. For an app from Application Insights, use the [app](./app-expression.md) identifier.

### [Workspace identifier](#tab/workspace-identifier)

You can identify a workspace using one of these IDs:

* **Workspace ID**: A workspace ID is the unique, immutable, identifier assigned to each workspace represented as a globally unique identifier (GUID).

    `workspace("00000000-0000-0000-0000-000000000000").Update | count`

* **Azure Resource ID**: This ID is the Azure-defined unique identity of the workspace. For workspaces, the format is */subscriptions/subscriptionId/resourcegroups/resourceGroup/providers/microsoft.OperationalInsights/workspaces/workspaceName*.

    For example:

    ``` 
    workspace("/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/ContosoAzureHQ/providers/Microsoft.OperationalInsights/workspaces/contosoretail-it").Update | count
    ```

### [App identifier](#tab/app-identifier)
The following examples return a summarized count of requests made against an app named *fabrikamapp* in Application Insights.

You can identify an app using one of these IDs:

* **ID**: This ID is the app GUID of the application.

    `app("00000000-0000-0000-0000-000000000000").requests | count`

* **Azure Resource ID**: This ID is the Azure-defined unique identity of the app. The format is */subscriptions/subscriptionId/resourcegroups/resourceGroup/providers/microsoft.OperationalInsights/components/componentName*.

    For example:

    ```
    app("/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/Fabrikam/providers/microsoft.insights/components/fabrikamapp").requests | count
    ```

---

## Query across Log Analytics workspaces and from Application Insights

Follow the instructions in this section to query without using a function or by using a function.

### Query without using a function
You can query multiple resources from any of your resource instances. These resources can be workspaces and apps combined.

Example for a query across three workspaces:

```
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

## Next steps

See [Analyze log data in Azure Monitor](./log-query-overview.md) for an overview of log queries and how Azure Monitor log data is structured.
