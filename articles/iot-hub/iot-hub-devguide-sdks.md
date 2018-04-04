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

* Azure IoT Hub device SDK for .NET: 
  * Download from [Nuget][lnk-nuget-csharp-device]
  * [Source code][lnk-dotnet-device-sdk]
  * [API reference][lnk-dotnet-ref]
* Azure IoT Hub device SDK for C: written in ANSI C (C99) for portability and broad platform compatibility
  * Download from [apt-get, MBED, Arduino IDE, or Nuget](lnk-c-package)
  * [Source code][lnk-c-device-sdk]
  * [API reference][lnk-c-ref]
* Azure IoT Hub device SDK for Java: 
  * Add to [Maven][lnk-maven-device] project
  * [Source code][lnk-java-device-sdk]
  * [API reference][lnk-java-ref]
* Azure IoT Hub device SDK for Node.js: 
  * Download from [npm][lnk-npm-device]
  * Source code [lnk-node-device-sdk]
  * [API reference][lnk-node-ref]
* Azure IoT Hub device SDK for Python: 
  * Download from [pip][lnk-pip-device]
  * [Source code][lnk-python-device-sdk]

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

* Azure IoT Hub service SDK for .NET: 
  * Download from [Nuget][lnk-nuget-csharp-service]
  * [Source code][lnk-dotnet-service-sdk]
  * [API reference][lnk-dotnet-service-ref]
* Azure IoT Hub service SDK for Java: 
  * Add to [Maven][lnk-maven-service] project
  * [Source code][lnk-java-service-sdk]
  * [API reference][lnk-java-service-ref]
* Azure IoT Hub service SDK for Node.js: 
  * Download from [npm][lnk-npm-service]
  * [Source code][lnk-node-service-sdk]
  * [API reference][lnk-node-service-ref]
* Azure IoT Hub service SDK for Python: 
  * Download from [pip][lnk-pip-service]
  * [Source code][lnk-python-service-sdk]
* Azure IoT Hub service SDK for C: 
  * Download from [apt-get, MBED, Arduino IDE, or Nuget](lnk-c-package)
  * [Source code][lnk-c-service-sdk]

> [!NOTE]
> See the readme files in the GitHub repositories for information about using language and platform-specific package managers to install binaries and dependencies on your development machine.


## Next steps

Other reference topics in this IoT Hub developer guide include:

* [IoT Hub endpoints][lnk-devguide-endpoints]
* [IoT Hub query language for device twins, jobs, and message routing][lnk-devguide-query]
* [Quotas and throttling][lnk-devguide-quotas]
* [IoT Hub MQTT support][lnk-devguide-mqtt]
* [IoT Hub REST API reference][lnk-rest-ref]

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

[lnk-maven-device]: https://github.com/Azure/azure-iot-sdk-java/blob/master/doc/java-devbox-setup.md#for-the-device-sdk
[lnk-maven-service]: https://github.com/Azure/azure-iot-sdk-java/blob/master/doc/java-devbox-setup.md#for-the-service-sdk
[lnk-npm-device]: https://www.npmjs.com/package/azure-iot-device
[lnk-npm-service]: https://www.npmjs.com/package/azure-iothub
[lnk-nuget-csharp-device]: https://www.nuget.org/packages/Microsoft.Azure.Devices.Client/
[lnk-nuget-csharp-service]: https://www.nuget.org/packages/Microsoft.Azure.Devices/
[lnk-c-package]:https://github.com/Azure/azure-iot-sdk-c/blob/master/iothub_client/readme.md#aptgetpackage
[lnk-pip-device]: https://pypi.python.org/pypi/azure-iothub-device-client/
[lnk-pip-service]: https://pypi.python.org/pypi/azure-iothub-service-client/


[lnk-devguide-endpoints]: iot-hub-devguide-endpoints.md
[lnk-devguide-quotas]: iot-hub-devguide-quotas-throttling.md
[lnk-devguide-query]: iot-hub-devguide-query-language.md
[lnk-devguide-mqtt]: iot-hub-mqtt-support.md
[lnk-benefits-blog]: https://azure.microsoft.com/blog/benefits-of-using-the-azure-iot-sdks-in-your-azure-iot-solution/
