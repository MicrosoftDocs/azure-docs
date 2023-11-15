---
title: Structure of a data collection rule in Azure Monitor
description: Details on the structure of different kinds of data collection rule in Azure Monitor.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 11/03/2023
ms.reviwer: nikeist
---

# Structure of a data collection rule in Azure Monitor
[Data collection rules (DCRs)](data-collection-rule-overview.md) are sets of instructions that determine how to collect and process telemetry sent to Azure Monitor. Some DCRs will be created and managed by Azure Monitor. This article describes the JSON properties of DCRs for creating and editing them in those cases where you need to work with them directly. 

- See [Create and edit data collection rules (DCRs) in Azure Monitor](data-collection-rule-create-edit.md) for details working with the JSON described here.
- See [Sample data collection rules (DCRs) in Azure Monitor](../essentials/data-collection-rule-samples.md) for sample DCRs for different scenarios.


## `dataCollectionEndpointId` 
Specifies the [data collection endpoint (DCE)](data-collection-endpoint-overview.md) used by the DCR.

**Scenarios**
- Azure Monitor agent
- Logs ingestion API
- Events Hubs
 

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
| eventHub | Data from Azure Event Hubs |
| extension | VM extension-based data source, used exclusively by Log Analytics solutions and Azure services ([View agent supported services and solutions](../agents/azure-monitor-agent-overview.md#supported-services-and-features)) |
| logFiles | Text log on a virtual machine |
| performanceCounters | Performance counters for both Windows and Linux virtual machines |
| syslog | Syslog events on Linux virtual machines |
| windowsEventLogs | Windows event log on virtual machines |

**Scenarios**
- Azure Monitor agent
- Event Hubs


## `dataFlows`
Matches streams with destinations and optionally specifies a transformation.

### `dataFlows/Streams`
One or more streams defined in the previous section. You may include multiple streams in a single data flow if you want to send multiple data sources to the same destination. Only use a single stream though if the data flow includes a transformation. One stream can also be used by multiple data flows when you want to send a particular data source to multiple tables in the same Log Analytics workspace. 

### `dataFlows/destinations`
One or more destinations from the `destinations` section above. Multiple destinations are allowed for multi-homing scenarios.

### `dataFlows/transformKql`
Optional [transformation](data-collection-transformations.md) applied to the incoming stream. The transformation must understand the schema of the incoming data and output data in the schema of the target table. If you use a transformation, the data flow should only use a single stream.

### `dataFlows/outputStream`
Describes which table in the workspace specified under the `destination` property the data will be sent to. The value of `outputStream` has the format `Microsoft-[tableName]` when data is being ingested into a standard Log Analytics table, or `Custom-[tableName]` when ingesting data into a custom table. Only one destination is allowed per stream.<br><br>This property isn't used for known data sources from Azure Monitor such as events and performance data since these are sent to predefined tables. |

**Scenarios**

- Azure Monitor agent
- Logs ingestion API
- Event Hubs
- Workspace transformation DCR



## Next steps

[Overview of data collection rules and methods for creating them](data-collection-rule-overview.md)

