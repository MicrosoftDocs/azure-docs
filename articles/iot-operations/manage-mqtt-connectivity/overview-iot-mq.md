---
title: Publish and subscribe MQTT messages using Azure IoT MQ
#titleSuffix: Azure IoT MQ
description: Use Azure IoT MQ to publish and subscribe to messages. Destinations include other MQTT brokers, Azure IoT Data Processor, and Azure cloud services.
author: PatAltimore
ms.author: patricka
ms.topic: conceptual
ms.custom:
  - ignite-2023
ms.date: 10/30/2023

#CustomerIntent: As an operator, I want to understand how to I can use Azure IoT MQ to publish and subscribe MQTT topics.
---

# Publish and subscribe MQTT messages using Azure IoT MQ

Azure IoT MQ features an enterprise-grade, standards-compliant MQTT Broker that is scalable, highly available and Kubernetes-native. It provides the messaging plane for Azure IoT Operations, enables bi-directional edge/cloud communication and powers [event-driven applications](/azure/architecture/guide/architecture-styles/event-driven) at the edge.


## MQTT compliant

IoT MQ features a standards-compliant MQTT Broker that supports both MQTT v3.1.1 and MQTT v5. 

Message Queue Telemetry Transport (MQTT) has emerged as the *lingua franca* among protocols in the IoT space. MQTT's simple design allows a single broker to serve tens of thousands of clients simultaneously, with a lightweight publish-subscribe topic creation and management. Many IoT devices support MQTT natively out-of-the-box, with the long tail of IoT protocols being rationalized into MQTT by downstream translation gateways.

IoT MQ uses the [MQTT](https://mqtt.org/) protocol as the underpinning for the messaging layer.

## Highly available and scalable

Kubernetes can horizontally scale workloads to run in multiple instances. This redundancy means additional capacity to serve requests and reliability in case any instance goes down. Kubernetes has self-healing built in, and instances are recovered automatically.

In addition to Kubernetes being an elastic scaling technology, it's also a standard for DevOps. If MQTT is the lingua franca among IoT protocols, Kubernetes is the lingua franca for computing infrastructure layer. By adopting Kubernetes, you can use the same CI/CD pipeline, tools, monitoring, app packaging, employee skilling everywhere. The result is a single end-to-end system from cloud computing, on-premises servers, and smaller IoT gateways on the factory floor. You can spend less time dealing with infrastructure or DevOps and focus on your business.

Azure IoT MQ focuses on the unique edge-native, data-plane value it can provide to the Kubernetes ecosystem while fitting seamlessly into it. It brings high performance and scalable messaging platform plane built around MQTT, and seamless integration to other scalable Kubernetes workloads and Azure.

## Secure by default

IoT MQ builds on top of battle-tested Azure and Kubernetes-native security and identity concepts making it both highly secure and usable. It supports multiple authentication mechanisms for flexibility along with granular access control mechanisms all the way down to individual MQTT topic level. 


## Azure Arc integration

Microsoft's hybrid platform is anchored around Kubernetes with Azure Arc as a single control plane. It provides a management plane that projects existing non-Azure, on-premises, or other-cloud resources into Azure Resource Manager. The result is a single control pane to manage virtual machines, Kubernetes clusters, and databases not running in Azure data centers.

IoT MQ is deployed as an Azure Arc for Kubernetes extension and can be managed via a full featured Azure resource provider (RP) - **microsoft/IoTOperationsMQ**. This means you can manage it just like native Azure cloud resources such as Virtual Machines, Storage, etc.

Azure Arc technology enables the changes to take effect on IoT MQ services running on the on-premises Kubernetes cluster. Optionally, if you prefer a fully Kubernetes-native approach, you can manage IoT MQ with Kubernetes custom resource definitions (CRDs) locally or using GitOps technologies like Flux.

## Cloud connectors

You might have different messaging requirements for your cloud scenario. For example, a bi-directional cloud/edge *fast* path for high priority data or to power near real-time cloud dashboards and a lower-cost *slow* path for less time-critical data that can be updated in batches. 

To provide flexibility, Azure IoT MQ provides built-in Azure Connectors to Event Hubs (with Kafka endpoint), Event Grid cloud MQTT Broker, Microsoft Fabric and Blob Storage. IoT MQ is extensible so that you can choose your preferred cloud messaging solution that works with your solution.

Building on top of Azure Arc allows the connectors to be configured to use Azure Managed Identity for accessing the cloud services with powerful Azure Role-based Access Control (RBAC). No manual, insecure, and cumbersome credential management required!

## Dapr programming model

[Dapr](https://dapr.io/) simplifies *plumbing* between distributed applications by exposing common distributed application capabilities, such as state management, service-to-service invocation, and publish-subscribe messaging. Dapr components lie beneath the building blocks and provide the concrete implementation for each capability. You can focus on business logic and let Dapr handle distributed application details.

IoT MQ provides pluggable Dapr publish-subscribe and state store building blocks making development and deployment of event-driven applications on the edge easy and technology agnostic. 

## Architecture

The MQTT broker has three layers: 

- Stateless front-end layer that handles client requests
- Load-balancer that routes requests and connects the broker to others
- Stateful and sharded back-end layer that stores and processes data

The back-end layer partitions data by different keys, such as client ID for client sessions, and topic name for topic messages. It uses chain replication to replicate data within each partition. For data that's shared by all partitions, it uses a single chain that spans all the partitions.

The goals of the architecture are:

- **Fault tolerance and isolation**: Message publishing continues if back-end nodes fail and prevents failures from propagating to the rest of the system
- **Failure recovery**: Automatic failure recovery without operator intervention
- **No message loss**: Delivery of messages if at least one front-end node and one back-end node is running
- **Elastic scaling**: Horizontal scaling of publishing and subscribing throughput to support edge and cloud deployments
- **Consistent performance at scale**: Limit message latency overhead due to chain-replication
- **Operational simplicity**: Minimum dependency on external components to simplify maintenance and complexity


## Next steps

[Deploy a solution in Azure IoT Operations](../deploy-iot-ops/howto-deploy-iot-operations.md)
