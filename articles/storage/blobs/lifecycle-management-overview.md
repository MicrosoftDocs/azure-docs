---
title: Azure Blob Storage lifecycle management overview
titleSuffix: Azure Blob Storage
description: Use Azure Blob Storage lifecycle management policies to create automated rules for moving data between hot, cool, cold, and archive tiers.
author: normesta

ms.author: normesta
ms.date: 02/10/2025
ms.service: azure-blob-storage
ms.topic: conceptual
ms.custom: references_regions, engagement-fy23
---

# Azure Blob Storage lifecycle management overview

You can create a lifecycle management policy to periodically transition blobs to other access tiers or delete them entirely. You can use policy to optimize capacity and transaction costs  

## Use cases

You can use a policy to transition blobs to cost-efficient access tiers based on their use patterns. A policy can transition current versions of a blob, previous versions of a blob, or blob snapshots to a cooler storage tier if these objects haven't been accessed or modified for a period of time. You can also transition blobs back from the cool tier to the hot tier immediately when they're accessed. See [Configure a lifecycle management policy for access tiers](lifecycle-management-policy-access-tiers).

You can also use a policy to delete current versions of a blob, previous versions of a blob, or blob snapshots at the end of their lifecycle. See [Configure a lifecycle management policy to delete data](lifecycle-management-policy-delete.md).

While lifecycle management helps you move data between tiers in a single account, you can use a _storage task_ to accomplish these tasks at scale across multiple accounts. To learn more, see [What is Azure Storage Actions?](../../storage-actions/overview.md).

Lifecycle management policies are supported for block blobs and append blobs in general-purpose v2, premium block blob, and Blob Storage accounts. Lifecycle management doesn't affect system containers such as the `$logs` or `$web` containers.

## Rules

A lifecycle management policy is a collection of _rules_ in a JSON document. At least one rule is required in a policy. You can define up to 100 rules in a policy. 

The following sample JSON shows a complete rule definition:

```json
{
  "rules": [
    {
      "name": "rule1",
      "enabled": true,
      "type": "Lifecycle",
      "definition": {
        "filters": {...},
        "actions": {...}
      }
    },
    {
      "name": "rule2",
      "type": "Lifecycle",
      "enabled": true,
      "definition": {
        "filters": {...},
        "actions": {...}
      }
    }
  ]
}
```

Each rule within the policy has several parameters, described in the following table:

| Parameter name | Parameter type | Notes | Required |
|--|--|--|--|
| `name` | String | A rule name can include up to 256 alphanumeric characters. Rule name is case-sensitive. It must be unique within a policy. | True |
| `enabled` | Boolean | An optional boolean to allow a rule to be temporarily disabled. Default value is true if it's not set. | False |
| `type` | An enum value | The current valid type is `Lifecycle`. | True |
| `definition` | An object that defines the lifecycle rule | Each definition is made up of a collection of one or more _filters_ and a collection of one or more _actions_.<br>A filter limits rule actions to a certain set of objects within a container or objects names.<br>An action applies the tier or delete actions to the filtered set of objects.  | True |

### Filters

Filters limit rule actions to a subset of blobs within the storage account. You can use a filter to specify which blobs to include. A filter provides no means to specify which blobs to exclude.

Filters include:

| Filter name | Description | Required |
|-----|-----|
| blobTypes | An array of predefined enum values. The current release supports `blockBlob` and `appendBlob`. Only the Delete action is supported for `appendBlob`. | Yes |
| prefixMatch | An array of strings for prefixes to be matched. Each rule can define up to 10 case-sensitive prefixes. A prefix string must start with a container name. For example, if you want to match all blobs under `https://myaccount.blob.core.windows.net/sample-container/blob1/...`, specify the **prefixMatch** as `sample-container/blob1`. This filter will match all blobs in *sample-container* whose names begin with *blob1*.<br /><br />. If you don't define **prefixMatch**, the rule applies to all blobs within the storage account. Prefix strings don't support wildcard matching. Characters such as `*` and `?` are treated as string literals. | No |
| blobIndexMatch | (**Optional**) An array of dictionary values consisting of blob index tag key and value conditions to be matched. Each rule can define up to 10 blob index tag condition. For example, if you want to match all blobs with `Project = Contoso` under `https://myaccount.blob.core.windows.net/` for a rule, the blobIndexMatch is `{"name": "Project","op": "==","value": "Contoso"}`. If you don't define blobIndexMatch, the rule applies to all blobs within the storage account. | No |

If more than one filter is defined, a logical `AND` runs on all filters. You can use a filter to specify which blobs to include. A filter provides no means to specify which blobs to exclude.

### Actions

Actions are applied to the filtered blobs when the run condition is met. Actions can apply to current versions, previous versions, and blob snapshots. You must define at least one action for each rule. 

The following table describes each rule. 

| Action | Description | 
|---|---|
| tierToCool| Set the blob to the cool access tier. |
| tierToCold| Set the blob to the cold access tier. |
| tierToArchive | Set the blob to the archive tier. |
| enableAutoTierToHotFromCool | If the blob is set to the cool tier, then this action automatically moves the blob into the hot tier when the blob is accessed. This action is not supported for previous versions or snapshots |
| delete | Delete the blob. Page blobs are not supported. |

If you define more than one action on the same blob, lifecycle management applies the least expensive action to the blob. For example, action `delete` is cheaper than action `tierToArchive`. Action `tierToArchive` is cheaper than action `tierToCool`.

### Action run conditions

The run conditions are based on age. Current versions use the last modified time or last access time, previous versions use the version creation time, and blob snapshots use the snapshot creation time to track age.

| Action run condition |  Description |
|--|--|
| daysAfterModificationGreaterThan | Integer value indicating the age in days. The condition for actions on a current version of a blob. |
| daysAfterCreationGreaterThan | Integer value indicating the age in days. The condition for actions on the current version or previous version of a blob or a blob snapshot. |
| daysAfterLastAccessTimeGreaterThan<sup>1</sup> | Integer value indicating the age in days. The condition for a current version of a blob when access tracking is enabled |
| daysAfterLastTierChangeGreaterThan | Integer value indicating the age in days after last blob tier change time. The minimum duration in days that a rehydrated blob is kept in hot, cool or cold tiers before being returned to the archive tier. This condition applies only to `tierToArchive` actions. |

<sup>1</sup> If [last access time tracking](#move-data-based-on-last-accessed-time) is not enabled, **daysAfterLastAccessTimeGreaterThan** uses the date the lifecycle policy was enabled instead of the `LastAccessTime` property of the blob. This date is also used when the `LastAccessTime` property is a null value. For more information about using last access time tracking, see [Move data based on last accessed time](#move-data-based-on-last-accessed-time).

## Policy execution

When you add or edit the rules of a lifecycle policy, it can take up to 24 hours for changes to go into effect and for the first execution to start. 

An active policy processes objects periodically, and is interrupted if changes are made to the policy. If you disable a policy, then no new policy runs will be scheduled, but if a run is already in progress, that run will continue until it completes and you're billed for any actions that are required to complete the run. If you disable or delete all of the rules in a policy, then the policy becomes inactive, and no new runs will be scheduled. 

The time required for a run to complete depends on the number of blobs evaluated and operated on. The latency with which a blob is evaluated and operated on may be longer if the request rate for the storage account approaches the storage account limit. All requests made to storage account, including requests made by policy runs, accrue to the same limit on requests per second, and as that limit approaches, priority is given to requests made by workloads.  To request an increase in account limits, contact [Azure Support](https://azure.microsoft.com/support/faq/).

To view default scale limits, see the following articles:

- [Scalability and performance targets for Blob storage](scalability-targets.md)
- [Scalability and performance targets for standard storage accounts](../common/scalability-targets-standard-account.md) 
- [Scalability targets for premium block blob storage accounts](scalability-targets-premium-block-blobs.md)

Learn more about [Lifecycle Management Performance Characteristics](lifecycle-management-performance-characteristics.md).

## Events

The `LifecyclePolicyCompleted` event is generated when the actions defined by a lifecycle management policy are performed. A summary section appears for each action that is included in the policy definition. For an example of the `LifecyclePolicyCompleted` event, and for a description of each field, see [Microsoft.Storage.LifecyclePolicyCompleted event](../../event-grid/event-schema-blob-storage.md#microsoftstoragelifecyclepolicycompleted-event?toc=/azure/storage/blobs/toc.json). 

## Pricing and billing

Lifecycle management policies are free of charge. Customers are billed for standard operation costs for the [Set Blob Tier](/rest/api/storageservices/set-blob-tier) API calls. Delete operations are free. However, other Azure services and utilities such as [Microsoft Defender for Storage](/azure/defender-for-cloud/defender-for-storage-introduction) may charge for operations that are managed through a lifecycle policy.

Each update to a blob's last access time is billed under the [other operations](https://azure.microsoft.com/pricing/details/storage/blobs/) category. Each last access time update is charged as an "other transaction" at most once every 24 hours per object even if it's accessed 1000s of times in a day. This is separate from read transactions charges.

For more information about pricing, see [Block Blob pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

## Frequently asked questions (FAQ)

- [I created a new policy. Why do the actions not run immediately?](storage-blob-faq.md#i-created-a-new-policy--why-do-the-actions-not-run-immediately-)

- [If I update an existing policy, how long does it take for the actions to run?](storage-blob-faq.md#if-i-update-an-existing-policy--how-long-does-it-take-for-the-actions-to-run-)

- [The run completes but doesn't move or delete some blobs](storage-blob-faq.md#the-run-completes-but-doesn-t-move-or-delete-some-blobs)

- [I don't see capacity changes even though the policy is executing and deleting the blobs](storage-blob-faq.md#i-don-t-see-capacity-changes-even-though-the-policy-is-executing-and-deleting-the-blobs)

- [I rehydrated an archived blob. How do I prevent it from being moved back to the Archive tier temporarily?](storage-blob-faq.md#i-rehydrated-an-archived-blob--how-do-i-prevent-it-from-being-moved-back-to-the-archive-tier-temporarily-)

- [The blob prefix match string didn't apply the policy to the expected blobs](storage-blob-faq.md#the-blob-prefix-match-string-didn-t-apply-the-policy-to-the-expected-blobs)

- [Is there a way to identify the time at which the policy will be executing?](storage-blob-faq.md#is-there-a-way-to-identify-the-time-at-which-the-policy-will-be-executing-)

## Next steps

- [Configure a lifecycle management policy](lifecycle-management-policy-configure.md)
- [Hot, Cool, and Archive access tiers for blob data](access-tiers-overview.md)
- [Manage and find data on Azure Blob Storage with blob index](storage-manage-find-blobs.md)
- [Best practices for using blob access tiers](access-tiers-best-practices.md)
