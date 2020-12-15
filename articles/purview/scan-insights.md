---
title: Scan insights on your data in Azure Purview
description: This how-to guide describes how to view and use Purview Insights scan reporting on your data. 
author: SunetraVirdi
ms.author: suvirdi
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 11/20/2020
---

# Scan insights on your data in Azure Purview

This how-to guide describes how to access, view, and filter Azure Purview scan insight reports for your data.

In this how-to guide, you'll learn how to:

> [!div class="checklist"]
> * View insights from your Purview account.
> * Get a bird's eye view of your scans.

## Prerequisites

Before getting started with Purview insights, make sure that you've completed the following steps:

* Set up your Azure resources and populate the account with data.
* Set up and complete a scan on the data source.

For more information, see [Manage data sources in Azure Purview (Preview)](manage-data-sources.md).

## Use Purview Scan Insights

In Azure Purview, you can register and scan source types. You can view the scan status over time in Scan Insights. The insights tell you how many scans failed, succeeded, or get canceled within a certain time period.

### View scan insights

1. Go to the **Azure Purview** instance screen in the Azure portal and select your Purview account.

1. On the **Overview** page, in the **Get Started** section, select the **Open Purview Studio** tile.

   :::image type="content" source="./media/scan-insights/portal-access.png" alt-text="Launch Purview from the Azure portal":::

1. On the Purview **Home** page, select the **View insights** tile to access your **Insights** :::image type="icon" source="media/scan-insights/ico-insights.png" border="false"::: area.

   :::image type="content" source="./media/scan-insights/view-insights.png" alt-text="View your insights in the Azure portal":::

1. In the **Insights** :::image type="icon" source="media/scan-insights/ico-insights.png" border="false"::: area, select **Scans** to display the Purview **Scan insights** report.

### View high-level KPIs to show count of scans by status
 
The high-level KPIs show total scans run within a period. The time period is defaulted at last 30 days. However, you can select last seven days, as well. Based on the time filter, the KPI values reflect the count of scans appropriately.


Based on the time filter value selected, you can see the distribution of successful, failed, and canceled scans by week or by the day in the graph.

   :::image type="content" source="./media/scan-insights/scan-insights.png" alt-text="View Scan Insights":::

## Next steps

Learn more about Azure Purview insight reports with
[Asset Insights](./asset-insights.md)
