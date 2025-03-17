---
title: Lifecycle management policy deletes
titleSuffix: Azure Blob Storage
description: Configure a lifecycle management policy to automatically delete data during the data lifecycle.
author: normesta

ms.author: normesta
ms.date: 03/10/2025
ms.service: azure-blob-storage
ms.topic: conceptual 

---

# Configure a lifecycle management policy to delete data

You can use Lifecycle management policies to transition blobs to delete blob at the end of their lifecycle. 

This article contains examples of policy definitions that delete blobs.

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

> [!NOTE]
> The **baseBlob** element in a lifecycle management policy refers to the current version of a blob.

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

- [Optimize costs by automatically managing the data lifecycle](lifecycle-management-overview.md)
- [Known issues and limitations for lifecycle management policies](lifecycle-management-overview.md#known-issues-and-limitations)
- [Access tiers for blob data](access-tiers-overview.md)
