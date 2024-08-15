---
title: Dell PowerEdge R660 for operational technology (OT) monitoring - Microsoft Defender for IoT
description: Learn about the Dell PowerEdge R660 appliance's configuration when used for OT monitoring with Microsoft Defender for IoT in enterprise deployments.
ms.date: 07/29/2024
ms.topic: reference
---

# Dell PowerEdge R660

This article describes the Dell PowerEdge R660 appliance, supported for operational technology (OT) sensors in an enterprise deployment.
The Dell PowerEdge R660 is also available for the on-premises management console.

|Appliance characteristic  | Description|
|---------|---------|
|**Hardware profile** | C5600 |
|**Performance** | Max bandwidth: 3 Gbps<br>Max devices: 12,000 |
|**Physical Specifications** | Mounting: 1U with rail kit<br>Ports: 6x RJ45 1 GbE |
|**Status** | Supported, available as a preconfigured appliance|

The following image shows a view of the Dell PowerEdge R660 front panel:

:::image type="content" source="media/dell-poweredge-r660/dell-r660-front.png" alt-text="Photograph of the Dell PowerEdge R660 front panel." border="false":::

The following image shows a view of the Dell PowerEdge R660 back panel:

:::image type="content" source="media/dell-poweredge-r660/dell-r660-back.png" alt-text="Photograph of the Dell PowerEdge R660 back panel." border="false":::

## Specifications

|Component| Technical specifications|
|:----|:----|
|Chassis| 1U rack server|
|Dimensions| Height: 1.68 in / 42.8 mm <br>Width: 18.97 in / 482.0 cm<br>Depth: 23.04 in / 585.3 mm (without bezel) 23.57 in / 598.9 mm (with bezel)|
|Processor| Intel Xeon E-2434 3.4 GHz <br>8M Cache<br> 4C/8T, Turbo, HT (55 W) DDR5-4800|
|Memory| 128 GB |
|Storage| 7.2 TB Hard Drive |
|Network controller| - PowerEdge R660 Motherboard with Broadcom 5720 Dual Port 1 Gb On-Board LOM, <br>- PCIe Blank Filler, Low Profile. <br>- Intel Ethernet i350 Quad Port 1 GbE BASE-T Adapter, PCIe Low Profile, V2|
|Management|iDRAC Group Manager, Disabled|
|Rack support| ReadyRails Sliding Rails With Cable Management Arm|

## Dell PowerEdge R660 - Bill of Materials

### Components

|Quantity|PN| Module| Description|
|----|---|----|---|
|1| 210-BFUZ | Base | PowerEdge R660xs |
|1| 461-AAIG | Trusted platform module | Trusted platform module 2.0 V3 |
|1| 470-AFQI | Chassis configuration | 2.5" Chassis with up to 8 Hard Drives (SAS/SATA), 2 CPU |
|1| 338-CKVW | Processor | Intel Xeon Silver 4410T 2.7 G 10C/20T, 16 GT/s, 27 M caches, Turbo, HT (150 W) DDR5-4000 |
|1| 338-CKVW | Additional processor | Intel Xeon Silver 4410T 2.7 G 10C/20T, 16 GT/s, 27 M caches, Turbo, HT (150 W) DDR5-4000 |
|1| 379-BDCO | Additional processor | Additional processor selected |
|1| 338-CHQT | Processor thermal configuration | Heatsink for 2 CPU configuration (CPU less than or equal to 150 W)|
|1| 370-AAIP | Memory configuration type | Performance Optimized |
|1| 370-AHCL | Memory DIMM type and speed | 4800-MT/s RDIMMs |
|4| 370-AGZP | Memory capacity | 32 GB RDIMM, 4,800 MT/s dual rank |
|1| 780-BCDS | RAID configuration | unconfigured RAID |
|1| 405-AAZB | RAID controller | PERC H755 SAS Front |
|1| 750-ACFR | RAID controller | Front PERC Mechanical Parts, front load |
|6| 161-BCBX | Hard drives | 2.4 TB Hard Drive SAS ISE 12 Gbps 10k 512e 2.5in Hot Plug |
|1| 384-BBBH | BIOS and Advanced System Configuration Settings | Power Saving BIOS Settings |
|1| 387-BBEY | Advanced System Configurations | No Energy Star |
|1| 384-BDJC | Fans | Standard Fan X7 |
|1| 528-CTIC | Embedded Systems Management | iDRAC9, Enterprise 16G |
|1| 450-AKLF | Power supply | Dual, Redundant(1+1), Hot-Plug Power Supply, 1100 W MM(100-240Vac) Titanium |
|2| 450-AADY | Power cords | C13 to C14, PDU Style, 10 AMP, 6.5 Feet (2 m), Power Cord |
|1| 330-BCCE | PCIe Riser | Riser Config 6, Low profile, 1x 16 LP slots (Gen 5) + 1x8 LP Slot (Gen 5), 2 CPU |
|1| 384-BDKV | Motherboard | PowerEdge R660xs  Motherboard with Broadcom 5720 Dual Port 1 Gb On-Board LOM |
|1| 540-BCOB | Network daughter card | Broadcom 5720 Quad Port 1 GbE BASE-T Adapter, OCP NIC 3.0  |
|1| 350-BCEL | Quick sync | Quick Sync 2 (At-the-box mgmt) |
|1| 379-BCSF | Password | iDRAC, Factory Generated Password |
|1| 379-BCQX | IDRAC service module | iDRAC Service Module (ISM), NOT Installed |
|1| 379-BCQV | Group manager | iDRAC group manager, Enabled |
|1| 325-BEVH | Bezel | PowerEdge 1U Standard Bezel |
|1| 350-BEUF | Bezel | Dell Luggage Tag, 0/6/8/10 |
|1| 770-BCJI | Rack rails | A11 drop-in/stab-in Combo Rails Without Cable Management Arm |
|1| 340-DLRR | Shipping | PowerEdge R660XS Shipping EMEA1 (English/French/German/Spanish/Russian/Hebrew) |
|1| 340-DFKP | Shipping material | PowerEdge R660xs, 8x2.5, Short Drive Shipping Material  |
|1| 389-FBMD | Regulatory |PowerEdge R660xs HS5610 Label, CE and CCC Marking, for below 1,300 W PSU |
|1| 683-11870 | Dell Services: Deployment Services  | No Installation Service Selected (Contact Sales Rep for more details) |

### Software

|Quantity|PN| Module| Description|
|----|---|----|---|
|1| 800-BBDM | Advanced system configuration | UEFI BIOS Boot Mode with GPT Partition  |
|1| 528-COYT | Embedded Systems Management | Secured Component Verification |
|1| 611-BBBF | Operating system | No operating system |
|1| 605-BBFN | OS media kits | No media required |
|1| 631-AACK | System documentation | No Systems Documentation, No OpenManage DVD Kit |

### Service

|Quantity|PN| Module| Description|
|----|---|----|---|
|1| 293-10049 | Shipping Box Labels - Standard | Order Configuration Shipbox Label (Ship Date, Model, Processor Speed, HDD Size, RAM) |
|1| 865-BBLL | Dell Services: Extended Service | ProSupport and Next Business Day Onsite Service Extension, 24 Months |
|1| 865-BBLM | Dell Services: Extended Service | ProSupport and Next Business Day Onsite Service Initial, 12 Months |
|1| 709-BBIX | Dell Services: Hardware Support | Parts Only Warranty 12 Months |

## Install Defender for IoT software on the DELL R660

This procedure describes how to install Defender for IoT software on the Dell R660.

The installation process takes about 20 minutes. During the installation, the system restarts several times.

To install Defender for IoT software:

1. Connect the screen and keyboard to the appliance, and then connect to the CLI.

1. Connect an external CD or disk-on-key that contains the software you downloaded from the Azure portal.

1. Start the appliance.

1. Continue with the generic procedure for installing Defender for IoT software. For more information, see [Defender for IoT software installation](../how-to-install-software.md).

## Next steps

Continue learning about the system requirements for physical or virtual appliances. For more information, see [Which appliances do I need?](../ot-appliance-sizing.md).

Then, use any of the following procedures to continue:

- [Download software for an OT sensor](../ot-deploy/install-software-ot-sensor.md#download-software-files-from-the-azure-portal)
- [Download software files for an on-premises management console](../legacy-central-management/install-software-on-premises-management-console.md#download-software-files-from-the-azure-portal)
