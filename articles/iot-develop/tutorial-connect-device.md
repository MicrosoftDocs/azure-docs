---
title: Tutorial - Connect IoT Plug and Play sample device code to Azure IoT Hub | Microsoft Docs
description: Tutorial - Build and run IoT Plug and Play sample device code (C, C#, Java, JavaScript, or Python) on Linux or Windows that connects to an IoT hub. Use the Azure IoT explorer tool to view the information sent by the device to the hub.
author: dominicbetts
ms.author: dobett
ms.date: 11/17/2022
ms.topic: tutorial
ms.service: iot-develop
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
services: iot-develop
zone_pivot_groups: programming-languages-set-twenty-seven

#- id: programming-languages-set-twenty-seven
#    title: Embedded C
#Customer intent: As a device builder, I want to see a working IoT Plug and Play device sample connecting to IoT Hub and sending properties and telemetry, and responding to commands. As a solution builder, I want to use a tool to view the properties, commands, and telemetry an IoT Plug and Play device reports to the IoT hub it connects to.
---

# Tutorial: Connect a sample IoT Plug and Play device application running on Linux or Windows to IoT Hub

:::zone pivot="programming-language-ansi-c"

[!INCLUDE [iot-pnp-connect-device-c](../../includes/iot-pnp-connect-device-c.md)]

[!INCLUDE [iot-pnp-clean-resources-short](../../includes/iot-pnp-clean-resources-short.md)]

:::zone-end

:::zone pivot="programming-language-csharp"

[!INCLUDE [iot-pnp-connect-device-csharp](../../includes/iot-pnp-connect-device-csharp.md)]

[!INCLUDE [iot-pnp-clean-resources-short](../../includes/iot-pnp-clean-resources-short.md)]

:::zone-end

:::zone pivot="programming-language-java"

[!INCLUDE [iot-pnp-connect-device-java](../../includes/iot-pnp-connect-device-java.md)]

[!INCLUDE [iot-pnp-clean-resources-short](../../includes/iot-pnp-clean-resources-short.md)]

:::zone-end

:::zone pivot="programming-language-javascript"

[!INCLUDE [iot-pnp-connect-device-node](../../includes/iot-pnp-connect-device-node.md)]

[!INCLUDE [iot-pnp-clean-resources-short](../../includes/iot-pnp-clean-resources-short.md)]

:::zone-end

:::zone pivot="programming-language-python"

[!INCLUDE [iot-pnp-connect-device-python](../../includes/iot-pnp-connect-device-python.md)]

[!INCLUDE [iot-pnp-clean-resources-short](../../includes/iot-pnp-clean-resources-short.md)]

:::zone-end

:::zone pivot="programming-language-embedded-c"

[!INCLUDE [iot-pnp-connect-device-embedded-c](../../includes/iot-pnp-connect-device-embedded-c.md)]

:::zone-end

## Next steps

In this tutorial, you've learned how to connect an IoT Plug and Play device to an IoT hub. To learn more about how to build a solution that interacts with your IoT Plug and Play devices, see:

> [!div class="nextstepaction"]
> [How-to: Connect to and interact with a device](./tutorial-service.md)
