---
title: Catalog Adoption Insights in Microsoft Purview
description: This article describes the catalog adoption dashboards in Microsoft Purview, and how they can be used to govern and manage your data estate.
author: SunetraVirdi
ms.author: suvirdi
ms.service: purview
ms.subservice: purview-insights
ms.topic: how-to
ms.date: 05/10/2023
---

# Get insights into catalog adoption from Microsoft Purview

As described in the [insights concepts](concept-insights.md), the catalog adoption report is part of the "Health" section of the Data Estate Insights App. This report offers a one-stop shop experience for administrators to determine if and how the Microsoft Purview Data Catalog is being used. It helps answer questions like:

- What are my users searching for?
- How many people used the data catalog last month?
- What are the most used data assets?

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

   :::image type="content" source="./media/catalog-adoption-insights/view-insights.png" alt-text="Screenshot of the Microsoft Purview governance portal with the Data Estate Insights button highlighted in the left menu.":::

1. In the **Data Estate Insights** area, look for **Catalog Adoption** in the **Health** section.

   :::image type="content" source="./media/catalog-adoption-insights/select-catalog-adoption.png" alt-text="Screenshot of the Microsoft Purview governance portal Data Estate Insights menu with Catalog Adoption highlighted under the Health section.":::

## View catalog adoption dashboard

The catalog adoption dashboard has several curated tiles and  charts to identify:

- How many active users your data catalog had in the last month
- How many total searches were performed in the last month
- Which data catalog features are being used
- Most viewed assets
- Top searched keywords in your data catalog

:::image type="content" source="./media/catalog-adoption-insights/catalog-adoption-page-inline.png" alt-text="Screenshot of the catalog adoption dashboard page." lightbox="./media/catalog-adoption-insights/catalog-adoption-page-large.png":::

### Monthly active users

The monthly active users tile provides a count of users who have taken at least one action in the Microsoft Purview Data Catalog in the last 30 days. An action in the data catalog includes: searching for a term, browsing in the data catalog, and updating an asset in the data catalog.

This tile also includes an indicator of a percentage increase or decrease in users from the previous month.

### Total searches

The total searches tile provides a count of all searches performed in the Microsoft Purview Data Catalog over the last 30 days. At the bottom it also includes an indicator of a percentage increase or decrease in the number of searches from the previous month.

### Active users by feature category

The active users by feature category chart allows you to monitory user activity trends in your data catalog.

:::image type="content" source="./media/catalog-adoption-insights/active-users-by-feature-category.png" alt-text="Screenshot of the Active users by feature category table, showing the daily date range selected and a line graph of activity.":::

At the top of the chart, you can select your date range to view user activity on a daily, weekly, or monthly basis.

The table then shows the number of users in the date range performing one of these three categories of actions:

- Search and browse - the count of users who performed any search or browse action in the Microsoft Purview Data Catalog
- Asset curation - the count of users who performed at least any one of these actions on an asset:
  - Added, removed, or updated a rating
  - Added or removed a tag
  - Added or removed a glossary term
  - Added or removed a classification
  - Edited an asset's name or description
  - Added or removed a certification
  - Added or removed a column level classification, glossary term, description, name, or data type
  - Added or removed manual lineage
  - Added or removed a contact
- All - the count of users who both performed search and browse and asset curation actions within the date range

### Most viewed assets

The most viewed assets table shows the top assets in your data catalog, by sum of views in the last 30 days.

:::image type="content" source="./media/catalog-adoption-insights/most-viewed-assets.png" alt-text="Screenshot of the Most viewed assets table, showing the top five viewed assets, their curation status, and the number of views in the last month.":::

This table allows you to select through to your most viewed assets for more information, but the table also provides these other details:

- Curation status - There are three possible statuses: "Fully curated", "Partially curated" and "Not curated", based on certain attributes of assets being present. An asset is "Fully curated" if it has at least one classification tag, an assigned Data Owner and a description. If any of these attributes is missing, but not all, then the asset is categorized as "Partially curated" and if all of them are missing, then it's "Not curated". For more information about the curation status of your data assets, see the [data stewardship dashboard](data-stewardship.md).
- Views - count of the number of views the asset received in the last 30 days.

### Top searched keywords

The top searched keywords table shows your top keywords both for searches that produced results, and searches that didn't. That way you can know what users are finding with the data catalog, and what they're still looking for.

:::image type="content" source="./media/catalog-adoption-insights/top-searched-keywords.png" alt-text="Screenshot of the Top searched keywords table, showing the top searched keywords with search results.":::

At the top of the table, you can select one of the two radio buttons to select whether to show keywords for searches with results, or searches without results.

You can select any of the keywords to run the search in the data catalog and see the results for yourself as well.

The table also provides search volume, which is the number of times that keyword was searched in the last 30 days.

## Next steps

Learn more about Microsoft Purview Data Estate Insights through:
* [Data Estate Insights Concepts](concept-insights.md)
* [Data stewardship insights](data-stewardship.md)
