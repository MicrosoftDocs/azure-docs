---
title: 'Shape events with Azure Time Series Insights Preview | Microsoft Docs'
description: Understand how to shape events with Azure Time Series Insights Preview.
author: ashannon7
ms.author: dpalled
ms.workload: big-data
manager: cshankar
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 04/30/2019
ms.custom: seodec18
---

# Shape events with Azure Time Series Insights Preview

This article helps you shape your JSON file to maximize the efficiency of your Azure Time Series Insights Preview queries.

## Best practices

Think about how you send events to Time Series Insights Preview. Namely, you should always:

* Send data over the network as efficiently as possible.
* Store your data in a way that helps you aggregate it more suitably for your scenario.

For the best possible query performance, do the following:

* Don't send unnecessary properties. Time Series Insights Preview bills you on your usage. It's best to store and process the data that you'll query.
* Use instance fields for static data. This practice helps you avoid sending static data over the network. Instance fields, a component of the time series model, work like reference data in the Time Series Insights generally available service. To learn more about instance fields, see [Time Series Models](./time-series-insights-update-tsm.md).
* Share dimension properties among two or more events. This practice helps you send data over the network more efficiently.
* Don't use deep array nesting. Time Series Insights Preview supports up to two levels of nested arrays that contain objects. Time Series Insights Preview flattens arrays in messages into multiple events with property value pairs.
* If only a few measures exist for all or most events, it's better to send these measures as separate properties within the same object. Sending them separately reduces the number of events and might improve query performance because fewer events need to be processed.

## Example

The following example is based on a scenario where two or more devices send measurements or signals. The measurements or signals can be *Flow Rate*, *Engine Oil Pressure*, *Temperature*, and *Humidity*.

In the following example, there's a single Azure IoT Hub message where the outer array contains a shared section of common dimension values. The outer array uses Time Series Instance data to increase the efficiency of the message. Time Series Instance contains device metadata, which doesn't change with every event, but it does provide useful properties for data analysis. To save on bytes sent over the wire and make the message more efficient, consider batching common dimension values and employing Time Series Instance metadata.

### Example JSON payload

```JSON
[
    {
        "deviceId": "FXXX",
        "timestamp": "2018-01-17T01:17:00Z",
        "series": [
            {
                "Flow Rate ft3/s": 1.0172575712203979,
                "Engine Oil Pressure psi ": 34.7
            },
            {
                "Flow Rate ft3/s": 2.445906400680542,
                "Engine Oil Pressure psi ": 49.2
            }
        ]
    },
    {
        "deviceId": "FYYY",
        "timestamp": "2018-01-17T01:18:00Z",
        "series": [
            {
                "Flow Rate ft3/s": 0.58015072345733643,
                "Engine Oil Pressure psi ": 22.2
            }
        ]
    }
]
```

### Time Series Instance 
> [!NOTE]
> The Time Series ID is *deviceId*.

```JSON
{
    "timeSeriesId": [
      "FXXX"
    ],
    "typeId": "17150182-daf3-449d-adaf-69c5a7517546",
    "hierarchyIds": [
      "b888bb7f-06f0-4bfd-95c3-fac6032fa4da"
    ],
    "description": null,
    "instanceFields": {
      "L1": "REVOLT SIMULATOR",
      "L2": "Battery System",
    }
  },
  {
    "timeSeriesId": [
      "FYYY"
    ],
    "typeId": "17150182-daf3-449d-adaf-69c5a7517546",
    "hierarchyIds": [
      "b888bb7f-06f0-4bfd-95c3-fac6032fa4da"
    ],
    "description": null,
    "instanceFields": {
      "L1": "COMMON SIMULATOR",
      "L2": "Battery System",
    }
  },
```

Time Series Insights Preview joins a table (after flattening) during query time. The table includes additional columns, such as **Type**. The following example demonstrates how you can [shape](./time-series-insights-send-events.md#json) your telemetry data.

| deviceId	| Type | L1 | L2 | timestamp | series.Flow Rate ft3/s |	series.Engine Oil Pressure psi |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| `FXXX` | Default_Type | SIMULATOR | Battery System | 2018-01-17T01:17:00Z |	1.0172575712203979 |	34.7 |
| `FXXX` | Default_Type | SIMULATOR |	Battery System |	2018-01-17T01:17:00Z | 2.445906400680542 |	49.2 |
| `FYYY` | LINE_DATA	COMMON | SIMULATOR |	Battery System |	2018-01-17T01:18:00Z | 0.58015072345733643 |	22.2 |

In the preceding example, note the following points:

* Static properties are stored in Time Series Insights Preview to optimize data sent over the network.
* Time Series Insights Preview data is joined at query time by using the Time Series ID that's defined in the instance.
* Two layers of nesting are used, which is the most that's supported by Time Series Insights Preview. It's critical to avoid deeply nested arrays.
* Because there are few measures, they're sent as separate properties within the same object. In the example, **series.Flow Rate psi**, **series.Engine Oil Pressure psi**, and **series.Flow Rate ft3/s** are unique columns.

>[!IMPORTANT]
> Instance fields aren't stored with telemetry. They're stored with metadata in the **Time Series Model**.
> The preceding table represents the query view.

## Next steps

- To put these guidelines into practice, see [Azure Time Series Insights Preview query syntax](./time-series-insights-query-data-csharp.md). You'll learn more about the query syntax for the Time Series Insights Preview data access REST API.
- To learn about supported JSON shapes, see [Supported JSON shapes](./time-series-insights-send-events.md#json).
