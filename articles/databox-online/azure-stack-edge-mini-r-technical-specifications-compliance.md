---
title: Microsoft Azure Stack Edge Mini R technical specifications and compliance| Microsoft Docs
description: Learn about the technical specifications and compliance for your Azure Stack Edge Mini R device
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 11/10/2023
ms.author: alkohli
---
# Azure Stack Edge Mini R technical specifications

The hardware components of your Microsoft Azure Stack Edge Mini R device adhere to the technical specifications and regulatory standards outlined in this article. The technical specifications describe the CPU, memory, power supply units (PSUs), storage capacity, enclosure dimensions, and weight.


## Compute, memory

The Azure Stack Edge Mini R device has the following specifications for compute and memory:

| Specification           | Value                           |
|-------------------------|---------------------------------|
| CPU type                | Intel Xeon-D 1577               |
| CPU: raw                | 16 total cores, 32 total vCPUs  |
| CPU: usable             | 24 vCPUs                        |
| Memory type             | 16 GiB 2400 MT/s SODIMM          |
| Memory: raw             | 48 GiB RAM (3 x 16 GiB)           |
| Memory: usable          | 32 GiB RAM                       |


## Compute acceleration

A Vision Processing Unit (VPU) is included on every Azure Stack Edge Mini R device that enables Kubernetes, deep neural network and computer vision based applications.

| Specification             | Value                  |
|---------------------------|------------------------|
| Compute Acceleration card | Intel Movidius Myriad X VPU <br> For more information, see [Intel Movidius Myriad X VPU](https://www.movidius.com/MyriadX) |


## Storage

The Azure Stack Edge Mini R device has one data disk and one boot disk (that serves as operating system storage). The following table shows the details for the storage capacity of the device.

|     Specification                          |     Value                                              |
|--------------------------------------------|--------------------------------------------------------|
|    Number of solid-state drives (SSDs)     |    2 X 1 TB disks <br> One data disk and one boot disk |
|    Single SSD capacity                     |    1 TB                                                |
|    Total capacity (data only)              |    1 TB                                                |
|    Total usable capacity*                  |    ~ 750 GB                                            |

*Some space is reserved for internal use.*

## Network

The Azure Stack Edge Mini R device has the following specifications for the network:

|Specification         |Value                                                               |
|----------------------|--------------------------------------------------------------------|
|Network interfaces    |2 x 10 Gbps SFP+ <br> Shown as PORT 3 and PORT 4 in the local UI    |
|Network interfaces    |2 x 1 Gbps RJ45 <br> Shown as PORT 1 and PORT 2 in the local UI     |
|Wi-Fi <br> **Note:** On Azure Stack Edge 2309 and later, Wi-Fi functionality for Azure Stack Edge Mini R has been deprecated. Wi-Fi is no longer supported on the Azure Stack Edge Mini R device.             |802.11ac                                                            |

## Routers and switches

The following routers and switches are compatible with the 10 Gbps SPF+ network interfaces (Port 3 and Port 4) on your Azure Stack Edge Mini R devices:

|Router/Switch     |Notes                         |
|------------------|------------------------------|
|[VoyagerESR 2.0](https://www.klasgroup.com/products-gov/voyager-tdc/)    |Cisco ESS3300 Switch component   |
|[VoyagerSW26G](https://klastelecom.com/products/voyagersw26g/)       |                                 |
|[VoyagerVM 3.0](https://klastelecom.com/products/voyager-vm-3-0/)    |                                 |
|[TDC Switch](https://www.klasgroup.com/products-gov/voyager-tdc/)                   |                                 |
|[TRX R2](https://klastelecom.com/products/trx-r2/) (8-Core)  <!--Better link: https://www.klasgroup.com/products/voyagersw12gg/? On current link target, an "R6" link opens this page.-->        |                              |
|[SW12GG](https://www.klasgroup.com/products/voyagersw12gg/)          |                                 |

## Transceivers, cables

The following copper SFP+ (10 Gbps) transceivers and cables are recommended for use with Azure Stack Edge Mini R devices. Compatible fiber-optic cables can be used with SFP+ network interfaces (Port 3 and Port 4) but haven't been tested.

|SFP+ transceiver type |Supported cables    | Notes |
|----------------------|--------------------|-------|
|SFP+ Direct-Attach Copper (10GSFP+Cu)| <ul><li>[FS SFP-10G-DAC](https://www.fs.com/c/fs-10g-sfp-dac-1115) (Available in industrial temperature -40ºC to +85ºC as custom order)</li><br><li>[10Gtek CAB-10GSFP-P0.5M](http://www.10gtek.com/10G-SFP+-182)</li><br><li>[Cisco SFP-H10GB-CU1M](https://www.cisco.com/c/en/us/products/collateral/interfaces-modules/transceiver-modules/data_sheet_c78-455693.html)</li></ul> |<ul><li>Also known as SFP+ Twinax DAC cables.</li><br><li>Recommended option because it has lowest power usage and is simplest.</li><br><li>Autonegotiation isn't supported.</li><br><li>Connecting an SFP device to an SFP+ device isn't supported.</li></ul>|

## Power supply unit

The Azure Stack Edge Mini R device includes an external 85 W AC adapter to supply power and charge the onboard battery.

The following table shows the power supply unit specifications:

| Specification           | Value                      |
|-------------------------|----------------------------|
| Maximum output power    | 85 W                       |
| Frequency               | 50/60 Hz                   |
| Voltage range selection | Auto ranging: 100-240 V AC |

## Included battery

The Azure Stack Edge Mini R device also includes an onboard battery that is charged by the power supply.

An additional [Type 2590 battery](https://www.bren-tronics.com/bt-70791ck.html) can be used along with the onboard battery to extend the use of the device between the charges. This battery should be compliant with all the safety, transportation, and environmental regulations applicable in the country/region of use.

| Specification            | Value      |
|--------------------------|------------|
| Onboard battery capacity | 73 Wh      |

## Enclosure dimensions and weight

The following tables list the various enclosure specifications for dimensions and weight.

### Enclosure dimensions

The following table lists the dimensions of the device and the USP with the rugged case in millimeters and inches.

|     Enclosure     |     Millimeters     |     Inches     |
|-------------------|---------------------|----------------|
|    Height         |    68               |    2.68        |
|    Width          |    208              |    8.19        |
|    Length         |    259              |    10.20       |


### Enclosure weight

The following table lists the weight of the device including the battery.

|     Enclosure                     |     Weight          |
|-----------------------------------|---------------------|
|    Total weight of the device     |     7 lbs           |

## Enclosure environment

This section lists the specifications related to the enclosure environment, such as temperature, humidity, and altitude.

|     Specifications             |     Description                                                          |
|--------------------------------|--------------------------------------------------------------------------|
|     Temperature range          |     0 – 40° C (operational)                                              |
|     Vibration                  |     MIL-STD-810 Method 514.7*<br> Procedure I CAT 4, 20                  |
|     Shock                      |     MIL-STD-810 Method 516.7*<br> Procedure IV, Logistic                 |
|     Altitude                   |     Operational:   15,000 feet<br> Nonoperational: 40,000 feet          |

**All references are to MIL-STD-810G Change 1 (2014)*

## Next steps

- [Deploy your Azure Stack Edge Mini R](azure-stack-edge-placeholder.md)
