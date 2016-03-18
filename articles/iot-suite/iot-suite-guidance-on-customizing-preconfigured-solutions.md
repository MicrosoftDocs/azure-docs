<properties
	pageTitle="Customizing preconfigured solutions | Microsoft Azure"
	description="Provides guidance on how to customize the Azure IoT Suite preconfigured solutions."
	services=""
    suite="iot-suite"
	documentationCenter=".net"
	authors="stevehob"
	manager="timlt"
	editor=""/>

<tags
     ms.service="iot-suite"
     ms.devlang="dotnet"
     ms.topic="article"
     ms.tgt_pltfrm="na"
     ms.workload="na"
     ms.date="03/02/2016"
     ms.author="stevehob"/>

# Customizing preconfigured solutions

The preconfigured solutions provided with the Azure IoT Suite demonstrate the services within the suite working together to deliver an end-to-end solution. From this starting point, there are a variety of places in which you can extend and customize the solution for specific scenarios. The following sections describe these common customization points.

## Finding the source code

The source code for the preconfigured solutions is available on GitHub in the following repositories:

- Remote Monitoring: [https://www.github.com/Azure/azure-iot-remote-monitoring](https://github.com/Azure/azure-iot-remote-monitoring)
- Predictive Maintenance: [https://github.com/Azure/azure-iot-predictive-maintenance](https://github.com/Azure/azure-iot-predictive-maintenance)

The source code for the preconfigured solutions is provided to demonstrate the patterns and practices used to implement the end-to-end functionality of an IoT solution using Azure IoT Suite. You can find more information about how to build and deploy the solutions in the GitHub repositories.

## Manage the permissions in a preconfigured solution
The solution portal for each preconfigured solution is created as a new Azure Active Directory application. You can manage the permissions for your solution portal (AAD application) as follows:

1. Open to the [Azure classic portal](https://manage.windowsazure.com).
2. Navigate to the AAD application by selecting **Applications my company owns** and then clicking the check mark.
3. Navigate to **Users** and assign members in your Azure Active Directory tenant to a role. 

By default, the application is provisioned with **Administrator**, **Read Only**, and **Implicit Read Only** roles. **Implicit Read Only** is granted to users who are members of the Azure Active Directory tenant, but have not been assigned a role. You can modify the [RolePermissions.cs](https://github.com/Azure/azure-iot-remote-monitoring/blob/master/DeviceAdministration/Web/Security/RolePermissions.cs ) once you've forked the GitHub repository and then redeploy your solution. 

## Changing the preconfigured rules

The remote monitoring solution includes three [Azure Stream Analytics](https://azure.microsoft.com/services/stream-analytics/) jobs to implement device information, telemetry and rules logic displayed  for the solution.

The three stream analytics jobs and their syntax is described in depth in the [Remote monitoring preconfigured solution walkthrough](iot-suite-remote-monitoring-sample-walkthrough.md). 

You can edit these jobs directly to alter the logic, or add logic specific to your scenario. You can find the Stream Analytics jobs as follows:
 
1. Go to [Azure portal](https://portal.azure.com).
2. Navigate to the resource group with the same name as your IoT solution. 
3. Select the Azure Stream Analytics job you'd like to modify. 
4. Stop the job by selecting **Stop**in the set of commands. 
5. Edit the inputs, query, and outputs.

    A simple modification is to change the query for the **Rules** job to use a **"<"** instead of a **">"**. The solution portal will still show **">"** when you edit a rule, but you'll notice the behavior is flipped due to the change in the underlying job.

6. Start the job

> [AZURE.NOTE] The remote monitoring dashboard depends on specific data, so altering the jobs can cause the dashboard to fail.

## Adding your own rules

In addition to changing the preconfigured Azure Stream Analytics jobs, you can use the Azure portal to add new jobs or add new queries to existing jobs.

## Customizing devices

One of the most common extension activities is working with devices specific to your scenario. There are several methods for working with devices. These methods include altering a simulated device to match your scenario, or using the [IoT Device SDK][] to connect your physical device to the solution.

For a step-by-step guide to adding devices to the remote monitoring preconfigured solution, see [Iot Suite Connecting Devices](iot-suite-connecting-devices.md).

### Creating your own simulated device

Included in the remote monitoring solution source code (referenced above), is a .NET simulator. This simulator is the one provisioned as part of the solution and can be altered to send different metadata, telemetry or respond to different commands.

The preconfigured simulator in the remote monitoring preconfigured solution is a cooler device that emits temperature and humidity telemetry, you can modify the simulator in the [Simulator.WebJob](https://github.com/Azure/azure-iot-remote-monitoring/tree/master/Simulator/Simulator.WebJob ) project when you've forked the GitHub repository.

Additionally, Azure IoT provides a [C SDK Sample](https://github.com/Azure/azure-iot-sdks/c/serializer/samples/remote_monitoring) that is designed to work with the remote monitoring preconfigured solution.

### Building and using your own (physical) device

The [Azure IoT SDKs](https://github.com/Azure/azure-iot-sdks) provide libraries for connecting numerous device types (languages and operating systems) into IoT solutions.

## Feedback

Have a customization you'd like to see covered in this document? Please add feature suggestions to [User Voice](https://feedback.azure.com/forums/321918-azure-iot), or comment on this article below. 

## Next steps

For more information about IoT devices, see the [Azure IoT Developer Site](https://azure.microsoft.com/develop/iot/) to find links and documentation.

[IoT Device SDK]: https://azure.microsoft.com/documentation/articles/iot-hub-sdks-summary/
