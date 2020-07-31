---
title: 'How to deploy the video analytics - security and safety Azure IoT Central application template'
description: This guide summarizes the steps to deploy an Azure IoT Central application using the video analytics - security and safety application template.
services: iot-central
ms.service: iot-central
ms.subservice: iot-central-retail
ms.topic: how-to
ms.author: nandab
author: KishorIoT
ms.date: 07/31/2020
---
# How to deploy an IoT Central application using the video analytics - security and safety application template

For an overview of the key video analytics - security and safety application components, see [Security and safety video analytics application architecture](architecture-video-analytics.md).

1. Complete the [Create a video analytics - security and safety application in Azure IoT Central](tutorial-video-analytics-create-app.md) tutorial to:
    - Create an Azure Media Services account.
    - Create the IoT Central application from the video analytics - security and safety application template.
    - Configure a gateway device in the IoT Central application. The gateway enables camera devices to connect to the application.

1. Complete the [Create an IoT Edge instance for live video analytics (Linux VM)](tutorial-video-analytics-create-iot-edge-vm.md) tutorial to:
    - Create an Azure VM with the Azure IoT Edge runtime installed.- Prepare the IoT Edge installation to host the live video analytics module.
    - Connect the IoT Edge device to your IoT Central application.

1. Complete the [Monitor and manage a video analytics - security and safety application](tutorial-video-analytics-manage.md) tutorial to:
    - Add object and motion detection cameras to the gateway in your IoT Central application.
    - Start the camera processing.
    - Install a local media player to view captured video in AMS.
    - View captured video that shows detected objects.
    - Tidy up.

## Next steps

Now you have an overview of the steps to deploy and use the video analytics - security and safety application template, see [Create a video analytics - security and safety application in Azure IoT Central](tutorial-video-analytics-create-app.md) to get started.
