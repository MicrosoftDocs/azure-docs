---
title: Azure Time Series Insights (preview) Data Querying | Microsoft Docs
description: Azure Time Series Insights (preview) Data Querying
author: ashannon7
ms.author: anshan
ms.workload: big-data
manager: cshankar
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 12/03/2018
---

# Data querying

Azure Time Series Insights (TSI) enables data querying on events and metadata stored in the environment via public surface APIs, these APIs are the same as those that are used in the TSI explorer.

There are three categories of APIs that are available in TSI namely, environment APIs, time series model APIs, and time series query APIs.

* Environment APIs enable querying the TSI environment itself, like list of environments caller has access to, environment metadata, etc.

* Time series model-query (TSM-Q) APIs enable create, read, update, and delete operations on metadata stored in the environment part of the time series model. Like instances, types, hierarchies, etc.

* Time series query (TSQ) APIs enable retrieval of events data as it is recorded from source provider, or can perform operations to transform, combine, and perform computations on time series data.

Time series expression language (TSX) is leveraged in time series model, to enable composition of advanced computation.

## Core APIs

Below are the core APIs we support.

![tsq][1]

### Environment APIs

The following are the environment APIs available:

* Get Environments API – Returns the list of environments that the caller is authorized to access.
* Get Environment Availability API – Returns the distribution of event count over the event timestamp `$ts`. This API helps determine if there are any events in the timestamp by returning the count of events if exist.
* Get Event Schema API – Returns the event schema metadata for a given search span. This API helps retrieve all metadata/properties available in the schema for the given search span.

### Time series model-query (TSM-Q) APIs

The following are the time series model query APIs available:

* Model Settings API - Enables get and patch on the default type and the model name of the environment.
* Types API – Enables CRUD on Time Series Types and their associated Variables.
* Hierarchies API – Enables CRUD on Time Series Hierarchies and their associated field paths.
* Instances API – Enables CRUD on Time Series Instances and their associated instance fields.

### Time series query (TSQ) APIs

The following are the time series query APIs available:

* [GET EVENTS API](https://docs.microsoft.com/rest/api/time-series-insights/preview-query#get-events-api) – The getEvents API enables query and retrieval of Time Series Insights data from events as they are recorded in Time Series Insights from the source provider.

* [GET SERIES API](https://docs.microsoft.com/rest/api/time-series-insights/preview-query#get-series-api)  – Enables query and retrieval of Time Series Insights data from captured events by leveraging data recorded on the wire using the variables define in model or provided inline.

    >[!NOTE]
    > The Aggregation clause is ignored in getSeries, even if specified part of variables in model or provided inline.

  The getSeries API returns a TSV (Time Series Value, a format Time Series Insights use for output JSON from query) for each variable for each interval, based on the provided Time Series ID and the set of provided variables.

* [GET AGGREGATE API](https://docs.microsoft.com/rest/api/time-series-insights/preview-query#aggregate-series-api) – Enables query and retrieval of Time Series Insights data from captured events by sampling and aggregating recorded data.

  The aggregateSeries API returns a TSV for each variable for each interval, based on the provided **Time Series ID** and the set of provided variables. The aggregateSeries API achieves reduction by leveraging variables stored in TSM or provided inline to aggregate or sample data.

  Supported Aggregate types: `Min`, `Max`, `Sum`, `Count`, `Average`

## Next steps

Read the [Azure TSI (Preview) Storage and Ingress](./time-series-insights-update-storage-ingress.md).

Read about [Data modeling](./time-series-insights-update-tsm.md).

Read about [Best practices when choosing a Time Series ID](./time-series-insights-update-how-to-id.md).

<!-- Images -->
[1]: media/v2-update-tsq/tsq.png
