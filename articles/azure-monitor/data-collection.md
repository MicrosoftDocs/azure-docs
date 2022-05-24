---
title: Data collection in Azure Monitor
description: Monitoring data collected by Azure Monitor is separated into metrics that are lightweight and capable of supporting near real-time scenarios and logs that are used for advanced analysis.
ms.topic: conceptual
ms.date: 04/05/2022
---

# Data collection in Azure Monitor
[Azure Monitor](overview.md) collects and aggregates data from a variety of sources into a common data platform where it can be used for analysis, visualization, and alerting. It provides a consistent experience on top of data from multiple sources, which gives you deep insights across all your monitored resources and even with data from other services that store their data in Azure Monitor.

![Azure Monitor overview](media/overview/overview.png)



## Data collection pipeline
Azure Monitor is in the process of implementing a new data collection pipeline, which provides an [ETL](/azure/architecture/data-guide/relational-data/etl)-like pipeline for collecting data. This pipeline provides a consistent method for defining the configuration of the data collection and its destination and the ability to transform and filter the data before its stored.

The following table identifies different components of the Azure Monitor data collection pipeline.

| Component | Description |
|:---|:---
| Data collection Rule (DCR) | Defines the configuration of a particular data collection workflow. Includes details such as the format of the incoming data, the destination of the data, and any transforms that should be applied to the incoming data before its stored. |
| Data collection endpoint (DCE) | Endpoint that that provides a connection for workflows outside of Azure. This includes virtual machines running the Azure Monitor agent and custom application using the custom logs API. |
| Data collection rule association (DCRA) | Associates a data collection rule with an agent. An agent may be associated with multiple data collection rules, and a data collection rule may be associated with multiple agents. |
| Transformation | KQL query, defined in a data collection rule, that's applied to the data before its stored in its destination. The transformation may modify or filter the data. |


## Supported workflows
Only a limited set of workflows currently support this pipeline. When the implementation is complete, all data collected by Azure Monitor will use this pipeline.

Workflows that currently support the Azure Monitor data collection pipeline include the following:

- Azure Monitor agent (transformations currently not supported)
- Custom logs API

### Legacy workflows
Azure Monitor collects data from a variety of sources using legacy methods. This data is stored in Logs and Metrics just like data 



## Collect monitoring data
Different [sources of data for Azure Monitor](agents/data-sources.md) will write to either a Log Analytics workspace (Logs) or the Azure Monitor metrics database (Metrics) or both. Some sources will write directly to these data stores, while others may write to another location such as Azure storage and require some configuration to populate logs or metrics. 

See [Metrics in Azure Monitor](essentials/data-platform-metrics.md) and [Logs in Azure Monitor](logs/data-platform-logs.md) for a listing of different data sources that populate each type.


## Stream data to external systems
In addition to using the tools in Azure to analyze monitoring data, you may have a requirement to forward it to an external tool such as a security information and event management (SIEM) product. This forwarding is typically done directly from monitored resources through [Azure Event Hubs](../event-hubs/index.yml). Some sources can be configured to send data directly to an event hub while you can use another process such as a Logic App to retrieve the required data. See [Stream Azure monitoring data to an event hub for consumption by an external tool](essentials/stream-monitoring-data-event-hubs.md) for details.


## Data flow
Azure Monitor is in the process of implementing a new data flow pipeline for collecting data.


## Next steps

- Read more about [Metrics in Azure Monitor](essentials/data-platform-metrics.md).
- Read more about [Logs in Azure Monitor](logs/data-platform-logs.md).
- Learn about the [monitoring data available](agents/data-sources.md) for different resources in Azure.
