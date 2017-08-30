---
title: Customize Azure IoT Suite remote monitoring solution | Microsoft Docs 
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

This article provides information about how you can access the source code for the remote monitoring preconfigured solution. It descibes the GitHub repositories that contain the source code and other resources for the microservices that make up the solution.

## Remote monitoring project overview


### Project implemetations

Remote monitoring has two different implemetation options, .Net and Java. Both .Net and Java provide similar functionality and rely on the same underlying Azure services.

#### .Net

You can find the repository for the .Net solution here https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet

#### Java

You can find the repository for the .Net solution here https://github.com/Azure/azure-iot-pcs-remote-monitoring-java 


### Microservices 

If you are interested in a specific functionality of the solution, you can access the indivdual micro services separately. Each microservice encapsulates a different part of the solution fucntionality. You can learn more about teh archiceture here (INSERT LINK TO ARCH DOC). 

This table summarizes the availability of each microservice per project:

<!-- please add links for each of the repos in the table, you can find them here https://github.com/Azure/azure-iot-pcs-team/wiki/Repositories-->



| Microservice        |Description| Java      |           .Net |
| ------------------- | --------- |---| -------------- |
| Web UI           |Insert description here| N/A(React.js)|  N/A(React.js) |
| IoT Hub Manager     | Insert description here       | Available | Available   |
| Authentication       |  Insert description here  | Coming in GA | Available   |
| Device simulation     |   Insert description here   | Coming in GA | Available   |
| Telemetry              |Insert description here | Available | Available   |
| Telemetry Agent         | Insert description here | Available | Available   |
| UI Config           |Insert description here| Available | Available   |
| Storage adapter      |  Insert description here   | Available | Available   |
| Reverse proxy         | Insert description here | Coming in GA | Available   |


Note: the Java solution uses the Authentication, Simulatation and Reverse Proxy .Net microservices while others are being developed.


## Device connectivity and streaming

### Adding different telemetry and device types

The Remote Monitoring solution allows flexible devices definition, based on your application needs, beyond what's offered in the Contoso demo. For example, your company may have an industrial gateway as the main device connected to the solution. 

To create an accurate representation of your device, you need to modify the device application to match the device(s) requirements. 

#### Using simulator service

If you are using a simulated device, you can learn how to customize the simulator microservice to create your own device type here. 
azure-docs-pr\articles\iot-suite\iot-suite-remote-monitoring-test.md

#### Using a physical device

If you are using a physical, you need to ensure that your application sends the right message device model so it can be displayed on the dashboard. When using this format, the dashboard will consume your device telemetry and available methods dynamically. This means you don't have to modify any of the UX. 

You can find a description of the device model here:  https://github.com/Azure/device-simulation-dotnet/blob/master/wiki/Device-Models 


### Creating methods and jobs

#### Using the simulator service

#### Using a physical device

To implement methods and jobs on your physical devices, please refer to the Azure IoT Hub developer guide. Specifically, get started using the following docs:

<!-- Dominic, could you add relevant links from IoT Hub team-->
https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-direct-methods

- Schedule jobs on mmultiple devices https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-jobs 


## Data processing and analytics

### Rules and streaming

Leverage the telemetry microservice in Java or .Net (insert links) to customize rules functionality. For example, if you would like to enable email notification as an option for an operator, this would be the service to do it.

### More advanced scenarios

tbd

## Presentation 

Below are the typical ways to get started customizing the presentation layer
### Dashboard
Leverage the WebUI microservice to customize the current web UI: https://github.com/Azure/pcs-remote-monitoring-webui

### Other visualization tools

If you want to use your own visualization tool, integrate the IoT Hub Manager  and UI Config service (to be confirmed)

<!--
### Business connectivity 
post MVP -->

## Next steps

In this article, you learned about the resources available to help you customize the preconfigured solution.

For more conceptual information about the remote monitoring preconfigured solution, see:

* [Modify the preconfigured solution from the CLI](iot-suite-remote-monitoring-cli.md)
* [Device connectivity](iot-suite-remote-monitoring-connectivity.md)
* [Security](iot-suite-remote-monitoring-security.md)

<!-- Next tutorials in the sequence -->