<properties
 pageTitle="Microsoft Azure IoT Hub and the Internet of Things (IoT) | Microsoft Azure"
 description="A overview of IoT on Azure including the Microsoft IoT Reference Architecture and how it relates to Azure IoT Hub, Device SDKs, and preconfigured solutions"
 services="iot-hub"
 documentationCenter=".net"
 authors="dominicbetts"
 manager="timlt"
 editor=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="tbd"
 ms.date="09/04/2015"
 ms.author="dobett"/>

[AZURE.INCLUDE [iot-azure-and-iot](../../includes/iot-azure-and-iot.md)]

## Scope of this documentation
These Azure and IoT articles focus on two collections of resources that can help you to implement your own IoT solution based on the Microsoft IoT reference architecture.
- Azure IoT Hub
- Azure IoT device SDKs

You may also be interested in [Azure IoT Suite][lnk-iot-suite], an enterprise-grade solution that allows you to get started quickly through a set of extensible preconfigured solutions that address common IoT scenarios, such as remote monitoring, asset management and predictive maintenance.

### Azure IoT Hub
IoT Hub is an Azure service that enables you to receive device-to-cloud data at scale from your devices and route that data to a stream event processor. IoT Hub can also send cloud-to-device commands to specific devices using device specific queues.

In addition, the IoT Hub service includes a device identity registry that helps you to provision devices and to manage which devices may connect to an IoT hub.

### Azure IoT device SDKs
Microsoft provides IoT device SDKs that enable you to implement client applications to run on a wide variety of device hardware platforms and operating systems. The IoT device SDKs include libraries that facilitate sending device-to-cloud telemetry data to IoT Hub and receiving cloud-to-device commands from IoT Hub. These IoT device SDKs enable you to choose from a number of different network protocols to communicate with Azure IoT Hub.

## Next steps
To get started with IoT on Azure, explore these resources:
- [Azure IoT device SDKs][lnk-device-sdks].
- [Azure IoT Hub][lnk-iot-hub].
- [Azure IoT Suite][lnk-iot-suite].  


[lnk-device-sdks]: TBD
[lnk-iot-hub]: TBD
[lnk-iot-suite]: TBD
