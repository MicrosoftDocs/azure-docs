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

There are three categories of software development kits (SDKs) for working with IoT Hub:

* [**IoT Hub device SDKs**](#azure-iot-hub-device-sdks) enable you to build apps that run on your IoT devices using device client or module client. These apps send telemetry to your IoT hub, and optionally receive messages, job, method, or twin updates from your IoT hub. You can use these SDKs to build device apps that use [Azure IoT Plug and Play](../iot-develop/overview-iot-plug-and-play.md) conventions and models to advertise their capabilities to IoT Plug and Play-enabled applications. You can also use module client to author [modules](../iot-edge/iot-edge-modules.md) for [Azure IoT Edge runtime](../iot-edge/about-iot-edge.md).

* [**IoT Hub service SDKs**](#azure-iot-hub-service-sdks) enable you to build backend applications to manage your IoT hub, and optionally send messages, schedule jobs, invoke direct methods, or send desired property updates to your IoT devices or modules.

* [**IoT Hub management SDKs**](#azure-iot-hub-management-sdks) help you build backend applications that manage the IoT hubs in your Azure subscription.

Microsoft also provides a set of SDKs for provisioning devices through and building backend services for the [Device Provisioning Service](../iot-dps/about-iot-dps.md). To learn more, see [Microsoft SDKs for IoT Hub Device Provisioning Service](../iot-dps/libraries-sdks.md).

Learn about the [benefits of developing using Azure IoT SDKs](https://azure.microsoft.com/blog/benefits-of-using-the-azure-iot-sdks-in-your-azure-iot-solution/).

## Azure IoT Hub device SDKs

The Microsoft Azure IoT device SDKs contain code that facilitates building applications that connect to and are managed by Azure IoT Hub services. These SDKs can run on a general MPU-based computing device such as a PC, tablet, smartphone, or Raspberry Pi. The SDKs support development in C and in modern managed languages including in C#, Node.JS, Python, and Java.

The SDKs are available in **multiple languages** providing the flexibility to choose which best suits your team and scenario.

| Language | Package | Source | Quickstarts | Samples | Reference |
| :-- | :-- | :-- | :-- | :-- | :-- |
| **.NET** | [NuGet](https://www.nuget.org/packages/Microsoft.Azure.Devices.Client) | [GitHub](https://github.com/Azure/azure-iot-sdk-csharp) | [Quickstart](../iot-develop/quickstart-send-telemetry-iot-hub.md?pivots=programming-language-csharp) | [Samples](https://github.com/Azure-Samples/azure-iot-samples-csharp) | [Reference](/dotnet/api/microsoft.azure.devices.client) |
| **Python** | [pip](https://pypi.org/project/azure-iot-device/) | [GitHub](https://github.com/Azure/azure-iot-sdk-python) | [Quickstart](../iot-develop/quickstart-send-telemetry-iot-hub.md?pivots=programming-language-python) | [Samples](https://github.com/Azure/azure-iot-sdk-python/tree/main/samples) | [Reference](/python/api/azure-iot-device) |
| **Node.js** | [npm](https://www.npmjs.com/package/azure-iot-device) | [GitHub](https://github.com/Azure/azure-iot-sdk-node) | [Quickstart](../iot-develop/quickstart-send-telemetry-iot-hub.md?pivots=programming-language-nodejs) | [Samples](https://github.com/Azure/azure-iot-sdk-node/tree/main/device/samples) | [Reference](/javascript/api/azure-iot-device/) |
| **Java** | [Maven](https://mvnrepository.com/artifact/com.microsoft.azure.sdk.iot/iot-device-client) | [GitHub](https://github.com/Azure/azure-iot-sdk-java) | [Quickstart](../iot-develop/quickstart-send-telemetry-iot-hub.md?pivots=programming-language-java) | [Samples](https://github.com/Azure/azure-iot-sdk-java/tree/master/device/iot-device-samples) | [Reference](/java/api/com.microsoft.azure.sdk.iot.device) |
| **C** | [packages](https://github.com/Azure/azure-iot-sdk-c/blob/master/readme.md#getting-the-sdk) | [GitHub](https://github.com/Azure/azure-iot-sdk-c) | [Quickstart](../iot-develop/quickstart-send-telemetry-iot-hub.md?pivots=programming-language-ansi-c) | [Samples](https://github.com/Azure/azure-iot-sdk-c/tree/master/iothub_client/samples) | [Reference](/azure/iot-hub/iot-c-sdk-ref/) |

> [!WARNING]
> The **C SDK** listed above is **not** suitable for embedded applications due to its memory management and threading model. For embedded devices, refer to the [Embedded device SDKs](#embedded-device-sdks).

### Embedded device SDKs

These SDKs were designed and created to run on devices with limited compute and memory resources and are implemented using the C language.

The embedded device SDKs are available for **multiple operating systems** providing the flexibility to choose which best suits your team and scenario.

| RTOS | SDK | Source | Samples | Reference |
| :-- | :-- | :-- | :-- | :-- |
| **Azure RTOS** | Azure RTOS Middleware | [GitHub](https://github.com/azure-rtos/netxduo) | [Quickstarts](../iot-develop/quickstart-devkit-mxchip-az3166.md) | [Reference](https://github.com/azure-rtos/netxduo/tree/master/addons/azure_iot) |
| **FreeRTOS** | FreeRTOS Middleware | [GitHub](https://github.com/Azure/azure-iot-middleware-freertos) | [Samples](https://github.com/Azure-Samples/iot-middleware-freertos-samples) | [Reference](https://azure.github.io/azure-iot-middleware-freertos) |
| **Bare Metal** | Azure SDK for Embedded C | [GitHub](https://github.com/Azure/azure-sdk-for-c/tree/master/sdk/docs/iot) | [Samples](https://github.com/Azure/azure-sdk-for-c/blob/master/sdk/samples/iot/README.md) | [Reference](https://azure.github.io/azure-sdk-for-c) |

Learn more about the IoT Hub device SDKS in the [IoT Device Development Documentation](../iot-develop/about-iot-sdks.md).

## Azure IoT Hub service SDKs

The Azure IoT service SDKs contain code to facilitate building applications that interact directly with IoT Hub to manage devices and security.

| Platform  | Package | Code Repository | Samples |  Reference |
|---|---|---|---|---|
| .NET | [NuGet](https://www.nuget.org/packages/Microsoft.Azure.Devices ) | [GitHub](https://github.com/Azure/azure-iot-sdk-csharp) | [Samples](https://github.com/Azure-Samples/azure-iot-samples-csharp) | [Reference](/dotnet/api/microsoft.azure.devices) |
| Java | [Maven](https://mvnrepository.com/artifact/com.microsoft.azure.sdk.iot/iot-service-client) | [GitHub](https://github.com/Azure/azure-iot-sdk-java) | [Samples](https://github.com/Azure/azure-iot-sdk-java/tree/main/service/iot-service-samples/pnp-service-sample) | [Reference](/java/api/com.microsoft.azure.sdk.iot.service) |
| Node | [npm](https://www.npmjs.com/package/azure-iothub) | [GitHub](https://github.com/Azure/azure-iot-sdk-node) | [Samples](https://github.com/Azure/azure-iot-sdk-node/tree/main/service/samples) | [Reference](/javascript/api/azure-iothub/) |
| Python | [pip](https://pypi.org/project/azure-iot-hub) | [GitHub](https://github.com/Azure/azure-iot-hub-python) | [Samples](https://github.com/Azure/azure-iot-hub-python/tree/main/samples) | [Reference](/python/api/azure-iot-hub) |

## Azure IoT Hub management SDKs

The Iot Hub management SDKs help you build backend applications that manage the IoT hubs in your Azure subscription.

| Platform | Package | Code repository | Reference |
| -----|-----|-----|-----|
| .NET|[NuGet](https://www.nuget.org/packages/Microsoft.Azure.Management.IotHub) |[GitHub](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/iothub)| [Reference](/dotnet/api/microsoft.azure.management.iothub) |
| Java|[Maven](https://mvnrepository.com/artifact/com.azure.resourcemanager/azure-resourcemanager-iothub) |[GitHub](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/iothub/azure-resourcemanager-iothub)| [Reference](/java/api/overview/azure/resourcemanager-iothub-readme) |
| Node.js|[npm](https://www.npmjs.com/package/@azure/arm-iothub)|[GitHub](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/iothub/arm-iothub)|[Reference](/javascript/api/overview/azure/arm-iothub-readme) |
| Python|[pip](https://pypi.org/project/azure-mgmt-iothub/) |[GitHub](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/iothub/azure-mgmt-iothub)|[Reference](/python/api/azure-mgmt-iothub) |

## SDK and hardware compatibility

For more information about device SDK compatibility with specific hardware devices, see the [Azure Certified for IoT device catalog](https://devicecatalog.azure.com/) or individual repository.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-partial.md)]

## SDKs for related Azure IoT services

Azure IoT SDKs are also available for the following services:

* [Microsoft SDKs for IoT Hub Device Provisioning Service](../iot-dps/libraries-sdks.md): To help you provision devices through and build backend services for the Device Provisioning Service.

* [Device Update for IoT Hub SDKs](../iot-hub-device-update/understand-device-update.md): To help you deploy over-the-air (OTA) updates for IoT devices.

* [IoT Plug and Play SDKs](../iot-develop/libraries-sdks.md): To help you build IoT Plug and Play solutions.

## Next steps

* Learn how to [manage connectivity and reliable messaging](iot-hub-reliability-features-in-sdks.md) using the IoT Hub SDKs.
* Learn how to [develop for mobile platforms](iot-hub-how-to-develop-for-mobile-devices.md) such as iOS and Android.
* Learn how to [develop without an SDK](iot-hub-devguide-no-sdk.md).
