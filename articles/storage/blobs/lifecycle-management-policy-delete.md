---
title: Lifecycle management policies that delete blobs
titleSuffix: Azure Blob Storage
description: This article shows examples of how to configure a lifecycle management policy to delete blobs.
author: normesta

ms.author: normesta
ms.date: 06/13/2025
ms.service: azure-blob-storage
ms.topic: conceptual 

# Customer intent: "As a data administrator, I want to configure lifecycle management policies for blob storage, so that I can automate the deletion of expired or tagged data to optimize storage use and manage data retention effectively."
---

# Lifecycle management policies that delete blobs

You can use lifecycle management policies to transition blobs to delete blob at the end of their lifecycle. This article contains examples of policy definitions that delete blobs.

For general information about Azure Storage lifecycle management policies, see [Azure Blob Storage lifecycle management overview](lifecycle-management-overview.md).

## Expire data based on age

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

> [!NOTE]
> The **baseBlob** element in a lifecycle management policy refers to the current version of a blob.

## Delete data with blob index tags

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

> [!NOTE]
> The **baseBlob** element in a lifecycle management policy refers to the current version of a blob.

## Manage previous versions

For data that is modified and accessed regularly throughout its lifetime, you can enable blob storage versioning to automatically maintain previous versions of an object. You can create a policy to delete previous versions. The version age is determined by evaluating the version creation time. This policy rule deletes previous versions that are 365 days or older.

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

> [!NOTE]
> The **version** element in a lifecycle management policy refers to a previous version.

## See also

- [Azure Blob Storage lifecycle management overview](lifecycle-management-overview.md)
- [Lifecycle management policies that transition blobs between tiers](lifecycle-management-policy-access-tiers.md)
- [Lifecycle management policy monitoring](lifecycle-management-policy-monitor.md)
- [Access tiers for blob data](access-tiers-overview.md)
