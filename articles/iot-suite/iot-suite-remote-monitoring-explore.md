---
title: Get started with the remote monitoring solution - Azure | Microsoft Docs 
description: This tutorial uses simulated scenarios to introduce the remote monitoring preconfigured solution. These scenarios are created when you deploy the remote monitoring preconfigured solution for the first time.
services: ''
suite: iot-suite
author: dominicbetts
manager: timlt
ms.author: dobett
ms.service: iot-suite
ms.date: 09/16/2017
ms.topic: article
ms.devlang: NA
ms.tgt_pltfrm: NA
ms.workload: NA
---

# Explore the capabilities of the remote monitoring preconfigured solution

This tutorial shows you the key capabilities of the remote monitoring solution. To introduce these capabilities, the tutorial showcases common customer scenarios using a simulated IoT application for a company called Contoso.

The tutorial helps you understand the typical IoT scenarios the remote monitoring solution provides out-of-the-box.

In this tutorial, you learn how to:

>[!div class="checklist"]
> * Visualize and filter devices on the dashboard
> * Respond to an alarm
> * Update the firmware in your devices
> * Organize your assets

## Prerequisites

To complete this tutorial, you need a deployed instance of the remote monitoring solution in your Azure subscription.

If you haven't deployed the remote monitoring solution yet, you should complete the [Deploy the remote monitoring preconfigured solution](iot-suite-remote-monitoring-deploy.md) tutorial.

## The Contoso sample IoT deployment

You can use the Contoso sample IoT deployment to understand the basic scenarios the remote monitoring solution provides out-of-the-box. These scenarios are based on real-life IoT deployments. Most likely, you will choose to customize the remote monitoring solution to meet your specific requirements, but the Contoso sample helps you learn the basics.

The Contoso sample provisions a set of simulated devices and rules to act on them. Once you understand the basic scenarios, you can continue exploring more of the solution features in [Perform advanced device monitoring using the remote monitoring solution](iot-suite-remote-monitoring-monitor.md).

Contoso is a company that manages a variety of assets in different environments. Contoso plans to use the power of cloud-based IoT applications to remotely monitor and manage multiple assets from a centralized application. The following sections provide a summary of the initial configuration of the Contoso sample:

> [!NOTE]
> The Contoso demo is only one way to provision simulated devices and create rules. Other provisioning options include the creation of your own custom devices. To learn more about how to create your own devices and rules, see [Manage and configure your devices](iot-suite-remote-monitoring-manage.md) and [Detect issues using threshold-based rules](iot-suite-remote-monitoring-automate.md).

### Contoso devices

Contoso uses different types of smart devices. These devices fulfill different roles for the company, sending various telemetry streams. Additionally, each device type has different device properties and supported methods.

The following table shows a summary of the provisioned device types:

| Device type        | Telemetry                                  | Properties                                  | Tags                    | Methods                                                                                      |
| ------------------ | ------------------------------------------ | ------------------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------- |
| Chiller            | Temperature, Humidity, Pressure            | Type, Firmware version, Model               | Location, Floor, Campus | Reboot, Firmware Update, Emergency Valve Release, Increase Pressure                          |
| Prototyping device | Temperature, Pressure, Geo-location        | Type, Firmware version, Model               | Location, Mode          | Reboot, Firmware Update, Move device, Stop device, Temperature release, Temperature increase |
| Engine             | Tank fuel level, Coolant sensor, Vibration | Type, Firmware version, Model               | Location, Floor, Campus | Restart, Firmware Update, Empty tank, Fill tank                                              |
| Truck              | Geo-location, Speed, Cargo temperature     | Type, Firmware version, Model               | Location, Load          | Lower cargo temperature, Increase cargo temperature, Firmware update                         |
| Elevator           | Floor, Vibration, Temperature              | Type, Firmware version, Model, Geo-location | Location, Campus        | Stop elevator, Start elevator, Firmware update                                               |

> [!NOTE]
> The Contoso demo sample provisions two devices per type. For each type, one functions correctly within the boundaries defined as normal by Contoso, and the one has some kind of malfunctioning. In the next section, you learn about the rules that Contoso defines for the devices. These rules define the boundaries of correct behavior.

### Contoso rules

Operators at Contoso know the thresholds that determine whether a device is working correctly. For example, a chiller is not working correctly if the pressure that it reports is greater than 250 PSI. The following table shows threshold-based rules Contoso defines for each device type:

| Rule Name | Description | Threshold | Severity | Affected devices |
| --------- | ----------- | --------- | -------- | ---------------- |
| Too much pressure     | Alerts if chillers reach higher than normal pressure levels   |P>250 psi       | Critical | Chillers            |
| Too much temperature  | Alerts if prototyping devices reach higher than normal temperature levels  |T>80&deg; F |Critical | Prototyping devices |
| Empty tank            | Alerts if engine fuel tank goes empty                     | F<5 gallons | Info     | Engines             |
| Hot cargo temperature | Alerts if truck's cargo temperature is higher than normal                 | T<45&deg; F |Warning  | Trucks              |
| Stopped elevator      | Alerts if elevator stops completely, vibration level                     | V<0.1 mm |Warning  | Elevators           |

### Operate the Contoso sample deployment

You have now seen the initial setup in the Contoso sample. The following sections describe three scenarios in the Contoso sample that illustrate how an operator might use the preconfigured solution.

## Respond to a pressure alarm

This scenario shows you how to identify and respond to an alarm that's triggered by a chiller device. The chiller is located in Redmond, in building 43, floor 2.

As an operator, you see in the dashboard that there's an alarm related to the pressure of a chiller.

1. On the **Dashboard** page, in the **Alarm Status** grid, you can see the **Chiller pressure too high** alarm. The chiller is also highlighted on the map:

    <!-- Insert screenshot -->

1. To view the device details and telemetry, click the highlighted chiller on the map. The telemetry shows a pressure spike:

    <!-- Insert screenshot -->

1. Close **Device details** and click **...** next to the alarm in the alarm grid. To navigate to the rule definition, select **Maintenance**.

On the **Maintenance** page, you can view the details of the rule that triggered the chiller pressure alarm.

1. You can see the number of times the alarm has triggered, acknowledgments, and open and closed alarms:

    <!-- Insert screenshot -->

1. The first alarm in the list is the most recent one. Click this alarm to view the associated devices and telemetry. The telemetry shows a pressure spike for the chiller:

    <!-- Insert screenshot -->

You have now identified the issue that triggered the alarm and the associated device. As an operator, the next steps are to acknowledge the alarm and mitigate the issue.

1. To indicate that you are now working on the alarm, change the **Alarm status** to **Acknowledge**. Then select the affected chiller:

    <!-- Insert screenshot -->

1. To act on the chiller, select **Schedule** in the upper-right panel. Select **Valve pressure release**, add a job name **Chiller pressure release**, do not add a time range. These settings create a job that executes immediately:

    <!-- Insert screenshot -->

1. To view the job status, return to the **Maintenance** page and view the list of events. You can see the job has run to release the valve pressure on the chiller:

    <!-- Insert screenshot -->

Finally, confirm that the telemetry values from the chiller are back to normal.

1. To view the alarms grid, navigate to the **Dashboard** page.

1. View the device telemetry for the original alarm and confirm that is back to normal.

1. To close the incident, navigate to the **Maintenance** page, select the alarm, and set the status to **Closed**:

    <!-- Insert screenshot -->

## Update device firmware

Contoso is testing a new type of device in the field. As part of the testing cycle, you need to ensure that device firmware updates work correctly. The following steps show you how to use the remote monitoring solution to update the firmware on multiple devices.

To perform the necessary device management tasks, use the **Devices** page. Start by filtering for all prototyping devices:

1. Navigate to the **Devices** page. Choose the **Prototyping** filter in the **Filters** drop-down:

    <!-- Insert screenshot -->

    > [!TIP]
    > Click **Manage** to manage the available filters.

1. Select one of the prototyping devices:

    <!-- Insert screenshot -->

1. Click the **Schedule** button and then choose **Firmware update**:

    <!-- Insert screenshot -->

1. Enter values for **Job name** and **Firmware URL**. Schedule the job to run now:

    <!-- Insert screenshot -->

1. Click **Apply** and note how many devices the job affects:

    <!-- Insert screenshot -->

You can use the **Maintenance** page to track the job as it runs.

1. Navigate to the **Maintenance** page and click **System status**:

    <!-- Insert screenshot -->

1. Locate the event related to the job you created. Verify that the firmware update process was initiated correctly:

    <!-- Insert screenshot -->

You can create a filter to verify the firmware version update correctly.

1. To create a filter, navigate to the **Devices** page and select **Manage**:

    <!-- Insert screenshot -->

1. Create a group that includes only devices with the new firmware version:

    <!-- Insert screenshot -->

1. Return to the **Devices** page and verify that the device has the new firmware version:

    <!-- Insert screenshot -->

## Organize your assets

Contoso has two different teams for field service activities:

* The Smart Building team manages chillers, elevators, and engines.
* The Smart Vehicle team manages trucks and prototyping devices.

To make it easier as an operator to organize and manage your devices, you want to tag them with the appropriate team name.

You can create tag names to use with devices.

1. To display all the devices, navigate to the **Devices** page and choose the **All** filter:

    <!-- Insert screenshot -->

1. Select the **Trucks** and **Prototyping** devices. Then choose **Tag**:

    <!-- Insert screenshot -->

1. In the **Tag** menu, create a new tag called **FieldService** with a value **ConnectedVehicle**. Then click **Save**:

    <!-- Insert screenshot -->

1. Select the **Chiller**, **Elevator**, and **Engine** devices. Then choose **Tag**:

    <!-- Insert screenshot -->

1. In the **Tag** menu, create a new tag called **FieldService** with a value **SmartBuilding**. Then click **Save**:

    <!-- Insert screenshot -->

You can use the tag values to create filters.

1. On the **Devices** page, choose **Manage filters**:

    <!-- Insert screenshot -->

1. Create a new group that uses the tag name **FieldService** and value **SmartBuilding**. Save the filter as **Smart Building**:

    <!-- Insert screenshot -->

1. Create a new group that uses the tag name **FieldService** and value **ConnectedVehicle**. Save the filter as **Connected Vehicle**:

    <!-- Insert screenshot -->

Now the Contoso operator can query devices based on the operating team without the need to change anything on the devices.

## Next steps

In this tutorial, you learned to:

>[!div class="checklist"]
> * Visualize and filter devices on the dashboard
> * Respond to an alarm
> * Update the firmware in your devices
> * Organize your assets

Now that you have explored the remote monitoring solution, the suggested next steps are to learn about the advanced features of the remote monitoring solution:

* [Monitor your devices](./iot-suite-remote-monitoring-monitor.md).
* [Manage your devices](./iot-suite-remote-monitoring-manage.md).
* [Automate your solution with rules](./iot-suite-remote-monitoring-automate.md).
* [Maintain your solution](./iot-suite-remote-monitoring-maintain.md).


<!-- Next tutorials in the sequence -->