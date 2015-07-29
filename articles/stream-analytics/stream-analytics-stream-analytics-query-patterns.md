<properties
	pageTitle="Azure Stream Analytics Query Patterns | Microsoft Azure"
	description="Azure Stream Analytics Sample Query Language Guide"
	keywords="stream analytics, sample, query, language, guide, patterns"
	services="stream-analytics"
	documentationCenter=""
	authors="jeffstokes72"
	manager="paulettm"
	editor="cgronlun"/>

<tags
	ms.service="stream-analytics"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="big-data"
	ms.date="07/29/2015"
	ms.author="jeffstok"/>


# Azure Stream Analytics Sample Query Language Guide #

## Introduction ##

## Counting unique values
Description: count the number of unique field values that appear in the stream within a time window.
e.g. How many unique make of cars passed through the toll booth in a 2 second window?

**Input:**

| Make | Time | 
| --- | --- |
| Honda | 00:00:00 | 
| Honda | 00:00:01 | 
| Toyota | 00:00:00 | 
| Toyota | 00:00:01 | 
| Toyota | 00:00:02 | 

**Output:**

| Count | Time |
| --- | --- |
| 2 | 00:00:01 |
| 1 | 00:00:03 |

**Solution:**

    WITH Makes AS (
    	SELECT
    		Make,
    		COUNT(*) AS CountMake,
    	FROM
    		Entry TIMESTAMP BY EntryTime
    	GROUP BY
              Make,
              TumblingWindow(second, 2)
    )
    SELECT
		COUNT(*) AS Count,
		System.TimeStamp AS Time
	FROM
		Makes
	GROUP BY
		TumblingWindow(second, 1)

**Explanation:**
The query does an initial aggregation to get unique makes with their count during the window. Then it performs an aggregation of how many makes there are – given that all unique values in a window get the same timestamp then the second aggregation window needs to be minimal to not aggregate 2 windows from the first step.

----
