---
title: Use alerts and fix device issues in the remote monitoring solution - Azure | Microsoft Docs
description: This tutorial shows you how to Use alerts to identify and fix issues with devices connected to the Remote Monitoring solution accelerator.
author: dominicbetts
manager: timlt
ms.author: dobett
ms.service: iot-accelerators
services: iot-accelerators
ms.date: 06/18/2018
ms.topic: tutorial
ms.custom: mvc

# As an operator of an IoT monitoring solution, I need to use alerts to identify andf fix issues with my devices. 
---

# Troubleshoot and remediate device issues

In this tutorial, you use the Remote Monitoring solution accelerator to identify and fix issues with your connected IoT devices. You use alerts in the solution accelerator dashboard to identify issues and then run remote jobs to fix those issues.

Contoso is testing a new **Prototype** device in the field. As a Contoso operator, you notice during testing that the **Prototype** device is unexpectedly triggering a temperature alert on the dashboard. You must now investigate the behavior of this faulty **Prototype** device and resolve the issue.

In this tutorial, you:

>[!div class="checklist"]
> * Investigate an alert from a device
> * Resolve the issue with the device

## Prerequisites

To follow this tutorial, you need a deployed instance of the Remote Monitoring solution accelerator in your Azure subscription.

If you haven't deployed the Remote Monitoring solution accelerator yet, you should complete the [Deploy a cloud-based remote monitoring solution](quickstart-remote-monitoring-deploy.md) quickstart.

## Investigate an alert

On the **Dashboard** page you notice there are unexpected temperature alerts coming from the rule associated with the **Prototype** devices:

[![Alerts showing on the dashboard](./media/iot-accelerators-remote-monitoring-maintain/dashboardalarm-inline.png)](./media/iot-accelerators-remote-monitoring-maintain/dashboardalarm-expanded.png#lightbox)

To investigate the issue further, choose the **Explore Alert** option next to the alert:

[![Explore alert from the dashboard](./media/iot-accelerators-remote-monitoring-maintain/dashboardexplorealarm-inline.png)](./media/iot-accelerators-remote-monitoring-maintain/dashboardexplorealarm-expanded.png#lightbox)

The detail view of the alert shows:

* When the alert was triggered
* Status information about the devices associated with the alert
* Telemetry from the devices associated with the alert

[![Alert details](./media/iot-accelerators-remote-monitoring-maintain/maintenancealarmdetail-inline.png)](./media/iot-accelerators-remote-monitoring-maintain/maintenancealarmdetail-expanded.png#lightbox)

To acknowledge the alert, select all the **Alert occurrences** and choose **Acknowledge**. This action lets other operators know that you have seen the alert and are working on it:

[![Acknowledge the alerts](./media/iot-accelerators-remote-monitoring-maintain/maintenanceacknowledge-inline.png)](./media/iot-accelerators-remote-monitoring-maintain/maintenanceacknowledge-expanded.png#lightbox)

When you acknowledge the alert, the status of the occurrence changes to **Acknowledged**.

In the list, you can see the **Prototype** device responsible for firing the temperature alert:

[![List the devices causing the alert](./media/iot-accelerators-remote-monitoring-maintain/maintenanceresponsibledevice-inline.png)](./media/iot-accelerators-remote-monitoring-maintain/maintenanceresponsibledevice-expanded.png#lightbox)

## Resolve the issue

To resolve the issue with the **Prototype** device, you need to call the **DecreaseTemperature** method on the device.

To act on a device, select it in the list of devices and then choose **Jobs**. The **Prototype** device model specifies six methods a device must support:

[![View the methods the device supports](./media/iot-accelerators-remote-monitoring-maintain/maintenancemethods-inline.png)](./media/iot-accelerators-remote-monitoring-maintain/maintenancemethods-expanded.png#lightbox)

Choose **DecreaseTemperature** and set the job name to **DecreaseTemperature**. Then choose **Apply**:

[![Create the job to decrease the temperature](./media/iot-accelerators-remote-monitoring-maintain/maintenancecreatejob-inline.png)](./media/iot-accelerators-remote-monitoring-maintain/maintenancecreatejob-expanded.png#lightbox)

To track the status of the job, click **View job status**. Use the **Jobs** view to track all the jobs and method calls in the solution:

[![Monitor the job to decrease the temperature](./media/iot-accelerators-remote-monitoring-maintain/maintenancerunningjob-inline.png)](./media/iot-accelerators-remote-monitoring-maintain/maintenancerunningjob-expanded.png#lightbox)

You can check that the temperature of the device has decreased by viewing the telemetry on the **Dashboard** page:

[![View the decrease in temperature](./media/iot-accelerators-remote-monitoring-maintain/jobresult-inline.png)](./media/iot-accelerators-remote-monitoring-maintain/jobresult-expanded.png#lightbox)

## Next steps

This tutorial showed you how to use alerts to identify issues with your devices and how to act on those devices to resolve the issues. To learn how to connect a physical device to your solution accelerator, continue to the how-to articles.

Now you have learned how to manage device issues, the suggested next step is to learn how to [Connect your device to the Remote Monitoring solution accelerator](iot-accelerators-connecting-devices.md).
