---
title: Lifecycle management policies that transition blobs between tiers
titleSuffix: Azure Blob Storage
description: This article shows examples of how to configure a lifecycle management policy to transition blobs between tiers.
author: normesta

ms.author: normesta
ms.date: 06/13/2025
ms.service: azure-blob-storage
ms.topic: conceptual 

---

# Lifecycle management policies that transition blobs between tiers

You can use Lifecycle management policies to transition blobs to cost-efficient access tiers based on their use patterns. This article contains examples of policy definitions that transition blobs between tiers.

For general information about Azure Storage lifecycle management policies, see [Azure Blob Storage lifecycle management overview](lifecycle-management-overview.md).

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

> [!NOTE]
> The **baseBlob** element in a lifecycle management policy refers to the current version of a blob.

## Move data based on the last accessed time

In the following example, blobs are moved to cool storage if they haven't been accessed for 30 days. The `enableAutoTierToHotFromCool` property is a Boolean value that indicates whether a blob should automatically be tiered from cool back to hot if it's accessed again after being tiered to cool.

> [!TIP]
> If a blob is moved to the cool tier, and then is automatically moved back before 30 days has elapsed, an early deletion fee is charged. Before you set the `enableAutoTierToHotFromCool` property, make sure to analyze the access patterns of your data so you can reduce unexpected charges. Automatic tiering from cool to hot upon blob access is limited to once in 30 days. This safeguard is in place to help you avoid multiple early deletion penalties from the cool tier. If the object tiers back to cool due to the policy, any transactions on the blob is charged at the cool tier prices. It is cost-efficient to keep the blob in hot tier if it needs to be automatically tiered up more than once in a 30-day period.

Enabling a rule with `enableAutoTierToHotFromCool` applies only to objects that are tiered down with this rule. The `enableAutoTierToHotFromCool` property can't be enabled for blobs that are already in the cool tier. Therefore, the access tier of those blobs won't automatically change to hot when they are accessed.

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

## Archiving data after ingest

Some data stays idle in the cloud and is rarely, if ever, accessed. The following lifecycle policy is configured to archive data shortly after it's ingested. This example transitions block blobs in a container named `archivecontainer` into an archive tier. The transition is accomplished by acting on blobs 0 days after last modified time. 

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

## Managing previous versions

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

> [!NOTE]
> The **version** element in a lifecycle management policy refers to a previous version.

## See also

- [Azure Blob Storage lifecycle management overview](lifecycle-management-overview.md)
- [Lifecycle management policies that delete blobs](lifecycle-management-policy-delete.md)
- [Lifecycle management policy monitoring](lifecycle-management-policy-monitor.md)
- [Access tiers for blob data](access-tiers-overview.md)