---
title: Search across long time spans in large datasets - Microsoft Sentinel
description: Learn how to use search jobs to search extremely large datasets.
author: cwatson-cat
ms.topic: how-to
ms.date: 01/14/2022
ms.author: cwatson
---

# Search across long time spans in large datasets (preview)

Use a search job when you start an investigation to find specific events in logs within a given time frame. You can search all your logs, filter through them, and look for events that match your criteria.

Before you start a search job, see [Start an investigation by searching large datasets (preview)](investigate-large-datasets.md) and [Search jobs in Azure Monitor](../azure-monitor/logs/search-jobs.md).

> [!IMPORTANT]
> The search job feature is currently in **PREVIEW**. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Start a search job

Go to **Search** in Microsoft Sentinel to enter your search criteria.

1. In the Azure portal, go to **Microsoft Sentinel** and select the appropriate workspace.
1. Under **General**, select **Search (preview)**.
1. In the **Search** box, enter the search term.
1. Select the appropriate **Time range**.
1. Select the **Table** that you want to search.
1. When you're ready to start the search job, select **Search**.

   :::image type="content" source="media/search-jobs/search-job-criteria.png" alt-text="Screenshot of search page with search criteria of administrator, timerange last 90 days, and table selected.":::

   When the search job starts, a notification and the job status show on the search page.

1. Wait for your search job to complete. Depending on your dataset and search criteria, the search job may take a few minutes or up to 24 hours to complete. If your search job takes longer than 24 hours, it will time out. If that happens, refine your search criteria and try again.

## View search job results

View the status and results of your search job by going to the **Saved Searches** tab.

1. In your Microsoft Sentinel workspace, select **Search** > **Saved Searches**.

   :::image type="content" source="media/search-jobs/saved-searches-tab.png" alt-text="Screenshot that shows saved searches tab on the search page.":::

1. On the search card, select **View search results**.

   :::image type="content" source="media/search-jobs/view-search-results.png" alt-text="Screenshot that shows the link to view search results at the bottom of the search job card.":::

1. By default, you see all the results that match your original search criteria.

   :::image type="content" source="media/search-jobs/search-job-results.png" alt-text="Screenshot that shows the logs page with search job results.":::

   In the search query, notice the time columns referenced.
 
   - `TimeGenerated` is the date and time the data was ingested into the search table.
   - `_OriginalTimeGenerated` is the date and time the record was created.
1. To refine the list of results returned from the search table, edit the KQL query.

1. As you're reviewing your search job results, bookmark rows that contain information you find interesting so you can attach them to an incident or refer to them later.


## Next steps

To learn more, see the following topics.

- [Hunt with bookmarks](bookmarks.md)
- [Restore archived logs](restore.md)
- [Configure data retention and archive policies in Azure Monitor Logs (Preview)](../azure-monitor/logs/data-retention-archive.md)