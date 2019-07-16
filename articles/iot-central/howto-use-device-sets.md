---
title: Use device sets in your Azure IoT Central application | Microsoft Docs
description: As an operator, how to use device sets in your Azure IoT Central application.
author: ellenfosborne
ms.author: elfarber
ms.date: 06/09/2019
ms.topic: conceptual
ms.service: iot-central
services: iot-central
manager: peterpfr
---

# Use device sets in your Azure IoT Central application

This article describes how, as an operator, to use device sets in your Azure IoT Central application.

A device set is a list of devices that are grouped together because they match some specified criteria. Device sets help you manage, visualize, and analyze devices at scale by grouping devices into smaller, logical groups. For example, you can create a device set to list all the air conditioner devices in Seattle to enable a technician to find the devices for which they're responsible. This article shows you how to create and configure device sets.

## Create a device set

To create a device set:

1. Choose **Device Sets** on the left navigation menu.

1. Select **+ New**.

    ![New device set](media/howto-use-device-sets/image1.png)

1. Give your device set a name that is unique across the entire application. You can also add a description. A device set can only contain devices from a single device template. Choose the device template to use for this set.

1. Create the query to identify the devices for the device set by selecting a property, a comparison operator, and a value. You can add multiple queries and devices that meet **all** the criteria are placed in the device set. The device set you create is accessible to anyone who has access to the application, so anyone can view, modify, or delete the device set.

    ![Device set query](media/howto-use-device-sets/image2.png)

    > [!NOTE]
    > The device set is a dynamic query. Every time you view the list of devices, there may be different devices in the list. The list depends on which devices currently meet the criteria of the query.

1. Choose **Save**.

## Configure the dashboard for your device set

After you create your device set, you can configure its **Dashboard**. The **Dashboard** is the homepage where you place images and links. You can also add grids that list the devices in the device set.

1. Choose **Device Sets** on the left navigation menu.

1. Select your device set.

1. Select the **Dashboard** tab.

1. Select **Edit**.

    ![Design Mode on](media/howto-use-device-sets/image3.png)

1. For information about adding an image, see [Prepare and upload images to your Azure IoT Central application](howto-prepare-images.md).

1. Add a link tile:
    1. Choose **Link** on the right pane.
    1. Give your link a **Title**.
    1. Choose a URL to be opened when the link is selected.
    1. Give your link a description that shows below the **Title**.
    1. Choose **Save**.

        ![Save link](media/howto-use-device-sets/image7.png)

    1. You can move and resize the link tile on the **Dashboard**.

1. Add a grid. A grid is a table of devices in the device set with the columns you choose.
    1. Choose **Grid** on the right pane.
    1. Give your grid a **Title**.
    1. Select the columns to be shown by choosing **Add/Remove**. In the panel that pops up, choose the column you want shown and choose the right arrow to select it.
    1. Choose **OK**.
    1. Choose **Save**.

        ![Save grid](media/howto-use-device-sets/image9.png)

    1. Drag and drop the grid to place it on the **Dashboard**.

        > [!NOTE]
        > You can add multiple images, links, and grids.
  
    1. Select **Done**.

To learn more about how to use tiles in Azure IoT Central, see [Use dashboard tiles](howto-use-tiles.md).

### Configure a location map in your device sets dashboard

You can add a map to visualize location of the devices in your device set.

To add a map to your device sets dashboard, you must have configured a location measurement or location property in your device template. To learn more, see [Create a Location Measurement](howto-set-up-template.md) or [Create a Location Property](howto-set-up-template.md).

1. On your device set **Dashboard**, select **Map** from the library.
2. Add a title and choose the location measurement or property you configured previously.
3. Select **Save** and the map tile displays the last known locations of the devices in your device set.
4. When an operator views the device sets dashboard, the operator sees all the tiles you've configured, including the location map.

You can resize the map tile on the dashboard. Selecting a pin on the map displays the device information, name, and location. Select the pop-up to go to the device property page.

## Configure the List for your device set

After you create your device set, you can configure the **List**. The **List** shows all the devices in the device set in a table with the columns you choose.

1. Choose **Device Sets** on the left navigation menu.

1. Choose the **List** tab.

1. Choose **Column Options**.

    ![Column options](media/howto-use-device-sets/image11.png)

1. Choose the columns to be shown by selecting the column you want to show and choosing the right arrow to select it.

    ![Choose column](media/howto-use-device-sets/image12.png)

1. Choose **OK**.

## Analytics

The analytics in device sets is the same as the main analytics tab in the left navigation menu. You can learn more about analytics in the article on [how to create analytics](howto-use-device-sets.md).

## Next steps

Now that you have learned how to use device sets in your Azure IoT Central application, here is the suggested next step:

> [!div class="nextstepaction"]
> [How to create telemetry rules](howto-create-telemetry-rules.md)
