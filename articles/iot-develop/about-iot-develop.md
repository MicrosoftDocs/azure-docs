---
title: Introduction to Azure IoT device and application development
description: Learn how to use Azure IoT to do embedded device development and build device-enabled cloud applications.
author: ryanwinter
ms.author: rywinter
ms.service: iot-develop
ms.topic: overview 
ms.date: 01/11/2021
---

# What is Azure IoT device and application development?

Azure IoT is a collection of managed and platform services that connect, monitor, and control your IoT devices. Azure IoT offers developers a comprehensive set of options. Your options include device platforms, supporting cloud services, SDKs, and tools for building device-enabled cloud applications.

This article overviews several key considerations for developers who are getting started with Azure IoT. These concepts will orient you, as an IoT device developer, to your Azure IoT options and how to begin. Specifically, the article overviews these concepts:
- [Understanding device development roles](#device-development-roles)
- [Choosing your hardware](#choosing-your-hardware)
- [Choosing an SDK](#choosing-an-sdk)
- [Selecting connection options](#selecting-connection-options)

## Device development roles
This article discusses two common roles that you can observe among device developers. As used here, a role is a collection of related development tasks. It's useful to understand what type of development role you're currently working in. Your role impacts many development choices you make.

* **Device application development:** Aligns with modern development practices, targets many of the higher-order languages, and executes on a general-purpose operating system such as Windows or Linux.

* **Embedded device development:** Describes development targeting resource constrained devices. A resource constrained device will often be used to reduce per unit costs, power consumption, or device size. These devices have direct control over the hardware platform they execute on.

### Device application development
Device application developers are adapting existing devices to connect to the cloud and integrate into their IoT solutions. These devices can support higher-order languages, such as C# or Python, and often support a robust general purpose operating system such as Windows or Linux. Common target devices include PCs, Containers, Raspberry Pis, and mobile devices. 

Rather than develop constrained devices at scale, these developers focus on enabling a specific IoT scenario required by their cloud solution. Some of these developers will also work on constrained devices for their cloud solution. For developers working with constrained devices, see [Embedded Device Development](#embedded-device-development) path below.

> [!TIP]
> See the [Unconstrained Device SDKs](about-iot-sdks.md#unconstrained-device-sdks) to get started.

### Embedded device development
Embedded development targets constrained devices that have limited memory and processing. Constrained devices restrict what can be achieved compared to a traditional development platform.

Embedded devices typically use a real-time operating system (RTOS), or no operating system at all. Embedded devices have full control over their hardware, due to the lack of a general purpose operating system. That fact makes embedded devices a good choice for real-time systems.

The current embedded SDKs target the **C** language. The embedded SDKs provide either no operating system, or Azure RTOS support. They are designed with embedded targets in mind. The design considerations include the need for a minimal footprint, and a non-memory allocating design.

If your device is able to run a general-purpose operating system, we recommend following the [Device Application Development](#device-application-development) path. It provides a richer set of development options.

> [!TIP]
> See the [Constrained Device SDKs](about-iot-sdks.md#constrained-device-sdks) to get started.

## Choosing your hardware
Azure IoT devices are the basic building blocks of an IoT solution and are responsible for observing and interacting with their environment. There are many different types of IoT devices, and it's helpful to understand the kinds of devices that exist and how these can impact your development process.

For more information on the difference between devices types covered in this article, read [About IoT Device Types](concepts-iot-device-types.md).

## Choosing an SDK
As an Azure IoT device developer, you have a diverse set of device SDKs, and Azure service SDKs, to help you build device-enabled cloud applications. The SDKs will streamline your development effort and simplify much of the complexity of connecting and managing devices. 

As indicated in the [Device development roles](#device-development-roles) section, there are three kinds of IoT SDKs for device development:
- Embedded device SDKs (for constrained devices)
- Device SDKs (for using higher order languages to connect existing devices to IoT applications)
- Service SDKs (for building Azure IoT solutions that connect devices to services)

To learn more about choosing an Azure IoT device or service SDK, see [Overview of Azure IoT Device SDKs](about-iot-sdks.md).

## Selecting connection options
An important step in the development process is choosing the set of options you will use to connect and manage your devices. There are two critical aspects to consider:
- Choosing an IoT application platform to host your devices. For Azure IoT, this means choosing IoT Hub or IoT Central.
- Choosing developer tools to help you connect, manage, and monitor devices.

To learn more about selecting an application platform and tools, see [Overview: Connection options for Azure IoT device developers](concepts-overview-connection-options.md).

## Next steps
Select one of the following quickstart series that is most relevant to your development role. These articles demonstrate the basics of creating an Azure IoT application to host devices, using an SDK, connecting a device, and sending telemetry.  
- For device application development:  [Quickstart: Send telemetry from a device to Azure IoT Central](quickstart-send-telemetry-python.md)
- For embedded device development: [Getting started with Azure IoT embedded device development](quickstart-device-development.md)
