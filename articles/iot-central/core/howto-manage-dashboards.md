---
title: Create and manage Azure IoT Central dashboards | Microsoft Docs
description: Learn how to create and manage application and personal dashboards.
author: dominicbetts
ms.author: dobett
ms.date: 10/17/2019
ms.topic: how-to
ms.service: iot-central
services: iot-central
---

# Create and manage dashboards

The default *application dashboard* is the page that loads when you first navigate to your application. As an administrator, you can create up to 10 application dashboards that are visible to all application users. Only administrators can create, edit, and delete application level dashboards.

All users can create their own *personal dashboards*. Users can switch between application dashboards and personal dashboards.

## Create dashboard

The following screenshot shows the dashboard in an application created from the **Custom Application** template. You can replace the default application dashboard with a personal dashboard, or if you're an administrator, another application level dashboard. To do so, select **+ New dashboard** at the top left of the page:

:::image type="content" source="media/howto-manage-dashboards/dashboard-custom-app.png" alt-text="Screenshot of dashboard for applications based on the Custom Application template.":::

Select **+ New dashboard** to open the dashboard editor. In the editor, give your dashboard a name and chose items from the library. The library contains the tiles and dashboard primitives you can use to customize the dashboard:

:::image type="content" source="media/howto-manage-dashboards/dashboard-library.png" alt-text="Screenshot that shows the dashboard library.":::

If you're an administrator, you can create a personal dashboard or an application dashboard. All application users can see the application dashboards the administrator creates. All users can create personal dashboards, that only they can see.

Enter a title and select the type of dashboard you want to create. [Add tiles](#add-tiles) to customize your dashboard.

> [!TIP]
> You need at least one device template in your application to be able to add tiles that show device information.

## Manage dashboards

You can have several personal dashboards and switch between them or choose from one of the application dashboards:

:::image type="content" source="media/howto-manage-dashboards/switch-dashboards.png" alt-text="Screenshot that shows how to switch between dashboards.":::

You can edit your personal dashboards and delete any dashboards you no longer need. If you're an **admin**, you can edit or delete application level dashboards as well.

:::image type="content" source="media/howto-manage-dashboards/delete-dashboards.png" alt-text="Screenshot that shows how to delete dashboards.":::

## Add tiles

The following screenshot shows the dashboard in an application created from the **Custom application** template. To customize the current dashboard, select **Edit**. To add a personal or application dashboard, select **New**:

:::image type="content" source="media/howto-manage-dashboards/dashboard-sample-contoso.png" alt-text="Dashboard for applications based on the custom application template":::

After you select **Edit** or **New**, the dashboard is in *edit* mode. You can use the tools in the **Edit dashboard** panel to add tiles to the dashboard, and customize and remove tiles on the dashboard itself. For example, to add a **Line Chart** tile to track telemetry values over time reported by one or more devices:

1. Select **Start with a Visual**, then choose **Line chart**, and then select **Add tile** or just drag and drop it on to the canvas.
 
1. To configure the tile, select its gear icon. Enter a **Title** and select a **Device Group** and then choose your devices in the **Devices** dropdown to show on the tile.

:::image type="content" source="media/howto-manage-dashboards/device-details.png" alt-text="Add a temperature telemetry tile to the dashboard":::

When you've selected all the values to show on the tile, click **Update**

When you've finished adding and customizing tiles on the dashboard, select **Save** to save the changes to the dashboard, which takes you out of edit mode.

## Customize tiles

To edit a tile, you must be in edit mode. The available customization options depend on the [tile type](#tile-types):

* The ruler icon on a tile lets you change the visualization. Visualizations include line chart, bar chart, pie chart, last known value (LKV), key performance indicator (KPI), heatmap, and map.

* The square icon lets you resize the tile.

* The gear icon lets you configure the visualization. For example, for a line chart you can choose to show the legend and axes, and choose the time range to plot.

## Tile types

The following table describes the different types of tile you can add to a dashboard:

| Tile             | Description |
| ---------------- | ----------- |
| Markdown         | Markdown tiles are clickable tiles that display a heading and description text formatted using markdown. The URL can be a relative link to another page in the application, or an absolute link to an external site.|
| Image            | Image tiles display a custom image and can be clickable. The URL can be a relative link to another page in the application, or an absolute link to an external site.|
| Label            | Label tiles display custom text on a dashboard. You can choose the size of the text. Use a label tile to add relevant information to the dashboard such descriptions, contact details, or help.|
| Count            | Count tiles display the number of devices in a device group.|
| Map(telemetry)              | Map tiles display the location of one or more devices on a map. You can also display up to 100 points of a device's location history. For example, you can display sampled route of where a device has been on the past week.|
| Map(property)              | Map tiles display the location of one or more devices on a map.|
| KPI              |  KPI tiles display aggregate telemetry values for one or more devices over a time period. For example, you can use it to show the maximum temperature and pressure reached for one or more devices during the last hour.|
| Line chart       | Line chart tiles plot one or more aggregate telemetry values for one or more devices for a time period. For example, you can display a line chart to plot the average temperature and pressure of one or more devices for the last hour.|
| Bar chart        | Bar chart tiles plot one or more aggregate telemetry values for one or more devices for a time period. For example, you can display a bar chart to show the average temperature and pressure of one or more devices over the last hour.|
| Pie chart        | Pie chart tiles display one or more aggregate telemetry values for one or more devices for a time period.|
| Heat map         | Heat map tiles display information about one or more devices, represented as colors.|
| Last Known Value | Last known value tiles display the latest telemetry values for one or more devices. For example, you can use this tile to display the most recent temperature, pressure, and humidity values for one or more devices. |
| Event History    | Event History tiles display the events for a device over a time period. For example, you can use it to show all the valve open and close events for one or more devices during the last hour.|
| Property         |  Property tiles display the current value for properties and cloud properties of one or more devices. For example, you can use this tile to display device properties such as the manufacturer or firmware version for a device. |
| State Chart         |  State chart plot changes for one or more devices over a set time range. For example, you can use this tile to display device properties such as the temperature changes for a device. |
| Event Chart         |  Event chart displays telemetry events for one or more devices over a set time range. For example, you can use this tile to display the properties such as the temperature changes for a device. |
| State History         |  State history lists and displays status changes for State telemetry.|
| External Content         |  External content tile allows you to load external content from an external source. |

Currently, you can add up to 10 devices to tiles that support multiple devices.

### Customizing visualizations

By default, line charts show data over a range of time. The selected time range is split into 50 equal-sized buckets and the device data is then aggregated per bucket to give 50 data points over the selected time range. If you wish to view raw data, you can change your selection to view the last 100 values. To change the time range or to select raw data visualization, use the Display Range dropdown in the **Configure chart** panel.

:::image type="content" source="media/howto-manage-dashboards/display-range.png" alt-text="Change the display range of a line chart":::

For tiles that display aggregate values, select the gear icon next to the telemetry type in the **Configure chart** panel to choose the aggregation. You can choose from average, sum, maximum, minimum, and count.

For line charts, bar charts, and pie charts, you can customize the color of the different telemetry values. Select the palette icon next to the telemetry you want to customize:

:::image type="content" source="media/howto-manage-dashboards/color-customization.png" alt-text="Change the color of a telemetry value":::

For tiles that show string properties or telemetry values, you can choose how to display the text. For example, if the device stores a URL in a string property, you can display it as a clickable link. If the URL references an image, you can render the image in a last known value or property tile. To change how a string displays, in the tile configuration select the gear icon next to the telemetry type or property:

:::image type="content" source="media/howto-manage-dashboards/string-customization.png" alt-text="Change how a string displays on a tile":::

For numeric KPI, LKV, and property tiles, you can use conditional formatting to customize the color of the tile based on its current value. To add conditional formatting, select **Configure** on the tile and then select the **Conditional formatting** icon next to the value to customize:

:::image type="content" source="media/howto-manage-dashboards/conditional-formatting-1.png" alt-text="Screenshot showing how to find the configure option for a tile and then the conditional formatting icon":::

Add your conditional formatting rules:

:::image type="content" source="media/howto-manage-dashboards/conditional-formatting-2.png" alt-text="Screenshot showing conditional formatting rules for average flow. There are three rules - less than 20 is green, less than 50 is yellow, and anything over 50 is red":::

The following screenshot shows the effect of the conditional formatting rule:

:::image type="content" source="media/howto-manage-dashboards/conditional-formatting-3.png" alt-text="Screenshot showing the red background color on the Average water flow tile. The number on the tile is 50.54":::

### Tile formatting

This feature, available in KPI, LKV, and Property tiles, lets users adjust font size, choose decimal precision, abbreviate numeric values (for example format 1,700 as 1.7K), or wrap string values in their tiles.

:::image type="content" source="media/howto-manage-dashboards/tile-format.png" alt-text="Tile Format":::

## Next steps

Now that you've learned how to create and manage personal dashboards, you can [Learn how to manage your application preferences](howto-manage-preferences.md).
