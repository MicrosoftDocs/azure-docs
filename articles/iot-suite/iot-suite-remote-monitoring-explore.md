---
title: Get started with Azure IoT Suite remote monitoring | Microsoft Docs 
description: This tutorial uses the simulated scenario created when you deploy the remote monitoring preconfigured solution for the first time to introduce the main scenarios enabled by the solution.
services: ''
suite: iot-suite
author: dominicbetts
manager: timlt
ms.author: dobett
ms.service: iot-suite
ms.date: 08/24/2017
ms.topic: article
ms.devlang: NA
ms.tgt_pltfrm: NA
ms.workload: NA
---

# Explore the capabilities of the remote monitoring preconfigured solution

This tutorial shows you how to access the key capabilities of the remote monitoring solution using the solution dashboard. To introduce these capabilities, the tutorial showcases common customer scenarios using a simulated IoT application for a company called Contoso. This tutorial helps you understand the typical IoT scenarios the remote monitoring solution provides out-of-the-box.

In this tutorial, you learn to:

>[!div class="checklist"]
> * Visualize and filter devices on the dashboard
> * Use simulated devices 
> * Analyze device-triggered alarms
> * Troubleshoot and remediate device issues

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

| Device type | Telemetry | Properties | Tags | Methods |
| ----------- | --------- | ---------- | ---- |-------- |
| Chiller            |Temperature, Humidity, Pressure            | Type, Firmware version, Model               | Location, Floor, Campus | Reboot, Firmware Update, Emergency Valve Release, Increase Pressure                          |
| Prototyping device | Temperature, Pressure, Geo-location       | Type, Firmware version, Model               | Location, Mode          | Reboot, Firmware Update, Move device, Stop device, Temperature release, Temperature increase |
| Engine             | Tank fuel level, Coolant sensor, Vibration | Type, Firmware version, Model               | Location, Floor, Campus | Restart, Firmware Update, Empty tank, Fill tank                                               |
| Truck              | Geo-location, Speed, Cargo temperature    | Type, Firmware version, Model               | Location, Load          | Lower cargo temperature, Increase cargo temperature, Firmware update                             |
| Elevator           | Floor, Vibration, Temperature             | Type, Firmware version, Model, Geo-location | Location, Campus        | Stop elevator, Start elevator, Firmware update                                  |

> [!NOTE]
> The Contoso demo sample provisions two devices per type. For each type, one functions correctly within the boundaries defined as normal by Contoso, and the one has some kind of malfunctioning. In the next section, you learn about the rules that Contoso defines for the devices. These rules define the boundaries of correct behavior.

### Contoso rules

Operators at Contoso know the thresholds that determine whether a device is working correctly. For example, a chiller is not working correctly if the pressure that it reports is greater than 250 PSI. The following table shows threshold-based rules Contoso defines for each device type:

| Rule Name | Description | Threshold | Severity | Affected devices |
| --------- | ----------- | --------- | -------- | ---------------- |
| Too much pressure     | Alerts if chillers reach higher than normal pressure levels (> 250 PSI)            | Critical | Chillers            |
| Too much temperature  | Alerts if prototyping devices reach higher than normal temperature levels (> 80 F) | Critical | Prototyping devices |
| Empty tank            | Alerts if engine fuel tank goes empty (Fuel level < 5 gallons)                    | Info     | Engines             |
| Hot cargo temperature | Alerts if truck's cargo temperature is higher than normal (> 45 F)                 | Warning  | Trucks              |
| Stopped elevator      | Alerts if elevator stops completely, vibration level (<0.1 mm>)                    | Warning  | Elevators           |

## Operate the Contoso sample deployment

You have now seen the initial setup in the Contoso sample. The following sections describe four scenarios in the Contoso sample where an operator must analyze real-time data and decide how to act.

### Respond to a pressure alarm

This scenario shows how an operator identifies the alarm that's triggered by a chiller. The chiller is located in Redmond in building 43, floor 2.

Clicks on device details and sees the telemetry for pressure.

Goes to maintenance dashboard to see rule.

Examines associated rule, actions, and devices.

Acts on device and uses the release valve method.

Device works properly. Go to the dashboard to see it.

### Respond to a temperature alarm

This scenario shows how an operator investigates a temperature alarm. Contoso is running a test for a new field device, tagged as **Test 2**, which could be causing the alarm. Contoso is using prototyping devices for the test. Contoso wants to test if devices with a high temperature can self-heal by using a method to start a cooling system remotely. To perform the test, Contoso provisions a device with a higher than normal temperature to trigger an alarm. To investigate, the operator at Contoso:

Sees alarm status.

Clicks to see device details

In this case, operator knows what to do directly, so they go to the devices page to act on the device directly.

Operator applies decrease temperature method (new cooling system they are testing).

Problem is fixed. Show normal dashboard.

### Solve a field incident

In this scenario, Contoso has multiple trucks traveling in the Seattle area. Each truck has different cargo.

To see the different tags that represent the cargo type, show the trucks in the map, and point to devices details.

One of the trucks has raised a warning for high temperature. Show T and alarm as a warning, not as critical.

Operator goes to devices page and lowers T so the cargo is now safe.

### Fix equipment remotely

In this scenario, an elevator is stopped in building 1 on the Redmond campus. The operator at Contoso knows the elevator is stationary because of an alarm that shows vibration has stopped completely.

A technician evaluates the potential problem, decides to update the firmware version and then restart the elevator. With the new firmware patch, the elevator now works.

## Next steps

In this tutorial, you learned to:

>[!div class="checklist"]
> * Visualize and filter devices on the dashboard
> * Use simulated devices 
> * Analyze device-triggered alarms
> * Troubleshoot and remediate device issues

Now that you have explored the remote monitoring solution, the suggested next steps are to learn about the advanced features of the remote monitoring solution:

* [Monitor your devices](./iot-suite-remote-monitoring-monitor.md).
* [Manage your devices](./iot-suite-remote-monitoring-manage.md).
* [Automate your solution with rules](./iot-suite-remote-monitoring-automate.md).
* [Maintain your solution](./iot-suite-remote-monitoring-maintain.md).


<!-- Next tutorials in the sequence -->