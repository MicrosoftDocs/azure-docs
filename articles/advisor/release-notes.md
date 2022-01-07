---
title: Release notes for Azure Advisor
description: A description of what's new and changed in Azure Advisor
ms.topic: reference
ms.date: 01/03/2022
---
# What's new in Azure Advisor?

Learn what's new in the service. These items may be release notes, videos, blog posts, and other types of information. Bookmark this page to stay up to date with the service.

## December 2021

### Do more for less with enhanced Azure Advisor cost recommendations for virtual machines 

[*Shutdown/Resize your virtual machines*](advisor-cost-recommendations.md#optimize-virtual-machine-spend-by-resizing-or-shutting-down-underutilized-instances) recommendation was enhanced to increase the quality, robustness and applicability.

Improvements include:  

1. Cross SKU family series resize recommendations are now available.  

1. Cross version resize recommendations are now availble. In addition to finding the best fit across SKU families, we also find the best fit across versions. In general, newer versions of SKU families are more optimized, provide more features and better performance/cost than older versions. 

3. Quality improvements. We received feedback that some of our recommendations were not actionable due to certain criteria not being considered. As part of this release, we’ve taken this feedback to heart and considered even more SKU characteristics such as accelerated networking support, premium storage support, availability in a region, inclusion in an availability set, etc. to ensure our recommendations are of the highest quality. 

Read the [How-to guide](advisor-cost-recommendations.md#optimize-virtual-machine-spend-by-resizing-or-shutting-down-underutilized-instances) to learn more.
