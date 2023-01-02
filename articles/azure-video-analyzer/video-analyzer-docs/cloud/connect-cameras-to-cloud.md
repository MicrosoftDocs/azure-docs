---
title: Connecting cameras to the service
description: This article discusses ways to connect cameras directly to Azure Video Analyzer service.
ms.service: azure-video-analyzer
ms.topic: conceptual
ms.date: 11/04/2021
ms.custom: ignite-fall-2021
---

# Connect cameras to the cloud

[!INCLUDE [header](includes/cloud-env.md)]

[!INCLUDE [deprecation notice](../includes/deprecation-notice.md)]

Azure Video Analyzer service allows users to connect RTSP cameras directly to the cloud in order capture and record video, using [live pipelines](../pipeline.md). This will either reduce the computational load on an edge device or eliminate the need for an edge device completely. Video Analyzer service currently supports three different methods for connecting cameras to the cloud: connecting via a remote device adapter, connecting from behind a firewall using an IoT PnP command, and connecting over the internet without a firewall.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/connect-cameras-to-cloud/connect-cameras-to-cloud.svg" alt-text="3 different methods for connecting cameras to the cloud":::

## Connect via a remote device adapter

You can deploy the Video Analyzer edge module to an IoT Edge device on the same (private) network as the RTSP cameras, and connect the edge device to the internet. The edge module can now be set up as an *adapter* that enables Video Analyzer service to connect to the *remote devices* (cameras). The edge module acts as a [transparent gateway](../../../iot-edge/iot-edge-as-gateway.md) for video traffic between the RTSP cameras and the Video Analyzer service. This approach is useful in the following scenarios:

* When cameras/devices need to be shielded from exposure to the internet
* When cameras/devices do not have the functionality to connect to IoT Hub independently
* When power, space, or other considerations permit only a lightweight edge device to be deployed on-premises

The Video Analyzer edge module does not act as a transparent gateway for messaging and telemetry from the camera to IoT Hub, but only as a transparent gateway for video.

## Connect behind a firewall using an IoT PnP device implementation

This method allows RTSP cameras or devices to connect to Video Analyzer behind a firewall using [IoT Plug and Play command interface](../../../iot-develop/overview-iot-plug-and-play.md) and eliminates the need for an edge device. This method requires that a suitable IoT PnP device implementation be installed and run on cameras or devices. Information for how to connect a compatible devices from any manufacturer is [here](connect-devices.md).

## Connect over the internet (no firewall)

This method should only be used for supervised proof-of-concept exercises, where it may be permissible to permit the Video Analyzer service to access the device over the internet, without a firewall. 

A related use case is when a module is deployed to an Azure VM to simulate an RTSP camera, as described in this [quickstart](get-started-livepipelines-portal.md).


## Next Steps

- Follow [this how-to guide](use-remote-device-adapter.md) to connect cameras via a remote device adapter
- Follow [this how-to guide](connect-devices.md) for information on connecting devices using an IoT PnP implementation
- Follow [this quickstart](get-started-livepipelines-portal.md) to connect cameras over the internet
