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
IoT devices exist across a broad platform of hardware devices. From a small 8-bit MCU to the latest x86 CPUs like those present in a desktop computer. Many variables contribute to the decision on what type of hardware to choose for a IoT device.

Some of the most important factors are cost, power consumption, and how it interacts with the physical world.

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
|**Deterministic**|<span style="color:green">Yes</span>|<span style="color:red">No</span>|
|**Device Size**|<span style="color:green">Smaller</span>|<span style="color:red">Larger</span>|

## Device scenarios
For device such as a temperature sensor, where the production volumes fall into the hundred thousands, the cost of device may be the major factor.

For a device where the volumes are low, choosing a higher-order language could cut down development costs, at the sacrifice of a larger more expensive device.

