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
[Data collection rules (DCRs)](data-collection-rule-overview.md) determine how to collect and process telemetry sent to Azure. Some DCRs will be created and managed by Azure Monitor. You might create other DCRs to customize data collection for your particular requirements. This article describes the structure of DCRs for creating and editing DCRs in those cases where you need to work with them directly.


## Azure Monitor agent
 A DCR for [Azure Monitor Agent](../agents/data-collection-rule-azure-monitor-agent.md) contains the following sections. For a sample, see [Sample data collection rule - agent](../agents/data-collection-rule-sample-agent.md). For agent based custom logs, see [Sample Custom Log Rules - Agent](../agents/data-collection-text-log.md)

| Section | Description |
|:---|:---|
| `streamDeclarations`<br>(text logs only) | Declaration of all the different types of data that will be sent via the HTTP endpoint directly into Log Analytics. Each stream is an object whose:<br><br>- Key represents the stream name, which must begin with *Custom-*.<br>- Value is the full list of top-level properties that are contained in the JSON data that will be sent.<br><br>The shape of the data you send to the endpoint doesn't need to match that of the destination table. Instead, the output of the transform that's applied on top of the input data needs to match the destination shape. The possible data types that can be assigned to the properties are `string`, `int`, `long`, `real`, `boolean`, `dynamic`, and `datetime`. |
| `dataSources` | This unique source of monitoring data has its own format and method of exposing its data. Examples of a data source include Windows event log, performance counters, and Syslog. Each data source matches a particular data source type as described in the following table.<br><br>Each data source has a data source type. Each type defines a unique set of properties that must be specified for each data source. The data source types currently available appear in the following table. |
| `Streams` |  This unique handle describes a set of data sources that will be transformed and schematized as one type. Each data source requires one or more streams, and one stream can be used by multiple data sources. All data sources in a stream share a common schema. Use multiple streams, for example, when you want to send a particular data source to multiple tables in the same Log Analytics workspace. |
| `destinations` | This set of destinations indicates where the data should be sent. Examples include Log Analytics workspace and Azure Monitor Metrics. Multiple destinations are allowed for multi-homing scenarios. |
| `dataFlows` | The definition indicates which streams should be sent to which destinations. |

**Data sources**
The following table lists the data sources that are currently supported by Azure Monitor Agent.

| Data source type | Description | 
|:---|:---|
| extension | VM extension-based data source, used exclusively by Log Analytics solutions and Azure services ([View agent supported services and solutions](../agents/azure-monitor-agent-overview.md#supported-services-and-features)) |
| performanceCounters | Performance counters for both Windows and Linux |
| syslog | Syslog events on Linux |
| windowsEventLogs | Windows event log |



## Text logs

| Section | Description |
|:---|:---|
| `dataSources` | This unique source of monitoring data has its own format and method of exposing its data. Examples of a data source include Windows event log, performance counters, and Syslog. Each data source matches a particular data source type as described in the following table.<br><br>Each data source has a data source type. Each type defines a unique set of properties that must be specified for each data source. The data source types currently available appear in the following table. |
| `Streams` |  This unique handle describes a set of data sources that will be transformed and schematized as one type. Each data source requires one or more streams, and one stream can be used by multiple data sources. All data sources in a stream share a common schema. Use multiple streams, for example, when you want to send a particular data source to multiple tables in the same Log Analytics workspace. |
| `destinations` | This set of destinations indicates where the data should be sent. Examples include Log Analytics workspace and Azure Monitor Metrics. Multiple destinations are allowed for multi-homing scenarios. |
| `dataFlows` | The definition indicates which streams should be sent to which destinations. |



## Logs ingestion API

| Section | Description |
|:---|:---|
| `streamDeclarations` | Declaration of all the different types of data that will be sent via the HTTP endpoint directly into Log Analytics. Each stream is an object whose:<br><br>- Key represents the stream name, which must begin with *Custom-*.<br>- Value is the full list of top-level properties that are contained in the JSON data that will be sent.<br><br>The shape of the data you send to the endpoint doesn't need to match that of the destination table. Instead, the output of the transform that's applied on top of the input data needs to match the destination shape. The possible data types that can be assigned to the properties are `string`, `int`, `long`, `real`, `boolean`, `dynamic`, and `datetime`. |
| `destinations` | Contains a declaration of all the destinations where the data will be sent. Only Log Analytics is currently supported as a destination. Each Log Analytics destination requires the full workspace resource ID and a friendly name that will be used elsewhere in the DCR to refer to this workspace. |
| `dataFlows` | This section ties the other sections together. It defines the following properties for each stream declared in the `streamDeclarations` section: |
| `dataFlows/destination` | from the `destinations` section where the data will be sent. |
| `dataFlows/transformKql` | section, which is the [transformation](data-collection-transformations.md) applied to the data that was sent in the input shape described in the `streamDeclarations` section to the shape of the target table. |
| `dataFlows/outputStream` | section, which describes which table in the workspace specified under the `destination` property the data will be ingested into. The value of `outputStream` has the `Microsoft-[tableName]` shape when data is being ingested into a standard Log Analytics table, or `Custom-[tableName]` when ingesting data into a custom-created table. Only one destination is allowed per stream. |


## Event Hubs

| Section | Description |
|:---|:---|
| `identity` | Defines which type of [managed identity](../../active-directory/managed-identities-azure-resources/overview.md) to use. In our example, we use system-assigned identity. You can also [configure user-assigned managed identity](#configure-user-assigned-managed-identity-optional). |
| `dataCollectionEndpointId` | Resource ID of the data collection endpoint.
| `streamDeclarations` | Defines which data to ingest from the event hub (incoming data). The stream declaration can't be modified. |       
| `TimeGenerated` | The time at which the data was ingested from event hub to Azure Monitor Logs. |
| `RawData` | Body of the event. For more information, see [Read events](../../event-hubs/event-hubs-features.md#read-events). |
| `Properties` | User properties from the event. For more information, see [Read events](../../event-hubs/event-hubs-features.md#read-events). |    
| `datasources` | Specifies the [event hub consumer group](../../event-hubs/event-hubs-features.md#consumer-groups) and the stream to which you ingest the data. |
| `destinations` | Specifies all of the destinations where the data will be sent. You can [ingest data to one or more Log Analytics workspaces](../essentials/data-collection-transformations.md#). |
| `dataFlows` | Matches the stream with the destination workspace and specifies the transformation query and the destination table. In our example, we ingest data to the custom table we created previously. You can also [ingest into a supported Azure table](#ingest-log-data-into-an-azure-table-optional).  |
| `transformKql` | Specifies a transformation to apply to the incoming data (stream declaration) before it's sent to the workspace. In our example, we set `transformKql` to `source`, which doesn't modify the data from the source in any way, because we're mapping incoming data to a custom table we've created specifically with the corresponding schema. If you're ingesting data to a table with a different schema or to filter data before ingestion, [define a data collection transformation](../essentials/data-collection-transformations.md#multiple-destinations). |


## Workspace transformation DCR

| Section | Description |
|:---|:---|
| `destinations` |  |
| `dataFlows` | |



## Next steps

[Overview of data collection rules and methods for creating them](data-collection-rule-overview.md)
