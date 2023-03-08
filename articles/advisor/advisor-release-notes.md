---
title: Release notes for Azure Advisor
description: A description of what's new and changed in Azure Advisor
ms.topic: reference
ms.date: 01/03/2022
---
# What's new in Azure Advisor?

Learn what's new in the service. These items may be release notes, videos, blog posts, and other types of information. Bookmark this page to stay up to date with the service.

## May 2022

### Unlimited number of subscriptions
It is easier now to get an overview of optimization opportunities available to your organization – no need to spend time and effort to apply filters and process subscription in batches.

To learn more, visit [Get started with Azure Advisor](advisor-get-started.md).

### Tag filtering

You can now get Advisor recommendations scoped to a business unit, workload, or team. Filter recommendations and calculate scores using tags you have already assigned to Azure resources, resource groups and subscriptions. Apply tag filters to:

* Identify cost saving opportunities by business units
* Compare scores for workloads to optimize critical ones first

To learn more, visit [How to filter Advisor recommendations using tags](advisor-tag-filtering.md).

## January 2022

[**Shutdown/Resize your virtual machines**](advisor-cost-recommendations.md#optimize-virtual-machine-vm-or-virtual-machine-scale-set-vmss-spend-by-resizing-or-shutting-down-underutilized-instances) recommendation was enhanced to increase the quality, robustness, and applicability.

Improvements include:  

1. Cross SKU family series resize recommendations are now available.  

1. Cross version resize recommendations are now available. In general, newer versions of SKU families are more optimized, provide more features, and have better performance/cost ratios than older versions. 

3. For better actionability, we updated recommendation criteria to include other SKU characteristics such as accelerated networking support, premium storage support, availability in a region, inclusion in an availability set, etc. 

![vm-right-sizing-recommendation](media/advisor-overview/advisor-vm-right-sizing.png)

Read the [How-to guide](advisor-cost-recommendations.md#optimize-virtual-machine-vm-or-virtual-machine-scale-set-vmss-spend-by-resizing-or-shutting-down-underutilized-instances) to learn more.
