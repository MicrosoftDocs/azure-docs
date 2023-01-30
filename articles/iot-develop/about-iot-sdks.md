---
title: Overview of Azure IoT device SDK options
description: Learn which Azure IoT device SDK to use based on your development role and tasks.
author: timlt
ms.author: timlt
ms.service: iot-develop
ms.topic: overview
ms.date: 12/15/2022
---

# Overview of Azure IoT Device SDKs

The Azure IoT device SDKs include a set of device client libraries, samples, and documentation. The device SDKs simplify the process of programmatically connecting devices to Azure IoT. The SDKs are available in various programming languages with support for multiple RTOSs for embedded devices.

## Which SDK should I use?

The main consideration in choosing an SDK is the device's own hardware. General computing devices like PCs and mobile phones, contain microprocessor units (MPUs) and have relatively greater compute and memory resources. A specialized class of devices, which are used as sensors or other special-purpose roles, contain microcontroller units (MCUs) and have relatively limited compute and memory resources. These resource-constrained devices require specialized development tools and SDKs. The following table summarizes the different classes of devices, and which SDKs to use for device development.

|Device class|Description|Examples|SDKs|
|-|-|-|-|
|[Device SDKs](#device-sdks)|General-use devices|Includes general purpose MPU-based devices with larger compute and memory resources|PC, smartphone, Raspberry Pi|
|[Embedded device SDKs](#embedded-device-sdks)|Embedded devices|Special-purpose MCU-based devices with compute and memory limitations|Sensors|

> [!Note] 
> For more information on different device categories so you can choose the best SDK for your device, see [Azure IoT Device Types](concepts-iot-device-types.md).

## Device SDKs

These SDKs can run on a general MPU-based computing device such as a PC, tablet, smartphone, or Raspberry Pi. The SDKs support development in C and in modern managed languages including in C#, Node.JS, Python, and Java.

The SDKs are available in **multiple languages** providing the flexibility to choose which best suits your team and scenario.

| Language | Package | Source | Quickstarts | Samples | Reference |
| :-- | :-- | :-- | :-- | :-- | :-- |
| **.NET** | [NuGet](https://www.nuget.org/packages/Microsoft.Azure.Devices.Client) | [GitHub](https://github.com/Azure/azure-iot-sdk-csharp) | [IoT Hub](quickstart-send-telemetry-iot-hub.md?pivots=programming-language-csharp) / [IoT Central](quickstart-send-telemetry-central.md?pivots=programming-language-csharp) | [Samples](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/iothub/device/samples) | [Reference](/dotnet/api/microsoft.azure.devices.client) |
| **Python** | [pip](https://pypi.org/project/azure-iot-device/) | [GitHub](https://github.com/Azure/azure-iot-sdk-python) | [IoT Hub](quickstart-send-telemetry-iot-hub.md?pivots=programming-language-python) / [IoT Central](quickstart-send-telemetry-central.md?pivots=programming-language-python) | [Samples](https://github.com/Azure/azure-iot-sdk-python/tree/main/samples) | [Reference](/python/api/azure-iot-device) |
| **Node.js** | [npm](https://www.npmjs.com/package/azure-iot-device) | [GitHub](https://github.com/Azure/azure-iot-sdk-node) | [IoT Hub](quickstart-send-telemetry-iot-hub.md?pivots=programming-language-nodejs) / [IoT Central](quickstart-send-telemetry-central.md?pivots=programming-language-nodejs) | [Samples](https://github.com/Azure/azure-iot-sdk-node/tree/main/device/samples) | [Reference](/javascript/api/azure-iot-device/) |
| **Java** | [Maven](https://mvnrepository.com/artifact/com.microsoft.azure.sdk.iot/iot-device-client) | [GitHub](https://github.com/Azure/azure-iot-sdk-java) | [IoT Hub](quickstart-send-telemetry-iot-hub.md?pivots=programming-language-java) / [IoT Central](quickstart-send-telemetry-central.md?pivots=programming-language-java) | [Samples](https://github.com/Azure/azure-iot-sdk-java/tree/master/device/iot-device-samples) | [Reference](/java/api/com.microsoft.azure.sdk.iot.device) |
| **C** | [packages](https://github.com/Azure/azure-iot-sdk-c/blob/master/readme.md#getting-the-sdk) | [GitHub](https://github.com/Azure/azure-iot-sdk-c) | [IoT Hub](quickstart-send-telemetry-iot-hub.md?pivots=programming-language-ansi-c) / [IoT Central](quickstart-send-telemetry-central.md?pivots=programming-language-ansi-c) | [Samples](https://github.com/Azure/azure-iot-sdk-c/tree/master/iothub_client/samples) | [Reference](https://github.com/Azure/azure-iot-sdk-c/) |

> [!WARNING]
> The **Azure IoT C SDK** is **not** suitable for embedded applications due to its memory management and threading model. For embedded device SDK options, refer to the [Embedded device SDKs](#embedded-device-sdks).

## Embedded device SDKs

These SDKs were designed and created to run on devices with limited compute and memory resources and are implemented using the C language.

The embedded device SDKs are available for **multiple operating systems** providing the flexibility to choose which best suits your scenario.

| RTOS | SDK | Source | Samples | Reference |
| :-- | :-- | :-- | :-- | :-- | 
| **Azure RTOS** | Azure RTOS Middleware | [GitHub](https://github.com/azure-rtos/netxduo) | [Quickstarts](quickstart-devkit-mxchip-az3166.md) | [Reference](https://github.com/azure-rtos/netxduo/tree/master/addons/azure_iot) | 
| **FreeRTOS** | FreeRTOS Middleware | [GitHub](https://github.com/Azure/azure-iot-middleware-freertos) | [Samples](https://github.com/Azure-Samples/iot-middleware-freertos-samples) | [Reference](https://azure.github.io/azure-iot-middleware-freertos) |
| **Bare Metal** | Azure SDK for Embedded C | [GitHub](https://github.com/Azure/azure-sdk-for-c/tree/master/sdk/docs/iot) | [Samples](https://github.com/Azure/azure-sdk-for-c/blob/master/sdk/samples/iot/README.md) | [Reference](https://azure.github.io/azure-sdk-for-c) |

## Next Steps
To start using the device SDKs to connect devices to Azure IoT, see the following article that provides a set of quickstarts.
- [Get started with Azure IoT device development](about-getting-started-device-development.md)
