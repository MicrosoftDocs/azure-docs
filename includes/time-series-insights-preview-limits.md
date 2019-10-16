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

The following table compares Azure Time Series Insights GA and Preview summarizing key differences.

### GA and preview comparison

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

| SKU | Maximum properties |
| --- | --- |
| Preview PAYG | 1000 properties (columns) |
| GA S1 | 600 properties (columns) |
| GA S2 | 800 properties (columns) |

### API limits

REST API limits for TIme Series Insights Preview are specified in the [REST API reference documentation](https://docs.microsoft.com/rest/api/time-series-insights/preview-query#limits).