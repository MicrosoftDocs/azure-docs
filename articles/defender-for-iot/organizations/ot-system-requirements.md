---
title: Microsoft Defender for IoT OT system hardware and virtual appliance requirements
description: Learn about system requirements for hardware and virtual appliances used for the Microsoft Defender for IoT OT sensors and on-premises management console. 
ms.date: 03/28/2022
ms.topic: conceptual
---

# OT system hardware and virtual appliance requirements

This article lists the hardware and virtual appliance requirements for Microsoft Defender for IoT OT sensors and on-premises management consoles. You can use either physical or virtual appliances as needed for your organization.

For more information, see:

- [Purchase sensors or download software for sensors](how-to-manage-sensors-on-the-cloud.md#purchase-sensors-or-download-software-for-sensors)
- [Download software for the on-premises management console](how-to-manage-the-on-premises-management-console.md#download-software-for-the-on-premises-management-console)
- [Install software](how-to-install-software.md)

## Deployment options

The following tables describe supported deployment options for your OT sensors and on-premises management console. When setting up your system, choose the deployment option that meets your needs best.

### Corporate IT/OT hybrid networks

|Name  |Max Throughput (OT Traffic) |Max Monitored Assets  |Deployment |
|---------|---------|---------|---------|
|C5600 (Corporate)    | 3 Gbps        | 12K        |Physical / Virtual         |

### Enterprise monitoring at the site level

|Name  |Max throughput (OT Traffic)  |Max monitored assets  |Deployment  |
|---------|---------|---------|---------|
|E1800 (Enterprise)     |1 Gbps         |10K         |Physical / Virtual         |

### Securing production lines

|Name  |Max throughput (OT Traffic)  |Max monitored assets  |Deployment  |
|---------|---------|---------|---------|
|L500 (Line)    | 200 Mbps        |   1,000      |Physical / Virtual         |
|L100 (Line)    | 60 Mbps        |   800      | Physical / Virtual        |
|L60 (Line)     | 10 Mbps        |   100      |Physical / Virtual|

### On-premises management console

|Name  |Max monitored sensors  |Deployment  |
|---------|---------|---------|
|E1800 (Enterprise)     |Up to 300         |Physical / Virtual         |

## Supported hardware

The following hardware has been validated for physical appliances and we recommend them for deployments that require significant scale and support.

### Required operating systems

Defender for IoT sensor and on-premises management console software is built on Ubuntu 18.04. All hardware components must be compatible with Ubuntu version 18.04.

### Central processing unit (CPU)

|Name  |Supported models and versions |
|---------|---------|
|C5600 (Corporate)     |-  Intel Xeon Silver 4215 R 3.2 GHz, 11M cache, 8c/16T, 130 W       |
|E1800 (Enterprise)| - Intel Xeon E-2234, 3.6 GHz, 4C/8T, 71 W using Intel C242<br>-Intel Xeon E-2224, 3.4 GHz, 4C, 71 W using Intel C242<br>-Intel Xeon E-2144G 3.6GHz, 8M cache, 4C/8T, turbo (71W) with Intel C246|
|L500 (Line) <br> L100 (Line)<br> L60 (Line)|-Intel Core i7-8650U (1.9GHz/4-core/15W) using Intel Q170<br>-Intel Core i5-6500TE (6M Cache, up to 3.30 GHz) S1151Intel Atom® x7-E3950 Processor

### Network cards (Ethernet/SFP)

|Name  |Supported models and versions |
|---------|---------|
|C5600 (Corporate)     | -Intel X710        |
|E1800 (Enterprise)    | -Intel I350        |
|L500 (Line)           | -Intel I219        |
|L100 (Line)           |-Broadcom BCM5720   |
|L60 (Line)            |-Broadcom BCM5719   |

### Storage arrays

|Name  |Supported models and versions |
|---------|---------|
|C5600 (Corporate)     |- 6 x 1.2-TB SAS 12G Enterprise 10K SFF (2.5 in) in Hot-Plug Hard Drive - RAID 5 with HPE Smart Array P408i-a SR Gen10 Controller <br>-3 x 1-TB SATA 6G Midline 7.2 K SFF (2.5 in) – RAID 5 with HPE Smart Array P408i-a SR Controller       |
|E1800 (Enterprise)    | -2 x 1-TB SATA 6G Midline 7.2 K SFF (2.5 in) – RAID 1 with HPE Smart Array P208i-a <br> -3 X 2TB 7.2K RPM SATA 6Gbps 512n 3.5in Hot-plug Hard Drive - RAID 5 with HPE Smart Array P208i-a <br> -3 X 2TB 7.2K RPM SATA 6Gbps 512n 3.5in Hot-plug Hard Drive - RAID 5 with Dell PERC H330      |
|L500 (Line) <br> L100 (Line) <br> L60 (Line)     | -128GB M.2 M-key 2260* 2242 (SATA 3 6 Gbps) PLP<br> -HPE Edgeline 256GB SATA 6G Read Intensive M.2 2242 3yr Wty Wide Temp SSD <br>-128GB 3ME3 Wide Temperature mSATA SSD

## Supported physical appliances

Microsoft has validated the following physical appliances. Using any of the appliances listed in this section has advantages in the following areas:

- **Performance** over the total assets monitored
- **Compatibility** with new Defender for IoT releases, with validations for upgrades and driver support
- **Stability**, as validated physical appliances undergo long-term traffic monitoring and packet loss tests
- **In-lab experience**, where Microsoft support teams have been trained using validated physical appliances and have a working knowledge of the hardware
- **Availability**, as these physical appliances are available worldwide and long term

Microsoft has partnered with [Arrow Electronics](https://www.arrow.com/) to provide pre-configured sensors. To purchase a pre-configured sensor, contact Arrow at: [hardware.sales@arrow.com](mailto:hardware.sales@arrow.com).

### Supported appliances for OT network sensors

|Model / Capacity|Monitoring Ports|Max bandwidth|Max protected devices|Mounting|
|:----|:----|:----|:----|:----|
|**HPE ProLiant DL360** <br> C5600|15 x RJ45 or 8 SFP (OPT)|3Gbp/s|12,000|1U|
| **HPE ProLiant DL20+** <br>E1800|8 x RJ45 or 6 SFP (OPT)|1Gbp/s|10,000|1U|
|**Dell PowerEdge R340** <br>XL E1800|8 x RJ45 or 6 SFP (OPT)|1Gbp/s|10,000|1U|
|**HPE ProLiant DL20+** <br>L500|4 x RJ45|200Mbp/s|1,000|1U|
|**Dell Edge Gateway 5200** <br>L500| |60Mbp/s|1000|Wall mount|
|**YS-Techsystems YS-FIT2** <br>L100|1 x RJ45|10Mbp/s|100|DIN/VESA|

> [!NOTE]
> Bandwidth capacity may vary depending on protocol distribution.

### Supported appliances for on-premises management consoles

|Model / Capacity| Monitoring Ports|Monitored Sensors|Mounting|
|:----|:----|:----|:----|
|**HPE ProLiant DL20+**<br>E1800|8 x RJ45 or 6 SFP (OPT)|Up to 300|1U|
|**Dell PowerEdge R340 XL** <br> E1800|8 x RJ45 or 6 SFP (OPT)|Up to 300|1U|

## Corporate deployment: HPE ProLiant DL360

:::image type="content" source="media/ot-system-requirements/hpe-proliant-dl360.png" alt-text="Photo of the Proliant Dl360" border="false":::

|Component  |Specifications|
|---------|---------|
|Chassis     |1U Rack Server         |
|Dimensions   |4 x 3.5" chassis: <br> -4.29 x 43.46 x 70.7 cm <br> -1.69 x 17.11 x 27.83 in         |
|Weight    | Max 16.72 kg / 35.86 lb        |
|Chassis |1U rack server|
|Dimensions| 42.9 x 43.46 x 70.7 (cm)/1.69" x 17.11" x 27.83" (in)|
|Weight| Max 16.27 kg (35.86 lb)|
|Processor | Intel Xeon Silver 4215 R 3.2 GHz 11M cache 8c/16T 130 W|
|Chipset	| Intel C621|
|Memory	| 32 GB = 2 x 16-GB 2666MT/s DDR4 ECC UDIMM|
|Storage|	6 x 1.2-TB SAS 12G Enterprise 10K SFF (2.5 in) in Hot-Plug Hard Drive - RAID 5|
|Network controller|	On-board: 2 x 1 Gb <br> On-board: iLO Port Card 1 Gb <br>External: 1 x HPE Ethernet 1-Gb 4-port 366FLR Adapter|
|Management     |HPE iLO Advanced         |
|Device access     | Two rear USB 3.0        |
|One front    | USB 2.0        |
|One internal    |USB 3.0         |
|Power            |2 x HPE 500 W Flex Slot Platinum Hot Plug Low Halogen Power Supply Kit
|Rack support     | HPE 1U Gen10 SFF Easy Install Rail Kit        |

### Optional modules for port expansion

| Location  |Type |Specifications |
| ------------------------- | ---------------------- | ----------------------------------------------- |
| PCI Slot 1 (Low profile)  | DP F/O NIC             | 727054-B21 - HPE 10GbE 2p FLR-SFP+ X710 Adptr |
| PCI Slot 2 (High profile) | Quad Port Eth NIC      | 811546-B21 - HPE 1GbE 4p BASE-T I350 Adptr SI  |
| PCI Slot 2 (High profile) | DP F/O NIC             | 727054-B21 - HPE 10GbE 2p FLR-SFP+ X710 Adptr |
| PCI Slot 2 (High profile) | Quad Port F/O NIC      | 869585-B21 - HPE 10GbE 4p SFP+ X710 Adptr SI   |
| SFPs for Fiber Optic NICs | MultiMode, Short Range | 455883-B21 - HPE BLc 10G SFP+ SR Transceiver    |
| SFPs for Fiber Optic NICs | SingleMode, Long Range | 455886-B21 -  HPE BLc 10G SFP+ LR Transceiver   |
| PCI Slot 1 (Low profile)  | Quad Port Eth NIC      | 811546-B21 - HPE 1GbE 4p BASE-T I350 Adptr SI  |
| PCI Slot 1 (Low profile)  | DP F/O NIC             | 727054-B21 - HPE 10GbE 2p FLR-SFP+ X710 Adptr |
| PCI Slot 2 (High profile) | Quad Port Eth NIC      | 811546-B21 - HPE 1GbE 4p BASE-T I350 Adptr SI  |
| PCI Slot 2 (High profile) | DP F/O NIC             | 727054-B21 - HPE 10GbE 2p FLR-SFP+ X710 Adptr |
| PCI Slot 2 (High profile) | Quad Port F/O NIC      | 869585-B21 - HPE 10GbE 4p SFP+ X710 Adptr SI   |
| SFPs for Fiber Optic NICs | MultiMode, Short Range | 455883-B21 - HPE BLc 10G SFP+ SR Transceiver    |
| SFPs for Fiber Optic NICs | SingleMode, Long Range | 455886-B21 -  HPE BLc 10G SFP+ LR Transceiver   |
| PCI Slot 1 (Low profile)  | Quad Port Eth NIC      | 811546-B21 - HPE 1GbE 4p BASE-T I350 Adptr SI  |
| PCI Slot 1 (Low profile)  | DP F/O NIC             | 727054-B21 - HPE 10GbE 2p FLR-SFP+ X710 Adptr   |

### Enterprise deployment: HPE ProLiant DL20+

:::image type="content" source="media/ot-system-requirements/hpe-proliant-dl20+.png" alt-text="HPE ProLiant D120+ View" border="false":::

|Component  |Specifications|
|---------|---------|
|Chassis     |1U Rack Server         |
|Dimensions   |4 x 3.5" chassis: <br> -4.29 x 43.46 x 38.22 cm <br> -1.70 x 17.11 x 15.05 in         |
|Weight    | Max 7.9 kg / 17.41 lb        |

:::image type="content" source="media/ot-system-requirements/hpe-proliant-dl20+.png" alt-text="Photo of the DL20+ panel" border="false":::

|Quantity|PN|Description|
|----|---|----|
|1|P44111-B21|HPE DL20 Gen10+ 4SFF CTO Svr|
|1|P45252-B21|Intel Xeon E-2234 FIO CPU for HPE|
|1|869081-B21|HPE Smart Array P408i-a SR G10 LH Ctrlr|
|1|782961-B21|HPE 12W Smart Storage Battery|
|1|P45948-B21|HPE DL20 Gen10+ RPS FIO Enable Kit|
|2|865408-B21|HPE 500W FS Plat Ht Plg LH Pwr Sply Kit|
|1|775612-B21|HPE 1U Short Friction Rail Kit|
|1|512485-B21|HPE iLO Adv 1-svr Lic 1yr Support|
|1|P46114-B21|HPE DL20 Gen10+ 2x8 LP FIO Riser Kit|
|1|P21106-B21|INT I350 1GbE 4p BASE-T Adptr|
|3|P28610-B21|HPE 1TB SATA 7.2K SFF BC HDD|
|2|P43019-B21|HPE 16GB 1Rx8 PC4-3200AA-E STND Kit|

Optional modules for port expansion:
|Location |Type|Specifications|
|-------------- | --------------| --------- |
| PCI Slot 1 (Low profile)  | Quad Port Eth NIC     | 811546-B21 - HPE 1GbE 4p BASE-T I350 Adptr SI |
| PCI Slot 1 (Low profile)  | DP F/O NIC            | 727054-B21 - HPE 10GbE 2p FLR-SFP+ X710 Adptr |
| PCI Slot 2 (High profile) | Quad Port Eth NIC     | 811546-B21 - HPE 1GbE 4p BASE-T I350 Adptr SI  |
| PCI Slot 2 (High profile) | DP F/O NIC| 727054-B21 - HPE 10GbE 2p FLR-SFP+ X710 Adptr|
| PCI Slot 2 (High profile) | Quad Port F/O NIC| 869585-B21 - HPE 10GbE 4p SFP+ X710 Adptr SI|SFPs for Fiber Optic NICs | MultiMode, Short Range | 455883-B21 - HPE BLc 10G SFP+ SR Transceiver
| SFPs for Fiber Optic NICs | SingleMode, Long Range | 455886-B21 -  HPE BLc 10G SFP+ LR Transceiver|

:::image type="content" source="media/ot-system-requirements/dl20-profile-backview.png" alt-text="Profile view of back of DL20" border="false":::

### Enterprise deployment: HPE ProLiant DL20

|Component|Technical specifications|
|----|----|
|Chassis |1U rack server|
|Dimensions |(height x width x depth) <br> 4.32 x 43.46 x 38.22 cm/<br> 1.70 x 17.11 x 15.05 inch|
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

Enterprise Deployment: Dell PowerEdge R340 XL

|Component |Technical Specifications|
|----|----|
|Chassis|1U rack server|
|Dimensions|42.8 x 434.0 x 596 (mm) /1.67” x 17.09” x 23.5” (in)|
|Weight|Max 29.98 lb/13.6 Kg|
|Processor|Intel Xeon E-2144G 3.6GHz<br>8M cache4C/8T turbo (71W)|
|Chipset|Intel C246|
|Memory|32 GB = 2 x 16GB 2666MT/s DDR4 ECC UDIMM|
|Storage|3 X 2TB 7.2K RPM SATA 6Gbps 512n 3.5in Hot-plug Hard Drive - RAID 5|
|Network controller|On-board: 2 x 1Gb Broadcom BCM5720|
|On-board LOM| iDRAC Port Card 1Gb Broadcom BCM5720|
|External| 1 x Intel Ethernet i350 QP 1Gb Server Adapter Low Profile|
|Management|iDRAC 9 Enterprise|
|Device access|	2 rear USB 3.0 <br> 1 front USB 3.0|
|Power|	Dual Hot Plug Power Supplies 350W|
|Rack support|	ReadyRails™ II sliding rails for tool-less mounting in 4-post racks with square or unthreaded round holes or tooled mounting in 4-post threaded hole racks with support for optional tool-less cable management arm.

:::image type="content" source="media/tutorial-install-components/view-of-dell-poweredge-r340-back-panel.jpg" alt-text="Back Panel view of Dell PowerEdge 340" border="false":::


 ### Optional modules for port expansion:

|Location|Type|Specification|
|-----|-----|-----|
|PCI Slot 1 (Low profile)|Quad Port Eth NIC|Intel® i350 Quad Port - MCBX-NIC00-A00|
|PCI Slot 1 (Low profile)|Quad Port Eth NIC|Broadcom 5719 Quad Port 540-BBHB|
|PCI Slot 1 (Low profile)|DP F/O NIC|Intel X710 Dual Port - MCBX-NIC01-A00|
|PCI Slot 2 (High profile)|Quad Port Eth NIC|Intel® i350 Quad Port - MCBX-NIC00-A00|
|PCI Slot 2 (High profile)|DP F/O NIC|Intel X710 Dual Port - MCBX-NIC01-A00|
|PCI Slot 2 (High profile)|Quad Port F/O NIC|Intel X710-DA4 - MCBX-NIC02-A00|
|SFPs for Fiber Optic NICs|MultiMode, Short Range|Dell SFP+, SR, Optical Transceiver, Intel, 10Gb-1Gb|
|SFPs for Fiber Optic NICs|SingleMode, Long Range|Dell SFP+, LR Optical Transceiver, 1/10GbE|


### Deployment BOM
|Description|SKU|Qty|
|:----|:----|:----|
|OEM PowerEdge R340 XL|210-ARGO|1|
|PowerEdge R340XL Motherboard|329-BECZ|1|
|Trusted Platform Module 2.0|461-AAEM|1|
|3.5" Chassis with up to 4 Hot Plug Hard Drives|321-BDUX|1|
|Brand/Bezel, Embedded OS, OEM PowerEdge R340XL|325-BDGR|1|
|OEM PowerEdge R340 Shipping, DAO|340-CJQL|1|
|OEM PowerEdge R340 Shipping Material, 3.5" Chassis, DAO|340-CJQM|1|
|Intel Xeon E-2144G 3.6Ghz, 8m cache, 4C/8T, turbo (71W)|338-BQPK|1|
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
|Dual Hot Plug Power Supplies 350W|450-AEUV|1|
|Performance BIOS Settings|384-BBBL|1|
|UEFI BIOS Boot Mode with GPT Partition|800-BBDM|1|
|ReadyRails Sliding Rails Without Cable Management Arm|770-BCWN|1|
|No Systems Documentation, No OpenManage DVD Kit|631-AACK|1|
|US Order|332-1286|1|
|Basic Next Business Day 15 months|709-BBFH|1|
|ProSupport Next Business Day Onsite Service Initial, 15 Month(s)|865-BBQK|1|
|ProSupport Next Business Day Onsite Service Extension, 24 Month(s)|865-BBQL|1|
|On-site Installation Declined|900-9997|1|
|8GB 2666 MT/s DDR4 ECC UDIMM|370-AEKN|4|
|2TB 7.3 RPM SATA 6Gbps 512 3.5 in Hot-plug Hard Drive|400-ASHX|3|
|On-Board LOM|542-BBP|1|
|NEMA 5-15P to C13 Wall Plug, 125 Volt, 15 AMP, 10 Feet (3m), Power Cord, North America|450-AALV|2|
|Enterprise Program Management Support |973-3700|1|


### SMB Deployment: HPE ProLiant DL20+
:::image type="content" source="media/ot-system-requirements/hpe-proliant-dl20-plus-back-panel-view.png" alt-text="Back Panel View of HPE Proliant DL20+" border="false":::

|Component|Technical specifications|
|----|----|
|Chassis|1U rack server|
|Dimensions (height x width x depth)|4.32 x 43.46 x 38.22 cm/<br>1.70 x 17.11 x 15.05 inch|
|Weight|7.88 kg/17.37 lb|
|Processor|	Intel Xeon E-2224 <br> 3.4 GHz 4C 71 W|
|Chipset|Intel C242|
|Memory|1 x 8-GB Dual Rank x8 DDR4-2666|
|Storage|2 x 1-TB SATA 6G Midline 7.2 K SFF (2.5 in) – RAID 1 with Smart Array P208i-a|
|Network controller|On-board: 2 x 1 Gb|
|On-board| iLO Port Card 1 Gb|
|External| 1 x HPE Ethernet 1-Gb 4-port 366FLR Adapter|
|Management|HPE iLO Advanced|
|Device access| **Front**: 1 x USB 3.0 1 x USB iLO Service Port<br> **Rear**: 2 x USB 3.0|
|Internal| 1 x USB 3.0|
|Power|Hot Plug Power Supply 290 W|
|Rack support|HPE 1U Short Friction Rail Kit|

### Appliance BOM

|PN|Description|Quantity|
|:----|:----|:----|
|P06961-B21|HPE DL20 Gen10 NHP 2LFF CTO Server|1|
|P06961-B21|HPE DL20 Gen10 NHP 2LFF CTO Server|1|
|P17102-L21|HPE DL20 Gen10 E-2224 FIO Kit|1|
|879505-B21|HPE 8-GB 1Rx8 PC4-2666V-E STND Kit|1|
|801882-B21|HPE 1-TB SATA 7.2 K LFF RW HDD|2|
|P06667-B21|HPE DL20 Gen10 x8x16 FLOM Riser Kit|1|
|665240-B21|HPE Ethernet 1-Gb 4-port 366FLR Adapter|1|
|869079-B21|HPE Smart Array E208i-a SR G10 LH Controller|1|
|P21649-B21|HPE DL20 Gen10 Plat 290 W FIO PSU Kit|1|
|P06683-B21|HPE DL20 Gen10 M.2 SATA/LFF AROC Cable Kit|1|
|512485-B21|HPE iLO Adv 1-Server License 1 Year Support|1|
|775612-B21|HPE 1U Short Friction Rail Kit|1|

## Next Steps
For more information, see:

- [Purchase sensors or download software for sensors](how-to-manage-sensors-on-the-cloud.md#purchase-sensors-or-download-software-for-sensors)
- [Download software for the on-premises management console](how-to-manage-the-on-premises-management-console.md#download-software-for-the-on-premises-management-console)
- [Install software](how-to-install-software.md)