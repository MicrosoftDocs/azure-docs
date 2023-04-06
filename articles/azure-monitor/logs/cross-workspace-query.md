---
title: Query across resources with Azure Monitor  | Microsoft Docs
description: This article describes how you can query against resources from multiple workspaces and an Application Insights app in your subscription.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 04/28/2022

---

# Create a log query across multiple workspaces and apps in Azure Monitor

Azure Monitor Logs support querying across multiple Log Analytics workspaces and Application Insights apps in the same resource group, another resource group, or another subscription. This capability provides you with a systemwide view of your data.

If you manage subscriptions in other Azure Active Directory (Azure AD) tenants through [Azure Lighthouse](../../lighthouse/overview.md), you can include [Log Analytics workspaces created in those customer tenants](../../lighthouse/how-to/monitor-at-scale.md) in your queries.

There are two methods to query data that's stored in multiple workspaces and apps:

* Explicitly by specifying the workspace and app information. This technique is used in this article.
* Implicitly by using [resource-context queries](manage-access.md#access-mode). When you query in the context of a specific resource, resource group, or a subscription, the relevant data will be fetched from all workspaces that contain data for these resources. Application Insights data that's stored in apps won't be fetched.

> [!IMPORTANT]
> If you're using a [workspace-based Application Insights resource](../app/create-workspace-resource.md), telemetry is stored in a Log Analytics workspace with all other log data. Use the `workspace()` expression to write a query that includes applications in multiple workspaces. For multiple applications in the same workspace, you don't need a cross-workspace query.

## Cross-resource query limits

* The number of Application Insights resources and Log Analytics workspaces that you can include in a single query is limited to 100.
* Cross-resource queries in log alerts are only supported in the current [scheduledQueryRules API](/rest/api/monitor/scheduledqueryrule-2018-04-16/scheduled-query-rules). If you're using the legacy Log Analytics Alerts API, you'll need to [switch to the current API](/previous-versions/azure/azure-monitor/alerts/alerts-log-api-switch).
* References to a cross resource, such as another workspace, should be explicit and can't be parameterized. See [Identify workspace resources](#identify-workspace-resources) for examples.

## Query across Log Analytics workspaces and from Application Insights
To reference another workspace in your query, use the [workspace](../logs/workspace-expression.md) identifier. For an app from Application Insights, use the [app](./app-expression.md) identifier.

### Identify workspace resources
The following examples demonstrate queries across Log Analytics workspaces to return summarized counts of logs from the Update table on a workspace named `contosoretail-it`.

You can identify a workspace in one of several ways:

* **Resource name**: This human-readable name of the workspace is sometimes referred to as the *component name*.

    >[!IMPORTANT]
    >Because app and workspace names aren't unique, this identifier might be ambiguous. We recommend that the reference uses a qualified name, workspace ID, or Azure Resource ID.

    `workspace("contosoretail-it").Update | count`

* **Qualified name**: This "full name" of the workspace is composed of the subscription name, resource group, and component name in the format *subscriptionName/resourceGroup/componentName*.

    `workspace('contoso/contosoretail/contosoretail-it').Update | count`

    >[!NOTE]
    >Because Azure subscription names aren't unique, this identifier might be ambiguous.

* **Workspace ID**: A workspace ID is the unique, immutable, identifier assigned to each workspace represented as a globally unique identifier (GUID).

    `workspace("b459b4u5-912x-46d5-9cb1-p43069212nb4").Update | count`

* **Azure Resource ID**: This ID is the Azure-defined unique identity of the workspace. You use the Resource ID when the resource name is ambiguous. For workspaces, the format is */subscriptions/subscriptionId/resourcegroups/resourceGroup/providers/microsoft.OperationalInsights/workspaces/componentName*.

    For example:

    ``` 
    workspace("/subscriptions/e427519-5645-8x4e-1v67-3b84b59a1985/resourcegroups/ContosoAzureHQ/providers/Microsoft.OperationalInsights/workspaces/contosoretail-it").Update | count
    ```

### Identify an application
The following examples return a summarized count of requests made against an app named *fabrikamapp* in Application Insights.

You can identify an application in Application Insights with the `app(Identifier)` expression. The `Identifier` argument specifies the app by using one of the following names or IDs:

* **Resource name**: This human readable name of the app is sometimes referred to as the *component name*.

    `app("fabrikamapp")`

    >[!NOTE]
    >Identifying an application by name assumes uniqueness across all accessible subscriptions. If you have multiple applications with the specified name, the query fails because of the ambiguity. In this case, you must use one of the other identifiers.

* **Qualified name**: This "full name" of the app is composed of the subscription name, resource group, and component name in the format *subscriptionName/resourceGroup/componentName*.

    `app("AI-Prototype/Fabrikam/fabrikamapp").requests | count`

     >[!NOTE]
    >Because Azure subscription names aren't unique, this identifier might be ambiguous.
    >

* **ID**: This ID is the app GUID of the application.

    `app("b459b4f6-912x-46d5-9cb1-b43069212ab4").requests | count`

* **Azure Resource ID**: This ID is the Azure-defined unique identity of the app. You use the resource ID when the resource name is ambiguous. The format is */subscriptions/subscriptionId/resourcegroups/resourceGroup/providers/microsoft.OperationalInsights/components/componentName*.

    For example:

    ```
    app("/subscriptions/b459b4f6-912x-46d5-9cb1-b43069212ab4/resourcegroups/Fabrikam/providers/microsoft.insights/components/fabrikamapp").requests | count
    ```

### Perform a query across multiple resources
You can query multiple resources from any of your resource instances. These resources can be workspaces and apps combined.

Example for a query across two workspaces:

```
union Update, workspace("contosoretail-it").Update, workspace("b459b4u5-912x-46d5-9cb1-p43069212nb4").Update
| where TimeGenerated >= ago(1h)
| where UpdateState == "Needed"
| summarize dcount(Computer) by Classification
```

## Use a cross-resource query for multiple resources
When you use cross-resource queries to correlate data from multiple Log Analytics workspaces and Application Insights resources, the query can become complex and difficult to maintain. You should make use of [functions in Azure Monitor log queries](./functions.md) to separate the query logic from the scoping of the query resources. This method simplifies the query structure. The following example demonstrates how you can monitor multiple Application Insights resources and visualize the count of failed requests by application name.

Create a query like the following example that references the scope of Application Insights resources. The `withsource= SourceApp` command adds a column that designates the application name that sent the log. [Save the query as a function](./functions.md#create-a-function) with the alias `applicationsScoping`.

```Kusto
// crossResource function that scopes my Application Insights resources
union withsource= SourceApp
app('Contoso-app1').requests, 
app('Contoso-app2').requests,
app('Contoso-app3').requests,
app('Contoso-app4').requests,
app('Contoso-app5').requests
```

You can now [use this function](./functions.md#use-a-function) in a cross-resource query like the following example. The function alias `applicationsScoping` returns the union of the requests table from all the defined applications. The query then filters for failed requests and visualizes the trends by application. The `parse` operator is optional in this example. It extracts the application name from the `SourceApp` property.

```Kusto
applicationsScoping 
| where timestamp > ago(12h)
| where success == 'False'
| parse SourceApp with * '(' applicationName ')' * 
| summarize count() by applicationName, bin(timestamp, 1h) 
| render timechart
```

>[!NOTE]
> This method can't be used with log alerts because the access validation of the alert rule resources, including workspaces and applications, is performed at alert creation time. Adding new resources to the function after the alert creation isn't supported. If you prefer to use a function for resource scoping in log alerts, you must edit the alert rule in the portal or with an Azure Resource Manager template to update the scoped resources. Alternatively, you can include the list of resources in the log alert query.

![Screenshot that shows a time chart.](media/cross-workspace-query/chart.png)

## Next steps

See [Analyze log data in Azure Monitor](./log-query-overview.md) for an overview of log queries and how Azure Monitor log data is structured.
