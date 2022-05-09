---
title: Understand Insights reports in Microsoft Purview
description: This article explains what Insights are in Microsoft Purview.
author: SunetraVirdi
ms.author: suvirdi
ms.service: purview
ms.subservice: purview-insights
ms.topic: conceptual
ms.date: 05/08/2022
---

# Understand Microsoft Purview Data Estate Insights application

This article provides an overview of the Data Estate Insights application in Microsoft Purview.

Data Estate Insights App is purpose-built for the governance stakeholders, primarily keeping the Chief Data Officer in mind. The App provides actionable insights into the organization’s data estate, catalog usage and adoption and processes. As organizations scan and populate their Microsoft Purview Data Map, Data Estate Insights App automatically extracts valuable governance gaps and highlights them in its top KPIs, top metrics and gives a drill-down experience that enables all stakeholders, such as data owners and stewards to take appropriate action to close the gaps. 

Out of the box, the Chief Data Officers, Data Stewards and Owners can get the following dashboards, to get them started on their data governance journey.

The app intuitively addresses three areas of governance – Health, Inventory and Ownership and Curation.

## Health

The CDOs and Data Stewards can start at this dashboard to understand all they need to know about their estate health and return on investment on their catalog.

## Data Stewardship

The dashboard highlights key performing indicators that the governance stakeholders need to focus on, to attain a clean and governance-ready data estate. The dashboard contains a leaderboard of key metrics, calculated out of the box, curation percentages and trends of the estate health over time.

The CDOs can also get a high-level understanding of weekly and monthly active users of their catalog. Is the catalog being adopted across their organization, as better adoption will lead to better overall governance penetration in the organization.

## Inventory and Ownership
This area focuses on giving a data estate inventory to Data Stewards and Curators, with ability to look at gaps by specific asset groups so they can remediate on the spot, from the Data estate insights app.

## Assets

This report provides a summary of your data estate, and its distribution by collection and source type. Now you can also view new assets, deleted assets, updated assets and stale assets, in the last 30 days. 

Explore your data by classification, explore why assets didn't get classified and how many assets exist without a Data Owner assigned. To take action, the report provides a “View Detail” button to see the assets that need treatment.

View data asset trend by asset count and data size, as we record these metadata through the data map scanning process.

For more information, see [Asset insights](asset-insights.md)

## Curation
This area focuses on giving a summary of how curated your assets are and different groupings of curation. Currently we focus on showcasing assets with Glossary, Classification and Sensitivity Labels.

## Glossary

This report gives CDOs and Data Stewards a status check on glossary. Data Stewards can view this report to understand distribution of glossary terms by status, learn how many glossary terms are attached to assets and how many aren't yet attached to any asset. Business users can also learn about completeness of their glossary terms. 

This report summarizes top items that a Data Steward needs to focus on, to create a complete and usable glossary for their organization. Stewards can also navigate into the "Glossary" experience from "Glossary Insights" experience, to make changes on a specific glossary term.

For more information, see [Glossary insights in Microsoft Purview] (glossary-insights.md).

## Classifications

This report provides details about where classified data is located, the classifications found during a scan, and a drill-down to the classified files themselves. It enables Stewards, Curators and Security Administrators to understand the types of information found in their organization's data estate. 

In Microsoft Purview, classifications are similar to subject tags, and are used to mark and identify content of a specific type in your data estate.

Use the Classification Insights report to identify content with specific classifications and understand required actions, such as adding extra security to the repositories, or moving content to a more secure location.

For more information, see [Classification insights about your data from Microsoft Purview](classification-insights.md).

## Sensitivity Labels

This report provides details about the sensitivity labels found during a scan, and a drill-down to the labeled files themselves. It enables security administrators to ensure the security of information found in their organization's data estate. 

In Microsoft Purview, sensitivity labels are used to identify classification type categories, and the group security policies that you want to apply to each category.

Use the Labeling Insights report to identify the sensitivity labels found in your content and understand required actions, such as managing access to specific repositories or files.

For more information, see [Sensitivity label insights about your data in Microsoft Purview](sensitivity-insights.md).

## Next steps

Learn how to get permissions to Data Estate Insights App
Learn about pricing and billing