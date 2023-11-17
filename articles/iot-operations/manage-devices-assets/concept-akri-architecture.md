---
title: Azure IoT Akri architecture
description: Understand the key components in Azure IoT Akri Preview architecture.
author: timlt
ms.author: timlt
ms.subservice: akri
ms.topic: concept-article
ms.custom:
  - ignite-2023
ms.date: 10/26/2023

# CustomerIntent: As an industrial edge IT or operations user, I want to to understand the key components in
# in the Azure IoT Akri architecture so that I understand how it works to enable device and asset discovery for my edge solution.
---

# Azure IoT Akri architecture

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

This article helps you understand the Azure IoT Akri Preview architecture. By learning the core components of Azure IoT Akri, you can use it to start detecting devices and assets, and adding them to your Kubernetes cluster.

## Core components
Azure IoT Akri consists of five components: two custom resources, Discovery Handlers, an Agent (device plugin implementation), and a custom Controller.

- **Akri Configuration**. The first custom resource, Akri Configuration, is where you name a device.  This configuration tells Azure Iot Akri what kind of device to look for.
- **Akri Discovery Handlers**.  The Discovery Handlers look for the configured device and inform the Agent of discovered devices.
- **Akri Agent**.  The Agent creates the second custom resource, the Akri Instance.
- **Akri Instance**. The second custom resource, Akri Instance, tracks the availability and usage of the device. Each Akri Instance represents a leaf device.
- **Akri Controller**.  After the configured device is found, the Akri Controller helps you use it. The Controller sees each Akri Instance and deploys a broker Pod that knows how to connect to the resource and utilize it.

:::image type="content" source="media/concept-akri-architecture/akri-architecture.png" alt-text="Diagram for Azure IoT Akri architecture." border="false":::

## Custom Resource Definitions

A Custom Resource Definition (CRD) is a Kubernetes API extension that lets you define new object types.

There are two Azure IoT Akri CRDs:

- Configuration
- Instance

### Akri Configuration CRD
The Configuration CRD is used to configure Azure IoT Akri. Users create configurations to describe what resources should be discovered and what pod should be deployed on the nodes that discover a resource. See the [Akri Configuration CRD](https://github.com/project-akri/akri/blob/main/deployment/helm/crds/akri-configuration-crd.yaml). The CRD schema specifies what components all configurations must have, including the following components:

- The desired discovery protocol for finding resources.  For example, ONVIF or udev.
- A capacity (`spec.capacity`) that defines the maximum number of nodes that can schedule workloads on this resource.
- A PodSpec (`spec.brokerPodSpec`) that defines the "broker" pod that is scheduled to each of these reported resources.
- A ServiceSpec (`spec.instanceServiceSpec`) that defines the service that provides a single stable endpoint to access each individual resource's set of broker pods.
- A ServiceSpec (`spec.configurationServiceSpec`) that defines the service that provides a single stable endpoint to access the set of all brokers for all resources associated with the configuration.

### Akri Instance CRD
Each Azure IoT Akri Instance represents an individual resource that is visible to the cluster. For example, if there are five IP cameras visible to the cluster, there are five Instances. The Instance CRD enables Azure IoT Akri coordination and resource sharing. These instances store internal state and aren't intended for users to edit. For more information on resource sharing, see [Resource Sharing In-depth](https://docs.akri.sh/architecture/resource-sharing-in-depth).

## Agent
The Akri Agent implements [Kubernetes Device-Plugins](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/) for discovered resources.

The Akri Agent performs the following workflow:

- Watch for Configuration changes to determine what resources to search for.
- Monitor resource availability to determine what resources to advertise. In an edge environment, resource availability changes often.
- Inform Kubernetes of resource health and availability as it changes.

This basic workflow combined with the state stored in the Instance, allows multiple nodes to share a resource while respecting the limitations defined by `Configuration.capacity`.

For a more in-depth understanding, see the documentation for [Agent In-depth](https://docs.akri.sh/architecture/agent-in-depth).

## Discovery Handlers
A Discovery Handler finds devices around the cluster. Devices can be connected to Nodes (for example, USB sensors), embedded in Nodes (for example, GPUs), or on the network (for example, IP cameras). The Discovery Handler reports all discovered devices to the Agent. There are often protocol implementations for discovering a set of devices, whether a network protocol like OPC UA or a proprietary protocol. Discovery Handlers implement the `DiscoveryHandler` service defined in [`discovery.proto`](https://github.com/project-akri/akri/blob/main/discovery-utils/proto/discovery.proto). A Discovery Handler is required to register with the Agent, which hosts the `Registration` service defined in [`discovery.proto`](https://github.com/project-akri/akri/blob/main/discovery-utils/proto/discovery.proto).

To get started creating a Discovery Handler, see the documentation for [Discovery Handler development](https://docs.akri.sh/development/handler-development).

## Controller
The Akri Controller serves two purposes:

- Create or delete the pods & services that enable resource availability
- Ensure that Instances are aligned to the cluster state at any given moment

The Controller performs the following workflow:

- Watch for Instance changes to determine what pods and services should exist 
- Watch for Nodes that are contained in Instances that no longer exist

This basic workflow allows the Akri Controller to ensure that protocol brokers and Kubernetes Services are running on all nodes, and exposing desired resources, while respecting the limits defined by `Configuration.capacity`.

For more information, see the documentation for [Controller In-depth](https://docs.akri.sh/architecture/controller-in-depth).

## Related content

- [Azure IoT Akri overview](overview-akri.md)
