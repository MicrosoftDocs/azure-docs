---
title: Get started with Azure IoT Hub device twins
titleSuffix: Azure IoT Hub
description: How to use Azure IoT Hub device twins and the Azure IoT SDKs to create and simulate devices, add tags to device twins, and execute IoT Hub queries. 
author: kgremban
ms.author: kgremban
manager: lizross
ms.service: iot-hub
ms.devlang: csharp
ms.topic: how-to
ms.date: 07/12/2024
zone_pivot_groups: iot-hub-howto-c2d-1
ms.custom: mqtt, devx-track-csharp, devx-track-dotnet
---

# Get started with device twins

Device twins are JSON documents that store device state information, including metadata, configurations, and conditions. IoT Hub persists a device twin for each device that connects to it.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-whole.md)]

Use device twins to:

* Store device metadata from your solution back end.

* Report current state information such as available capabilities and conditions, for example, the connectivity method used, from your device app.

* Synchronize the state of long-running workflows, such as firmware and configuration updates, between a device app and a back-end app.

* Query your device metadata, configuration, or state.

Device twins are designed for synchronization and for querying device configurations and conditions. For more information about device twins, including when to use device twins, see [Understand device twins](iot-hub-devguide-device-twins.md).

IoT Hubs store device twins, which contain the following elements:

* **Tags**. Device metadata accessible only by the solution back end.

* **Desired properties**. JSON objects modifiable by the solution back end and observable by the device app.

* **Reported properties**. JSON objects modifiable by the device app and readable by the solution back end.

Tags and properties can't contain arrays, but can contain nested objects.

The following illustration shows device twin organization:

:::image type="content" source="../../includes/media/iot-hub-selector-twin-get-started/twin.png" alt-text="Screenshot of a device twin concept diagram.":::

It is useful to review the various device twin fields that are available using the Azure portal. To learn how, see [How to view and update devices based on device twin properties](/azure/iot-hub/manage-device-twins).

Additionally, the solution back end can query device twins based on all the above data.
For more information about device twins, see [Understand device twins](iot-hub-devguide-device-twins.md). For more information about querying, see [IoT Hub query language](iot-hub-devguide-query-language.md).

This article shows you how to:

* Retrieve a device twin and update it's properties
* Update device twin tags
* Query device twin information, using SQL-like IoT Hub query language
* Use a backend application to add tags and query device twins.
* Report a device twin connectivity channel condition reported property.
* Query devices from your back-end app using filters on the tags and properties previously created.

This article is meant to complement runnable SDK samples that are referenced from within this article.

> [!NOTE]
> See [Azure IoT SDKs](iot-hub-devguide-sdks.md) for more information about the SDK tools available to build both device and back-end apps.

## Prerequisites

* **An IoT hub**. Create one using the [Azure portal, CLI, or PowerShell](create-hub.md). Some SDK calls require the IoT Hub connection string, so make a note of the connection string.

* **A registered device**. Register one in the [Azure portal](create-connect-device.md).

* Make sure that port 8883 is open in your firewall. The device sample in this article uses MQTT protocol, which communicates over port 8883. This port may be blocked in some corporate and educational network environments. For more information and ways to work around this issue, see [Connecting to IoT Hub (MQTT)](../iot/iot-mqtt-connect-to-iot-hub.md#connecting-to-iot-hub).

:::zone pivot="programming-language-csharp"

[!INCLUDE [iot-hub-howto-device-twins-dotnet](../../includes/iot-hub-howto-device-twins-dotnet.md)]

:::zone-end

:::zone pivot="programming-language-java"

[!INCLUDE [iot-hub-howto-device-twins-java](../../includes/iot-hub-howto-device-twins-java.md)]

:::zone-end

:::zone pivot="programming-language-python"

[!INCLUDE [iot-hub-howto-device-twins-python](../../includes/iot-hub-howto-device-twins-python.md)]

:::zone-end

:::zone pivot="programming-language-node"

[!INCLUDE [iot-hub-howto-device-twins-node](../../includes/iot-hub-howto-device-twins-node.md)]

:::zone-end
