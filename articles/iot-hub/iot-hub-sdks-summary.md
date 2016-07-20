<properties
 pageTitle="List of Azure IoT Hub SDKs | Microsoft Azure"
 description="Information about and links to the various Azure IoT Hub device and service SDKs."
 services="iot-hub"
 documentationCenter=""
 authors="dominicbetts"
 manager="timlt"
 editor=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="multiple"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="06/23/2016"
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
- [Microsoft Azure IoT device SDK for Python 2.7][]

### OS Platforms and hardware compatibility

For more information about compatibility with specific hardware devices, see the following articles:

- [OS Platforms and hardware compatibility with device SDKs][OS Platforms and hardware compatibility]
- [Microsoft Azure Certified for IoT program][].

## IoT Hub service SDKs

The Microsoft Azure IoT service SDKs contain code that facilitates building applications that interact directly with IoT Hub to manage devices and security.

The following IoT service SDKs are available to download from GitHub:

- [Azure IoT service SDK for Node.js][]
- [Azure IoT service SDK for Java][]

## Azure IoT Gateway SDK

This Azure IoT Gateway SDK contains the infrastructure and modules to create IoT gateway solutions. You can extend the SDK to create gateways tailored to any end-to-end scenario.

You can download the [Azure IoT Gateway SDK][] from GitHub.

## Online API reference documentation

The following is a list of links to online API reference documentation for Azure IoT device, service, and gateway libraries:

- [Internet of Things (IoT) .NET][]
- [IoT Hub REST][]
- [Microsoft Azure IoT device SDK for C][]
- [Microsoft Azure IoT device SDK for Java][]
- [Microsoft Azure IoT service SDK for Java][]
- [Microsoft Azure IoT device SDK for Node.js][]
- [Microsoft Azure IoT service SDK for Node.js][]
- [Microsoft Azure IoT gateway SDK][]

## Next steps

To further explore the capabilities of IoT Hub, see:

- [Designing your solution][lnk-design]
- [Exploring device management using the sample UI][lnk-dmui]
- [Simulating a device with the Gateway SDK][lnk-gateway]
- [Using the Azure Portal to manage IoT Hub][lnk-portal]

[Microsoft Azure IoT SDKs]: https://github.com/Azure/azure-iot-sdks/blob/master/readme.md
[Azure IoT device SDK for C]: https://github.com/Azure/azure-iot-sdks/blob/master/c/readme.md
[Azure IoT device SDK for .NET]: https://github.com/Azure/azure-iot-sdks/blob/master/csharp/device/readme.md
[Azure IoT device SDK for Java]: https://github.com/Azure/azure-iot-sdks/blob/master/java/device/readme.md
[Azure IoT service SDK for Java]: https://github.com/Azure/azure-iot-sdks/blob/master/java/service/readme.md
[Azure IoT device SDK for Node.js]: https://github.com/Azure/azure-iot-sdks/blob/master/node/device/readme.md
[Azure IoT service SDK for Node.js]: https://github.com/Azure/azure-iot-sdks/blob/master/node/service/README.md
[Microsoft Azure IoT device SDK for Python 2.7]: https://github.com/Azure/azure-iot-sdks/blob/master/python/device/readme.md
[OS Platforms and hardware compatibility]: iot-hub-tested-configurations.md
[Microsoft Azure Certified for IoT program]: iot-hub-tested-configurations.md#microsoft-azure-certified-for-iot
[Azure IoT Gateway SDK]: https://github.com/Azure/azure-iot-gateway-sdk/blob/master/README.md

[Internet of Things (IoT) .NET]: https://msdn.microsoft.com/library/mt488521.aspx
[Microsoft Azure IoT device SDK for C]: http://azure.github.io/azure-iot-sdks/c/api_reference/index.html
[Microsoft Azure IoT device SDK for Java]: http://azure.github.io/azure-iot-sdks/java/device/api_reference/index.html
[Microsoft Azure IoT device SDK for Node.js]: http://azure.github.io/azure-iot-sdks/node/api_reference/azure-iot-device/1.0.8/index.html
[IoT Hub REST]: https://msdn.microsoft.com/library/mt548492.aspx
[Microsoft Azure IoT service SDK for Java]: http://azure.github.io/azure-iot-sdks/java/service/api_reference/index.html
[Microsoft Azure IoT service SDK for Node.js]: http://azure.github.io/azure-iot-sdks/node/api_reference/azure-iothub/1.0.10/index.html
[Microsoft Azure IoT gateway SDK]: http://azure.github.io/azure-iot-gateway-sdk/api_reference/c/html/

[lnk-design]: iot-hub-guidance.md
[lnk-dmui]: iot-hub-device-management-ui-sample.md
[lnk-gateway]: iot-hub-linux-gateway-sdk-simulated-device.md
[lnk-portal]: iot-hub-manage-through-portal.md