---
title: Save searches and pin data assets in Azure Data Catalog
description: How-to for saving data sources and data assets for later use in Azure Data Catalog.
ms.service: data-catalog
ms.topic: how-to
ms.date: 12/16/2022
---
# Save searches and pin data assets in Azure Data Catalog

[!INCLUDE [Microsoft Purview redirect](includes/catalog-to-purview-migration-flag.md)]

## Introduction

Azure Data Catalog provides capabilities for data source discovery. You can search and filter the catalog to locate data sources and understand their intended purpose, making it easier to find the right data for the job at hand.

But what if you need to regularly work with the same data? And what if you and other users regularly contribute your knowledge to the same data sources in the catalog? In these situations, having to repeatedly issue the same searches can be inefficient. This is where [saved search](#saved-searches) and [pinned data assets](#pinned-data-assets) can help.

## Saved searches

A saved search in Data Catalog is a reusable, per-user search definition. You can define a search, including search terms, tags, and other filters, and then save it. You can rerun the saved search definition later to return any data assets that match its search criteria.

### Create a saved search

To create a saved search, follow these steps:

1. In the Azure Data Catalog portal, in the **Current Search** window, select **Save**. 

    ![Current Search settings Save link](./media/data-catalog-how-to-save-pin/01-save-option.png) 

1. Enter the search criteria that you want to reuse, and then select **Save**.

    ![Current Search settings saved search name](./media/data-catalog-how-to-save-pin/02-name.png)

1. When you're prompted, enter a name for the saved search. Pick a name that is meaningful and that describes the data assets that will be returned by the search.

### Manage saved searches

After you've saved one or more searches, a **Saved Searches** option is displayed beneath the **Current Search** box. When the list is expanded, all saved searches are displayed.

 ![Data Catalog - List of saved searches](./media/data-catalog-how-to-save-pin/03-list.png)

Do any of the following:

* To execute a search, select a saved search in the list.

* To view a list of management options for a saved search, select the down arrow next to the search name.

    ![Options for managing saved searches](./media/data-catalog-how-to-save-pin/04-managing.png)

* To enter a new name for the saved search, select **Rename**. The search definition isn't changed.

* To remove the saved search from your list, select **Delete**, and then confirm the deletion.

* To mark the saved search as your default search, select **Save As Default**. If you perform an “empty” search from the Azure Data Catalog home page, your default search is executed. In addition, the search that's marked as the default search is displayed at the top of the **Saved Searches** list.

### Organizational saved searches

All user in your organization can save searches for their own use. Data Catalog administrators can also save searches for all users within the organization. When administrators save a search, they're presented with a **Share within the company** option. Selecting this option shares the saved search for all users in the organization.

 ![Data Catalog - Organizational saved searches](./media/data-catalog-how-to-save-pin/08-organizational-saved-search.png)

## Pinned data assets

With saved searches, you can save and reuse search definitions. The data assets that are returned by the searches might change over time as the contents of the catalog change. When you pin data assets, you can explicitly identify specific data assets to make them easier to access without needing to use a search.

Pinning a data asset is straightforward. To add the data asset to your pinned list, select the **pin** icon. The icon is displayed in the corner of the asset tile in the tile view, and in the left-most column in the list view in the Azure Data Catalog portal.

![Data Catalog - The data-asset pin icon](./media/data-catalog-how-to-save-pin/05-pinning.png)

Unpinning a data asset is equally straightforward. Select the **unpin** icon to toggle the setting for the selected asset.

![Data Catalog - The data-asset unpin icon](./media/data-catalog-how-to-save-pin/06-unpinning.png)

## The My Assets section

The Data Catalog portal home page includes a **My Assets** section that displays assets of interest to the current user. This section includes both pinned assets and saved searches.

![The My Assets section on the home page](./media/data-catalog-how-to-save-pin/07-my-assets.png)

## Summary

Azure Data Catalog provides capabilities that make it easier to discover the data sources you need, so you and other organization members can spend less time looking for data and more time working with it. Saved searches and pinned data assets build on these core capabilities so users can easily identify data sources that they work with repeatedly.
