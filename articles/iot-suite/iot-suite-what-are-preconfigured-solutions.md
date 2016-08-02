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
 ms.date="05/25/2016"
 ms.author="dobett"/>

# What are the Azure IoT Suite preconfigured solutions?

The Azure IoT Suite preconfigured solutions are implementations of common IoT solution patterns that you can deploy to Azure using your subscription. You can use the preconfigured solutions:

- As a starting point for your own IoT solutions.
- To learn about common patterns in IoT solution design and development.

Each preconfigured solution is a complete, end-to-end implementation using simulated devices to generate telemetry.

In addition to deploying and running the solutions in Azure, you can download the complete source code and then customize and extend the solution to meet your specific IoT requirements.

> [AZURE.NOTE] To deploy one of the preconfigured solutions, visit [Microsoft Azure IoT Suite][lnk-azureiotsuite]. The article [Get started with the IoT preconfigured solutions][lnk-getstarted-preconfigured] provides more information about how to deploy and run one of the solutions.

The following table shows how the solutions map to specific IoT features:

| Solution | Data Ingestion | Device Identity | Command and Control | Rules and Actions | Predictive Analytics |
|------------------------|-----|-----|-----|-----|-----|
| [Remote monitoring][lnk-getstarted-preconfigured] | Yes | Yes | Yes | Yes | -   |
| [Predictive maintenance][lnk-predictive-maintenance] | Yes | Yes | Yes | Yes | Yes |

- *Data ingestion*: Ingress of data at scale to the cloud.
- *Device identity*: Manage unique identities of every connected device.
- *Command and control*: Send messages to a device from the cloud to cause the device to take some action.
- *Rules and actions*: The solution back end uses rules to act on specific device-to-cloud data.
- *Predictive analytics*: The solution back end applies analyzes device-to-cloud data to predict when specific actions should take place. For example, analyzing aircraft engine telemetry to determine when engine maintenance is due.

## Remote Monitoring preconfigured solution overview

We have chosen to discuss the remote monitoring preconfigured solution in this article because it illustrates many common design elements that the other solutions share.

The following diagram illustrates the key elements of the remote monitoring solution. The sections below provide more information about these elements.

![Remote Monitoring preconfigured solution architecture][img-remote-monitoring-arch]

## Devices

When you deploy the remote monitoring preconfigured solution, four simulated devices are pre-provisioned in the solution that simulate a cooling device. These simulated devices have a built-in temperature and humidity model that emits telemetry. These simulated devices are included to illustrate the end-to-end flow of data through the solution, and to provide a convenient source of telemetry and a target for commands if you are a back-end developer using the solution as a starting point for a custom implementation.

When a device first connects to IoT Hub in the remote monitoring preconfigured solution, the device information message sent to the IoT hub enumerates the list of commands that the device can respond to. In the remote monitoring preconfigured solution, the commands are: 

- *Ping Device*: The device responds to this command with an acknowledgement. This is useful for checking that the device is still active and listening.
- *Start Telemetry*: Instructs the device to start sending telemetry.
- *Stop Telemetry*: Instructs the device to stop sending telemetry.
- *Change Set Point Temperature*: Controls the simulated temperature telemetry values the device sends. This is useful for testing back-end logic.
- *Diagnostic Telemetry*: Controls if the device should send the external temperature as telemetry.
- *Change Device State*.: Sets the device state metadata property that the device reports. This is useful for testing back-end logic.

You can add more simulated devices to the solution that emit the same telemetry and respond to the same commands. 

## IoT Hub

In this preconfigured solution, the IoT Hub instance corresponds to the *Cloud Gateway* in a typical [IoT solution architecture][lnk-what-is-azure-iot].

An IoT hub receives telemetry from the devices at a single endpoint. An IoT hub also maintains device specific endpoints where each devices can retrieve the commands that are sent to it.

The IoT hub makes the received telemetry available through the service-side telemetry read endpoint.

## Azure Stream Analytics

The preconfigured solution uses three [Azure Stream Analytics][lnk-asa] (ASA) jobs to filter the telemetry stream from the devices:


- *DeviceInfo job* - outputs data to an Event hub that routes device registration specific messages, sent when a device first connects or in response to a **Change device state** command, to the solution device registry (a DocumentDB database). 
- *Telemetry job* - sends all raw telemetry to Azure blob storage for cold storage and calculates telemetry aggregations that display in the solution dashboard.
- *Rules job* - filters the telemetry stream for values that exceed any rule thresholds and outputs the data to an Event hub. When a rule fires, the solution portal dashboard view displays this event as a new row in the alarm history table and triggers an action based on the settings defined on the Rules and Actions views in the solution portal.

In this preconfigured solution, the ASA jobs form part of to the **IoT solution back end** in a typical [IoT solution architecture][lnk-what-is-azure-iot].

## Event processor

In this preconfigured solution, the event processor forms part of the **IoT solution back end** in a typical [IoT solution architecture][lnk-what-is-azure-iot].

The **DeviceInfo** and **Rules** ASA jobs send their output to Event hubs for delivery to other back end services. The solution uses an [EventPocessorHost][lnk-event-processor] instance, running in a [WebJob][lnk-web-job], to read the messages from these Event hubs. The **EventProcessorHost** uses the **DeviceInfo** data to update the device data in the DocumentDB database, and uses the **Rules** data to invoke the Logic app and update the alerts display in the solution portal.

## Device identity registry and DocumentDB

Every IoT hub includes a [device identity registry][lnk-identity-registry] that stores device keys. IoT Hub uses this information authenticate devices - a device must be registered and have a valid key before it can connect to the hub.

This solution stores additional information about devices such as their state, the commands they support, and other metadata. The solution uses a DocumentDB database to store this solution-specific device data and the solution portal retrieves data from this DocumentDB database for display and editing.

The solution must also keep the information in the device identity registry synchronized with the contents of the DocumentDB database. The **EventProcessorHost** uses the data from **DeviceInfo** stream analytics job to manage the synchronization.

## Solution portal

![Solution dashboard][img-dashboard]

The solution portal is a web-based UI that is deployed to the cloud as part of the preconfigured solution. It enables you to:

- View telemetry and alarm history in a dashboard.
- Provision new devices.
- Manage and monitor devices.
- Send commands to specific devices.
- Manage rules and actions.

In this preconfigured solution, the solution portal forms part of the **IoT solution back end** and part of the **Processing and business connectivity** in a typical [IoT solution architecture][lnk-what-is-azure-iot].

## Next steps

For more information about IoT solution architectures, see [Microsoft Azure IoT services: Reference Architecture][lnk-refarch].

Now you know what a preconfigured solution is, you can get started by deploying the *remote monitoring* preconfigured solution: [Get started with the preconfigured solutions][lnk-getstarted-preconfigured].

[img-remote-monitoring-arch]: ./media/iot-suite-what-are-preconfigured-solutions/remote-monitoring-arch1.png
[img-dashboard]: ./media/iot-suite-what-are-preconfigured-solutions/dashboard.png
[lnk-what-is-azure-iot]: iot-suite-what-is-azure-iot.md
[lnk-asa]: https://azure.microsoft.com/documentation/services/stream-analytics/
[lnk-event-processor]: ../event-hubs/event-hubs-programming-guide.md#event-processor-host
[lnk-web-job]: ../app-service-web/web-sites-create-web-jobs.md
[lnk-identity-registry]: ../iot-hub/iot-hub-devguide.md#device-identity-registry
[lnk-predictive-maintenance]: iot-suite-predictive-overview.md
[lnk-azureiotsuite]: https://www.azureiotsuite.com/
[lnk-refarch]: http://download.microsoft.com/download/A/4/D/A4DAD253-BC21-41D3-B9D9-87D2AE6F0719/Microsoft_Azure_IoT_Reference_Architecture.pdf
[lnk-getstarted-preconfigured]: iot-suite-getstarted-preconfigured-solutions.md