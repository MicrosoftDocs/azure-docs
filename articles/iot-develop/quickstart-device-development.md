---
title: Azure IoT embedded device development quickstart
description: A quickstart guide that shows how to do embedded device development using Azure RTOS and Azure IoT.
author: timlt
ms.author: timlt
ms.service: iot-develop
ms.topic: overview
ms.date: 01/19/2021
---

# Getting started with Azure IoT embedded device development
This getting started guide is a set of quickstarts that shows embedded device developers how to start working with Microsoft Azure RTOS. Each quickstart in the series follows the same pattern in which you take a device, flash the device with Azure RTOS sample code and configuration settings, and connect the device to Azure IoT.

In each quickstart, you complete the same basic tasks regardless which device you're using:
* Install a set of embedded development tools for programming a specific device in C
* Build an image that includes Azure RTOS components and samples, and flash a device
* Use the Azure IoT Central application portal to securely connect a device to Azure IoT
* View device telemetry, view properties, and invoke cloud-to-device methods

## Quickstarts
The following tutorials are included in the getting started guide:

|Quickstart|Device|
|---------------|-----|
|[Getting started with the STMicroelectronics B-L475E-IOT01 Discovery kit](https://go.microsoft.com/fwlink/p/?linkid=2129536) |[STMicroelectronics B-L475E-IOT01](https://www.st.com/content/st_com/en/products/evaluation-tools/product-evaluation-tools/mcu-mpu-eval-tools/stm32-mcu-mpu-eval-tools/stm32-discovery-kits/b-l475e-iot01a.html)|
|[Getting started with the NXP MIMXRT1060-EVK Evaluation kit](https://go.microsoft.com/fwlink/p/?linkid=2129821) |[NXP MIMXRT1060-EVK](https://www.nxp.com/design/development-boards/i-mx-evaluation-and-development-boards/mimxrt1060-evk-i-mx-rt1060-evaluation-kit:MIMXRT1060-EVK)|
|[Getting started with the Microchip ATSAME54-XPRO Evaluation kit](https://go.microsoft.com/fwlink/p/?linkid=2129537) |[Microchip ATSAME54-XPRO](https://www.microchip.com/developmenttools/productdetails/atsame54-xpro)|
|[Getting started with the MXChip AZ3166 IoT DevKit](https://github.com/azure-rtos/getting-started/tree/master/MXChip/AZ3166) |[MXChip AZ3166 IoT DevKit](https://microsoft.github.io/azure-iot-developer-kit/)|

## Azure RTOS components
Each quickstart in the guide includes a step to build an image. The build process installs a common set of Azure RTOS components, sample code, and device-specific information.

The build script adds the following Azure RTOS components to the image for each device:

|Component|Description|
|---------------|-----|
|[Azure ThreadX](threadx/overview-threadx.md) | Provides the core real-time operating system components for devices |
|[Azure NetX Duo](netx-duo/overview-netx-duo.md) | Provides a full TCP/IP IPv4 and IPv6 network stack, and networking support integrated with ThreadX |