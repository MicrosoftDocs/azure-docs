---
title: Device developer guide - IoT Plug and Play | Microsoft Docs
description: "Description of IoT Plug and Play for device developers. Includes examples in the following languages: C, C#, Java, JavaScript, Python, and Embedded C."
author: rido-min
ms.author: rmpablos
ms.date: 11/17/2022
ms.topic: conceptual
ms.service: iot-develop
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
services: iot-develop
zone_pivot_groups: programming-languages-set-twenty-seven

#- id: programming-languages-set-twenty-seven
#    title: Embedded C
---

# IoT Plug and Play device developer guide

IoT Plug and Play lets you build IoT devices that advertise their capabilities to Azure IoT applications. IoT Plug and Play devices don't require manual configuration when a customer connects them to IoT Plug and Play-enabled applications such as IoT Central.

You can implement an IoT device directly by using [modules](../iot-hub/iot-hub-devguide-module-twins.md), or by using [IoT Edge modules](../iot-edge/about-iot-edge.md).

This guide describes the basic steps required to create a device, module, or IoT Edge module that follows the [IoT Plug and Play conventions](../iot-develop/concepts-convention.md).

To build an IoT Plug and Play device, module, or IoT Edge module, follow these steps:

1. Ensure your device is using either the MQTT or MQTT over WebSockets protocol to connect to Azure IoT Hub.
1. Create a [Digital Twins Definition Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/README.md) model to describe your device. To learn more, see [Understand components in IoT Plug and Play models](concepts-modeling-guide.md).
1. Update your device or module to announce the `model-id` as part of the device connection.
1. Implement telemetry, properties, and commands that follow the [IoT Plug and Play conventions](concepts-convention.md)

Once your device or module implementation is ready, use the [Azure IoT explorer](../iot/howto-use-iot-explorer.md) to validate that the device follows the IoT Plug and Play conventions.

:::zone pivot="programming-language-ansi-c"

[!INCLUDE [iot-pnp-device-devguide-c](../../includes/iot-pnp-device-devguide-c.md)]

:::zone-end

:::zone pivot="programming-language-embedded-c"

[!INCLUDE [iot-pnp-device-devguide-embedded-c](../../includes/iot-pnp-device-devguide-embedded-c.md)]

:::zone-end

:::zone pivot="programming-language-csharp"

[!INCLUDE [iot-pnp-device-devguide-csharp](../../includes/iot-pnp-device-devguide-csharp.md)]

:::zone-end

:::zone pivot="programming-language-java"

[!INCLUDE [iot-pnp-device-devguide-java](../../includes/iot-pnp-device-devguide-java.md)]

:::zone-end

:::zone pivot="programming-language-javascript"

[!INCLUDE [iot-pnp-device-devguide-node](../../includes/iot-pnp-device-devguide-node.md)]

:::zone-end

:::zone pivot="programming-language-python"

[!INCLUDE [iot-pnp-device-devguide-python](../../includes/iot-pnp-device-devguide-python.md)]

:::zone-end

## Next steps

Now that you've learned about IoT Plug and Play device development, here are some other resources:

- [Digital Twins Definition Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/README.md)
- [C device SDK](https://github.com/Azure/azure-iot-sdk-c/)
- [IoT REST API](/rest/api/iothub/device)
- [Understand components in IoT Plug and Play models](concepts-modeling-guide.md)
- [IoT Plug and Play service developer guide](concepts-developer-guide-service.md)
