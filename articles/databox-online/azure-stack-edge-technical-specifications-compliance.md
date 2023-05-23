---
title: Azure Stack Edge Pro FPGA technical specifications and compliance
description: Learn about the technical specifications and compliance for your Azure Stack Edge Pro FPGA
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 04/12/2023
ms.author: alkohli
---
# Azure Stack Edge Pro FPGA technical specifications

The hardware components of your Microsoft Azure Stack Edge Pro FPGA device adhere to the technical specifications and regulatory standards outlined in this article. The technical specifications describe the Power supply units (PSUs), storage capacity, enclosures, and environmental standards.

## Compute, memory specifications

The Azure Stack Edge Pro FPGA device has the following specifications for compute and memory:

| Specification           | Value                             |
|-------------------------|-----------------------------------|
| CPU type                | Dual Intel Xeon Silver 4114 2.2 G |
| CPU: raw                | 20 total cores, 40 total vCPUs    |
| CPU: usable             | 32 vCPUs                          |
| Memory type             | 8 x 16 GiB RDIMM                   |
| Memory: raw             | 128 GiB RAM (8 x 16 GiB)           |
| Memory: usable          | 102 GiB RAM                        |


## FPGA specifications

A Field Programmable Gate Array (FPGA) is included on every Azure Stack Edge Pro FPGA device that enables Machine Learning (ML) scenarios.

| Specification           | Value                      |
|-------------------------|----------------------------|
| FPGA   | Intel Arria 10 <br> Available Deep Neural Network (DNN) models are the same as those [supported by cloud FPGA instances](../machine-learning/how-to-deploy-fpga-web-service.md#fpga-support-in-azure).|

## Power supply unit specifications

The Azure Stack Edge Pro FPGA device has two 100-240 V Power supply units (PSUs) with high-performance fans. The two PSUs provide a redundant power configuration. If a PSU fails, the device continues to operate normally on the other PSU until the failed module is replaced. The following table lists the technical specifications of the PSUs.

| Specification           | 750 W PSU                  |
|-------------------------|----------------------------|
| Maximum output power    | 750 W                      |
| Frequency               | 50/60 Hz                   |
| Voltage range selection | Auto ranging: 100-240 V AC |
| Hot pluggable           | Yes                        |

### Azure Stack Edge Pro FPGA power cord specifications by region

Your Azure Stack Edge Pro FPGA device needs a power cord that varies depending on your Azure region.
For technical specifications of all the supported power cords, see [Azure Stack Edge Pro FPGA power cord specifications by region](azure-stack-edge-technical-specifications-power-cords-regional.md).

<!--## Power consumption statistics

The following table lists the typical power consumption data (actual values may vary from the published) for the Azure Stack Edge Pro FPGA device.-->

## Network interface specifications

Your Azure Stack Edge Pro FPGA device has six network interfaces, PORT1- PORT6.

| Specification           | Description                 |
|-------------------------|----------------------------|
|  Network interfaces    | 2 X 1 GbE interfaces – 1 management, not user configurable, used for initial setup. The other interface is user configurable, can be used for data transfer, and is DHCP by default. <br>2 X 25-GbE interfaces – These can also operate as 10-GbE interfaces. These data interfaces can be configured by user as DHCP (default) or static. <br> 2 X 25-GbE interfaces - These data interfaces can be configured by user as DHCP (default) or static.                  |

The Network Adapters used are:

| Specification           | Description                 |
|-------------------------|----------------------------|
|Network Daughter Card (rNDC) |QLogic FastLinQ 41264 Dual Port 25GbE SFP+, Dual Port 1GbE, rNDC|
|PCI Network Adapter |QLogic FastLinQ 41262 zwei Ports 25Gbit/s SFP28 Adapter|

Consult the Hardware Compatibility List from Intel QLogic for compatible Gigabit Interface Converter (GBIC). Gigabit Interface Converter (GBIC) aren't included in the delivery of Azure Stack Edge. 

## Storage specifications

The Azure Stack Edge Pro FPGA devices have 9 X 2.5" NVMe SSDs, each with a capacity of 1.6 TB. Of these SSDs, 1 is an operating system disk, and the other 8 are data disks. The total usable capacity for the device is roughly 12.5 TB. The following table has the details for the storage capacity of the device.

|     Specification                          |     Value             |
|--------------------------------------------|-----------------------|
|    Number of solid-state drives (SSDs)     |    8                  |
|    Single SSD capacity                     |    1.6 TB             |
|    Total capacity                          |    12.8 TB            |
|    Total usable capacity*                  |    ~ 12.5 TB          |

**Some space is reserved for internal use.*

## Enclosure dimensions and weight specifications

The following tables list the various enclosure specifications for dimensions and weight.

### Enclosure dimensions

The following table lists the dimensions of the enclosure in millimeters and inches.

|     Enclosure     |     Millimeters    |     Inches     |
|-------------------|--------------------|----------------|
|    Height         |    44.45           |    1.75"       |
|    Width          |    434.1           |    17.09"      |
|    Length         |    740.4           |    29.15"      |

The following table lists the dimensions of the shipping package in millimeters and inches.

|     Package       |     Millimeters     |     Inches     |
|-------------------|---------------------|----------------|
|    Height         |    311.2            |    12.25"      |
|    Width          |    642.8            |    25.31"      |
|    Length         |   1,051.1           |    41.38"      |

### Enclosure weight

The device package weighs 61 lbs. and requires two persons to handle it. The weight of the device depends on the configuration of the enclosure.

|     Enclosure                                 |     Weight          |
|-----------------------------------------------|---------------------|
|    Total weight including the packaging       |    61 lbs.          |
|    Weight of the device                       |    35 lbs.          |

## Enclosure environment specifications

This section lists the specifications related to the enclosure environment such as temperature, humidity, and altitude.

### Temperature and humidity

|     Enclosure         |     Ambient    temperature range     |     Ambient relative    humidity     |     Maximum dew point     |
|-----------------------|--------------------------------------|--------------------------------------|---------------------------|
|    Operational        |    10°C - 35°C (50°F - 86°F)         |    10% - 80% noncondensing.         |    29°C (84°F)            |
|    Non-operational    |    -40°C to 65°C (-40°F - 149°F)     |    5% - 95% noncondensing.          |    33°C (91°F)            |

### Airflow, altitude, shock, vibration, orientation, safety, and EMC

|     Enclosure                           |     Operational specifications                                                                                                                                                                                         |
|-----------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|    Airflow                              |    System airflow is front to rear. System must be operated with a low-pressure, rear-exhaust installation. <!--Back pressure created by rack doors and obstacles should not exceed 5 pascals (0.5 mm water gauge).-->    |
|    Maximum altitude, operational        |    3048 meters (10,000 feet) with maximum operating temperature   de-rated determined by [Operating temperature derating specifications](#operating-temperature-derating-specifications).                                                                                |
|    Maximum altitude, nonoperational    |    12,000 meters (39,370 feet)                                                                                                                                                                                         |
|    Shock, operational                   |    6 G for 11 milliseconds in six   orientations                                                                                                                                                                         |
|    Shock, nonoperational               |    71 G for 2 milliseconds in six orientations                                                                                                                                                                           |
|    Vibration, operational               |    0.26 G<sub>RMS</sub> 5 Hz to 350 Hz random                                                                                                                                                                                     |
|    Vibration, nonoperational           |    1.88 G<sub>RMS</sub> 10 Hz to 500 Hz for 15   minutes (all six sides tested.)                                                                                                                                                  |
|    Orientation and mounting             |    19" rack mount                                                                                                                                                                                        |
|    Safety and approvals                 |    EN 60950-1:2006 +A1:2010 +A2:2013 +A11:2009 +A12:2011/IEC 60950-1:2005 ed2 +A1:2009 +A2:2013 EN 62311:2008                                                                                                                                                                       |
|    EMC                                  |    FCC A, ICES-003 <br>EN 55032:2012/CISPR 32:2012  <br>EN 55032:2015/CISPR 32:2015  <br>EN 55024:2010 +A1:2015/CISPR 24:2010 +A1:2015  <br>EN 61000-3-2:2014/IEC 61000-3-2:2014 (Class D)   <br>EN 61000-3-3:2013/IEC 61000-3-3:2013                                                                                                                                                                                         |
|    Energy             |    Commission Regulation (EU) No. 617/2013                                                                                                                                                                                        |
|    RoHS           |    EN 50581:2012                                                                                                                                                                                        |

### Operating temperature derating specifications

|     Operating    temperature derating     |     Ambient    temperature range                                                         |
|--------------------------------------------|------------------------------------------------------------------------------------------|
|    Up to 35°C (95°F)                       |    Maximum temperature is reduced by   1°C/300 m (1°F/547 ft) above 950 m (3,117 ft).    |
|    35°C to 40°C (95°F to 104°F)            |    Maximum temperature is reduced by   1°C/175 m (1°F/319 ft) above 950 m (3,117 ft).    |
|    40°C to 45°C (104°F to 113°F)           |    Maximum temperature is reduced by   1°C/125 m (1°F/228 ft) above 950 m (3,117 ft).    |

## Next steps

- [Deploy your Azure Stack Edge Pro](azure-stack-edge-deploy-prep.md)