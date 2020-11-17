---
title: Sensitivity label reporting on your data in Azure Blob Storage 
description: This how-to guide describes how to view and use Purview sensitivity label reporting on your data in Azure Blob Storage. 
author: batamig
ms.author: bagol
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: how-to
ms.date: 11/17/2020
# Customer intent: As a security officer, I need to understand how to use Purview Insights to learn about sensitive data identified and classified and labeled during scanning.
---

# Sensitivity label insights about your data in Azure Purview

This how-to guide describes how to access, view, and filter security insights provided by sensitivity labels applied to your data.

Supported data sources include: Azure Blob Storage, Azure Files, Azure Data Lake Storage (ADLS) GEN 1, Azure Data Lake Storage (ADLS) GEN 2, Azure SQL, Azure SQL Managed Instance, CosmosDB

In this how-to guide, you'll learn how to:

> [!div class="checklist"]
> - Launch your Purview account from Azure.
> - View sensitivity labeling insights on your data
> - Drill down for more sensitivity labeling details on your data

> [!NOTE]
> If you're blocked at any point in this process, send an email to BabylonDiscussion@microsoft.com for support.

## Prerequisites

Before getting started with Purview insights, make sure that you've completed the following steps:

- Set up your Azure resources and populated the relevant accounts with test data

- Extended Microsoft 365 sensitivity labels to assets in Azure Purview, and created or selected the labels you want to apply to your content

- Set up and completed a scan on the test data in each data source

For more information, see [Use the portal to scan Azure data sources (preview)](portal-scan-azure-data-sources.md) and [Automatically label your content in Azure Purview](create-sensitivity-label.md).

## Use Purview Sensitivity labeling insights

In Purview, classifications are similar to subject tags, and are used to mark and identify content of a specific type that's found within your data estate during scanning.

Sensitivity labels are used to identify classification type categories within your organizational data, as well as the group the policies you want to apply to each category.

Purview uses the same sensitive information types as Microsoft 365, allowing you to stretch your existing security policies and protection across your entire content and data estate.

**To view sensitivity labeling insights:**

1. Go to the **Azure Purview** [instance screen in the Azure portal](https://aka.ms/babylonportal) and select your Purview account.

1. On the **Overview** page, in the **Get Started** section, select the **Launch Babylon** account tile.

   :::image type="content" source="./media/insights/portal-access.png" alt-text="Launch Purview from the Azure portal":::

1. On the Purview **Home** page, select the **View insights** tile to access your **Insights** :::image type="icon" source="media/insights/ico-insights.png" border="false"::: area.

   :::image type="content" source="./media/insights/view-insights.png" alt-text="View your insights in the Azure portal":::

1. In the **Insights** :::image type="icon" source="media/insights/ico-insights.png" border="false"::: area, select **Sensitivity labels** to display the Purview **Sensitivity labeling insights** report.

   :::image type="content" source="media/insights/sensitivity-labeling-insights.png" alt-text="Sensitivity labeling insights":::

   The main **Sensitivity labeling insights** page displays the following areas:

   |Area  |Description  |
   |---------|---------|
   |**Overview of sources with sensitivity labels**     |Displays tiles that provide: <br>- The number of subscriptions found in your data <br>- The number of unique sensitivity labels found in your data <br>- The number of labeled sources found <br>- The number of labeled files found <br>- The number of labeled tables found         |
   |**Total sources with labeled data**     |Shows the number of sources found, such as Azure Blob Storage or Azure Files, with sensitivity labels over the last 30 days.          |
   |**Top labels applied across resources**     |Shows the top labels applied across all of your Purview data resources. |
   |**Top labels applied on files**     |Shows the top sensitivity labels applied to files in your data.          |
   |**Top classifications for tables**     | Shows the top sensitivity labels applied to database tables in your data. |   
   |  **Labeling activity**  |  Displays separate graphs for files and tables, each showing the number of files or tables labeled over the selected time frame. <br>Select the **Time** filter above the graphs to select a different time frame to display.    |
   |    |    |
## Sensitivity labeling insights drilldown

In any of the following **Sensitivity labeling insights** graphs, select the **View more** link to drill down for more details:

- **Top labels applied across resources**
- **Top labels applied on files**
- **Top labels applied on tables**
- **Labeling activity > Labeled data**

For example:

:::image type="content" source="media/insights/sensitivity-label-drilldown.png" alt-text="Sensitivity label drilldown":::

Use the filters above the grid to filter the data shown, including the sensitivity label name, subscription name, or source type. If you're not sure of the exact sensitivity label name, you can enter part or all of the name in the **Filter by keyword** box.

For example:

:::image type="content" source="media/insights/sensitivity-labels-filter.png" alt-text="IMG TBD
":::

Above the filters: 

- **To display more or fewer columns in your grid,** select **Edit Columns** :::image type="icon" source="media/insights/ico-columns.png" border="false":::, and then select the columns you want to view or change the order

- **To browse through the assets found with a specific label,** select a label and then select **Browse in Catalog** :::image type="icon" source="media/insights/ico-browse-in-catalog.png" border="false"::: 

   The search results display all of the labeled assets found with the selected sensitivity label. For example:

   :::image type="content" source="media/insights/sensitivity-label-search-results.png" alt-text="Sensitivity label search results":::
 
   For more information, see [Search the Azure Purview Data Catalog](how-to-search-catalog.md).
## Sensitivity label integration with Microsoft 365 compliance

Close integration with information protection offered in Microsoft 365 means that Purview offers easy and direct ways to scan your entire data estate, receive classification and labeling of your content as well as integrated content protection based on those labels and classifications.

For your Microsoft 365 sensitivity labels to be extended to your assets in Azure Purview, you must actively turn on Information Protection for Azure Purview.

If the insights provided by Azure Purview indicate that you want to make changes in your sensitivity labeling settings, make the changes as needed in Microsoft 365 and run your scan again. 

For more information, see [Automatically label your content in Azure Purview](create-sensitivity-label.md).

## Next steps

Learn more about Azure Purview insight reports
> [!div class="nextstepaction"]
> [Classification insights](./classification-insights.md)

> [!div class="nextstepaction"]
> [File extension insights](file-extension-insights.md)
