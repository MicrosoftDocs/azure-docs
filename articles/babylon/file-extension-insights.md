---
title: File extension reporting on your data using Babylon Insights 
titleSuffix: Azure Purview
description: This how-to guide describes how to view and use the Babylon Insights file extension reporting on your data.
author: batamig
ms.author: bagol
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: how-to
ms.date: 11/02/2020
# Customer intent: As a security officer, I need to understand how to use Babylon Insights to learn about the file extensions found in my data.
---

# File extension insights about your data from Project Babylon 

This how-to guide describes how to access, view, and filter insights about the file extensions, or file types, found in your data in Azure Blob Storage, Azure file, ADLS GEN 1, and ADLS GEN 2.

In this how-to guide, you'll learn how to:
> [!div class="checklist"]
> * Launch your Babylon account from Azure. 
> * View and filter insights about the file extensions found across your data estate

> [!NOTE]
> If you're blocked at any point in this process, send an email to BabylonDiscussion@microsoft.com for support.

## Prerequisites 

Before getting started with Babylon insights, make sure that you've completed the following steps:

- Followed explanations about setting up Azure resources and populating the relevant accounts with your test data

- Set up and completed a scan on the test data in each data source.
 
For more information, see [Use the portal to scan Azure data sources (preview)](portal-scan-azure-data-sources.md).

After making sure your Azure Blob Storage is created, contains test data, and scanning test data succeeded, let's get started.  

## Babylon insights

### Use Babylon insights

Babylon is able to detect the file types found in your data estate, and provide you more details about each file type, including how many files of each type you have, where those files are, and whether they are scannable for sensitive content.

**To view file extension insights:**

1. Go to the **Babylon** [instance screen in the Azure portal](https://aka.ms/babylonportal). Select your Babylon account.

1. On the **Overview** page, in the **Get Started** section, select the **Launch Babylon** account tile.

    :::image type="content" source="./media/insights/portal-access.png" alt-text="Launch Babylon from the Azure portal":::

1. With Babylon open, select the **View insights** tile to access your insights area.

    :::image type="content" source="./media/insights/view-insights.png" alt-text="Babylon Insights area":::
    
1. Within **Insights**, select the **File extensions** tab.

    The report displays a summary of how many unique file extensions are found, as well as a graph of top 10 extensions found.

    :::image type="content" source="media/file-extension-insights/file-extension-overview.png" alt-text="File extension report - overview":::

    Do any of the following to find out more:

    - Select the **Time** selector at the top of the report to change the time span for which the file extensions were found.
    
    - Select **View file extensions** below the graph to view a full list of the file extensions found. For more information, see [File extension drilldown and filtering](#file-extension-drilldown-and-filtering).

### File extension drilldown and filtering

Once you've viewed the high-level information about the file types found in your data estate, drill down for more details about where they are located, and whether they can be scanned for sensitive content.

:::image type="content" source="media/file-extension-insights/file-extension-drilldown.png" alt-text="File extension report - drilldown":::

The grid shows details for each file extension found, including:

- **File count**. The number of files with the specified extension.

- **Content scanning**. Whether or not the file extension is supported for scanning for sensitive data.

- **Subscriptions**. The number of subscriptions where the specified extension was found.

- **Sources**. The number of sources where the specified extension was found.

#### Filter the data shown

On the **File extension analysis** page, use the following toolbar options to filter the data shown:

|Option  |Description  |
|---------|---------|
|**Filter by text**     |    Enter text in the **Filter by** keyword box to view filter your file types by name. For example, to view PDFs only, enter `PDF`.     |
|**Content scanning**     |Click to select **Supported** or **Not supported**, to show only file types that can be further scanned for sensitive content, or files that cannot be scanned, such as **.cert** or **.jpg** files. |
|**File extension**     |Click to select one or more file types that you want to display in the grid.         |
|**Source type**    |Click to select specific locations to pull the file extensions listed in the grid.         |
|**Time**        | Click to filter by a specific time span for when your content was created.   |
| | |

## Next steps

Learn more about from Babylon insights
> [!div class="nextstepaction"]
> [Classification insights](./classification-insights.md)

> [!div class="nextstepaction"]
> [Sensitivity label insights](sensitivity-insights.md)
