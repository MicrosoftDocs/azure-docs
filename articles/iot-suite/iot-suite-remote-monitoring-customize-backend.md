---
title: Customize the remote monitoring solution back end - Azure | Microsoft Docs 
description: This article provides information about how you can access the source code for the remote monitoring preconfigured solution and customize the back end microservices.
services: ''
suite: iot-suite
author: dominicbetts
manager: timlt
ms.author: dobett
ms.service: iot-suite
ms.date: 01/17/2018
ms.topic: article
ms.devlang: NA
ms.tgt_pltfrm: NA
ms.workload: NA
---

# Customize the remote monitoring preconfigured solution back end

This article provides information about how you can access the source code and customize the remote monitoring preconfigured solution back end. The article describes:

* The GitHub repositories that contain the source code and resources for the microservices that make up the preconfigured solution.
* Common customization scenarios such as adding a new device type.

## Projects overview

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

The following sections describe options to customize the device connectivity and streaming layer in the remote monitoring solution. [Device models](https://github.com/Azure/device-simulation-dotnet/wiki/Device-Models) describe the device types and telemetry in the solution. You use device models for both simulated and physical devices.

For an example of a physical device implementation, see [Connect your device to the remote monitoring preconfigured solution](iot-suite-connecting-devices-node.md).

If you are using a _physical device_, you must provide the client application with a device model that contains the device metadata and telemetry specification.

The following sections discuss using device models with simulated devices:

### Add a telemetry type

The device types in the Contoso demo solution specify the telemetry that each device type sends. To specify the additional telemetry types, a device can send telemetry definitions as metadata to the solution. If you use this format, the dashboard consumes your device telemetry and available methods dynamically and you don't need to modify the UI. Alternatively, you can modify the device type definition in the solution.

To learn how to add custom telemetry in the _device simulator_ microservice, see [Test your solution with simulated devices](iot-suite-remote-monitoring-test.md).

### Add a device type

The Contoso demo solution defines some sample device types. The solution enables you to define custom device types to meet your specific application requirements. For example, your company may use an industrial gateway as the primary device connected to the solution.

To create an accurate representation of your device, you need to modify the application that runs on your device to match the device requirements.

To learn how to add a new device type in the _device simulator_ microservice, see [Test your solution with simulated devices](iot-suite-remote-monitoring-test.md).

### Define custom methods for simulated devices

To learn how to define custom methods for simulated devices in the remote monitoring solution, see [Device Models](https://github.com/Azure/device-simulation-dotnet/wiki/%5BAPI-Specifications%5D-Device-Models) in the GitHub repository.

<!--
#### Using the simulator service

TODO: add steps for the simulator microservice here
-->

#### Using a physical device

To implement methods and jobs on your physical devices, see the following IoT Hub articles:

* [Understand and invoke direct methods from IoT Hub](../iot-hub/iot-hub-devguide-direct-methods.md).
* [Schedule jobs on multiple devices](../iot-hub/iot-hub-devguide-jobs.md).

### Other customization options

To further modify the device connectivity and streaming layer in the remote monitoring solution, you can edit the code. The relevant GitHub repositories are:

* [Device telemetry implementation in .NET for PCS](https://github.com/Azure/device-telemetry-dotnet)
* [Device telemetry implementation in Java for PCS](https://github.com/Azure/device-telemetry-java)
* [Azure IoT Hub Streaming, Analytics, Alerts generation (.NET)](https://github.com/Azure/telemetry-agent-dotnet)
* [Azure IoT Hub Streaming, Analytics, Alerts generation (Java)](https://github.com/Azure/telemetry-agent-java)

## Data processing and analytics

<!--
The following sections describe options to customize the data processing and analytics layer in the remote monitoring solution:

### Rules and actions

See the [Customize rules and actions](https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet/) page in GitHub for details of how to customize the rules and actions in solution.


### Other customization options
-->

To modify the data processing and analytics layer in the remote monitoring solution, you can edit the code. The relevant GitHub repositories are:

* [Azure IoT Hub Streaming, Analytics, Alerts generation (.NET)](https://github.com/Azure/telemetry-agent-dotnet)
* [Azure IoT Hub Streaming, Analytics, Alerts generation (Java)](https://github.com/Azure/telemetry-agent-java)

## Infrastructure

<!--
The following sections describe options for customizing the infrastructure services in the remote monitoring solution:

### Change storage

The default storage service for the remote monitoring solution is Cosmos DB. See the [Customize storage service](https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet/) page in GitHub for details of how to change the storage service the solution uses.

### Change log storage

The default storage service for logs is Cosmos DB. See the [Customize log storage service](https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet/) page in GitHub for details of how to change the storage service the solution uses for logging.

### Other customization options
-->

To modify the infrastructure in the remote monitoring solution, you can edit the code. The relevant GitHub repositories are:

* [IoT Hub management microservice for PCS. (.NET)](https://github.com/Azure/iothub-manager-dotnet)
* [IoT Hub management microservice for PCS. (Java)](https://github.com/Azure/iothub-manager-java)
* [The storage adapter microservice for IoT PCS (.NET)](https://github.com/Azure/pcs-storage-adapter-dotnet)
* [The storage adapter microservice for IoT PCS (Java)](https://github.com/Azure/pcs-storage-adapter-java)

## Next steps

In this article, you learned about the resources available to help you customize the preconfigured solution.

For more conceptual information about the remote monitoring preconfigured solution, see [Remote monitoring architecture](iot-suite-remote-monitoring-sample-walkthrough.md)

For more information about customizing the remote monitoring solution, see:

* [Developer Reference Guide](https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet/wiki/Developer-Reference-Guide)
* [Developer Troubleshooting Guide](https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet/wiki/Developer-Troubleshooting-Guide)

<!-- Next tutorials in the sequence -->