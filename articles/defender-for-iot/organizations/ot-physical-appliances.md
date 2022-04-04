---
title: Microsoft Defender for IoT OT system physical appliance requirements
description: Learn about system requirements for physical appliances used for the Microsoft Defender for IoT OT sensors and on-premises management console.
ms.date: 04/04/2022
ms.topic: conceptual
---

# OT hardware system requirements for your own installations

This article lists the hardware specifications required if you want to install Microsoft Defender for IoT sensor and on-premises management console software on your own physical appliances.

For more information, see:

- [Download software for the on-premises management console](how-to-manage-the-on-premises-management-console.md#download-software-for-the-on-premises-management-console)
- [Install software](how-to-install-software.md)

Alternately, you can install Defender for IoT software on [virtual appliances](ot-virtual-appliances.md).

> [!TIP]
> We recommend purchasing [pre-configured appliances](ot-preconfigured-appliances.md) with the software already installed, for improved performance, compatibility, stability, and more.
>

## Required operating system

Defender for IoT sensor and on-premises management console software is built on Ubuntu 18.04.

All hardware components must be compatible with Ubuntu version 18.04.

## Central processing unit (CPU) requirements

| Deployment type | |Name  |Supported models and versions |
|---------|---------|---------|
| **Corporate** |C5600      |-  Intel Xeon Silver 4215 R 3.2 GHz, 11M cache, 8c/16T, 130 W       |
| **Enterprise** | |E1800 | - Intel Xeon E-2234, 3.6 GHz, 4C/8T, 71 W using Intel C242<br>- Intel Xeon E-2224, 3.4 GHz, 4C, 71 W using Intel C242<br>- Intel Xeon E-2144G 3.6 GHz, 8M cache, 4C/8T, turbo (71 W) with Intel C246|
| **Production line** |- L500 <br> - L100 <br> - L60 |- Intel Core i7-8650U (1.9GHz/4-core/15W) using Intel Q170<br>- Intel Core i5-6500TE (6M Cache, up to 3.30 GHz) S1151Intel Atom® x7-E3950 Processor

## Network card (Ethernet/SFP) requirements

| Deployment type |Name  |Supported models and versions |
|---------|---------|---------|
| **Corporate** |C5600     | Intel X710        |
| **Enterprise** |E1800     | Intel I350        |
| **Production line**|L500            | Intel I219        |
| **Production line**|L100            |Broadcom BCM5720   |
| **Production line**|L60           |Broadcom BCM5719   |

## Storage array requirements

| Deployment type |Name  |Supported models and versions |
|---------|---------|---------|
| **Corporate**|C5600      |- Six 1.2-TB SAS 12G Enterprise 10K SFF (2.5 in) in hot-plug hard drive, RAID 5 with HPE Smart Array P408i (a SR Gen10 Controller) <br>- Three  1-TB SATA 6G Midline 7.2 K SFF (2.5 in), RAID 5 with HPE Smart Array P408i (an SR controller)       |
| **Enterprise** |E1800     | - Two 1-TB SATA 6G Midline 7.2 K SFF (2.5 in), RAID 1 with HPE Smart Array P208i-a <br> - Three 2 TB 7.2 K RPM SATA 6 Gbps 512n 3.5in hot-plug hard drive, RAID 5 with HPE Smart Array P208i-a <br> - Three 2 TB 7.2 K RPM SATA 6 Gbps 512n 3.5in hot-plug hard drive, RAID 5 with Dell PERC H330      |
| **Production line** |- L500 <br> - L100 <br> - L60   | - 128 GB M.2 M-key 2260* 2242 (SATA 3 6 Gbps) PLP<br> - HPE Edgeline 256 GB SATA 6G Read Intensive M.2 2242 3-year warranty wide-temperature SSD <br>- 128 GB 3ME3 wide temperature mSATA SSD |

## Next steps

Continue understanding system requirements for physical or virtual appliances. For more information, see:

- [OT system deployment options](ot-deployment-options.md)
- [Pre-configured physical appliances for OT systems](ot-preconfigured-appliances.md)
- [OT system virtual appliance requirements](ot-virtual-appliances.md)

Then, use any of the following procedures to continue:

- [Purchase sensors or download software for sensors](how-to-manage-sensors-on-the-cloud.md#purchase-sensors-or-download-software-for-sensors)
- [Download software for an on-premises management console](how-to-manage-the-on-premises-management-console.md#download-software-for-the-on-premises-management-console)
- [Install software](how-to-install-software.md)
