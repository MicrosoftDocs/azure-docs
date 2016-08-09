<properties
   pageTitle="How to save searches and pin data assets | Microsoft Azure"
   description="How-to article highlighting capabilities in Azure Data Catalog for saving data sources and data assets for later reuse."
   services="data-catalog"
   documentationCenter=""
   authors="steelanddata"
   manager="NA"
   editor=""
   tags=""/>
<tags
   ms.service="data-catalog"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-catalog"
   ms.date="07/12/2016"
   ms.author="maroche"/>

# How to save searches and pin data assets

## Introduction

Microsoft Azure Data Catalog provides capabilities for data source discovery. Users can quickly search and filter the catalog to locate data sources and understand their intended purpose, making it easier to find the right data for the job at hand.

But what about when users need to regularly work with the same data? What about when users regularly contribute their knowledge to the same data sources in the catalog? In these situations, having to repeatedly issue the same searches can be inefficient – this is where saved search and pinned data assets can help.

## Saved searches

A saved search in Azure Data Catalog is a reusable, per-user search definition. Once a user has defined a search – including search terms, tags, and other filters – he can save it for later use. The saved search definition can then be re-run at a later date, to return any data assets that match its search criteria.

### Creating a saved search

To create a saved search, first enter the search criteria to be reused. Then click the “Save” link in the “Current Search” box in the Azure Data Catalog portal.

 ![Select 'Save' to save the current search settings](./media/data-catalog-how-to-save-pin/01-save-option.png)

When prompted, enter a name for the saved search. Pick a name that is meaningful and descriptive of the data assets that will be returned by the search.

 ![Provide a name for the saved search](./media/data-catalog-how-to-save-pin/02-name.png)

### Managing saved searches

Once a user has saved one or more searches, a “Saved Searches” option will appear in the Azure Data Catalog portal under the “Current Search” box. When expanded, the complete list of saves searches will be displayed.

 ![List of saved searches](./media/data-catalog-how-to-save-pin/03-list.png)

Selecting a saved search from the list will cause the search to be executed.

Selecting the drop-down menu will provide a set of management options:

 ![Options for managing saved searches](./media/data-catalog-how-to-save-pin/04-managing.png)

Selecting “Rename” will prompt the user to enter a new name for the saved search. The search definition will not be changed.

Selecting “Delete” will prompt the user for confirmation, and will then remove the saved search from the user’s list.

Selecting “Save as Default” will mark the chosen saved search as the default search for the user. If the user performs an “empty” search from the Azure Data Catalog home page, the user’s default search will be executed. In addition, the search marked as default will appear at the top of the saved search list.

## Pinned data assets

Saved searches allow users to save and reuse search definitions; the data assets returned by the searches may change over time as the contents of the catalog change. Pinning data assets allows users to explicitly identify specific data assets to make them easier to access without needing to use a search.

Pinning a data asset is straightforward – users can simply click the “pin” icon for the data asset to add it to their pinned list. This icon appears in the corner of the asset tile in the tile view, and in the left-most column in the list view in the Azure Data Catalog portal.

![Pinning a data asset](./media/data-catalog-how-to-save-pin/05-pinning.png)

Unpinning an asset is equally straightforward – users simply click the “pin” icon again to toggle the setting for the selected asset.

![Unpinning a data asset](./media/data-catalog-how-to-save-pin/06-unpinning.png)

## “My Assets”
The Azure Data Catalog portal home page includes a “My Assets” section that displays assets of interest to the current user. This section includes both pinned assets and saved searches.

!['My Assets' on the home page](./media/data-catalog-how-to-save-pin/07-my-assets.png)

## Summary
Azure Data Catalog provides capabilities that make it easier for users to discover the data sources they need, so they can spend less time looking for data and more time working with it. Saved searches and pinned data assets build on these core capabilities so users can easily identify data sources with which they will work repeatedly.
