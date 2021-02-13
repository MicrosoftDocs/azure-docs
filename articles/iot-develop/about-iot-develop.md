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

Azure IoT is a collection of managed and platform services that connect, monitor, and control your IoT devices. 

Azure IoT devices are the basic building blocks of an IoT solution and are responsible for observing and interacting with their environment.

## Choosing your hardware

There are many different types of IoT devices, and it isn't always clear what a device actually is. 

For more information on the difference between devices types covered in this article, read [About IoT Device Types](concepts-iot-device-types.md).


## Types of device development
There are two types of Device Development paths covered in this article:

* **Device application development:** Aligns with modern development practices, targets many of the higher-order languages, and executes on a general-purpose operating system such as Windows or Linux.

* **Embedded device development:** Describes development targeting resource constrained devices. A resource constrained device will often be used to reduce per unit costs, power consumption, or device size. These devices have direct control over the hardware platform they execute on.

### Device application development
Device application developers are adapting existing devices to connect to the cloud and integrate into their IoT solutions. These devices can support higher-order language runtimes, such as C# or Python, and often support a robust general purpose operating system such as Windows or Linux. Common target devices include PCs, Containers, Raspberry Pis and mobile devices. 

Rather than developing constrained devices at scale, these developers are focused on enabling a specific IoT scenario required by their cloud solution. Some of these developers will also work on constrained devices for their cloud solution, and if that is you, we recommend you explore the [Embedded Device Development](#embedded-device-development) path below.

> [!TIP]
> See the [Device Application Development SDKs](about-iot-sdks.md) to get started.

### Embedded device development
Embedded development targets constrained device, devices with limited memory and processing, which can restrict what can be achieved compared to a traditional development platform.

An embedded device will typically utilize either a real-time operating system (RTOS) or no operating system at all. Embedded devices have full control over their hardware, due to the lack of a general purpose operating system, making them a good choice for real-time systems.

The current embedded SDKs target the **C** language and provide either no operating system or RTOS support. They have been designed specifically with embedded targets in mind with concepts such as maintaining a minimal footprint and a non memory allocating design.

If your device is able to run a general-purpose operating system, we recommend following the [Device Application Development](#device-application-development) path as it provides a richer development experience.

> [!TIP]
> See the [Embedded Device Development SDKs](about-iot-sdks.md) to get started.
