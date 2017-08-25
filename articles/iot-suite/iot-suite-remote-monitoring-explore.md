---
title: Get Started with the Remote Monitoring preconfigured solution | Microsoft Docs 
description: This tutorial shows you how the main scenarios enabled by the Remote Monitoring solution by introducing the simulated scenario created when you deploy de solution for the first time
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

This tutorial shows you how to access the key capabilities of the remote monitoring solution using the solution dashboard. We will introduce the basic capabilities by showcasing customer scenarios using a fake IoT application from Contoso. This will help you understand the typical IoT scenarios that remote monitoring provides out-of-the-box. 

In this tutorial, you will learn to:

>[!div class="checklist"]
> * Visualize and filter devices on the dashboard
> * Use simulated devices 
> * Analyze device-triggered alarms
> * Toubleshoot and remediate device issues

## Prerequisites

To complete this tutorial, you need a deployed instance of the remote monitoring solution in your Azure subscription.

If you haven't deployed the remote monitoring solution yet, you should complete the [Deploy the remote monitoring preconfigured solution](iot-suite-remote-monitoring-deploy.md) tutorial.

## The Contoso IoT sample deployment

The Contoso IoT sample deployment is an environment that we have created so you can understand the basic scenarios the remote monitoring provides out of the box. Most likely, you will choose to customize the remote monitoring solution in some way, but these scenarios are a good start as you learn the basics. 

To do this, we provision a set of simulated devices and rules to act on them. These scenarios are inspired out of real IoT deployments that we've seen over the years. Once you understand the basic scenarios, you can continue exploring more of the solution features in teh How to tutorials (add link here).

For our sample purpose, think of Contoso as a Company that company that manages a variety of assets in different environments. Contoso wants to leverate the power of cloud-based IoT applications to remotely monitor and manage their different assets from a centralized application. Below is a summary of the initial Contoso setting.

 > [!NOTE]
    > The Contoso demo is only one way that you can provision simulated devices and create rules. There are many other ways, including the creation of your own custom devices. To learn more about how to create your own devices and rules, please visit the How to section (insert links)

### Contoso Devices

Contoso has different types of smart devices. All these devices fill differnt roles for the compnay, sending various telemetry streams. Additionally, each device type has different device properties and supported methods. 

Below is a summary of the device types that are provisioned:
 
| Device type | Telemetry | Properties             | Tags          | Methods           |
| ---------------------- | ------- | ------------- | ------------- |------------------ |
| Chiller      |Temperature, Humidity, Pressure    | Type, Firmware version, Model | Location, Floor, Campus | Reboot, Firmware Update, Emergency Valve Release, Increase Pressure |
| Prototyping device | Temperature, Pressure, Geo-location      | Type, Firmware version, Model          | Location, Mode          | Reboot, Firmware Update, Move device, Stop device, Temperature release, Temperature increase |
| Engine | Tank fuel level, Coolat sensor, Vibration      | Type, Firmware version, Model          | Location, Floor, Campus  | Re-start, Firmware Update, Empty tank, Fill tank  |
| Truck | Geo-location, Speed, Cargo temperature      | Type, Firmware version, Model          | Location, Load  | Lower cargo temperature, Increase cargo temperature, Firmware update |
| Elevator | Floor, Vibration, Temperature      | Type, Firmware version, Model, Geo-location          | Location, Campus  | Stop elevator, Start elevator, Firmware update |

 > [!NOTE]
    > For demonstration purposes, we have provisioned two devices per type in the solution. For each device type, one of them functions "correctly" (i.e., within the boundaries defined as normal by Contoso) and the other one has some kind of malfunctioning. In the next section, you can learn about the rules hat Contoso has defined for their devices. These rules define the boundaries of a device correct behavior before an alert needs to be triggered.

### Contoso Rules

Each operator in Contoso knows that, to consider a device working "Properly", its telemetry streams need to be within a certain thresholds. For example, a chiller is not working correctly if the Temperature that reports is 100 F. Thus, Contoso has defined one threshold-based rule for each of the devices. You can see the details in the following table:

 

| Rule Name | Description | Threshold             | Severity | Affected devices          | 
| ---------------------- | ------- | ------------- | ------------- |----|
| Too much pressure      |Alerts if chillers reach higher than normal pressure levels (P>250 psi)  | Critical | Chillers | 
| Too much temperature      |Alerts if prototyping devices reach higher than normal temperature levels (T> 80 F)  | Critical | Prototyping devices | 
| Empty tank      |Alerts if engine fuel tank goes empty (Fuel level < 5 gal )  | INfo | Engines | 
| Hot cargo temperature      |Alerts if truck's cargo temperature is higher than normal (T > 45 F)  | Warning | Trucks | 
| Stopped elevator      |Alerts if elevator stops completely , vibration level <0.1 mm>)  | Warning | Elevators | 


## Operating the Contoso sample deployment

Now that we have layed out the initial set up in the Contoso application, we will go over four scenarios where an operator would have to analyze real-time data and decide how to act on it. 



### Responding to a pressure alarm 

Scenario: Describe the process where the operator identifies the alarm that's triggered for 1 chiller. Chiller is located in Building 43 Floor 2 in Redmond.

Clicks on device details and sees the telemetry for pressure

Goes to maintenance dashboard to see rule

Examines associated rule, actions and devices.

Acts on device and uses the release valve method

Device works properly. Go to the dashboard to see it. 

### Responding to a temperature alarm

Scenario: Contoso is currently running a test for one of their new field devices (tagged as Test 2), so it could be related to it.They are using prototyping devices for the test. They want to test whether devices that have high T can self-healed by starting a cooling system through a cloud method. So they put in the field a device with a higher than normal T, which triggers alarm. To investigate, they do:

See alarm status.

Click to see device details

In this case, opeator knows what to do directly, so they go to the devices page to act on the device directly. 

Operator applies decrease temperature method (new cooling system they are testing)

Problem is fixed. Show normal dashboard.

### Solving an field incident

Scenario: Contoso has multiple trucks going around the Seattle area. Each truck has different cargo.

Show the trucks in the map, point to devices details to see the different tags that represent the cargo type.

It seems that one of the trucks has raised a warning for high temperature. Show T and alarm as a warning, not as critical.

Operator goes to devices page and lowers T so the cargo is now safe.


### Fix equipment remotely

Scenario: elevator is stopped in Building 1 of Redmond campus. They know if because there has been an alarm that show vibration stopped completely.

Technician evaluates the potential problem,decides to update the firmware version and then start the elevator again. With the new firmware patch, elevator now works.

## Next steps

In this tutorial, you learned to:

>[!div class="checklist"]
> * Visualize and filter devices on the dashboard
> * Use simulated devices 
> * Analyze device-triggered alarms
> * Toubleshoot and remediate device issues

Now that you have explored the remote monitoring solution, the suggested next steps are to learn about the advanced features of the remote monitoring solution:

* [Monitor your devices](./iot-suite-remote-monitoring-monitor.md).
* [Manage your devices](./iot-suite-remote-monitoring-manage.md).
* [Automate your solution with rules](./iot-suite-remote-monitoring-automate.md).
* [Maintain your solution](./iot-suite-remote-monitoring-maintain.md).


<!-- Next tutorials in the sequence -->