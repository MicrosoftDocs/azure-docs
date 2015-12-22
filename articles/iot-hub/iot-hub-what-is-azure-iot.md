<properties
 pageTitle="Azure solutions for Internet of Things | Microsoft Azure"
 description="A overview of IoT on Azure including a sample solution architecture and how it relates to Azure IoT Hub, device SDKs, and preconfigured solutions"
 services="iot-hub"
 documentationCenter=""
 authors="dominicbetts"
 manager="timlt"
 editor=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="11/05/2015"
 ms.author="dobett"/>

[AZURE.INCLUDE [iot-azure-and-iot](../../includes/iot-azure-and-iot.md)]

## Next steps

Azure IoT Hub is an Azure service that receives telemetry at scale from your devices and routes that data to a stream event processor. You can use IoT Hub to implement your own solution backend. IoT Hub can also send cloud-to-device commands to specific devices. In addition, IoT Hub includes a device identity registry that you can use to provision devices and to manage which devices may connect to the hub. To learn more, see:

- [What is IoT Hub?][lnk-iot-hub]
- [Get started with IoT Hub][lnk-getstarted]

To implement client applications on a wide variety of device hardware platforms and operating systems, you can use the IoT device SDKs. The IoT device SDKs include libraries that facilitate sending telemetry to an IoT hub and receiving cloud-to-device commands. When you use the SDKs, you can choose from a number of network protocols to communicate with IoT Hub. To learn more, see the [information about device SDKs][lnk-device-sdks].

You may also be interested in [Azure IoT Suite][lnk-iot-suite], which is a collection of preconfigured solutions. IoT Suite enables you to get started quickly and scale IoT projects to address common IoT scenarios--such as remote monitoring, asset management, and predictive maintenance.

[lnk-getstarted]: iot-hub-csharp-csharp-getstarted.md
[lnk-device-sdks]: https://github.com/Azure/azure-iot-sdks/blob/master/readme.md
[lnk-iot-hub]: iot-hub-what-is-iot-hub.md
[lnk-iot-suite]: http://azure.microsoft.com/solutions/iot/
[lnk-iotdev]: https://azure.microsoft.com/develop/iot/
