---
title: Support matrix for shared disks in Azure VM disaster recovery (preview).
description: Summarizes support for Azure VMs disaster recovery using shared disk.
ms.topic: article
ms.date: 04/03/2024
ms.service: site-recovery
author: ankitaduttaMSFT
ms.author: ankitadutta
ms.custom: engagement-fy23, references_regions, linux-related-content
---

# Support matrix for Azure Site Recovery shared disks (preview)

This article summarizes the scenarios that shared disk in Azure Site Recovery supports for each workload type.


## Supported scenarios

The following table lists the supported scenarios for shared disk in Azure Site Recovery:

| Scenarios | Supported workloads  |
| --- | --- |
| Azure to Azure disaster recovery | Supported for Regional/Zonal disaster recovery - Azure to Azure |
| Platform | Windows virtual machines |
| Server SKU | Windows 2016 and later |
| Clustering configuration | Active-Passive |
| Clustering solution | Windows Server Failover Clustering (WSFC) |
| Shared disk type | Standard and Premium SSD |
| Disk partitioning type | Basic |


## Unsupported scenarios

Following are the unsupported scenarios for shared disk in Azure Site Recovery:

- Active-Active clusters
- Protecting multiple clusters as a group
- Protecting cluster + non-clustered virtual machines in a group
- Non-clustered distributed appliances without using WSFC



## Disaster recovery support 

The following table lists the disaster recovery support for shared disk in Azure Site Recovery:

| Disaster recovery support | Primary Disk Type  | Site Recovery behavior | Target disk type |
| --- | --- | --- | --- |
| Zonal disaster recovery | ZRS | Not supported |  |
| Zonal disaster recovery | LRS | Supported | Target must be LRS |
| Regional disaster recovery | ZRS | Supported | Target must be ZRS |
| Regional disaster recovery | LRS | Supported | Target must be LRS |
| Regional disaster recovery | LRS | Supported | ZRS |

## Next steps

Learn about [setting up disaster recovery for Azure virtual machines using shared disk](./tutorial-shared-disk.md).