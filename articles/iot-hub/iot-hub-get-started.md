---
title: 'Azure IoT Hub - get started connecting IoT devices to the cloud | Microsoft Docs'
description: 'Learn how to connect your IoT boards and starter kits to Azure IoT Hub. Your devices can send telemetry to IoT Hub and IoT Hub can monitor and manage your devices.'
services: iot-hub
documentationcenter: ''
author: dominicbetts
manager: timlt
editor: ''
keywords: 'azure iot hub tutorial'

ms.assetid: 24376318-5344-4a81-a1e6-0003ed587d53
ms.service: iot-hub
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/29/2018
ms.author: dobett

---
# Azure IoT Hub get started with real devices

You can use Azure IoT Hub and the Azure IoT device SDKs to build Internet of Things (IoT) solutions:

* Azure IoT Hub is a fully managed service in the cloud that securely connects, monitors, and manages your IoT devices. Use the Azure IoT Device SDKs to implement your IoT devices.
* Use an IoT gateway in more complex IoT scenarios. For example, where you need to consider factors such as legacy devices, bandwidth costs, security and privacy policies, or edge data processing. In these scenarios, use [Azure IoT Edge](https://docs.microsoft.com/azure/iot-edge/) to implement a gateway that connects devices to your IoT hub.

## What the How-to articles cover

These articles introduce you to Azure IoT Hub and the device SDKs. The articles cover common IoT scenarios to demonstrate the capabilities of IoT Hub. The articles also illustrate how to combine IoT Hub with other Azure services and tools to build more powerful IoT solutions. In the articles, you use real IoT devices.

## Set up your device

Connect an IoT device or gateway to Azure IoT Hub:

| IoT device                       | Programming language |
|----------------------------------|----------------------|
| Raspberry Pi                     | [Python][Pi_Py], [Node.js][Pi_Nd], [C][Pi_C]  |
| IoT DevKit                       | [Arduino in VSCode][DevKit]     |
| Intel Edison                     | [Node.js][Ed_Nd], [C][Ed_C]    |
| Adafruit Feather HUZZAH ESP8266  | [Arduino][Hu_Ard]              |
| Sparkfun ESP8266 Thing Dev       | [Arduino][Th_Ard]              |
| Adafruit Feather M0              | [Arduino][M0_Ard]              |
| Online device simulator         | [Raspberry Pi (Node.js)][Ol_Sim] |

[!INCLUDE [iot-hub-get-started-extended](../../includes/iot-hub-get-started-extended.md)]

[Pi_Nd]: iot-hub-raspberry-pi-kit-node-get-started.md
[Pi_C]: iot-hub-raspberry-pi-kit-c-get-started.md
[Pi_Py]: iot-hub-raspberry-pi-kit-python-get-started.md
[DevKit]: iot-hub-arduino-iot-devkit-az3166-get-started.md
[Ed_Nd]: iot-hub-intel-edison-kit-node-get-started.md
[Ed_C]: iot-hub-intel-edison-kit-c-get-started.md
[Hu_Ard]: iot-hub-arduino-huzzah-esp8266-get-started.md
[Th_Ard]: iot-hub-sparkfun-esp8266-thing-dev-get-started.md
[M0_Ard]: iot-hub-adafruit-feather-m0-wifi-kit-arduino-get-started.md
[Ol_Sim]: iot-hub-raspberry-pi-web-simulator-get-started.md
