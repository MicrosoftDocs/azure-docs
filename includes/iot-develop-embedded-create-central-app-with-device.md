---
 title: include file
 description: include file
 author: timlt
 ms.service: iot-develop
 ms.topic: include
 ms.date: 05/17/2021
 ms.author: timlt
 ms.custom: include file
---

## Create the cloud components

### Create the IoT Central application

There are several ways to connect devices to Azure IoT. In this section, you learn how to connect a device by using Azure IoT Central. IoT Central is an IoT application platform that reduces the cost and complexity of creating and managing IoT solutions.

To create a new application:
1. From [Azure IoT Central portal](https://apps.azureiotcentral.com/), select **My apps** on the side navigation menu.
1. Select **+ New application**.
1. Select **Custom apps**.
1. Add Application Name and a URL.
1. Choose the **Free** Pricing plan to activate a 7-day trial.

    :::image type="content" source="media/iot-develop-embedded-create-central-app-with-device/iot-central-create-custom.png" alt-text="Create a custom app in Azure IoT Central":::

1. Select **Create**.

    After IoT Central provisions the application, it redirects you automatically to the new application dashboard.

    > [!NOTE]
    > If you have an existing IoT Central application, you can use it to complete the steps in this article rather than create a new application.

### Create a new device

In this section, you use the IoT Central application dashboard to create a new device. You will use the connection information for the newly created device to securely connect your physical device in a later section.

To create a device:
1. From the application dashboard, select **Devices** on the side navigation menu.
1. Select **+ New** to open the **Create a new device** window.
1. Leave Device template as **Unassigned**.
1. Fill in the desired Device name and Device ID.

    :::image type="content" source="media/iot-develop-embedded-create-central-app-with-device/iot-central-create-device.png" alt-text="Create a device in Azure IoT Central":::

1. Select the **Create** button.
1. The newly created device will appear in the **All devices** list.  Select on the device name to show details.
1. Select **Connect** in the top right menu bar to display the connection information used to configure the device in the next section.

    :::image type="content" source="media/iot-develop-embedded-create-central-app-with-device/iot-central-device-connection-info.png" alt-text="View device connection details":::

1. Note the connection values for the following connection string parameters displayed in **Connect** dialog. You'll add these values to a configuration file in the next step:

    > * `ID scope`
    > * `Device ID`
    > * `Primary key`