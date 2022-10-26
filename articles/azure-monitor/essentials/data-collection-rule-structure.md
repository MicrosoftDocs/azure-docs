---
title: Structure of a data collection rule in Azure Monitor (preview)
description: Details on the structure of different kinds of data collection rule in Azure Monitor.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 07/10/2022
ms.reviwer: nikeist

---



# Structure of a data collection rule in Azure Monitor (preview)
[Data Collection Rules (DCRs)](data-collection-rule-overview.md) determine how to collect and process telemetry sent to Azure. Some data collection rules will be created and managed by Azure Monitor, while you may create others to customize data collection for your particular requirements. This article describes the structure of DCRs for creating and editing data collection rules in those cases where you need to work with them directly.


## Custom logs
A DCR for  [custom logs](../logs/logs-ingestion-api-overview.md) contains the sections below. For a sample, see [Sample data collection rule - custom logs](../logs/data-collection-rule-sample-custom-logs.md).

### streamDeclarations
This section contains the declaration of all the different types of data that will be sent via the HTTP endpoint directly into Log Analytics. Each stream is an object whose key represents the stream name (Must begin with *Custom-*) and whose value is the full list of top-level properties that the JSON data that will be sent will contain. Note that the shape of the data you send to the endpoint doesn't need to match that of the destination table. Rather, the output of the transform that is applied on top of the input data needs to match the destination shape. The possible data types that can be assigned to the properties are `string`, `int`, `long`, `real`, `boolean`, `dynamic`, and `datetime`. 

### destinations
This section contains a declaration of all the destinations where the data will be sent. Only Log Analytics is currently supported as a destination. Each Log Analytics destination will require the full Workspace Resource ID, as well as a friendly name that will be used elsewhere in the DCR to refer to this workspace.  

### dataFlows
This section ties the other sections together. Defines the following for each stream declared in the `streamDeclarations` section:

- `destination` from the `destinations` section where the data will be sent. 
- `transformKql` which is the [transformation](data-collection-transformations.md) applied to the data that was sent in the input shape described in the `streamDeclarations` section to the shape of the target table.
- `outputStream` section, which describes which table in the workspace specified under the `destination` property the data will be ingested into. The value of the outputStream will have the `Microsoft-[tableName]` shape when data is being ingested into a standard Log Analytics table, or `Custom-[tableName]` when ingesting data into a custom-created table. Only one destination is allowed per stream.

## Azure Monitor agent
 A DCR for [Azure Monitor agent](../agents/data-collection-rule-azure-monitor-agent.md) contains the sections below. For a sample, see [Sample data collection rule - agent](../agents/data-collection-rule-sample-agent.md).

### dataSources
Unique source of monitoring data with its own format and method of exposing its data. Examples of a data source include Windows event log, performance counters, and syslog. Each data source matches a particular data source type as described below. 

Each data source has a data source type. Each type defines a unique set of properties that must be specified for each data source. The data source types currently available are shown in the following table.

| Data source type | Description | 
|:---|:---|
| extension | VM extension-based data source, used exclusively by Log Analytics solutions and Azure services ([View agent supported services and solutions](../agents/azure-monitor-agent-overview.md#supported-services-and-features)) |
| performanceCounters | Performance counters for both Windows and Linux |
| syslog | Syslog events on Linux |
| windowsEventLogs | Windows event log |


### Streams 
Unique handle that describes a set of data sources that will be transformed and schematized as one type. Each data source requires one or more streams, and one stream may be used by multiple data sources. All data sources in a stream share a common schema. Use multiple streams for example, when you want to send a particular data source to multiple tables in the same Log Analytics workspace.

### destinations
Set of destinations where the data should be sent. Examples include Log Analytics workspace and Azure Monitor Metrics. Multiple destinations are allowed for multi-homing scenario.

### dataFlows 
Definition of which streams should be sent to which destinations.



## Next steps

- [Overview of data collection rules including methods for creating them.](data-collection-rule-overview.md)
