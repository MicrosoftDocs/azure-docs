---
title: Scan report on your data using Purview Insights
description: This how-to guide describes how to view and use Purview Insights scan reporting on your data. 
author: SunetraVirdi
ms.author: suvirdi
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: how-to
ms.date: 11/20/2020

---

# Scan insights on your data in Azure Purview

This how-to guide describes how to access, view, and filter Purview Scan insight reports for your data.

In this how-to guide, you'll learn how to:

> - Go to Insights from your Purview account
> - Get a bird's eye view of your scans

> [!NOTE]
> If you're blocked at any point in this process, send an email to BabylonDiscussion@microsoft.com for support.

## Prerequisites

Before getting started with Purview insights, make sure that you've completed the following steps:

- Set up your Azure resources and populate the account with data

- Set up and complete a scan on the source type

For more information, see [Use the portal to scan Azure data sources (preview)](portal-scan-azure-data-sources.md) 

## Use Purview Scan Insights

In Azure Purview, you can register and scan source types. You can view the scan status over time in Scan Insights. It tells you how many scans failed, succeeded or get canceled within a certain time period.

**To view Scan Insights:**

1. Go to the **Azure Purview** [instance screen in the Azure portal](https://aka.ms/babylonportal) and select your Purview account.

1. On the **Overview** page, in the **Get Started** section, select the **Launch Babylon** account tile.

   :::image type="content" source="./media/insights/portal-access.png" alt-text="Launch Purview from the Azure portal":::

1. On the Purview **Home** page, select the **View insights** tile to access your **Insights** :::image type="icon" source="media/insights/ico-insights.png" border="false"::: area.

   :::image type="content" source="./media/insights/view-insights.png" alt-text="View your insights in the Azure portal":::

1. In the **Insights** :::image type="icon" source="media/insights/ico-insights.png" border="false"::: area, select **Scans** to display the Purview **Scan insights** report.

   :::image type="content" source="./media/insights/select-classification-labeling.png" alt-text="Classification insights report":::

   The **Scan Insights** page displays the following areas:
- **High level KPI's to show count of scans by status**
- 
- The high level KPIs show total scans run within a period. The time period is defaulted at last 30 days. However, you can select last 7 days time period as well. Based on the time filter, the KPI values reflect the count of scans appropriately.

- **A trend graph to show count of successful, failed and canceled** 

Based on the time filter value selected, you can see the distribution of successful, failed and canceled scans by week or by the day in the graph.

## Next steps

Learn more about Azure Purview insight reports
> [!div class="nextstepaction"]
> [Glossary Insights](./glossary-insights.md)

> [!div class="nextstepaction"]
> [Scan Insights](scan-insights.md)