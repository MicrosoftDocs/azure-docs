---
title: System prerequisites
description: The system prerequisites needed to run Azure Defender for IoT
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/30/2020
ms.topic: quickstart
ms.service: azure
---

# System prerequisites
## Minimum requirements

- Network switches supporting traffic monitoring via SPAN port
- Hardware appliances for NTA sensor.
- Azure Subscription Contributor role (required only during onboarding for defining committed devices and connection to Azure Sentinel)
- IoT Hub (Free or Standard tier) **Contributor** role (for cloud connected management)
- IoT Hub: **Azure Defender for IoT** feature toggle should be enabled
- For device level security module support, Defender for IoT agents supports a growing list of devices and platforms, see the [supported platform list](how-to-deploy-agent.md).

## Supported service regions

For more information see, [IoT Hub supported regions](https://azure.microsoft.com/global-infrastructure/services/?products=iot-hub) 

Defender for IoT routes all traffic from all European regions to the West Europe regional data center and all remaining regions to the Central US regional data center.

## See also

- [Acquire hardware and software](how-to-acquire-hardware-and-software.md)
- [About Azure Defender for IoT Network Setup](how-to-set-up-your-network.md)