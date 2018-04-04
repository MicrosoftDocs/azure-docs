---
title: Understand the Azure IoT SDKs | Microsoft Docs
description: Developer guide - information about and links to the various Azure IoT device and service SDKs that you can use to build device apps and back-end apps.
services: iot-hub
documentationcenter: ''
author: dominicbetts
manager: timlt
editor: ''

ms.assetid: c5c9a497-bb03-4301-be2d-00edfb7d308f
ms.service: iot-hub
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/12/2018
ms.author: dobett
ms.custom: H1Hack27Feb2017

---
# Understand and use Azure IoT SDKs

There are two categories of software development kits (SDKs) for working with IoT Hub:

* **Device SDKs** enable you to build apps that run on your IoT devices. These apps send telemetry to your IoT hub, and optionally receive messages, job, method, or twin updates from your IoT hub.

* **Service SDKs** enable you to manage your IoT hub, and optionally send messages, schedule jobs, invoke direct method, set desired property updates to your IoT devices.

Learn about the benefits of developing using Azure IoT SDKs [here][lnk-benefits-blog].

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-partial.md)]

## Azure IoT device SDKs

The Microsoft Azure IoT device SDKs contain code that facilitates building devices and applications that connect to and are managed by Azure IoT Hub services.

The following Azure IoT device SDKs are available to download from GitHub:

* [Azure IoT device SDK for .NET][lnk-dotnet-device-sdk]
* [Azure IoT device SDK for Java][lnk-java-device-sdk]
* [Azure IoT device SDK for Node.js][lnk-node-device-sdk]
* [Azure IoT device SDK for Python][lnk-python-device-sdk]
* [Azure IoT device SDK for C][lnk-c-device-sdk] written in ANSI C (C99) for portability and broad platform compatibility. 

> [!NOTE]
> See the readme files in the GitHub repositories for information about using language and platform-specific package managers to install binaries and dependencies on your development machine.
> 
> 

### OS platform and hardware compatibility

For more information about SDK compatibility with specific hardware devices, see the [Azure Certified for IoT device catalog][lnk-certified].

A list of platforms are tested extensively with every release:
* Linux (Ubuntu, Debian, Raspbian)
* Windows
* OSX
* MBED
* Arduino Huzzah

## Azure IoT service SDKs

The Azure IoT service SDKs contain code to facilitate building applications that interact directly with IoT Hub to manage devices and security.

The following Azure IoT service SDKs are available to download from GitHub:

* [Azure IoT service SDK for .NET][lnk-dotnet-service-sdk]
* [Azure IoT service SDK for Java][lnk-java-service-sdk]
* [Azure IoT service SDK for Node.js][lnk-node-service-sdk]
* [Azure IoT service SDK for Python][lnk-python-service-sdk]
* [Azure IoT service SDK for C][lnk-c-service-sdk]

> [!NOTE]
> See the readme files in the GitHub repositories for information about using language and platform-specific package managers to install binaries and dependencies on your development machine.


## Online API reference documentation

The following list contains links to online API reference documentation for Azure IoT device, service, and gateway libraries:

* [Azure IoT device SDK for .NET][lnk-dotnet-ref]
* [Azure IoT service SDK for .NET][lnk-dotnet-service-ref]
* [Azure IoT device SDK for Java][lnk-java-ref]
* [Azure IoT service SDK for Java][lnk-java-service-ref]
* [Azure IoT device SDK for Node.js][lnk-node-ref]
* [Azure IoT service SDK for Node.js][lnk-node-service-ref]
* [Azure IoT device SDK for C][lnk-c-ref]
* [IoT Hub REST][lnk-rest-ref]

## Next steps

Other reference topics in this IoT Hub developer guide include:

* [IoT Hub endpoints][lnk-devguide-endpoints]
* [IoT Hub query language for device twins, jobs, and message routing][lnk-devguide-query]
* [Quotas and throttling][lnk-devguide-quotas]
* [IoT Hub MQTT support][lnk-devguide-mqtt]

<!-- Links and images -->

[lnk-c-device-sdk]: https://github.com/Azure/azure-iot-sdk-c
[lnk-c-service-sdk]: https://github.com/Azure/azure-iot-sdk-c/tree/master/iothub_service_client
[lnk-dotnet-device-sdk]: https://github.com/Azure/azure-iot-sdk-csharp/tree/master/iothub/device
[lnk-java-device-sdk]: https://github.com/Azure/azure-iot-sdk-java/tree/master/device
[lnk-dotnet-service-sdk]: https://github.com/Azure/azure-iot-sdk-csharp/tree/master/iothub/service
[lnk-java-service-sdk]: https://github.com/Azure/azure-iot-sdk-java/tree/master/service
[lnk-node-device-sdk]: https://github.com/Azure/azure-iot-sdk-node/tree/master/device
[lnk-node-service-sdk]: https://github.com/Azure/azure-iot-sdk-node/tree/master/service
[lnk-python-device-sdk]: https://github.com/Azure/azure-iot-sdk-python/tree/master/device
[lnk-python-service-sdk]: https://github.com/Azure/azure-iot-sdk-python/tree/master/service
[lnk-certified]: https://catalog.azureiotsuite.com/

[lnk-dotnet-ref]: https://docs.microsoft.com/dotnet/api/microsoft.azure.devices?view=azure-dotnet
[lnk-dotnet-service-ref]: https://docs.microsoft.com/dotnet/api/microsoft.azure.devices
[lnk-c-ref]: https://azure.github.io/azure-iot-sdk-c/index.html
[lnk-java-ref]: https://docs.microsoft.com/java/api/com.microsoft.azure.sdk.iot.device
[lnk-node-ref]: https://docs.microsoft.com/java/api/com.microsoft.azure.sdk.iot.device
[lnk-rest-ref]: https://docs.microsoft.com/rest/api/iothub/
[lnk-java-service-ref]: https://docs.microsoft.com/java/api/com.microsoft.azure.sdk.iot.service
[lnk-node-service-ref]: https://docs.microsoft.com/java/api/com.microsoft.azure.sdk.iot.service

[lnk-devguide-endpoints]: iot-hub-devguide-endpoints.md
[lnk-devguide-quotas]: iot-hub-devguide-quotas-throttling.md
[lnk-devguide-query]: iot-hub-devguide-query-language.md
[lnk-devguide-mqtt]: iot-hub-mqtt-support.md
[lnk-benefits-blog]: https://azure.microsoft.com/blog/benefits-of-using-the-azure-iot-sdks-in-your-azure-iot-solution/
