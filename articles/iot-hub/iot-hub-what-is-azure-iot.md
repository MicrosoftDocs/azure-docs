<properties
 pageTitle="Microsoft Azure IoT Hub and the Internet of Things (IoT) | Microsoft Azure"
 description="A overview of IoT on Azure including the Microsoft IoT Reference Architecture and how it relates to Azure IoT Hubs, Device SDKs, and preconfigured solutions"
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
 ms.date="09/04/2015"
 ms.author="dobett"/>

# Microsoft Azure and the Internet of Things (IoT)
Microsoft Azure services enable you to implement IoT solutions that can use a variety of client hardware devices. Microsoft provides you with libraries that you can use to implement an IoT device client with your choice of development language and hardware platform. To implement your IoT service infrastructure, you typically combine multiple Azure services. To better understand how Azure can provide this IoT infrastructure, it's useful to consider the Microsoft IoT reference architecture as a starting point.

## Microsoft IoT Reference Architecture
The following diagram shows the [Microsoft IoT reference architecture][lnk-reference-architecture]. Notice that is does not include the names of any specific Azure services, but describes the key elements in a generic IoT solution architecture. The following sections provide more information about the elements in this architecture.

![IoT Reference Architecture][img-reference-architecture]
[_TBD_ - redraw this diagram with agreed terminology]

### Devices and data sources
In a typical IoT scenario, devices send device-to-cloud telemetry data such as temperature readings to a cloud end-point for storage and processing. Devices can also receive and respond to cloud-to-device commands by reading messages from a cloud end-point. For example, a device might retrieve a command that instructs it to change the frequency at which it samples data.

A device or data source in an IoT solution can range from a simple network-connected sensor to a powerful, standalone computing device. A device may have limited processing capability, memory, communication bandwidth, and communication protocol support.

### Data transport
A device may communicate directly with an end-point in a cloud gateway, or through some intermediary such as a field gateway that provides a service such as protocol translation. Typical communication protocols include AMQP and HTTP.

### Device and event processing
In the cloud, a stream event processor receives device-to-cloud messages at scale from your devices and determines how to process and store those messages. A control system enables you to send cloud-to-device data in the form of commands to specific devices. Identity and registry stores enable you to provision devices and to control which devices are permitted to connect to your infrastructure. A device state store enables you to track the state of your devices, and monitor their activities.

Some IoT solutions include automatic feedback loops. For example, a machine learning module can identify from cloud-to-device telemetry data that the temperature of a device is above normal operating levels and then send a command to the device instructing it to take corrective action.

### Presentation
Many IoT solutions enable users to view and analyze the data collected from their devices. These visualizations may take the form of dashboards or BI reports.

## Scope of this documentation
These Azure and IoT articles focus on two collections of resources that help you to implement your own solution based on the Microsoft IoT reference architecture.
- Azure IoT device SDKs
- Azure IoT Hub

You may also be interested in [Azure IoT Suite][lnk-iot-suite] which enables you to simplify the billing for the various Azure services your IoT solution uses and access a collection of preconfigured solutions to get started quickly with common IoT scenarios.

### Azure IoT device SDKs
Microsoft provides IoT device SDKs that enable you to implement client applications to run on a wide variety of device hardware platforms and operating systems. The IoT device SDKs include libraries that facilitate sending device-to-cloud telemetry data to IoT Hub and receiving cloud-to-device commands from IoT Hub. These IoT device SDKs enable you to choose from a number of different network protocols to communicate with Azure IoT Hub.

### Azure IoT Hub
IoT Hub is an Azure service that enables you to receive device-to-cloud data at scale from your devices and route that data to a stream event processor. IoT Hub can also send cloud-to-device commands to specific devices using device specific queues.

In addition, the IoT Hub service includes a device identity registry that helps you to provision devices and to manage which devices may connect to an IoT hub.

## Next steps
To get started with IoT on Azure, explore these resources:
- [Azure IoT device SDKs][lnk-device-sdks].
- [Azure IoT Hub][lnk-iot-hub].
- [Azure IoT Suite][lnk-iot-suite].  

[img-reference-architecture]: media/iot-hub-what-is-azure-iot/iot-reference-architecture.png
[lnk-reference-architecture]: TBD
[lnk-device-sdks]: TBD
[lnk-iot-hub]: TBD
[lnk-iot-suite]: TBD
