---
title: Explore data using the Azure Time Series Insights explorer | Microsoft Docs
description: This article describes how to use the Azure Time Series Insights explorer in your web browser to quickly see a global view of your big data and validate your IoT environment.
ms.service: time-series-insights
services: time-series-insights
author: ashannon7
ms.author: anshan
manager: cshankar
ms.reviewer: v-mamcge, jasonh, kfile, anshan
ms.devlang: csharp
ms.workload: big-data
ms.topic: conceptual
ms.date: 09/18/2018
---

# Time Series Insights JavaScript Client Overview

## Server Client

The Time Series Insights JavaScript Client (TSI JS Client) exposes methods for accessing the TSI API via the server member of the TSIClient

* [aggregateExpression](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-sdk-aggregateexpression?branch=pr-en-us-53512)

* [getAggregates (token: string, uri: string, tsxArray: Array<any>, options: any)](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-sdk-getaggregates?branch=pr-en-us-53512)

* [createPromiseFromXhr (uri, httpMethod, payload, token, responseTextFormat)](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-sdk-createPromiseFromXhr?branch=pr-en-us-53512)

* [getTimeseriesInstances(token: string, environmentFqdn: string)](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-sdk-getTimeseriesInstances?branch=pr-en-us-53512)

* [getTimeseriesTypes(token: string, environmentFqdn: string)](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-sdk-getTimeseriesTypes?branch=pr-en-us-53512)

* [getTimeseriesHierarchies(token: string, environmentFqdn: string)](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-sdk-getTimeseriesHierarchies?branch=pr-en-us-53512)

* [getTimeseriesModel(token: string, environmentFqdn: string)](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-sdk-getTimeseriesModel?branch=pr-en-us-53512)

* [getReferenceDatasetRows(token: string, environmentFqdn: string, datasetId: string)](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-sdk-getReferenceDatasetRows?branch=pr-en-us-53512)

* [getEnvironments(token: string, endpoint = 'https://api.timeseries.azure.com')](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-sdk-getEnvironments?branch=pr-en-us-53512)

* [getMetadata(token: string, environmentFqdn: string, minMillis: number, maxMillis: number)](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-sdk-getMetadata?branch=pr-en-us-53512)

* [getAvailability(token: string, environmentFqdn: string)](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-sdk-getAvailability?branch=pr-en-us-53512)

* [getEvents(token: string, environmentFqdn: string, predicateObject,  options: any, minMillis, maxMillis)](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-sdk-getEvents?branch=pr-en-us-53512)

* [getDataWithContinuationBatch(token, resolve, reject, rows, url, verb, propName, continuationToken = null)](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-sdk-getDataWithContinuationBatch?branch=pr-en-us-53512)

* [Options](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-sdk-option?branch=pr-en-us-53512)

* Example payload

## UX Client

* Transform aggregates

* transformAggregatesForVisualization transformOptions parameter

* transformedResult structure

* Rendering a line chart

* [chartOptions parameter](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-sdk-chartOptions?branch=pr-en-us-53512)

* chartOptions example

## UX Client Components

* [AvailabilityChart](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-sdk-availabilityChart?branch=pr-en-us-53512)

* [ContextMenu](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-sdk-contextMenu?branch=pr-en-us-53512)

* [DateTimePicker](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-sdk-dateTimePicker?branch=pr-en-us-53512)

* [EventSeries](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-sdk-eventSeries?branch=pr-en-us-53512)

* [Grid](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-sdk-grid?branch=pr-en-us-53512)

* [Heatmap](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-sdk-heatmap?branch=pr-en-us-53512)

* [HeatmapCanvas](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-sdk-heatmapCanvas?branch=pr-en-us-53512)

* [Hierarchy](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-sdk-hierarchy?branch=pr-en-us-53512)

* [Legend](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-sdk-legend?branch=pr-en-us-53512)

* [LineChart](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-sdk-lineChart?branch=pr-en-us-53512)

* [PieChart](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-sdk-pieChart?branch=pr-en-us-53512)

* [Slider](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-sdk-slider?branch=pr-en-us-53512)

* [StateSeries](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-sdk-stateSeries?branch=pr-en-us-53512)

* [TimezonePicker](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-sdk-timezonePicker?branch=pr-en-us-53512)

* [Tooptip](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-sdk-tooptip?branch=pr-en-us-53512)

## Object Definitions

* [predicateObject](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-sdk-predicateObject?branch=pr-en-us-53512)

## V2 Private Preview Documents
* [Private Preview Explorer](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-explorer?branch=pr-en-us-53512)
* [Private Preview Storage and ingress](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-storage-ingress?branch=pr-en-us-53512)
* [Private Preview TSM](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-tsm?branch=pr-en-us-53512)
* [Private Preview TSQ](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-tsq?branch=pr-en-us-53512)
* [Private Preview TSI Javascript SDK](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-sdk?branch=pr-en-us-53512)
