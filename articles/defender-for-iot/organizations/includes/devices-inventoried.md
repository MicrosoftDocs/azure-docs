---
title: include
author: batamig
ms.date: 06/01/2022
ms.topic: include
---

<!-- docutune:disable -->

Defender for IoT considers any of the following as single, unique committed devices:

- Managed or unmanaged standalone IT/OT/IoT network devices, with one or more NICs
- Devices with multiple backplane components, including all racks, slots, or modules
- Devices that provide network infrastructure, such as switches or routers with multiple NICs
- For Enterprise IoT, classified devices or any device originating from an Enterprise IoT sensor or Microsoft

The following items aren't monitored as devices, and don't appear in the Defender for IoT device inventories:

- Public internet IP addresses
- Multi-cast groups
- Broadcast groups

Devices that are inactive for more than 60 days are classified as *inactive* inventory devices.
