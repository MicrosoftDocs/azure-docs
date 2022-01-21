---
title: Start an investigation by searching large datasets - Microsoft Sentinel
description: Learn about search jobs and restoring archived data in Microsoft Sentinel.
author: cwatson-cat
ms.topic: conceptual
ms.date: 01/21/2022
ms.author: cwatson
---

# Start an investigation by searching large datasets (Preview)

One of the primary activities of a security team is to search logs for specific events. For example, you might search logs for the activities of a specific user within a given time-frame. In Microsoft Sentinel, you can search across long time periods in extremely large datasets by using Search jobs. Run search jobs on any type of log but they're ideally suited to search archived or basic logs. If need to do a full investigation on archived data, you can restore that data into the hot cache to run high performing queries and analytics.

## Search for events in large datasets

Use search jobs when you start an investigation to find specific events in logs within a given time frame. You can search all your logs, filter through them, and look for events that match your criteria.

Search in Microsoft Sentinel is built on top of search jobs. Search jobs are asynchronous queries that fetch records. The results are returned to a search table that's created in your workspace after you start the search job. The search job uses parallel processing to run the search across long time spans in extremely large datasets. So the search job doesn't impact the workspace's performance or availability.

### All log types supported

Use search to find events in any of the following log types:

- Analytics logs
- Basic logs
- Archived logs

### Limitations of search jobs

- Optimized for querying one table at a time.
- Uses reduced KQL that supports advanced filtering in a where clause but doesn't support joins, unions, or aggregations.
- Supports long running searches up to a 24 hour time-out.

## Restore archived logs

In some cases, you may need to do a full investigation on historical data. Bring historical log data into the current hot cache to run high performing queries and analytics. Specify a target table and a specific time range for the data you want to restore. Within a few minutes the log data is available within the workspace. Then you can run high performance queries by using full KQL.

Log restore is ideally adapted for restoring historical logs stored in log data archive. After you restore the data, it's available within your workspace for 8 days.

### Limitations of log restore