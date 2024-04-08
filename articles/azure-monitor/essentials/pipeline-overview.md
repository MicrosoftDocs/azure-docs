---
title: Overview of Azure Monitor pipeline for edge and multicloud
description: Overview of Azure Monitor pipeline for edge and multicloud
ms.topic: conceptual
ms.date: 11/14/2023
ms.author: bwren
author: bwren
---

# Overview of Azure Monitor pipeline
*Azure Monitor pipeline* is part of an [ETL](/azure/architecture/data-guide/relational-data/etl)-like data collection process that improves on legacy data collection methods for Azure Monitor. This process uses a common data ingestion pipeline for all data sources and a standard method of configuration that's more manageable and scalable than other methods. Specific advantages of the new data collection include the following:

- Common set of destinations for different data sources.
- Ability to apply a transformation to filter or modify incoming data before it's stored.
- Consistent method for configuration of different data sources.
- Scalable configuration options supporting infrastructure as code and DevOps processes.
- Option of edge pipeline in your own environment to provide high-end scalability, layered network configurations, and periodic connectivity.

> [!NOTE]
> When implementation is complete, all data collected by Azure Monitor will use the pipeline. Currently, only [certain data collection methods](#data-collection-scenarios) are supported, and they may have limited configuration options. There's no difference between data collected with the Azure Monitor pipeline and data collected using other methods. The data is all stored together as [Logs](../logs/data-platform-logs.md) and [Metrics](data-platform-metrics.md), supporting Azure Monitor features such as log queries, alerts, and workbooks. The only difference is in the method of collection.

## Components of pipeline data collection
Data collection using the Azure Monitor pipeline is shown in the diagram below. All data is processed through the *cloud pipeline*, which is automatically available in your subscription and needs no configuration. Each collection scenario is configured in a [data collection rule (DCR)](./data-collection-rule-overview.md), which is a set of instructions describing details such as the schema of the incoming data, a transformation to modify the data, and the destination where the data should be sent.

Some environments may choose to implement a local edge pipeline to manage data collection before it's sent to the cloud. See [edge pipeline](#edge-pipeline) for details on this option.

:::image type="content" source="media/pipeline-overview/pipeline-overview.png" lightbox="media/pipeline-overview/pipeline-overview.png" alt-text="Diagram that shows the data flow for Azure Monitor pipeline.":::


## Transformations
[Transformations](./data-collection-transformations.md) allow you to modify incoming data before it's stored in Azure Monitor. They are [KQL queries](../logs/log-query-overview.md) defined in the DCR that run in the cloud pipeline. 

- **Reduce costs**. Remove unneeded records or columns to save on ingestion costs.
- **Remove sensitive data**. Filter or obfuscate private data.
- **Enrich data**. Add a calculated column to simplify log queries.
- **Format data**. Change the format of incoming data to match the schema of the destination table. 

## Edge pipeline
The edge pipeline extends the Azure Monitor pipeline to your own data center. It enables at-scale collection and routing of telemetry data before it's delivered to Azure Monitor in the Azure cloud. 

The specific use case for Azure Monitor edge pipeline are:

- **Scalability**. The edge pipeline can handle large volumes of data from monitored resources that may be limited by other collection methods such as Azure Monitor agent.
- **Periodic connectivity**. Some environments may have unreliable connectivity to the cloud, or may have long unexpected periods without connection. The edge pipeline can cache data locally and sync with the cloud when connectivity is restored.
- **Layered network**. In some environments, the network is segmented and data cannot be sent directly to the cloud. The edge pipeline can be used to collect data from monitored resources without cloud access and act as a proxy connection to Azure Monitor.



## Next steps

- [Read more about data collection rules and the scenarios that use them](./data-collection-rule-overview.md).
- [Read more about transformations and how to create them](./data-collection-transformations.md).
- [Deploy an edge pipeline in your environment](./edge-pipeline-configure.md).

