---
title: Analyze your device data in your Azure IoT Central application | Microsoft Docs
description: Analyze your device data in your Azure IoT Central application.
author: lmasieri
ms.author: lmasieri
ms.date: 06/09/2019
ms.topic: conceptual
ms.service: iot-central
services: iot-central
manager: peterpr
---

# How to use analytics to analyze your device data

*This article applies to operators, builders, and administrators.*

Azure IoT Central provides rich analytics capabilities to make sense of large amounts of data from your devices. To get started, visit **Analytics** on the left navigation menu.

## Querying your data

You'll need to choose a **device set**, add a **filter** (optional), and select a **time period** to get started. Once you're done, select **Show results** to start visualizing your data.

* **Device sets:** A [device set](howto-use-device-sets.md) is a user-defined group of your devices. For example, all Refrigerators in Oakland, or All rev 2.0 wind turbines.

* **Filters:** You can optionally add filters to your search to hone in on your data. You can add up to 10 filters at a time. For example, within all Refrigerators in Oakland, find those that have had temperature go above 60 degrees.
* **Time period:** By default we'll retrieve data from the past 10 minutes. You can change this value to one of the predefined time ranges or select a custom time period.

  ![Analytics query](media/howto-create-analytics/analytics-query.png)

## Visualizing your data

Once you've queried your data, you'll be able to start visualizing it. You can show/hide measurements, change the way data is aggregated, and further split the data by different device properties.  

* **Split by:** Splitting data by device properties enables you to further drill down into your data. For example, you can split your results by device ID or location.

* **Measurements:** You can choose to show/hide up to 10 different telemetry items being reported by your devices at a time. Measurements are things such as temperature and humidity.

* **Aggregation:** By default we aggregate data by its average, but you can choose to change the data aggregation to something else to fit your needs.

   ![Analytics visualization split by](media/howto-create-analytics/analytics-splitby.png)

## Interacting with your data

You have various ways to change your query results to meet your visualization needs. You can alternate between a graph view and a grid view, zoom in and out, refresh your data set, and alter how lines are shown.

* **Show grid:** Your results are available in a table format, enabling you to view the specific value for each data point. This view also meets accessibility standards.
* **Show chart:** Your results are displayed in a line format to help you identify upward or downward trends and anomalies.

  ![Showing the grid view for your analytics](media/howto-create-analytics/analytics-showgrid.png)

Zoom lets you to home in on your data. If you find a time period you'd like to focus on within your result set, use your cursor to grab the area that you'd like to zoom in on and use the available controls to perform one of the following actions:

* **Zoom in:** Once you've selected a time period, zoom in is enabled and allows you to zoom in to your data.
* **Zoom out:** This control enables you to zoom out one level from your last zoom. For example, if you've zoom in to your data three times, zoom out takes you back one step at a time.
* **Zoom reset:** Once you've performed various levels of zooming, you can use the zoom reset control to return to your original result set.

  ![Perform zooming on your data](media/howto-create-analytics/analytics-zoom.png)

You can change the line style to meet your needs. You have four options:

* **Line:** A flat line between each of the data points.
* **Smooth:** A curved line between each point.
* **Step:** Line between each point on the chart is a step.
* **Scatter:** All points are plotted on the chart without lines connecting them.

  ![Different line types available in Analytics](media/howto-create-analytics/analytics-linetypes.png)

Lastly, you can arrange your data across the Y-axis by choosing from one of three modes:

* **Stacked:** A graph for every measurement is stacked and each of the graphs have their own Y-axis. Stacked graphs are useful when you have multiple measurements selected and want to have distinct view of these measurements.
* **Unstacked:** A graph for every measure is plotted against one Y-axis, but the values for the Y-axis are changed based on the highlighted measure. Unstacked graphs are useful when you want to overlay multiple measures and want to see patterns across these measures for the same time range.
* **Shared Y-axis:** All the graphs share the same Y-axis and the values for the axis do not change. Shared Y-axis graphs are useful when you want to look at a single measure while slicing the data with split-by.

  ![Arrange data across y-axis with different visualization modes](media/howto-create-analytics/analytics-yaxis.png)

## Next steps

Now that you have learned how to create custom analytics for your Azure IoT Central application, here the suggested next step is:

> [!div class="nextstepaction"]
> [Prepare and connect a Node.js application](howto-connect-nodejs.md)