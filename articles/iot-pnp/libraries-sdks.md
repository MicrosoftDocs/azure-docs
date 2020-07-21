---
title: IoT Plug and Play libraries and SDKs
description: Information about the device and service libraries available for developing IoT Plug and Play enabled solutions.
author: dominicbetts
ms.author: dobett
ms.date: 01/08/2020
ms.topic: reference
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc
---

# IoT Plug and Play libraries and SDKs

The IoT Plug and Play libraries and SDKs enable developers to build IoT solutions using a variety of programming languages on multiple platforms. The following table includes links to samples and quickstarts to help you get started:

## Microsoft-supported libraries and SDKs for IoT Plug and Play

**Device libraries and SDKs**

| Language | Package | Code Repository | Samples | Quickstart | Reference |
|---|---|---|---|---|---|
| C - Device | [vcpkg](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/setting_up_vcpkg.md) | [GitHub](https://github.com/Azure/azure-iot-sdk-c/releases/tag/2020-07-19) | [Samples](https://github.com/Azure/azure-iot-sdk-c/tree/2020-07-19/iothub_client/samples/pnp) | [Connect to IoT Hub](quickstart-connect-device-c.md) | [Reference](https://docs.microsoft.com/azure/iot-hub/iot-c-sdk-ref/) |
| C# - Device | [1.27.0](https://www.nuget.org/packages/Microsoft.Azure.Devices.Client/1.27.0) | [GitHub](https://github.com/Azure/azure-iot-sdk-csharp/tree/master/) | [Samples](https://github.com/Azure/azure-iot-sdk-csharp/tree/master/iothub/device/samples/PnpDeviceSamples) | [Connect to IoT Hub](quickstart-connect-device-csharp.md) | [Reference](https://docs.microsoft.com/dotnet/api/microsoft.azure.devices.client?view=azure-dotnet) |
| Java - Device | [1.24.0](https://mvnrepository.com/artifact/com.microsoft.azure.sdk.iot/iot-device-client/1.24.0) | [GitHub](https://github.com/Azure/azure-iot-sdk-java/tree/master/) | [Samples](https://github.com/Azure/azure-iot-sdk-java/tree/master/device/iot-device-samples/pnp-device-sample) | [Connect to IoT Hub](quickstart-connect-device-java.md) | [Reference](https://docs.microsoft.com/java/api/com.microsoft.azure.sdk.iot.device?view=azure-java-stable) |
| Python - Device | [2.1.4](https://pypi.org/project/azure-iot-device/) | [GitHub](https://github.com/Azure/azure-iot-sdk-python/tree/master/) | [Samples](https://github.com/Azure/azure-iot-sdk-python/tree/master/azure-iot-device/samples/pnp) | [Connect to IoT Hub](quickstart-connect-device-python.md) | [Reference](https://docs.microsoft.com/python/api/azure-iot-device/azure.iot.device?view=azure-python) |
| Node - Device | [1.17.0](https://www.npmjs.com/package/azure-iot-device)  | [GitHub](https://github.com/Azure/azure-iot-sdk-node/tree/master/) | [Samples](https://github.com/Azure/azure-iot-sdk-node/tree/master/device/samples/pnp) | [Connect to IoT Hub](quickstart-connect-device-node.md) | [Reference](https://docs.microsoft.com/javascript/api/azure-iot-device/?view=azure-node-latest) |

**Service libraries and SDKs**

| Language | Package | Code Repository | Samples | Quickstart | Reference |
|---|---|---|---|---|---|
| C# - Service | [1.27.1-preview-002](https://www.nuget.org/packages/Microsoft.Azure.Devices/1.27.1-preview-002 ) | [GitHub](https://github.com/Azure/azure-iot-sdk-csharp/tree/pnp-preview-refresh) | [Samples](https://github.com/Azure/azure-iot-sdk-csharp/tree/pnp-preview-refresh/iothub/service/samples/PnpServiceSamples) | na | [Reference](https://docs.microsoft.com/dotnet/api/microsoft.azure.devices?view=azure-dotnet) |
| Java - Service | [1.1.0](https://mvnrepository.com/artifact/com.microsoft.azure.sdk.iot/iot-service-client-preview/1.1.0) | [GitHub](https://github.com/Azure/azure-iot-sdk-java/tree/pnp-preview-refresh) | [Samples](https://github.com/Azure/azure-iot-sdk-java/tree/pnp-preview-refresh/service/iot-service-samples/pnp-service-sample) | na | [Reference](https://docs.microsoft.com/java/api/com.microsoft.azure.sdk.iot.service?view=azure-java-stable) |
| Python - Service | [2.2.1rc1](https://pypi.org/project/azure-iot-hub/2.2.1rc1/) | [GitHub](https://github.com/Azure/azure-iot-sdk-python/tree/pnp-preview-refresh) | [Samples](https://github.com/Azure/azure-iot-sdk-python/tree/pnp-preview-refresh/azure-iot-hub/samples) | [Interact with IoT Hub](quickstart-service-python.md) | [Reference](https://docs.microsoft.com/python/api/azure-iot-hub/?view=azure-python) |
| Node - Service | [latest](https://www.npmjs.com/package/azure-iot-digitaltwins-service) | [GitHub](https://github.com/Azure/azure-iot-sdk-node/tree/pnp-preview-refresh/) | [Samples](https://github.com/Azure/azure-iot-sdk-node/tree/pnp-preview-refresh/digitaltwins/samples/service/javascript) | [Interact with IoT Hub](quickstart-service-node.md) | [Reference](https://docs.microsoft.com/javascript/api/azure-iothub/?view=azure-node-latest) |

## Next steps

In addition to the device SDKs and libraries, you can use REST APIs to interact with the model repository.

To try out the SDKs and libraries, see the [quickstarts](quickstart-connect-device-c.md)
