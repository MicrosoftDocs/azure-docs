---
title: Understand device and asset management
description: Understand concepts and options needed to manage the devices and assets that are part of your Azure IoT Operations solution.
author: dominicbetts
ms.author: dobett
ms.topic: overview
ms.date: 08/29/2025
ai-usage: ai-assisted
ms.custom: sfi-image-nochange

# CustomerIntent: As an industrial edge IT or operations user, I want to understand the key components in the Azure IoT Operations for managing devices and assets, so that I can effectively manage the devices and assets in my solution. 
---

# What is asset and device management in Azure IoT Operations?

In Azure IoT Operations, a key task is to manage the assets and devices that are part of your solution. This article:

- Defines what *assets* and *devices* mean in Azure IoT Operations.
- Provides an overview of services used to manage assets and devices.
- Explains common use cases for these services.

This diagram shows the key components of asset management in Azure IoT Operations:

<!-- Art Library Source# ConceptArt-0-000-92 -->

:::image type="content" source="media/overview-manage-assets/azure-iot-operations-architecture.svg" alt-text="Diagram that shows services used to manage assets." lightbox="media/overview-manage-assets/azure-iot-operations-architecture.png" border="false":::

## Understand physical assets and devices

In the context of Azure IoT Operations, the terms *asset* and *device* can refer to both physical entities that connect to Azure IoT Operations and configuration resources within Azure IoT Operations and Azure Device Registry.

In the previous diagram:

- Cameras are examples of *physical devices* that connect directly to Azure IoT Operations using the media connector or the ONVIF connector.
- Assets like **Asset-01**, which might be an oven, are *physical assets* that connect indirectly through an OPC UA server.
- OPC UA servers are *physical devices* that connect to Azure IoT Operations using the OPC UA connector.

A physical device can connect using various protocols. It might connect through a connector like the media connector. If it uses the MQTT protocol, it connects directly to the MQTT broker, bypassing the connectors.

This diagram shows how physical devices connect to Azure IoT Operations:

:::image type="content" source="media/overview-manage-assets/physical-assets-devices.svg" alt-text="Diagram showing how physical assets and devices connect." border="false":::

<!--
```mermaid
graph LR
    subgraph Physical devices and assets
        D2[Device connects directly to<br>the edge-based MQTT broker]
        D3[Physical device such as an<br>ONVIF compliant camera]
        D4[OPC UA server]
        D5[Physical asset<br>such as an oven]
    end

    subgraph IoT Operations edge cluster
        B2[MQTT broker]
        B3[Connectors such as<br>OPC UA or ONVIF]
    end

    D2 -- Publish --&gt; B2

    B3 -- Publish --&gt; B2
    D3 -- Communicates using ONVIF protocol --&gt; B3
    D4 -- Communicates using OPC UA protocol --&gt; B3
    D5 --&gt; D4
```
-->

## Understand assets and devices in Azure IoT Operations

[!INCLUDE [assets-devices-logical-entities](../includes/assets-devices-logical-entities.md)]

An operator configures and manages devices and assets in the operations experience web UI or by using the Azure IoT operations CLI.

Learn more in [define assets and devices](concept-assets-devices.md).

## Southbound and northbound connectivity

In Azure IoT Operations, *southbound connectivity* refers to the connection between the edge cluster and physical devices and assets. *Northbound connectivity* refers to the connection between the edge cluster and cloud services.

The connectors in this article enable southbound connectivity by letting the edge cluster communicate with physical devices and assets. Learn about northbound connectivity in [Process and route data with data flows](../connect-to-cloud/overview-dataflow.md).

## Services for managing devices and assets

Azure IoT Operations includes several services that help you manage devices and assets:

- Azure Device Registry: Manages metadata for assets and other resources.
- Akri services: Lets you manage edge resources in a Kubernetes cluster.
- Operations experience: A web interface for managing devices and assets.
- Azure portal: A web interface for managing Azure resources.

## Azure Device Registry

*Azure Device Registry* is a backend service that enables the cloud and edge management of assets from the Azure portal.

Azure Device Registry maps assets from your edge environment to Azure resources in the cloud. It offers a unified registry so apps and services interacting with your assets connect to a single source. Azure Device Registry syncs assets in the cloud with custom resources in Kubernetes on the edge.

When you create a device or asset in the operations experience or by using the Azure IoT Operations CLI, that device or asset is defined in Azure Device Registry.

### Assets

Azure Device Registry maps assets to Azure resources. Enterprises can use Azure Resource Manager, Azure's deployment and management service, with assets. Azure Resource Manager supports resource groups, tags, role-based access control (RBAC), policies, logging, and auditing.

### Devices

Azure Device Registry maps devices to Azure resources. Enterprises can use Azure Resource Manager, Azure's deployment and management service, with devices. Azure Resource Manager supports resource groups, tags, role-based access control (RBAC), policies, logging, and auditing.

### Schemas

The schema registry is a service that lets you define and manage the schema for your assets. Data flows use schemas to deserialize and serialize messages.

### Namespaces

Azure Device Registry uses *namespaces* to organize assets and devices. Each Azure IoT Operations instance uses one namespace for its assets and devices. Multiple instances can share a namespace.

### Synchronization

Manage devices and assets through the operations experience or Azure APIs and tools like Azure Resource Graph. Changes made in the cloud sync to the edge and appear as custom resources in the Kubernetes cluster.

## Akri services

*Akri services* in Azure IoT Operations:

- Provide an extensible framework for building and deploying connectors that enable connectivity protocols like ONVIF and HTTP/REST.
- Enable automatic discovery, onboarding, and monitoring of physical devices and assets at the edge.

### Connectivity

Akri services let you deploy and set up connectivity protocols at the edge. Akri services use the asset and device resources in Azure Device Registry to model different device and protocol connections in your environment. They let you easily onboard and provision assets with open standards. They provide an extensible framework for all device protocols and a single-pane-of-glass view for all assets. Connectors include:

- The **connector for OPC UA** is a data ingress and protocol translation service that lets Azure IoT Operations ingest data from OPC UA servers. A key requirement in industrial environments is a common standard or protocol for machine-to-machine and machine-to-cloud data exchange. [OPC UA](https://opcfoundation.org/about/opc-technologies/opc-ua/) is a specification for a platform-independent, service-oriented architecture that enables data exchange in industrial environments. The connector receives messages and events from your assets and publishes the data to topics in the MQTT broker.
- The **media connector** is a service that makes media from sources like edge-attached cameras available to other Azure IoT Operations components.
- The **connector for ONVIF** is a service that discovers and registers ONVIF assets like cameras. The connector lets you manage and control ONVIF assets like cameras connected to your cluster.
- The **connector for HTTP/REST** is a service that lets you connect to HTTP/REST endpoints and publish data to the MQTT broker.
- The **connector for SSE** is a service that lets you connect to SSE endpoints and publish event data to the MQTT broker.
- **Custom connectors** are services that you create to connect to other data sources and publish data to the MQTT broker. Use the Azure IoT Operations SDKs to create custom connectors that meet your specific requirements.

### Discovery

*Akri services* let you automatically discover physical devices and assets and help OT users set up devices and assets in the operations experience web UI. The connectors described earlier all use the framework provided by Akri services to implement their core capabilities.

Akri services simplify creating assets by automatically onboarding assets with preconfigured datasets and endpoints generated by the connectors to represent capabilities and devices on the network.

### Monitoring

*Akri services* provide monitoring capabilities for physical devices and assets. This includes tracking the status and health of devices. The monitoring framework works seamlessly with the connectors and the Azure Device Registry, letting you gain insights into your edge environment.

## Operations experience

The *operations experience* is a web UI that lets OT users create and configure devices and assets in an Azure IoT Operations instance. This web UI simplifies managing devices and assets and is the recommended service for this task.

## Azure portal

The *Azure portal* is a web-based application that lets IT users manage Azure resources from a unified console. Use the Azure portal to create and manage Azure IoT Operations instances, monitor IoT solutions, and troubleshoot issues.
