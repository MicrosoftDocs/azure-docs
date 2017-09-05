---
title: Advance monitoring using Azure IoT Suite remote monitoring | Microsoft Docs
description: This tutorial shows you how to monitor devices with the remote monitoring solution dashboard.
services: ''
suite: iot-suite
author: dominicbetts
manager: timlt
ms.author: dobett
ms.service: iot-suite
ms.date: 08/09/2017
ms.topic: article
ms.devlang: NA
ms.tgt_pltfrm: NA
ms.workload: NA
---

# Perform advanced monitoring using the remote monitoring solution

As an operator, you need to monitor the location and behavior of your trucks in the field. In this tutorial, you use two simulated truck devices to learn how to monitor your devices from the preconfigured solution dashboard.

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

## Use a filter

To display only the **Truck** devices, choose the **Trucks** filter in the filter drop-down:

<!-- TODO insert screenshot -->

When you apply a filter, only those devices that match the filter conditions display in the map on the **Dashboard** page:

<!-- TODO insert screenshot -->

The filter also determines which devices you see in the **Telemetry** chart:

<!-- TODO insert screenshot -->

### Drilling through the maps

To view the details of a device, click the device on the map. The details include:

* Recent telemetry values
* Methods the device supports
* Device properties

<!-- TODO insert screenshot -->

## View real-time telemetry

The preconfigured solution displays real-time telemetry data in multiple locations.

### Map

<!-- TODO Check this is true -->
If you hover the mouse pointer over a device on the map, you can view the most recent telemetry from that device:

<!-- TODO insert screenshot -->

The map also displays summary information about the devices provisioned in the solution:

<!-- TODO insert screenshot -->

### Telemetry chart

Use the telemetry chart to view detailed telemetry information for the devices selected by the current filter.

#### Choosing telemetry

To select the telemetry values to display, use the controls at the top of the chart:

<!-- TODO insert screenshot -->

#### Pausing telemetry flow

To pause the live telemetry display, click the **flowing** button. To re-enable the live display, click the **pause** button:

<!-- TODO insert screenshot -->

## View device details

<!-- Does this duplicate the "Drill through section above"? -->
To view the details of a device, click the device on the map. The details include:

* Recent telemetry values
* Methods the device supports
* Device properties

<!-- TODO insert screenshot -->

## View alarms from your devices

The **Dashboard** page displays the most recent alarms from the devices connected to the solution:

<!-- TODO insert screenshot -->

## View the system KPIs

The **Dashboard** page displays system KPIs. To change the KPIs displayed, use the drop-down next to each KPI value:

<!-- TODO insert screenshot -->

## Next steps

This tutorial showed you how to use the **Dashboard** page to filter and monitor the devices provisioned in your remote monitoring solution:

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