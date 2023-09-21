---
title: include
author: batamig
ms.date: 05/17/2023
ms.topic: include
ms.custom: enterprise-iot
---

<!-- docutune:disable -->

Defender for IoT can discover all devices, of all types, across all environments. Devices are listed in the Defender for IoT **Device inventory** pages based on a unique IP and MAC address coupling.

Defender for IoT identifies single and unique devices as follows:

|Type  |Description  |
|---------|---------|
|**Identified as individual devices**     |    Devices identified as *individual* devices include:<br>**IT, OT, or IoT devices with one or more NICs**, including network infrastructure devices such as switches and routers<br><br>**Note**: A device with modules or backplane components, such as racks or slots, is counted as a single device, including all modules or backplane components.|
|**Not identified as individual devices**     | The following items *aren't* considered as individual devices, and do not count against your OT site license or Enterprise IoT pricing plan:<br>**Public internet IP addresses** <br>**Multi-cast groups**<br> **Broadcast groups**<br>**Inactive devices**<br><br> Network-monitored devices are marked as *inactive* when there's no network activity detected within a specified time:<br> - **OT networks**: No network activity detected for more than 60 days<br> - **Enterprise IoT networks**: No network activity detected for more than 30 days<br><br>**Microsoft Defender for Endpoint** (For customers with [Microsoft Defender for Endpoint Plan 2](/office365/servicedescriptions/microsoft-365-service-descriptions/microsoft-365-tenantlevel-services-licensing-guidance/microsoft-365-security-compliance-licensing-guidance#microsoft-defender-for-endpoint)): For subscriptions [onboarded for Enterprise IoT networks](../eiot-defender-for-endpoint.md), endpoints already managed by Defender for Endpoint are not considered as separate devices by Defender for IoT.  |
