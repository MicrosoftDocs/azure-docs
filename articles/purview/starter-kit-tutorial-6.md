---
title: 'Tutorial: Add a new starter kit part for Purview insights'
description: This tutorial describes how to view Insights. 
author: batamig
ms.author: bagol
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: tutorial
ms.date: 11/24/2020
---
# Tutorial: Use Catalog insights

> [!IMPORTANT]
> Azure Purview is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Catalog Insights is a collection of six reports - asset, scan, glossary, classifications, labeling, and file extensions. Catalog Insights provides value to the data consumers, data producers, and security administrators who are managing their data estate through Purview.

In this tutorial, learn about:
* Asset Insights
* Scan Insights
* Glossary Insights
* Classification Insights
* Labeling Insights
* File Extension Insights

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

## Prerequisites

* Complete [Tutorial: Run the starter kit and scan data](starter-kit-tutorial-1.md).
* Complete [Tutorial: Navigate the home page and search for an asset](starter-kit-tutorial-2.md ).
* Complete [Tutorial: Browse assets and view their lineage](starter-kit-tutorial-3.md ).
* Complete [Tutorial: Resource sets, asset details, schemas, and classifications](starter-kit-tutorial-4.md ).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## View your assets in Asset insights

1. After you register and scan your data sources in Babylon, click on the Insights icon on the left navigation pane.

2. Land in Insights section of Babylon, and the default report is Asset Insights.

3. As long as the assets are in Babylon's catalog, view them by source type in the report.

4. There is a 1-2 hours of delay between scan completion in Catalog and data showing up in Asset Insights.

## View your scan status

1. Once you run scans on your sources, you can view the scan status in scan insights

2. Click on Insights icon on the left navigation pane and land on Insights section.

3. One of the reports in the left window will be Scan insights.

4. When you navigate to Scan insights, you can view scan status in the last 7 days and last 30 days.

5. Scan status will show count of successful, canceled and failed scans in the given time period.

## View glossary status

1. One of the reports in the left window will be Glossary insights.

2. In Glossary insights you can view total terms in your account.

3. You can view top glossary terms with assets attached to them, count of catalog users and terms by status.

## View Classification insights

1. On the left, select **Classification** to view insights about the classifications found in your content.

    |Option  |Description  |
    |---------|---------|
    |**Overview of sources with classifications**     | Use the tiles at the top of the page to view overall statistics, including: </br>- The number of subscriptions scanned </br>- The number of unique classifications found</br>- The number of sources found with classified data</br>- The number of files and tables found with classifications        |
    |**Top sources with classified data (last 30 days)**  |Use the **Top sources with classified data (last 30 days)** graph to view the trend, over the past 30 days, of the number of sources found with classified data. |
    | **Top classification categories by sources** |Use the **Top classification categories by sources** graph to view the top classifications found in the data sources.  |
    |**Top classifications** <br>(for files or tables)     |  Use the **Top classifications** graphs for files and tables to view the most commonly found classifications in your content, such as credit card numbers or national identification numbers.       |
    |**Classification activity** | Use the **Classified data** graphs to view the number of classified files found for files and tables over time, and adjust the time selector above the graphs to view data for different time periods. |
    | | |

1. Inside the graphs, click **View more** to drill down further.

    On the detailed classification report, use the following methods to modify the data displayed:
    
    |Option  |Description  |
    |---------|---------|
    |**Filter**     |   Use the **Filter by keyword**, **Classification**, **Subscription**, and **Source Type** filters to filter the graphs to show data for specific content only.      |
    |**Edit columns**     | Select **Edit Columns** to change the column data shown in the table below your graphs.        |
    |**Find more information** |In the grid, select a specific classification to view additional information about the data sources, such as: </br>- Source types </br>- Subscription details </br>- Numbers of classified files or tables for the selected classification. | 
    |**Browse assets** | In the grid, select one or more classifications, and then above the filter, select **Browse assets** to view the relevant assets as a search result in the Purview catalog. | 
    | | |

## View Sensitivity labeling insights

1. On the left, select **Sensitivity labels** to view insights about the sensitivity labels applied on your content.

    |Option  |Description  |
    |---------|---------|
    |**Overview of sources with sensitivity labels**     | Use the tiles at the top of the page to view overall statistics, including: </br>- The number of subscriptions scanned </br>- The number of unique labels</br>- The number of sources with sensitivity labels applied</br>- The number of files and tables with sensitivity labels applied       |
    |**Top sources with labeled data (last 30 days)**  |Use the **Top sources with labeled data (last 30 days)** graph to view the trend, over the past 30 days, of the number of sources with sensitivity labels applied. |
    | **Top labels applied across sources** |Use the **Top labels applied across sources** graph to view the sources that have top labels applied. |
    |**Top labels applied**     |  Use the **Top labels applied** graphs for files and tables to view the most commonly used labels in your content.       |
    |**Labeling activity** <br>(files and tables) | Use the **Labeled data** graphs to view the number of files and tables labeled over time, and adjust the time selector above the graphs to view data for different time periods. |
    | | |
            
1. Inside the graphs, click **View more** to drill down further.

   On the detailed labeling report, use the following methods to modify the data displayed:
    
    |Option  |Description  |
    |---------|---------|
    |**Edit columns**     | Select **Edit Columns** to change the column data shown in the table below your graphs.        |
    |**Filter**     |   Use the **Filter by keyword**, **Sensitivity label**, **Subscription**, and **Source type** filters to filter the graphs to show data for specific content only.      |
    |**Find more information** |In the grid, select a specific label to view additional information about the data sources, such as: </br>- Source types </br>- Subscription details </br>- Numbers of labeled files or tables for the selected sensitivity label. | 
    |**Browse assets** | In the grid, select one or more sensitivity labels, and then above the filter, select **Browse assets** to view the relevant assets as a search result in the Purview catalog. | 
    | | | 

## View File extension insights

1. On the left, select **File extensions** to view insights about the file types (extensions) found in your content, over a maximum of the last 30 days.

    |Option  |Description  |
    |---------|---------|
    |**Time selector**     | Adjust the time selector as needed to show updated results found over different time periods.        |
    |**Unique file extensions found**     | Use the tile at the top to view the number of unique file extensions found across your content.       |
    |**Top file extensions**     |  Use the **Top file extensions** graph to view the most commonly found file extensions in your content.       |
    | | |
    
1. Click **View more** to drill down further.

    On the file extension analysis report, use any of the following steps to modify the data displayed:
    
    |Option  |Description  |
    |---------|---------|
    |**Edit columns**     | Select **Edit Columns** to change the column data shown in the table below your graphs.        |
    |**Filter**     |   Use the **Filter by keyword**, **Time period**, **File extension**, and **Sources**, and **Content scanning** filters to filter the graphs to show data for specific content only.      |
    | | | 

## Next steps

Learn more about asset, scan and glossary insights through the documentation.

