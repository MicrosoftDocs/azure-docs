---
title: Quickstart - Connect IoT Plug and Play sample device code to Azure IoT Hub | Microsoft Docs
description: Quickstart - Build and run IoT Plug and Play sample device code (C, C#, Java, JavaScript, or Python) on Linux or Windows that connects to an IoT hub. Use the Azure IoT explorer tool to view the information sent by the device to the hub.
author: ericmitt
ms.author: ericmitt
ms.date: 07/14/2020
ms.topic: quickstart
ms.service: iot-pnp
services: iot-pnp
zone_pivot_groups: programming-languages-set-twenty-six

#- id: programming-languages-set-twenty-six
## Owner: dobett
#  title: Programming languages
#  prompt: Choose a programming language
#  pivots:
#  - id: programming-language-ansi-c
#    title: C
#  - id: programming-language-csharp
#    title: C#
#  - id: programming-language-java
#    title: Java
#  - id: programming-language-javascript
#    title: JavaScript
#  - id: programming-language-python
#    title: Python

# As a device builder, I want to see a working IoT Plug and Play device sample connecting to IoT Hub and sending properties and telemetry, and responding to commands. As a solution builder, I want to use a tool to view the properties, commands, and telemetry an IoT Plug and Play device reports to the IoT hub it connects to.
---

# Quickstart: Connect a sample IoT Plug and Play device application running on Linux or Windows to IoT Hub

:::zone pivot="programming-language-ansi-c"

[!INCLUDE [iot-pnp-connect-device-c](../../includes/iot-pnp-connect-device-c.md)]

:::zone-end

:::zone pivot="programming-language-csharp"

[!INCLUDE [iot-pnp-connect-device-csharp](../../includes/iot-pnp-connect-device-csharp.md)]

:::zone-end

:::zone pivot="programming-language-java"

[!INCLUDE [iot-pnp-connect-device-java](../../includes/iot-pnp-connect-device-java.md)]

:::zone-end

:::zone pivot="programming-language-javascript"

[!INCLUDE [iot-pnp-connect-device-node](../../includes/iot-pnp-connect-device-node.md)]

:::zone-end

:::zone pivot="programming-language-python"

[!INCLUDE [iot-pnp-connect-device-python](../../includes/iot-pnp-connect-device-python.md)]

:::zone-end

## Clean up resources

If you've finished with the quickstarts and tutorials, see [Clean up resources](set-up-environment.md#clean-up-resources).

## Next steps

In this quickstart, you've learned how to connect an IoT Plug and Play device to an IoT hub. To learn more about how to build a solution that interacts with your IoT Plug and Play devices, see:

> [!div class="nextstepaction"]
> [How-to: Connect to and interact with a device](./quickstart-service.md)
