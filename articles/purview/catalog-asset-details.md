---
title: 'How to view, edit and delete assets'
description: This how to guide describes how you can view and edit asset details. 
author: viseshag
ms.author: viseshag
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 08/02/2021
---
# View, edit and delete assets in Purview catalog

This article discusses how to you can view your assets and their relevant details. It also describes how you can edit and delete assets from your catalog.

## Prerequisites

- Set up your data sources and scan the assets into your catalog.
- *Or* Use the Purview Atlas APIs to ingest assets into the catalog. 

## Viewing asset details

You can discover your assets in Purview by either:
- [Browsing the Azure Purview Data catalog](how-to-browse-catalog.md)
- [Searching the Azure Purview Data Catalog](how-to-search-catalog.md)

Once you find the asset you are looking for, you can view all of it's details, along with editing and deleting them as described in following sections.

## Asset details tabs explained

:::image type="content" source="media/catalog-asset-details/asset-tabs.png" alt-text="Asset details tabs":::

- **Overview** - The overview tab covers the basic details regarding an asset.
- **Properties** - The properties tab covers both basic and advanced properties regarding an asset.
- **Schema** - The schema of the asset including column names, data types, column level classifications, terms, and descriptions are represented in the schema tab.
- **Lineage** - This tab represents the lineage graph details for assets where it is available.
- **Contacts** - Every asset can have an assigned owner and expert that can be viewed and managed from the contacts tab.
- **Related** - This tab lets you navigate to assets that are related to the current asset you are viewing. 

## Asset overview
The overview section of the asset details gives you a summarized view of an asset. The sections that follow explains the different parts of the overview page.

### Asset hierarchy

You can view the full asset hierarchy within the overview tab. As an example: if you navigate to a SQL table, then you can see the schema, database, and the server the table belongs to.

:::image type="content" source="media/catalog-asset-details/asset-hierarchy.png" alt-text="Asset hierarchy":::

### Asset classifications

Asset classifications identify the kind of data being represented, and are applied manually or during a scan. For example: a National ID or passport number are supported classifications. (For a full list of classifications, see the [supported classifications page](supported-classifications.md).) The overview tab reflects both asset level classifications and column level classifications that have been applied, which you can also view as part of the schema.

:::image type="content" source="media/catalog-asset-details/asset-classifications.png" alt-text="Asset classifications":::

### Asset description

You can view the description on an asset in the overview section. You can add an asset description by [editing the asset](#editing-assets)

:::image type="content" source="media/catalog-asset-details/asset-description.png" alt-text="Asset description":::

### Asset glossary terms

You can view the glossary terms on an asset in the overview section. You can add a glossary term on an asset by [editing the asset](#editing-assets)

:::image type="content" source="media/catalog-asset-details/asset-glossary.png" alt-text="Asset glossary terms":::

## Editing assets

You can edit an asset by clicking on the edit icon on the top-left corner of the asset.

:::image type="content" source="media/catalog-asset-details/asset-edit-delete.png" alt-text="Asset edit and delete buttons":::

At the asset level you can edit or add a description, classification, or glossary term by staying on the overview tab of the edit screen.

You can navigate to the schema tab of the edit screen to update column name, data type, column level classification, terms or asset description.

You can navigate to the contact tab of the edit screen to update owners and experts on the asset. You can search by full name, email or alias of the person within your Azure active directory.

### Edit behavior explained

If you make an asset level update like adding a description, asset level classification, glossary term, or a contact to an asset, then subsequent scans will update the asset schema (new columns and classifications detected by the scanner in subsequent scan runs).

If you make a column level update i.e., adding a description, column level classification or glossary term, updating the data type or column name, then subsequent scans will **not** update the asset schema (new columns and classifications **will not be detected** by the scanner in subsequent scan runs).

## Deleting assets

You can delete an asset by clicking on the delete icon under the name of the asset.

### Delete behavior explained

Any asset you delete using the delete button is permanently deleted. However, if you run a **full scan** on the source from which the asset was ingested into the catalog, then the asset does get re-ingested and you caa discover it using the Purview catalog.

If you have a scheduled scan (weekly or monthly) on the source, unless the asset you deleted is modified by an end user (e.g. new column added to SQL table by a user) since the previous run of the scan, the **asset will not get re-ingested** into the catalog. If the asset is modified in the source system (e.g. adding a new column to a SQL table) since the previous run of the scan and after the asset was deleted in the catalog, the asset will be re-scanned and ingested into the catalog.

If you delete an asset, the asset alone is deleted. Purview does not support cascaded deletes yet E.g. If you delete a storage account asset in your catalog - the containers, folders and files within them are not deleted. 

## Next steps

- [Browse the Azure Purview Data catalog](how-to-browse-catalog.md)
- [Search the Azure Purview Data Catalog](how-to-search-catalog.md)
