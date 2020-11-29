---
title: Understand Insights reports in Azure Purview
description: This article explains what Insights is in Azure Purview.
author: SunetraVirdi
ms.author: suvirdi
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: conceptual
ms.date: 11/22/2020
---

# Understand Insights in Azure Purview

This article provides an overview of the Insights feature in Azure Purview. 

## Insights

Insights is one of the key pillars of Purview. The feature provides customers, a single pane of glass view into their catalog and further aims to provide specific insights to the administrators of the catalog, data stewards, Chief Data Officer and Chief Security Officer. Currently, Purview has the following Insights reports that will be available to customers at public preview.

### Asset Insights
This report gives a bird's eye view of your data estate, and distribution of assets across source types. This is a helpful report for the administrators who want to create and manage their Purview accounts.

### Scan Insights
This report is meant for the administrators who register and scan sources in Purview. It gives a summary view of the scan status over time.

### Glossary Insights
This report is meant for the data stewards who are responsible for creating and maintaining their company's glossary. It provides a nice to do list for the stewards to take action on.

### Classification Insights
This report provides details about where classified data is located, the classifications found during a scan, and a drilldown to the classified files themselves. It enables security administrators to understand the types of information found in their organization's data estate. 

In Azure Purview, classifications are similar to subject tags, and are used to mark and identify content of a specific type in your data estate.

Use the Classification Insights report to identify content with specific classifications and understand required actions, such as adding additional security to the repositories, or moving content to a more secure location.

### Labeling Insights
This report provides details about the sensitivity labels found during a scan, as well as a drilldown to the labeled files themselves. It enables security administrators to ensure the security of information found in their organization's data estate. 

In Azure Purview, sensitivity labels are used to identify classification type categories, as well as the group security policies that you want to apply to each category.

Use the Labeling Insights report to identify the sensitivity labels found in your content and understand required actions, such as managing access to specific repositories or files.

## Next steps

[Tutorial on how to view Insights in Purview](starter-kit-tutorial-6.md)

