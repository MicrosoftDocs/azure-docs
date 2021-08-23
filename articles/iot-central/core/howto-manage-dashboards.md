---
title: Create and manage Azure IoT Central dashboards | Microsoft Docs
description: Learn how to create and manage application and personal dashboards in Azure IoT Central.
author: dominicbetts
ms.author: dobett
ms.date: 10/17/2019
ms.topic: how-to
ms.service: iot-central
services: iot-central
---

# Create and manage dashboards

The default *application dashboard* is the page that loads when you first go to your application. As an administrator, you can create up to 10 application dashboards that are visible to all application users. Only administrators can create, edit, and delete application-level dashboards.

All users can create their own *personal dashboards*. Users can switch between application dashboards and personal dashboards.

## Create a dashboard

The following screenshot shows the dashboard in an application created from the Custom Application template. You can replace the default application dashboard with a personal dashboard. If you're an administrator, you can also replace it with another application-level dashboard. To do so, select **New dashboard** in the upper-left corner of the page:

:::image type="content" source="media/howto-manage-dashboards/dashboard-custom-app.png" alt-text="Screenshot that shows the New dashboard button.":::

Select **New dashboard** to open the dashboard editor. In the editor, give your dashboard a name and choose items from the library. The library contains the tiles and dashboard primitives you can use to customize the dashboard:

:::image type="content" source="media/howto-manage-dashboards/dashboard-library.png" alt-text="Screenshot that shows the dashboard library.":::

If you're an administrator, you can create a personal dashboard or an application dashboard. All application users can see the application dashboards the administrator creates. All users can create personal dashboards that only they can see.

Enter a title and select the type of dashboard you want to create. [Add tiles](#add-tiles) to customize your dashboard.

> [!TIP]
> You need to have at least one device template in your application to be able to add tiles that show device information.

## Manage dashboards

You can have several personal dashboards and switch among them or choose from one of the application dashboards:

:::image type="content" source="media/howto-manage-dashboards/switch-dashboards.png" alt-text="Screenshot that shows how to switch between dashboards.":::

You can edit your personal dashboards and delete dashboards you don't need. If you're an admin, you can edit and delete application-level dashboards as well.

:::image type="content" source="media/howto-manage-dashboards/delete-dashboards.png" alt-text="Screenshot that shows how to delete a dashboard.":::

## Add tiles

The following screenshot shows the dashboard in an application created from the Custom Application template. To customize the current dashboard, select **Edit**. To add a personal or application dashboard, select **New dashboard**:

:::image type="content" source="media/howto-manage-dashboards/dashboard-sample-contoso.png" alt-text="Screenshot that shows a dashboard for applications that are based on the Custom Application template.":::

After you select **Edit** or **New dashboard**, the dashboard is in *edit* mode. You can use the tools in the **Edit dashboard** panel to add tiles to the dashboard. You can customize and remove tiles on the dashboard itself. For example, to add a line chart tile to track telemetry values reported by one or more devices over time:

1. Select **Start with a Visual**, **Line chart**, and then **Add tile**, or just drag the tile onto the canvas.
 
1. To configure the tile, select its **gear** button. Enter a **Title** and select a **Device Group**. In the **Devices** list, select the devices to show on the tile.

   :::image type="content" source="media/howto-manage-dashboards/device-details.png" alt-text="Screenshot that shows adding a tile to a dashboard.":::

1. After you select all the devices to show on the tile, select **Update**.

1. After you finish adding and customizing tiles on the dashboard, select **Save**. Doing so takes you out of edit mode.

## Customize tiles

To edit a tile, you need to be in edit mode. The different [tile types](#tile-types) have different options for customization:

* The **ruler** button on a tile lets you change the visualization. Visualizations include line chart, bar chart, pie chart, last known value (LKV), key performance indicator (KPI), heat map, and map.

* The **square** button lets you resize the tile.

* The **gear** button lets you configure the visualization. For example, for a line chart you can choose to show the legend and axes and choose the time range to plot.

## Tile types

This table describes the types of tiles you can add to a dashboard:

| Tile             | Description |
| ---------------- | ----------- |
| Markdown         | Markdown tiles are clickable tiles that display a heading and description text formatted in Markdown. The URL can be a relative link to another page in the application or an absolute link to an external site.|
| Image            | Image tiles display a custom image and can be clickable. The URL can be a relative link to another page in the application or an absolute link to an external site.|
| Label            | Label tiles display custom text on a dashboard. You can choose the size of the text. Use a label tile to add relevant information to the dashboard, like descriptions, contact details, or Help.|
| Count            | Count tiles display the number of devices in a device group.|
| Map (telemetry)              | Map tiles display the location of one or more devices on a map. You can also display up to 100 points of a device's location history. For example, you can display a sampled route of where a device has been in the past week.|
| Map (property)              | Map tiles display the location of one or more devices on a map.|
| KPI              |  KPI tiles display aggregate telemetry values for one or more devices over a time period. For example, you can use them to show the maximum temperature and pressure reached for one or more devices during the past hour.|
| Line chart       | Line chart tiles plot one or more aggregate telemetry values for one or more devices over a time period. For example, you can display a line chart to plot the average temperature and pressure of one or more devices during the past hour.|
| Bar chart        | Bar chart tiles plot one or more aggregate telemetry values for one or more devices over a time period. For example, you can display a bar chart to show the average temperature and pressure of one or more devices during the past hour.|
| Pie chart        | Pie chart tiles display one or more aggregate telemetry values for one or more devices over a time period.|
| Heat map         | Heat map tiles display information, represented in colors, about one or more devices.|
| Last known value | Last known value tiles display the latest telemetry values for one or more devices. For example, you can use this tile to display the most recent temperature, pressure, and humidity values for one or more devices. |
| Event history    | Event history tiles display the events for a device over a time period. For example, you can use them to show all the valve open and valve close events for one or more devices during the past hour.|
| Property         |  Property tiles display the current values for properties and cloud properties for one or more devices. For example, you can use this tile to display device properties like the manufacturer or firmware version. |
| State chart         |  State chart tiles plot changes for one or more devices over a time period. For example, you can use this tile to display properties like the temperature changes for a device. |
| Event chart         |  Event chart tiles display telemetry events for one or more devices over a time period. For example, you can use this tile to display properties like the temperature changes for a device. |
| State history         |  State history tiles list and display status changes for state telemetry.|
| External content         |  External content tiles allow you to load content from an external source. |

Currently, you can add up to 10 devices to tiles that support multiple devices.

### Customize visualizations

By default, line charts show data over a range of time. The selected time range is split into 50 equally sized partitions. The device data is then aggregated per partition to give 50 data points over the selected time range. If you want to view raw data, you can change your selection to view the last 100 values. To change the time range or to select raw data visualization, use the **Display range** dropdown list in the **Configure chart** panel:

:::image type="content" source="media/howto-manage-dashboards/display-range.png" alt-text="Screenshot that shows the Display Range dropdown list.":::

For tiles that display aggregate values, select the **gear** button next to the telemetry type in the **Configure chart** panel to choose the aggregation. You can choose average, sum, maximum, minimum, or count.

For line charts, bar charts, and pie charts, you can customize the colors of the various telemetry values. Select the **palette** button next to the telemetry you want to customize:

:::image type="content" source="media/howto-manage-dashboards/color-customization.png" alt-text="Screenshot that shows the palette button.":::

For tiles that show string properties or telemetry values, you can choose how to display the text. For example, if the device stores a URL in a string property, you can display it as a clickable link. If the URL references an image, you can render the image in a last known value or property tile. To change how a string displays, select the **gear** button next to the telemetry type or property in the tile configuration.

:::image type="content" source="media/howto-manage-dashboards/string-customization.png" alt-text="Screenshot that shows how to change how a string displays on a tile.":::

For numeric KPI, LKV, and property tiles, you can use conditional formatting to customize the color of the tile based on its value. To add conditional formatting, select **Configure** on the tile and then select the **Conditional formatting** button next to the value you want to customize:

:::image type="content" source="media/howto-manage-dashboards/conditional-formatting-1.png" alt-text="Screenshot that shows the Conditional formatting button.":::

Next, add your conditional formatting rules:

:::image type="content" source="media/howto-manage-dashboards/conditional-formatting-2.png" alt-text="Screenshot that shows conditional formatting rules for available memory. There are rules for less than, greater than, and greater than or equal to.":::

The following screenshot shows the effect of those conditional formatting rules:

:::image type="content" source="media/howto-manage-dashboards/conditional-formatting-3.png" alt-text="Screenshot that shows a purple background color on the available memory tile.":::

### Tile formatting

This feature is available on the KPI, LKV, and property tiles. It lets you adjust font size, choose decimal precision, abbreviate numeric values (for example, format 1,700 as 1.7K), or wrap string values on their tiles.

:::image type="content" source="media/howto-manage-dashboards/tile-format.png" alt-text="Screenshot that shows the dialog box for tile formatting.":::

## Next steps

Now that you've learned how to create and manage personal dashboards, you can [learn how to manage your application preferences](howto-manage-preferences.md).
