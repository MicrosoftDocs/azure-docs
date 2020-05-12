---
title: 'Data querying in Preview - Azure Time Series Insights | Microsoft Docs'
description: Data querying concepts and HTTP REST API overview in Azure Time Series Insights Preview.
author: shreyasharmamsft
ms.author: shresha
manager: dpalled
ms.workload: big-data
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 03/25/2020
ms.custom: seodec18
---

# Data querying in Azure Time Series Insights Preview

Azure Time Series Insights enables data querying on events and metadata stored in the environment via public surface APIs. These APIs also are used by the [Time Series Insights Explorer](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-update-explorer).

Three primary API categories are available in Time Series Insights:

* **Environment APIs**: These APIs enable queries on the Time Series Insights environment itself. These can be used to gather the list of environments the caller has access to and environment metadata.
* **Time Series Model-Query (TSM-Q) APIs**: Enables create, read, update, and delete (CRUD) operations on metadata stored in the Time Series Model of the environment. These can be used to access and edit the instances, types, and hierarchies.
* **Time Series Query (TSQ) APIs**: Enables retrieval of telemetry or events data as it's recorded from the source provider and enables performant computations and aggregations on the data using advanced scalar and aggregate functions.

Time Series Insights uses a rich string-based expression language, [Time Series Expression (TSX)](https://docs.microsoft.com/rest/api/time-series-insights/preview#time-series-expression-and-syntax), for expressing calculations.

## Azure Time Series Insights core APIs

The following core APIs are supported.

[![Time Series Query overview](media/v2-update-tsq/tsq.png)](media/v2-update-tsq/tsq.png#lightbox)

## Environment APIs

* [Get Environments API](https://docs.microsoft.com/rest/api/time-series-insights/management/environments/get): Returns the list of environments that the caller is authorized to access.
* [Get Environments Availability API](https://docs.microsoft.com/rest/api/time-series-insights/dataaccess(preview)/query/getavailability): Returns the distribution of event count over the event timestamp `$ts`. This API helps determine if there are any events in the environment by returning the count of events broken into intervals of time, if any exist.
* [Get Event Schema API](https://docs.microsoft.com/rest/api/time-series-insights/dataaccess(preview)/query/geteventschema): Returns the event schema metadata for a given search span. This API helps retrieve all metadata and properties available in the schema for the given search span.

## Time Series Model-Query (TSM-Q) APIs

Most of these APIs support batch execution operation to enable batch CRUD operations on multiple Time Series Model entities:

* [Model Settings API](https://docs.microsoft.com/rest/api/time-series-insights/preview#model-settings-api): Enables *GET* and *PATCH* on the default type and the model name of the environment.
* [Types API](https://docs.microsoft.com/rest/api/time-series-insights/preview#types-api): Enables CRUD on Time Series types and their associated variables.
* [Hierarchies API](https://docs.microsoft.com/rest/api/time-series-insights/preview#hierarchies-api): Enables CRUD on Time Series hierarchies and their associated field paths.
* [Instances API](https://docs.microsoft.com/rest/api/time-series-insights/preview#instances-api): Enables CRUD on Time Series instances and their associated instance fields. Additionally, the Instances API supports the following operations:
  * [Search](https://docs.microsoft.com/rest/api/time-series-insights/dataaccess(preview)/timeseriesinstances/search): Retrieves a partial list of hits on search for time series instances based on instance attributes.
  * [Suggest](https://docs.microsoft.com/rest/api/time-series-insights/dataaccess(preview)/timeseriesinstances/suggest): Searches and suggests a partial list of hits on search for time series instances based on instance attributes.

## Time Series Query (TSQ) APIs

These APIs are available on all both stores in our multilayered storage solution in Time Series Insights. Query URL parameters are used to specify the [store type](https://docs.microsoft.com/rest/api/time-series-insights/dataaccess(preview)/query/execute#uri-parameters) the query should execute on:

* [Get Events API](https://docs.microsoft.com/rest/api/time-series-insights/dataaccess(preview)/query/execute#getevents): Enables query and retrieval of raw events and the associated event timestamps as they're recorded in Time Series Insights from the source provider. This API allows retrieval of raw events for a given Time Series ID and search span. This API supports pagination to retrieve the complete response dataset for the selected input. 

* [Get Series API](https://docs.microsoft.com/rest/api/time-series-insights/dataaccess(preview)/query/execute#getseries): Enables query and retrieval of computed values and the associated event timestamps by applying calculations defined by variables on raw events. These variables can be defined in either the Time Series Model or provided inline in the query. This API supports pagination to retrieve the complete response dataset for the selected input. 

* [Aggregate Series API](https://docs.microsoft.com/rest/api/time-series-insights/dataaccess(preview)/query/execute#aggregateseries): Enables query and retrieval of aggregated values and the associated interval timestamps by applying calculations defined by variables on raw events. These variables can be defined in either the Time Series Model or provided inline in the query. This API supports pagination to retrieve the complete response dataset for the selected input. 
  
  For a specified search span and interval, this API returns an aggregated response per variable per interval for a Time Series ID. The number of intervals in the response dataset is calculated by counting epoch ticks (the number of milliseconds that have elapsed since Unix epoch - Jan 1st, 1970) and dividing the ticks by the interval span size specified in the query.

  The timestamps returned in the response set are of the left interval boundaries, not of the sampled events from the interval. 

## Next steps

- Read more about different variables that can be defined in the [Time Series Model](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-update-tsm).
- Read more about how to query data from the [Time Series Insights Explorer](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-update-explorer).
