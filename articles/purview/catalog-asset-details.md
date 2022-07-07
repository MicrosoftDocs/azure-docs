---
title: How to view, edit, and delete assets
description: This how to guide describes how you can view and edit asset details. 
author: djpmsft
ms.author: daperlov
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 07/11/2022
---
# View, edit and delete assets in Microsoft Purview catalog

This article discusses how assets are displayed in the Microsoft Purview data catalog. It describes how you can view relevant information or take take action on assets in your catalog.
## Prerequisites

- Set up your data sources and scan the assets into your catalog.
- *Or* Use the Microsoft Purview Atlas APIs to ingest assets into the catalog. 

## Open an asset details page

You can discover your assets in the Microsoft Purview data catalog by either:
- [Browsing the data catalog](how-to-browse-catalog.md)
- [Searching the data catalog](how-to-search-catalog.md)

Once you find the asset you are looking for, you can view all of the asset information or take actino on them as described in following sections.

## Asset details tabs explained

:::image type="content" source="media/catalog-asset-details/asset-tabs.png" alt-text="Asset details tabs":::

- **Overview** - An asset's basic details like description, classification, hierarchy, and glossary terms.
- **Properties** - The technical metadata and relationships discovered in the data source. 
- **Schema** - The schema of the asset including column names, data types, column level classifications, terms, and descriptions are represented in the schema tab.
- **Lineage** - This tab contains lineage graph details for assets where it is available.
- **Contacts** - Every asset can have an assigned owner and expert that can be viewed and managed from the contacts tab.
- **Related** - This tab lets you navigate through the technical hierarchy of assets that are related to the current asset you are viewing.

## Asset overview
The overview section of the asset details gives you a summarized view of an asset. The sections that follow explains the different parts of the overview page.

:::image type="content" source="media/catalog-asset-details/asset-detail-overview.png" alt-text="Asset details overview":::

### Asset description

An asset description gives a synopsis of what the asset represents. You can add or update an asset description by [editing the asset](#editing-assets).

#### Adding rich text to a description

Microsoft Purview enables users to add rich formatting to asset descriptions such as adding bolding, underlining, or italicizing text. Users can also create tables, bulleted lists, or hyperlinks to external resources.

:::image type="content" source="media/catalog-asset-details/rich-text-editor.png" alt-text="Asset details overview":::

Below are the rich text formatting options:

| Name | Description | Shortcut key |
| ---- | ----------- | ------------ |
| Bold | Make your text bold. Adding the '*' character around text will also bold it.  | Ctrl+B |
| Italic | Italicize your text. Adding the '_' character around text will also italicize it. | Ctrl+I |
| Underline | Underline your text. | Ctrl+U |
| Bullets | Create a bulleted list. Adding the '-' character before text will also create a bulleted list. | |
| Numbering | Create a numbered list Adding the '1' character before text will also create a bulleted list. | | 
| Heading | Add a formatted heading | |
| Font size | Change the size of your text. The default size is 12. | |
| Decrease indent | Move your paragraph closer to the margin. | |
| Increase indent | Move your paragraph farther away from the margin. | |
| Add hyperlink | Create a link in your document for quick access to web pages and files. | | 
| Remove hyperlink | Change a link to plain text. | |
| Quote | Add quote text | |
| Add table | Add a table to your content. | |
| Edit table | Insert or delete a column or row from a table | |
| Clear formatting | Remove all formatting from a selection of text, leaving only the normal, unformatted text. | |
| Undo | Undo changes you made to the content. | Ctrl+Z | 
| Redo | Redo changes you made to the content. | Ctrl+Y | 

### Asset classifications

Asset classifications identify the kind of data being represented, and are applied manually or during a scan. For example: a National ID or passport number are supported classifications. (For a full list of classifications, see the [supported classifications page](supported-classifications.md).) The overview tab reflects both asset level classifications and column level classifications that have been applied, which you can also view as part of the schema.

### Asset glossary terms

Asset glossary terms are a managed vocabulary for business terms that can be used to categorize and relate assets across your environment. For example, terms like 'customer', 'buyer', 'cost center', or any terms that give your data context for your users. For more information, see the [business glossary page](concept-business-glossary.md). You can view the glossary terms for an asset in the overview section, and you can add a glossary term on an asset by [editing the asset](#editing-assets).

### Collection hierarchy

In Microsoft Purview, collections organize assets and data sources. They also manage access across the Microsoft Purview governance portal. You can view an assets containing collection under the **Collection path** section.

### Asset hierarchy

You can view the full asset hierarchy within the overview tab. As an example: if you navigate to a SQL table, then you can see the schema, database, and the server the table belongs to.

## Asset actions

Below are a list of actions you can take from an asset details page. Actions available to you can very depending on your permissions and the type of asset you are looking at. Available actions are generally available on the global actions bar. 

:::image type="content" source="media/catalog-asset-details/asset-details-actions.png" alt-text="Asset details overview":::

### Editing assets

If you are a data curator on the collection containing an asset, you can edit an asset by selecting the edit icon on the top-left corner of the asset.

At the asset level you can edit or add a description, classification, or glossary term by staying on the overview tab of the edit screen.

You can navigate to the schema tab on the edit screen to update column name, data type, column level classification, terms, or asset description.

You can navigate to the contact tab of the edit screen to update owners and experts on the asset. You can search by full name, email or alias of the person within your Azure active directory.

#### Scans on edited assets

If you edit an asset by adding a description, asset level classification, glossary term, or a contact, later scans will still update the asset schema (new columns and classifications detected by the scanner in subsequent scan runs).

If you make some column level updates, like adding a description, column level classification, or glossary term, then subsequent scans will also update the asset schema (new columns and classifications will be detected by the scanner in subsequent scan runs). 

Even on edited assets, after a scan Microsoft Purview will reflect the truth of the source system. For example: if you edit a column and it's deleted from the source, it will be deleted from your asset in Microsoft Purview. 

>[!NOTE]
> If you update the **name or data type of a column** in a Microsoft Purview asset, later scans **will not** update the asset schema. New columns and classifications **will not** be detected.

### Request access to data

If a [self-service data access workflow](how-to-workflow-self-service-data-access-hybrid.md) has been created, you can request access to a desired asset directly from the asset details page! To learn more about Microsoft Purview's data policy applications, see [how to enable data use management](how-to-enable-data-use-management.md).

### Open in PowerBI

Microsoft Purview makes it easy to work with useful data you find the data catalog. You can open certain assets in PowerBI Desktop from the asset details page. PowerBI Desktop integration is supported for the following sources. 

- Azure Blob Storage
- Azure Cosmos DB
- Azure Data Lake Storage Gen2
- Azure Dedicated SQL pool (formerly SQL DW)
- Azure SQL Database
- Azure SQL Database Managed Instance
- Azure Synapse Analytics
- Azure Database for MySQL
- Azure Database for PostgreSQL
- Oracle DB
- SQL Server
- Teradata

### Deleting assets

If you are a data curator on the collection containing an asset, you can delete an asset by selecting the delete icon under the name of the asset.

Any asset you delete using the delete button is permanently deleted in Microsoft Purview. However, if you run a **full scan** on the source from which the asset was ingested into the catalog, then the asset is reingested and you can discover it using the Microsoft Purview catalog.

If you have a scheduled scan (weekly or monthly) on the source, the **deleted asset will not get re-ingested** into the catalog unless the asset is modified by an end user since the previous run of the scan.   For example, if a SQL table was deleted from Microsoft Purview, but after the table was deleted a user added a new column to the table in SQL, at the next scan the asset will be rescanned and ingested into the catalog.

If you delete an asset, only that asset is deleted. Microsoft Purview does not currently support cascaded deletes. For example, if you delete a storage account asset in your catalog - the containers, folders and files within them are not deleted.

## Next steps

- [Browse the Microsoft Purview Data catalog](how-to-browse-catalog.md)
- [Search the Microsoft Purview Data Catalog](how-to-search-catalog.md)
