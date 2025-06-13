---
title: Azure Blob Storage lifecycle management policy structure
titleSuffix: Azure Blob Storage
description: Learn more about the elements of a lifecycle management policy.
author: normesta

ms.author: normesta
ms.date: 06/13/2025
ms.service: azure-blob-storage
ms.topic: conceptual
ms.custom: references_regions, engagement-fy23
---

# Azure Blob Storage lifecycle management policy structure

You can use lifecycle management policies to transition blobs to cost-efficient access tiers based on their use patterns. You can also delete blobs entirely at the end of their lifecycle. A policy can operate on current versions, previous versions and snapshots, but a policy doesn't operate on blobs in system containers such as as the **$logs** or **$web** containers. For general information, see [Azure Blob Storage lifecycle management overview](lifecycle-management-overview.md). 

This article describes the elements of a lifecycle management policy. For policy examples, see the following articles:

- [Lifecycle management policies that transition blobs between tiers](lifecycle-management-policy-access-tiers.md)
- [Lifecycle management policies that deletes blobs](lifecycle-management-policy-delete.md)

> [!TIP]
> While lifecycle management helps you optimize your costs for a single account, you can use [Azure Storage Actions](../../storage-actions/overview.md) to accomplish multiple data operations at scale across multiple accounts.

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
| **rules**        | An array of rule objects | At least one rule is required in a policy. You can define up to 100 rules in a policy. |

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
| **blobTypes**  | Array of predefined enum values | The type of blob (either **blockblob** or **appendBlob**)                                  | Yes      |
| **prefixMatch**    | Array of strings                | These strings are prefixes to be matched.                                      | No       |
| **blobIndexMatch** | An array of dictionary values   | These values consist of blob index tag key and value conditions to be matched. | No       |

#### Prefix match filter

If you apply the **prefixMatch** filter, then each rule can define up to 10 case-sensitive prefixes. A prefix string must start with a container name. For example, if you want to match all blobs under the path `https://myaccount.blob.core.windows.net/sample-container/blob1/...`, specify the **prefixMatch** as `sample-container/blob1`. 

This filter will match all blobs in `sample-container` where the names begin with `blob1`. If you don't define a prefix match, then, the rule applies to all blobs within the storage account. Prefix strings don't support wildcard matching. Characters such as `*` and `?` are treated as string literals.

#### Blob index match filter

If you apply the **blobIndexMatch** filter, then each rule can define up to 10 blob index tag conditions. For example, if you want to match all blobs with `Project = Contoso` under `https://myaccount.blob.core.windows.net/`, then the **blobIndexMatch** filter is `{"name": "Project","op": "==","value": "Contoso"}`. If you don't define a value for the **blobIndexMatch** filter, then the rule applies to all blobs within the storage account.

### Actions

You must define at least one action for each rule. Actions are applied to the filtered blobs when the run condition is met. To learn more about run conditions, see the [Action run conditions](#action-run-conditions) section of this article. The following table describes each action that is available in a policy definition.

| Action | Description |
|---|---|
| **TierToCool** | Set a blob to the cool access tier.<br><br>Not supported with append blobs, page blobs, or with blobs in a premium block blob storage account.|
| **TierToCold** | Set a blob to the cold access tier.<br><br>Not supported with append blobs, page blobs, or with blobs in a premium block blob storage account.| 
| **TierToArchive**  | Set a blob to the archive access tier.<br><br>Rehydrating a blob does not update the last modified or last access time property of the blob. As a result, this action might move rehydrated blobs back to the archive tier. To prevent this from happening, add the `daysAfterLastTierChangeGreaterThan` condition to this action.<br><br>This action is not supported with append blobs, page blobs, or with blobs in a premium block blob storage account. Also not supported with blobs that use an encryption scope or with blobs in accounts that are configured for Zone-redundant storage (ZRS), geo-zone-redundant storage (GZRS) / read-access geo-zone-redundant storage (RA-GZRS).|
| **enableAutoTierToHotFromCool** | If a blob is set to the cool tier, this action automatically moves that blob into the hot tier when the blob is accessed.<br><br>This action is available only when used with the **daysAfterLastAccessTimeGreaterThan** run condition. <br><br>This action has no effect on blobs that were set to the cool tier prior to enabling this action in a rule. <br><br>This action moves blobs from cool to hot only one time in 30 days. This safeguard is put into place to protect against multiple early deletion penalties charged to the account.<br><br>Not supported with previous versions or snapshots. | 
| **Delete** | Deletes a blob.<br><br>Not supported with page blobs or blobs in an immutable container.|

If you define more than one action on the same blob, then lifecycle management applies the least expensive action to the blob. For example, a **delete** action is cheaper than the **tierToArchive** action and the **tierToArchive** action is cheaper than the **tierToCool** action.

#### Delete action in accounts that have a hierarchical namespace

When applied to an account with a hierarchical namespace enabled, a delete action removes empty directories. If the directory isn't empty, then the delete action removes objects that meet the policy conditions within the first lifecycle policy execution cycle. If that action results in an empty directory that also meets the policy conditions, then that directory will be removed within the next execution cycle, and so on.

#### Delete action on blobs that have versions and snapshots

A lifecycle management policy will not delete the current version of a blob until any previous versions or snapshots associated with that blob have been deleted. If blobs in your storage account have previous versions or snapshots, then you must include previous versions and snapshots when you specify a delete action as part of the policy.

### Action run conditions

All run conditions are time-based. If the number of days that have transpired exceeds the number specified for the condition, then the associated action can execute. Policy conditions are assessed on each object only once during a policy run. In some cases, an object might meet the condition after it was already assessed by a run. Such objects are processed in subsequent runs.

Current versions use the last modified time or last access time, previous versions use the version creation time, and blob snapshots use the snapshot creation time to track age. 

The following table describes each action run condition.

| Condition name                                     | Type    | Description                                                                                                                                                                                                                                                |
|----------------------------------------------------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **daysAfterModificationGreaterThan**               | Integer | The age in days after the last modified time blob. Applies to actions on a current version of a blob.                                                                                                                                                 |
| **daysAfterCreationGreaterThan**                   | Integer | The age in days after the creation time. Applies to actions on the current version of a blob, the previous version of a blob or a blob snapshot.                                                                                                             |
| **daysAfterLastAccessTimeGreaterThan** | Integer | The age in days after the last access time or in some cases, when the date when the policy was enabled. To learn more, see the [Access time tracking](#access-time-tracking) section below. Applies to actions on the current version of a blob when access tracking is enabled.                                                                                                                     |
| **daysAfterLastTierChangeGreaterThan**             | Integer | The age in days after last blob tier change time. The minimum duration in days that a rehydrated blob is kept in hot, cool or cold tiers before being returned to the archive tier. Applies only to **tierToArchive** actions. |

### Access time tracking

You can enable access time tracking to keep a record of when your blob is last read or written and as a filter to manage tiering and retention of your blob data. 

When you enable access time tracking, a blob property called `LastAccessTime` is updated when a blob is read or written. The [Get Blob](/rest/api/storageservices/get-blob) and [Put Blob](/rest/api/storageservices/put-blob) operations are access operations and will update the access time of a blob. However, the [Get Blob Properties](/rest/api/storageservices/get-blob-properties), [Get Blob Metadata](/rest/api/storageservices/get-blob-metadata), and [Get Blob Tags](/rest/api/storageservices/get-blob-tags) aren't access operations. Those operations won't update the access time of a blob. 

If you apply the **daysAfterLastAccessTimeGreaterThan** run condition to a policy, then the `LastAccessTime` is used to determine whether that condition is met. 

If you apply the **daysAfterLastAccessTimeGreaterThan** run condition to a policy, but you did not enable access time tracking, then the `LastAccessTime` is not used. The date the lifecycle policy was enabled is used instead. In fact, the date that the lifecycle policy was enabled is used in any situation where the `LastAccessTime` property of the blob is a null value. This can happen even if you've enable access time tracking in cases where a blob hasn't been accessed since tracking was enabled.

> [!NOTE]
> To minimize the effect on read access latency, only the first read of the last 24 hours updates the last access time. Subsequent reads in the same 24-hour period don't update the last access time. If a blob is modified between reads, the last access time is the more recent of the two values.

To learn how to enable access time tracking, see [Optionally enable access time tracking](lifecycle-management-policy-configure.md#enable-access-time-tracking).

## Next steps

- [Azure Blob Storage lifecycle management overview](lifecycle-management-overview.md).
- [Configure a lifecycle management policy](lifecycle-management-policy-configure.md)
- [Access tiers for blob data](access-tiers-overview.md)
- [Lifecycle management policies that transition blobs between tiers](lifecycle-management-policy-access-tiers.md)
- [Lifecycle management policies that deletes blobs](lifecycle-management-policy-delete.md)
- [Lifecycle management policy monitoring](lifecycle-management-policy-monitor.md)
- [Manage and find data on Azure Blob Storage with blob index](storage-manage-find-blobs.md)
- [Best practices for using blob access tiers](access-tiers-best-practices.md)
