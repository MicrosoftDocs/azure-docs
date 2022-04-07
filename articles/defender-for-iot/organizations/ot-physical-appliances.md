---
title: Build your own physical appliance for OT monitoring - Microsoft Defender for IoT
description: Learn about hardware compatibility for physical appliances used for the Microsoft Defender for IoT OT sensors and on-premises management console.
ms.date: 04/04/2022
ms.topic: conceptual
---

# OT monitoring - build your own physical appliance

This article lists the hardware specifications required if you want to install Microsoft Defender for IoT OT sensor and on-premises management console software on your own physical appliances.

> [!TIP]
> We recommend purchasing [pre-configured appliances](ot-pre-configured-appliances.md) with the software already installed, for improved performance, compatibility, stability, and more.
>

## OS compatibility

Defender for IoT sensor and on-premises management console software is built on Ubuntu 18.04.
All hardware components must be compatible with Ubuntu version 18.04.

## Specifications
# [CPU requirements](#tab/cpu_requirements)

| Deployment type |Supported models and versions |
|---------|---------|---------|
| **Corporate**      |  Intel Xeon Silver 4215 R 3.2 GHz, 11M cache, 8c/16T, 130 W       |
| **Enterprise** | Intel Xeon E-2234, 3.6 GHz, 4C/8T, 71 W using Intel C242<br> Intel Xeon E-2224, 3.4 GHz, 4C, 71 W using Intel C242<br> Intel Xeon E-2144G 3.6 GHz, 8M cache, 4C/8T, turbo (71 W) with Intel C246|
| **Production line**| Intel Core i7-8650U (1.9GHz/4-core/15W) using Intel Q170<br> Intel Core i5-6500TE (6M Cache, up to 3.30 GHz) S1151Intel Atom® x7-E3950 

# [Networking requirements](#tab/networking_requirements)

| Deployment type   |Supported models and versions |
|---------|---------|---------|
| **Corporate**      | Intel X710  (GBe/SFP)      |
| **Enterprise**     | Intel I350  (GBe/SFP)      |
| **Production line**          | Intel I219<br>Broadcom BCM5720 <br>  Broadcom BCM5719      |


# [Storage array requirements](#tab/storage_requirements)

| Deployment type   |Supported models and versions |
|---------|---------|---------|
| **Corporate**      | RAID 5 with HPE Smart Array P408i (a SR Gen10 Controller) , 6x 1.2-TB SAS 12G Enterprise 10K SFF (2.5 in) in hot-plug hard drive<br> RAID 5 with HPE Smart Array P408i (an SR controller, 3x 1-TB SATA 6G Midline 7.2 K SFF (2.5 in)) <br> 600IOPS      |
| **Enterprise**      | RAID 1 with HPE Smart Array P208i-a, 2x 1-TB SATA 6G Midline 7.2 K SFF (2.5 in)  <br>  RAID 5 with HPE Smart Array P208i-a, 3x 2 TB 7.2 K RPM SATA 6 Gbps 512n 3.5in hot-plug hard drive <br>RAID 5 with Dell PERC H330, 3x 2 TB 7.2 K RPM SATA 6 Gbps 512n 3.5in hot-plug hard drive<br> 300IOPS      |
| **Production line** | 128 GB M.2 M-key 2260* 2242 (SATA 3 6 Gbps) PLP<br> HPE Edgeline 256 GB SATA 6G Read Intensive M.2 2242 3-year warranty wide-temperature SSD <br>128 GB 3ME3 wide temperature mSATA SSD <br> 150 IOPS|

---
## Next steps

Continue understanding system requirements for physical or virtual appliances. For more information, see:

- [Which appliances do I need?](ot-deployment-options.md)
- [Pre-configured physical appliances for OT monitoring](ot-preconfigured-appliances.md)
- [OT system virtual appliance requirements](ot-virtual-appliances.md)

Then, use any of the following procedures to order or install the OT monitoring appliance:

- [Purchase sensors or download software for sensors](how-to-manage-sensors-on-the-cloud.md#purchase-sensors-or-download-software-for-sensors)
- [Download software for an on-premises management console](how-to-manage-the-on-premises-management-console.md#download-software-for-the-on-premises-management-console)
- [Install software](how-to-install-software.md)
