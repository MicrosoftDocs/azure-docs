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
ms.date: 03/24/2017
ms.author: dobett
ms.custom: H1Hack27Feb2017

---
# Understand and use Azure IoT SDKs

There are three categories of SDK for working with IoT Hub:

* **Device SDKs** enable you to build apps that run on your IoT devices. These apps send telemetry to your IoT hub, and optionally receive messages from your IoT hub.

* **Service SDKs** enable you to manage your IoT hub, and optionally send messages to your IoT devices.

* **Azure IoT Edge** enables you to build gateways to enable devices that don't use one of the supported protocols, or when you need to process messages on the edge.

SDKs are provided to support multiple programming languages.

## Azure IoT device SDKs

The Microsoft Azure IoT device SDKs contain code that facilitates building devices and applications that connect to and are managed by Azure IoT Hub services.

The following Azure IoT device SDKs are available to download from GitHub:

* [Azure IoT device SDK for C][lnk-c-device-sdk] written in ANSI C (C99) for portability and broad platform compatibility.
* [Azure IoT device SDK for .NET][lnk-dotnet-device-sdk]
* [Azure IoT device SDK for Java][lnk-java-device-sdk]
* [Azure IoT device SDK for Node.js][lnk-node-device-sdk]
* [Azure IoT device SDK for Python][lnk-python-device-sdk]

> [!NOTE]
> See the readme files in the GitHub repositories for information about using language and platform-specific package managers to install binaries and dependencies on your development machine.
> 
> 

### OS platform and hardware compatibility

For more information about SDK compatibility with specific hardware devices, see the [Azure Certified for IoT device catalog][lnk-certified].

## Azure IoT service SDKs

The Azure IoT service SDKs contain code to facilitate building applications that interact directly with IoT Hub to manage devices and security.

The following Azure IoT service SDKs are available to download from GitHub:

* [Azure IoT service SDK for .NET][lnk-dotnet-service-sdk]
* [Azure IoT service SDK for Node.js][lnk-node-service-sdk]
* [Azure IoT service SDK for Java][lnk-java-service-sdk]
* [Azure IoT service SDK for Python][lnk-python-service-sdk]


> [!NOTE]
> See the readme files in the GitHub repositories for information about using language and platform-specific package managers to install binaries and dependencies on your development machine.

## Azure IoT Edge

Azure IoT Edge contains the infrastructure and modules to create IoT gateway solutions. You can extend IoT Edge to create gateways tailored to any end-to-end scenario.

You can download [Azure IoT Edge][lnk-iot-edge] from GitHub.

## Online API reference documentation

The following list contains links to online API reference documentation for Azure IoT device, service, and gateway libraries:

* [Internet of Things (IoT) .NET][lnk-dotnet-ref]
* [IoT Hub REST][lnk-rest-ref]
* [Azure IoT device SDK for C][lnk-c-ref]
* [Azure IoT device SDK for Java][lnk-java-ref]
* [Azure IoT service SDK for Java][lnk-java-service-ref]
* [Azure IoT device SDK for Node.js][lnk-node-ref]
* [Azure IoT service SDK for Node.js][lnk-node-service-ref]
* [Azure IoT Edge][lnk-gateway-ref]

## Next steps

Other reference topics in this IoT Hub developer guide include:

* [IoT Hub endpoints][lnk-devguide-endpoints]
* [IoT Hub query language for device twins, jobs, and message routing][lnk-devguide-query]
* [Quotas and throttling][lnk-devguide-quotas]
* [IoT Hub MQTT support][lnk-devguide-mqtt]

<!-- Links and images -->

[lnk-c-device-sdk]: https://github.com/Azure/azure-iot-sdk-c
[lnk-dotnet-device-sdk]: https://github.com/Azure/azure-iot-sdk-csharp/tree/master/device
[lnk-java-device-sdk]: https://github.com/Azure/azure-iot-sdk-java/tree/master/device
[lnk-dotnet-service-sdk]: https://github.com/Azure/azure-iot-sdk-csharp/tree/master/service
[lnk-java-service-sdk]: https://github.com/Azure/azure-iot-sdk-java/tree/master/service
[lnk-node-device-sdk]: https://github.com/Azure/azure-iot-sdk-node/tree/master/device
[lnk-node-service-sdk]: https://github.com/Azure/azure-iot-sdk-node/tree/master/service
[lnk-python-device-sdk]: https://github.com/Azure/azure-iot-sdk-python/tree/master/device
[lnk-python-service-sdk]: https://github.com/Azure/azure-iot-sdk-python/tree/master/service
[lnk-certified]: https://catalog.azureiotsuite.com/
[lnk-iot-edge]: https://github.com/Azure/iot-edge

[lnk-dotnet-ref]: https://docs.microsoft.com/dotnet/api/microsoft.azure.devices
[lnk-c-ref]: https://azure.github.io/azure-iot-sdk-c/index.html
[lnk-java-ref]: https://docs.microsoft.com/java/api/com.microsoft.azure.sdk.iot.device
[lnk-node-ref]: https://azure.github.io/azure-iot-sdk-node/azure-iot-device/1.1.12/index.html
[lnk-rest-ref]: https://docs.microsoft.com/rest/api/iothub/
[lnk-java-service-ref]: https://docs.microsoft.com/java/api/com.microsoft.azure.sdk.iot.service.auth
[lnk-node-service-ref]: https://azure.github.io/azure-iot-sdk-node/azure-iothub/1.1.11/index.html
[lnk-gateway-ref]: http://azure.github.io/iot-edge/api_reference/c/html/

[lnk-devguide-endpoints]: iot-hub-devguide-endpoints.md
[lnk-devguide-quotas]: iot-hub-devguide-quotas-throttling.md
[lnk-devguide-query]: iot-hub-devguide-query-language.md
[lnk-devguide-mqtt]: iot-hub-mqtt-support.md
