---
title: Support for Sparkplug B in Azure Event Grid MQTT Broker
ms.reviewer: spelluru
description: Discover how Azure Event Grid Message Queueing Transport Telemetry (MQTT) broker supports Sparkplug B for industrial IoT, enabling standardized messaging, device lifecycle management, and state awareness.
#customer intent: As an industrial IoT developer, I want to understand how Azure Event Grid MQTT broker supports Sparkplug B so that I can implement standardized messaging and device lifecycle management in my solutions.
ms.date: 09/23/2025
ms.topic: concept-article
ms.service: azure-event-grid
ms.subservice: mqtt
ms.custom: template-concept
author: Connected-Seth
ms.author: seshanmugam
---


# Support for Sparkplug B specification in Azure Event Grid MQTT Broker

Azure Event Grid MQTT broker now supports **Sparkplug B**, an open-source specification widely used across industrial IoT (IIoT) and Industry 4.0 solutions. Sparkplug B builds on top of the MQTT protocol, providing a standardized framework for message structure, device lifecycle management, and state awareness. By adding features such as **QoS 1**, **Retain messages**, and **Last Will and Testament (LWT)**, Event Grid MQTT broker enables customers to run Sparkplug B–compliant workloads natively in Azure.

This article explains what the Sparkplug B specification is and how Azure Event Grid supports the specification. 

## What is Sparkplug B?

Sparkplug B is an **open-source MQTT-based specification** designed by the Eclipse Foundation. While MQTT provides a lightweight, publish/subscribe messaging protocol, Sparkplug B adds standardization on **payload definitions**, **device lifecycle state management**, and **topic structures**. It ensures interoperability and consistent communication between industrial devices, gateways, and SCADA/MES/ERP systems.

Key aspects of Sparkplug B include:

- **Defined topic namespace**: Standard topic structures ensure messages are organized consistently across vendors and systems.
- **Standardized payloads**: Device metrics, states, and commands are encoded in a common format, making it easier to integrate and analyze.
- **State management**: This specification uses **LWT** and **birth/death certificates** to provide system-wide awareness of device availability and health.

## Why Sparkplug B is important

In industrial environments, **reliability, consistency, and interoperability** are critical. While plain MQTT provides flexible messaging, different vendors often use proprietary topic structures and payloads. This specification solves it by defining an **open and common data model**.

This approach is important because it:

- Reduces integration costs across equipment from multiple vendors.
- Ensures **state awareness** of all connected devices, which is vital for safety and operational efficiency.
- Improves scalability for **large distributed industrial systems** where consistent data handling is required.
- Accelerates adoption of **Industry 4.0 and digital manufacturing** solutions by aligning with open standards.

## Industries using Sparkplug B

Sparkplug B adoption spans several industries where **industrial automation** and **real-time telemetry** are essential:

- **Manufacturing**: Smart factories use the specification for machine-to-cloud and machine-to-machine communication.
- **Energy & Utilities**: Power plants, renewable energy farms, and grid operators use the specification for monitoring, diagnostics, and optimization.
- **Automotive**: Assembly lines and connected vehicle systems rely on the specification for data interoperability across equipment and plants.
- **Oil & Gas**: Critical infrastructure uses the specification to ensure reliable data flow from edge devices to cloud control systems.
- **Building automation**: Heating, Ventilation, and Air Conditioning (HVAC), lighting, and security systems use the specification for standardized monitoring and control.

:::image type="content" source="./media/sparkplug-support/specification-support.png" alt-text="Diagram that shows how Azure Event Grid MQTT broker supports the specification." lightbox="./media/sparkplug-support/specification-support.png":::

## How Azure Event Grid MQTT broker supports Sparkplug B

Azure Event Grid MQTT broker now provides the foundational MQTT features that enable Sparkplug B–compliant workloads:

- **[QoS 1 (At least once delivery)](mqtt-support.md#quality-of-service)**  
  Ensures reliable message delivery, which is required by the specification to guarantee that critical device metrics and commands are delivered across distributed systems.

- **[Retain messages](mqtt-retain.md)**  
  Allows the broker to store the last known good value of a topic. This feature is crucial in the specification for ensuring new subscribers always receive the most recent device state or metric.

- **[Last Will and Testament (LWT)](mqtt-support.md#last-will-and-testament-messages)**  
  Provides system-wide awareness of device availability by notifying when a client disconnects unexpectedly. This supports specification's birth/death certificate mechanism, which keeps the system aware of live vs. offline devices.

- **Native support for binary Sparkplug payloads** over secure Transport Layer Security (TLS).

Together, these features enable customers to run **end-to-end Sparkplug B scenarios natively on Azure**, including:

- Edge-to-cloud telemetry from machines and gateways.
- Device state monitoring with real-time availability.
- Interoperable industrial systems that can scale across regions and vendors.

With support for Sparkplug B, Azure Event Grid MQTT broker extends its capabilities to meet the needs of **industrial automation, manufacturing, and energy customers** who require reliable, standardized, and interoperable communication.

By combining **QoS 1**, **Retain**, and **LWT** with Event Grid's serverless event routing, customers can now deploy **Sparkplug B–compliant IIoT solutions** directly on Azure—helping accelerate Industry 4.0 adoption at global scale.

## Next steps

- [MQTT support overview](mqtt-support.md)
- [MQTT retain feature](mqtt-retain.md)