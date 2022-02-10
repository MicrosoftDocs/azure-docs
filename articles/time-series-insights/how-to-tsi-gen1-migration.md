---
title: 'TSI Gen1 migration to Azure Data Explorer | Microsoft Docs'
description: How to migrate Azure Time Series Insights Gen 1 environments to Azure Data Explorer.
ms.service: time-series-insights
services: time-series-insights
author: tedvilutis
ms.author: tvilutis
manager: 
ms.workload: big-data
ms.topic: conceptual
ms.date: 3/1/2022
ms.custom: tvilutis
---

# Migrating TSI Gen1 to Azure Data Explorer

## Overview

The recommendation is to set up Azure Data Explorer cluster with a new consumer group from the Event Hub or IoT Hub and wait for retention period to pass and fill Azure Data Explorer with the same data as TSI environment.
If telemetry data is required to be exported from TSI environment, the suggestion is to use TSI Query API to download the events in batches and serialize in required format. 
For reference data, TSI Explorer or Reference Data API can be used to download reference data set and upload it into Azure Data Explorer as another table. Then, materialized views in Azure Data Explorer can be used to join reference data with telemetry data. Use materialized view with arg_max() aggregation function which will get the latest record per entity, as demonstrated in the following example. For more information about materialized views, read the following documentation: [Materialized views use cases] (./data-explorer/kusto/management/materialized-views/materialized-view-overview.md#materialized-views-use-cases).

```
.create materialized-view MVName on table T
{
    T
    | summarize arg_max(Column1,*) by Column2
}
```
## Translate TSI Queries to KQL

For queries, the recommendation is to use KQL in Azure Data Explorer.
