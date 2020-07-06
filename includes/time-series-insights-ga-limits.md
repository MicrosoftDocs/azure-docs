---
title: include file
description: include file
services: digital-twins
ms.service: digital-twins
ms.topic: include
ms.date: 02/03/2020
author: deepakpalled
ms.author: dpalled
manager: cshankar
ms.custom: include file
---

The following summarizes key limits in General Availability.

### SKU ingress rates and capacities

S1 and S2 SKU ingress rates and capacities provide flexibility when configuring a new Time Series Insights environment. Your SKU capacity indicates your daily ingress rate based on number of events or bytes stored, whichever comes first. Note that ingress is measured *per minute*, and **throttling** is applied using the token bucket algorithm. Ingress is measured in 1-KB blocks. For example a 0.8-KB actual event would be measured as one event, and a 2.6-KB event is counted as three events.

| S1 SKU capacity | Ingress rate | Maximum storage capacity
| --- | --- | --- |
| 1 | 1 GB (1 million events) per day | 30 GB (30 million events) per month |
| 10 | 10 GB (10 million events) per day | 300 GB (300 million events) per month |

| S2 SKU capacity | Ingress rate | Maximum storage capacity
| --- | --- | --- |
| 1 | 10 GB (10 million events) per day | 300 GB (300 million events) per month |
| 10 | 100 GB (100 million events) per day | 3 TB (3 billion events) per month |

> [!NOTE]
> Capacities scale linearly, so an S1 SKU with capacity 2 supports 2 GB (2 million) events per day ingress rate and 60 GB (60 million events) per month.

S2 SKU environments support substantially more events per month and have a significantly higher ingress capacity.

| SKU  | Event count per month  | Event count per minute | Event size per minute  |
|---------|---------|---------|---------|---------|
| S1     |   30 million   |  720    |  720 KB   |
 |S2     |   300 million   | 7,200   | 7,200 KB  |

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