---
title: Get started with Azure IoT Hub device twins
titleSuffix: Azure IoT Hub
description: How to use the Azure IoT SDKs to create device and backend service application code for device twins.
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

Use the IoT Hub device and service SDKs to develop applications that handle common device twin tasks. Device twins are JSON documents that store device state information, including metadata, configurations, and conditions. IoT Hub persists a device twin for each device that connects to it.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-whole.md)]

Use device twins to:

* Store device metadata from your solution back end

* Report current state information such as available capabilities and conditions, for example, the connectivity method used, from your device app

* Synchronize the state of long-running workflows, such as firmware and configuration updates, between a device app and a back-end app

* Query your device metadata, configuration, or state

Device twins are designed for synchronization and for querying device configurations and conditions. For more information about device twins, including when to use device twins, see [Understand device twins](iot-hub-devguide-device-twins.md).

IoT Hubs store device twins, which contain the following elements:

* **Tags**. Device metadata accessible only by the solution back end.

* **Desired properties**. JSON objects modifiable by the solution back end and observable by the device app.

* **Reported properties**. JSON objects modifiable by the device app and readable by the solution back end.

Tags and properties can't contain arrays, but can contain nested objects.

The following illustration shows device twin organization:

:::image type="content" source="../../includes/media/iot-hub-selector-twin-get-started/twin.png" alt-text="Screenshot of a device twin concept diagram.":::

It is useful to review the various device twin fields that are available using the Azure portal. To learn how, see [How to view and update devices based on device twin properties](/azure/iot-hub/manage-device-twins).

Additionally, the solution back end can query device twins based on all the above data. For more information about querying, see [IoT Hub query language](iot-hub-devguide-query-language.md).

This article shows you how to:

* View device twin and update reported properties
* Update device twin tags
* Create a device desired property update notificaton callback
* Use a backend application to update tags and desired properties
* Query devices from your back-end app using filters on the tags and properties previously created

> [!NOTE]
> This article is meant to complement [Azure IoT SDKs](iot-hub-devguide-sdks.md) samples that are referenced from within this article. You can use SDK tools to build both device and back-end applications.

## Prerequisites

* **An IoT hub**. Some SDK calls require the IoT Hub primary connection string, so make a note of the connection string.

* **A registered device**. Some SDK calls require the device primary connection string, so make a note of the connection string.

* Make sure that **port 8883** is open in your firewall. The device sample in this article uses MQTT protocol, which communicates over port 8883. This port may be blocked in some corporate and educational network environments. For more information and ways to work around this issue, see [Connecting to IoT Hub (MQTT)](../iot/iot-mqtt-connect-to-iot-hub.md#connecting-to-iot-hub).

* **IoT Hub service connection string**

  In this article, you create a back-end service that adds desired properties to a device twin and then queries the identity registry to find all devices with reported properties that have been updated accordingly. Your service needs the **service connect** permission to modify desired properties of a device twin, and it needs the **registry read** permission to query the identity registry. There is no default shared access policy that contains only these two permissions, so you need to create one.

  To create a shared access policy that grants **service connect** and **registry read** permissions and get a connection string for this policy, follow these steps:

  1. In the Azure portal, select **Resource groups**. Select the resource group where your hub is located, and then select your hub from the list of resources.

  1. On the left-side pane of your hub, select **Shared access policies**.

  1. From the top menu above the list of policies, select **Add shared policy access policy**.

  1. In the **Add shared access policy** pane on the right, enter a descriptive name for your policy, such as "serviceAndRegistryRead". Under **Permissions**, select **Registry Read** and **Service Connect**, and then select **Add**.

  1. Select your new policy from the list of policies.

  1. Select the copy icon for the **Primary connection string** and save the value.

  For more information about IoT Hub shared access policies and permissions, see [Access control and permissions](/azure/iot-hub/authenticate-authorize-sas).

* Language SDK requirements:
  * **.NET SDK** - Requres Visual Studio.
  * **Python SDK** - [Python version 3.7 or later](https://www.python.org/downloads/) is recommended. Make sure to use the 32-bit or 64-bit installation as required by your setup. When prompted during the installation, make sure to add Python to your platform-specific environment variable.
  * **Java** - [Java SE Development Kit 8](/azure/developer/java/fundamentals/) is required to use the SDK. Make sure you select **Java 8** under **Long-term support** to navigate to downloads for JDK 8.
  * **Node.js** - Node.js version 10.0.x or later is required to use the SDK.

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
