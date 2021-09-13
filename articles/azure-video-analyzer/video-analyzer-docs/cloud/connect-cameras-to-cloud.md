---
title: Connecting cameras to Azure Video Analyzer cloud
description: This article discusses connecting cameras to Azure Video Analyzer's cloud service.
ms.service: azure-video-analyzer
ms.topic: conceptual
ms.date: 11/01/2021
---

# Connect cameras to the cloud

Connecting cameras to Video Analyzer's cloud service will either reduce the computational load on your edge device or eliminate the need for an edge device overall. Video Analyzer currrently supports three different methods for connecting cameras to the cloud: connecting via a transparent gateway, connecting behind a firewall, and connecting over the open internet without a firewall.

<!--- TODO: add diagram similar to pvt preview just without pvt preview verbage -->

## Connecting via a transparent gateway
This method is for cameras to connect to AVA via the AVA Edge module acting as a [transparent gateway](../../../iot-edge/iot-edge-as-gateway.md). This approach is appropriate for users that are uncomfortable with connecting their cameras directly to the cloud. The AVA Edge module acting as a transparent gateway will lighten the computational load on the edge device. The AVA Edge module can be enabled to act as a transparent gateway using the DeviceProxySet/RemoteDeviceAdapterSet direct method. This method is for users that want to use a lightweight edge device to connect cameras to AVA and use our [Cloud pipelines]().<!--- TODO: link to cloud pipeline-->

## Connecting behind a firewall using a IoT PnP command <!--- TODO: solidify title - using IoT's Plug and Play, using IoT PnP, etc-->
This method is for cameras to connect to AVA cloud behind a firewall using IoT’s Plug and Play and eliminates the need for an edge device. This method is for users that can convert their cameras into an IoT device. Currently, this method is only fully supported for Axis camera models <!--- TODO: add what models or what firmware the camera must be running --> using the [Video Analyzer ACAP application]().

## Connecting over the open internet (no firewall)


