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

Consider a set of data that is accessed frequently during the early stage of the lifecycle, is needed only occasionally after two weeks, and is rarely accessed after a month and beyond. In this scenario, *hot* storage is best during the early stages, *cool* storage is most appropriate for occasional access, and *archive* storage is the best tier option after the data ages over a month. By adjusting storage tiers in respect to the age of data, you can design the least expensive storage options for your needs. To achieve this transition, lifecycle management policies are available to move aging data to cooler tiers.

## Storage accounts that support lifecycle management 

Lifecycle management policy is available with both General Purpose v2 (GPv2) account and Blob Storage account. You can convert an existing General Purpose classic deployment model (GPv1) account to a GPv2 account via a simple one-click process in the Azure portal. See [Azure storage account options](https://docs.microsoft.com/en-us/azure/storage/common/storage-account-options) to learn more.  

## Lifecycle management pricing 

During preview, lifecycle management is free. Customers are charged the regular transaction fee on listing and updating blob access tier.

## Construct a lifecycle management policy 

A lifecycle management policy is a collection of rules in a JSON document:

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
| version        | A number expressed as `x.x`             | The preview version number is 0.5                                                                       |
| rules          | An array of rule objects | At least one rule is required in each policy. During preview, you can specify up to 4 rules per policy. |

Parameters required within a rule are:

| Parameter name | Parameter type                             | Notes                                                                                                                                                                       |
|----------------|--------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Name           | String                                     | A rule name can contain any combination of alpha numeric characters. Rule name is case-sensitive. It must be unique within a policy. |
| type           | An enum value                              | The valid value for preview is “lifecycle”                                                                                                                                  |
| definition     | An object that defines the lifecycle rule | Each definition is made up with a filter set and an action set. |

## Construct a lifecycle management rule

Each rule definition includes a filter set and an action set. The following sample rule modifies the tier for base block blobs with prefix `foo`. In the rule, data is transitioned between tiers based on the following rules:

- Cool storage is used when the modified date is over 30 days 
- Archive storage is used when the modified date is over 90 days
- Blob snapshots are deleted after 90 days
- Blobs are deleted after 2,555 days (7 years)

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

## Rule filters

Filters limit rule actions to a subset of blobs within the storage account. If multiple filters are defined, a logical `AND` is performed on all filters.

During preview, valid filters include:

| Filter name | Filter type | Notes | Is Required |
|-------------|-------------|-------|-------------|
| blobTypes   | An array of predefined enum values.           | For the preview release, only `blockBlob` is supported. | Yes |
| prefixMatch | An array of strings for prefixes to be match. | If it isn’t defined, this rule applies to all blobs within the account. | No |

### Rule actions

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

## Policy examples
The following examples demonstrate how to address common scenarios with lifecycle policy rules.

### Move aging data to a cooler tier

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

### Archive data at ingest 

Some data remains idle in the cloud and is rarely, if ever, accessed once stored. This data is best to be archived immediately once it is ingested. The following lifecycle policy is configured to archive data at ingest. This example transitions block blobs in the storage account with prefix of "archive" immediately into an archive tier. The immediate transition is accomplished by acting on blobs 0 days after last modified time:

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

### Expire data based on age

Some data is expected to expire days or months after creation to reduce costs or comply with government regulations. A lifecycle management policy can be set up to expire date by deletion based on data age. The following example shows a policy that deletes all block blobs (with no prefix specified) older than 365 days.

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

### Delete old snapshots

For data that is modified and accessed regularly throughout its lifetime, snapshots are often used to track older versions of the data. You can create a policy that deletes old snapshots based on snapshot age. The snapshot age is determined by evaluating the snapshot creation time. This policy rule deletes block blob snapshots with prefix "activeData" that are 90 days or older after snapshot creation.

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

## Next steps
todo -> what should the next steps be?