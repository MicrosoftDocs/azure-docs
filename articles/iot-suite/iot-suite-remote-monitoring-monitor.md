---
title: Advanced monitoring in remote monitoring solution - Azure | Microsoft Docs
description: This tutorial shows you how to monitor devices with the remote monitoring solution dashboard.
services: ''
suite: iot-suite
author: dominicbetts
manager: timlt
ms.author: dobett
ms.service: iot-suite
ms.date: 09/28/2017
ms.topic: article
ms.devlang: NA
ms.tgt_pltfrm: NA
ms.workload: NA
---

# Perform advanced monitoring using the remote monitoring solution

This tutorial shows the capabilities of the remote monitoring dashboard. To introduce these capabilities, the tutorial uses a scenario in the Contoso IoT application.

In this tutorial, you use two simulated Contoso truck devices to learn how to monitor your devices from the preconfigured solution dashboard. As a Contoso operator, you need to monitor the location and behavior of your trucks in the field.

In this tutorial, you learn how to:

>[!div class="checklist"]
> * Filter the devices in the dashboard
> * View real-time telemetry
> * View device details
> * View alarms from your devices
> * View the system KPIs

## Prerequisites

To follow this tutorial, you need a deployed instance of the remote monitoring solution in your Azure subscription.

If you haven't deployed the remote monitoring solution yet, you should complete the [Deploy the remote monitoring preconfigured solution](iot-suite-remote-monitoring-deploy.md) tutorial.

## Choose the devices to display

To select which devices display on the **Dashboard** page, use filters. To display only the **Truck** devices, choose the built-in **Trucks** filter in the filter drop-down:

![Filter for trucks on the dashboard](media/iot-suite-remote-monitoring-monitor/dashboardtruckfilter.png)

When you apply a filter, only those devices that match the filter conditions display in the map on the **Dashboard** page:

![Trucks display on the map](media/iot-suite-remote-monitoring-monitor/dashboardtruckmap.png)

The filter also determines which devices you see in the **Telemetry** chart:

![Truck telemetry displays on the dashboard](media/iot-suite-remote-monitoring-monitor/dashboardtelemetry.png)

To create, edit, and delete filters, choose **Manage filters**.

## View real-time telemetry

The preconfigured solution plots detailed real-time telemetry data in the chart on the **Dashboard** page. The telemetry chart shows telemetry information for the devices selected by the current filter:

![Truck telemetry plot](media/iot-suite-remote-monitoring-monitor/dashboardtelemetryview.png)

To select the telemetry values to view, choose the telemetry type at the top of the chart:

![Truck telemetry plot](media/iot-suite-remote-monitoring-monitor/dashboardselecttelemetry.png)

To pause the live telemetry display, choose **Flowing**. To re-enable the live display, choose **Pause**:

![Pause and restart telemetry display](media/iot-suite-remote-monitoring-monitor/dashboardtelemetrypause.png)

## Use the map

The map displays information about the simulated trucks selected by the current filter. You can zoom and pan the map to display locations in more or less detail. The device icons on the map indicate any **Alarms** or **Warnings** that are active for the device. A summary of the number of **Alarms** and **Warnings** displays to the left of the map.

To view the device details, pan and zoom the map to locate the devices, then click the device on the map. The details include:

* Recent telemetry values
* Methods the device supports
* Device properties

![View device details on the dashboard](media/iot-suite-remote-monitoring-monitor/dashboarddevicedetail.png)

## View alarms from your devices

The map highlights the devices in the current filter with **Alarms** and **Warnings**. The **System alarms** panel displays detailed information about the most recent alarms from your devices:

![View system alarms on the dashboard](media/iot-suite-remote-monitoring-monitor/dashboardsystemalarms.png)

You can use the **System alarms** filter to adjust the time span for recent alarms. By default, the panel displays alarms from the last hour:

![Filter the alarms by time](media/iot-suite-remote-monitoring-monitor/dashboardalarmsfilter.png)

> [!NOTE]
> Scroll to the right to see the time span filter.

## View the system KPIs

The **Dashboard** page displays system KPIs:

![Filter the alarms by time](media/iot-suite-remote-monitoring-monitor/dashboardkpis.png)

You can use the **System KPI** filter to adjust the time span for the KPI aggregation. By default, the panel displays KPIs aggregated over the last hour.

## Next steps

This tutorial showed you how to use the **Dashboard** page to filter and monitor the simulated trucks provisioned in your remote monitoring solution:

<!-- Repeat task list from intro -->
>[!div class="checklist"]
> * Filter the devices in the dashboard
> * View real-time telemetry
> * View device details
> * View alarms from your devices
> * View the system KPIs

Now that you have learned how to monitor your devices, the suggested next steps are to learn how to:

* [Detect issues using threshold-based rules](./iot-suite-remote-monitoring-automate.md).
* [Manage and configure your devices](./iot-suite-remote-monitoring-manage.md).
* [Troubleshoot and remediate device issues](./iot-suite-remote-monitoring-maintain.md).
* [Test your solution with simulated devices](iot-suite-remote-monitoring-test.md).

<!-- Next tutorials in the sequence -->