---
title: Microsoft Defender for IoT supported pre-configured appliances for OT systems
description: Learn about the supported, pre-configured appliances for Microsoft Defender for IoT OT sensors and on-premises management consoles.
ms.date: 04/04/2022
ms.topic: conceptual
---

# Pre-configured physical appliances for OT systems

This article describes the pre-configured appliances available for Microsoft Defender for IoT OT sensors and on-premises management consoles.

Pre-configured physical appliances have been validated for Defender for IoT OT system monitoring, and have the following advantages over installing your own software:

- **Performance** over the total assets monitored
- **Compatibility** with new Defender for IoT releases, with validations for upgrades and driver support
- **Stability**, as validated physical appliances undergo long-term traffic monitoring and packet loss tests
- **In-lab experience**, where Microsoft support teams have been trained using validated physical appliances and have a working knowledge of the hardware
- **Availability**, as these physical appliances are available worldwide and long term

Microsoft has partnered with [Arrow Electronics](https://www.arrow.com/) to provide pre-configured sensors. To purchase a pre-configured sensor, contact Arrow at: [hardware.sales@arrow.com](mailto:hardware.sales@arrow.com).

For more information, see [Purchase sensors or download software for sensors](how-to-manage-sensors-on-the-cloud.md#purchase-sensors-or-download-software-for-sensors)

To install Defender for IoT software on your own appliances, see [OT hardware system requirements for your own installations](ot-physical-appliances.md) or [OT system virtual appliance requirements](ot-virtual-appliances.md).

## Supported appliances for OT network sensors

You can purchase any of the following appliances for your OT network sensors.

> [!NOTE]
> Bandwidth capacity may vary depending on protocol distribution.


- **HPE ProLiant DL360**, for [corporate deployments](#hpe-proliant-dl360):

    |Bandwidth capacity|Monitoring ports|Max bandwidth|Max protected devices|Mounting|
    |:----|:----|:----|:----|:----|
    |C5600|15 RJ45 or eight SFP (OPT)|3Gbp/s|12,000|1U|

- **HPE ProLiant DL20 Plus**, for [enterprise deployments](#dl20-enterprise):

    |Bandwidth capacity|Monitoring ports|Max bandwidth|Max protected devices|Mounting|
    |:----|:----|:----|:----|:----|
    |  E1800|Eight RJ45 or six SFP (OPT)|1 Gbp/s|10,000|1U|

- **Dell PowerEdge R340**, for [enterprise deployments](#dell-poweredge-r340-xl):

    |Bandwidth capacity|Monitoring ports|Max bandwidth|Max protected devices|Mounting|
    |:----|:----|:----|:----|:----|
    |XL E1800| Eight RJ45 or six SFP (OPT)|1 Gbp/s|10,000|1U|

- **HPE ProLiant DL20 Plus**, for [SMB rugged deployments](#dl20-rugged):

    |Bandwidth capacity|Monitoring ports|Max bandwidth|Max protected devices|Mounting|
    |:----|:----|:----|:----|:----|
    | L500|Four RJ45|200Mbp/s|1,000|1U|

<!--
- **Dell Edge Gateway 5200**:

    |Bandwidth capacity|Max bandwidth|Max protected devices|Mounting|
    |:----|:----|:----|:----|
    |L500|60 Mbp/s|1000|Wall mount|
-->

- **YS-Techsystems YS-FIT2**, for [SMB rugged deployments](#ys-techsystems-ys-fit2):

    |Bandwidth capacity|Monitoring ports|Max bandwidth|Max protected devices|Mounting|
    |:----|:----|:----|:----|:----|
    | L100|One RJ45|10Mbp/s|100|DIN/VESA|


## Supported appliances for on-premises management consoles

You can purchase any of the following appliances for your OT network sensors.

> [!NOTE]
> Bandwidth capacity may vary depending on protocol distribution.

- **HPE ProLiant DL20 Plus**, for [enterprise deployments](#dl20-enterprise):

    |Bandwidth capacity| Monitoring ports|Monitored sensors|Mounting|
    |:----|:----|:----|:----|
    |E1800|Eight RJ45 or Six SFP (OPT)|Up to 300|1U|

- **Dell PowerEdge R340**, for [enterprise deployments](#dell-poweredge-r340-xl):

    |Bandwidth capacity| Monitoring ports|Monitored sensors|Mounting|
    |:----|:----|:----|:----|
    |E1800|Eight RJ45 or six SFP (OPT)|Up to 300|1U|


## Supported appliances per deployment type

The following tabs describe supported specifications, depending on your system deployment type.

# [Corporate](#tab/corporate)

### HPE ProLiant DL360

For corporate deployments, use the **HPE ProLiant DL360** with the following specifications:

:::image type="content" source="media/ot-system-requirements/hpe-proliant-dl360.png" alt-text="Photo of the Proliant Dl360" border="false":::

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
|Power            |Two HPE 500 W flex slot platinum hot plug low halogen power supply kit
|Rack support     | HPE 1U Gen10 SFF easy install rail kit        |

Optional modules for port expansion include:

|Location |Type|Specifications|
|-------------- | --------------| --------- |
| PCI Slot 1 (Low profile)| Quad Port Eth NIC| 811546-B21 - HPE 1 GbE 4p BASE-T I350 Adapter SI |
| PCI Slot 1 (Low profile)  | DP F/O NIC|727054-B21 - HPE 10 GbE 2p FLR-SFP+ X710 Adapter|
| PCI Slot 2 (High profile)| Quad Port Eth NIC|811546-B21 - HPE 1 GbE 4p BASE-T I350 Adapter SI|
| PCI Slot 2 (High profile)|DP F/O NIC| 727054-B21 - HPE 10 GbE 2p FLR-SFP+ X710 Adapter|
| PCI Slot 2 (High profile)|Quad Port F/O NIC| 869585-B21 - HPE 10 GbE 4p SFP+ X710 Adapter SI|
| SFPs for Fiber Optic NICs|MultiMode, Short Range|455883-B21 - HPE BLc 10G SFP+ SR Transceiver|
| SFPs for Fiber Optic NICs|SingleMode, Long Range | 455886-B21 -  HPE BLc 10G SFP+ LR Transceiver|

# [Enterprise](#tab/enterprise)

For enterprise deployments, use one of the following options and specifications:

- HPE ProLiant DL20 Plus
- HPE ProLiant DL20
- Dell PowerEdge R340 XL

### <a name"dl20-enterprise"></a>HPE ProLiant DL20 Plus

:::image type="content" source="media/ot-system-requirements/hpe-proliant-DL20 Plus.png" alt-text="Photo of the DL20 Plus panel" border="false":::


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
|2|865408-B21|HPE 500W flex slot platinum hot plug low halogen power supply kit|
|1|775612-B21|HPE 1U short friction rail lit|
|1|512485-B21|HPE iLO advanced 1-server license 1-year support|
|1|P46114-B21|HPE DL20 Gen10+ 2x8 LP FIO Riser Kit|
|1|P21106-B21|INT I350 1 GbE 4p BASE-T Adapter|
|3|P28610-B21|HPE 1 TB SATA 7.2 K SFF BC HDD|
|2|P43019-B21|HPE 16 GB 1Rx8 PC4-3200AA-E standard kit|

Optional modules for port expansion include:

|Location |Type|Specifications|
|-------------- | --------------| --------- |
| PCI Slot 1 (Low profile)| Quad Port Eth NIC| 811546-B21 - HPE 1 GbE 4p BASE-T I350 Adapter SI |
| PCI Slot 1 (Low profile)  | DP F/O NIC|727054-B21 - HPE 10 GbE 2p FLR-SFP+ X710 Adapter|
| PCI Slot 2 (High profile)| Quad Port Eth NIC|811546-B21 - HPE 1 GbE 4p BASE-T I350 Adapter SI|
| PCI Slot 2 (High profile)|DP F/O NIC| 727054-B21 - HPE 10 GbE 2p FLR-SFP+ X710 Adapter|
| PCI Slot 2 (High profile)|Quad Port F/O NIC| 869585-B21 - HPE 10 GbE 4p SFP+ X710 Adapter SI|
| SFPs for Fiber Optic NICs|MultiMode, Short Range|455883-B21 - HPE BLc 10G SFP+ SR Transceiver|
| SFPs for Fiber Optic NICs|SingleMode, Long Range | 455886-B21 -  HPE BLc 10G SFP+ LR Transceiver|

For example:

:::image type="content" source="media/ot-system-requirements/dl20-profile-backview.png" alt-text="Profile view of back of DL20" border="false":::

### HPE ProLiant DL20

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

**Appliance BOM**:

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

### Dell PowerEdge R340 XL

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

:::image type="content" source="media/tutorial-install-components/view-of-dell-poweredge-r340-back-panel.jpg" alt-text="Back Panel view of Dell PowerEdge 340" border="false":::

Optional modules for port expansion include:

|Location|Type|Specification|
|-----|-----|-----|
|PCI Slot 1 (Low profile)|Quad Port Eth NIC|Intel® i350 Quad Port - MCBX-NIC00-A00|
|PCI Slot 1 (Low profile)|Quad Port Eth NIC|Broadcom 5719 Quad Port 540-BBHB|
|PCI Slot 1 (Low profile)|DP F/O NIC|Intel X710 Dual Port - MCBX-NIC01-A00|
|PCI Slot 2 (High profile)|Quad Port Eth NIC|Intel® i350 Quad Port - MCBX-NIC00-A00|
|PCI Slot 2 (High profile)|DP F/O NIC|Intel X710 Dual Port - MCBX-NIC01-A00|
|PCI Slot 2 (High profile)|Quad Port F/O NIC|Intel X710-DA4 - MCBX-NIC02-A00|
|SFPs for Fiber Optic NICs|MultiMode, Short Range|Dell SFP+, SR, Optical Transceiver, Intel, 10 Gb-1 Gb|
|SFPs for Fiber Optic NICs|SingleMode, Long Range|Dell SFP+, LR Optical Transceiver, 1/10 GbE|

**Deployment BOM**:

|Description|SKU|Qty|
|:----|:----|:----|
|OEM PowerEdge R340 XL|210-ARGO|1|
|PowerEdge R340XL Motherboard|329-BECZ|1|
|Trusted Platform Module 2.0|461-AAEM|1|
|3.5" Chassis with up to 4 Hot Plug Hard Drives|321-BDUX|1|
|Brand/Bezel, Embedded OS, OEM PowerEdge R340XL|325-BDGR|1|
|OEM PowerEdge R340 Shipping, DAO|340-CJQL|1|
|OEM PowerEdge R340 Shipping Material, 3.5" Chassis, DAO|340-CJQM|1|
|Intel Xeon E-2144G 3.6 Ghz, 8m cache, 4C/8T, turbo (71 W)|338-BQPK|1|
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
|NEMA 5-15P to C13 Wall Plug, 125 Volt, 15 AMP, 10 Feet (3m), Power Cord, North America|450-AALV|2|
|Enterprise Program Management Support |973-3700|1|


# [SMB rugged](#tab/smb-rugged)

For an SMB deployment, use one of the following options and specifications:

- HPE ProLiant DL20 Plus
- YS-techsystems YS-FIT2

### <a name"dl20-rugged"></a>HPE ProLiant DL20 Plus

:::image type="content" source="media/ot-system-requirements/hpe-proliant-dl20-plus-back-panel-view.png" alt-text="Back Panel View of HPE Proliant DL20 Plus" border="false":::

|Component|Technical specifications|
|----|----|
|Chassis|1U rack server|
|Dimensions |4.32 x 43.46 x 38.22 cm / 1.70 x 17.11 x 15.05 in|
|Weight|7.88 kg / 17.37 lb|
|Processor|	Intel Xeon E-2224 <br> 3.4 GHz 4C 71 W|
|Chipset|Intel C242|
|Memory|One 8-GB Dual Rank x8 DDR4-2666|
|Storage|Two 1-TB SATA 6G Midline 7.2 K SFF (2.5 in) – RAID 1 with Smart Array P208i-a|
|Network controller|On-board: Two 1 Gb|
|On-board| iLO Port Card 1 Gb|
|External| 1 x HPE Ethernet 1-Gb 4-port 366FLR Adapter|
|Management|HPE iLO Advanced|
|Device access| **Front**: One USB 3.0 1 x USB iLO Service Port<br> **Rear**: Two USB 3.0|
|Internal| One USB 3.0|
|Power|Hot Plug Power Supply 290 W|
|Rack support|HPE 1U Short Friction Rail Kit|

**Appliance BOM**:

|PN|Description|Quantity|
|:----|:----|:----|
|P06961-B21|HPE DL20 Gen10 NHP 2LFF CTO Server|1|
|P06961-B21|HPE DL20 Gen10 NHP 2LFF CTO Server|1|
|P17102-L21|HPE DL20 Gen10 E-2224 FIO Kit|1|
|879505-B21|HPE 8-GB 1Rx8 PC4-2666V-E Standard Kit|1|
|801882-B21|HPE 1-TB SATA 7.2 K LFF RW HDD|2|
|P06667-B21|HPE DL20 Gen10 x8x16 FLOM Riser Kit|1|
|665240-B21|HPE Ethernet 1-Gb 4-port 366FLR Adapter|1|
|869079-B21|HPE Smart Array E208i-a SR G10 LH Controller|1|
|P21649-B21|HPE DL20 Gen10 Plat 290 W FIO PSU Kit|1|
|P06683-B21|HPE DL20 Gen10 M.2 SATA/LFF AROC Cable Kit|1|
|512485-B21|HPE iLO Adv 1-Server License 1 Year Support|1|
|775612-B21|HPE 1U Short Friction Rail Kit|1|

### YS-techsystems YS-FIT2

|Components|Technical Specifications|
|:----|-----|
|Construction |Aluminum | zinc die cast parts, Fanless & Dust-proof DesignDimensions |112 mm (W) x 112 mm (D) x 25mm (H)4.41in (W) x 4.41in (D) x 0.98 in (H)|
|Weight |0.35kgCPU |Intel Atom® x7-E3950 ProcessorMemory |8 GB SODIMM 1 x 204-pin DDR3L non-ECC 1866 (1.35V)Storage |128 GB M.2 M-key 2260* | 2242 (SATA 3 6 Gbps) PLP|
|Network controller |2x 1 GbE LAN PortsDevice access |2 x USB 2.0, 2 X USB 3.0Power Adapter |7V-20V (Optional 9V-36V) DC / 5W-15W Power AdapterVehicle DC cable for fitlet2 (Optional)|
|UPS|fit-uptime Miniature 12V UPS for miniPCs (Optional)|
|Mounting |VESA / wall or Din Rail mounting kitTemperature |0°C ~ 70°CHumidity |5%~95%, non-condensingVibration  |IEC TR 60721-4-7:2001+A1:03, Class 7M1, test method IEC 60068-2-64 (up to 2 KHz , 3 axis)|
|Shock|IEC TR 60721-4-7:2001+A1:03, Class 7M1, test method IEC 60068-2-27 (15g , 6 directions)|
|EMC |CE/FCC Class B|

---

## Legacy supported physical appliances

This section details more appliances that are certified but aren't currently offered as pre-configured appliances.

# [Legacy enterprise](#tab/legacy-enterprise)

Legacy options for enterprise deployments include:

- HPE ProLiant DL20
- Dell PowerEdge R340 XL

### HPE ProLiant DL20 (legacy enterprise)

|Component|Technical specifications|
|:----|:----|
|Chassis|1U rack server|
|Dimensions |(height x width x depth)	4.32 x 43.46 x 38.22 cm/1.70 x 17.11 x 15.05 inch|
|Weight|7.9 kg/17.41 lb|
|Processor|Intel Xeon E-2234 <br> 3.6 GHz <br>4C/8T 71 W|
|Chipset|Intel C242|
|Memory|2 x 16-GB Dual Rank x8 DDR4-2666|
|Storage|3 x 1-TB SATA 6G Midline 7.2 K SFF (2.5 in) – RAID 5 with Smart Array P408i-a SR Controller|
|Network controller|On-board: 2 x 1 Gb <br>On-board: iLO Port Card 1  GbExternal: 1 x HPE Ethernet 1-Gb 4-port 366FLR Adapter|
|Management	|HPE iLO Advanced|
|Device access|	Front: 1 x USB 3. <br> 1 x USB iLO Service Port <br>Rear: 2 x USB 3.0 <br> Internal: 1 x USB 3.0|
|Power|	Dual Hot Plug Power Supplies 500 W|
|Rack support|HPE 1U Short Friction Rail Kit|

**Appliance BOM**:

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

### Dell PowerEdge R340 XL (legacy enterprise)


|Component|	Technical Specifications|
|:----|:----|
|Chassis|	1U rack server|
|Dimensions|	42.8 x 434.0 x 596 (mm) /1.67” x 17.09” x 23.5” (in)|
|Weight|	Max 29.98 lb/13.6 Kg|
|Processor|	Intel Xeon E-2144G 3.6 GHz <br>8M cache <br> 4C/8T <br> turbo (71 W|
|Chipset|Intel C246|
|Memory	|32 GB = 2 x 16 GB 2666MT/s DDR4 ECC UDIMM|
|Storage| 3 X 2 TB 7.2 K RPM SATA 6 Gbps 512n 3.5in Hot-plug Hard Drive - RAID 5|
|Network controller|On-board: 2 x 1 Gb Broadcom BCM5720 <br>On-board LOM: iDRAC Port Card 1 Gb Broadcom BCM5720 <br>External: 1 x Intel Ethernet i350 QP 1 Gb Server Adapter Low Profile|
|Management|iDRAC 9 Enterprise|
|Device access|	2 rear USB 3.0|
|1 front| USB 3.0|
|Power|	Dual Hot Plug Power Supplies 350 W|
|Rack support|	ReadyRails™ II sliding rails for tool-less mounting in 4-post racks with square or unthreaded round holes or tooled mounting in 4-post threaded hole racks| with support for optional tool-less cable management arm.|

---

# [Legacy SMB](#tab/legacy-smb)

Legacy options for SMB deployments include the HPE ProLiant Dl20:

### HPE ProLiant DL20 (legacy SMB)

|Component|Technical specifications|
|:----|:----|
|Chassis|	1U rack server|
|Dimensions| (height x width x depth)	4.32 x 43.46 x 38.22 cm/1.70 x 17.11 x 15.05 inch|
|Weight|	7.88 kg/17.37 lb|
|Processor|	Intel Xeon E-2224 <br> 3.4 GHz <br> 4C <br> 71 W|
|Chipset|	Intel C242|
|Memory|	1 x 8-GB Dual Rank x8 DDR4-2666|
|Storage|	2 x 1-TB SATA 6G Midline 7.2 K SFF (2.5 in) – RAID 1 with Smart Array P208i-a|
|Network controller|On-board: 2 x 1 Gb<br> On-board: iLO Port Card 1 Gb<br>External: 1 x HPE Ethernet 1-Gb 4-port 366FLR Adapter|
|Management|HPE iLO Advanced|
|Device access|Front: 1 x USB 3.0 <br> 1 x USB iLO Service Port <br>Rear: 2 x USB 3.0 <br>Internal: 1 x USB 3.0|
|Power|Hot Plug Power Supply 290 W|
|Rack support|HPE 1U Short Friction Rail Kit|

**Appliance BOM**:

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

# [Legacy SMB rugged](#tab/legacy-smb-rugged)

Legacy options for SMB rugged deployments include:

- HPE Edgeline EL300
- Neousys Nuvo-5006LP

### HPE Edgeline EL300 (legacy SMB rugged)

|Component|Technical specifications|
|:----|:----|
|Construction|Aluminum, Fanless & Dust-proof Design|
|Dimensions (height x width x depth)|200.5 mm (7.9”) tall, 232 mm (9.14”) wide by 100 mm (3.9”) deep|
|Weight|4.91 KG (10.83 lbs.)|
|CPU|Intel Core i7-8650U (1.9GHz/4-core/15W)|
|Chipset|Intel® Q170 Platform Controller Hub|
|Memory|8 GB DDR4 2133 MHz Wide Temperature SODIMM|
|Storage|128 GB 3ME3 Wide Temperature mSATA SSD|
|Network controller|6x Gigabit Ethernet ports by Intel® I219|
|Device access|4 USBs: 2 fronts; 2 rears; 1 internal|
|Power Adapter|250V/10A|
|Mounting|Mounting kit, Din Rail|
|Operating Temperature|0C to +70C|
|Humidity|10%~90%, non-condensing|
|Vibration|0.3 gram 10 Hz to 300 Hz, 15 minutes per axis - Din rail|
|Shock|10G 10 ms, half-sine, three for each axis. (Both positive & negative pulse) – Din Rail|

**Appliance BOM**:

|Product|Description|
|:----|:----|
|P25828-B21|HPE Edgeline EL300 v2 Converged Edge System|
|P25828-B21 B19|HPE EL300 v2 Converged Edge System|
|P25833-B21|Intel Core i7-8650U (1.9GHz/4-core/15W) FIO Basic Processor Kit for HPE Edgeline EL300|
|P09176-B21|HPE Edgeline 8 GB (1x8 GB) Dual Rank x8 DDR4-2666 SODIMM WT CAS-19-19-19 Registered Memory FIO Kit|
|P09188-B21|HPE Edgeline 256 GB SATA 6G Read Intensive M.2 2242 3yr Wty Wide Temp SSD|
|P04054-B21|HPE Edgeline EL300 SFF to M.2 Enablement Kit|
|P08120-B21|HPE Edgeline EL300 12VDC FIO Transfer Board|
|P08641-B21|HPE Edgeline EL300 80W 12VDC Power Supply|
|AF564A|HPE C13 - SI-32 IL 250V 10Amp 1.83 m Power Cord|
|P25835-B21|HPE EL300 v2 FIO Carrier Board|
|R1P49AAE|HPE EL300 iSM Adv 3yr 24x7 Sup_Upd E-LTU|
|P08018-B21 optional|HPE Edgeline EL300 Low Profile Bracket Kit|
|P08019-B21 optional|HPE Edgeline EL300 DIN Rail Mount Kit|
|P08020-B21 optional|HPE Edgeline EL300 Wall Mount Kit|
|P03456-B21 optional|HPE Edgeline 1 GbE 4-port TSN FIO Daughter Card|

### Neousys Nuvo-5006LP (legacy SMB rugged)

:::image type="content" source="media/ot-system-requirements/cyberx.png" alt-text="Photo of a Neousys Nuvo-5006LP":::


|Component|Technical Specifications|
|:----|:----|
|Construction|Aluminum, Fanless & Dust-proof Design|
|Dimensions|240 mm (W) x 225 mm (D) x 77 mm (H)|
|Weight|3.1 kg (incl. CPU, memory and HDD)|
|CPU|Intel Core i5-6500TE (6M Cache, up to 3.30 GHz) S1151|
|Chipset|Intel® Q170 Platform Controller Hub|
|Memory|8 GB DDR4 2133MHz Wide Temperature SODIMM|
|Storage|128 GB 3ME3 Wide Temperature mSATA SSD|
|Network controller|6x Gigabit Ethernet ports by Intel® I219|
|Device access|4 USBs: 2 fronts; 2 rears; 1 internal|
|Power Adapter|120/240VAC-20VDC/6A|
|Mounting|Mounting kit, Din Rail|
|Operating Temperature|-25°C -  70°C|   |Storage Temperature|-40°C ~ 85°C|
|Humidity|10%~90%, non-condensing|
|Vibration|Operating, 5 Grms, 5-500 Hz, 3 Axes <br>(w/ SSD, according to IEC60068-2-64)|
|Shock|Operating, 50 Grms, Half-sine 11 ms Duration <br>(w/ SSD, according to IEC60068-2-27)|
|EMC|CE/FCC Class A, according to EN 55022, EN 55024 & EN 55032|

---


## Next steps

Continue understanding system requirements for physical or virtual appliances. For more information, see [OT system deployment options](ot-deployment-options.md).

Then, use any of the following procedures to continue:

- [Purchase sensors or download software for sensors](how-to-manage-sensors-on-the-cloud.md#purchase-sensors-or-download-software-for-sensors)
- [Download software for an on-premises management console](how-to-manage-the-on-premises-management-console.md#download-software-for-the-on-premises-management-console)
- [Install software](how-to-install-software.md)
