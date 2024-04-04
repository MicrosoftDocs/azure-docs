---
title: Azure Monitor Change Analysis vs. Azure Resource Graph Change Analysis (preview)
description: Learn the differences between the Azure portal experiences for Azure Monitor and Azure Resource Graph Change Analysis.
author: iancarter-msft
ms.author: iancarter
ms.date: 03/19/2024
ms.topic: conceptual
---

# Azure Monitor Change Analysis vs. Azure Resource Graph Change Analysis (preview)

The Azure portal Change Analysis experience is in the process of moving from Azure Monitor to Azure Resource Graph. During this transition, you see two options for Change Analysis when you search for it in the Azure portal:

1. Azure Resource Graph Change Analysis
1. Azure Monitor Change Analysis

   :::image type="content" source="./media/transitional-overview/change-analysis-portal-search.png" alt-text="Screenshot of the search results for Change Analysis in the Azure portal.":::

## The new Change Analysis portal

The Azure Resource Graph Change Analysis portal experience provides:
    
- An onboarding-free experience, giving all subscriptions and resources access to change history
- Tenant-wide querying, rather than select subscriptions
- Change history summaries aggregated into cards at the top of the new Resource Graph Change Analysis blade
- More extensive filtering capabilities
- [Improved accuracy and relevance of "changed by" change information](https://techcommunity.microsoft.com/t5/azure-governance-and-management/announcing-the-public-preview-of-change-actor/ba-p/4076626)

[Learn how to view the new Change Analysis experience in the portal.](./view-resource-changes.md)

## Main differences

The transition from Azure Monitor to Azure Resource Graph highlights some differences in how Change Analysis works. 

| Scenario | Azure Monitor | Azure Resource Graph |
| -------- | ------------- | -------------------- |
| How data is collected | The [Change Analysis service presented by Azure Monitor](../../../azure-monitor/change/change-analysis.md) requires you to query a resource provider, called `Microsoft.ChangeAnalysis`, which provides a simple API that abstracts resource change data from the Azure Resource Graph. <br>While this service successfully helped thousands of Azure customers, the `Microsoft.ChangeAnalysis` resource provider has insurmountable [limitations](../../../azure-monitor/change/change-analysis.md#limitations) that prevent it from servicing the needs and scale of all Azure customers across all public and sovereign clouds. | Azure Resource Graph sets a new direction for all Change Analysis user experiences, ingesting `Microsoft.ResourceGraph/resources` data into Resource Graph for real-time queryability and powering the portal experience. Change Analysis supports both the push and pull model (reconciliation). |
| Data importance levels | You can filter resource changes by importance level, like "Important", "Normal", and "Noisy". | Currently, Resource Graph doesn't provide this filter.  |
| `Microsoft.Web/sites`-specific data | Azure Monitor Change Analysis collected data for configuration changes, app settings changes, environment variables changes, and file changes. | Currently, Azure Resource Graph Change Analysis collects changes to Azure resources that host your applications, managed identities, platform OS upgrades, and hostnames. Azure Resource Graph doesn't observe changes made to a resource's data plane API, such as writing data to a table in a storage account.  |
| Actor model | The Actor model isn't supported in the Azure Monitor Change Analysis. | Change Analysis identifies who initiated a change in your resource, with which client, and for changes across all of your tenants and subscriptions. [Learn more about the Change Analysis Actor model functionality.](https://techcommunity.microsoft.com/t5/azure-governance-and-management/announcing-the-public-preview-of-change-actor/ba-p/4076626) |


## Next steps

> [!div class="nextstepaction"]
> [Get resource changes](../how-to/get-resource-changes.md)