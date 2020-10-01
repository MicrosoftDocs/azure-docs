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

This guide outlines a generic browsing experience in your catalog for Data discovery using the hierarchial namespace of each data source.

## Browse experience

A Data consumers can discover data using the familiar hierarchical namespace for each of the data source using an explorer view. Once the data source is registered and scanned, the Data map extracts information about the structure(hierarchical namespace) of the Data source. This information is used to build the browsing experience for Data discovery.

For example, as a data consumer I am trying to find a dataset called 'DateDimension' under a folder called 'Dimensions' in my data lake built in Azure Data lake Storage Gen 2. I can use the 'Browse by Asset Type' experience to navigate to the ADLS Gen 2 storage account, then browse the service -> container -> Folder(s) to reach the specific 'Dimensions' folder to see the DataDimension table.

A native browsing experience with hierarchical namespace is provided for each of the corresponding data source.

## Launch browse experience

1. The browsing experience can be launched by clicking on the "Browse by asset type" tile in homepage.
   ![alt-text](./media/browse-feature/image1.jpg)
2. On browse asset types page, tiles are categorized by data source type. To further explore assets, click on one of data source type tile that you're interested in.
   ![alt-text](./media/browse-feature/image2.jpg)
3. On the next page, top-level assets under chosen type are listed. Pick one of the asset to further explore the contents within.
   ![alt-text](./media/browse-feature/image3.jpg)

4. The explorer view will open. Start browsing by selecting the asset on the left panel. Children assets will be listed on the right panel of the page.

   ![alt-text](./media/browse-feature/image6.jpg)

5. To view the detail information of an asset, click on the name or the ellipses to the right which will navigate you to the asset's detail page.

   ![alt-text](./media/browse-feature/image7.jpg)

## Launch related experience from asset detail page

Once the data consumer is in the asset detail page, they can launch an experience to see other related assets. For example, the data consumer can navigate to the parent folder of 'DateDimension' to see the 'Dimensions' folder or even navigate to the container to see the assets under the specific hierarchy. 

1. From the asset detail page, click on the Related tab to see other related assets.
   ![alt-text](./media/browse-feature/image10.jpg)
2. The Current asset's full relationship will be listed in hierarchical namespace.
   ![alt-text](./media/browse-feature/image11.jpg)

3. Click on any level on the hierarchial map to list the children assets under the selected hierarchy.
   ![alt-text](./media/browse-feature/image13.jpg)
