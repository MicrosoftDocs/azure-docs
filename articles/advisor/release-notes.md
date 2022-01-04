---
title: Release notes for Azure Advisor
description: A description of what's new and changed in Azure Advisor
ms.topic: reference
ms.date: 01/03/2022
---
# What's new in Azure Advisor?

Learn what's new in the service. These items may be release notes, videos, blog posts, and other types of information. Bookmark this page to stay up to date with the service.

## December 2021

### Azure Advisor now supports cross SKU family series resize recommendations for Virtual Machines

We would like to ensure that customers get the most out of their Azure resources for the lowest cost. This is why we generate the “Shutdown/Resize your virtual machines” recommendation which provides customers with cost savings opportunities by targeting VMs that are not utilized efficiently. 
 
As part of our mission to continually improve our recommendations, we’ve made a number of changes that increase the saving opportunity for customers as well as quality and actionability of recommendations. 
 
Some of our bigger improvements are:
1. Architectural update: We completely revamped our entire recommendation engine to be based on state of the art machine learning algorithms to increase the quality, robustness and applicability of our recommendations 
1. Cross SKU family series resize recommendations: up until this release, the resize recommendations that we had provided was mainly within the same SKU family. I.e. if you were using a D3v2 inefficiently, we would recommend a D2v2 or a D1v2, i.e. a smaller SKU but within the same family. We noticed that opportunity for much larger savings by moving across SKU family such that you use a SKU that perfectly fits your workload. For e.g. a workload might be running on a D8_v3, which is a 8 core machine with 32 GB, mainly because of the need for 32GB of memory. If we identify that this workload is mainly memory heavy and doesn’t use the CPU as much, we can recommend that the workload be moved to a E4_v3, which also has 32GBs of memory but has only 4 cores. By moving your memory intensive workload to a memory optimized SKU family such as the E series, you will avoid paying for those extra 4 cores that your workload didn’t need. 
1. Cross version resize recommendations: In addition to finding the best fit across SKU families, we also find the best fit across versions. In general, newer versions of SKU families are more optimized, provide more features and provide better performance/cost than older versions. If we find that your workload is running on an older version and can get cost benefits without impacting performance on a newer version, then we will make that recommendation for the VM. For e.g. we might generate a recommendation to resize a D3_v2 VM to a D3_v3 VM. 
1. Quality improvements: We received feedback that some of our recommendations were not actionable due to certain criteria not being considered. As part of this release we’ve taken this feedback to heart and considered even more SKU characteristics such as accelerated networking support, premium storage support, availability in a region, inclusion in an availability set, etc. to ensure our recommendations are of the highest quality. 
 
With these changes you should see increase in savings opportunities thanks to our cross series/version recommendations, with some of the recommendations removed due to the addition of new constraints. 
