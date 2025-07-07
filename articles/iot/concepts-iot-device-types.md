---
title: Overview of Azure IoT device types
description: Learn about the different device types supported by Azure IoT and how to choose the right one for your solution.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot
ms.topic: conceptual
ms.date: 03/13/2025
---

# Overview of Azure IoT device types

IoT devices exist across a broad selection of hardware platforms. There are small 8-bit microcontrollers all the way up to the latest x86 CPUs as found in desktop computers. There are many variables to consider when you choose the hardware for an IoT device. This article outlines some of the key factors to consider.

## Key hardware differentiators

The key factors to consider when you choose your hardware are cost, power consumption, networking, and available inputs and outputs:

* **Cost:** Smaller cheaper devices are typically used when mass producing the final product. However the trade-off is that development of the device can be more expensive given the highly constrained device. The development cost can be spread across all produced devices so the per unit development cost is low.

* **Power:** How much power a device consumes is important if the device uses batteries and isn't connected to the power grid. Microcontrollers are often designed for lower power scenarios and can be a better choice for extending battery life.

* **Network Access:** There are many ways to connect a device to a cloud service such as Ethernet, Wi-Fi, and cellular. The connection type you choose depends on where the device is deployed and how it's used. For example, cellular is a good option if you need high coverage, but for high traffic devices it might be expensive. Hardwired ethernet provides cheaper data costs but with the downside of being less portable.

* **Input and Outputs:** The inputs and outputs available on the device directly affect the devices operating capabilities. A microcontroller typically has many I/O functions built directly into the chip and provides a wide choice of sensors to connect directly.

## Microcontrollers and microprocessors

You can divide IoT devices into two broad categories, microcontrollers (MCUs) and microprocessors (MPUs).

**MCUs** are less expensive and simpler to operate than MPUs. An MCU typically contains many of the functions, such as memory, interfaces, and I/O, within the chip itself. An MPU typically access this functionality from components in supporting chips. An MCU often uses a real-time OS (RTOS) or runs bare-metal (no OS) and provides real-time responses and highly deterministic reactions to external events.

**MPUs** typically run a general purpose OS, such as Windows, Linux, or MacOSX that provides a nondeterministic real-time response. There's typically no guarantee as to when a task will complete.

:::image type="content" border="false" source="media/concepts-iot-device-types/mcu-vs-mpu.png" alt-text="MCU vs MPU":::

The following table shows some of the key differences between MCU and MPU based systems:

|| MCU | MPU |
|-|-|-|
|**CPU**| Less | More |
|**RAM**| Less | More |
|**Flash**| Less | More |
|**OS**| Bare Metal / RTOS | General Purpose (Windows / Linux) |
|**Development Difficulty**| Harder | Easier |
|**Power Consumption**| Lower | Higher |
|**Cost**| Lower | Higher |
|**Deterministic**| Yes | No - with exceptions |
|**Device Size**| Smaller | Larger |

## Next steps

The IoT device type that you choose directly impacts how the device connects to Azure IoT. Browse the different [Azure IoT SDKs](./iot-sdks.md) to find the one that best suits your device needs.
