---
title: Asset report on your data using Purview Insights
description: This how-to guide describes how to view and use Purview Insights asset reporting on your data. 
author: SunetraVirdi
ms.author: suvirdi
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: how-to
ms.date: 11/20/2020

---

# Asset insights on your data in Azure Purview

This how-to guide describes how to access, view, and filter Purview Asset insight reports for your data.

In this how-to guide, you'll learn how to:

> - Go to Insights from your Purview account
> - Get a bird's eye view of your data
> - Drill down for more asset count details

> [!NOTE]
> If you're blocked at any point in this process, send an email to BabylonDiscussion@microsoft.com for support.

## Prerequisites

Before getting started with Purview insights, make sure that you've completed the following steps:

- Set up your Azure resources and populate the account with data

- Set up and complete a scan on the source type

For more information, see [Use the portal to scan Azure data sources (preview)](portal-scan-azure-data-sources.md) 

## Use Purview Asset Insights

In Azure Purview, you can register and scan source types. Once the scanning is complete, you can view the asset distribution in Asset Insights. This tells you the state of your data estate by classification and resource sets. It also tells you change in data size.

> [!NOTE]
> After you have scanned your source types, give Asset Insights upto an hour to reflect the new assets.

1. Go to the **Azure Purview** [instance screen in the Azure portal](https://aka.ms/babylonportal) and select your Purview account.

1. On the **Overview** page, in the **Get Started** section, select the **Launch Babylon** account tile.

   :::image type="content" source="./media/asset-insights/portal-access.png" alt-text="Launch Purview from the Azure portal":::

1. On the Purview **Home** page, select the **View insights** tile to access your **Insights** :::image type="icon" source="media/asset-insights/ico-insights.png" border="false"::: area.

   :::image type="content" source="./media/asset-insights/view-insights.png" alt-text="View your insights in the Azure portal":::

1. In the **Insights** :::image type="icon" source="media/asset-insights/ico-insights.png" border="false"::: area, select **Assets** to display the Purview **Asset insights** report.

### View Asset Insights

1. The main **Asset Insights** page displays the following areas:

2. High level KPI's to show source types, classified assets and discovered assets
 
3. First graph shows **assets per source type**

4. View your asset distribution by source type. Pick a classification or an entire classification category to see asset distribution by source type. 
 
5. To view more, click on **View more** that will display a tabular form of source type and asset counts. The classification filters will be carried to this page.

   :::image type="content" source="./media/asset-insights/highlight-kpis.png" alt-text="View KPIs and graph in Asset Insights":::
 
6. Click on a specific source for which you'd like to see top folders with asset count. 

   :::image type="content" source="./media/asset-insights/select-data-source.png" alt-text="View KPIs and graph in Asset Insights":::
 
7. Click on the total assets against the top folder within the source type you selected above.

   :::image type="content" source="./media/asset-insights/file-path.png" alt-text="View file paths":::

8. View the list of files within the folder. Navigate back to Insights using the bread crumbs.

   :::image type="content" source="./media/asset-insights/list-page.png" alt-text="View list of assets":::  

### File-based source types
The next couple of graphs in Asset Insights show distribution of file based source types only. The first one is called **Size trend (GB) of file type within source types**. This graph shows top file type size trend over the last 30 days. 
 
Pick your source type to view file type within the source. 
 
Click on **View more** to see the current data size, change in size, current asset count and change in asset count.
 
> [!NOTE]
> If the scan has run only once in last 30 days or any catalog change like classification addition/removed happened only once in 30 days, then the change information above appears blank.

See the top folders with change top asset counts when you click on source type.

Click on the path to see the asset list

The second graph in File-based source types is ***Files not associated with a resource set***. If you expect that all files should roll up into a resource set, this graph can help you understand where the roll up has not happened. This can be an indication of the wrong file-pattern in the folder and you may want to fix it. Follow the same steps as in other graphs to view more details on the files.

   :::image type="content" source="./media/asset-insights/file-based-assets.png" alt-text="View list of assets":::  

## Next steps

Learn more about Azure Purview insight reports
> [!div class="nextstepaction"]
> [Glossary Insights](./glossary-insights.md)

> [!div class="nextstepaction"]
> [Scan Insights](scan-insights.md)