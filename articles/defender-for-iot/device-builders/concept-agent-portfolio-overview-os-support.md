---
title: Agent portfolio overview and OS support
description: Microsoft Defender for IoT provides a large portfolio of agents based on the device type. 
ms.date: 01/09/2022
ms.topic: conceptual
---

# Agent portfolio overview and OS support

Microsoft Defender for IoT provides a large portfolio of agents based on the device type.

## Standalone and Edge agent

Most of the Linux Operating Systems (OS) are covered by both agents. The agents can be deployed as a binary package, or as a source code that can be incorporated as part of the firmware. The customer can modify, and customize the agents as needed.  The following are some examples of supported OS:

| Operating system | AMD64 | ARM32v7 | ARM64 |
|--|--|--|
| Debian 9 | ✓ | ✓ | |
| Debian 10| ✓ | ✓ | ✓ |
| Debian 11| ✓ | ✓ | |
| Ubuntu 18.04 | ✓ | ✓ | ✓ |
| Ubuntu 20.04 | ✓ | ✓ | ✓ |
| Ubuntu 22.04 | ✓ |  |  |

The Defender for IoT micro agent also supports Yocto as an open source.

For additional information on supported operating systems, or to request access to the source code so you can incorporate it as a part of the device's firmware, contact your account manager.

For a more granular view of the micro agent-operating system dependencies, see [Linux dependencies](concept-micro-agent-linux-dependencies.md#linux-dependencies).

## Azure RTOS micro agent

The Microsoft Defender for IoT micro agent comes built in as part of the Azure RTOS NetX Duo component, and monitors the device's network activity. The micro agent consists of a comprehensive and lightweight security solution that provides coverage for common threats, and potential malicious activities on a real-time operating system (RTOS) devices.

## Next steps

Learn more about [Micro agent Linux dependencies](concept-micro-agent-linux-dependencies.md).

Learn more about the [Standalone micro agent overview](concept-standalone-micro-agent-overview.md).
