---
title: Azure Workbooks data source limits | Microsoft docs
description: Learn about the limits of each type of workbook data source.
services: azure-monitor
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: conceptual
ms.date: 06/21/2023
ms.reviewer: gardnerjr
---

# Workbooks result limits

Data source, visualization, and parameter limits have some points in common:

- In general, Azure Workbooks limits the results of queries to no more than 10,000 results. Any results after that point are truncated.
- Each data source might have its own specific limits based on the limits of the service it queries.
- Those limits might be on the numbers of resources, regions, results returned, and time ranges. Consult the documentation for each service to find those limits.

## Data source limits

This table lists the limits of specific data sources.

|Data source|Limits |
|---------|---------|
|Log-based queries|Log Analytics [has limits](../service-limits.md#log-queries-and-language) for the number of resources, workspaces, and regions involved in queries.|
|Metrics|Metrics grids are limited to querying 200 resources at a time. |
|Azure Resource Graph|Resource Graph limits queries to 1,000 subscriptions at a time.|

## Visualization limits

This table lists the limits of specific data visualizations.

|Visualization|Limits |
|---------|---------|
|Grid|By default, grids only display the first 250 rows of data. This setting can be changed in the query component's advanced settings to display up to 10,000 rows. Any further items are ignored, and a warning appears.|
|Charts|Charts are limited to 100 series.<br>Charts are limited to 10,000 data points. |
|Tiles|Tiles is limited to displaying 100 tiles. Any further items are ignored, and a warning appears.|
|Maps|Maps are limited to displaying 100 points. Any further items are ignored, and a warning appears.|
|Text|Text visualization only displays the first cell of data returned by a query. Any other data is ignored.|

## Parameter limits

This table lists the limits of specific data parameters.

|Parameter|Limits |
|---------|---------|
|Drop down|Drop-down-based parameters are limited to 1,000 items. Any items returned by a query after that are ignored.<br>When based on a query, only the first four columns of data produced by the query are used. Any other columns are ignored.|
|Multi-value|Multi-value parameters are limited to 100 items. Any items returned by a query after that are ignored.<br>When based on a query, only the first column of data produced by the query is used. Any other columns are ignored. |
|Options group|Options group parameters are limited to 1,000 items. Any items returned by a query after that are ignored. <br>When based on a query, only the first column of data produced by the query is used. Any other columns are ignored.|
|Text|Text parameters that retrieve their value based on a query will only display the first cell returned by the query (row 1, column 1). Any other data is ignored.|