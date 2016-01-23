<properties
	pageTitle="Customizing preconfigured solutions | Microsoft Azure"
	description="Provides guidance on how to customize the Azure IoT Suite preconfigured solutions."
	services=""
	documentationCenter=".net"
	authors="stevehob"
	manager="timlt"
	editor=""/>

<tags
     ms.service="na"
     ms.devlang="dotnet"
     ms.topic="article"
     ms.tgt_pltfrm="na"
     ms.workload="na"
     ms.date="09/29/2015"
     ms.author="stevehob"/>

# Customizing preconfigured solutions

The preconfigured solutions provided with the Azure IoT Suite demonstrate the services within the suite working together to deliver an end-to-end solution. From this starting point, there are a variety of places in which you can extend and customize the solution for specific scenarios. The following sections describe these common customization points.

## Finding the source code

The source code for your preconfigured solution is available on GitHub, in the following repositories:

- Remote Monitoring: [https://www.github.com/Azure/azure-iot-remote-monitoring](https://github.com/Azure/azure-iot-remote-monitoring)

This source is provided to demonstrate a pattern for implementing the core functionality of remote monitoring using Azure IoT Suite.

## Changing the preconfigured rules

The remote monitoring solution includes two [Azure Stream Analytics](http://azure.microsoft.com/services/stream-analytics) jobs to implement the telemetry and alarm logic displayed on the dashboard.

The first job selects all the data from the incoming stream of telemetry and creates two different outputs. The job is named **[solution name]-Telemetry**.

- The first output takes all the data using `SELECT *` and outputs it to blob storage. This blob storage is where the dashboard reads raw values to create its charts.
- The second output performs an `AVG()`, `MIN()`, and `MAX()` calculation over a 5-minute sliding window. This data is shown in the dials on the dashboard.

Using the Stream Analytics user interface, you can edit these jobs directly to alter the logic, or add logic specific to your scenario.

The second job operates on the Device-to-Threshold values created in the **Rules** page of the solution. This job consumes as Reference Data, the threshold value set for each device. It compares the threshold value to see if its greater than (`>`) the actual value. You can modify this job, for example, to change the comparison operator.

> [AZURE.NOTE] The remote monitoring dashboard depends on specific data, so altering the jobs can cause the dashboard to fail.

## Adding your own rules

In addition to changing the preconfigured Azure Stream Analytics jobs, you can use the Azure portal to add new jobs or add new queries to existing jobs.

## Customizing devices

One of the most common extension activities is working with devices specific to your scenario. There are several methods for working with devices. These methods include altering a simulated device to match your scenario, or using the [IoT Device SDK][] to connect your physical device to the solution.

For a step-by-step guide to adding devices to the remote monitoring preconfigured solution, see [Iot Suite Connecting Devices](iot-suite-connecting-devices.md).

### Creating your own simulated device

Included in the remote monitoring solution source code (referenced above), is a .NET simulator. This simulator is the one provisioned as part of the solution and can be altered to send different metadata, telemetry or respond to different commands.

Additionally, Azure IoT provides a [C SDK Sample](https://github.com/Azure/azure-iot-sdks/c/serializer/samples/remote_monitoring) that is designed to work with the remote monitoring preconfigured solution.

### Building and using your own (physical) device

The [Azure IoT SDKs](https://github.com/Azure/azure-iot-sdks) provide libraries for connecting numerous device types (languages and operating systems) into IoT solutions.

## Next steps

For more information about IoT devices, see the [Azure IoT Developer Site](http://azure.microsoft.com/develop/iot) to find links and documentation.

[IoT Device SDK]: https://azure.microsoft.com/documentation/articles/iot-hub-sdks-summary/
