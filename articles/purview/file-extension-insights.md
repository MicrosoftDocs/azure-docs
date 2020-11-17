---
title: File extension reporting on your data using Purview Insights 
description: This how-to guide describes how to view and use the Purview Insights file extension reporting on your data.
author: batamig
ms.author: bagol
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: how-to
ms.date: 11/17/2020
# Customer intent: As a security officer, I need to understand how to use Purview Insights to learn about the file extensions found in my data.
---

# File extension insights about your data from Azure Purview 

This how-to guide describes how to access, view, and filter insights about the file extensions, or file types, found in your data.

Supported data sources include: Azure Blob Storage, Azure Files, Azure Data Lake Storage (ADLS) GEN 1, Azure Data Lake Storage (ADLS) GEN 2, Azure SQL, Azure SQL Managed Instance, CosmosDB

In this how-to guide, you'll learn how to:
> [!div class="checklist"]
> * Launch your Purview account from Azure. 
> - View file extension insights on your data
> - Drill down for more file extension details on your data

> [!NOTE]
> If you're blocked at any point in this process, send an email to BabylonDiscussion@microsoft.com for support.

## Prerequisites 

Before getting started with Purview insights, make sure that you've completed the following steps:

- Set up your Azure resources and populated the relevant accounts with test data

- Set up and completed a scan on the test data in each data source

For more information, see [Use the portal to scan Azure data sources (preview)](portal-scan-azure-data-sources.md).

## Use Purview File extension insights

When scanning your assets, Azure Purview is able to detect the file types found in your data estate, and provide you more details about each file type. Details include how many files of each type you have, where those files are, and whether they are scannable for sensitive content.

**To view file extension insights:**

1. Go to the **Azure Purview** [instance screen in the Azure portal](https://aka.ms/babylonportal) and select your Purview account.

1. On the **Overview** page, in the **Get Started** section, select the **Launch Babylon** account tile.

   :::image type="content" source="./media/insights/portal-access.png" alt-text="Launch Purview from the Azure portal":::

1. On the Purview **Home** page, select the **View insights** tile to access your **Insights** :::image type="icon" source="media/insights/ico-insights.png" border="false"::: area.

   :::image type="content" source="./media/insights/view-insights.png" alt-text="View your insights in the Azure portal":::
    
1. Within **Insights**, select the **File extensions** tab.

    The report displays a summary of how many unique file extensions are found, as well as a graph of top 10 extensions found.

    :::image type="content" source="media/file-extension-insights/file-extension-overview.png" alt-text="File extension report - overview":::

    Do any of the following to find out more:

    - Select the **Time** selector at the top of the report to change the time span for which the file extensions were found.
    
    - Select **View more** below the graph to view a full list of the file extensions found. For more information, see [File extension insights drilldown](#file-extension-insights-drilldown). 

### File extension insights drilldown

Once you've viewed the high-level information about the file types found in your data estate, drill down for more details about where they are located, and whether they can be scanned for sensitive content.

For example:

:::image type="content" source="media/file-extension-insights/file-extension-drilldown.png" alt-text="File extension report - drilldown":::

The grid shows details for each file extension found, including:

- **File count**. The number of files with the specified extension.
- **Content scanning**. Whether or not the file extension is supported for scanning for sensitive data.
- **Subscriptions**. The number of subscriptions where the specified extension was found.
- **Sources**. The number of sources where the specified extension was found.

Use the filters above the grid to filter the data shown:

|Option  |Description  |
|---------|---------|
|**Filter by keyword**     |    Enter text in the **Filter by keyword**  box to view filter your file types by name. For example, to view PDFs only, enter `PDF`.     |
|**Time**        | Select to filter by a specific time span for when your content was created.   |
|**File extension**     |Select to filter the grid by one or more file types.        |
|**Sources**    |Select to filter the grid by the specific data sources. |
|**Content scanning**     |Select to choose **Supported** or **Not Supported**, to show only file types that can be further scanned for sensitive content, or files that cannot be scanned, such as **.cert** or **.jpg** files. |
| | |

Above the filters: 

- **To display more or fewer columns in your grid,** select **Edit Columns** :::image type="icon" source="media/insights/ico-columns.png" border="false":::, and then select the columns you want to view or change the order

- **To browse through the assets found with a specific file extension,** select a file extension and then select **Browse in Catalog** :::image type="icon" source="media/insights/ico-browse-in-catalog.png" border="false"::: 

   The search results display all of the assets found with the selected file extension. For example:

    :::image type="content" source="media/file-extension-insights/file-extension-search-results.png" alt-text="File extension search results":::
 
   For more information, see [Search the Azure Purview Data Catalog](how-to-search-catalog.md).
## Next steps

Learn more about Azure Purview insight reports
> [!div class="nextstepaction"]
> [Classification insights](./classification-insights.md)

> [!div class="nextstepaction"]
> [Sensitivity label insights](sensitivity-insights.md)
