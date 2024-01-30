---
title: Tutorial - Use Azure IoT Central device groups
description: Tutorial - Learn how to use device groups to analyze telemetry from  devices in your Azure IoT Central application.
author: dominicbetts
ms.author: dobett
ms.date: 10/26/2022
ms.topic: tutorial
ms.service: iot-central
services: iot-central
---

# Tutorial: Use device groups to analyze device telemetry

This article describes how to use device groups to analyze device telemetry in your Azure IoT Central application.

A device group is a list of devices that are grouped together because they match some specified criteria. Device groups help you manage, visualize, and analyze devices at scale by grouping devices into smaller, logical groups. For example, you can create a device group to list all the air conditioner devices in Seattle to enable a technician to find the devices for which they're responsible.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a device group
> * Use a device group to analyze device telemetry

## Prerequisites

To complete the steps in this tutorial, you need:

[!INCLUDE [iot-central-prerequisites-basic](../../../includes/iot-central-prerequisites-basic.md)]

## Add and customize a device template

Add a device template from the device catalog. This tutorial uses the **ESP32-Azure IoT Kit** device template:

1. To add a new device template, select **+ New** on the **Device templates** page.

1. On the **Select type** page, scroll down until you find the **ESP32-Azure IoT Kit** tile in the **Use a pre-configured device template** section.

1. Select the **ESP32-Azure IoT Kit** tile, and then select **Next: Review**.

1. On the **Review** page, select **Create**.

The name of the template you created is **Sensor Controller**. The model includes components such as **Sensor Controller**, **SensorTemp**, and **Device Information interface**. Components define the capabilities of an ESP32 device. Capabilities include the telemetry, properties, and commands.

Add two cloud properties to the **Sensor Controller** model in the device template:

1. Select **+ Add capability** and then use the information in the following table to add two cloud properties to your device template:

    | Display name      | Capability type | Semantic type | Schema |
    | ----------------- | --------------- | ------------- | ------ |
    | Last Service Date | Cloud property  | None          | Date   |
    | Customer Name     | Cloud property  | None          | String |

1. Select **Save** to save your changes.

Add a new form to the device template to manage the device:

1. Select the **Views** node, and then select the **Editing device and cloud data** tile to add a new view.

1. Change the form name to **Manage device**.

1. Select the **Customer Name** and **Last Service Date** cloud properties, and the **Target Temperature** property. Then select **Add section**.

1. Select **Save** to save your new form.

Now publish the device template.

## Create simulated devices

Before you create a device group, add at least five simulated devices based on the **Sensor Controller** device template to use in this tutorial:

:::image type="content" source="media/tutorial-use-device-groups/simulated-devices.png" alt-text="Screenshot showing five simulated sensor controller devices." lightbox="media/tutorial-use-device-groups/simulated-devices.png":::

For four of the simulated sensor devices, use the **Manage device** view to set the customer name to *Contoso* and select **Save**.

:::image type="content" source="media/tutorial-use-device-groups/customer-name.png" alt-text="Screenshot that shows how to set the Customer Name cloud property." lightbox="media/tutorial-use-device-groups/customer-name.png":::

## Create a device group

1. Select **Device groups** on the left pane to navigate to device groups page.

1. Select **+ New**.

1. Name your device group *Contoso devices*. You can also add a description. A device group can only contain devices from a single device template and organization. Choose the **Sensor Controller** device template to use for this group.

    > [!TIP]
    > If your application [uses organizations](howto-create-organizations.md), select the organization that your devices belong to. Only devices from the selected organization are visible. Also, only users associated with the organization or an organization higher in the hierarchy can see the device group.

1. To customize the device group to include only the devices belonging to **Contoso**, select **+ Filter**. Select the **Customer Name** property, the **Equals** comparison operator, and **Contoso** as the value. You can add multiple filters and devices that meet **all** the filter criteria are placed in the device group. The device group you create is accessible to anyone who has access to the application, so anyone can view, modify, or delete the device group.

    > [!TIP]
    > The device group is a dynamic query. Every time you view the list of devices, there may be different devices in the list. The list depends on which devices currently meet the criteria of the query.

1. Choose **Save**.

:::image type="content" source="media/tutorial-use-device-groups/device-group-query.png" alt-text="Screenshot that shows the device group query configuration." lightbox="media/tutorial-use-device-groups/device-group-query.png":::

> [!NOTE]
> For Azure IoT Edge devices, select Azure IoT Edge templates to create a device group.

## Data explorer

You can use **Data explorer** with a device group to analyze the telemetry from the devices in the group. For example, you can plot the average temperature reported by all the Contoso environmental sensors.

To analyze the telemetry for a device group:

1. Choose **Data explorer** on the left pane and select **Create a query**.

1. Select the **Contoso devices** device group you created. Then add both the **Temperature** and **SensorHumid** telemetry types.

    Use the ellipsis icons next to the telemetry types to select an aggregation type. The default is **Average**. Use **Group by** to change how the aggregate data is shown. For example, if you split by device ID you see a plot for each device when you select **Analyze**.

1. Select **Analyze** to view the average telemetry values.

    You can customize the view, change the time period shown, and export the data as CSV or view data as table.

    :::image type="content" source="media/tutorial-use-device-groups/export-data.png" alt-text="Screenshot that shows how to export data for the Contoso devices." lightbox="media/tutorial-use-device-groups/export-data.png":::

To learn more about analytics, see [How to use data explorer to analyze device data](howto-create-analytics.md).

## Clean up resources

[!INCLUDE [iot-central-clean-up-resources](../../../includes/iot-central-clean-up-resources.md)]

## Next steps

Now that you've learned how to use device groups in your Azure IoT Central application, here's the suggested next step:

> [!div class="nextstepaction"]
> [Connect an IoT Edge device to your Azure IoT Central application](tutorial-connect-iot-edge-device.md)
