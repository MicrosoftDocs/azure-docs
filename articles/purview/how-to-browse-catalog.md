---
title: How to browse the data catalog 
description: This article gives an overview of How to browse a data catalog using 'Browse by asset type tile'
author: chanuengg
ms.author: csugunan
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: conceptual
ms.date: 9/30/2020
---

# How to Browse Data catalog

This guide outlines a generic browsing experience in your catalog for Data discovery using the data source hierarchical namespace.

## Browse experience

A Data consumer can discover data using the familiar hierarchical namespace for each of the data source using an explorer view. Once the data source is registered and scanned, the Data map extracts information about the structure(hierarchical namespace) of the Data source. This information is used to build the browsing experience for Data discovery.

For example, a data consumer can easily find a dataset called 'DateDimension' under a folder called 'Dimensions' in Azure Data lake Storage Gen 2. Data consumer can use the 'Browse by Asset Type' experience to navigate to the ADLS Gen 2 storage account, then browse the service -> container -> Folder(s) to reach the specific 'Dimensions' folder to see the DateDimension table.

A native browsing experience with hierarchical namespace is provided for each of the corresponding data source.

## Launch browse experience

1. The browse experience can be launched by selecting the "Browse by asset type" tile in homepage.

:::image type="content" source="media/how-to-browse-catalog/home.jpg" alt-text="Purview home page":::

2. On browse asset types page, tiles are categorized by data sources. To further explore assets in each data source, select the corresponding tile.

:::image type="content" source="media/how-to-browse-catalog/browse-asset-types.jpg" alt-text="Browse asset types page":::

3. On the next page, top-level assets under chosen type are listed. Pick one of the assets to further explore the contents within.

:::image type="content" source="media/how-to-browse-catalog/asset-type-specific-browse.jpg" alt-text="Asset type specific browse page. Example shown is Azure Storage account":::

4. The explorer view will open. Start browsing by selecting the asset on the left panel. Children assets will be listed on the right panel of the page.

:::image type="content" source="media/how-to-browse-catalog/explorer-view.jpg" alt-text="Explorer view":::

5. To view the details of an asset, select the name or the ellipses button on the far right.

:::image type="content" source="media/how-to-browse-catalog/view-asset-detail-click-ellipses.jpg" alt-text="Select the ellipses button to see asset details page":::

## Launch related experience from asset detail page

Once the data consumer is in the asset detail page, they can launch an experience to see other related assets. For example, the data consumer can navigate to the parent folder of 'DateDimension' to see the 'Dimensions' folder or even navigate to the container to see the assets under the specific hierarchy. 

1. From the asset detail page, select the Related tab to see other related assets.

:::image type="content" source="media/how-to-browse-catalog/launch-related-tab.jpg" alt-text="Launch Related tab":::

2. The Current asset's full relationship will be listed in hierarchical namespace.

:::image type="content" source="media/how-to-browse-catalog/hierarchical-structure.jpg" alt-text="Hierarchical structure":::

3. Select any level on the hierarchical map to list the immediate assets under that hierarchy.

:::image type="content" source="media/how-to-browse-catalog/select-different-hierarchy.jpg" alt-text="Select different hierarchy":::