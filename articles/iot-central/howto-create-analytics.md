---
title: Create custom analytics for your Azure IoT Central application | Microsoft Docs
description: As an operator, how to create custom analytics for your Azure IoT Central application.
author: tbhagwat3
ms.author: tanmayb
ms.date: 04/16/2018
ms.topic: conceptual
ms.service: iot-central
services: iot-central
manager: peterpr
---

# How to use analytics to analyze your device data

Microsoft Azure IoT Central provides rich analytics capabilities to make sense of large amounts of data from your devices. You can use analytics to view and analyze data for a [device set](howto-use-device-sets.md) in your application. A device set is a user-defined group of your devices. You can narrow down your analysis to a small set of devices or to a single device.

As an operator, choose **Analytics** on the left navigation menu, choose a device set, and then choose the measurements to display on the graph. Here are a few tools you can use to slice the data further:

* **Measurements:** Choose the measurements to display such as temperature and humidity.
* **Aggregation:** Choose the aggregation function for the measurements. For example, **Minimum** or **Average**.
* **Split-by:** Drill down by splitting the data by device properties or device name. For example, split by device location:

     ![Analytics main page](media\howto-create-analytics\analytics-main.png)

* **Time-range:** You can choose time range from one of the predefined time ranges or create a custom time range:
    ![Analytics time range](media\howto-create-analytics\analytics-time-range.png)

## Change the visualizations

You can change the graphs to meet your visualization requirements by choosing from one of the three modes:

* **Stacked:** A graph for every measurement is stacked and each of the graphs have their own Y-axis. Stacked graphs are useful when you have multiple measurements selected and want to have distinct view of these measurements.
* **Unstacked:** A graph for every measure is plotted against one Y-axis, but the values for the Y-axis are changed based on the highlighted measure. Unstacked graphs are useful when you want to overlay multiple measures and want to see patterns across these measures for the same time range.
* **Shared Y-axis:** All the graphs share the same Y-axis and the values for the axis do not change. Shared Y-axis graphs are useful when you want to look at a single measure while slicing the data with split-by.

## Next steps

Now that you have learned how to create custom analytics for your Azure IoT Central application, here the suggested next step is:

> [!div class="nextstepaction"]
> [Prepare and connect a Node.js application](howto-connect-nodejs.md)