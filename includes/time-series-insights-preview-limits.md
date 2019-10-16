---
 title: include file
 description: include file
 services: digital-twins
 author: kingdomofends
 ms.service: digital-twins
 ms.topic: include
 ms.date: 10/16/2019
 ms.author: v-adgera
 ms.custom: include file
---

### GA and Preview comparison

The following table summarizes several key differences between Azure Time Series Insights GA and Preview instances.

| | GA | Preview |
| --- | --- | ---|
| First-class citizen | Event-centric | Time-series-centric |
| Semantic reasoning | Low-level (reference data) | High-level (models) |
| Data contextualization | Non-device level | Device and Non-device level |
| Compute logic storage | No | Stored in type variables part of model |
| Storage and access control | No | Enabled via model |
| Aggregations/Sampling | No | Event-weighted and time-weighted |
| Signal reconstruction | No | Interpolation |
| Production of derived time series | No | Yes, merges and joins |
| Language flexibility | Non-composable | Composable |
| Expression language | Predicate string | Time series expressions (predicate strings, values, expressions, and functions) |

### Property limits

Time Series Insights property limits have been increased to 1000 from a maximum cap of 800 in GA. Supplied event properties have corresponding JSON, CSV, and chart columns that can viewed within the [Time Series Insights Preview Explorer](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-update-quickstart).

| SKU | Maximum properties |
| --- | --- |
| Preview PAYG | 1000 properties (columns) |
| GA S1 | 600 properties (columns) |
| GA S2 | 800 properties (columns) |

### API limits

REST API limits for Time Series Insights Preview are specified in the [REST API reference documentation](https://docs.microsoft.com/rest/api/time-series-insights/preview-query#limits).