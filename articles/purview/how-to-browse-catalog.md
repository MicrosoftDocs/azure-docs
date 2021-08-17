---
title: 'How to: browse the Data Catalog'
description: This article gives an overview of how to browse the Azure Purview data catalog by asset type
author: djpmsft
ms.author: daperlov
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: conceptual
ms.date: 05/21/2021
---

# Browse the Azure Purview Data catalog

This article describes how to discover data in your Azure Purview Data Catalog using the data source hierarchical namespace.

## Browse experience

A data consumer can discover data using the familiar hierarchical namespace for each of the data sources using an explorer view. Once the data source is registered and scanned, the Data map extracts information about the structure (hierarchical namespace) of the data source. This information is used to build the browsing experience for data discovery.

For example, you can easily find a dataset called *DateDimension* under a folder called *Dimensions* in Azure Data lake Storage Gen 2. You can use the 'Browse by Asset Type' experience to navigate to the ADLS Gen 2 storage account, then browse to the service > container > folder(s) to reach the specific *Dimensions* folder and then see the *DateDimension* table.

A native browsing experience with hierarchical namespace is provided for each of the corresponding data source.

> [!NOTE]
> After a successful scan, there may be delay before newly scanned assets appear in the browse experience. This delay may take up to a few hours.

## Browse the Data Catalog by asset type

1. You can browse data assets, by selecting the **Browse by asset type** on the homepage.

    :::image type="content" source="media/how-to-browse-catalog/studio-home-page.png" alt-text="Purview home page" border="true":::

1. On the **Browse asset types** page, tiles are categorized by data sources. To further explore assets in each data source, select the corresponding tile.

    :::image type="content" source="media/how-to-browse-catalog/browse-asset-types.jpg" alt-text="Browse asset types page" border="true":::

> [!TIP]
> Certain tiles are groupings of a collection of data sources. For example, the Azure Storage Account tile contains all Azure Blob Storage and Azure Data Lake Storage Gen2 accounts. The Azure SQL Server tile will display the Azure SQL Server assets that contain Azure SQL Database and Azure Dedicated SQL Pool instances ingested into the catalog. 

1. On the next page, top-level assets under your chosen data type are listed. Pick one of the assets to further explore its contents.

    :::image type="content" source="media/how-to-browse-catalog/asset-type-specific-browse.jpg" alt-text="Asset type specific browse page. Example shown is Azure Storage account" border="true":::

1. The explorer view will open. Start browsing by selecting the asset on the left panel. Child assets will be listed on the right panel of the page.

    :::image type="content" source="media/how-to-browse-catalog/explorer-view.jpg" alt-text="Explorer view" border="true":::

1. To view the details of an asset, select the name or the ellipses button on the far right.

    :::image type="content" source="media/how-to-browse-catalog/view-asset-detail-click-ellipses.jpg" alt-text="Select the ellipses button to see asset details page" border="true":::

## View related data assets

Once you are on the asset detail page, you can also view other related data assets. For example, you can navigate to the parent folder of *DateDimension* to see the *Dimensions* folder or even navigate to the container to see the assets under the specific hierarchy.

1. From the asset detail page, select the **Related** tab to see other related assets.

    :::image type="content" source="media/how-to-browse-catalog/launch-related-tab.jpg" alt-text="Launch Related tab" border="true":::

1. The current asset's full hierarchy will be listed on the left.

    :::image type="content" source="media/how-to-browse-catalog/hierarchical-structure.jpg" alt-text="Hierarchical structure" border="true":::

1. Select any level in the hierarchy to list the immediate assets under that level.

    :::image type="content" source="media/how-to-browse-catalog/select-different-hierarchy.jpg" alt-text="Select different hierarchy" border="true":::

## Next steps

- [How to create, import, and export glossary terms](how-to-create-import-export-glossary.md)
- [How to manage term templates for business glossary](how-to-manage-term-templates.md)
