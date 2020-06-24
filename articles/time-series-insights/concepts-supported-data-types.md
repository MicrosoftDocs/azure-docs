---
title: 'Supported Data Types - Azure Time Series Insights | Microsoft Docs'
description: Learn about the supported data types in Azure Time Series Insights Preview.
author: lyrana
ms.author: lyhughes
manager: deepakpalled
ms.workload: big-data
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 06/03/2020
ms.custom: seodec18
---


# Supported data types

The following table lists the data types supported by Time Series Insights

| Data type | Description | Example | Property column name in Parquet
|---|---|---|---|
| **bool** | A data type having one of two states: `true` or `false`. | "isQuestionable" : true | isQuestionable_bool
| **datetime** | Represents an instant in time, typically expressed as a date and time of day. Expressed in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. Datetime properties are always stored in UTC format. Time zone offsets, if correctly formatted, will be applied and then the valued stored in UTC. See [this](concepts-streaming-ingestion-event-sources.md#event-source-timestamp) section for more information on the environment timestamp property and datetime offsets | "eventProcessedLocalTime": "2020-03-20T09:03:32.8301668Z" | eventProcessedLocalTime_datetime 
| **double** | A double-precision 64-bit number  | "value": 31.0482941 | value_double
| **long** | A signed 64-bit integer  | "value" : 31 | value_long
| **string** | Text values, must consist of valid UTF-8. |  "site": "DIM_MLGGG" | site_string
| **dynamic** | A complex (non-primitive) type consisting of either an array or property bag (dictionary). Currently only stringified JSON arrays of primitives or arrays of objects not containing the TS ID or timestamp propert(ies) will be stored as dynamic. Read this [article](./concepts-json-flattening-escaping-rules.md) to understand how objects will be flattened and arrays may be un-rolled |  "values": "[197, 194, 189, 188]" | values_dynamic

> [!IMPORTANT]
>
> * Your TSI environment is strongly typed. If devices or tags send both integral and nonintegral data, the device property values will be stored in two separated double and long columns and the [coalesce() function](https://docs.microsoft.com/rest/api/time-series-insights/preview#time-series-expression-and-syntax) should be used when making API calls and defining your Time Series Model Variable expressions.

#### Objects and arrays

You may send complex types such as objects and arrays as part of your event payload. Nested objects will be flattened and arrays will either be stored as `dynamic` or flattened to produce multiple events depending on your environment configuration and JSON shape. To learn more read about the [JSON Flattening and Escaping Rules](./concepts-json-flattening-escaping-rules.md)

## Next steps

* Read the [JSON flattening and escaping rules](./concepts-json-flattening-escaping-rules.md) to understand how events will be stored. 

* Understand your environment's [throughput limitations](concepts-streaming-throughput-limitations.md)

* Learn about [event sources](concepts-streaming-ingestion-event-sources.md) to ingest streaming data.
