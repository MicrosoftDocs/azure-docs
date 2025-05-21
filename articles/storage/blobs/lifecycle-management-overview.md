---
title: Azure Blob Storage lifecycle management overview
titleSuffix: Azure Blob Storage
description: Use Azure Blob Storage lifecycle management policies to create automated rules for moving data between hot, cool, cold, and archive tiers.
author: normesta

ms.author: normesta
ms.date: 05/05/2025
ms.service: azure-blob-storage
ms.topic: concept-article
ms.custom: references_regions, engagement-fy23
---

# Azure Blob Storage lifecycle management overview

Storing large volumes of data is expensive, especially when much of that data is infrequently used. These expenses can accumulate rapidly and lead to budget constraints. Azure Blob Storage lifecycle management helps you build a more cost-effective storage solution. You can optimize data storage by using a rule-based policy that automatically transitions data to appropriate access tiers or expires data at the end of its lifecycle. By creating lifecycle management policies, you can reduce storage costs while ensuring that data remains accessible and manageable according to its usage patterns. 

With the lifecycle management policy, you can: 

- Transition current versions of a blob, previous versions of a blob, or blob snapshots to a cooler storage tier if these objects haven't been accessed or modified for a period of time, to optimize for cost.
- Transition blobs back from cool to hot immediately when they're accessed. 
- Delete current versions of a blob, previous versions of a blob, or blob snapshots at the end of their lifecycles. 
- Apply rules to an entire storage account, to select containers, or to a subset of blobs using name prefixes or blob index tags as filters. 

> [!TIP]
> While lifecycle management helps you optimize your costs for a single account, you can use [Azure Storage Actions](../../storage-actions/overview.md) to accomplish multiple data operations at scale across multiple accounts.

## Lifecycle management policy features 

A lifecycle management policy is a collection of rules in a JSON document. To learn more, see [Azure Blob Storage lifecycle management policy structure](lifecycle-management-policy-structure.md). 

Lifecycle management policies are supported for block blobs and append blobs in general-purpose v2, premium block blob, and Blob Storage accounts. Lifecycle management doesn't affect system containers such as the $logs or $web containers. 

A *rule* is a definition of the conditions, the associated operations and filters that are to be implemented. Conditions can be based on the following set of blob properties:

- Creation Time

- Last Modified Time

- Last Accessed Time (only if [access time tracking](lifecycle-management-policy-structure.md#access-time-tracking) is enabled).  

A rule defines one or more *actions*. You must define at least one action per rule. Actions are applied to the filtered blobs that meet the associated conditions. 

A filter limits actions to a subset of blobs within the storage account. If more than one filter is defined, a logical AND runs on all filters. You can use a filter to specify which blobs to include. A filter can't specify which blobs to exclude. 

You can sign-up to receive Event Grid notifications upon the completion of a policy run. You can sign-up to receive Event Grid notifications upon the completion of a policy run, You can also use Storage logs to monitor your policy runs. 

## Policy execution

When you add or edit the rules of a lifecycle policy, it can take up to 24 hours for changes to go into effect and for the first execution to start. 

An active policy processes objects periodically, and is interrupted if changes are made to the policy. If you disable a policy, then no new policy runs will be scheduled, but if a run is already in progress, that run will stop in under 24 hours. If you disable or delete all of the rules in a policy, then the policy becomes inactive, and no new runs will be scheduled. 

The time required for a run to complete depends on the number of blobs evaluated and operated on. The latency with which a blob is evaluated and operated on may be longer if the request rate for the storage account approaches the storage account limit. All requests made to storage account, including requests made by policy runs, accrue to the same limit on requests per second, and as that limit approaches, priority is given to requests made by workloads.  To request an increase in account limits, contact [Azure Support](https://azure.microsoft.com/support/faq/).

To view default scale limits, see the following articles:

- [Scalability and performance targets for Blob storage](scalability-targets.md)
- [Scalability and performance targets for standard storage accounts](../common/scalability-targets-standard-account.md) 
- [Scalability targets for premium block blob storage accounts](scalability-targets-premium-block-blobs.md)

Learn more about [Lifecycle Management Performance Characteristics](lifecycle-management-performance-characteristics.md).

You can monitor the outcome of a policy execution by subscribing to the **LifecyclePolicyCompleted** event and diagnose errors by using metrics and logs. See [Lifecycle management policy monitoring](lifecycle-management-policy-monitor.md).

## Pricing and billing

Lifecycle management policies are free of charge. Customers are billed for standard operation costs for the [Set Blob Tier](/rest/api/storageservices/set-blob-tier) API calls. Delete operations are free. However, other Azure services and utilities such as [Microsoft Defender for Storage](/azure/defender-for-cloud/defender-for-storage-introduction) may charge for operations that are managed through a lifecycle policy.

Each update to a blob's last access time is billed under the [other operations](https://azure.microsoft.com/pricing/details/storage/blobs/) category. Each last access time update is charged as an "other transaction" at most once every 24 hours per object even if it's accessed 1000s of times in a day. This is separate from read transactions charges.

For more information about pricing, see [Block Blob pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

## Frequently asked questions (FAQ)

See [Lifecycle management FAQ](storage-blob-faq.yml#lifecycle-management-policies).

## Next steps

- [Azure Blob Storage lifecycle management policy structure](lifecycle-management-policy-structure.md)
- [Configure a lifecycle management policy](lifecycle-management-policy-configure.md)
- [Access tiers for blob data](access-tiers-overview.md)
- [Lifecycle management policies that transition blobs between tiers](lifecycle-management-policy-access-tiers.md)
- [Lifecycle management policies that deletes blobs](lifecycle-management-policy-delete.md)
- [Lifecycle management policy monitoring](lifecycle-management-policy-monitor.md)
- [Manage and find data on Azure Blob Storage with blob index](storage-manage-find-blobs.md)
- [Best practices for using blob access tiers](access-tiers-best-practices.md)
