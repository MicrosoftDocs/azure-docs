<properties
 pageTitle="Azure IoT preconfigured solutions | Microsoft Azure"
 description="A description of the Azure IoT preconfigured solutions and their architecture with links to additional resources."
 services=""
 suite="iot-suite"
 documentationCenter=""
 authors="dominicbetts"
 manager="timlt"
 editor=""/>

<tags
 ms.service="iot-suite"
 ms.devlang="na"
 ms.topic="get-started-article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="02/19/2016"
 ms.author="dobett"/>

# What are the Azure IoT Suite preconfigured solutions?

The Azure IoT Suite preconfigured solutions are implementations of common IoT solution patterns that you can deploy to Microsoft Azure using your Azure subscription. You can use the preconfigured solutions:

- As a starting point for your own IoT solutions.
- To learn about common patterns in IoT solution design and development.

Each preconfigured solution implements a common IoT scenario and is a complete, end-to-end implementation using simulated devices to generate telemetry.

In addition to deploying and running the solutions in Azure, you can download the complete source code and then customize and extend the solution to meet your specific IoT requirements.

> [AZURE.NOTE] The article [Get started with the IoT preconfigured solutions][lnk-preconf-get-started] describes how to deploy and run one of the solutions.

The following table shows how the solutions map to specific IoT features:

| Solution | Data Ingestion | Device Identity | Command and Control | Rules and Actions | Predictive Analytics |
|------------------------|-----|-----|-----|-----|-----|
| [Remote monitoring][lnk-remote-monitoring] | Yes | Yes | Yes | Yes | -   |
| [Predictive maintenance][lnk-predictive-maintenance] | Yes | Yes | Yes | Yes | Yes |

## Remote Monitoring preconfigured solution overview

We have chosen to discuss the remote monitoring preconfigured solution in this article because it is the simplest of the solutions and illustrates common design elements that the other solutions share.

The following diagram illustrates the key elements of the remote monitoring solution. The sections below provide more information about these elements.

![Remote Monitoring preconfigured solution architecture][img-remote-monitoring-arch]

## Devices

When you deploy the remote monitoring preconfigured solution, four simulated devices are pre-provisioned in the solution that simulate a cooling device. These simulated devices have a built in temperature and humidity model that emits telemetry.

When a device first connects to IoT Hub in the remote monitoring preconfigured solution, the device information message sent to the IoT hub enumerates the list of commands that the device can respond to. In the remote monitoring preconfigured solution, the commands are: 

- *Ping Device*. The device responds to this command with an acknowledgement. This is useful for checking that the device is still active and listening.
- *Start Telemetry*. Instructs the device to start sending telemetry.
- *Stop Telemetry*. Instructs the device to stop sending telemetry.
- *Change Set Point Temperature*. Controls the simulated temperature telemetry values the device sends. This is useful for testing.
- *Diagnostic Telemetry*. Controls if the device should send the external temperature as telemetry.
- *Change Device State*. Sets the device state metadata property that the device reports. This is useful for testing.

You can add additional simulated devices to the solution that emit the same telemetry and respond to the same commands. 

## IoT Hub

An IoT hub receives telemetry from the cooler devices at a single endpoint. An IoT hub also maintains device specific endpoints where each devices can retrieve the commands that are sent to it.

The IoT hub makes the telemetry it receives available through a consumer group endpoint.

In this preconfigured solution, the IoT Hub instance corresponds to the *Cloud Gateway* in a typical [IoT solution architecture][lnk-what-is-azure-iot].

## Azure Stream Analytics

The preconfigured solution uses three [Azure Stream Analytics][lnk-asa] (ASA) jobs to filter the telemetry stream from the cooler devices:


- *DeviceInfo job* - sends device registration specific messages to the solution device registry (a DocumentDB database).
- *Telemetry job* - sends all raw telemetry to Azure blob storage for cold storage and calculates telemetry aggregations that display in the solution dashboard.
- *Rules job* - filters the telemetry stream for values that exceed any rule thresholds. When a rule fires, the solution portal dashboard view displays this event as a new row in the alarm history table and triggers an action based on the settings defined on the Rules and Actions views in the solution portal.

In this preconfigured solution, the ASA jobs form part of to the *IoT solution back end* in a typical [IoT solution architecture][lnk-what-is-azure-iot].

## Event processor

An [EventPocessorHost][lnk-event-processor] instance, running in a [WebJob][lnk-web-job], processes the output from the DeviceInfo and Rules jobs.

In this preconfigured solution, the event processor forms part of the *IoT solution back end* in a typical [IoT solution architecture][lnk-what-is-azure-iot].

## Solution portal

![Solution dashboard][img-dashboard]

The solution portal is a web-based UI that is deployed to the cloud as part of the preconfigured solution. It enables you to:

- View telemetry and alarm history in a dashboard.
- Provision new devices.
- Manage and monitor devices.
- Send commands to specific devices.
- Manage rules and actions.

> [AZURE.NOTE] The preconfigured solution keeps the IoT Hub [device identity registry][lnk-identity-registry] synchronized with the solution's device registry (DocumentDB database), that stores richer device metadata.

In this preconfigured solution, the solution portal forms part of the *IoT solution back end* and part of the *Processing and business connectivity* in a typical [IoT solution architecture][lnk-what-is-azure-iot].

## Next steps

Explore these resources to learn more about IoT preconfigured solutions:

- [Get started with the IoT preconfigured solutions][lnk-preconf-get-started]
- [Predictive maintenance preconfigured solution overview][lnk-predictive-maintenance]

[img-remote-monitoring-arch]: ./media/iot-suite-what-are-preconfigured-solutions/remote-monitoring-arch1.png
[img-dashboard]: ./media/iot-suite-what-are-preconfigured-solutions/dashboard.png
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