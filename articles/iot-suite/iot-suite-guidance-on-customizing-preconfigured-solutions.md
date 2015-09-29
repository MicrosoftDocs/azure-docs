<properties
	pageTitle="Microsoft Azure IoT Suite guidance on customizing preconfigured solutions | Microsoft Azure"
	description="This will provide guidnace on customizing Azure IoT Suite preconfigured solutions."
	services=""
	documentationCenter=".net"
	authors="stevehob"
	manager="kevinmil"
	editor=""/>

<tags
     ms.service="na"
     ms.devlang="na"
     ms.topic="article"
     ms.tgt_pltfrm="na"
     ms.workload="tbd"
     ms.date="09/22/2015"
     ms.author="stevehob"/>

# Customizing Preconfigured Solutions
The preconfigured solutions provided with the Azure IoT Suite enable customers to see the services within the suite working together to deliver an end-to-end solution.  From this starting point, there are a variety of places where customization and extension may occur to customize the solution for specific scenarios.  The following sections outline these common customization points.

## Finding the source code
The source code for your preconfigured solution is available on Github in the following repositories:

- Remote Monitoring: [https://www.github.com/Azure/azure-iot-remote-monitoring](https://github.com/Azure/azure-iot-remote-monitoring)

This source is provided to demonstrate a pattern for implementing the core functionality of remote monitoring using Azure IoT Suite.

## Changing the preconfigured rules
The remote monitoring solution includes two [Azure Stream Analytics](http://azure.microsoft.com/documentation/services/stream-analytics) jobs to implement the telemetry and alarm logic displayed on the dashboard.

The first job selects all the data from the incoming stream of telemetry and creates two different outputs.  The job will be named [solution name]-Telemetry.

- The first output simply takes all the data by `SELECT *` and stores outputs it to blob.  This blob storage is where the dashboard reads raw values to create its charts.
- The second output performs an `AVG()`, `MIN()`, and `MAX()` calculation over a 5-minute sliding window.  These data are shown in the dials on the dashboard.

Using the Stream Analytics user interface, you are able to edit these jobs directly to alter the logic or add logic specific to your scenario.

The second job operates on the Device-to-Threshold values created in the Rules page of the solution.  This job consumes as Reference Data, the threshold value set for each device.  It compares the threshold value to see if its greater than (`>`) the actual value.  This job may be modified, for example, to change the comparison operator.

***Note that the remote monitoring dashboard depends on specific data, so altering the jobs could potentially cause the dashboard to fail.***

## Adding your own rules
In addition to changed the preconfigured Azure Stream Analytics jobs, you can use the Azure Portal to add new jobs or add new queries to existing jobs.

## Customizing devices
One of the most common extension activities is working with devices specific to your scenario.  There are several methods for working with devices.  These include altering a simulated device to match your scenario, or using the Azure IoT Device SDK to connect your physical device to the solution.

Please refer to the following document for a step-by-step guide to adding devices to the remote monitoring preconfigured solution [Iot Suite Connecting Devices](/documentation/articles/iot-suite-connecting-devices)

### Creating your own simulated device
Included in the remote monitoring solution source code (referenced above), is a .Net simulator.  This simulator is the one provisioned as part of the solution and can be altered to send different metadata, telemetry or respond to different commands.

Additionally, we have provided a [C SDK Sample](https://github.com/Azure/azure-iot-sdks/c/serializer/samples/remote_monitoring) that is designed to work with the remote monitoring preconfigured solution.

### Building and using your own (physical) device
The [Azure IoT SDKs](https://github.com/Azure/azure-iot-sdks) provide libraries for connecting numerous device types (languages and operating systems) into IoT solutions.


For more information on IoT devices, please refer to the [Azure IoT Developer Site](http://azure.microsoft.com/develop/iot) to find links and documentation.


