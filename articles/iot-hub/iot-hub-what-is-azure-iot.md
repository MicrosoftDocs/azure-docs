<properties
 pageTitle="Azure solutions for Internet of Things | Microsoft Azure"
 description="A overview of IoT on Azure including a sample solution architecture and how it relates to Azure IoT Hub, Device SDKs, and preconfigured solutions"
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
 ms.date="09/29/2015"
 ms.author="dobett"/>

[AZURE.INCLUDE [iot-azure-and-iot](../../includes/iot-azure-and-iot.md)]

## Scope of this documentation

These Azure and IoT articles focus on two collections of resources that can help you to implement your own IoT solution based on the Microsoft IoT platform.

- Azure IoT Hub
- Azure IoT device SDKs

You may also be interested in [Azure IoT Suite][lnk-iot-suite], a collection of preconfigured solutions that enable you to get started quickly and scale IoT projects to address common IoT scenarios such as remote monitoring, asset management and predictive maintenance.

### Azure IoT Hub

IoT Hub is an Azure service that receives device-to-cloud data at scale from your devices and routes that data to a stream event processor. IoT Hub can also send cloud-to-device commands to specific devices using device specific queues.

In addition, the IoT Hub service includes a device identity registry that you can use to provision devices and to manage which devices may connect to an IoT hub.

### Azure IoT device SDKs

Microsoft provides IoT device SDKs that you can use to implement client applications to run on a wide variety of device hardware platforms and operating systems. The IoT device SDKs include libraries that facilitate sending device-to-cloud telemetry data to IoT Hub and receiving cloud-to-device commands from IoT Hub. When you use the SDKs, you can choose from a number of different network protocols to communicate with Azure IoT Hub.

## Next steps

To get started with IoT on Azure, explore these resources:

- [Get started with IoT Hub][lnk-getstarted].
- [Azure IoT Hub][lnk-iot-hub].
- [Azure IoT Suite][lnk-iot-suite].  


[lnk-getstarted]: iot-hub-csharp-csharp-getstarted.md
[lnk-iot-hub]: iot-hub-what-is-iot-hub.md
[lnk-iot-suite]: http://azure.microsoft.com/solutions/iot/
