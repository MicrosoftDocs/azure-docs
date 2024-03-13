---
title: Why is Change Analysis moving to Resource Graph? (Preview)
description: Learn the differences between Azure Monitor and Azure Resource Graph Change Analysis.
author: iancarter-msft
ms.author: iancarter
ms.date: 03/11/2024
ms.topic: conceptual
---

# Why is Change Analysis moving to Resource Graph? (Preview)


## Azure Monitor Change Analysis vs. Azure Resource Graph Change Analysis

Currently in the Azure portal, when you search for Change Analysis, you see two entries. 

[Need: screenshot, will number each entry to correlate with below numbered links]

1. [Azure Monitor Change Analysis (GA)](#azure-monitor-change-analysis)
1. [Azure Resource Graph Change Analysis (Preview)](#azure-resource-graph-change-analysis)

## Azure Monitor Change Analysis

The [Change Analysis (GA) service presented by Azure Monitor](../../../azure-monitor/change/change-analysis.md) requires you to query a resource provider, called `Microsoft.ChangeAnalysis`, which provides a simple API that abstracts resource change data from the Azure Resource Graph. 
    
While this service successfully helped thousands of Azure customers, the `Microsoft.ChangeAnalysis` resource provider has insurmountable limitations that prevent it from servicing the needs and scale of all Azure customers across all public and sovereign clouds.

## Azure Resource Graph Change Analysis 

The Change Analysis (preview) service presented by Resource Graph sets a new direction for all Change Analysis user experiences, directly querying Azure Resource Graph for all resource change data. This experience of Change Analysis provides:
    
- An onboarding-free experience, giving all subscriptions and resources access to change history
- Tenant-wide querying, rather than select subscriptions
- Change history summaries aggregated into cards at the top of the new Resource Graph Change Analysis blade
- More extensive filtering capabilities
- The ability to export change data to Log Analytics
- Improved accuracy and relevance of "changed by" change information 

## Next steps

> [!div class="nextstepaction"]
> [Get resource changes](../how-to/get-resource-changes.md)