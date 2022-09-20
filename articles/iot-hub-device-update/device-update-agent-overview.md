---
title: Understand Device Update for Azure IoT Hub Agent| Microsoft Docs
description: Understand Device Update for Azure IoT Hub Agent.
author: ValOlson
ms.author: valls
ms.date: 2/12/2021
ms.topic: conceptual
ms.service: iot-hub-device-update
---

# Device Update for IoT Hub agent overview

The Device Update agent consists of two conceptual layers:

* The *interface layer* builds on top of [Azure IoT Plug and Play](../iot-develop/overview-iot-plug-and-play.md), allowing for messaging to flow between the Device Update agent and Device Update service.
* The *platform layer* is responsible for the high-level update actions of download, install, and apply that may be platform- or device-specific.

:::image type="content" source="media/understand-device-update/client-agent-reference-implementations.png" alt-text="Agent Implementations." lightbox="media/understand-device-update/client-agent-reference-implementations.png":::

## The interface layer

The interface layer is made up of the [Device Update core interface](https://github.com/Azure/iot-hub-device-update/tree/main/src/agent/adu_core_interface) and the [Device information interface](https://github.com/Azure/iot-hub-device-update/tree/main/src/agent/device_info_interface).

These interfaces rely on a configuration file for the device specific values that need to be reported to the Device Update services. For more information, see [Device Update configuration file](device-update-configuration-file.md).

### Device Update core interface

The *Device Update core interface* is the primary communication channel between the Device Update agent and services. For more information, see [Device Update core interface](device-update-plug-and-play.md#device-update-core-interface).

### Device information interface

The *device information interface* is used to implement the `Azure IoT PnP DeviceInformation` interface. For more information, see [Device information interface](device-update-plug-and-play.md#device-information-interface).

## The platform Layer

The Linux *platform layer* integrates with [Delivery Optimization](https://github.com/microsoft/do-client) for downloads and is used in our Raspberry Pi reference image, and all clients that run on Linux systems.

The Linux platform layer implementation can be found in the `src/platform_layers/linux_platform_layer` and it integrates with the [Delivery Optimization client](https://github.com/microsoft/do-client/releases) for downloads.

This layer can integrate with different update handlers to implement the
installers. For instance, the `SWUpdate` update handler, `Apt` update handler, and `Script` update handler.  

If you choose to implement with your own downloader in place of Delivery Optimization, be sure to review the [requirements for large file downloads](device-update-limits.md).

## Update handlers

Update handlers are used to invoke installers or commands to do an over-the-air update. You can either use [existing update content handlers](https://github.com/Azure/iot-hub-device-update/tree/main/src/content_handlers) or [implement a custom content handler](https://github.com/Azure/iot-hub-device-update/tree/main/docs/agent-reference/how-to-implement-custom-update-handler.md) that can invoke any installer and execute the over-the-air update needed for your use case.

## Updating to latest Device Update agent

We have added many new capabilities to the Device Update agent in the latest public preview refresh agent (version 0.8.0). For more information, see the [list of new capabilities](https://github.com/Azure/iot-hub-device-update/blob/main/docs/agent-reference/whats-new.md).

If you're using the Device Update agent versions 0.6.0 or 0.7.0, please migrate to the latest agent version 0.8.0. For more information, see [Migrate devices and groups to public preview refresh](migration-pp-to-ppr.md).

You can check the installed version of the Device Update agent and the Delivery Optimization agent in the device properties section of your [IoT device twin](../iot-hub/iot-hub-devguide-device-twins.md). For more information, see [device properties of the Device Update core interface](device-update-plug-and-play.md#device-properties).

## Next Steps

[Understand Device Update agent configuration file](device-update-configuration-file.md)

You can use the following tutorials for a simple demonstration of Device Update for IoT Hub:

* [Image Update: Getting Started with Raspberry Pi 3 B+ Reference Yocto Image](device-update-raspberry-pi.md) extensible via open source to build your own images for other architecture as needed.

* [Package Update: Getting Started using Ubuntu Server 18.04 x64 Package agent](device-update-ubuntu-agent.md)

* [Proxy Update: Getting Started using Device Update binary agent for downstream devices](device-update-howto-proxy-updates.md)

* [Getting Started Using Ubuntu (18.04 x64) Simulator Reference Agent](device-update-simulator.md)

* [Device Update for Azure IoT Hub tutorial for Azure-Real-Time-Operating-System](device-update-azure-real-time-operating-system.md)
