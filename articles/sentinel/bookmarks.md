---
title: Keep track of data while hunting in Azure Sentinel Preview using hunting bookmarks | Microsoft Docs
description: This article describes how to use the Azure Sentinel hunting bookmarks to keep track of data.
services: sentinel
documentationcenter: na
author: rkarlin
manager: rkarlin
editor: ''

ms.assetid: 320ccdad-8767-41f3-b083-0bc48f1eeb37
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.custom: mvc
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 2/28/2019
ms.author: rkarlin
---

# Keep track of data during hunting

> [!IMPORTANT]
> Azure Sentinel is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
 
Threat hunting typically requires reviewing mountains of log data looking for evidence of malicious behavior. During this process, investigators find events that they want to remember, revisit, and analyze as part of validating potential hypotheses and understanding the full story of a compromise.
Hunting bookmarks help you do this, by preserving the queries you ran in Log Analytics, along with the query results that you deem relevant. You can also record your contextual observations and reference your findings by adding notes and tags. Bookmarked data is visible to you and your teammates for easy collaboration.   

You can revisit your bookmarked data at any time on the **Bookmark** tab of the **Hunting** page. You can use filtering and search options to quickly find specific data for your current investigation. Alternatively, you can view your bookmarked data directly in the **HuntingBookmark** table in Log Analytics. This enables you to filter, summarize, and join bookmarked data with other data sources, making it easy to look for corroborating evidence.

You can also visualize your bookmarked data, by clicking **Investigate**. This launches the investigation experience in which you can view, investigate, and visually communicate your findings using an interactive entity-graph diagram and timeline.


## Run a Log Analytics query from Azure Sentinel

1. In the Azure Sentinel portal, click **Hunting** to run queries for suspicious and anomalous behavior.

1. To run a hunting campaign, select one of the hunting queries and on the left, review the results. 

1. Click **View query results** in the hunting query **Details** page to view the query results in Log Analytics. Here's an example of what you see if you ran a custom SSH bruteforce attack query.
  
   ![show results](./media/bookmarks/ssh-bruteforce-example.png)

## Add a bookmark

1. In the Log Analytics query results list, expand the row containing the information that you find interesting.

4. Select the ellipsis (...) at the end of the row, and select **Add hunting bookmarks**.
5. On the right, in the **Details** page, update the name, and add tags, and notes to help you identify what was interesting about the item.
6. Click **Save** to commit your changes. All bookmarked data is shared with other investigators, and is a first step toward a collaborative investigation experience.

   ![show results](./media/bookmarks/add-bookmark-la.png)

 
> [!NOTE]
> You can also use bookmarks with arbitrary Log Analytics queries launched from the Azure Sentinel Log Analytics Logs page, or queries created on the fly from the Log Analytics page and opened from the Hunting page. You will not be able to add a bookmark if you launch Log Analytics from outside of Azure Sentinel. 

## View and update bookmarks 

1. In the Azure Sentinel portal, click **Hunting**. 
2. Click the **Bookmarks** tab in the middle of the page to view the list of bookmarks.
3. Use the search box or filter options to find a specific bookmark.
4. Select individual bookmarks in the grid below to view the bookmark details in the right hand details pane.
5. To update tags and notes, click on the editable text boxes and click **Save** to preserve your changes.

   ![show results](./media/bookmarks/view-update-bookmarks.png)

## View bookmarked data in Log Analytics 

There are multiple options to viewing your bookmarked data in Log Analytics. 

The easiest way to view bookmarked queries, results, or history is by selecting the desired bookmark in the **Bookmarks** table and use the links provided in the details pane. Options include: 
- Click on **View query** to view the source query in Log Analytics.  
- Click on **View bookmark history** to see all bookmark metadata including: who made the update, the updated values, and the time the update occurred. 

- You can also view the raw bookmark data for all bookmarks by clicking on **Bookmark logs** above the bookmark grid. This view will show the all your bookmarks in the hunting bookmark table with associated metadata. You can use KQL queries to filter down to the latest version of the specific bookmark you are looking for.  


> [!NOTE]
> There can be significant delay (measured in minutes) between the creation of a bookmark and when it is displayed in the **HuntingBookmark** table. It is recommended to create your bookmarks first, then analyze them after the data is ingested. 

## Delete a bookmark
If you want to delete a bookmark do the following: 
1.	Open th **Hunting bookmark** tab. 
2.	Select the target bookmark.
3.	Select the ellipsis (...) at the end of the row and select **Delete bookmark**.
	
Deleting the bookmark removes the bookmark from the list in the **Bookmark** tab.  The Log Analytics “HuntingBookmark” table will continue to contain previous bookmark entries, but the latest entry will change the **SoftDelete** value to true, making it easy to filter out old bookmarks.  Deleting a bookmark does not remove any entities from the investigation experience that are associated with other bookmarks or alerts. 


## Next steps

In this article, you learned how to run a hunting investigation using bookmarks in Azure Sentinel. To learn more about Azure Sentinel, see the following articles:


- [Proactively hunt for threats](hunting.md)
- [Use notebooks to run automated hunting campaigns](notebooks.md)
