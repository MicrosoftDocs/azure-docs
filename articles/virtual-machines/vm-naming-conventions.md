---
title: Azure VM sizes naming conventions
description: Explains the naming conventions used for Azure VM sizes
ms.service: virtual-machines
subservice: sizes
author: mimckitt
ms.topic: conceptual
ms.date: 7/22/2020
ms.author: mimckitt
ms.custom: sttsinar
---

# Azure virtual machine sizes naming conventions

This page outlines the naming conventions used for Azure VMs. VMs use these naming conventions to denote varying features and specifications.

## Naming convention explanation

**[Family]** + **[Sub-family]** + **[# of vCPUs]** + **[additive features]** + **[version]**

|Value | Explanation|
|---|---|
| Standard, Basic, or Experimental | "Standard" is the default value assigned for all GA VM sizes | 
| Family | Indicates the VM Family Series| 
| Sub-family | Used for specialized VM differentiations|
| # of vCPUs| Denotes the number of vCPUs of the VM |
| Additive Features | One or more lower case letters denote additive features, such as: <br> a = AMD-based processor <br> d = disk (local temp disk is present); this is for newer Azure VMs, see [Ddv4 and Ddsv4-series](./ddv4-ddsv4-series.md) <br> h = hibernation capable <br> i = isolated <br> l = low memory <br> m = memory intensive <br> t = tiny memory <br> r = RDMA <br> s = Premium Storage capable, including possible use of [Ultra SSD](https://docs.microsoft.com/azure/virtual-machines/windows/disks-types#ultra-disk) (Note: some newer sizes without the attribute of s can still support Premium Storage e.g. M128, M64, etc.)<br> |
| Version | Denotes the version of the VM Family Series |

## Example breakdown

**[Family]** + **[Sub-family]** + **[# of vCPUs]** + **[additive features]** + **[version]**

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
| Sub-family | V |
| # of vCPUs | 16 |
| Additive Features | a = AMD-based processor <br> s = Premium Storage capable |
| Version | v4 |

## Next steps

Learn more about available [VM Sizes](https://docs.microsoft.com/azure/virtual-machines/windows/sizes) in Azure. 
