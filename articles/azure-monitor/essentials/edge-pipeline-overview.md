---
title: Overview of Azure Monitor pipeline for edge and multicloud
description: Overview of Azure Monitor pipeline for edge and multicloud
ms.topic: conceptual
ms.date: 11/14/2023
ms.author: bwren
author: bwren
---

# Overview of Azure Monitor pipeline for edge and multicloud

Azure Monitor pipeline for edge and multicloud extends the Azure Monitor data pipeline beyond the cloud to the edge of your data center and other clouds. It enables at-scale collection, transformation, and routing of telemetry data at the edge of your data center before your data is delivered to Azure Monitor in the Azure cloud.

The specific use case for Azure Monitor edge pipeline are:

- **Scalability**. The edge pipeline can handle large volumes of data from monitored resources  that may be limited by other collection methods such as Azure Monitor agent.
- **Periodic connectivity**. Some environments may have unreliable connectivity to the cloud, or may have long unexpected periods without connection. The edge pipeline can cache data locally and sync with the cloud when connectivity is restored.
- **Layered network**. In some environments, the network is segmented and data cannot be sent directly to the cloud. The edge pipeline can be used to collect data from monitored resources without cloud access and act as a proxy connection to Azure Monitor.

## Basic operation
The Azure Monitor edge pipeline is a containerized solution that is deployed on an Arc-enabled Kubernetes cluster. It leverages OpenTelemetry Collector as a foundation that enables an extensibility model to support collection from a wide range of data sources.

The following diagram shows the basic components of the Azure Monitor edge pipeline, including the two configuration files that define the operation of the pipeline. The pipeline configuration file defines the data sources and cache configuration for the edge pipeline, while the data collection rule (DCR) provides the definition of the incoming data for the cloud pipeline and potentially transforms the data before sending it to its destination.

:::image type="content" source="media/edge-pipeline/edge-pipeline-overview/.png" lightbox="media/edge-pipeline/edge-pipeline-overview.png" alt-text="Overview diagram of the dataflow for Azure Monitor edge pipeline."::: 

Azure Monitor edge pipeline is built on top of OpenTelemetry Collector, which is a vendor-agnostic, open-source project that provides a single agent for all telemetry data. Once the pipeline extension and instance is installed on your cluster, you configure one or more data flows that define the type of data being collected and where it should be sent. 



## Cache configuration

During intermittent connectivity, Azure Monitor edge pipeline will cache collected data for up to 72 hours and sync the data with cloud.

### Expiration
Defines the amount of time the data can remain in the cache before it's discarded. 

### Persistent volume limit
Memory limit for the cache. When the limit is reached, data is removed according to the data sync type.

### Data sync type

| Type | Description |
|:---|:---|
| FIFO | First in, first out. When connectivity is restored, the oldest data is sent first, and all data in the queue is sent before any real-time data. This preserves the chronological order and completeness of the data making it ideal for data that is informative and used for SLI/SLOs or business KPIs.  |
| LIFO | Last in, first out. When connectivity is restored, the newest data is sent first, and all data in the queue is sent before any real-time data. This delivers the most recent and relevant data making it ideal for dynamic and adaptive data such as security events. |
| Real-time | Real-time data is prioritized before cached data is delivered. This data is ideal for time-sensitive and critical data such as health monitoring or emergency response,  |
<!--- With real-time, is FIFO or LIFO used to flush cache? Or is this additional setting? --->

### Filtering
<!--- Will we have this for public preview? --->

### Aggregation and sampling







## Old

Azure Monitor edge pipeline can receive data, including logs, metrics, and traces from a variety of resources. It can send that data to another edge pipeline in the layer above it in a segmented network, Azure Monitor edge, or other endpoints for local observability or to Azure Monitor. 

### Configuration processing

Azure Monitor edge pipeline can collect data from resources using Azure Monitor agent (AMA), or through polling/pulling. You can deploy the required agent configuration to collect the data from your edge resources which then will be emitted to the edge pipeline. In cases where agent cannot be installed, you can define configurations to implement receivers and collect the data and emit to the edge pipeline for forwarding.  

