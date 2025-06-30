---
title: Device and asset management overview
description: Understand concepts and options needed to manage the devices and assets that are part of your Azure IoT Operations solution.
author: dominicbetts
ms.author: dobett
ms.topic: overview
ms.date: 06/24/2025
ai-usage: ai-assisted

# CustomerIntent: As an industrial edge IT or operations user, I want to understand the key components in the Azure IoT Operations for managing devices and assets, so that I can effectively manage the devices and assets in my solution. 
---

# What is asset and device management in Azure IoT Operations?

In Azure IoT Operations, a key task is to manage the assets and devices that are part of your solution. This article:

- Defines what assets and devices are in the context of Azure IoT Operations.
- Provides an overview of the services that you use to manage your assets and devices.
- Explains the most common use cases for the services.

The following diagram shows the high-level architecture of Azure IoT Operations. The services that you use to manage assets are highlighted in red:

<!-- Art Library Source# ConceptArt-0-000-077 -->

:::image type="content" source="media/overview-manage-assets/azure-iot-operations-architecture.svg" alt-text="Diagram that highlights the services used to manage assets." lightbox="media/overview-manage-assets/azure-iot-operations-architecture.png" border="false":::

## Understand physical assets and devices

In the context of Azure IoT Operations, the terms *asset* and *device* can refer to both physical entities that connect to Azure IoT Operations and configuration resources within Azure IoT Operations.

A *physical device* is an object, such as a camera or sensor, that can send data directly to Azure IoT Operations. A *physical asset* is an object, such as an oven, that connects indirectly through an intermediary such as an OPC UA server. You can see both physical devices and physical assets in the previous diagram.

A physical device can connect using a variety of protocols. It could connect through a connector such as the media connector. If it uses the MQTT protocol, it can connect directly to the MQTT broker bypassing the connectors.

The following diagram shows how physical devices connect to Azure IoT Operations:

:::image type="content" source="media/overview-manage-assets/physical-assets-devices.svg" alt-text="Diagram that shows how physical assets and devices connect.":::

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

An operator configures and manages devices and assets in the operations experience web UI or by using the Azure IoT Operations CLI.

To learn more, see [Define assets and devices](concept-assets-devices.md).

## Understand services for managing assets

Azure IoT Operations includes several services that help you manage devices and assets.

- The **operations experience** is a web UI that lets you create and configure assets in your solution. The web UI simplifies the task of managing assets and is the recommended service to manage assets.
- **Azure Device Registry** is a backend service that enables the cloud and edge management of assets. Device Registry projects assets defined in your edge environment as Azure resources in the cloud. It provides a single unified registry so that all apps and services that interact with your assets can connect to a single source. Device Registry also manages the synchronization between assets in the cloud and assets as custom resources in Kubernetes on the edge.
- The schema registry is a service that lets you define and manage the schema for your assets. Data flows use schemas to deserialize and serialize messages.
- The **connector for OPC UA** is a data ingress and protocol translation service that enables Azure IoT Operations to ingress data from OPC UA servers. A key requirement in industrial environments is for a common standard or protocol for machine-to-machine and machine-to-cloud data exchange. [OPC UA](https://opcfoundation.org/about/opc-technologies/opc-ua/) is a specification for a platform independent service-oriented architecture that enables data exchange in industrial environments. The connector receives messages and events from your assets and publishes the data to topics in the MQTT broker.
- The **media connector (preview)** is a service that makes media from media sources such as edge-attached cameras available to other Azure IoT Operations components.
- The **connector for ONVIF (preview)** is a service that discovers and registers ONVIF assets such as cameras. The connector enables you to manage and control ONVIF assets such as cameras connected to your cluster.
- The **REST/HTTP connector** is a service that lets you connect to REST/HTTP endpoints and publish data to the MQTT broker.
- The **SQL connector** is a service that lets you connect to SQL databases and publish data to the MQTT broker.
- **Custom connectors** are services that you can create to connect to other data sources and publish data to the MQTT broker. Use the Azure IoT Operations SDKS to create custom connectors that meet your specific requirements.
- **Akri services** are a set of services that enable the automatic discovery of physical assets and devices in your environment. Akri services can help you create and configure assets and devices in operations experience. To learn more, see [What is asset discovery (preview)?](overview-akri.md).

## Create and manage assets

The following tasks are useful for operations teams in sectors such as industry, retail, and health:

- Use the operations experience or Azure CLI to create assets.
- Subscribe to asset data points, events, and streams to access data from your physical assets and devices.
- Manage connected media sources such as cameras.

The operations experience web UI lets operations teams perform these tasks in a simplified web interface. The operations experience uses the other services described previously, to complete these tasks. You can also use the Azure IoT Operations CLI to manage assets by using the [az iot ops asset](/cli/azure/iot/ops/asset) set of commands.

IT administrators use the Azure portal to manage assets by using the Azure Device Registry. The Azure Device Registry provides a single registry for devices and assets across applications running in the cloud or on the edge and enables administrators to perform tasks such as defining RBAC rules for assets.

## Store assets as Azure resources in a centralized registry

When you create an asset in the operations experience or by using the Azure IoT Operations CLI, that asset is defined in Azure Device Registry.

Azure Device Registry is a single unified registry for devices and assets across applications running in the cloud or on the edge. In the cloud, assets are created as Azure resources, which give you management capabilities over them such as organizing assets with resource groups and tags. On the edge, the Azure Device Registry creates a Kubernetes custom resource for each asset and keeps the two asset representations in sync.

Azure Device Registry provides several capabilities that help teams to manage assets:

- **Unified registry**. Azure Device Registry serves as the single source of truth for your asset metadata. Having a single registry gives you a way to access and manage assets across Azure, partner, and customer applications running in the cloud or on the edge.
- **Assets as Azure resources**. Because Azure Device Registry projects assets as Azure resources, you can manage assets using established Azure features and services. Enterprises can use Azure Resource Manager, Azure's native deployment and management service, with industrial assets. Azure Resource Manager provides capabilities such as resource groups, tags, role-based access controls (RBAC), policy, logging, and audit.
- **Cloud management of assets**. You can manage assets by using the operations experience or by using Azure APIs and management tools such as Azure Resource Graph. Regardless of which method you use to manage assets, changes made in the cloud are synced to the edge and exposed as custom resources in the Kubernetes cluster.

For example, the following set of screenshots shows a single asset, in this case a thermostat, viewed both in cloud management tools and on an Azure IoT Operations cluster. The first screenshot shows the thermostat asset in the operations experience:

:::image type="content" source="media/overview-manage-assets/asset-operations-portal.png" alt-text="A screenshot that shows the thermostat asset in the operations experience.":::

This screenshot shows the same thermostat asset in the Azure portal:

:::image type="content" source="media/overview-manage-assets/asset-portal.png" alt-text="A screenshot that shows the thermostat asset in the Azure portal.":::

And the final screenshot shows the same thermostat asset as a Kubernetes custom resource:

:::image type="content" source="media/overview-manage-assets/asset-kubernetes.png" alt-text="A screenshot that shows the thermostat asset as a Kubernetes custom resource.":::

### Automatic asset discovery

Akri services let you deploy and configure connectivity protocols, such as OPC UA and ONVIF, at the edge. Akri services use the asset and asset endpoint resources in Azure Device Registry to model the different device and protocol connections in your environment.

Akri services simplify the process of creating assets by automatically onboarding assets with pre-configured datasets and asset endpoints generated by the connectors to represent capabilities and devices on the network.

Currently:

- The operations experience web UI doesn't enable you to configure Akri services and scenarios.
- The connectors don't exercise the discovery capabilities of Akri services.
