---
title: Azure Monitor Change Analysis vs. Azure Resource Graph Change Analysis (Preview)
description: Learn the differences between Azure Monitor and Azure Resource Graph Change Analysis.
author: iancarter-msft
ms.author: iancarter
ms.date: 03/11/2024
ms.topic: conceptual
---

# Azure Monitor Change Analysis vs. Azure Resource Graph Change Analysis (Preview)

Change Analysis is in the process of moving from Azure Monitor to Azure Resource Graph. During this time, you'll see two options for Change Analysis when you search for it in the Azure portal:

[Need: screenshot, will number each entry to correlate with below numbered links]

1. [Azure Monitor Change Analysis (GA)](#azure-monitor-change-analysis)
1. [Azure Resource Graph Change Analysis (Preview)](#azure-resource-graph-change-analysis)

This guide explains the differences between the two and why Change Analysis is moving to Azure Resource Graph.

## Azure Monitor Change Analysis

The [Change Analysis (GA) service presented by Azure Monitor](../../../azure-monitor/change/change-analysis.md) requires you to query a resource provider, called `Microsoft.ChangeAnalysis`, which provides a simple API that abstracts resource change data from the Azure Resource Graph. 
    
While this service successfully helped thousands of Azure customers, the `Microsoft.ChangeAnalysis` resource provider has insurmountable [limitations](../../../azure-monitor/change/change-analysis.md#limitations) that prevent it from servicing the needs and scale of all Azure customers across all public and sovereign clouds.

## Azure Resource Graph Change Analysis 

The Change Analysis (preview) service presented by Resource Graph sets a new direction for all Change Analysis user experiences, directly querying Azure Resource Graph for all resource change data. This experience of Change Analysis provides:
    
- An onboarding-free experience, giving all subscriptions and resources access to change history
- Tenant-wide querying, rather than select subscriptions
- Change history summaries aggregated into cards at the top of the new Resource Graph Change Analysis blade
- More extensive filtering capabilities
- The ability to export change data to Log Analytics
- Improved accuracy and relevance of "changed by" change information 

## Architectural differences

### Proxy vs. tracked resource change data

The following table outlines the differences between how Azure Monitor Change Analysis and Azure Resource Graph Change Analysis collect proxy and tracked resource change data.

| Scenario | Azure Monitor | Azure Resource Graph |
| -------- | ------------- | -------------------- |
| Tracked resource | [Change Analysis queries for data from several data sources, including Azure Resource Manager using Azure Resource Graph.](../../../azure-monitor/change/change-analysis.md#azure-resource-manager-resource-properties-changes) Azure Resource Manager notifies Azure Resource Graph via the resource provider when a tracked resource is created, updated, or deleted. The `Microsoft.ChangeAnalysis` resource provider specifies whether a resource should be tracked in a special configuration file. 
| Change Analysis notifies Azure Resource Graph when a tracked resource is created, updated, or deleted. Instead of notifying via the `Microsoft.ChangeAnalysis` resource provider, Change Analysis UX sends queries directly to Azure Resource Graph. |
| Proxy resources | Change Analysis queries every six hours for the latest state of resources in subscriptions previously onboarded to the `Microsoft.ChangeAnalysis` resource provider. If the resource's state has changed since the previous check, then a single change is calculated. | Currently an opt-in feature. Resource providers must send a special notification to Azure Resource Graph to indicate when a proxy resource is created, updated, or deleted. |


## Next steps

> [!div class="nextstepaction"]
> [Get resource changes](../how-to/get-resource-changes.md)