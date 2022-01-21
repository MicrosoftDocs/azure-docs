---
title: Start an investigation by searching large datasets - Microsoft Sentinel
description: Learn about search jobs and restoring archived data in Microsoft Sentinel.
author: cwatson-cat
ms.topic: conceptual
ms.date: 01/21/2022
ms.author: cwatson
---

# Start an investigation by searching for events in large datasets (Preview)

One of the primary activities of a security team is to search logs for specific events. For example, you might search logs for the activities of a specific user within a given time-frame. In Microsoft Sentinel, you can search across long time periods in extremely large datasets by using Search jobs. Run search jobs on any type of log but they're ideally suited to search archived or basic logs. If need to do a full investigation on archived data, you can restore that data into the hot cache to run high performing queries and analytics.

## Search large datasets

Use search jobs when you start an investigation to find specific events in logs within a given time frame. You can search all your logs, filter through them, and look for events that match your criteria.

Search in Microsoft Sentinel is built on top of search jobs. Search jobs are asynchronous queries that fetch records. The results are returned to a search table that's created in your workspace after you start the search job. The search job uses parallel processing to run the search across long time spans in extremely large datasets. So the search job doesn't impact the workspace's performance or availability.

Search results remain in a search results table with a *_suffix.

### Query experience in Log Analytics

When you review your search results in Log Analytics, you can switch your query experience between simple  or advanced mode. Simple mode allows you to filter your search results without having to know any KQL syntax. Advanced mode allows you to write queries in full KQL to filter your results.

### All log types supported

Use search to find events in any of the following log types:

- Analytics logs
- Basic logs
- Archived logs

### Limitations of search jobs

- Optimized for querying one table at a time.
- Uses reduced KQL that supports advanced filtering in a where clause but doesn't support joins, unions, or aggregations.
- Supports long running searches up to a 24 hour time-out.

### Bookmarks supported

Similar to the threat hunting dashboard, you can bookmark rows that contain information you find interesting so you can attach them to an incident or refer to them later. To learn more, see [Create bookmarks](hunting.md#create-bookmarks).

## Restore historical data in archived logs

When you need to do a full investigation on archived data, restore a table from search in Microsoft Sentinel. Specify a target table and time range for the data you want to restore. Within a few minutes the log data is available within the workspace. Then you can run high performance queries by using full KQL.

Log restore is ideally suited for restoring historical logs stored in log data archive.

Log tables are restored in new table with a *_RST suffix.
Restored tables are not re-ingested. After you restore the data, it's available within your workspace for eight days.

### Limitations of log restore

- Restored data is available for eight days.
- Restore one table at a time.