---
title: Connecting cameras to Azure Video Analyzer cloud service
description: This article discusses ways to connect cameras directly to Azure Video Analyzer service.
ms.service: azure-video-analyzer
ms.topic: conceptual
ms.date: 11/01/2021
---

# Connect cameras to the cloud

[!INCLUDE [header](includes/edge-env.md)]

Azure Video Analyzer allows users to connect cameras directly to the cloud in order capture and record video, using [cloud pipelines](../pipeline.md). This will either reduce the computational load on an edge device or eliminate the need for an edge device completely. Video Analyzer currently supports three different methods for connecting cameras to the cloud: connecting via a remote device adapter, connecting from behind a firewall using an IoT PnP command, and connecting over the open internet without a firewall.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/connect-cameras-to-cloud/connect-cameras-to-cloud.svg" alt-text="3 different methods for connecting cameras to the cloud":::

## Connect via a remote device adapter

This method allows remote device adapters to make cameras available to Video Analyzer while the Video Analyzer Edge module acts as a [transparent gateway](../../../iot-edge/iot-edge-as-gateway.md) for video packets and RTSP protocol from the camera to Video Analyzer's cloud service. This approach is useful in the following scenarios:

* When cameras/devices connected to the gateway need to be shielded from exposure to the internet
* When cameras/devices do not have the functionality to connect to IoT Hub independently
* When power, space, or other considerations permit only a lightweight edge device to be deployed on-premise

> [!NOTE]
> The Video Analyzer edge module is not acting as a transparent gateway for messaging and telemetry from the camera to IoT Hub, but only as a transparent gateway for video packets and RTSP protocol from the camera to Video Analyzer's cloud service.

## Connect behind a firewall using an IoT PnP command

This method allows cameras to connect to Video Analyzer behind a firewall using [IoT’s Plug and Play command interface](../../../iot-develop/overview-iot-plug-and-play.md) and eliminates the need for an edge device. This method requires that a suitable application can be installed and run on cameras to turn them into an IoT device. Currently, this method has only been fully implemented for Axis camera models capable of running a minimum firmware version of **9.70** with **armv7hf** or **aarch64** architecture  using the [Video Analyzer ACAP application](https://github.com/Azure/video-analyzer-device-client-axis). Information for how to connect a compatible device from any manufacturer is [here](connect-devices.md).

> [!NOTE]
> mips architecture is not supported


## Connect over the open internet (no firewall) or within an Azure region

This method should only be used for supervised proof-of-concept exercises, where it may be permissible to connect a camera directly to the cloud without a firewall and the camera's RTSP server is accessible over the open internet. Another use case is when an Azure VM is used to simulate a camera, as described in this <!--TODO: link to cloud CVR tutorial being written by Mayank -->


## Next Steps

- Follow [this how-to guide](use-remote-device-adapter.md) to connect cameras via a remote device adapter
- Follow [this tutorial]() <!--- TODO: link to ACAP tutorial--> to connect an Axis camera
- Follow [this how-to guide](connect-devices.md) for information on connecting devices from other manufactures


