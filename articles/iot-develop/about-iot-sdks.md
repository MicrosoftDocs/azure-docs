---
title: Overview of Azure IoT device SDK options
description: Learn which Azure IoT device SDK to use based on your development role and tasks.
author: philmea
ms.author: philmea
ms.service: iot-develop
ms.topic: overview
ms.date: 02/11/2021
---

# Overview of Azure IoT Device SDKs

The Azure IoT device SDKs cover device client libraries, developer guides, samples, and documentation. The device SDKs provide a convenient way to connect devices to Azure IoT services. The SDKs are available in a variety of programming languages as well as different RTOS supported versions for Embedded devices.

## Why use an Azure IoT Device SDK?

The advantages of using an Azure IoT Device SDK over building a custom connection layer are outlined below:

| | Custom connection layer | Azure IoT Device SDKs |
| :-- | :------------------------------------------------ | :---------------------------------------- |
| **Support** | Need to support and document your solution | Access to Microsoft support (GitHub, Microsoft Q&A, Microsoft Docs, Customer Support teams) |
| **New Features** | Need to manually add new Azure features | Can immediately take advantage of new features added |
| **Investment** | Invest hundreds of hours of embedded development to design, build, test, and maintain a custom version | Can take advantage of free, open-source tools. The only cost associated with the SDKs is the learning curve. |

## Which SDK should I use?

The primary consideration to account for when choosing your SDK is the devices capabilities. Many devices, particularly MCU based, have memory and compute limitations. For more information on the different device catagories, refer to [Azure IoT Device Types](#concepts-iot-device-types) to he,p you choose the write category of SDK's for your device.

Azure IoT offers two categories of device SDKs:
* For embedded devices, refer to [Embedded Device SDKs](#embedded-device-sdks)
* For all other devices, refer to [Device Application SDKs](#device-application-sdks).

## Device application SDKs
These SDKs can run on any device that can support a higher-order language runtime. This includes devices such as PCs, Raspberry Pis, and smartphones. The SDKs are available in multiple popular languages 
The primary SDK differentiator is by language so you can choose the 
so you can choose whichever library that best suits your team and scenario.

| Language | Package | Source | Quickstarts | Samples | Reference |
|---|---|---|---|---|---|
| .NET | [NuGet](https://www.nuget.org/packages/Microsoft.Azure.Devices.Client) | [GitHub](https://github.com/Azure/azure-iot-sdk-csharp) | [IoT Hub](quickstart-send-telemetry-iot-hub?pivots=programming-language-csharp) / [IoT Central](quickstart-send-telemetry-central?pivots=programming-language-csharp) | [Samples](https://github.com/Azure-Samples/azure-iot-samples-csharp) | [Reference](/dotnet/api/microsoft.azure.devices.client) |
| Python | [pip](https://pypi.org/project/azure-iot-device/) | [GitHub](https://github.com/Azure/azure-iot-sdk-python) | [IoT Hub](quickstart-send-telemetry-iot-hub?pivots=programming-language-python) / [IoT Central](quickstart-send-telemetry-central?pivots=programming-language-python) | [Samples](https://github.com/Azure/azure-iot-sdk-python/tree/master/azure-iot-device/samples) | [Reference](/python/api/azure-iot-device) |
| Node.js | [npm](https://www.npmjs.com/package/azure-iot-device) | [GitHub](https://github.com/Azure/azure-iot-sdk-node) | [IoT Hub](quickstart-send-telemetry-iot-hub?pivots=programming-language-nodejs) / [IoT Central](quickstart-send-telemetry-central?pivots=programming-language-nodejs) | [Samples](https://github.com/Azure/azure-iot-sdk-node/tree/master/device/samples) | [Reference](/javascript/api/azure-iot-device/) |
| Java | [Maven](https://mvnrepository.com/artifact/com.microsoft.azure.sdk.iot/iot-device-client) | [GitHub](https://github.com/Azure/azure-iot-sdk-java) | [IoT Hub](quickstart-send-telemetry-iot-hub?pivots=programming-language-java) / [IoT Central](quickstart-send-telemetry-central?pivots=programming-language-java) | [Samples](https://github.com/Azure/azure-iot-sdk-java/tree/master/device/iot-device-samples) | [Reference](/java/api/com.microsoft.azure.sdk.iot.device) |
| C | [packages](https://github.com/Azure/azure-iot-sdk-c/blob/master/readme.md#getting-the-sdk) | [GitHub](https://github.com/Azure/azure-iot-sdk-c) | [IoT Hub](quickstart-send-telemetry-iot-hub?pivots=programming-language-ansi-c) / [IoT Central](quickstart-send-telemetry-central?pivots=programming-language-ansi-c) | [Samples](https://github.com/Azure/azure-iot-sdk-c/tree/master/iothub_client/samples) | [Reference](/azure/iot-hub/iot-c-sdk-ref/) |

## Embedded device SDKs
These SDKs are specialized to run on devices with limited compute or memory resources. To learn more about common device types, see [Overview of Azure IoT device types](concepts-iot-device-types.md).

[!div class="tab"]

:::zone pivot="embedded-c-sdk"
:::zone-end

### Embedded C SDK
* [GitHub Repository](https://github.com/Azure/azure-sdk-for-c/tree/master/sdk/docs/iot)
* [Samples](https://github.com/Azure/azure-sdk-for-c/blob/master/sdk/samples/iot/README.md)
* [Reference Documentation](https://azure.github.io/azure-sdk-for-c/)
* [How to build the Embedded C SDK](https://github.com/Azure/azure-sdk-for-c/tree/master/sdk/docs/iot#build)
* [Size chart for constrained devices](https://github.com/Azure/azure-sdk-for-c/tree/master/sdk/docs/iot#size-chart)

### Azure RTOS Middleware

* [GitHub Repository](https://github.com/azure-rtos/netxduo/tree/master/addons/azure_iot)
* [Getting Started Guides](https://github.com/azure-rtos/getting-started) and [more samples](https://github.com/azure-rtos/samples)
* [Reference Documentation](/azure/rtos/threadx/)

## Next Steps

* [Quickstart: Connect a device to IoT Central (Python)](quickstart-send-telemetry-python.md)
* [Quickstart: Connect a device to IoT Hub (Python)](quickstart-send-telemetry-cli-python.md)
* [Get started with embedded development](quickstart-device-development.md)
* Learn more about the [benefits of developing using Azure IoT SDKs](https://azure.microsoft.com/blog/benefits-of-using-the-azure-iot-sdks-in-your-azure-iot-solution/)