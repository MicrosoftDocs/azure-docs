---
title: Microsoft Azure Stack Edge Mini R technical specifications and compliance| Microsoft Docs
description: Learn about the technical specifications and compliance for your Azure Stack Edge Mini R device
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 03/16/2021
ms.author: alkohli
---
# Azure Stack Edge Mini R technical specifications

The hardware components of your Microsoft Azure Stack Edge Mini R device adhere to the technical specifications and regulatory standards outlined in this article. The technical specifications describe the CPU, memory, power supply units (PSUs), storage capacity, enclosure dimensions, and weight.


## Compute, memory specifications

The Azure Stack Edge Mini R device has the following specifications for compute and memory:

| Specification           | Value                  |
|-------------------------|------------------------|
| CPU    | 16-core CPU, Intel Xeon-D 1577 |
| Memory              | 48 GB RAM (2400 MT/s)                  |


## Compute acceleration specifications

A Vision Processing Unit (VPU) is included on every Azure Stack Edge Mini R device that enables Kubernetes, deep neural network and computer vision based applications.

| Specification           | Value                  |
|-------------------------|------------------------|
| Compute Acceleration card         | Intel Movidius Myriad X VPU <br> For more information, see [Intel Movidius Myriad X VPU](https://www.movidius.com/MyriadX) |


## Storage specifications

The Azure Stack Edge Mini R device has 1 data disk and 1 boot disk (that serves as operating system storage). The following table shows the details for the storage capacity of the device.

|     Specification                          |     Value             |
|--------------------------------------------|-----------------------|
|    Number of solid-state drives (SSDs)     |    2 X 1 TB disks <br> One data disk and one boot disk                  |
|    Single SSD capacity                     |    1 TB               |
|    Total capacity (data only)              |    1 TB              |
|    Total usable capacity*                  |    ~ 750 GB        |

**Some space is reserved for internal use.*

## Network specifications

The Azure Stack Edge Mini R device has the following specifications for the network:

|Specification  |Value  |
|---------|---------|
|Network interfaces    |2 x 10 Gbe SFP+ <br> Shown as PORT 3 and PORT 4 in the local UI           |
|Network interfaces    |2 x 1 Gbe RJ45 <br> Shown as PORT 1 and PORT 2 in the local UI          |
|Wi-Fi   |802.11ac         |

## Transceiver specifications

The Azure Stack Edge Mini R device includes a Xeon D 1500 series SoC (System on Chip) from Klas. The Xeon D 1500 SoC does not have the usual Peripheral Interface Card (PCI) NIC, but rather a NIC in which layer 1 and layer 2 are separate. Layer 2 (MAC) is part of the Xeon D SoC. However, Layer 1 (PHY) is provided by a physical device outside the SoC.<!--If this much of the info stays, a separate article might work.-->

The Azure Stack Edge Mini R device supports SFP+ transceivers from Klas. The small form-factor pluggable (SFP) is a compact, hot-pluggable module transceiver used for both telecommunication and data communications applications. The form factor has been around for a number of years and has a few evolutions including SFP, SFP+ and QSFP+.<!--Note to me: Transition, organization need work.--> 

#### Supported SFP+ form factors

The following form factors are supported for SFP+ products from Klas:

|Product | Notes|
|--------|-------|
|VoyagerESR 2.0 (Cisco ESS3300 Switch component) |                           |
|VoyagerSW26G                                    |                           |
|VoyagerVM 3.0                                   |                           |
|TDC Switch                                      |                           |
|TRX R2 (8-Core)                                 |                           |
|SW12GG                                          |QSFP+ to 4x SFP+ cable only|

#### Supported transceivers for Klas products

The following SFP+ (10Gbps) transceivers are supported on all Klas products with SFP+ ports (see table above). No configuration is required. Just insert the SFP or SFP+ transceiver into the module port, and the operating system will automatically detect the transceiver. When connecting two devices with SFP+ ports together, Klas strongly recommends SFP+ Direct-Attach Copper (DAC) cables.

|SFP+ transceiver type | Supported products | Notes |
|---------------------|--------------------|-------|
|SFP+ Direct-Attach Copper (10GSFP+Cu)|* FS SFP-10G-DAC (Available in industrial temperature -40ºC to +85ºC as custom order)<br>* 10Gtek CAB-10GSFP-P0.5M<br>* Cisco SFP-H10GB-CU1M |* Also known as SFP+ Twinax DAC cables<br>* This is the recommended option, as it is lowest-power and simplest.<br>* Not supported: autonegotiation, connecting an SFP device to an SFP+ device|
|Multi-mode SFP+ optical transceiver|* 10Gtek AXS85-192-M3 MMF, 850nm 300M<br>* ZyXEL SFP10G-SR MMF, 850nm 300M|* Optical fiber cables that were used for testing: MM, OM3, of 3m, 12m, and 100m<br>* Not supported: autonegotiation, connecting an SFP device to an SFP+ device|
|Single-mode SFP+ optical transceiver|* 10Gtek AXS13-192-10 SM, 1310nm 10Km<br>* H!Fiber AXS13-192-10 SM, 1310nm 10Km|* 50m Single Mode Optical fiber cable was used for testing (insertion loss <= 0.3dB, return loss >= 50 dB)<br>* Not supported: autonegotiation, connecting an SFP device to an SFP+ device|
|RJ45 copper transceiver (10GBase-T/10Gbps)|* 10Gtek ASF-10G-T|* Requires Cat6A Ethernet cable at a minimum.<br>* When inserted in TenGigabit ports of ESR2.0 and SW16G, this transceiver will support 1Gbps/10Gbps auto-negotiation.<brt>* Consumes more power than DAC cables because of media conversion.|

## Power supply unit specifications

The Azure Stack Edge Mini R device includes an external 85 W AC adapter to supply power and charge the onboard battery.

The following table shows the power supply unit specifications:

| Specification           | Value                      |
|-------------------------|----------------------------|
| Maximum output power    | 85 W                       |
| Frequency               | 50/60 Hz                   |
| Voltage range selection | Auto ranging: 100-240 V AC |

## Included battery

The Azure Stack Edge Mini R device also includes an onboard battery that is charged by the power supply.

An additional [Type 2590 battery](https://www.bren-tronics.com/bt-70791ck.html) can be used in conjunction with the onboard battery to extend the use of the device between the charges. This battery should be compliant with all the safety, transportation, and environmental regulations applicable in the country of use.


| Specification           | Value                      |
|-------------------------|----------------------------|
| Onboard battery capacity | 73 WHr                    |

## Enclosure dimensions and weight specifications

The following tables list the various enclosure specifications for dimensions and weight.

### Enclosure dimensions

The following table lists the dimensions of the device and the USP with the rugged case in millimeters and inches.

|     Enclosure     |     Millimeters     |     Inches     |
|-------------------|---------------------|----------------|
|    Height         |    68            |    2.68          |
|    Width          |    208          |      8.19          |
|    Length          |   259           |    10.20          |


### Enclosure weight

The following table lists the weight of the device including the battery.

|     Enclosure                                 |     Weight          |
|-----------------------------------------------|---------------------|
|    Total weight of the device     |    7 lbs.          |

## Enclosure environment specifications


This section lists the specifications related to the enclosure environment such as temperature, humidity, and altitude.


|     Specifications             |     Description                                                          |
|--------------------------------|--------------------------------------------------------------------------|
|     Temperature range          |     0 – 43° C (operational)                                              |
|     Vibration                  |     MIL-STD-810 Method 514.7*<br> Procedure I CAT 4, 20                  |
|     Shock                      |     MIL-STD-810 Method 516.7*<br> Procedure IV, Logistic                 |
|     Altitude                   |     Operational:   10,000 feet<br> Non-operational: 40,000 feet          |

**All references are to MIL-STD-810G Change 1 (2014)*


## Next steps

- [Deploy your Azure Stack Edge Mini R](azure-stack-edge-placeholder.md)
