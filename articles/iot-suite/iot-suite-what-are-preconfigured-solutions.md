<properties
 pageTitle="Azure IoT preconfigured solutions | Microsoft Azure"
 description="A description of the Azure IoT preconfigured solutions and their architecture with links to additional resources."
 services=""
 documentationCenter=""
 authors="dominicbetts"
 manager="timlt"
 editor=""/>

<tags
 ms.service="na"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="11/30/2015"
 ms.author="dobett"/>

# What are the Azure IoT Suite preconfigured solutions?

The Azure IoT Suite preconfigured solutions are implementations of common IoT solution patterns that you can deploy to Microsoft Azure using your Azure subscription. You can use the preconfigured solutions:

- As a starting point for your own IoT solutions.
- To learn about common patterns in IoT solution design and development.

Each preconfigured solution implements a common IoT scenario and is a complete, end-to-end implementation using simulated devices to generate telemetry.

In addition to deploying and running the preconfigured solutions in Azure, you can download the complete source code and then customize and extend the solution to meet your specific IoT requirements.

The available preconfigured solutions are:

- [Remote monitoring][lnk-remote-monitoring]
- [Predictive maintenance][lnk-predictive-maintenance]

The following table shows how these preconfigured solutions map to specific IoT features:

| Solution | Data Ingestion | Device Identity | Command and Control | Rules and Actions | Predictive Analytics |
|------------------------|-----|-----|-----|-----|-----|
| Remote Monitoring      | Yes | Yes | Yes | Yes | -   |
| Predictive Maintenance | Yes | Yes | Yes | Yes | Yes |

## Remote Monitoring preconfigured solution overview

This section describes some of the key elements of the remote monitoring preconfigured solution. Remote monitoring is the simplest of the preconfigured solutions and illustrates common design elements that the other preconfigured solutions share.

The following diagram illustrates the key elements of the remote monitoring solution. The sections below provide more information about these elements.

![Remote Monitoring preconfigured solution architecture][img-remote-monitoring-arch]

## Devices

When you deploy the remote monitoring preconfigured solution, the deployment includes instances of a software device simulator that simulates a physical cooler device. The simulated devices send temperature and humidity telemetry to an IoT hub endpoint. The simulated devices also respond to the following commands sent from the solution portal through the IoT hub:

- Ping Device
- Start Telemetry
- Stop Telemetry
- Change Set Point Temperature
- Diagnostic Telemetry
- Change Device State

## IoT Hub

An IoT hub receives telemetry from the cooler devices at a single endpoint. An IoT hub also maintains device specific endpoints where each devices can retrieve the commands, such as the **Ping Device** command, that are sent to it.

The IoT hub makes the telemetry it receives available through a consumer group endpoint.

In this preconfigured solution, the IoT Hub instance corresponds to the *Cloud Gateway* in a typical [IoT solution architecture][lnk-what-is-azure-iot].

## Azure Stream Analytics

The preconfigured solution uses three [Azure Stream Analytics][lnk-asa] (ASA) jobs to filter the telemetry stream from the cooler devices:

- Job #1 sends all the telemetry to Azure blob storage for cold storage
- Job #2 filters the telemetry stream to identify command response messages and device status update messages from the devices and sends these specific messages to an Azure Event Hub endpoint.
- Job #3 filters the telemetry stream for values that trigger alarms. When a value triggers an alarm, the solution displays the notification in the alarm history table in the dashboard view of the solution portal.

In this preconfigured solution, the ASA jobs form part of to the *IoT solution backend* in a typical [IoT solution architecture][lnk-what-is-azure-iot].

## Event processor

An [EventPocessorHost][lnk-event-processor] instance, running in a [WebJob][lnk-web-job], processes the command response and device status messages identified by ASA job #2, and then stores this information in an [Azure DocumentDB][lnk-document-db] database.

In this preconfigured solution, the event processor forms part of the *IoT solution backend* in a typical [IoT solution architecture][lnk-what-is-azure-iot].

## Solution portal

The solution portal is a web-based UI that is deployed to the cloud as part of the preconfigured solution. It enables you to:

- View telemetry and alarm history in a dashboard.
- Provision new devices.
- Manage and monitor devices.
- Send commands to specific devices.
- Manage rules and actions.

> [AZURE.NOTE] The solution portal also keeps the IoT Hub [device identity registry][lnk-identity-registry] synchronized with the store of richer device state information in the solution's DocumentDB database.

In this preconfigured solution, the solution portal forms part of the *IoT solution backend* and part of the *Processing and business connectivity* in a typical [IoT solution architecture][lnk-what-is-azure-iot].

## Next steps

Explore these resources to learn more about IoT preconfigured solutions:

- [Azure IoT preconfigured solutions overview][lnk-suite-overview]
- [Get started with the IoT preconfigured solutions][lnk-preconf-get-started]

[img-remote-monitoring-arch]: ./media/iot-suite-what-are-preconfigured-solutions/remote-monitoring-arch1.png
[lnk-remote-monitoring]: iot-suite-remote-monitoring-sample-walkthrough.md
[lnk-what-is-azure-iot]: iot-suite-what-is-azure-iot.md
[lnk-asa]: https://azure.microsoft.com/documentation/services/stream-analytics/
[lnk-event-processor]: event-hubs-programming-guide.md#event-processor-host
[lnk-web-job]: web-sites-create-web-jobs.md
[lnk-document-db]: https://azure.microsoft.com/documentation/services/documentdb/
[lnk-identity-registry]: iot-hub-devguide.md#device-identity-registry
[lnk-suite-overview]: iot-suite-overview.md
[lnk-preconf-get-started]: iot-suite-getstarted-preconfigured-solutions.md
[lnk-predictive-maintenance]: iot-suite-predictive-overview.md