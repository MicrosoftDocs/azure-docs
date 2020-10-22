---
title: Components & prerequisites
description: Details of everything needed to get started with Azure Defender for IoT service prerequisites.
services: defender-for-iot
ms.service: defender-for-iot
documentationcenter: na
author: rkarlin
manager: rkarlin
editor: ''


ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/07/2020
ms.author: rkarlin
ms.custom: references_regions
---

# Azure Defender for IoT prerequisites

This article provides an explanation of the different components of the Defender for IoT service, what you need to begin, and explains the basic concepts to help understand the service.

## Minimum requirements

- Agentless monitoring for IoT and OT devices (based on CyberX technology)
    - Network switches supporting traffic monitoring via SPAN port
    - Hardware appliances for NTA sensor, for more information see [certified hardware](https://aka.ms/AzureDefenderforIoTBareMetalAppliance)
    - Azure Subscription **Contributor** role (required only during onboarding for defining committed devices)
    - IoT Hub (Free or Standard tier) **Contributor** role (for cloud connected management)
- Security for managed IoT devices managed via Azure IoT Hub
    - IoT Hub (Standard tier) **Contributor** role
    - IoT Hub: **Azure Defender for IoT** feature toggle should be enabled
    - For device level security module support  
        - Defender for IoT agents supports a growing list of devices and platforms, see the [supported platform list](how-to-deploy-agent.md)


## Supported service regions

See [IoT Hub supported regions](https://azure.microsoft.com/global-infrastructure/services/?products=iot-hub) for more information. 

Defender for IoT routes all traffic from all European regions to the West Europe regional data center and all remaining regions to the Central US regional data center.

## Next steps

- Read the Azure IoT Security [Overview](overview.md)
- Learn how to [Enable the service](quickstart-onboard-iot-hub.md)
- Read the [Defender for IoT FAQ](resources-frequently-asked-questions.md)
- Explore how to [Understand Defender for IoT alerts](concept-security-alerts.md)
