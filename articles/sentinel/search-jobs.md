---
title: Search for specific events across large datasets in Microsoft Sentinel
description: Learn how to use search jobs to search large datasets.
author: guywi-ms
ms.topic: how-to
ms.date: 03/06/2025
ms.author: guywild
appliesto:
    - Microsoft Sentinel in the Microsoft Defender portal
    - Microsoft Sentinel in the Azure portal
ms.collection: usx-security


#Customer intent: As a security analyst, I want to search through historical log data in a specific table so that I can find and analyze specific events.

---

# Search for specific events across large datasets in Microsoft Sentinel

Use a search job when you start an investigation to scan through up to a year of data in a table for specific events. You can a run search job on any table, including tables with the Analytics, Basic, and Auxiliary log plans. The search job sends its results to a new Analytics table in the same workspace as the source data. 

This article explains how to run a search job in Microsoft Sentinel and how to work with the search job results.

Search jobs across certain data sets might incur extra charges. For more information, see [Microsoft Sentinel pricing page](billing.md).

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Start a search job

Go to **Search** in Microsoft Sentinel from the Azure portal or the Microsoft Defender portal to enter your search criteria. Depending on the size of the target dataset, search times vary. While most search jobs take a few minutes to complete, searches across massive data sets that run up to 24 hours are also supported. 

1. For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), select **Microsoft Sentinel** > **Search**. For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), under **General**, select **Search**.

1. Select the **Table** menu and choose a table for your search.

1. In the **Search** box, enter a search term.

   ### [Defender portal](#tab/defender-portal)
   :::image type="content" source="media/search-jobs/search-job-defender-portal.png" alt-text="Screenshot of search page with search criteria of administrator, time range last 90 days, and table selected." lightbox="media/search-jobs/search-job-defender-portal.png":::
   ### [Azure portal](#tab/azure-portal)
   :::image type="content" source="media/search-jobs/search-job-criteria.png" alt-text="Screenshot of search page with search criteria of administrator, time range last 90 days, and table selected." lightbox="media/search-jobs/search-job-criteria.png":::
   ---

1. Select the **Start**  to open the advanced Kusto Query Language (KQL) editor and preview of the results for a set time range.

1. Change the KQL query as needed and select **Run** to get an updated preview of the search results.

   :::image type="content" source="media/search-jobs/search-job-advanced-kql-edit.png" alt-text="Screenshot of KQL editor with revised search.":::
 
1. When you're satisfied with the query and the search results preview, select the ellipses **...** and toggle  **Search job mode** on.

   :::image type="content" source="media/search-jobs/search-job-advanced-kql-ellipsis.png" alt-text="Screenshot of KQL editor with revised search with ellipsis highlighted for Search job mode." lightbox="media/search-jobs/search-job-advanced-kql-ellipsis.png":::

1. Specify the search job date range using the **Time range** selector. If your query also specifies a time range, Microsoft Sentinel runs the search job on the union of the time ranges.

1. Resolve any KQL issues indicated by a squiggly red line in the editor.

1. When you're ready to start the search job, select **Search job**.

1. Enter a new table name to store the search job results.

1. Select **Run a search job**.

1. Wait for the notification **Search job is done** to view the results.

## View search job results

View the status and results of your search job by going to the **Saved Searches** tab.

1. In Microsoft Sentinel, select **Search** > **Saved Searches**.

1. On the search card, select **View search results**.

   :::image type="content" source="media/search-jobs/view-search-results.png" alt-text="Screenshot that shows the link to view search results at the bottom of the search job card." lightbox="media/search-jobs/view-search-results.png":::

   By default, you see all the results that match your original search criteria.

1. To refine the list of results returned from the search table, select **Add filter**.

1. As you're reviewing your search job results, select **Add bookmark**, or select the bookmark icon to preserve a row. Adding a bookmark allows you to tag events, add notes, and attach these events to an incident for later reference.

   :::image type="content" source="media/search-jobs/search-results-add-bookmark.png" alt-text="Screenshot that shows search job results with a bookmark in the process of being added." lightbox="media/search-jobs/search-results-add-bookmark.png":::

1. Select the **Columns** button and select the checkbox next to columns you'd like to add to the results view.

1. Add the **Bookmarked** filter to only show preserved entries.
1. Select **View all bookmarks** to go the **Hunting** page where you can add a bookmark to an existing incident.

## Next steps

To learn more, see the following articles.

- [Hunt with bookmarks](bookmarks.md)
- [Restore logs from long-term retention](restore.md)
- [Manage data retention in a Log Analytics workspace](/azure/azure-monitor/logs/data-retention-configure)
