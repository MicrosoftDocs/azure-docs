---
title: Tutorial - Customize the dashboard in Azure IoT Central
description: This tutorial shows how to customize the dashboard in an IoT Central application, and manage devices.
services: iot-central
ms.service: iot-central
ms.subservice: iot-central-retail
ms.topic: tutorial
ms.custom: [iot-storeAnalytics-checkout, iot-p0-scenario]
author: dominicbetts
ms.author: dobett
ms.date: 06/12/2023
---

# Tutorial: Customize the dashboard and manage devices in Azure IoT Central

In this tutorial, you learn how to customize the dashboard in your Azure IoT Central in-store analytics application. Application operators can use the customized dashboard to run the application and manage the attached devices.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Customize image tiles on the dashboard
> * Arrange tiles to modify the layout
> * Add telemetry tiles to display conditions
> * Add property tiles to display device details
> * Add command tiles to run commands

## Prerequisites

Before you begin, complete the following tutorial:
* [Create an in-store analytics application in Azure IoT Central](./tutorial-in-store-analytics-create-app.md)

## Change the dashboard name

After you've created your condition-monitoring application, you can edit its default dashboard. You can also create more dashboards.

The first step in customizing the application dashboard is to change the name:

1. Go to the [Azure IoT Central My apps](https://apps.azureiotcentral.com/myapps) page.

1. Open the condition-monitoring application that you created.

1. Select **Dashboard settings**, enter a name for your dashboard, and then select **Save**.

:::image type="content" source="media/tutorial-in-store-analytics-customize-dashboard/new-dashboard.png" alt-text="Screenshot of the in-store analytics application dashboard." lightbox="media/tutorial-in-store-analytics-customize-dashboard/new-dashboard.png":::

## Customize image tiles on the dashboard

An Azure IoT Central application dashboard consists of one or more tiles. A tile is a rectangular container for displaying content on a dashboard. You associate various types of content with tiles, and you can drag, drop, and resize tiles to customize the dashboard layout.

There are several types of tiles for displaying content: 
* **Image** tiles contain images, and you can add a URL that lets you select the image. 
* **Label** tiles display plain text. 
* **Markdown** tiles contain formatted content and let you set an image, a URL, a title, and Markdown code that renders as HTML.
* **Telemetry, property, or command** tiles display device-specific data.

In this section, you customize image tiles on the dashboard.

To customize the image tile that displays a brand image on the dashboard:

1. Select **Edit** on the dashboard toolbar.

1. Select **Edit** on the image tile that displays the Northwind Traders brand image.

1. Change the **Title**. The title appears when you hover over the image.

1. Select **Image**. A window opens where you can upload a custom image or, optionally, specify a URL for the image.

1. Select **Update**.

    :::image type="content" source="media/tutorial-in-store-analytics-customize-dashboard/brand-image-save.png" alt-text="Screenshot that shows the in-store analytics application dashboard brand image tile." lightbox="media/tutorial-in-store-analytics-customize-dashboard/brand-image-save.png":::

1. Optionally, on the **Documentation** tile, select **Configure**, and then specify a URL that links to support content.

To customize the image tile that displays a map of the sensor zones in the store:

1. On the image tile that displays the default store zone map, select **Configure**.

1. Select **Image**, and then upload a custom image of a store zone map.

1. Select **Update**.

:::image type="content" source="media/tutorial-in-store-analytics-customize-dashboard/store-map-save.png" alt-text="Screenshot that shows the in-store analytics application dashboard store map tile." lightbox="media/tutorial-in-store-analytics-customize-dashboard/store-map-save.png":::

The example Contoso store map shows four zones: two checkout zones, a zone for apparel and personal care, and a zone for groceries and deli.

In this tutorial, you associate sensors with these zones to provide telemetry.

## Arrange tiles to modify the layout

A key step in customizing a dashboard is to rearrange the tiles to create a useful view. Application operators use the dashboard to visualize device telemetry, manage devices, and monitor conditions in a store. 

Azure IoT Central simplifies the application builder task of creating a dashboard. By using the dashboard edit mode, you can quickly add, move, resize, and delete tiles. 

The *In-store analytics - checkout* application template also simplifies the task of creating a dashboard. The template provides a working dashboard layout, with sensors connected, and tiles that display checkout line counts and environmental conditions.

In this section, you rearrange the dashboard tiles in the *In-store analytics - checkout* application template to create a custom layout.

To remove tiles that you don't plan to use in your application:

1. Select **Edit** on the dashboard toolbar.

1. For each of the following tiles, which the Contoso store dashboard doesn't use, select the ellipsis (**...**), and then select **Delete**: 
   * **Back to all zones**
   * **Visit store dashboard**
   * **Warm-up checkout zone**
   * **Cool-down checkout zone**
   * **Occupancy sensor settings**
   * **Thermostat settings**
   * **Wait time**
   * **Environment conditions**
   * **Checkout 3**: All three tiles associated with it

1. Select **Save**. Removing unused tiles frees space on the edit page, and it simplifies the dashboard view for operators.

After you've removed the unused tiles, rearrange the remaining tiles to create an organized layout. The new layout includes space for tiles that you add later.

To rearrange the remaining tiles:

1. Select **Edit**.

1. Drag the **Occupancy firmware** tile to the right of the **Occupancy** battery tile.

1. Drag the **Thermostat firmware** tile to the right of the **Thermostat** battery tile.

1. Select **Save**.

1. View your layout changes.

:::image type="content" source="media/tutorial-in-store-analytics-customize-dashboard/firmware-battery-tiles.png" alt-text="Screenshot that shows the in-store analytics application dashboard layout." lightbox="media/tutorial-in-store-analytics-customize-dashboard/firmware-battery-tiles.png":::

## Add telemetry tiles to display conditions

After you customize the dashboard layout, you're ready to add tiles to display telemetry. To create a telemetry tile, select a device template and device instance, then select device-specific telemetry to display in the tile. The *In-store analytics - checkout* application template includes several telemetry tiles on the dashboard. The four tiles in the two checkout zones display telemetry from the simulated occupancy sensor. The **People traffic** tile shows counts in the two checkout zones.

In this section, you add two more telemetry tiles to display environmental telemetry from the RuuviTag sensors you added in the [Create an in-store analytics application in Azure IoT Central](./tutorial-in-store-analytics-create-app.md) tutorial.

To add tiles to display environmental data from the RuuviTag sensors:

1. Select **Edit**.

1. In the **Device template** list, select **RuuviTag**.

1. Select a **Device instance** of one of the two RuuviTag sensors. In the Contoso store example, select **Zone 1 Ruuvi** to create a telemetry tile for Zone 1.

1. In the **Telemetry** list, select **Relative humidity** and **Temperature**, the telemetry items that are displayed for each zone on the tile.

1. Select **Add tile**. This new tile displays combined humidity and temperature telemetry for the selected sensor.

1. On the new tile for the RuuviTag sensor, select **Configure**.

1. Change the **Title** to **Zone 1 environment**.

1. Select **Update**.

1. Repeat steps 1 through 8 to create a tile for the second sensor instance. For **Title**, enter **Zone 2 environment**, and then select **Update configuration**.

1. Drag the tile titled **Zone 2 environment** to below the **Thermostat firmware** tile.

1. Drag the tile titled **Zone 1 environment** to below the **People traffic** tile.

1. Select **Save**. The dashboard displays zone telemetry in the two new tiles.

:::image type="content" source="media/tutorial-in-store-analytics-customize-dashboard/all-ruuvitag-tiles.png" alt-text="Screenshot that shows the in-store analytics application dashboard RuuviTag tiles." lightbox="media/tutorial-in-store-analytics-customize-dashboard/all-ruuvitag-tiles.png":::

To edit the **People traffic** tile to show telemetry for only two checkout zones:

1. Select **Edit**.

1. On the **People traffic** tile, select **Edit**.

1. Remove the **count3** telemetry.

1. Select **Update**.

1. Select **Save**.  The updated dashboard displays counts for only your two checkout zones, which are based on the simulated occupancy sensor.

:::image type="content" source="media/tutorial-in-store-analytics-customize-dashboard/people-traffic-two-lanes.png" alt-text="Screenshot that shows the in-store analytics application dashboard 'People traffic' tile." lightbox="media/tutorial-in-store-analytics-customize-dashboard/people-traffic-two-lanes.png":::

## Add command tiles to run commands

Application operators also use the dashboard to manage devices by running commands. You can add command tiles to the dashboard that execute predefined commands on a device. In this section, you add a command tile to enable operators to reboot the Rigado gateway.

To add a command tile to reboot the gateway:

1. Select **Edit**.

1. In the **Device template** list, select **C500**. It's the template for the Rigado C500 gateway.

1. Select the gateway instance in **Device instance**.

1. Select the **Reboot** command.

1. Select **Add tile**.

1. Select **Save**.

1. View your completed Contoso dashboard.

    :::image type="content" source="media/tutorial-in-store-analytics-customize-dashboard/completed-dashboard.png" alt-text="Screenshot that shows the completed in-store analytics application dashboard." lightbox="media/tutorial-in-store-analytics-customize-dashboard/completed-dashboard.png":::

1. Optionally, select the **Reboot** tile to run the reboot command on your gateway.

## Clean up resources

[!INCLUDE [iot-central-clean-up-resources](../../../includes/iot-central-clean-up-resources.md)]

## Next steps

In this tutorial, you learned how to:

* Change the dashboard name.
* Customize image tiles on the dashboard.
* Arrange tiles to modify the layout.
* Add telemetry tiles to display conditions.
* Add property tiles to display device details.
* Add command tiles to run commands.

Now that you've customized the dashboard in your Azure IoT Central in-store analytics application, here's the suggested next step:

> [!div class="nextstepaction"]
> [Export data and visualize insights](./tutorial-in-store-analytics-export-data-visualize-insights.md)
