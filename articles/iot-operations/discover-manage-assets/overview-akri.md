---
title: Detect assets with the Akri services
description: Understand how the Akri services enable you to discover devices and assets at the edge, and expose them as resources on your cluster.
author: dominicbetts
ms.author: dobett
ms.subservice: azure-akri
ms.topic: overview
ms.custom:
  - ignite-2023
ms.date: 05/13/2024

# CustomerIntent: As an industrial edge IT or operations user, I want to to understand how the Akri services enable me to discover devices and assets at the edge, and expose them as resources on a Kubernetes cluster.
---

# What are the Akri services?

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

The Akri services host the discovery handlers that enable you to detect devices and assets at the edge, and expose them as resources on a Kubernetes cluster. Use the Akri services to simplify the process of projecting leaf devices such as OPC UA devices, cameras, IoT sensors, and peripherals into your cluster. The Akri services use the devices' own protocols to project leaf devices into your cluster. For administrators who attach or remove devices from a cluster, this capability reduces the amount of coordination and manual configuration required.

The Akri services are also extensible. You can use them as shipped, or you can add custom discovery and provisioning capabilities by adding protocol handlers, brokers, and behaviors.

The Akri services are a Microsoft-managed commercial version of [Akri](https://docs.akri.sh/), an open-source Cloud Native Computing Foundation (CNCF) project.

## Leaf device integration challenges

It's common to run Kubernetes directly on infrastructure. But to integrate non-Kubernetes IoT leaf devices into a Kubernetes cluster requires a unique solution.

IoT leaf devices present the following challenges, They:

- Contain hardware that's too small, too old, or too locked-down to run Kubernetes.
- Use various protocols and different topologies.
- Have intermittent downtime and availability.
- Require different methods of authentication and secret storage.

## Core capabilities

To address the challenge of integrating non-Kubernetes IoT leaf devices, the Akri services have several core capabilities:

### Device discovery

Akri services deployments can include fixed-network discovery handlers. Discovery handlers enable assets from known network endpoints to find leaf devices as they appear on device interfaces or local subnets. Examples of network endpoints include OPC UA servers at a fixed IP address, and network scanning discovery handlers.

### Dynamic provisioning

Another capability of the Akri services is dynamic device provisioning.  

With the Akri services, you can dynamically provision devices such as:

- USB cameras to use in your cluster.
- IP cameras that you don't want to look up IP addresses for.
- OPC UA server simulations running on your host machine that you use to test Kubernetes workloads.

### Compatibility with Kubernetes

The Akri services use standard Kubernetes primitives that let you apply your existing expertise and knowledge. Small devices connected to an Akri-configured cluster can appear as Kubernetes resources, just like memory or CPUs. The Akri services controller enables the cluster operator to start brokers, jobs, or other workloads for individual connected devices or groups of devices. These device configurations and properties remain in the cluster so that if there's node failure, other nodes can pick up any lost work.

## Discover OPC UA assets

The Akri services are a turnkey solution that lets you discover and create assets connected to an OPC UA server at the edge. The Akri services discover devices at the edge and maps them to assets in your cluster. The assets send telemetry to upstream connectors. The Akri services let you eliminate the painstaking process of manually configuring and onboarding the assets to your cluster.

## Key features

The following list shows the key features of the Akri services:

- **Dynamic discovery**. Protocol representations of devices can come and go, without static configurations in brokers or customer containers. To discover devices, the Akri services use the following methods:

  - **Device network scanning**. This capability is useful for finding devices in smaller, remote locations such as a replacement camera in a store. The ONVIF and OPC UA localhost protocols currently support device network scanning discovery.
  - **Device connecting**. This capability is typically used in larger industrial scenarios such as factory environments where the network is typically static and network scanning isn't permitted. The `udev` and OPC UA local discovery server protocols currently support device connecting discovery.
  - **Device attach**. The Akri services also support custom logic for mapping or connecting devices. There are [open-source templates](https://docs.akri.sh/development/handler-development) to accelerate customization.

- **Optimal scheduling**. The Akri services can schedule devices on specified nodes with minimal latency because it knows where particular devices are located on the Kubernetes cluster. Optimal scheduling applies to directly connected devices, or in scenarios where only specific nodes can access the devices.

- **Optimal configuration**. The Akri services use the capacity of the node to drive cardinality of the brokers for the discovered devices.

- **Secure credential management**. The Akri services facilitate secure access to assets and devices by integrating with services in the cluster that enable secure distribution of credential material to brokers.

### Features supported

The Akri services support the following features:

| [CNCF Akri Features](https://docs.akri.sh/) | Supported |
| ------------------------------------------- | :-------: |
| Dynamic discovery of devices at the edge (supported protocols: OPC UA, ONVIF, udev)              |   ✅    |
| Schedule devices with minimal latency using Akri's information on node affinity on the cluster  |   ✅    |
| View Akri metrics and logs locally through Prometheus and Grafana                       |   ✅    |
| Secrets and credentials management  |   ✅    |
| M:N device to broker ratio through configuration-level resource support                       |   ✅    |
| Observability on Akri deployments through Prometheus and Grafana dashboards                    |   ✅    |

| Akri services features   | Supported |
|--------------------------|:---------:|
| Installation through the Akri services Arc cluster extension |   ✅     |
| Deployment through the orchestration service                 |   ✅     |
| Onboard devices as custom resources to an edge cluster       |   ✅     |
| View the Akri services metrics and logs through Azure Monitor |   ❌     |
| Akri services configuration by using the operations experience web UI |   ❌     |
| The Akri services detect and create assets that can be ingested into the Azure Device Registry  |   ❌     |
| ISVs can build and sell custom protocol handlers for Azure IoT Operations solutions  |   ❌     |

## Related content

To learn more about the Akri services, see:

- [Akri services architecture](concept-akri-architecture.md)
- [Discover OPC UA data sources using the Akri services](howto-autodetect-opcua-assets-using-akri.md)

To learn more about the open-source CNCF Akri, see the following resources:

- [Documentation](https://docs.akri.sh/)
- [OPC UA Sample on AKS Edge Essentials](/azure/aks/hybrid/aks-edge-how-to-akri-opc-ua)
- [ONVIF Sample on AKS Microsoft Edge Essentials](/azure/aks/hybrid/aks-edge-how-to-akri-onvif)
