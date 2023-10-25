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

[!INCLUDE [iot-hub-sdks-device](../../includes/iot-hub-sdks-device.md)]

## Embedded device SDKs

[!INCLUDE [iot-hub-sdks-embedded](../../includes/iot-hub-sdks-embedded.md)]

## Next Steps
To start using the device SDKs to connect devices to Azure IoT, see the following article that provides a set of quickstarts.
- [Get started with Azure IoT device development](about-getting-started-device-development.md)
