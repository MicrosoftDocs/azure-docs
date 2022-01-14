---
title: Search across long time spans in large datasets - Microsoft Sentinel
description: Learn about about searching extremely large datasets.
author: cwatson-cat
ms.topic: conceptual
ms.date: 01/14/2022
ms.author: cwatson
---

# Search across long time spans in extremely large datasets

Search in Microsoft Sentinel allows you to access every event that matches the search query within the selected date and time range. You can submit search queries, filter the search results, and view event data.

## Built on search jobs

Search in Microsoft Sentinel is built on top of search jobs. Search jobs are asynchronous queries that fetch records. The results are returned to a search table that's created in your workspace at the time of the search. The search job uses parallel processing to run the search job across long time spans in extremely large datasets.

## Limitations

timespan 7 years
timeout 24hrs (LA limit)
Reduced KQL

## Logs it can search

Run search jobs on run on any type of log. They are ideally adapted to search archived logs.(Why?)

## When to use search

Use search when you start an investigation to find specific events in logs within a given time frame. You can search all your logs, filter through them, and look for events that match your criteria.
