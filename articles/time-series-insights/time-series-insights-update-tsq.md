---
title: 'Azure Time Series Insights Preview data querying | Microsoft Docs'
description: Azure Time Series Insights Preview data querying.
author: deepakpalled
ms.author: dpalled
manager: cshankar
ms.workload: big-data
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 10/21/2019
ms.custom: seodec18
---

# Data querying

Azure Time Series Insights Preview enables data querying on events and metadata stored in the environment via public surface APIs. These APIs also are used in the [Time Series Insights Preview explorer](./time-series-insights-update-explorer.md).

Three primary API categories are available in Time Series Insights:

* **Environment APIs**: These APIs enable queries on the Time Series Insights environment itself. Examples of queries are the list of environments the caller has access to and environment metadata.
* **Time Series Model-Query (TSM-Q) APIs**: Enables create, read, update, and delete (CRUD) operations on metadata stored in the environment part of the time series model. Examples are instances, types, and hierarchies.
* **Time Series Query (TSQ) APIs**: Enables retrieval of telemetry or events data as it's recorded from the source provider or by reducing the data using scalar and aggregate functions stored part of variables. These APIs can perform operations to transform, combine, and apply computations on time series data.

Time Series Insights uses a rich string-based expression language, [Time Series Expression (TSX)](https://docs.microsoft.com/rest/api/time-series-insights/preview-tsx), for expressing calculations.

## Azure Time Series Insights Preview core APIs

The following core APIs are supported.

[![Time Series Query overview](media/v2-update-tsq/tsq.png)](media/v2-update-tsq/tsq.png#lightbox)

## Environment APIs

The following Environment APIs are available:

* [Get Environment API](https://docs.microsoft.com/rest/api/time-series-insights/preview-env#get-environments-api): Returns the list of environments that the caller is authorized to access.
* [Get Environment Availability API](https://docs.microsoft.com/rest/api/time-series-insights/preview-env#get-environment-availability-api): Returns the distribution of event count over the event timestamp `$ts`. This API helps determine if there are any events in the timestamp by returning the count of events, if any exist.
* [Get Event Schema API](https://docs.microsoft.com/rest/api/time-series-insights/preview-env#get-event-schema-api): Returns the event schema metadata for a given search span. This API helps retrieve all metadata and properties available in the schema for the given search span.

## Time Series Model-Query (TSM-Q) APIs

The following Time Series Model-Query APIs are available. Most of these APIs support batch execution operation to enable batch CRUD operations on multiple time series model entities:

* [Model Settings API](https://docs.microsoft.com/rest/api/time-series-insights/preview-model#model-settings-api): Enables *GET* and *PATCH* on the default type and the model name of the environment.
* [Types API](https://docs.microsoft.com/rest/api/time-series-insights/preview-model#types-api): Enables CRUD on Time Series types and their associated variables.
* [Hierarchies API](https://docs.microsoft.com/rest/api/time-series-insights/preview-model#hierarchies-api): Enables CRUD on Time Series hierarchies and their associated field paths.
* [Instances API](https://docs.microsoft.com/rest/api/time-series-insights/preview-model#instances-api): Enables CRUD on Time Series instances and their associated instance fields. Additionally, the Instances API supports the following operations:
  * [Search](https://docs.microsoft.com/rest/api/time-series-insights/dataaccess(preview)/timeseriesinstances/search): Retrieves a partial list of hits on search for time series instances based on instance attributes.
  * [Suggest](https://docs.microsoft.com/rest/api/time-series-insights/dataaccess(preview)/timeseriesinstances/suggest): Searches and suggests a partial list of hits on search for time series instances based on instance attributes.

## Time Series Query (TSQ) APIs

The following Time Series Query APIs are available. These APIs are available on all supported multilayered storages in Time Series Insights. Query URL parameters are used to specify the [store type](https://docs.microsoft.com/rest/api/time-series-insights/dataaccess(preview)/query/execute#uri-parameters) the query should execute on:

* [Get Events API](https://docs.microsoft.com/rest/api/time-series-insights/preview-query#get-events-api): Enables query and retrieval of Time Series Insights data from events as they're recorded in Time Series Insights from the source provider. This API allows retrieval of raw events for a given Time Series ID and search span. This API supports pagination to retrieve the complete dataset for the selected input. 

* [Get Series API](https://docs.microsoft.com/rest/api/time-series-insights/preview-query#get-series-api): Enables query and retrieval of Time Series Insights data from captured events by using data recorded on the wire. The values that are returned are based on the variables that were defined in the model or provided inline. This API supports pagination to retrieve the complete dataset for the selected input. This API helps in defining calculated properties or columns.

    >[!NOTE]
    > The Aggregation clause is ignored even if it's specified in a model or provided inline.

  The Get Series API returns a Time Series value for each variable for each interval. A Time Series value is a format that Time Series Insights uses for output JSON from a query. The values that are returned are based on the Time Series ID and the set of variables that were provided.

* [Aggregate Series API](https://docs.microsoft.com/rest/api/time-series-insights/preview-query#aggregate-series-api): Enables query and retrieval of Time Series Insights data from captured events by sampling and aggregating recorded data. This API supports continuable execution by using [continuation tokens](https://docs.microsoft.com/rest/api/time-series-insights/dataaccess(preview)/query/execute#queryresultpage).

  The Aggregate Series API returns a Time Series value for each variable for each interval. The values are based on the Time Series ID and the set of variables that were provided. The Aggregate Series API achieves reduction by using variables stored in the Time Series Model or provided inline to aggregate or sample data.

## Next steps

- Learn more about [storage and ingress](./time-series-insights-update-storage-ingress.md) in Azure Time Series Insights Preview.
- Read the Time Series Insights Preview [data modeling](./time-series-insights-update-tsm.md) article.
- Discover [best practices for choosing a Time Series ID](./time-series-insights-update-how-to-id.md).
