---
title: Lifecycle management policy tiers
titleSuffix: Azure Blob Storage
description: Configure a lifecycle management policy to automatically move data between hot, cool, cold, and archive tiers during the data lifecycle.
author: normesta

ms.author: normesta
ms.date: 03/10/2025
ms.service: azure-blob-storage
ms.topic: conceptual 

---

# Configure a lifecycle management policy for access tiers

Data sets have unique lifecycles. Early in the lifecycle, people access some data often. But the need for access often drops drastically as the data ages. Some data remains idle in the cloud and is rarely accessed once stored. Some data sets expire days or months after creation, while other data sets are actively read and modified throughout their lifetimes. 

Consider a scenario where data is frequently accessed during the early stages of the lifecycle, but only occasionally after two weeks. Beyond the first month, the data set is rarely accessed. In this scenario, hot storage is best during the early stages. Cool storage is most appropriate for occasional access. Archive storage is the best tier option after the data ages over a month. By moving data to the appropriate storage tier based on its age with lifecycle management policy rules, you can design the least expensive solution for your needs.

> [!NOTE]
> Tiering is not yet supported in a premium block blob storage account. For all other accounts, tiering is allowed only on block blobs and not for append and page blobs.

## Move aging data to a cooler tier

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

## Move data based on last accessed time

You can enable last access time tracking to keep a record of when your blob is last read or written and as a filter to manage tiering and retention of your blob data. To learn how to enable last access time tracking, see [Optionally enable access time tracking](lifecycle-management-policy-configure.md#optionally-enable-access-time-tracking).

When last access time tracking is enabled, the blob property called `LastAccessTime` is updated when a blob is read or written. [Get Blob](/rest/api/storageservices/get-blob) and [Put Blob](/rest/api/storageservices/put-blob) operations are considered access operations. [Get Blob Properties](/rest/api/storageservices/get-blob-properties), [Get Blob Metadata](/rest/api/storageservices/get-blob-metadata), and [Get Blob Tags](/rest/api/storageservices/get-blob-tags) aren't access operations, and therefore don't update the last access time. 

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

## Configure a policy to move data back to warmer tier after access

The `enableAutoTierToHotFromCool` action is available only when used with the `daysAfterLastAccessTimeGreaterThan` run condition. That condition is described in the next table.

## Archiving data

Some data stays idle in the cloud and is rarely, if ever, accessed. The following lifecycle policy is configured to archive data shortly after it's ingested. This example transitions block blobs in a container named `archivecontainer` into an archive tier. The transition is accomplished by acting on blobs 0 days after last modified time. 

Only storage accounts that are configured for LRS, GRS, or RA-GRS support moving blobs to the archive tier. The archive tier isn't supported for ZRS, GZRS, or RA-GZRS accounts. This action gets listed based on the redundancy configured for the account. 

> [!IMPORTANT]
> If a data set needs to be readable, do not set a policy to move blobs to the archive tier. Blobs in the archive tier cannot be read unless they are first rehydrated, a process which may be time-consuming and expensive. For more information, see [Overview of blob rehydration from the archive tier](archive-rehydrate-overview.md). If a data set needs to be read often, do not set a policy to move blobs to the cool or cold tiers as this might result in higher transaction costs.

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

## Manage previous versions

For data that is modified and accessed regularly throughout its lifetime, you can enable blob storage versioning to automatically maintain previous versions of an object. You can create a policy to tier previous versions. The version age is determined by evaluating the version creation time. This policy rule moves previous versions within container `activedata` that are 90 days or older after version creation to the cool tier.

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

## Example featured in the overview

The following sample rule filters the account to run the actions on objects that exist inside `sample-container` and start with `blob1`.

- Tier blob to cool tier 30 days after last modification
- Tier blob to archive tier 90 days after last modification

```json
{
  "rules": [
    {
      "enabled": true,
      "name": "sample-rule",
      "type": "Lifecycle",
      "definition": {
        "actions": {
          "baseBlob": {
            "tierToCool": {
              "daysAfterModificationGreaterThan": 30
            },
            "tierToArchive": {
              "daysAfterModificationGreaterThan": 90,
              "daysAfterLastTierChangeGreaterThan": 7
            },
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

## See also

- [Optimize costs by automatically managing the data lifecycle](lifecycle-management-overview.md)
- [Known issues and limitations for lifecycle management policies](lifecycle-management-overview.md#known-issues-and-limitations)
- [Access tiers for blob data](access-tiers-overview.md)