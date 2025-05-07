---
title: Which OT appliances do I need? - Microsoft Defender for IoT
description: Learn about the deployment options for Microsoft Defender for IoT sensors and on-premises management consoles.
ms.date: 03/10/2024
ms.topic: limits-and-quotas
---

# Which appliances do I need?

This article is one in a series of articles describing the [deployment path](ot-deploy/ot-deploy-path.md) for OT monitoring with Microsoft Defender for IoT, and is intended to help you choose the right appliances for your system and which hardware profile best fits your organization's network monitoring needs.

You can use [physical](ot-pre-configured-appliances.md) or [virtual](ot-virtual-appliances.md) appliances, or use the supplied specifications to purchase hardware on your own.  For more information, see [Microsoft Defender for IoT - OT monitoring appliance reference | Microsoft Learn](appliance-catalog/index.yml). Results depend on hardware and resources available to the monitoring sensor.

:::image type="content" source="media/deployment-paths/progress-plan-and-prepare.png" alt-text="Diagram of a progress bar with Plan and prepare highlighted." border="false" lightbox="media/deployment-paths/progress-plan-and-prepare.png":::

> [!IMPORTANT]
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
|L100   | Up to 10 Mbps         |   800        | Physical / Virtual        |

> [!IMPORTANT]
> Defender for IoT software versions require a minimum disk size of 100 GB. The L60 hardware profile, which only supports 60 GB of hard disk, has been deprecated.
>
> If you have a legacy sensor, such as the L60 hardware profile, you can migrate it to a supported profile can be found by following the [back up and restore a sensor](back-up-restore-sensor.md) process.

## Next steps

> [!div class="step-by-step"]
> [« Prepare an OT site deployment](best-practices/plan-prepare-deploy.md)
