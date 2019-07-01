---
title: How to use tiles in Azure IoT Central application dashboard | Microsoft Docs
description: As a builder, learn how to use tiles on application dashboards, device set dashboards, and device dashboards.
author: v-krghan
ms.author: v-krghan
ms.date: 06/27/2019
ms.topic: conceptual
ms.service: iot-central
services: iot-central
manager: philmea
---

# How to use tiles
You can use tiles to customize application dashboards, device dashboards, and device set dashboards. You can add multiple tiles to a dashboard and customize those tiles to show information relevant to your application. You can also resize tiles, and customize the layout on any dashboard. The below screenshot shows the application dashboard with different tiles.

![Application dashboard](media/howto-use-tiles/image1a.png)


The following table summarizes the usage of tiles in Azure IoT Central:

 
| Tile | Dashboard | Description
| ----------- | ------- | ------- |
| Link | Application and device set dashboards |Link tiles are clickable tiles that display heading and description text. Use a link tile to enable a user to navigate to a URL that's related to your application. |
| Image | Application and device set dashboards |Image tiles display a custom image and can be clickable. Use an image tile to add graphics to a dashboard and optionally enable a user to navigate to a URL that's relevant to your application.|
| Label | Application dashboards |Label tiles display custom text on a dashboard. You can choose the size of the text. Use a label tile to add relevant information to the dashboard such descriptions, contact details, or help|
| Map | Application and device set dashboards |Map tiles display location on the dashboard. For example, you can use map tile to display the current location and fan speed on the dashboard|
| Line Chart | Application and device dashboards |Line chart tile displays chart of an aggregate measurement for a time period. For example, you can use this tile to display a line chart with aggregate measurements of temperature, pressure and humidity during the last hour.|
| Bar Chart | Application and device dashboards |Bar chart tile displays chart of an aggregate measurement for a time period. For example, you can use this tile to display a bar chart with aggregate measurements of temperature, pressure and humidity during the last hour. |
| Event History | Application and device dashboards |Event History tile displays the events for a device template over a time period. For example, you can use it to show all the temperature changes occurred during the last hour. |
| State History | Application and device dashboards |State history tile displays the measurement values for a time period. For example, you can use it to show the temperature values for a device template during the last hour.|
| KPI | Application and device dashboards | KPI tile displays an aggregate telemetry or event measurement for a time period. For example, you can use it to show the maximum temperature reached during the last hour.|
| Last Known Value | Application and device dashboards |Last known Value tile displays the latest value for a telemetry or state measurement. For example, you can use this tile to display the latest measurements of temperature, pressure and humidity for a telemetry.|
| Device Set Grid | Application and device set dashboards | Device set grid displays information about the device set. Use a Device Set grid tile to show information such as name, location, and model of the device set.|


To learn more about how to configure dashboard in your Azure IoT Central application, see [Configure application dashboard](howto-configure-homepage.md).
