---
title: Managing the Azure Storage Lifecycle
description: Learn how to create lifecycle policy rules to transition aging data from Hot to Cool and Archive tiers.
services: storage
author: yzheng-msft
ms.service: storage
ms.topic: article
ms.date: 11/04/2018
ms.author: yzheng
ms.subservice: common
---

# Managing the Azure Blob storage Lifecycle (Preview)

Data sets have unique lifecycles. Early in the lifecycle, people access some data often. But the need for access drops drastically as the data ages. Some data stays idle in the cloud and is rarely accessed once stored. Some data expires days or months after creation, while other data sets are actively read and modified throughout their lifetimes. Azure Blob storage lifecycle management (Preview) offers a rich, rule-based policy for GPv2 and Blob storage accounts. Use the policy to transition your data to the appropriate access tiers or expire at the end of the data's lifecycle.

The lifecycle management policy lets you:

- Transition blobs to a cooler storage tier (hot to cool, hot to archive, or cool to archive) to optimize for performance and cost
- Delete blobs at the end of their lifecycles
- Define rules to be run once per day at the storage account level
- Apply rules to containers or a subset of blobs (using prefixes as filters)

Consider the scenario where a data set gets frequent access during the early stages of the lifecycle, but then only occasionally after two weeks. Beyond the first month, the data set is rarely accessed. In this scenario, hot storage is best during the early stages. Cool storage is most appropriate for occasional access, and archive storage is the best tier option after the data ages over a month. By adjusting storage tiers in respect to the age of data, you can design the least expensive storage options for your needs. To achieve this transition, lifecycle management policy rules are available to move aging data to cooler tiers.

## Storage account support

The lifecycle management policy is available with both General Purpose v2 (GPv2) accounts and Blob storage accounts. In the Azure portal, you can upgrade an existing General Purpose (GPv1) account to a GPv2 account via a simple one-click process. For more information about storage accounts, see [Azure storage account overview](../common/storage-account-overview.md).  

## Pricing 

The lifecycle management feature is free of charge in preview. Customers are charged the regular operation cost for the [List Blobs](https://docs.microsoft.com/rest/api/storageservices/list-blobs) and [Set Blob Tier](https://docs.microsoft.com/rest/api/storageservices/set-blob-tier) API calls. For more information about pricing, see [Block Blob pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

## Register for preview 
To enroll in public preview, you'll need to submit a request to register this feature to your subscription. Requests are usually approved within 72 hours. Upon approval, all existing and new GPv2 or Blob storage accounts in the following regions include the feature: West US 2, West Central US, East US 2, and West Europe. Preview only supports block blob. As with most previews, you shouldn't use this feature for production workloads until it reaches GA.

To submit a request, run the following PowerShell or CLI commands.

### PowerShell

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

To submit a request:

```powershell
Register-AzProviderFeature -FeatureName DLM -ProviderNamespace Microsoft.Storage 
```
You can check the registration approval status with the following command:
```powershell
Get-AzProviderFeature -FeatureName DLM -ProviderNamespace Microsoft.Storage
```
With approval and proper registration, you receive the *Registered* state when you submit the previous requests.

### Azure CLI

To submit a request: 
```cli
az feature register --namespace Microsoft.Storage --name DLM
```
You can check the registration approval status with the following command:
```cli
az feature show --namespace Microsoft.Storage --name DLM
```
With approval and proper registration, you receive the *Registered* state when you submit the previous requests.


## Add or remove a policy 

You can add, edit, or remove a policy using Azure portal, [PowerShell](https://www.powershellgallery.com/packages/Az.Storage), [Azure CLI](https://docs.microsoft.com/cli/azure/ext/storage-preview/storage/account/management-policy?view=azure-cli-latest#ext-storage-preview-az-storage-account-management-policy-create), [REST APIs](https://docs.microsoft.com/rest/api/storagerp/managementpolicies/createorupdate), or client tools in the following languages: [.NET](https://www.nuget.org/packages/Microsoft.Azure.Management.Storage/8.0.0-preview), [Python](https://pypi.org/project/azure-mgmt-storage/2.0.0rc3/), [Node.js]( https://www.npmjs.com/package/azure-arm-storage/v/5.0.0), [Ruby](https://rubygems.org/gems/azure_mgmt_storage/versions/0.16.2). 

### Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Select **All Resources** and then select your storage account.

3. Select **Lifecycle Management (preview)** grouped under Blob Service to view or change your policy.

### PowerShell

```powershell
$rules = '{ ... }'

Set-AzStorageAccountManagementPolicy -ResourceGroupName [resourceGroupName] -StorageAccountName [storageAccountName] -Policy $rules 

Get-AzStorageAccountManagementPolicy -ResourceGroupName [resourceGroupName] -StorageAccountName [storageAccountName]
```

### Azure CLI

```
az account set --subscription "[subscriptionName]”
az extension add --name storage-preview
az storage account management-policy show --resource-group [resourceGroupName] --account-name [accountName]
```

> [!NOTE]
> If you enable firewall rules for your storage account, lifecycle management requests may be blocked. You can unblock these requests by providing exceptions. For more information, see the Exceptions section in [Configure firewalls and virtual networks](https://docs.microsoft.com/azure/storage/common/storage-network-security#exceptions).

## Policy

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


A policy requires two parameters:

| Parameter name | Parameter type | Notes |
|----------------|----------------|-------|
| version        | A string expressed as `x.x` | The preview version number is 0.5. |
| rules          | An array of rule objects | At least one rule is required in each policy. During preview, you can specify up to 4 rules per policy. |

Each rule within the policy requires three parameters:

| Parameter name | Parameter type | Notes |
|----------------|----------------|-------|
| Name           | String | A rule name can include any combination of alphanumeric characters. Rule name is case-sensitive. It must be unique within a policy. |
| type           | An enum value | The valid value for preview is `Lifecycle`. |
| definition     | An object that defines the lifecycle rule | Each definition is made up of a filter set and an action set. |

## Rules

Each rule definition includes a filter set and an action set. The [filter set](#rule-filters) limits rule actions to a certain set of objects within a container or objects names. The [action set](#rule-actions) applies the tier or delete actions to the filtered set of objects.

### Sample rule
The following sample rule filters the account to run the actions only on `container1/foo`. Run the following actions for all the objects that exist inside `container1` **AND** starts with `foo`: 

- Tier blob to cool tier 30 days after last modification
- Tier blob to archive tier 90 days after last modification
- Delete blob 2,555 days (seven years) after last modification
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

Filters limit rule actions to a subset of blobs within the storage account. If more than one filter is defined, a logical `AND` runs on all filters.

During preview, valid filters include:

| Filter name | Filter type | Notes | Is Required |
|-------------|-------------|-------|-------------|
| blobTypes   | An array of predefined enum values. | The preview release only supports `blockBlob`. | Yes |
| prefixMatch | An array of strings for prefixes to be match. A prefix string must start with a container name. For example, if you want to match all blobs under "https:\//myaccount.blob.core.windows.net/container1/foo/..." for a rule, the prefixMatch is `container1/foo`. | If you don't define prefixMatch, the rules apply to all blobs within the account. | No |

### Rule actions

Actions are applied to the filtered blobs when the execution condition is met.

In preview, lifecycle management supports tiering and deletion of blobs and deletion of blob snapshots. Define at least one action for each rule on blobs or blob snapshots.

| Action        | Base Blob                                   | Snapshot      |
|---------------|---------------------------------------------|---------------|
| tierToCool    | Support blobs currently at hot tier         | Not supported |
| tierToArchive | Support blobs currently at hot or cool tier | Not supported |
| delete        | Supported                                   | Supported     |

> [!NOTE]
> If you define more than one action on the same blob, lifecycle management applies the least expensive action to the blob. For example, action `delete` is cheaper than action `tierToArchive`. Action `tierToArchive` is cheaper than action `tierToCool`.

In preview, the action execution conditions are based on age. Base blobs use the last modified time to track age, and blob snapshots use the snapshot creation time to track age.

| Action execution condition | Condition value | Description |
|----------------------------|-----------------|-------------|
| daysAfterModificationGreaterThan | Integer value indicating the age in days | Valid condition for base blob actions |
| daysAfterCreationGreaterThan     | Integer value indicating the age in days | Valid condition for blob snapshot actions | 

## Examples
The following examples demonstrate how to address common scenarios with lifecycle policy rules.

### Move aging data to a cooler tier

This example shows how to transition block blobs prefixed with `container1/foo` or `container2/bar`. The policy transitions blobs that haven't been modified in over 30 days to cool storage, and blobs not modified in 90 days to the archive tier:

```json
{
  "version": "0.5",
  "rules": [
    {
      "name": "agingRule",
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

### Archive data at ingest 

Some data stays idle in the cloud and is rarely, if ever, accessed once stored. Archive this data immediately once it's ingested. The following lifecycle policy is configured to archive data at ingest. This example transitions block blobs in the storage account within container `archivecontainer` immediately into an archive tier. The immediate transition is accomplished by acting on blobs 0 days after last modified time:

```json
{
  "version": "0.5",
  "rules": [
    {
      "name": "archiveRule",
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

Some data is expected to expire days or months after creation to reduce costs or meet government requirements. You can configure a lifecycle management policy to expire data by deletion based on data age. The following example shows a policy that deletes all block blobs (with no prefix specified) older than 365 days.

```json
{
  "version": "0.5",
  "rules": [
    {
      "name": "expirationRule",
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

### Delete old snapshots

For data that is modified and accessed regularly throughout its lifetime, snapshots are often used to track older versions of the data. You can create a policy that deletes old snapshots based on snapshot age. The snapshot age is determined by evaluating the snapshot creation time. This policy rule deletes block blob snapshots within container `activedata` that are 90 days or older after snapshot creation.

```json
{
  "version": "0.5",
  "rules": [
    {
      "name": "snapshotRule",
      "type": "Lifecycle",
    "definition": {
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
## FAQ - I created a new policy, why are the actions not run immediately? 

The platform runs the lifecycle policy once a day. Once you set a new policy, it can take up to 24 hours for some actions (such as tiering and deletion) to start and run.  

## Next steps

Learn how to recover data after accidental deletion:

- [Soft delete for Azure Storage blobs](../blobs/storage-blob-soft-delete.md)
