---
title: Common query patterns in Azure Stream Analytics
description: This article describes a number of common query patterns and designs that are useful in Azure Stream Analytics jobs.
services: stream-analytics
author: jseb225
ms.author: jeanb
ms.reviewer: jasonh
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 05/16/2019
---
# Query examples for common Stream Analytics usage patterns

Queries in Azure Stream Analytics are expressed in a SQL-like query language. The language constructs are documented in the [Stream Analytics query language reference](/stream-analytics-query/stream-analytics-query-language-reference) guide. 

The query design can express simple pass-through logic to move event data from one input stream into an output data store, or it can do rich pattern matching and temporal analysis to calculate aggregates over various time windows as in the [Build an IoT solution by using Stream Analytics](stream-analytics-build-an-iot-solution-using-stream-analytics.md) guide. You can join data from multiple inputs to combine streaming events, and you can do lookups against static reference data to enrich the event values. You can also write data to multiple outputs.

This article outlines solutions to several common query patterns based on real-world scenarios.

## Work with complex Data Types in JSON and AVRO

Azure Stream Analytics supports processing events in CSV, JSON and Avro data formats.

Both JSON and Avro may contain complex types such as nested objects (records) or arrays. For more information on working with these complex data types, refer to the [Parsing JSON and AVRO data](stream-analytics-parsing-json.md) article.

## Query example: Convert data types

**Description**: Define the types of properties on the input stream. For example, the car weight is coming on the input stream as strings and needs to be converted to **INT** to perform **SUM**.

**Input**:

| Make | Time | Weight |
| --- | --- | --- |
| Honda |2015-01-01T00:00:01.0000000Z |"1000" |
| Honda |2015-01-01T00:00:02.0000000Z |"2000" |

**Output**:

| Make | Weight |
| --- | --- |
| Honda |3000 |

**Solution**:

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

**Explanation**:
Use a **CAST** statement in the **Weight** field to specify its data type. See the list of supported data types in [Data types (Azure Stream Analytics)](/stream-analytics-query/data-types-azure-stream-analytics).

## Query example: Use LIKE/NOT LIKE to do pattern matching

**Description**: Check that a field value on the event matches a certain pattern.
For example, check that the result returns license plates that start with A and end with 9.

**Input**:

| Make | LicensePlate | Time |
| --- | --- | --- |
| Honda |ABC-123 |2015-01-01T00:00:01.0000000Z |
| Toyota |AAA-999 |2015-01-01T00:00:02.0000000Z |
| Nissan |ABC-369 |2015-01-01T00:00:03.0000000Z |

**Output**:

| Make | LicensePlate | Time |
| --- | --- | --- |
| Toyota |AAA-999 |2015-01-01T00:00:02.0000000Z |
| Nissan |ABC-369 |2015-01-01T00:00:03.0000000Z |

**Solution**:

```SQL
    SELECT
        *
    FROM
        Input TIMESTAMP BY Time
    WHERE
        LicensePlate LIKE 'A%9'
```

**Explanation**:
Use the **LIKE** statement to check the **LicensePlate** field value. It should start with the letter A, then have any string of zero or more characters, and then end with the number 9. 

## Query example: Specify logic for different cases/values (CASE statements)

**Description**: Provide a different computation for a field, based on a particular criterion. For example, provide a string description for how many cars of the same make passed, with a special case for 1.

**Input**:

| Make | Time |
| --- | --- |
| Honda |2015-01-01T00:00:01.0000000Z |
| Toyota |2015-01-01T00:00:02.0000000Z |
| Toyota |2015-01-01T00:00:03.0000000Z |

**Output**:

| CarsPassed | Time |
| --- | --- |
| 1 Honda |2015-01-01T00:00:10.0000000Z |
| 2 Toyotas |2015-01-01T00:00:10.0000000Z |

**Solution**:

```SQL
    SELECT
        CASE
            WHEN COUNT(*) = 1 THEN CONCAT('1 ', Make)
            ELSE CONCAT(CAST(COUNT(*) AS NVARCHAR(MAX)), ' ', Make, 's')
        END AS CarsPassed,
        System.TimeStamp() AS Time
    FROM
        Input TIMESTAMP BY Time
    GROUP BY
        Make,
        TumblingWindow(second, 10)
```

**Explanation**:
The **CASE** expression compares an expression to a set of simple expressions to determine the result. In this example, vehicle makes with a count of 1 returned a different string description than vehicle makes with a count other than 1.

## Query example: Send data to multiple outputs

**Description**: Send data to multiple output targets from a single job. For example, analyze data for a threshold-based alert and archive all events to blob storage.

**Input**:

| Make | Time |
| --- | --- |
| Honda |2015-01-01T00:00:01.0000000Z |
| Honda |2015-01-01T00:00:02.0000000Z |
| Toyota |2015-01-01T00:00:01.0000000Z |
| Toyota |2015-01-01T00:00:02.0000000Z |
| Toyota |2015-01-01T00:00:03.0000000Z |

**Output1**:

| Make | Time |
| --- | --- |
| Honda |2015-01-01T00:00:01.0000000Z |
| Honda |2015-01-01T00:00:02.0000000Z |
| Toyota |2015-01-01T00:00:01.0000000Z |
| Toyota |2015-01-01T00:00:02.0000000Z |
| Toyota |2015-01-01T00:00:03.0000000Z |

**Output2**:

| Make | Time | Count |
| --- | --- | --- |
| Toyota |2015-01-01T00:00:10.0000000Z |3 |

**Solution**:

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

**Explanation**:
The **INTO** clause tells Stream Analytics which of the outputs to write the data to from this statement. The first query is a pass-through of the data received to an output named **ArchiveOutput**. The second query does some simple aggregation and filtering, and it sends the results to a downstream alerting system, **AlertOutput**.

Note that you can also reuse the results of the common table expressions (CTEs) (such as **WITH** statements) in multiple output statements. This option has the added benefit of opening fewer readers to the input source.

For example: 

```SQL
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
```

## Query example: Count unique values

**Description**: Count the number of unique field values that appear in the stream within a time window. For example, how many unique makes of cars passed through the toll booth in a 2-second window?

**Input**:

| Make | Time |
| --- | --- |
| Honda |2015-01-01T00:00:01.0000000Z |
| Honda |2015-01-01T00:00:02.0000000Z |
| Toyota |2015-01-01T00:00:01.0000000Z |
| Toyota |2015-01-01T00:00:02.0000000Z |
| Toyota |2015-01-01T00:00:03.0000000Z |

**Output:**

| CountMake | Time |
| --- | --- |
| 2 |2015-01-01T00:00:02.000Z |
| 1 |2015-01-01T00:00:04.000Z |

**Solution:**

```SQL
SELECT
     COUNT(DISTINCT Make) AS CountMake,
     System.TIMESTAMP() AS TIME
FROM Input TIMESTAMP BY TIME
GROUP BY 
     TumblingWindow(second, 2)
```


**Explanation:**
**COUNT(DISTINCT Make)** returns the number of distinct values in the **Make** column within a time window.

## Query example: Determine if a value has changed

**Description**: Look at a previous value to determine if it is different than the current value. For example, is the previous car on the toll road the same make as the current car?

**Input**:

| Make | Time |
| --- | --- |
| Honda |2015-01-01T00:00:01.0000000Z |
| Toyota |2015-01-01T00:00:02.0000000Z |

**Output**:

| Make | Time |
| --- | --- |
| Toyota |2015-01-01T00:00:02.0000000Z |

**Solution**:

```SQL
    SELECT
        Make,
        Time
    FROM
        Input TIMESTAMP BY Time
    WHERE
        LAG(Make, 1) OVER (LIMIT DURATION(minute, 1)) <> Make
```

**Explanation**:
Use **LAG** to peek into the input stream one event back and get the **Make** value. Then compare it to the **Make** value on the current event and output the event if they are different.

## Query example: Find the first event in a window

**Description**: Find the first car in every 10-minute interval.

**Input**:

| LicensePlate | Make | Time |
| --- | --- | --- |
| DXE 5291 |Honda |2015-07-27T00:00:05.0000000Z |
| YZK 5704 |Ford |2015-07-27T00:02:17.0000000Z |
| RMV 8282 |Honda |2015-07-27T00:05:01.0000000Z |
| YHN 6970 |Toyota |2015-07-27T00:06:00.0000000Z |
| VFE 1616 |Toyota |2015-07-27T00:09:31.0000000Z |
| QYF 9358 |Honda |2015-07-27T00:12:02.0000000Z |
| MDR 6128 |BMW |2015-07-27T00:13:45.0000000Z |

**Output**:

| LicensePlate | Make | Time |
| --- | --- | --- |
| DXE 5291 |Honda |2015-07-27T00:00:05.0000000Z |
| QYF 9358 |Honda |2015-07-27T00:12:02.0000000Z |

**Solution**:

```SQL
    SELECT 
        LicensePlate,
        Make,
        Time
    FROM 
        Input TIMESTAMP BY Time
    WHERE 
        IsFirst(minute, 10) = 1
```

Now let's change the problem and find the first car of a particular make in every 10-minute interval.

| LicensePlate | Make | Time |
| --- | --- | --- |
| DXE 5291 |Honda |2015-07-27T00:00:05.0000000Z |
| YZK 5704 |Ford |2015-07-27T00:02:17.0000000Z |
| YHN 6970 |Toyota |2015-07-27T00:06:00.0000000Z |
| QYF 9358 |Honda |2015-07-27T00:12:02.0000000Z |
| MDR 6128 |BMW |2015-07-27T00:13:45.0000000Z |

**Solution**:

```SQL
    SELECT 
        LicensePlate,
        Make,
        Time
    FROM 
        Input TIMESTAMP BY Time
    WHERE 
        IsFirst(minute, 10) OVER (PARTITION BY Make) = 1
```

## Query example: Find the last event in a window

**Description**: Find the last car in every 10-minute interval.

**Input**:

| LicensePlate | Make | Time |
| --- | --- | --- |
| DXE 5291 |Honda |2015-07-27T00:00:05.0000000Z |
| YZK 5704 |Ford |2015-07-27T00:02:17.0000000Z |
| RMV 8282 |Honda |2015-07-27T00:05:01.0000000Z |
| YHN 6970 |Toyota |2015-07-27T00:06:00.0000000Z |
| VFE 1616 |Toyota |2015-07-27T00:09:31.0000000Z |
| QYF 9358 |Honda |2015-07-27T00:12:02.0000000Z |
| MDR 6128 |BMW |2015-07-27T00:13:45.0000000Z |

**Output**:

| LicensePlate | Make | Time |
| --- | --- | --- |
| VFE 1616 |Toyota |2015-07-27T00:09:31.0000000Z |
| MDR 6128 |BMW |2015-07-27T00:13:45.0000000Z |

**Solution**:

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
        Input.LicensePlate,
        Input.Make,
        Input.Time
    FROM
        Input TIMESTAMP BY Time 
        INNER JOIN LastInWindow
        ON DATEDIFF(minute, Input, LastInWindow) BETWEEN 0 AND 10
        AND Input.Time = LastInWindow.LastEventTime
```

**Explanation**:
There are two steps in the query. The first one finds the latest time stamp in 10-minute windows. The second step joins the results of the first query with the original stream to find the events that match the last time stamps in each window. 

## Query example: Detect the absence of events

**Description**: Check that a stream has no value that matches a certain criterion.
For example, have 2 consecutive cars from the same make entered the toll road within the last 90 seconds?

**Input**:

| Make | LicensePlate | Time |
| --- | --- | --- |
| Honda |ABC-123 |2015-01-01T00:00:01.0000000Z |
| Honda |AAA-999 |2015-01-01T00:00:02.0000000Z |
| Toyota |DEF-987 |2015-01-01T00:00:03.0000000Z |
| Honda |GHI-345 |2015-01-01T00:00:04.0000000Z |

**Output**:

| Make | Time | CurrentCarLicensePlate | FirstCarLicensePlate | FirstCarTime |
| --- | --- | --- | --- | --- |
| Honda |2015-01-01T00:00:02.0000000Z |AAA-999 |ABC-123 |2015-01-01T00:00:01.0000000Z |

**Solution**:

```SQL
    SELECT
        Make,
        Time,
        LicensePlate AS CurrentCarLicensePlate,
        LAG(LicensePlate, 1) OVER (LIMIT DURATION(second, 90)) AS FirstCarLicensePlate,
        LAG(Time, 1) OVER (LIMIT DURATION(second, 90)) AS FirstCarTime
    FROM
        Input TIMESTAMP BY Time
    WHERE
        LAG(Make, 1) OVER (LIMIT DURATION(second, 90)) = Make
```

**Explanation**:
Use **LAG** to peek into the input stream one event back and get the **Make** value. Compare it to the **MAKE** value in the current event, and then output the event if they are the same. You can also use **LAG** to get data about the previous car.

## Query example: Detect the duration between events

**Description**: Find the duration of a given event. For example, given a web clickstream, determine the time spent on a feature.

**Input**:  

| User | Feature | Event | Time |
| --- | --- | --- | --- |
| user@location.com |RightMenu |Start |2015-01-01T00:00:01.0000000Z |
| user@location.com |RightMenu |End |2015-01-01T00:00:08.0000000Z |

**Output**:  

| User | Feature | Duration |
| --- | --- | --- |
| user@location.com |RightMenu |7 |

**Solution**:

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

**Explanation**:
Use the **LAST** function to retrieve the last **TIME** value when the event type was **Start**. The **LAST** function uses **PARTITION BY [user]** to indicate that the result is computed per unique user. The query has a 1-hour maximum threshold for the time difference between **Start** and **Stop** events, but is configurable as needed **(LIMIT DURATION(hour, 1)**.

## Query example: Detect the duration of a condition
**Description**: Find out how long a condition occurred.
For example, suppose that a bug resulted in all cars having an incorrect weight (above 20,000 pounds), and the duration of that bug must be computed.

**Input**:

| Make | Time | Weight |
| --- | --- | --- |
| Honda |2015-01-01T00:00:01.0000000Z |2000 |
| Toyota |2015-01-01T00:00:02.0000000Z |25000 |
| Honda |2015-01-01T00:00:03.0000000Z |26000 |
| Toyota |2015-01-01T00:00:04.0000000Z |25000 |
| Honda |2015-01-01T00:00:05.0000000Z |26000 |
| Toyota |2015-01-01T00:00:06.0000000Z |25000 |
| Honda |2015-01-01T00:00:07.0000000Z |26000 |
| Toyota |2015-01-01T00:00:08.0000000Z |2000 |

**Output**:

| StartFault | EndFault |
| --- | --- |
| 2015-01-01T00:00:02.000Z |2015-01-01T00:00:07.000Z |

**Solution**:

```SQL
    WITH SelectPreviousEvent AS
    (
    SELECT
    *,
        LAG([time]) OVER (LIMIT DURATION(hour, 24)) as previousTime,
        LAG([weight]) OVER (LIMIT DURATION(hour, 24)) as previousWeight
    FROM input TIMESTAMP BY [time]
    )

    SELECT 
        LAG(time) OVER (LIMIT DURATION(hour, 24) WHEN previousWeight < 20000 ) [StartFault],
        previousTime [EndFault]
    FROM SelectPreviousEvent
    WHERE
        [weight] < 20000
        AND previousWeight > 20000
```

**Explanation**:
Use **LAG** to view the input stream for 24 hours and look for instances where **StartFault** and **StopFault** are spanned by the weight < 20000.

## Query example: Fill missing values

**Description**: For the stream of events that have missing values, produce a stream of events with regular intervals. For example, generate an event every 5 seconds that reports the most recently seen data point.

**Input**:

| t | value |
| --- | --- |
| "2014-01-01T06:01:00" |1 |
| "2014-01-01T06:01:05" |2 |
| "2014-01-01T06:01:10" |3 |
| "2014-01-01T06:01:15" |4 |
| "2014-01-01T06:01:30" |5 |
| "2014-01-01T06:01:35" |6 |

**Output (first 10 rows)**:

| windowend | lastevent.t | lastevent.value |
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

**Solution**:

```SQL
    SELECT
        System.Timestamp() AS windowEnd,
        TopOne() OVER (ORDER BY t DESC) AS lastEvent
    FROM
        input TIMESTAMP BY t
    GROUP BY HOPPINGWINDOW(second, 300, 5)
```

**Explanation**:
This query generates events every 5 seconds and outputs the last event that was received previously. The [Hopping window](/stream-analytics-query/hopping-window-azure-stream-analytics) duration determines how far back the query looks to find the latest event (300 seconds in this example).


## Query example: Correlate two event types within the same stream

**Description**: Sometimes alerts need to be generated based on multiple event types that occurred in a certain time range. For example, in an IoT scenario for home ovens, an alert must be generated when the fan temperature is less than 40 and the maximum power during the last 3 minutes is less than 10.

**Input**:

| time | deviceId | sensorName | value |
| --- | --- | --- | --- |
| "2018-01-01T16:01:00" | "Oven1" | "temp" |120 |
| "2018-01-01T16:01:00" | "Oven1" | "power" |15 |
| "2018-01-01T16:02:00" | "Oven1" | "temp" |100 |
| "2018-01-01T16:02:00" | "Oven1" | "power" |15 |
| "2018-01-01T16:03:00" | "Oven1" | "temp" |70 |
| "2018-01-01T16:03:00" | "Oven1" | "power" |15 |
| "2018-01-01T16:04:00" | "Oven1" | "temp" |50 |
| "2018-01-01T16:04:00" | "Oven1" | "power" |15 |
| "2018-01-01T16:05:00" | "Oven1" | "temp" |30 |
| "2018-01-01T16:05:00" | "Oven1" | "power" |8 |
| "2018-01-01T16:06:00" | "Oven1" | "temp" |20 |
| "2018-01-01T16:06:00" | "Oven1" | "power" |8 |
| "2018-01-01T16:07:00" | "Oven1" | "temp" |20 |
| "2018-01-01T16:07:00" | "Oven1" | "power" |8 |
| "2018-01-01T16:08:00" | "Oven1" | "temp" |20 |
| "2018-01-01T16:08:00" | "Oven1" | "power" |8 |

**Output**:

| eventTime | deviceId | temp | alertMessage | maxPowerDuringLast3mins |
| --- | --- | --- | --- | --- | 
| "2018-01-01T16:05:00" | "Oven1" |30 | "Short circuit heating elements" |15 |
| "2018-01-01T16:06:00" | "Oven1" |20 | "Short circuit heating elements" |15 |
| "2018-01-01T16:07:00" | "Oven1" |20 | "Short circuit heating elements" |15 |

**Solution**:

```SQL
WITH max_power_during_last_3_mins AS (
    SELECT 
        System.TimeStamp() AS windowTime,
        deviceId,
        max(value) as maxPower
    FROM
        input TIMESTAMP BY t
    WHERE 
        sensorName = 'power' 
    GROUP BY 
        deviceId, 
        SlidingWindow(minute, 3) 
)

SELECT 
    t1.t AS eventTime,
    t1.deviceId, 
    t1.value AS temp,
    'Short circuit heating elements' as alertMessage,
	t2.maxPower AS maxPowerDuringLast3mins
    
INTO resultsr

FROM input t1 TIMESTAMP BY t
JOIN max_power_during_last_3_mins t2
    ON t1.deviceId = t2.deviceId 
    AND t1.t = t2.windowTime
    AND DATEDIFF(minute,t1,t2) between 0 and 3
    
WHERE
    t1.sensorName = 'temp'
    AND t1.value <= 40
    AND t2.maxPower > 10
```

**Explanation**:
The first query `max_power_during_last_3_mins`, uses the [Sliding window](/stream-analytics-query/sliding-window-azure-stream-analytics) to find the max value of the power sensor for every device, during the last 3 minutes. 
The second query is joined to the first query to find the power value in the most recent window relevant for the current event. 
And then, provided the conditions are met, an alert is generated for the device.

## Query example: Process events independent of Device Clock Skew (substreams)

**Description**: Events can arrive late or out of order due to clock skews between event producers, clock skews between partitions, or network latency. In the following example, the device clock for TollID 2 is five seconds behind TollID 1, and the device clock for TollID 3 is ten seconds behind TollID 1. 

**Input**:

| LicensePlate | Make | Time | TollID |
| --- | --- | --- | --- |
| DXE 5291 |Honda |2015-07-27T00:00:01.0000000Z | 1 |
| YHN 6970 |Toyota |2015-07-27T00:00:05.0000000Z | 1 |
| QYF 9358 |Honda |2015-07-27T00:00:01.0000000Z | 2 |
| GXF 9462 |BMW |2015-07-27T00:00:04.0000000Z | 2 |
| VFE 1616 |Toyota |2015-07-27T00:00:10.0000000Z | 1 |
| RMV 8282 |Honda |2015-07-27T00:00:03.0000000Z | 3 |
| MDR 6128 |BMW |2015-07-27T00:00:11.0000000Z | 2 |
| YZK 5704 |Ford |2015-07-27T00:00:07.0000000Z | 3 |

**Output**:

| TollID | Count |
| --- | --- |
| 1 | 2 |
| 2 | 2 |
| 1 | 1 |
| 3 | 1 |
| 2 | 1 |
| 3 | 1 |

**Solution**:

```SQL
SELECT
      TollId,
      COUNT(*) AS Count
FROM input
      TIMESTAMP BY Time OVER TollId
GROUP BY TUMBLINGWINDOW(second, 5), TollId
```

**Explanation**:
The [TIMESTAMP BY OVER](/stream-analytics-query/timestamp-by-azure-stream-analytics#over-clause-interacts-with-event-ordering) clause looks at each device timeline separately using substreams. The output events for each TollID are generated as they are computed, meaning that the events are in order with respect to each TollID instead of being reordered as if all devices were on the same clock.

## Query example: Remove duplicate events in a window

**Description**: When performing an operation such as calculating averages over events in a given time window, duplicate events should be filtered. In the following example, the second event is a duplicate of the first.

**Input**:  

| DeviceId | Time | Attribute | Value |
| --- | --- | --- | --- |
| 1 |2018-07-27T00:00:01.0000000Z |Temperature |50 |
| 1 |2018-07-27T00:00:01.0000000Z |Temperature |50 |
| 2 |2018-07-27T00:00:01.0000000Z |Temperature |40 |
| 1 |2018-07-27T00:00:05.0000000Z |Temperature |60 |
| 2 |2018-07-27T00:00:05.0000000Z |Temperature |50 |
| 1 |2018-07-27T00:00:10.0000000Z |Temperature |100 |

**Output**:  

| AverageValue | DeviceId |
| --- | --- |
| 70 | 1 |
|45 | 2 |

**Solution**:

```SQL
With Temp AS (
    SELECT
        COUNT(DISTINCT Time) AS CountTime,
        Value,
        DeviceId
    FROM
        Input TIMESTAMP BY Time
    GROUP BY
        Value,
        DeviceId,
        SYSTEM.TIMESTAMP()
)

SELECT
    AVG(Value) AS AverageValue, DeviceId
INTO Output
FROM Temp
GROUP BY DeviceId,TumblingWindow(minute, 5)
```

**Explanation**:
[COUNT(DISTINCT Time)](/stream-analytics-query/count-azure-stream-analytics) returns the number of distinct values in the Time column within a time window. You can then use the output of this step to compute the average per device by discarding duplicates.

## Geofencing and geospatial queries
Azure Stream Analytics provides built-in geospatial functions that can be used to implement scenarios such as fleet management, ride sharing, connected cars, and asset tracking. Geospatial data can be ingested in either GeoJSON or WKT formats as part of event stream or reference data. For more information, refer to the [Geofencing and geospatial aggregation scenarios with Azure Stream Analytics](geospatial-scenarios.md) article.

## Language extensibility through JavaScript and C#
Azure Stream Ananlytics query langugae can be extended with custom functions written in JavaScript or C# languages. For more information see the foolowing articles:
* [Azure Stream Analytics JavaScript user-defined functions](stream-analytics-javascript-user-defined-functions.md)
* [Azure Stream Analytics JavaScript user-defined aggregates](stream-analytics-javascript-user-defined-aggregates.md)
* [Develop .NET Standard user-defined functions for Azure Stream Analytics Edge jobs](stream-analytics-edge-csharp-udf-methods.md)

## Get help

For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=AzureStreamAnalytics).

## Next steps
* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-real-time-fraud-detection.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics Query Language Reference](https://docs.microsoft.com/stream-analytics-query/stream-analytics-query-language-reference)
* [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)

