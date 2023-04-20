---
title: How to manage data sources
description: Learn how to register new data sources, manage collections of data sources, and view sources in Microsoft Purview.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 02/01/2023
---

# Manage data sources in Microsoft Purview

In this article, you learn how to register new data sources, manage collections of data sources, view sources, and move sources between collections in Microsoft Purview.

## Register a new source

>[!NOTE]
> You'll need to be a Data Source Admin and one of the other Purview roles (for example, Data Reader or Data Share Contributor) to register a source and manage it in the Microsoft Purview governance portal. See our [Microsoft Purview Permissions page](catalog-permissions.md) for details on roles and adding permissions.

Use the following steps to register a new source:

1. Open [the Microsoft Purview governance portal](https://web.purview.azure.com/resource/), navigate to the **Data Map**, **Sources**, and select **Register**.

   :::image type="content" source="media/manage-data-sources/purview-studio.png" alt-text="Screenshot of the Microsoft Purview governance portal.":::

1. Select a source type. This example uses Azure Blob Storage. Select **Continue**.

   :::image type="content" source="media/manage-data-sources/select-source-type.png" alt-text="Screenshot showing selecting a data source type in the Register sources page.":::

1. Fill out the form on the **Register sources** page. Select a name for your source and enter the relevant information. If you chose **From Azure subscription** as your account selection method, the sources in your subscription appear in a dropdown list.

1. Select **Register**.

>[!IMPORTANT]
>Most data sources have additional information and prerequisites to register and scan them in Microsoft Purview. For a list of all available sources, and links to source-specific instructions for registeration and scanning, see our [supported sources article.](microsoft-purview-connector-overview.md#microsoft-purview-data-map-available-data-sources)

## View sources

You can view all registered sources on the **Data Map** tab of the Microsoft Purview governance portal. 
There are two view types: 

- [The map view](#map-view)
- [The list view](#table-view)

### Map view

In Map view, you can see all of your sources and collections. In the following image we can see the root collection at the top, called ContosoPurview. Two sources are housed in the root collection: An Azure Data Lake Storage Gen2 source and a Power BI source. There are also five subcollections: Finance, Marketing, Sales, Development, and Outreach.

:::image type="content" source="media/manage-data-sources/map-view-inline.png" alt-text="Screenshot of the Microsoft Purview data source map view." lightbox="media/manage-data-sources/map-view-expanded.png":::

Each of the subcollections can be opened and managed from the map view by selecting the **+** button.
You can also register a new source by selecting the register source button, or view details by selecting **View details**.

:::image type="content" source="media/manage-data-sources/collection-options.png" alt-text="Screenshot the map view showing the Root collection and the finance subcollection with its resource and subcollections expanded.":::

### Table view

In the table view, you can see a sortable list of sources. Hover over the source for options to edit, begin a new scan, or delete.

:::image type="content" source="media/manage-data-sources/list-view.png" alt-text="Screenshot of the Microsoft Purview data source list view." lightbox="media/manage-data-sources/list-view.png":::

## Manage collections

You can group your data sources into collections. To create a new collection, select **+ New collection** on the *Sources* page of the Microsoft Purview governance portal. Give the collection a name and select *None* as the Parent. The new collection appears in the map view.

To add sources to a collection, select the **Edit** pencil on the source and choose a collection from the **Select a collection** drop-down menu.

To create a hierarchy of collections, assign higher-level collections as a parent to lower-level collections. In the following image, *ContosoPurview* is a parent to the *Finance* collection, which contains an Azure SQL Database source and two subcollections: Investment and Revenue. You can collapse or expand collections by selecting the circle attached to the arrow between levels.

:::image type="content" source="media/manage-data-sources/collections.png" alt-text="Screenshot of a hierarchy of collections in the Microsoft Purview governance portal.":::

>[!TIP] 
>You can remove sources from a hierarchy by selecting *None* for the parent. Unparented sources are grouped in a dotted box in the map view with no arrows linking them to parents.

## Move sources between collections

After you've registered your source, you can move it to another collection that you have access to.

>[!IMPORTANT]
> When a source moves to a new collection, its scans move with it, but assets will not appear in the new collection until your next scan.

1. Find your source in the data map and select it.

1. Beside the **Collection Path** list, select the ellipsis (...) button and select **Move**.

   :::image type="content" source="media/manage-data-sources/choose-to-move.png" alt-text="Screenshot of a source, with the ellipsis and move buttons highlighted.":::

1. In the **Move collection** menu that appears, select your collection from the drop-down and then select **Ok**.

   :::image type="content" source="media/manage-data-sources/select-collection.png" alt-text="Screenshot of the Move collection window, showing the drop down selection of collections.":::

1. Your collection has been moved. It can take up to an hour for results to be fully seen across your Microsoft Purview environment. Your scans will move with your resource, but assets will remain in their original collection until your next scan, then they'll move to the new collection.

>[!NOTE]
>If any of the assets from your source were moved manually to a different collection before the source was migrated, the scan won't take them to the new collection. They will remain in the collection you moved them to.

## Next steps

Learn how to discover and govern various data sources:

* [Azure Data Lake Storage Gen 2](register-scan-adls-gen2.md)
* [Power BI tenant](register-scan-power-bi-tenant.md)
* [Azure SQL Database](register-scan-azure-sql-database.md)
