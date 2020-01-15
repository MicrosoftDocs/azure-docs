---
title: Assessments in Azure Migrate 
description: Learn about assessments in Azure Migrate.
ms.topic: conceptual
ms.date: 01/06/2020
---

# About assessments in Azure Migrate

This article describes how assessments are calculated in [Azure Migrate: Server Assessment](migrate-services-overview.md#azure-migrate-server-assessment-tool). You run assessments on groups of on-premises machines, to figure out whether they're ready for migration to Azure Migrate.

## How do I run an assessment?
You can run an assessment using Azure Migrate: Server Assessment, or another Azure or third-party tool. After creating an Azure Migrate project, you add the tool you need. [Learn more](how-to-add-tool-first-time.md

### Collect compute data

Performance data for compute settings is collected as follows:

1. The [Azure Migrate appliance](migrate-appliance.md) collects a real-time sample point:

    - **VMware VMs**: For VMware VMs, the Azure Migrate appliance collects a real-time sample point at every 20-second interval.
    - **Hyper-V VMs**: For Hyper-V VMs, the real-time sample point is collected at every 30-second interval.
    - **Physical servers**: For physical servers, the real-time sample point is collected at every five-minute interval. 
    
2. The appliance rolls up the sample points (20 seconds, 30 seconds, five minutes) to create a single data point every 10 minutes. To create the single data point, the appliance selects the peak value from all the samples, and then sends it to Azure.
3. Server Assessment stores all the 10-minute sample points for the last month.
4. When you create an assessment, Server Assessment identifies the appropriate data point to use for right-sizing, based on the percentile values for *Performance history* and *Percentile utilization*.

    - For example, if the performance history is set to one week, and the percentile utilization is the 95th percentile, Server Assessment sorts the 10-minute sample points for the last week in ascending order, and picks the 95th percentile value for right-sizing. 
    - The 95th percentile value makes sure that you ignore any outliers, which might be included if you pick the 99th percentile.
    - If you want to pick the peak usage for the period and don't want to miss any outliers, you should select the 99th percentile for percentile utilization.

5. This value is multiplied by the comfort factor to get the effective performance utilization data for each metric (CPU utilization, memory utilization, disk IOPS (read and write), disk throughput (read and write), and network throughput (in and out) that the appliance collects.

To run assessments in Server Assessment, you prepare for assessment on-premises and in Azure, and set up the Azure Migrate appliance to continuously discover on-premises machines. After machines are discovered, you gather them into groups to assess them. For more detailed and high-confidence assessments, you can visualize and map dependencies between machines, to figure out how to migrate them.

- Learn about running assessments for [VMware VMs](tutorial-prepare-vmware.md), [Hyper-V VMs](tutorial-prepare-hyper-v.md), and [physical servers](tutorial-prepare-physical.md).
- Learn about assessing servers [imported with a CSV file](tutorial-assess-import.md).
- Learn about setting up [dependency visualization](concepts-dependency-visualization.md).

## Assessments in Server Assessment 

Assessments you create with Azure Migrate Server Assessment are a point-in-time snapshot of data. The Server Assessment tool provides two types of assessments.

**Assessment type** | **Details** | **Data**
--- | --- | ---
**Performance-based** | Assessments that make recommendations based on collected performance data | VM size recommendation is based on CPU and memory utilization data.<br/><br/> Disk type recommendation (standard HDD/SSD or premium-managed disks) is based on the IOPS and throughput of the on-premises disks.
**As-is on-premises** | Assessments that don't use performance data to make recommendations. | VM size recommendation is based on the on-premises VM size<br/><br> The recommended disk type is based on the selected storage type for the assessment.

## Collecting performance data

Performance data is collected as follows:

1. The [Azure Migrate appliance](migrate-appliance.md) collects a real-time sample point:

    - **VMware VMs**: For VMware VMs, the Azure Migrate appliance collects a real-time sample point at every 20-second interval.
    - **Hyper-V VMs**: For Hyper-V VMs, the real-time sample point is collected at every 30-second interval.
    - **Physical servers**: For physical servers, the real-time sample point is collected at every five-minute interval. 
    
2. The appliance rolls up the sample points (20 seconds, 30 seconds, five minutes) to create a single data point every 10 minutes. To create the single data point, the appliance selects the peak value from all the samples, and then sends it to Azure.
3. Server Assessment stores all the 10-minute sample points for the last month.
4. When you create an assessment, Server Assessment identifies the appropriate data point to use for right-sizing, based on the percentile values for *Performance history* and *Percentile utilization*.

    - For example, if the performance history is set to one week, and the percentile utilization is the 95th percentile, Server Assessment sorts the 10-minute sample points for the last week in ascending order, and picks the 95th percentile value for right-sizing. 
    - The 95th percentile value makes sure that you ignore any outliers, which might be included if you pick the 99th percentile.
    - If you want to pick the peak usage for the period and don't want to miss any outliers, you should select the 99th percentile for percentile utilization.

5. This value is multiplied by the comfort factor to get the effective performance utilization data for each metric (CPU utilization, memory utilization, disk IOPS (read and write), disk throughput (read and write), and network throughput (in and out) that the appliance collects.
## What's in an assessment?

Here's what included in an assessment in Azure Migrate: Server Assessment.

**Property** | **Details**
--- | ---
**Target location** | The location to which you want to migrate.Server Assessment currently supports these target Azure regions:<br/><br/> Australia East, Australia Southeast, Brazil South, Canada Central, Canada East, Central India, Central US, China East, China North, East Asia, East US, East US2, Germany Central, Germany Northeast, Japan East, Japan West, Korea Central, Korea South, North Central US, North Europe, South Central US, Southeast Asia, South India, UK South, UK West, US Gov Arizona, US Gov Texas, US Gov Virginia, West Central US, West Europe, West India, West US, and West US2.
*Target storage disk (as-is sizing)** | The type of disks to use for storage in Azure. <br/><br/> Specify the target storage disk as premium managed, standard SSD managed, or standard HDD managed.
**Target storage disk (performance based sizing)** | Specify the type of target storage disk as automatic, premium managed, standard HDD managed, or standard SSD managed.<br/><br/> **Automatic**: The disk recommendation is based on the performance data of the disks (the input/output operations per second (IOPS) and throughput).<br/><br/>**Premium/standard**:  The assessment recommends a disk SKU within the storage type selected.<br/><br/> If you want to achieve a single instance VM SLA of 99.9%, considering using premium managed disks. This ensures that all disks in the assessment are recommended as premium-managed disks.<br/><br/> Azure Migrate only supports managed disks for migration assessment.
**Reserved Instances (RIs)** | Specify [Reserved Instances](https://azure.microsoft.com/pricing/reserved-vm-instances/) in Azure, so that cost estimations in the assessment take RI discounts into account.<br/><br/> RIs are currently supported only for Pay-As-You-Go offers in Azure Migrate.
**Sizing criteria** | Used to right-size the VM in Azure.<br/><br/> Use as-is sizing, or performance-based sizing.
**Performance history** | Used with performance-based sizing. Specify the duration used when evaluating performance data.
**Percentile utilization** | Used  with performance-based sizing. Specifies the percentile value of the performance sample to be used for right-sizing. 
**VM series** | Specify the Azure VM series that you want to consider for right-sizing. For example, if you don't have a production environment that needs A-series VMs in Azure, you can exclude A-series from the list or series.
**Comfort factor** | Buffer used during assessment. Applied on top of machine utilization data for VMs (CPU, memory, disk, and network). It accounts for issues such as seasonal usage, short performance history, and likely increases in future usage.<br/><br/> For example, a 10-core VM with 20% utilization normally results in a two-core VM. With a comfort factor of 2.0x, the result is a four-core VM instead.
**Offer** | Displays the [Azure offer](https://azure.microsoft.com/support/legal/offer-details/) in which you're enrolled. Server Assessment estimates the cost accordingly.
**Currency** | Billing currency for your account.
**Discount (%)** | Lists any subscription-specific discounts you receive on top of the Azure offer. The default setting is 0%.
**VM uptime** | If Azure VMs won't run 24 hours a day, 7 days a week, you can specify the duration (days per month and hours per day)  they will run. Cost estimates are handled accordingly.<br/><br/> The default value is 31 days per month and 24 hours per day.
**Azure Hybrid Benefit** | Specifies whether you have software assurance and are eligible for [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-use-benefit/). If set to Yes (the default setting), non-Windows Azure prices are considered for Windows VMs.

[Review the best practices](best-practices-assessment.md) for creating assessment with Server Assessment.

## How are assessments calculated? 

Assessments in Azure Migrate: Server Assessment are calculated using the metadata collected about the on-premises machines. If you run an assessment on machines imported using a .CSV file, you provide the metadata for the calculation. Calculations occur in three stages:

1. **Calculate Azure readiness**: Assess whether machines are suitable for migration to Azure.
2. **Calculate sizing recommendations**: Estimate compute, storage, and network sizing. 
2. **Calculate monthly costs**: Calculate the estimated monthly compute and storage costs for running the machines in Azure after migration.

Calculations are in order, and a machine server moves along to a later stage only if it passes the previous one. For example, if a server fails the Azure readiness, it’s marked as unsuitable for Azure, and sizing and costing is not done for that server.



## Calculate readiness

Not all machines are suitable to run in Azure. Server Assessment assesses each on-premises machine, and assigns it a readiness category. 
- **Ready for Azure**: The machine can be migrated as-is to Azure without any changes. It will start in Azure with full Azure support.
- **Conditionally ready for Azure**: The machine might start in Azure, but might not have full Azure support. For example, a machine that's running an older version of Windows Server isn't supported in Azure. You must be careful before you migrate these machines to Azure. Follow the remediation guidance suggested in the assessment to fix the readiness issues.
- **Not ready for Azure**: The machine won't start in Azure. For example, if an on-premises machine disk is more than 64-TBs, it can't be hosted in Azure. Follow the remediation guidance to fix the issue before migration. 
- **Readiness unknown**: Azure Migrate couldn't determine the readiness of a machine, because of insufficient metadata.

To calculate readiness, Server Assessment reviews the machine properties and operating system settings summarized in the following tables. 

### Machine properties

Server Assessment reviews the following properties of the on-premises VM to determine whether it can run on Azure.

**Property** | **Details** | **Azure readiness status**
--- | --- | ---
**Boot type** | Azure supports VMs with a boot type of BIOS, not UEFI. | Conditionally ready if the boot type is UEFI.
**Cores** | The number of cores in the machines must be equal to or less than the maximum number of cores (128) supported for an Azure VM.<br/><br/> If performance history is available, Azure Migrate considers the utilized cores for comparison. If a comfort factor is specified in the assessment settings, the number of utilized cores is multiplied by the comfort factor.<br/><br/> If there's no performance history, Azure Migrate uses the allocated cores without applying the comfort factor. | Ready if less than or equal to limits.
**Memory** | The machine memory size must be equal to or less than the maximum memory (3892 gigabytes [GB] on Azure M series Standard_M128m&nbsp;<sup>2</sup>) allowed for an Azure VM. [Learn more](https://docs.microsoft.com/azure/virtual-machines/windows/sizes).<br/><br/> If performance history is available, Azure Migrate considers the utilized memory for comparison. If a comfort factor is specified, the utilized memory is multiplied by the comfort factor.<br/><br/> If there's no history, the allocated memory is used without applying the comfort factor.<br/><br/> | Ready if within limits.
**Storage disk** | Allocated size of a disk must be 32 TB or less. Although Azure supports 64-TB disks with Ultra SSD disks, Azure Migrate: Server Assessment currently checks for 32 TB as the disk size limits as it does not support Ultra SSD yet. <br/><br/> The number of disks attached to the machine must be 65 or fewer, including the OS disk. | Ready if within limits.
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

## Calculate sizing (as-is on-premises)

After the machine is marked as ready for Azure, Server Assessment makes sizing recommendations to identify the Azure VM and disk SKU. If you use as-is on-premises sizing, Server Assessment doesn't consider the performance history of the VMs and disks.

**Compute sizing**: It allocates an Azure VM SKU based on the size allocated on-premises.
**Storage/disk sizing**: Server Assessment looks at the storage type specified in assessment properties (standard HDD/SSD/premium), and recommends the disk type accordingly. The default storage type is premium disks.
**Network sizing**: Server Assessment considers the network adapter on the on-premises machine.


## Calculate sizing (performance-based)

After a machine is marked as ready for Azure, if you use performance-basing sizing, Server Assessment making sizing recommendations as follows:

- Server Assessment considers the performance history of the machine to identify the VM size and disk type in Azure.
- If servers have been imported using a CSV file, the values you specify are used. This method is especially helpful if you've over-allocated the on-premises machine, utilization is actually low, and you want to right-size the VM in Azure to save costs. 
- If you don't want to use the performance data, reset the sizing criteria to as-is on-premises, as described in the previous section.

### Calculate storage sizing

For storage sizing, Azure Migrate tries to map every disk attached to the machine to a disk in Azure, and works as follows:

1. Server Assessment adds the read and write IOPS of a disk to get the total IOPS required. Similarly, it adds the read and write throughput values to get the total throughput of each disk.
2. If you've specified storage type as Automatic, based on the effective IOPS and throughput values, Server Assessment determines whether the disk should be mapped to a standard HDD, standard SSD, or a premium disk in Azure. If the storage type is set to Standard HDD/SSD/Premium, Server Assessment tries to find a disk SKU within the storage type selected (Standard HDD/SSD/Premium disks).
3. Disks are selected as follows:
    - If Server Assessment can't find a disk with the required IOPS and throughput, it marks the machine as unsuitable for Azure.
    - If Server Assessment finds a set of suitable disks, it selects the disks that support the location specified in the assessment settings.
    - If there are multiple eligible disks, Server Assessment selects the disk with the lowest cost.
    - If performance data for any disk is unavailable, the configuration data of the disk (disk size) is used to find a standard SSD disk in Azure.

### Calculate network sizing

Server Assessment tries to find an Azure VM that can support the number of network adapters attached to the on-premises machine and the performance required by these network adapters.
- To get the effective network performance of the on-premises VM, Server Assessment aggregates the data transmitted per second (MBps) out of the machine (network out), across all network adapters, and applies the comfort factor. It uses this number to find an Azure VM that can support the required network performance.
- Along with network performance, Server Assessment also considers whether the Azure VM can support the required the number of network adapters.
- If no network performance data is available, Server Assessment considers only the network adapter count for VM sizing.


### Calculate compute sizing

After it calculates storage and network requirements, Server Assessment considers CPU and memory requirements to find a suitable VM size in Azure.
- Azure Migrate looks at the effective utilized cores and memory to find a suitable VM size in Azure.
- If no suitable size is found, the machine is marked as unsuitable for Azure.
- If a suitable size is found, Azure Migrate applies the storage and networking calculations. It then applies location and pricing tier settings for the final VM size recommendation.
- If there are multiple eligible Azure VM sizes, the one with the lowest cost is recommended.


### Calculate confidence ratings

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

#### Low confidence ratings

Here are a few reasons why an assessment could get a low confidence rating:

- You didn't profile your environment for the duration for which you are creating the assessment. For example, if you create the assessment with performance duration set to one day, you must wait for at least a day after you start discovery for all the data points to get collected.
- Some VMs were shut down during the period for which the assessment was calculated. If any VMs are turned off for some duration, Server Assessment can't collect the performance data for that period.
- Some VMs were created during the period for which the assessment was calculated. For example, if you created an assessment for the performance history of the last month, but some VMs were created in the environment only a week ago, the performance history of the new VMs won't exist for the complete duration.

> [!NOTE]
> If the confidence rating of any assessment is less than five stars, we recommend that you wait at least a day for the appliance to profile the environment, and then recalculate the assessment. If you don't, performance-based sizing might not be reliable. In that case, we recommend that you switch the assessment to on-premises sizing.

## Calculate monthly costs

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

[Review](best-practices-assessment.md) best practices for creating assessments. 
