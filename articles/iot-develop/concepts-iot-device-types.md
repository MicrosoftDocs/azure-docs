---
title: Overview of Azure IoT device types
description: Learn the different device types supported by Azure IoT and the tools available.
author: ryanwinter
ms.author: rywinter
ms.service: iot-develop
ms.topic: conceptual
ms.date: 10/07/2022
ms.custom: engagement-fy23
---

# Overview of Azure IoT device types
IoT devices exist across a broad selection of hardware platforms. There are small 8-bit MCUs all the way up to the latest x86 CPUs as found in a desktop computer. Many variables factor into the decision for which hardware you to choose for a IoT device and this article outlined some of the key differences.

## Key hardware differentiators
Some important factors when choosing your hardware are cost, power consumption, networking, and available inputs and outputs.

* **Cost:** Smaller cheaper devices are typically used when mass producing the final product. However the trade-off is that development of the device can be more expensive given the highly constrained device. The development cost can be spread across all produced devices so the per unit development cost will be low.

* **Power:** How much power a device consumes is important if the device will be utilizing batteries and not connected to the power grid. MCUs are often designed for lower power scenarios and can be a better choice for extending battery life.

* **Network Access:** There are many ways to connect a device to a cloud service. Ethernet, Wi-fi and cellular and some of the available options. The connection type you choose will depend on where the device is deployed and how it's used. For example, cellular can be an attractive option given the high coverage, however for high traffic devices it can an expensive. Hardwired ethernet provides cheaper data costs but with the downside of being less portable.

* **Input and Outputs:** The inputs and outputs available on the device directly affect the devices operating capabilities. A microcontroller will typically have many I/O functions built directly into the chip and provides a wide choice of sensors to connect directly.

## Microcontrollers vs Microprocessors
IoT devices can be separated into two broad categories, microcontrollers (MCUs) and microprocessors (MPUs).

**MCUs** are less expensive and simpler to operate than MPUs. An MCU will contain many of the functions, such as memory, interfaces, and I/O within the chip itself. An MPU will draw this functionality from components in supporting chips. An MCU will often use a real-time OS (RTOS) or run bare-metal (No OS) and provide real-time response and highly deterministic reactions to external events.

**MPUs** will generally run a general purpose OS, such as Windows, Linux, or MacOSX that provide a non-deterministic real-time response. There's typically no guarantee to when a task will be completed. 

:::image type="content" border="false" source="media/concepts-iot-device-types/mcu-vs-mpu.png" alt-text="MCU vs MPU":::

Below is a table showing some of the defining differences between an MCU and an MPU based system:

||Microcontroller (MCU)|Microprocessor (MPU)|
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
The IoT device type that you choose directly impacts how the device is connected to Azure IoT.

Browse the different [Azure IoT SDKs](about-iot-sdks.md) to find the one that best suits your device needs.
