---
title: 'Tutorial: How to deploy the video analytics - object and motion detection Azure IoT Central application template'
description: Tutorial - This guide summarizes the steps to deploy an Azure IoT Central application using the video analytics - object and motion detection application template.
services: iot-central
ms.service: iot-central
ms.subservice: iot-central-retail
ms.topic: tutorial
ms.author: nandab
author: KishorIoT
ms.date: 07/31/2020
---
# Tutorial: How to deploy an IoT Central application using the video analytics - object and motion detection application template

For an overview of the key *video analytics - object and motion detection* application components, see [object and motion detection video analytics application architecture](architecture-video-analytics.md).

The following video gives a walkthrough of how to use the _video analytics - object and motion detection application template_ to deploy an IoT Central solution:

> [!VIDEO https://www.youtube.com/embed/Bo3FziU9bSA]

In this set of tutorials, you learn how to:

> [!div class="checklist"]
> * Deploy the application
> * Deploy an IoT Edge instance that connects to the application
> * Monitor and manage the application

## Prerequisites

An Azure subscription is recommended. Alternatively, you can use a free, 7-day trial. If you don't have an Azure subscription, you can create one on the [Azure sign-up page](https://aka.ms/createazuresubscription).

## Deploy the application

Complete the following steps to deploy an IoT Central application using the video analytics application template:

1. Complete either the [Create a video analytics application in Azure IoT Central (YOLO v3)](tutorial-video-analytics-create-app-yolo-v3.md) or the [Create a video analytics in Azure IoT Central (OpenVINO&trade;)](tutorial-video-analytics-create-app-openvino.md) tutorial to:
    - Create an Azure Media Services account.
    - Create the IoT Central application from the video analytics - object and motion detection application template.
    - Configure a gateway device in the IoT Central application. The gateway enables camera devices to connect to the application.

1. Complete either the [Create an IoT Edge instance for video analytics (Linux VM)](tutorial-video-analytics-iot-edge-vm.md) or the [Tutorial: Create an IoT Edge instance for video analytics (Intel NUC)](tutorial-video-analytics-iot-edge-nuc.md) tutorial to:
    - Create an Azure VM with the Azure IoT Edge runtime installed.- Prepare the IoT Edge installation to host the video analytics module.
    - Connect the IoT Edge device to your IoT Central application.

1. Complete the [Monitor and manage a video analytics application](tutorial-video-analytics-manage.md) tutorial to:
    - Add object and motion detection cameras to the gateway in your IoT Central application.
    - Start the camera processing.
    - Install a local media player to view captured video in AMS.
    - View captured video that shows detected objects.
    - Tidy up.

## Clean up resources

When you've finished with the application, you can remove all the resources you created as follows:

1. In the IoT Central application, navigate to the **Your application** page in the **Administration** section. Then select **Delete**.
1. In the Azure portal, delete the **lva-rg** resource group.
1. On your local machine, stop the **amp-viewer** Docker container.

## Next steps

Now you have an overview of the steps to deploy and use the video analytics application template, see

> [!div class="nextstepaction"]
> [Create a video analytics application in Azure IoT Central (YOLO v3)](tutorial-video-analytics-create-app-yolo-v3.md) or

> [!div class="nextstepaction"]
> [Create a video analytics in Azure IoT Central (OpenVINO&trade;)](tutorial-video-analytics-create-app-openvino.md) to get started.