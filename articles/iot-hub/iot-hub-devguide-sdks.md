---
title: Understand the Azure IoT SDKs | Microsoft Docs
description: Developer guide - information about and links to the various Azure IoT device and service SDKs that you can use to build device apps and back-end apps.
author: wesmc7777
manager: philmea
ms.author: wesmc
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 01/14/2020
ms.custom: mqtt
---

# Understand and use Azure IoT Hub SDKs

There are two categories of software development kits (SDKs) for working with IoT Hub:

* **IoT Hub Device SDKs** enable you to build apps that run on your IoT devices using device client or module client. These apps send telemetry to your IoT hub, and optionally receive messages, job, method, or twin updates from your IoT hub.  You can also use module client to author [modules](../iot-edge/iot-edge-modules.md) for [Azure IoT Edge runtime](../iot-edge/about-iot-edge.md).

* **IoT Hub Service SDKs** enable you to build backend applications to manage your IoT hub, and optionally send messages, schedule jobs, invoke direct methods, or send desired property updates to your IoT devices or modules.

In addition, we also provide a set of SDKs for working with the [Device Provisioning Service](../iot-dps/about-iot-dps.md).
* **Provisioning Device SDKs** enable you to build apps that run on your IoT devices to communicate with the Device Provisioning Service.

* **Provisioning Service SDKs** enable you to build backend applications to manage your enrollments in the Device Provisioning Service.

Learn about the [benefits of developing using Azure IoT SDKs](https://azure.microsoft.com/blog/benefits-of-using-the-azure-iot-sdks-in-your-azure-iot-solution/).

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-partial.md)]


### OS platform and hardware compatibility

Supported platforms for the SDKs can be found in [Azure IoT SDKs Platform Support](iot-hub-device-sdk-platform-support.md).

For more information about SDK compatibility with specific hardware devices, see the [Azure Certified for IoT device catalog](https://catalog.azureiotsolutions.com/) or individual repository.

## Azure IoT Hub Device SDKs

The Microsoft Azure IoT device SDKs contain code that facilitates building applications that connect to and are managed by Azure IoT Hub services.

Azure IoT Hub device SDK for .NET: 

* Download from [NuGet](https://www.nuget.org/packages/Microsoft.Azure.Devices.Client/).  The namespace is Microsoft.Azure.Devices.Clients, which contains IoT Hub Device Clients (DeviceClient, ModuleClient).
* [Source code](https://github.com/Azure/azure-iot-sdk-csharp)
* [API reference](https://docs.microsoft.com/dotnet/api/microsoft.azure.devices?view=azure-dotnet)
* [Module reference](https://docs.microsoft.com/dotnet/api/microsoft.azure.devices.client.moduleclient?view=azure-dotnet)

Azure IoT Hub device SDK for C (ANSI C - C99):

* Install from [apt-get, MBED, Arduino IDE or iOS](https://github.com/Azure/azure-iot-sdk-c/blob/master/readme.md#packages-and-libraries)
* [Source code](https://github.com/Azure/azure-iot-sdk-c)
* [Compile the C Device SDK](https://github.com/Azure/azure-iot-sdk-c/blob/master/iothub_client/readme.md#compiling-the-c-device-sdk)
* [API reference](https://docs.microsoft.com/azure/iot-hub/iot-c-sdk-ref/)
* [Module reference](https://docs.microsoft.com/azure/iot-hub/iot-c-sdk-ref/iothub-module-client-h)
* [Porting the C SDK to other platforms](https://github.com/Azure/azure-c-shared-utility/blob/master/devdoc/porting_guide.md)
* [Developer documentation](https://github.com/Azure/azure-iot-sdk-c/tree/master/doc) for information on cross-compiling, getting started on different platforms, etc.
* [Azure IoT Hub C SDK resource consumption information](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/c_sdk_resource_information.md)

Azure IoT Hub device SDK for Java: 

* Add to [Maven](https://github.com/Azure/azure-iot-sdk-java/blob/master/doc/java-devbox-setup.md#for-the-device-sdk) project
* [Source code](https://github.com/Azure/azure-iot-sdk-java)
* [API reference](https://docs.microsoft.com/java/api/com.microsoft.azure.sdk.iot.device)
* [Module reference](https://docs.microsoft.com/java/api/com.microsoft.azure.sdk.iot.device.moduleclient?view=azure-java-stable)

Azure IoT Hub device SDK for Node.js: 

* Install from [npm](https://www.npmjs.com/package/azure-iot-device)
* [Source code](https://github.com/Azure/azure-iot-sdk-node)
* [API reference](https://docs.microsoft.com/javascript/api/azure-iot-device/?view=azure-iot-typescript-latest)
* [Module reference](https://docs.microsoft.com/javascript/api/azure-iot-device/moduleclient?view=azure-node-latest)

Azure IoT Hub device SDK for Python: 

* Install from [pip](https://pypi.org/project/azure-iot-device/)
* [Source code](https://github.com/Azure/azure-iot-sdk-python)
* [API reference](https://docs.microsoft.com/python/api/azure-iot-device)

Azure IoT Hub device SDK for iOS: 

* Install from [CocoaPod](https://cocoapods.org/pods/AzureIoTHubClient)
* [Samples](https://github.com/Azure-Samples/azure-iot-samples-ios)
* API reference: see [C API reference](https://docs.microsoft.com/azure/iot-hub/iot-c-sdk-ref/)

## Azure IoT Hub Service SDKs

The Azure IoT service SDKs contain code to facilitate building applications that interact directly with IoT Hub to manage devices and security.

Azure IoT Hub service SDK for .NET:

* Download from [NuGet](https://www.nuget.org/packages/Microsoft.Azure.Devices/).  The namespace is Microsoft.Azure.Devices, which contains IoT Hub Service Clients (RegistryManager, ServiceClients).
* [Source code](https://github.com/Azure/azure-iot-sdk-csharp)
* [API reference](https://docs.microsoft.com/dotnet/api/microsoft.azure.devices)

Azure IoT Hub service SDK for Java: 

* Add to [Maven](https://github.com/Azure/azure-iot-sdk-java/blob/master/doc/java-devbox-setup.md#for-the-service-sdk) project
* [Source code](https://github.com/Azure/azure-iot-sdk-java)
* [API reference](https://docs.microsoft.com/java/api/com.microsoft.azure.sdk.iot.service)

Azure IoT Hub service SDK for Node.js: 

* Download from [npm](https://www.npmjs.com/package/azure-iothub)
* [Source code](https://github.com/Azure/azure-iot-sdk-node)
* [API reference](https://docs.microsoft.com/javascript/api/azure-iothub/?view=azure-iot-typescript-latest)

Azure IoT Hub service SDK for Python: 

* Download from [pip](https://pypi.python.org/pypi/azure-iot-hub/)
* [Source code](https://github.com/Azure/azure-iot-sdk-python/tree/master)

Azure IoT Hub service SDK for C: 

The Azure IoT Service SDK for C is no longer under active development.
We will continue to fix critical bugs such as crashes, data corruption, and security vulnerabilities. We will NOT add any new feature or fix bugs that are not critical, however.

Azure IoT Service SDK support is available in higher-level languages ([C#](https://github.com/Azure/azure-iot-sdk-csharp), [Java](https://github.com/Azure/azure-iot-sdk-java), [Node](https://github.com/Azure/azure-iot-sdk-node), [Python](https://github.com/Azure/azure-iot-sdk-python)).

* Download from [apt-get, MBED, Arduino IDE, or NuGet](https://github.com/Azure/azure-iot-sdk-c/blob/master/readme.md)
* [Source code](https://github.com/Azure/azure-iot-sdk-c)

Azure IoT Hub service SDK for iOS: 

* Install from [CocoaPod](https://cocoapods.org/pods/AzureIoTHubServiceClient)
* [Samples](https://github.com/Azure-Samples/azure-iot-samples-ios)

> [!NOTE]
> See the readme files in the GitHub repositories for information about using language and platform-specific package managers to install binaries and dependencies on your development machine.

## Microsoft Azure Provisioning SDKs

The **Microsoft Azure Provisioning SDKs** enable you to provision devices to your IoT Hub using the [Device Provisioning Service](../iot-dps/about-iot-dps.md).

Azure Provisioning device and service SDKs for C#:

* Download from [Device SDK](https://www.nuget.org/packages/Microsoft.Azure.Devices.Provisioning.Client/) and [Service SDK](https://www.nuget.org/packages/Microsoft.Azure.Devices.Provisioning.Service/) from NuGet.
* [Source code](https://github.com/Azure/azure-iot-sdk-csharp/)
* [API reference](https://docs.microsoft.com/dotnet/api/microsoft.azure.devices.provisioning.client?view=azure-dotnet)

Azure Provisioning device and service SDKs for C:

* Install from [apt-get, MBED, Arduino IDE or iOS](https://github.com/Azure/azure-iot-sdk-c/blob/master/readme.md#packages-and-libraries)
* [Source code](https://github.com/Azure/azure-iot-sdk-c/blob/master/provisioning_client)
* [API reference](https://docs.microsoft.com/azure/iot-hub/iot-c-sdk-ref/)

Azure Provisioning device and service SDKs for Java:

* Add to [Maven](https://github.com/Azure/azure-iot-sdk-java/blob/master/doc/java-devbox-setup.md#for-the-service-sdk) project
* [Source code](https://github.com/Azure/azure-iot-sdk-java/blob/master/provisioning)
* [API reference](https://docs.microsoft.com/java/api/com.microsoft.azure.sdk.iot.provisioning.device?view=azure-java-stable)

Azure Provisioning device and service SDKs for Node.js:

* [Source code](https://github.com/Azure/azure-iot-sdk-node/tree/master/provisioning)
* [API reference](https://docs.microsoft.com/javascript/api/overview/azure/iothubdeviceprovisioning?view=azure-node-latest)
* Download [Device SDK](https://badge.fury.io/js/azure-iot-provisioning-device) and [Service SDK](https://badge.fury.io/js/azure-iot-provisioning-service) from npm

Azure Provisioning device and service SDKs for Python:

* [Source code](https://github.com/Azure/azure-iot-sdk-python)
* Download [Device SDK](https://pypi.org/project/azure-iot-device/) and [Service SDK](https://pypi.org/project/azure-iothub-provisioningserviceclient/) from pip

## Next steps

Azure IoT SDKs also provide a set of tools to help with development:
* [iothub-diagnostics](https://github.com/Azure/iothub-diagnostics): a cross-platform command line tool to help diagnose issues related to connection with IoT Hub.
* [azure-iot-explorer](https://github.com/Azure/azure-iot-explorer): a cross-platform desktop application to connect to your IoT Hub and add/manage/communicate with IoT devices.

Relevant docs related to development using the Azure IoT SDKs:
* Learn about [how to manage connectivity and reliable messaging](iot-hub-reliability-features-in-sdks.md) using the IoT Hub SDKs.
* Learn about how to [develop for mobile platforms](iot-hub-how-to-develop-for-mobile-devices.md) such as iOS and Android.
* [Azure IoT SDK platform support](iot-hub-device-sdk-platform-support.md)


Other reference topics in this IoT Hub developer guide include:

* [IoT Hub endpoints](iot-hub-devguide-endpoints.md)
* [IoT Hub query language for device twins, jobs, and message routing](iot-hub-devguide-query-language.md)
* [Quotas and throttling](iot-hub-devguide-quotas-throttling.md)
* [IoT Hub MQTT support](iot-hub-mqtt-support.md)
* [IoT Hub REST API reference](/rest/api/iothub/)
