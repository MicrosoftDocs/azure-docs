---
title: Data Stewardship Insights in Microsoft Purview
description: This article describes the data stewardship dashboards in Microsoft Purview, and how they can be used to govern and manage your data estate.
author: SunetraVirdi
ms.author: suvirdi
ms.service: purview
ms.subservice: purview-insights
ms.custom: event-tier1-build-2022
ms.topic: how-to
ms.date: 04/25/2023
---

# Get insights into data stewardship from Microsoft Purview

As described in the [insights concepts](concept-insights.md), the data stewardship report is part of the "Health" section of the Data Estate Insights App. This report offers a one-stop shop experience for data, governance, and quality focused users like chief data officers and data stewards to get actionable insights into key areas of gap in their data estate.

In this guide, you'll learn how to:

> [!div class="checklist"]
> * Navigate and view data stewardship report from your Microsoft Purview account.
> * Drill down for more asset count details.

## Prerequisites

Before getting started with Microsoft Purview Data Estate Insights, make sure that you've completed the following steps:

* Set up a storage resource and populated the account with data.

* Set up and completed a scan your storage source.

* [Enable and schedule your data estate insights reports](how-to-schedule-data-estate-insights.md).

For more information to create and complete a scan, see [the manage data sources in Microsoft Purview article](manage-data-sources.md).

## Understand your data estate and catalog health in Data Estate Insights

In Microsoft Purview Data Estate Insights, you can get an overview of all assets inventoried in the Data Map, and any key gaps that can be closed by governance stakeholders, for better governance of the data estate.

1. Access the [Microsoft Purview Governance Portal](https://web.purview.azure.com/) and open your Microsoft Purview account.

1. On the Microsoft Purview **Home** page, select **Data Estate Insights** on the left menu.

   :::image type="content" source="./media/data-stewardship/view-insights.png" alt-text="Screenshot of the Microsoft Purview governance portal with the Data Estate Insights button highlighted in the left menu.":::

1. In the **Data Estate Insights** area, look for **Data Stewardship** in the **Health** section.

   :::image type="content" source="./media/data-stewardship/data-stewardship-table-of-contents.png" alt-text="Screenshot of the Microsoft Purview governance portal Data Estate Insights menu with Data Stewardship highlighted under the Health section.":::

## View data stewardship dashboard

The dashboard is purpose-built for the governance and quality focused users, like data stewards and chief data officers, to understand the data estate health of their organization. The dashboard shows high level KPIs that need to reduce governance risks:

* **Asset curation**: All data assets are categorized into three buckets - "Fully curated", "Partially curated" and "Not curated", based on certain attributes of assets being present. An asset is "Fully curated" if it has at least one classification tag, an assigned Data Owner and a description. If any of these attributes is missing, but not all, then the asset is categorized as "Partially curated" and if all of them are missing, then it's "Not curated".
* **Asset data ownership**: Assets that have the owner attribute within "Contacts" tab as blank are categorized as "No owner", else it's categorized as "Owner assigned".

   :::image type="content" source="./media/data-stewardship/kpis-small.png" alt-text="Screenshot of the data stewardship insights summary graphs, showing the three main KPI charts." lightbox="media/data-stewardship/data-stewardship-kpis-large.png":::

### Data estate health

Data estate health is a scorecard view that helps management and governance focused users, like chief data officers, understand critical governance metrics that can be looked at by collection hierarchy.

:::image type="content" source="./media/data-stewardship/data-estate-health-small.png" alt-text="Screenshot of the data stewardship data estate health table in the middle of the dashboard." lightbox="media/data-stewardship/data-estate-health-large.png":::

You can view the following metrics:
* **Assets**: Count of assets by collection drill-down
* **With sensitive classifications**: Count of assets with any system classification applied
* **Fully curated assets**: Count of assets that have a data owner, at least one classification and a description.
* **Owner assigned**: Count of assets with data owner assigned on them
* **No classifications**: Count of assets with no classification tag
* **Out of date**: Percentage of assets that have not been updated in over 365 days.
* **New**: Count of new assets pushed in the Data Map in the last 30 days
* **Updated**: Count of assets updated in the Data Map in the last 30 days
* **Deleted**: Count of deleted assets from the Data Map in the last 30 days

You can also drill down by collection paths. As you hover on each column name, it provides description of the column, provides recommended percentage ranges, and takes you to the detailed graph for further drill-down.

:::image type="content" source="./media/data-stewardship/hover-menu.png" alt-text="Screenshot of the data stewardship data estate health table, with the fully curated column hovered over. A summary is show, and the view more in Stewardship insights option is selected.":::

:::image type="content" source="./media/data-stewardship/detailed-view.png" alt-text="Screenshot of the asset curation detailed view, as shown after selecting the view more in stewardship insights option is selected.":::

### Asset curation

All data assets are categorized into three buckets - ***Fully curated***, ***Partially curated*** and ***Not curated***, based on whether assets have been given certain attributes.

:::image type="content" source="./media/data-stewardship/asset-curation-small.png" alt-text="Screenshot of the data stewardship insights health dashboard, with the asset curation bar chart highlighted." lightbox="media/data-stewardship/asset-curation-large.png":::

An asset is ***Fully curated*** if it has at least one classification tag, an assigned data owner, and a description.

If any of these attributes is missing, but not all, then the asset is categorized as ***Partially curated***. If all of them are missing, then it's listed as ***Not curated***.

You can drill down by collection hierarchy.

:::image type="content" source="./media/data-stewardship/asset-curation-collection-filter.png" alt-text="Screenshot of the data stewardship asset curation chart, with the collection filter opened to show all available collections.":::

For further information about which assets aren't fully curated, you can select **View details** link that will take you into the deeper view.

:::image type="content" source="./media/data-stewardship/asset-curation-view-details.png" alt-text="Screenshot of the data stewardship asset curation chart, with the view details button highlighted below the chart.":::

In the **View details** page, if you select a specific collection, it will list all assets with attribute values or blanks, that make up the ***fully curated*** assets.

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

### Trends and gap analysis

This graph shows how the assets and key metrics have been trending over:

* Last 30 days: The graph takes last run of the day or recording of the last run across days as a data point.
* Last six weeks: The graph takes last run of the week where week ends on Sunday. If there was no run on Sunday, then it takes the last recorded run.
* Last 12 months: The graph takes last run of the month.
* Last four quarters: The graph takes last run of the calendar quarter.

:::image type="content" source="./media/data-stewardship/trends-and-gap-analysis-small.png" alt-text="Screenshot of the data stewardship insights summary graphs, with data estate selected, showing the trends and gap analysis graph at the bottom of the page." lightbox="media/data-stewardship/trends-and-gap-analysis-large.png":::

## Next steps

Learn more about Microsoft Purview Data Estate Insights through:
* [Data Estate Insights Concepts](concept-insights.md)
