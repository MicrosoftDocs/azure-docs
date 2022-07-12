---
title: Azure Workbooks data source limits | Microsoft docs
description: Learn about the limits of each type of workbook data source.
services: azure-monitor
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: conceptual
ms.date: 07/05/2022
ms.reviewer: gardnerjr
---

# Workbooks result limits

- In general, Workbooks limits the results of queries to be no more than 10,000 results. Any results after that point are truncated.
- Each data source may have its own specific limits based on the limits of the service they query.
- Those limits may be on the numbers of resources, regions, results returned, time ranges.  Consult the documentation for each service to find those limits.

## Data Source limits

This table lists the limits of specific data sources.

|Data Source|Limits |
|---------|---------|
|Log based Queries|Log Analytics [has limits](../service-limits.md#log-queries-and-language) for the number of resources, workspaces, and regions involved in queries.|
|Metrics|Metrics grids are limited to querying 200 resources at a time. |
|Azure Resource Graph|Resource Graph limits queries  to 1000 subscriptions at a time.|

## Visualization limits

This table lists the limits of specific data visualizations.

|Visualization|Limits |
|---------|---------|
|Grid|By default, grids only display the first 250 rows of data. This setting can be changed in the query component's advanced settings to display up to 10,000 rows. Any further items are ignored, and a warning will be displayed.|
|Charts|Charts are limited to 100 series.<br>Charts are limited to 10000 data points. |
|Tiles|Tiles is limited to displaying 100 tiles. Any further items are ignored, and a warning will be displayed.|
|Maps|Maps are limited to displaying 100 points. Any further items are ignored, and a warning will be displayed.|
|Text|Text visualization only displays the first cell of data returned by a query. Any other data is ignored.|
 

## Parameter limits

This table lists the limits of specific data parameters.

|Parameter|Limits |
|---------|---------|
|Drop Down|Drop down based parameters are limited to 1000 items. Any items after that returned by a query are ignored.<br>When based on a query, only the first four columns of data produced by the query are used, any other columns are ignored.|
|Multi-value|Multi-value parameters are limited to 100 items. Any items after that returned by a query are ignored.<br>When based on a query, only the first column of data produced by the query is used, any other columns are ignored. |
|Options Group|Options group parameters are limited to 1000 items. Any items after that returned by a query are ignored. <br>When based on a query, only the first column of data produced by the query is used, any other columns are ignored.|
|Text|Text parameters that retrieve their value based on a query will only display the first cell returned by the query (row 1, column 1). Any other data is ignored.|
 
