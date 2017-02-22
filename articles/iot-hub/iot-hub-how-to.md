---
title: Azure IoT Hub How To | Microsoft Docs
description: 'How to use the various IoT Hub features'
services: iot-hub
documentationcenter: ''
author: dominicbetts
manager: timlt
editor: ''

ms.assetid: 24376318-5344-4a81-a1e6-0003ed587d53
ms.service: iot-hub
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/31/2017
ms.author: dobett

---
# How to use Azure IoT Hub

To learn how to use the IoT Hub service, you can choose to read conceptual articles that describe the features of IoT Hub in detail or follow one of the tutorials that show you how to use the various features of IoT Hub.

## Plan

As an architect, before you deploy your IoT solution, you should plan:

- [How to scale your solution][lnk-scale] to meet your anticipated volumes of traffic.
- For [high availability and disaster recovery][lnk-hadr].
- How to [support any additional communications protocols][lnk-protocols] that IoT Hub does not support natively.

## Developer

As a developer, you can read detailed conceptual guidance about IoT Hub in the [Developer Guide][lnk-devguide]. You can also follow any of the in-depth tutorials to learn about IoT Hub features such as [cloud-to-device messaging][lnk-c2d], [device management][lnk-dm], and [direct methods[lnk-methods]. Many of these tutorials enable you to choose between various programming languages.

If you are developing using the Gateway SDK, you can follow one of the Gateway SDK [tutorials][lnk-gateway].

## Manage

As an adminstrator of the IoT Hub service, you can follow any of the in-depth tutorials to learn about tasks such as how to [create][lnk-create] and configure an IoT hub, how to [bulk manage][lnk-bulk] the devices connected to your hub, and how to collect [usage metrics][lnk-metrics] and [monitor][lnk-monitor] your hub.

## Secure

As a security architect, you can start learning about IoT Hub security by reading [Security from the ground up][lnk-security].

## Next steps

To learn more about the IoT Hub service, see the [Developer Guide][lnk-devguide].

[lnk-scale]: ./iot-hub-scaling.md
[lnk-hadr]: ./iot-hub-ha-dr.md
[lnk-protocols]: ./iot-hub-protocol-gateway.md
[lnk-devguide]: ./iot-hub-devguide.md
[lnk-c2d]: ./iot-hub-csharp-csharp-c2d.md
[lnk-dm]: ./iot-hub-node-node-device-management-get-started.md
[lnk-methods]: ./iot-hub-node-node-direct-methods.md
[lnk-gateway]: ./iot-hub-gateway-sdk-physical-device.md
[lnk-create]: ./iot-hub-create-through-portal.md
[lnk-bulk]: ./iot-hub-bulk-identity-mgmt.md
[lnk-metrics]: ./iot-hub-metrics.md
[lnk-monitor]: ./iot-hub-operations-monitoring.md
[lnk-security]: ./iot-hub-security-ground-up.md