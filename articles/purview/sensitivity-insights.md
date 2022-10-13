---
title: Sensitivity label reporting on your data in Microsoft Purview using Microsoft Purview Data Estate Insights
description: This how-to guide describes how to view and use sensitivity label reporting on your data.
author: batamig
ms.author: bagol
ms.service: purview
ms.subservice: purview-insights
ms.topic: how-to
ms.date: 04/22/2022
ms.custom: ignite-fall-2021, event-tier1-build-2022
#Customer intent: As a security officer, I need to understand how to use Microsoft Purview Data Estate Insights to learn about sensitive data identified and classified and labeled during scanning.
---

# Sensitivity label insights about your data in Microsoft Purview

This how-to guide describes how to access, view, and filter security insights provided by sensitivity labels applied to your data.

Supported data sources include: Azure Blob Storage, Azure Data Lake Storage (ADLS) GEN 1, Azure Data Lake Storage (ADLS) GEN 2, SQL Server, Azure SQL Database, Azure SQL Managed Instance, Amazon S3 buckets, Amazon RDS databases (public preview), Power BI

In this how-to guide, you'll learn how to:

> [!div class="checklist"]
> - Launch your Microsoft Purview account from Azure.
> - View sensitivity labeling insights on your data
> - Drill down for more sensitivity labeling details on your data

 
## Prerequisites

Before getting started with Microsoft Purview Data Estate Insights, make sure that you've completed the following steps:

- Set up your Azure resources and populated the relevant accounts with test data

- [Extended sensitivity labels to assets in the Microsoft Purview Data Map](how-to-automatically-label-your-content.md), and created or selected the labels you want to apply to your data.

- Set up and completed a scan on the test data in each data source. For more information, see [Manage data sources in Microsoft Purview](manage-data-sources.md) and [Create a scan rule set](create-a-scan-rule-set.md).

- Signed in to Microsoft Purview with account with a [Data Reader or Data Curator role](catalog-permissions.md#roles).

For more information, see [Manage data sources in Microsoft Purview](manage-data-sources.md) and [Automatically label your data in Microsoft Purview](create-sensitivity-label.md).

## Use Microsoft Purview Data Estate Insights for sensitivity labels

Classifications are similar to subject tags, and are used to mark and identify data of a specific type that's found within your data estate during scanning.

Sensitivity labels enable you to state how sensitive certain data is in your organization. For example, a specific project name might be highly confidential within your organization, while that same term is not confidential to other organizations. 

Classifications are matched directly, such as a social security number, which has a classification of **Social Security Number**. 

In contrast, sensitivity labels are applied when one or more classifications and conditions are found together. In this context, [conditions](/microsoft-365/compliance/apply-sensitivity-label-automatically) refer to all the parameters that you can define for unstructured data, such as **proximity to another classification**, and **% confidence**. 

Microsoft Purview Data Estate Insights uses the same classifications, also known as [sensitive information types](/microsoft-365/compliance/sensitive-information-type-entity-definitions), as those used with Microsoft 365 apps and services. This enables you to extend your existing sensitivity labels to assets in the data map.

> [!NOTE]
> After you have scanned your source types, give **Sensitivity labeling** Insights a couple of hours to reflect the new assets.

**To view sensitivity labeling insights:**

1. Go to the **Microsoft Purview** home page.

1. On the **Overview** page, in the **Get Started** section, select the **Launch Microsoft Purview account** tile.

1. In Microsoft Purview, select the **Data Estate Insights** :::image type="icon" source="media/insights/ico-insights.png" border="false"::: menu item on the left to access your **Data Estate Insights** area.

1. In the **Data Estate Insights** :::image type="icon" source="media/insights/ico-insights.png" border="false"::: area, select **Sensitivity labels** to display the Microsoft Purview **Sensitivity labeling insights** report.

    > [!NOTE]
    > If this report is empty, you may not have extended your sensitivity labels to Microsoft Purview Data Map. For more information, see [Labeling in the Microsoft Purview Data Map](create-sensitivity-label.md).

   :::image type="content" source="media/insights/sensitivity-labeling-insights-small.png" alt-text="Sensitivity labeling insights":::

   The main **Sensitivity labeling insights** page displays the following areas:

   |Area  |Description  |
   |---------|---------|
   |**Overview of sources with sensitivity labels**     |Displays tiles that provide: <br>- The number of subscriptions found in your data. <br>- The number of unique sensitivity labels applied on your data <br>- The number of sources with sensitivity labels applied <br>- The number of files and tables found with sensitivity labels applied|
   |**Top sources with labeled data (last 30 days)**     | Shows the trend, over the past 30 days, of the number of sources with sensitivity labels applied.       |
   |**Top labels applied across sources**     |Shows the top labels applied across all of your Microsoft Purview data resources. |
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

:::image type="content" source="media/insights/sensitivity-label-drilldown-small.png" alt-text="Sensitivity label drilldown":::

Do any of the following to learn more:

|Option  |Description  |
|---------|---------|
|**Filter your data**     |  Use the filters above the grid to filter the data shown, including the label name, subscription name, or source type. <br><br>If you're not sure of the exact label name, you can enter part or all of the name in the **Filter by keyword** box.       |
|**Sort the grid** |Select a column header to sort the grid by that column. | 
|**Edit columns**     |  To display more or fewer columns in your grid, select **Edit Columns** :::image type="icon" source="media/insights/ico-columns.png" border="false":::, and then select the columns you want to view or change the order.    <br><br>Select a column header to sort the grid by that column.   |
|**Drill down further**     | To drill down to a specific label, select a name in the **Sensitivity label** column to view the **Label by source** report. <br><br>This report displays data for the selected label, including the source name, source type, subscription ID, and the numbers of classified files and tables.      |
|**Browse assets**     |  To browse through the assets found with a specific label or source, select one or more labels or sources, depending on the report you're viewing, and then select **Browse assets** :::image type="icon" source="media/insights/ico-browse-assets.png" border="false"::: above the filters. <br><br>The search results display all of the labeled assets found for the selected filter.  For more information, see [Search the Microsoft Purview Data Catalog](how-to-search-catalog.md).       |
| | |

## Sensitivity label integration with Microsoft Purview Information Protection

Close integration with [Microsoft Purview Information Protection](/microsoft-365/compliance/information-protection) means that you have direct ways to extend visibility into your data estate, and classify and label your data.

For sensitivity labels to be extended to your assets in the data map, you must actively turn on this capability in the Microsoft Purview compliance portal.

For more information, see [How to automatically apply sensitivity labels to your data in the Microsoft Purview Data Map](how-to-automatically-label-your-content.md).

## Next steps

Learn how to use Data Estate Insights with sources below:

* [Learn how to use Asset insights](asset-insights.md)
* [Learn how to use Data Stewardship](data-stewardship.md)
* [Learn how to use Classification insights](classification-insights.md)
* [Learn how to use Glossary insights](glossary-insights.md)
