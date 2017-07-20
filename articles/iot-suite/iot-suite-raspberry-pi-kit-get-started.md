---
title: Connect a Raspberry Pi to Azure IoT Suite | Microsoft Docs
description: Tutorials using Node.js or C to help you learn how to use the Microsoft Azure IoT Starter Kit for the Raspberry Pi 3 and the IoT Suite remote monitoring solution. You can chose a tutorial that simulates telemetry, or that uses real sensors, or that enables remote firmware updates.
services: ''
suite: iot-suite
documentationcenter: ''
author: dominicbetts
manager: timlt
editor: ''

ms.service: iot-suite
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/26/2017
ms.author: dobett

---
# Connect your Microsoft Azure IoT Raspberry Pi 3 Starter Kit to the remote monitoring solution

The tutorials in this section help you learn how to connect a Raspberry Pi 3 device to the remote monitoring solution. Choose the tutorial appropriate to your preferred programming language and the whether you have the sensor hardware available to use with your Raspberry Pi.

## The tutorials

| Tutorial | Notes | Languages |
| -------- | ----- | --------- |
| Simulated telemetry (Basic)| Simulates sensor data. Uses a standalone Raspberry Pi. | [C][lnk-c-simulator], [Node.js][lnk-node-simulator] |
| Real sensor (Intermediate) | Uses data from a BME280 sensor connected to your Raspberry Pi. | [C][lnk-c-basic], [Node.js][lnk-node-basic] |
| Implement firmware update (Advanced)| Uses data from a BME280 sensor connected to your Raspberry Pi. Enables remote firmware updates on your Raspberry Pi. | [C][lnk-c-advanced], [Node.js][lnk-node-advanced] |

## Next steps

Visit the [Azure IoT Dev Center](https://azure.microsoft.com/develop/iot/) for more samples and documentation on Azure IoT.

[lnk-node-simulator]: iot-suite-raspberry-pi-kit-node-get-started-simulator.md
[lnk-node-basic]: iot-suite-raspberry-pi-kit-node-get-started-basic.md
[lnk-node-advanced]: iot-suite-raspberry-pi-kit-node-get-started-advanced.md
[lnk-c-simulator]: iot-suite-raspberry-pi-kit-c-get-started-simulator.md
[lnk-c-basic]: iot-suite-raspberry-pi-kit-c-get-started-basic.md
[lnk-c-advanced]: iot-suite-raspberry-pi-kit-c-get-started-advanced.md