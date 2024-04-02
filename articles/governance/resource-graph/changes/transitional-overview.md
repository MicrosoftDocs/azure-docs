---
title: Azure Monitor Change Analysis vs. Azure Resource Graph Change Analysis (Preview)
description: Learn the differences between Azure Monitor and Azure Resource Graph Change Analysis.
author: iancarter-msft
ms.author: iancarter
ms.date: 03/19/2024
ms.topic: conceptual
---

# Azure Monitor Change Analysis vs. Azure Resource Graph Change Analysis (preview)

The Azure portal Change Analysis experience is in the process of moving from Azure Monitor to Azure Resource Graph. During this transition, you'll see two options for Change Analysis when you search for it in the Azure portal:

[Need: screenshot, will number each entry to correlate with below numbered links]

1. **Azure Monitor Change Analysis** 

    The [Change Analysis (GA) service presented by Azure Monitor](../../../azure-monitor/change/change-analysis.md) requires you to query a resource provider, called `Microsoft.ChangeAnalysis`, which provides a simple API that abstracts resource change data from the Azure Resource Graph. 
    
    While this service successfully helped thousands of Azure customers, the `Microsoft.ChangeAnalysis` resource provider has [limitations](../../../azure-monitor/change/change-analysis.md#limitations) that prevent it from servicing the needs and scale of all Azure customers across all public and sovereign clouds.

1. **Azure Resource Graph Change Analysis (Preview)**  

    The Change Analysis (preview) service presented by Resource Graph sets a new direction for all Change Analysis user experiences, directly querying Azure Resource Graph for all resource change data. This experience of Change Analysis provides:
    
    - An onboarding-free experience, giving all subscriptions and resources access to change history
    - Tenant-wide querying, rather than select subscriptions
    - Change history summaries aggregated into cards at the top of the new Resource Graph Change Analysis blade
    - More extensive filtering capabilities
    - The ability to export change data to Log Analytics
    - Improved accuracy and relevance of "changed by" change information 

    [Learn how to view the new Change Analysis experience in the portal.](./view-resource-changes.md)

## Architectural differences

The transition from Azure Monitor to Azure Resource Graph highlights some key architectural differences in how Change Analysis works. 

### How data is collected

The following table outlines the differences between how Azure Monitor Change Analysis and Azure Resource Graph Change Analysis collect resource change data.

| Scenario | Azure Monitor | Azure Resource Graph |
| -------- | ------------- | -------------------- |
| Change data in the `resourceChanges` table | [Change Analysis queries for data from several data sources, including Azure Resource Manager using Azure Resource Graph.](../../../azure-monitor/change/change-analysis.md#azure-resource-manager-resource-properties-changes) Azure Resource Manager notifies Azure Resource Graph via the resource provider when a resource is created, updated, or deleted. The `Microsoft.ChangeAnalysis` resource provider specifies whether a resource should be tracked in a special configuration file. | Change Analysis notifies Azure Resource Graph when a resource is created, updated, or deleted. Instead of notifying via the `Microsoft.ChangeAnalysis` resource provider, Change Analysis UX sends queries directly to Azure Resource Graph. |
| Change data in other tables | Change Analysis queries every six hours for the latest state of resources in subscriptions previously onboarded to the `Microsoft.ChangeAnalysis` resource provider. If the resource's state has changed since the previous check, then a single change is calculated. | Currently an opt-in feature. Each resource provider must update their services to push data to Azure Resource Graph when these resources types are created, updated, or deleted via the Azure Resource Manager control plane. For these resource types, you can expect [certain known limitations for changes saved in the `resourceChanges` table.](./resource-graph-changes.md#limitations) |

## Next steps

> [!div class="nextstepaction"]
> [Get resource changes](../how-to/get-resource-changes.md)