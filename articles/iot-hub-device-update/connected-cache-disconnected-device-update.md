---
title: Understand support for disconnected device update using Microsoft Connected Cache | Microsoft Docs
titleSuffix:  Device Update for Azure IoT Hub
description: Understand support for disconnected device update using Microsoft Connected Cache
author: andyriv
ms.author: andyriv
ms.date: 2/16/2021
ms.topic: conceptual
ms.service: iot-hub-device-update
---

# Understand support for disconnected device updates

In a transparent gateway scenario, one or more devices can pass their messages through a single gateway device that maintains the connection to Azure IoT Hub. In these cases, the child devices may not have internet connectivity or may not be allowed to download content from the internet. The Microsoft Connected Cache Preview IoT Edge module will provide Device Update for Azure IoT Hub customers with the capability of an intelligent in-network cache, which enables image-based and package-based updates of Linux OS-based devices behind and IoT Edge gateway (downstream IoT devices), and will also help save bandwidth for Device Update for Azure IoT Hub customers.

## How does Microsoft Connected Cache preview for Device Update for Azure IoT Hub work?

Microsoft Connected Cache Preview is an intelligent, transparent cache for content published for Device Update for Azure IoT Hub content and can be customized to cache content from other sources like package repositories as well. Microsoft Connected Cache is a cold cache that is warmed by client requests for the exact file ranges requested by the Delivery Optimization client and does not pre-seed content. The diagram and step-by-step description below explains how Microsoft Connected Cache works within the Device Update for Azure IoT Hub infrastructure.

>[!Note]
>In defining this flow, it has been assumed that the IoT Edge gateway has internet connectivity. For the downstream IoT Edge gateway (Nested Edge) scenario the "Content Delivery Network" (CDN) can be considered the MCC hosted on the parent IoT Edge gateway.

  :::image type="content" source="media/connected-cache-overview/disconnected-device-update.png" alt-text="Disconnected Device Update" lightbox="media/connected-cache-overview/disconnected-device-update.png":::

1. Microsoft Connected Cache is deployed as an IoT Edge module to the on-prem server.
2. Device Update for Azure IoT Hub clients are configured to download content from Microsoft Connected Cache by virtue of 
the GatewayHostName attribute of the device connection string for IoT leaf devices **OR** parent_hostname set in the config.toml for IoT Edge child devices.
3. Device Update for Azure IoT Hub clients in both cases receive update content download commands from the Device Update for Azure IoT Hub service and request update content to the Microsoft Connected Cache instead of the CDN. Microsoft Connected Cache by default is configured to listen on http port 80, and the Delivery Optimization client makes the content request on port 80 so the parent must be configured to listen on this port.  Only the http protocol is supported at this time.
4. The Microsoft Connected Cache server downloads content from the CDN, seeds its local cache stored on disk and delivers the content to the Device Update for Azure IoT Hub client.
   
>[!Note]
>When using package-based updates, the Microsoft Connected Cache server will be configured by the admin with the required package hostname.

5. Subsequent requests from other Device Update for Azure IoT Hub clients for the same update content will now come from cache and Microsoft Connected Cache will not make requests to the CDN for the same content.

### Supporting Industrial IoT (IIoT) with parent/child hosting scenarios

When a downstream or child IoT Edge gateway is hosting the Microsoft Connected Cache server, it will be configured to request update content from the parent IoT Edge gateway, hosting the Microsoft Connected Cache server. This is required for as many levels as necessary before reaching the parent IoT Edge gateway hosting a Microsoft Connected Cache server that has internet access. From the internet connected server, the content is requested from the CDN at which point the content is delivered back to the child IoT Edge gateway that originally requested the content. The content will be stored on disk at every level.

## Access to the Microsoft Connected Cache preview for Device Update for Azure IoT Hub

The Microsoft Connected Cache IoT Edge module is released as a preview for customers who are deploying solutions using Device Update for Azure IoT Hub. Access to the preview is by invitation. [Request Access](https://aka.ms/MCCForDeviceUpdateForIoT) to the Microsoft Connected Cache Preview for Device Update for IoT Hut and provide the information requested if you would like access to the module.
