---
title: Overview of the Azure Compute Unit
description: Overview of the concept of the Azure compute units. The ACU provides a way of comparing CPU performance across Azure SKUs.
author: mimckitt
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 04/27/2022
ms.author: mimckitt
ms.reviewer: davberg
---
 
# Azure compute unit (ACU)

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

The concept of the Azure Compute Unit (ACU) provides a way of comparing compute (CPU) performance across Azure SKUs. This will help you easily identify which SKU is most likely to satisfy your performance needs. ACU is currently standardized on a Small (Standard_A1) VM being 100 and all other SKUs then represent approximately how much faster that SKU can run a standard benchmark

*ACUs use Intel® Turbo technology to increase CPU frequency and provide a performance increase.  The amount of the performance increase can vary based on the VM size, workload, and other workloads running on the same host.

**ACUs use AMD® Boost technology to increase CPU frequency and provide a performance increase.  The amount of the performance increase can vary based on the VM size, workload, and other workloads running on the same host.

***Hyper-threaded and capable of running nested virtualization

****AMD Simultaneous multithreading technology

> [!IMPORTANT]
> The ACU is only a guideline. The results for your workload may vary.
<br>

| SKU Family | ACU \ vCPU | vCPU: Core |
| --- | --- |---|
| [A1_v2 - A8_v2](sizes-general.md) |100 | 1:1 |
| [A2m_v2 - A8m_v2](sizes-general.md) |100 | 1:1 |
| [B](sizes-b-series-burstable.md) |Varies | 1:1 |
| [D1 - D14](sizes-previous-gen.md) |160 - 250 | 1:1 |
| [D1_v2 - D15_v2](dv2-dsv2-series.md) |210 - 250* | 1:1 |
| [DS1 - DS14](sizes-previous-gen.md) |160 - 250 | 1:1 |
| [DS1_v2 - DS15_v2](dv2-dsv2-series.md) |210 - 250* | 1:1 |
| [D_v3](dv3-dsv3-series.md) |160 - 190* | 2:1\*\*\* |
| [Ds_v3](dv3-dsv3-series.md) |160 - 190* | 2:1\*\*\* |
| [Dav4](dav4-dasv4-series.md) |230 - 260** | 2:1\*\*\*\* |
| [Dasv4](dav4-dasv4-series.md) |230 - 260** | 2:1\*\*\*\* |
| [Dv4](dv4-dsv4-series.md) | 195 - 210 | 2:1\*\*\* |
| [Dsv4](dv4-dsv4-series.md) | 195 - 210 | 2:1\*\*\* |
| [Ddv4](ddv4-ddsv4-series.md) | 195 -210* | 2:1\*\*\* |
| [Ddsv4](ddv4-ddsv4-series.md) | 195 - 210* | 2:1\*\*\* |
| [E_v3](ev3-esv3-series.md) |160 - 190* | 2:1\*\*\*|
| [Es_v3](ev3-esv3-series.md) |160 - 190* | 2:1\*\*\* |
| [Eav4](eav4-easv4-series.md) |230 - 260** | 2:1\*\*\*\* |
| [Easv4](eav4-easv4-series.md) | 230 - 260** | 2:1\*\*\*\* |
| [Ev4](ev4-esv4-series.md) | 195 - 210 | 2:1\*\*\* |
| [Esv4](ev4-esv4-series.md) | 195 - 210 | 2:1\*\*\* |
| [Edv4](edv4-edsv4-series.md) | 195 - 210* | 2:1\*\*\* |
| [Edsv4](edv4-edsv4-series.md) | 195 - 210* | 2:1\*\*\* |
| [F2s_v2 - F72s_v2](fsv2-series.md) |195 - 210* | 2:1\*\*\* |
| [F1 - F16](sizes-previous-gen.md) |210 - 250* | 1:1 |
| [F1s - F16s](sizes-previous-gen.md) |210 - 250* | 1:1 |
| [FX4 - FX48](fx-series.md) | 310 - 340* | 2:1\*\*\* | 
| [G1 - G5](sizes-previous-gen.md) |180 - 240* | 1:1 |
| [GS1 - GS5](sizes-previous-gen.md) |180 - 240* | 1:1 |
| [H](h-series.md) |290 - 300* | 1:1 |
| [HB](hb-series.md) |199 - 216** | 1:1 |
| [HC](hc-series.md) |297 - 315* | 1:1 |
| [L4s - L32s](sizes-previous-gen.md) |180 - 240* | 1:1 |
| [L8s_v2 - L80s_v2](lsv2-series.md) |150 - 175** | 2:1\*\*\*\* |
| [M](m-series.md) | 160 - 180 | 2:1\*\*\* |
| [Mv2](msv2-mdsv2-series.md) | 240 - 280 | 2:1\*\*\* |
| [NVv4](nvv4-series.md) |230 - 260** | 2:1\*\*\*\* |

Processor model information for each SKU is available in the SKU documentation (see links above).  Optimal performance may require the latest VM images (OS and [VM generation](generation-2.md)) to ensure the latest updates and fastest drivers.

### VM Series Retiring

The following VM series are retiring on or before August 31, 2024:

| SKU Family | ACU \ vCPU | vCPU: Core |  Retirement Date |
| --- | --- |---| --- |
| [H](h-series.md)                  |290 - 300*  | 1:1 | [August 31, 2022](h-series-retirement.md) |
| [HB](hb-series.md)                |199 - 216** | 1:1 | [August 31, 2024](hb-series-retirement.md) |
| [A0](sizes-previous-gen.md)       |50          | 1:1 | [August 31, 2024](av1-series-retirement.md) |
| [A1 - A4](sizes-previous-gen.md)  |100         | 1:1 | [August 31, 2024](av1-series-retirement.md) |
| [A5 - A7](sizes-previous-gen.md)  |100         | 1:1 | [August 31, 2024](av1-series-retirement.md) |
| [A8 - A11](sizes-previous-gen.md) |225*        | 1:1 | [August 31, 2024](av1-series-retirement.md) |

The following GPU series are also retiring:

| SKU Family | Retirement Date |
| ---------- | --------------- |
| NC         | [August 31, 2023](nc-series-retirement.md)   |
| NCv2       | [August 31, 2023](ncv2-series-retirement.md) |
| ND         | [August 31, 2023](nd-series-retirement.md)   |
| NV         | [August 31, 2023](nv-series-retirement.md)   |

## Performance Consistency

We understand that Azure customers want the best possible consistent performance, they want to be able to count on getting the same performance from the same type of VM every time.  

Azure VM sizes typically run with maximum performance on the hardware platform they are first released on.  Azure may place controls on older Azure VMs when run on newer hardware to help maintain consistent performance for our customers even when the VMs run on different hardware.  For example:
1) **D**, **E**, and **F** series VMs may have the processor frequency set to a lower level when running on newer hardware to help achieve better performance consistency across hardware updates.  (The specific frequency setting varies based on the processor the VM series was first released on and the comparable performance of the current hardware.)
2) **A** series VMs use an older model based on time slicing newer hardware to deliver performance consistency across hardware versions.
3) **B** series VMs are burstable and use a credit system (described in their [documentation](sizes-b-series-burstable.md) to achieve expected performance.

These different processor settings for VMs are a key part of Azure's effort to provide consistent performance and minimize the impact of changes in underlying hardware platform outside of our customer’s control.


## More Info

Here are links to more information about the different sizes:

- [General-purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Compute optimized](sizes-compute.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Storage optimized](sizes-storage.md)
