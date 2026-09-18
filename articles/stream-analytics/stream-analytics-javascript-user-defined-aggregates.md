---
title: JavaScript User-Defined Aggregates in Stream Analytics
description: Learn how to build JavaScript user-defined aggregates (UDA) in Azure Stream Analytics to run custom stateful aggregation logic over windowed events.
ms.service: azure-stream-analytics
ms.topic: how-to
ms.date: 08/26/2026
ms.custom: devx-track-js
ai-usage: ai-assisted

#customer intent: As a Stream Analytics developer, I want to create a JavaScript user-defined aggregate so that I can apply custom stateful aggregation logic over windowed events.
---
# Implement JavaScript user-defined aggregates in Azure Stream Analytics

Azure Stream Analytics supports user-defined aggregates (UDA) written in JavaScript so that you can implement complex stateful business logic. With a UDA, you have full control of the state data structure, state accumulation, state deaccumulation, and aggregate result computation.

Use a JavaScript UDA when the built-in aggregate functions don't meet your needs and you want to aggregate windowed events with your own algorithm.

This article shows you how to create a UDA and how to call it with window-based operations in a Stream Analytics query.

## Prerequisites

Before you begin, make sure that you have:

- An existing Azure Stream Analytics job. If you don't have one, see [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md).
- Familiarity with the [windowing functions](stream-analytics-window-functions.md) that you use with the aggregate.

## Choose a JavaScript user-defined aggregate type

A user-defined aggregate runs on top of a time window specification to aggregate over the events in that window and produce a single result value. Stream Analytics supports two types of UDA interfaces: AccumulateOnly and AccumulateDeaccumulate. Both types work with tumbling, hopping, sliding, and session windows. Choose the type based on the algorithm you use.

AccumulateDeaccumulate aggregates perform better than AccumulateOnly aggregates when you use them with hopping, sliding, and session windows, because Stream Analytics can remove events from the state instead of recomputing it.

### AccumulateOnly aggregates

AccumulateOnly aggregates can only accumulate new events into their state. The algorithm doesn't allow deaccumulation of values. Choose this type when you can't remove an event's information from the state value. The following code is the JavaScript template for AccumulateOnly aggregates:

```javascript
// Sample UDA which state can only be accumulated.
function main() {
    this.init = function () {
        this.state = 0;
    }

    this.accumulate = function (value, timestamp) {
        this.state += value;
    }

    this.computeResult = function () {
        return this.state;
    }
}
```

### AccumulateDeaccumulate aggregates

AccumulateDeaccumulate aggregates deaccumulate a previously accumulated value from the state. For example, you can remove a key-value pair from a list of event values or subtract a value from a sum aggregate. The following code is the JavaScript template for AccumulateDeaccumulate aggregates:

```javascript
// Sample UDA which state can be accumulated and deaccumulated.
function main() {
    this.init = function () {
        this.state = 0;
    }

    this.accumulate = function (value, timestamp) {
        this.state += value;
    }

    this.deaccumulate = function (value, timestamp) {
        this.state -= value;
    }

    this.deaccumulateState = function (otherState){
        this.state -= otherState.state;
    }

    this.computeResult = function () {
        return this.state;
    }
}
```

## Understand the JavaScript function declaration

A Function object declaration defines each JavaScript UDA. The following list describes the major elements in a UDA definition.

### Function alias

The function alias is the UDA identifier. When you call a UDA in a Stream Analytics query, always use the alias together with an `uda.` prefix.

### Function type

For a UDA, set the function type to **JavaScript UDA**.

### Output type

Set the output type to a specific type that the Stream Analytics job supports, or to **Any** if you want to handle the type in your query.

### Function name

The name of the Function object. The function name must match the UDA alias.

### Method: init()

The `init()` method initializes the state of the aggregate. Stream Analytics calls this method when the window starts.

### Method: accumulate()

The `accumulate()` method calculates the UDA state based on the previous state and the current event values. Stream Analytics calls this method when an event enters a time window (`TumblingWindow`, `HoppingWindow`, `SlidingWindow`, or `SessionWindow`).

### Method: deaccumulate()

The `deaccumulate()` method recalculates the state based on the previous state and the current event values. Stream Analytics calls this method when an event leaves a `SlidingWindow` or `SessionWindow`.

### Method: deaccumulateState()

The `deaccumulateState()` method recalculates the state based on the previous state and the state of a hop. Stream Analytics calls this method when a set of events leaves a `HoppingWindow`.

### Method: computeResult()

The `computeResult()` method returns the aggregate result based on the current state. Stream Analytics calls this method at the end of a time window (`TumblingWindow`, `HoppingWindow`, `SlidingWindow`, or `SessionWindow`).

## Review supported input and output data types

JavaScript user-defined aggregates use the same input and output type conversions as JavaScript user-defined functions (UDF). For the full mapping between Stream Analytics data types and JavaScript data types, see the **Stream Analytics and JavaScript type conversion** section of [Integrate JavaScript UDFs](stream-analytics-javascript-user-defined-functions.md).

## Add a JavaScript UDA in the Azure portal

In this section, you create a UDA that computes a time-weighted average. To create a JavaScript UDA in an existing Stream Analytics job, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and go to your Stream Analytics job.
1. Under **Job topology**, select **Functions**.
1. Select **Add**, and then select **JavaScript UDA**.
1. On the **New function** page, a default UDA template appears in the editor.
1. Enter `TWA` as the function alias, and then replace the function implementation with the following code:

    ```javascript
    // Sample UDA which calculates the time-weighted average of incoming values.
    function main() {
        this.init = function () {
            this.totalValue = 0.0;
            this.totalWeight = 0.0;
        }

        this.accumulate = function (value, timestamp) {
            this.totalValue += value.level * value.weight;
            this.totalWeight += value.weight;

        }

        // Uncomment the following block for an AccumulateDeaccumulate implementation.
        /*
        this.deaccumulate = function (value, timestamp) {
            this.totalValue -= value.level * value.weight;
            this.totalWeight -= value.weight;
        }

        this.deaccumulateState = function (otherState){
            this.totalValue -= otherState.totalValue;
            this.totalWeight -= otherState.totalWeight;
        }
        */

        this.computeResult = function () {
            if(this.totalValue == 0) {
                result = 0;
            }
            else {
                result = this.totalValue/this.totalWeight;
            }
            return result;
        }
    }
    ```

1. Select **Save**. Your UDA appears in the function list.
1. Select the new **TWA** function to review its definition.

## Call a JavaScript UDA in a Stream Analytics query

In the Azure portal, open your job and edit the query. Call the `TWA()` function with the mandatory `uda.` prefix. For example:

```sql
WITH value AS
(
    SELECT
    NoiseLevelDB as level,
    DurationSecond as weight
FROM
    [YourInputAlias] TIMESTAMP BY EntryTime
)
SELECT
    System.Timestamp as ts,
    uda.TWA(value) as NoiseDoseTWA
FROM value
GROUP BY TumblingWindow(minute, 5)
```

## Test the query with the UDA

Create a local JSON file with the following content, upload the file as sample input to your Stream Analytics job, and then test the preceding query:

```json
[
  {"EntryTime": "2017-06-10T05:01:00-07:00", "NoiseLevelDB": 80, "DurationSecond": 22.0},
  {"EntryTime": "2017-06-10T05:02:00-07:00", "NoiseLevelDB": 81, "DurationSecond": 37.8},
  {"EntryTime": "2017-06-10T05:02:00-07:00", "NoiseLevelDB": 85, "DurationSecond": 26.3},
  {"EntryTime": "2017-06-10T05:03:00-07:00", "NoiseLevelDB": 95, "DurationSecond": 13.7},
  {"EntryTime": "2017-06-10T05:03:00-07:00", "NoiseLevelDB": 88, "DurationSecond": 10.3},
  {"EntryTime": "2017-06-10T05:05:00-07:00", "NoiseLevelDB": 103, "DurationSecond": 5.5},
  {"EntryTime": "2017-06-10T05:06:00-07:00", "NoiseLevelDB": 99, "DurationSecond": 23.0},
  {"EntryTime": "2017-06-10T05:07:00-07:00", "NoiseLevelDB": 108, "DurationSecond": 1.76},
  {"EntryTime": "2017-06-10T05:07:00-07:00", "NoiseLevelDB": 79, "DurationSecond": 17.9},
  {"EntryTime": "2017-06-10T05:08:00-07:00", "NoiseLevelDB": 83, "DurationSecond": 27.1},
  {"EntryTime": "2017-06-10T05:09:00-07:00", "NoiseLevelDB": 91, "DurationSecond": 17.1},
  {"EntryTime": "2017-06-10T05:09:00-07:00", "NoiseLevelDB": 115, "DurationSecond": 7.9},
  {"EntryTime": "2017-06-10T05:09:00-07:00", "NoiseLevelDB": 80, "DurationSecond": 28.3},
  {"EntryTime": "2017-06-10T05:10:00-07:00", "NoiseLevelDB": 55, "DurationSecond": 18.2},
  {"EntryTime": "2017-06-10T05:10:00-07:00", "NoiseLevelDB": 93, "DurationSecond": 25.8},
  {"EntryTime": "2017-06-10T05:11:00-07:00", "NoiseLevelDB": 83, "DurationSecond": 11.4},
  {"EntryTime": "2017-06-10T05:12:00-07:00", "NoiseLevelDB": 89, "DurationSecond": 7.9},
  {"EntryTime": "2017-06-10T05:15:00-07:00", "NoiseLevelDB": 112, "DurationSecond": 3.7},
  {"EntryTime": "2017-06-10T05:15:00-07:00", "NoiseLevelDB": 93, "DurationSecond": 9.7},
  {"EntryTime": "2017-06-10T05:18:00-07:00", "NoiseLevelDB": 96, "DurationSecond": 3.7},
  {"EntryTime": "2017-06-10T05:20:00-07:00", "NoiseLevelDB": 108, "DurationSecond": 0.99},
  {"EntryTime": "2017-06-10T05:20:00-07:00", "NoiseLevelDB": 113, "DurationSecond": 25.1},
  {"EntryTime": "2017-06-10T05:22:00-07:00", "NoiseLevelDB": 110, "DurationSecond": 5.3}
]
```

## Related content

- [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
- [Get started using Azure Stream Analytics](stream-analytics-real-time-fraud-detection.md)
- [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
- [Azure Stream Analytics query language reference](/stream-analytics-query/stream-analytics-query-language-reference)
- [Azure Stream Analytics management REST API reference](/rest/api/streamanalytics/)
- [Microsoft Q&A question page for Azure Stream Analytics](/answers/tags/179/azure-stream-analytics)