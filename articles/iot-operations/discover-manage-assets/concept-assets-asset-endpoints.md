---
title: Understand assets and asset endpoint profiles
description: Understand the Azure Device Registry resources that define assets and asset endpoint profiles.
author: kgremban
ms.author: kgremban
#ms.subservice:
ms.topic: conceptual
ms.date: 10/22/2024

# CustomerIntent: As an industrial edge IT or operations user, I want to understand the types of Azure resources that are created by Azure Device Registry to manage assets.
---

# Define assets and asset endpoints

Azure IoT Operations uses Azure resources called assets and asset endpoints to connect and manage components of your industrial edge environment.

Historically, in industrial edge environments the term *asset* refers to any item of value that you want to manage, monitor, and collect data from. An asset can be a machine, a software component, an entire system, or a physical object of value such as a field of crops or a building. These assets are examples that exist in manufacturing, retail, energy, healthcare, and other sectors.

In Azure IoT Operations, you can create an *asset* in the cloud to represent an asset in your industrial edge environment. An Azure IoT Operations asset can emit data. Southbound connectors in your IoT Operations instance collect these data and publish them to an MQTT topic where they can be picked up and routed by dataflows.

## Cloud and edge resources

Azure Device Registry registers assets and asset endpoints as Azure resources, enabled by Azure Arc. Device registry also syncs these cloud resources to the edge as [Kubernetes custom resources](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/).

You can create, edit, and delete asset endpoints and assets by using the Azure IoT Operations CLI extension or the operations experience web UI. For more information, see [Manage asset configurations remotely](./howto-manage-assets-remotely.md).

## Asset endpoints

Before you can create an asset, you need to define an asset endpoint profile. An *asset endpoint* is a profile that describes southbound edge connectivity information for one or more assets.

Currently, the only southbound connectors available in Azure IoT Operations are the connector for OPC UA, the media connector (preview), and the connector for ONVIF (preview). Asset endpoints are configurations for a connector that enable it to connect to an asset. For example:

- An asset endpoint for OPC UA stores the information you need to connect to an OPC UA server.
- An asset endpoint for the media connector stores the information you need to connect to a media source.

For more information, see [What is the connector for OPC UA?](./overview-opcua-broker.md)

The following table highlights some important properties that are included in an asset endpoint definition.

| Property | Description |
| -------- | ----------- |
| **Cluster** or **Location** | The custom location or cluster name for the Azure IoT Operations instance where the asset endpoint custom resource will be created. In the operations experience, this property is set by choosing the instance before you create the asset endpoint. |
| **Target address** | The local IP address of the OPC UA server or IP camera. |
| **User authentication** | Can be anonymous authentication or username/password authentication. For username/password authentication, provide pointers to where both values are stored as secrets in Azure Key Vault. |

## Assets

An *asset* is a logical entity that represents a device or component in the cloud as an Azure Resource Manager resource and at the edge as a Kubernetes custom resource. When you create an asset, you can define its metadata and the datapoints (also called tags) and events that it emits.

Currently, an asset in Azure IoT Operations can be an:

- Something connected to an OPC UA server such as a robotic arm.
- A media source such as a camera.

When you define an asset using either the operations experience or Azure IoT Operations CLI, you can configure *tags* and *events* for each asset.

The following table highlights some important properties that are included in an asset definition.

| Property | Description |
| -------- | ----------- |
| **Cluster** or **Location** | The custom location or cluster name for the Azure IoT Operations instance where the asset custom resource will be created. In the operations experience, this property is set by choosing the instance before you create the asset endpoint. |
| **Asset endpoint** | The name of the asset endpoint that this asset connects to. |
| **Custom attributes** | Metadata about the asset that you can provide using any key=value pairs that make sense for your environment. |
| **Tag** or **Data** | A set of key=value pairs that define a data point from the asset. |

### Asset tags

A *tag* is a description of a data point that can be collected from an asset. OPC UA tags provide real-time or historical data about an asset. Tags include the following properties:

| Property | Description |
| -------- | ----------- |
| **Node Id** | The [OPC UA node ID](https://opclabs.doc-that.com/files/onlinedocs/QuickOpc/Latest/User%27s%20Guide%20and%20Reference-QuickOPC/OPC%20UA%20Node%20IDs.html) that represents a location on the OPC UA server where the asset emits this data point. |
| **Name** | A friendly name for the tag. |
| **Queue size** | How much sampling data to collect before publishing it. Default: `1`. |
| **Observability mode** | Accepted values: `none`, `gauge`, `counter`, `histogram`, `log`. |
| **Sampling interval** | The rate in milliseconds that the OPC UA server should sample the data source for changes. Default: `500`. |

### Asset events

An *event* is a notification from an OPC UA server that can inform you about state changes to your asset. Events include the following properties:

| Property | Description |
| -------- | ----------- |
| **Event notifier** | The [OPC UA node ID](https://opclabs.doc-that.com/files/onlinedocs/QuickOpc/Latest/User%27s%20Guide%20and%20Reference-QuickOPC/OPC%20UA%20Node%20IDs.html) that represents a location on the OPC UA server where the server emits this event. |
| **Name** | A friendly name for the event. |
| **Observability mode** | Accepted values: `none`, `log`. |
| **Queue size** | How much event data to collect before publishing it. Default: `1`. |
