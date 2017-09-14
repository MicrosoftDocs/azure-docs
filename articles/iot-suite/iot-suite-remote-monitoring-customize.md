---
title: Customize the remote monitoring solution - Azure | Microsoft Docs 
description: This article provides information about how you can access the source code for the remote monitoring preconfigured solution.
services: ''
suite: iot-suite
author: dominicbetts
manager: timlt
ms.author: dobett
ms.service: iot-suite
ms.date: 08/30/2017
ms.topic: article
ms.devlang: NA
ms.tgt_pltfrm: NA
ms.workload: NA
---

# Customize the remote monitoring preconfigured solution

This article provides information about how you can access the source code for the remote monitoring preconfigured solution. It describes the GitHub repositories that contain the source code and resources for the microservices that make up the preconfigured solution.

## Project overview

### Implementations

The remote monitoring solution has both .NET and Java implementations. Both implementations provide similar functionality and rely on the same underlying Azure services. You can find the top-level GitHub repositories here:

* [.NET solution](https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet)
* [Java solution](https://github.com/Azure/azure-iot-pcs-remote-monitoring-java)

### Microservices

If you are interested in a specific feature of the solution, you can access the GitHub repositories for each individual microservice. Each microservice implements a different part of the solution functionality. To learn more about the overall architecture, see [Remote monitoring preconfigured solution architecture](iot-suite-remote-monitoring-sample-walkthrough.md).

This table summarizes the current availability of each microservice for each language:

<!-- please add links for each of the repos in the table, you can find them here https://github.com/Azure/azure-iot-pcs-team/wiki/Repositories-->

| Microservice      | Description | Java | .NET |
| ----------------- | ----------- | ---- | ---- |
| Web UI            | Web app for remote monitoring solution. Implements UI using React.js framework. | [N/A(React.js)](https://github.com/Azure/azure-iot-pcs-remote-monitoring-webui) | [N/A(React.js)](https://github.com/Azure/azure-iot-pcs-remote-monitoring-webui) |
| IoT Hub Manager   | Handles communication with the IoT Hub.        | [Available](https://github.com/Azure/iothub-manager-java) | [Available](https://github.com/Azure/iothub-manager-dotnet)   |
| Authentication    |  Manages Azure Active Directory integration.  | Not yet available | [Available](https://github.com/Azure/pcs-auth-dotnet)   |
| Device simulation | Manages a pool of simulated devices. | Not yet available | [Available](https://github.com/Azure/device-simulation-dotnet)   |
| Telemetry         | Makes device telemetry available to the UI. | [Available](https://github.com/Azure/device-telemetry-java) | [Available](https://github.com/Azure/device-telemetry-dotnet)   |
| Telemetry Agent   | Analyzes the telemetry stream, stores messages from Azure IoT Hub, and generates alerts according to defined rules.  | [Available](https://github.com/Azure/telemetry-agent-java) | [Available](https://github.com/Azure/telemetry-agent-dotnet)   |
| UI Config         | Manages configuration data from the UI. | [Available](https://github.com/azure/pcs-ui-config-java) | [Available](https://github.com/azure/pcs-ui-config-dotnet)   |
| Storage adapter   |  Manages interactions with storage service.   | [Available](https://github.com/azure/pcs-storage-adapter-java) | [Available](https://github.com/azure/pcs-storage-adapter-dotnet)   |
| Reverse proxy     | Exposes private resources in a managed way through a unique endpoint. | Not yet available | [Available](https://github.com/Azure/reverse-proxy-dotnet)   |

The Java solution currently uses the .NET authentication, simulation, and reverse proxy microservices. These microservices will be replaced by Java versions as soon as they become available.

## Device connectivity and streaming

The following sections describe options to customize device connectivity and streaming in the remote monitoring solution.

### Add different telemetry and device types

The Contoso demo solution defines some sample device types. The solution enables you to define custom device types to meet your specific application requirements. For example, your company may use an industrial gateway as the primary device connected to the solution.

To create an accurate representation of your device, you need to modify the application that runs on your device to match the device requirements.

* To learn how to customize the _device simulator_ microservice, see [Test your solution with simulated devices](iot-suite-remote-monitoring-test.md).

* If you are using a _physical device_, you must provide the application with a [device model](https://github.com/Azure/device-simulation-dotnet/blob/master/wiki/Device-Models) that contains the device metadata and telemetry specification. If you use this format, the dashboard consumes your device telemetry and available methods dynamically and you don't need to modify the UI.

### Creating methods and jobs

The following sections describe options to define custom methods and jobs in the remote monitoring solution.

#### Using the simulator service

#### Using a physical device

To implement methods and jobs on your physical devices, see the following IoT Hub articles:

* [Understand and invoke direct methods from IoT Hub](../iot-hub/iot-hub-devguide-direct-methods.md).
* [Schedule jobs on multiple devices](../iot-hub/iot-hub-devguide-jobs.md).

## Data processing and analytics

The following sections describe options to customize data processing and analytics in the remote monitoring solution.

### Rules and streaming

To customize rules functionality, modify the telemetry agent microservice ([Java](https://github.com/Azure/telemetry-agent-java) or [.NET](https://github.com/Azure/telemetry-agent-dotnet)). For example, to enable email notifications as an option for an operator, modify the telemetry agent microservice.

### More advanced scenarios

<!-- To Do -->

## Presentation

The following sections describe options to customize the UI in the remote monitoring solution.

### Dashboard

To customize the current web UI, modify the [WebUI microservice](https://github.com/Azure/pcs-remote-monitoring-webui).

### Other visualization tools

To use your own visualization tool, you must integrate with the IoT Hub Manager and UI Config microservices.

<!-- To be confirmed -->

<!--
### Business connectivity 
post MVP -->

## Next steps

In this article, you learned about the resources available to help you customize the preconfigured solution.

For more conceptual information about the remote monitoring preconfigured solution, see:

* [Modify the preconfigured solution from the CLI](iot-suite-remote-monitoring-cli.md)
* [Security](iot-suite-remote-monitoring-security.md)

<!-- Next tutorials in the sequence -->