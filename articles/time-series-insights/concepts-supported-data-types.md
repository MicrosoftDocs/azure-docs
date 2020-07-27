---
title: 'Supported data types - Azure Time Series Insights Gen2 | Microsoft Docs'
description: Learn about the supported data types in Azure Time Series Insights Gen2.
author: lyrana
ms.author: lyhughes
manager: deepakpalled
ms.workload: big-data
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 07/23/2020
---

# Supported data types

The following table lists the data types supported by Azure Time Series Insights Gen2

| Data type | Description | Example | Property column name in Parquet
|---|---|---|---|
| **bool** | A data type having one of two states: `true` or `false`. | `"isQuestionable" : true` | isQuestionable_bool
| **datetime** | Represents an instant in time, typically expressed as a date and time of day. Expressed in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. Datetime properties are always stored in UTC format. Time zone offsets, if correctly formatted, will be applied and then the valued stored in UTC. See [this](concepts-streaming-ingestion-event-sources.md#event-source-timestamp) section for more information on the environment timestamp property and datetime offsets | `"eventProcessedLocalTime": "2020-03-20T09:03:32.8301668Z"` | eventProcessedLocalTime_datetime
| **double** | A double-precision 64-bit number  | `"value": 31.0482941` | value_double
| **long** | A signed 64-bit integer  | `"value" : 31` | value_long
| **string** | Text values, must consist of valid UTF-8. Null and empty strings are treated the same. |  `"site": "DIM_MLGGG"` | site_string
| **dynamic** | A complex (non-primitive) type consisting of either an array or property bag (dictionary). Currently only stringified JSON arrays of primitives or arrays of objects not containing the TS ID or timestamp property(ies) will be stored as dynamic. Read this [article](./concepts-json-flattening-escaping-rules.md) to understand how objects will be flattened and arrays may be unrolled. Payload properties stored as this type are accessible through the Azure Time Series Insights Gen2 Explorer and the `GetEvents` Query API. |  `"values": "[197, 194, 189, 188]"` | values_dynamic

## Sending mixed data types

Your Azure Time Series Insights Gen2 environment is strongly typed. If devices or tags send data of different types for a device property, values will be stored in two separated columns and the [coalesce() function](https://docs.microsoft.com/rest/api/time-series-insights/preview#other-functions) should be used when defining your Time Series Model Variable expressions in API calls.

The Azure Time Series Insights Explorer offers a way to auto-coalesce the separate columns of the same device property. In the example below, the sensor sends a `PresentValue` property that can be both a Long or Double. To query against all stored values (regardless of data type) of the `PresentValue` property, choose `PresentValue (Double | Long)` and the columns will be coalesced for you.

[![Explorer auto coalesce](media\concepts-supported-data-types/explorer-auto-coalesce-sample.png)](media\concepts-supported-data-types/explorer-auto-coalesce-sample.png#lightbox)

## Objects and arrays

You may send complex types such as objects and arrays as part of your event payload. Nested objects will be flattened and arrays will either be stored as `dynamic` or flattened to produce multiple events depending on your environment configuration and JSON shape. To learn more read about the [JSON Flattening and Escaping Rules](./concepts-json-flattening-escaping-rules.md)

## Next steps

* Read the [JSON flattening and escaping rules](./concepts-json-flattening-escaping-rules.md) to understand how events will be stored.

* Understand your environment's [throughput limitations](./concepts-streaming-ingress-throughput-limits.md)

* Learn about [event sources](concepts-streaming-ingestion-event-sources.md) to ingest streaming data.
