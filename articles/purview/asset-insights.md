---
title: Asset insights on your data in Microsoft Purview
description: This how-to guide describes how to view and use Microsoft Purview Data Estate Insights asset reporting on your data. 
author: SunetraVirdi
ms.author: suvirdi
ms.service: purview
ms.subservice: purview-insights
ms.topic: how-to
ms.date: 09/27/2021
---

# Asset insights on your data in Microsoft Purview

This how-to guide describes how to access, view, and filter Microsoft Purview Asset insight reports for your data.

> [!IMPORTANT]
> Microsoft Purview Data Estate Insights are currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

In this how-to guide, you'll learn how to:

> [!div class="checklist"]
> * View data estate insights from your Microsoft Purview account.
> * Get a bird's eye view of your data.
> * Drill down for more asset count details.

## Prerequisites

Before getting started with Microsoft Purview Data Estate Insights, make sure that you've completed the following steps:

* Set up your Azure resources and populate the account with data.

* Set up and complete a scan on the source type.

For more information, see [Manage data sources in Microsoft Purview](manage-data-sources.md).

## Use Microsoft Purview Asset Insights

In Microsoft Purview, you can register and scan source types. Once the scan is complete, you can view the asset distribution in Asset Insights, which tells you the state of your data estate by classification and resource sets. It also tells you if there is any change in data size.

> [!NOTE]
> After you have scanned your source types, give Asset Insights 3-8 hours to reflect the new assets. The delay may be due to high traffic in deployment region or size of your workload. For further information, please contact the field support team.

1. Navigate to your Microsoft Purview account in the Azure portal.

1. On the **Overview** page, in the **Get Started** section, select the **Open Microsoft Purview governance portal** tile.

   :::image type="content" source="./media/asset-insights/portal-access.png" alt-text="Launch Microsoft Purview from the Azure portal":::

1. On the Microsoft Purview **Home** page, select **Data Estate Insights** on the left menu.

   :::image type="content" source="./media/asset-insights/view-insights.png" alt-text="View your data estate insights in the Azure portal":::

1. In the **Data Estate Insights** area, select **Assets** to display the Microsoft Purview **Asset insights** report.

### View Asset Insights

1. The main **Asset Insights** page displays the following areas:

2. High level KPI's to show source types, classified assets, and discovered assets
 
3. The first graph shows **assets per source type**.

4. View your asset distribution by source type. Pick a classification or an entire classification category to see asset distribution by source type. 
 
5. To view more, select **View more**, which displays a tabular form of the source types and asset counts. The classification filters are carried to this page.

   :::image type="content" source="./media/asset-insights/highlight-kpis.png" alt-text="View KPIs and graph in Asset Insights":::
 
6. Select a specific source for which you'd like to see top folders with asset counts. 

   :::image type="content" source="./media/asset-insights/select-data-source.png" alt-text="Select source type":::
 
7. Select the total assets against the top folder within the source type you selected above.

   :::image type="content" source="./media/asset-insights/file-path.png" alt-text="View file paths":::

8. View the list of files within the folder. Navigate back to Data Estate Insights using the bread crumbs.

   :::image type="content" source="./media/asset-insights/list-page.png" alt-text="View list of assets":::  

### File-based source types
The next couple of graphs in Asset Insights show a distribution of file based source types. The first graph, called **Size trend (GB) of file type within source types**, shows top file type size trend over the last 30 days. 
 
1. Pick your source type to view the file type within the source. 
 
1. Select **View more** to see the current data size, change in size, current asset count and change in asset count.
 
   > [!NOTE]
   > If the scan has run only once in last 30 days or any catalog change like classification addition/removed happened only once in 30 days, then the change information above appears blank.

1. See the top folders with change top asset counts when you select source type.

1. Select the path to see the asset list.

The second graph in file-based source types is ***Files not associated with a resource set***. If you expect that all files should roll up into a resource set, this graph can help you understand which assets have not been rolled up. Missing assets can be an indication of the wrong file-pattern in the folder. Follow the same steps as in other graphs to view more details on the files.

   :::image type="content" source="./media/asset-insights/file-based-assets.png" alt-text="View file based assets":::  

## Next steps

Learn more about Microsoft Purview insight reports with

- [Classification insights](./classification-insights.md)
- [Glossary insights](glossary-insights.md)
