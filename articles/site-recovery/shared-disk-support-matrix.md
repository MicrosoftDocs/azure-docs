---
title: Support matrix for shared disks in Azure VM disaster recovery
ms.reviewer: v-gajeronika
description: This article summarizes the scenarios that shared disk in Azure Site Recovery supports for each workload type.
ms.topic: article
ms.date: 09/11/2026
ms.service: azure-site-recovery
author: Jeronika-MS
ms.author: v-gajeronika
ms.custom: engagement-fy23, references_regions, linux-related-content
# Customer intent: As a cloud architect, I want to understand the support matrix for shared disks in Azure Site Recovery, so that I can effectively plan and implement disaster recovery strategies for my virtual machine workloads.
---

# Support matrix for Azure Site Recovery shared disks 

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
| Shared disk type | Standard SSD, Premium SSD, Premium SSD v2 and Ultra disks |
| Disk partitioning type | Basic |
| Maximum cluster nodes | Four |
| Recovery points | Crash-consistent only |
| Protected disk topology | The same shared-disk set must be attached to every protected node |

## Unsupported scenarios

Following are the unsupported scenarios for shared disk in Azure Site Recovery:

- Active-Active clusters
- Linux and Pacemaker clusters
- Protecting multiple clusters as a group
- Protecting cluster + non-clustered virtual machines in a group
- Recovery plans
- Application-consistent recovery points
- Adding a shared disk to an already protected cluster. Disable and re-enable protection for the complete cluster configuration.
- Non-clustered distributed appliances without using WSFC
- Configuring replication for Azure virtual machines that are attached to different shared disks within a single cluster.
  To protect a cluster in Azure Site Recovery, you must attach the same set of shared disks to all the virtual machines you're protecting in that cluster.

## Disaster recovery support 

The following table lists the disaster recovery support for shared disk in Azure Site Recovery:

| Disaster recovery support | Source disk redundancy | Site Recovery behavior | Target disk redundancy |
| --- | --- | --- | --- |
| Zonal disaster recovery | ZRS | Not supported | Not applicable |
| Zonal disaster recovery | LRS | Supported | LRS |
| Regional disaster recovery | ZRS | Supported | ZRS |
| Regional disaster recovery | LRS | Supported | LRS, or ZRS for Standard SSD and Premium SSD v1 when available |

Premium SSD v2 and Ultra Disk support LRS only.

## Next steps

Learn about [setting up disaster recovery for Azure virtual machines using shared disk](./tutorial-shared-disk.md).
