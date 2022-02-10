---
title: What's new in Microsoft Defender for IoT for device builders
description: Learn about the latest updates for Defender for IoT device builders.
ms.topic: conceptual
ms.date: 01/10/2022
---

# What's new  

[!INCLUDE [Banner for top of topics](../includes/banner.md)]

This article lists new features and feature enhancements in Microsoft Defender for IoT for device builders.

Noted features are in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include other legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Versioning and support

Listed below are the support, breaking change policies for Defender for IoT, and the versions of Defender for IoT that are currently available.

## November 2021

**Version 3.13.1**:

- DNS network activity on managed devices is now supported. Microsoft threat intelligence security graph can now detect suspicious activity based on DNS traffic.

- [Leaf device proxying](../../iot-edge/how-to-connect-downstream-iot-edge-device.md#integrate-microsoft-defender-for-iot-with-iot-edge-gateway): There is now an enhanced integration with IoT Edge. This integration enhances the connectivity between the agent, and the cloud using leaf device proxying.

## October 2021

**Version 3.12.2**:

- More CIS benchmark checks are now supported for Debian 9: These extra checks allow you to make sure your network is compliant with the CIS best practices used to protect against pervasive cyber threats.

- **[Twin configuration](concept-micro-agent-configuration.md)**: The micro agent’s behavior is configured by a set of module twin properties. You can configure the micro agent to best suit your needs.

## September 2021

**Version 3.11**:

- **[Login collector](concept-event-aggregation.md#login-collector-event-based-collector)** - The login collectors gather user logins, logouts, and failed login attempts. Such as SSH & telnet.

- **[System information collector](concept-event-aggregation.md#system-information-trigger-based-collector)** - The system information collector gatherers information related to the device’s operating system and hardware details.

- **[Event aggregation](concept-event-aggregation.md#how-does-event-aggregation-work)** - The Defender for IoT agent aggregates events such as process, login, network events that reduce the number of messages sent and costs, all while maintaining your device's security.  

- **[Twin configuration](concept-micro-agent-configuration.md)** - The micro agent's behavior is configured by a set of module twin properties. (e.g event sending frequency and Aggregation mode). You can configure the micro agent to best suit your needs.

## March 2021

### Device builder - new micro agent (Public preview)

A new device builder module is available. The module, referred to as a micro-agent, allows:

- **Integration with Azure IoT Hub and Defender for IoT** - build stronger endpoint security directly into your IoT devices by integrating it with the monitoring option provided by both the Azure IoT Hub and Defender for IoT.

- **Flexible deployment options with support for standard IoT operating systems** - can be deployed either as a binary package or as modifiable source code, with support for standard IoT operating systems like Linux and Azure RTOS.

- **Minimal resource requirements with no OS kernel dependencies** - small footprint, low CPU consumption, and no OS kernel dependencies.

- **Security posture management** – proactively monitor the security posture of your IoT devices.

- **Continuous, real-time IoT/OT threat detection** - detect threats such as botnets, brute force attempts, crypto miners, and suspicious network activity

The deprecated Defender-IoT-micro-agent documentation will be moved to the *Agent-based solution for device builders>Classic* folder.

This feature set is available with the current public preview cloud release.

## Next steps

[Onboard to Defender for IoT](quickstart-onboard-iot-hub.md)
