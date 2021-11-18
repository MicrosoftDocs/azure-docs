---
title: What's new in Azure Defender for IoT for device builders
description: Learn about the latest releases, and the newest features for Defender for IoT device builders.
ms.topic: overview
ms.date: 11/09/2021
---

# What's new in Azure Defender for IoT for device builders?  

[!INCLUDE [Banner for top of topics](../includes/banner.md)]

This article lists new features and feature enhancements for Defender for IoT.

Noted features are in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include other legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Versioning and support for Azure Defender for IoT

Listed below are the support, breaking change policies for Defender for IoT, and the versions of Azure Defender for IoT that are currently available.

## September 2021

**Version 3.11**:

- **[Login collector](concept-event-aggregation.md#login-collector-event-based-collector)** - The login collectors gather user logins, logouts, and failed login attempts. Such as SSH & telnet.

- **[System information collector](concept-event-aggregation.md#system-information-trigger-based-collector)** - The system information collector gatherers information related to the device’s operating system and hardware details.

- **[Event aggregation](concept-event-aggregation.md#how-does-event-aggregation-work)** - The Defender for IoT agent aggregates events such as process, login, network events that reduce the number of messages sent and costs, all while maintaining your device's security.  

- **[Twin configuration](concept-micro-agent-configuration.md)** - The micro agent's behavior is configured by a set of module twin properties. (e.g event sending frequency and Aggregation mode). You can configure the micro agent to best suit your needs.

## March 2021

### Device builder - new micro agent (Public preview)

A new device builder module is available. The module, referred to as a micro-agent, allows:

- **Integration with Azure IoT Hub and Azure Defender for IoT** - build stronger endpoint security directly into your IoT devices by integrating it with the monitoring option provided by both the Azure IoT Hub and Azure Defender for IoT.

- **Flexible deployment options with support for standard IoT operating systems** - can be deployed either as a binary package or as modifiable source code, with support for standard IoT operating systems like Linux and Azure RTOS.

- **Minimal resource requirements with no OS kernel dependencies** - small footprint, low CPU consumption, and no OS kernel dependencies.

- **Security posture management** – proactively monitor the security posture of your IoT devices.

- **Continuous, real-time IoT/OT threat detection** - detect threats such as botnets, brute force attempts, crypto miners, and suspicious network activity

The deprecated Defender-IoT-micro-agent documentation will be moved to the *Agent-based solution for device builders>Classic* folder.

This feature set is available with the current public preview cloud release.

## Next steps

[What is agent-based solution for device builders](architecture-agent-based.md)
