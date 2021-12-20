---
title: Understand Device Update for Azure IoT Hub Agent| Microsoft Docs
description: Understand Device Update for Azure IoT Hub Agent.
author: ValOlson
ms.author: valls
ms.date: 2/12/2021
ms.topic: conceptual
ms.service: iot-hub-device-update
---

# Device Update for IoT Hub Agent Overview

The Device Update Agent consists of two conceptual layers:

* The Interface Layer builds on top of [Azure IoT Plug and Play](../iot-develop/overview-iot-plug-and-play.md)
allowing for messaging to flow between the Device Update Agent and Device Update Services.
* The Platform Layer is responsible for the high-level update actions of Download, Install, and Apply that may be platform, or device specific.

:::image type="content" source="media/understand-device-update/client-agent-reference-implementations.png" alt-text="Agent Implementations." lightbox="media/understand-device-update/client-agent-reference-implementations.png":::

## The Interface Layer

The Interface layer is made up of the [ADU Core Interface](https://github.com/Azure/iot-hub-device-update/tree/main/src/agent/adu_core_interface) and the [Device Information Interface](https://github.com/Azure/iot-hub-device-update/tree/main/src/agent/device_info_interface).

These interfaces rely on a configuration file for the device specific values that need to be reported to the Device Update services. [Learn More](device-update-configuration-file.md) about the configuration file.

### ADU Core Interface

The 'ADU Core' interface is the primary communication channel between Device Update Agent and Services. [Learn More](device-update-plug-and-play.md#adu-core-interface) about this interface.

### Device Information Interface

The Device Information Interface is used to implement the `Azure IoT PnP DeviceInformation` interface. [Learn More](device-update-plug-and-play.md#device-information-interface) about this interface.

## The Platform Layer

The Linux Platform Layer integrates with [Delivery Optimization](https://github.com/microsoft/do-client) for
downloads and is used in our Raspberry Pi reference image, and all clients that run on Linux systems.

### Linux Platform Layer

The Linux Platform Layer implementation can be found in the
`src/platform_layers/linux_platform_layer` and it integrates with the [Delivery Optimization Client](https://github.com/microsoft/do-client/releases) for downloads.

This layer can integrate with different Update Handlers to implement the
installers. For instance, the `SWUpdate` update handler, 'Apt' update handler, and 'Script' update handler.

## Update Handlers

Update Handlers are components that handle content or installer-specific parts
of the update. You can either use [existing Device Update handlers](https://github.com/Azure/iot-hub-device-update/tree/main/src/content_handlers) or implement a custom Content Handler that invokes any installer needed for your use case.

## Self-upgrade Device update agent

We have added many new capabilities to the Device Update agent in the latest Public Preview Refresh agent (version 0.8.0). 

If you are using the Device Update agent versions 0.6.0 or 0.7.0 please upgrade to the latest agent version 0.8.0.

You can check installed version of the Device Update agent and the Delivery Optimization agent in the Device Properties section of your [IoT device twin](../iot-hub/iot-hub-devguide-device-twins.md). [Learn more about device properties under ADU Core Interface](device-update-plug-and-play.md#device-properties).

## Next Steps
[Understand Device Update agent configuration file](device-update-configuration-file.md)

You can use the following tutorials for a simple demonstration of Device Update for IoT Hub:

- [Image Update: Getting Started with Raspberry Pi 3 B+ Reference Yocto Image](device-update-raspberry-pi.md) extensible via open source to build you own images for other architecture as needed.
	
- [Package Update: Getting Started using Ubuntu Server 18.04 x64 Package agent](device-update-ubuntu-agent.md)
	
- [Proxy Update: Getting Started using Device Update binary agent for downstream devices](device-update-howto-proxy-updates.md)
	
- [Getting Started Using Ubuntu (18.04 x64) Simulator Reference Agent](device-update-simulator.md)

- [Device Update for Azure IoT Hub tutorial for Azure-Real-Time-Operating-System](device-update-azure-real-time-operating-system.md)
