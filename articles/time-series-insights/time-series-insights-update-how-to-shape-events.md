---
title: 'Shape events - Azure Time Series Insights | Microsoft Docs'
description: Learn about best practices and how to shape events for querying in Azure Time Insights Preview.
author: deepakpalled
ms.author: dpalled
manager: cshankar
ms.workload: big-data
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 02/24/2020
ms.custom: seodec18
---

# Shape events with Azure Time Series Insights Preview

This article defines best practices to shape your JSON payloads for ingestion in Azure Time Series Insights and to maximize the efficiency of your Preview queries.

## Best practices

It's best to carefully consider how you send events to your Time Series Insights Preview environment. 

General best practices include:

* Send data over the network as efficiently as possible.
* Store your data in a way that helps you aggregate it more suitably for your scenario.

For the best query performance, adhere to the following rules of thumb:

* Don't send unnecessary properties. Time Series Insights Preview bills by usage. It's best to store and process only the data that you'll query.
* Use instance fields for static data. This practice helps to avoid sending static data over the network. Instance fields, a component of the Time Series Model, work like reference data in the Time Series Insights service that's generally available. To learn more about instance fields, read [Time Series Model](./time-series-insights-update-tsm.md).
* Share dimension properties among two or more events. This practice helps you send data over the network more efficiently.
* Don't use deep array nesting. Time Series Insights Preview supports up to two levels of nested arrays that contain objects. Time Series Insights Preview flattens arrays in messages into multiple events with property value pairs.
* If only a few measures exist for all or most events, it's better to send these measures as separate properties within the same object. Sending them separately reduces the number of events and might improve query performance because fewer events need to be processed.

## Column flattening

During ingestion, payloads that contain nested objects will be flattened so that the column name is a single value with a delineator.

* For example, the following nested JSON:

   ```JSON
   "data": {
        "flow": 1.0172575712203979,
   },
   ```

   Becomes: `data_flow` when flattened.

> [!IMPORTANT]
> * Azure Time Series Insights Preview uses underscores (`_`) for column delineation.
> * Note the difference from General Availability which uses periods (`.`) instead.

More complex scenarios are illustrated below.

#### Example 1:

The following scenario has two (or more) devices that send the measurements (signals): *Flow Rate*, *Engine Oil Pressure*, *Temperature*, and *Humidity*.

There's a single Azure IoT Hub message sent where the outer array contains a shared section of common dimension values (note the two device entries contained in the message).

```JSON
[
  {
    "deviceId":"FXXX",
    "timestamp":"2018-01-17T01:17:00Z",
    "series":[
      {
        "Flow Rate ft3/s":1.0172575712203979,
        "Engine Oil Pressure psi ":34.7
      },
      {
        "Flow Rate ft3/s":2.445906400680542,
        "Engine Oil Pressure psi ":49.2
      }
    ]
  },
  {
    "deviceId":"FYYY",
    "timestamp":"2018-01-17T01:18:00Z",
    "series":[
      {
        "Flow Rate ft3/s":0.58015072345733643,
        "Engine Oil Pressure psi ":22.2
      }
    ]
  }
]
```

**Takeaways:**

* The example JSON has an outer array that uses [Time Series Instance](./time-series-insights-update-tsm.md#time-series-model-instances) data to increase the efficiency of the message. Even though Time Series Instances device metadata's not likely to change, it often provides useful properties for data analysis.

* The JSON combines two or more messages (one from each device) into a single payload saving on bandwidth over time.

* Individual series data points for each device are combined into a single **series** attribute reducing the need to continuously stream updates for each device.

> [!TIP]
> To reduce the number of messages required to send data and make telemetry more efficient, consider batching common dimension values and Time Series Instance metadata into a single JSON payload.

#### Time Series Instance 

Let's take a closer look at how to use [Time Series Instance](./time-series-insights-update-tsm.md#time-series-model-instances) to shape your JSON more optimally. 

> [!NOTE]
> The [Time Series IDs](./time-series-insights-update-how-to-id.md) below are *deviceIds*.

```JSON
[
  {
    "timeSeriesId":[
      "FXXX"
    ],
    "typeId":"17150182-daf3-449d-adaf-69c5a7517546",
    "hierarchyIds":[
      "b888bb7f-06f0-4bfd-95c3-fac6032fa4da"
    ],
    "description":null,
    "instanceFields":{
      "L1":"REVOLT SIMULATOR",
      "L2":"Battery System"
    }
  },
  {
    "timeSeriesId":[
      "FYYY"
    ],
    "typeId":"17150182-daf3-449d-adaf-69c5a7517546",
    "hierarchyIds":[
      "b888bb7f-06f0-4bfd-95c3-fac6032fa4da"
    ],
    "description":null,
    "instanceFields":{
      "L1":"COMMON SIMULATOR",
      "L2":"Battery System"
    }
  }
]
```

Time Series Insights Preview joins a table (after flattening) during query time. The table includes additional columns, such as **Type**.

| deviceId	| Type | L1 | L2 | timestamp | series_Flow Rate ft3/s |	series_Engine Oil Pressure psi |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| `FXXX` | Default_Type | SIMULATOR | Battery System | 2018-01-17T01:17:00Z |	1.0172575712203979 |	34.7 |
| `FXXX` | Default_Type | SIMULATOR |	Battery System |	2018-01-17T01:17:00Z | 2.445906400680542 |	49.2 |
| `FYYY` | LINE_DATA	COMMON | SIMULATOR |	Battery System |	2018-01-17T01:18:00Z | 0.58015072345733643 |	22.2 |

> [!NOTE]
>  The preceding table represents the query view in the [Time Series Preview Explorer](./time-series-insights-update-explorer.md).

**Takeaways:**

* In the preceding example, static properties are stored in Time Series Insights Preview to optimize data sent over the network.
* Time Series Insights Preview data is joined at query time through the Time Series ID that's defined in the instance.
* Two layers of nesting are used. This number is the most that Time Series Insights Preview supports. It's critical to avoid deeply nested arrays.
* Because there are few measures, they're sent as separate properties within the same object. In the example, **series_Flow Rate psi**, **series_Engine Oil Pressure psi**, and **series_Flow Rate ft3/s** are unique columns.

>[!IMPORTANT]
> Instance fields aren't stored with telemetry. They're stored with metadata in the Time Series Model.

#### Example 2:

Consider the following JSON:

```JSON
{
  "deviceId": "FXXX",
  "timestamp": "2019-01-18T01:17:00Z",
  "data": {
        "flow": 1.0172575712203979,
    },
  "data_flow" : 1.76435072345733643
}
```

In the example above, the flattened `data["flow"]` property would present a naming collision with the `data_flow` property.

In this case, the *latest* property value would overwrite the earlier one. 

> [!TIP]
> Contact the Time Series Insights team for more assistance!

> [!WARNING] 
> * In cases where duplicate properties are present in the same (singular) event payload due to flattening or another mechanism, the latest > property value is stored, over-writing any previous values.
> * Series of combined events will not override one another.

## Next steps

* To put these guidelines into practice, read [Azure Time Series Insights Preview query syntax](./time-series-insights-query-data-csharp.md). You'll learn more about the query syntax for the Time Series Insights [Preview REST API](https://docs.microsoft.com/rest/api/time-series-insights/preview) for data access.

* Combine JSON best practices with [How to Time Series Model](./time-series-insights-update-how-to-tsm.md).
