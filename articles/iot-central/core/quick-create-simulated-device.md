---
title: Quickstart - Add a simulated device to Azure IoT Central
description: This quickstart shows how to create a device template and add a simulated device to your IoT Central application.
author: dominicbetts
ms.author: dobett
ms.date: 11/16/2020
ms.topic: quickstart
ms.service: iot-central
services: iot-central
ms.custom: mvc

#Customer intent: As a builder, I want to try out creating a device template and adding a simulated device to my IoT Central application.
---

# Quickstart: Add a simulated device to your IoT Central application

A device template defines the capabilities of a device that connects to your IoT Central application. Capabilities include telemetry the device sends, device properties, and the commands a device responds to. Using a device template you can add both real and simulated devices to an application. Simulated devices are useful for testing the behavior of your IoT Central application before you connect real devices.

In this quickstart, you add a device template for an ESP32-Azure IoT Kit development board and create a simulated device. To complete this quickstart you don't need a real device, you work with a simulation of the device. An ESP32 device:

* Sends telemetry such as temperature.
* Reports device-specific properties such as the maximum temperature since the device rebooted.
* Responds to commands such as reboot.
* Reports generic device properties such as firmware version and serial number.

## Prerequisites

Complete the [Create an Azure IoT Central application](./quick-deploy-iot-central.md) quickstart to create an IoT Central application using the **Custom app > Custom application** template.

## Create a device template

To add a new device template to your application, select the **Device Templates** tab in the left pane.

:::image type="content" source="media/quick-create-simulated-device/device-definitions.png" alt-text="Screenshot showing empty list of device templates":::

A device template includes a device model that defines:

* The telemetry the device sends.
* Device properties.
* The commands the device responds to.

### Add a device template

There are several options for adding a device model to your IoT Central application. You can create a model from scratch, import a model from a file, or select a device from the device catalog. IoT Central also supports a *device-first* approach where the application automatically imports a model from a repository when a real device connects for the first time.

In this quickstart, you choose a device from the device catalog to create a device template.

The following steps show you how to use the device catalog to import the model for an **ESP32** device. These devices send telemetry, such as temperature, to your application:

1. To add a new device template, select **+ New** on the **Device templates** page.

1. On the **Select type** page, scroll down until you find the **ESP32-Azure IoT Kit** tile in the **Use a pre-configured device template** section.

1. Select the **ESP32-Azure IoT Kit** tile, and then select **Next: Review**.

1. On the **Review** page, select **Create**.

1. After a few seconds, you can see your new device template:

    :::image type="content" source="media/quick-create-simulated-device/devkit-template.png" alt-text="Screenshot showing device template for ESP32 device":::

    The name of the template is **Sensor Controller**. The model includes components such as **Sensor Controller**, **SensorTemp**, and **Device Information interface**. Components define the capabilities of an ESP32 device. Capabilities include the telemetry, properties, and commands.

### Add cloud properties

A device template can include cloud properties. Cloud properties only exist in the IoT Central application and are never sent to, or received from, a device. To add two cloud properties:

1. Select **Cloud Properties** and then **+ Add cloud property**. Use the information in the following table to add two cloud properties to your device template:

    | Display Name      | Semantic Type | Schema |
    | ----------------- | ------------- | ------ |
    | Last Service Date | None          | Date   |
    | Customer Name     | None          | String |

1. Select **Save** to save your changes:

    :::image type="content" source="media/quick-create-simulated-device/cloud-properties.png" alt-text="Screenshot showing two cloud properties":::

## Views

You can customize the application to display relevant information about the device. Customizations enable other to manage the devices connected to the application. You can create two types of views to interact with devices:

* Forms to view and edit device and cloud properties.
* Dashboards to visualize devices including the telemetry they send.

### Default views

Default views are a quick way to get started with visualizing your important device information. You can have up to three default views generated for your device template:

* The **Commands** view lets you dispatch commands to your device.
* The **Overview** view uses charts and metrics to display device telemetry.
* The **About** view displays device properties.

Select the **Views** node in the device template. You can see that IoT Central generated an **Overview** and an **About** view for you when you added the template.

To add a new form to manage the device:

1. Select the **Views** node, and then select the **Editing device and cloud data** tile to add a new view.

1. Change the form name to **Manage device**.

1. Select the **Customer Name** and **Last Service Date** cloud properties, and the **Target Temperature** property. Then select **Add section**:

    :::image type="content" source="media/quick-create-simulated-device/new-form.png" alt-text="Screenshot showing new form added to device template":::

1. Select **Save** to save your new form.

## Publish device template

Before you can create a simulated device, or connect a real device, you need to publish your device template. Although IoT Central published the template when you first created it, you must publish the updated version.

To publish a device template:

1. Navigate to your **Sensor Controller** device template from the **Device templates** page.

1. Select **Publish** from the command bar at the top of the page.

1. On the dialog that appears, select **Publish**.

After you publish a device template, it's visible on the **Devices** page. In a published device template, you can't edit a device model without creating a new version. However, you can modify cloud properties, customizations, and views in a published device template without versioning. After making any changes, select **Publish**  to push those changes for real and simulated devices to use.

## Add a simulated device

To add a simulated device to your application, you use the **ESP32** device template you created.

1. To add a new device choose **Devices** in the left pane. The **Devices** tab shows **All devices** and the **Sensor Controller** device template for the ESP32 device. Select **Sensor Controller**.

1. To add a simulated DevKit device, select **+ New**. Use the suggested **Device ID** or enter your own. A device ID can contain letters, numbers, and the `-` character. You can also enter a name for your new device. Make sure the **Simulate this device** is set to **Yes** and then select **Create**.

    :::image type="content" source="media/quick-create-simulated-device/simulated-device.png" alt-text="Screenshot that shows the simulated Sensor Controller device":::

Now you can interact with the views that created earlier using simulated data:

1. Select your simulated device on the **Devices** page

    * The **Overview** view shows a plot of the simulated telemetry:

        :::image type="content" source="media/quick-create-simulated-device/simulated-telemetry.png" alt-text="Screenshot showing overview page for simulated device":::

    * The **About** view shows property values.

    * The **Commands** view lets you run commands, such as **reboot** on the device.

    * The **Manage devices** view is the form you created to manage the device.

    * The **Raw data** view lets you view the raw telemetry and property values sent by the device. This view is useful for debugging devices.

## Next steps

In this quickstart, you learned how to you create a **Sensor Controller** device template for an ESP32 device and add a simulated device to your application.

To learn more about monitoring devices connected to your application, continue to the quickstart:

> [!div class="nextstepaction"]
> [Configure rules and actions](./quick-configure-rules.md)
