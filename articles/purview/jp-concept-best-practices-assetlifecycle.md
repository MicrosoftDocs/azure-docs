---
title:                     Purview Asset Management Processes 
description:               This article provides process and best practice guidance to effectively manage the lifecycle of assets in the Purview catalog
author: {github-id}        Jubairp
ms.author: {ms-alias}      Jubairp
ms.service: purview
ms.topic: conceptual
ms.date: {@date}           # the date - will be auto-populated when template is first applied
ms.topic: getting-started  Best Practice
---
# Business processes for managing data effectively

As data and content has a lifecycle that requires active management (e.g. acquisition - processing - disposal) assets in the Purview data catalogue require active management in a similar way. "Assets" in the catalogue include the technical metadata that describes collection, lineage and scan information as well as metadata describing the business structure of data such as glossary, classifications, ownership and usage. 
 
To manage assets effectively, the responsible managers of data in the organization must understand how and when to define the business glossary, associate with the scanned data assets, apply governance processes and manage approvals using Purview's Glossary status management. 

### Intended audience

- Data owners
- Data stewards
- Data custodians
- Data governance managers

## Why do you need business processes for managing assets in Azure Purview?

An organization employing Purview should define processes and organizational structure to efficiently manage the lifecycle of cataloged assets and ensure data is valuable to users of the catalog. Metadata in the catalog must be maintained to be able to manage data at scale for discovery, quality, security and privacy. 

### Benefits

- Agreed definition and structure of data is required for the Purview data catalogue to provide effective data search and protection functionality at scale across organizations' data estates. 
 
- Defining and using processes for asset lifecycle management is key to maintaining accurate scan, glossary and classification metadata which will improve usability of the catalogue and ability to protect relevant data. 
 
- Business users looking for data in the organization (e.g. data analysts and data scientists) will be much more likely to actively use the catalogue to search for data when it is maintained using asset management processes.

### Best practice processes that should be considered when starting the data governance journey with Purview: 

1.	**Capture and maintain assets** - Understand how to initially structure and record assets in the catalogue for management 
2.	**Glossary and Classification management** - Understand how to effectively manage the catalogue metadata needed to apply and maintain a business glossary
3.	**Moving and deleting assets** – Managing collections and assets by understanding how to move assets from one collection to another or delete asset metadata from Purview

## Data curator organizational personas

The [Data Curator](https://docs.microsoft.com/en-us/azure/purview/catalog-permissions) role in Purview controls read/write permission to assets within a collection group. To support the processes below, the Data Curator role has been granted to separate data governance personas in the organization: 

Note: The 4 **personas** listed are suggested read/write users, and would all be assigned Data Curator role in Purview. 

1.	Data Owner or Data Expert:

Data Owner: Senior business stakeholder with authority and budget who is accountable for overseeing the quality and protection of a specific data subject area or data entity across the enterprise and make decisions on who has the right to access and maintain that data and on how it is used

Data Expert: An individual who is an authority in the business process, data manufacturing process or data consumption patterns in the business. 

2.	Data Steward or Data Custodian

Data Steward: Business professional responsible for overseeing the definition, quality and management of a data subject area or data entity. They are typically experts in the data domain and work in a team with other data stewards across the enterprise to monitor and make decisions to ensure all aspects of data management are applied

Data Custodian: An individual responsible for performing one or more data controls. 

## 1. Capture and maintain assets

This process describes the high level steps and suggested roles to capture and maintain sources in the Purview data catalog.

:::image type="content" source="media/concept-best-practices/assets-capturing-asset-metadata.png" alt-text="Business Process 1 - Capturing and Maintaining Assets."lightbox="media/concept-best-practices/assets-capturing-asset-metadata.png" border="true":::

### Process Guidance

| Process Step | Guidance |
| ------------ | -------- |
| 1 | [Purview collections architecture and best practices](https://docs.microsoft.com/en-us/azure/purview/concept-best-practices-collections) |  
| 2 | [How to create and manage collections](https://docs.microsoft.com/en-us/azure/purview/how-to-create-and-manage-collections)
| 3 & 4 | [Understand Purview access and permissions](https://docs.microsoft.com/en-us/azure/purview/catalog-permissions)
| 5 | [Purview connector overview](https://docs.microsoft.com/en-us/azure/purview/purview-connector-overview) <br> [Purview private endpoint networking](https://docs.microsoft.com/en-us/azure/purview/catalog-private-link) |
| 6 | [How to manage multi-cloud data sources](https://docs.microsoft.com/en-us/azure/purview/manage-data-sources)
| 7 | [Best practices for scanning data sources in Purview](https://docs.microsoft.com/en-us/azure/purview/concept-best-practices-scanning)
| 8, 9 & 10 | [Use Purview Studio](https://docs.microsoft.com/en-us/azure/purview/how-to-search-catalog)  <br>   [Search and Browse the Data Catalog](https://docs.microsoft.com/en-us/azure/purview/how-to-search-catalog)


## 2. Glossary and classification maintenance

This process describes the high level steps and roles to manage and define the business glossary and classifications metadata to enrich the Purview data catalog. 


:::image type="content" source="media/concept-best-practices/maintaining-glossary-and-classifications.png" alt-text="Business Process 2 - Glossary and Classification Maintenance" border="true":::


### Process Guidance

| Process Step | Guidance |
| ------------ | -------- |
| 1 & 2 | [Understand Purview access and permissions](https://docs.microsoft.com/en-us/azure/purview/catalog-permissions) |  
| 3 | [Create custom classifications and classification rules](https://docs.microsoft.com/en-us/azure/purview/create-a-custom-classification-and-classification-rule)
| 4 | [Create a scan rule set](https://docs.microsoft.com/en-us/azure/purview/create-a-scan-rule-set)
| 5 & 6 | [Apply classifications to assets](https://docs.microsoft.com/en-us/azure/purview/apply-classifications) 
| 7 & 8 | [Understand business glossary features](https://docs.microsoft.com/en-us/azure/purview/concept-business-glossary#glossary-vs-classification-vs-sensitivity-labels)
| 9 & 10 | [How to create, import and export glossary terms](https://docs.microsoft.com/en-us/azure/purview/concept-best-practices-scanning)
| 11 | [Use Purview Studio](https://docs.microsoft.com/en-us/azure/purview/how-to-search-catalog)    
| 12 & 13 | [Search and Browse the Data Catalog](https://docs.microsoft.com/en-us/azure/purview/how-to-search-catalog)

> [!Note]
> It is not currently possible to edit glossary term attributes (e.g. Status) in bulk using the Purview UI, but it is possible to export the glossary in bulk, edit in Excel and re-import with amendments. 

## 3. Moving assets between collections

This process describes the high level steps and roles to move assets between collections using the Purview UI. 


:::image type="content" source="C:\GitHub\azure-docs-pr\media\moving-assets-between-collections.png" alt-text="Business Process 2 - Glossary and Classification Maintenance" border="true":::

### Process Guidance

| Process Step | Guidance |
| ------------ | -------- |
| 1 & 2 | [Purview collections architecture and best practice](https://docs.microsoft.com/en-us/azure/purview/concept-best-practices-collections) |  
| 3 | [Quickstart: Create a collection](https://docs.microsoft.com/en-us/azure/purview/quickstart-create-collection)
| 4 | [Understand access and permissions](https://docs.microsoft.com/en-us/azure/purview/catalog-permissions)
| 5 | [How to create and manage collections](https://docs.microsoft.com/en-us/azure/purview/how-to-create-and-manage-collections#add-assets-to-collections) 
| 6 | [Understand business glossary features](https://docs.microsoft.com/en-us/azure/purview/concept-business-glossary#glossary-vs-classification-vs-sensitivity-labels)
| 7| [How to create, import and export glossary terms](https://docs.microsoft.com/en-us/azure/purview/concept-best-practices-scanning)
| 11 | [Use Purview Studio](https://docs.microsoft.com/en-us/azure/purview/how-to-search-catalog)    
| 12 & 13 | [Search and Browse the Data Catalog](https://docs.microsoft.com/en-us/azure/purview/how-to-search-catalog)

