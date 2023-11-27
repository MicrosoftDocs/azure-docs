---
title: Microsoft Azure Stack Edge Pro with GPU technical specifications and compliance| Microsoft Docs
description: Learn about the technical specifications and compliance for your Azure Stack Edge Pro device with GPU
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 04/12/2023
ms.author: alkohli
---

# Technical specifications and compliance for Azure Stack Edge Pro with GPU 

The hardware components of your Azure Stack Edge Pro with an onboard Graphics Processing Unit (GPU) adhere to the technical specifications and regulatory standards outlined in this article. The technical specifications describe hardware, power supply units (PSUs), storage capacity, enclosures, and environmental standards.

## Compute and memory specifications

The Azure Stack Edge Pro device has the following specifications for compute and memory:

| Specification  | Value                                                                       |
|----------------|-----------------------------------------------------------------------------|
| CPU type       | Dual Intel Xeon Silver 4214 (Cascade Lake) CPU                              |
| CPU: raw       | 24 total cores, 48 total vCPUs                                              |
| CPU: usable    | 40 vCPUs                                                                    |
| Memory type    | Dell Compatible 16 GiB PC4-23400 DDR4-2933Mhz 2Rx8 1.2v ECC Registered RDIMM |
| Memory: raw    | 128 GiB RAM (8 x 16 GiB)                                                      |
| Memory: usable | 96 GiB RAM                                                                  |


## Compute acceleration specifications

A Graphics Processing Unit (GPU) is included on every Azure Stack Edge Pro device that enables Kubernetes, deep learning, and machine learning scenarios.

| Specification           | Value                  |
|-------------------------|----------------------------|
| GPU   | One or two nVidia T4 GPUs <br> For more information, see [NVIDIA T4](https://www.nvidia.com/en-us/data-center/tesla-t4/).|


## Power supply unit specifications

The Azure Stack Edge Pro device has two 100-240 V power supply units (PSUs) with high-performance fans. The two PSUs provide a redundant power configuration. If a PSU fails, the device continues to operate normally on the other PSU until the failed module is replaced. The following table lists the technical specifications of the PSUs.

| Specification           | 750 W PSU                  |
|-------------------------|----------------------------|
| Maximum output power    | 750 W                      |
| Frequency               | 50/60 Hz                   |
| Voltage range selection | Auto ranging: 100-240 V AC |
| Hot pluggable           | Yes                        |


## Network interface specifications

Your Azure Stack Edge Pro device has six network interfaces, PORT1- PORT6.

| Specification           | Description                 |
|-------------------------|----------------------------|
|  Network interfaces    | **2 X 1 GbE interfaces** – 1 management interface Port 1 is used for initial setup and is static by default. After the initial setup is complete, you can use the interface for data with any IP address. However, on reset, the interface reverts back to static IP. <br>The other interface Port 2 is user configurable, can be used for data transfer, and is DHCP by default. <br>**4 X 25-GbE interfaces** – These data interfaces, Port 3 through Port 6, can be configured by user as DHCP (default) or static. They can also operate as 10-GbE interfaces.  | 

Your Azure Stack Edge Pro device has the following network hardware:

* **Custom Microsoft `Qlogic` Cavium 25G NDC adapter** - Port 1 through port 4.
* **Mellanox dual port 25G ConnectX-4 channel network adapter** - Port 5 and port 6.

Here are the details for the Mellanox card:

| Parameter           | Description                 |
|-------------------------|----------------------------|
| Model    | ConnectX®-4 Lx EN network interface card                      |
| Model Description               | 25 GbE dual-port SFP28; PCIe3.0 x8; ROHS R6                    |
| Device Part Number (R640) | MCX4121A-ACAT  |
| PSID (R640)           | MT_2420110034                         |

For a full list of supported cables, switches, and transceivers for these network cards, go to:

- [`Qlogic` Cavium 25G NDC adapter interoperability matrix](https://www.marvell.com/documents/xalflardzafh32cfvi0z/).

## Storage specifications

The Azure Stack Edge Pro devices have five 2.5" NVMe DC P4610 SSDs, each with a capacity of 1.6 TB. The boot drive is a 240 GB SATA SSD. The total usable capacity for the device is roughly 4.19 TB. The following table lists the storage capacity of the device.

|     Specification                          |     Value             |
|--------------------------------------------|-----------------------|
|    Number of NVMe SSDs                     |    5                  |
|    Single NVMe SSD capacity                |    1.6 TB             |
|    Boot SATA solid-state drives (SSD)      |    1                  |
|    Boot SSD capacity                       |    240 GB             |
|    Total capacity                          |    8.0 TB             |
|    Total usable capacity                   |    ~ 4.19 TB          |
|    RAID configuration                      |    Storage Spaces Direct with a combination of mirroring and parity  |
|    SAS controller                          |    HBA330 12 Gbps     |

<!--Remove based on feedback from Ravi
## Other hardware specifications

Your Azure Stack Edge Pro device also contains the following hardware:

* iDRAC baseboard management
* Performance fans
* Custom ID module-->

## Enclosure dimensions and weight specifications

The following tables list the various enclosure specifications for dimensions and weight.

### Enclosure dimensions

The following table lists the dimensions of the 1U device enclosure in millimeters and inches.

|     Enclosure     |     Millimeters     |     Inches     |
|-------------------|---------------------|----------------|
|    Height         |    44.45            |    1.75"       |
|    Width          |    434.1            |    17.09"      |
|    Length         |    740.4            |    29.15"      |

The following table lists the dimensions of the shipping package in millimeters and inches.

|     Package     |     Millimeters     |     Inches     |
|-------------------|---------------------|----------------|
|    Height         |    311.2            |    12.25"          |
|    Width          |    642.8            |    25.31"          |
|    Length         |    1,051.1          |    41.38"          |

### Enclosure weight

The device package weighs 66 lbs. and requires two persons to handle it. The weight of the device depends on the configuration of the enclosure.

|     Enclosure                                 |     Weight          |
|-----------------------------------------------|---------------------|
|    Total weight including the packaging       |    61 lbs.          |
|    Weight of the device                       |    35 lbs.          |

## Enclosure environment specifications

This section lists the specifications related to the enclosure environment such as temperature, humidity, and altitude.

### Temperature and humidity

|     Enclosure         |     Ambient    temperature range     |     Ambient relative    humidity     |     Maximum dew point     |
|-----------------------|--------------------------------------|--------------------------------------|---------------------------|
|    Operational        |    10°C - 35°C (50°F - 86°F)         |    10% - 80% non-condensing.         |    29°C (84°F)            |
|    Non-operational    |    -40°C to 65°C (-40°F - 149°F)     |    5% - 95% non-condensing.          |    33°C (91°F)            |

### Airflow, altitude, shock, vibration, orientation, safety, and EMC

|     Enclosure                           |     Operational specifications                                                                                                                                                                                         |
|-----------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|    Airflow                              |    System airflow is front to rear. System must be operated with a low-pressure, rear-exhaust installation. <!--Back pressure created by rack doors and obstacles should not exceed 5 pascals (0.5 mm water gauge).-->    |
| Ingress protection (IP)                 |    This type of rack-mounted equipment for indoor use typically isn't tested for ingress protection (protection against solids and liquids for an electrical enclosure). Manufacturer's safety assessment shows IPXO (no ingress protection).  |
|    Maximum altitude, operational        |    3048 meters (10,000 feet) with maximum operating temperature de-rated determined by [Operating temperature de-rating specifications](#operating-temperature-de-rating-specifications).                                                                                |
|    Maximum altitude, non-operational    |    12,000 meters (39,370 feet)                                                                                                                                                                                         |
|    Shock, operational                   |    6 G for 11 milliseconds in 6   orientations                                                                                                                                                                         |
|    Shock, non-operational               |    71 G for 2 milliseconds in 6 orientations                                                                                                                                                                           |
|    Vibration, operational               |    0.26 G<sub>RMS</sub> 5 Hz to 350 Hz random                                                                                                                                                                                     |
|    Vibration, non-operational           |    1.88 G<sub>RMS</sub> 10 Hz to 500 Hz for 15   minutes (all six sides tested.)                                                                                                                                                  |
|    Orientation and mounting             |    Standard 19" rack mount (1U)                                                                                                                                                                                       |
|    Safety and approvals                 |    EN 60950-1:2006 +A1:2010 +A2:2013 +A11:2009 +A12:2011/IEC 60950-1:2005 ed2 +A1:2009 +A2:2013 EN 62311:2008                                                                                                                                                                       |
|    EMC                                  |    FCC A, ICES-003 <br>EN 55032:2012/CISPR 32:2012  <br>EN 55032:2015/CISPR 32:2015  <br>EN 55024:2010 +A1:2015/CISPR 24:2010 +A1:2015  <br>EN 61000-3-2:2014/IEC 61000-3-2:2014 (Class D)   <br>EN 61000-3-3:2013/IEC 61000-3-3:2013                                                                                                                                                                                         |
|    Energy             |    Commission Regulation (EU) No. 617/2013                                                                                                                                                                                        |
|    RoHS           |    EN 50581:2012                                                                                                                                                                                        |

### Operating temperature de-rating specifications

|     Operating    temperature de-rating     |     Ambient    temperature range                                                         |
|--------------------------------------------|------------------------------------------------------------------------------------------|
|    Up to 35°C (95°F)                       |    Maximum temperature is reduced by   1°C/300 m (1°F/547 ft) above 950 m (3,117 ft).    |
|    35°C to 40°C (95°F to 104°F)            |    Maximum temperature is reduced by   1°C/175 m (1°F/319 ft) above 950 m (3,117 ft).    |
|    40°C to 45°C (104°F to 113°F)           |    Maximum temperature is reduced by   1°C/125 m (1°F/228 ft) above 950 m (3,117 ft).    |

## Next steps

[Deploy your Azure Stack Edge Pro](azure-stack-edge-gpu-deploy-prep.md)
