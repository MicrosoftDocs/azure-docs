---
title: How to shape events with Azure Time Series Insights (preview) | Microsoft Docs
description: Understanding how to shape events with Azure Time Series Insights (preview) 
author: ashannon7
ms.author: anshan
ms.workload: big-data
manager: cshankar
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 11/27/2018
---

# Shaping events with Azure Time Series Insights (preview) 

This article provides guidance for shaping JSON, to maximize the efficiency of your the Azure Time Series Insights (preview) queries.

## Best practices

> [!NOTE]
> For the Azure TSI (preview), the 600-800 property limits for S1/S2 do not apply.

It's important to think about how you send events to Azure TSI. Namely, you should always:

1. Send data over the network as efficiently as possible.
1. Ensure your data is stored in a way that enables you to perform aggregations suitable for your scenario.

The following guidance helps ensure the best possible query performance:

1. Don't send unnecessary properties. Exercising prudence in sending properties will help reduce cost.
* It's a best practice to store and process data that you will query.
1. Use TSI for static data to avoid sending static data over the network. To learn more about Time Series Instances, read about how to [Plan your Azure Time Series Insights (preview) environment](./time-series-insights-update-plan.md).
1. Share dimension properties among multiple events, to send data over the network more efficiently.
1. Don't use deep array nesting. TSI supports up to two levels of nested arrays that contain objects. TSI flattens arrays in the messages, into multiple events with property value pairs.
1. If only a few measures exist for all or most events, it's better to send these measures as separate properties within the same object. Sending them separately reduces the number of events, and may make queries more performant as fewer events need to be processed.

## Example

The example is based on a scenario where multiple devices send measurements or signals. Measurements or signals could be **Flow Rate**, **Engine Oil Pressure**, **Temperature**, and **Humidity**.

In the following example, there is a single IoT Hub message, where the outer array contains a shared section of common dimension values. The outer array uses Time Series Instance data to increase the efficiency of the message. Time Series Instance contains device metadata, that does not change with every event, but provides useful properties for data analysis. Both batching common dimension values, and employing Time Series Instance metadata, saves on bytes sent over the wire, thus making the message more efficient.

Example JSON payload:

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
                "Flow Rate psi": 0.58015072345733643,
                "Engine Oil Pressure psi ": 22.2
            }
        ]
    }
]
```

Time Series Instance (Note: the **Time Series ID** is *deviceId*):

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

TSI joined table (after flattening) during query time. The table will include additional columns such as Type. This example demonstrates how you can shape your telemetry data:

| deviceId	| Type | L1 | L2 | timestamp | series.Flow Rate ft3/s |	series.Engine Oil Pressure psi |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| `FXXX` | Default_Type | REVOLT SIMULATOR | Battery System | 2018-01-17T01:17:00Z |	1.0172575712203979 |	34.7 |
| `FXXX` | LINE_DATA	REVOLT | SIMULATOR |	Battery System |	2018-01-17T01:17:00Z | 2.445906400680542 |	49.2 |
| `FYYY` | LINE_DATA	COMMON | SIMULATOR |	Battery System |	2018-01-17T01:18:00Z | 0.58015072345733643 |	22.2 |

Note the following in the previous example:

* Static Properties are stored as Time Series Instances to optimize data sent over the network.
* Time Series Instance Data is joined at query time by using the *timeSeriesId* defined in the Instance.
* Two layers of nesting are used, which is the maximum amount of nesting supported by TSI. It's critical to avoid deeply nested arrays.
* Measures are sent as separate properties within same object, since there are few measures. Here, **series.Flow Rate psi** and series **Engine Oil Pressure** and **ft3/s** are unique columns.

## Next steps

To put these guidelines into practice, see [Azure TSI query syntax](./time-series-insights-query-data-csharp.md) to learn more about the query syntax for the TSI data access REST API.
