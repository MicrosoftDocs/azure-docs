---
title: Understand Device Update for Azure IoT Hub Agent
description: Understand Device Update for Azure IoT Hub Agent.
author: eshashah-msft
ms.author: eshashah
ms.date: 9/12/2022
ms.topic: concept-article
ms.service: iot-hub-device-update
---

# Device Update for IoT Hub agent overview

The Device Update agent consists of two conceptual layers:

* The *interface layer* builds on top of [Azure IoT Plug and Play](../iot-develop/overview-iot-plug-and-play.md), allowing for messaging to flow between the Device Update agent and Device Update service.
* The *platform layer* is responsible for the high-level update actions of download, install, and apply that may be platform- or device-specific.

:::image type="content" source="media/understand-device-update/client-agent-reference-implementations.png" alt-text="Agent Implementations." lightbox="media/understand-device-update/client-agent-reference-implementations.png":::

## The interface layer

The interface layer is made up of the [Device Update core interface](https://github.com/Azure/iot-hub-device-update/tree/main/src/agent/adu_core_interface), [Device information interface](https://github.com/Azure/iot-hub-device-update/tree/main/src/agent/device_info_interface) and [Diagnostic information interface](https://github.com/Azure/iot-hub-device-update/tree/main/src/diagnostics_component/diagnostics_interface).

These interfaces rely on a configuration file for the device specific values that need to be reported to the Device Update services. For more information, see [Device Update configuration file](device-update-configuration-file.md).

### Device Update core interface

The *Device Update interface* is the primary communication channel between the Device Update agent and services. For more information, see [Device Update core interface](https://github.com/Azure/iot-plugandplay-models/blob/main/dtmi/azure/iot/deviceupdate-1.json).

### Device information interface

The *device information interface* is used to implement the `Azure IoT PnP DeviceInformation` interface. For more information, see [Device information interface](https://github.com/Azure/iot-plugandplay-models/blob/main/dtmi/azure/devicemanagement/deviceinformation-1.json).

### Diagnostic information interface

The *diagnostic information interface* is used to enable [remote log collection](device-update-diagnostics.md#remote-log-collection) for diagnostics. For more information, see [Device information interface](https://github.com/Azure/iot-plugandplay-models/blob/main/dtmi/azure/devicemanagement/deviceinformation-1.json).

## The platform Layer

The Linux *platform layer* integrates with [Delivery Optimization](https://github.com/microsoft/do-client) for downloads and is used in our Raspberry Pi reference image, and all clients that run on Linux systems.

The Linux platform layer implementation can be found in the `src/platform_layers/linux_platform_layer` and it integrates with the [Delivery Optimization client](https://github.com/microsoft/do-client/releases) for downloads.

This layer can integrate with different update handlers to implement the
installers. For instance, the `SWUpdate` update handler, `Apt` update handler, and `Script` update handler.  

If you choose to implement with your own downloader in place of Delivery Optimization, be sure to review the [requirements for large file downloads](device-update-limits.md).

## Update handlers

Update handlers are used to invoke installers or commands to do an over-the-air update. You can either use [existing update content handlers](https://github.com/Azure/iot-hub-device-update/blob/main/src/extensions/inc/aduc/content_handler.hpp) or [implement a custom content handler](https://github.com/Azure/iot-hub-device-update/tree/main/docs/agent-reference/how-to-implement-custom-update-handler.md) that can invoke any installer and execute the over-the-air update needed for your use case.

## Changes to Device Update agent at GA release

If you are using the Device Update agent versions, please migrate to the latest agent version 1.0.0 which is the GA version. See [GA agent for changes and how to upgrade](migration-public-preview-refresh-to-ga.md)

You can check installed version of the Device Update agent and the Delivery Optimization agent in the Device Properties section of your [IoT device twin](../iot-hub/iot-hub-devguide-device-twins.md). [Learn more about device properties under ADU Core Interface](device-update-plug-and-play.md#device-properties).

## Next Steps

[Understand Device Update agent configuration file](device-update-configuration-file.md)

You can use the following tutorials for a simple demonstration of Device Update for IoT Hub:

* [Image Update: Getting Started with Raspberry Pi 3 B+ Reference Yocto Image](device-update-raspberry-pi.md) extensible via open source to build your own images for other architecture as needed.

* [Package Update: Getting Started using Ubuntu Server 18.04 x64 Package agent](device-update-ubuntu-agent.md)

* [Proxy Update: Getting Started using Device Update binary agent for downstream devices](device-update-howto-proxy-updates.md)

* [Getting Started Using Ubuntu (18.04 x64) Simulator Reference Agent](device-update-simulator.md)

* [Device Update for Azure IoT Hub tutorial for Azure-Real-Time-Operating-System](device-update-azure-real-time-operating-system.md)
