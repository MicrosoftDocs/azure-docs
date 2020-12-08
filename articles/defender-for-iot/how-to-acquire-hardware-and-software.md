---
title: Acquire hardware and software 
description: Learn about software and hardware for certified Defender for IoT sensors and the on-premises management console. 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/07/2020
ms.topic: how-to
ms.service: azure
---

# Acquire hardware and software

This article provides information on certified Defender for IoT sensor appliances. This includes certified *pre-configured* appliances, on which software is already installed, as well as non-configured certified appliances on which you can download and install required software.

The article also provides details about on-premises management console appliance specifications. The on-premises management console is not available as a pre-configured appliance.

- If you want to purchase a pre-configured sensor, review the models available in the sensor Appliances section and then proceed with the purchase.

- If you want to purchase your own appliance, review the models available in the sensor appliances section and in the additional certified appliances section. After acquiring the appliance, you can download and install the software.

- If you want to purchase the on-premises management console, review the information in on-premises management console appliance. After acquiring the device, you can download and install the software.

Once you have completed the tasks here, you can install the software and set up your network.
## Sensor appliances

Defender for IoT supports both physical and virtual deployments.

### Physical sensors

This article provides an overview of physical sensor models available. You can purchase sensors with preconfigured software or purchase sensors that are not preconfigured.

| Deployment type | Corporate | Enterprise | SMB |
|--|--|--|--|
| Image | :::image type="content" source="media/how-to-prepare-your-network/corporate-hpe-proliant-dl360.png" alt-text="The Corporate level model."::: | :::image type="content" source="media/how-to-prepare-your-network/enterprise-and-smb-hpe-proliant-dl20.png" alt-text="The Enterprise-level model."::: | :::image type="content" source="media/how-to-prepare-your-network/enterprise-and-smb-hpe-proliant-dl20.png" alt-text="The SMB level model."::: |
| Model | HPE ProLiant DL360 | HPE ProLiant DL20 | HPE ProLiant DL20 |
| Monitoring ports | up to 15 RJ45 or 8 OPT | up to 8 RJ45 or 6 OPT | 4 RJ45 |
| Max Bandwidth [1](#anchortext) | 3 Gb per second | 1 Gb per second | 200 Mb per second |
| Max Protected Devices | 30,000 | 15,000 | 1,000 |

See appliance specifications for vendor details.

About Preconfigured sensors: Microsoft has partnered with Arrow to provide preconfigured sensors. In order to purchase a preconfigured sensor, contact Arrow at the following address: <hardware.sales@arrow.com>

About Bringing your Own Appliance: Review supported models described here. After you have acquired your appliance, navigate to **Defender for IoT** > **Network Sensors ISO** > **Installation** to download the software.

:::image type="content" source="media/how-to-prepare-your-network/azure-defender-for-iot-sensor-download-software-screen.png" alt-text="Network sensors ISO":::

<a id="anchortext">1</a> Bandwidth capacity may vary depending on protocols distribution.

### Virtual sensors

This article provides an overview of the virtual sensors that are available.

| Deployment type | Corporate | Enterprise | SMB |
|--|--|--|--|
| Max Bandwidth | 2.5 Gb/Sec | 800 Mb/Sec | 160 Mb/Sec |
| Max protected devices | 30,000 | 10,000 | 2,500 |

## On-premises management console appliance

The management console is available as a virtual deployment.

| Deployment type | Enterprise |
|--|--|
| Appliance Type | HPE DL20, VM |
| Number of Managed sensors | Up to 300 |

After acquiring an on-premises management console, go to **Defender for IoT** > **On-premises management console** > **ISO Installation** to download the ISO.

:::image type="content" source="media/how-to-prepare-your-network/azure-defender-for-iot-iso-download-screen.png" alt-text="On-premises management console":::

## Appliance specifications

This article describes hardware specifications for the following appliances:

- Corporate Deployment – HPE ProLiant DL360

- Enterprise Deployment – HPE ProLiant DL20

- SMB Deployment – HPE ProLiant DL20

- Virtual Appliance Specifications

## Corporate deployment – HPE ProLiant DL360

| Component | Technical specifications |
|--|--|
| Chassis | 1U rack server |
| Dimensions | 42.9 x 43.46 x 70.7 (cm)/1.69” x 17.11” x 27.83” (in) |
| Weight | Max 16.27 kg (35.86 lb) |
| Processor | Intel Xeon-Silver 4215 R 3.2 GHz, 11M cache, 8c/16T, 130 W |
| Chipset | Intel C621 |
| Memory | 32 GB = 2 x 16 GB 2666MT/s DDR4 ECC UDIMM |
| Storage | 6 x 1.2-TB SAS 12G Enterprise 10K SFF (2.5in) in Hot-plug Hard Drive - RAID 5 |
| Network controller | On-board: 2 x 1 Gb Broadcom BCM5720<br>On-board LOM: iDRAC Port Card 1 Gb Broadcom BCM5720<br><br>External: 1 x Intel Ethernet i350 QP 1 Gb Server Adapter, Low Profile |
| Management | HPE iLO Advanced |
| Device access | two rear USB 3.0<br>One front USB 2.0<br>One internal USB 3.0 |
| Power | 2 x HPE 500 W Flex Slot Platinum Hot Plug Low Halogen Power Supply Kit |
| Rack support | HPE 1U Gen10 SFF Easy Install Rail Kit |

### Appliance BOM

| PN | Description | Quantity |
|--|--|--|
| P19766-B21 | HPE DL360 Gen10 8SFF NC CTO Svr | 1 |
| P19766-B21 | Europe - Multilingual Localization | 1 |
| P24479-L21 | Intel Xeon-S 4215 R FIO Kit for DL360 G10 | 1 |
| P24479-B21 | Intel Xeon-S 4215 R Kit for DL360 Gen10 | 1 |
| P00922-B21 | HPE 16 GB 2Rx8 PC4-2933Y-R Smart Kit | 2 |
| 872479-B21 | HPE 1.2 TB SAS 10K SFF SC DS HDD | 6 |
| 811546-B21 | HPE 1 GbE 4-p BASE-T I350 Adptr | 1 |
| P02377-B21 | HPE Smart Hybrid Capacitor w\_ 145 mm Cbl | 1 |
| 804331-B21 | HPE Smart Array P408i-a SR Gen10 Ctrlr | 1 |
| 665240-B21 | HPE 1 GbE 4-p FLR-T I350 Adptr | 1 |
| 871244-B21 | HPE DL360 Gen10 High Perf Fan Kit | 1 |
| 865408-B21 | HPE 500 W FS Plat Ht Plg LH Power Supply Kit | 2 |
| 512485-B21 | HPE iLO Adv 1-svr Lic 1 yr Support | 1 |
| 874543-B21 | HPE 1U Gen10 SFF Easy Install Rail Kit | 1 |

## Enterprise deployment – HPE ProLiant DL20

| Component | Technical specifications |
|--|--|
| Chassis | 1U rack server |
| Dimensions (Height x Width x Depth) | 4.32 x 43.46 x 38.22 cm/1.70 x 17.11 x 15.05 inch |
| Weight | 7.9 kg/17.41 lb |
| Processor | Intel Xeon E-2234, 3.6 GHz, 4C/8T, 71 W |
| Chipset | Intel C242 |
| Memory | 2x16GB Dual Rank x8 DDR4-2666 |
| Storage | 3 x 1-TB SATA 6G Midline 7.2 K SFF (2.5in) – RAID 5 with Smart Array P408i-a SR Controller |
| Network controller | On-board: 2 x 1 Gb <br>On-board: iLO Port Card 1 Gb <br>External: 1 x HPE Ethernet 1-Gb 4-port 366FLR Adapter |
| Management | HPE iLO Advanced |
| Device access | Front: 1xUSB 3.0, 1xUSB iLO Service Port <br>Rear: 2xUSB 3.0 <br>Internal: 1x USB 3.0 |
| Power | Dual Hot Plug Power Supplies 500 W |
| Rack support | HPE 1U Short Friction Rail Kit |

### Appliance BOM

| PN | Description - high end | Quantity |
|--|--|--|
| P06963-B21 | HPE DL20 Gen10 4SFF CTO Svr | 1 |
| P06963-B21 | HPE DL20 Gen10 4SFF CTO Svr | 1 |
| P17104-L21 | HPE DL20 Gen10 E-2234 FIO Kit | 1 |
| 879507-B21 | HPE 16 GB 2Rx8 PC4-2666V-E STND Kit | 2 |
| 655710-B21 | HPE 1 TB SATA 7.2 K SFF SC DS HDD | 3 |
| P06667-B21 | HPE DL20 Gen10 x8x16 FLOM Riser Kit | 1 |
| 665240-B21 | HPE Ethernet 1 Gb 4-port 366FLR Adapter | 1 |
| 782961-B21 | HPE 12 W Smart Storage Battery | 1 |
| 869081-B21 | HPE Smart Array P408i-a SR G10 LH Ctrlr | 1 |
| 865408-B21 | HPE 500 W FS Plat Ht Plg LH Power Supply Kit | 2 |
| 512485-B21 | HPE iLO Adv 1-svr Lic 1 yr Support | 1 |
| P06722-B21 | HPE DL20 Gen10 RPS Enablement FIO Kit | 1 |
| 775612-B21 | HPE 1U Short Friction Rail Kit | 1 |

## SMB deployment – HPE ProLiant DL20

| Component | Technical specifications |
|--|--|
| Chassis | 1U rack server |
| Dimensions (Height x Width x Depth) | 4.32 x 43.46 x 38.22 cm/1.70 x 17.11 x 15.05 inch |
| Weight | 7.88 kg/17.37 lb |
| Processor | Intel Xeon E-2224, 3.4 GHz, 4C, 71 W |
| Chipset | Intel C242 |
| Memory | 1 x 8GB Dual Rank x8 DDR4-2666 |
| Storage | 2 x 1-TB SATA 6G Midline 7.2 K SFF (2.5in) – RAID 1 with Smart Array P208i-a |
| Network controller | On-board: 2 x 1 Gb <br>On-board: iLO Port Card 1 Gb <br>External: 1 x HPE Ethernet 1-Gb 4-port 366FLR Adapter |
| Management | HPE iLO Advanced |
| Device access | Front: 1xUSB 3.0, 1xUSB iLO Service Port <br>Rear: 2xUSB 3.0 <br>Internal: 1x USB 3.0 |
| Power | Hot Plug Power Supply 290 W |
| Rack support | HPE 1U Short Friction Rail Kit |

### Appliance BOM

| PN | Description | Quantity |
|--|--|--|
| P06961-B21 | HPE DL20 Gen10 NHP 2LFF CTO Svr | 1 |
| P06961-B21 | HPE DL20 Gen10 NHP 2LFF CTO Svr | 1 |
| P17102-L21 | HPE DL20 Gen10 E-2224 FIO Kit | 1 |
| 879505-B21 | HPE 8 GB 1Rx8 PC4-2666V-E STND Kit | 1 |
| 801882-B21 | HPE 1 TB SATA 7.2 K LFF RW HDD | 2 |
| P06667-B21 | HPE DL20 Gen10 x8x16 FLOM Riser Kit | 1 |
| 665240-B21 | HPE Ethernet 1-Gb 4-port 366FLR Adapter | 1 |
| 869079-B21 | HPE Smart Array E208i-a SR G10 LH Ctrlr | 1 |
| P21649-B21 | HPE DL20 Gen10 Plat 290 W FIO PSU Kit | 1 |
| P06683-B21 | HPE DL20 Gen10 M.2 SATA/LFF AROC Cbl Kit | 1 |
| 512485-B21 | HPE iLO Adv 1-svr Lic 1 yr Support | 1 |
| 775612-B21 | HPE 1U Short Friction Rail Kit | 1 |

## Virtual appliance specifications

### Sensors

| Type | Corporate | Enterprise | SMB |
|--|--|--|--|
| vCPU | 32 | 8 | 4 |
| Memory | 32 GB | 32 GB | 8 GB |
| Storage | 5.6 TB | 1.8 TB | 500 GB |

### On-premises management console appliance

| Type | Enterprise |
|--|--|
| Description | Virtual appliance for enterprise deployment types |
| vCPU | 8 |
| Memory | 32 GB |
| Storage | 1.8 TB |

Supported hypervisors: VMware ESXi version 5.0 and above, Hyper-V

## Additional certified appliances

This article details additional appliances that were certified by Microsoft but are not offered as preconfigured appliances.

| Deployment type | Enterprise |
|--|--|
| Image | :::image type="content" source="media/how-to-prepare-your-network/deployment-type-enterprise-for-azure-defender-for-iot.png" alt-text="Enterprise deployment type."::: |
| Model | Dell PowerEdge R340 XL |
| Monitoring ports | up to nine RJ45 or six OPT |
| Max Bandwidth [1](#anchortext2)| 1G Mb/Sec |
| Max Protected Devices | 10,000 |

<a id="anchortext2">One</a> Bandwidth capacity may vary depending on protocols distribution.

After purchasing the appliance, navigate to **Defender for IoT** > **Network Sensors ISO** > **Installation** to download the software.

:::image type="content" source="media/how-to-prepare-your-network/azure-defender-for-iot-sensor-download-software-screen.png" alt-text="Network sensors ISO":::

## Enterprise deployment - Dell PowerEdge R340 XL

| Component | Technical specifications |
|--|--|
| Chassis | 1U rack server |
| Dimensions | 42.8 x 434.0 x 596 (mm) /1.67” x 17.09” x 23.5” (in) |
| Weight | Max 29.98 lb/13.6 Kg |
| Processor | Intel Xeon E-2144G 3.6 GHz, 8M cache, 4C/8T, turbo (71 W) |
| Chipset | Intel C246 |
| Memory | 32 GB = 2 x 16 GB 2666MT/s DDR4 ECC UDIMM |
| Storage | 3 X 2 TB 7.2 K RPM SATA 6 Gbps 512n 3.5in Hot-plug Hard Drive - RAID 5 |
| Network controller | On-board: 2 x 1 Gb Broadcom BCM5720<br>On-board LOM: iDRAC Port Card 1 Gb Broadcom BCM5720 <br><br>External: 1 x Intel Ethernet i350 QP 1 Gb Server Adapter, Low Profile |
| Management | iDRAC nine Enterprise |
| Device access | two rear USB 3.0 <br> One front USB 3.0 |
| Power | Dual Hot Plug Power Supplies 350 W |
| Rack support | ReadyRails™ II sliding rails for tool-less mounting in 4-post racks with square or unthreaded round holes or tooled mounting in 4-post threaded hole racks, with support for optional tool-less cable management arm. |

## Dell R340 BOM

:::image type="content" source="media/how-to-prepare-your-network/enterprise-deployment-for-azure-defender-for-iot-dell-r340-bom.png" alt-text="Dell R340 BOM":::

## SMB deployment - Neousys Nuvo-5006LP

| Component | Technical specifications |
|--|--|
| Construction | Aluminum, Fanless & Dust-proof Design |
| Dimensions | 240 mm (W) x 225 mm (D) x 77 mm (H) |
| Weight | 3.1 kg (incl. CPU, memory, and HDD) |
| CPU | Intel Core i5-6500TE (6M Cache, up to 3.30 GHz) S1151 |
| Chipset | Intel® Q170 Platform Controller Hub |
| Memory | 8 GB DDR4 2133 MHz Wide Temperature SODIMM |
| Storage | 128 GB 3ME3 Wide Temperature mSATA SSD |
| Network controller | 6x Gigabit Ethernet ports by Intel® I219 |
| Device access | 4 USBs: Two fronts; two rears; 1 internal |
| Power Adapter | 120/240VAC-20VDC/6A |
| Mounting | Mounting kit, Din Rail |
| Operating Temperature | \-25°C ~ 70°C |
| Storage Temperature | \-40°C ~ 85°C |
| Humidity | 10%~90%, non-condensing |
| Vibration | Operating, 5 Grms, 5-500 Hz, 3 Axes <br>(w/ SSD, according to IEC60068-2-64) |
| Shock | Operating, 50 Grms, Half-sine 11 ms Duration (w/ SSD, according to IEC60068-2-27) |
| EMC | CE/FCC Class A, according to EN 55022, EN 55024 & EN 55032 |

## Next steps

[About the Defender for IoT Installation](how-to-install-software.md)

[About Azure Defender for IoT Network Setup](how-to-set-up-your-network.md)
