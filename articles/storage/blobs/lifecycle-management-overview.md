---
title: Azure Blob Storage lifecycle management overview
titleSuffix: Azure Blob Storage
description: Use Azure Blob Storage lifecycle management policies to create automated rules for moving data between hot, cool, cold, and archive tiers.
author: normesta

ms.author: normesta
ms.date: 06/13/2025
ms.service: azure-blob-storage
ms.topic: concept-article
ms.custom: references_regions, engagement-fy23
---

# Azure Blob Storage lifecycle management overview

Azure Blob Storage empowers organizations to efficiently manage and scale their data storage needs, even as data volumes grow, and usage patterns evolve. By using blob lifecycle management, customers can proactively optimize costs by implementing rule-based policies that automatically transition data to cooler tiers or expire it when it's no longer needed. 

This seamless automation ensures that data is always stored in the most cost-effective manner which maximizes budget efficiency while maintaining easy access and robust data management. With blob lifecycle management, organizations can confidently scale their storage environments, knowing that their costs are optimized and their data is managed according to real-world usage. 
 
With the lifecycle management policy, you can: 

- Transition current versions of a blob, previous versions of a blob, or blob snapshots to a cooler storage tier if these objects aren't accessed or modified for a period of time, to optimize for cost.

- Transition blobs back from cool to hot immediately when they're accessed. 

- Delete current versions of a blob, previous versions of a blob, or blob snapshots at the end of their lifecycles. 

- Apply rules to an entire storage account, to select containers, or to a subset of blobs using name prefixes or blob index tags as filters. 

> [!TIP]
> While lifecycle management helps you optimize your costs for a single account, you can use [Azure Storage Actions](../../storage-actions/overview.md) to accomplish multiple data operations at scale across multiple accounts.

## Lifecycle management policy features 

A lifecycle management policy is a collection of rules in a JSON document. To learn more, see [Azure Blob Storage lifecycle management policy structure](lifecycle-management-policy-structure.md). 

Lifecycle management policies are supported for block blobs and append blobs in general-purpose v2, premium block blob, and Blob Storage accounts. Lifecycle management doesn't affect system containers such as the `$logs` or `$web` containers. 

A *rule* is a definition of the conditions, along with the associated actions and filters that are used to process objects. The following table describes each rule element.

| Rule element | Description |
|---|---|
| Conditions | Conditions are based on the following three blob properties: Creation Time, Last Modified Time, and Last Accessed Time (if access time tracking is enabled) |
| Actions | Actions are applied to the filtered blobs that meet the associated conditions. You must define at least one action per rule such as changing the blob tier to the cool tier or deleting blobs.  |
| Filters | Filters limit rule actions to a subset of blobs within the storage account by using path prefixes and blob tags. If more than one filter is defined, a logical AND runs on all filters. You can use a filter to specify which blobs to include. A filter provides no means to specify which blobs to exclude. |

## Policy execution

When you add or edit the rules of a lifecycle policy, it can take up to 24 hours for changes to go into effect and for the first execution to start. 

An active policy processes objects periodically, and is interrupted if changes are made to the policy. If you delete a policy, then no new policy runs are scheduled, but if a run is already in progress, that run continues until it completes and you're billed for any actions that are required to complete the run. If you disable all of the rules in a policy, then the policy becomes inactive. If a run is already in progress, that run comes to a stop within 24 hours, and no new runs are scheduled. It's recommended to disable a policy first, wait 24 hours and then delete policy.

The time required for a run to complete depends on the number of blobs evaluated and operated on. The latency with which a blob is evaluated and operated on might be longer if the request rate for the storage account approaches the storage account limit. All requests made to storage account, including requests made by policy runs, accrue to the same limit on requests per second, and as that limit approaches, priority is given to requests made by workloads. To request an increase in account limits, contact [Azure Support](https://azure.microsoft.com/support/faq/).

To view default scale limits, see the following articles:

- [Scalability and performance targets for Blob storage](scalability-targets.md)
- [Scalability and performance targets for standard storage accounts](../common/scalability-targets-standard-account.md) 
- [Scalability targets for premium block blob storage accounts](scalability-targets-premium-block-blobs.md)

Learn more about [Lifecycle Management Performance Characteristics](lifecycle-management-performance-characteristics.md).

You can monitor the outcome of a policy execution by subscribing to the **LifecyclePolicyCompleted** event and diagnose errors by using metrics and logs. See [Lifecycle management policy monitoring](lifecycle-management-policy-monitor.md).

## Billing

Lifecycle management policies are free of charge. Customers are billed for standard operation costs for the [Set Blob Tier](/rest/api/storageservices/set-blob-tier) API calls. Delete operations are free. However, other Azure services and utilities such as [Microsoft Defender for Storage](/azure/defender-for-cloud/defender-for-storage-introduction) might charge for operations that are managed through a lifecycle policy.

Each update to a blob's last access time is billed under the [other operations](https://azure.microsoft.com/pricing/details/storage/blobs/) category. Each last access time update is charged as an "other transaction" at most once every 24 hours per object even if it's accessed thousands of times in a day. This is separate from read transactions charges.

For more information about pricing, see [Block Blob pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

## Known issues and limitations

- Tiering isn't yet supported in a premium block blob storage account. For all other accounts, tiering is allowed only on block blobs and not for append and page blobs.

- A lifecycle management policy must be read or written in full. Partial updates aren't supported.

- Each rule can have up to 10 case-sensitive prefixes and up to 10 blob index tag conditions.

- A lifecycle management policy can't be used to change the tier of a blob that uses an encryption scope to the archive tier.

- The delete action of a lifecycle management policy won't work with any blob in an immutable container. With an immutable policy, objects can be created and read, but not modified or deleted. For more information, see [Store business-critical blob data with immutable storage](./immutable-storage-overview.md).

- Lifecycle management doesn't affect system containers such as the `$logs` or `$web containers`.

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
