---
title: HPE ProLiant DL20 Gen 11 (4SFF) for OT monitoring in SMB/ E1800 deployments - Microsoft Defender for IoT 
description: Learn about the HPE ProLiant DL20 Gen 11 (4SFF) appliance when used for OT monitoring with Microsoft Defender for IoT in SMB deployments.
ms.date: 04/09/2024
ms.topic: reference
---

# HPE ProLiant DL20 Gen 11 (4SFF)

This article describes the **HPE ProLiant DL20 Gen 11** appliance for OT sensors monitoring production lines.

The HPE ProLiant DL20 Gen11 is also available for the on-premises management console.

| Appliance characteristic |Details |
|---------|---------|
|**Hardware profile** | E1800 |
|**Performance** | Max bandwidth: 1 Gbps <br>Max devices: 10,000 |
|**Physical specifications** | Mounting: 1U <br> Minimum dimensions (H x W x D) 1.70 x 17.11 x 15.05 in<br>Minimum dimensions (H x W x D) 4.32 x 43.46 x 38.22 cm|
|**Status** | Supported, available pre-configured |

## Specifications

|Component|Technical specifications|
|----|----|
|Chassis|1U rack server|
|Physical Characteristics  | HPE DL20 Gen11 4SFF Ht Plg CTO Server  |
|Processor| Intel Xeon E-2434 3.4-GHz 4-core 55 W FIO Processor for HPE |
|Chipset|Intel C262 |
|Memory|HPE 16 GB (1 x 16 GB) Single Rank x8 DDR5-4800 CAS-40-39-39 <br>Unbuffered Standard Memory|
|Storage|HPE 1.2 TB SAS 12 G Mission Critical 10 K SFF |
|Network controller|On-board: 2 x 1 Gb|
|External| 1 x HPE Ethernet 1-Gb 4-port 366FLR Adapter |
|On-board| On-board: 4x 1 Gb|
|Management|HPE iLO Advanced|
|Device access| Front: One USB 3.0 1 x USB iLO Service Port<br> Rear: Two USBs 3.0|
|External| 1 x Broadcom BCM5719 Ethernet 1 Gb 4-port BASE-T Adapter for HPE  |
|Internal| One USB 3.2|
|Power|HPE 1,000 W Flex Slot Titanium Hot Plug Power Supply Kit |
|Rack support|HPE 1U Short Friction Rail Kit |

## DL20 Gen11 (4SFF) - Bill of Materials

|Quantity|PN|Description|
|----|---|----|
|1|	P65392-B21 | HPE ProLiant DL20 Gen 11 4SFF Hot Plug Configure-to-order Server|
|1|	P65392-B21 B19 | HPE DL20 Gen11 4SFF Ht Plg CTO Server |
|1|	P65224-B21 | Intel Xcon E-2434 3.4-GHz 4-core 55 W FIO Processor for HPE|
|2|	P64336-B21 | HPE 16 GB (1 x 16 GB) Single Rank x8 DDR5-4800 CAS-40-39-39 Unbuffered Standard Memory Kit|
|4|	P28586-B21 | HPE 1.2 TB SAS 12 G Mission Critical 10K SFF BC 3-year Warranty Multi Vendor HDD |
|1|	P52753-B21 | HPE ProLiant DL320 Genll x 16 FHHL Riser Kit|
|1|	P51178-B21 | Broadcom BCM5719 Ethernet 1-Gb 4-port BASE-T Adapter for HPE |
|1|	P47789-B21 | HPE MRi-o Gen11 x 16 Lanes without Cache OCP SPDM Storage Controller |
|2|	P03178-B21 | HPE 1,000 W Flex Slot Titanium Hot Plug Power Supply Kit|
|1|	BD505A | HPE iLO Advanced 1-server License with 3 yr Support on iLO Licensed Features |
|1|	P65412-B21 | HPE ProLiant DL20 Gen11 2LFF/4SFF OCP Cable Kit |
|1|	P64576-B21 | HPE Easy Install Rail 12 Kit |
|1|	P65407-B21 | HPE ProLiant DL20 Gen 11 LP iLO/M.2 Enablement Kit |

### Install Defender for IoT software on the HPE ProLiant DL20 Gen 11 (4SFF)

This procedure describes how to install Defender for IoT software on the HPE ProLiant DL20 Gen 11 (4SFF).

The installation process takes about 20 minutes. After the installation, the system is restarted several times.

**To install Defender for IoT software**:

1. Connect the screen and keyboard to the appliance, and then connect to the CLI.

1. Connect an external CD or disk-on-key that contains the software you downloaded from the Azure portal.

1. Start the appliance.

1. Continue with the generic procedure for installing Defender for IoT software. For more information, see [Defender for IoT software installation](../how-to-install-software.md).

## Next steps

Continue learning about the system requirements for physical or virtual appliances. For more information, see [Which appliances do I need?](../ot-appliance-sizing.md).

Then, use any of the following procedures to continue:

- [Download software for an OT sensor](../ot-deploy/install-software-ot-sensor.md#download-software-files-from-the-azure-portal)
- [Download software files for an on-premises management console](../legacy-central-management/install-software-on-premises-management-console.md#download-software-files-from-the-azure-portal)
