---
title: HPE ProLiant DL360 OT monitoring - Microsoft Defender for IoT
description: Learn about the HPE ProLiant DL360 appliance when used for OT monitoring with Microsoft Defender for IoT.
ms.date: 04/04/2022
ms.topic: reference
---

# HPE ProLiant DL360

This article describes the **HPE ProLiant DL360** when used in corporate deployments for OT monitoring.

:::image type="content" source="media/ot-system-requirements/hpe-proliant-dl360.png" alt-text="Photo of the Proliant Dl360." border="false":::

## Specifications

|Component  |Specifications|
|---------|---------|
|Chassis     |1U rack server         |
|Dimensions   |Four 3.5" chassis: 4.29 x 43.46 x 70.7 cm /  1.69 x 17.11 x 27.83 in         |
|Weight    | Max 16.72 kg / 35.86 lb        |
|Chassis |1U rack server|
|Dimensions| 42.9 x 43.46 x 70.7 cm / 1.69" x 17.11" x 27.83" in|
|Weight| Max 16.27 kg  / 35.86 lb |
|Processor | Intel Xeon Silver 4215 R 3.2 GHz 11M cache 8c/16T 130 W|
|Chipset	| Intel C621|
|Memory	| 32 GB = Two 16-GB 2666MT/s DDR4 ECC UDIMM|
|Storage|	Six 1.2-TB SAS 12G Enterprise 10K SFF (2.5 in) in hot-plug hard drive - RAID 5|
|Network controller|	On-board: Two  1 Gb <br> On-board: iLO Port Card 1 Gb <br>External: One HPE Ethernet 1-Gb 4-port 366FLR adapter|
|Management     |HPE iLO Advanced         |
|Device access     | Two rear USB 3.0        |
|One front    | USB 2.0        |
|One internal    |USB 3.0         |
|Power            |Two HPE 500-W flex slot platinum hot plug low halogen power supply kit
|Rack support     | HPE 1U Gen10 SFF easy install rail kit        |

## Port expansion

Optional modules for port expansion include:

|Location |Type|Specifications|
|-------------- | --------------| --------- |
| PCI Slot 1 (Low profile)| Quad Port Ethernet NIC| 811546-B21 - HPE 1 GbE 4p BASE-T I350 Adapter SI |
| PCI Slot 1 (Low profile)  | DP F/O NIC|727054-B21 - HPE 10 GbE 2p FLR-SFP+ X710 Adapter|
| PCI Slot 2 (High profile)| Quad Port Ethernet NIC|811546-B21 - HPE 1 GbE 4p BASE-T I350 Adapter SI|
| PCI Slot 2 (High profile)|DP F/O NIC| 727054-B21 - HPE 10 GbE 2p FLR-SFP+ X710 Adapter|
| PCI Slot 2 (High profile)|Quad Port F/O NIC| 869585-B21 - HPE 10 GbE 4p SFP+ X710 Adapter SI|
| SFPs for Fiber Optic NICs|MultiMode, Short Range|455883-B21 - HPE BLc 10G SFP+ SR Transceiver|
| SFPs for Fiber Optic NICs|SingleMode, Long Range | 455886-B21 -  HPE BLc 10G SFP+ LR Transceiver|

## Next steps

Continue understanding system requirements for physical or virtual appliances. For more information, see [Which appliances do I need?](ot-appliance-sizing.md).

Then, use any of the following procedures to continue:

- [Purchase sensors or download software for sensors](how-to-manage-sensors-on-the-cloud.md#purchase-sensors-or-download-software-for-sensors)
- [Download software for an on-premises management console](how-to-manage-the-on-premises-management-console.md#download-software-for-the-on-premises-management-console)
- [Install software](how-to-install-software.md)
