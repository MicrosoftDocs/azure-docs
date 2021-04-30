---
title: Configure to your Azure IoT Central dashboard | Microsoft Docs
description: As a builder, learn how to configure the default Azure IoT Central application dashboard with tiles.
author: philmea
ms.author: philmea
ms.date: 12/19/2020
ms.topic: how-to
ms.service: iot-central
---

# Configure the application dashboard

The **Dashboard** is the first page you see when you connect to an IoT Central application. If you create your application from one of the industry-focused [application templates](./concepts-app-templates.md), your application has a pre-defined dashboard to start. If you create your application from a custom [application template](./concepts-app-templates.md), your dashboard shows some tips to get started.

> [!TIP]
> Users can [create multiple dashboards](howto-create-personal-dashboards.md) in addition to the default application dashboard. These dashboards can be personal to the user only, or shared across all users of the application.  

## Add tiles

The following screenshot shows the dashboard in an application created from the **Custom application** template. To customize the current dashboard, select **Edit**, to add a custom personal or shared dashboard, select **New**:

:::image type="content" source="media/howto-add-tiles-to-your-dashboard/dashboard-sample-contoso.png" alt-text="Dashboard for applications based on the custom application template":::

After you select **Edit** or **New**, the dashboard is in *edit* mode. You can use the tools in the **Edit dashboard** panel to add tiles to the dashboard, and customize and remove tiles on the dashboard itself. For example, to add a **Telemetry** tile to show current temperature reported by one or more devices:

1. Select a **Device Group** and then choose your devices in the **Devices** dropdown to show on the tile. You now see the available telemetry, properties, and commands from the devices.

1. If needed, you use the dropdown to select a telemetry value to show on the tile. You can add more items to the tile another by selecting **+ Telemetry**, **+ Property**, or **+ Cloud Property**.

:::image type="content" source="media/howto-add-tiles-to-your-dashboard/device-details.png" alt-text="Add a temperature telemetry tile to the dashboard":::

When you've selected all the values to show on the tile, click **Add tile.** The tile now appears on the dashboard where you can change the visualization, resize it, move it, and configure it.

When you've finished adding and customizing tiles on the dashboard, select **Save** to save the changes to the dashboard, which takes you out of edit mode.

## Customize tiles

To edit a tile, you must be in edit mode.  The available customization options depend on the [tile type](#tile-types):

* The ruler icon on a tile lets you change the visualization. Visualizations include line charts, bar charts, pie charts, last known values, key performance indicators (or KPIs), heatmaps, and maps.

* The square icon lets you resize the tile.

* The gear icon lets you configure the visualization. For example, for a line chart visualization you can choose to show the legend and axes, and choose the time range to plot.


## Tile types

The following table describes the different types of tile you can add to a dashboard:

| Tile             | Description |
| ---------------- | ----------- |
| Markdown         | Markdown tiles are clickable tiles that display a heading and description text formatted using markdown. The URL can be a relative link to another page in the application, or an absolute link to an external site.|
| Image            | Image tiles display a custom image and can be clickable. The URL can be a relative link to another page in the application, or an absolute link to an external site.|
| Label            | Label tiles display custom text on a dashboard. You can choose the size of the text. Use a label tile to add relevant information to the dashboard such descriptions, contact details, or help.|
| Count            | Count tiles display the number of devices in a device group.|
| Map              | Map tiles display the location of one or more devices on a map. You can also display up to 100 points of a device's location history. For example, you can display sampled route of where a device has been on the past week.|
| KPI              |  KPI tiles display aggregate telemetry values for one or more devices over a time period. For example, you can use it to show the maximum temperature and pressure reached for one or more devices during the last hour.|
| Line chart       | Line chart tiles plot one or more aggregate telemetry values for one or more devices for a time period. For example, you can display a line chart to plot the average temperature and pressure of one or more devices for the last hour.|
| Bar chart        | Bar chart tiles plot one or more aggregate telemetry values for one or more devices for a time period. For example, you can display a bar chart to show the average temperature and pressure of one or more devices over the last hour.|
| Pie chart        | Pie chart tiles display one or more aggregate telemetry values for one or more devices for a time period.|
| Heat map         | Heat map tiles display information about one or more devices, represented as colors.|
| Last Known Value | Last known value tiles display the latest telemetry values for one or more devices. For example, you can use this tile to display the most recent temperature, pressure, and humidity values for one or more devices. |
| Event History    | Event History tiles display the events for a device over a time period. For example, you can use it to show all the valve open and close events for one or more devices during the last hour.|
| Property         |  Property tiles display the current value for properties and cloud properties of one or more devices. For example, you can use this tile to display device properties such as the manufacturer or firmware version for a device. |

Currently, you can add up to 10 devices to tiles that support multiple devices.

### Customizing visualizations

By default, line charts show data over a range of time. The selected time range is split into 50 equal-sized buckets and the device data is then aggregated per bucket to give 50 data points over the selected time range. If you wish to view raw data, you can change your selection to view the last 100 values. To change the time range or to select raw data visualization, use the Display Range dropdown in the **Configure chart** panel.

:::image type="content" source="media/howto-add-tiles-to-your-dashboard/display-range.png" alt-text="Change the display range of a line chart":::

For tiles that display aggregate values, select the gear icon next to the telemetry type in the **Configure chart** panel to choose the aggregation. You can choose from average, sum, maximum, minimum, and count.

For line charts, bar charts, and pie charts, you can customize the color of the different telemetry values. Select the palette icon next to the telemetry you want to customize:

:::image type="content" source="media/howto-add-tiles-to-your-dashboard/color-customization.png" alt-text="Change the color of a telemetry value":::

For tiles that show string properties or telemetry values, you can choose how to display the text. For example, if the device stores a URL in a string property, you can display it as a clickable link. If the URL references an image, you can render the image in a last known value or property tile. To change how a string displays, in the tile configuration select the gear icon next to the telemetry type or property:

:::image type="content" source="media/howto-add-tiles-to-your-dashboard/string-customization.png" alt-text="Change how a string displays on a tile":::

For numeric **KPI**, **Last Known Value**, and **Property** tiles you can use conditional formatting to customize the color of the tile based on its current value. To add conditional formatting, select **Configure** on the tile and then select the **Conditional formatting** icon next to the value to customize:

:::image type="content" source="media/howto-add-tiles-to-your-dashboard/conditional-formatting-1.png" alt-text="Screenshot showing how to find the configure option for a tile and then the conditional formatting icon":::

Add your conditional formatting rules:

:::image type="content" source="media/howto-add-tiles-to-your-dashboard/conditional-formatting-2.png" alt-text="Screenshot showing conditional formatting rules for average flow. There are three rules - less than 20 is green, less than 50 is yellow, and anything over 50 is red":::
   
The following screenshot shows the effect of the conditional formatting rule:

:::image type="content" source="media/howto-add-tiles-to-your-dashboard/conditional-formatting-3.png" alt-text="Screenshot showing the red background color on the Average water flow tile. The number on the tile is 50.54":::

### "tile" formatting
This feature, available in KPI, LKV, and Property tiles, lets users adjust font size, choose decimal precision, abbreviate numeric values (for example format 1,700 as 1.7K), or wrap string values in their tiles.

:::image type="content" source="media/howto-add-tiles-to-your-dashboard/tile-format.png" alt-text="Tile Format":::

## Next steps

Now that you've learned how to configure your Azure IoT Central default application dashboard, you can [Learn how to create a personal dashboard](howto-create-personal-dashboards.md).
