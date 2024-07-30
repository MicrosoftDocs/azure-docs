---
title: Detect assets with Azure IoT Akri
description: Understand how Azure IoT Akri enables you to discover devices and assets at the edge, and expose them as resources on your cluster.
author: dominicbetts
ms.author: dobett
ms.subservice: akri
ms.topic: overview
ms.custom:
  - ignite-2023
ms.date: 05/13/2024

# CustomerIntent: As an industrial edge IT or operations user, I want to to understand how Azure IoT Akri
# enables me to discover devices and assets at the edge, and expose them as resources on a Kubernetes cluster.
---

# What is Azure IoT Akri Preview?

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Azure IoT Akri Preview is a host for discovery handlers that enable you to detect devices and assets at the edge, and expose them as resources on a Kubernetes cluster. Use Azure IoT Akri to simplify the process of projecting leaf devices such as OPC UA devices, cameras, IoT sensors, and peripherals into your cluster. Azure Iot Akri uses the devices' own protocols to project leaf devices into your cluster. For administrators who attach or remove devices from a cluster, this capability reduces the amount of coordination and manual configuration required.

Azure IoT Akri is also extensible. You can use it as shipped, or you can add custom discovery and provisioning capabilities by adding protocol handlers, brokers, and behaviors.

Azure IoT Akri is a Microsoft-managed commercial version of [Akri](https://docs.akri.sh/), an open-source Cloud Native Computing Foundation (CNCF) project.

## Leaf device integration challenges

It's common to run Kubernetes directly on infrastructure. But to integrate non-Kubernetes IoT leaf devices into a Kubernetes cluster requires a unique solution.

IoT leaf devices present the following challenges, They:

- Contain hardware that's too small, too old, or too locked-down to run Kubernetes.
- Use various protocols and different topologies.
- Have intermittent downtime and availability.
- Require different methods of authentication and secret storage.

## Core capabilities

To address the challenge of integrating non-Kubernetes IoT leaf devices, Azure IoT Akri has several core capabilities:

### Device discovery

Azure IoT Akri deployments can include fixed-network discovery handlers. Discovery handlers enable assets from known network endpoints to find leaf devices as they appear on device interfaces or local subnets. Examples of network endpoints include OPC UA servers at a fixed IP address, and network scanning discovery handlers.

### Dynamic provisioning

Another capability of Azure IoT Akri is dynamic device provisioning.  

With Azure IoT Akri, you can dynamically provision devices such as:

- USB cameras to use in your cluster.
- IP cameras that you don't want to look up IP addresses for.
- OPC UA server simulations running on your host machine that you use to test Kubernetes workloads.

### Compatibility with Kubernetes

Azure IoT Akri uses standard Kubernetes primitives that let you apply your existing expertise and knowledge. Small devices connected to an Akri-configured cluster can appear as Kubernetes resources, just like memory or CPUs. The Azure IoT Akri controller enables the cluster operator to start brokers, jobs, or other workloads for individual connected devices or groups of devices. These Azure IoT Akri device configurations and properties remain in the cluster so that if there's node failure, other nodes can pick up any lost work.

## Discover OPC UA assets

Azure IoT Akri is a turnkey solution that lets you discover and create assets connected to an OPC UA server at the edge. Azure IoT Akri discovers devices at the edge and maps them to assets in your cluster. The assets send telemetry to upstream connectors. Azure IoT Akri lets you eliminate the painstaking process of manually configuring and onboarding the assets to your cluster.

## Key features

The following list shows the key features of Azure IoT Akri Preview:

- **Dynamic discovery**. Protocol representations of devices can come and go, without static configurations in brokers or customer containers. To discover devices, Azure IoT Akri uses the following methods:

  - **Device network scanning**. This capability is useful for finding devices in smaller, remote locations such as a replacement camera in a store. The ONVIF and OPC UA localhost protocols currently support device network scanning discovery.
  - **Device connecting**. This capability is typically used in larger industrial scenarios such as factory environments where the network is typically static and network scanning isn't permitted. The `udev` and OPC UA local discovery server protocols currently support device connecting discovery.
  - **Device attach**. Azure IoT Akri also supports custom logic for mapping or connecting devices. There are [open-source templates](https://docs.akri.sh/development/handler-development) to accelerate customization.

- **Optimal scheduling**. Azure IoT Akri can schedule devices on specified nodes with minimal latency because it knows where particular devices are located on the Kubernetes cluster. Optimal scheduling applies to directly connected devices, or in scenarios where only specific nodes can access the devices.

- **Optimal configuration**. Azure IoT Akri uses the capacity of the node to drive cardinality of the brokers for the discovered devices.

- **Secure credential management**. Azure IoT Akri facilitates secure access to assets and devices by integrating with services in the cluster that enable secure distribution of credential material to brokers.

### Features supported

Azure IoT Akri Preview supports the following features:

| [CNCF Akri Features](https://docs.akri.sh/) | Supported |
| ------------------------------------------- | :-------: |
| Dynamic discovery of devices at the edge (supported protocols: OPC UA, ONVIF, udev)              |   ✅    |
| Schedule devices with minimal latency using Akri's information on node affinity on the cluster  |   ✅    |
| View Akri metrics and logs locally through Prometheus and Grafana                       |   ✅    |
| Secrets and credentials management  |   ✅    |
| M:N device to broker ratio through configuration-level resource support                       |   ✅    |
| Observability on Akri deployments through Prometheus and Grafana dashboards                    |   ✅    |

| Azure IoT Akri features  | Supported |
|--------------------------|:---------:|
| Installation through Azure IoT Akri Arc cluster extension |   ✅     |
| Deployment through the orchestration service              |   ✅     |
| Onboard devices as custom resources to an edge cluster    |   ✅     |
| View Azure IoT Akri metrics and logs through Azure Monitor |   ❌     |
| Azure IoT Akri configuration by using the Azure IoT Operations (preview) portal |   ❌     |
| Azure IoT Akri detects and creates assets that can be ingested into the Azure Device Registry  |   ❌     |
| ISVs can build and sell custom protocol handlers for Azure IoT Operations solutions  |   ❌     |

## Related content

To learn more about Azure IoT Akri, see:

- [Azure IoT Akri architecture](concept-akri-architecture.md)
- [Discover OPC UA data sources using Azure IoT Akri](howto-autodetect-opcua-assets-using-akri.md)

To learn more about the open-source CNCF Akri, see the following resources:

- [Documentation](https://docs.akri.sh/)
- [OPC UA Sample on AKS Edge Essentials](/azure/aks/hybrid/aks-edge-how-to-akri-opc-ua)
- [ONVIF Sample on AKS Microsoft Edge Essentials](/azure/aks/hybrid/aks-edge-how-to-akri-onvif)
