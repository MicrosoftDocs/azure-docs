---
title: Tutorial - Connect IoT Plug and Play sample device code to Azure IoT Hub | Microsoft Docs
description: Tutorial - Build and run IoT Plug and Play sample device code (C, C#, Java, JavaScript, or Python) that uses multiple components and connects to an IoT hub. Use the Azure IoT explorer tool to view the information sent by the device to the hub.
author: ericmitt
ms.author: ericmitt
ms.date: 07/22/2020
ms.topic: tutorial
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

# As a device builder, I want to see a working IoT Plug and Play device sample connecting to IoT Hub and using multiple components to send properties and telemetry, and responding to commands. As a solution builder, I want to use a tool to view the properties, commands, and telemetry an IoT Plug and Play device reports to the IoT hub it connects to.
---

# Tutorial: Connect an IoT Plug and Play multiple component device applications running on Linux or Windows to IoT Hub

:::zone pivot="programming-language-ansi-c"

[!INCLUDE [iot-pnp-multiple-components-csharp](../../includes/iot-pnp-multiple-components-c.md)]

:::zone-end

:::zone pivot="programming-language-csharp"

[!INCLUDE [iot-pnp-multiple-components-csharp](../../includes/iot-pnp-multiple-components-csharp.md)]

:::zone-end

:::zone pivot="programming-language-java"

[!INCLUDE [iot-pnp-multiple-components-java](../../includes/iot-pnp-multiple-components-java.md)]

:::zone-end

:::zone pivot="programming-language-javascript"

[!INCLUDE [iot-pnp-multiple-components-node](../../includes/iot-pnp-multiple-components-node.md)]

:::zone-end

:::zone pivot="programming-language-python"

[!INCLUDE [iot-pnp-multiple-components-python](../../includes/iot-pnp-multiple-components-python.md)]

:::zone-end

## Clean up resources

[!INCLUDE [iot-pnp-clean-resources](../../includes/iot-pnp-clean-resources.md)]

## Next steps

In this tutorial, you've learned how to connect an IoT Plug and Play device with components to an IoT hub. To learn more about IoT Plug and Play device models, see:

> [!div class="nextstepaction"]
> [IoT Plug and Play modeling developer guide](concepts-developer-guide-device.md)
