---
author: dominicbetts
ms.author: dobett
ms.service: iot-pnp
ms.topic: include
ms.date: 09/24/2020
---

IoT Plug and Play lets you build smart devices that advertise their capabilities to Azure IoT applications. IoT Plug and Play devices don't require manual configuration when a customer connects them to IoT Plug and Play-enabled applications.

A smart device might be implemented directly, use [modules](../articles/iot-hub/iot-hub-devguide-module-twins.md), or use [IoT Edge modules](../articles/iot-edge/about-iot-edge.md).

This guide describes the basic steps required to create a device, module, or IoT Edge module that follows the [IoT Plug and Play conventions](../articles/iot-pnp/concepts-convention.md).

To build an IoT Plug and Play device, module, or IoT Edge module, follow these steps:

1. Ensure your device is using either the MQTT or MQTT over WebSockets protocol to connect to Azure IoT Hub.
1. Create a [Digital Twins Definition Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl) model to describe your device. To learn more, see [Understand components in IoT Plug and Play models](../articles/iot-pnp/concepts-components.md).
1. Update your device or module to announce the `model-id` as part of the device connection.
1. Implement telemetry, properties, and commands using the [IoT Plug and Play conventions](../articles/iot-pnp/concepts-convention.md)

Once your device or module implementation is ready, use the [Azure IoT explorer](../articles/iot-pnp/howto-use-iot-explorer.md) to validate that the device follows the IoT Plug and Play conventions.
