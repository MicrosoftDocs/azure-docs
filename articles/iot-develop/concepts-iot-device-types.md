---
title: Overview of Azure IoT device types
description: Learn the different device types supported by Azure IoT and the tools available.
author: ryanwinter
ms.author: rywinter
ms.service: iot-develop
ms.topic: conceptual
ms.date: 01/11/2021
---

# Overview of Azure IoT device types
IoT devices exist across a broad platform of hardware devices. There are small 8-bit MCU all the way up to the latest x86 CPUs as found in a desktop computer. Many variables contribute to the decision on what type of hardware to choose for a IoT device and this article outlined some of the key difference.

## Key hardware differentiators
Some of the most important factors are cost, power consumption, networking and the inputs and outputs available on the device for interacting with the physical world.

* **Cost:** Smaller cheaper devices are typically used when mass producing the final product. However the trade-off is that development of the device can be more expensive given the highly constrained device. The development cost can be spread across all produced devices so the per unit development cost will be low.

* **Power:** How much power a device consumes is important if the device will be utilizing batteries and not connected to the power grid. Constrained devices have many options designed for this scenario so can often be a better choice to reduce the operating power use, and extend the battery life of the device.

* **Network Access:** There are many ways to connect a device to a cloud service. Ethernet, Wi-fi and cellular and some of the available options. The type of connection will depending on how and where the device is deployed and how it is used. For example, cellular can be an attractive option given the high coverage, however for high traffic devices this can an expensive. Hardwired ethernet, on the other hand, provides much cheaper data costs but with the downside of being fixed to a single location.

* **Input and Outputs:** The inputs and outputs available on the device directly impact the devices operating capabilities. A microcontroller will typcially have many I/O functions built directly into the chip and provides a wide choice of sensors to connect directly.

## Microcontrollers vs Microprocessors
IoT devices can be separated into two broad categories, microcontrollers (MCUs) and microprocessors (MPUs).

**MCUs** are less expensive and also simpler to operate than an MPUs. An MCU will contain many of the functions like memory, interfaces and I/O within the chip itself, while an MPU will draw this functionality from components in supporting chips. An MCU will typically either make use of Real-Time OS (RTOS) or run bare-metal (No OS) and provide real-time response and provide highly deterministic reactions to external events.

**MPUs** will typically run a general purpose OS, such as Windows, Linux, or MacOSX that provide a non-deterministic real-time response, where it provides no guarantee to when a task will be completed. 

Below is a table showing some of the defining differences between an MCU and an MPU based system:

||Microcontroller (MCU)|Microprocessor (MPU)|
|-|-|-|
|**CPU**|<span style="color:red">Less</span>|<span style="color:green">More</span>|
|**RAM**|<span style="color:red">Less</span>|<span style="color:green">More</span>|
|**Flash**|<span style="color:red">Less</span>|<span style="color:green">More</span>|
|**OS**|<span style="color:red">No or RTOS</span>|<span style="color:green">General Purpose</span>|
|**Development Difficulty**|<span style="color:red">Harder</span>|<span style="color:green">Easier</span>|
|**Power Consumption**|<span style="color:green">Lower</span>|<span style="color:red">Higher</span>|
|**Cost**|<span style="color:green">Lower</span>|<span style="color:red">Higher</span>|
|**Deterministic**|<span style="color:green">Yes</span>|<span style="color:red">No</span> - with exceptions|
|**Device Size**|<span style="color:green">Smaller</span>|<span style="color:red">Larger</span>|
