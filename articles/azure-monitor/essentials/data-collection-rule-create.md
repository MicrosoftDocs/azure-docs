---
title: Create data collection rule in Azure Monitor
description: Details on how to create a data collection rule in Azure Monitor.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 01/06/2022

---

# Create data collection rule in Azure Monitor

## Components of a data collection rule
Data collection rules include the following components.

| Component |  Description |
|:---|:---|
| Data sources | Unique source of monitoring data with its own format and method of exposing its data. Examples of a data source include Windows event log, performance counters, and syslog. Each data source matches a particular data source type as described below. |
| Streams |  Unique handle that describes a set of data sources that will be transformed and schematized as one type. Each data source requires one or more streams, and one stream may be used by multiple data sources. All data sources in a stream share a common schema. Use multiple streams for example, when you want to send a particular data source to multiple tables in the same Log Analytics workspace. |
| Destinations | Set of destinations where the data should be sent. Examples include Log Analytics workspace and Azure Monitor Metrics. | 
| Data flows | Definition of which streams should be sent to which destinations. |
| Endpoint | HTTPS endpoint for DCR used for custom logs API. The DCR is applied to any data sent to that endpoint. |



### Data source types
Each data source has a data source type. Each type defines a unique set of properties that must be specified for each data source. The data source types currently available are shown in the following table.

| Data source type | Description | 
|:---|:---|
| extension | VM extension-based data source |
| performanceCounters | Performance counters for both Windows and Linux |
| syslog | Syslog events on Linux |
| windowsEventLogs | Windows event log |


## Data collection endpoint


## Next steps