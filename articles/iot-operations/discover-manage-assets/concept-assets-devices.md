---
title: Assets and Devices
description: Understand the Azure Device Registry resources that define assets and devices.
author: dominicbetts
ms.author: dobett
#ms.subservice:
ms.topic: concept-article
ms.date: 04/22/2026
ai-usage: ai-assisted

#customer intent: As an industrial edge IT or operations user, I want to understand the types of Azure resources that Azure Device Registry creates to manage assets.
---

# Assets and devices

> [!IMPORTANT]
> To view the asset endpoint (classic) documentation, go to [What is asset management in Azure IoT Operations](/previous-versions/azure/iot-operations/discover-manage-assets/overview-manage-assets) on the site for previous versions.

[!INCLUDE [assets-devices-logical-entities](../includes/assets-devices-logical-entities.md)]

The following diagram shows the relationships between assets, devices, and connector templates. This article describes these resources in more detail.

:::image type="content" source="media/concept-assets-devices/assets-devices.svg" alt-text="Diagram that shows the relationships between asset and device configuration resources." border="false":::

<!--
```mermaid
graph LR
    CT["`Connector templates
       such as OPC UA, ONVIF, Media,
       MQTT, HTTP/REST, SSE.`"]

    subgraph Device
        IE1["`Inbound endpoint(s)<br/>- *Address*<br/>- *Connector type*<br/>- *Authentication data*`"]
    end


    A["`Asset<br/>- *Name*<br/>- *Data points/Streams/<br/>Events/Actions*`"]


    CT -- Used by connector type --&gt; IE1
    A -- "`References an inbound endpoint`" --&gt; IE1>
```
--->

## Devices

Before you create an asset, define a device. A device is a configuration resource that describes [southbound](overview-manage-assets.md#southbound-and-northbound-connectivity) edge connectivity information for one or more assets.

### Inbound endpoints

Each device has one or more *inbound endpoints* that define how the device connects securely to a physical asset or device. For example:

- A device with an inbound endpoint definition for OPC Unified Architecture (OPC UA) stores the information that you need for connecting to an OPC UA server.
- A device with an inbound endpoint definition for the media connector stores the information that you need for connecting to a media source.
- A device with an inbound endpoint definition for MQTT stores the information that you need for connecting to an external MQTT broker or a topic on the built-in MQTT broker.
- A device with an inbound endpoint definition for HTTP/REST stores the information that you need for connecting to an HTTP endpoint.

A device can have multiple inbound endpoints. For example, you might create a device with two inbound endpoints that connect to an OPC UA server and an MQTT broker.

Each inbound endpoint has properties like:

- **Address**. The network address of the physical asset or device. For example, the URL of an OPC UA server or the IP address of a camera.
- **Connector type**. The type of connector that the device uses to connect to the physical asset or device. For example, `opcua`, `onvif`, `media`, `mqtt`, `http`, or `sse`.
- **Authentication data**. The credentials that the device uses to authenticate to the physical asset or device. For example, a username and password.

### Connector templates

*Connector templates* define the types of inbound endpoints available to operational technology (OT) users. For example, the Open Network Video Interface Forum (ONVIF) connector template defines the required properties for creating an inbound endpoint that connects to an ONVIF-compliant camera. Other built-in connector templates include OPC UA, media, MQTT, HTTP/REST, and server-sent events (SSE).

An IT user adds connector templates in the Azure portal. After the IT user adds a connector template, an OT user can create devices with inbound endpoints of that type in the operations experience web UI.

## Assets

An asset is a configuration resource that represents a physical device or asset as:

- An Azure Resource Manager resource in the cloud.
- A Kubernetes custom resource at the edge.

[!INCLUDE [cloud-source-of-truth](../includes/cloud-source-of-truth.md)]

When you define an asset by using the operations experience or the Azure IoT Operations CLI, set up schema information like datasets, event groups, and management groups for each asset.

The type of inbound endpoint that the asset connects to determines what schema elements you define for the asset. For example:

- If the asset connects to an OPC UA server, define datasets, event groups, and management groups.
- If the asset connects to a media resource, define streams.
- If the asset connects to an HTTP/REST endpoint, define datasets.
- If the asset connects to an SSE endpoint, define datasets and event groups.
- If the asset connects to an MQTT broker, define datasets.

### Streams

A *stream* is streaming data, like video or image snapshots, from a media source. For example, a camera connected through the media connector can stream video data.

Streams can be:

- Published to an MQTT topic.
- Saved to storage and synced with the cloud.
- Routed to a media service.

### Events

An *event* is a notification of a state change from a connected asset. For example, a physical asset connected to an OPC UA server can generate an event when a temperature reaches a certain threshold, or an ONVIF-compliant camera can generate an event when it detects motion. Connectors for SSE can also deliver events from SSE endpoints.

Events are grouped into event groups. An *event group* is a collection of events that are logically related. The event group specifies the MQTT topic where the asset publishes event data.

### Actions

An *action* is a command that you send to a connected asset. For example, you can send an action to an ONVIF-compliant camera to start recording or to change its pan-tilt-zoom position. The connector for OPC UA also supports sending commands to OPC UA servers.

Actions are grouped into management groups. A *management group* is a collection of actions that are logically related. The management group specifies the MQTT topic where the asset subscribes for action commands.

### Data points

A *data point* is a single piece of information that's fetched from an endpoint such as an HTTP/REST service. For example, a temperature reading from a sensor is a data point.

Data points are grouped into datasets. A *dataset* is a collection of data points that are logically related. The dataset specifies the MQTT topic where the asset publishes tag values.

For a list of available connectors and the data types they support, see [Connectivity](overview-manage-assets.md#connectivity).

## Destinations

Assets don't provide [northbound](overview-manage-assets.md#southbound-and-northbound-connectivity) connectivity for physical assets and devices. They publish data to the MQTT broker or save data to local storage. Other Azure IoT Operations services provide northbound connectivity. For example:

- *Data flows* route data from the MQTT broker to cloud services like Azure Event Grid or Azure Event Hubs.
- The media connector can proxy media streams to other media servers or upload captured data to Azure Blob Storage.
