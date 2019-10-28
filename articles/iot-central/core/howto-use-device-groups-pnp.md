---
title: Use device groups in your Azure IoT Central application | Microsoft Docs
description: As an operator, how to use device groups in your Azure IoT Central application.
author: ellenfosborne
ms.author: elfarber
ms.date: 06/09/2019
ms.topic: conceptual
ms.service: iot-central
services: iot-central
manager: peterpfr
---

# Use device groups in your Azure IoT Central application (preview features)

[!INCLUDE [iot-central-pnp-original](../../../includes/iot-central-pnp-original-note.md)]

This article describes how, as an operator, to use device groups in your Azure IoT Central application.

A device group is a list of devices that are grouped together because they match some specified criteria. Device groups help you manage, visualize, and analyze devices at scale by grouping devices into smaller, logical groups. For example, you can create a device group to list all the air conditioner devices in Seattle to enable a technician to find the devices for which they're responsible. This article shows you how to create and configure device groups.

>  [!NOTE] 
> For Azure IoT Edge devices you will have to select Azure IoT Edge templates to create a device group

## Create a device group

To create a device group:

1. Choose **Device Groups** on the left pane.

1. Select **+ New**.

    ![New device group](media/howto-use-device-groups-pnp/image1.png)

1. Give your device group a name that is unique across the entire application. You can also add a description. A device group can only contain devices from a single device template. Choose the device template to use for this group.

1. Create the query to identify the devices for the device group by selecting a property, a comparison operator, and a value. You can add multiple queries and devices that meet **all** the criteria are placed in the device group. The device group you create is accessible to anyone who has access to the application, so anyone can view, modify, or delete the device group.

    ![Device group query](media/howto-use-device-groups-pnp/image2.png)

    > [!NOTE]
    > The device group is a dynamic query. Every time you view the list of devices, there may be different devices in the list. The list depends on which devices currently meet the criteria of the query.

1. Choose **Save**.

## Analytics

The analytics in device groups is the same as the main analytics tab in the left pane. You can learn more about analytics in the article on [how to create analytics](howto-use-device-groups-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json).

## Next steps

Now that you have learned how to use device groups in your Azure IoT Central application, here is the suggested next step:

> [!div class="nextstepaction"]
> [How to create telemetry rules](tutorial-create-telemetry-rules-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json)
