---
title: 'Query Azure Monitor data in Azure Data Explorer'
description: 'In this article, Application Insights and Log Analytics data in Azure Data Explorer by using proxy for cross product queries'
author: orens
ms.author: bwren
ms.reviewer: bwren
ms.subservice: logs
ms.topic: conceptual
ms.date: 08/28/2020

#Customer intent: I want to query data in Azure Monitor using Azure Data Explorer by creating an Azure Data Explorer proxy for cross product queries with Log Analytics and Application Insights 
---

# Query data in Azure Monitor using Azure Data Explorer (Preview)

The Azure Data Explorer proxy cluster (ADX Proxy) is an entity that enables you to perform cross product queries between Azure Data Explorer, [Application Insights (AI)](/azure/azure-monitor/app/app-insights-overview), and [Log Analytics (LA)](/azure/azure-monitor/platform/data-platform-logs) in the [Azure Monitor](/azure/azure-monitor/) service. You can map Azure Monitor Log Analytics workspaces or Application Insights apps as proxy clusters. You can then query the proxy cluster using Azure Data Explorer tools and refer to it in a cross cluster query. The article shows how to connect to a proxy cluster, add a proxy cluster to Azure Data Explorer Web UI, and run queries against your AI apps or LA workspaces from Azure Data Explorer.

The Azure Data Explorer proxy flow:

:::image type="content" source="media/azure-data-explorer-monitor-proxy/azure-data-explorer-monitor-proxy-flow.png" alt-text="Azure data explorer proxy flow.":::

## Prerequisites

> [!NOTE]
> The ADX Proxy is in preview mode. [Connect to the proxy](#connect-to-the-proxy) to enable the ADX proxy feature for your clusters. Contact the [ADXProxy](mailto:adxproxy@microsoft.com) team with any questions.

## Connect to the proxy

1. Verify your Azure Data Explorer native cluster (such as *help* cluster) appears on the left menu before you connect to your Log Analytics or Application Insights cluster.

:::image type="content" source="media/azure-data-explorer-monitor-proxy/azure-data-explorer-web-ui-help-cluster.png" alt-text="Azure Data Explorer native cluster.":::

1. In the [Azure Data Explorer UI](https://dataexplorer.azure.com/clusters), select **Add Cluster**.

1. In the **Add Cluster** window, add the URL of the Log Analytics or Application Insights cluster. 
    
    * For Log Analytics: `https://ade.loganalytics.io/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/microsoft.operationalinsights/workspaces/<workspace-name>`
    * For Application Insights: `https://ade.applicationinsights.io/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/microsoft.insights/components/<ai-app-name>`

    * Select **Add**.

:::image type="content" source="media/azure-data-explorer-monitor-proxy/azure-monitor-proxt-add-cluster.png" alt-text="Add cluster.":::
 
> [!NOTE]
> If you add a connection to more than one proxy cluster, give each a different name. Otherwise they'll all have the same name in the left pane.

1. After the connection is established, your Log Analytics or Application Insights cluster will appear in the left pane with your native Azure Data Explorer cluster. 

:::image type="content" source="media/azure-data-explorer-monitor-proxy/azure-monitor-azure-data-explorer-clusters.png" alt-text="Log Analytics and Azure Data Explorer clusters.":::
 
> [!NOTE]
> The number of Azure Monitor workspaces that can be mapped is limited to 100.

## Run queries

You can run the queries using client tools that support Kusto queries, such as: Kusto Explorer, Azure Data Explorer Web UI, Jupyter Kqlmagic, Flow, PowerQuery, PowerShell, Jarvis, Lens, and REST API.

> [!NOTE]
> The ADX Proxy feature is used for data retrieval only. For more information, see [Function supportability](#function-supportability).

> [!TIP]
> * Database name should have the same name as the resource specified in the proxy cluster. Names are case sensitive.
> * In cross cluster queries, make sure that the naming of Application Insights apps and Log Analytics workspaces is correct.
>     * If names contain special characters, they're replaced by URL encoding in the proxy cluster name. 
>     * If names include characters that don't meet [KQL identifier name rules](https://docs.microsoft.com/azure/data-explorer/kusto/query/schema-entities/entity-names), they are replaced by the dash **-** character.

### Direct query from your LA or AI ADX Proxy cluster

Run queries on your LA or AI cluster. Verify that your cluster is selected in the left pane. 
 
```kusto
Perf | take 10 // Demonstrate query through the proxy on the LA workspace
```

:::image type="content" source="media/azure-data-explorer-monitor-proxy/azure-monitor-proxy-query-la.png" alt-text="Query LA workspace.":::

### Cross query of your LA or AI ADX Proxy cluster and the ADX native cluster

When you run cross cluster queries from the proxy, verify your ADX native cluster is selected in the left pane. The following examples demonstrate combining ADX cluster tables (using `union`) with LA workspace.

```kusto
union StormEvents, cluster('https://ade.loganalytics.io/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/microsoft.operationalinsights/workspaces/<workspace-name>').database('<workspace-name>').Perf
| take 10
```

```kusto
let CL1 = 'https://ade.loganalytics.io/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/microsoft.operationalinsights/workspaces/<workspace-name>';
union <ADX table>, cluster(CL1).database(<workspace-name>).<table name>
```
Using the [`join` operator](https://docs.microsoft.com/azure/data-explorer/kusto/query/joinoperator?pivots=azuredataexplorer), instead of union, may require a [`hint`](https://docs.microsoft.com/azure/data-explorer/kusto/query/joinoperator?pivots=azuredataexplorer#join-hints) to run it on an Azure Data Explorer native cluster (and not on the proxy). 

### Join data from an ADX cluster in one tenant with an Azure Monitor resource in another

Cross-tenant queries aren't supported by ADX Proxy. You are signed in to a single tenant for running the query spanning both resources.

If the Azure Data Explorer resource is in Tenant 'A' and LA workspace is in Tenant 'B' use one of the following two methods:

1. Azure Data Explorer allows you to add roles for principals in different tenants. Add your user ID in Tenant 'B' as an authorized user on the Azure Data Explorer cluster. Validate the *['TrustedExternalTenant'](https://docs.microsoft.com/powershell/module/az.kusto/update-azkustocluster)* property on the Azure Data Explorer cluster contains Tenant 'B'. Run the cross-query fully in Tenant 'B'.

2. Use [Lighthouse](https://docs.microsoft.com/azure/lighthouse/) to project the Azure Monitor resource into Tenant 'A'.

### Connect to Azure Data Explorer clusters from different tenants

Kusto Explorer automatically signs you into the tenant to which the user account originally belongs. To access resources in other tenants with the same user account, the `tenantId` has to be explicitly specified in the connection string:
`Data Source=https://ade.applicationinsights.io/subscriptions/SubscriptionId/resourcegroups/ResourceGroupName;Initial Catalog=NetDefaultDB;AAD Federated Security=True;Authority ID=`**TenantId**

## Function supportability

The Azure Data Explorer proxy cluster supports functions for both Application Insights and Log Analytics.
This capability enables cross-cluster queries to reference an Azure Monitor tabular function directly.
The following commands are supported by the proxy:

* `.show functions`
* `.show function {FunctionName}`
* `.show database {DatabaseName} schema as json`

The following image depicts an example of querying a tabular function from the Azure Data Explorer Web UI.
To use the function, run the name in the Query window.

:::image type="content" source="media/azure-data-explorer-monitor-proxy/azure-monitor-proxt-function-query.png" alt-text="Query a tabular function from Azure Data Explorer Web UI.":::
 
> [!NOTE]
> Azure Monitor only supports tabular functions. Tabular functions don't support parameters.

## Additional syntax examples

The following syntax options are available when calling the Application Insights (AI) or Log Analytics (LA) clusters:

|Syntax Description  |Application Insights  |Log Analytics  |
|----------------|---------|---------|
| Database within a cluster that contains only the defined resource in this subscription (**recommended for cross cluster queries**) |   cluster(`https://ade.applicationinsights.io/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/microsoft.insights/components/<ai-app-name>').database('<ai-app-name>`) | cluster(`https://ade.loganalytics.io/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/microsoft.operationalinsights/workspaces/<workspace-name>').database('<workspace-name>`)     |
| Cluster that contains all apps/workspaces in this subscription    |     cluster(`https://ade.applicationinsights.io/subscriptions/<subscription-id>`)    |    cluster(`https://ade.loganalytics.io/subscriptions/<subscription-id>`)     |
|Cluster that contains all apps/workspaces in the subscription and are members of this resource group    |   cluster(`https://ade.applicationinsights.io/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>`)      |    cluster(`https://ade.loganalytics.io/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>`)      |
|Cluster that contains only the defined resource in this subscription      |    cluster(`https://ade.applicationinsights.io/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/microsoft.insights/components/<ai-app-name>`)    |  cluster(`https://ade.loganalytics.io/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/microsoft.operationalinsights/workspaces/<workspace-name>`)     |

## Next steps

[Write queries](https://docs.microsoft.com/azure/data-explorer/write-queries)