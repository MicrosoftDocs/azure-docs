---
title: Microsoft Azure Stack Edge Pro 2 technical specifications and compliance| Microsoft Docs
description: Learn about the technical specifications and compliance for your Azure Stack Edge Pro 2 device
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 11/22/2021
ms.author: alkohli
---

# Technical specifications and compliance for Azure Stack Edge Pro 2 

The hardware components of your Azure Stack Edge Pro 2 adhere to the technical specifications and regulatory standards outlined in this article. The technical specifications describe hardware, power supply unit (PSU), storage capacity, enclosures, and environmental standards.

## Compute and memory specifications

The Azure Stack Edge Pro device has the following specifications for compute and memory:

| Specification  | Value                                                                       |
|----------------|-----------------------------------------------------------------------------|
| CPU type       | Intel® Xeon ® Gold 6209U CPU @ 2.10 GHz (Cascade Lake) CPU                              |
| CPU: raw       | 20 total cores, 40 total vCPUs                                             |
| CPU: usable    | 32 vCPUs                                                                    |
| Memory type    | 64 GB DDR4-2933Mhz 2Rx4 1.2v ECC UDIMM/SODIMM |
| Memory: raw    | 128 GB RAM (2 x 64 GB)                                                      |
| Memory: usable | 102 GB RAM                                                                  |


## Compute acceleration specifications

A Graphics Processing Unit (GPU) is included on every Azure Stack Edge Pro 2 device that enables Kubernetes, deep learning, and machine learning scenarios.

| Specification           | Value                  |
|-------------------------|----------------------------|
| GPU   | One Nvidia T4 GPU <br> For more information, see [NVIDIA T4](https://www.nvidia.com/en-us/data-center/tesla-t4/).| 


## Power supply unit specifications

This device has one power supply unit (PSU) with high-performance fans. If this PSU fails, the device experiences a down time until the failed module is replaced. The following table lists the technical specifications of the PSU.  

| Specification           | 550 W PSU                  |
|-------------------------|----------------------------|
| Maximum output power    | 550 W                     |
| Heat dissipation (maximum)| 550 W                  |
| Voltage range selection | 100-127 V AC, 47-63 Hz, 7.1 A <br>200-240 V AC, 47-63 Hz, 3.4 A |
| Hot pluggable           | No                       |


## Network interface specifications

Your Azure Stack Edge Pro 2 device has four network interfaces, PORT1- PORT4.

| Specification           | Description                 |
|-------------------------|----------------------------|
|  Network interfaces    | **2 X 10 GBase-T/1000Base-T(10/1 GbE) interfaces** – 1 interface Port 1 is used for initial setup and is static by default. After the initial setup is complete, you can use the interface for data with any IP address. However, on reset, the interface reverts back to static IP. <br>The other interface Port 2 is user configurable, can be used for data transfer, and is DHCP by default. <br> These 10/1-GbE interfaces can also operate as 10-GbE interfaces. <br>**2 X 100-GbE interfaces ** – These data interfaces, Port 3 and Port 4, can be configured by user as DHCP (default) or static. | 

Your Azure Stack Edge Pro device has the following network hardware:

- **Onboard Intel Ethernet network adapter X722** - Port 1 and Port 2. See here for [details](https://www.intel.com/content/www/us/en/ethernet-products/network-adapters/ethernet-x722-brief.html).
- **Nvidia Mellanox dual port 100-GbE ConnectX-6 Dx network adapter** - Port 3 and port 4. See here for [details](https://www.nvidia.com/networking/ethernet/connectx-6-dx/).

Here are the details for the Mellanox card:

| Parameter           | Description                 |
|-------------------------|----------------------------|
| Model    | ConnectX®-6 Dx network interface card                      |
| Model Description         | 100 GbE dual-port QSFP56                    |
| Device Part Number        | MCX623106AC-CDAT, with crypto/with secure boot  |


For a full list of supported cables, switches, and transceivers for these network cards, go to:

- [](azure-stack-edge-placeholder.md).
- [Mellanox ConnectX®-6 Dx network adapter compatible products](azure-stack-edge-placeholder.md).  

## Storage specifications

The following table lists the storage capacity of the device.

|     Specification                          |     Value             |
|--------------------------------------------|-----------------------|
|    Number of data disks                    |    4 Micron 5200 MTFDDAK960TDD SATA SSDs, see for [details](https://www.micron.com/products/ssd/bus-interfaces/sata-ssds/part-catalog/mtfddak960tdd-1at1zab).                  |
|    Single data disk capacity               |    960 GB             |
|    Boot disk                               |    1 NVMe SSD         |
|    Boot disk capacity                      |    960 GB             |
|    Total capacity                          |    ~ 4.0 TB           |
|    Total usable capacity                   |    ~ 1.67 TB          |
|    RAID configuration                      |    Storage Spaces Direct with mirroring  |


## Enclosure dimensions and weight specifications

The following tables list the various enclosure specifications for dimensions and weight.

### Enclosure dimensions

The following table lists the dimensions of the 2U device enclosure in millimeters and inches.

|     Enclosure     |     Millimeters     |     Inches     |
|-------------------|---------------------|----------------|
|    Height         |    86.99            |    3.425"       |
|    Width          |    482.57           |    19.00"      |
|    Length         |    430.37           |    16.95"      |

The following table lists the dimensions of the shipping package in millimeters and inches.

|     Package                         |     Millimeters    |     Inches     |
|-------------------------------------|------------------- |----------------|
|    Height                           |    241.30          |    9.50"       |
|    Width                            |    768.35          |    30.25"      |
|    Depth (cables installed)         |    430.37          |    30.25"      |
|    Depth (behind rak mount plane with cables installed)  |    388.81      |    15.31"          |

### Enclosure weight

The device package weighs 36 lbs. and requires one person to handle it. The weight of the device depends on the configuration of the enclosure.

|     Enclosure                                 |     Weight          |
|-----------------------------------------------|---------------------|
|    Total weight including the packaging <br>(device, packages bezel, packaged4-post King slide, one power cord, box, and foam)       |    36.0 lbs.          |
|    Weight of the device without bezel and without Wi-Fi                      |    20.5 lbs.          |
|    Weight of the device with bezel                      |    21.7 lbs.          |

<!--## Enclosure environment specifications

This section lists the specifications related to the enclosure environment such as temperature, humidity, and altitude.

### Temperature and humidity

|     Enclosure         |     Ambient    temperature range     |     Ambient relative    humidity     |     Maximum dew point     |
|-----------------------|--------------------------------------|--------------------------------------|---------------------------|
|    Operational        |    10°C - 35°C (50°F - 86°F)         |    10% - 80% non-condensing.         |    29°C (84°F)            |
|    Non-operational    |    -40°C to 65°C (-40°F - 149°F)     |    5% - 95% non-condensing.          |    33°C (91°F)            |
-->
<!--### Airflow, altitude, shock, vibration, orientation, safety, and EMC

|     Enclosure                           |     Operational specifications                                                                                                                                                                                         |
|-----------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|    Airflow                              |    System airflow is front to rear. System must be operated with a low-pressure, rear-exhaust installation.    |
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
-->

<!--### Operating temperature de-rating specifications

|     Operating    temperature de-rating     |     Ambient    temperature range                                                         |
|--------------------------------------------|------------------------------------------------------------------------------------------|
|    Up to 35°C (95°F)                       |    Maximum temperature is reduced by   1°C/300 m (1°F/547 ft) above 950 m (3,117 ft).    |
|    35°C to 40°C (95°F to 104°F)            |    Maximum temperature is reduced by   1°C/175 m (1°F/319 ft) above 950 m (3,117 ft).    |
|    40°C to 45°C (104°F to 113°F)           |    Maximum temperature is reduced by   1°C/125 m (1°F/228 ft) above 950 m (3,117 ft).    |
-->

## Next steps

[Deploy your Azure Stack Edge Pro](azure-stack-edge-gpu-deploy-prep.md)
