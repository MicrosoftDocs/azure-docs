---
title: Understand assets and devices
description: Understand the Azure Device Registry resources that define assets and devices.
author: dominicbetts
ms.author: dobett
#ms.subservice:
ms.topic: concept-article
ms.date: 09/04/2025

# CustomerIntent: As an industrial edge IT or operations user, I want to understand the types of Azure resources that are created by Azure Device Registry to manage assets.
---

# Understand assets and devices

> [!IMPORTANT]
> To view the asset endpoint (classic) documentation, go to [Asset management overview](/previous-versions/azure/iot-operations/discover-manage-assets/overview-manage-assets) on the previous versions site.

[!INCLUDE [assets-devices-logical-entities](../includes/assets-devices-logical-entities.md)]

This diagram shows the relationships between assets, devices, and connector templates. This article describes these resources in more detail.

:::image type="content" source="media/concept-assets-devices/assets-devices.svg" alt-text="Diagram that shows the relationships between asset and device configuration resources." border="false":::

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

## Devices

Before you create an asset, define a device. A device is a configuration resource that describes southbound edge connectivity information for one or more assets. Each device has one or more inbound endpoints that define how the device connects securely to a physical asset or device. For example:

- A device with an inbound endpoint definition for OPC UA stores the information you need to connect to an OPC UA server.
- A device with an inbound endpoint definition for the media connector stores the information you need to connect to a media source.

> [!NOTE]
> A device can have multiple inbound endpoints. For example, you might create a device with two inbound endpoints that connect to an OPC UA server and a media source.

### Inbound endpoints

An inbound endpoint configuration defines how a device connects to a physical asset or device. Each inbound endpoint has properties like:

- **Address**: The network address of the physical asset or device. For example, the URL of an OPC UA server or the IP address of a camera.
- **Connector type**: The type of connector the device uses to connect to the physical asset or device. For example, `opcua`, `onvif`, or `media`.
- **Authentication data**: The credentials the device uses to authenticate to the physical asset or device. For example, a username and password.

### Connector templates

*Connector templates* define the types of inbound endpoints available to OT users. For example, the ONVIF connector template defines the properties required to create an inbound endpoint that connects to an ONVIF-compliant camera.

An IT user adds connector templates in the Azure portal. After the IT user adds a connector template, an OT user can create devices with inbound endpoints of that type in the operations experience web UI.

## Assets

An *asset* is a configuration resource that represents a physical device or asset as an Azure Resource Manager resource in the cloud and as a Kubernetes custom resource at the edge. When you define an asset using the operations experience or Azure IoT Operations CLI, set up schema information like *data points*, *tags*, *events*, and *streams* for each asset.

The type of inbound endpoint that the asset connects to determines what schema elements you define for the asset. For example, if the asset connects to an OPC UA server, define tags and events. If the asset connects to a media resource, define streams.

### Tags

A *tag* is a value that an OPC UA server emits. For example, OPC UA tags give real-time or historical data about a physical asset connected to the OPC UA server.

Tags are grouped into datasets. A *dataset* is a collection of tags that are logically related. The dataset specifies the MQTT topic where the asset publishes tag values.

### Streams

A *stream* is streaming data, like video or image snapshots from a media source. For example, a camera connected to the media connector can stream video data.

Streams can be:

- Published to an MQTT topic
- Saved to storage and synced with the cloud
- Routed to a media service

### Events

An *event* is a notification of a state change to your OPC UA and ONVIF assets. For example, a physical asset connected to an OPC UA server can generate an event when a temperature reaches a certain threshold.

Events are grouped into event groups. An *event group* is a collection of events that are logically related. The event group specifies the MQTT topic where the asset publishes event data.

### Actions

An *action* is a command that you send to an ONVIF asset. For example, you can send an action to a camera to start recording video.

Actions are grouped into management groups. A *management group* is a collection of actions that are logically related. The management group specifies the MQTT topic where the asset subscribes for action commands.

### Data points

A *data point* is a single piece of information that's fetched from an HTTP/REST endpoint. For example, a temperature reading from a sensor is a data point.

Data points are grouped into datasets. A *dataset* is a collection of data points that are logically related. The dataset specifies the MQTT topic where the asset publishes tag values.

## Destinations

Assets don't provide northbound connectivity for physical assets and devices. They publish data to the MQTT broker or save data to local storage. Other Azure IoT Operations services provide northbound connectivity. For example:

- *Data flows* route data from the MQTT broker to cloud services like Azure Event Grid or Azure Event Hubs.
- The media connector proxies media streams to other media servers or uploads captured data to Azure blob storage.
