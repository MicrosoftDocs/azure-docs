---
title: Start an investigation by searching large datasets - Microsoft Sentinel
description: Learn about search jobs and restoring archived data in Microsoft Sentinel.
author: cwatson-cat
ms.topic: conceptual
ms.date: 01/21/2022
ms.author: cwatson
---

# Start an investigation by searching for events in large datasets (Preview)

One of the primary activities of a security team is to search logs for specific events. For example, you might search logs for the activities of a specific user within a given time-frame. In Microsoft Sentinel, you can search across long time periods in extremely large datasets by using a search job. Run a search job on any type of log but they're ideally suited to search archived logs. If need to do a full investigation on archived data, you can restore that data into the hot cache to run high performing queries and analytics.

## Search large datasets

Use a search job when you start an investigation to find specific events in logs within a given time frame. You can search all your logs, filter through them, and look for events that match your criteria.

Search in Microsoft Sentinel is built on top of search jobs. A search job is an asynchronous query that fetch records. The results are returned to a search table that's created in your workspace after you start the search job. The search job uses parallel processing to run the search across long time spans in extremely large datasets. So the search job doesn't impact the workspace's performance or availability.

Search results remain in a search results table with a *_SRCH suffix.

### All log types supported

Use search to find events in any of the following log types:

- [Analytics logs](../azure-monitor/logs/data-platform-logs.ms)
- [Basic logs (preview)](../azure-monitor/logs/azure-monitor-basic-logs.md)

You can also search analytics or basic log data stored in [archived logs (preview)](../azure-monitor/logs/azure-monitor-archived-logs.md).

### Limitations of a search job

Before you start a search job, be aware of the following limitations:

- Optimized to query one table at a time.
- Search date range is up to one year.
- Supports long running searches up to a 24-hour time-out.
- Results are limited to one million records in the record set.
- Concurrent execution is limited to five search jobs per workspace.
- Limited to 100 search results tables per workspace.
- Limited to 100 search job executions per day per workspace.

To learn more, see [Search job](../azure-monitor/logs/azure-monitor-archived-logs#search-job).

## Restore historical data from archived logs

When you need to do a full investigation on archived data, restore a table from the search page in Microsoft Sentinel. Specify a target table and time range for the data you want to restore. Within a few minutes, the log data is available within the Log Analytics workspace. Then you can run high-performance queries by using full KQL.

Log restore is ideally suited for restoring historical logs stored in log data archive.

A restored Log table is available in new table with a *_RST suffix. Restored tables are automatically deleted after eight days. But you can delete restored tables at any time.

### Limitations of log restore

Before you start restore an archived log table, be aware of the following limitations:

- Restored data is available for eight days.
- Restore is limited to one active restore per table.
- Restore up to four archived tables per workspace per week.
- Limited to two concurrent restore jobs per workspace.

To learn more, see [Restore](../azure-monitor/logs/azure-monitor-archived-logs#restore).

## Bookmark search results or restored data rows

Similar to the threat hunting dashboard, you can bookmark rows that contain information you find interesting so you can attach them to an incident or refer to them later. To learn more, see [Create bookmarks](hunting.md#create-bookmarks).

## Next steps

- [Search across long time spans in large datasets (Preview)](search-jobs.md)
- [Restore archived logs from search (Preview)](restore.md)
