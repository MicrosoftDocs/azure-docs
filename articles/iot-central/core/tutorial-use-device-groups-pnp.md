---
title: Use device groups in your Azure IoT Central application | Microsoft Docs
description: As an operator, learn how to use device groups to analyze telemetry from  devices in your Azure IoT Central application.
author: dominicbetts
ms.author: dobett
ms.date: 10/29/2019
ms.topic: conceptual
ms.service: iot-central
services: iot-central
manager: peterpfr
---

# Tutorial: Use device groups to analyze device telemetry (preview features)

[!INCLUDE [iot-central-pnp-original](../../../includes/iot-central-pnp-original-note.md)]

This article describes how, as an operator, to use device groups to analyze device telemetry in your Azure IoT Central application.

A device group is a list of devices that are grouped together because they match some specified criteria. Device groups help you manage, visualize, and analyze devices at scale by grouping devices into smaller, logical groups. For example, you can create a device group to list all the air conditioner devices in Seattle to enable a technician to find the devices for which they're responsible.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a device group
> * USe a device group to analyze device telemetry

## Prerequisites

Before you begin, you should complete the [Create an Azure IoT Central application](./quick-deploy-iot-central-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json) and [Add a simulated device to your IoT Central application](./quick-create-pnp-device-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json) quickstarts to create the **Environment Sensor** device template to work with.

## Create simulated devices

Before you create a device group, add at least five simulated devices from the **Environment Sensor** device template to use in this tutorial:

![Five simulated environmental sensor devices](./media/tutorial-use-device-groups-pnp/simulated-devices.png)

For four of the environmental sensor devices, use the **Environmental Sensor properties** view to set the customer name to **Contoso**:

![Set customer name to Contoso](./media/tutorial-use-device-groups-pnp/customer-name.png)

## Create a device group

To create a device group:

1. Choose **Device Groups** on the left pane.

1. Select **+ New**.

    ![New device group](media/tutorial-use-device-groups-pnp/image1.png)

1. Give your device group a name such as **Contoso devices**. You can also add a description. A device group can only contain devices from a single device template. Choose the **Environmental Sensor** device template to use for this group.

1. Create the query to identify the devices belonging to **Contoso** for the device group by selecting the **Customer Name** property, the **Equals** comparison operator, and **Contoso** as the value. You can add multiple queries and devices that meet **all** the criteria are placed in the device group. The device group you create is accessible to anyone who has access to the application, so anyone can view, modify, or delete the device group.

    ![Device group query](media/tutorial-use-device-groups-pnp/image2.png)

    > [!NOTE]
    > The device group is a dynamic query. Every time you view the list of devices, there may be different devices in the list. The list depends on which devices currently meet the criteria of the query.

1. Choose **Save**.

> [!NOTE]
> For Azure IoT Edge devices, select Azure IoT Edge templates to create a device group.

## Analytics

You can use **Analytics** with a device group to analyze the telemetry from the devices in the group. For example, you can plot the average temperature reported by all the Contoso environmental sensors.

To analyze the telemetry for a device group:

1. Choose **Analytics** on the left pane.

1. Select the **Contoso devices** device group you created. Then add both the **Temperature** and **Humidity** telemetry types:

    ![Create analytics](./media/tutorial-use-device-groups-pnp/create-analysis.png)

    Use the gear-wheel icons next to the telemetry types to select an aggregation type. The default is **Average**. Use **Split by** to change how the aggregate data is shown. For example, if you split by device ID you see a plot for each device when you select **Analyze**.

1. Select **Analyze** to view the average telemetry values:

    ![View analysis](./media/tutorial-use-device-groups-pnp/view-analysis.png)

    You can customize the view, change the time period shown, and export the data.

## Next steps

Now that you've learned how to use device groups in your Azure IoT Central application, here is the suggested next step:

> [!div class="nextstepaction"]
> [How to create telemetry rules](tutorial-create-telemetry-rules-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json)
