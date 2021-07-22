---
title: Manage devices individually in your Azure IoT Central application | Microsoft Docs
description: Learn how to manage devices individually in your Azure IoT Central application. Create, delete, and update devices.
author: dominicbetts
ms.author: dobett
ms.date: 07/08/2021
ms.topic: how-to
ms.service: iot-central
services: iot-central
ms.custom: contperf-fy21q2

# Operator
---

# Manage individual devices in your Azure IoT Central application

This article describes how you manage devices in your Azure IoT Central application. You can:

- Use the **Devices** page to view, add, and delete devices connected to your Azure IoT Central application.
- Keep your device metadata up to date by changing the values stored in the device properties from your views.
- Control the behavior of your devices by updating a setting on a specific device from your views.

To learn how to manage custom groups of devices, see [Tutorial: Use device groups to analyze device telemetry](tutorial-use-device-groups.md).

## View your devices

To view an individual device:

1. Choose **Devices** on the left pane. Here you see a list of all devices and of your device templates.

1. Choose a device template.

1. In the right-hand pane of the **Devices** page, you see a list of devices created from that device template. Choose an individual device to see the device details page for that device:

    :::image type="content" source="media/howto-manage-devices-individually/device-list.png" alt-text="Screenshot showing device list.":::

## Add a device

To add a device to your Azure IoT Central application:

1. Choose **Devices** on the left pane.

1. Choose the device template from which you want to create a device.

1. Choose + **New**.

1. Enter a device name and ID or accept the default. The maximum length of a device name is 148 characters. The maximum length of a device ID is 128 characters.

1. Turn the **Simulated** toggle to **On** or **Off**. A real device is for a physical device that you connect to your Azure IoT Central application. A simulated device has sample data generated for you by Azure IoT Central.

1. Select **Create**.

1. This device now appears in your device list for this template. Select the device to see the device details page that contains all views for the device.

## Migrate devices to a template

If you register devices by starting the import under **All devices**, then the devices are created without any device template association. Devices must be associated with a template to explore the data and other details about the device. Follow these steps to associate devices with a template:

1. Choose **Devices** on the left pane.

1. On the left panel, choose **All devices**:

    :::image type="content" source="media/howto-manage-devices-individually/unassociated-devices-1.png" alt-text="Screenshot showing unassociated devices.":::

1. Use the filter on the grid to determine if the value in the **Device Template** column is **Unassociated** for any of your devices.

1. Select the devices you want to associate with a template:

1. Select **Migrate**:

    :::image type="content" source="media/howto-manage-devices-individually/unassociated-devices-2.png" alt-text="Screenshot showing how to associate a device.":::

1. Choose the template from the list of available templates and select **Migrate**.

1. The selected devices are associated with the device template you chose.

## Delete a device

To delete either a real or simulated device from your Azure IoT Central application:

1. Choose **Devices** on the left pane.

1. Choose the device template of the device you want to delete.

1. Use the filter tools to filter and search for your devices. Check the box next to the devices to delete.

1. Choose **Delete**. You can track the status of this deletion in your Device Operations panel.

## Change a property

Cloud properties are the device metadata associated with the device, such as city and serial number. Cloud properties only exist in the IoT Central application and aren't synchronized to your devices. Writable properties control the behavior of a device and let you set the state of a device remotely, for example by setting the target temperature of a thermostat device.  Device properties are set by the device and are read-only within IoT Central. You can view and update properties on the **Device Details** views for your device.

1. Choose **Devices** on the left pane.

1. Choose the device template of the device whose properties you want to change and select the target device.

1. Choose the view that contains properties for your device, this view enables you to input values and select **Save** at the top of the page. Here you see the properties your device has and their current values. Cloud properties and writable properties have editable fields, while device properties are read-only. For writable properties, you can see their sync status at the bottom of the field.

1. Modify the properties to the values you need. You can modify multiple properties at a time and update them all at the same time.

1. Choose **Save**. If you saved writable properties, the values are sent to your device. When the device confirms the change for the writable property, the status returns back to **synced**. If you saved a cloud property, the value is updated.

## Next steps

Now that you've learned how to manage devices individually, the suggested next step is to learn how to [Manage devices in bulk in your Azure IoT Central application](howto-manage-devices-in-bulk.md)).
