---
title: Understand Insights reports in Azure Purview
description: This article explains what Insights are in Azure Purview.
author: SunetraVirdi
ms.author: suvirdi
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: conceptual
ms.date: 12/01/2020
---

# Understand Insights in Azure Purview

This article provides an overview of the Insights feature in Azure Purview. 

## Insights

Insights are one of the key pillars of Purview. The feature provides customers, a single pane of glass view into their catalog and further aims to provide specific insights to the data source administrators, business users, data stewards, data officer and, security administrators. Currently, Purview has the following Insights reports that will be available to customers at public preview.

### Asset Insights

This report gives a bird's eye view of your data estate, and its distribution by source type, by classification and by file size as some of the dimensions. This report caters to different types of users who may be managing the Purview account and running scans or business users who may be interested to know how many assets exist with a certain classification within their organization's data estate. 

The report provides broad insights through graphs and KPIs and later deep dive into specific anomalies such as misplaced files. The report also supports an end-to-end customer experience, where customer can view count of assets with a specific classification, can breakdown the information by source types and top folders, and can also view the list of assets for further investigation.

The following options are available for asset insights:

|Option  |Description  |
|---------|------------|
| **KPIs**     | These tiles at the top of the page to provide high level summary of: </br>- The total number of source types that have been ingested in Azure Purview catalog </br>- The number of classified assets </br>- The number of discovered assets </br>|
| **Filters**| Time: **last 30 days** or **last 7 days**|
|**Asset count per source type**  |Use the **Asset count per source type** graph to view distribution of assets by source type.</br>**Filters:**</br>- **Classification category**: Select a broad group of system or custom classifications to view how many assets are tagged with these classifications </br> - **Classification**: Select a single classification from the drop down filter. These can be system or custom generated|
|**View More**|Click on **View more** to explore the top 5 folders with the largest count of assets with or without the classifications selected from the main graph. This experience leads you to actual list of assets that contain the selected classification(s).|
|**Size trend (GB) of file type within source types** | The graph shows file size over time based on certain filter selections. It specifically targets file-based storage systems|
|**Filters**|- **Time**: Pick a time period for which you would like to see size</br>- **Source type**: Pick file based source type from the drop down filter. Its a single select with **All** as one of the options</br>- **File type**: Pick a file type or file extension that may exist within a chosen source type. This is a single select filter.|
|**View more**| Click on **View more** to deep-dive into top files with most change in size over the time period. Go further to view the files within those folders in a list view and drive actions if you find an anomaly|
|**Files not associated with a resource set**| The graph shows files that did not roll-up into a resource set due to a deviation in file pattern.|
|**View more**| View where these files without resource set roll up can be found in the source types. Check out the list of files to learn more about the anomaly|

### Scan Insights

The report enables administrators to understand overall health of the scans - how many succeeded, how many failed, how many canceled. This report gives a status update on scans that have been executed in the Purview account within a time period of last seven days or last 30 days.

The report also allows administrators to deep dive and explore which scans failed and on what specific source types. To further enable users to investigate, the report helps them navigate into the scan history page within the "Sources" experience.

The following options are available for scan insights:

| Option | Description |
|--|--|
| **KPIs** | These tiles at the top of the page to provide high level summary of: </br>- The total number of scans </br>- The number of successful scans </br>- The number of canceled scans </br>- The number of failed scans |
| **Filters** | Time: **last 30 days** or **last 7 days** |
| **Scan status** | Use the **Scan status** graph to view the count of successful, failed and canceled scans per week or per day, based on the time filter selected |

### Glossary Insights

This report is gives the business users and data stewards a status report on glossary. Users can view this report to understand distribution of glossary terms by status, learn how many glossary terms are attached to assets and how many are not yet attached to any asset. Business users can also learn about completeness of their glossary terms. 

This report summarizes top items that a business user or data steward needs to focus on, to create a complete and usable glossary for his/her organization. Users can also navigate into the "Glossary" experience from "Glossary Insights" experience, to make changes on a specific glossary term.

The following options are available for glossary insights:

| Option | Description |
|--|--|
| **KPIs** | These tiles at the top of the page to provide high level summary of: </br>- The number of glossary terms in the catalog </br>- The number of catalog users |
| **Filters** | None |
| **Top glossary terms and count of assets** | Use the **Top glossary terms and count of assets** graph to view the top terms with assets associated with them |
| **Glossary terms by term status** | Use the **Glossary terms by term status** graph to distribution of term status by count of assets |

### Classification Insights

This report provides details about where classified data is located, the classifications found during a scan, and a drilldown to the classified files themselves. It enables security administrators to understand the types of information found in their organization's data estate. 

In Azure Purview, classifications are similar to subject tags, and are used to mark and identify content of a specific type in your data estate.

Use the Classification Insights report to identify content with specific classifications and understand required actions, such as adding additional security to the repositories, or moving content to a more secure location.

The following options are available for classification insights:

|Option  |Description  |
|---------|---------|
|**Overview of sources with classifications**     | Use the tiles at the top of the page to view overall statistics, including: </br>- The number of subscriptions scanned </br>- The number of unique classifications found</br>- The number of sources found with classified data</br>- The number of files and tables found with classifications        |
|**Top sources with classified data (last 30 days)**  |Use the **Top sources with classified data (last 30 days)** graph to view the trend, over the past 30 days, of the number of sources found with classified data. |
| **Top classification categories by sources** |Use the **Top classification categories by sources** graph to view the top classifications found in the data sources.  |
|**Top classifications** <br>(for files or tables)     |  Use the **Top classifications** graphs for files and tables to view the most commonly found classifications in your content, such as credit card numbers or national identification numbers.       |
|**Classification activity** | Use the **Classified data** graphs to view the number of classified files found for files and tables over time, and adjust the time selector above the graphs to view data for different time periods. |

Inside the graphs, you can select **View more** to drill down further. On the detailed classification report, use the following methods to modify the data displayed:

|Option  |Description  |
|---------|---------|
|**Filter**     |   Use the **Filter by keyword**, **Classification**, **Subscription**, and **Source Type** filters to filter the graphs to show data for specific content only.      |
|**Edit columns**     | Select **Edit Columns** to change the column data shown in the table below your graphs.        |
|**Find more information** |In the grid, select a specific classification to view additional information about the data sources, such as: </br>- Source types </br>- Subscription details </br>- Numbers of classified files or tables for the selected classification. | 
|**Browse assets** | In the grid, select one or more classifications, and then above the filter, select **Browse assets** to view the relevant assets as a search result in the Purview catalog. | 

### Labeling Insights

This report provides details about the sensitivity labels found during a scan, as well as a drilldown to the labeled files themselves. It enables security administrators to ensure the security of information found in their organization's data estate. 

In Azure Purview, sensitivity labels are used to identify classification type categories, as well as the group security policies that you want to apply to each category.

Use the Labeling Insights report to identify the sensitivity labels found in your content and understand required actions, such as managing access to specific repositories or files.

The following options are available for labeling insights:

|Option  |Description  |
|---------|---------|
|**Overview of sources with sensitivity labels**     | Use the tiles at the top of the page to view overall statistics, including: </br>- The number of subscriptions scanned </br>- The number of unique labels</br>- The number of sources with sensitivity labels applied</br>- The number of files and tables with sensitivity labels applied       |
|**Top sources with labeled data (last 30 days)**  |Use the **Top sources with labeled data (last 30 days)** graph to view the trend, over the past 30 days, of the number of sources with sensitivity labels applied. |
| **Top labels applied across sources** |Use the **Top labels applied across sources** graph to view the sources that have top labels applied. |
|**Top labels applied**     |  Use the **Top labels applied** graphs for files and tables to view the most commonly used labels in your content.       |
|**Labeling activity** <br>(files and tables) | Use the **Labeled data** graphs to view the number of files and tables labeled over time, and adjust the time selector above the graphs to view data for different time periods. |

On the detailed labeling report, use the following methods to modify the data displayed:

|Option  |Description  |
|---------|---------|
|**Edit columns**     | Select **Edit Columns** to change the column data shown in the table below your graphs.        |
|**Filter**     |   Use the **Filter by keyword**, **Sensitivity label**, **Subscription**, and **Source type** filters to filter the graphs to show data for specific content only.      |
|**Find more information** |In the grid, select a specific label to view additional information about the data sources, such as: </br>- Source types </br>- Subscription details </br>- Numbers of labeled files or tables for the selected sensitivity label. | 
|**Browse assets** | In the grid, select one or more sensitivity labels, and then above the filter, select **Browse assets** to view the relevant assets as a search result in the Purview catalog. | 

## Next steps

[Tutorial on how to view Insights in Purview](starter-kit-tutorial-6.md)

