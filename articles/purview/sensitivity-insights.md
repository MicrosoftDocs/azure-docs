---
title: Sensitivity label reporting on your data in Azure Purview using Purview Insights
description: This how-to guide describes how to view and use Purview Sensitivity label reporting on your data.
author: batamig
ms.author: bagol
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 01/17/2021
# Customer intent: As a security officer, I need to understand how to use Purview Insights to learn about sensitive data identified and classified and labeled during scanning.
---

# Sensitivity label insights about your data in Azure Purview

This how-to guide describes how to access, view, and filter security insights provided by sensitivity labels applied to your data.

Supported data sources include: Azure Blob Storage, Azure Data Lake Storage (ADLS) GEN 1, Azure Data Lake Storage (ADLS) GEN 2, SQL Server, Azure SQL Database, Azure SQL Managed Instance, Amazon S3 buckets

In this how-to guide, you'll learn how to:

> [!div class="checklist"]
> - Launch your Purview account from Azure.
> - View sensitivity labeling insights on your data
> - Drill down for more sensitivity labeling details on your data

> [!NOTE]
> Sensitivity labels found on [Power BI assets](register-scan-power-bi-tenant.md) that are scanned by Purview are not currently shown in the Sensitivity labeling Insights report. 
>
> To view sensitivity labels on Power BI assets, view the asset in the [Purview Data Catalog](how-to-search-catalog.md).
> 
## Prerequisites

Before getting started with Purview insights, make sure that you've completed the following steps:

- Set up your Azure resources and populated the relevant accounts with test data

- [Extended Microsoft 365 sensitivity labels to assets in Azure Purview](create-sensitivity-label.md), and created or selected the labels you want to apply to your data.

- Set up and completed a scan on the test data in each data source. For more information, see [Manage data sources in Azure Purview (Preview)](manage-data-sources.md) and [Create a scan rule set](create-a-scan-rule-set.md).

- Signed in to Purview with account with a [Data Reader or Data Curator role](catalog-permissions.md#azure-purviews-pre-defined-data-plane-roles).

For more information, see [Manage data sources in Azure Purview (Preview)](manage-data-sources.md) and [Automatically label your data in Azure Purview](create-sensitivity-label.md).

## Use Purview Sensitivity labeling insights

In Purview, classifications are similar to subject tags, and are used to mark and identify data of a specific type that's found within your data estate during scanning.

Sensitivity labels enable you to state how sensitive certain data is in your organization. For example, a specific project name might be highly confidential within your organization, while that same term is not confidential to other organizations. 

Classifications are matched directly, such as a social security number, which has a classification of **Social Security Number**. 

In contrast, sensitivity labels are applied when one or more classifications and conditions are found together. In this context, [conditions](/microsoft-365/compliance/apply-sensitivity-label-automatically) refer to all the parameters that you can define for unstructured data, such as **proximity to another classification**, and **% confidence**. 

Purview uses the same classifications, also known as [sensitive information types](/microsoft-365/compliance/sensitive-information-type-entity-definitions), as Microsoft 365. This enables you to extend your existing sensitivity labels across your Azure Purview assets.

> [!NOTE]
> After you have scanned your source types, give **Sensitivity labeling** Insights a couple of hours to reflect the new assets.

**To view sensitivity labeling insights:**

1. Go to the **Azure Purview** home page.

1. On the **Overview** page, in the **Get Started** section, select the **Launch Purview account** tile.

1. In Purview, select the **Insights** :::image type="icon" source="media/insights/ico-insights.png" border="false"::: menu item on the left to access your **Insights** area.

1. In the **Insights** :::image type="icon" source="media/insights/ico-insights.png" border="false"::: area, select **Sensitivity labels** to display the Purview **Sensitivity labeling insights** report.

    > [!NOTE]
    > If this report is empty, you may not have extended your sensitivity labels to Azure Purview. For more information, see [Automatically label your data in Azure Purview](create-sensitivity-label.md).

   :::image type="content" source="media/insights/sensitivity-labeling-insights-small.png" alt-text="Sensitivity labeling insights" lightbox="media/insights/sensitivity-labeling-insights.png":::

   The main **Sensitivity labeling insights** page displays the following areas:

   |Area  |Description  |
   |---------|---------|
   |**Overview of sources with sensitivity labels**     |Displays tiles that provide: <br>- The number of subscriptions found in your data. <br>- The number of unique sensitivity labels applied on your data <br>- The number of sources with sensitivity labels applied <br>- The number of files and tables found with sensitivity labels applied|
   |**Top sources with labeled data (last 30 days)**     | Shows the trend, over the past 30 days, of the number of sources with sensitivity labels applied.       |
   |**Top labels applied across sources**     |Shows the top labels applied across all of your Purview data resources. |
   |**Top labels applied on files**     |Shows the top sensitivity labels applied to files in your data.          |
   |**Top labels applied on tables**     | Shows the top sensitivity labels applied to database tables in your data. |   
   |  **Labeling activity**  |  Displays separate graphs for files and tables, each showing the number of files or tables labeled over the selected time frame. <br>**Default**: 30 days<br>Select the **Time** filter above the graphs to select a different time frame to display.    |
   |    |    |

## Sensitivity labeling insights drilldown

In any of the following **Sensitivity labeling insights** graphs, select the **View more** link to drill down for more details:

- **Top labels applied across sources**
- **Top labels applied on files**
- **Top labels applied on tables**
- **Labeling activity > Labeled data**

For example:

:::image type="content" source="media/insights/sensitivity-label-drilldown-small.png" alt-text="Sensitivity label drilldown" lightbox="media/insights/sensitivity-label-drilldown.png":::

Do any of the following to learn more:

|Option  |Description  |
|---------|---------|
|**Filter your data**     |  Use the filters above the grid to filter the data shown, including the label name, subscription name, or source type. <br><br>If you're not sure of the exact label name, you can enter part or all of the name in the **Filter by keyword** box.       |
|**Sort the grid** |Select a column header to sort the grid by that column. | 
|**Edit columns**     |  To display more or fewer columns in your grid, select **Edit Columns** :::image type="icon" source="media/insights/ico-columns.png" border="false":::, and then select the columns you want to view or change the order.    <br><br>Select a column header to sort the grid by that column.   |
|**Drill down further**     | To drill down to a specific label, select a name in the **Sensitivity label** column to view the **Label by source** report. <br><br>This report displays data for the selected label, including the source name, source type, subscription ID, and the numbers of classified files and tables.      |
|**Browse assets**     |  To browse through the assets found with a specific label or source, select one or more labels or sources, depending on the report you're viewing, and then select **Browse assets** :::image type="icon" source="media/insights/ico-browse-assets.png" border="false"::: above the filters. <br><br>The search results display all of the labeled assets found for the selected filter.  For more information, see [Search the Azure Purview Data Catalog](how-to-search-catalog.md).       |
| | |

## Sensitivity label integration with Microsoft 365 compliance

Close integration with [Microsoft Information Protection](/microsoft-365/compliance/information-protection) offered in Microsoft 365 means that Purview enables direct ways to extend visibility into your data estate, and classify and label your data.

For your Microsoft 365 sensitivity labels to be extended to your assets in Azure Purview, you must actively turn on Information Protection for Azure Purview, in the Microsoft 365 compliance center.

For more information, see [Automatically label your data in Azure Purview](create-sensitivity-label.md).

## Next steps

Learn more about these Azure Purview insight reports:

- [Glossary insights](glossary-insights.md)
- [Scan insights](scan-insights.md)
- [Classification insights](./classification-insights.md)
- [File extension insights](file-extension-insights.md)
