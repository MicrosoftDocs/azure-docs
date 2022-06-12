---
title: Data collection in Azure Monitor
description: Monitoring data collected by Azure Monitor is separated into metrics that are lightweight and capable of supporting near real-time scenarios and logs that are used for advanced analysis.
ms.topic: conceptual
ms.date: 04/05/2022
---

# Data collection pipeline in Azure Monitor
Azure Monitor collects and aggregates data from a variety of sources into a common data platform where it can be used for analysis, visualization, and alerting. The configuration and capabilities for data collection though varies for each [data source](data-sources.md) and some can be a challenge to configure at scale. 

Azure Monitor is implementing a new [ETL](/azure/architecture/data-guide/relational-data/etl)-like data collection pipeline that provides the following advantages:

- Common set of destinations for different data sources.
- Ability to apply a transformation to filter or modify incoming data before it's stored.
- Consistent method for configuration of different data sources.
- Scalable configuration options supporting infrastructure as code and DevOps processes.


## Supported workflows
When the implementation is complete, all data collected by Azure Monitor will use this pipeline. Currently, only certain workflows support the data collection pipeline, and they may require some configuration outside of the Azure portal.

Workflows that currently support the Azure Monitor data collection pipeline include the following. This list will be modified as other workflows are added.

- [Azure Monitor agent](agents/azure-monitor-agent-overview.md) (transformations currently not supported)
- [Custom logs API](logs/custom-logs-overview.md)


## Components
The following table identifies different components of the Azure Monitor data collection pipeline.

| Component | Description |
|:---|:---
| [Data collection Rule (DCR)](essentials/data-collection-rule-overview.md) | Defines the configuration of a particular data collection workflow. Includes details such as the data to collect, the destination of the data, and any transforms that should be applied to the incoming data before its stored. All data using the data collection pipeline uses a DCR to define its configuration. |
| Data collection rule association (DCRA) | Associates a data collection rule with a resource, such as an agent. A resource may be associated with multiple data collection rules, and a data collection rule may be associated with multiple resources. Not all workflows require a DCRA. |
| [Data collection endpoint (DCE)](essentials/data-collection-endpoint-overview.md) | Endpoint that that provides a connection for certain workflows outside of Azure. Some workflows may use public endpoints depending on customer requirements. |


### Legacy workflows
There's no difference between data collected with the data collection pipeline and data collected using legacy methods. The data is all stored together as Logs and Metrics supporting Azure Monitor features such as log queries, alerts, and workbooks. The only difference is in the method of collection.

The following features in Azure Monitor provide some of the functionality of the data collection pipeline to legacy workflows. 

- [Ingestion-time transformations](logs/ingestion-time-transformations.md). Transformations allow you to filter and modify data before it's stored in a Log Analytics workspace. Since transformations are stored in a data collection rule, they can't be used by legacy workflows. Ingestion-time transformations are defined for a particular table and stored in a data collection rule that's associated with the workspace. The transformation is applied to any data sent to that table from any legacy data source. 


## Next steps

- Read more about [Metrics in Azure Monitor](essentials/data-platform-metrics.md).
- Read more about [Logs in Azure Monitor](logs/data-platform-logs.md).
- Learn about the [monitoring data available](data-sources.md) for different resources in Azure.
