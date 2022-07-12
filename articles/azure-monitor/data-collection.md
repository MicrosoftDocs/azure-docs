---
title: Data collection in Azure Monitor
description: Monitoring data collected by Azure Monitor is separated into metrics that are lightweight and capable of supporting near real-time scenarios and logs that are used for advanced analysis.
ms.topic: conceptual
ms.date: 07/10/2022
---

# Data collection in Azure Monitor
Azure Monitor has a [common data platform](data-platform.md) that consolidates data from a variety of sources. You typically don't need to understand the details of how this data collection works in order to use it. It can help to understand these details though to take advantage of advanced features and to optimize management of your monitoring environment.

Currently, different sources for Azure Monitor use different methods to deliver their data, and each typically require different types of configuration. Get a description of the most common data sources at [Sources of monitoring data for Azure Monitor](data-sources.md).

Azure Monitor is implementing a new [ETL](/azure/architecture/data-guide/relational-data/etl)-like data collection pipeline that improves on legacy data collection methods. This process uses a common data ingestion pipeline for all data sources and provides a standard method of configuration that's more manageable and scalable than current methods. Specific advantages of the new data collection include the following:

- Common set of destinations for different data sources.
- Ability to apply a transformation to filter or modify incoming data before it's stored.
- Consistent method for configuration of different data sources.
- Scalable configuration options supporting infrastructure as code and DevOps processes.

## Overview
Azure Monitor data collection is defined by a [data collection Rule (DCR)](essentials/data-collection-rule-overview.md), which defines the configuration of a particular data collection scenario. The DCR includes details such as the data to collect, the destination of that data, and any transformations that should be applied to the data before its stored. All data using the new data collection process uses a DCR to define its configuration.

DCRs are objects that can be created and managed on their own. Create a library of DCRs for different functionality and apply common DCRs to multiple Azure resources. 

Some data sources specify a particular DCR to use. For example, when using the [logs ingestion API](logs/logs-ingestion-api-overview.md), the API call connects to a [data collection endpoint (DCE))](essentials/data-collection-endpoint-overview.md) and specifies a DCR to accept its incoming data. The DCR understands the structure of the incoming data and specifies the destination.

:::image type="content" source="essentials/media/data-collection-transformations/transformation-data-ingestion-api.png" lightbox="essentials/media/data-collection-transformations/transformation-data-ingestion-api.png" alt-text="Diagram of ingestion-time transformation for custom application using logs ingestion API." border="false":::

Other workflows use a data collection rule association (DCRA), which associates a data collection rule with a resource. For example, to collect data from virtual machines using the Azure Monitor agent, you create a data rule association (DCRA) between the one or more DCRs and one or more virtual machines. The DCRs specify the data to collect on the agent and where that data should be sent.

:::image type="content" source="essentials/media/data-collection-transformations/transformation-azure-monitor-agent.png" lightbox="essentials/media/data-collection-transformations/transformation-azure-monitor-agent.png" alt-text="Diagram of ingestion-time transformation for Azure Monitor agent." border="false":::


## Supported data sources
When implementation is complete, all data collected by Azure Monitor will use the new data collection process and be managed by data collection rules. Currently, only certain data sources send data to the ingestion pipeline, and they may have limited configuration options. Data sources that currently use the Azure Monitor data collection pipeline include the following. This list will be modified as others are added.

- [Azure Monitor agent](agents/azure-monitor-agent-overview.md) 
- [Logs ingestion API](logs/logs-ingestion-api-overview.md)


There's no difference between data collected with the new ingestion pipeline and data collected using other methods. The data is all stored together as [Logs](logs/data-platform-logs.md) and [Metrics](essentials/data-platform-metrics.md), supporting Azure Monitor features such as log queries, alerts, and workbooks. The only difference is in the method of collection.

[Transformations](essentials/data-collection-transformations.md) can be applied to data sources that don't yet use data collection rules. In this case, the transformation is included in the [workspace transformation DCR](essentials/data-collection-rule-overview.md#types-of-data-collection-rules) which is associated directly with the Log Analytics workspace receiving the data.

## Next steps

- Read more about [data collection rules](essentials/data-collection-rule-overview.md).
- Read more about [transformations](essentials/data-collection-transformations.md).

