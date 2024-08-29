---
title: Understand assets and asset endpoint profiles
description: Understand the Azure Device Registry resources that define assets and asset endpoint profiles.
author: kgremban
ms.author: kgremban
#ms.subservice:
ms.topic: conceptual
ms.date: 08/27/2024

# CustomerIntent: As an industrial edge IT or operations user, I want to understand the types of Azure resources that are created by Azure Device Registry to manage assets.
---

# Define assets and asset endpoints

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Azure IoT Operations Preview uses Azure resources called assets and asset endpoints to connect and manage components of your industrial edge environment.

Historically, in industrial edge environments the term *asset* refers to any item of value that you want to manage, monitor, and collect data from. An asset can be a machine, a software component, an entire system, or a physical object of value such as a field of crops or a building. These assets are examples that exist in manufacturing, retail, energy, healthcare, and other sectors.

In Azure IoT Operations, you can create an *asset* in the cloud to represent a real asset in your environment. An Azure IoT Operations asset can emit telemetry and events. You use these logical asset instances to manage the real assets in your industrial edge environment.

## Cloud and edge resources

Azure Device Registry Preview registers assets and asset endpoints as Azure resources, enabled by Azure Arc. Device registry also syncs these cloud resources to the edge as [Kubernetes custom resources](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/).

## Asset endpoints

An *asset endpoints* is a profile that describes southbound edge connectivity information for one or more assets.

Currently, an asset endpoint in Azure IoT Operations is an OPC UA server that provides the connection to one or more assets.

When you define an asset endpoint using either the operations experience or Azure IoT Operations CLI, you configure the target address for the endpoint and connection information.

The following table highlights some important properties that are included in an asset endpoint definition.

| Property | Description |
| -------- | ----------- |
| **Cluster** or **Location** | The custom location or cluster name for the Azure IoT Operations instance where the asset endpoint custom resource will be created. In the operations experience, this property is set by choosing the instance before you create the asset endpoint. |
| **Target address** | The local IP address of the OPC UA server. |
| **User authentication** | Can be anonymous authentication or username/password authentication. For username/password authentication, provide pointers to where both values are stored as secrets in Azure Key Vault. |

## Assets

An *asset* is a logical entity in the cloud that represents a real device or component. When you create an asset, you can define its metadata and the datapoints (also called tags) and events that it emits.

Currently, an asset in Azure IoT Operations is anything that connects to an OPC UA server.

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
