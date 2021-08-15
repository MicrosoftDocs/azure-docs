---
title: Tutorial - Azure IoT video analytics - object and motion detection | Microsoft Docs
description:  This tutorial shows you how to deploy and use the video analytics - object and motion detection application template for IoT Central.
services: iot-central
ms.service: iot-central
ms.subservice: iot-central-retail
ms.topic: tutorial
ms.author: nandab
author: KishorIoT
ms.date: 07/31/2020
---
# Tutorial: Deploy and walk through the video analytics - object and motion detection application template

For an overview of the key *video analytics - object and motion detection* application The **Video analytics - object and motion detection** application template lets you build IoT solutions include live video analytics capabilities.

:::image type="content" source="media/architecture-video-analytics/architecture.png" alt-text="Diagram of Video analytics object and motion detection components overview.":::

The key components of the video analytics solution include:

### Live video analytics (LVA)

LVA provides a platform for you to build intelligent video applications that span the edge and the cloud. The platform lets you build intelligent video applications that span the edge and the cloud. The platform offers the capability to capture, record, analyze live video, and publish the results, which could be video or video analytics, to Azure services. The Azure services could be running in the cloud or the edge. The platform can be used to enhance IoT solutions with video analytics.

For more information, see [Live Video Analytics](https://github.com/Azure/live-video-analytics) on GitHub.

### IoT Edge LVA gateway module

The IoT Edge LVA gateway module instantiates cameras as new devices and connects them directly to IoT Central using the IoT device client SDK.

In this reference implementation, devices connect to the solution using symmetric keys from the edge. For more information about device connectivity, see [Get connected to Azure IoT Central](../core/concepts-get-connected.md)

### Media graph

Media graph lets you define where to capture the media from, how to process it, and where to deliver the results. You configure media graph by connecting components, or nodes, in the desired manner. For more information, see [Media Graph](https://github.com/Azure/live-video-analytics/tree/master/MediaGraph) on GitHub.

The following video gives a walkthrough of how to use the _video analytics - object and motion detection application template_ to deploy an IoT Central solution:

> [!VIDEO https://www.youtube.com/embed/Bo3FziU9bSA]

In this set of tutorials, you learn how to:

> [!div class="checklist"]
> * Deploy the application
> * Deploy an IoT Edge instance that connects to the application
> * Monitor and manage the application

## Prerequisites

* There are no specific prerequisites required to deploy this app.
* You can use the free pricing plan or use an Azure subscription.

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