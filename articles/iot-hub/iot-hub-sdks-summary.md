<properties
 pageTitle="List of Azure IoT Hub SDKs | Microsoft Azure"
 description="Information about and links to the various IoT Hub device and service SDKs"
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

# IoT Hub SDKs

This article provides information about the various [Microsoft Azure IoT SDKs][] along with links to additional resources.

## IoT Hub device SDKs

The Microsoft Azure IoT device SDKs contain code that facilitates building devices and applications that connect to and are managed by Azure IoT Hub services.

The following IoT device SDKs are available to download from GitHub:

- [Azure IoT device SDK for C][] written in ANSI C (C99) for portability and broad platform compatibility.
- [Azure IoT device SDK for .NET][]
- [Azure IoT device SDK for Java][]
- [Azure IoT device SDK for Node.js][]

### OS Platforms and hardware compatibility

This [document][OS Platforms and hardware compatibility] describes the compatibility of the device SDKs with different OS platforms as well as the specific device configurations included in the [Microsoft Azure Certified for IoT program][].

## IoT Hub service SDKs

The Microsoft Azure IoT service SDKs contain code that facilitates building applications that interact directly with IoT Hub to manage devices and security.

The following IoT service SDK is available to download from GitHub:

- [Azure IoT service SDK for Node.js][]

## Online API reference documentation

The following is a list of links to online API reference documentation for Azure IoT device libraries:

- [Internet of Things (IoT) .NET][]
- [Microsoft Azure IoT device SDK for C][]
- [Microsoft Azure IoT device SDK for Java][]
- [Microsoft Azure IoT device SDK for Node.js][]

The following is a list of links to online API reference documentation for Azure IoT service libraries:

- [Internet of Things (IoT) .NET][]
- [IoT Hub REST][]


[Microsoft Azure IoT SDKs]: https://github.com/Azure/azure-iot-sdks/blob/master/readme.md
[Azure IoT device SDK for C]: https://github.com/Azure/azure-iot-sdks/blob/master/c/readme.md
[Azure IoT device SDK for .NET]: https://github.com/Azure/azure-iot-sdks/blob/master/csharp/readme.md
[Azure IoT device SDK for Java]: https://github.com/Azure/azure-iot-sdks/blob/master/java/device/readme.md
[Azure IoT device SDK for Node.js]: https://github.com/Azure/azure-iot-sdks/blob/master/node/device/readme.md
[Azure IoT service SDK for Node.js]: https://github.com/Azure/azure-iot-sdks/blob/master/node/service/
[OS Platforms and hardware compatibility]: https://github.com/Azure/azure-iot-sdks/blob/master/doc/tested_configurations.md
[Microsoft Azure Certified for IoT program]: https://github.com/Azure/azure-iot-sdks/blob/master/doc/tested_configurations.md#certified

[Internet of Things (IoT) .NET]: https://msdn.microsoft.com/library/mt488521.aspx
[Microsoft Azure IoT device SDK for C]: http://azure.github.io/azure-iot-sdks/c/api_reference/index.html
[Microsoft Azure IoT device SDK for Java]: http://azure.github.io/azure-iot-sdks/java/api_reference/index.html
[Microsoft Azure IoT device SDK for Node.js]: http://azure.github.io/azure-iot-sdks/node/api_reference/index.html
[IoT Hub REST]: https://msdn.microsoft.com/library/mt548492.aspx
