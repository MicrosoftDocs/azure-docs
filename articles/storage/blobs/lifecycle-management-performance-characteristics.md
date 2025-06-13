---
title: Lifecycle management performance characteristics

titleSuffix: Azure Blob Storage
author: vigneshgo
ms.date: 06/13/2025
description: Best practices and guidance on configuring Azure Blob Storage lifecycle management policies and factors influencing its performance.

ms.author: normesta
ms.service: azure-blob-storage
ms.topic: reference
ms.custom: references_regions, engagement-fy23
---

# Lifecycle management performance characteristics


Azure Blob Storage lifecycle management helps you automate the transition of objects to lower-cost access tiers, or to delete objects at the end of their lifecycle to reduce storage costs. If a policy is active, Lifecycle Management periodically processes the objects in a storage account that match the filter set and rules specified in the lifecycle management policy. The time that is required for a policy to complete processing objects in a storage account depends on many factors such as the number of objects to be evaluated and operated on, the customer workloads on the account, the availability of storage resources and more. In some cases, it can take multiple days to finish processing all the objects in the storage account. A new lifecycle management policy run begins only after the ongoing run completes. Lifecycle management is constantly optimizing for speed of execution while keeping these factors in mind.

## Factors influencing lifecycle management performance

There are many factors that influence the execution time that lifecycle management would take to process the objects in a single storage account. 

Lifecycle management processes the subset of objects in the storage account that you scope by creating filter sets (prefix or file path) in lifecycle management policies. If you don't specify a scope or the scope is too broad, lifecycle management might have to process a large number of objects which could increase the time required for the policy to complete. Processing time can also increase if a significant percentage of objects meet the policy conditions. This increase in processing time is especially true when the policy is enabled for the first time on the storage account.   

All requests that are made to a storage account, including requests that are made by lifecycle management policy runs, accrue to the same limit on requests per second. As that request limit is approached, priority is given to requests that are made by customer workloads. The latency of processing objects also increases if the scalability and performance limits of the storage account are reached. Consider this latency when deciding operations that need to be performed within specific time frames. Learn more about [Scalability and performance targets for standard storage accounts](../common/scalability-targets-standard-account.md).

By prioritizing customer workloads, lifecycle management ensures that these workloads run with minimal to no interruptions. However, it can impact the rate of objects processed by lifecycle management. In such cases, it's possible that the rate of object creation and modification is higher than the rate at which lifecycle management can process the storage account.  

Policy conditions are assessed on each object only once during a policy run. In some cases, an object might meet the condition after it was already assessed by a run. Such objects are processed in subsequent runs.

Any of these conditions could cause lifecycle management to take multiple days to complete processing objects in a storage account. This performance characteristic of lifecycle management could result in objects taking longer to process and could lead to an increase in the storage capacity. 

## Best practices to improve lifecycle management performance


### Narrow the scope of the lifecycle management policy

In cases where lifecycle management is taking a long time to complete a run, consider applying filter sets to narrow the scope of the search and evaluation. You can do this by adding prefixes and/or blob Index tags while authoring the lifecycle management policy rules. A narrowed scope enables lifecycle management to optimize the operations.

  > [!TIP] 
> Use [Azure Storage Copilot](/azure/copilot/improve-storage-accounts#reduce-storage-costs) to help configure a lifecycle management policy.

### Optimize for storage and transactions costs

It might be more cost effective for the small objects to stay in their current tier, instead of paying transaction costs to move them to cheaper storage tiers. Avoid moving small files to lower tiers, unless you must. [Learn more](access-tiers-best-practices.md) about choosing the right storage tier.

  > [!TIP] 
> [Azure Storage Actions](../../storage-actions/overview.md) supports size-based object targeting, and tiering/deleting operations.

### Set appropriate time-based rules

Avoid policy conditions that use a short duration between object creation, modification or last access time, and the intended operation by the policy. Lifecycle management can take up to 24 hours to begin processing after the prior run is completed. Policy changes and updates can also take up to 24 hours to go into effect. Policies that take multiple days to complete might not operate on objects that were evaluated earlier in the run even though they meet the conditions over the run period.

### Be aware of scalability and performance limits

The request rate and bandwidth of your storage account depend on object size, access patterns, and workload type. Lifecycle management might experience a slower rate of processing objects during high traffic workloads. If you consistently notice the storage account reaching the account limits and a slowdown in lifecycle management processing, request an increase in account limits. Lifecycle management performance might improve based on the resource allocation and by workload prioritization. To request an increase contact [Azure Support](https://azure.microsoft.com/support/faq/) .

### Set up troubleshooting and monitoring

You should periodically evaluate the performance of your lifecycle management policy. Set up [Event Grid Notifications](../../event-grid/blob-event-quickstart-portal.md) to get notified on when a lifecycle management policy run is completed. To dive into run details, use storage resource logs in [Azure Monitor](monitor-blob-storage.md) .

## Next Steps
- [Blob Storage FAQ](storage-blob-faq.yml)
- [Configure a lifecycle management policy](lifecycle-management-policy-configure.md)
- [Plan and manage Costs for Blob Storage](../common/storage-plan-manage-costs.md)
