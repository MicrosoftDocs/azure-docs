---
title: Understand Insights reports in Microsoft Purview
description: This article explains what Insights are in Microsoft Purview.
author: SunetraVirdi
ms.author: suvirdi
ms.service: purview
ms.subservice: purview-insights
ms.custom: event-tier1-build-2022
ms.topic: conceptual
ms.date: 05/16/2022
---

# Understand the Microsoft Purview Data Estate Insights application

This article provides an overview of the Data Estate Insights application in Microsoft Purview.

The Data Estate Insights application is purpose-built for governance stakeholders, primarily for roles focused on data management, compliance, and data use: like a Chief Data Officer. The application provides actionable insights into the organization’s data estate, catalog usage, adoption, and processes. As organizations scan and populate their Microsoft Purview Data Map, the Data Estate Insights application automatically extracts valuable governance gaps and highlights them in its top metrics. Then it also provides drill-down experience that enables all stakeholders, such as data owners and data stewards, to take appropriate action to close the gaps. 

All the reports within the Data Estate Insights application are automatically generated and populated, so governance stakeholders can focus on the information itself, rather than building the reports.

The dashboards and reports available within Microsoft Purview Data Estate Insights are categorized in three sections: 
* [Health](#health)
* [Inventory and Ownership](#inventory-and-ownership)
* [Curation and governance](#curation-and-governance)

   :::image type="content" source="./media/insights/table-of-contents.png" alt-text="Screenshot of table of contents for Microsoft Purview Data Estate Insights.":::

## Health

Data, governance, and quality focused users like chief data officers and data stewards can start at the health dashboards to understand the current health status of their data estate, current return on investment on their catalog, and begin to address any outstanding issues.

   :::image type="content" source="./media/insights/data-stewardship-small.png" alt-text="Screenshot of health insights report dashboard." lightbox="media/insights/data-stewardship-large.png":::

### Data stewardship

The data stewardship dashboard highlights key performing indicators that the governance stakeholders need to focus on, to attain a clean and governance-ready data estate. Information like asset curation rates, data ownership rates, and classification rates are calculated out of the box and trended over time.

Management-focused users, like a Chief Data Officer, can also get a high-level understanding of weekly and monthly active users of their catalog, and information about how the catalog is being used. Is the catalog being adopted across their organization, as better adoption will lead to better overall governance penetration in the organization?

For more information about these dashboards, see the [data Stewardship documentation.](data-stewardship.md)

## Inventory and ownership

This area focuses on summarizing data estate inventory for data quality and management focused users, like data stewards and data curators. These dashboards provide key metrics and overviews to give users the ability to find and resolve gaps in their assets, all from within the data estate insights application.

   :::image type="content" source="./media/insights/asset-insights-small.png" alt-text="Screenshot of inventory and ownership insights report dashboard." lightbox="media/insights/asset-insights-large.png":::

### Assets

This report provides a summary of your data estate and its distribution by collection and source type. You can also view new assets, deleted assets, updated assets, and stale assets from the last 30 days.

Explore your data by classification, investigate why assets didn't get classified, and see how many assets exist without a data owner assigned. To take action, the report provides a “View Detail” button to view and edit the specific assets that need treatment.

You can also view data asset trends by asset count and data size, as we record this metadata during the data map scanning process.

For more information, see the [asset insights documentation.](asset-insights.md)

## Curation and governance

This area focuses on giving a summary of how curated your assets are by several curation contexts. Currently we focus on showcasing assets with glossary, classification, and sensitivity labels.

   :::image type="content" source="./media/insights/curation-and-governance-small.png" alt-text="Screenshot of example curation and governance insights report dashboard." lightbox="media/insights/curation-and-governance-large.png":::

### Glossary

Data, governance, and quality focused users like chief data officers and data stewards a status check on their business glossary. Data maintenance and collection focused users like Data Stewards can view this report to understand distribution of glossary terms by status, learn how many glossary terms are attached to assets, and how many aren't yet attached to any asset. Business users can also learn about completeness of their glossary terms. 

This report summarizes top items that use needs to focus on to create a complete and usable glossary for their organization. Users can also navigate into the "Glossary" experience from "Glossary Insights" experience, to make changes on a specific glossary term.

For more information, see the [glossary insights in Microsoft Purview documentation.](glossary-insights.md)

### Classifications

This report provides details about where classified data is located, the classifications found during a scan, and a drill-down to the classified files themselves. It enables data quality and data security focused users like data stewards, data curators, and security administrators to understand the types of information found in their organization's data estate. 

In Microsoft Purview, classifications are similar to subject tags, and are used to mark and identify content of a specific type in your data estate.

Use the classification insights report to identify content with specific classifications and understand required actions, such as adding extra security to the repositories, or moving content to a more secure location.

For more information, see the [classification insights about your data from Microsoft Purview documentation.](classification-insights.md)

### Sensitivity Labels

This report provides details about the sensitivity labels found during a scan and a drill-down to the labeled files themselves. It enables security administrators to ensure the security of the data found in their organization's data estate by identifying where sensitive data is stored.

In Microsoft Purview, sensitivity labels are used to identify classification type categories, and the group security policies that you want to apply to each category.

Use the labeling insights report to identify the sensitivity labels found in your content and understand required actions, such as managing access to specific repositories or files.

For more information, see the [sensitivity label insights about your data in Microsoft Purview documentation.](sensitivity-insights.md)

## Next steps

Learn how to use Data Estate Insights with resources below:

* [Learn how to use Asset insights](asset-insights.md)
* [Learn how to use Classification insights](classification-insights.md)
* [Learn how to use Glossary insights](glossary-insights.md)
* [Learn how to use Label insights](sensitivity-insights.md)
