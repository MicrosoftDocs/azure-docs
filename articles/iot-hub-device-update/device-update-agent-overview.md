---
title: Understand Device Update Agent| Microsoft Docs
description: Understand Device Update Agent.
author: ValOlson
ms.author: valls
ms.date: 2/12/2021
ms.topic: conceptual
ms.service: iot-hub-device-update
---

# Device Update for IoT Hub Agent Overview

The Device Update Agent consists of two conceptual layers:

* The Interface Layer builds on top of [Azure IoT Plug and Play
(PnP)](https://docs.microsoft.com/en-us/azure/iot-pnp/overview-iot-plug-and-play)
allowing for messaging to flow between the Device Update Agent and Device Update Services.
* The Platform Layer is responsible for the high-level update actions of Download, Install, and Apply that may be platform, or device specific.

:::image type="content" source="media/agent-overview/client-agent-reference-implementations.png" alt-text="Agent Implementations." lightbox="media/agent-overview/client-agent-reference-implementations.png":::

## The Interface Layer

The Interface layer is made up of the [ADU Core Interface](https://github.com/Azure/iot-hub-device-update/tree/main/src/agent/adu_core_interface) and the [Device Information Interface](https://github.com/Azure/iot-hub-device-update/tree/main/src/agent/device_info_interface).

These interfaces rely on a configuration file for default values. The default values include aduc_manfuacter and aduc_model for the AzureDeviceUpdateCore interface and model and manufacturer for the DeviceInformation interface. [Learn More](device-update-configuration-file.md) the configuration file.

### ADU Core Interface

The 'ADU Core' interface is the primary communication channel between Device Update Agent and Services. [Learn More](device-update-plug-and-play.md#adu-core-interface) about this interface.

### Device Information Interface

The Device Information Interface is used to implement the Azure IoT PnP `DeviceInformation` interface. [Learn More](device-update-plug-and-play.md#device-information-interface) about this interface.

## The Platform Layer

There are two implementations of the Platform Layer. The Simulator Platform
Layer has a trivial implementation of the update actions and is used for quickly
testing and evaluating Device Update for IoT Hub services and setup. When the Device Update Agent is built with
the Simulator Platform Layer, we refer to it as the Device Update Simulator Agent or just
simulator. [Learn More](https://github.com/Azure/iot-hub-device-update/blob/main/docs/agent-reference/how-to-run-agent.md) about how to use the simulator
agent. The Linux Platform Layer integrates with [Delivery Optimization](https://github.com/microsoft/do-client) for
downloads and is used in our Raspberry Pi reference image, and all clients that run on Linux systems.

### Simulator Platform Layer

The Simulator Platform Layer implementation can be found in the
`src/platform_layers/simulator_platform_layer` and can be used for
testing and evaluating Device Update for IoT Hub.  Many of the actions in the
"simulator" implementation are mocked to reduce physical changes to experiment with Device Update for IoT Hub.  An end to end
"simulated" update can be performed using this Platform Layer. [Learn
More](https://github.com/Azure/iot-hub-device-update/blob/main/docs/agent-reference/how-to-run-agent.md) about running the simulator agent.

### Linux Platform Layer

The Linux Platform Layer implementation can be found in the
`src/platform_layers/linux_platform_layer` and it integrates with the [Delivery Optimization Client](https://github.com/microsoft/do-client/releases) for downloads and is used in our Raspberry Pi reference image, and all clients that run on Linux systems.

This layer can integrate with different Update Handlers to implement the
installer. For
instance, the `SWUpdate` Update Handler invokes a shell script to call into the
`SWUpdate` executable to do an update.

## Update Handlers

Update Handlers are components that handle content or installer-specific parts
of the update. Update Handler implementations are in `src/content_handlers`.

### Simulator Update Handler

The Simulator Update Handler is used by the Simulator Platform Layer and can
be used with the Linux Platform Layer to fake interactions with a Content
Handler. The Simulator Update Handler implements the Update Handler APIs with
mostly no-ops. The implementation of the Simulator Update Handler is in
src/content_handlers/simulator_content_handler. The InstalledCriteria field in
the AzureDeviceUpdateCore PnP interface should be the sha256 hash of the
content. This is the same hash that is present in the [Import Manifest
Object](import-update.md#create-device-update-import-manifest). [Learn
More](device-update-plug-and-play.md) about `installedCriteria` and the `AzureDeviceUpdateCore` interface.

### `SWUpdate` Update Handler

The `SWUpdate` Update Handler" integrates with the `SWUpdate` command-line
executable and other shell commands to implement A/B updates specifically for
the Raspberry Pi reference Yocto image. Find the latest Raspberry Pi reference Yocto image [here](https://github.com/Azure/iot-hub-device-update/releases). The `SWUpdate` Update Handler is implemented in [src/content_handlers/swupdate_content_handler](https://github.com/Azure/iot-hub-device-update/tree/main/src/content_handlers/swupdate_handler).

### APT Update Handler

The APT Update Handler processes an APT-specific Update Manifest and invokes APT to
install or update the specified Debian package(s).

## Getting Started with the Device Update Agent

### Try out pre-built images, binaries, and packages

We have uploaded pre-built Raspberry Pi reference images, Device Update agent binaries,
and Device Update agent packages as part of our GitHub releases. Download them to get
started right away!

If you downloaded our Raspberry Pi reference image, Learn more [here](device-update-raspberry-pi.md) on how to get
started.

### Build the agent

Follow the instructions to [build](https://github.com/Azure/iot-hub-device-update/blob/main/docs/agent-reference/how-to-build-agent-code.md) the Device Update Agent
from source.

### Run the agent

Once the agent is successfully building, it's time [run](https://github.com/Azure/iot-hub-device-update/blob/main/docs/agent-reference/how-to-run-agent.md)
the agent.

### Modifying the agent

Now, make the changes needed to incorporate the agent into your image.  Look at how to
[modify](https://github.com/Azure/iot-hub-device-update/blob/main/docs/agent-reference/how-to-modify-the-agent-code.m) the Device Update Agent for guidance.
