---
title: Get started with module identity and module identity twins
titleSuffix: Azure IoT Hub
description: Learn how to create module identities and update module identity twins using the Azure IoT Hub SDKs.
author: kgremban
ms.author: kgremban
manager: lizross
ms.service: azure-iot-hub
ms.devlang: csharp
ms.topic: how-to
ms.date: 01/03/2025
zone_pivot_groups: iot-hub-howto-c2d-2
ms.custom: mqtt, devx-track-csharp, devx-track-dotnet
---

# Get started with IoT Hub module identities and module identity twins

Module identities and module identity twins are similar to Azure IoT Hub device identities and device twins, but provide finer granularity. While Azure IoT Hub device identities and device twins enable the back-end application to configure a device and provide visibility on the device's conditions, a module identity and module identity twin provide these capabilities for individual components of a device. On capable devices with multiple components, such as operating system devices or firmware devices, module identities and module identity twins allow for isolated configuration and conditions for each component. For more information, see [Understand Azure IoT Hub module twins](iot-hub-devguide-module-twins.md).

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-whole.md)]

This article shows you how to develop two types of applications:

* Device apps that view and update module identity twin reported properties and handle requests to update desired properties.
* Service apps that can read and set module identity desired properties.

> [!NOTE]
> This article is meant to complement [Azure IoT SDKs](iot-hub-devguide-sdks.md) samples that are referenced from within this article. You can use SDK tools to build both device and back-end applications.

## Prerequisites

* An IoT hub
* An IoT hub device
* An IoT hub device module identity

* If your application uses the MQTT protocol, make sure that **port 8883** is open in your firewall. The MQTT protocol communicates over port 8883. This port may be blocked in some corporate and educational network environments. For more information and ways to work around this issue, see [Connecting to IoT Hub (MQTT)](../iot/iot-mqtt-connect-to-iot-hub.md#connecting-to-iot-hub).

:::zone pivot="programming-language-csharp"

[!INCLUDE [iot-hub-howto-module-twins-dotnet](../../includes/iot-hub-howto-module-twins-dotnet.md)]

:::zone-end

:::zone pivot="programming-language-python"

[!INCLUDE [iot-hub-howto-module-twins-python](../../includes/iot-hub-howto-module-twins-python.md)]

:::zone-end

:::zone pivot="programming-language-node"

[!INCLUDE [iot-hub-howto-module-twins-node](../../includes/iot-hub-howto-module-twins-node.md)]

:::zone-end
