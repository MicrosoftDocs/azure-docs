---
title: Asset and Device Management
description: Understand concepts and options for managing the devices and assets that are part of your Azure IoT Operations solution.
author: dominicbetts
ms.author: dobett
ms.topic: overview
ms.date: 02/16/2026
ai-usage: ai-assisted
ms.custom: sfi-image-nochange

#customer intent: As an industrial edge IT or operations user, I want to understand the key components in Azure IoT Operations for managing devices and assets, so that I can effectively manage the devices and assets in my solution. 
---

# What is asset and device management in Azure IoT Operations?

In Azure IoT Operations, a key task is to manage the assets and devices that are part of your solution. This article:

- Defines assets and devices for Azure IoT Operations.
- Provides an overview of services for managing assets and devices.
- Explains common use cases for these services.

## Physical assets and devices

In the context of Azure IoT Operations, the terms *asset* and *device* can refer to both physical entities that connect to Azure IoT Operations and configuration resources within Azure IoT Operations and Azure Device Registry.

This diagram shows the key components of asset management in Azure IoT Operations.

<!-- Art Library Source# ConceptArt-0-000-92 -->

:::image type="content" source="media/overview-manage-assets/azure-iot-operations-architecture.svg" alt-text="Diagram that shows services for managing assets." lightbox="media/overview-manage-assets/azure-iot-operations-architecture.png" border="false":::

In the preceding diagram:

- Cameras are examples of physical devices that connect directly to Azure IoT Operations through the media connector or the Open Network Video Interface Forum (ONVIF) connector.
- Assets like **Asset-01**, which might be an oven, are physical assets that connect indirectly through an OPC Unified Architecture (OPC UA) server.
- OPC UA servers are physical devices that connect to Azure IoT Operations by using the OPC UA connector.

A physical device can connect by using various protocols. It might use a connector like the media connector. If it uses the MQTT protocol, it connects directly to the MQTT broker and bypasses the connectors.

This diagram shows how physical devices connect to Azure IoT Operations.

:::image type="content" source="media/overview-manage-assets/physical-assets-devices.svg" alt-text="Diagram that shows how physical assets and devices connect." border="false":::

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

## Configuration resources

[!INCLUDE [assets-devices-logical-entities](../includes/assets-devices-logical-entities.md)]

An operator configures and manages devices and assets in the operations experience web UI or by using the Azure IoT Operations CLI.

Learn more in [Assets and devices](concept-assets-devices.md).

## Southbound and northbound connectivity

In Azure IoT Operations, *southbound connectivity* refers to the connection between the edge cluster and physical devices and assets. *Northbound connectivity* refers to the connection between the edge cluster and cloud services.

The connectors in this article enable southbound connectivity by letting the edge cluster communicate with physical devices and assets. Learn about northbound connectivity in [Process and route data with data flows](../connect-to-cloud/overview-dataflow.md).

## Services for managing devices and assets

Azure IoT Operations includes several services that help you manage devices and assets.

### Azure Device Registry

Azure Device Registry is a back-end service that enables the cloud and edge management of devices and assets from the Azure portal.

Device Registry maps assets from your edge environment to Azure resources in the cloud. It offers a unified registry so that apps and services that interact with your assets connect to a single source. Device Registry syncs assets in the cloud with custom resources in Kubernetes on the edge.

When you create a device or asset in the operations experience or by using the Azure IoT Operations CLI, that device or asset is defined in Device Registry.

#### Assets and devices

Device Registry maps assets and devices to Azure resources. Enterprises can use Azure Resource Manager for the deployment and management of both assets and devices. Resource Manager supports resource groups, tags, role-based access control (RBAC), policies, logging, and auditing.

#### Schemas

You can use the schema registry to define and manage schemas for your assets. Data flows use schemas to deserialize and serialize messages.

#### Namespaces

Device Registry uses namespaces to organize assets and devices. Each Azure IoT Operations instance uses one namespace for its assets and devices. Multiple instances can share a namespace.

#### Synchronization

Manage devices and assets through the operations experience or through Azure APIs and tools like Azure Resource Graph. Changes made in the cloud sync to the edge and appear as custom resources in the Kubernetes cluster.

### Akri services

Akri services in Azure IoT Operations:

- Provide an extensible framework for building and deploying connectors that enable connectivity protocols like ONVIF and HTTP/REST.
- Enable automatic discovery, onboarding, and monitoring of physical devices and assets at the edge.

#### Connectivity

You can use Akri services to deploy and set up connectivity protocols at the edge. Akri services use the asset and device resources in Device Registry to model device and protocol connections in your environment. They let you easily onboard and provision assets with open standards. They provide an extensible framework for all device protocols and a single view for all assets.

Connectors include:

- **Connector for OPC UA**. A data ingress and protocol translation service that lets Azure IoT Operations ingest data from OPC UA servers. A key requirement in industrial environments is a common standard or protocol for machine-to-machine and machine-to-cloud data exchange. [OPC UA](https://opcfoundation.org/about/opc-technologies/opc-ua/) is a specification for a platform-independent, service-oriented architecture that enables data exchange in industrial environments. The connector receives messages and events from your assets and publishes the data to topics in the MQTT broker.

- **Media connector**. A service that makes media from sources like edge-attached cameras available to other Azure IoT Operations components.

- **Connector for ONVIF**. A service that discovers and registers ONVIF assets like cameras. You can use the connector to manage and control ONVIF assets connected to your cluster.

- **Connector for HTTP/REST**. A service for connecting to HTTP/REST endpoints and publishing data to the MQTT broker.

- **Connector for SSE**. A service for connecting to server-sent event (SSE) endpoints and publishing event data to the MQTT broker.

- **Connector for MQTT (preview)**. A service for subscribing to topics on MQTT brokers and publishing data to the Azure IoT Operations MQTT broker. This connector is designed for connecting to other MQTT brokers in your environment.

  You can also use a data flow to connect to a Kafka endpoint and route messages to the MQTT broker. Learn how in [Connect to Kafka endpoints](howto-connect-kafka.md).

- **Custom connectors**. Services that you create to connect to other data sources and publish data to the MQTT broker. Use the Azure IoT Operations SDKs to create custom connectors that meet your specific requirements.

#### Discovery

You can use Akri services to automatically discover physical devices and assets. Akri services also help operational technology (OT) users set up devices and assets in the operations experience web UI. The connectors described earlier all use the framework that Akri services provide to implement their core capabilities.

Akri services simplify the creation of assets by automatically onboarding assets with preconfigured datasets and endpoints. The connectors generate these datasets and endpoints to represent capabilities and devices on the network.

#### Monitoring

Akri services provide monitoring capabilities for physical devices and assets. These capabilities include tracking the status and health of devices. The monitoring framework works seamlessly with the connectors and Device Registry to help you gain insights into your edge environment.

### Operations experience

The operations experience is a web UI where OT users can create and configure devices and assets in an Azure IoT Operations instance. This web UI simplifies managing devices and assets, and it's the recommended service for this task.

:::image type="content" source="media/overview-manage-assets/operations-experience.png" alt-text="Screenshot of the operations experience web UI." lightbox="media/overview-manage-assets/operations-experience.png":::

### Azure portal

The Azure portal is a web-based application where IT users can manage Azure resources from a unified console. Use the Azure portal to create and manage Azure IoT Operations instances, monitor IoT solutions, manage assets and devices, and troubleshoot problems. Device Registry is integrated with the Azure portal, so you can view and manage your namespaces, schemas registries, assets, and devices in the cloud.

:::image type="content" source="media/overview-manage-assets/azure-portal.png" alt-text="Screenshot of the Azure portal." lightbox="media/overview-manage-assets/azure-portal.png":::
