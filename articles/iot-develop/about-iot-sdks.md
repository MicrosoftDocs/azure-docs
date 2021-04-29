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

The Azure IoT device SDKs are a set of device client libraries, developer guides, samples, and documentation. The device SDKs help you to programmatically connect devices to Azure IoT services.

:::image type="content" border="false" source="media/about-iot-sdks/iot-sdk-diagram.png" alt-text="Diagram showing various Azure IoT SDKs":::

As the diagram shows, there are several device SDKs available to fit your device and programming language needs. Guidance on selecting the appropriate device SDK is available in [Which SDK should I use](#which-sdk-should-i-use). There are also Azure IoT service SDKs available to connect your cloud-based application with Azure IoT services on the backend. This article focuses on the device SDKs, but you can learn more about Azure service SDKs [here](#service-sdks).

## Why should I use the Azure IoT Device SDKs?

To connect devices to Azure IoT, you can build a custom connection layer or use Azure IoT Device SDKs. There are several advantages to using Azure IoT Device SDKs:

| Development cost &nbsp; &nbsp; &nbsp; &nbsp; | Custom connection layer | Azure IoT Device SDKs |
| :-- | :------------------------------------------------ | :---------------------------------------- |
| Support | Need to support and document whatever you build | Have access to Microsoft support (GitHub, Microsoft Q&A, Microsoft Docs, Customer Support teams) |
| New Features | Need to add new Azure features to custom middleware | Can immediately take advantage of new features that Microsoft constantly adds to the IoT SDKs |
| Investment | Invest hundreds of hours of embedded development to design, build, test, and maintain a custom version | Can take advantage of free, open-source tools. The only cost associated with the SDKs is the learning curve. |

## Which SDK should I use?

Azure IoT Device SDKs are available in popular programming languages including C, C#, Java, Node.js, and Python. There are two primary considerations when you choose an SDK: device capabilities, and your team's familiarity with the programming language.

### Device capabilities

When you're choosing an SDK, you'll need to consider the limits of the devices you're using. A constrained device is one that has a single micro-controller (MCU) and limited memory. If you're using a constrained device, we recommend that you use the [Embedded C SDK](#embedded-c-sdk). This SDK is designed to provide the bare minimum set of capabilities to connect to Azure IoT. You can also select components (MQTT client, TLS, and socket libraries) that are most optimized for your embedded device. If your constrained device also runs Azure RTOS, you can use the Azure RTOS middleware to connect to Azure IoT. The Azure RTOS middleware wraps the Embedded C SDK with extra functionality to simplify connecting your Azure RTOS device to the cloud.

An unconstrained device is one that has a more robust CPU, which is capable of running an operating system to support a language runtime such as .NET or Python. If you're using an unconstrained device, the main consideration is familiarity with the language.

### Your team’s familiarity with the programming language

Azure IoT device SDKs are implemented in multiple languages so you can choose the language that your prefer. The device SDKs also integrate with other familiar, language-specific tools. Being able to work with a familiar development language and tools, enables your team to optimize the development cycle of research, prototyping, product development, and ongoing maintenance.

Whenever possible, select an SDK that feels familiar to your development team. All Azure IoT SDKs are open source and have several samples available for your team to evaluate and test before committing to a specific SDK.

## How can I get started?

The place to start is to explore the GitHub repositories of the Azure Device SDKs. You can also try a [quickstart](quickstart-send-telemetry-python.md) that shows how to quickly use an SDK to send telemetry to Azure IoT.

Your options to get started depend on what kind of device you have:
- For constrained devices, use the [Embedded C SDK](#embedded-c-sdk). 
- For devices that run on Azure RTOS, you can develop with the [Azure RTOS middleware](#azure-rtos-middleware). 
- For devices that are unconstrained, then you can [choose an SDK](#unconstrained-device-sdks) in a language of your choice. 

### Constrained Device SDKs
These SDKs are specialized to run on devices with limited compute or memory resources. To learn more about common device types, see [Overview of Azure IoT device types](concepts-iot-device-types.md).

#### Embedded C SDK
* [GitHub Repository](https://github.com/Azure/azure-sdk-for-c/tree/master/sdk/docs/iot)
* [Samples](https://github.com/Azure/azure-sdk-for-c/blob/master/sdk/samples/iot/README.md)
* [Reference Documentation](https://azure.github.io/azure-sdk-for-c/)
* [How to build the Embedded C SDK](https://github.com/Azure/azure-sdk-for-c/tree/master/sdk/docs/iot#build)
* [Size chart for constrained devices](https://github.com/Azure/azure-sdk-for-c/tree/master/sdk/docs/iot#size-chart)

#### Azure RTOS Middleware

* [GitHub Repository](https://github.com/azure-rtos/netxduo/tree/master/addons/azure_iot)
* [Getting Started Guides](https://github.com/azure-rtos/getting-started) and [more samples](https://github.com/azure-rtos/samples)
* [Reference Documentation](/azure/rtos/threadx/)

### Unconstrained Device SDKs
These SDKs can run on any device that can support a higher-order language runtime. This includes devices such as PCs, Raspberry Pis, and smartphones. They're differentiated primarily by language so you can choose whichever library that best suits your team and scenario.

#### C Device SDK
* [GitHub Repository](https://github.com/Azure/azure-iot-sdk-c)
* [Samples](https://github.com/Azure/azure-iot-sdk-c/tree/master/iothub_client/samples)
* [Packages](https://github.com/Azure/azure-iot-sdk-c/blob/master/readme.md#packages-and-libraries)
* [Reference Documentation](/azure/iot-hub/iot-c-sdk-ref/)
* [Edge Module Reference Documentation](/azure/iot-hub/iot-c-sdk-ref/iothub-module-client-h)
* [Compile the C Device SDK](https://github.com/Azure/azure-iot-sdk-c/blob/master/iothub_client/readme.md#compiling-the-c-device-sdk)
* [Porting the C SDK to other platforms](https://github.com/Azure/azure-c-shared-utility/blob/master/devdoc/porting_guide.md)
* [Developer documentation](https://github.com/Azure/azure-iot-sdk-c/tree/master/doc) for information on cross-compiling and getting started on different platforms
* [Azure IoT Hub C SDK resource consumption information](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/c_sdk_resource_information.md)

#### C# Device SDK

* [GitHub Repository](https://github.com/Azure/azure-iot-sdk-csharp)
* [Samples](https://github.com/Azure/azure-iot-sdk-csharp#samples)
* [Package](https://www.nuget.org/packages/Microsoft.Azure.Devices.Client/)
* [Reference Documentation](/dotnet/api/microsoft.azure.devices)
* [Edge Module Reference Documentation](/dotnet/api/microsoft.azure.devices.client.moduleclient)

#### Java Device SDK

* [GitHub Repository](https://github.com/Azure/azure-iot-sdk-java)
* [Samples](https://github.com/Azure/azure-iot-sdk-java/tree/master/device/iot-device-samples)
* [Package](https://github.com/Azure/azure-iot-sdk-java/blob/master/doc/java-devbox-setup.md#for-the-device-sdk)
* [Reference Documentation](/java/api/com.microsoft.azure.sdk.iot.device)
* [Edge Module Reference Documentation](/java/api/com.microsoft.azure.sdk.iot.device.moduleclient)

#### Node.js Device SDK

* [GitHub Repository](https://github.com/Azure/azure-iot-sdk-node)
* [Samples](https://github.com/Azure/azure-iot-sdk-node/tree/master/device/samples)
* [Package](https://www.npmjs.com/package/azure-iot-device)
* [Reference Documentation](/javascript/api/azure-iot-device/)
* [Edge Module Reference Documentation](/javascript/api/azure-iot-device/moduleclient)

#### Python Device SDK

* [GitHub Repository](https://github.com/Azure/azure-iot-sdk-python)
* [Samples](https://github.com/Azure/azure-iot-sdk-python/tree/master/azure-iot-device/samples)
* [Package](https://pypi.org/project/azure-iot-device/)
* [Reference Documentation](/python/api/azure-iot-device)
* [Edge Module Reference Documentation](/python/api/azure-iot-device/azure.iot.device.iothubmoduleclient)

### Service SDKs
Azure IoT also offers service SDKs that enable you to build solution-side applications to manage devices, gain insights, visualize data, and more. These SDKs are specific to each Azure IoT service and are available in C#, Java, JavaScript, and Python to simplify your development experience. 

#### IoT Hub

The IoT Hub service SDKs allow you to build applications that easily interact with your IoT Hub to manage devices and security. You can use these SDKs to send cloud-to-device messages, invoke direct methods on your devices, update device properties, and more.

[**Learn more about IoT Hub**](https://azure.microsoft.com/services/iot-hub/) | [**Try controlling a device**](../iot-hub/quickstart-control-device-python.md)

**C# IoT Hub Service SDK**: [GitHub Repository](https://github.com/Azure/azure-iot-sdk-csharp/tree/master/iothub/service) | [Package](https://www.nuget.org/packages/Microsoft.Azure.Devices/) | [Samples](https://github.com/Azure/azure-iot-sdk-csharp/tree/master/iothub/service/samples) | [Reference Documentation](/dotnet/api/microsoft.azure.devices)

**Java IoT Hub Service SDK**: [GitHub Repository](https://github.com/Azure/azure-iot-sdk-java/tree/master/service) | [Package](https://github.com/Azure/azure-iot-sdk-java/blob/master/doc/java-devbox-setup.md#for-the-service-sdk) | [Samples](https://github.com/Azure/azure-iot-sdk-java/tree/master/service/iot-service-samples) | [Reference Documentation](/java/api/com.microsoft.azure.sdk.iot.service)

**JavaScript IoT Hub Service SDK**: [GitHub Repository](https://github.com/Azure/azure-iot-sdk-node/tree/master/service) | [Package](https://www.npmjs.com/package/azure-iothub) | [Samples](https://github.com/Azure/azure-iot-sdk-node/tree/master/service/samples) | [Reference Documentation](/javascript/api/azure-iothub/)

**Python IoT Hub Service SDK**: [GitHub Repository](https://github.com/Azure/azure-iot-sdk-python/tree/master/azure-iot-hub) | [Package](https://pypi.python.org/pypi/azure-iot-hub/) | [Samples](https://github.com/Azure/azure-iot-sdk-python/tree/master/azure-iot-hub/samples) | [Reference Documentation](/python/api/azure-iot-hub)

#### Azure Digital Twins

Azure Digital Twins is a platform as a service (PaaS) offering that enables the creation of knowledge graphs based on digital models of entire environments. These environments could be buildings, factories, farms, energy networks, railways, stadiums, and more—even entire cities. These digital models can be used to gain insights that drive better products, optimized operations, reduced costs, and breakthrough customer experiences. Azure IoT offers service SDKs to make it easy to build applications that use the power of Azure Digital Twins.

[**Learn more about Azure Digital Twins**](https://azure.microsoft.com/services/digital-twins/) | [**Code an ADT application**](../digital-twins/tutorial-code.md)

**C# ADT Service SDK**: [GitHub Repository](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/digitaltwins/Azure.DigitalTwins.Core) | [Package](https://www.nuget.org/packages/Azure.DigitalTwins.Core) | [Samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/digitaltwins/Azure.DigitalTwins.Core/samples) | [Reference Documentation](/dotnet/api/overview/azure/digitaltwins/client)

**Java ADT Service SDK**: [GitHub Repository](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/digitaltwins/azure-digitaltwins-core) | [Package](https://search.maven.org/artifact/com.azure/azure-digitaltwins-core/1.0.0/jar) | [Samples](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/digitaltwins/azure-digitaltwins-core/src/samples) | [Reference Documentation](/java/api/overview/azure/digitaltwins/client)

**Node.js ADT Service SDK**: [GitHub Repository](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/digitaltwins/digital-twins-core) | [Package](https://www.npmjs.com/package/@azure/digital-twins-core) | [Samples](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/digitaltwins/digital-twins-core/samples) | [Reference Documentation](/javascript/api/@azure/digital-twins-core/)

**Python ADT Service SDK**: [GitHub Repository](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/digitaltwins/azure-digitaltwins-core) | [Package](https://pypi.org/project/azure-digitaltwins-core/) | [Samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/digitaltwins/azure-digitaltwins-core/samples) | [Reference Documentation](/python/api/azure-digitaltwins-core/azure.digitaltwins.core)

#### Device Provisioning Service

The IoT Hub Device Provisioning Service (DPS) is a helper service for IoT Hub that enables zero-touch, just-in-time provisioning to the right IoT hub without requiring human intervention. DPS enables the provisioning of millions of devices in a secure and scalable way. The DPS Service SDKs allow you to build applications that can securely manage your devices by creating enrollment groups and doing bulk operations.

[**Learn more about the Device Provisioning Service**](../iot-dps/index.yml) | [**Try creating a group enrollment for X.509 Devices**](../iot-dps/quick-enroll-device-x509-csharp.md)

**C# Device Provisioning Service SDK**: [GitHub Repository](https://github.com/Azure/azure-iot-sdk-csharp/tree/master/provisioning/service) | [Package](https://www.nuget.org/packages/Microsoft.Azure.Devices.Provisioning.Service/) | [Samples](https://github.com/Azure/azure-iot-sdk-csharp/tree/master/provisioning/service/samples) | [Reference Documentation](/dotnet/api/microsoft.azure.devices.provisioning.service)

**Java Device Provisioning Service SDK**: [GitHub Repository](https://github.com/Azure/azure-iot-sdk-java/tree/master/provisioning/provisioning-service-client/src) | [Package](https://mvnrepository.com/artifact/com.microsoft.azure.sdk.iot.provisioning/provisioning-service-client) | [Samples](https://github.com/Azure/azure-iot-sdk-java/tree/master/provisioning/provisioning-samples#provisioning-service-client) | [Reference Documentation](/java/api/com.microsoft.azure.sdk.iot.provisioning.service)

**Node.js Device Provisioning Service SDK**: [GitHub Repository](https://github.com/Azure/azure-iot-sdk-node/tree/master/provisioning/service) | [Package](https://www.npmjs.com/package/azure-iot-provisioning-service) | [Samples](https://github.com/Azure/azure-iot-sdk-node/tree/master/provisioning/service/samples) | [Reference Documentation](/javascript/api/azure-iot-provisioning-service)

## Next Steps

* [Quickstart: Connect a device to IoT Central (Python)](quickstart-send-telemetry-python.md)
* [Quickstart: Connect a device to IoT Hub (Python)](quickstart-send-telemetry-cli-python.md)
* [Get started with embedded development](quickstart-device-development.md)
* Learn more about the [benefits of developing using Azure IoT SDKs](https://azure.microsoft.com/blog/benefits-of-using-the-azure-iot-sdks-in-your-azure-iot-solution/)