---
title: Azure IoT Central video analytics object and motion detection | Microsoft Docs
description: Learn to build an IoT Central application using the video analytics - object and motion detection application template in IoT Central. This template uses live video analytics and connected cameras.
author: KishorIoT
ms.author: nandab
ms.date: 07/27/2020
ms.topic: conceptual
ms.service: iot-central
ms.subservice: iot-central-retail
services: iot-central
---

# Video analytics - object and motion detection application architecture

The **Video analytics - object and motion detection** application template lets you build IoT solutions include live video analytics capabilities.

:::image type="content" source="media/architecture-video-analytics/architecture.png" alt-text="Architecture":::

The key components of the video analytics solution include:

## Live video analytics (LVA)

LVA provides a platform for you to build intelligent video applications that span the edge and the cloud. The platform lets you build intelligent video applications that span the edge and the cloud. The platform offers the capability to capture, record, analyze live video, and publish the results, which could be video or video analytics, to Azure services. The Azure services could be running in the cloud or the edge. The platform can be used to enhance IoT solutions with video analytics.

For more information, see [Live Video Analytics](https://github.com/Azure/live-video-analytics) on GitHub.

## IoT Edge LVA gateway module

The IoT Edge LVA gateway module instantiates cameras as new devices and connects them directly to IoT Central using the IoT device client SDK.

In this reference implementation, devices connect to the solution using symmetric keys from the edge. For more information about device connectivity, see [Get connected to Azure IoT Central](../core/concepts-get-connected.md)

## Media graph

Media graph lets you define where to capture the media from, how to process it, and where to deliver the results. You configure media graph by connecting components, or nodes, in the desired manner. For more information, see [Media Graph](https://github.com/Azure/live-video-analytics/tree/master/MediaGraph) on GitHub.

## Next steps

The suggested next step is to learn how to [Create a video analytics application in Azure IoT Central](tutorial-video-analytics-create-app.md).
