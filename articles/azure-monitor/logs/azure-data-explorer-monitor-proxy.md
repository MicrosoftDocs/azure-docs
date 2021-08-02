---
title: Query data in Azure Monitor using Azure Data Explorer (preview)
description: Use Azure Data Explorer to perform cross product queries between Azure Data Explorer, Log Analytics workspaces and classic Application Insights applications in  Azure Monitor.
author: osalzberg
ms.author: bwren
ms.reviewer: bwren
ms.topic: conceptual
ms.date: 10/13/2020

---

# Query data in Azure Monitor using Azure Data Explorer (Preview)

The Azure Data Explorer supports cross service queries between Azure Data Explorer, [Application Insights (AI)](../app/app-insights-overview.md), and [Log Analytics (LA)](./data-platform-logs.md). You can then query your Log Analytics/Application Insights workspace using Azure Data Explorer tools and refer to it in a cross service query. The article shows how to make a cross service query and how to add the Log Analytics/Application Insights workspace to Azure Data Explorer Web UI.

The Azure Data Explorer cross service queries flow:
:::image type="content" source="media\azure-data-explorer-monitor-proxy\azure-data-explorer-monitor-flow.png" alt-text="Azure data explorer proxy flow.":::

> [!NOTE]
> * The ability to query Azure Monitor data from Azure Data Explorer, either directly from Azure Data Explorer client tools, or indirectly by running a query on an Azure Data Explorer cluster, is in preview mode.
>* Contact the [Cross service query](mailto:adxproxy@microsoft.com) team with any questions.

## Add a Log Analytics/Application Insights workspace to Azure Data Explorer client tools

1. Verify your Azure Data Explorer native cluster (such as *help* cluster) appears on the left menu before you connect to your Log Analytics or Application Insights cluster.

:::image type="content" source="media/azure-data-explorer-monitor-proxy/azure-data-explorer-web-ui-help-cluster.png" alt-text="Azure Data Explorer native cluster.":::

 In the Azure Data Explorer UI (https://dataexplorer.azure.com/clusters), select **Add Cluster**.

2. In the **Add Cluster** window, add the URL of the LA or AI cluster.

    * For LA: `https://ade.loganalytics.io/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/microsoft.operationalinsights/workspaces/<workspace-name>`
    * For AI: `https://ade.applicationinsights.io/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/microsoft.insights/components/<ai-app-name>`

    * Select **Add**.

:::image type="content" source="media/azure-data-explorer-monitor-proxy/azure-monitor-proxy-add-cluster.png" alt-text="Add cluster.":::
 
>[!NOTE]
>If you add a connection to more than one Log Analytics/Application insights workspace, give each a different name. Otherwise they'll all have the same name in the left pane.

 After the connection is established, your Log Analytics or Application Insights workspace will appear in the left pane with your native Azure Data Explorer cluster.

:::image type="content" source="media/azure-data-explorer-monitor-proxy/azure-monitor-azure-data-explorer-clusters.png" alt-text="Log Analytics and Azure Data Explorer clusters.":::
 
> [!NOTE]
> The number of Azure Monitor workspaces that can be mapped is limited to 100.

## Create queries using Azure Monitor data

You can run the queries using client tools that support Kusto queries, such as: Kusto Explorer, Azure Data Explorer Web UI, Jupyter Kqlmagic, Flow, PowerQuery, PowerShell, Lens, REST API.

> [!NOTE]
> The cross service query ability is used for data retrieval only. For more information, see [Function supportability](#function-supportability).

> [!TIP]
> * Database name should have the same name as the resource specified in the cross service query. Names are case sensitive.
> * In cross cluster queries, make sure that the naming of Application Insights apps and Log Analytics workspaces is correct.
> * If names contain special characters, they are replaced by URL encoding in the cross service query.
> * If names include characters that don't meet [KQL identifier name rules](/azure/data-explorer/kusto/query/schema-entities/entity-names), they are replaced by the dash **-** character.

### Direct query on your Log Analytics or Application Insights workspaces from Azure Data Explorer client tools

Run queries on your Log Analytics or Application Insights workspaces. Verify that your workspace is selected in the left pane.
 
```kusto
Perf | take 10 // Demonstrate cross service query on the Log Analytics workspace
```

:::image type="content" source="media/azure-data-explorer-monitor-proxy/azure-monitor-proxy-query-la.png" alt-text="Query Log Analytics workspace.":::

### Cross query of your Log Analytics or Application Insights and the Azure Data Explorer native cluster

When you run cross cluster service queries, verify your Azure Data Explorer native cluster is selected in the left pane. The following examples demonstrate combining Azure Data Explorer cluster tables [using union](/azure/data-explorer/kusto/query/unionoperator) with Log Analytics workspace.

```kusto
union StormEvents, cluster('https://ade.loganalytics.io/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/microsoft.operationalinsights/workspaces/<workspace-name>').database('<workspace-name>').Perf
| take 10
```

```kusto
let CL1 = 'https://ade.loganalytics.io/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/microsoft.operationalinsights/workspaces/<workspace-name>';
union <Azure Data Explorer table>, cluster(CL1).database(<workspace-name>).<table name>
```

:::image type="content" source="media\azure-data-explorer-monitor-proxy\azure-data-explorer-cross-query-proxy.png" alt-text="Cross service query from the Azure Data Explorer.":::

>[!TIP]
>* Using the [`join` operator](/azure/data-explorer/kusto/query/joinoperator), instead of union, may require a [`hint`](/azure/data-explorer/kusto/query/joinoperator#join-hints) to run it on an Azure Data Explorer native cluster.

### Join data from an Azure Data Explorer cluster in one tenant with an Azure Monitor resource in another

Cross-tenant queries between the services are not supported. You are signed in to a single tenant for running the query spanning both resources.

If the Azure Data Explorer resource is in Tenant 'A' and Log Analytics workspace is in Tenant 'B' use one of the following two methods:

1. Azure Data Explorer allows you to add roles for principals in different tenants. Add your user ID in Tenant 'B' as an authorized user on the Azure Data Explorer cluster. Validate the *['TrustedExternalTenant'](/powershell/module/az.kusto/update-azkustocluster)* property on the Azure Data Explorer cluster contains Tenant 'B'. Run the cross-query fully in Tenant 'B'.

2. Use [Lighthouse](../../lighthouse/index.yml) to project the Azure Monitor resource into Tenant 'A'.
### Connect to Azure Data Explorer clusters from different tenants

Kusto Explorer automatically signs you into the tenant to which the user account originally belongs. To access resources in other tenants with the same user account, the `tenantId` has to be explicitly specified in the connection string:
`Data Source=https://ade.applicationinsights.io/subscriptions/SubscriptionId/resourcegroups/ResourceGroupName;Initial Catalog=NetDefaultDB;AAD Federated Security=True;Authority ID=`**TenantId**

## Function supportability

The Azure Data Explorer cross service queries support functions for both Application Insights and Log Analytics.
This capability enables cross-cluster queries to reference an Azure Monitor tabular function directly.
The following commands are supported with the cross service query:

* `.show functions`
* `.show function {FunctionName}`
* `.show database {DatabaseName} schema as json`

The following image depicts an example of querying a tabular function from the Azure Data Explorer Web UI.
To use the function, run the name in the Query window.

:::image type="content" source="media/azure-data-explorer-monitor-proxy/azure-monitor-proxy-function-query.png" alt-text="Query a tabular function from Azure Data Explorer Web UI.":::

## Additional syntax examples

The following syntax options are available when calling the Log Analytics or Application Insights clusters:

|Syntax Description  |Application Insights  |Log Analytics  |
|----------------|---------|---------|
| Database within a cluster that contains only the defined resource in this subscription (**recommended for cross cluster queries**) |   cluster(`https://ade.applicationinsights.io/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/microsoft.insights/components/<ai-app-name>').database('<ai-app-name>`) | cluster(`https://ade.loganalytics.io/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/microsoft.operationalinsights/workspaces/<workspace-name>').database('<workspace-name>`)     |
| Cluster that contains all apps/workspaces in this subscription    |     cluster(`https://ade.applicationinsights.io/subscriptions/<subscription-id>`)    |    cluster(`https://ade.loganalytics.io/subscriptions/<subscription-id>`)     |
|Cluster that contains all apps/workspaces in the subscription and are members of this resource group    |   cluster(`https://ade.applicationinsights.io/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>`)      |    cluster(`https://ade.loganalytics.io/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>`)      |
|Cluster that contains only the defined resource in this subscription      |    cluster(`https://ade.applicationinsights.io/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/microsoft.insights/components/<ai-app-name>`)    |  cluster(`https://ade.loganalytics.io/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/microsoft.operationalinsights/workspaces/<workspace-name>`)     |

## Next steps

- Read more about the [data structure of Log Analytics workspaces and Application Insights](data-platform-logs.md).
- Learn to [write queries in Azure Data Explorer](/azure/data-explorer/write-queries).