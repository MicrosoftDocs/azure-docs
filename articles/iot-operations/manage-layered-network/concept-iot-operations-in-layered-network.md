---
title: How does Azure IoT Operations work in layered network?
description: Use the layered network sample to enable Azure IoT Operations in industrial network environment.
author: dominicbetts
ms.subservice: layered-network-management
ms.author: dobett
ms.topic: concept-article
ms.date: 11/07/2025

#CustomerIntent: As an operator, I want to learn about the architecture of Azure IoT Operations in a Purdue Network environment and how does Layered Network Management support this scenario.
ms.service: azure-iot-operations
---

# How does Azure IoT Operations work in layered network?

In the basic architecture described in [Azure IoT Operations Architecture Overview](../overview-iot-operations.md#architecture-overview), all the Azure IoT Operations components are deployed to a single internet-connected cluster. In this type of environment, component-to-component and component-to-Azure connections are enabled by default.

However, in many industrial scenarios, computing units for different purposes are located in separate networks. For example:
- Assets and servers on the factory floor
- Data collecting and processing solutions in the data center 
- Business logic applications with information workers

In industries like manufacturing, you often see segmented networking architectures that create layers. These layers minimize or block lower-level segments from connecting to the internet (for example, [Purdue Network Architecture](https://en.wikipedia.org/wiki/Purdue_Enterprise_Reference_Architecture)).

## Layered networking sample overview

IoT Operations provides a set of sample deployments and configurations to help you understand how to implement Azure IoT Operations in a layered network environment in a test environment and use it to route telemetry from assets on the edge to Azure services in the cloud.

This [IoT sample guidance](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/layered-networking#readme) describes the test environment Microsoft uses to validate Azure IoT Operations deployments in a layered network using open, industry-recognized software.

This guidance covers:

- Kubernetes-based configuration and compatibility with networking primitives
- Connecting devices in layered networks at scale to [Azure Arc](/azure/azure-arc/) for remote management and configuration from a single Azure control plane
- Security and governance across network levels for devices and services with URL and IP allowlists and connection auditing


> [!NOTE]
> The guidance doesn't recommend specific practices or provide production-ready implementation, configuration, or operations details. The guidance doesn't make recommendations about production networking architecture.

To learn more about how to prepare for a production-ready deployment of Azure IoT Operations, see the [Azure IoT Operations production checklist](../../iot-edge/production-checklist.md).

## Example of Azure IoT Operations in a layered network

The following diagram shows Azure IoT Operations deployed to multiple clusters in different network segments. In the Purdue Network architecture, level 4 is the enterprise network, level 3 is the operation and control layer, and level 2 is the controller system layer. Only level 4 has direct internet access, and the other levels can only communicate with their adjacent levels.

:::image type="content" source="media/layered-network-architecture.png" alt-text="Diagram that shows layered networking architecture for industrial layered networks.":::

In this example, Azure IoT Operations is deployed to levels 2 through 4. At levels 3 and 4, the Envoy Proxy is deployed, and levels 2 and 3 have Core DNS set up to resolve the approved URI to the parent cluster, which directs them to the parent Envoy Proxy. This setup redirects traffic from the lower layer to the parent layer. It lets you Arc-enable clusters and keep an Arc-enabled cluster running.

With extra configuration, you can use this technique to direct traffic east-west. This route lets Azure IoT Operations components send data to other components at upper levels and create data pipelines from the bottom layer to the cloud. In a multilayer network, you can deploy Azure IoT Operations components across layers based on your architecture and data flow needs. This example gives you general ideas about where to place individual components.

- Place the connector for OPC UA at the lower layer, closer to your assets and OPC UA servers.
- Transfer data toward the cloud through the MQTT Broker components in each layer.
- Use the Data Flows component on nodes with enough compute resources, because it typically uses more compute.

## Key scenarios

The layered networking sample guidance includes the following key scenarios:

1. Learn [How Azure IoT Operations Works in a layered network](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/layered-networking/aio-layered-network.md).
1. Learn how to use CoreDNS and Envoy Proxy in [Configure the infrastructure](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/layered-networking/configure-infrastructure.md).
1. Learn how to Arc enable the K3s clusters in [Arc enable the K3s clusters](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/layered-networking/arc-enable-clusters.md).
1. Learn how to deploy Azure IoT Operations to the clusters in [Deploy Azure IoT Operations](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/layered-networking/deploy-aio.md).
1. Learn how to flow asset telemetry through the deployments into Azure Event Hubs in [Flow asset telemetry](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/layered-networking/asset-telemetry.md).



