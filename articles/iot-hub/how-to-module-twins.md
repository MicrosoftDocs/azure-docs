---
title: Get started with module identity and module twins
titleSuffix: Azure IoT Hub
description: Learn how to create module identities and update module twins using the Azure IoT Hub SDKs.
author: kgremban
ms.author: kgremban
manager: lizross
ms.service: iot-hub
ms.devlang: csharp
ms.topic: how-to
ms.date: 09/03/2024
zone_pivot_groups: iot-hub-howto-c2d-2
ms.custom: mqtt, devx-track-csharp, devx-track-dotnet
---

# Get started with IoT Hub module identity and module twin

[Module identities and module twins](iot-hub-devguide-module-twins.md) are similar to Azure IoT Hub device identity and device twin, but provide finer granularity. While Azure IoT Hub device identity and device twin enable the back-end application to configure a device and provide visibility on the device's conditions, a module identity and module twin provide these capabilities for individual components of a device. On capable devices with multiple components, such as operating system devices or firmware devices, module identities and module twins allow for isolated configuration and conditions for each component.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-whole.md)]

This article shows you how to develop two types of applications:

* Device apps can handle requests to update module desired properties and respond with changes to reported properties.
* Service apps can that can set new desired properties.

> [!NOTE]
> This article is meant to complement [Azure IoT SDKs](iot-hub-devguide-sdks.md) samples that are referenced from within this article. You can use SDK tools to build both device and back-end applications.

## Prerequisites

* **An IoT hub**. Some SDK calls require the IoT Hub primary connection string, so make a note of the connection string.

* **A registered device**. Some SDK calls require the device primary connection string, so make a note of the connection string.

* **IoT Hub service connection string**

  In this article, you create a back-end service that adds a device in the identity registry and then adds a module to that device. Your service requires the **registry write** permission. By default, every IoT hub is created with a shared access policy named **registryReadWrite** that grants this permission.

  To get the IoT Hub connection string for the **registryReadWrite** policy, follow these steps:

  1. In the Azure portal, select **Resource groups**. Select the resource group where your hub is located, and then select your hub from the list of resources.

  1. On the left-side pane of your hub, select **Shared access policies**.

  1. From the list of policies, select the **registryReadWrite** policy.

  1. Select the copy icon for the **Primary connection string** and save the value.

  For more information about IoT Hub shared access policies and permissions, see [Control access to IoT Hub with shared access signatures](/azure/iot-hub/authenticate-authorize-sas).

* If your application uses the MQTT protocol, make sure that **port 8883** is open in your firewall. The MQTT protocol communicates over port 8883. This port may be blocked in some corporate and educational network environments. For more information and ways to work around this issue, see [Connecting to IoT Hub (MQTT)](../iot/iot-mqtt-connect-to-iot-hub.md#connecting-to-iot-hub).

* Language SDK requirements:
  * **.NET SDK** - Requires Visual Studio.
  * **Python SDK** - [Python version 3.7 or later](https://www.python.org/downloads/) is recommended. Make sure to use the 32-bit or 64-bit installation as required by your setup. When prompted during the installation, make sure to add Python to your platform-specific environment variable.
  * **Java** - Requires [Java SE Development Kit 8](/azure/developer/java/fundamentals/). Make sure you select **Java 8** under **Long-term support** to navigate to downloads for JDK 8.
  * **Node.js** - Requires Node.js version 10.0.x or later.

:::zone pivot="programming-language-csharp"

[!INCLUDE [iot-hub-howto-module-twins-dotnet](../../includes/iot-hub-howto-module-twins-dotnet.md)]

:::zone-end

:::zone pivot="programming-language-python"

[!INCLUDE [iot-hub-howto-module-twins-python](../../includes/iot-hub-howto-module-twins-python.md)]

:::zone-end

:::zone pivot="programming-language-node"

[!INCLUDE [iot-hub-howto-module-twins-node](../../includes/iot-hub-howto-module-twins-node.md)]

:::zone-end
