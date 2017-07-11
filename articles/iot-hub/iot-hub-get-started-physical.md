---
title: 'Get started connecting physical devices to Azure IoT Hub | Microsoft Docs'
description: 'Learn how to connect physical devices and boards to Azure IoT Hub. Your devices can send telemetry to IoT Hub and IoT Hub can monitor and manage your devices.'
services: iot-hub
documentationcenter: ''
author: dominicbetts
manager: timlt
editor: ''
keywords: 'azure iot hub tutorial'

ms.service: iot-hub
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/02/2017
ms.author: dobett

---
# Azure IoT Hub get started with physical devices tutorials

These tutorials introduce you to Azure IoT Hub and the device SDKs. The tutorials cover common IoT scenarios to demonstrate the capabilities of IoT Hub. The tutorials also illustrate how to combine IoT Hub with other Azure services and tools to build more powerful IoT solutions. The tutorials listed in the following table show you how to create physical IoT devices.

| IoT device                       | Programming language |
|---------------------------------|----------------------|
| Raspberry Pi                    | [Node.js][Pi_Nd], [C][Pi_C]           |
| Intel Edison                    | [Node.js][Ed_Nd], [C][Ed_C]           |
| Adafruit Feather HUZZAH ESP8266 | [Arduino][Hu_Ard]              |
| Sparkfun ESP8266 Thing Dev      | [Arduino][Th_Ard]              |
| Adafruit Feather M0             | [Arduino][M0_Ard]              |

In addition, you can use an IoT Edge gateway to enable devices to connect to your IoT hub.

| Gateway device               | Programming language | Platform         |
|------------------------------|----------------------|------------------|
| Intel NUC (model DE3815TYKE) | C                    | [Wind River Linux][NUC_Lnx] |

[!INCLUDE [iot-hub-get-started-extended](../../includes/iot-hub-get-started-extended.md)]


[Pi_Nd]: iot-hub-raspberry-pi-kit-node-get-started.md
[Pi_C]: iot-hub-raspberry-pi-kit-c-get-started.md
[Ed_Nd]: iot-hub-intel-edison-kit-node-get-started.md
[Ed_C]: iot-hub-intel-edison-kit-c-get-started.md
[Hu_Ard]: iot-hub-arduino-huzzah-esp8266-get-started.md
[Th_Ard]: iot-hub-sparkfun-esp8266-thing-dev-get-started.md
[M0_Ard]: iot-hub-adafruit-feather-m0-wifi-kit-arduino-get-started.md
[NUC_Lnx]: iot-hub-gateway-kit-c-lesson1-set-up-nuc.md
