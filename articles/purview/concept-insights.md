---
title: Understand Data Estate Insights reports in Microsoft Purview
description: This article explains what Data Estate Insights are in Microsoft Purview.
author: SunetraVirdi
ms.author: suvirdi
ms.service: purview
ms.subservice: purview-insights
ms.topic: conceptual
ms.date: 12/02/2020
---

# Understand Data Estate Insights in Microsoft Purview

This article provides an overview of the Data Estate Insights feature in Microsoft Purview.

Data Estate Insights are one of the key pillars of Microsoft Purview. The feature provides customers, a single pane of glass view into their catalog and further aims to provide specific insights to the data source administrators, business users, data stewards, data officer and, security administrators. Currently, Microsoft Purview has the following Data Estate Insights reports that will be available to customers during Insight's public preview.

> [!IMPORTANT]
> Microsoft Purview Data Estate Insights are currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Asset Insights

This report gives a bird's eye view of your data estate, and its distribution by source type, by classification and by file size as some of the dimensions. This report caters to different types of stakeholder in the data governance and cataloging roles, who are interested to know state of their DataMap, by classification and file extensions.

The report provides broad insights through graphs and KPIs and later deep dive into specific anomalies such as misplaced files. The report also supports an end-to-end customer experience, where customer can view count of assets with a specific classification, can break down the information by source types and top folders, and can also view the list of assets for further investigation.

> [!NOTE]
> File Extension Insights has been merged into Asset Insights with richer trend report showing growth in data size by file extension. Learn more by exploring [Asset Insights](asset-insights.md).

## Glossary Insights

This report gives the Data Stewards a status report on glossary. Data Stewards can view this report to understand distribution of glossary terms by status, learn how many glossary terms are attached to assets and how many aren't yet attached to any asset. Business users can also learn about completeness of their glossary terms.

This report summarizes top items that a Data Steward needs to focus on, to create a complete and usable glossary for their organization. Stewards can also navigate into the "Glossary" experience from "Glossary Insights" experience, to make changes on a specific glossary term.

## Classification Insights

This report provides details about where classified data is located, the classifications found during a scan, and a drill-down to the classified files themselves. It enables Stewards, Curators and Security Administrators to understand the types of information found in their organization's data estate. 

In Microsoft Purview, classifications are similar to subject tags, and are used to mark and identify content of a specific type in your data estate.

Use the Classification Insights report to identify content with specific classifications and understand required actions, such as adding more security to the repositories, or moving content to a more secure location.

For more information, see [Classification insights about your data from Microsoft Purview](classification-insights.md).

## Sensitivity Labeling Insights

This report provides details about the sensitivity labels found during a scan, and a drill-down to the labeled files themselves. It enables security administrators to ensure the security of information found in their organization's data estate. 

In Microsoft Purview, sensitivity labels are used to identify classification type categories, and the group security policies that you want to apply to each category.

Use the Labeling Insights report to identify the sensitivity labels found in your content and understand required actions, such as managing access to specific repositories or files.

For more information, see [Sensitivity label insights about your data in Microsoft Purview](sensitivity-insights.md).

## Next steps

* [Asset insights](asset-insights.md)
* [Glossary insights](glossary-insights.md)
* [Classification insights](./classification-insights.md)
