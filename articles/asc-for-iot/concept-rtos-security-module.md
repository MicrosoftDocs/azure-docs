---
title: Azure RTOS IoT security module 
description: Learn about the Azure RTOS IoT security module concepts and workflow.
services: asc-for-iot
ms.service: asc-for-iot
documentationcenter: na
author: mlottner
manager: rkarlin
editor: ''


ms.subservice: asc-for-iot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/06/2020
ms.author: mlottner
---

# Azure Security Center for IoT, Azure RTOS security module (preview)

Get a better understanding of the Azure Security Center for IoT security module delivered with Azure RTOS, including  features and benefits as well as links to relevant configuration and reference resources. 

## Azure RTOS IoT security module

Azure Security Center for IoT security module provides a comprehensive security solution for Azure RTOS devices as part of the NetxDuo offering. Within the NetXDuo offering, Azure RTOS ships with the Azure Security Center for IoT security module built-in, and provides coverage for common threats on real-time operating system devices once activated. 

The IoT security module offers the following features:

- **Detect malicious network activities**
- **Device behavior baselines based on custom alerts**
- **Improve device security hygiene**

## Azure RTOS NetX Duo

Azure RTOS NetX Duo is an advanced, industrial-grade TCP/IP network stack designed specifically for deeply embedded real-time and IoT applications. Azure RTOS NetX Duo is a dual IPv4 and IPv6 network stack providing a rich set of protocols, including security and cloud. Learn more about [Azure RTOS NetX Duo](https://aka.ms/netxduo) solutions.


## Azure RTOS IoT security module architecture

The Azure RTOS IoT security module is initialized by the Azure IoT middleware platform and uses IoT Hub clients to send security telemetry to the Hub.

:::image type="content" source="media/architecture/security_module_state_diagram.png" alt-text="Azure IoT security module state diagram and information flow":::

The Azure RTOS IoT security module monitors the following device activity and information:
- Device network activity **TCP**, **UDP, and **ICM**
- System information as **Threadx** and **NetX versions**
- Heartbeat events

Each IoT collector is linked to a priority group and each priority group has its own interval with possible values of **Low**, **Medium, and **High**. The intervals affect the time interval in which the data is collected and sent.

Azure Security Center for IoT security module for Azure RTOS is provided as a free download for your IoT devices. The Azure Security Center for IoT cloud service is available with a 30-day trial per Azure subscription. Download the security module now and let's get started. 


## Next steps

- Get started with Azure RTOS IoT security module [prerequisites and setup](quickstart-azure-rtos-security-module.md).
- Use the Azure RTOS IoT Security Module [reference API](azure-rtos-security-module-api.md).

