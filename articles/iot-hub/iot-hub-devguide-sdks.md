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

* **Device SDKs** enable you to build apps that run on your IoT devices using device client or module client. These apps send telemetry to your IoT hub, and optionally receive messages, job, method, or twin updates from your IoT hub.  You can also use module client to author [modules](../iot-edge/iot-edge-modules.md) for [Azure IoT Edge runtime](../iot-edge/about-iot-edge.md).

* **Service SDKs** enable you to manage your IoT hub, and optionally send messages, schedule jobs, invoke direct methods, or send desired property updates to your IoT devices or modules.

* **Device Provisioning SDKs** enable you to provision devices to your IoT Hub using the [Device Provisioning Service](../iot-dps/about-iot-dps.md).

Learn about the [benefits of developing using Azure IoT SDKs](https://azure.microsoft.com/blog/benefits-of-using-the-azure-iot-sdks-in-your-azure-iot-solution/).

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-partial.md)]

## Azure IoT device SDKs

The Microsoft Azure IoT device SDKs contain code that facilitates building devices and applications that connect to and are managed by Azure IoT Hub services.

Azure IoT Hub device SDK for .NET: 

* Install from [Nuget](https://www.nuget.org/packages/Microsoft.Azure.Devices.Client/)
* [Source code](https://github.com/Azure/azure-iot-sdk-csharp)
* [API reference](https://docs.microsoft.com/dotnet/api/microsoft.azure.devices?view=azure-dotnet)
* [Module reference](https://docs.microsoft.com/dotnet/api/microsoft.azure.devices.client.moduleclient?view=azure-dotnet)

Azure IoT Hub device SDK for C, written in ANSI C (C99) for portability and broad platform compatibility:

* Install from [apt-get, MBED, Arduino IDE, or Nuget](https://github.com/Azure/azure-iot-sdk-c/blob/master/readme.md)
* [Source code](https://github.com/Azure/azure-iot-sdk-c)
* [API reference](https://azure.github.io/azure-iot-sdk-c/index.html)
* [Module reference](https://github.com/Azure/azure-iot-sdk-c/blob/master/iothub_client/inc/iothub_module_client.h)

Azure IoT Hub device SDK for Java: 

* Add to [Maven](https://github.com/Azure/azure-iot-sdk-java/blob/master/doc/java-devbox-setup.md#for-the-device-sdk) project
* [Source code](https://github.com/Azure/azure-iot-sdk-java)
* [API reference](https://docs.microsoft.com/java/api/com.microsoft.azure.sdk.iot.device)
* [Module reference](https://docs.microsoft.com/java/api/com.microsoft.azure.sdk.iot.device._module_client?view=azure-java-stable)

Azure IoT Hub device SDK for Node.js: 

* Install from [npm](https://www.npmjs.com/package/azure-iot-device)
* [Source code](https://github.com/Azure/azure-iot-sdk-node)
* [API reference](https://docs.microsoft.com/javascript/api/azure-iot-device/?view=azure-iot-typescript-latest)
* [Module reference](https://docs.microsoft.com/javascript/api/azure-iot-device/moduleclient?view=azure-node-latest)

Azure IoT Hub device SDK for Python: 

* Install from [pip](https://pypi.python.org/pypi/azure-iothub-device-client/)
* [Source code](https://github.com/Azure/azure-iot-sdk-python)
* API reference: see [C API reference](https://azure.github.io/azure-iot-sdk-c/index.html)

Azure IoT Hub device SDK for iOS: 

* Install from [CocoaPod](https://cocoapods.org/pods/AzureIoTHubClient)
* [Samples](https://github.com/Azure-Samples/azure-iot-samples-ios)
* API reference: see [C API reference](https://azure.github.io/azure-iot-sdk-c/index.html)

> [!NOTE]
> See the readme files in the GitHub repositories for information about using language and platform-specific package managers to install binaries and dependencies on your development machine.
> 
> 

### OS platform and hardware compatibility

Supported platforms for the SDKs can be found in [Azure IoT SDKs Platform Support](iot-hub-device-sdk-platform-support.md).

For more information about SDK compatibility with specific hardware devices, see the [Azure Certified for IoT device catalog](https://catalog.azureiotsuite.com/) or individual repository.

## Azure IoT service SDKs

The Azure IoT service SDKs contain code to facilitate building applications that interact directly with IoT Hub to manage devices and security.

Azure IoT Hub service SDK for .NET:

* Download from [Nuget](https://www.nuget.org/packages/Microsoft.Azure.Devices/)
* [Source code](https://github.com/Azure/azure-iot-sdk-csharp)
* [API reference](https://docs.microsoft.com/dotnet/api/microsoft.azure.devices)

Azure IoT Hub service SDK for Java: 

* Add to [Maven](https://github.com/Azure/azure-iot-sdk-java/blob/master/doc/java-devbox-setup.md#for-the-service-sdk
) project
* [Source code](https://github.com/Azure/azure-iot-sdk-java)
* [API reference](https://docs.microsoft.com/java/api/com.microsoft.azure.sdk.iot.service)

Azure IoT Hub service SDK for Node.js: 

* Download from [npm](https://www.npmjs.com/package/azure-iothub)
* [Source code](https://github.com/Azure/azure-iot-sdk-node)
* [API reference](https://docs.microsoft.com/javascript/api/azure-iothub/?view=azure-iot-typescript-latest)

Azure IoT Hub service SDK for Python: 

* Download from [pip](https://pypi.python.org/pypi/azure-iothub-service-client/)
* [Source code](https://github.com/Azure/azure-iot-sdk-python)

Azure IoT Hub service SDK for C: 

* Download from [apt-get, MBED, Arduino IDE, or Nuget](https://github.com/Azure/azure-iot-sdk-c/blob/master/readme.md)
* [Source code](https://github.com/Azure/azure-iot-sdk-c)

Azure IoT Hub service SDK for iOS: 

* Install from [CocoaPod](https://cocoapods.org/pods/AzureIoTHubServiceClient)
* [Samples](https://github.com/Azure-Samples/azure-iot-samples-ios)

> [!NOTE]
> See the readme files in the GitHub repositories for information about using language and platform-specific package managers to install binaries and dependencies on your development machine.

## Device provisioning SDKs

The **Microsoft Azure Provisioning SDKs** enable you to provision devices to your IoT Hub using the [Device Provisioning Service](../iot-dps/about-iot-dps.md).

Azure Provisioning device and service SDKs for C#:

* [Provisioning device client SDK](https://github.com/Azure/azure-iot-sdk-csharp/blob/master/provisioning/device)
* [Provisioning service client SDK](https://github.com/Azure/azure-iot-sdk-csharp/blob/master/provisioning/service)

Azure Provisioning device and service SDKs for Java:

* [Provisioning device client SDK](https://github.com/Azure/azure-iot-sdk-java/blob/master/provisioning/provisioning-device-client)
* [Provisioning service client SDK](https://github.com/Azure/azure-iot-sdk-java/blob/master/provisioning/provisioning-service-client)

Azure Provisioning device and service SDKs for Node.js:

* [Provisioning device client SDK](https://github.com/Azure/azure-iot-sdk-node/tree/master/provisioning/device)
* [Provisioning service client SDK](https://github.com/Azure/azure-iot-sdk-node/tree/master/provisioning/service)

Azure Provisioning device and service SDKs for Python:

* [Provisioning device client SDK](https://github.com/Azure/azure-iot-sdk-python/blob/master/provisioning_device_client)
* [Provisioning service client SDK](https://github.com/Azure/azure-iot-sdk-python/tree/master/provisioning_service_client)

Azure Provisioning device and service SDKs for C:

* [Provisioning device client SDK](https://github.com/Azure/azure-iot-sdk-c/blob/master/provisioning_client)
* [Provisioning service client SDK](https://github.com/Azure/azure-iot-sdk-c/blob/master/provisioning_service_client)

## Next steps

Azure IoT SDKs also provide a set of tools to help with development:
* [iothub-diagnostics](https://github.com/Azure/iothub-diagnostics): a cross-platform command line tool to help diagnose issues related to connection with IoT Hub.
* [device-explorer](https://github.com/Azure/azure-iot-sdk-csharp/tree/master/tools/DeviceExplorer): a Windows desktop application to connect to your IoT Hub.

Other reference topics in this IoT Hub developer guide include:

* [IoT Hub endpoints](iot-hub-devguide-endpoints.md)
* [IoT Hub query language for device twins, jobs, and message routing](iot-hub-devguide-query-language.md)
* [Quotas and throttling](iot-hub-devguide-quotas-throttling.md)
* [IoT Hub MQTT support](iot-hub-mqtt-support.md)
* [IoT Hub REST API reference](/rest/api/iothub/)
* [Auzre IoT SDK platform support](iot-hub-device-sdk-platform-support.md)