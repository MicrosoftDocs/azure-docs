---
title: Tutorial - Connect a generic client app to Azure IoT Central | Microsoft Docs
description: This tutorial shows you how, as a device developer, to connect a device running either a C, C#, Java, JavaScript, or Python client app to your Azure IoT Central application. You modify the automatically generated device template by adding views that let an operator interact with a connected device.
author: dominicbetts
ms.author: dobett
ms.date: 11/24/2020
ms.topic: tutorial
ms.service: iot-central
services: iot-central
ms.custom: [mqtt, device-developer]
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

# As a device developer, I want to try out using device code that uses one of the the Azure IoT device SDKs. I want to understand how to send telemetry from a device, synchronize properties with the device, and control the device using commands.
---

# Tutorial: Create and connect a client application to your Azure IoT Central application

*This article applies to solution builders and device developers.*

This tutorial shows you how, as a device developer, to connect a client application to your Azure IoT Central application. The application simulates the behavior of a thermostat device. When the application connects to IoT Central, it sends the model ID of the thermostat device model. IoT Central uses the model ID to retrieve the device model and create a device template for you. You add customizations and views to the device template to enable an operator to interact with a device.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create and run the device code and see it connect to your IoT Central application.
> * View the simulated telemetry sent from the device.
> * Add custom views to a device template.
> * Publish the device template.
> * Use a view to manage device properties.
> * Call a command to control the device.

:::zone pivot="programming-language-ansi-c"

[!INCLUDE [iot-central-connect-device-c](../../../includes/iot-central-connect-device-c.md)]

:::zone-end

:::zone pivot="programming-language-csharp"

[!INCLUDE [iot-central-connect-device-csharp](../../../includes/iot-central-connect-device-csharp.md)]

:::zone-end

:::zone pivot="programming-language-java"

[!INCLUDE [iot-central-connect-device-java](../../../includes/iot-central-connect-device-java.md)]

:::zone-end

:::zone pivot="programming-language-javascript"

[!INCLUDE [iot-central-connect-device-nodejs](../../../includes/iot-central-connect-device-nodejs.md)]

:::zone-end

:::zone pivot="programming-language-python"

[!INCLUDE [iot-central-connect-device-python](../../../includes/iot-central-connect-device-python.md)]

:::zone-end

## View raw data

As a device developer, you can use the **Raw data** view to examine the raw data your device is sending to IoT Central:

:::image type="content" source="media/tutorial-connect-device/raw-data.png" alt-text="The raw data view":::

On this view, you can select the columns to display and set a time range to view. The **Unmodeled data** column shows data from the device that doesn't match any property or telemetry definitions in the device template.

## Clean up resources

[!INCLUDE [iot-central-clean-up-resources](../../../includes/iot-central-clean-up-resources.md)]

## Next steps

If you'd prefer to continue through the set of IoT Central tutorials and learn more about building an IoT Central solution, see:

> [!div class="nextstepaction"]
> [Create a gateway device template](./tutorial-define-gateway-device-type.md)

As a device developer, now that you've learned the basics of how to create a device using Java, some suggested next steps are to:

* Read [What are device templates?](./concepts-device-templates.md) to learn more about the role of device templates when you're implementing your device code.
* Read [Get connected to Azure IoT Central](./concepts-get-connected.md) to learn more about how to register devices with IoT Central and how IoT Central secures device connections.
* Read [Telemetry, property, and command payloads](concepts-telemetry-properties-commands.md) to learn more about the data the device exchanges with IoT Central.
* Read [IoT Plug and Play device developer guide](../../iot-pnp/concepts-developer-guide-device.md).
