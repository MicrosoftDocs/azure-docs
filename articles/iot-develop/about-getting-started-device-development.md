---
title: Overview of getting started with Azure IoT device development
description: Learn how to get started with Azure IoT device development quickstarts. 
author: timlt
ms.author: timlt
ms.service: iot-develop
ms.topic: overview
ms.date: 03/28/2023
ms.custom: engagement-fy23
---

# Get started with Azure IoT device development

This article shows how to quickly get started with Azure IoT device development. As a prerequisite, see the introductory articles [What is Azure IoT device and application development?](about-iot-develop.md) and [Overview of Azure IoT Device SDKs](about-iot-sdks.md).  These articles summarize key development options, tools, and SDKs available to device developers. 

In this article, you'll select from a set of device quickstarts to get started with hands-on development.

## Quickstarts for general devices
To start using the Azure IoT device SDKs to connect general, unconstrained MPU devices to Azure IoT, see the following articles.  These quickstarts provide simulators and don't require you to have a physical device.

Each quickstart shows how to set up a code sample and tools, run a temperature controller sample, and connect it to Azure. After the device is connected, you perform several common operations. 

|Quickstart|Device SDK|
|-|-|
|[Send telemetry from a device to Azure IoT Hub (C)](quickstart-send-telemetry-iot-hub.md?pivots=programming-language-ansi-c)|[Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c)|
|[Send telemetry from a device to Azure IoT Hub (C#)](quickstart-send-telemetry-iot-hub.md?pivots=programming-language-csharp)|[Azure IoT SDK for .NET](https://github.com/Azure/azure-iot-sdk-csharp)|
|[Send telemetry from a device to Azure IoT Hub (Node.js)](quickstart-send-telemetry-iot-hub.md?pivots=programming-language-nodejs)|[Azure IoT Node.js SDK](https://github.com/Azure/azure-iot-sdk-node)|
|[Send telemetry from a device to Azure IoT Hub (Python)](quickstart-send-telemetry-iot-hub.md?pivots=programming-language-python)|[Azure IoT Python SDK](https://github.com/Azure/azure-iot-sdk-python)|
|[Send telemetry from a device to Azure IoT Hub (Java)](quickstart-send-telemetry-iot-hub.md?pivots=programming-language-java)|[Azure IoT SDK for Java](https://github.com/Azure/azure-iot-sdk-java)|

## Quickstarts for embedded devices
To start using the Azure IoT embedded device SDKs to connect embedded, resource-constrained MCU devices to Azure IoT, see the following articles.  These quickstarts require you to have one of the listed devices. 

Each quickstart shows how to set up a code sample and tools, flash the device, and connect it to Azure. After the device is connected, you perform several common operations. 

|Quickstart|Device|Embedded device SDK|
|-|-|-|
|[Quickstart: Connect a Microchip ATSAME54-XPro Evaluation kit to IoT Hub](quickstart-devkit-microchip-atsame54-xpro-iot-hub.md)|Microchip ATSAME54-XPro|Azure RTOS middleware|
|[Quickstart: Connect an ESPRESSIF ESP32-Azure IoT Kit to IoT Hub](quickstart-devkit-espressif-esp32-freertos-iot-hub.md)|ESPRESSIF ESP32|FreeRTOS middleware|
|[Quickstart: Connect an STMicroelectronics B-L475E-IOT01A Discovery kit to IoT Hub](quickstart-devkit-stm-b-l475e-iot-hub.md)|STMicroelectronics L475E-IOT01A|Azure RTOS middleware|
|[Quickstart: Connect an NXP MIMXRT1060-EVK Evaluation kit to IoT Hub](quickstart-devkit-nxp-mimxrt1060-evk-iot-hub.md)|NXP MIMXRT1060-EVK|Azure RTOS middleware|
|[Connect an MXCHIP AZ3166 devkit to IoT Hub](quickstart-devkit-mxchip-az3166-iot-hub.md)|MXCHIP AZ3166|Azure RTOS middleware|

## Next steps
To learn more about working with the IoT device SDKs and developing for general devices, see the following tutorial.
- [Build a device solution for IoT Hub](set-up-environment.md)

To learn more about working with the IoT C SDK and embedded C SDK for embedded devices, see the following article.
- [C SDK and Embedded C SDK usage scenarios](concepts-using-c-sdk-and-embedded-c-sdk.md)