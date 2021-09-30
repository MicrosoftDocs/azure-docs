---
title: Connecting cameras to Azure Video Analyzer cloud service
description: This article discusses ways to connect cameras directly to Azure Video Analyzer service.
ms.service: azure-video-analyzer
ms.topic: conceptual
ms.date: 11/01/2021
---

# Connect cameras to the cloud

Azure Video Analyzer allows users to connect cameras directly to the cloud in order capture and record video, using cloud pipelines<!--- TODO: link to section in pipeline.md -->. This will either reduce the computational load on an edge device or eliminate the need for an edge device completely. Video Analyzer currrently supports three different methods for connecting cameras to the cloud: connecting via a transparent gateway, connecting from behind a firewall using an IoT PnP command, and connecting over the open internet without a firewall.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/connect-cameras-to-cloud/connect-cameras-to-cloud.svg" alt-text="3 different methods for connecting cameras to the cloud":::

## Connecting via a transparent gateway
This method allows cameras to connect to Video Analyzer via the Video Analyzer Edge module acting as a [transparent gateway](../../../iot-edge/iot-edge-as-gateway.md). This approach is useful in the following scenarios:

* When cameras/devices connected to the gateway need to be shielded from exposure to the internet
* When cameras/devices do not have the functionality to connect to IoT Hub independently
* When power, space, or other considerations permit only a lightweight edge device to be deployed on-premise

## Connecting behind a firewall using an IoT PnP command
This method allows cameras to connect to Video Analyzer behind a firewall using [IoT’s Plug and Play command interface](../../../iot-develop/overview-iot-plug-and-play.md) and eliminates the need for an edge device. This method requires that a suitable application can be installed and run on cameras to turn them into an IoT device. Currently, this method has only been fully implemented for Axis camera models <!--- TODO: add what models or what firmware the camera must be running --> using the [Video Analyzer ACAP application](). Information for how to connect a compatible device from any manufacturer is [here](connect-devices.md).


## Connecting over the open internet (no firewall) or within an Azure region
This method should only be used for supervised proof-of-concept exercises, where it may be permissible to connect a camera directly to the cloud without a firewall and the camera's RTSP server is accessible over the open internet. Another use case is when an Azure VM is used to simulate a camera, as described in this<TODO: link to cloud CVR tutorial being written by Mayank>


# Next Steps
- Follow [this how-to guide](use-transparent-gateway.md) to connect cameras via a transparent gateway
- Follow [this tutorial]() <!--- TODO: link to ACAP tutorial--> to connect an Axis camera
- Follow [this how-to guide](connect-devices.md) for information on connecting devices from other manufactures


