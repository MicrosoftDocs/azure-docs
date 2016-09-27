<properties
 pageTitle="Developer guide -  IoT Hub SDKs | Microsoft Azure"
 description="Azure IoT Hub developer guide - Information about and links to the various Azure IoT Hub device and service SDKs."
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
 ms.date="09/30/2016"
 ms.author="dobett"/>

# IoT Hub SDKs

## IoT Hub device SDKs

The Microsoft Azure IoT device SDKs contain code that facilitates building devices and applications that connect to and are managed by Azure IoT Hub services.

The following IoT device SDKs are available to download from GitHub:

- [Azure IoT device SDK for C][lnk-c-device-sdk] written in ANSI C (C99) for portability and broad platform compatibility.
- [Azure IoT device SDK for .NET][lnk-dotnet-device-sdk]
- [Azure IoT device SDK for Java][lnk-java-device-sdk]
- [Azure IoT device SDK for Node.js][lnk-node-device-sdk]
- [Microsoft Azure IoT device SDK for Python 2.7][lnk-python-device-sdk]

> [AZURE.NOTE] See the readme files in the GitHub repositories for information about using language and platform-specific package managers to install binaries and dependencies on your development machine.

## OS Platforms and hardware compatibility

For more information about SDK compatibility with specific hardware devices, see the following articles:

- [OS Platforms and hardware compatibility with device SDKs][lnk-compatibility]
- [Microsoft Azure Certified for IoT program][lnk-certified].

## IoT Hub service SDKs

The Microsoft Azure IoT service SDKs contain code that facilitates building applications that interact directly with IoT Hub to manage devices and security.

The following IoT service SDKs are available to download from GitHub:

- [Azure IoT service SDK for .NET][lnk-dotnet-service-sdk]
- [Azure IoT service SDK for Node.js][lnk-node-service-sdk]
- [Azure IoT service SDK for Java][lnk-java-service-sdk]

> [AZURE.NOTE] See the readme files in the GitHub repositories for information about using language and platform-specific package managers to install binaries and dependencies on your development machine.

## Azure IoT Gateway SDK

This Azure IoT Gateway SDK contains the infrastructure and modules to create IoT gateway solutions. You can extend the SDK to create gateways tailored to any end-to-end scenario.

You can download the [Azure IoT Gateway SDK][lnk-gateway-sdk] from GitHub.

## Online API reference documentation

The following is a list of links to online API reference documentation for Azure IoT device, service, and gateway libraries:

- [Internet of Things (IoT) .NET][lnk-dotnet-ref]
- [IoT Hub REST][lnk-rest-ref]
- [Microsoft Azure IoT device SDK for C][lnk-c-ref]
- [Microsoft Azure IoT device SDK for Java][lnk-java-ref]
- [Microsoft Azure IoT service SDK for Java][lnk-java-service-ref]
- [Microsoft Azure IoT device SDK for Node.js][lnk-node-ref]
- [Microsoft Azure IoT service SDK for Node.js][lnk-node-service-ref]
- [Microsoft Azure IoT gateway SDK][lnk-gateway-ref]

## Next steps

Other reference topics in this IoT Hub developer guide include:

- [IoT Hub endpoints][lnk-devguide-endpoints]
- [Query language for twins, methods, and jobs][lnk-devguide-query]
- [Quotas and throttling][lnk-devguide-quotas]
- [IoT Hub MQTT support][lnk-devguide-mqtt]

<!-- Links and images -->

[lnk-c-device-sdk]: https://github.com/Azure/azure-iot-sdks/blob/master/c/readme.md
[lnk-dotnet-device-sdk]: https://github.com/Azure/azure-iot-sdks/blob/master/csharp/device/readme.md
[lnk-java-device-sdk]: https://github.com/Azure/azure-iot-sdks/blob/master/java/device/readme.md
[lnk-dotnet-service-sdk]: https://github.com/Azure/azure-iot-sdks/blob/master/csharp/service/README.md
[lnk-java-service-sdk]: https://github.com/Azure/azure-iot-sdks/blob/master/java/service/readme.md
[lnk-node-device-sdk]: https://github.com/Azure/azure-iot-sdks/blob/master/node/device/readme.md
[lnk-node-service-sdk]: https://github.com/Azure/azure-iot-sdks/blob/master/node/service/README.md
[lnk-python-device-sdk]: https://github.com/Azure/azure-iot-sdks/blob/master/python/device/readme.md
[lnk-compatibility]: iot-hub-tested-configurations.md
[lnk-certified]: iot-hub-tested-configurations.md#microsoft-azure-certified-for-iot
[lnk-gateway-sdk]: https://github.com/Azure/azure-iot-gateway-sdk/blob/master/README.md

[lnk-dotnet-ref]: https://msdn.microsoft.com/library/mt488521.aspx
[lnk-c-ref]: http://azure.github.io/azure-iot-sdks/c/api_reference/index.html
[lnk-java-ref]: http://azure.github.io/azure-iot-sdks/java/device/api_reference/index.html
[lnk-node-ref]: http://azure.github.io/azure-iot-sdks/node/api_reference/azure-iot-device/1.0.15/index.html
[lnk-rest-ref]: https://msdn.microsoft.com/library/mt548492.aspx
[lnk-java-service-ref]: http://azure.github.io/azure-iot-sdks/java/service/api_reference/index.html
[lnk-node-service-ref]: http://azure.github.io/azure-iot-sdks/node/api_reference/azure-iothub/1.0.17/index.html
[lnk-gateway-ref]: http://azure.github.io/azure-iot-gateway-sdk/api_reference/c/html/

[lnk-devguide-endpoints]: iot-hub-devguide-endpoints.md
[lnk-devguide-quotas]: iot-hub-devguide-quotas-throttling.md
[lnk-devguide-query]: iot-hub-devguide-query-language.md
[lnk-devguide-mqtt]: iot-hub-mqtt-support.md