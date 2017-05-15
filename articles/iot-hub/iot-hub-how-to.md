---
title: Azure IoT Hub How To | Microsoft Docs
description: 'As a developer, how do I use the various IoT Hub features?'
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
ms.date: 05/02/2017
ms.author: dobett

---
# How to use Azure IoT Hub

You have various options to learn how to develop for the IoT Hub service. You can read the conceptual articles that describe the features of IoT Hub in detail or follow one of the tutorials that cover the various features of IoT Hub.

## The developer guide

As a developer, you can read detailed conceptual guidance about IoT Hub in the [Developer Guide][lnk-devguide]. This guide includes detailed descriptions of all IoT Hub features that help you to learn how to use them and how to choose between them when multiple options are available


## The tutorials

If you prefer to learn about specific IoT Hub features by working through hands-on exercises, there are several tutorials to choose from. Many of these tutorials are available in multiple programming languages. These tutorials include:

- [Process IoT Hub device-to-cloud messages using routes][lnk-routes-tutorial]. This tutorial shows you how to use IoT Hub routing rules to dispatch device-to-cloud messages in an easy, configuration-based way.

- [Send cloud-to-device messages with IoT Hub][lnk-c2d-tutorial]. This tutorial shows you how to send cloud-to-device messages through IoT Hub and receive cloud-to-device messages on a device.

- [Upload files from devices to the cloud with IoT Hub][lnk-upload-tutorial]. This tutorial shows you how to use the file upload capabilities of IoT Hub.

- [Get started with device twins][lnk-twin-tutorial]. This tutorial introduces you to device twins, reported properties, desired properties, and tags. You use device twins to synchronize values with your devices.

- [Use direct methods][lnk-methods-tutorial]. This tutorial shows you how to use direct methods. You add a handler for a direct method in your simulated device and invoke the direct method from IoT Hub.

- [Get started with device management][lnk-dm-tutorial]. This tutorial shows you how to use key device management features such as twins and direct methods to remotely reboot your simulated device.

- [Use desired properties to configure devices][lnk-properties-tutorial]. This tutorial shows you how to use the device twin's desired properties along with reported properties, to remotely configure your device.

- [Use device jobs to initiate a device firmware update][lnk-jobs-tutorial]. This tutorial shows you how to use key device management features such as twins and direct methods to remotely update your device's firmware.

- [Schedule and broadcast jobs][lnk-schedule-tutorial]. This tutorial shows you how to use desired properties and direct methods to interact with multiple devices at a scheduled time.

## Next steps

To learn more about the IoT Hub service, see the [Developer Guide][lnk-devguide].

[lnk-devguide]: ./iot-hub-devguide.md
[lnk-routes-tutorial]: ./iot-hub-csharp-csharp-process-d2c.md
[lnk-c2d-tutorial]: ./iot-hub-csharp-csharp-c2d.md
[lnk-upload-tutorial]: ./iot-hub-csharp-csharp-file-upload.md
[lnk-twin-tutorial]: ./iot-hub-node-node-twin-getstarted.md
[lnk-methods-tutorial]: ./iot-hub-node-node-direct-methods.md
[lnk-dm-tutorial]: ./iot-hub-node-node-device-management-get-started.md
[lnk-properties-tutorial]: ./iot-hub-node-node-twin-how-to-configure.md
[lnk-jobs-tutorial]: ./iot-hub-node-node-firmware-update.md
[lnk-schedule-tutorial]: ./iot-hub-node-node-schedule-jobs.md