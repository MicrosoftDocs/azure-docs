---
title: Assessment calculations in Azure Migrate | Microsoft Docs
description: Provides an overview of assessment calculations in the Azure Migrate service.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 10/15/2019
ms.author: hamusa
---

# Assessment calculations in Azure Migrate

[Azure Migrate](migrate-services-overview.md) provides a central hub to track discovery, assessment, and migration of your on-premises apps and workloads. It also tracks your private and public cloud instances to Azure. The hub offers Azure Migrate tools for assessment and migration, as well as third-party independent software vendor (ISV) offerings.

Server Assessment is a tool in Azure Migrate that assesses on-premises servers for migration to Azure. This article provides information about how assessments are calculated.

## What's in an assessment?

**Property** | **Details**
--- | ---
**Target location** | Specifies the Azure location to which you want to migrate.<br/><br/>Server Assessment currently supports these target regions: Australia East, Australia Southeast, Brazil South, Canada Central, Canada East, Central India, Central US, China East, China North, East Asia, East US, East US2, Germany Central, Germany Northeast, Japan East, Japan West, Korea Central, Korea South, North Central US, North Europe, South Central US, Southeast Asia, South India, UK South, UK West, US Gov Arizona, US Gov Texas, US Gov Virginia, West Central US, West Europe, West India, West US, and West US2.
**Storage type** | Specifies the type of disks you want to use for storage in Azure. <br/><br/> For on-premises sizing, you can specify the type of target storage disk as Premium-managed, Standard SSD-managed, or Standard HDD-managed. For performance-based sizing, you can specify the type of target storage disk as Automatic, Premium-managed, Standard HDD-managed, or Standard SSD-managed. When you specify the storage type as Automatic, the disk recommendation is based on the performance data of the disks: the input/output operations per second (IOPS) and throughput. <br/><br/>If you specify the storage type as Premium or Standard, the assessment will recommend a disk SKU within the storage type selected. If you want to achieve a single instance VM SLA of 99.9%, you might want to specify the storage type as Premium-managed disks. This ensures that all disks in the assessment are recommended as Premium-managed disks. Note that Azure Migrate only supports managed disks for migration assessment.
**Reserved Instances (RIs)** | This property helps you specify [Reserved Instances](https://azure.microsoft.com/pricing/reserved-vm-instances/) in Azure. Cost estimations in the assessment then take RI discounts into account. RIs are currently supported only for Pay-As-You-Go offers in Azure Migrate.
**Sizing criteria** | Sets the criteria to be used to *right-size* VMs for Azure. You can opt for *performance-based* sizing or size the VMs *as on-premises* without considering the performance history.
**Performance history** | Sets the duration to consider in evaluating the performance data of machines. This property is applicable only when the sizing criteria is *performance-based*.
**Percentile utilization** | Specifies the percentile value of the performance sample set to be considered for right-sizing. This property is applicable only when the sizing is performance-based.
**VM series** | Allows you to specify the VM series that you want to consider for right-sizing. For example, if you have a production environment that you don't plan to migrate to A-series VMs in Azure, you can exclude A-series from the list or series, and right-sizing is done only in the selected series.
**Comfort factor** | Azure Migrate Server Assessment considers a buffer (comfort factor) during assessment. This buffer is applied on top of machine utilization data for VMs (CPU, memory, disk, and network). The comfort factor accounts for issues such as seasonal usage, short performance history, and likely increases in future usage.<br/><br/> For example, a 10-core VM with 20% utilization normally results in a 2-core VM. However, with a comfort factor of 2.0x, the result is a 4-core VM instead.
**Offer** | Displays the [Azure offer](https://azure.microsoft.com/support/legal/offer-details/) you're enrolled in. Azure Migrate estimates the cost accordingly.
**Currency** | Shows the billing currency for your account.
**Discount (%)** | Lists any subscription-specific discount you receive on top of the Azure offer. The default setting is 0%.
**VM uptime** | If your VMs won't be running 24 hours a day, 7 days a week in Azure, you can specify the duration (number of days per month and number of hours per day) for which they will be running, and the cost estimates are handled accordingly. The default value is 31 days per month and 24 hours per day.
**Azure Hybrid Benefit** | Specifies whether you have software assurance and are eligible for [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-use-benefit/). If set to Yes, non-Windows Azure prices are considered for Windows VMs. The default setting is Yes.

## How are assessments calculated?

An assessment in Azure Migrate Server Assessment is calculated by using the metadata collected about the on-premises servers. If the discovery source is an import using a .CSV file, the assessment is calculated using the metadata provided by the user about the servers. The assessment calculation is handled in three stages. For each server, assessment calculation starts with an Azure suitability analysis, followed by sizing, and lastly, a monthly cost estimation. A server moves along to a later stage only if it passes the previous one. For example, if a server fails the Azure suitability check, it’s marked as unsuitable for Azure, and sizing and costing is not done for that server.

## Azure suitability analysis

Not all machines are suitable to run in Azure. Server Assessment assesses each on-premises machine for its suitability for Azure migration. It also assigns each assessed machine to one of the following suitability categories:
- **Ready for Azure**: The machine can be migrated as-is to Azure without any changes. It will start in Azure with full Azure support.
- **Conditionally ready for Azure**: The machine might start in Azure but might not have full Azure support. For example, a machine that's running an older version of Windows Server isn't supported in Azure. You must be careful before you migrate these machines to Azure and follow the remediation guidance suggested in the assessment to fix the readiness issues.
- **Not ready for Azure**: The machine will not start in Azure. For example, if an on-premises machine has a disk of more than 64 terabytes (TB) attached to it, it can't be hosted on Azure. You must follow the remediation guidance suggested in the assessment to fix the readiness issue before you migrate the machine to Azure. Right-sizing and cost estimation is not done for machines that are marked as not ready for Azure.
- **Readiness unknown**: Azure Migrate couldn't determine the readiness of the machine because of insufficient metadata collected from the on-premises environment.

Server Assessment reviews the machine properties and guest operating system to determine the Azure readiness of the on-premises machine.

### Machine properties

Server Assessment reviews the following properties of the on-premises VM to determine whether it can run on Azure.

**Property** | **Details** | **Azure readiness status**
--- | --- | ---
**Boot type** | Azure supports VMs with a boot type of BIOS, not UEFI. | Conditionally ready if the boot type is UEFI.
**Cores** | The number of cores in the machines must be equal to or less than the maximum number of cores (128) supported for an Azure VM.<br/><br/> If performance history is available, Azure Migrate considers the utilized cores for comparison. If a comfort factor is specified in the assessment settings, the number of utilized cores is multiplied by the comfort factor.<br/><br/> If there's no performance history, Azure Migrate uses the allocated cores without applying the comfort factor. | Ready if less than or equal to limits.
**Memory** | The machine memory size must be equal to or less than the maximum memory (3892 gigabytes [GB] on Azure M series Standard_M128m&nbsp;<sup>2</sup>) allowed for an Azure VM. [Learn more](https://docs.microsoft.com/azure/virtual-machines/windows/sizes).<br/><br/> If performance history is available, Azure Migrate considers the utilized memory for comparison. If a comfort factor is specified, the utilized memory is multiplied by the comfort factor.<br/><br/> If there's no history, the allocated memory is used without applying the comfort factor.<br/><br/> | Ready if within limits.
**Storage disk** | Allocated size of a disk must be 32 TB or less. Although Azure supports 64 TB disks with Ultra SSD disks, Azure Migrate: Server Assessment currently checks for 32TB as the disk size limits as it does not support Ultra SSD yet. <br/><br/> The number of disks attached to the machine must be 65 or fewer, including the OS disk. | Ready if within limits.
**Networking** | A machine must have 32 or fewer network interfaces (NICs) attached to it. | Ready if within limits.

### Guest operating system
Along with VM properties, Server Assessment looks at the guest operating system of the machines to determine whether it can run on Azure.

> [!NOTE]
> For VMware VMs, Server Assessment uses the operating system specified for the VM in vCenter Server to handle the guest OS analysis. For Linux VMs running on VMware, it currently does not identify the exact kernel version of the guest OS.

The following logic is used by Server Assessment to identify Azure readiness based on the operating system.

**Operating System** | **Details** | **Azure readiness status**
--- | --- | ---
Windows Server 2016 & all SPs | Azure provides full support. | Ready for Azure
Windows Server 2012 R2 & all SPs | Azure provides full support. | Ready for Azure
Windows Server 2012 & all SPs | Azure provides full support. | Ready for Azure
Windows Server 2008 R2 with all SPs | Azure provides full support.| Ready for Azure
Windows Server 2008 (32-bit and 64-bit) | Azure provides full support. | Ready for Azure
Windows Server 2003, 2003 R2 | These operating systems have passed their end-of-support date and need a [Custom Support Agreement (CSA)](https://aka.ms/WSosstatement) for support in Azure. | Conditionally ready for Azure. Consider upgrading the OS before migrating to Azure.
Windows 2000, 98, 95, NT, 3.1, MS-DOS | These operating systems have passed their end-of-support date. The machine might start in Azure, but Azure provides no OS support. | Conditionally ready for Azure. We recommend that you upgrade the OS before migrating to Azure.
Windows Client 7, 8 and 10 | Azure provides support with [Visual Studio subscription only.](https://docs.microsoft.com/azure/virtual-machines/windows/client-images) | Conditionally ready for Azure
Windows 10 Pro Desktop | Azure provides support with [Multitenant Hosting Rights.](https://docs.microsoft.com/azure/virtual-machines/windows/windows-desktop-multitenant-hosting-deployment) | Conditionally ready for Azure
Windows Vista, XP Professional | These operating systems have passed their end-of-support date. The machine might start in Azure, but Azure provides no OS support. | Conditionally ready for Azure. We recommend that you upgrade the OS before migrating to Azure.
Linux | Azure endorses these [Linux operating systems](../virtual-machines/linux/endorsed-distros.md). Other Linux operating systems might start in Azure, but we recommend that you upgrade the OS to an endorsed version before migrating to Azure. | Ready for Azure if the version is endorsed.<br/><br/>Conditionally ready if the version is not endorsed.
Other operating systems<br/><br/> For example,  Oracle Solaris, Apple Mac OS etc., FreeBSD, etc. | Azure doesn't endorse these operating systems. The machine might start in Azure, but Azure provides no OS support. | Conditionally ready for Azure. We recommend that you install a supported OS before migrating to Azure.  
OS specified as **Other** in vCenter Server | Azure Migrate cannot identify the OS in this case. | Unknown readiness. Ensure that the OS running inside the VM is supported in Azure.
32-bit operating systems | The machine might start in Azure, but Azure might not provide full support. | Conditionally ready for Azure. Consider upgrading the OS of the machine from 32-bit OS to 64-bit OS before migrating to Azure.

## Sizing

After a machine is marked as ready for Azure, Server Assessment makes sizing recommendations, which involves identifying the appropriate Azure VM and disk SKU for the on-premises VM. These recommendations vary, depending on the assessment properties specified.

- If the assessment uses *performance-based sizing*, Azure Migrate considers the performance history of the machine to identify the VM size and disk type in Azure. In the case of servers with discovery source as import, the performance utilization values specified by the user are considered. This method is especially helpful if you've over-allocated the on-premises VM, but utilization is low and you want to right-size the VM in Azure to save costs. This method will help you optimize the sizes during migration.
- If you don't want to consider the performance data for VM sizing and want to take the on-premises machines as-is to Azure, you can set the sizing criteria to *as on-premises*. Then, Server Assessment will size the VMs based on the on-premises configuration without considering the utilization data. In this case, disk-sizing activities are based on the storage type you specify in the assessment properties (Standard HDD, Standard SSD, or Premium disks).

### Performance-based sizing

For performance-based sizing, Server Assessment starts with the disks attached to the VM, followed by network adapters. It then maps an Azure VM SKU based on the compute requirements of the on-premises VM. The Azure Migrate appliance profiles the on-premises environment to collect performance data for CPU, memory, disks, and network adapter.

**Performance data collection steps:**

1. For VMware VMs, the Azure Migrate appliance collects a real-time sample point at every 20-second interval. For Hyper-V VMs, the real-time sample point is collected at every 30-second interval. For physical servers, the real-time sample point is collected at every 5-minute interval. 
2. The appliance rolls up the sample points collected every 10 minutes and sends the maximum value for the last 10 minutes to  Server Assessment. 
3. Server Assessment stores all the 10-minute sample points for the last one month. Then, depending on the assessment properties specified for *Performance history* and *Percentile utilization*, it identifies the appropriate data point to use for right-sizing. For example, if the performance history is set to 1 day and the percentile utilization is the 95th percentile, Server Assessment uses the 10-minute sample points for the last one day, sorts them in ascending order, and picks the 95th percentile value for right-sizing. 
4. This value is multiplied by the comfort factor to get the effective performance utilization data for each metric (CPU utilization, memory utilization, disk IOPS (read and write), disk throughput (read and write), and network throughput (in and out) that the appliance collects.

After the effective utilization value is determined, the storage, network, and compute sizing is handled as follows.

> [!NOTE]
> For servers added via import, the performance data provided by the user is used directly for right-sizing.

**Storage sizing**: Azure Migrate tries to map every disk attached to the machine to a disk in Azure.

> [!NOTE]
> Azure Migrate Server Assessment supports only managed disks for assessment.

  - Server Assessment adds the read and write IOPS of a disk to get the total IOPS required. Similarly, it adds the read and write throughput values to get the total throughput of each disk.
  - If you have specified storage type as Automatic, based on the effective IOPS and throughput values, Server Assessment determines whether the disk should be mapped to a standard HDD, standard SSD, or a premium disk in Azure. If the storage type is set to Standard HDD/SSD/Premium, Server Assessment tries to find a disk SKU within the storage type selected (Standard HDD/SSD/Premium disks).
  - If Server Assessment can't find a disk with the required IOPS and throughput, it marks the machine as unsuitable for Azure.
  - If Server Assessment finds a set of suitable disks, it selects the disks that support the location specified in the assessment settings.
  - If there are multiple eligible disks, Server Assessment selects the disk with the lowest cost.
  - If performance data for any disk is unavailable, the configuration data of the disk (disk size) is used to find a standard SSD disk in Azure.

**Network sizing**: Server Assessment tries to find an Azure VM that can support the number of network adapters attached to the on-premises machine and the performance required by these network adapters.
- To get the effective network performance of the on-premises VM, Server Assessment aggregates the data transmitted per second (MBps) out of the machine (network out), across all network adapters, and applies the comfort factor. It uses this number to find an Azure VM that can support the required network performance.
- Along with network performance, Server Assessment also considers whether the Azure VM can support the required the number of network adapters.
- If no network performance data is available, Server Assessment considers only the network adapter count for VM sizing.

> [!NOTE]
> Specifying number of network adapters is currently not supported for imported servers

**Compute sizing**: After it calculates storage and network requirements, Server Assessment considers CPU and memory requirements to find a suitable VM size in Azure.
- Azure Migrate looks at the effective utilized cores and memory to find a suitable VM size in Azure.
- If no suitable size is found, the machine is marked as unsuitable for Azure.
- If a suitable size is found, Azure Migrate applies the storage and networking calculations. It then applies location and pricing tier settings for the final VM size recommendation.
- If there are multiple eligible Azure VM sizes, the one with the lowest cost is recommended.

### As on-premises sizing

If you use *as on-premises sizing*, Server Assessment doesn't consider the performance history of the VMs and disks. Instead, it allocates a VM SKU in Azure based on the size allocated on-premises. Similarly for disk sizing, Server Assessment looks at the storage type specified in assessment properties (Standard HDD/SSD/Premium) and recommends the disk type accordingly. The default storage type is Premium disks.

## Confidence ratings
Each performance-based assessment in Azure Migrate is associated with a confidence rating that ranges from one (lowest) to five stars (highest).
- The confidence rating is assigned to an assessment based on the availability of data points needed to compute the assessment.
- The confidence rating of an assessment helps you estimate the reliability of the size recommendations provided by Azure Migrate.
- Confidence ratings aren't applicable for *as on-premises* assessments.
- For performance-based sizing, Server Assessment needs:
    - The utilization data for CPU and VM memory.
    - The disk IOPS and throughput data for every disk attached to the VM.
    - The network I/O to handle performance-based sizing for each network adapter attached to a VM.

   If any of these utilization numbers are unavailable in vCenter Server, the size recommendation might not be reliable.

Depending on the percentage of data points available, the confidence rating for the assessment goes as follows.

   **Availability of data points** | **Confidence rating**
   --- | ---
   0-20% | 1 star
   21-40% | 2 stars
   41-60% | 3 stars
   61-80% | 4 stars
   81-100% | 5 stars

> [!NOTE]
> Confidence ratings are not assigned to assessments of servers imported using .CSV file into Azure Migrate. 

### Low confidence ratings

Here are a few reasons why an assessment could get a low confidence rating:

- You didn't profile your environment for the duration for which you are creating the assessment. For example, if you create the assessment with performance duration set to one day, you must wait for at least a day after you start discovery for all the data points to get collected.
- Some VMs were shut down during the period for which the assessment was calculated. If any VMs are turned off for some duration, Server Assessment can't collect the performance data for that period.
- Some VMs were created during the period for which the assessment was calculated. For example, if you created an assessment for the performance history of the last month, but some VMs were created in the environment only a week ago, the performance history of the new VMs won't exist for the complete duration.

> [!NOTE]
> If the confidence rating of any assessment is less than five stars, we recommend that you wait at least a day for the appliance to profile the environment, and then recalculate the assessment. If you don't, performance-based sizing might not be reliable. In that case, we recommend that you switch the assessment to on-premises sizing.

## Monthly cost estimation

After sizing recommendations are complete, Azure Migrate calculates compute and storage costs for after migration.

- **Compute cost**: Using the recommended Azure VM size, Azure Migrate uses the Billing API to calculate
the monthly cost for the VM.
    - The calculation takes the operating system, software assurance, reserved instances, VM uptime, location, and currency settings into account.
    - It aggregates the cost across all machines to calculate the total monthly compute cost.
- **Storage cost**: The monthly storage cost for a machine is calculated by aggregating the monthly cost of
all disks attached to the machine, as follows:
    - Server Assessment calculates the total monthly storage costs by aggregating the storage costs of all machines.
    - Currently, the calculation doesn't consider offers specified in the assessment settings.

Costs are displayed in the currency specified in the assessment settings.


## Next steps

Create an assessment for [VMware VMs](tutorial-assess-vmware.md) or [Hyper-V VMs](tutorial-assess-hyper-v.md).
