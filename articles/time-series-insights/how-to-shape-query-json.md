---
title: 'Best practices for shaping JSON in Azure Time Series Insights queries | Microsoft Docs'
description: Learn how to improve your Azure Time Series Insights query efficiency.
services: time-series-insights
author: ashannon7
manager: cshankar
ms.service: time-series-insights
ms.topic: article
ms.date: 05/09/2019
ms.author: dpalled
ms.custom: seodec18

# Customer intent: As a developer, I want to learn about best practices for shaping JSON so that I can create efficient Time Series Insights queries when I use APIs.
---

# Shape JSON to maximize query performance 

This article provides guidance on how to shape JSON to maximize the efficiency of your Azure Time Series Insights queries.

## Video

### Learn best practices for shaping JSON to meet your storage needs.</br>

> [!VIDEO https://www.youtube.com/embed/b2BD5hwbg5I]

## Best practices
Think about how you send events to Time Series Insights. Namely, you always:

1. Send data over the network as efficiently as possible.
1. Make sure your data is stored in a way so that you can perform aggregations suitable for your scenario.
1. Make sure that you don't reach the Time Series Insights maximum property limits of:
   - 600 properties (columns) for S1 environments.
   - 800 properties (columns) for S2 environments.

The following guidance helps to ensure the best possible query performance:

1. Don't use dynamic properties, such as a tag ID, as a property name. This use contributes to reaching the maximum properties limit.
1. Don't send unnecessary properties. If a query property isn't required, it's best not to send it. This way you avoid storage limitations.
1. Use [reference data](time-series-insights-add-reference-data-set.md) to avoid sending static data over the network.
1. Share dimension properties among multiple events to send data over the network more efficiently.
1. Don't use deep array nesting. Time Series Insights supports up to two levels of nested arrays that contain objects. Time Series Insights flattens arrays in the messages into multiple events with property value pairs.
1. If only a few measures exist for all or most events, it's better to send these measures as separate properties within the same object. Sending them separately reduces the number of events and might improve query performance because fewer events need to be processed. When there are several measures, sending them as values in a single property minimizes the possibility of reaching the maximum property limit.

## Example overview

The following two examples demonstrate how to send events to highlight the previous recommendations. Following each example, you can see how the recommendations were applied.

The examples are based on a scenario where multiple devices send measurements or signals. Measurements or signals can be Flow Rate, Engine Oil Pressure, Temperature, and Humidity. In the first example, there are a few measurements across all devices. The second example has many devices, and each device sends many unique measurements.

## Scenario one: Only a few measurements exist

> [!TIP]
> We recommend that you send each measurement or signal as a separate property or column.

In the following example, there's a single Azure IoT Hub message where the outer array contains a shared section of common dimension values. The outer array uses reference data to increase the efficiency of the message. Reference data contains device metadata that doesn't change with every event, but it provides useful properties for data analysis. Batching common dimension values and employing reference data saves on bytes sent over the wire, which makes the message more efficient.

Example JSON payload:

```json
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

* Reference data table that has the key property **deviceId**:

   | deviceId | messageId | deviceLocation |
   | --- | --- | --- |
   | FXXX | LINE\_DATA | EU |
   | FYYY | LINE\_DATA | US |

* Time Series Insights event table, after flattening:

   | deviceId | messageId | deviceLocation | timestamp | series.Flow Rate ft3/s | series.Engine Oil Pressure psi |
   | --- | --- | --- | --- | --- | --- |
   | FXXX | LINE\_DATA | EU | 2018-01-17T01:17:00Z | 1.0172575712203979 | 34.7 |
   | FXXX | LINE\_DATA | EU | 2018-01-17T01:17:00Z | 2.445906400680542 | 49.2 |
   | FYYY | LINE\_DATA | US | 2018-01-17T01:18:00Z | 0.58015072345733643 | 22.2 |

Notes on these two tables:

- The **deviceId** column serves as the column header for the various devices in a fleet. Making the deviceId value its own property name limits the total devices to 595 (for S1 environments) or 795 (for S2 environments) with the other five columns.
- Unnecessary properties are avoided, for example, the make and model information. Because the properties won't be queried in the future, eliminating them enables better network and storage efficiency.
- Reference data is used to reduce the number of bytes transferred over the network. The two attributes **messageId** and **deviceLocation** are joined by using the key property **deviceId**. This data is joined with the telemetry data at ingress time and is then stored in Time Series Insights for querying.
- Two layers of nesting are used, which is the maximum amount of nesting supported by Time Series Insights. It's critical to avoid deeply nested arrays.
- Measures are sent as separate properties within the same object because there are few measures. Here, **series.Flow Rate psi** and **series.Engine Oil Pressure ft3/s** are unique columns.

## Scenario two: Several measures exist

> [!TIP]
> We recommend that you send measurements as "type," "unit," and "value" tuples.

Example JSON payload:

```json
[
    {
        "deviceId": "FXXX",
        "timestamp": "2018-01-17T01:17:00Z",
        "series": [
            {
                "tagId": "pumpRate",
                "value": 1.0172575712203979
            },
            {
                "tagId": "oilPressure",
                "value": 49.2
            },
            {
                "tagId": "pumpRate",
                "value": 2.445906400680542
            },
            {
                "tagId": "oilPressure",
                "value": 34.7
            }
        ]
    },
    {
        "deviceId": "FYYY",
        "timestamp": "2018-01-17T01:18:00Z",
        "series": [
            {
                "tagId": "pumpRate",
                "value": 0.58015072345733643
            },
            {
                "tagId": "oilPressure",
                "value": 22.2
            }
        ]
    }
]
```

* Reference data table that has the key properties **deviceId** and **series.tagId**:

   | deviceId | series.tagId | messageId | deviceLocation | type | unit |
   | --- | --- | --- | --- | --- | --- |
   | FXXX | pumpRate | LINE\_DATA | EU | Flow Rate | ft3/s |
   | FXXX | oilPressure | LINE\_DATA | EU | Engine Oil Pressure | psi |
   | FYYY | pumpRate | LINE\_DATA | US | Flow Rate | ft3/s |
   | FYYY | oilPressure | LINE\_DATA | US | Engine Oil Pressure | psi |

* Time Series Insights event table, after flattening:

   | deviceId | series.tagId | messageId | deviceLocation | type | unit | timestamp | series.value |
   | --- | --- | --- | --- | --- | --- | --- | --- |
   | FXXX | pumpRate | LINE\_DATA | EU | Flow Rate | ft3/s | 2018-01-17T01:17:00Z | 1.0172575712203979 | 
   | FXXX | oilPressure | LINE\_DATA | EU | Engine Oil Pressure | psi | 2018-01-17T01:17:00Z | 34.7 |
   | FXXX | pumpRate | LINE\_DATA | EU | Flow Rate | ft3/s | 2018-01-17T01:17:00Z | 2.445906400680542 | 
   | FXXX | oilPressure | LINE\_DATA | EU | Engine Oil Pressure | psi | 2018-01-17T01:17:00Z | 49.2 |
   | FYYY | pumpRate | LINE\_DATA | US | Flow Rate | ft3/s | 2018-01-17T01:18:00Z | 0.58015072345733643 |
   | FYYY | oilPressure | LINE\_DATA | US | Engine Oil Pressure | psi | 2018-01-17T01:18:00Z | 22.2 |

Notes on these two tables:

- The columns **deviceId** and **series.tagId** serve as the column headers for the various devices and tags in a fleet. Using each as its own attribute limits the query to 594 (for S1 environments) or 794 (for S2 environments) total devices with the other six columns.
- Unnecessary properties were avoided, for the reason cited in the first example.
- Reference data is used to reduce the number of bytes transferred over the network by introducing **deviceId**, which is used for the unique pair of **messageId** and **deviceLocation**. The composite key **series.tagId** is used for the unique pair of **type** and **unit**. The composite key allows the  **deviceId** and **series.tagId** pair to be used to refer to four values: **messageId, deviceLocation, type,** and **unit**. This data is joined with the telemetry data at ingress time. It's then stored in Time Series Insights for querying.
- Two layers of nesting are used, for the reason cited in the first example.

### For both scenarios

For a property with a large number of possible values, it's best to send as distinct values within a single column instead of creating a new column for each value. From the previous two examples:

  - In the first example, a few properties have several values, so it's appropriate to make each a separate property.
  - In the second example, the measures aren't specified as individual properties. Instead, they're an array of values or measures under a common series property. The new key **tagId** is sent, which creates the new column **series.tagId** in the flattened table. The new properties **type** and **unit** are created by using reference data so that the property limit isn't reached.

## Next steps

- Read [Azure Time Series Insights query syntax](/rest/api/time-series-insights/ga-query-syntax) to learn more about the query syntax for the Time Series Insights data access REST API.
- Learn [how to shape events](./time-series-insights-send-events.md).
