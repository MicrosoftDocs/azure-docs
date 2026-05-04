---
title: Layered networking for Azure IoT Operations
description: Learn about deploying Azure IoT Operations across layered (Purdue/ISA-95) industrial networks using Envoy proxy chaining, CoreDNS, and Kubernetes-based configuration.
author: sethmanheim
ms.subservice: layered-network-management
ms.author: sethm
ms.topic: concept-article
ms.custom:
  - ignite-2023
ms.date: 03/24/2026

#CustomerIntent: As an operator, I want to understand how Azure IoT Operations works in a layered network so I can deploy across segmented industrial environments.
ms.service: azure-iot-operations
---

# Layered networking for Azure IoT Operations

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

## How telemetry flows through layers

In a layered network, asset telemetry doesn't pass straight through from the lowest layer to the cloud. Instead, telemetry *terminates and re-originates* at each layer. This hop-by-hop pattern is a key difference from a flat network deployment.

The flow works as follows:

1. **Level 2 (asset layer):** The Connector for OPC UA reads data from OPC UA servers and publishes it to the local MQTT broker (for example, to a topic like `clusterl2/data/oven1`). A Data Flow picks up those messages, optionally transforms or enriches them (for example, adding product context), and forwards them to the MQTT broker at level 3.
1. **Level 3 (operations layer):** The level 3 MQTT broker receives the messages from level 2. A Data Flow at this layer can add further context (for example, production line details) and forwards the enriched messages to the MQTT broker at level 4.
1. **Level 4 (enterprise layer):** The level 4 MQTT broker receives the messages from level 3. A final Data Flow adds any remaining context (for example, factory identifiers) and sends the messages to a cloud destination such as Azure Event Hubs or Azure Event Grid through the private or public connectivity path.

At every layer, the data is fully terminated on the local MQTT broker, it isn't tunneled or pass-through. This gives you the ability to:

- **Enrich data at each level** — add contextual metadata (product, line, factory) that lower-layer assets don't know about.
- **Filter or aggregate** — reduce data volume or drop irrelevant messages before forwarding upward.
- **Consume locally** — other applications at the same layer can subscribe to the local MQTT broker for departmental workloads without waiting for data to round-trip to the cloud.

For a hands-on walkthrough of this pattern, see step 5 in the [sample walkthrough](#sample-walkthrough).

## Sample walkthrough

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

## Platform compatibility

The layered networking approach described here applies to **Arc-enabled Kubernetes clusters**. If you use other Arc-enabled platforms in your layered environment, keep the following in mind:

- **[Azure Arc-enabled servers](/azure/azure-arc/servers/overview):** The Envoy proxy chain has only been validated with Arc-enabled Kubernetes clusters. Arc-enabled servers use a different agent ([Azure Connected Machine agent](/azure/azure-arc/servers/agent-overview)) with different endpoint requirements. If you need to Arc-enable servers in a layered network, verify that the required endpoints are included in your Envoy proxy and CoreDNS configuration. Azure IoT Operations components (MQTT broker, Data Flows, Connector for OPC UA) require Kubernetes and can't run on Arc-enabled servers directly.
- **[Azure Local](/azure/azure-local/overview) (formerly Azure Stack HCI):** Azure Local nodes that host Kubernetes clusters (such as [AKS enabled by Azure Arc](/azure/aks/aksarc/overview)) are fully compatible with this layered networking approach. The Kubernetes cluster running on Azure Local follows the same Arc enablement and Envoy proxy chain described above.

## Related content

- [Azure IoT Operations networking](overview-layered-network.md)
- [Deploy Azure IoT Operations with private connectivity](howto-private-connectivity.md)
- [Tutorial: Deploy Azure IoT Operations in a layered network with private connectivity](../end-to-end-tutorials/tutorial-layered-network-private-connectivity.md)
