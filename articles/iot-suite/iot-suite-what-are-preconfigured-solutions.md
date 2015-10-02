<properties
 pageTitle="What are the Azure IoT preconfigured solutions? | Microsoft Azure"
 description="A description of the Azure IoT preconfigured solutions and their architecture with links to additional resources."
 services=""
 documentationCenter=".net"
 authors="aguilaaj"
 manager="kevinmil"
 editor=""/>

<tags
 ms.service="na"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="tbd"
 ms.date="09/22/2015"
 ms.author="araguila"/>

# What are the Azure IoT preconfigured solutions?
You can deploy preconfigured solutions that implement common Internet of Things (IoT) scenarios to Microsoft Azure using your Azure subscription. You can use these preconfigured solutions:
- As a starting point for your own IoT solutions.
- To learn about the most common patterns seen in IoT solution design and development.

Each preconfigured solution implements a common IoT scenario and is a complete, end-to-end implementation.

In addition to deploying and running the preconfigured solutions in Azure, you can download the complete source code to customize and extend the solution to meet your specific requirements.

The available preconfigured solutions are:
- Remote Monitoring
- Predictive Maintenance (Coming Soon)

The following table shows how these preconfigured solutions map to specific IoT features:

| Solution               | Data Ingestion | Device Identity | Command and Control | Rules and Actions | Predictive Analytics |
|------------------------|----------------|-----------------|---------------------|-------------------|----------------------|
| Remote Monitoring      | Yes            | Yes             | Yes                 | Yes               | -                    |
| Predictive Maintenance | Yes            | Yes             | Yes                 | Yes               | Yes                  |

## Remote Monitoring sample overview

Remote Monitoring is the simplest of preconfigured solutions with full functionality. This section describes some of the key features of the remote monitoring preconfigured solution by way of an introduction to the full set of preconfigured solutions.

The following diagram illustrates the key features of the solution and the following sections. The following sections provide more information about the elements shown in this diagram.

![Remote Monitoring preconfigured solution architecture][img-remote-monitoring-arch]

### Device
The device that comes pre-provisioned with the remote monitoring preconfigured solution is a software simulation of a cooler that sends temperature and humidity telemetry data. The device can also respond to a set of commands sent from the solution portal through IoT Hub. The commands already implemented in the simulator are: Ping Device; Start Telemetry; Stop Telemetry; Change Set Point Temp; Diagnostic Telemetry; and Change Device State.

The coolers in this preconfigured solution correspond to the **devices and data sources** in a typical IoT solution architecture.

### IoT Hub
An IoT hub receives telemetry data from the coolers at a single end-point and maintains device specific end-points where devices can retrieve commands such as the PingDevice command.

The IoT hub exposes the telemetry data it receives through a consumer group end-point.

The IoT Hub instance in this preconfigured solution corresponds to the **IoT backend application** in a typical IoT solution architecture.

### Azure Stream Analytics
The preconfigured solution uses Azure Stream Analytics jobs to filter the stream of events from the coolers. One job sends all telemetry data to Azure storage blobs for cold storage. The second job filters the event stream for command response messages and device status update messages and sends these specific messages to an Azure Event Hub end-point.The third job filters for triggered alarms and displays these alarms in the alarm history table in the dashboard view of the solution portal.


### Event Processor
An Event Processor instance, running in a web job, processes the command response and device status data and stores this information in an Azure DocumentDB database.


### Solution Portal
The Solution Portal is a web-based UI that enables you to:
- View telemetry and alarm history in the dashboard.
- Provision new devices.
- Manage and monitor devices.
- Send commands to specific devices.
- Manage rules and actions.

Note: The devices view of the solution portal also keeps the IoT Hub device identity registry synchronized with the store of richer device state information in the DocumentDB database.


## Next steps
To get started using the Azure IoT preconfigured solutions, explore these resources:
- [Azure IoT preconfigured solutions overview](iot-suite-overview.md)
- [Get started with the IoT preconfigured solutions](iot-suite-getstarted-preconfigured-solutions.md)

[img-remote-monitoring-arch]: ./media/iot-suite-what-are-preconfigured-solutions/remote-monitoring-arch1.png
