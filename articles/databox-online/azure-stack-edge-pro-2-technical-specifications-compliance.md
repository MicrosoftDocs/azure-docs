---
title: Microsoft Azure Stack Edge Pro 2 technical specifications and compliance| Microsoft Docs
description: Learn about the technical specifications and compliance for your Azure Stack Edge Pro 2 device
services: databox
author: sipastak

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 04/12/2023
ms.author: sipastak
---

# Technical specifications and compliance for Azure Stack Edge Pro 2

The hardware components of your Azure Stack Edge Pro 2 adhere to the technical specifications and regulatory standards outlined in this article. The technical specifications describe hardware, power supply units (PSUs), storage capacity, and enclosures.

## Compute and memory specifications

# [Model 64G2T](#tab/sku-a)
The Azure Stack Edge Pro 2 device has the following specifications for compute and memory:

| Specification  | Value                                                                       |
|----------------|-----------------------------------------------------------------------------|
| CPU type       | Intel® Xeon ® Gold 6209U CPU @ 2.10 GHz (Cascade Lake) CPU|
| CPU: raw       | 20 total cores, 40 total vCPUs                                              |
| CPU: usable    | 32 vCPUs                                                                    |
| Memory type     | 2 x 32 GiB DDR4-2933 RDIMM |
| Memory: raw   | 64 GiB RAM |
| Memory: usable | 48 GiB RAM |
| GPU | None |

# [Model 128G4T1GPU](#tab/sku-b)
The Azure Stack Edge Pro 2 device has the following specifications for compute and memory:

| Specification  | Value                                                                       |
|----------------|-----------------------------------------------------------------------------|
| CPU type       | Intel® Xeon ® Gold 6209U CPU @ 2.10 GHz (Cascade Lake) CPU|
| CPU: raw       | 20 total cores, 40 total vCPUs                                              |
| CPU: usable    | 32 vCPUs                                                                    |
| Memory type     | 4 x 32 GiB DDR4-2933 RDIMM |
| Memory: raw   | 128 GiB RAM |
| Memory: usable | 96 GiB RAM |
| GPU | 1 NVIDIA A2 GPU <br> For more information, see [NVIDIA A2 GPUs](https://www.nvidia.com/en-us/data-center/products/a2/). |

# [Model 256G6T2GPU](#tab/sku-c)
The Azure Stack Edge Pro 2 device has the following specifications for compute and memory:

| Specification  | Value                                                                       |
|----------------|-----------------------------------------------------------------------------|
| CPU type       | Intel® Xeon ® Gold 6209U CPU @ 2.10 GHz (Cascade Lake) CPU|
| CPU: raw       | 20 total cores, 40 total vCPUs                                              |
| CPU: usable    | 32 vCPUs                                                                    |
| Memory type     | 4 x 64 GiB DDR4-2933 RDIMM |
| Memory: raw   | 256 GiB RAM |
| Memory: usable | 224 GiB RAM |
| GPU | 2 NVIDIA A2 GPUs <br> For more information, see [NVIDIA A2 GPUs](https://www.nvidia.com/en-us/data-center/products/a2/). |

---

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
| Model Description  | 100-GbE dual-port QSFP56 |
| Device Part Number | MCX623106AC-CDAT, with crypto or with secure boot |

## Storage specifications

# [Model 64G2T](#tab/sku-a)

The following table lists the storage capacity of the device.

|     Specification                         |     Value             |
|-------------------------------------------|-----------------------|
| Boot disk                 |    1  NVMe SSD         |
|    Boot disk capacity     |    960 GB              |
|  Number of data disks     |    2 SATA SSDs         |
| Single data disk capacity |    960 GB              |
|    Total capacity         |  2 TB    |
|    Total usable capacity  |  720 GB |
|    RAID configuration     | [Storage Spaces Direct with mirroring](/windows-server/storage/storage-spaces/storage-spaces-fault-tolerance#mirroring) |

# [Model 128G4T1GPU](#tab/sku-b)

|     Specification                         |     Value             |
|-------------------------------------------|-----------------------|
| Boot disk                 |    1  NVMe SSD         |
|    Boot disk capacity     |    960 GB              |
|  Number of data disks     |    4 SATA SSDs         |
| Single data disk capacity |    960 GB              |
|    Total capacity         |  4 TB    |
|    Total usable capacity  |  1.6 TB |
|    RAID configuration     | [Storage Spaces Direct with mirroring](/windows-server/storage/storage-spaces/storage-spaces-fault-tolerance#mirroring) |

# [Model 256G6T2GPU](#tab/sku-c)

|     Specification                         |     Value             |
|-------------------------------------------|-----------------------|
| Boot disk                 |    1  NVMe SSD         |
|    Boot disk capacity     |    960 GB              |
|  Number of data disks     |    6 SATA SSDs         |
| Single data disk capacity |    960 GB              |
|    Total capacity         |  6 TB    |
|    Total usable capacity  |  2.5 TB |
|    RAID configuration     | [Storage Spaces Direct with mirroring](/windows-server/storage/storage-spaces/storage-spaces-fault-tolerance#mirroring) |

---

## Enclosure dimensions and weight specifications

The following tables list the various enclosure specifications for dimensions and weight. 

### Enclosure dimensions

The Azure Stack Edge Pro 2 is designed to fit in a standard 19" equipment rack and is two rack units high (2U).

The enclosure dimensions are identical across all models of Azure Stack Edge Pro 2. 

The following table lists the dimensions of the 2U device enclosure in millimeters and inches. 

|     Enclosure     |     Millimeters     |     Inches     |
|-------------------|---------------------|----------------|
|    Height         |    87.0             |    3.43        |
|    Width          |    482.6            |    19.00       |
|    Depth          |    430.5            |    16.95       |


The following table lists the dimensions of the shipping package in millimeters and inches.

|     Package       |     Millimeters     |     Inches     |
|-------------------|---------------------|----------------|
|    Height         |    241.3            |    9.50        |
|    Width          |    768.4            |    30.25       |
|    Depth          |    616.0            |    24.25       |


### Enclosure weight

# [Model 64G2T](#tab/sku-a)

| Line # | Hardware                                                                           | Weight lbs |
|--------|------------------------------------------------------------------------------------|------------|
| 1      | Model 64G2T                                                                        | 21.0       |
|        |                                                                                    |            |
| 2      | Shipping weight, with four-post mount                                                 | 35.3       |
| 3      | Model 64G2T install handling, four-post (without bezel and with inner rails attached) | 20.4       |
|        |                                                                                    |            |
| 4      | Shipping weight, with two-post mount                                                 | 32.1       |
| 5      | Model 64G2T install handling, two-post (without bezel and with inner rails attached) | 20.4       |
|        |                                                                                    |            |
| 6      | Shipping weight with wall mount                                                    | 31.1       |
| 7      | Model 64G2T install handling without bezel                                         | 19.8       |
|        |                                                                                    |            |
| 8      | four-post in box                                                                      | 6.28       |
| 9      | two-post in box                                                                      | 3.08       |
| 10      | Wall mounts as packaged                                                             | 2.16       |

# [Model 128G4T1GPU](#tab/sku-b)

| Line # | Hardware                                                                           | Weight lbs |
|--------|------------------------------------------------------------------------------------|------------|
| 1      | Model 128G4T1GPU                                                                   | 21.9         |
|        |                                                                                    |            |
| 2      | Shipping weight, with four-post mount                                                 | 36.2       |
| 3      | Model 128G4T1GPU install handling, four-post (without bezel and with inner rails attached) | 21.3       |
|        |                                                                                    |            |
| 4      | Shipping weight, with two-post mount                                                 | 33.0       |
| 5      | Model 128G4T1GPU install handling, two-post (without bezel and with inner rails attached) | 21.3      |
|        |                                                                                    |            |
| 6     | Shipping weight with wall mount                                                     | 32.0      |
| 7      | Model 128G4T1GPU install handling without bezel                                    | 20.7       |
|        |                                                                                    |            |
| 8      | four-post in box                                                                      | 6.28       |
| 9      | two-post in box                                                                      | 3.08       |
| 10      | Wall mounts as packaged                                                             | 2.16       |

# [Model 256G6T2GPU](#tab/sku-c)

| Line # | Hardware                                                                           | Weight lbs |
|--------|--------------------------------------------------------------------|------------|
| 1      | Model 256G6T2GPU                                                  | 22.9       |
|        |                                                                   |            |
| 2      | Shipping weight, with four-post mount                                | 37.1      |
| 3 | Model 256G6T2GPU install handling, four-post (without bezel and with inner rails attached)|22.3 |
|        |                                                                      |            |
| 4      | Shipping weight, with two-post mount                                   | 33.9       |
| 5      | Model 256G6T2GPU install handling, two-post (without bezel and with inner rails attached) | 22.3       |
|        |                                                                      |            |
| 6      | Shipping weight with wall mount                                        | 33.0       |
| 7      | Model 256G6T2GPU install handling without bezel                      | 21.7       |
|        |                                                                     |            |
| 8      | four-post in box                                                       | 6.28       |
| 9      | two-post in box                                                       | 3.08       |
| 10     | Wall mounts as packaged                                              | 2.16       |


---

## Next steps

[Deploy your Azure Stack Edge Pro 2](azure-stack-edge-pro-2-deploy-prep.md)
