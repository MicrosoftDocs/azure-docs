---
title: 'Query Azure Data Explorer data in Azure Monitor'
description: 'In this article, Azure Data Explorer in Application Insights and Log Analytics data by using proxy for cross product queries'
author: orens
ms.author: bwren
ms.reviewer: bwren
ms.subservice: logs
ms.topic: conceptual
ms.date: 08/28/2020

#Customer intent: I want to query data in Azure Data Explorer using Azure Monitor by creating an Azure Monitor proxy for cross product queries with Azure Data Explorer
---

# Cross resource query Azure Data Explorer using Azure Monitor 

The Azure Monitor proxy enables you to perform cross resource queries between [Log Analytics (LA)](/azure/azure-monitor/platform/data-platform-logs), [Application Insights (AI)](/azure/azure-monitor/app/app-insights-overview) and [Azure Data Explorer (ADX)](https://docs.microsoft.com/azure/data-explorer/) in the [Azure Monitor](/azure/azure-monitor/) service. 

The Azure Monitor proxy flow: 

:::image type="content" source="media/azure-monitor-proxy/azure-monitor-proxy-flow.png" alt-text="Azure data explorer proxy flow.":::

> [!NOTE]
>*  Azure Monitor proxy is in private preview - AllowListing is required.
>*  Contact the [ADXProxy](mailto:adxproxy@microsoft.com) team with any questions.

## Cross query your Log Analytics or Application Insights resources and Azure Data Explorer

You can run the cross resource queries using client tools that support Kusto queries, such as: Log Analytics web UI, Workbooks, PowerShell, REST API and more.

* Enter the identifier for an Azure Data Explorer cluster in a query within the ‘adx’ pattern followed by the database name and table.
```kusto
    adx('https://help.kusto.windows.net/Samples').StormEvents 
```

:::image type="content" source="media/azure-monitor-proxy/azure-data-explorer-proxy-query-la.png" alt-text="Query Azure Data Explorer.":::

>[!NOTE]
>* Database names are case sensitive.
>*  Cross resource query as an alert is not supported.

### Combining ADX cluster tables (using `union` and `join`) with LA workspace.

```kusto
union customEvents, adx('https://help.kusto.windows.net/Samples').StormEvents 
| take 10
```

```kusto
let CL1 = adx('https://help.kusto.windows.net/Samples').StormEvents;
union customEvents, CL1 | take 10
```

:::image type="content" source="media\azure-monitor-proxy\azure-monitor-cross-query-proxy.png" alt-text="Cross query from the Azure Data Monitor proxy.":::

>[!TIP]
>*  Shorthand format is allowed- ClusterName/InitialCatalog. For example adx('help/Samples') is translated to adx('help.kusto.windows.net/Samples')

### Join data from an Azure Data Explorer cluster in one tenant with an Azure Monitor resource in another

Cross-tenant queries aren't supported by ADX Proxy. You are signed in to a single tenant for running the query spanning both resources.

If the Azure Data Explorer resource is in Tenant 'A' and LA workspace is in Tenant 'B' use one of the following two methods:

1. Azure Data Explorer allows you to add roles for principals in different tenants. Add your user ID in Tenant 'B' as an authorized user on the Azure Data Explorer cluster. Validate the *['TrustedExternalTenant'](https://docs.microsoft.com/powershell/module/az.kusto/update-azkustocluster)* property on the Azure Data Explorer cluster contains Tenant 'B'. Run the cross-query fully in Tenant 'B'. 

2. Use [Lighthouse](https://docs.microsoft.com/azure/lighthouse/) to project the Azure Monitor resource into Tenant 'A'.

### Connect to Azure Data Explorer clusters from different tenants

Kusto Explorer automatically signs you into the tenant to which the user account originally belongs. To access resources in other tenants with the same user account, the `tenantId` has to be explicitly specified in the connection string:
`Data Source=https://ade.applicationinsights.io/subscriptions/SubscriptionId/resourcegroups/ResourceGroupName;Initial Catalog=NetDefaultDB;AAD Federated Security=True;Authority ID=\*\*TenantId**`

## Next steps

[Write queries](https://docs.microsoft.com/azure/data-explorer/write-queries)

[Query data in Azure Monitor using Azure Data Explorer](https://docs.microsoft.com/azure/data-explorer/query-monitor-data)

[Perform cross-resource log queries in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/log-query/cross-workspace-query)