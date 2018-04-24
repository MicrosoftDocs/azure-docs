---
title: Managing the Azure Storage Lifecycle
description: 
services: storage
author: yzheng-msft
manager: jwillis

ms.service: storage
ms.workload: storage
ms.topic: article
ms.date: 04/30/2018
ms.author: yzheng
---

# Managing the Azure Storage Lifecycle

Data stored in the cloud often has special considerations in how  it is generated, processed, and accessed over time. Some data is accessed often early in the lifecycle, but the need for retrieval drops drastically as the data ages. Some data remains idle in the cloud and is rarely, if ever, accessed once stored. Further, some data expires days or months after creation while other sets of data are actively read and modified throughout its lifetime. Azure Blob Storage lifecycle management offers rule-based automation to transition your data to the best access tier and expire data at the end of its lifecycle. 

Lifecycle management policies include the following features:

- Defined at the storage account level
- Applies to all or a subset of blobs (using the blob name prefixes as filters)
- Stores data lifecycle stages in different storage tiers ([Hot, Cool and Archive](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blob-storage-tiers)) to optimize for performance and cost

Consider a set of data that is accessed frequently during the early stage of the lifecycle, is needed only occasionally after two weeks, and is rarely accessed after a month and beyond.

In this scenario, hot storage is best during the early stages, cool storage is most appropriate for occasional access, and archive storage is the best tier option after the data ages over a month.

By adjusting storage tiers in respect to the age of data, you can design the least expensive storage options for your needs. To achieve this transition, lifecycle management policies are available to move aging data to cooler tiers.

## Move data to a cooler tier as it ages

The following example demonstrates how to transition block blobs prefixed with `foo` or `bar`. The policy transitions blobs that haven't been modified in over 30 days to cool storage, and blobs not modified in 90 days to the archive tier:

```json
{
  "version": 0.5,
  "rules": [ 
    {
      "name": "agingRule", 
      "type": "Lifecycle", 
      "definition": 
        {
          "filters": {
            "blobTypes": [ "blockBlob" ],
            "prefixMatch": [ "foo", "bar" ]
          },
          "actions": {
            "baseBlob": {
              "tierToCool": { "daysAfterLastModifiedGreaterThan": 30 },
              "tierToArchive": { "daysAfterLastModifiedGreaterThan": 90 }
            }
          }
        }      
    }
  ]
}
```

## Archive data at ingest 

Some data remains idle in the cloud and is rarely, if ever, accessed once stored. This data is best to be archived immediately once it is ingested.

A lifecycle policy can be set up to archive data at ingest. This example shows all block blobs in the storage account with prefix “archive” is tiered to Archive storage immediately (0 day after last modified time):

```json
{
  "version": 0.5,
  "rules": [ 
    {
      "name": "archiveRule", 
      "type": "Lifecycle", 
      "definition": 
        {
          "filters": {
            "blobTypes": [ "blockBlob" ],
            "prefixMatch": [ "archive" ]
          },
          "actions": {
            "baseBlob": { 
                "tierToArchive": { "daysAfterLastModifiedGreaterThan": 0 }
            }
          }
        }      
    }
  ]
}

```

## Expire data

Some data must be expired days or months after it is created to save cost or comply with government regulations. A lifecycle management policy can be set up to expire date by deletion based on data age.

This example shows a policy that deletes all block blobs (with no prefix specified) in the storage account older than 365 days.

```json
{
  "version": 0.5,
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
              "delete": { "daysAfterLastModifiedGreaterThan": 365 }
            }
          }
        }      
    }
  ]
}
```


## Delete old snapshots

Some data is modified and accessed regularly throughout its lifetime. Frequently, snapshots are used to track older versions of the data. A lifecycle management policy can be set up to delete old snapshots based on snapshot age. The snapshot age is determined by snapshot creation time.

This example shows all block blob snapshots with prefix “activeData” in the storage account is deleted 90 days after snapshot creation.

```json
{
  "version": 0.5,
  "rules": [ 
    {
      "name": "snapshotRule", 
      "type": "Lifecycle", 
      "definition": 
        {
          "filters": {
            "blobTypes": [ "blockBlob" ],
            "prefixMatch": [ "activeData/" ]
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


## Storage accounts that support lifecycle management 

Lifecycle management policy can be added to both General Purpose v2 (GPv2) account and Blob Storage account. Existing General Purpose v1 (GPv1) account can be converted to a GPv2 account through a simple one-click process in the Azure portal. See [Azure storage account options](https://docs.microsoft.com/en-us/azure/storage/common/storage-account-options) to learn more.  

## Lifecycle management pricing 

During preview, lifecycle management is free. Customers are charged the regular transaction fee on listing and updating blob access tier. 

## Construct a lifecycle management policy 

A lifecycle management policy is a collection of rules:

```json
{
  "version": 0.5,
  "rules": [
    {
      "name": "rule1",
      "type": "lifecycle",
      "definition": {...}
    },
    {
      "name": "rule2",
      "type": "lifecycle",
      "definition": {...}
    }
  ]
}
```


Within a policy, two parameters are required:

| Parameter name | Parameter type           | Notes                                                                                                   |
|----------------|--------------------------|---------------------------------------------------------------------------------------------------------|
| version        | A x.x number             | The preview version number is 0.5                                                                       |
| rules          | An array of rule objects | At least one rule is required in each policy. During preview, you can specify up to 4 rules per policy. |

Parameters required within a rule are:

| Parameter name | Parameter type                             | Notes                                                                                                                                                                       |
|----------------|--------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Name           | String                                     | A rule name can contain any combination of alpha numeric characters. Rule name is case-sensitive. It must be unique within a policy. |
| type           | An enum value                              | The valid value for preview is “lifecycle”                                                                                                                                  |
| definition     | An object that defines the lifecycle rule | Each definition is made up with a filter set and an action set.                                                                                                             |

## Construct a lifecycle management rule

Each rule definition includes a filter set and an action set.

This is a sample rule definition to tier all base block blobs with prefix “foo” to Cool Storage 30 days after last modified time, to Archive Storage 90 days after last modified time, to delete 2,555 days (7 years) after last modified time, and to delete all blob snapshots 90 days after snapshot creation time.

```json
{
  "version": 0.5,
  "rules": [ 
    {
      "name": "ruleFoo", 
      "type": "lifecycle", 
      "definition": {
        "filters": {
          "blobTypes": [ "blockBlob" ],
          "nameMatch": [ "foo" ]
        },
        "actions": {
          "baseBlob": {
            "tierToCool": { "daysAfterLastModifiedGreaterThan": 30 },
            "tierToArchive": { "daysAfterLastModifiedGreaterThan": 90 },
            "delete": { "daysAfterLastModifiedGreaterThan": 2555 }
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

## Rule filter

Filters limits rule actions to a subset of blobs within the storage account. If multiple filters are defined, a logical AND is performed on all filters.

During preview, valid filters include:

| Filter name | Filter type                                   | Notes                                                                                               |
|-------------|-----------------------------------------------|-----------------------------------------------------------------------------------------------------|
| blobTypes   | An array of predefined enum values.           | This is a required filter. For the preview release, only “blockBlob” is supported.                   |
| prefixMatch | An array of strings for prefixes to be match. | This is an optional filter. If it isn’t defined, this rule applies to all blobs within the account. |

### Rule action

Actions are applied to the filtered blobs when the execution condition is met.

In preview, lifecycle management supports tiering and deletion of blob and deletion of blob snapshots. Each rule must have at least one action defined on blobs or blob snapshots.

| Action        | Base Blob                                   | Snapshot      |
|---------------|---------------------------------------------|---------------|
| tierToCool    | Support blobs currently at Hot tier         | Not supported |
| tierToArchive | Support blobs currently at Hot or Cool tier | Not supported |
| delete        | Supported                                   | Supported     |

In preview, the action execution conditions are based on age. Base blob uses last modified time to track age and blob snapshots uses snapshot creation time to track age.

| Action execution condition       | Condition value                        | Description                               |
|----------------------------------|----------------------------------------|-------------------------------------------|
| daysAfterLastModifiedGreaterThan | Integer value indicating the age in days | Valid condition for base blob actions     |
| daysAfterCreationGreaterThan     | Integer value indicating the age in days | Valid condition for blob snapshot actions |