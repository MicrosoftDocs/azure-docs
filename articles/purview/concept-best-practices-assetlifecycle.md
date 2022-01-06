---
title: Purview Asset Management Processes 
description: This article provides process and best practice guidance to effectively manage the lifecycle of assets in the Purview catalog
author: Jubairp
ms.author: Jubairp
ms.service: purview
ms.topic: conceptual
ms.date: 06/01/2022
---

# Business processes for managing data effectively

As data and content has a lifecycle that requires active management (for example, acquisition - processing - disposal) assets in the Purview data catalog need active management in a similar way. "Assets" in the catalog include the technical metadata that describes collection, lineage and scan information. Metadata describing the business structure of data such as glossary, classifications, ownership and usage also needs to be managed. 
 
To manage assets effectively, the responsible people in the organization must understand how and when to apply data governance processes and manage workflows. 

### Intended audience

- Data owners
- Data stewards
- Data custodians
- Data governance managers

## Why do you need business processes for managing assets in Azure Purview?

An organization employing Purview should define processes and people structure to manage the lifecycle of assets and ensure data is valuable to users of the catalog. Metadata in the catalog must be maintained to be able to manage data at scale for discovery, quality, security and privacy. 

### Benefits

- Agreed definition and structure of data is required for the Purview data catalog to provide effective data search and protection functionality at scale across organizations' data estates. 
 
- Defining and using processes for asset lifecycle management is key to maintaining accurate scan, glossary and classification metadata which will improve usability of the catalog and ability to protect relevant data. 
 
- Business users looking for data in the organization will be more likely to use the catalog to search for data when it is maintained using data governance processes.

### Best practice processes that should be considered when starting the data governance journey with Purview: 

1.	**Capture and maintain assets** - Understand how to initially structure and record assets in the catalog for management 
2.	**Glossary and Classification management** - Understand how to effectively manage the catalog metadata needed to apply and maintain a business glossary
3.	**Moving and deleting assets** – Managing collections and assets by understanding how to move assets from one collection to another or delete asset metadata from Purview

## Data curator organizational personas

The [Data Curator](catalog-permissions.md) role in Purview controls read/write permission to assets within a collection group. To support the processes below, the Data Curator role has been granted to separate data governance personas in the organization: 

Note: The 4 **personas** listed are suggested read/write users, and would all be assigned Data Curator role in Purview. 

1.	Data Owner or Data Expert:

<li> Data Owner: Senior business stakeholder with authority and budget who is accountable for overseeing the quality and protection of a data subject area. This person is accountable for making decisions on who has the right to access data and how it is used

<li> Data Expert: An individual who is an authority in the business process, data manufacturing process or data consumption patterns in the business. 

2.	Data Steward or Data Custodian

<li> Data Steward: Business professional responsible for overseeing the definition, quality and management of a data subject area or data entity. They are typically experts in the data domain and work in a team with other data stewards across the enterprise to make decisions to ensure all aspects of data management are applied

<li> Data Custodian: An individual responsible for performing one or more data controls. 

## 1. Capture and maintain assets

This process describes the high-level steps and suggested roles to capture and maintain sources in the Purview data catalog.

:::image type="content" source="media/concept-best-practices/assets-capturing-asset-metadata.png" alt-text="Business Process 1 - Capturing and Maintaining Assets."lightbox="media/concept-best-practices/assets-capturing-asset-metadata.png" border="true":::

### Process Guidance

| Process Step | Guidance |
| ------------ | -------- |
| 1 | [Purview collections architecture and best practices](concept-best-practices-collections.md) |  
| 2 | [How to create and manage collections](how-to-create-and-manage-collections.md)
| 3 & 4 | [Understand Purview access and permissions](catalog-permissions.md)
| 5 | [Purview connector overview](purview-connector-overview.md) <br> [Purview private endpoint networking](catalog-private-link.md) |
| 6 | [How to manage multi-cloud data sources](manage-data-source.md)
| 7 | [Best practices for scanning data sources in Purview](concept-best-practices-scanning.md)
| 8, 9 & 10 | [Search the data catalog](how-to-search-catalog.md)  <br>   [Browse the data catalog](how-to-browse-catalog.md)

## 2. Glossary and classification maintenance

This process describes the high-level steps and roles to manage and define the business glossary and classifications metadata to enrich the Purview data catalog. 

:::image type="content" source="media/concept-best-practices/assets-maintaining-glossary-and-classifications.png" alt-text="Business Process 2 - Maintaining glossary and classifications"lightbox="media/concept-best-practices/assets-maintaining-glossary-and-classifications.png" border="true":::

### Process Guidance

| Process Step | Guidance |
| ------------ | -------- |
| 1 & 2 | [Understand Purview access and permissions](catalog-permissions.md) |  
| 3 | [Create custom classifications and classification rules](create-a-custom-classification-and-classification-rule.md)
| 4 | [Create a scan rule set](create-a-scan-rule-set.md)
| 5 & 6 | [Apply classifications to assets](apply-classifications.md) 
| 7 & 8 | [Understand business glossary features](concept-business-glossary.md)
| 9 & 10 | [Create, import and export glossary terms](how-to-create-import-export-glossary.md)
| 11 | [Search the Data Catalog](how-to-search-catalog.md)   
| 12 & 13 | [Browse the Data Catalog](how-to-browse-catalog.md)  

> [!Note]
> It is not currently possible to edit glossary term attributes (e.g. Status) in bulk using the Purview UI, but it is possible to export the glossary in bulk, edit in Excel and re-import with amendments. 

## 3. Moving assets between collections

This process describes the high-level steps and roles to move assets between collections using the Purview portal. 

:::image type="content" source="media/concept-best-practices/assets-moving-assets-between-collections.png" alt-text="Business Process 3 - Moving assets between collections"lightbox="media/concept-best-practices/assets-moving-assets-between-collections.png" border="true":::

### Process Guidance

| Process Step | Guidance |
| ------------ | -------- |
| 1 & 2 | [Purview collections architecture and best practice](concept-best-practices-collections.md) |  
| 3 | [Create a collection](quickstart-create-collection.md)
| 4 | [Understand access and permissions](catalog-permissions.md)
| 5 | [How to manage collections](how-to-create-and-manage-collections.md#add-assets-to-collections) 
| 6 | [Check collection permissions](how-to-create-and-manage-collections.md#prerequisites)
| 7 | [Browse the Purview Catalog](how-to-browse-catalog.md) 

> [!Note]
> It is not currently possible to bulk move assets from one collection to another using the Purview portal. 

## 4. Deleting asset metadata

This process describes the high-level steps and roles to delete asset metadata from the data catalog using the Purview portal. 

Asset Metadata may need to be deleted manually for many reasons: 

<li> To remove asset metadata where the data is deleted (if a full re-scan is not performed)
<li> To remove asset metadata where the data is purged according to its retention period
<li> To reduce/manage the size of the data map 


> [!Note]
> Before deleting assets, please refer to the how-to guide to review considerations: [How to delete assets](catalog-asset-details.md#deleting-assets)

:::image type="content" source="media/concept-best-practices/assets-deleting-asset-metadata.png" alt-text="Business Process 2 - Maintaining glossary and classifications"lightbox="media/concept-best-practices/assets-deleting-asset-metadata.png" border="true":::

### Process Guidance

| Process Step | Guidance |
| ------------ | -------- |
| 1 & 2 | Manual steps |  
| 3 | [Data catalog lineage user guide](catalog-lineage-user-guide.md)
| 4 | Manual step
| 5 | [How to view, edit and delete assets](catalog-asset-details.md#deleting-assets) 
| 6 | [Scanning best practices](concept-best-practices-scanning.md)

> [!Note]
> <li>	Deleting a collection, registered source or scan from Purview does not delete all associated asset metadata. <li>  It is not possible to bulk delete asset metadata using the Purview Portal <li>	Deleting the asset metadata does not delete all associated lineage or other relationship data (for example, glossary or classification assignments) about the asset from the data map. The asset information and relationships will no longer be visible in the portal. 

## Next steps
- [Azure Purview accounts architectures and best practices](concept-best-practices-accounts.md)
- [Azure Purview collections architectures and best practices](concept-best-practices-collections.md)
- [Azure Purview glossary best practices](concept-best-practices-glossary.md)
- [Azure Purview classifications best practices](concept-best-practices-classification.md)