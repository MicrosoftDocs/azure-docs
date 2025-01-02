---
title: On-premises management console retirement - Microsoft Defender for IoT
description: This article describes the retirement of the on-premises management console from **January 1, 2025**.
ms.topic: conceptual
ms.date: 12/17/2024
---

# On-premises management console retirement

This article describes the retirement of the on-premises management console from **January 1, 2025**.

## Retirement details

The on-premises management console will be retired on **January 1, 2025** with the following updates/changes:

- Sensor versions released after **January 1, 2025** won't connect to the on-premises management console. 
- For versions released prior to **January 1, 2025**: 
    - You can still use the on-premises management console. 
    - Defender for IoT no longer provides support service or maintains the on-premises management console. 

        For a list of supported versions, see [OT monitoring software versions](../release-notes.md)  

## Air-gapped sensor support

Air-gapped sensor support isn't affected by the on-premises management console retirement. We continue to support air-gapped deployments and assist with the [transition to the cloud](transition-on-premises-management-console-to-cloud.md). The sensors retain a full user interface so that they can be used in "lights out" scenarios and continue to analyze and secure the network in the event of an outage.

If your organization enforces a policy where sensors can't access the internet (air-gapped), you can continue to manage sensors using: 
- [The sensor console UI](../how-to-investigate-sensor-detections-in-a-device-inventory.md) or the [CLI](../cli-ot-sensor.md) to directly manage individual sensors.
- [APIs](../references-work-with-defender-for-iot-apis.md) to send data to third-party management systems, such as a Security Information and Event Management (SIEM).

## Next steps

> [!div class="step-by-step"]
> [Transition from a legacy on-premises management console to the cloud](transition-on-premises-management-console-to-cloud.md)