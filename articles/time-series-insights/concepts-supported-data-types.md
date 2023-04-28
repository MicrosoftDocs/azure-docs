---
title: 'Supported data types - Azure Time Series Insights Gen2 | Microsoft Docs'
description: Learn about the supported data types in Azure Time Series Insights Gen2.
author: tedvilutis
ms.author: tvilutis
manager: cnovak
ms.reviewer: orspodek
ms.workload: big-data
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 01/19/2021
---

# Supported data types

[!INCLUDE [retirement](../../includes/tsi-retirement.md)]

The following table lists the data types supported by Azure Time Series Insights Gen2

| Data type | Description | Example | [Time Series Expression syntax](/rest/api/time-series-insights/reference-time-series-expression-syntax) | Property column name in Parquet
|---|---|---|---|---|
| **bool** | A data type having one of two states: `true` or `false`. | `"isQuestionable" : true` | `$event.isQuestionable.Bool` or `$event['isQuestionable'].Bool` | `isQuestionable_bool`
| **datetime** | Represents an instant in time, typically expressed as a date and time of day. Expressed in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. Datetime properties are always stored in UTC format. Time zone offsets, if correctly formatted, will be applied and then the valued stored in UTC. See [this](concepts-streaming-ingestion-event-sources.md#event-source-timestamp) section for more information on the environment timestamp property and datetime offsets | `"eventProcessedLocalTime": "2020-03-20T09:03:32.8301668Z"` |  If "eventProcessedLocalTime" is the event source timestamp: `$event.$ts`. If it's another JSON property: `$event.eventProcessedLocalTime.DateTime` or `$event['eventProcessedLocalTime'].DateTime` | `eventProcessedLocalTime_datetime`
| **double** | A double-precision 64-bit number  | `"value": 31.0482941` | `$event.value.Double` or `$event['value'].Double` |  `value_double`
| **long** | A signed 64-bit integer  | `"value" : 31` | `$event.value.Long` or `$event['value'].Long` |  `value_long`
| **string** | Text values, must consist of valid UTF-8. Null and empty strings are treated the same. |  `"site": "DIM_MLGGG"`| `$event.site.String` or `$event['site'].String`| `site_string`
| **dynamic** | A complex (non-primitive) type consisting of either an array or property bag (dictionary). Currently only stringified JSON arrays of primitives or arrays of objects not containing the TS ID or timestamp property(ies) will be stored as dynamic. Read this [article](./concepts-json-flattening-escaping-rules.md) to understand how objects will be flattened and arrays may be unrolled. Payload properties stored as this type are only accessible by selecting `Explore Events` in the Time Series Insights Explorer to view raw events, or through the [`GetEvents`](/rest/api/time-series-insights/dataaccessgen2/query/execute#getevents) Query API for client-side parsing. |  `"values": "[197, 194, 189, 188]"` | Referencing dynamic types in a Time Series Expression is not yet supported | `values_dynamic`

> [!NOTE]
> 64 bit integer values are supported, but the largest number that the Azure Time Series Insights Explorer can safely express is 9,007,199,254,740,991 (2^53-1) due to JavaScript limitations. If you work with numbers in your data model above this, you can reduce the size by  creating a [Time Series Model variable](./concepts-variables.md#numeric-variables) and [converting](/rest/api/time-series-insights/reference-time-series-expression-syntax#conversion-functions) the value.

> [!NOTE]
> **String** type is not nullable:
>
> * A [Time Series Expression (TSX)](/rest/api/time-series-insights/reference-time-series-expression-syntax) expressed in a [Time Series Query](/rest/api/time-series-insights/reference-query-apis) comparing the value of an empty string (**''**) against **NULL** will behave the same way: `$event.siteid.String = NULL` is equivalent to `$event.siteid.String = ''`.
> * The API may return **NULL** values even if original events contained empty strings.
> * Do not take dependency on **NULL** values in **String** columns to do comparisons or evaluations, treat them the same way as empty strings.

## Sending mixed data types

Your Azure Time Series Insights Gen2 environment is strongly typed. If devices or tags send data of different types for a device property, values will be stored in two separated columns and the [coalesce() function](/rest/api/time-series-insights/reference-time-series-expression-syntax#other-functions) should be used when defining your Time Series Model Variable expressions in API calls.

The Azure Time Series Insights Explorer offers a way to auto-coalesce the separate columns of the same device property. In the example below, the sensor sends a `PresentValue` property that can be both a Long or Double. To query against all stored values (regardless of data type) of the `PresentValue` property, choose `PresentValue (Double | Long)` and the columns will be coalesced for you.

[![Explorer auto coalesce](media\concepts-supported-data-types/explorer-auto-coalesce-sample.png)](media\concepts-supported-data-types/explorer-auto-coalesce-sample.png#lightbox)

## Objects and arrays

You may send complex types such as objects and arrays as part of your event payload. Nested objects will be flattened and arrays will either be stored as `dynamic` or flattened to produce multiple events depending on your environment configuration and JSON shape. To learn more read about the [JSON Flattening and Escaping Rules](./concepts-json-flattening-escaping-rules.md)

## Next steps

* Read the [JSON flattening and escaping rules](./concepts-json-flattening-escaping-rules.md) to understand how events will be stored.

* Understand your environment's [throughput limitations](./concepts-streaming-ingress-throughput-limits.md)

* Learn about [event sources](concepts-streaming-ingestion-event-sources.md) to ingest streaming data.
