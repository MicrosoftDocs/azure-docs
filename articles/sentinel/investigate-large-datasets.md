---
title: Start an investigation by searching large datasets - Microsoft Sentinel
description: Learn about search jobs and restoring archived data in Microsoft Sentinel.
author: cwatson-cat
ms.topic: conceptual
ms.date: 01/21/2022
ms.author: cwatson
---

# Start an investigation by searching for events in large datasets

One of the primary activities of a security team is to search logs for specific events. For example, you might search logs for the activities of a specific user within a given time-frame.

In Microsoft Sentinel, you can search across long time periods in extremely large datasets by using a search job.  While you can run a search job on any type of log, search jobs are ideally suited to search archived logs. If you need to do a full investigation on archived data, you can restore that data into the hot cache to run high performing queries and deeper analysis.


## Search large datasets

Use a search job when you start an investigation to find specific events in logs within a given time frame. You can search all your logs to find events that match your criteria and filter through the results.

Search in Microsoft Sentinel is built on top of search jobs. Search jobs are asynchronous queries that fetch records. The results are returned to a search table that's created in your Log Analytics workspace after you start the search job. The search job uses parallel processing to run the search across long time spans, in extremely large datasets. So search jobs don't impact the workspace's performance or availability.

Search results are stored in a table that has a *_SRCH suffix.

The following image shows example search criteria for a search job.

:::image type="content" source="media/investigate-large-datasets/search-job-criteria.png" alt-text="Screenshot of search page with search criteria of administrator, time range last 1 year, and a table selected.":::

### Supported log types

Use search to find events in any of the following log types:

- [Analytics logs](../azure-monitor/logs/data-platform-logs.md)
- [Basic logs](../azure-monitor/logs/basic-logs-configure.md)

You can also search analytics or basic log data stored in [archived logs](../azure-monitor/logs/data-retention-archive.md).

### Limitations of a search job

Before you start a search job, be aware of the following limitations:

- Optimized to query one table at a time.
- Search date range is up to seven years.
- Supports long running searches up to a 24-hour time-out.
- Results are limited to one million records in the record set.
- Concurrent execution is limited to five search jobs per workspace.
- Limited to 100 search results tables per workspace.
- Limited to 100 search job executions per day per workspace.

Search jobs aren't currently supported for the following workspaces:

- Customer-managed key enabled workspaces
- Workspaces in the China East 2 region

To learn more, see [Search job in Azure Monitor](../azure-monitor/logs/search-jobs.md) in the Azure Monitor documentation.

## Restore historical data from archived logs

When you need to do a full investigation on data stored in archived logs, restore a table from the **Search** page in Microsoft Sentinel. Specify a target table and time range for the data you want to restore. Within a few minutes, the log data is restored and available within the Log Analytics workspace. Then you can use the data in high-performance queries that support full KQL.

A restored log table is available in a new table that has a *_RST suffix. The restored data is available as long as the underlying source data is available. But you can delete restored tables at any time without deleting the underlying source data. To save costs, we recommend you delete the restored table when you no longer need it.

The following image shows the restore option on a saved search.

:::image type="content" source="media/investigate-large-datasets/search-results-restore.png" alt-text="Screenshot of the restore link on a saved search.":::

### Limitations of log restore

Before you start to restore an archived log table, be aware of the following limitations:


- Restore data for a minimum of two days.
- Restore data more than 14 days old.
- Restore up to 60 TB.
- Restore is limited to one active restore per table.
- Restore up to four archived tables per workspace per week.
- Limited to two concurrent restore jobs per workspace.

To learn more, see [Restore logs in Azure Monitor](../azure-monitor/logs/restore.md).

## Bookmark search results or restored data rows

Similar to the [threat hunting dashboard](hunting.md#use-the-hunting-dashboard), bookmark rows that contain information you find interesting so you can attach them to an incident or refer to them later. For more information, see [Create bookmarks](hunting.md#create-bookmarks).

## Next steps

- [Search across long time spans in large datasets](search-jobs.md)
- [Restore archived logs from search](restore.md)
