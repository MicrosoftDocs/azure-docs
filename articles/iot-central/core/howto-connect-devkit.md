---
title: Connect a DevKit device to your Azure IoT Central application | Microsoft Docs
description: As a device developer, learn how to connect an MXChip IoT DevKit device to your Azure IoT Central application using IoT Plug and Play (preview).
author: liydu
ms.author: liydu
ms.date: 12/03/2019
ms.topic: how-to
ms.service: iot-central
services: iot-central
manager: jeffya
---

# Connect an MXChip IoT DevKit device to your Azure IoT Central application

*This article applies to device developers.*

This article shows you how to connect an MXChip IoT DevKit (DevKit) device to an Azure IoT Central application. The device uses the certified IoT Plug and Play (preview) model for the DevKit device to configure its connection to IoT Central.

In this how-to article, you:

- Get the connection details from your IoT Central application.
- Prepare the device and connect it to your IoT Central application.
- View the telemetry and properties from the device in IoT Central.

## Prerequisites

To complete the steps in this article, you need the following resources:

- A [DevKit device](https://aka.ms/iot-devkit-purchase).
- An IoT Central application. You can follow the steps in [Create an IoT Central application](./quick-deploy-iot-central.md).

## Get device connection details

1. In your Azure IoT Central application, select the **Device Templates** tab and select **+ New**. In the section **Use a preconfigured device template**, select **MXChip IoT DevKit**.

    ![Device template for MXChip IoT DevKit](media/howto-connect-devkit/device-template.png)

1. Select **Next: Customize** and then **Create**.

1. Select **Devices** tab. In the devices list, select **MXChip IoT DevKit** and select **+ New** to create a new device from the template.

    ![New device](media/howto-connect-devkit/new-device.png)

1. In the pop-up window, enter the **Device ID** as `SampleDevKit` and **Device Name** as `MXChip IoT DevKit - Sample`. Make sure the **Simulated** option is off. Then select **Create**.

    ![Device ID and name](media/howto-connect-devkit/device-id-name.png)

1. Select the device you created and then select **Connect**. Make a note of the **ID Scope**, **Device ID**, and **Primary key**. You need these values later in this how-to article.

    ![Device connection info](media/howto-connect-devkit/device-connection-info.png)

## Prepare the device

1. Download the latest [pre-built Azure IoT Central Plug and Play (preview) firmware](https://github.com/Azure-Samples/mxchip-iot-devkit-pnp/raw/master/bin/iotc_devkit.bin) for the DevKit device from GitHub.

1. Connect the DevKit device to your development machine using a USB cable. In Windows, a file explorer window opens on a drive mapped to the storage on the DevKit device. For example, the drive might be called **AZ3166 (D:)**.

1. Drag the **iotc_devkit.bin** file onto the drive window. When the copying is complete, the device reboots with the new firmware.

    > [!NOTE]
    > If you see errors on the screen such as **No Wi-Fi**, this is because the DevKit has not yet been connected to WiFi.

1. On the DevKit, hold down **button B**, push and release the **Reset** button, and then release **button B**. The device is now in access point mode. To confirm, the screen displays "IoT DevKit - AP" and the configuration portal IP address.

1. On your computer or tablet, connect to the WiFi network name shown on the screen of the device. The WiFi network starts with **AZ-** followed by the MAC address. When you connect to this network, you don't have internet access. This state is expected, and you only connect to this network for a short time while you configure the device.

1. Open your web browser and navigate to [http://192.168.0.1/](http://192.168.0.1/). The following web page displays:

    ![Config UI](media/howto-connect-devkit/config-ui.png)

    On the web page, enter:

    - The name of your WiFi network (SSID).
    - Your WiFi network password.
    - The connection details: enter the **Device ID**, **ID Scope**, and **SAS Primary Key** you made a note of previously.

    > [!NOTE]
    > Currently, the IoT DevKit only can connect to 2.4 GHz Wi-Fi, 5 GHz is not supported due to hardware restrictions.

1. Choose **Configure Device**, the DevKit device reboots and runs the application:

    ![Reboot UI](media/howto-connect-devkit/reboot-ui.png)

    The DevKit screen displays a confirmation that the application is running:

    ![DevKit running](media/howto-connect-devkit/devkit-running.png)

The DevKit first registers a new device in IoT Central application and then starts sending data.

## View the telemetry

In this step, you view the telemetry in your Azure IoT Central application.

In your IoT Central application, select **Devices** tab, select the device you added. In the **Overview** tab, you can see the telemetry from the DevKit device:

![IoT Central device overview](media/howto-connect-devkit/mxchip-overview-page.png)

## Review the code

To review the code or modify and compile it, go to the [Code Samples](https://docs.microsoft.com/samples/azure-samples/mxchip-iot-devkit-pnp/sample/).

## Next steps

If you're a device developer, some suggested next steps are to:

- Read about [Device connectivity in Azure IoT Central](./concepts-get-connected.md)
- Learn how to [Monitor device connectivity using Azure CLI](./howto-monitor-devices-azure-cli.md)
