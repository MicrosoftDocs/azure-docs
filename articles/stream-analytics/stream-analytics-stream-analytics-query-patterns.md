---
title: Common query patterns in Azure Stream Analytics
description: This article describes several common query patterns and designs that are useful in Azure Stream Analytics jobs.
ms.service: azure-stream-analytics
ms.topic: how-to
ms.date: 12/17/2024
ms.custom: devx-track-js
---

# Common query patterns in Azure Stream Analytics

Queries in Azure Stream Analytics are expressed in an SQL-like query language. The language constructs are documented in the [Stream Analytics query language reference](/stream-analytics-query/stream-analytics-query-language-reference) guide. 

The query design can express simple pass-through logic to move event data from one input stream into an output data store, or it can do rich pattern matching and temporal analysis to calculate aggregates over various time windows as in the [Build an IoT solution by using Stream Analytics](stream-analytics-build-an-iot-solution-using-stream-analytics.md) guide. You can join data from multiple inputs to combine streaming events, and you can do lookups against static reference data to enrich the event values. You can also write data to multiple outputs.

This article outlines solutions to several common query patterns based on real-world scenarios.

## Supported Data Formats

Azure Stream Analytics supports processing events in CSV, JSON, and Avro data formats. The JSON and Avro formats can contain complex types such as nested objects (records) or arrays. For more information on working with these complex data types, see [Parsing JSON and AVRO data](stream-analytics-parsing-json.md).

## Send data to multiple outputs

Multiple **SELECT** statements can be used to output data to different output sinks. For example, one **SELECT** statement can output a threshold-based alert while another one can output events to a blob storage.

Consider the following **input**:

```
| Make | Time |
| --- | --- |
| Make1 |2023-01-01T00:00:01.0000000Z |
| Make1 |2023-01-01T00:00:02.0000000Z |
| Make2 |2023-01-01T00:00:01.0000000Z |
| Make2 |2023-01-01T00:00:02.0000000Z |
| Make2 |2023-01-01T00:00:03.0000000Z |
```

And, you want the following two outputs from the query: 

**ArchiveOutput**:

```
| Make | Time |
| --- | --- |
| Make1 |2023-01-01T00:00:01.0000000Z |
| Make1 |2023-01-01T00:00:02.0000000Z |
| Make2 |2023-01-01T00:00:01.0000000Z |
| Make2 |2023-01-01T00:00:02.0000000Z |
| Make2 |2023-01-01T00:00:03.0000000Z |
```

**AlertOutput**:

```
| Make | Time | Count |
| --- | --- | --- |
| Make2 |2023-01-01T00:00:10.0000000Z |3 |
```

**Query with two SELECT statements with Archive output and Alert output as outputs**:

```SQL
SELECT
	*
INTO
	ArchiveOutput
FROM
	Input TIMESTAMP BY Time

SELECT
	Make,
	System.TimeStamp() AS Time,
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
```


The **INTO** clause tells the Stream Analytics service which of the outputs to write the data to. The first **SELECT** defines a pass-through query that receives data from the input and sends it to the output named **ArchiveOutput**. The second query aggregates and filters data before sending the results to a downstream alerting system output called **AlertOutput**.

The **WITH** clause can be used to define multiple subquery blocks. This option has the benefit of opening fewer readers to the input source.

**Query**:

```SQL
WITH ReaderQuery AS (
	SELECT
		*
	FROM
		Input TIMESTAMP BY Time
)

SELECT * INTO ArchiveOutput FROM ReaderQuery

SELECT 
	Make,
	System.TimeStamp() AS Time,
	COUNT(*) AS [Count] 
INTO AlertOutput 
FROM ReaderQuery
GROUP BY
	Make,
	TumblingWindow(second, 10)
HAVING [Count] >= 3
```

For more information, see [**WITH** clause](/stream-analytics-query/with-azure-stream-analytics).

## Simple pass-through query

A simple pass-through query can be used to copy the input stream data into the output. For example, if a stream of data containing real-time vehicle information needs to be saved in an SQL database for later analysis, a simple pass-through query does the job.

Consider the following **input**:

```
| Make | Time | Weight |
| --- | --- | --- |
| Make1 |2023-01-01T00:00:01.0000000Z |"1000" |
| Make1 |2023-01-01T00:00:02.0000000Z |"2000" |
```

You want the **output** to be the same as the input:

```
| Make | Time | Weight |
| --- | --- | --- |
| Make1 |2023-01-01T00:00:01.0000000Z |"1000" |
| Make1 |2023-01-01T00:00:02.0000000Z |"2000" |
```

Here's the **query**:

```SQL
SELECT
	*
INTO Output
FROM Input
```

This **SELECT** * query projects **all** the fields of an incoming event and sends them to the output. Instead, you can project only the required fields in a **SELECT** statement. In the following example, the **SELECT** statement projects only the *Make* and *Time* fields from the input data.

Consider the following **input**:

```
| Make | Time | Weight |
| --- | --- | --- |
| Make1 |2023-01-01T00:00:01.0000000Z |1000 |
| Make1 |2023-01-01T00:00:02.0000000Z |2000 |
| Make2 |2023-01-01T00:00:04.0000000Z |1500 |
```

You want the **output** to have only the Make and Time fields:

```
| Make | Time |
| --- | --- |
| Make1 |2023-01-01T00:00:01.0000000Z |
| Make1 |2023-01-01T00:00:02.0000000Z |
| Make2 |2023-01-01T00:00:04.0000000Z |
```

Here's the **query** that projects only the required fields:

```SQL
SELECT
	Make, Time
INTO Output
FROM Input
```

## String matching with LIKE and NOT LIKE

**LIKE** and **NOT LIKE** can be used to verify if a field matches a certain pattern. For example, you can use a filter to return only the license plates that start with the letter `A` and end with the number `9`.

Consider the following **input**:

```
| Make | License_plate | Time |
| --- | --- | --- |
| Make1 |ABC-123 |2023-01-01T00:00:01.0000000Z |
| Make2 |AAA-999 |2023-01-01T00:00:02.0000000Z |
| Make3 |ABC-369 |2023-01-01T00:00:03.0000000Z |
```

You want the **output** to have the license plates that start with the letter `A` and end with the number `9`:

```
| Make | License_plate | Time |
| --- | --- | --- |
| Make2 |AAA-999 |2023-01-01T00:00:02.0000000Z |
| Make3 |ABC-369 |2023-01-01T00:00:03.0000000Z |
```

Here's **query** that uses the LIKE operator:

```SQL
SELECT
	*
FROM
	Input TIMESTAMP BY Time
WHERE
	License_plate LIKE 'A%9'
```

Use the **LIKE** statement to check the **License_plate** field value. It should start with the letter `A`, then have any string of zero or more characters, ending with the number 9.

## Calculation over past events

The **LAG** function can be used to look at past events within a time window and compare them against the current event. For example, make of the current car can be outputted if it’s different from make of the last car that passed through the toll booth.

Sample **input**:

```
| Make | Time |
| --- | --- |
| Make1 |2023-01-01T00:00:01.0000000Z |
| Make2 |2023-01-01T00:00:02.0000000Z |
```

Sample **output**:

```
| Make | Time |
| --- | --- |
| Make2 |2023-01-01T00:00:02.0000000Z |
```

Sample **query**:

```SQL
SELECT
	Make,
	Time
FROM
	Input TIMESTAMP BY Time
WHERE
	LAG(Make, 1) OVER (LIMIT DURATION(minute, 1)) <> Make
```

Use **LAG** to peek into the input stream one event back, retrieving the *Make* value and comparing it to the *Make* value of the current event and output the event.

For more information, see [**LAG**](/stream-analytics-query/lag-azure-stream-analytics).

## Return the last event in a window

As events are consumed by the system in real time, there’s no function that can determine if an event is the last one to arrive for that time window. To achieve this, the input stream needs to be joined with another one where the time of an event is the maximum time for all events at that window.

Sample **input**:

```
| License_plate | Make | Time |
| --- | --- | --- |
| DXE 5291 |Make1 |2023-07-27T00:00:05.0000000Z |
| YZK 5704 |Make3 |2023-07-27T00:02:17.0000000Z |
| RMV 8282 |Make1 |2023-07-27T00:05:01.0000000Z |
| YHN 6970 |Make2 |2023-07-27T00:06:00.0000000Z |
| VFE 1616 |Make2 |2023-07-27T00:09:31.0000000Z |
| QYF 9358 |Make1 |2023-07-27T00:12:02.0000000Z |
| MDR 6128 |Make4 |2023-07-27T00:13:45.0000000Z |
```

Sample **output** with information about last cars in two ten-minute time windows: 

```
| License_plate | Make | Time |
| --- | --- | --- |
| VFE 1616 |Make2 |2023-07-27T00:09:31.0000000Z |
| MDR 6128 |Make4 |2023-07-27T00:13:45.0000000Z |
```

Sample **query**:

```SQL
WITH LastInWindow AS
(
	SELECT 
		MAX(Time) AS LastEventTime
	FROM 
		Input TIMESTAMP BY Time
	GROUP BY 
		TumblingWindow(minute, 10)
)

SELECT 
	Input.License_plate,
	Input.Make,
	Input.Time
FROM
	Input TIMESTAMP BY Time 
	INNER JOIN LastInWindow
	ON DATEDIFF(minute, Input, LastInWindow) BETWEEN 0 AND 10
	AND Input.Time = LastInWindow.LastEventTime
```

The first step on the query finds the maximum time stamp in 10-minute windows, that is, the time stamp of the last event for that window. The second step joins the results of the first query with the original stream to find the event that matches the last time stamps in each window. 

**DATEDIFF** is a date-specific function that compares and returns the time difference between two DateTime fields, for more information, see [date functions](/stream-analytics-query/date-and-time-functions-azure-stream-analytics).

For more information on joining streams, see [**JOIN**](/stream-analytics-query/join-azure-stream-analytics).

## Data aggregation over time

To compute information over a time window, you can aggregate the data. In this example, the statement computes a count over the last 10 seconds of time for every specific make of a car.

Sample **input**:

```
| Make | Time | Weight |
| --- | --- | --- |
| Make1 |2023-01-01T00:00:01.0000000Z |1000 |
| Make1 |2023-01-01T00:00:02.0000000Z |2000 |
| Make2 |2023-01-01T00:00:04.0000000Z |1500 |
```

Sample **output**:

```
| Make | Count |
| --- | --- |
| Make1 | 2 |
| Make2 | 1 |
```

**Query**:

```SQL
SELECT
	Make,
	COUNT(*) AS Count
FROM
	Input TIMESTAMP BY Time
GROUP BY
	Make,
	TumblingWindow(second, 10)
```

This aggregation groups the cars by *Make* and counts them every 10 seconds. The output has the *Make* and *Count* of cars that went through the toll booth.

TumblingWindow is a windowing function used to group events together. An aggregation can be applied over all grouped events. For more information, see [windowing functions](stream-analytics-window-functions.md).

For more information on aggregation, see [aggregate functions](/stream-analytics-query/aggregate-functions-azure-stream-analytics).

## Periodically output values

When events are missing or irregular, a regular interval output can be generated from a more sparse data input. For example, generate an event every 5 seconds that reports the most recently seen data point.

Sample **input**:

```
| Time | Value |
| --- | --- |
| "2014-01-01T06:01:00" |1 |
| "2014-01-01T06:01:05" |2 |
| "2014-01-01T06:01:10" |3 |
| "2014-01-01T06:01:15" |4 |
| "2014-01-01T06:01:30" |5 |
| "2014-01-01T06:01:35" |6 |
```
Sample **output (first 10 rows)**:

```
| Window_end | Last_event.Time | Last_event.Value |
| --- | --- | --- |
| 2014-01-01T14:01:00.000Z |2014-01-01T14:01:00.000Z |1 |
| 2014-01-01T14:01:05.000Z |2014-01-01T14:01:05.000Z |2 |
| 2014-01-01T14:01:10.000Z |2014-01-01T14:01:10.000Z |3 |
| 2014-01-01T14:01:15.000Z |2014-01-01T14:01:15.000Z |4 |
| 2014-01-01T14:01:20.000Z |2014-01-01T14:01:15.000Z |4 |
| 2014-01-01T14:01:25.000Z |2014-01-01T14:01:15.000Z |4 |
| 2014-01-01T14:01:30.000Z |2014-01-01T14:01:30.000Z |5 |
| 2014-01-01T14:01:35.000Z |2014-01-01T14:01:35.000Z |6 |
| 2014-01-01T14:01:40.000Z |2014-01-01T14:01:35.000Z |6 |
| 2014-01-01T14:01:45.000Z |2014-01-01T14:01:35.000Z |6 |
```

Sample **query**:

```SQL
SELECT
	System.Timestamp() AS Window_end,
	TopOne() OVER (ORDER BY Time DESC) AS Last_event
FROM
	Input TIMESTAMP BY Time
GROUP BY
	HOPPINGWINDOW(second, 300, 5)
```

This query generates events every 5 seconds and outputs the last event that was received previously. The **HOPPINGWINDOW** duration determines how far back the query looks to find the latest event.

For more information, see [Hopping window](/stream-analytics-query/hopping-window-azure-stream-analytics).

## Correlate events in a stream

Correlating events in the same stream can be done by looking at past events using the **LAG** function. For example, an output can be generated every time two consecutive cars from the same *Make* go through the toll booth in the last 90 seconds.

Sample **input**:

```
| Make | License_plate | Time |
| --- | --- | --- |
| Make1 |ABC-123 |2023-01-01T00:00:01.0000000Z |
| Make1 |AAA-999 |2023-01-01T00:00:02.0000000Z |
| Make2 |DEF-987 |2023-01-01T00:00:03.0000000Z |
| Make1 |GHI-345 |2023-01-01T00:00:04.0000000Z |
```

Sample **output**:

```
| Make | Time | Current_car_license_plate | First_car_license_plate | First_car_time |
| --- | --- | --- | --- | --- |
| Make1 |2023-01-01T00:00:02.0000000Z |AAA-999 |ABC-123 |2023-01-01T00:00:01.0000000Z |
```

Sample **query**:

```SQL
SELECT
	Make,
	Time,
	License_plate AS Current_car_license_plate,
	LAG(License_plate, 1) OVER (LIMIT DURATION(second, 90)) AS First_car_license_plate,
	LAG(Time, 1) OVER (LIMIT DURATION(second, 90)) AS First_car_time
FROM
	Input TIMESTAMP BY Time
WHERE
	LAG(Make, 1) OVER (LIMIT DURATION(second, 90)) = Make
```

The **LAG** function can look into the input stream one event back and retrieve the *Make* value, comparing that with the *Make* value of the current event.  Once the condition is met, data from the previous event can be projected using **LAG** in the **SELECT** statement.

For more information, see [LAG](/stream-analytics-query/lag-azure-stream-analytics).

## Detect the duration between events

The duration of an event can be computed by looking at the last Start event once an End event is received. This query can be useful to determine the time a user spends on a page or a feature.

Sample **input**:  

```
| User | Feature | Event | Time |
| --- | --- | --- | --- |
| user@location.com |RightMenu |Start |2023-01-01T00:00:01.0000000Z |
| user@location.com |RightMenu |End |2023-01-01T00:00:08.0000000Z |
```

Sample **output**:  

```
| User | Feature | Duration |
| --- | --- | --- |
| user@location.com |RightMenu |7 |
```

Sample **query**:

```SQL
SELECT
	[user],
	feature,
	DATEDIFF(
		second,
		LAST(Time) OVER (PARTITION BY [user], feature LIMIT DURATION(hour, 1) WHEN Event = 'start'),
		Time) as duration
FROM input TIMESTAMP BY Time
WHERE
	Event = 'end'
```

The **LAST** function can be used to retrieve the last event within a specific condition. In this example, the condition is an event of type Start, partitioning the search by **PARTITION BY** user and feature. This way, every user, and feature are treated independently when searching for the Start event. **LIMIT DURATION** limits the search back in time to 1 hour between the End and Start events.

## Count unique values

**COUNT** and **DISTINCT** can be used to count the number of unique field values that appear in the stream within a time window. You can create a query to calculate how many unique *Makes* of cars have passed through the toll booth in a 2-second window.

Sample **input**:

```
| Make | Time |
| --- | --- |
| Make1 |2023-01-01T00:00:01.0000000Z |
| Make1 |2023-01-01T00:00:02.0000000Z |
| Make2 |2023-01-01T00:00:01.0000000Z |
| Make2 |2023-01-01T00:00:02.0000000Z |
| Make2 |2023-01-01T00:00:03.0000000Z |
```

Sample **output:**

```
| Count_make | Time |
| --- | --- |
| 2 |2023-01-01T00:00:02.000Z |
| 1 |2023-01-01T00:00:04.000Z |
```

Sample **query:**

```SQL
SELECT
     COUNT(DISTINCT Make) AS Count_make,
     System.TIMESTAMP() AS Time
FROM Input TIMESTAMP BY TIME
GROUP BY 
     TumblingWindow(second, 2)
```

**COUNT(DISTINCT Make)** returns the count of distinct values in the **Make** column within a time window. For more information, see [**COUNT** aggregate function](/stream-analytics-query/count-azure-stream-analytics).

## Retrieve the first event in a window

You can use `IsFirst` to retrieve the first event in a time window. For example, outputting the first car information at every 10-minute interval.

Sample **input**:

```
| License_plate | Make | Time |
| --- | --- | --- |
| DXE 5291 |Make1 |2023-07-27T00:00:05.0000000Z |
| YZK 5704 |Make3 |2023-07-27T00:02:17.0000000Z |
| RMV 8282 |Make1 |2023-07-27T00:05:01.0000000Z |
| YHN 6970 |Make2 |2023-07-27T00:06:00.0000000Z |
| VFE 1616 |Make2 |2023-07-27T00:09:31.0000000Z |
| QYF 9358 |Make1 |2023-07-27T00:12:02.0000000Z |
| MDR 6128 |Make4 |2023-07-27T00:13:45.0000000Z |
```

Sample **output**:

```
| License_plate | Make | Time |
| --- | --- | --- |
| DXE 5291 |Make1 |2023-07-27T00:00:05.0000000Z |
| QYF 9358 |Make1 |2023-07-27T00:12:02.0000000Z |
```

Sample **query**:

```SQL
SELECT 
	License_plate,
	Make,
	Time
FROM 
	Input TIMESTAMP BY Time
WHERE 
	IsFirst(minute, 10) = 1
```

**IsFirst** can also partition the data and calculate the first event to each specific car *Make* found at every 10-minute interval.

Sample **output**:

```
| License_plate | Make | Time |
| --- | --- | --- |
| DXE 5291 |Make1 |2023-07-27T00:00:05.0000000Z |
| YZK 5704 |Make3 |2023-07-27T00:02:17.0000000Z |
| YHN 6970 |Make2 |2023-07-27T00:06:00.0000000Z |
| QYF 9358 |Make1 |2023-07-27T00:12:02.0000000Z |
| MDR 6128 |Make4 |2023-07-27T00:13:45.0000000Z |
```

Sample **query**:

```SQL
SELECT 
	License_plate,
	Make,
	Time
FROM 
	Input TIMESTAMP BY Time
WHERE 
	IsFirst(minute, 10) OVER (PARTITION BY Make) = 1
```

For more information, see [**IsFirst**](/stream-analytics-query/isfirst-azure-stream-analytics).

## Remove duplicate events in a window

When you perform an operation such as calculating averages over events in a given time window, duplicate events should be filtered. In the following example, the second event is a duplicate of the first.

Sample **input**:  

```
| DeviceId | Time | Attribute | Value |
| --- | --- | --- | --- |
| 1 |2018-07-27T00:00:01.0000000Z |Temperature |50 |
| 1 |2018-07-27T00:00:01.0000000Z |Temperature |50 |
| 2 |2018-07-27T00:00:01.0000000Z |Temperature |40 |
| 1 |2018-07-27T00:00:05.0000000Z |Temperature |60 |
| 2 |2018-07-27T00:00:05.0000000Z |Temperature |50 |
| 1 |2018-07-27T00:00:10.0000000Z |Temperature |100 |
```

Sample **output**:  

```
| AverageValue | DeviceId |
| --- | --- |
| 70 | 1 |
|45 | 2 |
```

Sample **query**:

```SQL
WITH Temp AS (
	SELECT Value, DeviceId
	FROM Input TIMESTAMP BY Time
	GROUP BY Value, DeviceId, System.Timestamp()
)
 

SELECT
	AVG(Value) AS AverageValue, DeviceId
INTO Output
FROM Temp
GROUP BY DeviceId,TumblingWindow(minute, 5)
```

When the first statement executes, the duplicate records are combined into one as the fields in the group by clause are all the same. Therefore, it removes the duplicates. 

## Specify logic for different cases/values (CASE statements)

**CASE** statements can provide different computations for different fields, based on particular criterion. For example, assign lane `A` to cars of `Make1` and lane `B` to any other make.

Sample **input**:

```
| Make | Time |
| --- | --- |
| Make1 |2023-01-01T00:00:01.0000000Z |
| Make2 |2023-01-01T00:00:02.0000000Z |
| Make2 |2023-01-01T00:00:03.0000000Z |
```

Sample **output**:

```
| Make |Dispatch_to_lane | Time |
| --- | --- | --- |
| Make1 |"A" |2023-01-01T00:00:01.0000000Z |
| Make2 |"B" |2023-01-01T00:00:02.0000000Z |
```

Sample **query**:

```SQL
SELECT
	Make
	CASE
		WHEN Make = "Make1" THEN "A"
		ELSE "B"
	END AS Dispatch_to_lane,
	System.TimeStamp() AS Time
FROM
	Input TIMESTAMP BY Time
```

The **CASE** expression compares an expression to a set of simple expressions to determine its result. In this example, vehicles of `Make1` are dispatched to lane `A` while vehicles of any other make will be assigned lane `B`.

For more information, see [case expression](/stream-analytics-query/case-azure-stream-analytics).

## Data conversion

Data can be cast in real time using the **CAST** method. For example, car weight can be converted from type **nvarchar(max)** to type **bigint** and be used in a numeric calculation.

Sample **input**:

```
| Make | Time | Weight |
| --- | --- | --- |
| Make1 |2023-01-01T00:00:01.0000000Z |"1000" |
| Make1 |2023-01-01T00:00:02.0000000Z |"2000" |
```

Sample **output**:

```
| Make | Weight |
| --- | --- |
| Make1 |3000 |
```

Sample **query**:

```SQL
SELECT
	Make,
	SUM(CAST(Weight AS BIGINT)) AS Weight
FROM
	Input TIMESTAMP BY Time
GROUP BY
	Make,
	TumblingWindow(second, 10)
```

Use a **CAST** statement to specify its data type. See the list of supported data types on [Data types (Azure Stream Analytics)](/stream-analytics-query/data-types-azure-stream-analytics).

For more information on [data conversion functions](/stream-analytics-query/conversion-functions-azure-stream-analytics).

## Detect the duration of a condition

For conditions that span through multiple events the **LAG** function can be used to identify the duration of that condition. For example, suppose that a bug resulted in all cars having an incorrect weight (above 20,000 pounds), and the duration of that bug must be computed.

Sample **input**:

```
| Make | Time | Weight |
| --- | --- | --- |
| Make1 |2023-01-01T00:00:01.0000000Z |2000 |
| Make2 |2023-01-01T00:00:02.0000000Z |25000 |
| Make1 |2023-01-01T00:00:03.0000000Z |26000 |
| Make2 |2023-01-01T00:00:04.0000000Z |25000 |
| Make1 |2023-01-01T00:00:05.0000000Z |26000 |
| Make2 |2023-01-01T00:00:06.0000000Z |25000 |
| Make1 |2023-01-01T00:00:07.0000000Z |26000 |
| Make2 |2023-01-01T00:00:08.0000000Z |2000 |
```

Sample **output**:

```
| Start_fault | End_fault |
| --- | --- |
| 2023-01-01T00:00:02.000Z |2023-01-01T00:00:07.000Z |
```

Sample **query**:

```SQL
WITH SelectPreviousEvent AS
(
SELECT
	*,
	LAG([time]) OVER (LIMIT DURATION(hour, 24)) as previous_time,
	LAG([weight]) OVER (LIMIT DURATION(hour, 24)) as previous_weight
FROM input TIMESTAMP BY [time]
)

SELECT 
	LAG(time) OVER (LIMIT DURATION(hour, 24) WHEN previous_weight < 20000 ) [Start_fault],
	previous_time [End_fault]
FROM SelectPreviousEvent
WHERE
	[weight] < 20000
	AND previous_weight > 20000
```
The first **SELECT** statement correlates the current weight measurement with the previous measurement, projecting it together with the current measurement. The second **SELECT** looks back to the last event where the *previous_weight* is less than 20000, where the current weight is smaller than 20000 and the *previous_weight* of the current event was bigger than 20000.

The End_fault is the current nonfaulty event where the previous event was faulty, and the Start_fault is the last nonfaulty event before that.

## Process events with independent time (Substreams)

Events can arrive late or out of order due to clock skews between event producers, clock skews between partitions, or network latency.
For example, the device clock for *TollID* 2 is five seconds behind *TollID* 1, and the device clock for *TollID* 3 is 10 seconds behind *TollID* 1. A computation can happen independently for each toll, considering only its own clock data as a timestamp.

Sample **input**:

```
| LicensePlate | Make | Time | TollID |
| --- | --- | --- | --- |
| DXE 5291 |Make1 |2023-07-27T00:00:01.0000000Z | 1 |
| YHN 6970 |Make2 |2023-07-27T00:00:05.0000000Z | 1 |
| QYF 9358 |Make1 |2023-07-27T00:00:01.0000000Z | 2 |
| GXF 9462 |Make3 |2023-07-27T00:00:04.0000000Z | 2 |
| VFE 1616 |Make2 |2023-07-27T00:00:10.0000000Z | 1 |
| RMV 8282 |Make1 |2023-07-27T00:00:03.0000000Z | 3 |
| MDR 6128 |Make3 |2023-07-27T00:00:11.0000000Z | 2 |
| YZK 5704 |Make4 |2023-07-27T00:00:07.0000000Z | 3 |
```

Sample **output**:

```
| TollID | Count |
| --- | --- |
| 1 | 2 |
| 2 | 2 |
| 1 | 1 |
| 3 | 1 |
| 2 | 1 |
| 3 | 1 |
```

Sample **query**:

```SQL
SELECT
      TollId,
      COUNT(*) AS Count
FROM input
      TIMESTAMP BY Time OVER TollId
GROUP BY TUMBLINGWINDOW(second, 5), TollId
```

The **TIMESTAMP OVER BY** clause looks at each device timeline independently using substreams. The output event for each *TollID* is generated as they’re computed, meaning that the events are in order with respect to each *TollID* instead of being reordered as if all devices were on the same clock.

For more information, see [TIMESTAMP BY OVER](/stream-analytics-query/timestamp-by-azure-stream-analytics#over-clause-interacts-with-event-ordering).

## Session Windows

A session window is a window that keeps expanding as events occur and closes for computation if no event is received after a specific amount of time or if the window reaches its maximum duration. This window is particularly useful when computing user interaction data. A window starts when a user starts interacting with the system and closes when no more events are observed, meaning, the user has stopped interacting. For example, a user is interacting with a web page where the number of clicks is logged, a Session Window can be used to find out how long the user interacted with the site.

Sample **input**:

```
| User_id | Time | URL |
| --- | --- | --- |
| 0 | 2017-01-26T00:00:00.0000000Z | "www.example.com/a.html" |
| 0 | 2017-01-26T00:00:20.0000000Z | "www.example.com/b.html" |
| 1 | 2017-01-26T00:00:55.0000000Z | "www.example.com/c.html" |
| 0 | 2017-01-26T00:01:10.0000000Z | "www.example.com/d.html" |
| 1 | 2017-01-26T00:01:15.0000000Z | "www.example.com/e.html" |
```

Sample **output**:

```
| User_id | StartTime | EndTime | Duration_in_seconds |
| --- | --- | --- | --- |
| 0 | 2017-01-26T00:00:00.0000000Z | 2017-01-26T00:01:10.0000000Z | 70 |
| 1 | 2017-01-26T00:00:55.0000000Z | 2017-01-26T00:01:15.0000000Z | 20 |
```

Sample **query**:

``` SQL
SELECT
	user_id,
	MIN(time) as StartTime,
	MAX(time) as EndTime,
	DATEDIFF(second, MIN(time), MAX(time)) AS duration_in_seconds
FROM input TIMESTAMP BY time
GROUP BY
	user_id,
	SessionWindow(minute, 1, 60) OVER (PARTITION BY user_id)
```

The **SELECT** projects the data relevant to the user interaction, together with the duration of the interaction. Grouping the data by user and a **SessionWindow** that closes if no interaction happens within 1 minute, with a maximum window size of 60 minutes.

For more information on SessionWindow, see [Session Window](/stream-analytics-query/session-window-azure-stream-analytics) .

## User defined functions in JavaScript and C#

Azure Stream Analytics query language can be extended with custom functions written either in JavaScript or C# language. User Defined Functions (UDF) are custom/complex computations that can’t be easily expressed using the **SQL** language. These UDFs can be defined once and used multiple times within a query. For example, an UDF can be used to convert a hexadecimal *nvarchar(max)* value to a *bigint* value.

Sample **input**:

```
| Device_id | HexValue |
| --- | --- |
| 1 | "B4" |
| 2 | "11B" |
| 3 | "121" |
```

Sample **output**:

```
| Device_id | Decimal |
| --- | --- |
| 1 | 180 |
| 2 | 283 |
| 3 | 289 |
```

```JavaScript
function hex2Int(hexValue){
	return parseInt(hexValue, 16);
}
```

```C#
public static class MyUdfClass {
	public static long Hex2Int(string hexValue){
		return int.Parse(hexValue, System.Globalization.NumberStyles.HexNumber);
	}
}
```

```SQL
SELECT
	Device_id,
	udf.Hex2Int(HexValue) AS Decimal
From
	Input
```

The User-Defined Function computes the *bigint* value from the HexValue on every event consumed.

For more information, see [JavaScript](./stream-analytics-javascript-user-defined-functions.md) and [C#](./stream-analytics-edge-csharp-udf.md).

## Advanced pattern matching with MATCH_RECOGNIZE

**MATCH_RECOGNIZE** is an advanced pattern matching mechanism that can be used to match a sequence of events to a well-defined regular expression pattern.
For example, an ATM is being monitored at real time for failures, during the operation of the ATM if there are two consecutive warning messages the administrator needs to be notified.

**Input**:

```
| ATM_id | Operation_id | Return_Code | Time |
| --- | --- | --- | --- |
| 1 | "Entering Pin" | "Success" | 2017-01-26T00:10:00.0000000Z |
| 2 | "Opening Money Slot" | "Success" | 2017-01-26T00:10:07.0000000Z |
| 2 | "Closing Money Slot" | "Success" | 2017-01-26T00:10:11.0000000Z |
| 1 | "Entering Withdraw Quantity" | "Success" | 2017-01-26T00:10:08.0000000Z |
| 1 | "Opening Money Slot" | "Warning" | 2017-01-26T00:10:14.0000000Z |
| 1 | "Printing Bank Balance" | "Warning" | 2017-01-26T00:10:19.0000000Z |
```

**Output**:

```
| ATM_id | First_Warning_Operation_id | Warning_Time |
| --- | --- | --- |
| 1 | "Opening Money Slot" | 2017-01-26T00:10:14.0000000Z |
```

```SQL
SELECT *
FROM input TIMESTAMP BY time OVER ATM_id
MATCH_RECOGNIZE (
	LIMIT DURATION(minute, 1)
	PARTITION BY ATM_id
	MEASURES
		First(Warning.ATM_id) AS ATM_id,
		First(Warning.Operation_Id) AS First_Warning_Operation_id,
		First(Warning.Time) AS Warning_Time
	AFTER MATCH SKIP TO NEXT ROW
	PATTERN (Success+ Warning{2,})
	DEFINE
		Success AS Success.Return_Code = 'Success',
		Warning AS Warning.Return_Code <> 'Success'
) AS patternMatch
```

This query matches at least two consecutive failure events and generates an alarm when the conditions are met.
**PATTERN** defines the regular expression to be used on the matching, in this case, at least two consecutive warnings after at least one successful operation.
Success and Warning are defined using Return_Code value and once the condition is met, the **MEASURES** are projected with *ATM_id*, the first warning operation and first warning time.

For more information, see [MATCH_RECOGNIZE](/stream-analytics-query/match-recognize-stream-analytics).

## Geofencing and geospatial queries

Azure Stream Analytics provides built-in geospatial functions that can be used to implement scenarios such as fleet management, ride sharing, connected cars, and asset tracking.
Geospatial data can be ingested in either GeoJSON or WKT formats as part of event stream or reference data.
For example, a company that is specialized in manufacturing machines for printing passports, leases their machines to governments and consulates. The location of those machines is heavily controlled as to avoid the misplacing and possible use for counterfeiting of passports. Each machine is fitted with a GPS tracker, that information is relayed back to an Azure Stream Analytics job.
The manufacture would like to keep track of the location of those machines and be alerted if one of them leaves an authorized area, this way they can remotely disable, alert authorities and retrieve the equipment.

**Input**:

```
| Equipment_id | Equipment_current_location | Time |
| --- | --- | --- |
| 1 | "POINT(-122.13288797982818 47.64082002051315)" | 2017-01-26T00:10:00.0000000Z |
| 1 | "POINT(-122.13307252987875 47.64081350934929)" | 2017-01-26T00:11:00.0000000Z |
| 1 | "POINT(-122.13308862313283 47.6406508603241)" | 2017-01-26T00:12:00.0000000Z |
| 1 | "POINT(-122.13341048821462 47.64043760861279)" | 2017-01-26T00:13:00.0000000Z |
```

**Reference Data Input**:

```
| Equipment_id | Equipment_lease_location |
| --- | --- |
| 1 | "POLYGON((-122.13326028450979 47.6409833866794,-122.13261655434621 47.6409833866794,-122.13261655434621 47.64061471602751,-122.13326028450979 47.64061471602751,-122.13326028450979 47.6409833866794))" |
```

**Output**:

```
| Equipment_id | Equipment_alert_location | Time |
| --- | --- | --- |
| 1 | "POINT(-122.13341048821462 47.64043760861279)" | 2017-01-26T00:13:00.0000000Z |
```

```SQL
SELECT
	input.Equipment_id AS Equipment_id,
	input.Equipment_current_location AS Equipment_current_location,
	input.Time AS Time
FROM input TIMESTAMP BY time
JOIN
	referenceInput 
	ON input.Equipment_id = referenceInput.Equipment_id
	WHERE 
		ST_WITHIN(input.Equipment_current_location, referenceInput.Equipment_lease_location) = 1
```

The query enables the manufacturer to monitor the machines location automatically, getting alerts when a machine leaves the allowed geofence. The built-in geospatial function allows users to use GPS data within the query without third-party libraries.

For more information, see the [Geofencing and geospatial aggregation scenarios with Azure Stream Analytics](geospatial-scenarios.md) article.

## Get help

For further assistance, try our [Microsoft Q&A question page for Azure Stream Analytics](/answers/tags/179/azure-stream-analytics).

## Next steps
* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-real-time-fraud-detection.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics Query Language Reference](/stream-analytics-query/stream-analytics-query-language-reference)
* [Azure Stream Analytics Management REST API Reference](/rest/api/streamanalytics/)
