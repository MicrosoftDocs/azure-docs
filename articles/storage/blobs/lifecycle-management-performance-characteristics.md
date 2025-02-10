---
title: Lifecycle Management Performance Characteristics
titleSuffix: Azure Blob Storage
author: vigneshgo
ms.date: 02/07/2025
description: Best Practices and Guidance on configuring Azure Blob Storage lifecycle management policies and factors influencing its performance
ms.author: normesta
ms.service: azure-blob-storage
ms.topic: reference
ms.custom: references_regions, engagement-fy23
---

# Lifecycle Management Performance Characteristics

Azure Blob Storage Lifecycle Management (LCM) helps you automate the transition of objects to lower-cost access tiers, or to delete objects at the end of their lifecycle to reduce storage costs. If a policy is active, Lifecycle Management periodically processes the objects in a storage account that match the filter set  and rules specified in the lifecycle policy. The time required for a policy to complete processing a storage account depends on many factors. Factors like the number of objects to be evaluated and operated on, customer workloads on the account, availability of storage resources and more. In some cases, it can take multiple days to complete processing all the objects in the storage account. And a new LCM run begins only after the ongoing run completes. LCM is constantly optimizing for speed of execution while keeping these factors in mind.

## Factors Influencing Lifecycle Management Performance
There are many factors that influence the execution time that Lifecycle Management would take to process the objects in a single storage account. 

Lifecycle Management processes the subset of objects in the storage account that users scope by creating filter sets (prefix or file path) using lifecycle policies. If there's no specific scope or it's too broad, Lifecycle Management may need to process a large number of objects. This could increase the time required for the policy to complete. If a significant percentage of objects meet the policy conditions, it could also increase the processing time. This increase in processing time is especially true the first time the LCM policy is enabled on the storage account.   

All requests made to storage account, including requests made by Lifecycle policy runs, accrue to the same limit on requests per second. As that request limit is approached, priority is given to requests made by customer workloads. The latency of processing objects also increases if the scalability and performance limits of the storage account are reached. This latency in LCM should be considered when deciding operations that need to be performed within specific time frames. Learn more about [Scalability and performance targets for standard storage accounts](../common/scalability-targets-standard-account.md).

By prioritizing customer workloads, Lifecycle Management ensures that these workloads run with minimal to no interruptions. However, it can impact the rate of objects processed by Lifecycle Management. In such cases, it is possible that the rate of object creation and modification is higher than the rate at which Lifecycle Management can process the storage account.  

Policy conditions are assessed on each object only once during a policy run. In some cases, an object might meet the condition after it was already assessed by a run. Such objects are processed in subsequent runs.

Any of these conditions could cause Lifecycle Management to take multiple days to complete processing objects in a storage account. This performance characteristic of LCM could result in objects taking longer to process and lead to an increase in the storage capacity. 

## Best Practices to Improve Lifecycle Management Performance

### Narrow the Scope of the Lifecycle Policy
In cases where Lifecycle Management is taking a long time to complete a run, it's advisable to apply filter sets to narrow the scope of the search and evaluation. This can be done by adding Prefixes and/or Blob Index tags while authoring the lifecycle rules. A narrowed scope enables Lifecycle Management to optimize the operations.
  > [!TIP] 
> Use [Azure Storage Copilot](/azure/copilot/improve-storage-accounts#reduce-storage-costs) to help configure a Lifecycle Management policy.

### Optimize for Storage and Transactions costs

It may be more cost effective for the small objects to stay in their current tier, than paying transaction costs to move them to cheaper storage tiers. Avoid moving small files to lower tiers, unless required. [Learn more](access-tiers-best-practices.md) about choosing the right storage tier.
  > [!TIP] 
> [Azure Storage Actions](../../storage-actions/overview.md) supports size-based object targeting, and tiering/deleting operations.

### Set appropriate Time-based Rules
Avoid policy conditions using a short duration between object Creation/Modification/Last Access time and the intended operation by the policy. Lifecycle Management can take up to 24 hours to begin processing once the prior run is completed. Policy changes and updates can also take up to 24 hours to go into effect. This includes deleting all the rules to make a policy inactive. Policies that take multiple days to complete may not operate on objects evaluated earlier in the run but meet the conditions over the run period.

### Be Aware of Scalability and Performance limits
The request rate and bandwidth of your storage account depend on object size, access patterns, and workload type. Lifecycle Management may experience a slower rate of processing objects during high traffic workloads. If you consistently notice the storage account reaching the account limits and a slowdown in Lifecycle management processing, request an increase in account limits. Lifecycle management performance may improve based on the resource allocation by workload prioritization. To request an increase contact [Azure Support](https://azure.microsoft.com/support/faq/) .

### Set up Troubleshooting and Monitoring
Periodically evaluating the performance of your Lifecycle Management Policy is recommended. Set up [Event Grid Notifications](../../event-grid/blob-event-quickstart-portal.md) to get notified on when a Lifecycle Management run completed. Use Storage Logs in [Azure Monitor](monitor-blob-storage.md) to dive into run details.

## Next Steps
- [Blob Storage FAQ](storage-blob-faq.yml)
- [Configure a lifecycle management policy](lifecycle-management-policy-configure.md)
- [Plan and manage Costs for Blob Storage](../../common/storage-plan-manage-costs.md)
