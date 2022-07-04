---
title: Data collection in Azure Monitor
description: Monitoring data collected by Azure Monitor is separated into metrics that are lightweight and capable of supporting near real-time scenarios and logs that are used for advanced analysis.
ms.topic: conceptual
ms.date: 06/29/2022
---

# Data collection in Azure Monitor
Azure Monitor is implementing a new [ETL](/azure/architecture/data-guide/relational-data/etl)-like data collection pipeline that improves on legacy data collection methods. Currently, different sources of data for Azure Monitor use different methods to deliver their data, and each typically require different types of configuration. 

> [!NOTE]
> Get a description of the most common data sources at [Sources of monitoring data for Azure Monitor](data-sources.md).

The new process for Azure Monitor data collection uses a common data ingestion pipeline for all data sources and provides a standard method of configuration that's more manageable and scalable than current methods and provides additional functionality. Specific advantages of the new data collection 

- Common set of destinations for different data sources.
- Ability to apply a transformation to filter or modify incoming data before it's stored.
- Consistent method for configuration of different data sources.
- Scalable configuration options supporting infrastructure as code and DevOps processes.


## Overview
Azure Monitor data collection is defined by a [data collection Rule (DCR)](essentials/data-collection-rule-overview.md), which defines the configuration of a particular workflow. The DCR includes details such as the data to collect, the destination of that data, and any transformations that should be applied to the data before its stored. All data using the new data collection process uses a DCR to define its configuration.

Some workflows specify a particular data collection rule to use. For example, when using the [data ingestion API](logs/data-ingestion-api-overview.md), the API call connects to a [data collection endpoint (DCE))](essentials/data-collection-endpoint-overview.md) and specifies a DCR to accept its incoming data. The DCR understands the structure of the incoming data and specifies the destination.

:::image type="content" source="media/data-collection/data-ingestion-api.png" lightbox="media/data-collection/data-ingestion-api.png" alt-text="Diagram of data collection using data ingestion API.":::

Other workflows use a data collection rule association (DCRA), which associates a data collection rule with a resource. For example, to collect data from virtual machines using the Azure Monitor agent, you create a data rule association (DCRA) between the one or more DCRs and one or more virtual machines. The DCRs specify the data to collect on the agent and where that data should be sent.

:::image type="content" source="media/data-collection-transformations/transformation-data-collectron-rule.png" lightbox="media/data-collection-transformations/transformation-data-collectron-rule.png" alt-text="Diagram of ingestion-time transformation for Azure Monitor agent.":::


## Supported workflows
When implementation is complete, all data collected by Azure Monitor will use the new data collection process. Currently, only certain workflows support the process, and they may have limited configuration options.

Workflows that currently support the Azure Monitor data collection pipeline include the following. This list will be modified as other workflows are added.

- [Azure Monitor agent](agents/azure-monitor-agent-overview.md) 
- [Data ingestion API](logs/data-ingestion-api-overview.md)


## Legacy workflows
There's no difference between data collected with the new data collection process and data collected using legacy methods. The data is all stored together as Logs and Metrics supporting Azure Monitor features such as log queries, alerts, and workbooks. The only difference is in the method of collection.

The following features in Azure Monitor provide some of the functionality of the data collection process for certain legacy workflows. 

| Feature | Description |
|:---|:---|
| [Ingestion-time transformations](logs/ingestion-time-transformations.md) | Transformations allow you to filter and modify data before it's stored in a Log Analytics workspace. Since transformations are stored in a data collection rule, they can't be used by legacy workflows. Ingestion-time transformations are defined for a particular table and stored in a data collection rule that's associated with the workspace. The transformation is applied to any data sent to that table from any legacy data source. |



## Next steps

- Read more about [Metrics in Azure Monitor](essentials/data-platform-metrics.md).
- Read more about [Logs in Azure Monitor](logs/data-platform-logs.md).
- Learn about the [monitoring data available](data-sources.md) for different resources in Azure.
