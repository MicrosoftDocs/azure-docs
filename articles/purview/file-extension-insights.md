---
title: File extension reporting on your data in Azure Purview using Purview Insights
description: This how-to guide describes how to view and use the Purview file extension reporting on your data.
author: batamig
ms.author: bagol
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 01/17/2021
# Customer intent: As a security officer, I need to understand how to use Purview Insights to learn about the file extensions found in my data.
---

# File extension insights about your data from Azure Purview 

This how-to guide describes how to access, view, and filter insights about the file extensions, or file types, found in your data.

Supported data sources include: Azure Blob Storage, Azure Data Lake Storage (ADLS) GEN 1, Azure Data Lake Storage (ADLS) GEN 2, Amazon S3 buckets

In this how-to guide, you'll learn how to:
> [!div class="checklist"]
> * Launch your Purview account from Azure 
> - View file extension insights on your data
> - Drill down for more file extension details on your data

## Prerequisites 

Before getting started with Purview insights, make sure that you've completed the following steps:

- Set up your Azure resources and populated the relevant accounts with test data

- Set up and completed a scan on the test data in each data source. For more information, see [Manage data sources in Azure Purview (Preview)](manage-data-sources.md) and [Create a scan rule set](create-a-scan-rule-set.md).

- Signed in to Purview with account with a [Data Reader or Data Curator role](catalog-permissions.md#azure-purviews-pre-defined-data-plane-roles).


For more information, see [Manage data sources in Azure Purview (Preview)](manage-data-sources.md).

## Use Purview File extension insights

When scanning your assets, Azure Purview is able to detect the file types found in your data estate, and provide you more details about each file type. Details include how many files of each type you have, where those files are, and whether they are scannable for sensitive data.

> [!NOTE]
> After you have scanned your source types, give **File extension** Insights a couple of hours to reflect the new assets.

**To view file extension insights:**

1. Go to the **Azure Purview** [instance screen in the Azure portal](https://aka.ms/purviewportal) and select your Purview account.

1. On the **Overview** page, in the **Get Started** section, select the **Launch Purview account** tile.

1. In Purview, select the **Insights** :::image type="icon" source="media/insights/ico-insights.png" border="false"::: menu item on the left to access your **Insights** area.
    
1. Within **Insights**, select the **File extensions** tab.

    The report displays a summary of how many unique file extensions are found, as well as a graph of top 10 extensions found, over the selected timeframe (default: 30 days).

    :::image type="content" source="media/file-extension-insights/file-extension-overview-small.png" alt-text="File extension report - overview" lightbox="media/file-extension-insights/file-extension-overview.png":::

    Do any of the following to find out more:

    - Select the **Time** selector at the top of the report to change the time span for which the file extensions were found.
    
    - Select **View more** below the graph to view a full list of the file extensions found. For more information, see [File extension insights drilldown](#file-extension-insights-drilldown). 

### File extension insights drilldown

Once you've viewed the high-level information about the file types found in your data estate, drill down for more details about where they are located, and whether they can be scanned for sensitive data.

For example:

:::image type="content" source="media/file-extension-insights/file-extension-drilldown-small.png" alt-text="File extension report - drilldown" lightbox="media/file-extension-insights/file-extension-drilldown.png":::

The grid shows details for each file extension found, including:

- **File count**. The number of files with the specified extension.
- **Content scanning**. Whether or not the file extension is supported for scanning for sensitive data.
- **Subscriptions**. The number of subscriptions where the specified extension was found.
- **Sources**. The number of sources found with the specified file extension.



Use the filters above the grid to filter the data shown:

|Option  |Description  |
|---------|---------|
|**Filter by keyword**     |    Enter text in the **Filter by keyword**  box to view filter your file types by name. For example, to view PDFs only, enter `PDF`.     |
|**Time**        | Select to filter by a specific time span for when your data was created. <br>**Default:** 30 days  |
|**File extension**     |Select to filter the grid by one or more file types.        |
|**Sources**    |Select to filter the grid by the specific data sources. |
|**Content scanning**     |Select to choose **Supported** or **Not Supported**, to show only file types that can be further scanned for sensitive data, or data that cannot be scanned, such as **.cert** or **.jpg** files. |
| | |

Above the filters, select **Edit columns** :::image type="icon" source="media/insights/ico-columns.png" border="false"::: to display more or fewer columns in your grid, or to change the order. 

To sort the grid, select a column header to sort by that column.
## Next steps

Learn more about Azure Purview insight reports
> [!div class="nextstepaction"]
> [Glossary insights](glossary-insights.md)

> [!div class="nextstepaction"]
> [Scan insights](scan-insights.md)

> [!div class="nextstepaction"]
> [Classification insights](./classification-insights.md)

> [!div class="nextstepaction"]
> [Sensitivity label insights](sensitivity-insights.md)
