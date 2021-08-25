---
title: Quickstart - Create and use an Azure IoT Central application | Microsoft Docs
description: Quickstart - Create a new Azure IoT Central application and connect your first device. This quickstart uses a smartphone app from either the Google Play or Apple app store as an IoT device.
author: dominicbetts
ms.author: dobett
ms.date: 05/27/2021
ms.topic: quickstart
ms.service: iot-central
services: iot-central
---

# Quickstart - Create an Azure IoT Central application and use your smartphone to send telemetry

This quickstart shows you how to create an Azure IoT Central application and connect your first device. To get you started quickly, you install an app on your smartphone to act as the device. The app app sends telemetry, reports properties, and responds to commands:

:::image type="content" source="media/quick-deploy-iot-central/overview.png" alt-text="Overview of quickstart scenario connecting a smartphone app to IoT Central." border="false":::

## Prerequisites

An active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

> [!TIP]
> You should have at least **Contributor** access in your Azure subscription. If you created the subscription yourself, you're automatically an administrator with sufficient access. To learn more, see [What is Azure role-based access control?](../../role-based-access-control/overview.md)

An Android or iOS phone on which you're able to install a free app from one of the official app stores.

## Create an application

Navigate to the [Azure IoT Central Build](https://aka.ms/iotcentral) site. Then sign in with the Microsoft personal, work, or school account associated with your Azure subscription.

IoT Central provides various industry-focused application templates to help you get started. This quickstart uses the **Custom application** template to create an application from scratch:

1. Navigate to the **Build** page and select **Create app** in the **Custom app** tile:

    :::image type="content" source="media/quick-deploy-iot-central/iotcentralcreate-new-application.png" alt-text="Build your IoT application page":::

1. On the **New application** page, make sure that **Custom application** is selected under the **Application template**.

1. Azure IoT Central automatically suggests an **Application name** based on the application template you've selected. Enter your own application name such as *Contoso quickstart app*.

1. Azure IoT Central also generates a unique **URL** prefix for you, based on the application name. You use this URL to access your application. Change this URL prefix to something more memorable if you'd like. This URL must be unique.

    :::image type="content" source="media/quick-deploy-iot-central/iotcentralcreate-custom.png" alt-text="Azure IoT Central Create an application page":::

1. For this quickstart, leave the pricing plan set to **Standard 2**.

1. Select your subscription in the **Azure subscription** drop-down.

1. Select your closest location in the **Location** drop-down.

1. Review the Terms and Conditions, and select **Create** at the bottom of the page. After a few seconds, your IoT Central application is ready to use:

    :::image type="content" source="media/quick-deploy-iot-central/iotcentral-application.png" alt-text="Azure IoT Central application":::

## Register a device

To connect a device to to your IoT Central application, you need some connection information. An easy way to get this connection information is to register your device.

To register your device:

1. In IoT Central, navigate to the **Devices** page and select **Create a device**:

    :::image type="content" source="media/quick-deploy-iot-central/create-device.png" alt-text="Screenshot that shows create a device in IoT Central.":::

1. On the **Create a new device** page, accept the defaults, and then select **Create**.

1. In the list of devices, click the device name:

    :::image type="content" source="media/quick-deploy-iot-central/device-name.png" alt-text="A screenshot that shows the highlighted device name that you can select.":::

1. On the device page, select **Connect** and then **QR Code**:

    :::image type="content" source="media/quick-deploy-iot-central/device-registration.png" alt-text="Screenshot that shows the QR code you can use to connect the phone app.":::

Keep this page open. In the next section you scan this QR code using the phone app to connect it to IoT Central.

## Connect your device

To get you started quickly, this article uses the **IoT Plug and Play** smartphone app as an IoT device. The app sends telemetry collected from the phone's sensors, responds to commands invoked from IoT Central, and reports property values to IoT Central.

[!INCLUDE [iot-phoneapp-install](../../../includes/iot-phoneapp-install.md)]

To connect the **IoT Plug and Play** app to you Iot Central application:

1. Open the **IoT PnP** app on your smartphone.

1. On the welcome page, select **Scan QR code**. Point the phone's camera at the QR code. Then wait for a few seconds while the connection is established.

1. On the telemetry page in the app, you can see the data the app is sending to IoT Central. On the logs page, you can see the device connecting and several initialization messages.

To view the telemetry from the smartphone app in IoT Central:

1. In IoT Central, navigate to the **Devices** page.

1. In the list of devices, click on your device name, then select **Overview**:

    :::image type="content" source="media/quick-deploy-iot-central/iotcentral-telemetry.png" alt-text="Screenshot of the overview page with telemetry plots.":::

> [!TIP]
> The smartphone app only sends data when the screen is on.
## Clean up resources

[!INCLUDE [iot-central-clean-up-resources](../../../includes/iot-central-clean-up-resources.md)]

## Next steps

In this quickstart, you created an IoT Central application and connected device that sends telemetry. In this quickstart, you used a smartphone app as the IoT device that connects to IoT Central. Here's the suggested next step to continue learning about IoT Central:

> [!div class="nextstepaction"]
> [Add a rule to your IoT Central application](./quick-configure-rules.md)
