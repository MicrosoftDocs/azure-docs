---
title: Asset management overview
description: Understand concepts and options needed to manage the assets that are part of your Azure IoT Operations solution.
author: dominicbetts
ms.author: dobett
ms.topic: overview
ms.date: 10/22/2024
ai-usage: ai-assisted

# CustomerIntent: As an industrial edge IT or operations user, I want to understand the key components in the Azure IoT Operations for managing assets, so that I can effectively manage the assets in my solution. 
---

# What is asset management in Azure IoT Operations

In Azure IoT Operations, a key task is to manage the assets that are part of your solution. This article:

- Defines what assets are in the context of Azure IoT Operations.
- Provides an overview of the services that you use to manage your assets.
- Explains the most common use cases for the services.

## Understand assets

Assets are a core element of an Azure IoT Operations solution. In Azure IoT Operations, an *asset* is a logical entity that you create to represent a real asset. An Azure IoT Operations asset can emit telemetry and events. You use these logical asset instances to reference the real assets in your industrial edge environment.

Assets connect to Azure IoT Operations instances through *asset endpoints*, which are the OPC UA servers that have southbound connections to one or more assets.

## Understand services for managing assets

Azure IoT Operations includes several services that help you manage your assets.

The following diagram shows the high-level architecture of Azure IoT Operations. The services that you use to manage assets are highlighted in red:

:::image type="content" source="media/overview-manage-assets/azure-iot-operations-architecture.svg" alt-text="Diagram that highlights the services used to manage assets." lightbox="media/overview-manage-assets/azure-iot-operations-architecture.png":::

- The **operations experience** is a web UI that lets you create and configure assets in your solution. The web UI simplifies the task of managing assets and is the recommended service to manage assets.
- **Azure Device Registry** is a backend service that enables the cloud and edge management of assets. Device Registry projects assets defined in your edge environment as Azure resources in the cloud. It provides a single unified registry so that all apps and services that interact with your assets can connect to a single source. Device Registry also manages the synchronization between assets in the cloud and assets as custom resources in Kubernetes on the edge.
- The schema registry is a service that lets you define and manage the schema for your assets. Dataflows use schemas to deserialize and serialize messages.
- The **connector for OPC UA** is a data ingress and protocol translation service that enables Azure IoT Operations to ingress data from your assets. The broker receives telemetry and events from your assets and publishes the data to topics in the MQTT broker. The broker is based on the widely used OPC UA standard.
- The **media connector (preview)** is a service that makes media from media sources such as edge-attached cameras available to other Azure IoT Operations components.
- The **connector for ONVIF (preview)** is a service that discovers and registers ONVIF assets such as cameras. The connector enables you to manage and control ONVIF assets such as cameras connected to your cluster.

## Create and manage assets remotely

The following tasks are useful for operations teams in sectors such as industry, retail, and health:

- Create assets remotely
- To access asset data, subscribe to OPC UA tags and events
- Manage connected media sources such as cameras

The operations experience web UI lets operations teams perform these tasks in a simplified web interface. The operations experience uses the other services described previously, to complete these tasks. You can also use the Azure IoT Operations CLI to manage assets by using the [az iot ops asset](/cli/azure/iot/ops/asset) set of commands.

The operations experience uses the connector for OPC UA to exchange data with local OPC UA servers. OPC UA servers are software applications that communicate with assets. The connector for OPC UA exposes:

- OPC UA *tags* that represent data points. OPC UA tags provide real-time or historical data about the asset, and you can configure how frequently to sample the tag value.
- OPC UA *events* that represent state changes. OPC UA events provide real-time status information for your assets that lets you configure alarms and notifications.

The operations experience uses the media connector and the connector for ONVIF to manage media sources such as cameras. The media connector lets you access media sources such as edge-attached cameras. The connector for ONVIF discovers and registers ONVIF assets such as cameras connected to your cluster.

The operations experience lets users create assets and subscribe to OPC UA tags in a user-friendly interface. Users can create custom assets by providing asset details and configurations. Users can create or import tag and event definitions, subscribe to them, and assign them to an asset.

## Store assets as Azure resources in a centralized registry

When you create an asset in the operations experience or by using the Azure IoT Operations CLI extension, that asset is defined in Azure Device Registry.

Device Registry provides a single registry for devices and assets across applications running in the cloud or on the edge. In the cloud, assets are created as Azure resources, which give you management capabilities over them like organizing assets with resource groups and tags. On the edge, the Azure Device Registry creates a Kubernetes custom resource for each asset and keeps the two asset representations in sync.

Device Registry provides several capabilities that help teams to manage assets:

- **Unified registry**. The Device Registry serves as the single source of truth for your asset metadata. Having a single registry gives you a way to access and manage assets across Azure, partner, and customer applications running in the cloud or on the edge.
- **Assets as Azure resources**. Because Device Registry projects assets as true Azure resources, you can manage assets using established Azure features and services. Enterprises can use Azure Resource Manager, Azure's native deployment and management service, with industrial assets. Azure Resource Manager provides capabilities such as resource groups, tags, role-based access controls (RBAC), policy, logging, and audit.
- **Cloud management of assets**. You can manage assets by using the operations experience or by using Azure APIs and management tools such as Azure Resource Graph. Regardless of which method you use to manage assets, changes made in the cloud are synced to the edge and exposed as custom resources in the Kubernetes cluster.

For example, the following set of screenshots shows a single asset, in this case a thermostat, viewed both in cloud management tools and on an Azure IoT Operations cluster. The first screenshot shows the thermostat asset in the operations experience:

:::image type="content" source="media/overview-manage-assets/asset-operations-portal.png" alt-text="A screenshot that shows the thermostat asset in the operations experience.":::

This screenshot shows the same thermostat asset in the Azure portal:

:::image type="content" source="media/overview-manage-assets/asset-portal.png" alt-text="A screenshot that shows the thermostat asset in the Azure portal.":::

And the final screenshot shows the same thermostat asset as a Kubernetes custom resource:

:::image type="content" source="media/overview-manage-assets/asset-kubernetes.png" alt-text="A screenshot that shows the thermostat asset as a Kubernetes custom resource.":::

## Use a common data exchange standard for your edge solution

A key requirement in industrial environments is for a common standard or protocol for machine-to-machine and machine-to-cloud data exchange. By using a widely supported data exchange protocol, you can simplify the process to enable diverse industrial assets to exchange data with each other, with workloads running in your Kubernetes cluster, and with the cloud. [OPC UA](https://opcfoundation.org/about/opc-technologies/opc-ua/) is a specification for a platform independent service-oriented architecture that enables data exchange in industrial environments.

An industrial environment that uses the OPC UA standard, includes the following basic OPC UA elements:

- An **OPC UA server** is software based on the OPC UA specification that communicates with assets and provides core OPC UA services to those assets.
- An **OPC UA client**. An OPC UA client is software that interacts with an OPC UA server in a request and response network pattern. An OPC UA client connects to OPC UA servers, and submits requests for actions such as reads and writes on data items.

The connector for OPC UA is an OPC UA client that enables data ingress from OPC UA servers into your edge solution based on the OPC UA standard. The connector for OPC UA is installed as part of Azure IoT Operations. You can optionally install an OPC UA simulation server, which lets you test and use the service.

### Automatic asset discovery

Akri services let you deploy and configure connectivity protocols, such as OPC UA and ONVIF, at the edge. Akri services use the asset and asset endpoint resources in Azure Device Registry to model the different device and protocol connections in your environment.

Akri services simplify the process of creating assets by automatically onboarding assets with pre-configured datasets and asset endpoints generated by the connectors to represent capabilities and devices on the network.

Currently:

- The operations experience web UI doesn't enable you to configure Akri services and scenarios.
- The connectors don't exercise the discovery capabilities of Akri services.
