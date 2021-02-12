---
title: Overview of Azure IoT device SDK options
description: Learn which Azure IoT device SDK to use based on your development role and tasks.
author: elhorton
ms.author: elhorton
ms.service: iot-develop
ms.topic: overview
ms.date: 02/11/2021
---

# Overview of Azure IoT Device SDKs

The Azure IoT device SDKs are a set of device client libraries, developer guides, samples, and documentation. The SDKs help to programmatically connect devices to Azure IoT services. Azure IoT device SDKs fit into the broader suite of Azure IoT offerings, which includes services and tools to enable IoT solutions.

:::image type="content" source="media/about-iot-sdks/iot-sdk-diagram.png" alt-text="IoT SDKs explanation":::

As the above graphic shows, Azure IoT Device SDKs enable you to easily connect your devices to the cloud. Various SDKs are available to fit your device and programming language needs, further described [below](#which-sdk-should-i-use). Additionally, Azure IoT offers Service SDKs--these SDKs allow your cloud-based application to connect with Azure IoT services on the backend. This article will focus on device SDKs, but you can learn more about Service SDKs by following the links below.

## Why should I use the Azure IoT Device SDKs?

To connect devices to Azure IoT, you can build a custom connection layer or use Azure IoT Device SDKs. There are several advantages to using Azure IoT Device SDKs:

| Development cost | Custom connection layer | Azure IoT Device SDKs |
| --: | :------------------------------------------------: | :---------------------------------------- |
| Support | Need to support and document whatever you build | Have access to Microsoft support (GitHub, Microsoft Q&A, Microsoft Docs, Customer Support teams) |
| New Features | Need to add new Azure features to their middleware | Can  immediately take advantage of new features that Microsoft constantly adds to the IoT SDKs |
| Investment | Invest hundreds of hours of embedded development to design, build, test, and maintain their own version | Can take advantage of free, open-source tools. The only cost associated with the SDKs is the learning curve. |

## Which SDK should I use?

Azure IoT Device SDKs are available popular programming languages including C, C#, Java, Node.js, and Python. However, there are two primary aspects to consider when you choose an SDK: device capabilities, and your team's familiarity with the programming language.

### Device capabilities

When you are choosing an SDK, you'll need to consider the limits of the devices you're using. For instance, consider whether you're using a constrained device. A constrained device has a single micro-controller (MCU) and limited memory. In that case we recommend that you use the Embedded C SDK. This SDK is specifically designed to provide the bare minimum set of capabilities to connect to Azure IoT. You can also select components (MQTT client, TLS and socket libraries) that are most optimized for your embedded device. Similarly, if your device is running Azure RTOS, use the Azure RTOS middleware to connect to Azure IoT. The Azure RTOS middleware wraps the Embedded C SDK and adds extra features to it.

If your device is not resource constrained—that is, it has a more robust CPU capable of running an operating system to support language runtimes such as .NET or Python—then your choice will predominantly come down to language familiarity.

### Your team’s familiarity with the programming language

Azure IoT SDKs are implemented in multiple languages primarily to allow you to choose the language in which you feel the most comfortable. It also maximizes your ability to quickly integrate with other familiar, language-specific tools and optimizes for quality throughout the development cycle of research, prototyping, productization, and ongoing maintenance.

Whenever possible, select an SDK that feels familiar to your development team. All Azure IoT SDKs are open source and have several samples available for your team to evaluate, learn their capabilities, and run proof of concepts before committing to a specific SDK.

## How can I get started?

We recommend that you start by exploring the Github repositories of our Device SDKs. You can also try a [quickstart](quickstart-send-telemetry-python.md) that will have you using an SDK to send telemetry to Azure IoT in minutes.

If your device is constrained, we recommend you use the [Embedded C SDK](#embedded-c-sdk), or, if your device runs on Azure RTOS, you can develop with the [Azure RTOS middleware](#azure-rtos-middleware). If your device is not constrained, then you can [choose an SDK](#unconstrained-device-sdks) in a language of your choice. 

### Constrained Device SDKs

#### Embedded C SDK

* [Github Repository](https://github.com/Azure/azure-sdk-for-c/tree/1.0.0/sdk/docs/iot)
* [Samples](https://github.com/Azure/azure-sdk-for-c/blob/master/sdk/samples/iot/README.md)
* [Reference Documentation](https://azure.github.io/azure-sdk-for-c/)
* [How to build the Embedded C SDK](https://github.com/Azure/azure-sdk-for-c/tree/master/sdk/docs/iot#build)
* [Size chart for constrained devices](https://github.com/Azure/azure-sdk-for-c/tree/master/sdk/docs/iot#size-chart)

#### Azure RTOS Middleware

* [Github Repository](https://github.com/azure-rtos/threadx)
* [Getting Started Guides](https://github.com/azure-rtos/getting-started) and [Additional Samples](https://github.com/azure-rtos/samples)
* [Reference Documentation](https://docs.microsoft.com/azure/rtos/threadx/)

### Unconstrained Device SDKs

#### C Device SDK

* [Github Repository](https://github.com/Azure/azure-iot-sdk-c)
* [Samples](https://github.com/Azure/azure-iot-sdk-c/tree/master/iothub_client/samples)
* [Packages](https://github.com/Azure/azure-iot-sdk-c/blob/master/readme.md#packages-and-libraries)
* [Reference Documentation](/azure/iot-hub/iot-c-sdk-ref/)
* [Edge Module Reference Documentation](/azure/iot-hub/iot-c-sdk-ref/iothub-module-client-h)
* [Compile the C Device SDK](https://github.com/Azure/azure-iot-sdk-c/blob/master/iothub_client/readme.md#compiling-the-c-device-sdk)
* [Porting the C SDK to other platforms](https://github.com/Azure/azure-c-shared-utility/blob/master/devdoc/porting_guide.md)
* [Developer documentation](https://github.com/Azure/azure-iot-sdk-c/tree/master/doc) for information on cross-compiling, getting started on different platforms, etc.
* [Azure IoT Hub C SDK resource consumption information](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/c_sdk_resource_information.md)

#### C# Device SDK

* [Github Repository](https://github.com/Azure/azure-iot-sdk-csharp)
* [Samples](https://github.com/Azure/azure-iot-sdk-csharp#samples)
* [Package](https://www.nuget.org/packages/Microsoft.Azure.Devices.Client/)
* [Reference Documentation](/dotnet/api/microsoft.azure.devices?view=azure-dotnet)
* [Edge Module Reference Documentation](/dotnet/api/microsoft.azure.devices.client.moduleclient?view=azure-dotnet)

#### Java Device SDK

* [Github Repository](https://github.com/Azure/azure-iot-sdk-java)
* [Samples](https://github.com/Azure/azure-iot-sdk-java/tree/master/device/iot-device-samples)
* [Package](https://github.com/Azure/azure-iot-sdk-java/blob/master/doc/java-devbox-setup.md#for-the-device-sdk)
* [Reference Documentation](/java/api/com.microsoft.azure.sdk.iot.device)
* [Edge Module Reference Documentation](/java/api/com.microsoft.azure.sdk.iot.device.moduleclient?view=azure-java-stable)

#### Node.js Device SDK

* [Github Repository](https://github.com/Azure/azure-iot-sdk-node)
* [Samples](https://github.com/Azure/azure-iot-sdk-node/tree/master/device/samples)
* [Package](https://www.npmjs.com/package/azure-iot-device)
* [Reference Documentation](/javascript/api/azure-iot-device/?view=azure-iot-typescript-latest)
* [Edge Module Reference Documentation](/javascript/api/azure-iot-device/moduleclient?view=azure-node-latest)

#### Python Device SDK

* [Github Repository](https://github.com/Azure/azure-iot-sdk-python)
* [Samples](https://github.com/Azure/azure-iot-sdk-python/tree/master/azure-iot-device/samples)
* [Package](https://pypi.org/project/azure-iot-device/)
* [Reference Documentation](/python/api/azure-iot-device)
* [Edge Module Reference Documentation](/python/api/azure-iot-device/azure.iot.device.iothubmoduleclient?view=azure-python)

### Service SDKs

#### IoT Hub

The IoT Hub service SDKs allow you to build applications that easily interact with your IoT Hub to manage devices and security. You can use these SDKs to send cloud-to-device messages, invoke direct methods on your devices, update device properties, and more.

[**Learn more about IoT Hub**](https://azure.microsoft.com/services/iot-hub/) | [**Try controlling a device**](https://docs.microsoft.com/azure/iot-hub/quickstart-control-device-python)

**C# IoT Hub Service SDK**: [Github Repository](https://github.com/Azure/azure-iot-sdk-csharp/tree/master/iothub/service) | [Package](https://www.nuget.org/packages/Microsoft.Azure.Devices/) | [Samples](https://github.com/Azure/azure-iot-sdk-csharp/tree/master/iothub/service/samples) | [Reference Documentation](/dotnet/api/microsoft.azure.devices)

**Java IoT Hub Service SDK**: [Github Repository](https://github.com/Azure/azure-iot-sdk-java/tree/master/service) | [Package](https://github.com/Azure/azure-iot-sdk-java/blob/master/doc/java-devbox-setup.md#for-the-service-sdk) | [Samples](https://github.com/Azure/azure-iot-sdk-java/tree/master/service/iot-service-samples) | [Reference Documentation](/java/api/com.microsoft.azure.sdk.iot.service)

**Node.js IoT Hub Service SDK**: [Github Repository](https://github.com/Azure/azure-iot-sdk-node/tree/master/service) | [Package](https://www.npmjs.com/package/azure-iothub) | [Samples](https://github.com/Azure/azure-iot-sdk-node/tree/master/service/samples) | [Reference Documentation](/javascript/api/azure-iothub/?view=azure-iot-typescript-latest)

**Python IoT Hub Service SDK**: [Github Repository](https://github.com/Azure/azure-iot-sdk-python/tree/master/azure-iot-hub) | [Package](https://pypi.python.org/pypi/azure-iot-hub/) | [Samples](https://github.com/Azure/azure-iot-sdk-python/tree/master/azure-iot-hub/samples) | [Reference Documentation](/python/api/azure-iot-hub)

#### Azure Digital Twins

Azure Digital Twins is a platform as a service (PaaS) offering that enables the creation of knowledge graphs based on digital models of entire environments. These environments could be buildings, factories, farms, energy networks, railways, stadiums, and more—even entire cities. These digital models can be used to gain insights that drive better products, optimized operations, reduced costs, and breakthrough customer experiences. Azure IoT offers service SDKs to make it easy to build applications that leverage the power of Azure Digital Twins.

[**Learn more about Azure Digital Twins**](https://azure.microsoft.com/services/digital-twins/) | [**Code an ADT application**](https://docs.microsoft.com/azure/digital-twins/tutorial-code)

**C# ADT Service SDK**: [Github Repository](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/digitaltwins/Azure.DigitalTwins.Core) | [Package](https://www.nuget.org/packages/Azure.DigitalTwins.Core) | [Samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/digitaltwins/Azure.DigitalTwins.Core/samples) | [Reference Documentation](https://docs.microsoft.com/dotnet/api/overview/azure/digitaltwins/client?view=azure-dotnet)

**Java ADT Service SDK**: [Github Repository](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/digitaltwins/azure-digitaltwins-core) | [Package](https://search.maven.org/artifact/com.azure/azure-digitaltwins-core/1.0.0/jar) | [Samples](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/digitaltwins/azure-digitaltwins-core/src/samples) | [Reference Documentation](https://docs.microsoft.com/java/api/overview/azure/digitaltwins/client?preserve-view=true&view=azure-java-stable)

**Node.js ADT Service SDK**: [Github Repository](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/digitaltwins/digital-twins-core) | [Package](https://www.npmjs.com/package/@azure/digital-twins-core) | [Samples](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/digitaltwins/digital-twins-core/samples) | [Reference Documentation](https://docs.microsoft.com/javascript/api/@azure/digital-twins-core/?branch=master&view=azure-node-latest)

**Python ADT Service SDK**: [Github Repository](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/digitaltwins/azure-digitaltwins-core) | [Package](https://pypi.org/project/azure-digitaltwins-core/) | [Samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/digitaltwins/azure-digitaltwins-core/samples) | [Reference Documentation](https://docs.microsoft.com/python/api/azure-digitaltwins-core/azure.digitaltwins.core?view=azure-python)

#### Device Provisioning Service

The IoT Hub Device Provisioning Service (DPS) is a helper service for IoT Hub that enables zero-touch, just-in-time provisioning to the right IoT hub without requiring human intervention. DPS enables the provisioning of millions of devices in a secure and scalable manner. The DPS Service SDKs allow you to build applications that can securely manage your devices by creating enrollment groups and performing bulk operations.

[**Learn more about the Device Provisioning Service**](https://docs.microsoft.com/azure/iot-dps/) | [**Try creating a group enrollment for X.509 Devices**](https://docs.microsoft.com/azure/iot-dps/quick-enroll-device-x509-csharp)

**C# Device Provisioning Service SDK**: [Github Repository](https://github.com/Azure/azure-iot-sdk-csharp/tree/master/provisioning/service) | [Package](https://www.nuget.org/packages/Microsoft.Azure.Devices.Provisioning.Service/) | [Samples](https://github.com/Azure/azure-iot-sdk-csharp/tree/master/provisioning/service/samples) | [Reference Documentation](https://docs.microsoft.com/dotnet/api/microsoft.azure.devices.provisioning.service?view=azure-dotnet)

**Java Device Provisioning Service SDK**: [Github Repository](https://github.com/Azure/azure-iot-sdk-java/tree/master/provisioning/provisioning-service-client/src) | [Package](https://mvnrepository.com/artifact/com.microsoft.azure.sdk.iot.provisioning/provisioning-service-client) | [Samples](https://github.com/Azure/azure-iot-sdk-java/tree/master/provisioning/provisioning-samples#provisioning-service-client) | [Reference Documentation](https://docs.microsoft.com/java/api/com.microsoft.azure.sdk.iot.provisioning.service?view=azure-java-stable)

**Node.js Device Provisioning Service SDK**: [Github Repository](https://github.com/Azure/azure-iot-sdk-node/tree/master/provisioning/service) | [Package](https://www.npmjs.com/package/azure-iot-provisioning-service) | [Samples](https://github.com/Azure/azure-iot-sdk-node/tree/master/provisioning/service/samples) | [Reference Documentation](https://docs.microsoft.com/javascript/api/azure-iot-provisioning-service)

## Next Steps

* [Quickstart: Connect a device to IoT Central (Python)](quickstart-send-telemetry-python.md)
* [Quickstart: Connect a device to IoT Hub (Python)](quickstart-send-telemetry-cli-python.md)
* [Get started with embedded development](quickstart-device-development.md)
* Learn more about the [benefits of developing using Azure IoT SDKs](https://azure.microsoft.com/blog/benefits-of-using-the-azure-iot-sdks-in-your-azure-iot-solution/)