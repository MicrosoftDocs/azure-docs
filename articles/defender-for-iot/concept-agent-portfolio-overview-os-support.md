---
title: Agent portfolio overview and OS support (Preview)
description: Azure Defender for IoT provides a large portfolio of agents based on the device type. 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 1/20/2021
ms.topic: quickstart
ms.service: azure
---

# Agent portfolio overview and OS support (Preview)

Azure Defender for IoT provides a large portfolio of agents based on the device type. 

## Standalone agent

The standalone agent covers most of the Linux operating systems, which can be deployed as a binary package or as a source code that can be incorporated as part of the firmware and allow modification and customization based on customer needs. An example of OS support: 

| Operating system | AMD64 | ARM32v7 |
|--|--|--|
| Debian 9 | ✓ | ✓ |
| Ubuntu 18.04 | ✓ |  |
| Ubuntu 20.04 | ✓ |  |

For more details, operating system support, or to request access to the source code so you can incorporate it as a part of the device's firmware, contact your account manager, or send an email to <defender_micro_agent@microsoft.com>. 

## Azure RTOS micro agent

The Azure Defender for IoT micro agent provides a comprehensive and lightweight security solution for devices that use Azure RTOS. Azure Defender for IoT micro agent provides coverage for common threats, and potential malicious activities on real-time operating system (RTOS) devices. The micro agent comes built in as part of the Azure RTOS NetX Duo component, and monitors the device's network activity. 

The Azure Defender for IoT micro agent comes built in as part of the Azure RTOS NetX Duo component, and monitors the device's network activity. The micro agent consists of a comprehensive and lightweight security solution that provides coverage for common threats, and potential malicious activities on a real-time operating system (RTOS) devices.

## Next steps

Learn more about the [Standalone micro agent overview (Preview)](concept-standalone-micro-agent-overview.md).