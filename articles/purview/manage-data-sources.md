---
title: Manage data sources in Azure Purview (Preview)
description: Learn how to register new data sources, manage collections of data sources, and view sources in Azure Purview (Preview).
author: viseshag
ms.author: viseshag
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 11/25/2020
---

# Manage data sources in Azure Purview (Preview)

In this article, you learn how to register new data sources, manage collections of data sources, and view sources in Azure Purview (Preview)

## Register a new source

Use the following steps to register a new source.

1. Open Purview Studio and select the **Register sources** tile.

   :::image type="content" source="media/manage-data-sources/purview-studio.png" alt-text="Azure Purview Studio":::

1. Select **Register**, and then select a source type. This example uses Azure Blob Storage. Select **Continue**.

   :::image type="content" source="media/manage-data-sources/select-source-type.png" alt-text="Select a data source type in the Register sources page":::

1. Fill out the form on the **Register sources** page. Select a name for your source and enter the relevant information. If you chose **From Azure subscription** as your account selection method, the sources in your subscription appear in a dropdown list. Alternatively, you can enter your source information manually.

   :::image type="content" source="media/manage-data-sources/register-sources-form.png" alt-text="Form for data source information":::

1. Select **Finish**.

## View sources

You can view all registered sources on the **Sources** tab of Azure Purview Studio. There are two view types: map view and list view.

### Map view

In Map view, you can see all of your sources and collections. In the following image, there is one Azure Blob Storage source. From each source tile, you can edit the source, start a new scan, or view source details.

:::image type="content" source="media/manage-data-sources/map-view.png" alt-text="Azure Purview data source map view":::

### List view

In List view, you can see a sortable list of sources. Hover over the source for options to edit, begin a new scan, or delete.

:::image type="content" source="media/manage-data-sources/list-view.png" alt-text="Azure Purview data source list view":::

## Manage collections

You can group your data sources into collections. To create a new collection, select **+ New collection** on the *Sources* page of Azure Purview Studio. Give the collection a name and select *None* as the Parent. The new collection appears in the map view.

To add sources to a collection, select the **Edit** pencil on the source and choose a collection from the **Select a collection** drop-down menu.

To create a hierarchy of collections, assign higher-level collections as a parent to lower-level collections. In the following image, *Fabrikam* is a parent to the *Finance* collection, which contains an Azure Blob Storage data source. You can collapse or expand collections by clicking the circle attached to the arrow between levels.

:::image type="content" source="media/manage-data-sources/collections.png" alt-text="A hierarchy of collections in Azure Purview Studio":::

You can remove sources from a hierarchy by selecting *None* for the parent. Unparented sources are grouped in a dotted box in the map view with no arrows linking them to parents.

## Next steps

Learn how to register and scan various data sources:

* [Azure Data Lake Storage Gen 2](register-scan-adls-gen2.md)
* [Power BI tenant](register-scan-power-bi-tenant.md)
* [Azure SQL Database](register-scan-azure-sql-database.md)
