---
title: Search across long time spans in large datasets - Microsoft Sentinel
description: Learn how to use search jobs to search extremely large datasets.
author: austinmccollum
ms.topic: how-to
ms.date: 10/17/2022
ms.author: austinmc
---

# Search across long time spans in large datasets

Use a search job when you start an investigation to find specific events in logs up to 7 years ago. You can search events across all your logs, including events in Analytics, Basic, and Archived log plans. Filter and look for events that match your criteria.

Before you start a search job, see [Start an investigation by searching large datasets](investigate-large-datasets.md) and [Search jobs in Azure Monitor](../azure-monitor/logs/search-jobs.md).

## Start a search job

Go to **Search** in Microsoft Sentinel to enter your search criteria.

1. In the Azure portal, go to **Microsoft Sentinel** and select the appropriate workspace.
1. Under **General**, select **Search**.
1. Select the **Table** menu and choose a table for your search.
1. In the **Search** box, enter a search term.
1. Click the **Run search** link. This will open the advanced KQL editor and a preview of the results for a 7 day time range.
1. You can modify the KQL and see an updated preview of the search results by selecting **Run**. 
1. Once you're satisfied with the query and the search results preview, click on the 3 dots **...** and toggle the **Search job mode** switch > click the **Search job** button.
1. Select the appropriate **Time range**.
1. Make sure to resolve any KQL issues indicated by a squiggly red line in the editor. When you're ready to start the search job, select **Search**.

   :::image type="content" source="media/search-jobs/search-job-criteria.png" alt-text="Screenshot of search page with search criteria of administrator, timerange last 90 days, and table selected.":::

1. Enter a new table name where the search job results will be stored > click **Run a search job**.

   When the search job starts, wait for a notification and the **Done** button to be available. Once the notification is displayed, click **Done** to close the search pane and return to the search overview page to view the job status.

1. Wait for your search job to be completed. Depending on the size of the target dataset, search times vary. While most search jobs take a few minutes to complete, searches across massive data sets that run up to 24 hours are also supported.Search jobs across certain data sets may incur additional charges. Please refer to the [Microsoft Sentinel pricing page](billing.md) for more information.

## View search job results

View the status and results of your search job by going to the **Saved Searches** tab.

1. In your Microsoft Sentinel workspace, select **Search** > **Saved Searches**.

   :::image type="content" source="media/search-jobs/saved-searches-tab.png" alt-text="Screenshot that shows saved searches tab on the search page.":::

1. On the search card, select **View search results**.

   :::image type="content" source="media/search-jobs/view-search-results.png" alt-text="Screenshot that shows the link to view search results at the bottom of the search job card.":::

1. By default, you see all the results that match your original search criteria.

   :::image type="content" source="media/search-jobs/search-job-results.png" alt-text="Screenshot that shows the logs page with search job results.":::

1. To refine the list of results returned from the search table, click the **Add filter** button.

1. As you're reviewing your search job results, click **Add bookmark** or select the bookmark icon to preserve a row. Adding a bookmark allows you to tag events, add notes, and attach these events to an incident for later reference.

1. Click the **Columns** button and select the checkbox next to additional columns you'd like to add to the results view.

1. Add the *Bookmarked* filter to only show preserved entries. Click the **View all bookmarks** button to go the **Hunting** page where you can add a bookmark to an existing incident.


## Next steps

To learn more, see the following topics.

- [Hunt with bookmarks](bookmarks.md)
- [Restore archived logs](restore.md)
- [Configure data retention and archive policies in Azure Monitor Logs (Preview)](../azure-monitor/logs/data-retention-archive.md)