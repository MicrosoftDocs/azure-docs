---
title: Lifecycle Management Best Practices
titleSuffix: Azure Blob Storage
author: vigneshgo
ms.date: 02/07/2025
description: Best Practices and Guidance on configuring Azure Blob Storage lifecycle management policies and factors influencing its performance
ms.author: normesta
ms.service: azure-blob-storage
ms.topic: reference
ms.custom: references_regions, engagement-fy23
---

# Lifecycle Management Best Practices

Azure Blob Storage Lifecycle Management (LCM) helps you automate the transition of objects to lower-cost access tiers, or to delete objects at the end of their lifecycle to reduce storage costs. If a policy is active, Lifecycle Management will periodically processes the objects in a storage account that match the filter set  and rules specified in the lifecycle policy. The time required for a policy to complete processing all the objects in a storage account depends on many factors such as the number of objects to be evaluated and operated on, customer workloads on the account, availability of storage resources and more. In some cases, it can take multiple days to complete processing all the objects in the storage account, and a new LCM run does not begin until the ongoing run completes. LCM is constantly optimizing for speed of execution while keeping these factors in mind.

## Factors Influencing Lifecycle Management Performance
There are many factors that influence the execution time that Lifecycle Management would take to process the objects in a single storage account. 

Lifecycle policies enable users to create filter sets (prefix or file path) if they want to scope which subset of objects in the storage account should be processed by Lifecycle Management. If no scope is used or broad scopes are defined, then a large number of objects might need to be processed by Lifecycle Management and this might increase the time needed for the policy to complete.  Additionally, if a significant percentage of objects meet the policy conditions, especially the first time LCM is enabled on a storage account or broadly scoped policies with substantial number of objects, could also increase the processing time.  

All requests made to storage account, including requests made by Lifecycle policy runs, accrue to the same limit on requests per second, and as that limit approaches, priority is given to requests made by workloads. The latency of processing objects also increases if the scalability and performance limits of the storage account are reached. This is particularly relevant for operations that need to be performed within specific time frames.  Learn more about [Scalability and performance targets for standard storage accounts](https://learn.microsoft.com/en-us/azure/storage/common/scalability-targets-standard-account).

Lifecycle Management also prioritizes customer workloads that utilize or impact the storage account. This allows for customer workloads to run with limited to no interruptions however, it can impact the rate of objects processed by Lifecycle Management. In such cases it is possible that the rate of object creation and modification is higher than the rate at which Lifecycle Management can process the storage account.  

Policy conditions are assessed on each object only once during a policy run. In some cases, an object might meet the condition after it was already assessed by a run.  Such objects will be processed in subsequent runs. This means that if an object meets the policy condition after it was already processed during a run, it will be again processed and operated on during the subsequent run.

Any of the above conditions could lead Lifecycle Management to take multiple days to complete the processing of objects in a storage account. This could result in a growth in the storage capacity and objects taking longer to process than in the time period defined in the policy. 

## Best Practices to Improve Lifecycle Management Performance

### Narrow the Scope of the Lifecycle Policy
In cases where Lifecycle Management is taking a long time to complete a run, it is advisable to apply filter sets to narrow the scope of the search and evaluation thereby enabling Lifecycle Management to optimize the operations. This can be done by adding Prefixes and/or Blob Index tags while authoring the lifecycle rules. 
  > [!TIP] 
> Use [Azure Storage Copilot](https://learn.microsoft.com/en-us/azure/copilot/improve-storage-accounts#reduce-storage-costs) to help configure an Lifecycle Management  policy.

### Optimize for Storage and Transactions costs

It may be more cost effective for the small objects to stay in their current tier, than paying transaction costs to move them to cheaper storage tiers. Avoid moving small files to lower tiers, unless required. [Learn more](https://learn.microsoft.com/en-us/azure/storage/blobs/access-tiers-best-practices#pack-small-files-before-moving-data-to-cooler-tiers) about choosing the right storage tier.
  > [!TIP] 
> [Azure Storage Actions](https://learn.microsoft.com/en-us/azure/storage-actions/overview) supports size-based object targeting, and tiering/deleting operations.

### Set appropriate Time-based Rules
Avoid policy conditions using a short duration between object Creation/Modification/Last Access time and the intended operation by the policy. Lifecycle Management can take up to 24 hours to begin processing once the prior run is completed. Policy changes and updates can also take up to 24 hours to go into effect. This includes deleting all the rules to make a policy inactive. Policies that take multiple days to complete may not operate on objects evaluated earlier in the run but meet the conditions over the run period.

### Be Aware of Scalability and Performance limits
The request rate and bandwidth of your storage account depend on object size, access patterns, and workload type. Lifecycle Management may experience a slower rate of processing objects during high traffic workloads. If you consistently notice the storage account reaching the account limits and a slowdown in Lifecycle management processing, request an increase in account limits. Lifecycle management performance may improve based on the resource allocation by workload prioritization. Contact [Azure Support](https://azure.microsoft.com/support/faq/) to request an increase.

### Setup Troubleshooting and Monitoring
Periodically evaluating the performance of your Lifecycle Management Policy is recommended. Setup [Event Grid Notifications](https://learn.microsoft.com/en-us/azure/event-grid/blob-event-quickstart-portal) to get notified on when an Lifecycle Management run completed. Use Storage Logs in [Azure Monitor](https://learn.microsoft.com/en-us/azure/storage/blobs/monitor-blob-storage?tabs=azure-portal) to dive into run details.

## Next Steps
- [Blob Storage FAQ](articles/storage/blobs/storage-blob-faq.yml)
- [Configure a lifecycle management policy](lifecycle-management-policy-configure.md)
- [Plan and manage Costs for Blob Storage](https://learn.microsoft.com/en-us/azure/storage/common/storage-plan-manage-costs?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&bc=%2Fazure%2Fstorage%2Fblobs%2Fbreadcrumb%2Ftoc.json)
