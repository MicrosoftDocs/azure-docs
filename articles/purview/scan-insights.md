---
title: Scan insights on your data in Azure Purview
description: This how-to guide describes how to view and use Azure Purview Insights scan reporting on your data. 
author: SunetraVirdi
ms.author: suvirdi
ms.service: purview
ms.subservice: purview-insights
ms.topic: how-to
ms.date: 09/27/2021
---

# Scan insights on your data in Azure Purview

This how-to guide describes how to access, view, and filter Azure Purview scan insight reports for your data.

> [!IMPORTANT]
> Azure Purview Insights are currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

In this how-to guide, you'll learn how to:

> [!div class="checklist"]
> * View insights from your Azure Purview account.
> * Get a bird's eye view of your scans.

## Prerequisites

Before getting started with Azure Purview insights, make sure that you've completed the following steps:

* Set up your Azure resources and populate the account with data.
* Set up and complete a scan on the data source.

For more information, see [Manage data sources in Azure Purview](manage-data-sources.md).

## Use Azure Purview Scan Insights

In Azure Purview, you can register and scan source types. You can view the scan status over time in Scan Insights. The insights tell you how many scans failed, succeeded, or get canceled within a certain time period.

### View scan insights

1. Go to the **Azure Purview** instance screen in the Azure portal and select your Azure Purview account.

1. On the **Overview** page, in the **Get Started** section, select the **Open Azure Purview Studio** tile.

   :::image type="content" source="./media/scan-insights/portal-access.png" alt-text="Launch Azure Purview from the Azure portal":::

1. On the Azure Purview **Home** page, select **Insights** on the left menu.

   :::image type="content" source="./media/scan-insights/view-insights.png" alt-text="View your insights in the Azure portal":::

1. In the **Insights** area, select **Scans** to display the Azure Purview **Scan insights** report.

### View high-level KPIs to show count of scans by status and deep-dive into each scan
 
1. The high-level KPIs show total scans run within a period. The time period is defaulted at last 30 days. However, you can select last seven days, as well. Based on the time filter, the KPI values reflect the count of scans appropriately.


1. Based on the time filter value selected, you can see the distribution of successful, failed, and canceled scans by week or by the day in the graph.

1. At the bottom of the graph, there is a **View more** link for you to explore further. The link opens the  **Scan Status** page within Scan Insights experience. Here you can see a scan name and the number of times it has succeeded, failed, or been canceled in the last 30 days.

    :::image type="content" source="./media/scan-insights/main-graph.png" alt-text="View Scan status over time":::

4. You can explore a specific scan further, by selecting the **scan name** that will connect you to the scan history within the **Data Map** experience of Azure Purview. From the run history page, you can get the run ID that will help in further failure investigation.

    :::image type="content" source="./media/scan-insights/scan-status.png" alt-text="View Scan details":::

5. Finally, you can come back to Scan Insights **Scan Status** page by following the bread crumbs on the top left corner of the run history page.

    :::image type="content" source="./media/scan-insights/scan-history.png" alt-text="View scan history"::: 

## Next steps

* Learn more about Azure Purview **Insights** with
[Data Insights](./concept-insights.md)

* Learn more about Azure Purview's **Data Map** experience with [Manage data sources](./manage-data-sources.md)
