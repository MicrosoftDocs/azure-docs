---
title: Optimize costs by automating Azure Blob Storage access tiers
description: Create automated rules for moving data between hot, cool, and archive tiers.
author: twooley

ms.author: twooley
ms.date: 04/23/2021
ms.service: storage
ms.subservice: common
ms.topic: conceptual
ms.reviewer: yzheng 
ms.custom: "devx-track-azurepowershell, references_regions"
---

# Optimize costs by automating Azure Blob Storage access tiers

Data sets have unique lifecycles. Early in the lifecycle, people access some data often. But the need for access drops drastically as the data ages. Some data stays idle in the cloud and is rarely accessed once stored. Some data expires days or months after creation, while other data sets are actively read and modified throughout their lifetimes. Azure Blob Storage lifecycle management offers a rich, rule-based policy for GPv2 and blob storage accounts. Use the policy to transition your data to the appropriate access tiers or expire at the end of the data's lifecycle.

The lifecycle management policy lets you:

- Transition blobs from cool to hot immediately if accessed to optimize for performance
- Transition blobs, blob versions, and blob snapshots to a cooler storage tier (hot to cool, hot to archive, or cool to archive) if not accessed or modified for a period of time to optimize for cost
- Delete blobs, blob versions, and blob snapshots at the end of their lifecycles
- Define rules to be run once per day at the storage account level
- Apply rules to containers or a subset of blobs (using name prefixes or [blob index tags](storage-manage-find-blobs.md) as filters)

Consider a scenario where data gets frequent access during the early stages of the lifecycle, but only occasionally after two weeks. Beyond the first month, the data set is rarely accessed. In this scenario, hot storage is best during the early stages. Cool storage is most appropriate for occasional access. Archive storage is the best tier option after the data ages over a month. By adjusting storage tiers in respect to the age of data, you can design the least expensive storage options for your needs. To achieve this transition, lifecycle management policy rules are available to move aging data to cooler tiers.

[!INCLUDE [storage-multi-protocol-access-preview](../../../includes/storage-multi-protocol-access-preview.md)]

>[!NOTE]
>If you need data to stay readable, for example, when used by StorSimple, do not set a policy to move blobs to the Archive tier.

## Availability and pricing

The lifecycle management feature is available in all Azure regions for general purpose v2 (GPv2) accounts, blob storage accounts, premium block blobs storage accounts, and Azure Data Lake Storage Gen2 accounts. In the Azure portal, you can upgrade an existing general purpose (GPv1) account to a GPv2 account. For more information about storage accounts, see [Azure storage account overview](../common/storage-account-overview.md).

The lifecycle management feature is free of charge. Customers are charged the regular operation cost for the [Set Blob Tier](/rest/api/storageservices/set-blob-tier) API calls. Delete operation is free. For more information about pricing, see [Block Blob pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

## Add or remove a policy

You can add, edit, or remove a policy by using any of the following methods:

- The Azure portal
- Azure PowerShell
   - [Add-AzStorageAccountManagementPolicyAction](/powershell/module/az.storage/add-azstorageaccountmanagementpolicyaction)
   - [New-AzStorageAccountManagementPolicyFilter](/powershell/module/az.storage/new-azstorageaccountmanagementpolicyfilter)
   - [New-AzStorageAccountManagementPolicyRule](/powershell/module/az.storage/new-azstorageaccountmanagementpolicyrule)
   - [Set-AzStorageAccountManagementPolicy](/powershell/module/az.storage/set-azstorageaccountmanagementpolicy)
   - [Remove-AzStorageAccountManagementPolicy](/powershell/module/az.storage/remove-azstorageaccountmanagementpolicy)
- [Azure CLI](/cli/azure/storage/account/management-policy)
- [REST APIs](/rest/api/storagerp/managementpolicies)

A policy can be read or written in full. Partial updates are not supported.

> [!NOTE]
> If you enable firewall rules for your storage account, lifecycle management requests may be blocked. You can unblock these requests by providing exceptions for trusted Microsoft services. For more information, see the Exceptions section in [Configure firewalls and virtual networks](../common/storage-network-security.md#exceptions).

This article shows how to manage policy by using the portal and PowerShell methods.

# [Portal](#tab/azure-portal)

There are two ways to add a policy through the Azure portal.

- [Azure portal List view](#azure-portal-list-view)
- [Azure portal Code view](#azure-portal-code-view)

#### Azure portal List view

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the Azure portal, search for and select your storage account.

1. Under **Blob service**, select **Lifecycle Management** to view or change your rules.

1. Select the **List View** tab.

1. Select **Add a rule** and name your rule on the **Details** form. You can also set the **Rule scope**, **Blob type**, and **Blob subtype** values. The following example sets the scope to filter blobs. This causes the **Filter set** tab to be added.

   :::image type="content" source="media/storage-lifecycle-management-concepts/lifecycle-management-details.png" alt-text="Lifecycle management add a rule details page in Azure portal":::

1. Select **Base blobs** to set the conditions for your rule. In the following example, blobs are moved to cool storage if they haven't been modified for 30 days.

   :::image type="content" source="media/storage-lifecycle-management-concepts/lifecycle-management-base-blobs.png" alt-text="Lifecycle management base blobs page in Azure portal":::

   The **Last accessed** option is available in preview in the following regions:

    - France Central
    - Canada East
    - Canada Central

   > [!IMPORTANT]
   > The last access time tracking preview is for non-production use only. Production service-level agreements (SLAs) are not currently available.
   
   To use the **Last accessed** option, select **Access tracking enabled** on the **Lifecycle Management** page in the Azure portal. For more information about the **Last accessed** option, see [Move data based on last accessed date (preview)](#move-data-based-on-last-accessed-date-preview).

1. If you selected **Limit blobs with filters** on the **Details** page, select **Filter set** to add an optional filter. The following example filters on blobs in the *mylifecyclecontainer* container that begin with "log".

   :::image type="content" source="media/storage-lifecycle-management-concepts/lifecycle-management-filter-set.png" alt-text="Lifecycle management filter set page in Azure portal":::

1. Select **Add** to add the new policy.

#### Azure portal Code view
1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the Azure portal, search for and select your storage account.

1. Under **Blob service**, select **Lifecycle Management** to view or change your policy.

1. The following JSON is an example of a policy that can be pasted into the **Code View** tab.

   ```json
   {
     "rules": [
       {
         "enabled": true,
         "name": "move-to-cool",
         "type": "Lifecycle",
         "definition": {
           "actions": {
             "baseBlob": {
               "tierToCool": {
                 "daysAfterModificationGreaterThan": 30
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
     ]
   }
   ```

1. Select **Save**.

1. For more information about this JSON example, see the [Policy](#policy) and [Rules](#rules) sections.

# [PowerShell](#tab/azure-powershell)

The following PowerShell script can be used to add a policy to your storage account. The `$rgname` variable must be initialized with your resource group name. The `$accountName` variable must be initialized with your storage account name.

```powershell
#Install the latest module
Install-Module -Name Az -Repository PSGallery

#Initialize the following with your resource group and storage account names
$rgname = ""
$accountName = ""

#Create a new action object
$action = Add-AzStorageAccountManagementPolicyAction -BaseBlobAction Delete -daysAfterModificationGreaterThan 2555
$action = Add-AzStorageAccountManagementPolicyAction -InputObject $action -BaseBlobAction TierToArchive -daysAfterModificationGreaterThan 90
$action = Add-AzStorageAccountManagementPolicyAction -InputObject $action -BaseBlobAction TierToCool -daysAfterModificationGreaterThan 30
$action = Add-AzStorageAccountManagementPolicyAction -InputObject $action -SnapshotAction Delete -daysAfterCreationGreaterThan 90

# Create a new filter object
# PowerShell automatically sets BlobType as “blockblob” because it is the only available option currently
$filter = New-AzStorageAccountManagementPolicyFilter -PrefixMatch ab,cd

#Create a new rule object
#PowerShell automatically sets Type as “Lifecycle” because it is the only available option currently
$rule1 = New-AzStorageAccountManagementPolicyRule -Name Test -Action $action -Filter $filter

#Set the policy
Set-AzStorageAccountManagementPolicy -ResourceGroupName $rgname -StorageAccountName $accountName -Rule $rule1
```

# [Template](#tab/template)

You can define lifecycle management by using Azure Resource Manager templates. Here is a sample template to deploy a RA-GRS GPv2 storage account with a lifecycle management policy.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {},
  "variables": {
    "storageAccountName": "[uniqueString(resourceGroup().id)]"
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "name": "[variables('storageAccountName')]",
      "location": "[resourceGroup().location]",
      "apiVersion": "2019-04-01",
      "sku": {
        "name": "Standard_RAGRS"
      },
      "kind": "StorageV2",
      "properties": {
        "networkAcls": {}
      }
    },
    {
      "name": "[concat(variables('storageAccountName'), '/default')]",
      "type": "Microsoft.Storage/storageAccounts/managementPolicies",
      "apiVersion": "2019-04-01",
      "dependsOn": [
        "[variables('storageAccountName')]"
      ],
      "properties": {
        "policy": {...}
      }
    }
  ],
  "outputs": {}
}
```

---

## Policy

A lifecycle management policy is a collection of rules in a JSON document:

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

A policy is a collection of rules:

| Parameter name | Parameter type | Notes |
|----------------|----------------|-------|
| `rules`        | An array of rule objects | At least one rule is required in a policy. You can define up to 100 rules in a policy.|

Each rule within the policy has several parameters:

| Parameter name | Parameter type | Notes | Required |
|----------------|----------------|-------|----------|
| `name`         | String |A rule name can include up to 256 alphanumeric characters. Rule name is case-sensitive. It must be unique within a policy. | True |
| `enabled`      | Boolean | An optional boolean to allow a rule to be temporary disabled. Default value is true if it's not set. | False | 
| `type`         | An enum value | The current valid type is `Lifecycle`. | True |
| `definition`   | An object that defines the lifecycle rule | Each definition is made up of a filter set and an action set. | True |

## Rules

Each rule definition includes a filter set and an action set. The [filter set](#rule-filters) limits rule actions to a certain set of objects within a container or objects names. The [action set](#rule-actions) applies the tier or delete actions to the filtered set of objects.

### Sample rule

The following sample rule filters the account to run the actions on objects that exist inside `container1` and start with `foo`.

>[!NOTE]
>- Lifecycle management supports block blob and append blob types.<br>
>- Lifecycle management does not affect system containers like $logs and $web.

- Tier blob to cool tier 30 days after last modification
- Tier blob to archive tier 90 days after last modification
- Delete blob 2,555 days (seven years) after last modification
- Delete previous blob versions 90 days after creation

```json
{
  "rules": [
    {
      "enabled": true,
      "name": "rulefoo",
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
              "daysAfterModificationGreaterThan": 90
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
            "container1/foo"
          ]
        }
      }
    }
  ]
}
```

### Rule filters

Filters limit rule actions to a subset of blobs within the storage account. If more than one filter is defined, a logical `AND` runs on all filters.

Filters include:

| Filter name | Filter type | Notes | Is Required |
|-------------|-------------|-------|-------------|
| blobTypes   | An array of predefined enum values. | The current release supports `blockBlob` and `appendBlob`. Only delete is supported for `appendBlob`, set tier is not supported. | Yes |
| prefixMatch | An array of strings for prefixes to be matched. Each rule can define up to 10 prefixes. A prefix string must start with a container name. For example, if you want to match all blobs under `https://myaccount.blob.core.windows.net/container1/foo/...` for a rule, the prefixMatch is `container1/foo`. | If you don't define prefixMatch, the rule applies to all blobs within the storage account. | No |
| blobIndexMatch | An array of dictionary values consisting of Blob Index tag key and value conditions to be matched. Each rule can define up to 10 Blob Index tag condition. For example, if you want to match all blobs with `Project = Contoso` under `https://myaccount.blob.core.windows.net/` for a rule, the blobIndexMatch is `{"name": "Project","op": "==","value": "Contoso"}`. | If you don't define blobIndexMatch, the rule applies to all blobs within the storage account. | No |

> [!NOTE]
> Blob Index is in public preview, and is available in the **Canada Central**, **Canada East**, **France Central**, and **France South** regions. To learn more about this feature along with known issues and limitations, see [Manage and find data on Azure Blob Storage with Blob Index (Preview)](storage-manage-find-blobs.md).

### Rule actions

Actions are applied to the filtered blobs when the run condition is met.

Lifecycle management supports tiering and deletion of blobs, previous blob versions, and blob snapshots. Define at least one action for each rule on base blobs, previous blob versions, or blob snapshots.

| Action                      | Base Blob                                  | Snapshot      | Version
|-----------------------------|--------------------------------------------|---------------|---------------|
| tierToCool                  | Supported for `blockBlob`                  | Supported     | Supported     |
| enableAutoTierToHotFromCool | Supported for `blockBlob`                  | Not supported | Not supported |
| tierToArchive               | Supported for `blockBlob`                  | Supported     | Supported     |
| delete                      | Supported for `blockBlob` and `appendBlob` | Supported     | Supported     |

>[!NOTE]
>If you define more than one action on the same blob, lifecycle management applies the least expensive action to the blob. For example, action `delete` is cheaper than action `tierToArchive`. Action `tierToArchive` is cheaper than action `tierToCool`.

The run conditions are based on age. Base blobs use the last modified time, blob versions use the version creation time, and blob snapshots use the snapshot creation time to track age.

| Action run condition               | Condition value                          | Description                                                                      |
|------------------------------------|------------------------------------------|----------------------------------------------------------------------------------|
| daysAfterModificationGreaterThan   | Integer value indicating the age in days | The condition for base blob actions                                              |
| daysAfterCreationGreaterThan       | Integer value indicating the age in days | The condition for blob version and blob snapshot actions                         |
| daysAfterLastAccessTimeGreaterThan | Integer value indicating the age in days | (preview) The condition for base blob actions when last accessed time is enabled |

## Examples

The following examples demonstrate how to address common scenarios with lifecycle policy rules.

### Move aging data to a cooler tier

This example shows how to transition block blobs prefixed with `container1/foo` or `container2/bar`. The policy transitions blobs that haven't been modified in over 30 days to cool storage, and blobs not modified in 90 days to the archive tier:

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
          "prefixMatch": [ "container1/foo", "container2/bar" ]
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

### Move data based on last accessed date (preview)

You can enable last access time tracking to keep a record of when your blob is last read or written. You can use last access time as a filter to manage tiering and retention of your blob data.

The **Last accessed** option is available in preview in the following regions:

 - France Central
 - Canada East
 - Canada Central

> [!IMPORTANT]
> The last access time tracking preview is for non-production use only. Production service-level agreements (SLAs) are not currently available.

In order to use the **Last accessed** option, select **Access tracking enabled** on the **Lifecycle Management** page in the Azure portal.

#### How last access time tracking works

When last access time tracking is enabled, the blob property called `LastAccessTime` is updated when a blob is read or written. A [Get Blob](/rest/api/storageservices/get-blob) operation is considered an access operation. [Get Blob Properties](/rest/api/storageservices/get-blob-properties), [Get Blob Metadata](/rest/api/storageservices/get-blob-metadata), and [Get Blob Tags](/rest/api/storageservices/get-blob-tags) are not access operations, and therefore don't update the last access time.

To minimize the impact on read access latency, only the first read of the last 24 hours updates the last access time. Subsequent reads in the same 24-hour period do not update the last access time. If a blob is modified between reads, the last access time is the more recent of the two values.

In the following example, blobs are moved to cool storage if they haven't been accessed for 30 days. The `enableAutoTierToHotFromCool` property is a Boolean value that indicates if a blob should automatically be tiered from cool back to hot if it is accessed again after being tiered to cool.

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

#### Storage account support

Last access time tracking is available for the following types of storage accounts:

 - General-purpose v2 storage accounts
 - Block blob storage accounts
 - Blob storage accounts

If your storage account is a general-purpose v1 account, use the Azure portal to upgrade to a general-purpose v2 account.

Storage accounts with a hierarchical namespace enabled for use with Azure Data Lake Storage Gen2 are now supported.

#### Pricing and billing

Each last access time update is considered an [other operation](https://azure.microsoft.com/pricing/details/storage/blobs/).

### Archive data after ingest

Some data stays idle in the cloud and is rarely, if ever, accessed once stored. The following lifecycle policy is configured to archive data shortly after it is ingested. This example transitions block blobs in the storage account within container `archivecontainer` into an archive tier. The transition is accomplished by acting on blobs 0 days after last modified time:

> [!NOTE] 
> It is recommended to upload your blobs directly the archive tier to be more efficient. You can use the x-ms-access-tier header for [PutBlob](/rest/api/storageservices/put-blob) or [PutBlockList](/rest/api/storageservices/put-block-list) with REST version 2018-11-09 and newer or our latest blob storage client libraries. 

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
              "tierToArchive": { "daysAfterModificationGreaterThan": 0 }
          }
        }
      }
    }
  ]
}

```

### Expire data based on age

Some data is expected to expire days or months after creation. You can configure a lifecycle management policy to expire data by deletion based on data age. The following example shows a policy that deletes all block blobs older than 365 days.

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

### Delete data with Blob Index tags
Some data should only be expired if explicitly marked for deletion. You can configure a lifecycle management policy to expire data that are tagged with blob index key/value attributes. The following example shows a policy that deletes all block blobs tagged with `Project = Contoso`. To learn more about the Blob Index, see [Manage and find data on Azure Blob Storage with Blob Index (Preview)](storage-manage-find-blobs.md).

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

### Manage versions

For data that is modified and accessed regularly throughout its lifetime, you can enable blob storage versioning to automatically maintain previous versions of an object. You can create a policy to tier or delete previous versions. The version age is determined by evaluating the version creation time. This policy rule tiers previous versions within container `activedata` that are 90 days or older after version creation to cool tier, and deletes previous versions that are 365 days or older.

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

## FAQ

**I created a new policy, why do the actions not run immediately?**

The platform runs the lifecycle policy once a day. Once you configure a policy, it can take up to 24 hours for some actions to run for the first time.

**If I update an existing policy, how long does it take for the actions to run?**

The updated policy takes up to 24 hours to go into effect. Once the policy is in effect, it could take up to 24 hours for the actions to run. Therefore, the policy actions may take up to 48 hours to complete.

**I manually rehydrated an archived blob, how do I prevent it from being moved back to the Archive tier temporarily?**

When a blob is moved from one access tier to another, its last modification time doesn't change. If you manually rehydrate an archived blob to hot tier, it would be moved back to archive tier by the lifecycle management engine. Disable the rule that affects this blob temporarily to prevent it from being archived again. Re-enable the rule when the blob can be safely moved back to archive tier. You may also copy the blob to another location if it needs to stay in hot or cool tier permanently.

## Next steps

Learn how to recover data after accidental deletion:

- [Soft delete for Azure Storage blobs](./soft-delete-blob-overview.md)

Learn how to manage and find data with Blob Index:

- [Manage and find data on Azure Blob Storage with Blob Index](storage-manage-find-blobs.md)