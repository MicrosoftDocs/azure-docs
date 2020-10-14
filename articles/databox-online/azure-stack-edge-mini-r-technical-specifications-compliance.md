---
title: Microsoft Azure Stack Edge Mini R technical specifications and compliance| Microsoft Docs
description: Learn about the technical specifications and compliance for your Azure Stack Edge Mini R device
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 09/22/2020
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

The Azure Stack Edge Mini R device has the following specifications for network:


|Specification  |Value  |
|---------|---------|
|Network interfaces    |2 x 10 Gbe SFP+ <br> Shown as PORT 3 and PORT 4 in the local UI           |
|Network interfaces    |2 x 1 Gbe RJ45 <br> Shown as PORT 1 and PORT 2 in the local UI          |
|Wi-Fi   |802.11ac         |

<!--The following image shows the Azure Stack Edge Mini R device ports and interfaces:

![Azure Stack Edge Mini R](media/azure-stack-edge-k-series-deploy-install/ports-front-plane.png)-->


## Power supply unit specifications

The Azure Stack Edge Mini R device includes an external 85 W AC adapter to supply power and charge the onboard battery.

The following table shows the power supply unit specifications:

| Specification           | Value                      |
|-------------------------|----------------------------|
| Maximum output power    | 85 W                       |
| Frequency               | 50/60 Hz                   |
| Voltage range selection | Auto ranging: 100-240 V AC |


<!--The following table shows different images of the Azure Stack Edge Mini R device power supply:

|Power supply unit description  |  Image  |
|---|---|
| Power supply |![Azure Stack Edge Mini R connected to the power supply](media/azure-stack-edge-k-series-technical-specifications-compliance/k-series-powersupply-1.png)|
| Connected Power supply|![Standalone Azure Stack Edge Mini R power supply](media/azure-stack-edge-k-series-technical-specifications-compliance/k-series-powersupply-2.png)|
| Power supply and specification label|![Standalone Azure Stack Edge Mini R power supply](media/azure-stack-edge-k-series-technical-specifications-compliance/k-series-powersupply-3.png)|-->

## Included battery

The Azure Stack Edge Mini R device also includes an onboard battery that is charged by the power supply. 

An additional type 2590 battery can be used in conjunction with the onboard battery to extend the use of the device between the charges. This battery should be compliant with all the safety, transportation, and environmental regulations applicable in the country of use.


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
