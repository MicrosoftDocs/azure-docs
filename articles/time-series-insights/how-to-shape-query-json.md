---
title: Best practices for shaping JSON in Azure Time Series Insights queries.
description: Learn how to improve your Time Series Insights query efficiency.
services: time-series-insights
author: ashannon7
manager: cshankar
ms.service: time-series-insights
ms.topic: article
ms.date: 05/24/2018
ms.author: anshan

# Customer intent: As a developer, I want learn about best practices for shaping JSON, so I can create efficient Time Series Insights queries when using APIs.
---

# How to shape JSON to maximize query performance 

This article provides guidance for shaping JSON, to maximize the efficiency of your Azure Time Series Insights (TSI) queries.

## Video: 

### In this video, we cover best practices around shaping JSON to meet your storage needs.</br>

> [!VIDEO https://www.youtube.com/embed/b2BD5hwbg5I]

## Best practices

It's important to think about how you send events to Time Series Insights. Namely, you should always:

1. send data over the network as efficiently as possible.
2. ensure your data is stored in a way that enables you to perform aggregations suitable for your scenario.
3. ensure you don't hit TSI's maximum property limits of
   - 600 properties (columns) for S1 environments.
   - 800 properties (columns) for S2 environments.

The following guidance helps ensure the best possible query performance:

1. Don't use dynamic properties, such as a tag ID as property name, as it contributes to hitting the maximum properties limit.
2. Don't send unnecessary properties. If a query property isn't required, it's best not to send it, and avoid storage limitations.
3. Use [reference data](time-series-insights-add-reference-data-set.md), to avoid sending static data over the network.
4. Share dimension properties among multiple events, to send data over the network more efficiently.
5. Don't use deep array nesting. TSI supports up to two levels of nested arrays that contain objects. TSI flattens arrays in the messages, into multiple events with property value pairs.
6. If only a few measures exist for all or most events, it's better to send these measures as separate properties within the same object. Sending them separately reduces the number of events, and may make queries more performant as fewer events need to be processed. When there are several measures, sending them as values in a single property minimizes the possibility of hitting the maximum property limit.

## Examples

The following two examples demonstrate sending events, to highlight the previous recommendations. Following each example, you can see how the recommendations have been applied.

The examples are based on a scenario where multiple devices send measurements or signals. Measurements or signals could be Flow Rate, Engine Oil Pressure, Temperature, and Humidity. In the first example, there are a few measurements across all devices. In the second example, there are many devices, and each sends many unique measurements.

### Scenario: only a few measurements/signals exist

**Recommendation:** send each measurement as a separate property/column.

In the following example, there is a single IoT Hub message, where the outer array contains a shared section of common dimension values. The outer array uses reference data to increase the efficiency of the message. Reference data contains device metadata, that does not change with every event, but provides useful properties for data analysis. Both batching common dimension values, and employing reference data, saves on bytes sent over the wire, thus making the message more efficient.

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
                "Flow Rate psi": 0.58015072345733643,
                "Engine Oil Pressure psi ": 22.2
            }
        ]
    }
]
```

Reference data table (key property is deviceId):

| deviceId | messageId | deviceLocation |
| --- | --- | --- |
| FXXX | LINE\_DATA | EU |
| FYYY | LINE\_DATA | US |

Time Series Insights event table (after flattening):

| deviceId | messageId | deviceLocation | timestamp | series.Flow Rate ft3/s | series.Engine Oil Pressure psi |
| --- | --- | --- | --- | --- | --- |
| FXXX | LINE\_DATA | EU | 2018-01-17T01:17:00Z | 1.0172575712203979 | 34.7 |
| FXXX | LINE\_DATA | EU | 2018-01-17T01:17:00Z | 2.445906400680542 | 49.2 |
| FYYY | LINE\_DATA | US | 2018-01-17T01:18:00Z | 0.58015072345733643 | 22.2 |

Note the following in the previous example:

- The **deviceId** column serves as the column header for the various devices in a fleet. Attempting to make deviceId value its own property name, would have limited total devices to 595 (S1 environments) or 795 (S2 environments), with the other five columns.

- Unnecessary properties are avoided, for example, make and model information, etc. Since they won't be queried in the future, eliminating them enables better network and storage efficiency.

- Reference data is used to reduce the number of bytes transferred over the network. Two attributes, **messageId** and **deviceLocation** , are joined using the key property, **deviceId**. This data is joined with the telemetry data at ingress time, and subsequently stored in TSI for querying.

- Two layers of nesting are used, which is the maximum amount of nesting supported by TSI. It's critical to avoid deeply nested arrays.

- Measures are sent as separate properties within same object, since there are few measures. Here, **series.Flow Rate psi** and **series.Engine Oil Pressure ft3/s** are unique columns.

### Scenario: several measures exist

**Recommendation:** send measurements as "type", "unit", "value" tuples.

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

Reference Data (key properties are deviceId and series.tagId):

| deviceId | series.tagId | messageId | deviceLocation | type | unit |
| --- | --- | --- | --- | --- | --- |
| FXXX | pumpRate | LINE\_DATA | EU | Flow Rate | ft3/s |
| FXXX | oilPressure | LINE\_DATA | EU | Engine Oil Pressure | psi |
| FYYY | pumpRate | LINE\_DATA | US | Flow Rate | ft3/s |
| FYYY | oilPressure | LINE\_DATA | US | Engine Oil Pressure | psi |

Time Series Insights event table (after flattening):

| deviceId | series.tagId | messageId | deviceLocation | type | unit | timestamp | series.value |
| --- | --- | --- | --- | --- | --- | --- | --- |
| FXXX | pumpRate | LINE\_DATA | EU | Flow Rate | ft3/s | 2018-01-17T01:17:00Z | 1.0172575712203979 |
| FXXX | oilPressure | LINE\_DATA | EU | Engine Oil Pressure | psi | 2018-01-17T01:17:00Z | 34.7 |
| FXXX | pumpRate | LINE\_DATA | EU | Flow Rate | ft3/s | 2018-01-17T01:17:00Z | 2.445906400680542 |
| FXXX | oilPressure | LINE\_DATA | EU | Engine Oil Pressure | Psi | 2018-01-17T01:17:00Z | 49.2 |
| FYYY | pumpRate | LINE\_DATA | US | Flow Rate | ft3/s | 2018-01-17T01:18:00Z | 0.58015072345733643 |
| FYYY | oilPressure | LINE\_DATA | US | Engine Oil Pressure | psi | 2018-01-17T01:18:00Z | 22.2 |

Note the following in the previous example, and similar to the first example:

- columns **deviceId** and **series.tagId** serve as the column headers for the various devices and tags in a fleet. Using each as its own attribute would have limited the query to 594 (S1 environments) or 794 (S2 environments) total devices with the other six columns.

- unnecessary properties were avoided, for the reason cited in the first example.

- reference data is used to reduce the number of bytes transferred over the network by introducing **deviceId**, for a unique pair of **messageId** and **deviceLocation**. A composite key is used, **series.tagId**,  for the unique pair of **type** and **unit.**. The composite key allows the  **deviceId** and **series.tagId** pair to be used, to refer to four values: **messageId, deviceLocation, type,** and **unit**. This data is joined with the telemetry data at ingress time, and subsequently stored in TSI for querying.

- two layers of nesting are used, for the reason cited in the first example.

### For both scenarios

If you have a property with a large number of possible values, it's best to send as distinct values within a single column, rather than creating a new column for each value. From the previous two examples:
  - In the first example, there are few properties that have several values, so it's appropriate to make each a separate property. 
  - However, in the second example, you can see that the measures are not specified as individual properties, but rather, an array of values/measures under a common series property. A new key is sent, **tagId** , which creates a new column, **series.tagId** in the flattened table. New properties are created, **type** and **unit**, using reference data, thus preventing the property limit from being hit.

## Next steps

To put these guidelines into practice, see [Azure Time Series Insights query syntax](/rest/api/time-series-insights/time-series-insights-reference-query-syntax) to learn more about the query syntax for the TSI data access REST API.