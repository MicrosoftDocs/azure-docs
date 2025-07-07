---
title: Discover assets (preview)
description: Understand how the Akri services enable you to discover devices and assets at the edge, and expose them as resources on your cluster.
author: dominicbetts
ms.author: dobett
ms.subservice: azure-akri
ms.topic: overview
ms.custom:
  - ignite-2023
ms.date: 04/07/2025

# CustomerIntent: As an industrial edge IT or operations user, I want to to understand how the Akri services enable me to discover devices and assets at the edge, and expose them as resources on a Kubernetes cluster.
---

# What is asset discovery (preview)?

Azure IoT Operations discovers devices and assets by using the included Akri services (preview). The Akri services enable protocol connections and configurations by using Azure Device Registry. The Akri services simplify the process of projecting leaf devices such as OPC UA servers, cameras, IoT sensors, and other assets into the Azure Device Registry. The Akri services use the devices' own protocols to project leaf devices as Azure Resource Manager resources in the Azure Device Registry. For administrators who attach or remove devices from a cluster, this capability reduces the amount of coordination and manual configuration required.

The Akri services are an extensible framework for all device protocols. You can use them with out-of-the-box and partner-built connectors, or you can add custom discovery and provisioning capabilities by adding protocol handlers, connectors, and behaviors. Adding custom logic is made easy with the [Azure IoT Operations SDK](https://github.com/azure/iot-operations-sdks) (preview).

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

The Akri services and connector for OPC UA are a turnkey solution that lets you discover assets connected to an OPC UA server and add the asset configurations into Azure Device Registry. The connector for OPC UA discovers assets at the edge and Akri services maps them to assets in Azure Device Registry. The assets send messages, such as sensor data, to upstream brokers and components. The Akri services let you eliminate the time-consuming and error-prone process of manually configuring and onboarding the assets to your cluster and Azure Device Registry.

To discover OPC UA assets, the assets must be compliant with the [OPC 10000-100: Devices](https://reference.opcfoundation.org/DI/v103/docs/) companion specification. The connector for OPC UA and Akri services follow the process described in [OPC 10000-110: Asset Management Basics](https://reference.opcfoundation.org/AMB/v101/docs/) to discover OPC UA assets and onboard them into Azure Device Registry.

### Features supported

The Akri services support the following features:

| [CNCF Akri Features](https://docs.akri.sh/) | Supported |
| ------------------------------------------- | :-------: |
| Dynamic discovery of devices at the edge (supported protocols: OPC UA, ONVIF, udev)              |   Yes    |
| Schedule devices with minimal latency using Akri's information on node affinity on the cluster  |   Yes    |
| View Akri metrics and logs locally through Prometheus and Grafana                       |   Yes    |
| Secrets and credentials management  |   Yes    |
| M:N device to broker ratio through configuration-level resource support                       |   Yes    |
| Observability on Akri deployments through Prometheus and Grafana dashboards                    |   Yes    |

| Akri services features   | Supported |
|--------------------------|:---------:|
| Installation through the Akri services Arc cluster extension |   Yes     |
| Onboard devices as custom resources to an edge cluster       |   Yes     |
| View the Akri services metrics and logs through Azure Monitor |   Yes     |
| The Akri services discover and create assets that can be ingested into the Azure Device Registry  |   Yes     |
| Akri services configuration by using the operations experience web UI |   Yes     |
| Deployment and management features for integrating non-Microsoft or custom protocol connectors and discovery handlers |   No     |

## Related content

To learn more about the Akri services, see [Discover OPC UA data sources using the Akri services](howto-autodetect-opc-ua-assets-use-akri.md)

To learn more about the open-source CNCF Akri, see the following resources:

- [Documentation](https://docs.akri.sh/)
- [OPC UA Sample on AKS Edge Essentials](/azure/aks/hybrid/aks-edge-how-to-akri-opc-ua)
- [ONVIF Sample on AKS Microsoft Edge Essentials](/azure/aks/hybrid/aks-edge-how-to-akri-onvif)