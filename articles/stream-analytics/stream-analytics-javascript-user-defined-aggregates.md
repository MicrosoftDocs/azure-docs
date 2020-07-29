---
title: JavaScript user-defined aggregates in Azure Stream Analytics
description: This article describes how to perform advanced query mechanics with JavaScript user-defined aggregates in Azure Stream Analytics.
author: rodrigoaatmicrosoft
ms.author: rodrigoa
ms.reviewer: mamccrea
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 10/28/2017
---
# Azure Stream Analytics JavaScript user-defined aggregates
 
Azure Stream Analytics supports user-defined aggregates (UDA) written in JavaScript, it enables you to implement complex stateful business logic. Within UDA you have full control of the state data structure, state accumulation, state decumulation, and aggregate result computation. The article introduces the two different JavaScript UDA interfaces, steps to create a UDA, and how to use UDA with window-based operations in Stream Analytics query.

## JavaScript user-defined aggregates

A user-defined aggregate is used on top of a time window specification to aggregate over the events in that window and produce a single result value. There are two types of UDA interfaces that Stream Analytics supports today, AccumulateOnly and AccumulateDeaccumulate. Both types of UDA can be used by Tumbling, Hopping, Sliding and Session Window. AccumulateDeaccumulate UDA performs better than AccumulateOnly UDA when used together with Hopping, Sliding and Session Window. You choose one of the two types based on the algorithm you use.

### AccumulateOnly aggregates

AccumulateOnly aggregates can only accumulate new events to its state, the algorithm does not allow deaccumulation of values. Choose this aggregate type when deaccumulate an event information from the state value is impossible to implement. Following is the JavaScript template for AccumulatOnly aggregates:

```JavaScript
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

AccumulateDeaccumulate aggregates allow deaccumulation of a previous accumulated value from the state, for example, remove a key-value pair from a list of event values, or subtract a value from a state of sum aggregate. Following is the JavaScript template for AccumulateDeaccumulate aggregates:

```JavaScript
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

## UDA - JavaScript function declaration

Each JavaScript UDA is defined by a Function object declaration. Following are the major elements in a UDA definition.

### Function alias

Function alias is the UDA identifier. When called in Stream Analytics query, always use UDA alias together with a "uda." prefix.

### Function type

For UDA, the function type should be **Javascript UDA**.

### Output type

A specific type that Stream Analytics job supported, or "Any" if you want to handle the type in your query.

### Function name

The name of this Function object. The function name should match the UDA alias.

### Method - init()

The init() method initializes state of the aggregate. This method is called when window starts.

### Method – accumulate()

The accumulate() method calculates the UDA state based on the previous state and the current event values. This method is called when an event enters a time window (TUMBLINGWINDOW, HOPPINGWINDOW, SLIDINGWINDOW or SESSIONWINDOW).

### Method – deaccumulate()

The deaccumulate() method recalculates state based on the previous state and the current event values. This method is called when an event leaves a SLIDINGWINDOW or SESSIONWINDOW.

### Method – deaccumulateState()

The deaccumulateState() method recalculates state based on the previous state and the state of a hop. This method is called when a set of events leave a HOPPINGWINDOW.

### Method – computeResult()

The computeResult() method returns aggregate result based on the current state. This method is called at the end of a time window (TUMBLINGWINDOW, HOPPINGWINDOW, SLIDINGWINDOW or SESSIONWINDOW).

## JavaScript UDA supported input and output data types
For JavaScript UDA data types, refer to section **Stream Analytics and JavaScript type conversion** of [Integrate JavaScript UDFs](stream-analytics-javascript-user-defined-functions.md).

## Adding a JavaScript UDA from the Azure portal

Below we walk through the process of creating a UDA from Portal. The example we use here is computing time weighted averages.

Now let's create a JavaScript UDA under an existing ASA job by following steps.

1. Log on to Azure portal and locate your existing Stream Analytics job.
1. Then click on functions  link under **JOB TOPOLOGY**.
1. Click on the **Add** icon to add a new function.
1. On the New Function view, select **JavaScript UDA** as the Function Type, then you see a default UDA template show up in the editor.
1. Fill in "TWA" as the UDA alias and change the function implementation as the following:

    ```JavaScript
    // Sample UDA which calculate Time-Weighted Average of incoming values.
    function main() {
        this.init = function () {
            this.totalValue = 0.0;
            this.totalWeight = 0.0;
        }

        this.accumulate = function (value, timestamp) {
            this.totalValue += value.level * value.weight;
            this.totalWeight += value.weight;

        }

        // Uncomment below for AccumulateDeaccumulate implementation
        /*
        this.deaccumulate = function (value, timestamp) {
            this.totalValue -= value.level * value.weight;
            this.totalWeight -= value.weight;
        }

        this.deaccumulateState = function (otherState){
            this.state -= otherState.state;
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

1. Once you click the "Save" button, your UDA shows up on the function list.

1. Click on the new function "TWA", you can check the function definition.

## Calling JavaScript UDA in ASA query

In Azure portal and open your job, edit the query and call TWA() function with a mandate prefix "uda.". For example:

```SQL
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
    uda.TWA(value) as NoseDoseTWA
FROM value
GROUP BY TumblingWindow(minute, 5)
```

## Testing query with UDA

Create a local JSON file with below content, upload the file to Stream Analytics job, and test above query.

```JSON
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

## Get help

For additional help, try our [Microsoft Q&A question page for Azure Stream Analytics](https://docs.microsoft.com/answers/topics/azure-stream-analytics.html).

## Next steps

* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-real-time-fraud-detection.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics query language reference](https://docs.microsoft.com/stream-analytics-query/stream-analytics-query-language-reference)
* [Azure Stream Analytics management REST API reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)
