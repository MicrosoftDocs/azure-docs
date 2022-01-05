---
title: Data Collection Rules in Azure Monitor
description: Overview of data collection rules (DCRs) in Azure Monitor including their contents and structure and how you can create and work with them.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 01/19/2021
ms.custom: references_region

---

# Data collection rules in Azure Monitor
Data Collection Rules (DCRs) are applied to different workflows to define data collected by Azure Monitor and specify how and where that data should be sent or stored. This article provides an overview of data collection rules including their contents and structure and how you can create and work with them.

Not all data collected in Azure Monitor currently uses data collection rules, but additional workflows are continuously being added. Some data collection rules will be created and managed by Azure Monitor, while you may create others to customize data collection for your particular requirements.


Data collection rules can include one or more of the following:

- Data that should be collected including filtering of unwanted data.
- Transformations to modify data before it's stored in Azure Monitor. 
- Destinations where data should be collected or sent. 



## Types of data collection rules
There are currently three types of data collection rules that each support different workflows.

### Agent
Used by [Azure Monitor agent](../agents/azure-monitor-agent-overview.md) to collect telemetry from virtual machines. THe DCR defines the logs and performance data that should be collected and where the collected data should be sent.

:::image type="content" source="media/dcr-agent.png" alt-text="Diagram of agent data collection rule" lightbox="media/dcr-agent.png":::


### Custom logs API
 Used by the custom logs REST API when data is sent from a custom application. The API connects to an endpoint specific to a particular DCR. The DCR potentially filters or transforms the data and specifies the Log Analytics workspace it should be sent to.

:::image type="content" source="media/dcr-custom-log.png" alt-text="Diagram of custom logs data collection rule" lightbox="media/dcr-custom-log.png":::


### Default DCR
Each workspace cam have one default DCR that performs filtering and data transformation for workflows that don't currently use data collection rules.

:::image type="content" source="media/dcr-default.png" alt-text="Diagram of custom logs data collection rule" lightbox="media/dcr-default.png":::

## Components of a data collection rule
Data collection rules include the following components.

| Component | DCR types | Description |
|:---|:---|:---|
| Data sources | Agent | Unique source of monitoring data with its own format and method of exposing its data. Examples of a data source include Windows event log, performance counters, and syslog. Each data source matches a particular data source type as described below. |
| Streams | Agent<br>Custom Logs | Unique handle that describes a set of data sources that will be transformed and schematized as one type. Each data source requires one or more streams, and one stream may be used by multiple data sources. All data sources in a stream share a common schema. Use multiple streams for example, when you want to send a particular data source to multiple tables in the same Log Analytics workspace. |
| Destinations | Agent<br>Custom Logs | Set of destinations where the data should be sent. Examples include Log Analytics workspace and Azure Monitor Metrics. | 
| Data flows | Agent<br>Custom Logs | Definition of which streams should be sent to which destinations. |
| Endpoint | Custom Logs | HTTPS endpoint for the DCR. The DCR is applied to any data sent to that endpoint. |
| 



### Data source types
Each data source has a data source type. Each type defines a unique set of properties that must be specified for each data source. The data source types currently available are shown in the following table.

| Data source type | Description | 
|:---|:---|
| extension | VM extension-based data source |
| performanceCounters | Performance counters for both Windows and Linux |
| syslog | Syslog events on Linux |
| windowsEventLogs | Windows event log |


## Limits
For limits that apply to each data collection rule, see [Azure Monitor service limits](../service-limits.md#data-collection-rules).

## Data resiliency and high availability
Data collection rules are stored regionally, and are available in all public regions where Log Analytics is supported. Government regions and clouds are not currently supported. A rule gets created and stored in the region you specify, and is backed up to the [paired-region](../../availability-zones/cross-region-replication-azure.md#azure-cross-region-replication-pairings-for-all-geographies) within the same Geo.  

Additionally, the service is deployed to all 3 [availability zones](../../availability-zones/az-overview.md#availability-zones) within the region, making it a **zone-redundant service** which further adds to high availability.


### Single region data residency
This is a preview feature to enable storing customer data in a single region is currently only available in the Southeast Asia Region (Singapore) of the Asia Pacific Geo and Brazil South (Sao Paulo State) Region of Brazil Geo. Single region residency is enabled by default in these regions.


## Next steps

- [Create a data collection rule](data-collection-rule-azure-monitor-agent.md) and an association to it from a virtual machine using the Azure Monitor agent.
