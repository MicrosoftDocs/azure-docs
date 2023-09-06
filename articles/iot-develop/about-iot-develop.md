---
title: Introduction to Azure IoT device development
description: Learn how to use Azure IoT to do embedded device development and build device-enabled cloud applications.
author: timlt
ms.author: timlt
ms.service: iot-develop
ms.topic: overview
ms.date: 05/08/2023
---

# What is Azure IoT device development?

Azure IoT is a collection of managed and platform services that connect, monitor, and control your IoT devices. Azure IoT offers developers a comprehensive set of options. Your options include device platforms, supporting cloud services, SDKs, MQTT support, and tools for building device-enabled cloud applications.

This article overviews several key considerations for developers who are getting started with Azure IoT.  
- [Understanding device development paths](#device-development-paths)
- [Choosing your hardware](#choosing-your-hardware)
- [Choosing an SDK](#choosing-an-sdk)
- [Selecting a service to connect device](#selecting-a-service)
- [Tools to connect and manage devices](#tools-to-connect-and-manage-devices)

## Device development paths
This article discusses two common device development paths. Each path includes a set of related development options and tasks.  

* **General device development:** Aligns with modern development practices, targets higher-order languages, and executes on a general-purpose operating system such as Windows or Linux. 
    > [!NOTE]
    > If your device is able to run a general-purpose operating system, we recommend following the [General device development](#general-device-development) path. It provides a richer set of development options.

* **Embedded device development:** Describes development targeting resource constrained devices. Often you use a resource-constrained device to reduce per unit costs, power consumption, or device size. These devices have direct control over the hardware platform they execute on.

### General device development
Some developers adapt existing, general purpose devices to connect to the cloud and integrate into their IoT solutions. These devices can support higher-order languages, such as C# or Python, and often support a robust general purpose operating system such as Windows or Linux. Common target devices include PCs, Containers, Raspberry Pis, and mobile devices. 

Rather than develop constrained devices at scale, general device developers focus on enabling a specific IoT scenario required by their cloud solution. Some developers also work on constrained devices for their cloud solution. For developers working with resource constrained devices, see the [Embedded Device Development](#embedded-device-development) path.

> [!IMPORTANT]
> For information on SDKs to use for general device development, see the [Device SDKs](about-iot-sdks.md#device-sdks).

### Embedded device development
Embedded development targets constrained devices that have limited memory and processing. Constrained devices restrict what can be achieved compared to a traditional development platform.

Embedded devices typically use a real-time operating system (RTOS), or no operating system at all. Embedded devices have full control over their hardware, due to the lack of a general purpose operating system. That fact makes embedded devices a good choice for real-time systems.

The current embedded SDKs target the **C** language. The embedded SDKs provide either no operating system, or Azure RTOS support. They're designed with embedded targets in mind. The design considerations include the need for a minimal footprint, and a nonmemory allocating design.

> [!IMPORTANT]
> For information on SDKs to use with embedded device development, see the [Embedded device SDKs](about-iot-sdks.md#embedded-device-sdks).

## Choosing your hardware
Azure IoT devices are the basic building blocks of an IoT solution and are responsible for observing and interacting with their environment. There are many different types of IoT devices, and it's helpful to understand the kinds of devices that exist and how they can affect your development process.

For more information on the difference between devices types covered in this article, see [About IoT Device Types](concepts-iot-device-types.md).

## Choosing an SDK
As an Azure IoT device developer, you have a diverse set of SDKs, protocols and tools to help build device-enabled cloud applications. 

There are two main options to connect devices and communicate with IoT Hub:
- **Use the Azure IoT SDKs**. In most cases, we recommend that you use the Azure IoT SDKs versus using MQTT directly. The SDKs streamline your development effort and simplify the complexity of connecting and managing devices. IoT Hub supports the [MQTT v3.1.1](https://mqtt.org/) protocol, and the IoT SDKs simplify the process of using MQTT to communicate with IoT Hub. 
- **Use the MQTT protocol directly**.  There are some advantages of building an IoT Hub solution to use MQTT directly. For example, a solution that uses MQTT directly without the SDKs can be built on the open MQTT standard. A standards-based approach makes the solution more portable, and gives you more control over how devices connect and communicate. However, IoT Hub isn't a full-featured MQTT broker and doesn't support all behaviors specified in the MQTT v3.1.1 standard. The partial support for MQTT v3.1.1 adds development cost and complexity.  Device developers should weigh the trade-offs of using the IoT device SDKs versus using MQTT directly.  For more information, see [Communicate with an IoT hub using the MQTT protocol](../iot/iot-mqtt-connect-to-iot-hub.md). 

There are three sets of IoT SDKs for device development:
- Device SDKs (for using higher order languages to connect existing general purpose devices to IoT applications)
- Embedded device SDKs (for connecting resource constrained devices to IoT applications)
- Service SDKs (for building Azure IoT solutions that connect devices to services)

To learn more about choosing an Azure IoT device or service SDK, see [Overview of Azure IoT Device SDKs](about-iot-sdks.md).

## Selecting a service
A key step in the development process is selecting a service to connect your devices to. There are two primary Azure IoT service options for connecting and managing devices: IoT Hub, and IoT Central. 

- [Azure IoT Hub](../iot-hub/about-iot-hub.md). Use Iot Hub to host IoT applications and connect devices. IoT Hub is a platform-as-a-service (PaaS) application that acts as a central message hub for bi-directional communication between IoT applications and connected devices. IoT Hub can scale to support millions of devices. Compared to other Azure IoT services, IoT Hub offers the greatest control and customization over your application design. It also offers the most developer tool options for working with the service, at the cost of some increase in development and management complexity.
- [Azure IoT Central](../iot-central/core/overview-iot-central.md). IoT Central is designed to simplify the process of working with IoT solutions.  You can use it as a proof of concept to evaluate your IoT solutions. IoT Central is a software-as-a-service (SaaS) application that provides a web UI to simplify the tasks of creating applications, and connecting and managing devices. IoT Central uses IoT Hub to create and manage applications, but keeps most details transparent to the user. 

## Tools to connect and manage devices

After you have selected hardware and a device SDK to use, you have several options of developer tools. You can use these tools to connect your device to IoT Hub, and manage them. The following table summarizes common tool options. 

|Tool  |Documentation  |Description  |
|---------|---------|---------|
|Azure portal     | [Create an IoT hub with Azure portal](../iot-hub/iot-hub-create-through-portal.md) | Browser-based portal for IoT Hub and devices. Also works with other Azure resources including IoT Central. |
|Azure IoT Explorer     | [Azure IoT Explorer](https://github.com/Azure/azure-iot-explorer#azure-iot-explorer-preview) | Can't create IoT hubs. Connects to an existing IoT hub to manage devices. Often used with CLI or Portal.|
|Azure CLI     | [Create an IoT hub with CLI](../iot-hub/iot-hub-create-using-cli.md) | Command-line interface for creating and managing IoT applications. |
|Azure PowerShell     | [Create an IoT hub with PowerShell](../iot-hub/iot-hub-create-using-powershell.md) | PowerShell interface for creating and managing IoT applications |
|Azure IoT Tools for VS Code  | [Create an IoT hub with Tools for VS Code](../iot-hub/iot-hub-create-use-iot-toolkit.md) | VS Code extension for IoT Hub applications. |

> [!NOTE]
> In addition to the previously listed tools, you can programmatically create and manage IoT applications by using REST API's, Azure SDKs, or Azure Resource Manager templates. Learn more in the [IoT Hub](../iot-hub/about-iot-hub.md) service documentation. 


## Next steps
To learn more about device SDKs you can use to connect devices to Azure IoT, see the following article.
- [Overview of Azure IoT Device SDKs](about-iot-sdks.md)

To get started with hands-on device development, select a device development quickstart that is relevant to the devices you're using. The following article overviews the available quickstarts.  Each quickstart shows how to create an Azure IoT application to host devices, use an SDK, connect a device, and send telemetry.  
- [Get started with Azure IoT device development](about-getting-started-device-development.md)