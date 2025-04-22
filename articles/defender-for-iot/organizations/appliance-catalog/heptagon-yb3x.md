---
title: Heptagon YB3x for OT monitoring in L100 deployments - Microsoft Defender for IoT
description: Learn about the YB3x appliance when used for OT monitoring with Microsoft Defender for IoT in L100 deployments.
ms.date: 04/01/2024
ms.topic: reference
---

# Heptagon YB3x

This article describes the **Heptagon YB3x** appliance deployment and installation for OT sensors.

| Appliance characteristic |Details |
|---------|---------|
|**Hardware profile** | L100 |
|**Performance** | Max bandwidth: 20-25 Mbps <br> Max devices: 200 |
|**Physical specifications** | Ports: 6 x 1-GbE ports|
|**Status** | Supported, available as preconfigured |

The following image shows a view of the Heptagon YB3x front panel:

:::image type="content" source="media/yb3x.png" alt-text="Picture of the front view of the Heptagon YB3x." border="false":::

## Specifications

|Component|Technical specifications|
|----|----|
|Construction |Fanless cooling  |
|Dimensions |1U, 209x187x37.5mm  |
|Weight | 1.1 kg |
|CPU |Intel C3708 – 8 cores  |
|Memory |16 GB |
|Storage |500 GB |
|Network controller |Intel I210, Intel x553  |
|Device access | 4x USB 3.0, TPM 2.0, 2x Serial ports |
|Power Adapter |12 VDC or optional 9-28 VDC with reverse polarity, <br>Over/under voltage protection  |
|BMC |BMC AST2600, OpenBMC, IPMI 2.0, iKVM, Virtual Media  |
|Temperature |-40 °C to +75 °C |
|Humidity |95% @ 40°C (noncondensing)  |
|Shock & Vibration  | ETSI standard ETS 300 019-1-5, 5M2 |
|Safety |IEC 60950-1, AS/NZS  |
|EMC |CE, FCC, AS/NZS |

## Heptagon YB3x - Bill of Materials

|Description| PN|Quantity|
|--------------|--------------|---------|
|CPU: Atom-C3708, 8C, 16 MB Cache, 1.7Ghz, 17 W, Embedded/Ind. Temp <br> DRAM - Not installed <br> COMM1: COM-4X1: Quad 1G Base-T <br> COMM2: No Comm Module <br> BMC: BMC, based on Aspeed AST2600, with Display port video  |YB3708-0-4T0B |1|
|500G NV2 M.2 2280 PCIe 4.0 NVMe SSD  |SNV2S/500G |1 |
|Intel X710 Dual Port 10 GbE SFP+ Adapter | 540-BDQZ |1|
|8 GB 2,666 MT/s DDR4 ECC Reg CL19 DIMM 1Rx8 Hynix D IDT  | KSM26RS8/8HDI  | 2|
|Power supply, 110-220 VAC to 12 VDC, 100 W, IP 67, Industrial temp   | PS100-12-IP67  | 1 |

## Heptagon YB3x software setup

This procedure describes how to install Defender for IoT software on the Heptagon YB3x. The installation process takes about 20 minutes. After the installation, the system restarts several times.

To install Defender for IoT software:

1. Connect the screen and keyboard to the appliance, and then connect to the CLI.

1. Connect an external CD or disk-on-key that contains the software you downloaded from the Azure portal.

1. Start the appliance.

1. Continue by installing your Defender for IoT software. For more information, see [Defender for IoT software installation](../ot-deploy/install-software-ot-sensor.md#install-defender-or-iot-software-on-ot-sensors).

## Next steps

Continue understanding system requirements for physical or virtual appliances. For more information, see [Which appliances do I need?](../ot-appliance-sizing.md)

Then, use any of the following procedures to continue:

- [Download software for an OT sensor](../ot-deploy/install-software-ot-sensor.md#download-software-files-from-the-azure-portal)
