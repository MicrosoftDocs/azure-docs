---
title: Optimize costs by automatically managing the data lifecycle
titleSuffix: Azure Storage
description: Use Azure Storage lifecycle management policies to create automated rules for moving data between hot, cool, and archive tiers.
author: normesta

ms.author: normesta
ms.date: 09/29/2022
ms.service: storage
ms.subservice: common
ms.topic: conceptual
ms.reviewer: yzheng
ms.custom: "devx-track-azurepowershell, references_regions"
---

# Optimize costs by automatically managing the data lifecycle

Data sets have unique lifecycles. Early in the lifecycle, people access some data often. But the need for access often drops drastically as the data ages. Some data remains idle in the cloud and is rarely accessed once stored. Some data sets expire days or months after creation, while other data sets are actively read and modified throughout their lifetimes. Azure Storage lifecycle management offers a rule-based policy that you can use to transition blob data to the appropriate access tiers or to expire data at the end of the data lifecycle.

> [!NOTE]
> Each last access time update is charged as an "other transaction" at most once every 24 hours per object even if it's accessed 1000s of times in a day. This is separate from read transactions charges.

With the lifecycle management policy, you can:

- Transition blobs from cool to hot immediately when they're accessed, to optimize for performance.
- Transition current versions of a blob, previous versions of a blob, or blob snapshots to a cooler storage tier if these objects haven't been accessed or modified for a period of time, to optimize for cost. In this scenario, the lifecycle management policy can move objects from hot to cool, from hot to archive, or from cool to archive.
- Delete current versions of a blob, previous versions of a blob, or blob snapshots at the end of their lifecycles.
- Define rules to be run once per day at the storage account level.
- Apply rules to containers or to a subset of blobs, using name prefixes or [blob index tags](storage-manage-find-blobs.md) as filters.

Consider a scenario where data is frequently accessed during the early stages of the lifecycle, but only occasionally after two weeks. Beyond the first month, the data set is rarely accessed. In this scenario, hot storage is best during the early stages. Cool storage is most appropriate for occasional access. Archive storage is the best tier option after the data ages over a month. By moving data to the appropriate storage tier based on its age with lifecycle management policy rules, you can design the least expensive solution for your needs.

Lifecycle management policies are supported for block blobs and append blobs in general-purpose v2, premium block blob, and Blob Storage accounts. Lifecycle management doesn't affect system containers such as the `$logs` or `$web` containers.

> [!IMPORTANT]
> If a data set needs to be readable, do not set a policy to move blobs to the archive tier. Blobs in the archive tier cannot be read unless they are first rehydrated, a process which may be time-consuming and expensive. For more information, see [Overview of blob rehydration from the archive tier](archive-rehydrate-overview.md).

## Lifecycle management policy definition

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

A policy is a collection of rules, as described in the following table:

| Parameter name | Parameter type | Notes |
|----------------|----------------|-------|
| `rules`        | An array of rule objects | At least one rule is required in a policy. You can define up to 100 rules in a policy.|

Each rule within the policy has several parameters, described in the following table:

| Parameter name | Parameter type | Notes | Required |
|--|--|--|--|
| `name` | String | A rule name can include up to 256 alphanumeric characters. Rule name is case-sensitive. It must be unique within a policy. | True |
| `enabled` | Boolean | An optional boolean to allow a rule to be temporarily disabled. Default value is true if it's not set. | False |
| `type` | An enum value | The current valid type is `Lifecycle`. | True |
| `definition` | An object that defines the lifecycle rule | Each definition is made up of a filter set and an action set. | True |

## Lifecycle management rule definition

Each rule definition within a policy includes a filter set and an action set. The [filter set](#rule-filters) limits rule actions to a certain set of objects within a container or objects names. The [action set](#rule-actions) applies the tier or delete actions to the filtered set of objects.

### Sample rule

The following sample rule filters the account to run the actions on objects that exist inside `sample-container` and start with `blob1`.

- Tier blob to cool tier 30 days after last modification
- Tier blob to archive tier 90 days after last modification
- Delete blob 2,555 days (seven years) after last modification
- Delete previous versions 90 days after creation

```json
{
  "rules": [
    {
      "enabled": true,
      "name": "sample-rule",
      "type": "Lifecycle",
      "definition": {
        "actions": {
          "version": {
            "delete": {
              "daysAfterCreationGreaterThan": 90
            }
          },
          "baseBlob": {
            "tierToCool": {
              "daysAfterModificationGreaterThan": 30
            },
            "tierToArchive": {
              "daysAfterModificationGreaterThan": 90,
              "daysAfterLastTierChangeGreaterThan": 7
            },
            "delete": {
              "daysAfterModificationGreaterThan": 2555
            }
          }
        },
        "filters": {
          "blobTypes": [
            "blockBlob"
          ],
          "prefixMatch": [
            "sample-container/blob1"
          ]
        }
      }
    }
  ]
}
```

> [!NOTE]
> The **baseBlob** element in a lifecycle management policy refers to the current version of a blob. The **version** element refers to a previous version.

### Rule filters

Filters limit rule actions to a subset of blobs within the storage account. If more than one filter is defined, a logical `AND` runs on all filters.

Filters include:

| Filter name | Filter type | Notes | Is Required |
|-------------|-------------|-------|-------------|
| blobTypes   | An array of predefined enum values. | The current release supports `blockBlob` and `appendBlob`. Only delete is supported for `appendBlob`, set tier isn't supported. | Yes |
| prefixMatch | An array of strings for prefixes to be matched. Each rule can define up to 10 case-sensitive prefixes. A prefix string must start with a container name. For example, if you want to match all blobs under `https://myaccount.blob.core.windows.net/sample-container/blob1/...` for a rule, the prefixMatch is `sample-container/blob1`. | If you don't define prefixMatch, the rule applies to all blobs within the storage account. | No |
| blobIndexMatch | An array of dictionary values consisting of blob index tag key and value conditions to be matched. Each rule can define up to 10 blob index tag condition. For example, if you want to match all blobs with `Project = Contoso` under `https://myaccount.blob.core.windows.net/` for a rule, the blobIndexMatch is `{"name": "Project","op": "==","value": "Contoso"}`. | If you don't define blobIndexMatch, the rule applies to all blobs within the storage account. | No |

To learn more about the blob index feature together with known issues and limitations, see [Manage and find data on Azure Blob Storage with blob index](storage-manage-find-blobs.md).

### Rule actions

Actions are applied to the filtered blobs when the run condition is met.

Lifecycle management supports tiering and deletion of current versions, previous versions, and blob snapshots. Define at least one action for each rule.

| Action                      | Current Version                            | Snapshot      | Previous Versions
|-----------------------------|--------------------------------------------|---------------|---------------|
| tierToCool                  | Supported for `blockBlob`                  | Supported     | Supported     |
| enableAutoTierToHotFromCool | Supported for `blockBlob`                  | Not supported | Not supported |
| tierToArchive               | Supported for `blockBlob`                  | Supported     | Supported     |
| delete<sup>1</sup>          | Supported for `blockBlob` and `appendBlob` | Supported     | Supported     |

<sup>1</sup> When applied to an account with a hierarchical namespace enabled, a delete action removes empty directories. If the directory isn't empty, then the delete action removes objects that meet the policy conditions within the first 24-hour cycle. If that action results in an empty directory that also meets the policy conditions, then that directory will be removed within the next 24-hour cycle, and so on.

> [!NOTE]
> If you define more than one action on the same blob, lifecycle management applies the least expensive action to the blob. For example, action `delete` is cheaper than action `tierToArchive`. Action `tierToArchive` is cheaper than action `tierToCool`.

The run conditions are based on age. Current versions use the last modified time or last access time, previous versions use the version creation time, and blob snapshots use the snapshot creation time to track age.

| Action run condition | Condition value | Description |
|--|--|--|
| daysAfterModificationGreaterThan | Integer value indicating the age in days | The condition for actions on a current version of a blob |
| daysAfterCreationGreaterThan | Integer value indicating the age in days | The condition for actions on a previous version of a blob or a blob snapshot |
| daysAfterLastAccessTimeGreaterThan | Integer value indicating the age in days | The condition for a current version of a blob when access tracking is enabled |
| daysAfterLastTierChangeGreaterThan | Integer value indicating the age in days after last blob tier change time | This condition applies only to `tierToArchive` actions and can be used only with the `daysAfterModificationGreaterThan` condition. |

## Examples of lifecycle policies

The following examples demonstrate how to address common scenarios with lifecycle policy rules.

### Move aging data to a cooler tier

This example shows how to transition block blobs prefixed with `sample-container/blob1` or `container2/blob2`. The policy transitions blobs that haven't been modified in over 30 days to cool storage, and blobs not modified in 90 days to the archive tier:

```json
{
  "rules": [
    {
      "name": "agingRule",
      "enabled": true,
      "type": "Lifecycle",
      "definition": {
        "filters": {
          "blobTypes": [ "blockBlob" ],
          "prefixMatch": [ "sample-container/blob1", "container2/blob2" ]
        },
        "actions": {
          "baseBlob": {
            "tierToCool": { "daysAfterModificationGreaterThan": 30 },
            "tierToArchive": { "daysAfterModificationGreaterThan": 90 }
          }
        }
      }
    }
  ]
}
```

### Move data based on last accessed time

You can enable last access time tracking to keep a record of when your blob is last read or written and as a filter to manage tiering and retention of your blob data. To learn how to enable last access time tracking, see [Optionally enable access time tracking](lifecycle-management-policy-configure.md#optionally-enable-access-time-tracking).

When last access time tracking is enabled, the blob property called `LastAccessTime` is updated when a blob is read or written. A [Get Blob](/rest/api/storageservices/get-blob) operation is considered an access operation. [Get Blob Properties](/rest/api/storageservices/get-blob-properties), [Get Blob Metadata](/rest/api/storageservices/get-blob-metadata), and [Get Blob Tags](/rest/api/storageservices/get-blob-tags) aren't access operations, and therefore don't update the last access time.

To minimize the effect on read access latency, only the first read of the last 24 hours updates the last access time. Subsequent reads in the same 24-hour period don't update the last access time. If a blob is modified between reads, the last access time is the more recent of the two values.

In the following example, blobs are moved to cool storage if they haven't been accessed for 30 days. The `enableAutoTierToHotFromCool` property is a Boolean value that indicates whether a blob should automatically be tiered from cool back to hot if it's accessed again after being tiered to cool.

```json
{
  "enabled": true,
  "name": "last-accessed-thirty-days-ago",
  "type": "Lifecycle",
  "definition": {
    "actions": {
      "baseBlob": {
        "enableAutoTierToHotFromCool": true,
        "tierToCool": {
          "daysAfterLastAccessTimeGreaterThan": 30
        }
      }
    },
    "filters": {
      "blobTypes": [
        "blockBlob"
      ],
      "prefixMatch": [
        "mylifecyclecontainer/log"
      ]
    }
  }
}
```

### Archive data after ingest

Some data stays idle in the cloud and is rarely, if ever, accessed. The following lifecycle policy is configured to archive data shortly after it's ingested. This example transitions block blobs in a container named `archivecontainer` into an archive tier. The transition is accomplished by acting on blobs 0 days after last modified time. 

```json
{
  "rules": [
    {
      "name": "archiveRule",
      "enabled": true,
      "type": "Lifecycle",
      "definition": {
        "filters": {
          "blobTypes": [ "blockBlob" ],
          "prefixMatch": [ "archivecontainer" ]
        },
        "actions": {
          "baseBlob": {
              "tierToArchive": { 
                "daysAfterModificationGreaterThan": 0
              }
          }
        }
      }
    }
  ]
}

```

> [!NOTE]
> Microsoft recommends that you upload your blobs directly the archive tier for greater efficiency. You can specify the archive tier in the *x-ms-access-tier* header on the [Put Blob](/rest/api/storageservices/put-blob) or [Put Block List](/rest/api/storageservices/put-block-list) operation. The *x-ms-access-tier* header is supported with REST version 2018-11-09 and newer or the latest blob storage client libraries.

### Expire data based on age

Some data is expected to expire days or months after creation. You can configure a lifecycle management policy to expire data by deletion based on data age. The following example shows a policy that deletes all block blobs that haven't been modified in the last 365 days.

```json
{
  "rules": [
    {
      "name": "expirationRule",
      "enabled": true,
      "type": "Lifecycle",
      "definition": {
        "filters": {
          "blobTypes": [ "blockBlob" ]
        },
        "actions": {
          "baseBlob": {
            "delete": { "daysAfterModificationGreaterThan": 365 }
          }
        }
      }
    }
  ]
}
```

### Delete data with blob index tags

Some data should only be expired if explicitly marked for deletion. You can configure a lifecycle management policy to expire data that are tagged with blob index key/value attributes. The following example shows a policy that deletes all block blobs tagged with `Project = Contoso`. To learn more about blob index, see [Manage and find data on Azure Blob Storage with blob index](storage-manage-find-blobs.md).

```json
{
    "rules": [
        {
            "enabled": true,
            "name": "DeleteContosoData",
            "type": "Lifecycle",
            "definition": {
                "actions": {
                    "baseBlob": {
                        "delete": {
                            "daysAfterModificationGreaterThan": 0
                        }
                    }
                },
                "filters": {
                    "blobIndexMatch": [
                        {
                            "name": "Project",
                            "op": "==",
                            "value": "Contoso"
                        }
                    ],
                    "blobTypes": [
                        "blockBlob"
                    ]
                }
            }
        }
    ]
}
```

### Manage previous versions

For data that is modified and accessed regularly throughout its lifetime, you can enable blob storage versioning to automatically maintain previous versions of an object. You can create a policy to tier or delete previous versions. The version age is determined by evaluating the version creation time. This policy rule moves previous versions within container `activedata` that are 90 days or older after version creation to the cool tier, and deletes previous versions that are 365 days or older.

```json
{
  "rules": [
    {
      "enabled": true,
      "name": "versionrule",
      "type": "Lifecycle",
      "definition": {
        "actions": {
          "version": {
            "tierToCool": {
              "daysAfterCreationGreaterThan": 90
            },
            "delete": {
              "daysAfterCreationGreaterThan": 365
            }
          }
        },
        "filters": {
          "blobTypes": [
            "blockBlob"
          ],
          "prefixMatch": [
            "activedata"
          ]
        }
      }
    }
  ]
}
```

## Feature support

[!INCLUDE [Blob Storage feature support in Azure Storage accounts](../../../includes/azure-storage-feature-support.md)]

## Regional availability and pricing

The lifecycle management feature is available in all Azure regions.

Lifecycle management policies are free of charge. Customers are billed for standard operation costs for the [Set Blob Tier](/rest/api/storageservices/set-blob-tier) API calls. Delete operations are free. However, other Azure services and utilities such as [Microsoft Defender for Storage](../../defender-for-cloud/defender-for-storage-introduction.md) may charge for operations that are managed through a lifecycle policy.

Each update to a blob's last access time is billed under the [other operations](https://azure.microsoft.com/pricing/details/storage/blobs/) category.

For more information about pricing, see [Block Blob pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

## FAQ

### I created a new policy. Why do the actions not run immediately?

The platform runs the lifecycle policy once a day. Once you configure a policy, it can take up to 24 hours to go into effect. Once the policy is in effect, it could take up to 24 hours for some actions to run for the first time.

### If I update an existing policy, how long does it take for the actions to run?

The updated policy takes up to 24 hours to go into effect. Once the policy is in effect, it could take up to 24 hours for the actions to run. Therefore, the policy actions may take up to 48 hours to complete. If the update is to disable or delete a rule, and enableAutoTierToHotFromCool was used, auto-tiering to Hot tier will still happen. For example, set a rule including enableAutoTierToHotFromCool based on last access. If the rule is disabled/deleted, and a blob is currently in cool and then accessed, it will move back to Hot as that is applied on access outside of lifecycle management. The blob won't then move from Hot to Cool given the lifecycle management rule is disabled/deleted. The only way to prevent autoTierToHotFromCool is to turn off last access time tracking.

### I rehydrated an archived blob. How do I prevent it from being moved back to the Archive tier temporarily?

If there's a lifecycle management policy in effect for the storage account, then rehydrating a blob by changing its tier can result in a scenario where the lifecycle policy moves the blob back to the archive tier. This can happen if the last modified time, creation time, or last access time is beyond the threshold set for the policy. There's three ways to prevent this from happening:

- Add the `daysAfterLastTierChangeGreaterThan` condition to the tierToArchive action of the policy. This condition applies only to the last modified time. See [Use lifecycle management policies to archive blobs](archive-blob.md#use-lifecycle-management-policies-to-archive-blobs).

- Disable the rule that affects this blob temporarily to prevent it from being archived again. Re-enable the rule when the blob can be safely moved back to archive tier. 

- If the blob needs to stay in the hot or cool tier permanently, copy the blob to another location where the lifecycle manage policy isn't in effect.

### The blob prefix match string didn't apply the policy to the expected blobs

The blob prefix match field of a policy is a full or partial blob path, which is used to match the blobs you want the policy actions to apply to. The path must start with the container name. If no prefix match is specified, then the policy will apply to all the blobs in the storage account. The format of the prefix match string is `[container name]/[blob name]`.

Keep in mind the following points about the prefix match string:

- A prefix match string like *container1/* applies to all blobs in the container named *container1*. A prefix match string of *container1*, without the trailing forward slash character (/), applies to all blobs in all containers where the container name begins with the string *container1*. The prefix will match containers named *container11*, *container1234*, *container1ab*, and so on.
- A prefix match string of *container1/sub1/* applies to all blobs in the container named *container1* that begin with the string *sub1/*. For example, the prefix will match blobs named *container1/sub1/test.txt* or *container1/sub1/sub2/test.txt*.
- The asterisk character `*` is a valid character in a blob name. If the asterisk character is used in a prefix, then the prefix will match blobs with an asterisk in their names. The asterisk doesn't function as a wildcard character.
- The question mark character `?` is a valid character in a blob name. If the question mark character is used in a prefix, then the prefix will match blobs with a question mark in their names. The question mark doesn't function as a wildcard character.
- The prefix match considers only positive (=) logical comparisons. Negative (!=) logical comparisons are ignored.

### Is there a way to identify the time at which the policy will be executing?

Unfortunately, there's no way to track the time at which the policy will be executing, as it's a background scheduling process. However, the platform will run the policy once per day.

## Next steps

- [Configure a lifecycle management policy](lifecycle-management-policy-configure.md)
- [Hot, Cool, and Archive access tiers for blob data](access-tiers-overview.md)
- [Manage and find data on Azure Blob Storage with blob index](storage-manage-find-blobs.md)
