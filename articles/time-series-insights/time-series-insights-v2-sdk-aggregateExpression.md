---
title: Explore data using the Azure Time Series Insights explorer | Microsoft Docs
description: This article describes how to use the Azure Time Series Insights explorer in your web browser to quickly see a global view of your big data and validate your IoT environment.
ms.service: time-series-insights
services: time-series-insights
author: ashannon7
ms.author: anshan
manager: cshankar
ms.reviewer: v-mamcge, jasonh, kfile, anshan
ms.devlang: csharp
ms.workload: big-data
ms.topic: conceptual
ms.date: 09/18/2018
---

# Time Series Insights JavaScript Client Overview

## aggregateExpression

An aggregate expression is a tuple representing all of the necessary information for querying aggregates from the TSI aggregates API.  It is represented as a javascript object with several fields including

* predicate <Object> (required): The predicate used to filter the aggregate call.  Has the following property…
    *	predicateString <string> (required): The predicate string for filtering the aggregate call

* measure <string> (required): The name of the numerical column to be aggregated.  Can also be “Events Count” if only the count of events is desired

*	measureTypes Array<string> (optional): The measure types requested, e.g. avg, min, max, sum, count.  If nothing is specified, Count is selected, and Avg is selected if the measure is not “Events Count”.  An example of measure types would be [‘avg’, ‘sum’, ‘count’]

* splitBy <string> (optional): The name of a categorical column to split the aggregates by
* searchSpan <Object> (optional): The timespan and bucket size for this aggregate expression.  If not provided, it will be inherited from options.timespan.  Timespan has the following properties…
    * from <Date> (required): The start time for the aggregate expression
    * to <Date> (required): The end time for the aggregate expression
    * bucketSize <string> (optional): the size of the buckets for the query, for example ‘1m’ would be for 1 minute buckets

## Next steps
> [!div class="nextstepaction"]
>[Diagnose and solve problems in your Time Series Insights environment](time-series-insights-diagnose-and-solve-problems.md)
