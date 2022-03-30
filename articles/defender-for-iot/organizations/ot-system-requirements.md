---
title: Microsoft Defender for IoT OT system hardware and virtual appliance requirements
description: Learn about system requirements for hardware and virtual appliances used for the Microsoft Defender for IoT OT sensors and on-premises management console. 
ms.date: 03/28/2022
ms.topic: conceptual
---

# OT system hardware and virtual appliance requirements

This article lists the hardware and virtual appliance requirements for Microsoft Defender for IoT OT sensors and on-premises management consoles. You can use either physical or virtual appliances as needed for your organization.

## Deployment options

The following tables describe supported deployment options for your OT sensors and on-premises management console. When setting up your system, choose the deployment option that meets your needs best.

### Corporate IT/OT hybrid networks

|Name  |Max Throughput (OT Traffic) |Max Monitored Assets  |Deployment |
|---------|---------|---------|---------|
|C5600 (Corporate)    | 3 Gbps        | 12K        |Physical / Virtual         |

### Enterprise monitoring at the site level

|Name  |Max Throughput (OT Traffic)  |Max Monitored Assets  |Deployment  |
|---------|---------|---------|---------|
|E1800 (Enterprise)     |1 Gbps         |10K         |Physical / Virtual         |

### Securing production lines

|Name  |Max Throughput (OT Traffic  |Max Monitored Assets  |Deployment  |
|---------|---------|---------|---------|
|L500 (Line)    | 200 Mbps        |   1,000      |Physical / Virtual         |
|L100 (Line)    | 60 Mbps        |   800      | Physical / Virtual        |
|L60 (Line)     | 10 Mbps        |   100      |Physical / Virtual|

### On-premises management console

|Name  |Max Monitored Sensors  |Deployment  |
|---------|---------|---------|
|E1800 (Enterprise)     |Up to 300         |Physical / Virtual         |

## Supported hardware

The following hardware has been validated for physical appliances and we recommend them for deployments that require significant scale and support. The following hardware has been validated for physical appliances and we recommend them for deployments that require significant scale and support.

### Required operating systems

Defender for IoT sensor and on-premises management console software is built on Ubuntu 18.04. All hardware components must be compatible with Ubuntu version 18.04.

### Central Processing Unit (CPU)

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

Microsoft has partnered with [Arrow Electronics](www.arrow.com) to provide pre-configured sensors. To purchase a pre-configured sensor, contact Arrow at: [hardware.sales@arrow.com](mailto:hardware.sales@arrow.com).

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

:::image type="content" source="media/ot-system-requirements/hpe-proliant-dl360.png" alt-text="Photo of the Proliant Dl360":::


|Component  |Specifications|
|---------|---------|
|Chassis     |1U Rack Server         |
|Dimensions   |4 x 3.5" chassis: <br> -4.29 x 43.46 x 70.7 cm <br> -1.69 x 17.11 x 27.83 in         |
|Weight    | Max 16.72 kg / 35.86 lb        |

### CORPORATE DEPLOYMENT: HPE PROLIANT DL360
|Component	| Technical specifications|
|---------|---------|
|Chassis |	1U rack server|
|Dimensions	| 42.9 x 43.46 x 70.7 (cm)/1.69" x 17.11" x 27.83" (in)|
|Weight	| Max 16.27 kg (35.86 lb)|
|Processor	| Intel Xeon Silver 4215 R 3.2 GHz| 11M cache| 8c/16T| 130 W|
|Chipset	| Intel C621|
|Memory	| 32 GB = 2 x 16-GB 2666MT/s DDR4 ECC UDIMM|
|Storage|	6 x 1.2-TB SAS 12G Enterprise 10K SFF (2.5 in) in Hot-Plug Hard Drive - RAID 5|
|Network controller|	On-board: 2 x 1 Gb <br> On-board: iLO Port Card 1 Gb <br>External: 1 x HPE Ethernet 1-Gb 4-port 366FLR Adapter|

### CORPORATE DEPLOYMENT: HPE PROLIANT DL360

|Component |Technical Specifications  |
|---------|---------|
|Management     |HPE iLO Advanced         |
|Device access     | Two rear USB 3.0        |
|One front    | USB 2.0        |
|One internal    |USB 3.0         |
|Power            |2 x HPE 500 W Flex Slot Platinum Hot Plug Low Halogen Power Supply Kit
|Rack support     | HPE 1U Gen10 SFF Easy Install Rail Kit        |

### Optional modules for port expansion:
| PCI Slot 1 (Low profile)  |                        |                                                 |
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


### Enterprise Deployment: HPE ProLiant DL20+

:::image type="content" source="media/ot-system-requirements/hpe-proliant-dl20+.png" alt-text="":::

|Component  |Specifications|
|---------|---------|
|Chassis     |1U Rack Server         |
|Dimensions   |4 x 3.5" chassis: <br> -4.29 x 43.46 x 38.22 cm <br> -1.70 x 17.11 x 15.05 in         |
|Weight    | Max 7.9 kg / 17.41 lb        |

:::image type="content" source="media/ot-system-requirements/HPE ProLiant DL20+.png" alt-text="Photo of the DL20+ panel":::

|Quantity| |PN|Description|
|:----|:----|:----|:----|
|1| |P44111-B21|HPE DL20 Gen10+ 4SFF CTO Svr|
|1| |P45252-B21|Intel Xeon E-2234 FIO CPU for HPE|
|1| |869081-B21|HPE Smart Array P408i-a SR G10 LH Ctrlr|
|1| |782961-B21|HPE 12W Smart Storage Battery|
|1| |P45948-B21|HPE DL20 Gen10+ RPS FIO Enable Kit|
|2| |865408-B21|HPE 500W FS Plat Ht Plg LH Pwr Sply Kit|
|1| |775612-B21|HPE 1U Short Friction Rail Kit|
|1| |512485-B21|HPE iLO Adv 1-svr Lic 1yr Support|
|1| |P46114-B21|HPE DL20 Gen10+ 2x8 LP FIO Riser Kit|
|1| |P21106-B21|INT I350 1GbE 4p BASE-T Adptr|
|3| |P28610-B21|HPE 1TB SATA 7.2K SFF BC HDD|
|2| |P43019-B21|HPE 16GB 1Rx8 PC4-3200AA-E STND Kit|

Optional modules for port expansion:
|Location | Type |Specifications |
| ------------------------- | ---------------------- | ----------------------------------------------- |
| PCI Slot 1 (Low profile)  | Quad Port Eth NIC      | 811546-B21 - HPE 1GbE 4p BASE-T I350 Adptr SI  |
| PCI Slot 1 (Low profile)  | DP F/O NIC             | 727054-B21 - HPE 10GbE 2p FLR-SFP+ X710 Adptr |
| PCI Slot 2 (High profile) | Quad Port Eth NIC      | 811546-B21 - HPE 1GbE 4p BASE-T I350 Adptr SI  |
| PCI Slot 2 (High profile) | DP F/O NIC             | 727054-B21 - HPE 10GbE 2p FLR-SFP+ X710 Adptr |
| PCI Slot 2 (High profile) | Quad Port F/O NIC      | 869585-B21 - HPE 10GbE 4p SFP+ X710 Adptr SI   |
| SFPs for Fiber Optic NICs | MultiMode, Short Range | 455883-B21 - HPE BLc 10G SFP+ SR Transceiver    |
| SFPs for Fiber Optic NICs | SingleMode, Long Range | 455886-B21 -  HPE BLc 10G SFP+ LR Transceiver   |

