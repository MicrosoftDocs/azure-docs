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

The following information summarizes key limits in Time Series Insights General Availability.

### SKU ingress rates and capacities

S1 and S2 SKU ingress rates and capacities are given as follows:

| S1 SKU capacity | Ingress rate | Maximum storage capacity
| --- | --- | --- |
| 1 | 1 GB (1 million events) | 30 GB (30 million events) per month |
| 10 | 10 GB (10 million events) | 300 GB (300 million events) per month |

| S2 SKU capacity | Ingress rate | Maximum storage capacity
| --- | --- | --- |
| 1 | 10 GB (10 million events) | 300 GB (300 million events) per month |
| 10 | 100 GB (100 million events) | 3 TB (3 billion events) per month |

> [!NOTE]
> Capacities scale linearly, so an S1 SKU with capacity 2 supports 2 GB (2 million) events per day ingress rate and 60 GB (60 million events) per month.

The following table summarizes the ingress capacity per unit for each Time Series Insights SKU:

| SKU  | Event count per month  | Event size per month  | Event count per minute | Event size per minute  |
|---------|---------|---------|---------|---------|
|S1     |   30 million     |  30 GB     |  720    |  720 KB   |
|S2     |   300 million    |   300 GB   | 7,200   | 7,200 KB  |

### Property limits

| SKU | Maximum properties |
| --- | --- |
| S1 | 600 properties (columns) |
| S2 | 800 properties (columns) |

### API limits

REST API limits for TIme Series Insights General Availability are specified in the [REST API reference documentation](https://docs.microsoft.com/rest/api/time-series-insights/ga-query-api#limits).