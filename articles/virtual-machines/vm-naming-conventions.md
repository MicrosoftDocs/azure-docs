---
title: Azure VM sizes naming conventions
description: Explains the naming conventions used for Azure VM sizes
ms.service: virtual-machines
subservice: sizes
author: mimckitt
ms.topic: conceptual
ms.date: 05/01/2023
ms.author: mimckitt
ms.reviewer: mattmcinnes
ms.custom: sttsinar
---

# Azure virtual machine sizes naming conventions

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

This page outlines the naming conventions used for Azure VMs. VMs use these naming conventions to denote varying features and specifications.

## Naming convention explanation

**[Family]** + **[Sub-family*]** + **[# of vCPUs]** + **[Constrained vCPUs*]** + **[Additive Features]** + **[Accelerator Type*]** + **[Version]**

|Value | Explanation|
|---|---|
| Family | Indicates the VM Family Series| 
| *Subfamily | Used for specialized VM differentiations only|
| # of vCPUs| Denotes the number of vCPUs of the VM |
| *Constrained vCPUs| Used for certain VM sizes only. Denotes the number of vCPUs for the [constrained vCPU capable size](./constrained-vcpu.md) |
| Additive Features | Lower case letters denote additive features, such as: <br> a = AMD-based processor <br> b = Block Storage performance <br> d = diskful (that is, a local temp disk is present); this feature is for newer Azure VMs, see [Ddv4 and Ddsv4-series](./ddv4-ddsv4-series.md) <br> i = isolated size <br> l = low memory; a lower amount of memory than the memory intensive size <br> m = memory intensive; the most amount of memory in a particular size <br>p = ARM Cpu <br> t = tiny memory; the smallest amount of memory in a particular size <br> s = Premium Storage capable, including possible use of [Ultra SSD](./disks-types.md#ultra-disks) (Note: some newer sizes without the attribute of s can still support Premium Storage, such as M128, M64, etc.)<br> C = Confidential <br>NP = node packing <br> 
| *Accelerator Type | Denotes the type of hardware accelerator in the specialized/GPU SKUs. Only the new specialized/GPU SKUs launched from Q3 2020 have the hardware accelerator in the name. |
| Version | Denotes the version of the VM Family Series |

## Example breakdown

**[Family]** + **[Subfamily*]** + **[# of vCPUs]** + **[Additive Features]** + **[Accelerator Type*]** + **[Version]**

### Example 1: M416ms_v2

|Value | Explanation|
|---|---|
| Family | M | 
| # of vCPUs | 416 |
| Additive Features | m = memory intensive <br> s = Premium Storage capable |
| Version | v2 |

### Example 2: NV16as_v4

|Value | Explanation|
|---|---|
| Family | N | 
| Subfamily | V |
| # of vCPUs | 16 |
| Additive Features | a = AMD-based processor <br> s = Premium Storage capable |
| Version | v4 |

### Example 3: NC4as_T4_v3

|Value | Explanation|
|---|---|
| Family | N | 
| Subfamily | C |
| # of vCPUs | 4 |
| Additive Features | a = AMD-based processor <br> s = Premium Storage capable |
| Accelerator Type | T4 |
| Version | v3 |

### Example 4: M8-2ms_v2 (Constrained vCPU)

|Value | Explanation|
|---|---|
| Family | M | 
| # of vCPUs | 8 |
| # of constrained (actual) vCPUs | 2 |
| Additive Features | m = memory intensive <br> s = Premium Storage capable |
| Version | v2 |

## Next steps

Learn more about available [VM Sizes](./sizes.md) in Azure.
