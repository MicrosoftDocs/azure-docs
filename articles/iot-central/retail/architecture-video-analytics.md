---
title: Azure IoT Central video analytics security and safety | Microsoft Docs
description: Learn to build an IoT Central application using the video analytics - security and safety application template in IoT Central. This template uses live video analytics and connected cameras.
author: KishorIoT
ms.author: nandab
ms.date: 06/20/2020
ms.topic: conceptual
ms.service: iot-central
ms.subservice: iot-central-retail
services: iot-central
---

# Video analytics - security and safety application architecture

The **Video analytics - security and safety** application template lets you build solutions that...

:::image type="content" source="media/architecture-video-analytics/architecture.png" alt-text="Architecture":::

The key components of the video analytics - security and safety solution include:

## Live video analytics (LVA)

LVA provides a platform for you to build intelligent video applications that span the edge and the cloud. The platform lets you build intelligent video applications that span the edge and the cloud. The platform offers the capability to capture, record, analyze live video, and publish the results, which could be video or video analytics, to Azure services. The Azure services could be running in the cloud or the edge. The platform can be used to enhance IoT solutions with video analytics.

For more information, see [Live Video Analytics](https://github.com/Azure/live-video-analytics) on GitHub.

## IoT Edge LVA gateway module

The IoT Edge LVA gateway module instantiates cameras as new devices and connects them directly to IoT Central using the Device Client SDK.

In this reference implementation, devices connect to the solution using symmetric keys from the edge. For more information about device device connectivity, see [Get connected to Azure IoT Central](../core/concepts-get-connected.md)

## Media graph

Media graph lets you define where media should be captured from, how it should be processed, and where the results should be delivered. You configure media graph by connecting components, or nodes, in the desired manner. For more information, see [Media Graph](https://github.com/Azure/live-video-analytics/tree/master/MediaGraph) on GitHub.

## Next steps

The suggested next step is to learn how to [Create a video analytics - security and safety application in Azure IoT Central](tutorial-video-analytics-create-app.md).
