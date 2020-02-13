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
ms.date: 12/16/2019
ms.custom: seodec18
---

# Shape events with Azure Time Series Insights Preview

This article helps you shape your JSON file for ingestion and to maximize the efficiency of your Azure Time Series Insights Preview queries.

## Best practices

Think about how you send events to Time Series Insights Preview. Namely, you should always:

* Send data over the network as efficiently as possible.
* Store your data in a way that helps you aggregate it more suitably for your scenario.

For the best query performance, do the following:

* Don't send unnecessary properties. Time Series Insights Preview bills you on your usage. It's best to store and process the data that you'll query.
* Use instance fields for static data. This practice helps you avoid sending static data over the network. Instance fields, a component of the Time Series Model, work like reference data in the Time Series Insights service that's generally available. To learn more about instance fields, read [Time Series Model](./time-series-insights-update-tsm.md).
* Share dimension properties among two or more events. This practice helps you send data over the network more efficiently.
* Don't use deep array nesting. Time Series Insights Preview supports up to two levels of nested arrays that contain objects. Time Series Insights Preview flattens arrays in messages into multiple events with property value pairs.
* If only a few measures exist for all or most events, it's better to send these measures as separate properties within the same object. Sending them separately reduces the number of events and might improve query performance because fewer events need to be processed.

During ingestion, payloads that contain nesting will be flattened, such that the column name is a single value with a delineator. Time Series Insights Preview uses underscores for delineation. Note that this is a change from the GA version of the product which used periods. During preview, there is a caveat around flattening, which is illustrated in the second example below.

## Examples

The following example is based on a scenario where two or more devices send measurements or signals. The measurements or signals can be *Flow Rate*, *Engine Oil Pressure*, *Temperature*, and *Humidity*.

In the example, there's a single Azure IoT Hub message where the outer array contains a shared section of common dimension values. The outer array uses Time Series Instance data to increase the efficiency of the message. 

The Time Series Instance contains device metadata. This metadata doesn't change with every event, but it does provide useful properties for data analysis. To save on bytes sent over the wire and make the message more efficient, consider batching common dimension values and using Time Series Instance metadata.

### Example 1:

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

### Time Series Instance 

> [!NOTE]
> The Time Series ID is *deviceId*.

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

Time Series Insights Preview joins a table (after flattening) during query time. The table includes additional columns, such as **Type**. The following example demonstrates how you can [shape](./time-series-insights-send-events.md#supported-json-shapes) your telemetry data.

| deviceId	| Type | L1 | L2 | timestamp | series_Flow Rate ft3/s |	series_Engine Oil Pressure psi |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| `FXXX` | Default_Type | SIMULATOR | Battery System | 2018-01-17T01:17:00Z |	1.0172575712203979 |	34.7 |
| `FXXX` | Default_Type | SIMULATOR |	Battery System |	2018-01-17T01:17:00Z | 2.445906400680542 |	49.2 |
| `FYYY` | LINE_DATA	COMMON | SIMULATOR |	Battery System |	2018-01-17T01:18:00Z | 0.58015072345733643 |	22.2 |

In the preceding example, note the following points:

* Static properties are stored in Time Series Insights Preview to optimize data sent over the network.
* Time Series Insights Preview data is joined at query time through the Time Series ID that's defined in the instance.
* Two layers of nesting are used. This number is the most that Time Series Insights Preview supports. It's critical to avoid deeply nested arrays.
* Because there are few measures, they're sent as separate properties within the same object. In the example, **series_Flow Rate psi**, **series_Engine Oil Pressure psi**, and **series_Flow Rate ft3/s** are unique columns.

>[!IMPORTANT]
> Instance fields aren't stored with telemetry. They're stored with metadata in the Time Series Model.
> The preceding table represents the query view.

### Example 2:

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
In the example above, the flattened `data_flow` property would present a naming collision with the `data_flow` property. In this case, the *latest* property value would overwrite the earlier one. If this behavior present a challenge for your business scenarios please contact the TSI team.

> [!WARNING] 
> In cases where duplicate properties are present in the same event payload due to flattening or
> another mechanism, the latest property value is stored, overwritting any previous values.


## Next steps

To put these guidelines into practice, read [Azure Time Series Insights Preview query syntax](./time-series-insights-query-data-csharp.md). You'll learn more about the query syntax for the Time Series Insights Preview REST API for data access.
