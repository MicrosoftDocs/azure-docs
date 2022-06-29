---
title: Azure IoT Hub SDKs | Microsoft Docs
description: Links to the Azure IoT Hub SDKs which you can use to build device apps and back-end apps.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 06/01/2021
ms.custom: [mqtt, 'Role: IoT Device', 'Role: Cloud Development']
---

# Azure IoT Hub SDKs

There are two categories of software development kits (SDKs) for working with IoT Hub:

* [**IoT Hub service SDKs**](#azure-iot-hub-service-sdks) enable you to build backend applications to manage your IoT hub, and optionally send messages, schedule jobs, invoke direct methods, or send desired property updates to your IoT devices or modules.

* [**IoT Hub device SDKs**](../iot-develop/about-iot-sdks.md) enable you to build apps that run on your IoT devices using device client or module client. These apps send telemetry to your IoT hub, and optionally receive messages, job, method, or twin updates from your IoT hub. You can use these SDKs to build device apps that use [Azure IoT Plug and Play](../iot-develop/overview-iot-plug-and-play.md) conventions and models to advertise their capabilities to IoT Plug and Play-enabled applications. You can also use module client to author [modules](../iot-edge/iot-edge-modules.md) for [Azure IoT Edge runtime](../iot-edge/about-iot-edge.md).

In addition, we also provide a set of SDKs for working with the [Device Provisioning Service](../iot-dps/about-iot-dps.md).

* **Provisioning device SDKs** enable you to build apps that run on your IoT devices to communicate with the Device Provisioning Service.

* **Provisioning service SDKs** enable you to build backend applications to manage your enrollments in the Device Provisioning Service.

Learn about the [benefits of developing using Azure IoT SDKs](https://azure.microsoft.com/blog/benefits-of-using-the-azure-iot-sdks-in-your-azure-iot-solution/).

## Azure IoT Hub service SDKs

The Azure IoT service SDKs contain code to facilitate building applications that interact directly with IoT Hub to manage devices and security.

| Platform  | Package | Code Repository | Samples |  Reference |
|---|---|---|---|---|
| .NET | [NuGet](https://www.nuget.org/packages/Microsoft.Azure.Devices ) | [GitHub](https://github.com/Azure/azure-iot-sdk-csharp) | [Samples](https://github.com/Azure-Samples/azure-iot-samples-csharp) | [Reference](/dotnet/api/microsoft.azure.devices) |
| Java | [Maven](https://mvnrepository.com/artifact/com.microsoft.azure.sdk.iot/iot-service-client) | [GitHub](https://github.com/Azure/azure-iot-sdk-java) | [Samples](https://github.com/Azure/azure-iot-sdk-java/tree/main/service/iot-service-samples/pnp-service-sample) | [Reference](/java/api/com.microsoft.azure.sdk.iot.service) |
| Node | [npm](https://www.npmjs.com/package/azure-iothub) | [GitHub](https://github.com/Azure/azure-iot-sdk-node) | [Samples](https://github.com/Azure/azure-iot-sdk-node/tree/main/service/samples) | [Reference](/javascript/api/azure-iothub/) |
| Python | [pip](https://pypi.org/project/azure-iot-hub) | [GitHub](https://github.com/Azure/azure-iot-sdk-python) | [Samples](https://github.com/Azure/azure-iot-sdk-python/tree/main/azure-iot-hub/samples) | [Reference](/python/api/azure-iot-hub) |

## Microsoft Azure provisioning SDKs

The **Microsoft Azure provisioning SDKs** enable you to provision devices to your IoT Hub using the [Device Provisioning Service](../iot-dps/about-iot-dps.md). To learn more about the provisioning SDKs, see [Microsoft SDKs for Device Provisioning Service](../iot-dps/libraries-sdks.md).

## Azure IoT Hub device SDKs

The Microsoft Azure IoT device SDKs contain code that facilitates building applications that connect to and are managed by Azure IoT Hub services.

Learn more about the IoT Hub device SDKS in the [IoT Device Development Documentation](../iot-develop/about-iot-sdks.md).

## SDK and hardware compatibility

For more information about SDK compatibility with specific hardware devices, see the [Azure Certified for IoT device catalog](https://devicecatalog.azure.com/) or individual repository.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-partial.md)]

## Next steps

* Learn how to [manage connectivity and reliable messaging](iot-hub-reliability-features-in-sdks.md) using the IoT Hub SDKs.
* Learn how to [develop for mobile platforms](iot-hub-how-to-develop-for-mobile-devices.md) such as iOS and Android.
* Learn how to [develop without an SDK](iot-hub-devguide-no-sdk.md).
