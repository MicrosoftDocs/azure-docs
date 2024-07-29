---
title: Azure IoT Akri architecture
description: Understand the key components in the Azure IoT Akri architecture and how they relate to each other. Includes some information about the CNCF version of Akri
author: dominicbetts
ms.author: dobett
ms.subservice: akri
ms.topic: conceptual
ms.custom:
  - ignite-2023
ms.date: 05/13/2024

# CustomerIntent: As an industrial edge IT or operations user, I want to understand the key components in the Azure IoT Akri architecture so that I understand how it works to enable device and asset discovery for my edge solution.
---

# Azure IoT Akri Preview architecture

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

This article helps you understand the architecture of Azure IoT Akri Preview. After you learn about the core components of Azure IoT Akri, you can use it to detect devices and assets, and add them to your Kubernetes cluster.

Azure IoT Akri is a Microsoft-managed commercial version of [Akri](https://docs.akri.sh/), an open-source Cloud Native Computing Foundation (CNCF) project.

## Core components

Azure IoT Akri consists of the following five components:

- **Akri configuration** is a custom resource where you name a device. This configuration tells Azure Iot Akri what kind of devices to look for.
- **Akri instance** is a custom resource that tracks the availability and usage of a device. Each Akri instance represents a leaf device.
- **Akri discovery handlers** look for the configured device and inform the agent about discovered devices.
- **Akri agent** creates the Akri instance custom resource.
- **Akri controller** helps you to use a configured device. The controller sees each Akri instance and deploys a broker pod that knows how to connect to and use the resource.

:::image type="content" source="media/concept-akri-architecture/akri-architecture.png" alt-text="Diagram for Azure IoT Akri Preview architecture." border="false":::

## Custom resource definitions

A custom resource definition (CRD) is a Kubernetes API extension that lets you define new object types. There are two Azure IoT Akri CRDs:

- Configuration
- Instance

### Akri configuration CRD

The configuration CRD configures Azure IoT Akri. You create configurations that describe the resources to discover and the pod to deploy on a node that discovers a resource. To learn more, see  [Akri Configuration CRD](https://github.com/project-akri/akri/blob/main/deployment/helm/crds/akri-configuration-crd.yaml). The CRD schema specifies the settings all configurations must have, including the following settings:

- The discovery protocol for finding resources. For example, ONVIF or udev.
- `spec.capacity` that defines the maximum number of nodes that can schedule workloads on this resource.
- `spec.brokerPodSpec` that defines the broker pod to schedule for each of these reported resources.
- `spec.instanceServiceSpec` that defines the service that provides a single stable endpoint to access each individual resource's set of broker pods.
- `spec.configurationServiceSpec` that defines the service that provides a single stable endpoint to access the set of all brokers for all resources associated with the configuration.

### Akri instance CRD

Each Azure IoT Akri instance represents an individual resource that's visible to the cluster. For example, if there are five IP cameras visible to the cluster, there are five instances. The instance CRD enables Azure IoT Akri coordination and resource sharing. These instances store internal state and aren't intended for you to edit. To learn more, see [Resource sharing in-depth](https://docs.akri.sh/architecture/resource-sharing-in-depth).

## Agent

The Akri agent implements [Kubernetes Device-Plugins](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/) for discovered resources. The Akri Agent performs the following tasks:

- It watches for configuration changes to determine the resources to search for.
- It monitors resource availability to determine what resources to advertise. In an edge environment, resource availability changes often.
- It informs Kubernetes of any changes to resource health and availability.

These tasks, combined with the state stored in the instance, enable multiple nodes to share a resource while respecting the limits defined by the `spec.capacity` setting.

To learn more, see [Agent in-depth](https://docs.akri.sh/architecture/agent-in-depth).

## Discovery handlers

A discovery handler finds devices. Examples of device include:

- USB sensors connected to nodes.
- GPUs embedded in nodes.
- IP cameras on the network.

The discovery handler reports all discovered devices to the agent. There are often protocol implementations for discovering a set of devices, whether a network protocol like OPC UA or a proprietary protocol. Discovery handlers implement the `DiscoveryHandler` service defined in [`discovery.proto`](https://github.com/project-akri/akri/blob/main/discovery-utils/proto/discovery.proto). A discovery handler is required to register with the agent, which hosts the `Registration` service defined in [`discovery.proto`](https://github.com/project-akri/akri/blob/main/discovery-utils/proto/discovery.proto).

To learn more, see [Custom Discovery Handlers](https://docs.akri.sh/development/handler-development).

## Controller

The goals of the Akri controller are to:

- Create or delete the pods and services that enable resource availability.
- Ensure that instances are aligned to the cluster state at any given moment.

To achieve these goals, the controller:

- Watches out for instance changes to determine what pods and services should exist.
- Watches for nodes that are contained in instances that no longer exist.

These tasks enable the Akri controller to ensure that protocol brokers and Kubernetes services are running on all nodes and exposing the desired resources, while respecting the limits defined by the `spec.capacity` setting.

For more information, see the documentation for [Controller In-depth](https://docs.akri.sh/architecture/controller-in-depth).
