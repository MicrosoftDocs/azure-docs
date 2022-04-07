---
title: Dell PowerEdge R340 XL for OT monitoring - Microsoft Defender for IoT
description: Learn about the Dell PowerEdge R340 XL appliance when used for OT monitoring with Microsoft Defender for IoT.
ms.date: 04/04/2022
ms.topic: reference
---

# Dell PowerEdge R340 XL

This article describes the **Dell PowerEdge R340 XL** when used in enterprise deployments for OT monitoring.

:::image type="content" source="media/tutorial-install-components/view-of-dell-poweredge-r340-back-panel.jpg" alt-text="Back Panel view of Dell PowerEdge 340." border="false":::

## Specifications

|Component |Technical Specifications|
|----|----|
|Chassis|1U rack server|
|Dimensions|42.8 x 434.0 x 596 (mm) /1.67” x 17.09” x 23.5” (in)|
|Weight|Max 29.98 lb/13.6 Kg|
|Processor|Intel Xeon E-2144G 3.6 GHz<br>8M cache 4C/8T turbo (71 W)|
|Chipset|Intel C246|
|Memory|32 GB = 2 x 16 GB 2666MT/s DDR4 ECC UDIMM|
|Storage|Three 2 TB 7.2 K RPM SATA 6 Gbps 512n 3.5in hot-plug hard drive - RAID 5|
|Network controller|On-board: Two 1 Gb Broadcom BCM5720|
|On-board LOM| iDRAC Port Card 1 Gb Broadcom BCM5720|
|External| 1 x Intel Ethernet i350 QP 1 Gb Server Adapter Low Profile|
|Management|iDRAC 9 Enterprise|
|Device access| Two rear USB 3.0 <br> One front USB 3.0|
|Power|	Dual Hot Plug Power Supplies 350 W|
|Rack support|	ReadyRails™ II sliding rails for tool-less mounting in 4-post racks with square or unthreaded round holes, or tooled mounting in 4-post threaded hole racks with support for optional tool-less cable management arm.

## Port expansion

Optional modules for port expansion include:

|Location|Type|Specification|
|-----|-----|-----|
|PCI Slot 1 (Low profile)|Quad Port Ethernet NIC|Intel® i350 Quad Port - MCBX-NIC00-A00|
|PCI Slot 1 (Low profile)|Quad Port Ethernet NIC|Broadcom 5719 Quad Port 540-BBHB|
|PCI Slot 1 (Low profile)|DP F/O NIC|Intel X710 Dual Port - MCBX-NIC01-A00|
|PCI Slot 2 (High profile)|Quad Port Ethernet NIC|Intel® i350 Quad Port - MCBX-NIC00-A00|
|PCI Slot 2 (High profile)|DP F/O NIC|Intel X710 Dual Port - MCBX-NIC01-A00|
|PCI Slot 2 (High profile)|Quad Port F/O NIC|Intel X710-DA4 - MCBX-NIC02-A00|
|SFPs for Fiber Optic NICs|MultiMode, Short Range|Dell SFP+, SR, Optical Transceiver, Intel, 10 Gb-1 Gb|
|SFPs for Fiber Optic NICs|SingleMode, Long Range|Dell SFP+, LR Optical Transceiver, 1/10 GbE|

## Deployment BOM

|Description|SKU|Qty|
|:----|:----|:----|
|OEM PowerEdge R340 XL|210-ARGO|1|
|PowerEdge R340XL Motherboard|329-BECZ|1|
|Trusted Platform Module 2.0|461-AAEM|1|
|3.5" Chassis with up to four Hot Plug Hard Drives|321-BDUX|1|
|Brand/Bezel, Embedded OS, OEM PowerEdge R340XL|325-BDGR|1|
|OEM PowerEdge R340 Shipping, DAO|340-CJQL|1|
|OEM PowerEdge R340 Shipping Material, 3.5" Chassis, DAO|340-CJQM|1|
|Intel Xeon E-2144G 3.6 Ghz, 8-m cache, 4C/8T, turbo (71 W)|338-BQPK|1|
|Heatsin for 80w or less CPU|412-AAPW|1|
|2666 MT/s UDIMMs|370-AEKM|1|
|Performance Optimized|370-AAIP|1|
|RAID 5|780-BCDP|1|
|PERC H330 RAID Controller|405-AAMT|1|
|No Operating System|619-ABVR|1|
|No Media Required|605-BBFN|1|
|iDRAC9, Enterprise|385-BBKT|1|
|iDRAC9 Group Manager, Enabled|379-BCQV|1|
|iDRAC, Legacy Password, OEM|379-BCRF|1|
|PCle Riser, 1x FH x8 Pcle Gen 3 slot, 1x LP x4 Pcle Gen3 slot, <br> R240/R340 |330-BBMH|1|
|Standard Fan|384-BBWF|1|
|No Internal Optical Drive for x4 and x8 HDD Chassis|429-ABBF|1|
|Dual Hot Plug Power Supplies 350 W|450-AEUV|1|
|Performance BIOS Settings|384-BBBL|1|
|UEFI BIOS Boot Mode with GPT Partition|800-BBDM|1|
|ReadyRails Sliding Rails Without Cable Management Arm|770-BCWN|1|
|No Systems Documentation, No OpenManage DVD Kit|631-AACK|1|
|US Order|332-1286|1|
|Basic Next Business Day 15 months|709-BBFH|1|
|ProSupport Next Business Day Onsite Service Initial, 15 Month(s)|865-BBQK|1|
|ProSupport Next Business Day Onsite Service Extension, 24 Month(s)|865-BBQL|1|
|On-site Installation Declined|900-9997|1|
|8 GB 2666 MT/s DDR4 ECC UDIMM|370-AEKN|4|
|2 TB 7.3 RPM SATA 6 Gbps 512 3.5 in Hot-plug Hard Drive|400-ASHX|3|
|On-Board LOM|542-BBP|1|
|NEMA 5-15P to C13 Wall Plug, 125 Volts, 15 AMP, 10 Feet (3m), Power Cord, North America|450-AALV|2|
|Enterprise Program Management Support |973-3700|1|

## Next steps

Continue understanding system requirements for physical or virtual appliances. For more information, see [Which appliances do I need?](ot-appliance-sizing.md).

Then, use any of the following procedures to continue:

- [Purchase sensors or download software for sensors](how-to-manage-sensors-on-the-cloud.md#purchase-sensors-or-download-software-for-sensors)
- [Download software for an on-premises management console](how-to-manage-the-on-premises-management-console.md#download-software-for-the-on-premises-management-console)
- [Install software](how-to-install-software.md)
