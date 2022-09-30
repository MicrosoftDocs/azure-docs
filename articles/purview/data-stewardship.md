---
title: Data Stewardship Insights in Microsoft Purview
description: This article describes the data stewardship dashboards in Microsoft Purview, and how they can be used to govern and manage your data estate.
author: SunetraVirdi
ms.author: suvirdi
ms.service: purview
ms.subservice: purview-insights
ms.custom: event-tier1-build-2022
ms.topic: how-to
ms.date: 05/16/2022
---

# Get insights into data stewardship from Microsoft Purview

As described in the [insights concepts](concept-insights.md), data stewardship is report that is part of the "Health" section of the Data Estate Insights App. This report offers a one-stop shop experience for data, governance, and quality focused users like chief data officers and data stewards to get actionable insights into key areas of gap in their data estate, for better governance. 

In this guide, you'll learn how to:

> [!div class="checklist"]
> * Navigate and view data stewardship report from your Microsoft Purview account.
> * Drill down for more asset count details.

## Prerequisites

Before getting started with Microsoft Purview Data Estate Insights, make sure that you've completed the following steps:

* Set up a storage resource and populated the account with data.

* Set up and completed a scan your storage source.

For more information to create and complete a scan, see [the manage data sources in Microsoft Purview article](manage-data-sources.md).

## Understand your data estate and catalog health in Data Estate Insights

In Microsoft Purview Data Estate Insights, you can get an overview of all assets inventoried in the Data Map, and any key gaps that can be closed by governance stakeholders, for better governance of the data estate.

1. Navigate to your Microsoft Purview account in the Azure portal.

1. On the **Overview** page, in the **Get Started** section, select the **Open Microsoft Purview governance portal** tile.

   :::image type="content" source="./media/data-stewardship/portal-access.png" alt-text="Screenshot of Microsoft Purview account in Azure portal with the Microsoft Purview governance portal button highlighted.":::

1. On the Microsoft Purview **Home** page, select **Data Estate Insights** on the left menu.

   :::image type="content" source="./media/data-stewardship/view-insights.png" alt-text="Screenshot of the Microsoft Purview governance portal with the Data Estate Insights button highlighted in the left menu.":::

1. In the **Data Estate Insights** area, look for **Data Stewardship** in the **Health** section.

   :::image type="content" source="./media/data-stewardship/data-stewardship-table-of-contents.png" alt-text="Screenshot of the Microsoft Purview governance portal Data Estate Insights menu with Data Stewardship highlighted under the Health section.":::


### View data stewardship dashboard

The dashboard is purpose-built for the governance and quality focused users, like data stewards and chief data officers, to understand the data estate health and catalog adoption health of their organization. The dashboard shows high level KPIs that need to reduce governance risks:

   * **Asset curation**: All data assets are categorized into three buckets - "Fully curated", "Partially curated" and "Not curated", based on certain attributes of assets being present. An asset is "Fully curated" if it has at least one classification tag, an assigned Data Owner and a description. If any of these attributes is missing, but not all, then the asset is categorized as "Partially curated" and if all of them are missing, then it's "Not curated". 
   * **Asset data ownership**: Assets that have the owner attribute within "Contacts" tab as blank are categorized as "No owner", else it's categorized as "Owner assigned".
   * **Catalog usage and adoption**: This KPI shows a sum of monthly active users of the catalog across different pages.

   :::image type="content" source="./media/data-stewardship/kpis-small.png" alt-text="Screenshot of the data stewardship insights summary graphs, showing the three main KPI charts." lightbox="media/data-stewardship/data-stewardship-kpis-large.png":::
    

As users look at the main dashboard layout, it's divided into two tabs - [**Data estate**](#data-estate) and [**Catalog adoption**](#catalog-adoption).

#### Data estate

This section of **data stewardship** gives governance and quality focused users, like data stewards and chief data officers, an overview of their data estate, as well as running trends.

:::image type="content" source="./media/data-stewardship/data-estate-small.png" alt-text="Screenshot of the data stewardship insights summary graphs, with the layout tabs highlighted in the middle of the page and data estate selected." lightbox="media/data-stewardship/data-estate-large.png":::

##### Data estate health
Data estate health is a scorecard view that helps management and governance focused users, like chief data officers, understand critical governance metrics that can be looked at by collection hierarchy. 

:::image type="content" source="./media/data-stewardship/data-estate-health-small.png" alt-text="Screenshot of the data stewardship data estate health table in the middle of the dashboard." lightbox="media/data-stewardship/data-estate-health-large.png":::

You can view the following metrics:
* **Total asset**: Count of assets by collection drill-down
* **With sensitive classifications**: Count of assets with any system classification applied
* **Fully curated assets**: Count of assets that have a data owner, at least one classification and a description.
* **Owners assigned**: Count of assets with data owner assigned on them
* **No classifications**: Count of assets with no classification tag
* **Net new assets**: Count of new assets pushed in the Data Map in the last 30 days
* **Deleted assets**: Count of deleted assets from the Data Map in the last 30 days

You can also drill down by collection paths. As you hover on each column name, it provides description of the column and takes you to the detailed graph for further drill-down.

:::image type="content" source="./media/data-stewardship/hover-menu.png" alt-text="Screenshot of the data stewardship data estate health table, with the fully curated column hovered over. A summary is show, and the view more in Stewardship insights option is selected.":::

:::image type="content" source="./media/data-stewardship/detailed-view.png" alt-text="Screenshot of the asset curation detailed view, as shown after selecting the view more in stewardship insights option is selected.":::

##### Asset curation
All data assets are categorized into three buckets - ***"Fully curated"***, ***"Partially curated"*** and ***"Not curated"***, based on whether assets have been given certain attributes. 

:::image type="content" source="./media/data-stewardship/asset-curation-small.png" alt-text="Screenshot of the data stewardship insights health dashboard, with the asset curation bar chart highlighted." lightbox="media/data-stewardship/asset-curation-large.png":::

An asset is ***"Fully curated"*** if it has at least one classification tag, an assigned data owner, and a description. 

If any of these attributes is missing, but not all, then the asset is categorized as ***"Partially curated"***. If all of them are missing, then it's listed as ***"Not curated"***. 

You can drill down by collection hierarchy.

:::image type="content" source="./media/data-stewardship/asset-curation-collection-filter.png" alt-text="Screenshot of the data stewardship asset curation chart, with the collection filter opened to show all available collections.":::

For further information about which assets aren't fully curated, you can select ***"View details"*** link that will take you into the deeper view.

:::image type="content" source="./media/data-stewardship/asset-curation-view-details.png" alt-text="Screenshot of the data stewardship asset curation chart, with the view details button highlighted below the chart.":::

In the ***"View details"*** page, if you select a specific collection, it will list all assets with attribute values or blanks, that make up the ***"fully curated"*** assets.

:::image type="content" source="./media/data-stewardship/asset-curation-select-collection.png" alt-text="Screenshot of the asset curation detailed view, shown after selecting View Details beneath the asset curation chart.":::

The detail page shows two key pieces of information:

First, it tells you what was the ***classification source***, if the asset is classified. It's **Manual** if a curator/data owner applied the classification manually. It's **Automatic** if it was classified during scanning. This page only provides the last applied classification state.

Second, if an asset is unclassified, it tells us why it's not classified, in the column ***Reasons for unclassified***.
Currently, Data estate insights can tell one of the following reasons:
* No match found
* Low confidence score
* Not applicable

:::image type="content" source="./media/data-stewardship/collection-detail-view-columns.png" alt-text="Screenshot of the collection detail view, with the classification source and reasons for unclassified columns highlighted.":::

You can select any asset and add missing attributes, without leaving the **Data estate insights** app.

:::image type="content" source="./media/data-stewardship/edit-asset.png" alt-text="Screenshot of the asset list page, with an asset selected and the edit menu open.":::

##### Trends and gap analysis

This graph shows how the assets and key metrics have been trending over:
* Last 30 days: The graph takes last run of the day or recording of the last run across days as a data point.
* Last six weeks: The graph takes last run of the week where week ends on Sunday. If there was no run on Sunday, then it takes the last recorded run.
* Last 12 months: The graph takes last run of the month.
* Last four quarters: The graph takes last run of the calendar quarter.

:::image type="content" source="./media/data-stewardship/trends-and-gap-analysis-small.png" alt-text="Screenshot of the data stewardship insights summary graphs, with data estate selected, showing the trends and gap analysis graph at the bottom of the page." lightbox="media/data-stewardship/trends-and-gap-analysis-large.png":::

#### Catalog adoption

This tab of the **data stewardship** insight gives management focused users like, chief data officers, a view of what is activity is happening in the catalog. The hypothesis is, the more activity on the catalog, the better usage, hence the better are the chances of governance program to have a high return on investment.

:::image type="content" source="./media/data-stewardship/catalog-adoption-small.png" alt-text="Screenshot of the data stewardship insights summary graphs, with the layout tabs highlighted in the middle of the page and catalog adoption selected." lightbox="media/data-stewardship/catalog-adoption-large.png":::

##### Active users trend by catalog features

Active users trend by area of the catalog, and the graph focuses on activities in **search and browse**, and **asset edits**.

If there are active users of search and browse, meaning the user has typed a search keyword and hit enter, or selected browse by assets, we count it as an active user of "search and browse".

If a user has edited an asset by selecting "save" after making changes, we consider that user as an active user of "asset edits".

:::image type="content" source="./media/data-stewardship/active-users-trend-small.png" alt-text="Screenshot of the data stewardship insights summary graphs, with the active users trend graph highlighted." lightbox="media/data-stewardship/active-users-trend-large.png":::

##### Most viewed assets in last 30 days

You can see the most viewed assets in the catalog, their current curation level, and number of views. This list is currently limited to five items.

:::image type="content" source="./media/data-stewardship/most-viewed-assets-small.png" alt-text="Screenshot of the data stewardship insights summary graphs, with the most viewed assets table highlighted.":::

##### Most searched keywords in last 30 days

You can view count of top five searches with a result returned. The table also shows what key words were searched without any results in the catalog.

:::image type="content" source="./media/data-stewardship/top-searched-keywords-small.png" alt-text="Screenshot of the data stewardship insights summary graphs, with the most searched keywords table highlighted.":::

## Next steps

Learn more about Microsoft Purview Data estate insights through:
* [Concepts](concept-insights.md)
