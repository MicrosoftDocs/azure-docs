---
title: Production deployment examples
description: Describes some example deployments to help you understand how to scale your solution.
author: dominicbetts
ms.author: dobett
ms.topic: concept-article
ms.date: 12/16/2024
ms.service: azure-iot-operations

#CustomerIntent: I want to see some scaling recommendations before I before deploying to production.
---

# Production deployment examples

This article describes two example Azure IoT Operations deployments that collect data from edge and transfer it to the cloud. These examples are based on real-world scenarios that take hardware capability and data volumes into consideration. Use these examples to better understand how much data Azure IoT Operations can handle with certain hardware.

Microsoft used similar configurations and data volumes to validate Azure IoT Operations and measure its performance.

## Single node cluster

This example shows the capabilities of Azure IoT Operations when it runs on a host with relatively low hardware specification. In this example, Azure IoT Operations is deployed to a single node cluster. Data generated from assets is first aggregated with a PLC, and then sent to the Azure IoT Operations connector for OPC UA.

### Configuration

Example hardware specifications:

- K3s on Azure VM (Standard_D4ds_v5  with Intel Xeon Platinum 8370C), 4 core (4 vCPU), 16-GB memory, 30-GB storage.

- AKS-EE on P3 Tiny Workstation (13th Generation Intel® Core™ i7-13700 vPro® Processor), 16 core (24 threads), 32-GB memory, 1-TB storage.

The following table shows the MQTT broker configuration for the single node example:

| Parameter                | Value |
|--------------------------|-------|
| frontendReplicas         | 1     |
| frontendWorkers          | 1     |
| backendRedundancyFactor  | 1     |
| backendWorkers           | 1     |
| backendPartitions        | 1     |
| memoryProfile            | low   |

The end-to-end data flow in the example looks like this:

`Assets -> PLC -> Connector for OPC UA -> MQTT broker -> Dataflows -> Event Hubs`

The data volumes in the example are:

- 125 assets aggregated by a single OPC UA server.
- 6,250 tags based on 50 tags for each asset. Each tag updates 2/second and has an average size of 20 bytes.
- The connector for OPC UA sends 125 message/second to the MQTT broker.
- One data flow pipeline pushes 6,250 tags to an Event Hubs endpoint.

In this example, Microsoft recommends using Event Hubs because you can only create one dataflow instance with a 4-core CPU. If you choose Event Grid, it can only handle 100 messages/sec.

### Performance

Key performance metrics for this example include:

- Azure IoT Operations and its dependencies consume between 6 GB and 8-GB RAM.
- Azure IoT Operations and its dependencies consume on average 2,400-2,600 millicores.
- 100% of the data is pushed to Event Hubs.
- End-to-end data process latency is less than 10 seconds given ideal network conditions.

## Multi-node cluster

When Azure IoT Operations runs on a multi-node cluster, it can process more data and take advantage of the high-availability capabilities of Kubernetes. In this example, Azure IoT Operations is hosted on a 5-node cluster and processes approximately 50,000 data points per second from two different data sources.

### Configuration

Example hardware specifications:

- 5-node K3s with Azure VMs (Standard_D8d_v5 with Intel Xeon Platinum 8370C), 8 core (8 vCPU), 32-GB memory, 30 GB.
- 5-node K3S with P3 Tiny Workstations (13th Generation Intel® Core™ i7-13700 vPro® Processor), 16 core (24 threads), 32-GB memory, 1-TB storage.

The following table shows the MQTT broker configuration for the multi-node example:

| Parameter                | Value |
|--------------------------|-------|
| frontendReplicas         | 5     |
| frontendWorkers          | 8     |
| backendRedundancyFactor  | 2     |
| backendWorkers           | 4     |
| backendPartitions        | 5     |
| memoryProfile            | High  |

In this example, there are two types of data source. One connects through the connector for OPC UA, and one connects through the MQTT broker.

In this example, an asset doesn't represent a real piece of equipment, but is a logical grouping that aggregates data points and sends messages.

The first end-to-end data flow in the example looks like this:

`Assets -> PLC -> Connector for OPC UA -> MQTT broker -> Dataflows -> Event Hubs`

The data volumes in the first data flow in the example are:

- 85 assets, aggregated by five OPC UA servers.
- 85,000 tags based on 1,000 tags for each asset. Each tag updates 1/second and has an average size of 8 bytes. Approximately 50% of the tag values change each cycle. The data point update rate is 45,000/second.
- The connector for OPC UA sends 85 message/second to the MQTT broker.
- One data flow pipeline pushes 85,000 tags to an Event Hubs endpoint.

The second end-to-end data flow in the example looks like this:

`MQTT client (Paho) -> MQTT Broker -> Dataflows -> Event Hubs`

The data volumes in the second data flow in the example are:

- Two MQTT clients connected directly to MQTT broker.
- Each client publishes 10,000 values/second.
  - Approximately 1/3 of the tag values change each cycle.
  - Encoded with JSON format. Each item (value) with an approximate size of 180 bytes.

### Performance

Key performance metrics for this example include:

- Azure IoT Operations and its dependencies consume between 25 GB and 30 GB RAM.
- Azure IoT Operations and its dependencies consume on average 2,500-3,000 millicores.
- 100% of the data is pushed to Event Hubs.
- End-to-end data process latency is less than 10 seconds given ideal network conditions.
