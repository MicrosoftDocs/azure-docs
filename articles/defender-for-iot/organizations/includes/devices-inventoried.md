---
title: include
author: batamig
ms.date: 07/06/2022
ms.topic: include
---

<!-- docutune:disable -->

Defender for IoT can discover all devices, of all types, across all environments. Devices are listed in the Defender for IoT **Device inventory** pages based on a unique IP and MAC address coupling.

Defender for IoT identifies single and unique committed devices as follows:

|Committed / Not committed  |Description  |
|---------|---------|
|**Committed devices**     |    Committed devices include:<br>**IT, OT, or IoT devices with one or more NICs**, including network infrastructure devices such as switches and routers<br><br>**Note**: A device with modules or backplane components, such as racks or slots, is counted as a single device, including all modules or backplane components.|
|**Not committed devices**     | The following items *aren't* considered as committed devices:<br><br>**Public internet IP addresses**<br>**Multi-cast groups**<br>**Broadcast groups**<br>**Inactive devices**, defined as follows:<br>- OT networks: Devices that have been inactive for more than 60 days<br>- Enterprise IoT networks: Devices that have been inactive for more than 30 days        |

> [!NOTE]
> If you are a Microsoft Defender for Endpoint customer, devices (seats) that are managed by Defender for Endpoint are not counted as Defender for IoT *committed devices*.
