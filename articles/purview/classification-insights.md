---
title: Classification reporting on your data in Microsoft Purview using Microsoft Purview Data Estate Insights
description: This how-to guide describes how to view and use Microsoft Purview classification reporting on your data.
author: batamig
ms.author: bagol
ms.service: purview
ms.topic: how-to
ms.date: 09/27/2021
# Customer intent: As a security officer, I need to understand how to use Microsoft Purview Data Estate Insights to learn about sensitive data identified and classified and labeled during scanning.
ms.custom: ignite-fall-2021
---

# Classification insights about your data from Microsoft Purview

This how-to guide describes how to access, view, and filter Microsoft Purview Classification insight reports for your data.

> [!IMPORTANT]
> Microsoft Purview Data Estate Insights are currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Supported data sources include: Azure Blob Storage, Azure Data Lake Storage (ADLS) GEN 1, Azure Data Lake Storage (ADLS) GEN 2, Azure Cosmos DB (SQL API), Azure Synapse Analytics (formerly SQL DW), Azure SQL Database, Azure SQL Managed Instance, SQL Server, Amazon S3 buckets, and Amazon RDS databases (public preview), Power BI

In this how-to guide, you'll learn how to:

> [!div class="checklist"]
> - Launch your Microsoft Purview account from Azure
> - View classification insights on your data
> - Drill down for more classification details on your data

## Prerequisites

Before getting started with Microsoft Purview Data Estate Insights, make sure that you've completed the following steps:

- Set up your Azure resources and populated the relevant accounts with test data

- Set up and completed a scan on the test data in each data source. For more information, see [Manage data sources in Microsoft Purview](manage-data-sources.md) and [Create a scan rule set](create-a-scan-rule-set.md).

- Signed in to Microsoft Purview with account with a [Data Reader or Data Curator role](catalog-permissions.md#roles).

For more information, see [Manage data sources in Microsoft Purview](manage-data-sources.md).

## Use Microsoft Purview Data Estate Insights for classifications

In Microsoft Purview, classifications are similar to subject tags, and are used to mark and identify data of a specific type that's found within your data estate during scanning.

Microsoft Purview uses the same sensitive information types as Microsoft 365, allowing you to stretch your existing security policies and protection across your entire data estate.

> [!NOTE]
> After you have scanned your source types, give **Classification** Insights a couple of hours to reflect the new assets.

**To view classification insights:**

1. Go to the **Microsoft Purview** [instance screen in the Azure portal](https://aka.ms/purviewportal) and select your Microsoft Purview account.

1. On the **Overview** page, in the **Get Started** section, select the **Microsoft Purview governance portal** tile.

1. In Microsoft Purview, select the **Data Estate Insights** :::image type="icon" source="media/insights/ico-insights.png" border="false"::: menu item on the left to access your **Data Estate Insights** area.

1. In the **Data Estate Insights** :::image type="icon" source="media/insights/ico-insights.png" border="false"::: area, select **Classification** to display the Microsoft Purview **Classification insights** report.

   :::image type="content" source="./media/insights/select-classification-labeling.png" alt-text="Classification insights report" lightbox="media/insights/select-classification-labeling.png":::

   The main **Classification insights** page displays the following areas:

   |Area  |Description  |
   |---------|---------|
   |**Overview of sources with classifications**     |Displays tiles that provide: <br>- The number of subscriptions found in your data <br>- The number of unique classifications found in your data <br>- The number of classified sources found <br>- The number of classified files found <br>- The number of classified tables found         |
   |**Top sources with classified data (last 30 days)**     |Shows the trend, over the past 30 days, of the number of sources found with classified data.            |
   |**Top classification categories by sources**     |Shows the number of sources found by classification category, such as **Financial** or **Government**.      |
   |**Top classifications for files**     |Shows the top classifications applied to files in your data, such as credit card numbers or national identification numbers.         |
   |**Top classifications for tables**     | Shows the top classifications applied to tables in your data, such as personal identifying information. |   
   |  **Classification activity** <br>(files and tables) |  Displays separate graphs for files and tables, each showing the number of files or tables classified over the selected timeframe. <br>**Default**: 30 days<br>Select the **Time** filter above the graphs to select a different time frame to display.    |
   |    |    |

## Classification insights drilldown

In any of the following **Classification insights** graphs, select the **View more** link to drill down for more details:

- **Top classification categories by sources**
- **Top classifications for files**
- **Top classifications for tables**
- **Classification activity > Classification data**

For example:

:::image type="content" source="media/insights/view-classifications-small.png" alt-text="View all classifications":::

Do any of the following to learn more:

|Option  |Description  |
|---------|---------|
|**Filter your data**     |  Use the filters above the grid to filter the data shown, including the classification name, subscription name, or source type. <br><br>If you're not sure of the exact classification name, you can enter part or all of the name in the **Filter by keyword** box.       |
|**Sort the grid** |Select a column header to sort the grid by that column. | 
|**Edit columns**     |  To display more or fewer columns in your grid, select **Edit Columns** :::image type="icon" source="media/insights/ico-columns.png" border="false":::, and then select the columns you want to view or change the order.   |
|**Drill down further**     | To drill down to a specific classification, select a name in the **Classification** column to view the **Classification by source** report. <br><br>This report displays data for the selected classification, including the source name, source type, subscription ID, and the numbers of classified files and tables.      |
|**Browse assets**     |  To browse through the assets found with a specific classification or source, select a classification or source, depending on the report you're viewing, and then select **Browse assets** :::image type="icon" source="media/insights/ico-browse-assets.png" border="false"::: above the filters. <br><br>The search results display all of the classified assets found for the selected filter.  For more information, see [Search the Microsoft Purview Data Catalog](how-to-search-catalog.md).       |
| | |

## Next steps

Learn more about Microsoft Purview insight reports
> [!div class="nextstepaction"]
> [Glossary insights](glossary-insights.md)

> [!div class="nextstepaction"]
> [Sensitivity labeling insights](./sensitivity-insights.md)
