---
title: Device management using direct methods
titleSuffix: Azure IoT Hub
description: How to use Azure IoT Hub direct methods for device management tasks including invoking a remote device reboot.
author: kgremban
ms.author: kgremban
manager: lizross
ms.service: azure-iot-hub
ms.devlang: csharp
ms.topic: how-to
ms.date: 1/6/2025
zone_pivot_groups: iot-hub-howto-c2d-1
---

# Get started with device management

Back-end apps can use Azure IoT Hub primitives, such as [device twins](iot-hub-devguide-device-twins.md) and [direct methods](iot-hub-devguide-direct-methods.md), to remotely start and monitor device management actions on devices.

Use a direct method from a back-end application to initiate device management actions, such as reboot, factory reset, and firmware update.

The device is responsible for:

* Handling the direct method request sent from IoT Hub
* Initiating the corresponding device-specific action on the device
* Providing status updates through reported properties to IoT Hub

This article shows you how a back-end app and a device app can work together to initiate and monitor a remote device action using a direct method.

* A service app calls a direct method to reboot in a device app through an IoT hub.
* A device app handles a direct method to reboot a device.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-whole.md)]

> [!NOTE]
> This article is meant to complement [Azure IoT SDKs](iot-hub-devguide-sdks.md) samples that are referenced from within this article. You can use SDK tools to build both device and back-end applications.

## Prerequisites

* An IoT hub

* A registered device

* If your application uses the MQTT protocol, make sure that port 8883 is open in your firewall. The MQTT protocol communicates over port 8883. This port may be blocked in some corporate and educational network environments. For more information and ways to work around this issue, see [Connecting to IoT Hub (MQTT)](../iot/iot-mqtt-connect-to-iot-hub.md#connecting-to-iot-hub).

:::zone pivot="programming-language-csharp"

[!INCLUDE [iot-hub-howto-device-management-dotnet](../../includes/iot-hub-howto-device-management-dotnet.md)]

:::zone-end

:::zone pivot="programming-language-java"

[!INCLUDE [iot-hub-howto-device-management-java](../../includes/iot-hub-howto-device-management-java.md)]

:::zone-end

:::zone pivot="programming-language-python"

[!INCLUDE [iot-hub-howto-device-management-python](../../includes/iot-hub-howto-device-management-python.md)]

:::zone-end

:::zone pivot="programming-language-node"

[!INCLUDE [iot-hub-howto-device-management-node](../../includes/iot-hub-howto-device-management-node.md)]

:::zone-end
