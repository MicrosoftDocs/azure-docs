---
title: Azure IoT Hub get started | Microsoft Docs
description: 'How to get started with the IoT Hub service'
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
# Get started with Azure IoT Hub or Azure IoT Gateway SDK

You can choose one of several tutorials to get started with the IoT Hub service or the Gateway SDK.

## IoT Hub

Azure IoT Hub is a fully managed service that enables reliable and secure bi-directional communications between millions of Internet of Things (IoT) devices and a solution back end.

To get started with the IoT Hub service, you can:

- Follow a tutorial that uses a simulated device running on your development machine. Choose a get started tutorial that uses your preferred programming language: [.NET][lnk-dotnet], [Java][lnk-java], or [Node.js][lnk-nodejs].

- Follow a tutorial that uses a physical device. Choose a get started tutorial that uses your preferred hardware platform: [Raspberry Pi][lnk-rasp-pi], [Intel Edison][lnk-edison], or [Arduino][lnk-arduino]. These tutorials include information about how you can obtain the hardware devices.

- Read about using the C language to develop IoT devices, in the [Introduction to the Azure IoT device SDK for C][lnk-c-intro] article.

## Gateway SDK

You can use the Gateway SDK to build a custom field gateway. A gateway performs tasks such as running analytics, making time-sensitive decisions to reduce latency, providing device management services, enforcing security and privacy constraints, and performing protocol translation.

To get started with the Gateway SDK, you can:

- Follow a tutorial that uses a simulated gateway running on your development machine. You can choose a get started tutorial for either [Linux][lnk-linux] or [Windows][lnk-windows].

- Follow a tutorial that uses a physical device. You can choose a get started tutorial that uses a [simulated device with an Intel NUC (Next Unit of Computing)][lnk-gateway-sim] or uses a [SensorTag device with an Intel NUC][lnk-gateway-tag].

## Next steps

When you are finished with the get started tutorials, you can explore more features of IoT Hub and the Gateway SDK in the [Developer Guide][lnk-devguide] and [How To][lnk-howto] tutorials.

[lnk-dotnet]: ./iot-hub-csharp-csharp-getstarted.md
[lnk-java]: ./iot-hub-java-java-getstarted.md
[lnk-nodejs]: ./iot-hub-node-node-getstarted.md
[lnk-c-intro]: ./iot-hub-device-sdk-c-intro.md
[lnk-rasp-pi]: ./iot-hub-raspberry-pi-kit-node-get-started.md
[lnk-edison]: ./iot-hub-intel-edison-kit-node-get-started.md
[lnk-arduino]: ./iot-hub-adafruit-feather-m0-wifi-kit-arduino-get-started.md
[lnk-linux]: ./iot-hub-linux-gateway-sdk-get-started.md
[lnk-windows]: ./iot-hub-windows-gateway-sdk-get-started.md
[lnk-gateway-sim]: ./iot-hub-gateway-kit-c-sim-get-started.md
[lnk-gateway-tag]: ./iot-hub-gateway-kit-c-get-started.md
[lnk-devguide]: ./iot-hub-devguide.md
[lnk-howto]: ./iot-hub-how-to.md
