---
title: Cross-resource query Azure Data Explorer by using Azure Monitor
description: Use Azure Monitor to perform cross-product queries between Azure Data Explorer, Log Analytics workspaces, and classic Application Insights applications in Azure Monitor.
author: guywi-ms
ms.author: guywild
ms.topic: conceptual
ms.date: 07/25/2023
ms.reviewer: osalzberg

---
# Cross-resource query Azure Data Explorer by using Azure Monitor
Azure Monitor supports cross-service queries between Azure Data Explorer, [Application Insights](../app/app-insights-overview.md), and [Log Analytics](../logs/data-platform-logs.md). You can then query your Azure Data Explorer cluster by using Log Analytics or Application Insights tools and refer to it in a cross-service query. This article shows how to make a cross-service query.

The following diagram shows the Azure Monitor cross-service flow:

:::image type="content" source="media\azure-data-explorer-monitor-proxy\azure-monitor-data-explorer-flow.png" alt-text="Diagram that shows the flow of queries between a user, Azure Monitor, a proxy, and Azure Data Explorer.":::

## Cross query your Log Analytics or Application Insights resources and Azure Data Explorer

You can run cross-resource queries by using client tools that support Kusto queries. Examples of these tools include the Log Analytics web UI, workbooks, PowerShell, and the REST API.

Enter the identifier for an Azure Data Explorer cluster in a query within the `adx` pattern, followed by the database name and table.

```kusto
adx('https://help.kusto.windows.net/Samples').StormEvents
```
:::image type="content" source="media/azure-data-explorer-monitor-proxy/azure-monitor-cross-service-query-example.png" alt-text="Screenshot that shows an example of a cross-service query.":::

> [!NOTE]
>* Database names are case sensitive.
>* Cross-resource query as an alert isn't supported.
>* Identifying the Timestamp column in the cluster isn't supported. The Log Analytics Query API won't pass along the time filter.
> * The cross-service query ability is used for data retrieval only. For more information, see [Function supportability](#function-supportability).
> * Private Link is not supported with this feature.

## Function supportability

The Azure Monitor cross-service queries support functions for Application Insights, Log Analytics, and Azure Data Explorer.
This capability enables cross-cluster queries to reference an Azure Monitor or Azure Data Explorer tabular function directly.
The following commands are supported with the cross-service query:

* `.show functions`
* `.show function {FunctionName}`
* `.show database {DatabaseName} schema as json`

## Combine Azure Data Explorer cluster tables with a Log Analytics workspace

Use the `union` command to combine cluster tables with a Log Analytics workspace.

```kusto
union customEvents, adx('https://help.kusto.windows.net/Samples').StormEvents
| take 10
```
```kusto
let CL1 = adx('https://help.kusto.windows.net/Samples').StormEvents;
union customEvents, CL1 | take 10
```
:::image type="content" source="media/azure-data-explorer-monitor-proxy/azure-monitor-union-cross-query.png" alt-text="Screenshot that shows a cross-service query example with the union command.":::

> [!TIP]
> Shorthand format is allowed: *ClusterName*/*InitialCatalog*. For example, `adx('help/Samples')` is translated to `adx('help.kusto.windows.net/Samples')`.

When you use the [`join` operator](/azure/data-explorer/kusto/query/joinoperator) instead of union, you're required to use a [`hint`](/azure/data-explorer/kusto/query/joinoperator#join-hints) to combine the data in the Azure Data Explorer cluster with the Log Analytics workspace. Use `Hint.remote={Direction of the Log Analytics Workspace}`. For example:

```kusto
AzureDiagnostics
| join hint.remote=left adx("cluster=ClusterURI").AzureDiagnostics on (ColumnName)
```

## Join data from an Azure Data Explorer cluster in one tenant with an Azure Monitor resource in another

Cross-tenant queries between the services aren't supported. You're signed in to a single tenant for running the query that spans both resources.

If the Azure Data Explorer resource is in Tenant A and the Log Analytics workspace is in Tenant B, use one of the following methods:

* Use Azure Data Explorer to add roles for principals in different tenants. Add your user ID in Tenant B as an authorized user on the Azure Data Explorer cluster. Validate that the [TrustedExternalTenant](/powershell/module/az.kusto/update-azkustocluster) property on the Azure Data Explorer cluster contains Tenant B. Run the cross query fully in Tenant B.
* Use [Lighthouse](../../lighthouse/index.yml) to project the Azure Monitor resource into Tenant A.

## Connect to Azure Data Explorer clusters from different tenants

Kusto Explorer automatically signs you in to the tenant to which the user account originally belongs. To access resources in other tenants with the same user account, you must explicitly specify `TenantId` in the connection string:

`Data Source=https://ade.applicationinsights.io/subscriptions/SubscriptionId/resourcegroups/ResourceGroupName;Initial Catalog=NetDefaultDB;AAD Federated Security=True;Authority ID=TenantId`

## Next steps
* [Write queries](/azure/data-explorer/write-queries)
* [Query data in Azure Monitor by using Azure Data Explorer](/azure/data-explorer/query-monitor-data)
* [Perform cross-resource log queries in Azure Monitor](../logs/cross-workspace-query.md)
