---
title: On-premises management console retirement - Microsoft Defender for IoT
description: This article describes the retirement of the on-premises management console from **January 1, 2025**.
ms.topic: conceptual
ms.date: 12/17/2024
---

# On-premises management console retirement

This article describes the retirement of the on-premises management console from **January 1, 2025**.

### Retirement timeline of the Central Manager

The on-premises management console will be retired on **January 1, 2025** with the following updates/changes:

- Sensor versions released after **January 1, 2025** won't be managed by an on-premises management console. 
- For versions released prior to **January 1, 2025**: 
    - You can still use the on-premises management console. 
    - In these versions, Defender for IoT no longer provides support service or maintains the on-premises management console. 

    For a list of supported versions, see [OT monitoring software versions](release-noted.md).    

- Following any version upgrade, you will no longer be able to use the on-premises management console. For example, if you're using the on-premises management portal on version 24.1.2, and you upgrade to version 24.1.6, you can no longer use the on-premises management console.

## Air-gapped sensor support

- Air-gapped sensor support isn't affected by these changes to the on-premises management console support. We continue to support air-gapped deployments and assist with the [transition to the cloud](transition-from-on-premises-management-console-to-cloud.md). The sensors retain a full user interface so that they can be used in "lights out" scenarios and continue to analyze and secure the network in the event of an outage.
- Air-gapped sensors that can't connect to the cloud can be managed directly via the sensor console UI, CLI, or API.

## Next steps

> [!div class="step-by-step"]
> [Transition from a legacy on-premises management console to the cloud](transition-on-premises-management-console-to-cloud.md)