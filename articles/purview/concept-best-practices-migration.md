---
title: Microsoft Purview migration best practices
description: This article provides steps to perform backup and recovery for migration best practices.
author: hophanms
ms.author: hophan
ms.service: purview
ms.subservice: purview-data-map
ms.topic: conceptual
ms.date: 02/15/2023
---

# Microsoft Purview backup and recovery for migration best practices  

This article provides guidance on backup and recovery strategy when your organization has [Microsoft Purview unified data governance solutions](/purview/purview#microsoft-purview-unified-data-governance-solutions) in production deployment. You can also use this general guideline to implement account migration. The scope of this article is to cover [manual BCDR methods](disaster-recovery.md) where you could automate using APIs. There's some key information to consider upfront: 

- It isn't advisable to back up "scanned" assets' details. You should only back up the curated data such as mapping of classifications and glossaries on assets. The only case when you need to back up assets' details is when you have custom assets via custom `typeDef`.

- The backed-up asset count should be fewer than 100,000 assets. The main driver is that you have to use the search query API to get the assets, which have limitation of 100,000 assets returned. However, if you're able to segment the search query to get smaller number of assets per API call, it's possible to back up more than 100,000 assets.

- The goal is to perform one time migration. If you wish to continuously "sync" assets between two accounts, there are other steps that won't be covered in detail by this article. You have to use [Microsoft Purview's Event Hubs to subscribe and create entities to another account](manage-kafka-dotnet.md). However, Event Hubs only has Atlas information. Microsoft Purview has added other capabilities such as **glossaries** and **contacts** which won't be available via Event Hubs.

## Identify key requirements
Most of enterprise organizations have critical requirement for Microsoft Purview for capabilities such as Backup, Business Continuity, and Disaster Recovery (BCDR). To get into more details of this requirement, you need to differentiate between Backup, High Availability (HA), and Disaster recovery (DR).

While they're similar, HA will keep the service operational if there was a hardware fault, for example, but it wouldn't protect you if someone accidentally or deliberately deleted all the records in your database. For that, you may need to restore the service from a backup. 
 
### Backup 
You may need to create regular backups from a Microsoft Purview account and use a backup in case a piece of data or configuration is accidentally or deliberately deleted from the Microsoft Purview account by the users.

The backup should allow saving a point in time copy of the following configurations from the Microsoft Purview account:

* Account information (for example, Friendly name)
* Collection structure and role assignments
* Custom Scan rule sets, classifications, and classification rules
* Registered data sources
* Scan information 
* Create and maintain key vaults connections
* Key vault connections and Credentials and relations with current scans
* Registered SHIRs
* Glossary terms templates 
* Glossary terms 
* Manual asset updates (including classification and glossary assignments)
* ADF and Synapse connections and lineage

Backup strategy is determined by restore strategy, or more specifically how long it will take to restore things when a disaster occurs. To answer that, you may need to engage with the affected stakeholders (the business owners) and understand what the required recovery objectives are.

There are three main requirements to take into consideration:
* **Recover Time Objective (RTO)** – Defines the maximum allowable downtime following a disaster for which ideally the system should be back operational.
* **Recovery Point Objective (RPO)** – Defines the acceptable amount of data loss that is ok following a disaster. Normally RPO is expressed as a timeframe in hours or minutes.
* **Recovery Level Object (RLO)** – Defines the granularity of the data being restored. It could be a SQL server, a set of databases, tables, records, etc.

### High availability
In computing, the term availability is used to describe the period of time when a service is available, and the time required by a system to respond to a request made by a user. For Microsoft Purview, high availability means ensuring that Microsoft Purview instances are available if there's a problem that is local to a data center or single region in the cloud region.

#### Measuring availability
Availability is often expressed as a percentage indicating how much uptime is expected from a particular system or component in a given period of time, where a value of 100% would indicate that the system never fails. 

These values are calculated based on several factors, including both scheduled and unscheduled maintenance periods, and the time to recover from a possible system failure.

> [!NOTE]
> Azure data center outages are rare, but can last anywhere from a few minutes to hours. 
> Information about Microsoft Purview availability is available at [SLA for Microsoft Purview](https://azure.microsoft.com/support/legal/sla/purview/v1_0/).
> Microsoft Purview ensures no data loss but a recovery from outages may require you to restart your workflows such as scans.

### Resiliency
The ability of a system to recover from failures and continue to function. It's not about avoiding failures but responding to failures in a way that avoids downtime or data loss. 
 
### Business continuity 
Business continuity means continuing your business in the event of a disaster, planning for recovery, and ensuring that your data map is highly available.
 
### Disaster recovery 
Organizations need a failover mechanism for their Microsoft Purview instances, so when the primary region experiences a catastrophic event like an earthquake or flood, the business must be prepared to have its systems come online elsewhere. 

> [!Note]
> Not all Azure mirrored regions support deploying Microsoft Purview accounts. For example, For a DR scenario, you cannot choose to deploy a new Microsoft Purview account in Canada East if the primary region is Canada Central. Even with Customers managed DR, not all customer may able to trigger a DR.

## Implementation steps
This section provides high level guidance on required tasks to copy assets, glossaries, classifications & relationships across regions or subscriptions either using the Microsoft Purview governance portal or the REST APIs. The approach is to perform the tasks as programmatically as possible at scale.

### High-level task outline
1.	Create the new account
1.	Migrate configuration items
1.	Run scans
1.  Migrate custom typedefs and custom assets
1.  Migrate relationships
1.  Migrate glossary terms
1.  Assign classifications to assets
1.  Assign contacts to assets

### Create the new account
You'll need to create a new Microsoft Purview account by following below instruction:
* [Quickstart: Create a Microsoft Purview account in the Azure portal](create-catalog-portal.md)

It’s crucial to plan ahead on configuration items that you can't change later:
* Account name
* Region
* Subscription
* Manage resource group name

### Migrate configuration items
Below steps are referring to [Microsoft Purview API documentation](/rest/api/purview/) so that you can programmatically stand up the backup account quickly:

|Task|Description|
|-------------|-----------------|
|**Account information**|Maintain Account information by granting access for the admin and/or service principal to the account at root level|
|**Collections**|Create and maintain Collections along with the association of sources with the Collections. You can call [List Collections API](/rest/api/purview/accountdataplane/collections/list-collections) and then get specific details of each collection via [Get Collection API](/rest/api/purview/accountdataplane/collections/get-collection)|
|**Scan rule set**|Create and maintain custom scan rule sets. You need to call [List all custom scan rule sets API](/rest/api/purview/scanningdataplane/scan-rulesets/list-all) and get details by calling [Get scan rule set API](/rest/api/purview/scanningdataplane/scan-rulesets/get)|
|**Manual classifications**|Get a list of all manual classifications by calling get classifications APIs and get details of each classification|
|**Resource set rule**|Create and maintain resource set rule. You can call the [Get resource set rule API](/rest/api/purview/accountdataplane/resource-set-rules/get-resource-set-rule) to get the rule details|
|**Data sources**|Call the [Get all data sources API](/rest/api/purview/scanningdataplane/scans/list-by-data-source) to list data sources with details. You also have to get the triggers by calling [Get trigger API](/rest/api/purview/scanningdataplane/triggers/get-trigger). There's also [Create data sources API](/rest/api/purview/scanningdataplane/data-sources/create-or-update) if you need to re-create the sources in bulk in the new account.|
|**Credentials**|Create and maintain credentials used while scanning. There's no API to extract credentials, so this must be redone in the new account.|
|**Self-hosted integration runtime (SHIR)**|Get a list of SHIR and get updated keys from the new account then update the SHIRs. This must be done [manually inside the SHIRs' hosts](manage-integration-runtimes.md#create-a-self-hosted-integration-runtime).|
|**ADF connections**|Currently an ADF can be connected to one Microsoft Purview at a time. You must disconnect ADF from failed Microsoft Purview account and reconnect it to the new account later.|


### Run scans
This will populate all assets with default `typedef`. There are several reasons to run the scans again vs. exporting the existing assets and importing to the new account:

* There's a limit of 100,000 assets returned from the search query to export assets.

* It's cumbersome to export assets with relationships. 

* When you rerun the scans, you'll get all relationships and assets details up to date.
 
* Microsoft Purview comes out with new features regularly so you can benefit from other features when running new scans.

Running the scans is the most effective way to get all assets of data sources that Microsoft Purview is already supporting.

### Migrate custom typedefs and custom assets

#### Custom typedefs
To identify all custom `typedef`, you can use the [get all type definitions API](/rest/api/purview/catalogdataplane/types/get-all-type-definitions). This will return each type. You need to identify the custom types in such format as `"serviceType": "<custom_typedef>"`

#### Custom assets
To export custom assets, you can search those custom assets and pass the proper custom `typedef` via the [discovery API](/rest/api/purview/catalogdataplane/discovery/query)

> [!Note]
> There is a 100,000 return limit per search result.
> You might have to break the search query so that it won’t return more than 100,000 records.

There are several ways to scope down the search query to get a subset of assets:
*	**Using `Keyword`**: Pass the parent FQN such as `Keyword: "<Parent String>/*"`

*	**Using `Filter`**: Include `assetType` with the specific custom `typedef` in your search such as `"assetType": "<custom_typedef>"`

Here's an example of a search payload by customizing the `keywords` so that only assets in specific storage account (`exampleaccount`) are returned:

```json
{
  "keywords": "adl://exampleaccount.azuredatalakestore.net/*",
  "filter": {
    "and": [
      {
        "not": {
          "or": [
            {
              "attributeName": "size",
              "operator": "eq",
              "attributeValue": 0
            },
            {
              "attributeName": "fileSize",
              "operator": "eq",
              "attributeValue": 0
            }
          ]
        }
      },
      {
        "not": {
          "classification": "MICROSOFT.SYSTEM.TEMP_FILE"
        }
      },
      {
        "not": {
          "or": [
            {
              "entityType": "AtlasGlossaryTerm"
            },
            {
              "entityType": "AtlasGlossary"
            }
          ]
        }
      }
    ]
  },
  "limit": 10,
  "offset": 0,
  "facets": [
    {
      "facet": "assetType",
      "count": 0,
      "sort": {
        "count": "desc"
      }
    },
    {
      "facet": "classification",
      "count": 10,
      "sort": {
        "count": "desc"
      }
    },
    {
      "facet": "contactId",
      "count": 10,
      "sort": {
        "count": "desc"
      }
    },
    {
      "facet": "label",
      "count": 10,
      "sort": {
        "count": "desc"
      }
    },
    {
      "facet": "term",
      "count": 10,
      "sort": {
        "count": "desc"
      }
    }
  ]
}
```

The returned assets will have some key/pair value that you can extract details:

```json
{
    "referredEntities": {},
    "entity": {
    "typeName": "column",
    "attributes": {
        "owner": null,
        "qualifiedName": "adl://exampleaccount.azuredatalakestore.net/123/1/DP_TFS/CBT/Extensions/DTTP.targets#:xml/Project/Target/XmlPeek/@XmlInputPath",
        "name": "~XmlInputPath",
        "description": null,
        "type": "string"
    },
    "guid": "5cf8a9e5-c9fd-abe0-2e8c-d40024263dcb",
    "status": "ACTIVE",
    "createdBy": "ExampleCreator",
    "updatedBy": "ExampleUpdator",
    "createTime": 1553072455110,
    "updateTime": 1553072455110,
    "version": 0,
    "relationshipAttributes": {
        "schema": [],
        "inputToProcesses": [],
        "composeSchema": {
        "guid": "cc6652ae-dc6d-90c9-1899-252eabc0e929",
        "typeName": "tabular_schema",
        "displayText": "tabular_schema",
        "relationshipGuid": "5a4510d4-57d0-467c-888f-4b61df42702b",
        "relationshipStatus": "ACTIVE",
        "relationshipAttributes": {
            "typeName": "tabular_schema_columns"
        }
        },
        "meanings": [],
        "outputFromProcesses": [],
        "tabular_schema": null
    },
    "classifications": [
        {
        "typeName": "MICROSOFT.PERSONAL.EMAIL",
        "lastModifiedTS": "1",
        "entityGuid": "f6095442-f289-44cf-ae56-47f6f6f6000c",
        "entityStatus": "ACTIVE"
        }
    ],
    "contacts": {
        "Expert": [
        {
            "id": "30435ff9-9b96-44af-a5a9-e05c8b1ae2df",
            "info": "Example Expert Info"
        }
        ],
        "Owner": [
        {
            "id": "30435ff9-9b96-44af-a5a9-e05c8b1ae2df",
            "info": "Example Owner Info"
        }
        ]
    }
    }
}
```

> [!Note]
> You need to migrate the term templates from `typedef` output as well.

When you re-create the custom entities, you may need to prepare the payload prior to sending to the API:

> [!Note]
> The initial goal is to migrate all entities without any relationships or mappings. This will avoid potential errors.

* All `timestamp` value must be null such as `updateTime`, `updateTime`, and `lastModifiedTS`.

* The `guid` can't be regenerated exactly as before so you have to pass in a negative integer such as "-5000" to avoid error.

* The content of `relationshipAttributes` shouldn't be a part of the payload to avoid errors since it's possible that the `guids` aren't the same or haven't been created yet. You have to turn `relationshipAttributes` into an empty array prior to submitting the payload. 

  * `meanings` contains all glossary mappings, which will be updated in bulk after the entities are created.

* Similarly, `classifications` needs to be an empty array as well when you submit the payload to create entities since you have to create classification mapping to bulk entities later using a different API.

### Migrate relationships

To complete the asset migration, you must remap the relationships. There are three tasks:

1. Call the [relationship API](/rest/api/purview/catalogdataplane/relationship/get) to get relationship information between entities by its `guid`

1. Prepare the relationship payload so that there's no hard reference to old `guids` in the old Microsoft Purview accounts. You need to update those `guids` to the new account's `guids`.

1. Finally, [Create a new relationship between entities](/rest/api/purview/catalogdataplane/relationship/create)

### Migrate glossary terms

> [!Note]
> Before migrating terms, you need to migrate the term templates. This step should be already covered in the custom `typedef` migration.

#### Using the Microsoft Purview governance portal
The quickest way to migrate glossary terms is to [export terms to a .csv file](how-to-import-export-glossary.md). You can do this using the Microsoft Purview governance portal.

#### Using Microsoft Purview API
To automate glossary migration, you first need to get the glossary `guid` (`glossaryGuid`) via [List Glossaries API](/rest/api/purview/catalogdataplane/glossary/list-glossaries). The `glossaryGuid` is the top/root level glossary `guid`.

The below sample response will provide the `guid` to use for subsequent API calls:

```json
"guid": "c018ddaf-7c21-4b37-a838-dae5f110c3d8"
```

Once you have the `glossaryGuid`, you can start to migrate the terms via two steps:

1. [Export Glossary Terms As .csv](/rest/api/purview/catalogdataplane/glossary/export-glossary-terms-as-csv)

1. [Import Glossary Terms Via .csv](/rest/api/purview/catalogdataplane/glossary/import-glossary-terms-via-csv)

### Assign classifications to assets

> [!Note]
> The prerequisite for this step is to have all classifications available in the new account from [Migrate configuration items]() step.

You must call the [discovery API](/rest/api/purview/catalogdataplane/discovery/query) to get the classification assignments to assets. This is applicable to all assets. If you've migrated the custom assets, the information about classification assignments is already available in `classifications` property. Another way to get classifications is to [list classification per `guid`](/rest/api/purview/catalogdataplane/entity/get-classifications) in the old account.

To assign classifications to assets, you need to [associate a classification to multiple entities in bulk](/rest/api/purview/catalogdataplane/entity/add-classification) via the API.

### Assign contacts to assets

If you have extracted asset information from previous steps, the contact details are available from the [discovery API](/rest/api/purview/catalogdataplane/discovery/query).

To assign contacts to assets, you need a list of `guids` and identify all `objectid` of the contacts. You can automate this process by iterating through all assets and reassign contacts to all assets using the [Create Or Update Entities API](/rest/api/purview/catalogdataplane/entity/create-or-update-entities)

## Next steps
-  [Create a Microsoft Purview account](./create-catalog-portal.md)
