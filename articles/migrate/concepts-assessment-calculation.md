---
title: Assessment calculations in Azure Migrate | Microsoft Docs
description: Provides an overview of assessment calculations in the Azure Migrate service.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 02/19/2019
ms.author: raynew
---

# Assessment calculations

Azure Migrate Server Assessment assesses on-premises workloads for migration to Azure. This article provides information about how assessments are calculated.


[Azure Migrate](migrate-services-overview.md) provides a central hub to track discovery, assessment, and migration of your on-premises apps and workloads, and private/public cloud instances, to Azure. The hub provides Azure Migrate tools for assessment and migration, as well as third-party independent software vendor (ISV) offerings.

## Overview

An Azure Migrate Server Assessment assessment has three stages. Assessment starts with a suitability analysis, followed by sizing, and lastly, a monthly cost estimation. A machine only moves along to a later stage if it passes the previous one. For example, if a machine fails the Azure suitability check, it’s marked as unsuitable for Azure, and sizing and costing won't be done.


## What's in an assessment?

**Property** | **Details**
--- | ---
**Target location** | The Azure location to which you want to migrate.<br/><br/> Azure Migrate currently supports these target regions: Australia East, Australia Southeast, Brazil South, Canada Central, Canada East, Central India, Central US, China East, China North, East Asia, East US, East US2, Germany Central, Germany Northeast, Japan East, Japan West, Korea Central, Korea South, North Central US, North Europe, South Central US, Southeast Asia, South India, UK South, UK West, US Gov Arizona, US Gov Texas, US Gov Virginia, West Central US, West Europe, West India, West US, and West US2.<br/> By default, the target region is set to West US 2.
**Storage type** | Standard HHD disks/Standard SSD disks/Premium.<br/><br/> When you specify the storage type as automatic in an assessment, the disk recommendation is based on the performance data of the disks (IOPS and throughput).<br/><br/> If you specify the storage type as Premium/Standard, the assessment recommends a disk SKU within the storage type selected.<br/><br/> If you want to achieve a single instance VM SLA of 99.9%, you can set the storage type as Premium-managed disks. Then all disks in the assessment will be recommended as Premium-managed disks. <br/> Azure Migrate only supports managed disks for migration assessment.<br/> 
**Reserved Instances (RI)** | Specify this property if you have reserved instances in Azure. Cost estimations in the assessment will take RI discounts into account. Reserved instances are currently only supported for Pay-As-You-Go offers in Azure Migrate.
**Sizing criterion** | Used to right-size VMs. Sizing can be performance-based, or as-is on-premises, without considering performance history.
**Performance history** | The duration to consider for evaluating VM performance. This property is only applicable when sizing is performance-based.
**Percentile utilization** | The percentile value of the performance sample that is used for right-sizing VMs. This property is only applicable when sizing is performance-based.
**VM series** | The VM series used for size estimations. For example, if you have a production environment that you do not plan to migrate to A-series VMs in Azure, you can exclude A-series from the list or series. Sizing is based on the selected series only.
**Comfort factor** | Azure Migrate Server Assessment considers a buffer (comfort factor) during assessment. This buffer is applied on top of machine utilization data for VMs (CPU, memory, disk, and network). The comfort factor accounts for issues such as seasonal usage, short performance history, and likely increases in future usage.<br/><br/> For example, a 10-core VM with 20% utilization normally results in a 2-core VM. However, with a comfort factor of 2.0x, the result is a 4-core VM instead.
**Offer** | The [Azure offer](https://azure.microsoft.com/support/legal/offer-details/) you're enrolled to. Azure Migrate estimates the cost accordingly.
**Currency** | Billing currency. 
**Discount (%)** | Any subscription-specific discount you receive on top of the Azure offer.<br/> The default setting is 0%.
**VM uptime** | If your VMs are not going to be running 24x7 in Azure, you can specify the duration (number of days per month and number of hours per day) for which they would be running and the cost estimations would be done accordingly.<br/> The default value is 31 days per month and 24 hours per day.
**Azure Hybrid Benefit** | Specifies whether you have software assurance and are eligible for [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-use-benefit/). If set to Yes, non-Windows Azure prices are considered for Windows VMs. 



## Azure suitability analysis

Not all machines are suitable for running in Azure. Azure Migrate Server Assessment assesses each on-premises machine for migration, and categorizes machines into one of the following suitability categories:
- **Ready for Azure** - The machine can be migrated as-is to Azure without any changes. It will boot in Azure with full Azure support.
- **Conditionally ready for Azure** - The machine may boot in Azure, but may not have full Azure support. For example, a machine with an older version of Windows Server OS is not supported in Azure. You need to be careful before migrating these machines to Azure and follow the remediation guidance suggested in the assessment to fix the readiness issues before you migrate.
- **Not ready for Azure** - The machine will not boot in Azure. For example, if an on-premises machine has a disk of size more than 4 TB attached to it, it cannot be hosted on Azure. You need to follow the remediation guidance suggested in the assessment to fix the readiness issue before migrating to Azure. Right-sizing and cost estimation is not done for machines that are marked as not ready for Azure.
- **Readiness unknown** - Azure Migrate could not find the readiness of the machine due to insufficient data available in vCenter Server.



### Machine properties

Azure Migrate reviews the following properties of the on-premises VM to identify whether it can run in Azure.

**Property** | **Details** | **Azure readiness status**
--- | --- | ---
**Boot type** | Azure supports VMs with boot type as BIOS, and not UEFI. | Conditionally ready if boot type is UEFI.
**Cores** | The number of cores in the machines must be equal to or less than the maximum number of cores (128 cores) supported for an Azure VM.<br/><br/> If performance history is available, Azure Migrate considers the utilized cores for comparison. If a comfort factor is specified in the assessment settings, the number of utilized cores is multiplied by the comfort factor.<br/><br/> If there's no performance history, Azure Migrate uses the allocated cores, without applying the comfort factor. | Ready if less than or equal to limits.
**Memory** | The machine memory size must be equal to or less than the maximum memory (3892 GB on Azure M series Standard_M128m&nbsp;<sup>2</sup>) allowed for an Azure VM. [Learn more](https://docs.microsoft.com/azure/virtual-machines/windows/sizes).<br/><br/> If performance history is available, Azure Migrate considers the utilized memory for comparison. If a comfort factor is specified, the utilized memory is multiplied by the comfort factor.<br/><br/> If there's no history the allocated memory is used, without applying the comfort factor.<br/><br/> | Ready if within limits.
**Storage disk** | Allocated size of a disk must be 4 TB (4096 GB) or less.<br/><br/> The number of disks attached to the machine must be 65 or less, including the OS disk. | Ready if within limits.
**Networking** | A machine must have 32 or less NICs attached to it. | Ready if within limits.

### Guest operating system
Along with VM properties, Azure Migrate Server Assessment looks at the guest operating system of the machines, to identify whether it can run in Azure.

> [!NOTE]
> Azure Migrate Server Assessment uses the operating system specified for the VM in vCenter Server for analysis. Azure Migrate Server Assessment is appliance-based for VM discovery, and it can't verify whether the operating system running on the VM is same as the one specified in vCenter Server.

The following logic is used by Azure Migrate Server Assessment, to identify Azure readiness based on the operating system.

**Operating System** | **Details** | **Azure readiness status**
--- | --- | ---
Windows Server 2016 & all SPs | Azure provides full support. | Ready for Azure
Windows Server 2012 R2 & all SPs | Azure provides full support. | Ready for Azure
Windows Server 2012 & all SPs | Azure provides full support. | Ready for Azure
Windows Server 2008 R2 with all SPs | Azure provides full support.| Ready for Azure
Windows Server 2008 (32-bit and 64-bit) | Azure provides full support. | Ready for Azure
Windows Server 2003, 2003 R2 | These operating systems have passed their end of support date and need a [Custom Support Agreement (CSA)](https://aka.ms/WSosstatement) for support in Azure. | Conditionally ready for Azure, consider upgrading the OS before migrating to Azure.
Windows 2000, 98, 95, NT, 3.1, MS-DOS | These operating systems have passed their end of support date, the machine may boot in Azure, but no OS support is provided by Azure. | Conditionally ready for Azure, it is recommended to upgrade the OS before migrating to Azure.
Windows Client 7, 8 and 10 | Azure provides support with [Visual Studio subscription only.](https://docs.microsoft.com/azure/virtual-machines/windows/client-images) | Conditionally ready for Azure
Windows 10 Pro Desktop | Azure provides support with [Multitenant Hosting Rights.](https://docs.microsoft.com/azure/virtual-machines/windows/windows-desktop-multitenant-hosting-deployment) | Conditionally ready for Azure
Windows Vista, XP Professional | These operating systems have passed their end of support date, the machine may boot in Azure, but no OS support is provided by Azure. | Conditionally ready for Azure, it is recommended to upgrade the OS before migrating to Azure.
Linux | Azure endorses these [Linux operating systems](../virtual-machines/linux/endorsed-distros.md). Other Linux operating systems may boot in Azure, but it is recommended to upgrade the OS to an endorsed version before migrating to Azure. | Ready for Azure if the version is endorsed.<br/><br/>Conditionally ready if the version is not endorsed.
Other operating systems<br/><br/> e.g.,  Oracle Solaris, Apple Mac OS etc., FreeBSD, etc. | Azure does not endorse these operating systems. The machine may boot in Azure, but no OS support is provided by Azure. | Conditionally ready for Azure, it is recommended to install a supported OS before migrating to Azure.  
OS specified as **Other** in vCenter Server | Azure Migrate cannot identify the OS in this case. | Unknown readiness. Ensure that the OS running inside the VM is supported in Azure.
32-bit operating systems | The machine may boot in Azure, but Azure may not provide full support. | Conditionally ready for Azure, consider upgrading the OS of the machine from 32-bit OS to 64-bit OS before migrating to Azure.

## Sizing

After a machine is marked as ready for Azure, Azure Migrate sizes the VM and its disks for Azure.

- If the assessment uses performance-based sizing, Azure Migrate considers the performance history of the machine to identify the VM size and disk type in Azure. This method is especially helpful if you've over-allocated the on-premises VM, but the utilization is low, and you want to right-size the VM in Azure to save costs.
- If you're using an as on-premises assessment, Azure Migrate Server Assessment will size the VMs based on the on-premises settings, without considering utilization data. Disk sizing, in this case, is based on the Storage type you specify in the assessment properties (Standard disk or Premium disk).

### Performance-based sizing

For performance-based sizing, Azure Migrate starts with the disks attached to the VM, followed by network adapters, and then maps an Azure VM based on the compute requirements of the on-premises VM.

- **Storage**: Azure Migrate tries to map every disk attached to the machine to a disk in Azure.
    - To get the effective disk I/O per second (IOPS) and throughput (MBps), Azure Migrate multiplies the disk IOPS and the throughput with the comfort factor. Based on the effective IOPS and throughput values, Azure Migrate identifies if the disk should be mapped to a standard or premium disk in Azure.
    - If Azure Migrate can't find a disk with the required IOPS & throughput, it marks the machine as unsuitable for Azure. [Learn more](../azure-subscription-service-limits.md#storage-limits) about Azure limits per disk and VM.
    - If it finds a set of suitable disks, Azure Migrate selects the ones that support the storage redundancy method, and the location specified in the assessment settings.
    - If there are multiple eligible disks, it selects the one with the lowest cost.
    - If performance data for disks is unavailable, all the disks are mapped to standard disks in Azure.

- **Network**: Azure Migrate tries to find an Azure VM that can support the number of network adapters attached to the on-premises machine and the performance required by these network adapters.
    - To get the effective network performance of the on-premises VM, Azure Migrate aggregates the data transmitted per second (MBps) out of the machine (network out), across all network adapters, and applies the comfort factor. This number is used to find an Azure VM that can support the required network performance.
    - Along with network performance, it also considers if the Azure VM can support the required the number of network adapters.
    - If no network performance data is available, only the network adapters count is considered for VM sizing.

- **Compute**: After storage and network requirements are calculated, Azure Migrate considers CPU and memory requirements to find a suitable VM size in Azure.
    - Azure Migrate looks at the utilized cores and memory, and applies the comfort factor to get the effective cores and memory. Based on that number, it tries to find a suitable VM size in Azure.
    - If no suitable size is found, the machine is marked as unsuitable for Azure.
    - If a suitable size is found, Azure Migrate applies the storage and networking calculations. It then applies location and pricing tier settings, for the final VM size recommendation.
    - If there are multiple eligible Azure VM sizes, the one with the lowest cost is recommended.

### As on-premises sizing

If you use as on-premises sizing, Server Assessment allocates a VM SKU in Azure based on the size on-premises. Similarly for disk sizing, it looks at the Storage type specified in assessment properties (Standard/Premium) and recommends the disk type accordingly. The default storage type is Premium disks.

## Confidence ratings
Each performance-based assessment in Azure Migrate is associated with a confidence rating that ranges from one (lowest) to five starts (highest).
- The confidence rating is assigned to an assessment based on the availability of data points needed to compute the assessment.
- The confidence rating of an assessment helps you estimate the reliability of the size recommendations provided by Azure Migrate.
- Confidence rating is not applicable for as on-premises assessments.
- For performance-based sizing, Azure Migrate Server Assessment needs:
    - The utilization data for CPU, and VM memory.
    - Additionally, for every disk attached to the VM, it needs the disk IOPS and throughput data.
    - Similarly for each network adapter attached to a VM, the confidence rating needs the network I/O to do performance-based sizing.
    - If any of the above utilization numbers are not available in vCenter Server, the size recommendation might not be reliable. 

Depending on the percentage of data points available, the confidence rating for the assessment is provided as below:

   **Availability of data points** | **Confidence rating**
   --- | ---
   0%-20% | 1 Star
   21%-40% | 2 Star
   41%-60% | 3 Star
   61%-80% | 4 Star
   81%-100% | 5 Star

### Low confidence ratings

A few of the reasons why an assessment could get a low confidence rating:

- You didn't profile your environment for the duration for which you are creating the assessment. For example, if you create the assessment with performance duration set to 1 day, you need to wait for at least a day after you start discovery for all the data points to get collected.
- Some VMs were shut down during the period for which the assessment is calculated. If any VMs were powered off for some duration, Azure Migrate Server Assessment can't collect the performance data for that period.
- Some VMs were created in between the period for which the assessment is calculated. For example, if you create an assessment for the performance history of last one month, but some VMs were created in the environment only a week ago, the performance history of the new VMs won't be there for the entire duration.

  > [!NOTE]
  > If the confidence rating of any assessment is below five stars, we recommend that you wait at least a day for the appliance to profile the environment, and then recalculate the assessment. If you don't, performance-based sizing might not be reliable, and we and recommended that you switch the assessment to use as on-premises sizing.
  
## Monthly cost estimation

After sizing recommendations are complete, Azure Migrate calculates compute and storage costs for after migration.

- **Compute cost**: Using the recommended Azure VM size, Azure Migrate uses the Billing API to calculate
the monthly cost for the VM.
    - The calculation takes the operating system, software assurance, reserved instances, VM uptime, location, and currency settings into account.
    - It aggregates the cost across all machines, to calculate the total monthly compute cost.
- **Storage cost**: The monthly storage cost for a machine is calculated by aggregating the monthly cost of
all disks attached to the machine
    - Azure Migrate Server Assessment calculates the total monthly storage costs by aggregating the storage costs of all machines.
    - Currently, the calculation doesn't take offers specified in the assessment settings into account.

Costs are displayed in the currency specified in the assessment settings.


## Next steps

Create an assessment for [VMware VMs](tutorial-assess-vmware.md) or [Hyper-V VMs](tutorial-assess-hyper-v.md).
