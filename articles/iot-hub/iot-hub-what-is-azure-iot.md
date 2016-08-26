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
 ms.topic="get-started-article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="07/19/2016"
 ms.author="dobett"/>

[AZURE.INCLUDE [iot-azure-and-iot](../../includes/iot-azure-and-iot.md)]

## Next steps

Azure IoT Hub is an Azure service that enables secure and reliable bi-directional communications between your application back end and millions of devices. It allows the application back end to receive telemetry at scale from your devices, route that data to a stream event processor, receive file uploads from devices, and also to send cloud-to-device commands to specific devices. You can use IoT Hub to implement your own solution back end. In addition, IoT Hub includes a device identity registry used to provision devices, their security credentials, and their rights to connect to the hub. To learn more about IoT Hub, see [What is IoT Hub?][lnk-iot-hub].

To learn how Azure IoT Hub enables standards-based IoT device management for you to remotely manage, configure, and update your devices, see [Overview of Azure IoT Hub device management][lnk-device-management].

To implement client applications on a wide variety of device hardware platforms and operating systems, you can use the IoT device SDKs. The IoT device SDKs include libraries that facilitate sending telemetry to an IoT hub and receiving cloud-to-device commands. When you use the SDKs, you can choose from a number of network protocols to communicate with IoT Hub. To learn more, see the [information about device SDKs][lnk-device-sdks].

To get started writing some code and running some samples, see the [Get started with IoT Hub][lnk-getstarted] tutorial.

You may also be interested in [Azure IoT Suite][lnk-iot-suite], which is a collection of preconfigured solutions. IoT Suite enables you to get started quickly and scale IoT projects to address common IoT scenarios--such as remote monitoring, asset management, and predictive maintenance.

[lnk-getstarted]: iot-hub-csharp-csharp-getstarted.md
[lnk-device-sdks]: https://github.com/Azure/azure-iot-sdks/blob/master/readme.md
[lnk-iot-hub]: iot-hub-what-is-iot-hub.md
[lnk-iot-suite]: https://azure.microsoft.com/documentation/suites/iot-suite/
[lnk-iotdev]: https://azure.microsoft.com/develop/iot/
[lnk-device-management]: iot-hub-device-management-overview.md