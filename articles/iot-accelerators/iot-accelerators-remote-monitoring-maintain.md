---
title: Troubleshoot devices in remote monitoring solution - Azure | Microsoft Docs
description: This tutorial shows you how to troubleshoot and remediate device issues in the remote monitoring solution.
author: dominicbetts
manager: timlt
ms.author: dobett
ms.service: iot-accelerators
services: iot-accelerators
ms.date: 05/01/2018
ms.topic: conceptual
---

# Troubleshoot and remediate device issues

This tutorial shows you how to use the **Maintenance** page in the solution to troubleshoot and remediate device issues. To introduce these capabilities, the tutorial uses a scenario in the Contoso IoT application.

Contoso is testing a new **Prototype** device in the field. As a Contoso operator, you notice during testing that the **Prototype** device is unexpectedly triggering a temperature alert on the dashboard. You must now investigate the behavior of this faulty **Prototype** device.

In this tutorial, you learn how to:

>[!div class="checklist"]
> * Use the **Maintenance** page to investigate the alert
> * Call a device method to remediate the issue

## Prerequisites

To follow this tutorial, you need a deployed instance of the Remote Monitoring solution in your Azure subscription.

If you haven't deployed the Remote Monitoring solution yet, you should complete the [Deploy the Remote Monitoring solution accelerator](iot-accelerators-remote-monitoring-deploy.md) tutorial.

## Use the maintenance dashboard

On the **Dashboard** page you notice there are unexpected temperature alerts coming from the rule associated with the **Prototype** devices:

![Alerts showing on the dashboard](./media/iot-accelerators-remote-monitoring-maintain/dashboardalarm.png)

To investigate the issue further, choose the **Explore Alert** option next to the alert:

![Explore alert from the dashboard](./media/iot-accelerators-remote-monitoring-maintain/dashboardexplorealarm.png)

The detail view of the alert shows:

* When the alert was triggered
* Status information about the devices associated with the alert
* Telemetry from the devices associated with the alert

![Alert details](./media/iot-accelerators-remote-monitoring-maintain/maintenancealarmdetail.png)

To acknowledge the alert, select the **Alert occurrences** and choose **Acknowledge**. This action enables other operators to see that you have seen the alert and are working on it.

![Acknowledge the alerts](./media/iot-accelerators-remote-monitoring-maintain/maintenanceacknowledge.png)

When you acknowledge the alert, the status of the occurrence changes to **Acknowledged**.

In the list, you can see the **Prototype** device responsible for firing the temperature alert:

![List the devices causing the alert](./media/iot-accelerators-remote-monitoring-maintain/maintenanceresponsibledevice.png)

## Remediate the issue

To remediate the issue with the **Prototype** device, you need to call the **DecreaseTemperature** method on the device.

To act on a device, select it in the list of devices and then choose **Jobs**. The **Prototype** device model specifies six methods a device must support:

![View the methods the device supports](./media/iot-accelerators-remote-monitoring-maintain/maintenancemethods.png)

Choose **DecreaseTemperature** and set the job name to **DecreaseTemperature**. Then choose **Apply**:

![Create the job to decrease the temperature](./media/iot-accelerators-remote-monitoring-maintain/maintenancecreatejob.png)

To track the status of the job on the **Maintenance** page, choose **Jobs**. Use the **Jobs** view to track all the jobs and method calls in the solution:

![Monitor the job to decrease the temperature](./media/iot-accelerators-remote-monitoring-maintain/maintenancerunningjob.png)

To view the details of a specific job or method call, choose it in the list in the **Jobs** view:

![View job details](./media/iot-accelerators-remote-monitoring-maintain/maintenancejobdetail.png)

## Next steps

In this tutorial, you saw how to:

<!-- Repeat task list from intro -->
>[!div class="checklist"]
> * Use the **Maintenance** page to investigate the alert
> * Call a device method to remediate the issue

Now you have learned how to manage device issues, the suggested next step is to learn how to [Test your solution with simulated devices](iot-accelerators-remote-monitoring-test.md).

<!-- Next tutorials in the sequence -->