---
title: Disconnected device update using Microsoft Connected Cache | Microsoft Docs
titleSuffix:  Device Update for Azure IoT Hub
description: Understand support for disconnected device update using Microsoft Connected Cache
author: andyriv
ms.author: andyriv
ms.date: 08/19/2022
ms.topic: conceptual
ms.service: iot-hub-device-update
---

# Understand support for disconnected device updates

> [!NOTE]
> This information relates to a preview feature that's available for early testing and use in a production environment. This feature is fully supported but it's still in active development and may receive substantial changes until it becomes generally available.

In a transparent gateway scenario, one or more devices can pass their messages through a single gateway device that maintains the connection to Azure IoT Hub. In these cases, the child devices may not have internet connectivity or may not be allowed to download content from the internet. The Microsoft Connected Cache preview IoT Edge module provides Device Update for IoT Hub customers with the capability of an intelligent in-network cache. The cache enables image-based and package-based updates of Linux OS-based devices behind an IoT Edge gateway (also called *downstream* IoT devices), and also helps reduce the bandwidth used for updates.

## Microsoft Connected Cache preview for Device Update for IoT Hub

Microsoft Connected Cache is an intelligent, transparent cache for content published for Device Update for IoT Hub and can be customized to cache content from other sources like package repositories as well. Microsoft Connected Cache is a cold cache that is warmed by client requests for the exact file ranges requested by the Delivery Optimization client and doesn't pre-seed content. The diagram and step-by-step description below explains how Microsoft Connected Cache works within the Device Update infrastructure.

>[!Note]
>This flow assumes that the IoT Edge gateway has internet connectivity. For the downstream IoT Edge gateway (nested edge) scenario, the content delivery network (CDN) can be considered the MCC hosted on the parent IoT Edge gateway.

  :::image type="content" source="media/connected-cache-overview/disconnected-device-update.png" alt-text="Disconnected Device Update" lightbox="media/connected-cache-overview/disconnected-device-update.png":::

1. Microsoft Connected Cache is deployed as an IoT Edge module to the on-premises server.
2. Device Update for IoT Hub clients are configured to download content from Microsoft Connected Cache by virtue of either the GatewayHostName attribute of the device connection string for IoT leaf devices **or** the parent_hostname set in the config.toml for IoT Edge child devices.
3. Device Update for IoT Hub clients receive update content download commands from the Device Update service and request update content from the Microsoft Connected Cache instead of the CDN. Microsoft Connected Cache listens on HTTP port 80 by default, and the Delivery Optimization client makes the content request on port 80 so the parent must be configured to listen on this port. Only the HTTP protocol is supported at this time.
4. The Microsoft Connected Cache server downloads content from the CDN, seeds its local cache stored on disk and delivers the content to the Device Update client.

   >[!Note]
   >When using package-based updates, the Microsoft Connected Cache server will be configured by the admin with the required package hostname.

5. Subsequent requests from other Device Update clients for the same update content will now come from cache and Microsoft Connected Cache won't make requests to the CDN for the same content.

### Supporting industrial IoT (IIoT) with parent/child hosting scenarios

When a downstream or child IoT Edge gateway is hosting a Microsoft Connected Cache server, it will be configured to request update content from the parent IoT Edge gateway, also hosting a Microsoft Connected Cache server. This request is repeated for as many levels as necessary before reaching the parent IoT Edge gateway hosting a Microsoft Connected Cache server that has internet access. From the internet connected server, the content is requested from the CDN at which point the content is delivered back to the child IoT Edge gateway that originally requested the content. The content will be stored on disk at every level.

## Request access to the preview

The Microsoft Connected Cache IoT Edge module is released as a preview for customers who are deploying solutions using Device Update for IoT Hub. Access to the preview is by invitation. [Request Access](https://aka.ms/MCCForDeviceUpdateForIoT) to the Microsoft Connected Cache preview for Device Update for IoT Hub and provide the information requested if you would like access to the module.
