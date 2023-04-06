---
title: Which OT appliances do I need? - Microsoft Defender for IoT
description: Learn about the deployment options for Microsoft Defender for IoT sensors and on-premises management consoles.
ms.date: 04/04/2022
ms.topic: limits-and-quotas
---

# Which appliances do I need?

This article is designed to help you choose the right OT appliances for your sensors and on-premises management consoles. Use the tables below to understand which hardware profile best fits your organization's network monitoring needs.

[Physical](ot-pre-configured-appliances.md) or [virtual](ot-virtual-appliances.md) appliances can be used; results depend on hardware and resources available to the monitoring sensor.

> [!NOTE]
> The performance, capacity, and activity of an OT/IoT network may vary depending on its size, capacity, protocols distribution, and overall activity. For deployments, it is important to factor in raw network speed, the size of the network to monitor, and application configuration. The selection of processors, memory, and network cards is heavily influenced by these deployment configurations. The amount of space needed on your disk will differ depending on how long you store data, and the amount and type of data you store.
>
>*Performance values are presented as upper thresholds under the assumption of intermittent traffic profiles, such as those found in OT/IoT systems and machine-to-machine communication networks.*

## IT/OT mixed environments

Use the following hardware profiles for high bandwidth corporate IT/OT mixed networks:

|Hardware profile  |SPAN/TAP throughput |Max monitored Assets  |Deployment |
|---------|---------|---------|---------|
|C5600   | Up to 3 Gbps        | 12 K        |Physical / Virtual         |

## Monitoring at the site level

Use the following hardware profiles for enterprise monitoring at the site level, typically collecting multiple traffic feeds:

|Hardware profile  |SPAN/TAP throughput  |Max monitored assets  |Deployment  |
|---------|---------|---------|---------|
|E1800    |Up to 1 Gbps         |10K         |Physical / Virtual         |
|E1000    |Up to 1 Gbps         |10K         |Physical / Virtual         |
|E500    |Up to 1 Gbps         |10K         |Physical / Virtual         |

## Production line monitoring (medium and small deployments)

Use the following hardware profiles for production line monitoring, typically in the production/mission-critical environments:

|Hardware profile  |SPAN/TAP throughput  |Max monitored assets  |Deployment  |
|---------|---------|---------|---------|
|L500   | Up to 200 Mbps        |   1,000      |Physical / Virtual         |
|L100    | Up to 60 Mbps        |   800      | Physical / Virtual        |
|L60    | Up to 10 Mbps        |   100      |Physical / Virtual|

## On-premises management console systems

On-premises management consoles allow you to manage and monitor large, multiple-sensor deployments. Use the following hardware profiles for deployment of an on-premises management console:

|Hardware profile  |Max monitored sensors  |Deployment  |
|---------|---------|---------|
|E1800    |Up to 300         |Physical / Virtual         |

## Next steps

Continue understanding system requirements, including options for ordering pre-configured appliances, or required specifications to install software on your own appliances:

- [Pre-configured physical appliances for OT monitoring](ot-pre-configured-appliances.md)
- [Resource requirements for virtual appliances](ot-virtual-appliances.md)

Then, use any of the following procedures to continue:

- [Purchase sensors or download software for sensors](onboard-sensors.md#purchase-sensors-or-download-software-for-sensors)
- [Download software for an on-premises management console](how-to-manage-the-on-premises-management-console.md#download-software-for-the-on-premises-management-console)
- [Install software](how-to-install-software.md)

Reference articles for OT monitoring appliances also include installation procedures in case you need to install software on your own appliances, or reinstall software on preconfigured appliances.
