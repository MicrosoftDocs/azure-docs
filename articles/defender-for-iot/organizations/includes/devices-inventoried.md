---
title: include
author: batamig
ms.date: 06/01/2022
ms.topic: include
---

<!-- docutune:disable -->

Defender for IoT can discover all devices, of all types, across all environments. Devices are listed in the Defender for IoT **Device inventory** pages based on a unique IP and MAC address coupling.

:::row:::
   :::column span="":::
**Committed devices**

Defender for IoT identifies any of the following as single and unique committed network devices:

- **Managed or un-managed, standalone IT/OT/IoT devices, with one or more NICs**. 

    If you are a Microsoft Defender for Endpoint customer, devices (seats) that are managed by Defender for Endpoint are not included.

- **Devices that are part of the network infrastructure**, such as switches or routers, and might have one more NICs.

- **Devices that have one or more backplane components**, including all racks, slots, or modules.
   :::column-end:::
   :::column span="":::

**Not committed devices**:

The following items *aren't* identified as committed devices:

- **Public internet IP address**

- **Multi-cast groups**

- **Broadcast groups**

- **Inactive devices**, defined as follows:
    - OT networks: Devices that have been inactive for more than 60 days
    - Enterprise IoT networks: Devices that have been inactive for more than 30 days
:::column-end:::
:::row-end:::



