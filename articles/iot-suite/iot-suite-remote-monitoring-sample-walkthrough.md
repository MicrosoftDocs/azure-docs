---
title: Architecture of remote monitoring solution - Azure | Microsoft Docs
description: A walkthrough of the architecture of the remote monitoring preconfigured solution.
services: ''
suite: iot-suite
documentationcenter: ''
author: dominicbetts
manager: timlt
editor: ''

ms.assetid: 31fe13af-0482-47be-b4c8-e98e36625855
ms.service: iot-suite
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/24/2017
ms.author: dobett

---
# Remote monitoring preconfigured solution architecture

The IoT Suite remote monitoring [preconfigured solution](iot-suite-what-are-preconfigured-solutions.md) implements an end-to-end monitoring solution for multiple machines in remote locations. The solution combines key Azure services to provide a generic implementation of the business scenario. You can use the solution as a starting point for your own implementation and [customize](iot-suite-remote-monitoring-customize.md) it to meet your own specific business requirements.

This article walks you through some of the key elements of the remote monitoring solution to enable you to understand how it works. This knowledge helps you to:

* Troubleshoot issues in the solution.
* Plan how to customize to the solution to meet your own specific requirements.
* Design your own IoT solution that uses Azure services.

## Logical architecture

The following diagram outlines the logical components of the remote monitoring preconfigured solution overlaid on the [IoT architecture](iot-suite-what-is-azure-iot.md):

![Logical architecture](media/iot-suite-remote-monitoring-sample-walkthrough/remote-monitoring-architecture.png)

## Why microservices?

Cloud architecture has evolved since Microsoft released the first preconfigured solutions. [Microservices](https://azure.microsoft.com/blog/microservices-an-application-revolution-powered-by-the-cloud/) have emerged as a proven practice to achieve scale and flexibility without sacrificing development speed. Several Microsoft services use this architectural pattern internally with great reliability and scalability results. The updated preconfigured solutions put these learnings into practice so you can also benefit from them.

## Device connectivity

The solution includes the following components in the device connectivity part of the logical architecture:

### Simulated devices

The solution includes a microservice that enables you to manage a pool of simulated devices to test the end-to-end flow in the solution. The simulated devices:

* Generate device-to-cloud telemetry.
* Respond to cloud-to-device method calls from IoT Hub.

The microservice provides a RESTful endpoint for you to create, start, and stop simulations. Each simulation consists of a set of virtual devices of different types, that send telemetry and respond to method calls.

You can provision simulated devices from the dashboard in the solution portal.

### Physical devices

You can connect physical devices to the solution. You can implement the behavior of your simulated devices using the Azure IoT device SDKs.

You can provision physical devices from the dashboard in the solution portal.

### IoT Hub

The [IoT hub](../iot-hub/index.md) ingests data sent from the devices into the cloud and makes it available to the `stream-analytics` microservice.

The IoT hub in the solution also:

* Maintains an identity registry that stores the IDs and authentication keys of all the devices permitted to connect to the portal. You can enable and disable devices through the identity registry.
* Invokes methods on your devices on behalf of the solution portal.
* Maintains device twins for all registered devices. A device twin stores the property values reported by a device. A device twin also stores desired properties, set in the solution portal, for the device to retrieve when it next connects.
* Schedules jobs to set properties for multiple devices or invoke methods on multiple devices.

The solution includes the `iot-manager` microservice to handle interactions with your IoT hub such as:

* Creating and managing IoT devices.
* Managing device twins.
* Invoking methods on devices.
* Managing IoT credentials.

This service also runs IoT Hub queries to retrieve devices belonging to user-defined groups.

The microservice provides a RESTful endpoint to manage devices and device twins, invoke methods, and run IoT Hub queries.

## Data processing and analytics

The solution includes the following components in the data processing and analytics part of the logical architecture:

### Device telemetry

The solution includes two microservices to handle device telemetry.

The `stream-analytics` microservice:

* Stores telemetry in Cosmos DB.
* Analyzes the telemetry stream from devices.
* Generates alarms according to defined rules.

The alarms are stored in Cosmos DB.

The `device-telemetry` microservice enables the solution portal to read the telemetry sent from the devices. The solution portal also uses this service to:

* Define monitoring rules such as the thresholds that trigger alarms
* Retrieve the list of past alarms.

Use the RESTful endpoint provided by this microservice to manage telemetry, rules, and alarms.

### Storage

The `storage-adapter` microservice is an adapter in front of the main storage service used for the preconfigured solution. It provides simple collection and key-value storage.

The standard deployment of the preconfigured solution uses Cosmos DB as its main storage service.

The Cosmos DB database stores data in the preconfigured solution. The **storage-adapter** microservice acts as an adapter for the other microservices in the solution to access storage services.

## Presentation

The solution includes the following components in the presentation part of the logical architecture:

The web user interface is a React Javascript application. The application:

* Uses Javascript only and runs entirely in the browser.
* Is styled with CSS.
* Interacts with public facing microservices through AJAX calls.

The user interface presents all the preconfigured solution functionality, and interacts with other services such as:

* The authentication microservice to protect user data.
* The `iothub-manager`microservice to list and manage the IoT devices.

The `ui-config` microservice enables the user interface to store and retrieve configuration settings.

## Next steps

If you want to explore the source code and developer documentation, start with one the two main GitHub repositories:

* [Preconfigured solution for remote monitoring with Azure IoT (.NET)](https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet/wiki/).
* [Preconfigured solution for remote monitoring with Azure IoT (Java)](https://github.com/Azure/azure-iot-pcs-remote-monitoring-java).

For more conceptual information about the remote monitoring preconfigured solution, see:

* [Customize the preconfigured solution](iot-suite-remote-monitoring-customize.md)
* [Modify the preconfigured solution from the CLI](iot-suite-remote-monitoring-cli.md)
* [Security](iot-suite-remote-monitoring-security.md)
