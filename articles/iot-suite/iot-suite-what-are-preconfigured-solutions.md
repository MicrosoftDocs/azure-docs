<properties
 pageTitle="What are the Azure IoT preconfigured solutions? | Microsoft Azure"
 description="A description of the Azure IoT preconfigured solutions and their architecture with links to additional resources."
 services="azure-iot"
 documentationCenter=".net"
 authors="dominicbetts"
 manager="timlt"
 editor=""/>

<tags
 ms.service="azure-iot"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="tbd"
 ms.date=""
 ms.author="dobett"/>

# What are the Azure IoT preconfigured solutions?
You can deploy preconfigured solutions that implement common Internet of Things (IoT) scenarios to Microsoft Azure using your Azure subscription. You can use these preconfigured solutions:
- As a starting point for your own IoT solutions.
- To learn about proven practices in IoT solution design and development.

Each preconfigured solution implements a common IoT scenario and is a complete, end-to-end implementation based on the [Microsoft IoT reference architecture][lnk-iot-reference-architecture].

In addition to deploying and running the preconfigured solutions in Azure, you can download the complete source code to customize and extend the solution to meet your specific requirements.

The available preconfigured solutions are:
- Vending machines
- Elevators

The following table shows how these preconfigured solutions map to specific IoT scenarios:

| &nbsp; | Remote <br/> monitoring |  Predictive <br/> maintenance |
| ------------------------------: | :-: | :----: |
| **Vending <br/> machines**      | Yes | &nbsp; |
|**Elevators**                    | Yes | Yes    |

## Vending machine sample overview
Vending machines is the simplest of the preconfigured solutions. This section describes some of the key features of the vending machine preconfigured solution by way of an introduction to the full set of preconfigured solutions.

The following diagram illustrates the key features of the solution and the following sections. The following sections provide more information about the elements shown in this diagram.

![Vending machines preconfigured solution][img-vending-machines]

[_TBD_ It would be good to redraw this diagram to make it more consistent with the reference architecture]

### Device
A device is a software simulation of a vending machine that sends telemetry data with its current temperature and whether or not a person is currently standing in front of the machine. The device can also respond to commands sent from Azure IoT Hub instructing it to change the price of an item it vends.

The vending machines in this preconfigured solution correspond to the **devices and data sources** in the IoT reference architecture.

### IoT Hub
An IoT hub receives telemetry data from the vending machines at a single end-point and maintains device specific end-points where devices can retrieve commands such as the change item price command.

The IoT hub exposes the telemetry data it receives through an Event Hubs consumer group end-point.

The IoT Hub instance in this preconfigured solution corresponds to the **cloud gateway** and **identity and registry store** in the IoT reference architecture.

### Azure Stream Analytics
The preconfigured solution uses Azure Stream Analytics jobs to filter the stream of events from the vending machines. One job sends all telemetry data to Azure storage blobs for cold storage. The other job filters the event stream for command response messages and device status update messages and sends these specific messages to an Azure Event Hub end-point.

The Stream Analytics jobs in this preconfigured solution correspond to the **stream event processor** in the IoT reference architecture.

### Event Processor
An [Event Processor][lnk-event-processor] instance, running in a worker role, processes the command response and device status data and stores this information in an Azure DocumentDB database.

The event processor in this preconfigured solution corresponds in part to the **stream event processor** in the IoT reference architecture and the DocumentDB database implements the **device state store**.

### Device Administration Portal
The Device Administration portal is a web-based UI that enables you to:
- Provision new devices.
- Manage and monitor devices.
- Send commands to specific devices.

Note: The Device Administration portal also keeps the IoT Hub device identity registry synchronized with the store of richer device state information in the DocumentDB database.

The Device Administration portal in this preconfigured solution corresponds to the **solution portal** in the IoT reference architecture.

## Next steps
To get started using the Azure IoT preconfigured solutions, explore these resources:
- [Azure IoT preconfigured solutions][lnk-preconfigured-solutions-microsite]
- [Get started with the IoT preconfigured solutions][lnk-iot-solutions-get-started]

[img-vending-machines]: media/iot-suite-what-are-preconfigured-solutions/vending-machines-overview.png
[lnk-iot-reference-architecture]: TBD
[lnk-iot-solutions-get-started]: TBD
[lnk-event-processor]: TBD
[lnk-preconfigured-solutions-microsite]: TBD
