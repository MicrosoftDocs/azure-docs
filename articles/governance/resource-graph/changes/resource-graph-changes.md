---
title: Analyze changes to your Azure resources
description: Learn to use the Resource Graph Change Analysis tool to explore and analyze changes in your resources.
author: iancarter-msft
ms.author: iancarter
ms.date: 03/19/2024
ms.topic: conceptual
---

# Analyze changes to your Azure resources

Resources change through the course of daily use, reconfiguration, and even redeployment. While most change is by design, sometimes it can break your application. With the power of Azure Resource Graph, Change Analysis goes beyond standard monitoring solutions, alerting you to live site issues, outages, or component failures and explaining the causes behind them. 

Change Analysis helps you:

- Find when a resource changed due to a [control plane operation](../../../azure-resource-manager/management/control-plane-and-data-plane.md) sent to the Azure Resource Manager URL.
- View property change details.
- Query changes at scale across your subscriptions, management group, or tenant.

## Change Analysis in the portal (preview)

Change Analysis experiences across the Azure portal are powered using the Azure Resource Graph [`Microsoft.ResourceGraph/resources` API](/rest/api/azureresourcegraph/resourcegraph/resources/resources). You can query this API for changes made to many of the Azure resources you interact with, including App Services (`Microsoft.Web/sites`) or Virtual Machines (`Microsoft.Compute/virtualMachines`). 

The Azure Resource Graph Change Analysis portal experience provides:
    
- An onboarding-free experience, giving all subscriptions and resources access to change history
- Tenant-wide querying, rather than select subscriptions
- Change history summaries aggregated into cards at the top of the new Resource Graph Change Analysis blade
- More extensive filtering capabilities
- [Improved accuracy and relevance of "changed by" change information](https://techcommunity.microsoft.com/t5/azure-governance-and-management/announcing-the-public-preview-of-change-actor/ba-p/4076626)

[Learn how to view the new Change Analysis experience in the portal.](./view-resource-changes.md)

##
 

Change Analysis also provides some data using the following APIs:
- `GET/LIST Microsoft.Resources/Changes`
- `GET/LIST Microsoft.Resources/Snapshots`


## Supported resource types

Change Analysis supports changes to resource types from the following Resource Graph tables:
- [`resources`](../reference/supported-tables-resources.md#resources) 
- [`resourcecontainers`](../reference/supported-tables-resources.md#resourcecontainers) 
- [`healthresources`](../reference/supported-tables-resources.md#healthresources) 

Azure Resource Graph Change Analysis supports both the _push_ and _pull_ models. When a resource is created, updated, or deleted via the Azure Resource Manager control plane, resource providers:
- Configure the resource types from which Azure Resource Graph pulls data, if the resource provider supports `LIST` APIs for a given type (pull)
- Updates their resources to push data to Azure Resource Graph, which shows changes in real-time (push)

You can compose and join tables to project change data any way you want.

## Data retention

Changes are queryable for 14 days. For longer retention, you can [integrate your Resource Graph query with Azure Logic Apps](../tutorials/logic-app-calling-arg.md) and manually export query results to any of the Azure data stores like [Log Analytics](../../../azure-monitor/logs/log-analytics-overview.md) for your desired retention.

## Azure Monitor Change Analysis vs. Azure Resource Graph Change Analysis (preview)

The Azure portal Change Analysis experience is in the process of moving from Azure Monitor to Azure Resource Graph. During this transition, you see two options for Change Analysis when you search for it in the Azure portal:

1. Azure Resource Graph Change Analysis
1. Azure Monitor Change Analysis

   :::image type="content" source="./media/transitional-overview/change-analysis-portal-search.png" alt-text="Screenshot of the search results for Change Analysis in the Azure portal.":::

The transition from Azure Monitor to Azure Resource Graph highlights some differences in how Change Analysis works. 

| Scenario | Azure Monitor | Azure Resource Graph |
| -------- | ------------- | -------------------- |
| How data is collected | The [Change Analysis service presented by Azure Monitor](../../../azure-monitor/change/change-analysis.md) requires you to query a resource provider, called `Microsoft.ChangeAnalysis`, which provides a simple API that abstracts resource change data from the Azure Resource Graph. <br>While this service successfully helped thousands of Azure customers, the `Microsoft.ChangeAnalysis` resource provider has insurmountable [limitations](../../../azure-monitor/change/change-analysis.md#limitations) that prevent it from servicing the needs and scale of all Azure customers across all public and sovereign clouds. | Azure Resource Graph sets a new direction for all Change Analysis user experiences, ingesting `Microsoft.ResourceGraph/resources` data into Resource Graph for real-time queryability and powering the portal experience. Change Analysis also provides some data using the `GET/LIST Microsoft.Resources/Changes` and `GET/LIST Microsoft.Resources/Snapshots` APIs. |
| Data importance levels | You can filter resource changes by importance level, like "Important", "Normal", and "Noisy". | Currently, Resource Graph doesn't provide this filter.  |
| `Microsoft.Web/sites`-specific data | Azure Monitor Change Analysis collected data for configuration changes, app settings changes, environment variables changes, and file changes. | Currently, Azure Resource Graph Change Analysis collects changes to Azure resources that host your applications, managed identities, platform OS upgrades, and hostnames. Azure Resource Graph doesn't observe changes made to a resource's data plane API, such as writing data to a table in a storage account.  |
| Actor model | The Actor model isn't supported in the Azure Monitor Change Analysis. | Change Analysis identifies who initiated a change in your resource, with which client, and for changes across all of your tenants and subscriptions. [Learn more about the Change Analysis Actor model functionality.](https://techcommunity.microsoft.com/t5/azure-governance-and-management/announcing-the-public-preview-of-change-actor/ba-p/4076626) |


## Send feedback for more data  

Visit [the Change Analysis (Preview) experience](./view-resource-changes.md) on the Azure portal and submit feedback for data you'd like to see in Change Analysis and the `Microsoft.ResourceGraph/resources` API.

## Cost

You can use Azure Resource Graph Change Analysis at no extra cost. 

## Next steps

> [!div class="nextstepaction"]
> [Get resource changes](../how-to/get-resource-changes.md)