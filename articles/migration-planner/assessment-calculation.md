---
title: Assessment calculations in Azure Migration Planner | Microsoft Docs
description: Provides an overview of assessment calculations in the Azure Migration Planner service.
services: migration-planner
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: 39a63769-31eb-49f9-9089-4d3e4e88a412
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 09/05/2017
ms.author: raynew

---
# Assessment calculations

[Azure Migration Planner](migration-planner-overview.md) assesses on-premises workloads for migration to Azure. This article provides information of how assessments are calculated.

Post any comments or questions at the bottom of this article.

## Overview

When you run an assessment with Migration Planner, it performs an Azure suitability analysis, performance-based sizing estimations, and monthly cost estimations.



## Azure suitability analysis

VMs that you migrate to Azure must meet Azure requirements and limitations. For example, if an on-premises VM disk is more than 1024 GB, it can't be hosted on Azure. Here's what the Migration Planner checks. If a machine complies with all these checks, it's marked as suitable for migration

**Check** | **Details**
--- | ---
**Storage** | Allocated size of a disk must be 1024 GB or less. This includes the OS disk.<br/><br/> The number of disks attached to the machine must be 65 or less.
**Networking** | The number of NICs attached to the machine must be 32 or less.
**Compute: Disk** | The disk boot type must be BIOS, and not UEFI.
**Compute: Cores** | The number of cores in the machines must be equal to (or less than) the maximum number of cores supported for an Azure VM.<br/><br/> If performance history is available, Migration Planner considers the utilized cores for comparison. If there's no performance history available, Migration Planner uses the allocated cores.<br/><br/> If a comfort factor is specific in the assessment settings, the number of utilized cores is multipied with the comfort factor.
**Compute: Memory** | The machine memory size must be equal to (or less than) the maximum memory allowed for an Azure VM. <br/><br/> If performance history is available, Migration Planner considers the utilized memory for comparison. If there's no history the allocated memory is used.<br/><br/> If a comfort factor is specific in the assessment settings, the utilized memory is multiplied with the comfort factor.
**Compute - OS** | The machine operating system must be supported by Azure.


### Azure limits

**Area** | **Limit**
--- | ---
**VM size** | [Windows](../virtual-machines/windows/sizes.md) and [Linux](../virtual-machines/linux/sizes.md) VM sizes.
**Boot type** | BIOS  only for guest operating systems. UEFI isn't supported.
**Cores** | Maximum cores for an Azure VM is 32.
**Memory** | Maximum memory supported by an Azure VM is 448 GB.
**NICS** | An Azure VM can have a maximum of 32 network adapters.
**Storage** | [Maximum storage limits](../azure-subscription-service-limits.md#storage-limits) for an Azure VM.<br/><br/> Learn about [premium](../storage/common/storage-premium-storage.md#scalability-and-performance-targets) and [standard](../storage/common/storage-standard-storage.md#scalability-and-performance-targets) storage disk limits.
**Operating systems** | [Supported operating systems](../security-center/security-center-os-coverage.md) for Windows and Linux VMs.



## Performance-based sizing

After a machine is marked as suitable for Azure, Migration Planner maps it to a VM size in Azure, using the following criteria:

1. **Storage check**: Migration Planner tries to map every disk attached to the machine to a disk in Azure:
    - Only managed disks are currently supported.
    - Migration Planner looks at the I/O per second (IOPS) throughput ( in MBps) of each disk attached to the machine, and multiplies it with the comfort factor.
    - If Migration Planner can't find a disk with the required IOPS & throughput, it marks the machine as unsuitable for Azure.
    - From the suitable set of disks, Migration Planner selects the ones that support the storage redundancy method and location, specified in the assessment settings. If there are multiple eligible disks, Migration Planner selects the one with the lowest cost.
2. **Network check**: Migration Planner aggregates the data transmitted per second (MBps) from the machine (network out),
across all the network adapters attached to it:
    - Migration Planner applies the comfort factor to the aggregated number, and uses the result to find an
Azure VM that can support it.
    - When finding the VM, Migration Planner also checks that it can support the required number of network adapters.
    - Note that Migration Planner takes the network settings from the VM, and assumes it to be network outside the datacenter.
    - If no network utilization data is available, only the network adapter count is considered for VM sizing.
3. **Compute check**: After storage and network requirements are calculated, Migration Planner considers compute
requirements:
    - If the performance data is available for the VM, Migration Planner looks at the utilized cores and memory, and applies the comfort factor. Based on that number, it tries to find a suitable VM size in Azure.
    - If no suitable size is found, the machine is marked as unsuitable for Azure.
    - If a suitable size is found, Migration Planner applies the storage and networking requirements it calculated. It then applies location and pricing tier settings, for the final VM size recommendation.


## Monthly cost estimation

After sizing recommendations are complete, Migration Planner calculates compute, storage, and networking costs that will be incurred after migration.

- **Compute costs**: For each machine and the recommended size, Migration Planner uses the Billing API to calculate
the monthly cost. The calculation takes the operating system, software assurance, location, and currency settings into account, and aggregates the cost across all machines, to come up with the total monthly compute cost.
- **Storage**: The monthly storage cost for a machine is calculated by aggregating the monthly cost of
all the disks attached to the machine. Migration Planner then aggregates the storage cost across all machines, to calculate
total monthly storage cost. Currently, the calculation does not take the offer specified in the assessment settings into account.
- **Networking**: The monthly networking cost for a machine is calculated by aggregating the
monthly cost of all the network adapters attached to the machine. Migration Planner considers the data transferred from network adapters as going out of the datacenter, and is calculated per adapter. The cost of all machines is aggregated to give the total monthly networking cost

Costs are displayed in the currency specified in the assessment settings. Currently only US dollars are supported.


## Next steps

Learn about [assessment settings](migration-planner-overview.md#assessment-customization)
