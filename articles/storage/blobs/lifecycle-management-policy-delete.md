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

Intro para here

- The delete action of a lifecycle management policy won't work with any blob in an immutable container. With an immutable policy, objects can be created and read, but not modified or deleted. For more information, see [Store business-critical blob data with immutable storage](./immutable-storage-overview.md).


## Delete action

When applied to an account with a hierarchical namespace enabled, a delete action removes empty directories. If the directory isn't empty, then the delete action removes objects that meet the policy conditions within the first lifecycle policy execution cycle. If that action results in an empty directory that also meets the policy conditions, then that directory will be removed within the next execution cycle, and so on.

A lifecycle management policy will not delete the current version of a blob until any previous versions or snapshots associated with that blob have been deleted. If blobs in your storage account have previous versions or snapshots, then you must include previous versions and snapshots when you specify a delete action as part of the policy.

## Examples of lifecycle policies

The following examples demonstrate how to address common scenarios with lifecycle policy rules.


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

## Example featured in the overview

The following sample rule filters the account to run the actions on objects that exist inside `sample-container` and start with `blob1`.

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

## See also

- [Optimize costs by automatically managing the data lifecycle](lifecycle-management-overview.md)
- [Known issues and limitations for lifecycle management policies](lifecycle-management-overview.md#known-issues-and-limitations)
- [Access tiers for blob data](access-tiers-overview.md)
