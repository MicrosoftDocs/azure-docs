---
title: include
author: batamig
ms.date: 06/01/2022
ms.topic: include
---

<!-- docutune:disable -->

Defender for IoT can discover all devices, of all types, across all environments. Devices are listed in the Defender for IoT **Device inventory** pages based on a unique IP and MAC address coupling.

|Committed / Not committed  |Description  |
|---------|---------|
|**Committed devices**     | Defender for IoT considers any of the following as single and unique committed network devices:<br><br>**Managed or un-managed, standalone IT/OT/IoT devices, with one or more NICs**.<br>**Note**: If you are a Microsoft Defender for Endpoint customer, do not include any devices (seats) that area managed by Defender for Endpoint.<br><br>**Devices that are part of the network infrastructure**, such as switches or routers, and might have one more NICs.<br><br>**Devices that have one or more backplane components**, including all racks, slots, or modules         |
|**Not committed devices**    |   The following items *aren't* considered as committed devices:<br><br>**Public internet IP address**<br><br>**Multi-cast groups**<br><br>**Broadcast groups**<br><br>**Inactive devices**:<br>    - OT networks: Devices that have been inactive for more than 60 days<br><br>    - Enterprise IoT networks: Devices that have been inactive for more than 30 days      |
