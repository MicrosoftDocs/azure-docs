---
title: Search across long time spans in large datasets - Microsoft Sentinel
description: Learn how to use search jobs to search large datasets.
author: austinmccollum
ms.topic: how-to
ms.date: 03/07/2024
ms.author: austinmc
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
---

# Search across long time spans in large datasets

Use a search job when you start an investigation to find specific events in logs up to seven years ago. You can search events across all your logs, including events in Analytics, Basic, and Archived log plans. Filter and look for events that match your criteria.

- For more information on search job concepts and limitations, see [Start an investigation by searching large datasets](investigate-large-datasets.md) and [Search jobs in Azure Monitor](../azure-monitor/logs/search-jobs.md).

- Search jobs across certain data sets might incur extra charges. For more information, see [Microsoft Sentinel pricing page](billing.md).

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Start a search job

Go to **Search** in Microsoft Sentinel from the Azure portal or the Microsoft Defender portal to enter your search criteria. Depending on the size of the target dataset, search times vary. While most search jobs take a few minutes to complete, searches across massive data sets that run up to 24 hours are also supported. 

1. For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), under **General**, select **Search**. <br>For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), select **Microsoft Sentinel** > **Search**.
1. Select the **Table** menu and choose a table for your search.
1. In the **Search** box, enter a search term.

   #### [Azure portal](#tab/azure-portal)
   :::image type="content" source="media/search-jobs/search-job-criteria.png" alt-text="Screenshot of search page with search criteria of administrator, time range last 90 days, and table selected." lightbox="media/search-jobs/search-job-criteria.png":::

   #### [Defender portal](#tab/defender-portal)
   :::image type="content" source="media/search-jobs/search-job-defender-portal.png" alt-text="Screenshot of search page with search criteria of administrator, time range last 90 days, and table selected." lightbox="media/search-jobs/search-job-defender-portal.png":::

1. Select the **Start**  to open the advanced Kusto Query Language (KQL) editor and preview of the results for a set time range.

1. Change the KQL query as needed and select **Run** to get an updated preview of the search results.

   :::image type="content" source="media/search-jobs/search-job-advanced-kql-edit.png" alt-text="Screenshot of KQL editor with revised search.":::
 
1. When you're satisfied with the query and the search results preview, select the ellipses **...** and toggle  **Search job mode** on.

   :::image type="content" source="media/search-jobs/search-job-advanced-kql-ellipsis.png" alt-text="Screenshot of KQL editor with revised search with ellipsis highlighted for Search job mode." lightbox="media/search-jobs/search-job-advanced-kql-ellipsis.png":::
1. Select the appropriate **Time range**.
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
- [Restore archived logs](restore.md)
- [Configure data retention and archive policies in Azure Monitor Logs (Preview)](../azure-monitor/logs/data-retention-archive.md)
