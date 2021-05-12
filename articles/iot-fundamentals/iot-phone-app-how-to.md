---
title: Use a smartphone IoT device app Azure services
description: A how-to guide that shows how to connect and use IoT device app running on a smartphone to connect to an Azure IoT service.
author: dominicbetts
ms.service: iot-fundamentals
services: iot-fundamentals
ms.topic: how-to
ms.date: 05/12/2021
ms.author: dobett

---

# Use an IoT device app running on a smartphone with Azure IoT services

An Azure IoT solution lets you connect your IoT devices to a cloud-based IoT service. Devices send telemetry, such as temperature and humidity and respond to commands such as reboot and change delivery interval. Devices can also synchronize their internal state with the service, sharing properties such as device model and operating system.

## What is the app

To get you started quickly, this article uses a smartphone app as an IoT device. The app sends telemetry collected from the phone's sensors, responds to commands invoked from the service, and reports property values.

You can use this smartphone app to:

- Explore a basic IoT scenario.
- Test your configuration.
- As a starting point for your custom device development.

## Install the app

You can install the app from one of the app stores:

- Link to Android app store
- Link to Apple app store

To view or download the app source code, see link to GitHub repo.

## App features

### Connect

The app supports three connection scenarios:

- You can connect to an IoT Central application by scanning a QR code in IoT Central.
- You can use the Device Provisioning Service (DPS) to connect to an IoT hub.
- You can use a connection-string to connect directly to an IoT hub.

To learn more, see [Connect the app](#connect-the-app) later in this guide.

### Telemetry

The app collects data from sensors on the phone to send as telemetry to the IoT service you're using:

:::image type="content" source="media/iot-phone-app-how-to/telemetry.png" alt-text="Screenshot of telemetry page in mobile app.":::

### Properties

The app reports device status, such as device model and manufacturer. There's also an editable property that you can modify and see the change synchronize with the service:

:::image type="content" source="media/iot-phone-app-how-to/properties.png" alt-text="Screenshot that shows properties page in mobile device app.":::

### Image upload

Both IoT Central and IoT Hub enable file upload to Azure storage from a device. The mobile app lets you upload an image from the device:

:::image type="content" source="media/iot-phone-app-how-to/image-upload.png" alt-text="Screenshot that shows the image upload page in the mobile app.":::

<!-- To do - Change this to link to doc sources instead... -->
To learn more about configuring your service to support file uploads from a device, see:

- [Upload files from your device to the cloud with IoT Hub](../iot-hub/iot-hub-csharp-csharp-file-upload.md).
- [Upload files from your device to the cloud with IoT Central](../iot-central/core/howto-configure-file-uploads.md).

### Logs

The mobile app writes events to a local log file that you can view from within the app:

:::image type="content" source="media/iot-phone-app-how-to/logs.png" alt-text="Screenshot that shows the log page in the mobile app.":::

### Settings

The settings page in the app lets you:

- Review the current device registration information.
- Reset the app by clearing the stored data.
- Customize the app appearance.
- Set the frequency that the app sends telemetry to your IoT service.

:::image type="content" source="media/iot-phone-app-how-to/settings.png" alt-text="Screenshot of the settings page in the mobile app.":::

## Connect the app

The app supports the following three connection scenarios:

# [IoT Central](#tab/iot-central)

### Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

<!-- To do: does this need an app template? -->
Create an IoT Central application. To learn more, see [Create an IoT Central application](../iot-central/core/howto-create-iot-central-application.md).

### Register a device

Before you connect the phone app, you need to register a device in your IoT Central application. When you create a device registration, IoT Central generates the device connection information.

In IoT Central, a device registration also associates the device with a device template. The device template defines the telemetry, properties, and commands the device supports and enables IoT Central to create dashboards for the device.

To register the device in IoT Central:

1. Sign in to your IoT Central application and navigate to the **Devices** page.

1. Select the **Smartphone** device template, and then select **Create a device**:

    :::image type="content" source="media/iot-phone-app-how-to/iot-central-create-device.png" alt-text="Screenshot showing IoT Central devices page ready to add a smartphone device.":::

1. On the **Create a new device** page, select **Create**.

1. On the list of devices, click on the device name and then select **Connect**. On the **Device connection** page you can see the QR code that you'll scan in the smartphone app:

    :::image type="content" source="media/iot-phone-app-how-to/device-connection-qr-code.png" alt-text="Screenshot showing the device connection page with the QR code.":::

### Connect the device

After you register the device in IoT Central, you can connect the smartphone app by scanning the QR code. To connect the app:

1. Open the **IoT_PnP** app on your smartphone.

1. On the welcome page, select **Scan QR code**. Point the phone's camera at the QR code. Then wait for a few seconds while the connection is established.

1. On the telemetry page in the app, you can see the data the app is sending to IoT Central. On the logs page, you can see the device connecting and several initialization messages.

1. On the **Settings > Registration** page, you can see the device ID and ID scope that the app used to connect to IoT Central.

To learn more about how devices connect to IoT Central, see [Get connected to Azure IoT Central](../iot-central/core/concepts-get-connected.md).

### Verify the connection

To view the data the device is sending in your IoT Central application:

1. Sign in to your IoT Central application and navigate to the **Devices** page.

1. On the list of devices, click on the device name and then select **Overview**. The **Overview** page shows the telemetry from the smartphone sensors:

    :::image type="content" source="media/iot-phone-app-how-to/smartphone-overview.png" alt-text="Screenshot of the device overview page in IoT Central that shows the telemetry from the smartphone sensors.":::

1. Explore the other device pages. The **Properties** page shows properties sent by the device. The **Commands** page lets you invoke commands in the smartphone app. The logs page in the app shows when the device receives a command. The **Raw data** page shows all the data coming from the device.

# [IoT Hub with DPS](#tab/iot-hub-dps)

### Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

You need an IoT hub linked to a DPS instance. To create these resources in your Azure subscription, select the **Deploy to Azure** button below to open the deployment template. In the template:

- Create a new resource group called `smartphonehub_rg`. You can easily delete the resources when you've finished by deleting the resource group.
- Select the region closest to you.
- Enter a unique IoT hub name.
- Enter a unique provisioning service name.

[![Deploy to Azure in overview](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3a%2f%2fraw.githubusercontent.com%2fAzure%2fazure-quickstart-templates%2fmaster%2f101-iothub-device-provisioning%2fazuredeploy.json)

To learn more, see [Quickstart: Set up the IoT Hub Device Provisioning Service (DPS) with an ARM template](../iot-dps/quick-setup-auto-provision-rm.md).

To complete some of the following steps, you use the Azure CLI:

[!INCLUDE [azure-cli-prepare-your-environment-no-header](../../includes/azure-cli-prepare-your-environment-no-header.md)]

### Configure device enrollment

In this walkthrough, you use an individual device enrollment in DPS to assign the smartphone app to your IoT hub. To create an individual enrollment for your device, run the following Azure CLI command. Replace `{your DPS name}` with the name you chose when you created your DPS instance:

```azurecli
az iot dps enrollment create -g smartphonehub_rg --enrollment-id smartphone-01 --attestation-type symmetrickey --dps_name {your DPS name}
```

To retrieve the primary key that the smartphone app needs to connect, run the following command:

```azurecli
az iot dps enrollment show -g smartphonehub_rg --enrollment-id smartphone-01 --keys true --query attestation.symmetricKey.primaryKey --dps-name {your DPS name}
```

To retrieve the scope ID that the smartphone app needs to connect, run the following command:

```azurecli
az iot dps show -g smartphonehub_rg --query properties.idScope --name {your DPS name}
```

To learn more about device enrollment in DPS, see [DPS terminology > Enrollment](../iot-dps/concepts-service.md#enrollment).

### Connect the device

> [!TIP]
> To make it easier to enter the connection details in the smartphone app, you may want to save them in an app that you can access in both your desktop environment and on your smartphone.

After you create the enrollment group in DPS, you can connect the smartphone app by entering the scope ID, registration ID, and primary key. To connect the app:

1. Open the **IoT_PnP** app on your smartphone.

1. On the welcome page, select **Scan QR code**, and then select **Manually connect**.

1. Enter `smartphone-01` as the device ID and use the scope ID you made a note of previously.

1. Select **Device key** and enter the primary key you made a note of previously.

1. On the telemetry page in the app, you can see the data the app is sending to IoT Hub. On the logs page, you can see the device connecting and several initialization messages.

1. On the **Settings > Registration** page, you can see the device ID and ID scope that the app used to connect to DPS.

### Verify the connection

To verify that the smartphone app has connected to the cloud and is sending telemetry:

1. Use the following command to verify the device is connected to your IoT hub. Replace `{your IoT Hub name}` with the name you chose when you created your IoT hub:

    ```azurecli
    az iot hub device-identity list --query '[].{"Device Id":deviceId, "Connection state":connectionState}' --hub-name {your IoT Hub name}
    ```

    If the smartphone app is connected, the **Connection state** is **Connected**.

1. Use the following command to view the property values sent from the device:

    ```azurecli
    az iot hub digital-twin show --device-id smartphone-01 --hub-name {your IoT Hub name}
    ```

1. Use the following command to view the telemetry the smartphone app is sending to your IoT hub:

    ```azurecli
    az iot hub monitor-events -d smartphone-01 -n {your IoT Hub name}
    ```

### Clean up resources

If you've finished with the IoT hub and DPS instance, run the following command to delete the resources from your Azure subscription:

```azurecli
az group delete --name smartphonehub_rg
```

# [IoT Hub with connection string](#tab/iot-hub)

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

To complete some of the following steps, you use the Azure CLI:

[!INCLUDE [azure-cli-prepare-your-environment-no-header](../../includes/azure-cli-prepare-your-environment-no-header.md)]

You need an IoT hub in your Azure subscription. To create resource group called `smartphonehub_rg` and an IoT hub instance, run the following commands. Replace `{your IoT Hub name}` with a unique name for your IoT hub:

```azurecli
az group create --name smartphonehub_rg --location eastus
az iot hub create -g smartphonehub_rg --hub-name {your IoT Hub name}
```

To learn more about how to create an IoT hub, see [Create an IoT hub](../iot-hub/iot-hub-create-through-portal.md).

You can easily delete the resources when you've finished by deleting the `smartphonehub_rg` resource group.

### Register your device

In this walkthrough, you create a device registration in your IoT hub. to register a device with your IoT hub, running the following command. Replace `{your IoT Hub name}` with the name you chose when you created your IoT hub:

```azurecli
az iot hub device-identity create --device-id smartphone-01 --hub-name {your IoT Hub name}
```

To retrieve the connection string the smartphone app needs to connect, run the following command:

```azurecli
az iot hub device-identity connection-string show --device-id smartphone-01 -o table --hub-name {your IoT Hub name}
```

The connection string looks like `HostName=yourhubname.azure-devices.net;DeviceId=smartphone-01;SharedAccessKey=Be6...XE=`.

### Connect the device

> [!TIP]
> To make it easier to enter the connection string in the smartphone app, you may want to save it in an app that you can access in both your desktop environment and on your smartphone.

To connect the app using the device connection string:

1. Open the **IoT_PnP** app on your smartphone.

1. On the welcome page, select **Scan QR code**, and then select **Manually connect**.

1. Select **Enter IoT Hub device connection string**.

1. Enter the device connection string you made a note of previously and select **Connect**.

1. On the telemetry page in the app, you can see the data the app is sending to IoT Hub. On the logs page, you can see the device connecting and several initialization messages.

1. On the **Settings > Registration** page, you can see the connection string that the app used to connect to your IoT hub.

### Verify the connection

To verify that the smartphone app has connected to the cloud and is sending telemetry:

1. Use the following command to verify the device is connected to your IoT hub. Replace `{your IoT Hub name}` with the name you chose when you created your IoT hub:

    ```azurecli
    az iot hub device-identity list --query '[].{"Device Id":deviceId, "Connection state":connectionState}' --hub-name {your IoT Hub name}
    ```

    If the smartphone app is connected, the **Connection state** is **Connected**.

1. Use the following command to view the property values sent from the device:

    ```azurecli
    az iot hub digital-twin show --device-id smartphone-01 --hub-name {your IoT Hub name}
    ```

1. Use the following command to view the telemetry the smartphone app is sending to your IoT hub:

    ```azurecli
    az iot hub monitor-events -d smartphone-01 -n {your IoT Hub name}
    ```

### Clean up resources

If you've finished with the IoT hub instance, run the following command to delete the resources from your Azure subscription:

```azurecli
az group delete --name smartphonehub_rg
```

---

## Next steps
