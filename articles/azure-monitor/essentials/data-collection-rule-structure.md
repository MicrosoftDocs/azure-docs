---
title: Structure of a data collection rule in Azure Monitor (preview)
description: Details on the structure of different kinds of data collection rule in Azure Monitor.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 08/08/2023
ms.reviwer: nikeist

---

# Structure of a data collection rule in Azure Monitor
[Data collection rules (DCRs)](data-collection-rule-overview.md) are sets of instructions that determine how to collect and process telemetry sent to Azure Monitor. Some DCRs will be created and managed by Azure Monitor. You might create other DCRs to customize data collection for your particular requirements. This article describes the JSON properties of DCRs for creating and editing them in those cases where you need to work with them directly.

## Samples
For sample DCRs for each scenario, see the following:

- [Azure Monitor agent](../agents/data-collection-rule-sample-agent.md)
- [Logs ingestion API]()
- [Event Hubs]()
- [Workspace transformation DCR]()

## `dataCollectionEndpointId` 

**Scenarios**
- Azure Monitor agent
- Logs ingestion API
- Events Hubs
 
**Description**
Resource ID of the data collection endpoint.


## `streamDeclarations`
Declaration of the different types of data sent into the Log Analytics workspace. Each stream is an object whose key represents the stream name, which must begin with *Custom-*. The stream contains a full list of top-level properties that are contained in the JSON data that will be sent. The shape of the data you send to the endpoint doesn't need to match that of the destination table. Instead, the output of the transform that's applied on top of the input data needs to match the destination shape.

This section isn't used for data sources sending known data types such as events and performance data sent from Azure Monitor agent.

The possible data types that can be assigned to the properties are:

- `string`
- `int`
- `long`
- `real`
- `boolean`
- `dynamic`
- `datetime`.

**Scenarios**
- Azure Monitor agent (text logs only)
- Logs ingestion API 
- Event Hubs

## `destinations`
Declaration of all the destinations where the data will be sent. Only `logAnalytics` is currently supported as a destination except for Azure Monitor agent which can also use `azureMonitorMetrics`. Each Log Analytics destination requires the full workspace resource ID and a friendly name that will be used elsewhere in the DCR to refer to this workspace.

**Scenarios**
- Azure Monitor agent (text logs only)
- Logs ingestion API 
- Event Hubs
- Workspace transformation DCR

## `dataSources` 
Unique source of monitoring data that has its own format and method of exposing its data. Each data source has a data source type, and each type defines a unique set of properties that must be specified for each data source. The data source types currently available are listed  in the following table.

| Data source type | Description | 
|:---|:---|
| extension | VM extension-based data source, used exclusively by Log Analytics solutions and Azure services ([View agent supported services and solutions](../agents/azure-monitor-agent-overview.md#supported-services-and-features)) |
| performanceCounters | Performance counters for both Windows and Linux |
| syslog | Syslog events on Linux |
| windowsEventLogs | Windows event log |

**Scenarios**
- Azure Monitor agent


## `dataFlows`
Matches the streams and the destinations and specifies a transformation and target table.

### `dataFlows/Streams`
Unique handle describes a set of data sources that will be transformed and schematized as one type. Each data source requires one or more streams, and one stream can be used by multiple data sources. All data sources in a stream share a common schema. Use multiple streams, for example, when you want to send a particular data source to multiple tables in the same Log Analytics workspace.

### `dataFlows/destinations`
Set of destinations that indicate where the data should be sent. Examples include Log Analytics workspace and Azure Monitor Metrics. Multiple destinations are allowed for multi-homing scenarios.

### `dataFlows/transformKql`
The [transformation](data-collection-transformations.md) applied to the data that was sent in the input shape described in the `streamDeclarations` section to the shape of the target table.

### `dataFlows/outputStream`
Describes which table in the workspace specified under the `destination` property the data will be sent to. The value of `outputStream` has the `Microsoft-[tableName]` shape when data is being ingested into a standard Log Analytics table, or `Custom-[tableName]` when ingesting data into a custom-created table. Only one destination is allowed per stream.<br><br>This property isn't used for known data sources from Azure Monitor such as events and performance data since these are sent to specific tables. |

**Scenarios**

- Azure Monitor agent
- Logs ingestion API
- Event Hubs
- Workspace transformation DCR



## Workspace transformation DCR

| Section | Description |
|:---|:---|
| `destinations` |  |
| `dataFlows` | |



## Next steps

[Overview of data collection rules and methods for creating them](data-collection-rule-overview.md)
