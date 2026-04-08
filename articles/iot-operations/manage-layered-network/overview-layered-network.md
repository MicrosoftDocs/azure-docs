---
title: Azure IoT Operations networking
description: Learn about Azure IoT Operations networking
author: dominicbetts
ms.subservice: layered-network-management
ms.author: dobett
ms.topic: concept-article
ms.custom:
  - ignite-2023
ms.date: 03/24/2026

#CustomerIntent: As an operator, I want understand how to use Azure IoT Operations networking to secure my devices.
ms.service: azure-iot-operations
---

# Azure IoT Operations networking

Networking is a foundational aspect of deploying and managing distributed systems, especially in hybrid and multicloud environments. In Azure IoT Operations, secure networking enables reliable connectivity between on-premises resources, edge devices, and Azure services. Proper network configuration is essential for communication, security, and scalability of IoT Operations and Kubernetes clusters. This article describes key networking options for IoT Operations.

## Choose your networking approach

Before deploying, determine which networking approach fits your scenario:

- **Private connectivity:** If you have a single cluster that needs private connectivity to Azure without network segmentation between layers, use this approach. You can use Private Link for storage and data flow destinations, Arc Gateway to reduce firewall endpoints, and Azure Firewall Explicit Proxy to keep all traffic on private networks. See [Deploy Azure IoT Operations with private connectivity](howto-private-connectivity.md).
- **Layered network:** If you have a Purdue/ISA-95 segmented topology with multiple network layers (L2/L3/L4) and adjacent-only communication, use a layered network deployment. This approach adds Envoy proxy chaining, CoreDNS at each layer, and multi-cluster Azure IoT Operations deployments across layers. **If you have a layered topology, this is the recommended approach.** See [Tutorial: Deploy Azure IoT Operations in a layered network with private connectivity](../end-to-end-tutorials/tutorial-layered-network-private-connectivity.md).

## Layered networking

In many industrial environments, segmented networking architectures (such as the [Purdue Network Architecture](https://en.wikipedia.org/wiki/Purdue_Enterprise_Reference_Architecture)) separate assets, control systems, and business applications into distinct network layers. Lower layers typically can't connect directly to the internet and can only communicate with adjacent layers. Azure IoT Operations supports deploying across these layered networks, using Envoy proxy chaining, CoreDNS, and Kubernetes-based configuration to route traffic between layers.

The following diagram shows Azure IoT Operations deployed to multiple clusters in different network segments. In the Purdue Network architecture, level 4 is the enterprise network, level 3 is the operation and control layer, and level 2 is the controller system layer. Only level 4 has direct internet access, and the other levels can only communicate with their adjacent levels.

:::image type="content" source="media/layered-network-architecture.png" alt-text="Diagram that shows layered networking architecture for industrial layered networks.":::

In this example, Azure IoT Operations is deployed to levels 2 through 4. Each layer uses the following components to route traffic upward to the next layer:

- **Envoy Proxy** (levels 3 and 4) — acts as a reverse proxy that forwards traffic from child layers toward Azure.
- **CoreDNS** (levels 2 and 3) — resolves approved URIs to the parent cluster's Envoy Proxy, so lower layers can reach Azure services through adjacent layers.

This setup lets you Arc-enable clusters at every layer and keep them connected without direct internet access.

You can deploy Azure IoT Operations components across layers based on your architecture and data flow needs:

- **Connector for OPC UA** — place at the lower layer, closer to your assets and OPC UA servers.
- **MQTT broker** — deploy at each layer to transfer data upward toward the cloud.
- **Data Flows** — place on nodes with enough compute resources, as this component typically uses more compute. With extra configuration, Data Flows can also route traffic east-west between components at the same or upper levels.

### Sample walkthrough

A [layered networking guidance sample](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/layered-networking) is available in the Azure IoT Operations samples repository. The sample repository contains the infrastructure configuration files (Envoy proxy configs, CoreDNS Corefiles, and Kubernetes manifests) used at each network layer. The [tutorial](../end-to-end-tutorials/tutorial-layered-network-private-connectivity.md) provides the complete end-to-end deployment guide, including Azure resource setup, Private Link and DNS configuration, Arc enablement, RBAC assignments, and post-deployment audit, and references the sample for layer-specific configuration files.

The sample and guidance show how to:

- Use Kubernetes-based configuration and networking primitives for layered environments.
- Connect devices in isolated networks at scale to [Azure Arc](/azure/azure-arc/) for application lifecycle management and remote configuration.
- Enforce security and governance across network levels with URL/IP allow lists and connection auditing.
- Ensure compatibility with all Azure IoT Operations services.

> [!NOTE]
> The guidance doesn't recommend specific practices or provide production-ready implementation, configuration, or operations details. The guidance doesn't make recommendations about production networking architecture.

To learn more about how to prepare for a production-ready deployment of Azure IoT Operations, see the [Azure IoT Operations production guidelines](../deploy-iot-ops/concept-production-guidelines.md).    

To try the sample in a test environment, follow the step-by-step walkthrough:

1. [How Azure IoT Operations works in a layered network](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/layered-networking/aio-layered-network.md)
2. [Configure the infrastructure](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/layered-networking/configure-infrastructure.md)
3. [Arc-enable the K3s clusters](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/layered-networking/arc-enable-clusters.md)
4. [Deploy Azure IoT Operations](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/layered-networking/deploy-aio.md)
5. [Flow asset telemetry](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/layered-networking/asset-telemetry.md)

> [!TIP]
> If you want to deploy Azure IoT Operations end-to-end in a layered network with private connectivity, see [Tutorial: Deploy Azure IoT Operations in a layered network with private connectivity](../end-to-end-tutorials/tutorial-layered-network-private-connectivity.md).

## Network connectivity options

Azure IoT Operations can use the following Azure services to simplify and secure network connectivity between your on-premises environment and Azure.

### Azure Arc gateway

The Azure Arc gateway acts as a network proxy that lets you simplify network configuration requirements by reducing the number of Azure endpoints to allow through your firewall. By routing traffic through the gateway, you can simplify firewall rules and reduce the need for complex network changes. This approach is especially useful for securely connecting isolated or segmented environments to Azure Arc and Azure IoT Operations.

For more information, see [Simplify network configuration requirements with Azure Arc gateway (preview)](/azure/azure-arc/kubernetes/arc-gateway-simplify-networking).

### Azure Firewall Explicit Proxy

Azure Firewall Explicit Proxy allows you to direct Azure Arc and IoT Operations traffic through a managed firewall, providing enhanced security and monitoring. This is useful for organizations that require all outbound traffic to be inspected or logged, and helps meet compliance requirements by controlling and auditing network flows to Azure.

For more information, see [Access Azure services over Azure Firewall Explicit Proxy (Public Preview)](/azure/azure-arc/azure-firewall-explicit-proxy).