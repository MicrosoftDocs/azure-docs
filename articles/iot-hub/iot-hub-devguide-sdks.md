---
title: Azure IoT Hub SDKs | Microsoft Docs
description: Links to the Azure IoT Hub SDKs which you can use to build device apps and back-end apps.
author: wesmc7777
manager: philmea
ms.author: wesmc
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 06/01/2021
ms.custom: [mqtt, 'Role: IoT Device', 'Role: Cloud Development']
---

# Azure IoT Hub SDKs

There are two categories of software development kits (SDKs) for working with IoT Hub:

* [**IoT Hub Service SDKs**](#azure-iot-hub-service-sdks) enable you to build backend applications to manage your IoT hub, and optionally send messages, schedule jobs, invoke direct methods, or send desired property updates to your IoT devices or modules.

* [**IoT Hub Device SDKs**](../iot-develop/about-iot-sdks.md) enable you to build apps that run on your IoT devices using device client or module client. These apps send telemetry to your IoT hub, and optionally receive messages, job, method, or twin updates from your IoT hub. You can use these SDKs to build device apps that use [Azure IoT Plug and Play](../iot-develop/overview-iot-plug-and-play.md) conventions and models to advertise their capabilities to IoT Plug and Play-enabled applications. You can also use module client to author [modules](../iot-edge/iot-edge-modules.md) for [Azure IoT Edge runtime](../iot-edge/about-iot-edge.md).

In addition, we also provide a set of SDKs for working with the [Device Provisioning Service](../iot-dps/about-iot-dps.md).

* **Provisioning Device SDKs** enable you to build apps that run on your IoT devices to communicate with the Device Provisioning Service.

* **Provisioning Service SDKs** enable you to build backend applications to manage your enrollments in the Device Provisioning Service.

Learn about the [benefits of developing using Azure IoT SDKs](https://azure.microsoft.com/blog/benefits-of-using-the-azure-iot-sdks-in-your-azure-iot-solution/).

## Azure IoT Hub Service SDKs

The Azure IoT service SDKs contain code to facilitate building applications that interact directly with IoT Hub to manage devices and security.

| Platform  | Package | Code Repository | Samples |  Reference |
|---|---|---|---|---|
| .NET | [NuGet](https://www.nuget.org/packages/Microsoft.Azure.Devices ) | [GitHub](https://github.com/Azure/azure-iot-sdk-csharp) | [Samples](https://github.com/Azure-Samples/azure-iot-samples-csharp) | [Reference](/dotnet/api/microsoft.azure.devices) |
| Java | [Maven](https://mvnrepository.com/artifact/com.microsoft.azure.sdk.iot/iot-service-client) | [GitHub](https://github.com/Azure/azure-iot-sdk-java) | [Samples](https://github.com/Azure/azure-iot-sdk-java/tree/master/service/iot-service-samples/pnp-service-sample) | [Reference](/java/api/com.microsoft.azure.sdk.iot.service) |
| Node | [npm](https://www.npmjs.com/package/azure-iothub) | [GitHub](https://github.com/Azure/azure-iot-sdk-node) | [Samples](https://github.com/Azure/azure-iot-sdk-node/tree/master/service/samples) | [Reference](/javascript/api/azure-iothub/) |
| Python | [pip](https://pypi.org/project/azure-iot-hub) | [GitHub](https://github.com/Azure/azure-iot-sdk-python) | [Samples](https://github.com/Azure/azure-iot-sdk-python/tree/master/azure-iot-hub/samples) | [Reference](/python/api/azure-iot-hub) |
| Node.js | [npm](https://www.npmjs.com/package/azure-iot-common) | [GitHub](https://github.com/Azure/azure-iot-sdk-node) | [Samples](https://github.com/Azure/azure-iot-sdk-node/tree/master/service/samples/javascript) | [Reference](/javascript/api/azure-iothub/) |

Azure IoT Hub service SDK for iOS:

* Install from [CocoaPod](https://cocoapods.org/pods/AzureIoTHubServiceClient)
* [Samples](https://github.com/Azure-Samples/azure-iot-samples-ios)

## Microsoft Azure Provisioning SDKs

The **Microsoft Azure Provisioning SDKs** enable you to provision devices to your IoT Hub using the [Device Provisioning Service](../iot-dps/about-iot-dps.md).

| Platform | Package | Source code | Reference |
| -----|-----|-----|-----|
| .NET|[Device SDK](https://www.nuget.org/packages/Microsoft.Azure.Devices.Provisioning.Client/), [Service SDK](https://www.nuget.org/packages/Microsoft.Azure.Devices.Provisioning.Service/) |[GitHub](https://github.com/Azure/azure-iot-sdk-csharp/)|[Reference](/dotnet/api/microsoft.azure.devices.provisioning.client) |
| C|[apt-get, MBED, Arduino IDE or iOS](https://github.com/Azure/azure-iot-sdk-c/blob/master/readme.md#packages-and-libraries)|[GitHub](https://github.com/Azure/azure-iot-sdk-c/blob/master/provisioning\_client)|[Reference](/azure/iot-hub/iot-c-sdk-ref/) |
| Java|[Maven](https://github.com/Azure/azure-iot-sdk-java/blob/master/doc/java-devbox-setup.md#for-the-service-sdk)|[GitHub](https://github.com/Azure/azure-iot-sdk-java/blob/master/provisioning)|[Reference](/java/api/com.microsoft.azure.sdk.iot.provisioning.device) |
| Node.js|[Device SDK](https://badge.fury.io/js/azure-iot-provisioning-device), [Service SDK](https://badge.fury.io/js/azure-iot-provisioning-service) |[GitHub](https://github.com/Azure/azure-iot-sdk-node/tree/master/provisioning)|[Reference](/javascript/api/overview/azure/iothubdeviceprovisioning) |
| Python|[Device SDK](https://pypi.org/project/azure-iot-device/), [Service SDK](https://pypi.org/project/azure-iothub-provisioningserviceclient/)|[GitHub](https://github.com/Azure/azure-iot-sdk-python)|[Device Reference](/python/api/azure-iot-device/azure.iot.device.provisioningdeviceclient), [Service Reference](/python/api/azure-mgmt-iothubprovisioningservices) |

## Azure IoT Hub Device SDKs

The Microsoft Azure IoT device SDKs contain code that facilitates building applications that connect to and are managed by Azure IoT Hub services.

Learn more about the IoT Hub Device SDKS in the [IoT Device Development Documentation](../iot-develop/about-iot-sdks.md).

## SDK and hardware compatibility

For more information about choosing a device SDK, see [Overview of Azure IoT Device SDKs](../iot-develop/about-iot-sdks.md).

For more information about SDK compatibility with specific hardware devices, see the [Azure Certified for IoT device catalog](https://devicecatalog.azure.com/) or individual repository.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-partial.md)]

## Next steps

Relevant docs related to development using the Azure IoT SDKs:

* Learn about [how to manage connectivity and reliable messaging](iot-hub-reliability-features-in-sdks.md) using the IoT Hub SDKs.
* Learn about how to [develop for mobile platforms](iot-hub-how-to-develop-for-mobile-devices.md) such as iOS and Android.
* [IoT Device Development Documentation](../iot-develop/about-iot-sdks.md)

Other reference topics in this IoT Hub developer guide include:

* [IoT Hub endpoints](iot-hub-devguide-endpoints.md)
* [IoT Hub query language for device twins, jobs, and message routing](iot-hub-devguide-query-language.md)
* [Quotas and throttling](iot-hub-devguide-quotas-throttling.md)
* [IoT Hub MQTT support](iot-hub-mqtt-support.md)
* [IoT Hub REST API reference](/rest/api/iothub/)
