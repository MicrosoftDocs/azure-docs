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

You can use Lifecycle management policies to transition blobs to cost-efficient access tiers based on their use patterns or delete them entirely at the end of their lifecycle. A policy can operate on current versions, previous versions and snapshots. A policy does not operate on blobs in system containers such as as the **$logs** or **$web** containers. 

This article describes the elements of a lifecycle management policy and how to apply them to optimize the storage and transaction costs of your blobs.

> [!TIP]
> While lifecycle management helps you perform data operations in a single account, you can use Azure Storage Actions to accomplish these tasks at scale across multiple accounts. To learn more, see [What is Azure Storage Actions?](../../storage-actions/overview.md).

## Rules

A lifecycle management policy is a collection of rules in a JSON document. The following sample JSON shows a complete rule definition:

```json
{
  "rules": [
    {
      "name": "rule1",
      "enabled": true,
      "type": "Lifecycle",
      "definition": {...}
    },
    {
      "name": "rule2",
      "type": "Lifecycle",
      "definition": {...}
    }
  ]
}
```

| Parameter name | Parameter type | Notes |
|----------------|----------------|-------|
| **rules**        | An array of rule objects | At least one rule is required in a policy. You can define up to 100 rules in a policy.|

Each rule within the policy has several parameters, described in the following table:

| Parameter name | Type                                      | Notes                                                                                                                      | Required |
|----------------|-------------------------------------------|----------------------------------------------------------------------------------------------------------------------------|----------|
| **name**       | String                                    | A rule name can include up to 256 alphanumeric characters. The rule name is case-sensitive. It must be unique within a policy. | Yes     |
| **enabled**    | Boolean                                   | An optional boolean to allow a rule to be temporarily disabled. The default value is true.                     | No    |
| **type**       | An enum value                             | The current valid type is `Lifecycle`.                                                                                     | Yes     |
| **definition** | An object that defines the lifecycle rule | Each definition is made up of a filter set and an action set.                                                              | Yes     |

### Filters

Filters limit actions to a subset of blobs within the storage account. You can use a filter to specify which blobs to include. A filter provides no means to specify which blobs to exclude. If more than one filter is defined, a logical AND is applied to all filters. The following table describes each parameter.

| Filter name    | Type                            | Description                                                                    | Required |
|----------------|---------------------------------|--------------------------------------------------------------------------------|----------|
| **blobTypes**  | Array of predefined enum values | The type of blob (For example: **blockblob**)                                  | Yes      |
| **prefixMatch**    | Array of strings                | These strings are prefixes to be matched.                                      | No       |
| **blobIndexMatch** | An array of dictionary values   | These values consist of blob index tag key and value conditions to be matched. | No       |

The current release supports **blockBlob** and **appendBlob** blob types. Only the **Delete** action is supported for **appendBlob** blob type. 

Each rule can define up to 10 case-sensitive prefixes. A prefix string must start with a container name. For example, if you want to match all blobs under the path `https://myaccount.blob.core.windows.net/sample-container/blob1/...`, specify the **prefixMatch** as `sample-container/blob1`. 

This filter will match all blobs in `sample-container` where the names begin with `blob1`. If you don't define a prefix match, then, the rule applies to all blobs within the storage account. Prefix strings don't support wildcard matching. Characters such as `*` and `?` are treated as string literals.

Each rule can define up to 10 blob index tag conditions. For example, if you want to match all blobs with `Project = Contoso` under `https://myaccount.blob.core.windows.net/`, then the **blobIndexMatch** filter is `{"name": "Project","op": "==","value": "Contoso"}`. If you don't define a value for the **blobIndexMatch** filter, then the rule applies to all blobs within the storage account.

### Actions

You must define at least one action for each rule. Actions are applied to the filtered blobs when the run condition is met. To learn more about run conditions, see the [Action run conditions](#action-run-conditions) section of this article. The following table describes each action that is available in a policy definition.

| Action | Description | Support |
|---|---|---|
| **TierToCool** | Set a blob to the cool access tier | Supported only for block blobs and not for append and page blobs<br><br>Not supported for blobs in a premium block blob storage account |
| **TierToCold** | Set a blob to the cold access tier | Supported only for block blobs and not for append and page blobs<br><br>Not supported for blobs in a premium block blob storage account   |
| **TierToArchive** | Set a blob to the archive access tier | Supported only for block blobs and not for append and page blobs<br><br>Not supported for blobs in a premium block blob storage account <br><br>Not supported for blobs that use an encryption scope |
| **enableAutoTierToHotFromCool** | If a blob is set to the cool tier, this action automatically moves that blob into the hot tier when the blob is accessed. | Available only when used with the **daysAfterLastAccessTimeGreaterThan** run condition<br><br> Works only with current blob versions, not previous versions or snapshots |
| **Delete** | Deletes a blob | Not supported for page blobs or blobs in an immutable container |

If you define more than one action on the same blob, then lifecycle management applies the least expensive action to the blob. For example, a **delete** action is cheaper than the **tierToArchive** action and the **tierToArchive** action is cheaper than the **tierToCool** action.

#### Delete action in accounts that have a hierarchical namespace

When applied to an account with a hierarchical namespace enabled, a delete action removes empty directories. If the directory isn't empty, then the delete action removes objects that meet the policy conditions within the first lifecycle policy execution cycle. If that action results in an empty directory that also meets the policy conditions, then that directory will be removed within the next execution cycle, and so on.

#### Delete action on blobs that have versions and snapshots

A lifecycle management policy will not delete the current version of a blob until any previous versions or snapshots associated with that blob have been deleted. If blobs in your storage account have previous versions or snapshots, then you must include previous versions and snapshots when you specify a delete action as part of the policy.

### Action run conditions

All run conditions are based on age. Current versions use the last modified time or last access time, previous versions use the version creation time, and blob snapshots use the snapshot creation time to track age. The following table describes each action run condition.

| Condition name                                     | Type    | Description                                                                                                                                                                                                                                                |
|----------------------------------------------------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **daysAfterModificationGreaterThan**               | Integer | The age in days after the last modified time.<br>The condition for actions on a current version of a blob.                                                                                                                                                 |
| **daysAfterCreationGreaterThan**                   | Integer | The age in days after the creation time.<br>The condition for actions on the current version or previous version of a blob or a blob snapshot.                                                                                                             |
| **daysAfterLastAccessTimeGreaterThan** | Integer | Indicates the age in days after the last access time or in some cases, when the date when the policy was enabled. To learn more, see the [Access time tracking](#access-time-tracking) section below.<br>The condition for a current version of a blob when access tracking is enabled.                                                                                                                     |
| **daysAfterLastTierChangeGreaterThan**             | Integer | Indicates the age in days after last blob tier change time.<br>The minimum duration in days that a rehydrated blob is kept in hot, cool or cold tiers before being returned to the archive tier. This condition applies only to **tierToArchive** actions. |

### Access time tracking

You can enable access time tracking to keep a record of when your blob is last read or written and as a filter to manage tiering and retention of your blob data. 

When you enable access time tracking, a blob property called `LastAccessTime` is updated when a blob is read or written. The [Get Blob](/rest/api/storageservices/get-blob) and [Put Blob](/rest/api/storageservices/put-blob) operations are access operations and will update the access time of a blob. However, the [Get Blob Properties](/rest/api/storageservices/get-blob-properties), [Get Blob Metadata](/rest/api/storageservices/get-blob-metadata), and [Get Blob Tags](/rest/api/storageservices/get-blob-tags) aren't access operations. Those operations won't update the access time of a blob. 

If you apply the **daysAfterLastAccessTimeGreaterThan** run condition to a policy, then the `LastAccessTime` is used to determine whether that condition is met. 

If you apply the **daysAfterLastAccessTimeGreaterThan** run condition to a policy, but you did not enable access time tracking, then the `LastAccessTime` is not used. The date the lifecycle policy was enabled instead. In fact, the date that the lifecycle policy was enabled is used in any situation where the `LastAccessTime` property of the blob is a null value. This can happen even if you've enable access time tracking in cases where a blob hasn't been accessed since tracking was enabled.

> [!NOTE]
> To minimize the effect on read access latency, only the first read of the last 24 hours updates the last access time. Subsequent reads in the same 24-hour period don't update the last access time. If a blob is modified between reads, the last access time is the more recent of the two values.

To learn how to enable access time tracking, see [Optionally enable access time tracking](lifecycle-management-policy-configure.md#optionally-enable-access-time-tracking).

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

The **LifecyclePolicyCompleted** event is generated when the actions defined by a lifecycle management policy are performed. A summary section appears for each action that is included in the policy definition. For an example of the **LifecyclePolicyCompleted** event, and for a description of each field, see [Microsoft.Storage.LifecyclePolicyCompleted event](../../event-grid/event-schema-blob-storage.md#microsoftstoragelifecyclepolicycompleted-event?toc=/azure/storage/blobs/toc.json). 

## Pricing and billing

Lifecycle management policies are free of charge. Customers are billed for standard operation costs for the [Set Blob Tier](/rest/api/storageservices/set-blob-tier) API calls. Delete operations are free. However, other Azure services and utilities such as [Microsoft Defender for Storage](/azure/defender-for-cloud/defender-for-storage-introduction) may charge for operations that are managed through a lifecycle policy.

Each update to a blob's last access time is billed under the [other operations](https://azure.microsoft.com/pricing/details/storage/blobs/) category. Each last access time update is charged as an "other transaction" at most once every 24 hours per object even if it's accessed 1000s of times in a day. This is separate from read transactions charges.

For more information about pricing, see [Block Blob pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

## Frequently asked questions (FAQ)

- [I created a new policy. Why do the actions not run immediately?](storage-blob-faq.yml#i-created-a-new-policy--why-do-the-actions-not-run-immediately-)
- [If I update an existing policy, how long does it take for the actions to run?](storage-blob-faq.yml#if-i-update-an-existing-policy--how-long-does-it-take-for-the-actions-to-run-)
- [The run completes but doesn't move or delete some blobs](storage-blob-faq.yml#the-run-completes-but-doesn-t-move-or-delete-some-blobs-)
- [I don't see capacity changes even though the policy is executing and deleting the blobs](storage-blob-faq.yml#i-don-t-see-capacity-changes-even-though-the-policy-is-executing-and-deleting-the-blobs-)
- [I rehydrated an archived blob. How do I prevent it from being moved back to the Archive tier temporarily?](storage-blob-faq.yml#i-rehydrated-an-archived-blob--how-do-i-prevent-it-from-being-moved-back-to-the-archive-tier-temporarily-)
- [The blob prefix match string didn't apply the policy to the expected blobs](storage-blob-faq.yml#the-blob-prefix-match-string-didn-t-apply-the-policy-to-the-expected-blobs-)
- [Is there a way to identify the time at which the policy will be executing?](storage-blob-faq.yml#is-there-a-way-to-identify-the-time-at-which-the-policy-will-be-executing-)

## Next steps

- [Configure a lifecycle management policy](lifecycle-management-policy-configure.md)
- [Hot, Cool, and Archive access tiers for blob data](access-tiers-overview.md)
- [Manage and find data on Azure Blob Storage with blob index](storage-manage-find-blobs.md)
- [Best practices for using blob access tiers](access-tiers-best-practices.md)
