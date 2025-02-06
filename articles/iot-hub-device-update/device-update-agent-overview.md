---
title: Azure Device Update for IoT Hub agent overview
description: Understand the structure and functions of the Azure Device Update for IoT Hub agent.
author: eshashah-msft
ms.author: eshashah
ms.date: 12/19/2024
ms.topic: concept-article
ms.service: azure-iot-hub
ms.subservice: device-update
---

# Device Update for IoT Hub agent overview

The Device Update agent consists of two conceptual layers:

- The *interface layer* builds on top of [Azure IoT Plug and Play](../iot/overview-iot-plug-and-play.md) (PnP) to allow messages to flow between the Device Update agent and the Device Update service.
- The *platform layer* does the high-level update download, install, and apply actions, which can be platform- or device-specific.

The following diagram lists Device Update agent capabilities and actions.

:::image type="content" source="media/understand-device-update/client-agent-reference-implementations.png" alt-text="Diagram that shows agent implementations." border="false" lightbox="media/understand-device-update/client-agent-reference-implementations.png":::

## Interface layer

The interface layer is made up of the following components:

- [Device Update core interface](https://github.com/Azure/iot-hub-device-update/tree/main/src/agent/adu_core_interface)
- [Device information interface](https://github.com/Azure/iot-hub-device-update/tree/main/src/agent/device_info_interface)
- [Diagnostic information interface](https://github.com/Azure/iot-hub-device-update/tree/main/src/diagnostics_component/diagnostics_interface)

These interfaces use a configuration file for the device specific values to report to Device Update services. For more information, see [Device Update configuration file](device-update-configuration-file.md).

### Device Update core interface

The [Device Update core interface](https://github.com/Azure/iot-plugandplay-models/blob/main/dtmi/azure/iot/deviceupdate-1.json) is the primary communication channel between the Device Update agent and Device Update services.

### Device information interface

The [device information interface](https://github.com/Azure/iot-plugandplay-models/blob/main/dtmi/azure/devicemanagement/deviceinformation-1.json) implements the Azure IoT PnP `DeviceInformation` interface.

### Diagnostic information interface

The [diagnostic information interface](https://github.com/Azure/iot-plugandplay-models/blob/main/dtmi/azure/iot/diagnosticinformation-1.json) enables [remote log collection](device-update-diagnostics.md#remote-log-collection) for diagnostics.

## Platform layer

All clients that run on Linux systems, such as the Device Update Raspberry Pi reference image, use the Linux platform layer. The Linux platform layer integrates with the [Delivery Optimization client](https://github.com/microsoft/do-client/releases) for downloads.

The Linux platform layer implementation that integrates with [Delivery Optimization](https://github.com/microsoft/do-client) for downloads is in *src/platform_layers/linux_platform_layer*. This layer can integrate with update handlers such as `SWUpdate`, `Apt`, and `Script` to implement the installers.

If you choose to implement your own downloader instead of Delivery Optimization, be sure to review the [requirements for large file downloads](device-update-limits.md#requirements-for-large-file-downloads).

## Update handlers

Update handlers invoke installers or commands to do over-the-air updates. You can either use [existing update content handlers](https://github.com/Azure/iot-hub-device-update/blob/main/src/extensions/inc/aduc/content_handler.hpp), or implement a [custom content handler](https://github.com/Azure/iot-hub-device-update/tree/main/docs/agent-reference/how-to-implement-custom-update-handler.md) that can invoke any installer to execute the over-the-air updates you need for your use case.

## Check and upgrade agent version

You can check the installed versions of the Device Update agent and the Delivery Optimization agent in the [properties](device-update-plug-and-play.md#device-properties) section of your [IoT device twin](../iot-hub/iot-hub-devguide-device-twins.md).

If you use the Device Update agent, make sure you're on the version 1.0.0 general availability (GA) version. For more information, see [Migrate devices and groups to the latest Device Update release](migration-public-preview-refresh-to-ga.md).

## Related content

- [Device Update for IoT Hub configuration file](device-update-configuration-file.md)
- [Azure Device Update for IoT Hub using a Raspberry Pi image](device-update-raspberry-pi.md)
- [Azure Device Update for IoT Hub using the Ubuntu package agent](device-update-ubuntu-agent.md)
- [Tutorial: Complete a proxy update by using Device Update for Azure IoT Hub](device-update-howto-proxy-updates.md)
- [Azure Device Update for IoT Hub using a simulator agent](device-update-simulator.md)
- [Device Update for Azure IoT Hub using Eclipse ThreadX](device-update-azure-real-time-operating-system.md)
