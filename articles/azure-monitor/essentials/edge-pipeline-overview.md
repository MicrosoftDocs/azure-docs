---
title: Overview of Azure Monitor pipeline for edge and multicloud
description: Overview of Azure Monitor pipeline for edge and multicloud
ms.topic: conceptual
ms.date: 11/14/2023
ms.author: bwren
author: bwren
---

# Overview of Azure Monitor pipeline for edge and multicloud

Azure Monitor pipeline for edge and multicloud extends the Azure Monitor data pipeline beyond the cloud to the edge of your data center and other clouds. It enables at-scale collection, transformation, and routing of telemetry data at the edge of your data center and to the cloud. It extends the Azure Monitor pipeline beyond the 

- Scalability. 
- Periodic connectivity.
- Layered network.


It leverages OpenTelemetry Collector as a foundation that enables an extensibility model to support collection from a wide range of data sources.

Azure Monitor Pipeline will be deployed on an Arc-enabled K8s cluster in the customers’ environment.  

- 


## Data plane

Azure Monitor edge pipeline can receive data, including logs, metrics, and traces from a variety of resources. It can send that data to another edge pipeline in the layer above it in a segmented network, Azure Monitor edge, or other endpoints for local observability or to Azure Monitor. During intermittent connectivity, it will cache the collected data streams for up to 72 hours and sync the data with cloud as configured (either FIFO or real-time data first).

## Configuration processing

Azure Monitor edge pipeline can collect data from resources using Azure Monitor agent (AMA), or through polling/pulling. You can deploy the required agent configuration to collect the data from your edge resources which then will be emitted to the edge pipeline. In cases where agent cannot be installed, you can define configurations to implement receivers and collect the data and emit to the edge pipeline for forwarding.  

