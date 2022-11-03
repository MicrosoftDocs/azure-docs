---
title: 'How to: browse the Data Catalog'
description: This article gives an overview of how to browse the Microsoft Purview Data Catalog by asset type
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: conceptual
ms.date: 10/01/2021
---

# Browse the Microsoft Purview Data Catalog

Searching a data catalog is a great tool for data discovery if a data consumer knows what they're looking for, but often users don't know exactly how their data estate is structured. The Microsoft Purview Data Catalog offers a browse experience that enables users to explore what data is available to them either by collection or through traversing the hierarchy of each data source in the catalog.

To access the browse experience, select “Browse assets” from the data catalog home page.

:::image type="content" source="media/how-to-browse-catalog/studio-home-page.png" alt-text="Microsoft Purview home page" border="true":::

## Browse by collection

Browse by collection allows you to explore the different collections you're a data reader or curator for.

> [!NOTE]
> You will only see collections you have access to. For more information, see [create and manage Collections](how-to-create-and-manage-collections.md).

:::image type="content" source="media/how-to-browse-catalog/browse-by-collection.png" alt-text="Screenshot showing the browse by collection page" border="true":::

Once a collection is selected, you'll get a list of assets in that collection with the facets and filters available in search. As a collection can have thousands of assets, browse uses the Microsoft Purview search relevance engine to boost the most important assets to the top.

:::image type="content" source="media/how-to-browse-catalog/browse-collection-results.png" alt-text="Screenshot showing the browse by collection results" border="true":::

For certain annotations, you can select the ellipses to choose between an AND condition or an OR condition. 

:::image type="content" source="./media/how-to-search-catalog/search-and-or-choice.png" alt-text="Screenshot showing how to choose between and AND or OR condition" border="true":::

If the selected collection doesn’t contain the data you're looking for, you can easily navigate to related collections, or go back and view the entire collections tree.

:::image type="content" source="media/how-to-browse-catalog/browse-collection-navigation.png" alt-text="Screenshot showing how to navigate between collections" border="true":::

Once you find the asset you're looking for, you can select it to view more details such as schema, lineage, and a detailed classification list. To learn more about the asset details page, see [Manage catalog assets](catalog-asset-details.md).

:::image type="content" source="./media/how-to-search-catalog/search-view-asset.png" alt-text="Screenshot showing the asset details page" border="true":::

## Browse by source type

Browse by source type allows data consumers to explore the hierarchies of data sources using an explorer view. Select a source type to see the list of scanned sources.

For example, you can easily find a dataset called *DateDimension* under a folder called *Dimensions* in Azure Data lake Storage Gen 2. You can use the 'Browse by source type' experience to navigate to the ADLS Gen 2 storage account, then browse to the service > container > folder(s) to reach the specific *Dimensions* folder and then see the *DateDimension* table.

A native browsing experience with hierarchical namespace is provided for each corresponding data source.

> [!NOTE]
> After a successful scoped scan, there may be delay before newly scanned assets appear in the browse experience.


1. On the **Browse by source types** page, tiles are categorized by data sources. To further explore assets in each data source, select the corresponding tile.

    :::image type="content" source="media/how-to-browse-catalog/browse-asset-types.png" alt-text="Browse asset types page" border="true":::

   > [!TIP]
   > Certain tiles are groupings of a collection of data sources. For example, the Azure Storage Account tile contains all Azure Blob Storage and Azure Data Lake Storage Gen2 accounts. The Azure SQL Server tile will display the Azure SQL Server assets that contain Azure SQL Database and Azure Dedicated SQL Pool instances ingested into the catalog. 

1. On the next page, top-level assets under your chosen data type are listed. Pick one of the assets to further explore its contents. For example, after selecting "Azure SQL Database", you'll see a list of databases with assets in the data catalog.

    :::image type="content" source="media/how-to-browse-catalog/asset-type-specific-browse.png" alt-text="Azure SQL Database browse page" border="true":::

1. The explorer view will open. Start browsing by selecting the asset on the left panel. Child assets will be listed on the right panel of the page.

    :::image type="content" source="media/how-to-browse-catalog/explorer-view.png" alt-text="Explorer view" border="true":::

1. To view the details of an asset, select the name or the ellipses button on the far right.

    :::image type="content" source="media/how-to-browse-catalog/view-asset-detail-click-ellipses-inline.png" alt-text="Select the ellipses button to see asset details page" lightbox="media/how-to-browse-catalog/view-asset-detail-click-ellipses-expanded.png" border="true":::

## Next steps

- [How to create, import, and export glossary terms](how-to-create-import-export-glossary.md)
- [How to manage term templates for business glossary](how-to-manage-term-templates.md)
- [How to search the Microsoft Purview Data Catalog](how-to-search-catalog.md)
