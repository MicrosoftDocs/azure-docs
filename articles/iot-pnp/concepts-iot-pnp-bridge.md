---
title: IoT Plug and Play bridge | Microsoft Docs
description: Understand the IoT Plug and Play bridge and how to use it to connect existing devices attached to a Windows or Linux gateway as IoT Plug and Play devices.
author: usivagna
ms.author: ugans
ms.date: 09/22/2020
ms.topic: conceptual
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a solution or device builder, I want to understand what IoT Plug and Play bridge is and how I can connect existing sensors attached to a Windows or Linux PC as IoT Plug and Play devices.
---

# IoT Plug and Play bridge

The IoT Plug and Play bridge is an open-source application for connecting existing devices attached to Windows or Linux gateway as IoT Plug and Play devices. After installing and configuring the application on your Windows or Linux machine, you can use it to connect attached devices to an IoT hub. You can use the bridge to map IoT Plug and Play interfaces to the telemetry the attached devices are sending, work with device properties, and invoke commands.

:::image type="content" source="media/concepts-iot-pnp-bridge/iot-pnp-bridge-high-level.png" alt-text="On the left hand side there are a couple of existing sensors attached (both wired and wireless) to a Windows or Linux PC containing IoT Plug and Play bridge. The IoT Plug and Play bridge then connects to an IoT hub on the right side":::

IoT Plug and Play bridge can be deployed as a standalone executable on any IoT device, industrial PC, server, or gateway running Windows 10 or Linux. It can also be compiled into your application code. A simple configuration JSON file tells the IoT Plug and Play bridge which attached devices/peripherals should be exposed up to Azure.

## Supported Protocols and Sensors

IoT Plug and Play bridge supports the following types of peripherals by default, with links to the adapter documentation:

|Peripheral|Windows|Linux|
|---------|---------|---------|
|[Bluetooth LE](https://aka.ms/iot-pnp-bridge-bluetooth)       |Yes|No|
|[Cameras](https://aka.ms/iot-pnp-bridge-camera)               |Yes|No|
|[Modbus](https://aka.ms/iot-pnp-bridge-modbus)                |Yes|Yes|
|[MQTT](https://aka.ms/iot-pnp-bridge-mqtt)                    |Yes|Yes|
|[Serial](https://aka.ms/iot-pnp-bridge-serial)                |Yes|Yes|
|[Windows USB peripherals](https://aka.ms/iot-pnp-bridge-usb)  |Yes|Not Applicable|

>[!Important]
>Developers can extend the IoT Plug and Play bridge to support additional device protocols via the instructions in the **[IoT Plug and Play bridge developer documentation here](https://aka.ms/iot-pnp-bridge-dev-doc)**.

## Prerequisites

### OS Platform

The following OS platforms and versions are supported:

|Platform  |Supported Versions  |
|---------|---------|
|Windows 10 |     All Windows SKUs are supported. For example: IoT Enterprise, Server, Desktop, IoT Core. *For Camera health monitoring functionality, 20H1 or later build is recommended. All other functionality is available on all Windows 10 builds.*  |
|Linux     |Tested and supported on Ubuntu 18.04, functionality on other distributions has not been tested.         |
||

### Hardware

- Any hardware platform capable of supporting the above OS SKUs and versions.
- Serial, USB, Bluetooth, and Camera peripherals and sensors are supported natively. The IoT Plug and Play Bridge can be extended to support any custom peripheral or sensor ([see peripherals section above](#iot-plug-and-play-bridge)).

### Development Environment

To build, extend, and develop the IoT Plug and Play bridge you'll need:  

- A development environment that supports compiling C++ such as: [Visual Studio (Community, Professional, or Enterprise)](https://visualstudio.microsoft.com/downloads/)- make sure that you include the Desktop Development with C++ workload when you install Visual Studio.
- [CMake](https://cmake.org/download/) - when you install CMake, select the option `Add CMake to the system PATH`.
- If you are building on Windows, you will also need to download Windows 17763 SDK: [https://developer.microsoft.com/windows/downloads/windows-10-sdk](https://developer.microsoft.com/windows/downloads/windows-10-sdk)
- [Azure IoT Hub Device C SDK](https://github.com/Azure/azure-iot-sdk-c). The included build scripts in this repo will automatically clone the required Azure IoT C SDK for you.

### Azure IoT Products and Tools

- **Azure IoT Hub** - You'll need an [Azure IoT hub](https://docs.microsoft.com/azure/iot-hub/) in your Azure subscription to connect your device to. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin. If you don't have an IoT hub, [follow these instructions to create one](https://docs.microsoft.com/azure/iot-hub/iot-hub-create-using-cli).

> [!Note]
> IoT Plug and Play is currently available on IoT hubs created in the Central US, North Europe, and East Japan regions. IoT Plug and Play support is not included in basic-tier IoT hubs. To interact with the your IoT Plug and Play device, you can use the Azure IoT explorer tool. [Download and install the latest release of Azure IoT explorer](./howto-use-iot-explorer.md) for your operating system.

## IoT Plug and Play bridge Architecture

:::image type="content" source="media/concepts-iot-pnp-bridge/iot-pnp-bridge-components.png" alt-text="On the left hand side there are several boxes indicating various peripherals attached to a Windows or Linux PC containing IoT Plug and Play bridge. From the top, a box labeled configuration points toward the bridge. The bridge then connects to an IoT hub on the right side of the diagram.":::

## Download IoT Plug and Play bridge

You can download a pre-built version of the bridge with supported adapters in [IoT Plug and Play bridge releases](https://aka.ms/iot-pnp-bridge-releases) and expand the list of assets for the most recent release. Download the most recent version of the application for your operating system.

You can also download and view the source code of [IoT Plug and Play bridge on GitHub](https://aka.ms/bridge).

## Next steps

Now that you have an overview of the architecture of IoT Plug and Play bridge, the next steps are to learn more about:

- [How to use IoT Plug and Play bridge](./howto-use-iot-pnp-bridge.md)
- [See the GitHub Developer reference for IoT Plug and Play bridge](https://aka.ms/iot-pnp-bridge-dev-doc)
- [IoT Plug and Play bridge on GitHub](https://aka.ms/iotplugandplaybridge)
