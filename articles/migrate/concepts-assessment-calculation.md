---
title: Assessment calculations in Azure Migrate | Microsoft Docs
description: Provides an overview of assessment calculations in the Azure Migrate service.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 06/02/2017
ms.author: raynew
---

# Assessment calculations

[Azure Migrate](migrate-overview.md) assesses on-premises workloads for migration to Azure. This article provides information about how assessments are calculated.


## Overview

An Azure Migrate assessment has three stages. Assessment starts with a suitability analysis, followed by sizing, and lastly, a monthly cost estimation. A machine only moves along to a later stage if it passes the previous one. For example, if a machine fails the Azure suitability check, it’s marked as unsuitable for Azure, and sizing and costing won't be calculated. 


## Azure suitability analysis

Not all machines are suitable for running on cloud as cloud has its own limitations and requirements. Azure Migrate assesses each on-premises machine for migration suitability to Azure and categorizes the machines into one of the following categories:
- **Ready for Azure** - The machine can be migrated as-is to Azure without any changes. It will boot in Azure with full Azure support.
- **Conditionally ready for Azure** - The machine may boot in Azure, but may not have full Azure support. For example, a machine with an older version of Windows Server OS is not supported in Azure. You need to be careful before migrating these machines to Azure and follow the remediation guidance suggested in the assessment to fix the readiness issues before you migrate.
- **Not ready for Azure** - The machine will not boot in Azure. For example, if an on-premises machine has a disk of size more than 4TB attached to it, it cannot be hosted on Azure. You need to follow the remediaion guidance suggested in the assessment to fix the readiness issue before migrating to Azure. Right-sizing and cost estimation is not done for machines that are marked as not ready for Azure.
- **Readiness unknown** - Azure Migrate could not find the readiness of the machine due to insufficient data available in vCenter Server. 
 
Following the is the list of checks done by Azure Migrate to identify the Azure readiness of an on-premises machine.

### Machine properties
Azure Migrate reviews the properties of the on-premises machine to identify if the machine can run on Azure.  Below is the list of properties that are considered:
 
**Property** | **Details** | **Azure readiness status**
--- | --- | ---
**Boot type** | Azure supports VMs with boot type as BIOS, and not UEFI. | Conditionally ready for Azure if boot type is UEFI. 
**Cores** | The number of cores in the machines must be equal to or less than the maximum number of cores (32) supported for an Azure VM.<br/><br/> If performance history is available, Azure Migrate considers the utilized cores for comparison. If a comfort factor is specified in the assessment settings, the number of utilized cores is multiplied by the comfort factor.<br/><br/> If there's no performance history, Azure Migrate uses the allocated cores, without applying the comfort factor. | Not ready if number of cores is greater than 32. 
**Memory** | The machine memory size must be equal to or less than the maximum memory (448 GB) allowed for an Azure VM. <br/><br/> If performance history is available, Azure Migrate considers the utilized memory for comparison. If a comfort factor is specified, the utilized memory is multiplied by the comfort factor.<br/><br/> If there's no history the allocated memory is used, without applying the comfort factor.<br/><br/> | Not ready if memory size is greater than 448 GB.
**Storage disk** | Allocated size of a disk must be 4 TB (4096 GB) or less.<br/><br/> The number of disks attached to the machine must be 65 or less, including the OS disk. | Not ready if any disk has size greater than 4 TB or if there are more than 65 disks attached to the machine. 
**Networking** | A machine must have 32 or less NICs attached to it. | Not ready if the machine has more than 32 NICs

### Guest operating system 
Along with VM properties, Azure Migrate also looks at the guest OS of the on-premises VM to identify if the VM can run on Azure.

> [!NOTE]
> Azure Migrate considers the OS specified for the VM in the vCenter Server to do the below analysis. Since the discovery done by Azure Migrate is appliance-based, it does not have a way to find out if the actual OS running inside the VM is same as the one specified in vCenter Server.

The following logic is used by Azure Migrate to identify the Azure readiness of the VM.

**Operating System** | **Details** | **Azure readiness status**
--- | --- | ---
Windows Server 2016 & all SPs | Azure provides full support. | Ready for Azure
Windows Server 2012 R2 & all SPs | Azure provides full support. | Ready for Azure
Windows Server 2012 & all SPs | Azure provides full support. | Ready for Azure
Windows Server 2008 R2 with all SPs** | Azure provides full support.| Ready for Azure
Windows Server 2003-2008 R2 | These operating systems have passed their end of support date and need a [Custom Support Agreement (CSA)](https://aka.ms/WSosstatement) for support in Azure. | Conditionally ready for Azure, consider upgrading the OS before migrating to Azure.
Windows 2000, 98, 95, NT, 3.1, MS-DOS | These operating systems have passed their end of support date, the machine may boot in Azure, but no OS support is provided by Azure. | Conditionally ready for Azure, it is strongly recommended to upgrade the OS before migrating to Azure.
Windows Client 7, 8 and 10 | Azure provides support with Visual Studio subscription only. | Conditionally ready for Azure
Windows Vista, XP Professional | These operating systems have passed their end of support date, the machine may boot in Azure, but no OS support is provided by Azure. | Conditionally ready for Azure, it is strongly recommended to upgrade the OS before migrating to Azure.
Linux | Azure endorses these [Linux operating systems](../virtual-machines/linux/endorsed-distros.md). Other Linux operating systems may boot in Azure, but it is recommended to upgrade the OS to an endorsed version before migrating to Azure. | Ready for Azure if the version is endorsed, Conditionally ready if the version is not endorsed.
Other operating systems<br/><br/> e.g. Oracle Solaris, Apple Mac OS etc, FreeBSD, etc. | Azure does not endorse these operating systems. The machine may boot in Azure, but no OS support is provided by Azure. | Conditionally ready for Azure, it is recommended to install a supported OS before migrating to Azure.  
OS specified as *Other* in vCenter Server | Azure Migrate cannot identify the OS in this case. | Unknown readiness. Ensure that the OS running inside the VM is supported in Azure. 
32-bit operating systems | The machine may boot in Azure, but Azure may not provide full support. | Conditionally ready for Azure, consider upgrading the OS of the machine from 32-bit OS to 64-bit OS before migrating to Azure.

## Sizing

After a machine is marked as ready for Azure, Azure Migrate sizes the VM and its disks for Azure. If the sizing criterion specified in the assessment properties is to do performance-based sizing, Azure Migrate considers the performance history of the machine to identify a VM size in Azure. This method is helpful in scenarios where you have over-allocated the on-premises VM but the utilization is very low and you would like to right-size the VMs in Azure to save cost.

> [!NOTE]
> Azure Migrate collects performance history of on-premises VMs from vCenter Server. To ensure accurate right-sizing, ensure that the statistics settings in vCenter Server is set to level 3 and wait for at least a day before kicking off discovery of the on-premises VMs. If the statistics settings in vCenter Server is below level 3, performance data for disk and network will not be collected. 

If you do not want to consider the performance history and want to take the VM as-is to Azure, you can specify the sizing criterion as *as on-premises* and Azure Migrate will then size the VMs based on the on-premises configuration without considering the utilization data.

### Performance-based sizing

For performance-based sizing, Azure Migrate starts with the disks attached to the VM, followed by network adapters and then maps an Azure VM based on the compute requirements of the on-premises VM. 
 
- **Disks**: Azure Migrate tries to map every disk attached to the machine to a disk in Azure. 
    
    > [!NOTE]
    > Azure Migrate supports only managed disks for assessment.
    
      - To get the effective disk I/O per second (IOPS) and throughput (MBps), Azure Migrate multiplies the disk IOPS and the throughput with the comfort factor. Based on the effective IOPS and throughput values, Azure Migrate identifies if the disk should be mapped to a standard or premium disk in Azure.
      - If Azure Migrate can't find a disk with the required IOPS & throughput, it marks the machine as unsuitable for Azure. [Learn more](../azure-subscription-service-limits.md#storage-limits) about Azure limits per disk and VM.
      - If it finds a set of suitable disks, Azure Migrate selects the ones that support the storage redundancy method, and the location specified in the assessment settings.
      - If there are multiple eligible disks, it selects the one with the lowest cost.
      - If performance data for disks in unavailable, all the disks are mapped to standard disks in Azure.

- **Network adapters**: Azure Migrate tries to find an Azure VM that can support the number of network adapaters attached to the on-premises machine and the performance required by these network adapters.
      - To get the effective network performance of the on-premises VM, Azure Migrate aggregates the data transmitted per second (MBps) out of the machine (network out) across all network adapters, and applies the comfort factor to the aggregated number. This number is used to find an Azure VM that can support the required network performance.
      - Along with network performance, it also considers if the Azure VM can support the required the number of network adapters.
      - If no network performance data is available, only the network adapters count is considered for VM sizing.

- **VM Size**: After storage and network requirements are calculated, Azure Migrate considers compute requirements:
      - Azure Migrate looks at the utilized cores and memory, and applies the comfort factor to get the effective cores and memory. Based on that number, it tries to find a suitable VM size in Azure.
      - If no suitable size is found, the machine is marked as unsuitable for Azure.
      - If a suitable size is found, Azure Migrate applies the storage and networking calculations. It then applies location and pricing tier settings, for the final VM size recommendation.
      - If there are multiple eligible Azure VM sizes, the one with the lowest cost is recommended.

### As on-premises sizing
In case of as on-premises sizing, Azure Migrate does not consider the performance history of the VMs and allocates VMs and disks based on the size allocated on-premises.
- **Storage**: For each disk, a standard disk in Azure is allocated with the same size as the on-premises disk.
- **Network**: For each network adapater, a network adapter in Azure is allocated.
- **Compute**: Azure Migrate looks at the number of cores and memory size of the on-premises VM and allocates an Azure VM with the same configuration. If there are multiple eligible Azure VM sizes, the one with the lowest cost is recommended.
 
### Confidence rating

Each assessment in Azure Migrate is associated with a confidence rating that ranges from 1 star to 5 stars (1 star being lowest and 5 stars being highest). The confidence rating is based on the availability of data points needed to compute an assessment and will help you estimate the reliability of the size recommendations provided by Azure Migrate. 

Confidence rating is useful when you are doing *performance-based sizing* as not all data points may be available. For *as on-premises sizing*, the confidence rating is always 5-star as Azure Migrate will have all the data it needs to size the VM. 

For performance-based sizing, Azure Migrate needs the utilization data for CPU and memory. For each disk attached to the VM, it needs the read/write IOPS and throughput to do performance-based sizing. Similarly for each network adapter attached to the VM, Azure Migrate needs the network in/out to do performance-based sizing. If any of the above utilization numbers are not available in vCenter Server, the size recommendation done by Azure Migrate may not be reliable. Depending on the percentage of data points available, the confidence rating for the assessment is provided:

   **Availability of data points** | **Confidence rating**
   --- | ---
   0%-20% | 1 Star
   21%-40% | 2 Stars
   41%-60% | 3 Stars
   61%-80% | 4 Stars
   81%-100% | 5 Stars

An assessment may not have all the data points available due to one of the following reasons:
- The statistics settings in vCenter Server is not set to level 3 and the assessment has performance-based sizing as the sizing criterion. If the statistics settings in vCenter Server is lower than level 3, performance data for disk and network is not collected from vCenter Server. In this case, the recommendation provided by Azure Migrate for disk and network will be only based on what was allocated on-premises. For storage, Azure Migrate will only recommend standard disks as there is no way to identify if the disk has high IOPS/throughput and needs premium disks.
- The statistics settings in vCenter Server was set to level 3 only for a short duration before kicking off the discovery. For example, you might have changed the statistics settings level to 3 yesterday and kicked off the discovery using the collector appliance tday (after 24 hours). In this case, if you are creating an assessment for 1 day, you will have all the data points. But if you are changing the performance duaration in the assessment properties to 1 month, the confidence rating will go down as the disk and network performance data for the last one month is not available. If you would like to consider the performance data of last one month, it is recommended that you keep the vCenter Server statistics settings to level 3 for one month before you kick off the discovery. 
- Few VMs were shut down during the period for which the assessment is calculated. If any VMs were powered off for some duration, vCenter Server will not have the performance data for that period. 
- Few VMs were created in between the period for which the assessment is calculated. For example, if you are creating an assessment for the performance history of last one month, but few VMs were created in the environment only a week ago. In such cases, the performance history of the new VMs will not be there for the entire duration.

> [!NOTE]
> If the confidence rating of any assessment is below 3 Stars, we recommend you to change the vCenter Server statistics settings level to 3, wait for the duration that you want to consider for assessment (1 day/1 week/1 month) and then do discovery and assessment. If the above cannot be done, performance-based sizing may not be reliable and it is recommended to switch to as on-premises sizing in the assessment properties.

## Monthly cost estimation

After sizing recommendations are complete, Azure Migrate calculates post-migration compute and storage costs.

- **Compute cost**: Using the recommended Azure VM size, Azure Migrate uses the Billing API to calculate
the monthly cost for the VM. The calculation takes the operating system, software assurance, location, and currency settings into account. It aggregates the cost across all machines, to calculate the total monthly compute cost.
- **Storage cost**: The monthly storage cost for a machine is calculated by aggregating the monthly cost of
all disks attached to the machine. Azure Migrate calculates the total monthly storage costs by aggregating the storage costs of all machines. Currently, the calculation doesn't take offers specified in the assessment settings into account.

Costs are displayed in the currency specified in the assessment settings. 


## Next steps

[Create an assessment for on-premises VMware VMs](tutorial-assessment-vmware.md)
