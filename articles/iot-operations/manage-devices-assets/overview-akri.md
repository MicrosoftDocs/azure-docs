---
title: Detect assets with Azure IoT Akri
description: Understand how Azure IoT Akri enables you to discover devices and assets at the edge, and expose them as resources on your cluster.
author: timlt
ms.author: timlt
# ms.subservice: akri
ms.topic: concept-article
ms.custom:
  - ignite-2023
ms.date: 10/26/2023

# CustomerIntent: As an industrial edge IT or operations user, I want to to understand how Azure IoT Akri
# enables me to discover devices and assets at the edge, and expose them as resources on a Kubernetes cluster.
---

# Detect assets with Azure IoT Akri

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Azure IoT Akri (preview) is a hosting framework for discovery handlers that enables you to detect devices and assets at the edge, and expose them as resources on a Kubernetes cluster. By using Azure IoT Akri, you can simplify the process of projecting leaf devices (OPC UA devices, cameras, IoT sensors, and peripherals) into your cluster.  Azure Iot Akri projects leaf devices into a cluster by using the devices' own protocols. For administrators who attach devices to or remove them from the cluster, this capability reduces the level of coordination and manual configuration. The hosting framework is also extensible. You can use it as shipped, or you can add custom discovery and provisioning by adding protocol handlers, brokers and behaviors. Azure IoT Akri is a Microsoft-managed commercial version of [Akri](https://docs.akri.sh/), an open source Cloud Native Computing Foundation (CNCF) project.  

:::image type="content" source="media/overview-akri/akri-logo.png" alt-text="Logo for the Akri project." border="false":::

## The challenge of integrating IoT leaf devices at the edge

It's common to run Kubernetes directly on infrastructure. But to integrate non-Kubernetes IoT leaf devices into a Kubernetes cluster requires a unique solution. 

IoT leaf devices present the following challenges:
- Contain hardware that's too small, too old, or too locked-down to run Kubernetes
- Use various protocols and different topologies
- Have intermittent downtime and availability
- Require different methods of authentication and storing secrets

## What Azure IoT Akri does
To address the challenge of integrating non-Kubernetes IoT leaf devices, Azure IoT Akri provides several core capabilities.

### Device discovery
Azure IoT Akri deployments can include fixed-network discovery handlers. Discovery handlers enable assets from known network endpoints to find leaf devices as they appear on device interfaces or local subnets. Examples of network endpoints include OPC UA servers at a fixed IP address (without network scanning), and network scanning discovery handlers.

### Dynamic provisioning
Another capability of Azure IoT Akri is dynamic device provisioning.  

With Azure IoT Akri, you can dynamically provision devices like the following examples:

- USB cameras that you want to use on your cluster
- IP cameras that you don't want to look up IP addresses for
- OPC UA servers simulated on your host machine to test Kubernetes workloads


### Compatibility with Kubernetes
Azure IoT Akri employs standard Kubernetes primitives. The use of Kubernetes primitives lets users apply their expertise creating applications or managing infrastructure. Small devices connected in an Akri-configured site can appear as Kubernetes resources, just like memory or CPUs. The Azure IoT Akri controller enables the cluster operator to start brokers, jobs or other workloads for individual connected devices or groups of devices. These Azure IoT Akri device configurations and properties remain in the cluster so that if there's node failure, other nodes can pick up any lost work.

## Using Azure IoT Akri to discover OPC UA assets
Azure IoT Akri is a turnkey solution that enables you to discover and create assets connected to an OPC UA server at the edge. Azure IoT Akri discovers devices at the edge and maps them to assets. The assets send telemetry to upstream connectors. By using Azure IoT Akri, you eliminate the painstaking process of manually configuring from the cloud and onboarding the assets to your cluster.  

The Azure IoT Operations Preview documentation provides guidance for detecting assets at the edge, by using the Azure IoT Operations OPC UA discovery handler and broker. You can use these components to process your OPC UA data and telemetry. 

## Features
This section highlights the key capabilities and supported features in Azure IoT Akri.

### Key capabilities
- **Dynamic discovery**. Protocol representations of devices can come and go, without static configurations in brokers or customer containers. 
  - **Device network scanning**.  This capability is especially useful for finding devices in smaller, remote locations. For example, a replacement camera in a store. The protocols that currently support device network scanning are ONVIF and OPC UA localhost.
  - **Device connecting**. This capability is often used in larger industrial scenarios. For example, factory environments where the network is typically static and network scanning isn't permitted. The protocols that currently support device connecting are udev and OPC UA local discovery servers.
  - **Device attach**: Azure IoT Akri also supports implementing custom logic for mapping or connecting devices and there are [open-source templates](https://docs.akri.sh/development/handler-development) to accelerate customization.

- **Optimal scheduling**. Azure IoT Akri can schedule devices on specified nodes with minimal latency, because the service knows where a particular device is located on the K8s cluster. Optimal scheduling applies to directly connected devices, or in scenarios where only specific nodes can access the devices.

- **Optimal configuration**. Azure IoT Akri uses the capacity of the node to drive cardinality of the brokers for the discovered devices.

- **Secure credential management**. Azure IoT Akri facilitates secure access to assets and devices by integrating with services for secure distribution of credential material to brokers.

### Features supported
The following features are supported in Azure IoT Akri (preview):

| [CNCF Akri Features](https://docs.akri.sh/)                                                    | Meaning   | Symbol   |
| ---------------------------------------------------------------------------------------------- | --------- | -------: |
| Dynamic discovery of devices at the edge (supported protocols: OPC UA, ONVIF, udev)            | Supported |   ✅    |
| Schedule devices with minimal latency using Akri's information on node affinity on the cluster | Supported |   ✅    |
| View Akri metrics/logs locally through Prometheus and Grafana                                  | Supported |   ✅    |
| Secrets/credentials management                                                                 | Supported |   ✅    |
| M:N device to broker ratio through configuration-level resource support                        | Supported |   ✅    |
| Observability on Akri deployments through Prometheus and Grafana dashboards                    | Supported |   ✅    |


| Azure IoT Akri features  | Meaning | Symbol | 
|---------|---------|---------:|
| Installation through Azure IoT Akri Arc cluster extension                                         | Supported   |   ✅     |
| Deployment through the orchestration service                                                      | Supported   |   ✅     |
| Onboard devices as custom resources to an edge cluster                                            | Supported   |   ✅     |
| View Azure IoT Akri metrics and logs through Azure Monitor	                                      | Unsupported |   ❌     |
| Azure IoT Akri configuration via cloud OT Operator Experience                                     | Unsupported |   ❌     |
| Azure IoT Akri detects and creates assets that can be ingested into the Azure Device Registry     | Unsupported |   ❌     |
| ISVs can build and sell custom protocol handlers for Azure IoT Operations solutions               | Unsupported |   ❌     |



## Open-Source Akri Resources

To learn more about the CNCF Akri, see the following open source resources.  

- [Documentation](https://docs.akri.sh/)
- [OPC UA Sample on AKS Edge Essentials](/azure/aks/hybrid/aks-edge-how-to-akri-opc-ua)
- [ONVIF Sample on AKS Edge Essentials](/azure/aks/hybrid/aks-edge-how-to-akri-onvif)

## Next step
In this article, you learned how Azure IoT Akri works and how it enables you to detect devices and add assets at the edge.  Here's the suggested next step: 

> [!div class="nextstepaction"]
> [Discover assets using Azure IoT Akri](howto-autodetect-opcua-assets-using-akri.md)
