---
title: Connect a Rigado Cascade 500 in Azure IoT Central
description: Learn how to configure and connect a Rigado Cascade 500 gateway device to your IoT Central application. 
author: dominicbetts
ms.author: dobett
ms.date: 11/01/2022
services: iot-central
ms.service: iot-central
ms.topic: how-to
ms.custom: [iot-storeAnalytics-conditionMonitor, iot-p0-scenario]

# This article applies to solution builders.
---

# Connect a Rigado Cascade 500 gateway device to your Azure IoT Central application

This article describes how you can connect a Rigado Cascade 500 gateway device to your Microsoft Azure IoT Central application.

## What is Cascade 500?

Cascade 500 IoT gateway is a hardware offering from Rigado that's part of their Cascade Edge-as-a-Service solution. It provides commercial IoT project and product teams with flexible edge computing power, a robust containerized application environment, and a wide variety of wireless device connectivity options such as Bluetooth 5, LTE, and Wi-Fi.

Cascade 500 is certified for Azure IoT Plug and Play and enables you to easily onboard the device into your end-to-end solutions. The Cascade gateway lets you wirelessly connect to various condition monitoring sensors that are in close proximity to the gateway device. You can use the gateway device to onboard these sensors into IoT Central.

## Prerequisites

To complete the steps in this how-to guide, you need:

[!INCLUDE [iot-central-prerequisites-basic](../../../includes/iot-central-prerequisites-basic.md)]

- A Rigado Cascade 500 device. For more information, please visit [Rigado](https://www.rigado.com/).

## Add a device template

To onboard a Cascade 500 gateway device into your Azure IoT Central application instance, you need to configure a corresponding device template within your application.

To add a Cascade 500 device template:

1. Navigate to the **Device Templates** tab in the left pane, select **+ New**

1. The page gives you an option to **Create a custom template** or **Use a preconfigured device template**.

1. Select the Cascade-500 device template from the list of featured device templates.

1. Select **Next: Review** to continue to the next step.

1. On the next screen, select **Create** to onboard the Cascade-500 device template into your IoT Central application.

## Retrieve application connection details

To connect the Cascade 500 device to your IoT Central application, you need to retrieve the **ID Scope** and **Primary key** for your application.

1. Navigate to **Permissions**  in the left pane and select **Device connection groups**.

1. Make a note of the **ID Scope** for your IoT Central application:

    :::image type="content" source="media/howto-connect-rigado-cascade-500/app-scope-id.png" alt-text="Screenshot that shows the ID scope for your application." lightbox="media/howto-connect-rigado-cascade-500/app-scope-id.png":::

1. Now select **SAS-IoT-Edge-Devices** and make a note of the **Primary key**:

    :::image type="content" source="media/howto-connect-rigado-cascade-500/primary-key-sas.png" alt-text="Screenshot that shows the primary SAS key for you device connection group." lightbox="media/howto-connect-rigado-cascade-500/primary-key-sas.png":::

## Contact Rigado to connect the gateway

To connect the Cascade 500 device to your IoT Central application, you need to contact Rigado and provide them with the application connection details from the previous steps.

When the device connects to the internet, Rigado can push down a configuration update to the Cascade 500 gateway device through a secure channel.

This update applies the IoT Central connection details on the Cascade 500 device and it then appears in your devices list:

:::image type="content" source="media/howto-connect-rigado-cascade-500/devices-list-c500.png" alt-text="Screenshot that shows a Cascade-500 device connection to your application." lightbox="media/howto-connect-rigado-cascade-500/devices-list-c500.png":::

You're now ready to use your Cascade-500 device in your IoT Central application.

## Next steps

Some suggested next steps are to:

- Read about [How devices connect](overview-iot-central-developer.md#how-devices-connect)
- Learn how to [Monitor device connectivity using Azure CLI](./howto-monitor-devices-azure-cli.md)
