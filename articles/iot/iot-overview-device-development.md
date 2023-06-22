---
title: Device development introduction
description: An overview of Azure IoT device development including an introduction to the device SDKs, modeling, IoT Edge modules, and a survey of the available tools.
ms.service: iot
services: iot
author: dominicbetts
ms.author: dobett
ms.topic: overview
ms.date: 03/20/2023
ms.custom: template-overview

# As a solution builder or device developer I want a high-level overview of the issues around device development so that I can easily find relevant content.
---

# IoT device development

This overview introduces the key concepts around developing devices that connect to a typical Azure IoT solution. Each section includes links to content that provides further detail and guidance.

The following diagram shows a high-level view of the components in a typical IoT solution. This article focuses on the devices and gateway shown in the diagram.

:::image type="content" source="media/iot-overview-device-development/iot-architecture.svg" alt-text="Diagram that shows the high-level IoT solution architecture highlighting device connectivity areas." border="false":::

In Azure IoT, a device developer writes the code to run on the devices in the solution. This code typically:

- Establishes a secure connection to a cloud endpoint.
- Sends telemetry collected from attached sensors to the cloud.
- Manages device state and synchronizes that state with the cloud.
- Responds to commands sent from the cloud.
- Enables the installation of software updates from the cloud.
- Enables the device to keep functioning while it's disconnected from the cloud.

## Device types

IoT devices can be separated into two broad categories, microcontrollers (MCUs) and microprocessors (MPUs):

- MCUs are less expensive and simpler to operate than MPUs.
- An MCU contains many of the functions, such as memory, interfaces, and I/O on the chip itself. An MPU accesses this functionality from components in supporting chips.
- An MCU often uses a real-time OS (RTOS) or runs bare-metal (no OS) and provides real-time responses and highly deterministic reactions to external events. MPUs generally run a general purpose OS, such as Windows, Linux, or macOS that provides a nondeterministic real-time response. There's typically no guarantee as to when a task will complete.

Examples of specialized hardware and operating systems include:

[Windows for IoT](/windows/iot/product-family/windows-iot) is an embedded version of Windows for MPUs with cloud connectivity that lets you create secure devices with easy provisioning and management.

[Azure RTOS](/azure/rtos/overview-rtos) is a real time operating system for IoT and edge devices powered by MCUs. Azure RTOS is designed to support highly constrained devices that are battery powered and have less than 64 KB of flash memory.

[Azure Sphere](/azure-sphere/product-overview/what-is-azure-sphere) is a secure, high-level application platform with built-in communication and security features for internet-connected devices. It comprises a secured, connected, crossover MCU, a custom high-level Linux-based operating system, and a cloud-based security service that provides continuous, renewable security.

## Primitives

An Azure IoT device can use the following primitives to interact with the cloud:

- *Device-to-cloud* messages to send time series telemetry to the cloud. For example, temperature data collected from a sensor attached to the device.
- *File uploads* for media files such as captured images and video. Intermittently connected devices can send telemetry batches. Devices can compress uploads to save bandwidth.
- *Device twins* to share and synchronize state data with the cloud. For example, a device can use the device twin to report the current state of a valve it controls to the cloud and to receive a desired target temperature from the cloud.
- *Digital twins* to represent a device in the digital world. For example, a digital twin can represent a device's physical location, its capabilities, and its relationships with other devices.
- *Direct methods* to receive commands from the cloud. A direct method can have parameters and return a response. For example, the cloud can call a direct method to request the device to reboot in 30 seconds.
- *Cloud-to-device* messages to receive one-way notifications from the cloud. For example, a notification that an update is ready to download.

To learn more, see [Device-to-cloud communications guidance](../iot-hub/iot-hub-devguide-d2c-guidance.md) and [Cloud-to-device communications guidance](../iot-hub/iot-hub-devguide-c2d-guidance.md).

## Device SDKs

The device SDKs provide high-level abstractions that let you use the primitives without knowledge of the underlying communications protocols. The device SDKs also handle the details of establishing a secure connection to the cloud and authenticating the device.

For MPU devices, device SDKs are available for the following languages:

- [C](https://github.com/Azure/azure-iot-sdk-c/)
- [Python](https://github.com/Azure/azure-iot-sdk-python/)
- [C# (.NET)](https://github.com/Azure/azure-iot-sdk-csharp/)
- [Node.js](https://github.com/Azure/azure-iot-sdk-node/)
- [Java](https://github.com/Azure/azure-iot-sdk-java/)

For MCU devices, see:

- [Azure RTOS Middleware](https://github.com/azure-rtos/)
- [FreeRTOS Middleware](https://github.com/Azure/azure-iot-middleware-freertos)
- [Azure SDK for Embedded C](https://github.com/Azure/azure-sdk-for-c)

## Samples and guidance

All of the device SDKs include samples that demonstrate how to use the SDK to connect to the cloud, send telemetry, and use the other primitives.

The [IoT device development](../iot-develop/about-iot-develop.md) site includes tutorials and how-to guides that show you how to implement code for a range of device types and scenarios.

You can find more samples in the [code sample browser](/samples/browse/?expanded=azure&products=azure-iot%2Cazure-iot-edge%2Cazure-iot-pnp%2Cazure-rtos).

To learn more about implementing automatic reconnections to endpoints, see [Manage device reconnections to create resilient applications](../iot-develop/concepts-manage-device-reconnections.md).

## Device development without a device SDK

Although you're recommended to use one of the device SDKS, there may be scenarios where you prefer not to. In these scenarios, your device code must directly use one of the communication protocols that IoT Hub and the Device Provisioning Service (DPS) support.

For more information, see:

- [Using the MQTT protocol directly (as a device)](iot-mqtt-connect-to-iot-hub.md#using-the-mqtt-protocol-directly-as-a-device)
- [Using the AMQP protocol directly (as a device)](../iot-hub/iot-hub-amqp-support.md#device-client)

## Device modeling

IoT Plug and Play enables solution builders to integrate IoT devices with their solutions without any manual configuration. At the core of IoT Plug and Play, is a device model that a device uses to advertise its capabilities to an IoT Plug and Play-enabled application such as IoT Central. This model is structured as a set of elements that define:

- *Properties* that represent the read-only or writable state of a device or other entity. For example, a device serial number may be a read-only property and a target temperature on a thermostat may be a writable property.
- *Telemetry* that's the data emitted by a device, whether the data is a regular stream of sensor readings, an occasional error, or an information message.
- *Commands* that describe a function or operation that can be done on a device. For example, a command could reboot a gateway or take a picture using a remote camera.

You can group these elements in interfaces to reuse across models to make collaboration easier and to speed up development.

The model is specified by using the [Digital Twins Definition Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl).

The use of IoT Plug and Play, modeling, and DTDL is optional. You can use the IoT device primitives without using IoT Plug and Play or modeling. The [Azure Digital Twins](../digital-twins/overview.md) service also uses DTDL models to create twin graphs based on digital models of environments such as buildings or factories.

As a device developer, when you implement an IoT Plug and Play device there are a set of conventions to follow. These conventions provide a standard way to implement the device model in code by using the primitives available in the device SDKs.

To learn more, see:

- [What is IoT Plug and Play?](../iot-develop/overview-iot-plug-and-play.md)
- [IoT Plug and Play modeling guide](../iot-develop/concepts-modeling-guide.md)

## Containerized device code

Using containers, such as Docker, to run your device code lets you deploy code to your devices by using the capabilities of the container infrastructure. Containers also let you define a runtime environment for your code with all the required library and package versions installed. Containers make it easier to deploy updates and to manage the lifecycle of your IoT devices.

Azure IoT Edge runs device code in containers. You can use Azure IoT Edge to deploy code modules to your devices. To learn more, see [Develop your own IoT Edge modules](../iot-edge/module-development.md).

> [!TIP]
> Azure IoT Edge enables multiple scenarios. In addition to running your IoT device code in containers, you can use Azure IoT Edge to run Azure services on your devices and implement [field gateways](iot-overview-device-connectivity.md#field-gateways). For more information, see [What is Azure IoT Edge?](../iot-edge/about-iot-edge.md)

## Development tools

The following table lists some of the available IoT development tools:

| Tool | Description |
| --- | --- |
| [Azure IoT Hub (VS Code extension)](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit) | This VS Code extension lets you manage your IoT Hub resources and devices from within VS Code. |
| [Azure IoT explorer](howto-use-iot-explorer.md) | This cross-platform tool lets you manage your IoT Hub resources and devices from a desktop application. |
| [Azure IoT extension for Azure CLI](/cli/azure/service-page/azure%20iot) | This CLI extension includes commands such as `az iot device simulate`, `az iot device c2d-message`, and `az iot hub monitor-events` that help you test interactions with devices. |

## Next steps

Now that you've seen an overview of device development in Azure IoT solutions, some suggested next steps include:

- [Device infrastructure and connectivity](iot-overview-device-connectivity.md)
- [Device management and control](iot-overview-device-management.md)
