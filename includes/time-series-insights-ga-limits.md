---
title: include file
description: include file
services: digital-twins
ms.service: digital-twins
ms.topic: include
ms.date: 10/16/2019
author: deepakpalled
ms.author: dpalled
manager: cshankar
ms.custom: include file
---

The following summarizes key limits in General Availability.

### SKU ingress rates and capacities

S1 and S2 SKU ingress rates and capacities provide flexibility when configuring a new Time Series Insights environment.

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

S2 SKU environments support substantially more events per month and have a significantly higher ingress capacity.

| SKU  | Event count per month  | Event size per month  | Event count per minute | Event size per minute  |
|---------|---------|---------|---------|---------|
| S1     |   30 million     |  30 GB     |  720    |  720 KB   |
 |S2     |   300 million    |   300 GB   | 7,200   | 7,200 KB  |

### Property limits

GA property limits depend on the SKU environment that's selected. Supplied event properties have corresponding JSON, CSV, and chart columns that can viewed within the [Time Series Insights Explorer](https://docs.microsoft.com/azure/time-series-insights/time-series-quickstart).

| SKU | Maximum properties |
| --- | --- |
| S1 | 600 properties (columns) |
| S2 | 800 properties (columns) |

### Event sources

A maximum of two event sources per instance is supported. 

* Learn how to [Add an event hub source](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-how-to-add-an-event-source-eventhub).
* Configure [an IoT hub source](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-how-to-add-an-event-source-iothub).

### API limits

REST API limits for Time Series Insights General Availability are specified in the [REST API reference documentation](https://docs.microsoft.com/rest/api/time-series-insights/ga-query-api#limits).