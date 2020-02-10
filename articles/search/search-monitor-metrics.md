---
title: Metrics for queries and requests
titleSuffix: Azure Cognitive Search
description: Monitor and understand metrics for queries per second (QPS), search latency, and throttled requests.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 02/11/2020
---

# Measure queries per second (QPS), search latency, and throttled requests

TBD

## Queries per second (QPS)

TBD

## Search latency

TBD

## Throttled queries

TBD

## Metrics schema

Metrics are captured for query requests.

| Name | Type | Example | Notes |
| --- | --- | --- | --- |
| resourceId |string |"/SUBSCRIPTIONS/11111111-1111-1111-1111-111111111111/<br/>RESOURCEGROUPS/DEFAULT/PROVIDERS/<br/>MICROSOFT.SEARCH/SEARCHSERVICES/SEARCHSERVICE" |your resource ID |
| metricName |string |"Latency" |the name of the metric |
| time |datetime |"2018-12-07T00:00:43.6872559Z" |the operation's timestamp |
| average |int |64 |The average value of the raw samples in the metric time interval |
| minimum |int |37 |The minimum value of the raw samples in the metric time interval |
| maximum |int |78 |The maximum value of the raw samples in the metric time interval |
| total |int |258 |The total value of the raw samples in the metric time interval |
| count |int |4 |The number of raw samples used to generate the metric |
| timegrain |string |"PT1M" |The time grain of the metric in ISO 8601 |

All metrics are reported in one-minute intervals. Every metric exposes minimum, maximum and average values per minute.

For the **SearchQueriesPerSecond** metric, minimum is the lowest value for search queries per second that was registered during that minute. The same applies to the maximum value. Average is the aggregate across the entire minute. For example, a single minute might cover one second of high load that is the maximum for SearchQueriesPerSecond, followed by 58 seconds of average load, and finally one second with only one query, which is the minimum. 

For **ThrottledSearchQueriesPercentage**, minimum, maximum, average and total, all have the same value: the percentage of search queries that were throttled, from the total number of search queries during one minute.

## Next steps

[Manage your Search service on Microsoft Azure](search-manage.md) for more information on service administration and [Performance and optimization](search-performance-optimization.md) for tuning guidance.
