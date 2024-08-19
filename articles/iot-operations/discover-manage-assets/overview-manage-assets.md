---
title: Asset management overview
description: Understand concepts and options needed to manage the assets that are part of your Azure IoT Operations solution.
author: dominicbetts
ms.author: dobett
ms.topic: overview
ms.date: 05/13/2024
ai-usage: ai-assisted

# CustomerIntent: As an industrial edge IT or operations user, I want to understand the key components in the Azure IoT Operations for managing assets, so that I can effectively manage the assets in my solution. 
---

# What is asset management in Azure IoT Operations Preview

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In Azure IoT Operations Preview, a key task is to manage the assets that are part of your solution. This article:

- Defines what assets are in the context of Azure IoT Operations.
- Provides an overview of the services that you use to manage your assets.
- Explains the most common use cases for the services.

## Understand assets

Assets are a core element of an Azure IoT Operations solution.

In industrial edge environments, the term *asset* commonly refers to any item of value that you want to manage, monitor, and collect data from. An asset can be a machine, a software component, an entire system, or a physical object of value such as a field of crops, or a building. These assets are examples that exist in manufacturing, retail, energy, healthcare, and other sectors.

However, in Azure IoT Operations, an *asset* is a logical entity that you create to represent a real asset. An Azure IoT Operations asset can emit telemetry and events. You use these logical asset instances to manage the real assets in your industrial edge environment.

While all IoT devices are assets, not all assets are devices. An *IoT device* is a physical object connected to the internet to collect, generate, and communicate data. IoT devices typically contain embedded components to perform specific functions. They can manage or monitor other things in their environment. Examples of IoT devices include crop sensors, smart thermostats, connected security cameras, wearable devices, and monitoring devices for manufacturing machinery or vehicles.

## Understand services for managing assets

Azure IoT Operations includes several services that help you manage your assets.

The following diagram shows the high-level architecture of Azure IoT Operations. The services that you use to manage assets are highlighted in red:

:::image type="content" source="media/overview-manage-assets/azure-iot-operations-architecture.svg" alt-text="Diagram that highlights the services used to manage assets." lightbox="media/overview-manage-assets/azure-iot-operations-architecture.png":::

- The **operations experience** is a web UI that lets you create and configure assets in your solution. The web UI simplifies the task of managing assets and is the recommended service to manage assets.
- **Azure Device Registry Preview** is a service that projects assets defined in your edge environment as Azure resources in the cloud. Device Registry lets you manage your assets in the cloud as Azure resources contained in a single unified registry.
- **Akri services** automatically discover assets at the edge. The services can detect assets in the address space of an OPC UA server.
- The **connector for OPC UA** is a data ingress and protocol translation service that enables Azure IoT Operations to ingress data from your assets. The broker receives telemetry and events from your assets and publishes the data to topics in the MQTT broker. The broker is based on the widely used OPC UA standard.

## Create and manage assets remotely

The following tasks are useful for operations teams in sectors such as industry, retail, and health:

- Create assets remotely
- To access asset data, subscribe to OPC UA tags and events

The operations experience web UI lets operations teams perform these tasks in a simplified web interface. The operations experience uses the other services described previously, to complete these tasks. You can also use the Azure IoT Operations CLI to manage assets by using the [az iot ops asset](/cli/azure/iot/ops/asset) set of commands.

The operations experience uses the connector for OPC UA to exchange data with local OPC UA servers. OPC UA servers are software applications that communicate with assets. The connector for OPC UA exposes:

- OPC UA *tags* that represent data points. OPC UA tags provide real-time or historical data about the asset, and you can configure how frequently to sample the tag value.
- OPC UA *events* that represent state changes. OPC UA events provide real-time status information for your assets that lets you configure alarms and notifications.

The operations experience lets users create assets and subscribe to OPC UA tags in a user-friendly interface. Users can create custom assets by providing asset details and configurations. Users can create or import tag and event definitions, subscribe to them, and assign them to an asset.

## Manage assets as Azure resources in a centralized registry

Azure Device Registry Preview provides a single registry for devices and assets, and projects your industrial assets as Azure resources. Together, Device Registry and the operations experience web UI give teams a consistent deployment and management experience across cloud and edge environments.

Device Registry provides several capabilities that help teams to manage assets:

- **Unified registry**. The Device Registry serves as the single source of truth for your asset metadata. Having a single registry can streamline and simplify the process of managing assets. It gives you a way to access and manage this data across Azure, partner, and customer applications running in the cloud or on the edge.
- **Assets as Azure resources**. Because Device Registry projects assets as true Azure resources, you can manage assets using established Azure features and services. Enterprises can use [Azure Resource Manager](../../azure-resource-manager/management/overview.md), Azure's native deployment and management service, with industrial assets. Azure Resource Manager provides capabilities such as resource groups, tags, role-based access controls ([RBAC](../../role-based-access-control/overview.md)), policy, logging, and audit.
- **Cloud management of assets**. You use Device Registry within the operations experience to remotely manage assets in the cloud. All interactions with the asset resource are also available by using Azure APIs and using management tools such as [Azure Resource Graph](../../governance/resource-graph/overview.md). Regardless of which method you use to manage assets, changes made in the cloud are synced to the edge and exposed as custom resources in the Kubernetes cluster.

The following screenshot shows an example thermostat asset in the operations experience:

:::image type="content" source="media/overview-manage-assets/asset-operations-portal.png" alt-text="A screenshot that shows the thermostat asset in the operations experience.":::

The following screenshot shows the example thermostat asset in the Azure portal:

:::image type="content" source="media/overview-manage-assets/asset-portal.png" alt-text="A screenshot that shows the thermostat asset in the Azure portal.":::

The following screenshot shows the example thermostat asset as a Kubernetes custom resource:

:::image type="content" source="media/overview-manage-assets/asset-kubernetes.png" alt-text="A screenshot that shows the thermostat asset as a Kubernetes custom resource.":::

The following features are supported in Azure Device Registry:

| Feature  | Supported |
| -------- | :-------: |
| Asset resource management by using Azure API | ✅ |
| Asset resource management by using operations experience | ✅ |
| Asset synchronization to Kubernetes cluster running Azure IoT Operations | ✅ |
| Asset as Azure resource (with capabilities such as Azure resource groups and tags) | ✅ |

## Discover edge assets

A common task in complex edge solutions is to discover assets and automatically add them to your Kubernetes cluster. The Akri services provide this capability. For administrators who attach or remove assets from the cluster, the Akri services reduce the amount of coordination and manual configuration.

The Akri services include fixed-network discovery handlers. Discovery handlers enable assets from known network endpoints to find leaf devices as they appear on device interfaces or local subnets. Examples of network endpoints include OPC UA servers at a fixed IP address, and network scanning discovery handlers.

The Akri services are installed as part of Azure IoT Operations and you can configure them alongside the OPC UA simulation PLC server. The OPC UA discovery handler starts automatically and inspects the OPC UA simulation PLC server's address space. The discovery handler reports assets back to the Akri services and triggers deployment of the `AssetEndpointProfile` and `Asset` custom resources into the cluster.

## Use a common data exchange standard for your edge solution

A key requirement in industrial environments is for a common standard or protocol for machine-to-machine and machine-to-cloud data exchange. By using a widely supported data exchange protocol, you can simplify the process to enable diverse industrial assets to exchange data with each other, with workloads running in your Kubernetes cluster, and with the cloud. [OPC UA](https://opcfoundation.org/about/opc-technologies/opc-ua/) is a specification for a platform independent service-oriented architecture that enables data exchange in industrial environments.

An industrial environment that uses the OPC UA standard, includes the following basic OPC UA elements:

- An **OPC UA server** is software based on the OPC UA specification that communicates with assets and provides core OPC UA services to those assets.
- An **OPC UA client**. An OPC UA client is software that interacts with an OPC UA server in a request and response network pattern. An OPC UA client connects to OPC UA servers, and submits requests for actions such as reads and writes on data items.

The connector for OPC UA is an OPC UA client that enables data ingress from OPC UA servers into your edge solution based on the OPC UA standard. The connector for OPC UA is installed as part of Azure IoT Operations. You can optionally install an OPC UA simulation server, which lets you test and use the service.
