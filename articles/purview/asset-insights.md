---
title: Asset insights on your data in Microsoft Purview
description: This how-to guide describes how to view and use Microsoft Purview Data Estate Insights asset reporting on your data. 
author: SunetraVirdi
ms.author: suvirdi
ms.service: purview
ms.subservice: purview-insights
ms.custom: event-tier1-build-2022
ms.topic: how-to
ms.date: 05/16/2022
---

# Asset insights on your data in Microsoft Purview

This guide describes how to access, view, and filter Microsoft Purview asset insight reports for your data.

In this guide, you'll learn how to:

> [!div class="checklist"]
> * View data estate insights from your Microsoft Purview account.
> * Get a bird's eye view of your data.
> * Drill down for more asset count details.

## Prerequisites

Before getting started with Microsoft Purview Data Estate Insights, make sure that you've completed the following steps:

* Set up a storage resource and populated the account with data.

* Set up and completed a scan your storage source.

For more information to create and complete a scan, see [the manage data sources in Microsoft Purview article](manage-data-sources.md).

## Understand your asset inventory in Data Estate Insights 

In Microsoft Purview Data Estate Insights, you can get an overview of the assets that have been scanned into the Data Map and view key gaps that can be closed by governance stakeholders, for better governance of the data estate.

1. Open the Microsoft Purview governance portal by:

   - Browsing directly to [https://web.purview.azure.com](https://web.purview.azure.com) and selecting your Microsoft Purview account.
   - Opening the [Azure portal](https://portal.azure.com), searching for and selecting the Microsoft Purview account. Selecting the [**the Microsoft Purview governance portal**](https://web.purview.azure.com/) button.

   :::image type="content" source="./media/asset-insights/portal-access.png" alt-text="Screenshot of Microsoft Purview account in Azure portal with the Microsoft Purview governance portal button highlighted.":::

1. On the Microsoft Purview **Home** page, select **Data Estate Insights** on the left menu.

   :::image type="content" source="./media/asset-insights/view-insights.png" alt-text="Screenshot of the Microsoft Purview governance portal with the Data Estate Insights button highlighted in the left menu.":::

1. In the **Data Estate Insights** area, look for **Assets** in the **Inventory and Ownership** section.

   :::image type="content" source="./media/asset-insights/asset-insights-table-of-contents.png" alt-text="Screenshot of the Microsoft Purview governance portal Insights menu with Assets highlighted.":::


### View asset summary

1. The **Assets Summary** report provides several high-level KPIs, with these graphs:

   * **Unclassified assets**: Assets with no system or custom classification on the entity or its columns.
   * **Unassigned data owner**: Assets that have the owner attribute within "Contacts" tab as blank.
   * **Net new assets in last 30 days**: Assets that were added to the Purview account, via data scan or Atlas API pushes.
   * **Deleted assets in last 30 days**: Assets that were deleted from the Purview account, as a result of deletion from data sources.

   :::image type="content" source="./media/asset-insights/asset-insights-summary-report-small.png" alt-text="Screenshot of the insights assets summary graphs, showing the four main KPI charts." lightbox="media/asset-insights/asset-insights-summary-report.png":::

1. Below these KPIs, you can also view your data asset distribution by collection. 

   :::image type="content" source="./media/asset-insights/assets-by-collection-small.png" alt-text="Screenshot of the insights assets by collection section, showing all a graphic that summarizes number of assets by collection." lightbox="media/asset-insights/assets-by-collection.png":::
    
1. Using filters you can drill down to assets within a specific collection or classification category.

   :::image type="content" source="./media/asset-insights/filter.png" alt-text="Screenshot of the insights assets by collection section, with the filter at the top selected, showing available collections.":::

   > [!NOTE]
   > ***Each classification filter has some common values:***
   > * **Applied**: Any filter value is applied
   > * **Not Applied**: No filter value is applied. For example, if you pick a classification filter with value as "Not Applied", the graph will show all assets with no classification.
   > * **All**: Filter values are cleared. Meaning the graph will show all assets, with or without classification.
   > * **Specific**: You have picked a specific classification from the filter, and only that classification will be shown.

1. To learn more about which specific assets are shown in the graph, select **View details**.

   :::image type="content" source="./media/asset-insights/view-details.png" alt-text="Screenshot of the insights assets by collection section, with the view-details button at the bottom highlighted.":::

   :::image type="content" source="./media/asset-insights/details-view.png" alt-text="Screenshot of the asset details view screen, which is still within the Data Estate Insights application.":::

1. You can select any collection to view the collection's asset list.

   :::image type="content" source="./media/asset-insights/select-collection.png" alt-text="Screenshot of the asset details view screen, with one of the collections highlighted.":::

   :::image type="content" source="./media/asset-insights/asset-list.png" alt-text="Screenshot of the asset list screen, showing all assets within the selected collection.":::
 
1. You can also select an asset to edit without leaving the Data Estate Insights App.

   :::image type="content" source="./media/asset-insights/edit-asset.png" alt-text="Screenshot of the asset list screen, with an asset selected for editing and the asset edit screen open within the Data Estate Insights application.":::

 
### File-based source types

The next graphs in asset insights show a distribution of file-based source types. The first graph, called **Size trend (GB) of file type within source types**, shows top file type size trends over the last 30 days. 
 
1. Pick your source type to view the file type within the source. 
 
1. Select **View details** to see the current data size, change in size, current asset count and change in asset count.
 
   > [!NOTE]
   > If the scan has run only once in last 30 days or any catalog change like classification addition/removed happened only once in 30 days, then the change information above appears blank.

1. See the top folders with change top asset counts when you select source type.

1. Select the path to see the asset list.

The second graph in file-based source types is **Files not associated with a resource set**. If you expect that all files should roll up into a resource set, this graph can help you understand which assets haven't been rolled up. Missing assets can be an indication of the wrong file-pattern in the folder. You can select **View details** below the graph for more information.

   :::image type="content" source="./media/asset-insights/file-based-assets-inline.png" alt-text="View file based assets" lightbox="./media/asset-insights/file-based-assets.png":::  

## Next steps

Learn how to use Data Estate Insights with resources below:

* [Learn how to use data stewardship insights](data-stewardship.md)
* [Learn how to use classification insights](classification-insights.md)
* [Learn how to use glossary insights](glossary-insights.md)
* [Learn how to use label insights](sensitivity-insights.md)
