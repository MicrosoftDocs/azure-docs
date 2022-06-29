---
title: include
author: batamig
ms.date: 06/01/2022
ms.topic: include
---

<!-- docutune:disable -->

Defender for IoT can discover all devices, of all types, across all environments. Devices are listed in the Defender for IoT **Device inventory** pages based on a unique IP and MAC address coupling.

Defender for IoT considers any of the following as single and unique committed network devices:

- **Managed or un-managed, standalone IT/OT/IoT devices, with one or more NICs**.

    If you are a Microsoft Defender for Endpoint customer, do not include any devices (seats) that area managed by Defender for Endpoint.

- **Devices that are part of the network infrastructure**, such as switches or routers, and might have one more NICs.

- **Devices that have one or more backplane components**, including all racks, slots, or modules

The following items *aren't* considered as committed devices:

- **Public internet IP address**

- **Multi-cast groups**

- **Broadcast groups**

- **Inactive devices**:

    - OT networks: Devices that have been inactive for more than 60 days
    - Enterprise IoT networks: Devices that have been inactive for more than 30 days

<!-->
For more information, see [Calculate the number of devices you need to monitor](../how-to-manage-subscriptions.md#calculate-the-number-of-devices-you-need-to-monitor).


|Network type  |Committed devices  |
|---------|---------|
|**OT networks**     |   - Managed or unmanaged standalone IT/OT/IoT devices, with one or more NICs <br>- Devices that provide network infrastructure, such as switches or routers with multiple NICs <br>- Devices with multiple backplane components, including all racks, slots, or modules |
|**Enterprise IoT networks**     | - Standalone, unmanaged IoT or network infrastructure devices <br>- Devices discovered either by an Enterprise IoT network sensor or Microsoft Defender for Endpoint agents <br><br>IT devices, such as workstations, servers, and mobile devices, are currently supported in Public Preview, and are therefore not billed|

The following items *aren't* monitored as devices, and don't appear in the Defender for IoT device inventories at all:

|Network type  |Not monitored as devices |
|---------|---------|
|**OT networks**     |     - Public internet IP addresses <br>- Multi-cast groups <br>- Broadcast groups    |
|**Enterprise IoT networks**     |   Unclassified devices      |


Devices that are inactive for more than 60 days are classified as *inactive* inventory devices.

-->