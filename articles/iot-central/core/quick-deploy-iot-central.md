---
title: Quickstart - Connect a device to Azure IoT Central
description: In this quickstart, you learn how to connect your first device to a new IoT Central application. This quickstart uses a smartphone app as an IoT device.
author: dominicbetts
ms.author: dobett
ms.date: 10/28/2022
ms.topic: quickstart
ms.service: iot-central
services: iot-central
ms.custom: [mode-other, iot-central-frontdoor, contperf-fy22q4]

# Customer intent: As a new user of IoT Central, I want to learn how to get started with an IoT Central application and an IoT device.
---

# Quickstart - Use your smartphone as a device to send telemetry to an IoT Central application

Get started with an Azure IoT Central application and connect your first device. To get you started quickly, you install an app on your smartphone to act as the device. The app sends telemetry, reports properties, and responds to commands:

:::image type="content" source="media/quick-deploy-iot-central/overview.png" alt-text="Overview of quickstart scenario connecting a smartphone app to IoT Central." border="false":::

In this quickstart, you:

- Create an IoT Central application.
- Register a new device in the application.
- Connect a device to the application and view the telemetry it sends.
- Control the device from your application.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).

    You should have at least **Contributor** access in your Azure subscription. If you created the subscription yourself, you're automatically an administrator with sufficient access. To learn more, see [What is Azure role-based access control?](../../role-based-access-control/overview.md)

- An Android or iOS smartphone on which you're able to install a free app from one of the official app stores.

## Create an application

IoT Central provides various industry-focused application templates to help you get started. This quickstart uses the **Custom application** template to create an application from scratch:

1. Navigate to the [Create IoT Central Application](https://portal.azure.com/#create/Microsoft.IoTCentral) page in the Azure portal. If prompted, sign in with your Azure account.

1. Enter the following information:

    | Field | Description |
    | ----- | ----------- |
    | Subscription | The Azure subscription you want to use. |
    | Resource group | The resource group you want to use.  You can create a new resource group or use an existing one. |
    | Resource name | A valid Azure resource name such as *my-contoso-app*. |
    | Application URL | A URL subdomain for your application such as *my-contoso-app*. The URL for an IoT Central application looks like `https://my-contoso-app.azureiotcentral.com`. |
    | Template | **Custom application** |
    | Region | The Azure region you want to use. |
    | Pricing plan | **Standard 2**|

1. Select **Review + create**. Then select **Create**.

[!INCLUDE [iot-central-navigate-from-portal](../../../includes/iot-central-navigate-from-portal.md)]

## Register a device

To connect a device to your IoT Central application, you need some connection information. An easy way to get this connection information is to register your device.

To register your device:

1. In IoT Central, navigate to the **Devices** page and select **Add a device**:

    :::image type="content" source="media/quick-deploy-iot-central/create-device.png" alt-text="Screenshot that shows create a device in IoT Central." lightbox="media/quick-deploy-iot-central/create-device.png":::

1. On the **Create a new device** page, accept the defaults, and then select **Create**.

1. In the list of devices, click on the device name:

    :::image type="content" source="media/quick-deploy-iot-central/device-name.png" alt-text="A screenshot that shows the highlighted device name that you can select." lightbox="media/quick-deploy-iot-central/device-name.png":::

1. On the device page, select **Connect** and then **QR Code**:

    :::image type="content" source="media/quick-deploy-iot-central/device-registration.png" alt-text="Screenshot that shows the QR code you can use to connect the smartphone app." lightbox="media/quick-deploy-iot-central/device-registration.png":::

Keep this page open. In the next section, you scan this QR code using the smartphone app to connect it to IoT Central.

> [!TIP]
> The QR code contains the information, such as the registered device ID, your device needs to establish a connection to your IoT Central application. It saves you from the need to enter the connection information manually.

## Connect your device

To get you started quickly, this article uses the **IoT Plug and Play** smartphone app as an IoT device. The app sends telemetry collected from the smartphone's sensors, responds to commands invoked from IoT Central, and reports property values to IoT Central.

[!INCLUDE [iot-phoneapp-install](../../../includes/iot-phoneapp-install.md)]

To connect the **IoT Plug and Play** app to your Iot Central application:

1. Open the **IoT PnP** app on your smartphone.

1. On the welcome page, select **Scan QR code**. Point the smartphone's camera at the QR code. Then wait for a few seconds while the connection is established.

1. On the telemetry page in the app, you can see the data the app is sending to IoT Central. On the logs page, you can see the device connecting and several initialization messages.

To view the telemetry from the smartphone app in IoT Central:

1. In IoT Central, navigate to the **Devices** page.

1. In the list of devices, click on the device name, then select **Overview**:

    :::image type="content" source="media/quick-deploy-iot-central/iot-central-telemetry.png" alt-text="Screenshot of the overview page with telemetry plots." lightbox="media/quick-deploy-iot-central/iot-central-telemetry.png":::

> [!TIP]
> The smartphone app only sends data when the screen is on.

## Control your device

To send a command from IoT Central to your device, select the **Commands** view for your device. The smartphone app can respond to three commands:

:::image type="content" source="media/quick-deploy-iot-central/device-commands.png" alt-text="Screenshot that shows the three commands the smartphone app responds to." lightbox="media/quick-deploy-iot-central/device-commands.png":::

To make the light on your smartphone flash, use the **LightOn** command. Set the duration to three seconds, the pulse interval to five seconds, and the number of pulses to two. Select **Run** to send the command to the smartphone app. The light on your smartphone app flashes twice.

To see the acknowledgment from the smartphone app, select **command history**.

## Clean up resources

[!INCLUDE [iot-central-clean-up-resources](../../../includes/iot-central-clean-up-resources.md)]

## Next steps

In this quickstart, you created an IoT Central application and connected device that sends telemetry. Then you used a smartphone app as the IoT device that connects to IoT Central. Here's the suggested next step to continue learning about IoT Central:

> [!div class="nextstepaction"]
> [Add a rule to your IoT Central application](./quick-configure-rules.md)
