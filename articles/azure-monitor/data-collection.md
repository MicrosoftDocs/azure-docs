---
title: Data collection in Azure Monitor
description: Monitoring data collected by Azure Monitor is separated into metrics that are lightweight and capable of supporting near real-time scenarios and logs that are used for advanced analysis.
ms.topic: conceptual
ms.date: 04/05/2022
---

# Data collection pipeline in Azure Monitor
Azure Monitor collects and aggregates data from a variety of sources into a common data platform where it can be used for analysis, visualization, and alerting. The configuration and capabilities for data collection though varies for each [data source](data-sources.md). Azure Monitor is implementing a new [ETL](/azure/architecture/data-guide/relational-data/etl)-like data collection pipeline that provides the following advantages:

- Consistent method for configuration of different data sources.
- Scalable configuration options supporting infrastructure as code and DevOps processes.
- Common set of destinations for all data sources.
- Ability to apply a transformation to filter or modify incoming data before it's stored.


## Components
The following table identifies different components of the Azure Monitor data collection pipeline.

| Component | Description |
|:---|:---
| Data collection Rule (DCR) | Defines the configuration of a particular data collection workflow. Includes details such as the format of the incoming data, the destination of the data, and any transforms that should be applied to the incoming data before its stored. All data using the data collection pipeline uses a DCR to define its configuration. |
| Data collection rule association (DCRA) | Associates a data collection rule with a resource, such as an agent. A resource may be associated with multiple data collection rules, and a data collection rule may be associated with multiple resources. Not all workflows require a DCRA. |
| Data collection endpoint (DCE) | Endpoint that that provides a connection for certain workflows outside of Azure. Some workflows may use public endpoints depending on customer requirements. |



## Supported workflows
Only certain workflows currently support the data collection pipeline. When the implementation is complete, all data collected by Azure Monitor will use this pipeline.

Workflows that currently support the Azure Monitor data collection pipeline include the following:

- [Azure Monitor agent](agents/azure-monitor-agent-overview.md) (transformations currently not supported)
- [Custom logs API](logs/custom-logs-overview.md)

### Legacy workflows
Azure Monitor collects data from a variety of sources using legacy methods. This data is stored in Logs and Metrics just like data 




## Next steps

- Read more about [Metrics in Azure Monitor](essentials/data-platform-metrics.md).
- Read more about [Logs in Azure Monitor](logs/data-platform-logs.md).
- Learn about the [monitoring data available](data-sources.md) for different resources in Azure.
