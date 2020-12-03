---
title: Cross resource query Azure Data Explorer using Azure Monitor
description: Use Azure Monitor to perform cross product queries between Azure Data Explorer, Log Analytics workspaces and classic Application Insights applications in  Azure Monitor.
author: orens
ms.author: bwren
ms.reviewer: bwren
ms.subservice: logs
ms.topic: conceptual
ms.date: 12/02/2020

---
# Cross resource query Azure Data Explorer using Azure Monitor
Azure Monitor supports cross service queries between Azure Data Explorer, [Application Insights (AI)](/azure/azure-monitor/app/app-insights-overview), and [Log Analytics (LA)](/azure/azure-monitor/platform/data-platform-logs). You can then query your Azure Data Explorer cluster using Log Analytics/Application Insights tools and refer to it in a cross service query. The article shows how to make a cross service query.

The Azure Monitor cross service flow:
:::image type="content" source="media\azure-data-explorer-monitor-proxy\azure-monitor-data-explorer-flow.png" alt-text="Azure monitor and Azure Data Explorer cross service flow.":::

>[!NOTE]
>* Azure Monitor cross service query is in private preview - AllowListing is required.
>* Contact the [Service Team](mailto:ADXProxy@microsoft.com) with any questions.
## Cross query your Log Analytics or Application Insights resources and Azure Data Explorer

You can run the cross resource queries using client tools that support Kusto queries, such
as: Log Analytics web UI, Workbooks, PowerShell, REST API and more.

* Enter the identifier for an Azure Data Explorer cluster in a query within the ‘adx’
pattern followed by the database name and table.

```kusto
adx('https://help.kusto.windows.net/Samples').StormEvents
```
:::image type="content" source="media/azure-data-explorer-monitor-proxy/azure-monitor-cross-service-query-example.png" alt-text="Cross service query example.":::

> [!NOTE]
>* Database names are case sensitive.
>* Cross resource query as an alert is not supported.
## Combining Azure Data Explorer cluster tables (using union and join) with LA workspace.

```kusto
union customEvents, adx('https://help.kusto.windows.net/Samples').StormEvents
| take 10
```
```kusto
let CL1 = adx('https://help.kusto.windows.net/Samples').StormEvents;
union customEvents, CL1 | take 10
```
:::image type="content" source="media/azure-data-explorer-monitor-proxy/azure-monitor-union-cross-query.png" alt-text="Cross service query example with union.":::

>[!Tip]
>* Shorthand format is allowed- ClusterName/InitialCatalog. For example
adx('help/Samples') is translated to adx('help.kusto.windows.net/Samples')
## Join data from an Azure Data Explorer cluster in one tenant with an Azure Monitor resource in another

Cross-tenant queries between the services are not supported. You are signed in to a single tenant for running the query spanning both resources.

If the Azure Data Explorer resource is in Tenant 'A' and Log Analytics workspace is in Tenant 'B' use one of the following two methods:

*  Azure Data Explorer allows you to add roles for principals in different tenants. Add your user ID in Tenant 'B' as an authorized user on the Azure Data Explorer cluster. Validate the *['TrustedExternalTenant'](https://docs.microsoft.com/powershell/module/az.kusto/update-azkustocluster)* property on the Azure Data Explorer cluster contains Tenant 'B'. Run the cross-query fully in Tenant 'B'.
*  Use [Lighthouse](https://docs.microsoft.com/azure/lighthouse/) to project the Azure Monitor resource into Tenant 'A'.
## Connect to Azure Data Explorer clusters from different tenants

Kusto Explorer automatically signs you into the tenant to which the user account originally belongs. To access resources in other tenants with the same user account, the `tenantId` has to be explicitly specified in the connection string:
`Data Source=https://ade.applicationinsights.io/subscriptions/SubscriptionId/resourcegroups/ResourceGroupName;Initial Catalog=NetDefaultDB;AAD Federated Security=True;Authority ID=`**TenantId**

## Next steps
* [Write Queries](https://docs.microsoft.com/azure/data-explorer/write-queries)
* [Query data in Azure Monitor using Azure Data Explorer](https://docs.microsoft.com/azure/data-explorer/query-monitor-data)
* [Perform cross-resource log queries in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/log-query/cross-workspace-query)






