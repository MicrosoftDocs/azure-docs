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

The Azure IoT device SDKs are a set of device client libraries, developer guides, samples, and documentation. The device SDKs help you to programmatically connect devices to Azure IoT services. Azure IoT provides many different device SDKs, designed to fit your device and programming language needs. 

## Why use an Azure IoT Device SDK?

To connect devices to Azure IoT, you can build a custom connection layer or use Azure IoT Device SDKs. There are several advantages to using Azure IoT Device SDKs:

| | Custom connection layer | Azure IoT Device SDKs |
| :-- | :------------------------------------------------ | :---------------------------------------- |
| **Support** | Need to support and document whatever you build | Have access to Microsoft support (GitHub, Microsoft Q&A, Microsoft Docs, Customer Support teams) |
| **New Features** | Need to add new Azure features to custom middleware | Can immediately take advantage of new features that Microsoft constantly adds to the IoT SDKs |
| **Investment** | Invest hundreds of hours of embedded development to design, build, test, and maintain a custom version | Can take advantage of free, open-source tools. The only cost associated with the SDKs is the learning curve. |

## Which SDK should I use?

Azure IoT Device SDKs are available in popular programming languages including C, C#, Java, Node.js, and Python. There are two primary considerations when you choose an SDK: device capabilities, and your team's familiarity with the programming language.

### Device capabilities

When you're choosing an SDK, you'll need to consider the limits of the devices you're using. A constrained device is one that has a single micro-controller (MCU) and limited memory. If you're using a constrained device, we recommend that you use the [Embedded C SDK](#embedded-c-sdk). This SDK is designed to provide the bare minimum set of capabilities to connect to Azure IoT. You can also select components (MQTT client, TLS, and socket libraries) that are most optimized for your embedded device. If your constrained device also runs Azure RTOS, you can use the Azure RTOS middleware to connect to Azure IoT. The Azure RTOS middleware wraps the Embedded C SDK with extra functionality to simplify connecting your Azure RTOS device to the cloud.

An unconstrained device is one that has a more robust CPU, which is capable of running an operating system to support a language runtime such as .NET or Python. If you're using an unconstrained device, the main consideration is familiarity with the language.

### Programming language familiarity

Azure IoT device SDKs are implemented in multiple languages so you can choose the language that your prefer. The device SDKs also integrate with other familiar, language-specific tools. Being able to work with a familiar development language and tools, enables your team to optimize the development cycle of research, prototyping, product development, and ongoing maintenance.

Whenever possible, select an SDK that feels familiar to your development team. All Azure IoT SDKs are open source and have several samples available for your team to evaluate and test before committing to a specific SDK.

## How can I get started?

The place to start is to explore the GitHub repositories of the Azure Device SDKs. You can also try a [quickstart](quickstart-send-telemetry-python.md) that shows how to quickly use an SDK to send telemetry to Azure IoT.

Your options to get started depend on what kind of device you have:
- For constrained devices, use the [Embedded C SDK](#embedded-c-sdk). 
- For devices that run on Azure RTOS, you can develop with the [Azure RTOS middleware](#azure-rtos-middleware). 
- For devices that are unconstrained, then you can [choose an SDK](#unconstrained-device-sdks) in a language of your choice. 

## Device application development SDKs
These SDKs can run on any device that can support a higher-order language runtime. This includes devices such as PCs, Raspberry Pis, and smartphones. They're differentiated primarily by language so you can choose whichever library that best suits your team and scenario.

| Language | Package | Source | Quickstarts | Samples | Reference |
|---|---|---|---|---|---|
| .NET | [NuGet](https://www.nuget.org/packages/Microsoft.Azure.Devices.Client) | [GitHub](https://github.com/Azure/azure-iot-sdk-csharp) | [IoT Hub](quickstart-send-telemetry-iot-hub?pivots=programming-language-csharp) / [IoT Central](quickstart-send-telemetry-central?pivots=programming-language-csharp) | [Samples](https://github.com/Azure-Samples/azure-iot-samples-csharp) | [Reference](/dotnet/api/microsoft.azure.devices.client) |
| Python | [pip](https://pypi.org/project/azure-iot-device/) | [GitHub](https://github.com/Azure/azure-iot-sdk-python) | [IoT Hub](quickstart-send-telemetry-iot-hub?pivots=programming-language-python) / [IoT Central](quickstart-send-telemetry-central?pivots=programming-language-python) | [Samples](https://github.com/Azure/azure-iot-sdk-python/tree/master/azure-iot-device/samples) | [Reference](/python/api/azure-iot-device) |
| Node.js | [npm](https://www.npmjs.com/package/azure-iot-device) | [GitHub](https://github.com/Azure/azure-iot-sdk-node) | [IoT Hub](quickstart-send-telemetry-iot-hub?pivots=programming-language-nodejs) / [IoT Central](quickstart-send-telemetry-central?pivots=programming-language-nodejs) | [Samples](https://github.com/Azure/azure-iot-sdk-node/tree/master/device/samples) | [Reference](/javascript/api/azure-iot-device/) |
| Java | [Maven](https://mvnrepository.com/artifact/com.microsoft.azure.sdk.iot/iot-device-client) | [GitHub](https://github.com/Azure/azure-iot-sdk-java) | [IoT Hub](quickstart-send-telemetry-iot-hub?pivots=programming-language-java) / [IoT Central](quickstart-send-telemetry-central?pivots=programming-language-java) | [Samples](https://github.com/Azure/azure-iot-sdk-java/tree/master/device/iot-device-samples) | [Reference](/java/api/com.microsoft.azure.sdk.iot.device) |
| C | [packages](https://github.com/Azure/azure-iot-sdk-c/blob/master/readme.md#getting-the-sdk) | [GitHub](https://github.com/Azure/azure-iot-sdk-c) | [IoT Hub](quickstart-send-telemetry-iot-hub?pivots=programming-language-ansi-c) / [IoT Central](quickstart-send-telemetry-central?pivots=programming-language-ansi-c) | [Samples](https://github.com/Azure/azure-iot-sdk-c/tree/master/iothub_client/samples) | [Reference](/azure/iot-hub/iot-c-sdk-ref/) |

### Python Device SDK

* [Reference Documentation](/python/api/azure-iot-device)
* [Edge Module Reference Documentation](/python/api/azure-iot-device/azure.iot.device.iothubmoduleclient)

## Embedded device development SDKs
These SDKs are specialized to run on devices with limited compute or memory resources. To learn more about common device types, see [Overview of Azure IoT device types](concepts-iot-device-types.md).

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