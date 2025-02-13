---
title: Optimize costs by automatically managing the data lifecycle
titleSuffix: Azure Blob Storage
description: Use Azure Blob Storage lifecycle management policies to create automated rules for moving data between hot, cool, cold, and archive tiers.
author: normesta

ms.author: normesta
ms.date: 02/10/2025
ms.service: azure-blob-storage
ms.topic: conceptual
ms.custom: references_regions, engagement-fy23
---

# Optimize costs by automatically managing the data lifecycle

Azure Blob Storage lifecycle management offers a rule-based policy that you can use to transition blob data to the appropriate access tiers or to expire data at the end of the data lifecycle.

With the lifecycle management policy, you can:

- Transition current versions of a blob, previous versions of a blob, or blob snapshots to a cooler storage tier if these objects haven't been accessed or modified for a period of time, to optimize for cost.- 
- Transition blobs back from cool to hot immediately when they're accessed.
- Delete current versions of a blob, previous versions of a blob, or blob snapshots at the end of their lifecycles.
- Apply rules to an entire storage account, to select containers, or to a subset of blobs using name prefixes or [blob index tags](storage-manage-find-blobs.md) as filters.

> [!TIP]
> While lifecycle management helps you move data between tiers in a single account, you can use a _storage task_ to accomplish this task at scale across multiple accounts. A storage task is a resource available in _Azure Storage Actions_; a serverless framework that you can use to perform common data operations on millions of objects across multiple storage accounts. To learn more, see [What is Azure Storage Actions?](../../storage-actions/overview.md).

Lifecycle management policies are supported for block blobs and append blobs in general-purpose v2, premium block blob, and Blob Storage accounts. Lifecycle management doesn't affect system containers such as the `$logs` or `$web` containers.

> [!IMPORTANT]
> If a data set needs to be readable, do not set a policy to move blobs to the archive tier. Blobs in the archive tier cannot be read unless they are first rehydrated, a process which may be time-consuming and expensive. For more information, see [Overview of blob rehydration from the archive tier](archive-rehydrate-overview.md). If a data set needs to be read often, do not set a policy to move blobs to the cool or cold tiers as this might result in higher transaction costs.

## Optimizing costs by managing the data lifecycle

Data sets have unique lifecycles. Early in the lifecycle, people access some data often. But the need for access often drops drastically as the data ages. Some data remains idle in the cloud and is rarely accessed once stored. Some data sets expire days or months after creation, while other data sets are actively read and modified throughout their lifetimes. 

Consider a scenario where data is frequently accessed during the early stages of the lifecycle, but only occasionally after two weeks. Beyond the first month, the data set is rarely accessed. In this scenario, hot storage is best during the early stages. Cool storage is most appropriate for occasional access. Archive storage is the best tier option after the data ages over a month. By moving data to the appropriate storage tier based on its age with lifecycle management policy rules, you can design the least expensive solution for your needs.

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

## Lifecycle policy characteristics

When you add or edit the rules of a lifecycle policy, it can take up to 24 hours for changes to go into effect and for the first execution to start. 

An active policy processes objects periodically, and is interrupted if changes are made to the policy. If you disable a policy, then no new policy runs will be scheduled, but if a run is already in progress, that run will continue until it completes and you're billed for any actions that are required to complete the run. If you disable or delete all of the rules in a policy, then the policy becomes inactive, and no new runs will be scheduled. 

The time required for a run to complete depends on the number of blobs evaluated and operated on. The latency with which a blob is evaluated and operated on may be longer if the request rate for the storage account approaches the storage account limit. All requests made to storage account, including requests made by policy runs, accrue to the same limit on requests per second, and as that limit approaches, priority is given to requests made by workloads.  To request an increase in account limits, contact [Azure Support](https://azure.microsoft.com/support/faq/).
Learn more about [Lifecycle Management Performance Characteristics](lifecycle-management-performance-characteristics.md).

To view default scale limits, see the following articles:

- [Scalability and performance targets for Blob storage](scalability-targets.md)
- [Scalability and performance targets for standard storage accounts](../common/scalability-targets-standard-account.md) 
- [Scalability targets for premium block blob storage accounts](scalability-targets-premium-block-blobs.md)
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

Filters limit rule actions to a subset of blobs within the storage account. If more than one filter is defined, a logical `AND` runs on all filters. You can use a filter to specify which blobs to include. A filter provides no means to specify which blobs to exclude.

Filters include:

| Filter name | Filter type | Notes | Is Required |
|-------------|-------------|-------|-------------|
| blobTypes   | An array of predefined enum values. | The current release supports `blockBlob` and `appendBlob`. Only the Delete action is supported for `appendBlob`; Set Tier isn't supported. | Yes |
| prefixMatch | An array of strings for prefixes to be matched. Each rule can define up to 10 case-sensitive prefixes. A prefix string must start with a container name. For example, if you want to match all blobs under `https://myaccount.blob.core.windows.net/sample-container/blob1/...`, specify the **prefixMatch** as `sample-container/blob1`. This filter will match all blobs in *sample-container* whose names begin with *blob1*.<br /><br />. | If you don't define **prefixMatch**, the rule applies to all blobs within the storage account. Prefix strings don't support wildcard matching. Characters such as `*` and `?` are treated as string literals. | No |
| blobIndexMatch | An array of dictionary values consisting of blob index tag key and value conditions to be matched. Each rule can define up to 10 blob index tag condition. For example, if you want to match all blobs with `Project = Contoso` under `https://myaccount.blob.core.windows.net/` for a rule, the blobIndexMatch is `{"name": "Project","op": "==","value": "Contoso"}`. | If you don't define blobIndexMatch, the rule applies to all blobs within the storage account. | No |

To learn more about the blob index feature together with known issues and limitations, see [Manage and find data on Azure Blob Storage with blob index](storage-manage-find-blobs.md).

### Rule actions

Actions are applied to the filtered blobs when the run condition is met.

Lifecycle management supports tiering and deletion of current versions, previous versions, and blob snapshots. Define at least one action for each rule.

> [!NOTE]
> Tiering is not yet supported in a premium block blob storage account. For all other accounts, tiering is allowed only on block blobs and not for append and page blobs.

| Action                                  | Current Version                            | Snapshot      | Previous Versions |
|-----------------------------------------|--------------------------------------------|---------------|-------------------|
| tierToCool                              | Supported for `blockBlob`                  | Supported     | Supported         |
| tierToCold                              | Supported for `blockBlob`                  | Supported     | Supported         |
| enableAutoTierToHotFromCool<sup>1</sup> | Supported for `blockBlob`                  | Not supported | Not supported     |
| tierToArchive<sup>4</sup>               | Supported for `blockBlob`                  | Supported     | Supported         |
| delete<sup>2,3</sup>                    | Supported for `blockBlob` and `appendBlob` | Supported     | Supported         |

<sup>1</sup> The `enableAutoTierToHotFromCool` action is available only when used with the `daysAfterLastAccessTimeGreaterThan` run condition. That condition is described in the next table.

<sup>2</sup> When applied to an account with a hierarchical namespace enabled, a delete action removes empty directories. If the directory isn't empty, then the delete action removes objects that meet the policy conditions within the first lifecycle policy execution cycle. If that action results in an empty directory that also meets the policy conditions, then that directory will be removed within the next execution cycle, and so on.

<sup>3</sup> A lifecycle management policy will not delete the current version of a blob until any previous versions or snapshots associated with that blob have been deleted. If blobs in your storage account have previous versions or snapshots, then you must include previous versions and snapshots when you specify a delete action as part of the policy.

<sup>4</sup> Only storage accounts that are configured for LRS, GRS, or RA-GRS support moving blobs to the archive tier. The archive tier isn't supported for ZRS, GZRS, or RA-GZRS accounts. This action gets listed based on the redundancy configured for the account. 

> [!NOTE]
> If you define more than one action on the same blob, lifecycle management applies the least expensive action to the blob. For example, action `delete` is cheaper than action `tierToArchive`. Action `tierToArchive` is cheaper than action `tierToCool`.

The run conditions are based on age. Current versions use the last modified time or last access time, previous versions use the version creation time, and blob snapshots use the snapshot creation time to track age.

| Action run condition | Condition value | Description |
|--|--|--|
| daysAfterModificationGreaterThan | Integer value indicating the age in days | The condition for actions on a current version of a blob |
| daysAfterCreationGreaterThan | Integer value indicating the age in days | The condition for actions on the current version or previous version of a blob or a blob snapshot |
| daysAfterLastAccessTimeGreaterThan<sup>1</sup> | Integer value indicating the age in days | The condition for a current version of a blob when access tracking is enabled |
| daysAfterLastTierChangeGreaterThan | Integer value indicating the age in days after last blob tier change time | The minimum duration in days that a rehydrated blob is kept in hot, cool or cold tiers before being returned to the archive tier. This condition applies only to `tierToArchive` actions. |

<sup>1</sup> If [last access time tracking](#move-data-based-on-last-accessed-time) is not enabled, **daysAfterLastAccessTimeGreaterThan** uses the date the lifecycle policy was enabled instead of the `LastAccessTime` property of the blob. This date is also used when the `LastAccessTime` property is a null value. For more information about using last access time tracking, see [Move data based on last accessed time](#move-data-based-on-last-accessed-time).

## Lifecycle policy completed event
The `LifecyclePolicyCompleted` event is generated when the actions defined by a lifecycle management policy are performed. A summary section appears for each action that is included in the policy definition. The following json shows an example `LifecyclePolicyCompleted` event for a policy. Because the policy definition includes the `delete`, `tierToCool`, `tierToCold`, and `tierToArchive` actions, a summary section appears for each one. 


```json
{
    "topic": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/contosoresourcegroup/providers/Microsoft.Storage/storageAccounts/contosostorageaccount",
    "subject": "BlobDataManagement/LifeCycleManagement/SummaryReport",
    "eventType": "Microsoft.Storage.LifecyclePolicyCompleted",
    "eventTime": "2022-05-26T00:00:40.1880331",    
    "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "data": {
        "scheduleTime": "2022/05/24 22:57:29.3260160",
        "deleteSummary": {
            "totalObjectsCount": 16,
            "successCount": 14,
            "errorList": ""
        },
        "tierToCoolSummary": {
            "totalObjectsCount": 0,
            "successCount": 0,
            "errorList": ""
        },
        "tierToColdSummary": {
            "totalObjectsCount": 0,
            "successCount": 0,
            "errorList": ""
        },
        "tierToArchiveSummary": {
            "totalObjectsCount": 0,
            "successCount": 0,
            "errorList": ""
        }
    },
    "dataVersion": "1",
    "metadataVersion": "1"
}
```

The following table describes the schema of the `LifecyclePolicyCompleted` event.

|Field|Type|Description|
|---|---|---|
|scheduleTime|string|The time that the lifecycle policy was scheduled|
|deleteSummary|vector\<byte\>|The results summary of blobs scheduled for delete operation|
|tierToCoolSummary|vector\<byte\>|The results summary of blobs scheduled for tier-to-cool operation|
|tierToColdSummary|vector\<byte\>|The results summary of blobs scheduled for tier-to-cold operation|
|tierToArchiveSummary|vector\<byte\>|The results summary of blobs scheduled for tier-to-archive operation|

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

If last access time tracking is enabled, lifecycle management uses `LastAccessTime` to determine whether the run condition **daysAfterLastAccessTimeGreaterThan** is met. Lifecycle management uses the date the lifecycle policy was enabled instead of `LastAccessTime` in the following cases:

- The value of the `LastAccessTime` property of the blob is a null value.

  > [!NOTE]
  > The `lastAccessedOn` property of the blob is null if a blob hasn't been accessed since last access time tracking was enabled.

- Last access time tracking is not enabled. 

To minimize the effect on read access latency, only the first read of the last 24 hours updates the last access time. Subsequent reads in the same 24-hour period don't update the last access time. If a blob is modified between reads, the last access time is the more recent of the two values.

In the following example, blobs are moved to cool storage if they haven't been accessed for 30 days. The `enableAutoTierToHotFromCool` property is a Boolean value that indicates whether a blob should automatically be tiered from cool back to hot if it's accessed again after being tiered to cool.

> [!TIP]
> If a blob is moved to the cool tier, and then is automatically moved back before 30 days has elapsed, an early deletion fee is charged. Before you set the `enableAutoTierToHotFromCool` property, make sure to analyze the access patterns of your data so you can reduce unexpected charges.

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
> Microsoft recommends that you upload your blobs directly to the archive tier for greater efficiency. You can specify the archive tier in the *x-ms-access-tier* header on the [Put Blob](/rest/api/storageservices/put-blob) or [Put Block List](/rest/api/storageservices/put-block-list) operation. The *x-ms-access-tier* header is supported with REST version 2018-11-09 and newer or the latest blob storage client libraries.

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
            "activedata/"
          ]
        }
      }
    }
  ]
}
```

## Regional availability and pricing

The lifecycle management feature is available in all Azure regions.

Lifecycle management policies are free of charge. Customers are billed for standard operation costs for the [Set Blob Tier](/rest/api/storageservices/set-blob-tier) API calls. Delete operations are free. However, other Azure services and utilities such as [Microsoft Defender for Storage](/azure/defender-for-cloud/defender-for-storage-introduction) may charge for operations that are managed through a lifecycle policy.

Each update to a blob's last access time is billed under the [other operations](https://azure.microsoft.com/pricing/details/storage/blobs/) category. Each last access time update is charged as an "other transaction" at most once every 24 hours per object even if it's accessed 1000s of times in a day. This is separate from read transactions charges.

For more information about pricing, see [Block Blob pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

## Known issues and limitations

- Tiering is not yet supported in a premium block blob storage account. For all other accounts, tiering is allowed only on block blobs and not for append and page blobs.

- A lifecycle management policy must be read or written in full. Partial updates are not supported.

- Each rule can have up to 10 case-sensitive prefixes and up to 10 blob index tag conditions.

- A lifecycle management policy can't change the tier of a blob that uses an encryption scope.

- The delete action of a lifecycle management policy won't work with any blob in an immutable container. With an immutable policy, objects can be created and read, but not modified or deleted. For more information, see [Store business-critical blob data with immutable storage](./immutable-storage-overview.md).

## Frequently asked questions (FAQ)

See [Lifecycle management FAQ](storage-blob-faq.yml#lifecycle-management-policies).

## Next steps

- [Configure a lifecycle management policy](lifecycle-management-policy-configure.md)
- [Hot, Cool, and Archive access tiers for blob data](access-tiers-overview.md)
- [Manage and find data on Azure Blob Storage with blob index](storage-manage-find-blobs.md)
- [Best practices for using blob access tiers](access-tiers-best-practices.md)
