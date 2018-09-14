---
title: Understand the Azure IoT SDKs | Microsoft Docs
description: Developer guide - information about and links to the various Azure IoT device and service SDKs that you can use to build device apps and back-end apps.
author: dominicbetts
manager: timlt
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 09/14/2018
ms.author: dobett
---

# Understand and use Azure IoT Hub SDKs

There are three categories of software development kits (SDKs) for working with IoT Hub:

* **Device SDKs** enable you to build apps that run on your IoT devices using device client or module client. These apps send telemetry to your IoT hub, and optionally receive messages, job, method, or twin updates from your IoT hub.  You can also use module client to author [modules](https://docs.microsoft.com/azure/iot-edge/iot-edge-modules) for [Azure IoT Edge runtime](https://docs.microsoft.com/en-us/azure/iot-edge/about-iot-edge).

* **Service SDKs** enable you to manage your IoT hub, and optionally send messages, schedule jobs, invoke direct methods, or send desired property updates to your IoT devices or modules.

* **Device Provisioning SDKs** enable you to provision devices to your IoT Hub using the [Device Provisioning Service](../iot-dps/about-iot-dps.md).

Learn about the benefits of developing using Azure IoT SDKs [here][lnk-benefits-blog].

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-partial.md)]

## Azure IoT device SDKs

The Microsoft Azure IoT device SDKs contain code that facilitates building devices and applications that connect to and are managed by Azure IoT Hub services.

Azure IoT Hub device SDK for .NET: 
* Install from [Nuget][lnk-nuget-csharp-device]
* [Source code][lnk-dotnet-sdk]
* [API reference][lnk-dotnet-ref]
* [Module reference][https://docs.microsoft.com/dotnet/api/microsoft.azure.devices.client.moduleclient?view=azure-dotnet]

Azure IoT Hub device SDK for C: written in ANSI C (C99) for portability and broad platform compatibility
* Install from [apt-get, MBED, Arduino IDE, or Nuget][lnk-c-package]
* [Source code][lnk-c-sdk]
* [API reference][lnk-c-ref]
* [Module reference][https://github.com/Azure/azure-iot-sdk-c/blob/master/iothub_client/inc/iothub_module_client.h]

Azure IoT Hub device SDK for Java: 
* Add to [Maven][lnk-maven-device] project
* [Source code][lnk-java-sdk]
* [API reference][lnk-java-ref]
* [Module reference][https://docs.microsoft.com/java/api/com.microsoft.azure.sdk.iot.device._module_client?view=azure-java-stable]

Azure IoT Hub device SDK for Node.js: 
* Install from [npm][lnk-npm-device]
* [Source code][lnk-node-sdk]
* [API reference][lnk-node-ref]
* [Module reference][https://docs.microsoft.com/javascript/api/azure-iot-device/moduleclient?view=azure-node-latest]

Azure IoT Hub device SDK for Python: 
* Install from [pip][lnk-pip-device]
* [Source code][lnk-python-sdk]

Azure IoT Hub device SDK for iOS: 
* Install from [CocoaPod][lnk-cocoa-device]
* [Samples][lnk-ios-sample]

> [!NOTE]
> See the readme files in the GitHub repositories for information about using language and platform-specific package managers to install binaries and dependencies on your development machine.
> 
> 

### OS platform and hardware compatibility

Supported platforms for the SDKs can be found in this [document](iot-hub-device-sdk-platform-support.md).
For more information about SDK compatibility with specific hardware devices, see the [Azure Certified for IoT device catalog][lnk-certified] or individual repository.

## Azure IoT service SDKs

The Azure IoT service SDKs contain code to facilitate building applications that interact directly with IoT Hub to manage devices and security.

Azure IoT Hub service SDK for .NET:
* Download from [Nuget][lnk-nuget-csharp-service]
* [Source code][lnk-dotnet-sdk]
* [API reference][lnk-dotnet-service-ref]

Azure IoT Hub service SDK for Java: 
* Add to [Maven][lnk-maven-service] project
* [Source code][lnk-java-sdk]
* [API reference][lnk-java-service-ref]

Azure IoT Hub service SDK for Node.js: 
* Download from [npm][lnk-npm-service]
* [Source code][lnk-node-sdk]
* [API reference][lnk-node-service-ref]

Azure IoT Hub service SDK for Python: 
* Download from [pip][lnk-pip-service]
* [Source code][lnk-python-sdk]

Azure IoT Hub service SDK for C: 
* Download from [apt-get, MBED, Arduino IDE, or Nuget][lnk-c-package]
* [Source code][lnk-c-sdk]

Azure IoT Hub service SDK for iOS: 
* Install from [CocoaPod][lnk-cocoa-service]
* [Samples][lnk-ios-sample]

> [!NOTE]
> See the readme files in the GitHub repositories for information about using language and platform-specific package managers to install binaries and dependencies on your development machine.

## Device provisioning SDKs

The **Microsoft Azure Provisioning SDKs** enable you to provision devices to your IoT Hub using the [Device Provisioning Service](../iot-dps/about-iot-dps.md).

Azure Provisioning device and service SDKs for C#:
* [Provisioning device client SDK](https://github.com/Azure/azure-iot-sdk-csharp/blob/master/provisioning/device)
* [Provisioning service client SDK](https://github.com/Azure/azure-iot-sdk-csharp/blob/master/provisioning/service)

Azure Provisioning device and service SDKs for Java:
* [Provisioning device client SDK](https://github.com/Azure/azure-iot-sdk-java/blob/master/provisioning-device-client)
* [Provisioning service client SDK](https://github.com/Azure/azure-iot-sdk-java/blob/master/provisioning/provisioning-service-client)

Azure Provisioning device and service SDKs for Node.js:
* [Provisioning device client SDK](https://github.com/Azure/azure-iot-sdk-node/tree/master/provisioning/device)
* [Provisioning service client SDK](https://github.com/Azure/azure-iot-sdk-node/tree/master/provisioning/service)

Azure Provisioning device and service SDKs for Python:
* [Provisioning device client SDK](https://github.com/Azure/azure-iot-sdk-python/blob/master/provisioning_device_client)
* [Provisioning service client SDK](https://github.com/Azure/azure-iot-sdk-python/tree/master/provisioning_service_client)

Azure Provisioning device and service SDKs for C:
* [Provisioning device client SDK](https://github.com/Azure/azure-iot-sdk-c/blob/master/provisioning_client)
* [Provisioning service client SDK](https://github.com/Azure/azure-iot-sdk-c/blob/master/provisioning/service)

## Next steps

Azure IoT SDKs also provide a set of tools to help with development:
* [iothub-diagnostics](https://github.com/Azure/iothub-diagnostics): a cross-platform command line tool to help diagnose issues related to connection with IoT Hub.
* [device-explorer](https://github.com/Azure/azure-iot-sdk-csharp/tree/master/tools/DeviceExplorer): a Windows desktop application to connect to your IoT Hub.

Other reference topics in this IoT Hub developer guide include:

* [IoT Hub endpoints][lnk-devguide-endpoints]
* [IoT Hub query language for device twins, jobs, and message routing][lnk-devguide-query]
* [Quotas and throttling][lnk-devguide-quotas]
* [IoT Hub MQTT support][lnk-devguide-mqtt]
* [IoT Hub REST API reference][lnk-rest-ref]
* [Auzre IoT SDK platform support](iot-hub-device-sdk-platform-support.md)

<!-- Links and images -->

[lnk-c-sdk]: https://github.com/Azure/azure-iot-sdk-c
[lnk-dotnet-sdk]: https://github.com/Azure/azure-iot-sdk-csharp
[lnk-java-sdk]: https://github.com/Azure/azure-iot-sdk-java
[lnk-node-sdk]: https://github.com/Azure/azure-iot-sdk-node
[lnk-python-sdk]: https://github.com/Azure/azure-iot-sdk-python
[lnk-certified]: https://catalog.azureiotsuite.com/

[lnk-dotnet-ref]: https://docs.microsoft.com/dotnet/api/microsoft.azure.devices?view=azure-dotnet
[lnk-dotnet-service-ref]: https://docs.microsoft.com/dotnet/api/microsoft.azure.devices
[lnk-c-ref]: https://azure.github.io/azure-iot-sdk-c/index.html
[lnk-java-ref]: https://docs.microsoft.com/java/api/com.microsoft.azure.sdk.iot.device
[lnk-node-ref]: https://docs.microsoft.com/javascript/api/azure-iot-device/?view=azure-iot-typescript-latest
[lnk-rest-ref]: https://docs.microsoft.com/rest/api/iothub/
[lnk-java-service-ref]: https://docs.microsoft.com/java/api/com.microsoft.azure.sdk.iot.service
[lnk-node-service-ref]: https://docs.microsoft.com/javascript/api/azure-iothub/?view=azure-iot-typescript-latest

[lnk-maven-device]: https://github.com/Azure/azure-iot-sdk-java/blob/master/doc/java-devbox-setup.md#for-the-device-sdk
[lnk-maven-service]: https://github.com/Azure/azure-iot-sdk-java/blob/master/doc/java-devbox-setup.md#for-the-service-sdk
[lnk-npm-device]: https://www.npmjs.com/package/azure-iot-device
[lnk-npm-service]: https://www.npmjs.com/package/azure-iothub
[lnk-nuget-csharp-device]: https://www.nuget.org/packages/Microsoft.Azure.Devices.Client/
[lnk-nuget-csharp-service]: https://www.nuget.org/packages/Microsoft.Azure.Devices/
[lnk-c-package]: https://github.com/Azure/azure-iot-sdk-c/blob/master/readme.md
[lnk-pip-device]: https://pypi.python.org/pypi/azure-iothub-device-client/
[lnk-pip-service]: https://pypi.python.org/pypi/azure-iothub-service-client/


[lnk-devguide-endpoints]: iot-hub-devguide-endpoints.md
[lnk-devguide-quotas]: iot-hub-devguide-quotas-throttling.md
[lnk-devguide-query]: iot-hub-devguide-query-language.md
[lnk-devguide-mqtt]: iot-hub-mqtt-support.md
[lnk-benefits-blog]: https://azure.microsoft.com/blog/benefits-of-using-the-azure-iot-sdks-in-your-azure-iot-solution/
[lnk-cocoa-device]: https://cocoapods.org/pods/AzureIoTHubClient
[lnk-ios-sample]: https://github.com/Azure-Samples/azure-iot-samples-ios
[lnk-cocoa-service]: https://cocoapods.org/pods/AzureIoTHubServiceClient
