---
title: Managing the Azure Storage Lifecycle
description: Learn how to create lifecycle policy rules to transition againg data from hot to cool and archive tiers.
services: storage
author: yzheng-msft
ms.service: storage
ms.topic: article
ms.date: 04/30/2018
ms.author: yzheng
ms.component: common
---

# Managing the Azure Blob Storage Lifecycle (Preview)

Data sets have unique lifecycles. Some data is accessed often early in the lifecycle, but the need for access drops drastically as the data ages. Some data remain idle in the cloud and is rarely accessed once stored. Some data expire days or months after creation while other data sets are actively read and modified throughout their lifetimes. Azure Blob Storage lifecycle management (Preview) offers a rich, rule-based policy which you can use to transition your data to the best access tier and to expire data at the end of its lifecycle.

Lifecycle management policy helps you:

- Transition blobs to a cooler storage tier (Hot to Cool, Hot to Archive, or Cool to Archive) to optimize for performance and cost
- Delete blobs at the end of their lifecycles
- Define rules to be executed once a day at the storage account level (it supports both GPv2 and Blob storage accounts)
- Apply rules to containers or a subset of blobs (using prefixes as filters)

Consider a set of data that is accessed frequently during the early stage of the lifecycle, is needed only occasionally after two weeks, and is rarely accessed after a month and beyond. In this scenario, hot storage is best during the early stages, cool storage is most appropriate for occasional access, and archive storage is the best tier option after the data ages over a month. By adjusting storage tiers in respect to the age of data, you can design the least expensive storage options for your needs. To achieve this transition, lifecycle management policies are available to move aging data to cooler tiers.

## Storage account support

Lifecycle management policy is available with both General Purpose v2 (GPv2) account and Blob Storage account. You can convert an existing General Purpose (GPv1) account to a GPv2 account via a simple one-click process in the Azure portal. For more information about storage accounts, see [Azure storage account overview](../common/storage-account-overview.md) to learn more.  

## Pricing 

Lifecycle management feature is free of charge in preview. Customers are charged the regular operation cost for the [List Blobs](https://docs.microsoft.com/rest/api/storageservices/list-blobs) and [Set Blob Tier](https://docs.microsoft.com/rest/api/storageservices/set-blob-tier) API calls. See [Block Blob pricing](https://azure.microsoft.com/pricing/details/storage/blobs/) to learn more about pricing.

## Register for preview 
To enroll in public preview, you will need to submit a request to register this feature to your subscription. After your request is approved (within a few days), any existing and new GPv2 or Blob Storage account in West US 2, West Central US, and West Europe will have the feature enabled. During preview, only block blob is supported. As with most previews, this feature should not be used for production workloads until it reaches GA.

To submit a request, run the following PowerShell or CLI commands.

### PowerShell

To submit a request:

```powershell
Register-AzureRmProviderFeature -FeatureName DLM -ProviderNamespace Microsoft.Storage 
```
You can check the registration approval status with the following command:
```powershell
Get-AzureRmProviderFeature -FeatureName DLM -ProviderNamespace Microsoft.Storage
```
If the feature is approved and properly registered, you should receive the "Registered" state.

### Azure CLI

To submit a request: 
```cli
az feature register --namespace Microsoft.Storage --name DLM
```
You can check the registration approval status with the following command:
```cli
az feature show --namespace Microsoft.Storage --name DLM
```
If the feature is approved and properly registered, you should receive the "Registered" state. 


## Add or remove policies 

You can add, edit, or remove a policy using Azure portal, [PowerShell](https://www.powershellgallery.com/packages/AzureRM.Storage/5.0.3-preview), [REST APIs](https://docs.microsoft.com/rest/api/storagerp/storageaccounts/createorupdatemanagementpolicies), or client tools in the following languages: [.NET](https://www.nuget.org/packages/Microsoft.Azure.Management.Storage/8.0.0-preview), [Python](https://pypi.org/project/azure-mgmt-storage/2.0.0rc3/), [Node.js]( https://www.npmjs.com/package/azure-arm-storage/v/5.0.0), [Ruby](	https://rubygems.org/gems/azure_mgmt_storage/versions/0.16.2). 

### Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).

2. To navigate to your storage account, select All Resources, then select your storage account.

3. In the Settings blade, click **Lifecycle Management** grouped under Blob Service to view and/or change policies.

### PowerShell

```powershell
$rules = '{ ... }' 

Set-AzureRmStorageAccountManagementPolicy -ResourceGroupName [resourceGroupName] -StorageAccountName [storageAccountName] -Policy $rules 

Get-AzureRmStorageAccountManagementPolicy -ResourceGroupName [resourceGroupName] -StorageAccountName [storageAccountName]
```

> [!NOTE]
If you enable firewall rules for your storage account, lifecycle management requests may be blocked. You can unblock it by providing exceptions. For more information, see the Exceptions section at [Configure firewalls and virtual networks](https://docs.microsoft.com/azure/storage/common/storage-network-security#exceptions).

## Policies

A lifecycle management policy is a collection of rules in a JSON document:

```json
{
  "version": "0.5",
  "rules": [
    {
      "name": "rule1",
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


Within a policy, two parameters are required:

| Parameter name | Parameter type | Notes |
|----------------|----------------|-------|
| version        | A string expressed as `x.x` | The preview version number is 0.5 |
| rules          | An array of rule objects | At least one rule is required in each policy. During preview, you can specify up to 4 rules per policy. |

Parameters required within a rule are:

| Parameter name | Parameter type | Notes |
|----------------|----------------|-------|
| Name           | String | A rule name can contain any combination of alpha numeric characters. Rule name is case-sensitive. It must be unique within a policy. |
| type           | An enum value | The valid value for preview is `Lifecycle` |
| definition     | An object that defines the lifecycle rule | Each definition is made up with a filter set and an action set. |

## Rules

Each rule definition includes a filter set and an action set. The following sample rule modifies the tier for base block blobs with prefix `container1/foo`. In the policy, these rules are defined as:

- Tier blob to cool storage 30 days after last modification
- Tier blob to Archive storage 90 days after last modification
- Delete blob 2,555 days (7 years) after last modification
- Delete blob snapshots 90 days after snapshot creation

```json
{
  "version": "0.5",
  "rules": [ 
    {
      "name": "ruleFoo", 
      "type": "Lifecycle", 
      "definition": {
        "filters": {
          "blobTypes": [ "blockBlob" ],
          "prefixMatch": [ "container1/foo" ]
        },
        "actions": {
          "baseBlob": {
            "tierToCool": { "daysAfterModificationGreaterThan": 30 },
            "tierToArchive": { "daysAfterModificationGreaterThan": 90 },
            "delete": { "daysAfterModificationGreaterThan": 2555 }
          },
          "snapshot": {
            "delete": { "daysAfterCreationGreaterThan": 90 }
          }
        }
      }
    }
  ]
}

```

### Rule filters

Filters limit rule actions to a subset of blobs within the storage account. If multiple filters are defined, a logical `AND` is performed on all filters.

During preview, valid filters include:

| Filter name | Filter type | Notes | Is Required |
|-------------|-------------|-------|-------------|
| blobTypes   | An array of predefined enum values. | For the preview release, only `blockBlob` is supported. | Yes |
| prefixMatch | An array of strings for prefixes to be match. A prefix string must start with a container name. For example, if all blobs under "https://myaccount.blob.core.windows.net/mycontainer/mydir/..." should be matched for a rule, the prefix is "mycontainer/mydir". | If it isn’t defined, this rule applies to all blobs within the account. | No |

### Rule actions

Actions are applied to the filtered blobs when the execution condition is met.

In preview, lifecycle management supports tiering and deletion of blob and deletion of blob snapshots. Each rule must have at least one action defined on blobs or blob snapshots.

| Action        | Base Blob                                   | Snapshot      |
|---------------|---------------------------------------------|---------------|
| tierToCool    | Support blobs currently at Hot tier         | Not supported |
| tierToArchive | Support blobs currently at Hot or Cool tier | Not supported |
| delete        | Supported                                   | Supported     |

>[!NOTE] 
If more than one action is defined on the same blob, lifecycle management applies the least expensive action to the blob. (e.g., Action `delete` is cheaper than action `tierToArchive`. Action `tierToArchive` is cheaper than action `tierToCool`.)

In preview, the action execution conditions are based on age. Base blob uses last modified time to track age and blob snapshots uses snapshot creation time to track age.

| Action execution condition | Condition value | Description |
|----------------------------|-----------------|-------------|
| daysAfterModificationGreaterThan | Integer value indicating the age in days | Valid condition for base blob actions |
| daysAfterCreationGreaterThan     | Integer value indicating the age in days | Valid condition for blob snapshot actions | 

## Examples
The following examples demonstrate how to address common scenarios with lifecycle policy rules.

### Move aging data to a cooler tier

The following example demonstrates how to transition block blobs prefixed with `container1/foo` or `container2/bar`. The policy transitions blobs that haven't been modified in over 30 days to cool storage, and blobs not modified in 90 days to the archive tier:

```json
{
  "version": "0.5",
  "rules": [ 
    {
      "name": "agingRule", 
      "type": "Lifecycle", 
      "definition": 
        {
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

### Archive data at ingest 

Some data remains idle in the cloud and is rarely, if ever, accessed once stored. This data is best to be archived immediately once it is ingested. The following lifecycle policy is configured to archive data at ingest. This example transitions block blobs in the storage account within container `archivecontainer` immediately into an archive tier. The immediate transition is accomplished by acting on blobs 0 days after last modified time:

```json
{
  "version": "0.5",
  "rules": [ 
    {
      "name": "archiveRule", 
      "type": "Lifecycle", 
      "definition": 
        {
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

Some data is expected to expire days or months after creation to reduce costs or comply with government regulations. A lifecycle management policy can be set up to expire data by deletion based on data age. The following example shows a policy that deletes all block blobs (with no prefix specified) older than 365 days.

```json
{
  "version": "0.5",
  "rules": [ 
    {
      "name": "expirationRule", 
      "type": "Lifecycle", 
      "definition": 
        {
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

### Delete old snapshots

For data that is modified and accessed regularly throughout its lifetime, snapshots are often used to track older versions of the data. You can create a policy that deletes old snapshots based on snapshot age. The snapshot age is determined by evaluating the snapshot creation time. This policy rule deletes block blob snapshots within container `activedata` that are 90 days or older after snapshot creation.

```json
{
  "version": "0.5",
  "rules": [ 
    {
      "name": "snapshotRule", 
      "type": "Lifecycle", 
      "definition": 
        {
          "filters": {
            "blobTypes": [ "blockBlob" ],
            "prefixMatch": [ "activedata" ]
          },
          "actions": {            
            "snapshot": {
              "delete": { "daysAfterCreationGreaterThan": 90 }
            }
          }
        }      
    }
  ]
}
```

## Next steps

Learn how to recover data after accidental deletion:

- [Soft delete for Azure Storage blobs ](../blobs/storage-blob-soft-delete.md)
