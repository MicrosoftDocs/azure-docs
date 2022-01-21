---
title: Start an investigation by searching historical data - Microsoft Sentinel
description: Learn about searching and restoring historical data in Microsoft Sentinel.
author: cwatson-cat
ms.topic: conceptual
ms.date: 01/21/2022
ms.author: cwatson
---

# Start an investigation by searching historical data


# Search historical data in large datasets

Use search jobs when you start an investigation to find specific events in logs within a given time frame. You can search all your logs, filter through them, and look for events that match your criteria.

Search in Microsoft Sentinel is built on top of search jobs. Search jobs are asynchronous queries that fetch records. The results are returned to a search table that's created in your workspace at the time of the search. The search job uses parallel processing to run the search job across long time spans in extremely large datasets.

Run search jobs on any type of log. But search jobs are ideally adapted for searching archived and basic logs.

# Restore archived logs from search

In some cases, you may need to do a full investigation on historical data. Bring historical log data into the current hot cache to run high performing queries and analytics. Specify a target table and a specific time range for the data you want to restore. Within a few minutes the log data is available within the workspace. Then you can run high performance queries by using full KQL.

Log restore is ideally adapted for restoring historical logs stored in log data archive. After you restore the data, it's available within your workspace for 8 days.