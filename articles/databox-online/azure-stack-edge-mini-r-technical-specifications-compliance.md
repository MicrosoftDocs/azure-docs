---
title: Microsoft Auzre Stack Edge Mini R technical specifications and compliance| Microsoft Docs
description: Learn about the technical specifications and compliance for your Auzre Stack Edge Mini R device
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 09/15/2020
ms.author: alkohli
---
# Auzre Stack Edge Mini R technical specifications

The hardware components of your Microsoft Auzre Stack Edge Mini R device adhere to the technical specifications and regulatory standards outlined in this article. The technical specifications describe the device dimensions, CPU, memory, power supply units (PSUs), and storage capacity.

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

The weight of the device depends on the configuration of the enclosure. For example:

|     Enclosure                                 |     Weight          |
|-----------------------------------------------|---------------------|
|    Total weight of the device     |    7 lbs.          |

## Compute, memory specifications

The Auzre Stack Edge Mini R device has the following specifications for compute and memory:

| Specification           | Value                  |
|-------------------------|------------------------|
| CPU    | 16-core CPU, Intel Xeon-D 1577 |
| Memory              | 48 GB RAM (2400 MT/s)                  |
| Compute Acceleration card         | Intel Movidius Myriad X VPU <br> For more information, see [Intel Movidius Myriad X VPU](https://www.movidius.com/MyriadX) | 


## Storage specifications

The Auzre Stack Edge Mini R device has 1 data disk and 1 boot disk (that serves as operating system storage). The following table shows the details for the storage capacity of the device.

|     Specification                          |     Value             |
|--------------------------------------------|-----------------------|
|    Number of solid-state drives (SSDs)     |    2 X 1 TB disks <br> One data disk and one boot disk                  |
|    Single SSD capacity                     |    1 TB               |
|    Total capacity                          |    1 TB              |
|    Total usable capacity*                  |    ~ 750 GB        |

**Some space is reserved for internal use.*

## Network specifications

The Auzre Stack Edge Mini R device has the following specifications for network:


|Specification  |Value  |
|---------|---------|
|Network interfaces    |2 x 10 Gbe SFP+ <br> Shown as PORT 3 and PORT 4 in the local UI           |
|Network interfaces    |2 x 1 Gbe RJ45 <br> Shown as PORT 1 and PORT 2 in the local UI          |
|Wi-Fi   |802.11ac         |

The following image shows the Auzre Stack Edge Mini R device ports and interfaces:

![Auzre Stack Edge Mini R](media/azure-stack-edge-k-series-deploy-install/ports-front-plane.png)


## Power supply unit specifications

The Auzre Stack Edge Mini R device includes an external 85 W AC adapter to supply power and charge the onboard battery.

The following table shows the power supply unit specifications:

| Specification           | Value                      |
|-------------------------|----------------------------|
| Maximum output power    | 85 W                       |
| Frequency               | 50/60 Hz                   |
| Voltage range selection | Auto ranging: 100-240 V AC |


The following table shows different images of the Auzre Stack Edge Mini R device power supply:

|Power supply unit description  |  Image  |
|---|---|
| Power supply |![Auzre Stack Edge Mini R connected to the power supply](media/azure-stack-edge-k-series-technical-specifications-compliance/k-series-powersupply-1.png)|
| Connected Power supply|![Standalone Auzre Stack Edge Mini R power supply](media/azure-stack-edge-k-series-technical-specifications-compliance/k-series-powersupply-2.png)|
| Power supply and specification label|![Standalone Auzre Stack Edge Mini R power supply](media/azure-stack-edge-k-series-technical-specifications-compliance/k-series-powersupply-3.png)|

## Included battery

The Auzre Stack Edge Mini R device also includes an onboard battery that is charged by the power supply. 

An additional type 2590 battery can be used in conjunction with the onboard battery to extend the use of the device between the charges. This battery should be compliant with all the Safety, Transportation, and Environmental regulations applicable in the country of use.


| Specification           | Value                      |
|-------------------------|----------------------------|
| Onboard battery capacity | 73 WHr                    |


<!--## Enclosure environment specifications


This section lists the specifications related to the enclosure environment such as temperature, humidity, and altitude.


### Temperature and humidity

|     Enclosure         |     Ambient    temperature range     |     Ambient relative    humidity     |     Maximum dew point     |
|-----------------------|--------------------------------------|--------------------------------------|---------------------------|
|    Operational        |    10°C - 35°C (50°F - 86°F)         |    10% - 80% non-condensing.         |    29°C (84°F)            |
|    Non-operational    |    -40°C to 65°C (-40°F - 149°F)     |    5% - 95% non-condensing.          |    33°C (91°F)            |

### Airflow, altitude, shock, vibration, orientation, safety, and EMC

|     Enclosure                           |     Operational specifications                                                                                                                                                                                         |
|-----------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|    Airflow                              |    System airflow is front to rear. System must be operated with a low-pressure, rear-exhaust installation. <!--Back pressure created by rack doors and obstacles should not exceed 5 pascals (0.5 mm water gauge).   |
|    Maximum altitude, operational        |    3048 meters (10,000 feet) with maximum operating temperature de-rated determined by [Operating temperature de-rating specifications](#operating-temperature-de-rating-specifications).                                                                                |
|    Maximum altitude, non-operational    |    12,000 meters (39,370 feet)                                                                                                                                                                                         |
|    Shock, operational                   |    6 G for 11 milliseconds in 6 orientations                                                                                                                                                                         |
|    Shock, non-operational               |    71 G for 2 milliseconds in 6 orientations                                                                                                                                                                           |
|    Vibration, operational               |    0.26 G<sub>RMS</sub> 5 Hz to 350 Hz random                                                                                                                                                                                     |
|    Vibration, non-operational           |    1.88 G<sub>RMS</sub> 10 Hz to 500 Hz for 15 minutes (all six sides tested.)                                                                                                                                                  |
|    Orientation and mounting             |    19" rack mount                                                                                                                                                                                        |
|    Safety and approvals                 |    EN 60950-1:2006 +A1:2010 +A2:2013 +A11:2009 +A12:2011/IEC 60950-1:2005 ed2 +A1:2009 +A2:2013 EN 62311:2008                                                                                                                                                                       |
|    EMC                                  |    FCC A, ICES-003 <br>EN 55032:2012/CISPR 32:2012  <br>EN 55032:2015/CISPR 32:2015  <br>EN 55024:2010 +A1:2015/CISPR 24:2010 +A1:2015  <br>EN 61000-3-2:2014/IEC 61000-3-2:2014 (Class D)   <br>EN 61000-3-3:2013/IEC 61000-3-3:2013                                                                                                                                                                                         |
|    Energy             |    Commission Regulation (EU) No. 617/2013                                                                                                                                                                                        |
|    RoHS           |    EN 50581:2012                                                                                                                                                                                        |


### Operating temperature de-rating specifications

|     Operating    temperature de-rating     |     Ambient    temperature range                                                         |
|--------------------------------------------|------------------------------------------------------------------------------------------|
|    Up to 35°C (95°F)                       |    Maximum temperature is reduced by 1°C/300 m (1°F/547 ft) above 950 m (3,117 ft).    |
|    35°C to 40°C (95°F to 104°F)            |    Maximum temperature is reduced by 1°C/175 m (1°F/319 ft) above 950 m (3,117 ft).    |
|    40°C to 45°C (104°F to 113°F)           |    Maximum temperature is reduced by 1°C/125 m (1°F/228 ft) above 950 m (3,117 ft).    |
End of this section-->

## Next steps

- [Deploy your Auzre Stack Edge Mini R](azure-stack-edge-k-series-deploy-prep.md)
