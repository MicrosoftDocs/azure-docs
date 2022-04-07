---
title: Pre-configured appliances for OT systems in enterprise deployments - Microsoft Defender for IoT
description: Learn about the supported, pre-configured appliances for Microsoft Defender for IoT OT sensors and on-premises management consoles.
ms.date: 04/04/2022
ms.topic: conceptual
---

# Pre-configured appliances for OT sensors and on-premises management consoles in enterprise deployments

This article lists the appliances for OT sensors and on-premises management consoles when configured for enterprise deployments.


## HPE ProLiant DL20 Plus

:::image type="content" source="media/ot-system-requirements/hpe-proliant-dl20-plus.png" alt-text="Photo of the DL20 Plus panel." border="false":::


|Component  |Specifications|
|---------|---------|
|Chassis     |1U rack server         |
|Dimensions   |Four 3.5" chassis: 4.29 x 43.46 x 38.22 cm  /  1.70 x 17.11 x 15.05 in         |
|Weight    | Max 7.9 kg / 17.41 lb        |


|Quantity|PN|Description|
|----|---|----|
|1|P44111-B21|HPE DL20 Gen10+ 4SFF CTO Server|
|1|P45252-B21|Intel Xeon E-2234 FIO CPU for HPE|
|1|869081-B21|HPE Smart Array P408i-a SR G10 LH Controller|
|1|782961-B21|HPE 12 W Smart Storage Battery|
|1|P45948-B21|HPE DL20 Gen10+ RPS FIO Enable Kit|
|2|865408-B21|HPE 500 W flex slot platinum hot plug low halogen power supply kit|
|1|775612-B21|HPE 1U short friction rail lit|
|1|512485-B21|HPE iLO advanced 1-server license 1-year support|
|1|P46114-B21|HPE DL20 Gen10+ 2x8 LP FIO Riser Kit|
|1|P21106-B21|INT I350 1 GbE 4p BASE-T Adapter|
|3|P28610-B21|HPE 1 TB SATA 7.2 K SFF BC HDD|
|2|P43019-B21|HPE 16 GB 1Rx8 PC4-3200AA-E standard kit|

### Port expansion

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

For example:

:::image type="content" source="media/ot-system-requirements/dl20-profile-back-view.png" alt-text="Profile view of back of DL20." border="false":::

## HPE ProLiant DL20

|Component|Technical specifications|
|----|----|
|Chassis |1U rack server|
|Dimensions | 4.32 x 43.46 x 38.22 cm/<br> 1.70 x 17.11 x 15.05 inch|
|Weight|7.9 kg/17.41 lb|
|Processor|Intel Xeon E-2234 3.6 GHz 4C/8T 71 W|
|Chipset|Intel C242|
|Memory	| 2 x 16-GB Dual Rank x8 DDR4-2666|
|Storage|3 x 1-TB SATA 6G Midline 7.2 K SFF (2.5 in) – RAID 5 with Smart Array P408i-a SR Controller|
|Network controller|On-board: 2 x 1 Gb|
|On-board| iLO Port Card 1 Gb|
|External |1 x HPE Ethernet 1-Gb 4-port 366FLR Adapter|
|Management|HPE iLO Advanced|
|Device accessFront: 1 x USB 3.0| 1 x USB iLO Service Port|
|Rear:| 2 x USB 3.0|
|Internal| 1 x USB 3.0|
|Power|Dual Hot Plug Power Supplies 500 W|
|Rack support| HPE 1U Short Friction Rail Kit|

### Appliance BOM

|PN|Description: high end|Quantity|
|:----|:----|:----|
|P06963-B21|HPE DL20 Gen10 4SFF CTO Server|1|
|P06963-B21|HPE DL20 Gen10 4SFF CTO Server|1|
|P17104-L21|HPE DL20 Gen10 E-2234 FIO Kit|1|
|879507-B21|HPE 16-GB 2Rx8 PC4-2666V-E STND Kit|2|
|655710-B21|HPE 1-TB SATA 7.2 K SFF SC DS HDD|3|
|P06667-B21|HPE DL20 Gen10 x8x16 FLOM Riser Kit|1|
|665240-B21|HPE Ethernet 1-Gb 4-port 366FLR Adapter|1|
|782961-B21|HPE 12-W Smart Storage Battery|1|
|869081-B21|HPE Smart Array P408i-a SR G10 LH Controller|1|
|865408-B21|HPE 500-W FS Plat Hot Plug LH Power Supply Kit|2|
|512485-B21|HPE iLO Adv 1-Server License 1 Year Support|1|
|P06722-B21|HPE DL20 Gen10 RPS Enablement FIO Kit|1|
|775612-B21|HPE 1U Short Friction Rail Kit|1|

## Dell PowerEdge R340 XL

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

:::image type="content" source="media/tutorial-install-components/view-of-dell-poweredge-r340-back-panel.jpg" alt-text="Back Panel view of Dell PowerEdge 340." border="false":::

### Port expansion

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

### Deployment BOM

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

TBD