---
title: Diagnose an issue with Azure Time Series Insights | Microsoft Docs
description: In this tutorial you learn how to diagnose an issue with Time Series Insights.
author: aditidugar
ms.author: adugar
ms.service: iot-accelerators
services: iot-accelerators
ms.date: 08/30/2018
ms.topic: tutorial
ms.custom: mvc

# As an operator of an IoT monitoring solution, I need to diagnose alerts on my fleet devices to understand why they are happening.
---

# Tutorial: Diagnose an issue with Azure Time Series Insights

In this tutorial, you will learn how to use the Remote Monitoring solution accelerator to diagnose the root cause of an alert that is triggered using Azure Time Series Insights.

The tutorial uses two simulated truck devices that send location, altitude, speed, and cargo temperature telemetry. The trucks are managed by an organization called Contoso and are connected to the Remote Monitoring solution accelerator. As a Contoso operator, you need to understand why one of your trucks (truck-02) has logged a low temperature alert.

In this tutorial, you:

>[!div class="checklist"]
> * Filter the devices in the dashboard
> * View real-time telemetry
> * Explore data in the Time Series Insights explorer
> * Diagnose the alert
> * Create a new rule based on your learnings

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [iot-accelerators-tutorial-prereqs](../../includes/iot-accelerators-tutorial-prereqs.md)]

## Choose the devices to display

To select which connected devices display on the **Dashboard** page, use filters. To display only the **Truck** devices, choose the built-in **Trucks** filter in the filter drop-down:

[![Filter for trucks on the dashboard](./media/iot-accelerators-remote-monitoring-monitor/)](./media/iot-accelerators-remote-monitoring-monitor/#lightbox)

When you apply a filter, only those devices that match the filter conditions are displayed on the map and in the telemetry panel on the **Dashboard** page. You can see that there are two trucks connected to the solution accelerator, including truck-02:

[![Only trucks are displayed on the map](./media/iot-accelerators-remote-monitoring-/)](./media/iot-accelerators-remote-monitoring-/#lightbox)

To create, edit, and delete filters, click **Manage device groups**.

## View real-time telemetry

The solution accelerator plots real-time telemetry in the chart on the **Dashboard** page. The top of the telemetry chart shows available telemetry types for the devices, including truck-02, selected by the current filter. By default, the chart is showing the latitude of the trucks and both trucks appear to be moving:

[![Truck telemetry types](./media/iot-accelerators-remote-monitoring-)](./media/iot-accelerators-remote-monitoring-/#lightbox)

To view temperature telemetry for the trucks, click **Temperature**. You can see how the temperature for both trucks have varied over the last 15 minutes. You can also see that an alert for low temperature has been triggered for truck-02 in the alerts pane.

[![Truck temperature telemetry plot](./media/iot-accelerators-remote-monitoring-)](./media/iot-accelerators-remote-monitoring-/#lightbox)

## Explore data in the Time Series Insights explorer
To get a deeper look at your data to try and understand what is causing the low temperature alarm, open your truck telemetry data in the Time Series Insights explorer by clicking any of the outgoing links:

[![RM dashboard with TSI links highlighted](./media/iot-accelerators-remote-monitoring-)](./media/iot-accelerators-remote-monitoring-/#lightbox)

On the left hand side panel, select **Measure > Temperature** and **Split By > TruckId**.

[![TSI Explorer initial view](./media/iot-accelerators-remote-monitoring-)](./media/iot-accelerators-remote-monitoring-/#lightbox)

You will see the same view that you were looking at in the Remote Monitoring dashboard, and can zoom in closer to the time frame that the alert was triggered within.

[![TSI Explorer with temperature filter](./media/iot-accelerators-remote-monitoring-)](./media/iot-accelerators-remote-monitoring-/#lightbox)

You can also add in other telemetry streams coming from the trucks. Click the **Add** button in the top left hand corner. You will see a new pane appear.

[![TSI Explorer with new pane](./media/iot-accelerators-remote-monitoring-)](./media/iot-accelerators-remote-monitoring-/#lightbox)

In the new pane, select **Measure > Altitude** and **Split By > TruckId** to add the altitude telemetry into your view. You can also highlight only the telemetry coming from truck-02 by clicking on a specific TruckId.

[![TSI Explorer with temperature and altitude](./media/iot-accelerators-remote-monitoring-)](./media/iot-accelerators-remote-monitoring-/#lightbox)

## Diagnose the alert
When looking at all of the streams in the current view, you notice that the altitude profiles for the two trucks are very different and the temperature drop in truck-02 happens when the truck reaches a high altitude. You are surprised by the finding, because the trucks were scheduled to take the same route. 

To confirm your suspicion that the trucks took different journey paths, add in another pane to the side panel using the **Add** button and filter by **Measure > Latitude** and **Split By > TruckId**. You can see that the trucks were taking different journeys by looking at the difference in **Latitude** streams.

[![TSI Explorer with temperature, altitude, and latitude](./media/iot-accelerators-remote-monitoring-)](./media/iot-accelerators-remote-monitoring-/#lightbox)

## Create a new rule based on your learnings
While truck routes are generally optimized in advance, you realize that traffic pattern, weather, and other unpredictable events can cause delays and leave last minute route decisions to truck drivers based on their best judgement. However, since the temperature of your assets inside the vehicle is critical, you should set an additional rule back in your Remote Monitoring solution to make sure the average altitude range for each 1- minute interval stays below 300 m.

[![Remote Monitoring rules tab set altitude rule](./media/iot-accelerators-remote-monitoring-)](./media/iot-accelerators-remote-monitoring-/#lightbox)

To learn how to create and edit rules, check out the previous tutorial on [detecing device issues](iot-accelerators-remote-monitoring-automate.md).

[!INCLUDE [iot-accelerators-tutorial-cleanup](../../includes/iot-accelerators-tutorial-cleanup.md)]

## Next steps

This tutorial showed you how to use the Time Series Insights explorer with the Remote Monitoring solution accelerator to diagnose the root cause of an alert. To learn how to use the solution accelerator to identify and fix issues with your connected devices, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Use device alerts to identify and fix issues with devices connected to your monitoring solution](iot-accelerators-remote-monitoring-maintain.md)
