---
title: Troubleshoot devices in remote monitoring solution - Azure | Microsoft Docs
description: This tutorial shows you how to troubleshoot and remediate device issues in the remote monitoring solution.
services: ''
suite: iot-suite
author: dominicbetts
manager: timlt
ms.author: dobett
ms.service: iot-suite
ms.date: 09/07/2017
ms.topic: article
ms.devlang: NA
ms.tgt_pltfrm: NA
ms.workload: NA
---

# Troubleshoot and remediate device issues

Contoso is testing a new **Prototype** device in the field. As a Contoso operator, you notice during testing that the **Prototype** device is erroneously triggering a temperature alarm on the dashboard. You must now investigate the behavior of this faulty **Prototype** device.

This tutorial shows you how to use the **Maintenance** page in the solution to troubleshoot and remediate these device issues.

In this tutorial, you learn how to:

>[!div class="checklist"]
> * Use the **Maintenance** page to investigate the alarm
> * Call a device method to remediate the issue

## Prerequisites

To follow this tutorial, you need a deployed instance of the remote monitoring solution in your Azure subscription.

If you haven't deployed the remote monitoring solution yet, you should complete the [Deploy the remote monitoring preconfigured solution](iot-suite-remote-monitoring-deploy.md) tutorial.

## Use the maintenance dashboard

<!-- Need to update with the name of the rule in question -->
On the **Dashboard** page you notice there are unexpected alarms coming from the rule associated with the **Prototype** devices:

<!-- TODO insert screenshot -->

To investigate the issue further, choose the **Explore Alarm** option next to the alarm:

<!-- TODO insert screenshot -->

<!-- TODO Check if the deep link goes directly to the alarm detail or to the list -->
You can now see a list of alarms on the **Maintenance** page:

<!-- TODO insert screenshot -->

To display details of the alarm, choose the alarm in the **Alarms** list. The detail view shows:

* When the alarm fired
* Status information about the devices associated with the alarm
* Telemetry from the devices associated with the alarm

<!-- TODO insert screenshot -->

To acknowledge you have seen the alarm, select the **Alarm occurrences** and choose **Acknowledge**.

<!-- TODO insert screenshot -->

In the list, you can see the **Prototype** device responsible for erroneously firing the temperature alarm:

<!-- TODO insert screenshot -->

## Remediate the issue

To remediate the issue with the **Prototype** device, you need to call the **DecreaseTemperature** method on the device.

<!-- TODO Clarify how the navigation to the device to call the method works. -->

To act on a device, select it in the list of devices and then choose **Schedule**. The **Engine** device model specifies three methods a device must support:

<!-- TODO insert screenshot -->

Choose **DecreaseTemperature** and set the job name to **Decrease temperature**:

<!-- TODO insert screenshot -->

To track the status of the job on the **Maintenance** page, choose **System Status**. Use the **System Status** view to track all the jobs and method calls in the solution:

<!-- TODO insert screenshot -->

To view the details of a specific job or method call, choose it in the list in the **System Status** view:

<!-- TODO insert screenshot -->

## Next steps

In this tutorial, we showed you how to:

<!-- Repeat task list from intro -->
>[!div class="checklist"]
> * Use the **Maintenance** page to investigate the alarm
> * Call a device method to remediate the issue

Now you have learned how to manage device issues, the suggested next step is to learn how to [Test your solution with simulated devices](iot-suite-remote-monitoring-test.md).

<!-- Next tutorials in the sequence -->