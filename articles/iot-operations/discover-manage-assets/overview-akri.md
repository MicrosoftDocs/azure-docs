---
title: Configure assets (preview)
description: Understand how the Akri services enable you to detect and discover devices and assets at the edge, and expose them as resources on your cluster.
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

Azure IoT Operations discovers devices and assets by using the included Akri services (preview). The Akri services enable protocol connections and configurations by using Azure Device Registry. The Akri services simplify the process of projecting leaf devices such as OPC UA servers, cameras, IoT sensors, and other assets into the Azure Device Registry. The Akri services use the devices' own protocols to project leaf devices as Azure Resource Manager resources in the Azure Device Registry. For administrators who attach or remove devices from a cluster, this capability reduces the amount of coordination and manual configuration required.

The Akri services are an extensible framework for all device protocols. You can use them with out-of-the-box and partner-built connectors, or you can add custom protocol capabilities by creating connectors. Adding custom logic is made easy with the [Azure IoT Operations SDK](https://github.com/azure/iot-operations-sdks) (preview). Akri services handles the dynamic deployment and lifecycle management of these connectors and the SDK provides clients which make it easy for your connector to interface with other Azure IoT Operations components, so that you can solely focus on the business logic of your connector. 

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

### Connector deployment and lifecycle management

Akri services include the Akri operator which allows connector workloads to be deployed dynamically when certain types of devices or assets are discovered/configured, provides automatic access to Azure IoT Operations resources and endpoints (like Devices and Assets), deploys connector workloads to the right nodes based on discovery information like node affinity, and more. 

### Asset detection 

Akri services also include the Azure Device Registry (ADR) service component, which work with the connectors that have asset detection capabilities. These connectors enable the metadata and preconfigured datasets, events, etc. to be onboarded with ease through known device endpoints. Akri ADR service creates the detected Assets as custom resources which are picked up by the operations experience UI so that as an OT, you can seamlessly view and onboard the detected assets into the Azure Device Registry. 

### Device discovery

Akri services deployments can include fixed-network discovery handlers. Discovery handlers enable assets from known network endpoints to find leaf devices as they appear on device interfaces or local subnets. Examples of network endpoints include OPC UA servers at a fixed IP address, and network scanning discovery handlers. This is not yet supported in this release.


### Compatibility with Kubernetes

The Akri services use standard Kubernetes primitives that let you apply your existing expertise and knowledge. Small devices connected to an Akri-configured cluster can appear as Kubernetes resources, just like memory or CPUs. The Akri services controller enables the cluster operator to start brokers, jobs, or other workloads for individual connected devices or groups of devices. These device configurations and properties remain in the cluster so that if there's node failure, other nodes can pick up any lost work. Security and authentication is also standardized on Kubernetes secrets and TLS practices, making it easy to secure your device connections, no matter the protocol. 

## Connectors supported

The following table shows the connectors currently available in Azure IoT Operations and their asset and device discovery capabilities:

| Connector              | Device discovery | Asset discovery |
|------------------------|:----------------:|:---------------:|
| Connector for OPC UA   |       Yes        |      Yes        |
| Connector for ONVIF    |        No        |      Yes        |
| Media connector        |       Yes        |       No        |
| REST/HTTP connector         |        No        |       No        |

The media connector supports discovery of cameras and other media devices that use the ONVIF protocol.

To learn more about the discovery capabilities of the connectors, see:

- [Automatically discover and configure OPC UA devices and assets](howto-autodetect-opc-ua-assets-use-akri.md)
- [Configure the connector for ONVIF (preview)](howto-use-onvif-connector.md)

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
| Deployment and management features for integrating non-Microsoft or custom protocol connectors |   Yes     |
| Deployment and management features for integrating non-Microsoft or custom protocol discovery handlers |   No     |

## Related content

To learn more about OPC UA automatic asset discovery with Akri services, see [Discover OPC UA data sources using the Akri services](howto-autodetect-opc-ua-assets-use-akri.md)

To learn more about using Akri with ONVIF, Media, or REST/HTTP, see:
- [Understand the connector for media](/articles/iot-operations/discover-manage-assets/overview-media-connector.md)
- [Understand the connector for ONVIF](/articles/iot-operations/discover-manage-assets/overview-onvif-connector.md)
- [Understand the connector for REST/HTTP](/articles/iot-operations/discover-manage-assets/overview-http-connector.md)


To learn more about the open-source CNCF Akri, see the following resources:

- [Documentation](https://docs.akri.sh/)
- [OPC UA Sample on AKS Edge Essentials](/azure/aks/hybrid/aks-edge-how-to-akri-opc-ua)
- [ONVIF Sample on AKS Microsoft Edge Essentials](/azure/aks/hybrid/aks-edge-how-to-akri-onvif)