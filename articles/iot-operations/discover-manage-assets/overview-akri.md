---
title: Learn about Akri (preview)
description: Understand how the Akri services enable you to dynamically configure and deploy Akri connectors to connect a broad variety of assets and devices to the Azure IoT Operations cluster, ingest telemetry from them, and use command and control.
author: dominicbetts
ms.author: dobett
ms.subservice: azure-akri
ms.topic: overview
ms.custom:
  - ignite-2023
ms.date: 07/08/2025

# CustomerIntent: As an industrial edge IT or operations user, I want to to understand how the Akri services enable me to discover devices and assets at the edge, and expose them as resources on a Kubernetes cluster.
---

# What are Akri services (preview)?

The Azure IoT Operations southbound connectors use Akri services to:

- Discover physical devices and devices connected to your cluster.
- Enable connectivity to the physical assets and devices by using protocols such as ONVIF and REST/HTTP.
- Configure namespace assets and devices as custom resources in your Kubernetes cluster.
- Integrate with Azure Device Registry to project device and namespace assets to the cloud as Azure Resource Manager resources, reducing the amount of manual configuration required.

The Akri services provide an extensible framework for all device connectivity protocols. The following types of southbound connector all use Akri services:

- Built-in connectors such as the **connector for ONVIF**, **media connector**, and **connector for REST/HTTP (preview)**.
- Partner-provided connectors.
- Custom connectors.

The [Azure IoT Operations SDK (preview)](https://github.com/azure/iot-operations-sdks) includes examples to help you get started building custom connectors. The SDK samples show you how to:

- Use the Akri services to deploy connectors and manage their lifecycle.
- Interface with other Azure IoT Operations components such as the MQTT broker.

The Akri services are a Microsoft-managed commercial version of [Akri](https://docs.akri.sh/), an open-source Cloud Native Computing Foundation (CNCF) project.

## Leaf device integration challenges

In Azure IoT Operations, your Kubernetes cluster runs on your edge infrastructure, which introduces challenges when you want to integrate non-Kubernetes IoT leaf devices. For example:

- They use hardware that's too small, too old, or too locked-down to run Kubernetes.
- They use various protocols and different topologies.
- They have intermittent downtime and availability.
- They require different methods of authentication and secret storage.

## Core capabilities

To address the challenges of integrating non-Kubernetes IoT leaf devices, the Akri services have several core capabilities:

### Connector deployment and lifecycle management

Akri services include the _Akri operator_. The operator lets you deploy connectors dynamically when certain types of devices are found on the cluster and the corresponding namespace assets are allocated to the connector. The Akri operator provides automatic access to Azure IoT Operations resources such as device endpoints and namespace assets.

### Asset discovery

Akri services include the _Azure Device Registry service component_, which works with the connectors that have discovery capabilities. These connectors enable the metadata and definitions such as datasets and events to be onboarded through known device endpoints. The Azure Device Registry service component creates the discovered namespace assets as custom resources that an OT user can view in the operations experience web UI. The OT user can then onboard the discovered assets as namespace assets that are automatically added to the Azure Device Registry.

### Physical device discovery

Akri services deployments can include fixed-network discovery handlers. Discovery handlers enable assets from known network endpoints to find leaf devices as they appear on device interfaces or local subnets. Examples of network endpoints include OPC UA servers at a fixed IP address, and network scanning discovery handlers. This capability isn't supported in the current release.

### Compatibility with Kubernetes

The Akri services use standard Kubernetes primitives that let you apply your existing expertise and knowledge:

- Small devices connected to an Akri-configured cluster can appear as Kubernetes custom resources, just like memory or CPUs. These device and asset configurations and properties remain in the cluster so that if a node fails, other nodes can pick up any lost work.

- Security and authentication use standard Kubernetes secrets and TLS practices, which makes it easy to secure your device connections regardless of the connectivity protocol.

### Feature support

The Akri services support the following features:

| Akri services features   | Supported |
|--------------------------|:---------:|
| Installation through the Azure IoT Operations Arc extension |   Yes     |
| Onboard devices as custom resources to an edge cluster       |   Yes     |
| View the Akri services metrics and logs through Azure Monitor |   Yes     |
| The Akri services discover and create assets that can be ingested into the Azure Device Registry  |   Yes     |
| Akri services configuration by using the operations experience web UI |   Yes     |
| Deployment and management features for integrating non-Microsoft or custom protocol connectors |   Yes     |
| Deployment and management features for integrating non-Microsoft or custom protocol discovery handlers |   No     |

## Related content

To learn more about OPC UA automatic asset discovery with Akri services, see [Discover OPC UA data sources using the Akri services](howto-autodetect-opc-ua-assets-use-akri.md)

To learn more about using Akri with ONVIF, Media, or REST/HTTP, see:

- [Understand the connector for media](./overview-media-connector.md)
- [Understand the connector for ONVIF](./overview-onvif-connector.md)
- [Understand the connector for REST/HTTP](overview-http-connector.md)

To learn more about the open-source CNCF Akri, see the following resources:

- [Documentation](https://docs.akri.sh/)
- [OPC UA Sample on AKS Edge Essentials](/azure/aks/hybrid/aks-edge-how-to-akri-opc-ua)
- [ONVIF Sample on AKS Microsoft Edge Essentials](/azure/aks/hybrid/aks-edge-how-to-akri-onvif)