---
title: Microsoft Azure Stack Edge Pro 2 technical specifications and compliance| Microsoft Docs
description: Learn about the technical specifications and compliance for your Azure Stack Edge Pro 2 device
services: databox
author: sipastak

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 03/06/2022
ms.author: sipastak
---

# Technical specifications and compliance for Azure Stack Edge Pro 2

The hardware components of your Azure Stack Edge Pro 2 adhere to the technical specifications and regulatory standards outlined in this article. The technical specifications describe hardware, power supply units (PSUs), storage capacity, and enclosures.

## Compute and memory specifications

The Azure Stack Edge Pro 2 device has the following specifications for compute and memory:

| Specification  | Value                                                                       |
|----------------|-----------------------------------------------------------------------------|
| CPU type       | Intel® Xeon ® Gold 6209U CPU @ 2.10 GHz (Cascade Lake) CPU|
| CPU: raw       | 20 total cores, 40 total vCPUs                                              |
| CPU: usable    | 32 vCPUs                                                                    |
| Memory type     | Model 64G2T: 64 GB |
| Memory: raw   | Model 64G2T: 64 GB RAM |
| Memory: usable | Model 64G2T: 51 GB RAM |

## Power supply unit specifications

This device has one power supply unit (PSU) with high-performance fans. The following table lists the technical specifications of the PSUs.

| Specification           | 550 W PSU                  |
|-------------------------|----------------------------|
| Maximum output power    | 550 W                      |
| Heat dissipation (maximum)    | 550 W                  |
| Voltage range selection | 100-127 V AC, 47-63 Hz, 7.1 A |
| Voltage range selection | 200-240V AC, 47-63 Hz, 3.4 A |
| Hot pluggable           | No                   |


## Network interface specifications

Your Azure Stack Edge Pro 2 device has four network interfaces, Port 1 - Port 4.

* **2 X 10 GBase-T/1000Base-T(10/1 GbE) interfaces** 
    * Port 1 is used for initial setup and is static by default. After the initial setup is complete, you can use the interface for data with any IP address. However, on reset, the interface reverts back to static IP. 
    * Port 2 is user configurable, can be used for data transfer, and is DHCP by default. These 10/1-GbE interfaces can also operate as 10-GbE interfaces.
* **2 X 100-GbE interfaces** 
    * These data interfaces, Port 3 and Port 4, can be configured by user as DHCP (default) or static. 


Your Azure Stack Edge Pro 2 device has the following network hardware:

* **Onboard Intel Ethernet network adapter X722** - Port 1 and Port 2. [See here for details.](https://www.intel.com/content/www/us/en/ethernet-products/network-adapters/ethernet-x722-brief.html)
* **Nvidia Mellanox dual port 100-GbE ConnectX-6 Dx network adapter** - Port 3 and Port 4. [See here for details.](https://www.nvidia.com/en-us/networking/ethernet/connectx-6-dx/)

Here are the details for the Mellanox card:

| Parameter           | Description                 |
|-------------------------|----------------------------|
| Model              | ConnectX®-6 Dx network interface card             |
| Model Description  | 100 GbE dual-port QSFP56 |
| Device Part Number | MCX623106AC-CDAT, with crypto or with secure boot |

## Storage specifications

The following table lists the storage capacity of the device.

|     Specification                         |     Value             |
|-------------------------------------------|-----------------------|
| Boot disk                 |    1  NVMe SSD         |
|    Boot disk capacity     |    960 GB              |
|  Number of data disks     |    2 SATA SSDs         |
| Single data disk capacity |    960 GB              |
|    Total capacity         | Model 64G2T: 2 TB    |
|    Total usable capacity  | Model 64G2T: 720 GB |
|    RAID configuration     | [Storage Spaces Direct with mirroring](/windows-server/storage/storage-spaces/storage-spaces-fault-tolerance#mirroring) |


## Enclosure dimensions and weight specifications

The following tables list the various enclosure specifications for dimensions and weight.

### Enclosure dimensions

The following table lists the dimensions of the 2U device enclosure in millimeters and inches.

|     Enclosure     |     Millimeters     |     Inches     |
|-------------------|---------------------|----------------|
|    Height         |    87.0             |    3.425       |
|    Width          |    482.6            |    19.00       |
|    Depth          |    430.5            |    16.95       |

The following table lists the dimensions of the shipping package in millimeters and inches.

|     Package       |     Millimeters     |     Inches     |
|-------------------|---------------------|----------------|
|    Height         |    241.3            |    9.50        |
|    Width          |    768.4            |    30.25       |
|    Depth          |    616.0            |    24.25       |

### Enclosure weight

| Line # | Hardware                                                                           | Weight lbs |
|--------|------------------------------------------------------------------------------------|------------|
| 1      | Model 642GT                                                                        | 21         |
|        |                                                                                    |            |
| 2      | Shipping weight, with 4-post mount                                                 | 35.3       |
| 3      | Model 642GT install handling, 4-post (without bezel and with inner rails attached) | 20.4       |
| 4      | 4-post in box                                                                      | 6.28       |
|        |                                                                                    |            |
| 5      | Shipping weight, with 2-post mount                                                 | 32.1       |
| 6      | Model 642GT install handling, 2-post (without bezel and with inner rails attached) | 20.4       |
| 7      | 2-post in box                                                                      | 3.08       |
|        |                                                                                    |            |
| 8     | Shipping weight with wall mount                                                    | 31.1       |
| 9      | Model 642GT install handling without bezel                                         | 19.8       |
| 10      | Wallmount as packaged                                                              | 2.16       |



## Next steps

[Deploy your Azure Stack Edge Pro 2](azure-stack-edge-pro-2-deploy-prep.md)
