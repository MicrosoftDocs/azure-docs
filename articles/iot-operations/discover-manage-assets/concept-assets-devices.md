---
title: Understand assets and devices
description: Understand the Azure Device Registry resources that define assets and devices.
author: dominicbetts
ms.author: dobett
#ms.subservice:
ms.topic: concept-article
ms.date: 06/24/2025

# CustomerIntent: As an industrial edge IT or operations user, I want to understand the types of Azure resources that are created by Azure Device Registry to manage assets.
---

# Define assets and devices

[!INCLUDE [assets-devices-logical-entities](../includes/assets-devices-logical-entities.md)]


:::image type="content" source="media/concept-assets-devices/assets-devices.svg" alt-text="Diagram that shows the relationships between the asset and device configuration resources." border="false":::

<!--
```mermaid
graph LR
    CT["`Connector templates
       such as OPC UA, ONVIF, Media.`"]

    subgraph Device
        IE1["`Inbound endpoint(s)<br/>- *Address*<br/>- *Connector type*<br/>- *Authentication data*`"]
    end


    A["`Asset<br/>- *Name*<br/>- *Data points/Streams/<br/>Events*`"]


    CT -- Used by connector type --&gt; IE1
    A -- "`References an inbound endpoint`" --&gt; IE1>
```
--->

Asset *data points*, *streams*, and *events* define the data that's collected from a physical asset or device.

An IT user adds connector templates in the Azure portal. A connector template defines a type of connector, such as the media connector, that an OT user can configure in the operations experience.

## Cloud and edge resources

Azure Device Registry registers assets and devices as Azure resources. Azure Device Registry also syncs these cloud resources to the edge as [Kubernetes custom resources](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/).

You can create, edit, and delete devices and assets by using the Azure IoT Operations CLI or the operations experience web UI. For more information, see [Manage asset configurations](./howto-configure-opc-ua.md).

## Devices

Before you can create an asset, you need to define a device. A device is a profile that describes southbound edge connectivity information for one or more assets.

Currently, the only southbound connectors available in Azure IoT Operations are the connector for OPC UA, the media connector (preview), the connector for ONVIF (preview), the connector for SQL (preview), and the connector for HTTP/REST (preview). You can use the Azure IoT Operations SDKs to create custom connectors. Devices are configurations for a connector that enable it to connect to an asset. For example:

- A device for OPC UA stores the information you need to connect to an OPC UA server.
- A device for the media connector stores the information you need to connect to a media source.

For more information, see [What is the connector for OPC UA?](./overview-opc-ua-connector.md)

The following table highlights some important properties that are included in A device definition.

| Property | Description |
| -------- | ----------- |
| **Cluster** or **Location** | The custom location or cluster name for the Azure IoT Operations instance where the device custom resource will be created. In the operations experience, this property is set by choosing the instance before you create the device. |
| **Target address** | The local IP address of the OPC UA server or IP camera. |
| **User authentication** | Can be anonymous authentication or username/password authentication. For username/password authentication, provide pointers to where both values are stored as secrets in Azure Key Vault. |

## Assets

An *asset* is a configuration resource that represents a physical device or asset in the cloud as an Azure Resource Manager resource and at the edge as a Kubernetes custom resource. When you create an asset, you can define its metadata and the data points, events, and streams that it emits.

When you define an asset using either the operations experience or Azure IoT Operations CLI, you can configure *data points*, *events*, and *streams* for each asset.

The following table highlights some important properties that are included in an asset definition.

| Property | Description |
| -------- | ----------- |
| **Cluster** or **Location** | The custom location or cluster name for the Azure IoT Operations instance where the asset custom resource will be created. In the operations experience, this property is set by choosing the instance before you create the device. |
| **Device** | The name of the device endpoint that this asset connects to. |
| **Custom attributes** | Metadata about the asset that you can provide using any key=value pairs that make sense for your environment. |
| **Data point**, **Event**, or **Stream** | A set of key=value pairs that define the data the asset emits. |

### Data points

A *data point* is a value that the asset collects. For example, OPC UA data points provide real-time or historical data about a physical asset connected to the OPC UA server. Data points include the following properties:

| Property | Description |
| -------- | ----------- |
| **Node Id** | The [OPC UA node ID](https://opclabs.doc-that.com/files/onlinedocs/QuickOpc/Latest/User%27s%20Guide%20and%20Reference-QuickOPC/OPC%20UA%20Node%20IDs.html) that represents a location on the OPC UA server where the asset emits this data point. |
| **Name** | A friendly name for the tag. |
| **Queue size** | How much sampling data to collect before publishing it. Default: `1`. |
| **Observability mode** | Accepted values: `none`, `gauge`, `counter`, `histogram`, `log`. |
| **Sampling interval** | The rate in milliseconds that the OPC UA server should sample the data source for changes. Default: `500`. |

### Events

An *event* is a notification of a state changes to your asset. For example, a physical asset connected to an OPC UA server might generate an event when a temperature reaches a certain threshold. Events include the following properties:

| Property | Description |
| -------- | ----------- |
| **Event notifier** | The [OPC UA node ID](https://opclabs.doc-that.com/files/onlinedocs/QuickOpc/Latest/User%27s%20Guide%20and%20Reference-QuickOPC/OPC%20UA%20Node%20IDs.html) that represents a location on the OPC UA server where the server emits this event. |
| **Name** | A friendly name for the event. |
| **Observability mode** | Accepted values: `none`, `log`. |
| **Queue size** | How much event data to collect before publishing it. Default: `1`. |

### Streams

<!-- TODO: Add more information about streams. -->

A *stream* is streaming data from a physical device. For example, a camera connected to the media connector can stream video data. Streams include the following properties:

| Property | Description |
| -------- | ----------- |
| **Stream type** | The type of stream. For example, `video`, `audio`, or `data`. |
| **Stream URL** | The URL of the stream. For example, the URL of a video stream from a camera. |
