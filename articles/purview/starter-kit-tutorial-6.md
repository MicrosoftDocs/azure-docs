---
title: 'Tutorial: Add a new starter kit part for Purview insights'
description: This tutorial describes how to view Insights. 
author: batamig
ms.author: bagol
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: tutorial
ms.date: 10/29/2020
---

# Tutorial: Use Catalog insights

Catalog Insights is a collection of six reports - asset, scan, glossary, classifications, labeling, and file extensions. Catalog Insights provides value to the data consumers, data producers, and security administrators who are managing their data estate through Babylon.

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
    |**Overall statistics**     | Use the tiles at the top of the page to view overall statistics, including: </br>- The number of subscriptions scanned </br>- The number of unique classifications found</br>- The number of sources classified </br>- The numbers of classified files and classified tables        |
    |**Total sources with classified data**  |Use the **Total sources with classified data** graph to view the numbers of classified data found in various sources, over the last 30 days. |
    | **Top classification categories by sources** |Use the **Top classification categories by sources** graph to view the number of sources that contain top classification categories. |
    |**Top classifications**     |  Use the **Top classifications** graphs for files and tables to view the most commonly used classifications in your content, such as credit card numbers or national identification numbers.       |
    |**Classification activity** | Use the **Classified data (daily activity)** graphs to view the number of classified files found for files and tables over time. |

1. Click **View report details** to drill down further. 

    On the detailed classification report, use the following methods to modify the data displayed:
    
    |Option  |Description  |
    |---------|---------|
    |**Filter**     |   Use the **Classification**, **Subscription**, and **Asset Type** filters to filter the graphs to show data for specific content only.      |
    |**Edit columns**     | Select **Edit Columns** to change the column data shown in the table below your graphs.        |
    |**Find more information** |In the table below your graphs, select a specific classification to view additional information about the data sources, such as: </br>- Source types </br>- Subscription details </br>- Numbers of labeled or classified files for the selected classification. | 
    | | | 

## View Labeling insights

1. On the left, select **Labels** to view insights about the sensitivity labels found in your content.

    |Option  |Description  |
    |---------|---------|
    |**Time selector**     | Adjust the time selector as needed to show updated results found over different time periods.        |
    |**Overall statistics**     | Use the tiles at the top of the page to view the number of classified files, percentage of data that is secret, as well as the total amount of data scanned.        |
    |**Top labels**     |  Use the **Top labels** graph to view the most commonly used labels found in your content, such as **Secret**, **All Employees**, or another specific group of internal users.    |
    | | |
            
1. Click **View all labels** to drill down further.

   On the detailed labeling report, use the following methods to modify the data displayed:
    
    |Option  |Description  |
    |---------|---------|
    |**Filter**     |   Use the **Classification**, **Subscription**, and **Asset Type** filters to filter the graphs to show data for specific content only.      |
    |**Edit columns**     | Select **Edit Columns** to change the column data shown in the table below your graphs.        |
    |**Find more information** |In the table below your graphs, select a specific label to view additional information about the data sources, such as: </br>- Asset types </br>- Subscription details </br>- Numbers of labeled or classified files for the selected label. | 
    | | | 

## View File extension insights

1. On the left, select **File extensions** to view insights about the file types (extensions) found in your content.

    |Option  |Description  |
    |---------|---------|
    |**Time selector**     | Adjust the time selector as needed to show updated results found over different time periods.        |
    |**Overall statistics**     | Use the tile at the top to view the number of unique file extensions found across your content.       |
    |**Top file extensions**     |  Use the **Top file extensions** graph to view the most commonly found file extensions in your content.       |
    | | |
    
1. Click **View all file extensions** to drill down further.

    On the file extension analysis report, use any of the following steps to modify the data displayed:
    
    |Option  |Description  |
    |---------|---------|
    |**Search box**     |   Enter a file extension name in the search box to display data for that file extension only.      |
    |**Filters**     | Use the filters to show data only for: <br>- Specific file extensions </br>- Data from specific sources </br>- Data found during specific time periods </br>- Files that can be scanned further for sensitive content, or files that cannot be scanned further such as **.cert** or **.jpg** files        |
    |**Edit columns**     |   Select **Edit Columns** to change the column data shown in the table below your graphs.      |
    | | |

## Next steps

Learn more about asset, scan and glossary insights through the documentation.

