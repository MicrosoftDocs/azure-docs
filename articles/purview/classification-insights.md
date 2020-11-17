---
title: Classification reporting on your data using Purview Insights
description: This how-to guide describes how to view and use Purview Insights classification reporting on your data. 
author: batamig
ms.author: bagol
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: how-to
ms.date: 11/17/2020
# Customer intent: As a security officer, I need to understand how to use Purview Insights to learn about sensitive data identified and classified and labeled during scanning.
---

# Classification insights about your data from Azure Purview

This how-to guide describes how to access, view, and filter Purview Classification insight reports for your data.

Supported data sources include: Azure Blob Storage, Azure Files, Azure Data Lake Storage (ADLS) GEN 1, Azure Data Lake Storage (ADLS) GEN 2, Azure SQL, Azure SQL Managed Instance, CosmosDB

In this how-to guide, you'll learn how to:

> [!div class="checklist"]
> - Launch your Purview account from Azure
> - View classification insights on your data
> - Drill down for more classification details on your data

> [!NOTE]
> If you're blocked at any point in this process, send an email to BabylonDiscussion@microsoft.com for support.

## Prerequisites

Before getting started with Purview insights, make sure that you've completed the following steps:

- Set up your Azure resources and populated the relevant accounts with test data

- Extended Microsoft 365 sensitivity labels to assets in Azure Purview, and created or selected the labels you want to apply to your content

- Set up and completed a scan on the test data in each data source

For more information, see [Use the portal to scan Azure data sources (preview)](portal-scan-azure-data-sources.md) and [Automatically label your content in Azure Purview](create-sensitivity-label.md).

## Use Purview classification insights

In Azure Purview, classifications are similar to subject tags, and are used to mark and identify content of a specific type that's found within your data estate during scanning.

[Sensitivity labels](create-sensitivity-label.md#what-are-sensitivity-labels) are used to identify classification type categories within your organizational data, as well as the group the policies you want to apply to each category.

Purview uses the same sensitive information types as Microsoft 365, allowing you to stretch your existing security policies and protection across your entire content and data estate.

**To view classification insights:**

1. Go to the **Azure Purview** [instance screen in the Azure portal](https://aka.ms/babylonportal) and select your Purview account.

1. On the **Overview** page, in the **Get Started** section, select the **Launch Babylon** account tile.

   :::image type="content" source="./media/insights/portal-access.png" alt-text="Launch Purview from the Azure portal":::

1. On the Purview **Home** page, select the **View insights** tile to access your **Insights** :::image type="icon" source="media/insights/ico-insights.png" border="false"::: area.

   :::image type="content" source="./media/insights/view-insights.png" alt-text="View your insights in the Azure portal":::

1. In the **Insights** :::image type="icon" source="media/insights/ico-insights.png" border="false"::: area, select **Classification** to display the Purview **Classification insights** report.

   :::image type="content" source="./media/insights/select-classification-labeling.png" alt-text="Classification and labeling blade":::

   The main **Classification insights** page displays the following areas:

   |Area  |Description  |
   |---------|---------|
   |**Overview of sources with classifications**     |Displays tiles that provide: <br>- The number of subscriptions found in your data <br>- The number of unique classifications found in your data <br>- The number of classified sources found <br>- The number of classified files found <br>- The number of classified tables found         |
   |**Total sources with classified data**     |Shows the number of sources found, such as Azure Blob Storage or Azure Files, with classified data over the last 30 days.          |
   |**Total sources by classification categories**     |Shows the number of sources by classification category, such as **Financial** or **Government**.      |
   |**Top classifications for files**     |Shows the top classifications applied to files in your data, such as credit card numbers or national identification numbers.         |
   |**Top classifications for tables**     | Shows the top classifications applied to database tables in your data, such as personal identifying information. |   
   |  **Classification activity**  |  Displays separate graphs for files and tables, each showing the number of files or tables classified over the selected time frame. <br>Select the **Time** filter above the graphs to select a different time frame to display.    |
   |    |    |

## Classification insights drilldown

In any of the following **Classification insights** graphs, select the **View more** link to drill down for more details:

- **Total sources by classification categories**
- **Top classifications for files**
- **Top classifications for tables**
- **Classification activity > Classification data**

For example:

:::image type="content" source="media/insights/view-classifications.png" alt-text="View all classifications":::

Use the filters above the grid to filter the data shown, including the time span, classification name, subscription name, or source type. If you're not sure of the exact classification name, you can enter part or all of the name in the **Filter by keyword** box.

For example:

:::image type="content" source="./media/insights/view-filtered-classifications.png" alt-text="View filtered classification report":::

To display more or fewer columns in your grid, select **Edit Columns** :::image type="icon" source="media/insights/ico-columns.png" border="false":::, and then select the columns you want to view or change the order
## Next steps

Learn more about Azure Purview insight reports
> [!div class="nextstepaction"]
> [Sensitivity labeling insights](./sensitivity-insights.md)

> [!div class="nextstepaction"]
> [File extension insights](file-extension-insights.md)