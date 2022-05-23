---
title: Microsoft Purview asset management processes 
description: This article provides process and best practice guidance to effectively manage the lifecycle of assets in the Microsoft Purview catalog
author: Jubairp
ms.author: jubairpatel
ms.service: purview
ms.topic: conceptual
ms.date: 01/06/2022
---

# Business processes for managing data effectively

As data and content has a lifecycle that requires active management (for example, acquisition - processing - disposal) assets in the Microsoft Purview data catalog need active management in a similar way. "Assets" in the catalog include the technical metadata that describes collection, lineage and scan information. Metadata describing the business structure of data such as glossary, classifications and ownership also needs to be managed. 
 
To manage data assets, responsible people in the organization must understand how and when to apply data governance processes and manage workflows. 

## Why do you need business processes for managing assets in Microsoft Purview?

An organization employing Microsoft Purview should define processes and people structure to manage the lifecycle of assets and ensure data is valuable to users of the catalog. Metadata in the catalog must be maintained to be able to manage data at scale for discovery, quality, security and privacy. 

### Benefits

- Agreed definition and structure of data is required for the Microsoft Purview data catalog to provide effective data search and protection functionality at scale across organizations' data estates. 
 
- Defining and using processes for asset lifecycle management is key to maintaining accurate asset metadata, which will improve usability of the catalog and the ability to protect relevant data. 
 
- Business users looking for data will be more likely to use the catalog to search for data when it is maintained using data governance processes.

### Best practice processes that should be considered when starting the data governance journey with Microsoft Purview: 

- **Capture and maintain assets** - Understand how to initially structure and record assets in the catalog for management 
- **Glossary and Classification management** - Understand how to effectively manage the catalog metadata needed to apply and maintain a business glossary
- **Moving and deleting assets** – Managing collections and assets by understanding how to move assets from one collection to another or delete asset metadata from Microsoft Purview

## Data curator organizational personas

The [Data Curator](catalog-permissions.md) role in Microsoft Purview controls read/write permission to assets within a collection group. To support the data governance processes, the Data Curator role has been granted to separate data governance personas in the organization: 

> [!Note] 
> The 4 **personas** listed are suggested read/write users, and would all be assigned Data Curator role in Microsoft Purview. 

- Data Owner or Data Expert:

    - A Data Owner is typically a senior business stakeholder with authority and budget who is accountable for overseeing the quality and protection of a data subject area. This person is accountable for making decisions on who has the right to access data and how it is used.

    - A Data Expert is an individual who is an authority in the business process, data manufacturing process or data consumption patterns. 

- Data Steward or Data Custodian

    - A Data Steward is typically a business professional responsible for overseeing the definition, quality and management of a data subject area or data entity. They are typically experts in the data domain and work with other data stewards to make decisions on how to apply all aspects of data management. 
    
    - A Data Custodian is an individual responsible for performing one or more data controls. 

## 1. Capture and maintain assets

This process describes the high-level steps and suggested roles to capture and maintain assets in the Microsoft Purview data catalog.

:::image type="content" source="media/concept-best-practices/assets-capturing-asset-metadata.png" alt-text="Business Process 1 - Capturing and Maintaining Assets."lightbox="media/concept-best-practices/assets-capturing-asset-metadata.png" border="true":::

### Process Guidance

| Process Step | Guidance |
| ------------ | -------- |
| 1 | [Microsoft Purview collections architecture and best practices](concept-best-practices-collections.md) |  
| 2 | [How to create and manage collections](how-to-create-and-manage-collections.md)
| 3 & 4 | [Understand Microsoft Purview access and permissions](catalog-permissions.md)
| 5 | [Microsoft Purview supported sources](purview-connector-overview.md) <br> [Microsoft Purview private endpoint networking](catalog-private-link.md) |
| 6 | [How to manage multi-cloud data sources](manage-data-sources.md)
| 7 | [Best practices for scanning data sources in Microsoft Purview](concept-best-practices-scanning.md)
| 8, 9 & 10 | [Search the data catalog](how-to-search-catalog.md)  <br>   [Browse the data catalog](how-to-browse-catalog.md)

## 2. Glossary and classification maintenance

This process describes the high-level steps and roles to manage and define the business glossary and classifications metadata to enrich the Microsoft Purview data catalog. 

:::image type="content" source="media/concept-best-practices/assets-maintaining-glossary-and-classifications.png" alt-text="Business Process 2 - Maintaining glossary and classifications"lightbox="media/concept-best-practices/assets-maintaining-glossary-and-classifications.png" border="true":::

### Process Guidance

| Process Step | Guidance |
| ------------ | -------- |
| 1 & 2 | [Understand Microsoft Purview access and permissions](catalog-permissions.md) |  
| 3 | [Create custom classifications and classification rules](create-a-custom-classification-and-classification-rule.md)
| 4 | [Create a scan rule set](create-a-scan-rule-set.md)
| 5 & 6 | [Apply classifications to assets](apply-classifications.md) 
| 7 & 8 | [Understand business glossary features](concept-business-glossary.md)
| 9 & 10 | [Create, import and export glossary terms](how-to-create-import-export-glossary.md)
| 11 | [Search the Data Catalog](how-to-search-catalog.md)   
| 12 & 13 | [Browse the Data Catalog](how-to-browse-catalog.md)  

> [!Note]
> It is not currently possible to edit glossary term attributes (for example, Status) in bulk using the Microsoft Purview UI, but it is possible to export the glossary in bulk, edit in Excel and re-import with amendments. 

## 3. Moving assets between collections

This process describes the high-level steps and roles to move assets between collections using the Microsoft Purview portal. 

:::image type="content" source="media/concept-best-practices/assets-moving-assets-between-collections.png" alt-text="Business Process 3 - Moving assets between collections"lightbox="media/concept-best-practices/assets-moving-assets-between-collections.png" border="true":::

### Process Guidance

| Process Step | Guidance |
| ------------ | -------- |
| 1 & 2 | [Microsoft Purview collections architecture and best practice](concept-best-practices-collections.md) |  
| 3 | [Create a collection](quickstart-create-collection.md)
| 4 | [Understand access and permissions](catalog-permissions.md)
| 5 | [How to manage collections](how-to-create-and-manage-collections.md#add-assets-to-collections) 
| 6 | [Check collection permissions](how-to-create-and-manage-collections.md#prerequisites)
| 7 | [Browse the Microsoft Purview Catalog](how-to-browse-catalog.md) 

> [!Note]
> It is not currently possible to bulk move assets from one collection to another using the Microsoft Purview portal. 

## 4. Deleting asset metadata

This process describes the high-level steps and roles to delete asset metadata from the data catalog using the Microsoft Purview portal. 

Asset Metadata may need to be deleted manually for many reasons: 

- To remove asset metadata where the data is deleted (if a full re-scan is not performed)
- To remove asset metadata where the data is purged according to its retention period
- To reduce/manage the size of the data map 


> [!Note]
> Before deleting assets, please refer to the how-to guide to review considerations: [How to delete assets](catalog-asset-details.md#deleting-assets)

:::image type="content" source="media/concept-best-practices/assets-deleting-asset-metadata.png" alt-text="Business Process 4 - Deleting Assets in Microsoft Purview"lightbox="media/concept-best-practices/assets-deleting-asset-metadata.png" border="true":::

### Process Guidance

| Process Step | Guidance |
| ------------ | -------- |
| 1 & 2 | Manual steps |  
| 3 | [Data catalog lineage user guide](catalog-lineage-user-guide.md)
| 4 | Manual step
| 5 | [How to view, edit and delete assets](catalog-asset-details.md#deleting-assets) 
| 6 | [Scanning best practices](concept-best-practices-scanning.md)

> [!Note] 
> - Deleting a collection, registered source or scan from Microsoft Purview does not delete all associated asset metadata. 
> -  It is not possible to bulk delete asset metadata using the Microsoft Purview Portal 
> - Deleting the asset metadata does not delete all associated lineage or other relationship data (for example, glossary or classification assignments) about the asset from the data map. The asset information and relationships will no longer be visible in the portal. 

## Next steps
- [Microsoft Purview accounts architectures and best practices](concept-best-practices-accounts.md)
- [Microsoft Purview collections architectures and best practices](concept-best-practices-collections.md)
- [Microsoft Purview glossary best practices](concept-best-practices-glossary.md)
- [Microsoft Purview classifications best practices](concept-best-practices-classification.md)
