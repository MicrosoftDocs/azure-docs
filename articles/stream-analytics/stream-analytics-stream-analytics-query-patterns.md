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
Queries in Azure Stream Analytics are expressed in a SQL-like query language, which is documented [here](https://msdn.microsoft.com/library/azure/dn834998.aspx).  This document outlines solutions to several common query patterns based on real world scenarios.  It is a work in progress and will continue to be updated with new patterns on an ongoing basis.

## Basics ##

## Data type conversions ##
**Description**: Define the types of the properties on the input stream.
e.g. Car weight is coming on the input stream as strings and needs to be converted to INT to perform SUM it up.

**Input**:

| Make | Time | Weight |
| --- | --- | --- |
| Honda | 2015-01-01T00:00:01.0000000Z | "1000" |
| Honda | 2015-01-01T00:00:02.0000000Z | "2000" |

**Output**:

| Make | Weight |
| --- | --- |
| Honda | 3000 |

**Solution**:

	SELECT
    	Make,
    	SUM(CAST(Weight AS BIGINT)) AS Weight
	FROM
    	Input TIMESTAMP BY Time
	GROUP BY
		Make,
    	TumblingWindow(second, 10)

**Explanation**:
Use a CAST statement on the Weight field to specify its type (see the list of supported Data Types [here](https://msdn.microsoft.com/library/azure/dn835065.aspx)).

## Using Like/Not like to do pattern matching ##
**Description**: Check that a field value on the event matches a certain pattern
e.g. Return license plates that start with A and end with 9

**Input**:

| Make | LicensePlate | Time |
| --- | --- | --- |
| Honda | ABC-123 | 2015-01-01T00:00:01.0000000Z |
| Toyota | AAA-999 | 2015-01-01T00:00:02.0000000Z |
| Nissan | ABC-369 | 2015-01-01T00:00:03.0000000Z |

**Output**:

| Make | LicensePlate | Time |
| --- | --- | --- |
| Toyota | AAA-999 | 2015-01-01T00:00:02.0000000Z |
| Nissan | ABC-369 | 2015-01-01T00:00:03.0000000Z |

**Solution**:

	SELECT
    	*
	FROM
    	Input TIMESTAMP BY Time
	WHERE
    	LicensePlate LIKE 'A%9'

**Explanation**:
Use the LIKE statement to check that the LicensePlate field value starts with A then has any string of zero or more characters and it ends with 9. 

## Specify logic for different cases/values (CASE statements) ##
**Description**: Provide different computation for a field based on some criteria.
e.g. Provide a string description for how many cars passed of the same make with a special case for 1.

**Input**:

| Make | Time |
| --- | --- |
| Honda | 2015-01-01T00:00:01.0000000Z |
| Toyota | 2015-01-01T00:00:02.0000000Z |
| Toyota | 2015-01-01T00:00:03.0000000Z |

**Output**:

| CarsPassed | Time |
| --- | --- | --- |
| 1 Honda | 2015-01-01T00:00:10.0000000Z |
| 2 Toyotas | 2015-01-01T00:00:10.0000000Z |

**Solution**:

    SELECT
    	CASE
			WHEN COUNT(*) = 1 THEN CONCAT('1 ', Make)
			ELSE CONCAT(CAST(COUNT(*) AS NVARCHAR(MAX)), ' ', Make, 's')
		END AS CarsPassed,
		System.TimeStamp AS Time
	FROM
		Input TIMESTAMP BY Time
	GROUP BY
		Make,
		TumblingWindow(second, 10)

**Explanation**:
The CASE clause allows us to provide a different computation based on some criteria (in our case the count of cars in the aggregate window).

## Send data to multiple outputs ##
**Description**: Send data to multiple output targets from a single job.
e.g. Analyze data for a threshold-based alert and archive all events to blob storage

**Input**:

| Make | Time |
| --- | --- |
| Honda	| 2015-01-01T00:00:01.0000000Z |
| Honda	| 2015-01-01T00:00:02.0000000Z |
| Toyota | 2015-01-01T00:00:01.0000000Z |
| Toyota | 2015-01-01T00:00:02.0000000Z |
| Toyota | 2015-01-01T00:00:03.0000000Z |

**Output1**:

| Make | Time |
| --- | --- |
| Honda | 2015-01-01T00:00:01.0000000Z |
| Honda | 2015-01-01T00:00:02.0000000Z |
| Toyota | 2015-01-01T00:00:01.0000000Z |
| Toyota | 2015-01-01T00:00:02.0000000Z |
| Toyota | 2015-01-01T00:00:03.0000000Z |

**Output2**:

| Make | Time | Count |
| --- | --- | --- |
| Toyota | 2015-01-01T00:00:10.0000000Z | 3 |

**Solution**:

	SELECT
		*
	INTO
		ArchiveOutput
	FROM
		Input TIMESTAMP BY Time

	SELECT
		Make,
		System.TimeStamp AS Time,
		COUNT(*) AS [Count]
	INTO
		AlertOutput
	FROM
		Input TIMESTAMP BY Time
	GROUP BY
		Make,
		TumblingWindow(second, 10)
	HAVING
		[Count] >= 3

**Explanation**:
The INTO clause tells Stream Analytics which of the outputs to write the data from this statement.
The first query is a pass-through of the data we received to an output that we named ArchiveOutput.
The second query does some simple aggregation and filtering and sends the results to a downstream alerting system.
*Note*: You can also reuse results of CTEs (i.e. WITH statements) in multiple output statements – this has the added benefit of opening less readers to the input source.
e.g. 

	WITH AllRedCars AS (
		SELECT
			*
		FROM
			Input TIMESTAMP BY Time
		WHERE
			Color = 'red'
	)
	SELECT * INTO HondaOutput FROM AllRedCars WHERE Make = 'Honda'
	SELECT * INTO ToyotaOutput FROM AllRedCars WHERE Make = 'Toyota'

## Patterns ##

## Counting unique values
**Description**: count the number of unique field values that appear in the stream within a time window.
e.g. How many unique makes of cars passed through the toll booth in a 2 second window?

**Input**:

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
We do an initial aggregation to get unique makes with their count over the window.
We then do an aggregation of how many makes we got – given all unique values in a window get the same timestamp then the second aggregation window needs to be minimal to not aggregate 2 windows from the first step.

## Determine if a value has changed ##
**Description**: Look at a previous value to determine if it is different than the current value
e.g. Is the previous car on the Toll Road the same make as the current car?

**Input**:

| Make | Time | 
| --- | --- |
| Honda | 2015-01-01T00:00:01.0000000Z |
| Toyota | 2015-01-01T00:00:02.0000000Z |

**Output**:

Make	Time
Toyota	2015-01-01T00:00:02.0000000Z
