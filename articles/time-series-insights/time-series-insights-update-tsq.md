---
title: Azure Time Series Insights (preview) data querying | Microsoft Docs
description: Azure Time Series Insights (preview) data querying
author: ashannon7
ms.author: anshan
ms.workload: big-data
manager: cshankar
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 12/04/2018
---

# Data querying

Azure Time Series Insights (TSI) enables data querying on events and metadata stored in the environment via public surface APIs. These APIs are also used in the [TSI explorer](./time-series-insights-update-explorer.md).

There are three primary API categories that are available in Azure TSI:

* Environment APIs enable querying the TSI environment itself, like list of environments caller has access to, environment metadata, etc.

* Time series model-query (TSM-Q) APIs enable create, read, update, and delete operations on metadata stored in the environment part of the time series model. Like instances, types, hierarchies, etc.

* Time series query (TSQ) APIs enable retrieval of events data as it is recorded from source provider, or can perform operations to transform, combine, and perform computations on time series data.

The [Time Series Expression language](https://docs.microsoft.com/rest/api/time-series-insights/preview-tsx) (TSX) is a powerful, fourth, category. It uses Time Series Models (TSM), to enable composition of advanced computation.

## Azure Time Series Insights core APIs

Below are the core APIs we support.

![tsq][1]

### The Environment APIs

The following are the Environment APIs available:

* [Get Environment API](https://docs.microsoft.com/rest/api/time-series-insights/preview-env#get-environments-api): Returns the list of environments that the caller is authorized to access.
* [Get Environment Availability API](https://docs.microsoft.com/rest/api/time-series-insights/preview-env#get-environment-availability-api): Returns the distribution of event count over the event timestamp `$ts`. This API helps determine if there are any events in the timestamp by returning the count of events if exist.
* [Get Event Schema API](https://docs.microsoft.com/rest/api/time-series-insights/preview-env#get-event-schema-api): Returns the event schema metadata for a given search span. This API helps retrieve all metadata/properties available in the schema for the given search span.

### Time Series Model-Query (TSM-Q) APIs

The following are the Time Series Model-Query APIs available:

* [Model Settings API](https://docs.microsoft.com/rest/api/time-series-insights/preview-model#model-settings-api): Enables get and patch on the default type and the model name of the environment.
* [Types API](https://docs.microsoft.com/rest/api/time-series-insights/preview-model#types-api): Enables CRUD on Time Series Types and their associated Variables.
* [Hierarchies API](https://docs.microsoft.com/rest/api/time-series-insights/preview-model#hierarchies-api): Enables CRUD on Time Series Hierarchies and their associated field paths.
* [Instances API](https://docs.microsoft.com/rest/api/time-series-insights/preview-model#instances-api): Enables CRUD on Time Series Instances and their associated instance fields.

### The Time Series Query (TSQ) APIs

The following are the Time Series Query APIs available:

* [Get Events API](https://docs.microsoft.com/rest/api/time-series-insights/preview-query#get-events-api): The Get Events API enables query and retrieval of TSI data from events as they are recorded in Azure TSI from the source provider.

* [Get Series API](https://docs.microsoft.com/rest/api/time-series-insights/preview-query#get-series-api): Enables query and retrieval of Azure TSI data from captured events by leveraging data recorded on the wire using the variables define in model or provided inline.

    >[!NOTE]
    > The Aggregation clause is ignored even if specified in a model or provided inline.

  The Get Series API returns a TSV (Time Series Value, a format TSI uses for output JSON from query) for each variable for each interval, based on the provided **Time Series ID** and the set of provided variables.

* [Aggregate Series API](https://docs.microsoft.com/rest/api/time-series-insights/preview-query#aggregate-series-api): Enables query and retrieval of TSI data from captured events by sampling and aggregating recorded data.

  The Aggregate Series API returns a TSV for each variable for each interval, based on the provided **Time Series ID** and the set of provided variables. The Aggregate Series API achieves reduction by leveraging variables stored in TSM or provided inline to aggregate or sample data.

  Supported Aggregate types: `Min`, `Max`, `Sum`, `Count`, `Average`

## Next steps

Read the [Azure TSI (Preview) Storage and Ingress](./time-series-insights-update-storage-ingress.md).

Read about [Data modeling](./time-series-insights-update-tsm.md).

Read about [Best practices when choosing a Time Series ID](./time-series-insights-update-how-to-id.md).

<!-- Images -->
[1]: media/v2-update-tsq/tsq.png
