---
title: Microsoft Azure Stack Edge Pro R technical specifications and compliance| Microsoft Docs
description: Learn about the technical specifications and compliance for your Azure Stack Edge Pro R device
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 04/12/2023
ms.author: alkohli
---
# Azure Stack Edge Pro R technical specifications

The hardware components of your Azure Stack Edge Pro R device adhere to the technical specifications outlined in this article. The technical specifications describe the Power supply units (PSUs), storage capacity, enclosures, and environmental standards.


## Compute, memory specifications

The Azure Stack Edge Pro R device has the following specifications for compute and memory:

| Specification  | Value                                             |
|----------------|---------------------------------------------------|
| CPU type       | Dual Intel Xeon Silver 4114 CPU                   |
| CPU: raw       | 20 total cores, 40 total vCPUs                    |
| CPU: usable    | 32 vCPUs                                          |
| Memory type    | Dell Compatible 16 GiB RDIMM, 2666 MT/s, Dual rank |
| Memory: raw    | 256 GiB RAM (16 x 16 GiB)                           |
| Memory: usable | 217 GiB RAM                                        |

## Compute acceleration specifications

A Graphics Processing Unit (GPU) is included on every device that enables Kubernetes, deep learning, and machine learning scenarios.

| Specification           | Value                      |
|-------------------------|----------------------------|
| GPU   | One nVidia T4 GPU <br> For more information, see [NVIDIA T4](https://www.nvidia.com/en-us/data-center/tesla-t4/). | 

## Power supply unit specifications

The Azure Stack Edge Pro R device has two 100-240 V Power supply units (PSUs) with high-performance fans. The two PSUs provide a redundant power configuration. If a PSU fails, the device continues to operate normally on the other PSU until the failed module is replaced. The following table lists the technical specifications of the PSUs.

| Specification              | 550 W PSU                  |
|----------------------------|----------------------------|
| Maximum output power       | 550 W                      |
| Heat dissipation (maximum) | 2891 BTU/hr                |
| Frequency                  | 50/60 Hz                   |
| Voltage range selection    | Auto ranging: 115-230 V AC |
| Hot pluggable              | Yes                        |

## Battery specifications for UPS

The Azure Stack Edge Pro R device has the following specifications for UPS:

| Specification  | Value                                             |
|----------------|---------------------------------------------------|
| Battery type       | Lithium iron phosphate (LFP) |
| Battery voltage       | 48 Vdc |
| Battery capacity | 5.0 Ah | 


## Network specifications

The Azure Stack Edge Pro R device has four network interfaces, PORT1 - PORT4.


|Specification         |Description                       |
|----------------------|----------------------------------|
|Network interfaces    |**2 x 1 GbE RJ45** <br> PORT 1 is used as the management interface for initial setup and is static by default. After the initial setup is complete, you can use the interface for data with any IP address. However, on reset, the interface reverts to static IP. <br>The other interface, PORT 2, which is user-configurable, can be used for data transfer, and is DHCP by default. |
|Network interfaces    |**2 x 25 GbE SFP28** <br> These data interfaces on PORT 3 and PORT 4 can be configured as DHCP (default) or static. |

Your Azure Stack Edge Pro R device has the following network hardware:

* **Mellanox dual port 25G ConnectX-4 channel network adapter** - PORT 3 and PORT 4. 

<!--Here are the details for the Mellanox card: MCX4421A-ACAN

| Parameter           | Description                 |
|-------------------------|----------------------------|
| Model    | ConnectX®-4 Lx EN network interface card                      |
| Model Description               | 25 GbE dual-port SFP28; PCIe3.0 x8; ROHS R6                    |
| Device Part Number (XR2) | MCX4421A-ACAN  |
| PSID (R640)           | MT_2420110034                         |-->
<!-- confirm w/ Ravi what is this-->

## Storage specifications

Azure Stack Edge Pro R devices have eight data disks and two M.2 SATA disks that serve as operating system disks. For more information, go to [M.2 SATA disks](https://en.wikipedia.org/wiki/M.2).

#### Storage for 1-node device

The following table has details for the storage capacity of the 1-node device.

|     Specification                          |     Value             |
|--------------------------------------------|-----------------------|
|    Number of solid-state drives (SSDs)     |    8                  |
|    Single SSD capacity                     |    8 TB               |
|    Total capacity                          |    64 TB              |
|    Total usable capacity*                  |    ~ 42 TB            |

**Some space is reserved for internal use.*

<!--#### Storage for 4-node device

The following table has the details for the storage capacity of the 4-node device.

|     Specification                          |     Value             |
|--------------------------------------------|-----------------------|
|    Number of solid-state drives (SSDs)     |    32 (4 X 8 disks for 4 devices)                |
|    Single SSD capacity                     |    8 TB               |
|    Total capacity                          |    256 TB              |
|    Total usable capacity*                  |    ~ 163 TB          |

**After mirroring and parity, and reserving some space for internal use.* -->


## Enclosure dimensions and weight specifications

The following tables list the various enclosure specifications for dimensions and weight.

### Enclosure dimensions 

The following table lists the dimensions of the device and the UPS with the rugged case in millimeters and inches.

|     Enclosure     |     Millimeters     |     Inches     |
|-------------------|---------------------|----------------|
|    Height         |    301.2            |    11.86       |
|    Width          |    604.5            |    23.80       |
|    Length         |    740.4            |    35.50       |

<!--#### For the 4-node system

For the 4-node system, the servers and the heater are shipped in a 5U case and the UPS are shipped in a 4U case.

The following table lists the dimensions of the 5U device case:  

|     Enclosure     |     Millimeters   |     Inches     |
|-------------------|-------------------|----------------|
|    Height         |    387.4          |    15.25       |
|    Width          |    604.5          |    23.80       |
|    Length         |    901.7          |    35.50       |

The following table lists the dimensions of the 4U UPS case: 

|     Enclosure     |     Millimeters   |     Inches    |
|-------------------|-------------------|---------------|
|    Height         |    342.9          |    13.5       |
|    Width          |    604.5          |   23.80       |
|    Length         |    901.7          |   35.50       |
-->

### Enclosure weight 

The weight of the device depends on the configuration of the enclosure.

|     Enclosure                                 |     Weight          |
|-----------------------------------------------|---------------------|
|    Total weight of 1-node device + rugged case with end caps     |    ~114 lbs          |

<!--#### For the 4-node system

|     Enclosure                                 |     Weight          |
|-----------------------------------------------|---------------------|
|   Approximate weight of fully populated 4 devices + heater in 5U case     |    ~200 lbs.          |
|   Approximate weight of fully populated 4 UPS in 4U case    |    ~145 lbs.          |
-->

## Enclosure environment specifications

This section lists the specifications related to the enclosure environment such as temperature, vibration, shock, and altitude.


|     Specification              |     Value    |
|--------------------------------|-------------------------------------------------------------------|
|     Temperature range          |     0 – 43° C (operational)    |
|     Vibration                  |     MIL-STD-810 Method 514.7*<br>Procedure I CAT 4, 20                  |
|     Shock                      |     MIL-STD-810 Method 516.7*<br>Procedure IV, Logistic                 |
|     Altitude                   |     Operational:   10,000 feet<br>Non-operational: 40,000 feet          |

**All references are to MIL-STD-810G Change 1 (2014)*

## Next steps

- [Deploy your Azure Stack Edge](azure-stack-edge-placeholder.md)
