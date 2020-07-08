---
title: Azure VM assessments in Azure Migrate Server Assessment
description: Learn about assessments in Azure Migrate Server Assessment
ms.topic: conceptual
ms.date: 05/27/2020
---

# Azure VM assessments in Azure Migrate: Server Assessment

This article provides an overview of assessments in the [Azure Migrate: Server Assessment](migrate-services-overview.md#azure-migrate-server-assessment-tool) tool. The tool can assess on-premises VMware virtual machines, Hyper-V VMs, and physical servers for migration to Azure.

## What's an assessment?

An assessment with the Server Assessment tool measures the readiness and estimates the effect of migrating on-premises servers to Azure.

> [!NOTE]
> In Azure Government, review the [supported target](migrate-support-matrix.md#supported-geographies-azure-government) assessment locations. Note that VM size recommendations in assessments will use the VM series specifically for Government Cloud regions. [Learn more](https://azure.microsoft.com/global-infrastructure/services/?regions=usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-iowa,usgov-texas,usgov-virginia&products=virtual-machines) about VM types.

## Types of assessments

There are two types of assessments you can create using Azure Migrate: Server Assessment.

**Assessment Type** | **Details**
--- | --- 
**Azure VM** | Assessments to migrate your on-premises servers to Azure virtual machines. <br/><br/> You can assess your on-premises [VMware VMs](how-to-set-up-appliance-vmware.md), [Hyper-V VMs](how-to-set-up-appliance-hyper-v.md), and [physical servers](how-to-set-up-appliance-physical.md) for migration to Azure using this assessment type.
**Azure VMware Solution (AVS)** | Assessments to migrate your on-premises servers to [Azure VMware Solution (AVS)](https://docs.microsoft.com/azure/azure-vmware/introduction). <br/><br/> You can assess your on-premises [VMware VMs](how-to-set-up-appliance-vmware.md) for migration to Azure VMware Solution (AVS) using this assessment type.[Learn more](concepts-azure-vmware-solution-assessment-calculation.md)

Assessments you create with Server Assessment are a point-in-time snapshot of data. An Azure VM assessment in Server Assessment provides two sizing criteria options:

**Assessment type** | **Details** | **Data**
--- | --- | ---
**Performance-based** | Assessments that make recommendations based on collected performance data | The VM size recommendation is based on CPU and RAM-utilization data.<br/><br/> The disk-type recommendation is based on the input/output operations per second (IOPS) and throughput of the on-premises disks. Disk types are Azure Standard HDD, Azure Standard SSD, and Azure Premium disks.
**As-is on-premises** | Assessments that don't use performance data to make recommendations | The VM size recommendation is based on the on-premises VM size.<br/><br> The recommended disk type is based on the selected storage type for the assessment.

## How do I run an assessment?

There are a couple of ways to run an assessment.

- Assess machines by using server metadata collected by a lightweight Azure Migrate appliance. The appliance discovers on-premises machines. It then sends machine metadata and performance data to Azure Migrate.
- Assess machines by using server metadata that's imported in a comma-separated values (CSV) format.

## How do I assess with the appliance?

If you're deploying an Azure Migrate appliance to discover on-premises servers, do the following steps:

1. Set up Azure and your on-premises environment to work with Server Assessment.
1. For your first assessment, create an Azure project and add the Server Assessment tool to it.
1. Deploy a lightweight Azure Migrate appliance. The appliance continuously discovers on-premises machines and sends machine metadata and performance data to Azure Migrate. Deploy the appliance as a VM or a physical machine. You don't need to install anything on machines that you want to assess.

After the appliance begins machine discovery, you can gather machines you want to assess into a group and run an assessment for the group with assessment type **Azure VM**.

Follow our tutorials for [VMware](tutorial-prepare-vmware.md), [Hyper-V](tutorial-prepare-hyper-v.md), or [physical servers](tutorial-prepare-physical.md) to try out these steps.

## How do I assess with imported data?

If you're assessing servers by using a CSV file, you don't need an appliance. Instead, do the following steps:

1. Set up Azure to work with Server Assessment.
1. For your first assessment, create an Azure project and add the Server Assessment tool to it.
1. Download a CSV template and add server data to it.
1. Import the template into Server Assessment.
1. Discover servers added with the import, gather them into a group, and run an assessment for the group with assessment type **Azure VM**.

## What data does the appliance collect?

If you're using the Azure Migrate appliance for assessment, learn about the metadata and performance data that's collected for [VMware](migrate-appliance.md#collected-data---vmware) and [Hyper-V](migrate-appliance.md#collected-data---hyper-v).

## How does the appliance calculate performance data?

If you use the appliance for discovery, it collects performance data for compute settings with these steps:

1. The appliance collects a real-time sample point.

    - **VMware VMs**: A sample point is collected every 20 seconds.
    - **Hyper-V VMs**: A sample point is collected every 30 seconds.
    - **Physical servers**: A sample point is collected every five minutes.

1. The appliance combines the sample points to create a single data point every 10 minutes. To create the data point, the appliance selects the peak values from all samples. It then sends the data point to Azure.
1. Server Assessment stores all the 10-minute data points for the last month.
1. When you create an assessment, Server Assessment identifies the appropriate data point to use for rightsizing. Identification is based on the percentile values for *performance history* and *percentile utilization*.

    - For example, if the performance history is one week and the percentile utilization is the 95th percentile, Server Assessment sorts the 10-minute sample points for the last week. It sorts them in ascending order and picks the 95th percentile value for rightsizing.
    - The 95th percentile value makes sure you ignore any outliers, which might be included if you picked the 99th percentile.
    - If you want to pick the peak usage for the period and don't want to miss any outliers, select the 99th percentile for percentile utilization.

1. This value is multiplied by the comfort factor to get the effective performance utilization data for these metrics that the appliance collects:

    - CPU utilization
    - RAM utilization
    - Disk IOPS (read and write)
    - Disk throughput (read and write)
    - Network throughput (in and out)

## How are Azure VM assessments calculated?

Server Assessment uses the on-premises machines' metadata and performance data to calculate assessments. If you deploy the Azure Migrate appliance, assessment uses the data the appliance collects. But if you run an assessment imported using a CSV file, you provide the metadata for the calculation.

Calculations occur in these three stages:

1. **Calculate Azure readiness**: Assess whether machines are suitable for migration to Azure.
1. **Calculate sizing recommendations**: Estimate compute, storage, and network sizing.
1. **Calculate monthly costs**: Calculate the estimated monthly compute and storage costs for running the machines in Azure after migration.

Calculations are in the preceding order. A machine server moves to a later stage only if it passes the previous one. For example, if a server fails the Azure readiness stage, it's marked as unsuitable for Azure. Sizing and cost calculations aren't done for that server.

## What's in an Azure VM assessment?

Here's what's included in an Azure VM assessment in Server Assessment:

**Property** | **Details**
--- | ---
**Target location** | The location to which you want to migrate. Server Assessment currently supports these target Azure regions:<br/><br/> Australia East, Australia Southeast, Brazil South, Canada Central, Canada East, Central India, Central US, China East, China North, East Asia, East US, East US 2, Germany Central, Germany Northeast, Japan East, Japan West, Korea Central, Korea South, North Central US, North Europe, South Central US, Southeast Asia, South India, UK South, UK West, US Gov Arizona, US Gov Texas, US Gov Virginia, West Central US, West Europe, West India, West US, and West US 2.
**Target storage disk (as-is sizing)** | The type of disk to use for storage in Azure. <br/><br/> Specify the target storage disk as Premium-managed, Standard SSD-managed, or Standard HDD-managed.
**Target storage disk (performance-based sizing)** | Specifies the type of target storage disk as automatic, Premium-managed, Standard HDD-managed, or Standard SSD-managed.<br/><br/> **Automatic**: The disk recommendation is based on the performance data of the disks, meaning the IOPS and throughput.<br/><br/>**Premium or Standard**:  The assessment recommends a disk SKU within the storage type selected.<br/><br/> If you want a single-instance VM service-level agreement (SLA) of 99.9%, consider using Premium-managed disks. This use ensures that all disks in the assessment are recommended as Premium-managed disks.<br/><br/> Azure Migrate supports only managed disks for migration assessment.
**Azure Reserved VM Instances** | Specifies [reserved instances](https://azure.microsoft.com/pricing/reserved-vm-instances/) so that cost estimations in the assessment take them into account.<br/><br/> When you select 'Reserved instances', the 'Discount (%)' and 'VM uptime' properties are not applicable.<br/><br/> Azure Migrate currently supports Azure Reserved VM Instances only for pay-as-you-go offers.
**Sizing criteria** | Used to rightsize the Azure VM.<br/><br/> Use as-is sizing or performance-based sizing.
**Performance history** | Used with performance-based sizing. Performance history specifies the duration used when performance data is evaluated.
**Percentile utilization** | Used with performance-based sizing. Percentile utilization specifies the percentile value of the performance sample used for rightsizing.
**VM series** | The Azure VM series that you want to consider for rightsizing. For example, if you don't have a production environment that needs A-series VMs in Azure, you can exclude A-series from the list of series.
**Comfort factor** | The buffer used during assessment. It's applied to the CPU, RAM, disk, and network utilization data for VMs. It accounts for issues like seasonal usage, short performance history, and likely increases in future usage.<br/><br/> For example, a 10-core VM with 20% utilization normally results in a two-core VM. With a comfort factor of 2.0, the result is a four-core VM instead.
**Offer** | The [Azure offer](https://azure.microsoft.com/support/legal/offer-details/) in which you're enrolled. Server Assessment estimates the cost for that offer.
**Currency** | The billing currency for your account.
**Discount (%)** | Any subscription-specific discounts you receive on top of the Azure offer. The default setting is 0%.
**VM uptime** | The duration in days per month and hours per day for Azure VMs that won't run continuously. Cost estimates are based on that duration.<br/><br/> The default values are 31 days per month and 24 hours per day.
**Azure Hybrid Benefit** | Specifies whether you have software assurance and are eligible for [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-use-benefit/). If the setting has the default value "Yes," Azure prices for operating systems other than Windows are considered for Windows VMs.
**EA subscription** | Specifies that an Enterprise Agreement (EA) subscription is used for cost estimation. Takes into account the discount applicable to the subscription. <br/><br/> Leave the settings for reserved instances, discount (%) and VM uptime properties with their default settings.


[Review the best practices](best-practices-assessment.md) for creating an assessment with Server Assessment.

## Calculate readiness

Not all machines are suitable to run in Azure. An Azure VM Assessment assesses all on-premises machines and assigns them a readiness category.

- **Ready for Azure**: The machine can be migrated as-is to Azure without any changes. It will start in Azure with full Azure support.
- **Conditionally ready for Azure**: The machine might start in Azure but might not have full Azure support. For example, Azure doesn't support a machine that's running an old version of Windows Server. You must be careful before you migrate these machines to Azure. To fix any readiness problems, follow the remediation guidance the assessment suggests.
- **Not ready for Azure**: The machine won't start in Azure. For example, if an on-premises machine's disk stores more than 64 TB, Azure can't host the machine. Follow the remediation guidance to fix the problem before migration.
- **Readiness unknown**: Azure Migrate can't determine the readiness of the machine because of insufficient metadata.

To calculate readiness, Server Assessment reviews the machine properties and operating system settings summarized in the following tables.

### Machine properties

For an Azure VM Assessment, Server Assessment reviews the following properties of an on-premises VM to determine whether it can run on Azure VMs.

Property | Details | Azure readiness status
--- | --- | ---
**Boot type** | Azure supports VMs with a boot type of BIOS, not UEFI. | Conditionally ready if the boot type is UEFI
**Cores** | Each machine must have no more than 128 cores, which is the maximum number an Azure VM supports.<br/><br/> If performance history is available, Azure Migrate considers the utilized cores for comparison. If the assessment settings specify a comfort factor, the number of utilized cores is multiplied by the comfort factor.<br/><br/> If there's no performance history, Azure Migrate uses the allocated cores without applying the comfort factor. | Ready if the number of cores is within the limit
**RAM** | Each machine must have no more than 3,892 GB of RAM, which is the maximum size an Azure M-series Standard_M128m&nbsp;<sup>2</sup> VM supports. [Learn more](https://docs.microsoft.com/azure/virtual-machines/windows/sizes).<br/><br/> If performance history is available, Azure Migrate considers the utilized RAM for comparison. If a comfort factor is specified, the utilized RAM is multiplied by the comfort factor.<br/><br/> If there's no history, the allocated RAM is used without application of a comfort factor.<br/><br/> | Ready if the amount of RAM is within the limit
**Storage disk** | The allocated size of a disk must be no more than 32 TB. Although Azure supports 64-TB disks with Azure Ultra SSD disks, Azure Migrate: Server Assessment currently checks for 32 TB as the disk-size limit because it doesn't support Ultra SSD yet. <br/><br/> The number of disks attached to the machine, including the OS disk, must be 65 or fewer. | Ready if the disk size and number are within the limits
**Networking** | A machine must have no more than 32 network interfaces (NICs) attached to it. | Ready if the number of NICs is within the limit

### Guest operating system

For an Azure VM Assessment, along with reviewing VM properties, Server Assessment looks at the guest operating system of a machine to determine whether it can run on Azure.

> [!NOTE]
> To handle guest analysis for VMware VMs, Server Assessment uses the operating system specified for the VM in vCenter Server. However, vCenter Server doesn't provide the kernel version for Linux VM operating systems. To discover the version, you need to set up [application discovery](https://docs.microsoft.com/azure/migrate/how-to-discover-applications). Then, the appliance discovers version information using the guest credentials you specify when you set up app-discovery.


Server Assessment uses the following logic to identify Azure readiness based on the operating system:

**Operating system** | **Details** | **Azure readiness status**
--- | --- | ---
Windows Server 2016 and all SPs | Azure provides full support. | Ready for Azure.
Windows Server 2012 R2 and all SPs | Azure provides full support. | Ready for Azure.
Windows Server 2012 and all SPs | Azure provides full support. | Ready for Azure.
Windows Server 2008 R2 with all SPs | Azure provides full support.| Ready for Azure.
Windows Server 2008 (32-bit and 64-bit) | Azure provides full support. | Ready for Azure.
Windows Server 2003 and Windows Server 2003 R2 | These operating systems have passed their end-of-support dates and need a [Custom Support Agreement (CSA)](https://aka.ms/WSosstatement) for support in Azure. | Conditionally ready for Azure. Consider upgrading the OS before migrating to Azure.
Windows 2000, Windows 98, Windows 95, Windows NT, Windows 3.1, and MS-DOS | These operating systems have passed their end-of-support dates. The machine might start in Azure, but Azure provides no OS support. | Conditionally ready for Azure. We recommend that you upgrade the OS before migrating to Azure.
Windows 7, Windows 8, and Windows 10 | Azure provides support with a [Visual Studio subscription only.](https://docs.microsoft.com/azure/virtual-machines/windows/client-images) | Conditionally ready for Azure.
Windows 10 Pro | Azure provides support with [Multitenant Hosting Rights.](https://docs.microsoft.com/azure/virtual-machines/windows/windows-desktop-multitenant-hosting-deployment) | Conditionally ready for Azure.
Windows Vista and Windows XP Professional | These operating systems have passed their end-of-support dates. The machine might start in Azure, but Azure provides no OS support. | Conditionally ready for Azure. We recommend that you upgrade the OS before migrating to Azure.
Linux | See the [Linux operating systems](../virtual-machines/linux/endorsed-distros.md) that Azure endorses. Other Linux operating systems might start in Azure. But we recommend that you upgrade the OS to an endorsed version before you migrate to Azure. | Ready for Azure if the version is endorsed.<br/><br/>Conditionally ready if the version isn't endorsed.
Other operating systems like Oracle Solaris, Apple macOS, and FreeBSD | Azure doesn't endorse these operating systems. The machine might start in Azure, but Azure provides no OS support. | Conditionally ready for Azure. We recommend that you install a supported OS before migrating to Azure.  
OS specified as **Other** in vCenter Server | Azure Migrate can't identify the OS in this case. | Unknown readiness. Ensure that Azure supports the OS running inside the VM.
32-bit operating systems | The machine might start in Azure, but Azure might not provide full support. | Conditionally ready for Azure. Consider upgrading to a 64-bit OS before migrating to Azure.

## Calculating sizing

After the machine is marked as ready for Azure, Server Assessment makes sizing recommendations in the Azure VM assessment. These recommendations identify the Azure VM and disk SKU. Sizing calculations depend on whether you're using as-is on-premises sizing or performance-based sizing.

### Calculate sizing (as-is on-premises)

 If you use as-is on-premises sizing, Server Assessment doesn't consider the performance history of the VMs and disks in the Azure VM assessment.

- **Compute sizing**: Server Assessment allocates an Azure VM SKU based on the size allocated on-premises.
- **Storage and disk sizing**: Server Assessment looks at the storage type specified in assessment properties and recommends the appropriate disk type. Possible storage types are Standard HDD, Standard SSD, and Premium. The default storage type is Premium.
- **Network sizing**: Server Assessment considers the network adapter on the on-premises machine.

### Calculate sizing (performance-based)

If you use performance-based sizing in an Azure VM assessment, Server Assessment makes sizing recommendations as follows:

- Server Assessment considers the performance history of the machine to identify the VM size and disk type in Azure.
- If you import servers by using a CSV file, the values you specify are used. This method is especially helpful if you've overallocated the on-premises machine, utilization is low, and you want to rightsize the Azure VM to save costs.
- If you don't want to use the performance data, reset the sizing criteria to as-is on-premises, as described in the previous section.

#### Calculate storage sizing

For storage sizing in an Azure VM assessment, Azure Migrate tries to map each disk that is attached to the machine to an Azure disk. Sizing works as follows:

1. Server Assessment adds the read and write IOPS of a disk to get the total IOPS required. Similarly, it adds the read and write throughput values to get the total throughput of each disk. In the case of import-based assessments, you have the option to provide the total IOPS, total throughput and total no. of disks in the imported file without specifying individual disk settings. If you do this, individual disk sizing is skipped and the supplied data is used directly to compute sizing, and select an appropriate VM SKU.

1. If you've specified the storage type as automatic, the selected type is based on the effective IOPS and throughput values. Server Assessment determines whether to map the disk to a Standard HDD, Standard SSD, or Premium disk in Azure. If the storage type is set to one of those disk types, Server Assessment tries to find a disk SKU within the storage type selected.
1. Disks are selected as follows:
    - If Server Assessment can't find a disk with the required IOPS and throughput, it marks the machine as unsuitable for Azure.
    - If Server Assessment finds a set of suitable disks, it selects the disks that support the location specified in the assessment settings.
    - If there are multiple eligible disks, Server Assessment selects the disk with the lowest cost.
    - If performance data for any disk is unavailable, the configuration disk size is used to find a Standard SSD disk in Azure.

#### Calculate network sizing

For an Azure VM assessment, Server Assessment tries to find an Azure VM that supports the number and required performance of network adapters attached to the on-premises machine.

- To get the effective network performance of the on-premises VM, Server Assessment aggregates the data transmission rate out of the machine (network out) across all network adapters. It then applies the comfort factor. It uses the resulting value to find an Azure VM that can support the required network performance.
- Along with network performance, Server Assessment also considers whether the Azure VM can support the required number of network adapters.
- If network performance data is unavailable, Server Assessment considers only the network adapter count for VM sizing.

#### Calculate compute sizing

After it calculates storage and network requirements, Server Assessment considers CPU and RAM requirements to find a suitable VM size in Azure.

- Azure Migrate looks at the effective utilized cores and RAM to find a suitable Azure VM size.
- If no suitable size is found, the machine is marked as unsuitable for Azure.
- If a suitable size is found, Azure Migrate applies the storage and networking calculations. It then applies location and pricing-tier settings for the final VM size recommendation.
- If there are multiple eligible Azure VM sizes, the one with the lowest cost is recommended.

## Confidence ratings (performance-based)

Each performance-based Azure VM assessment in Azure Migrate is associated with a confidence rating. The rating ranges from one (lowest) to five (highest) stars. The confidence rating helps you estimate the reliability of the size recommendations Azure Migrate provides.

- The confidence rating is assigned to an assessment. The rating is based on the availability of data points that are needed to compute the assessment.
- For performance-based sizing, Server Assessment needs:
    - The utilization data for CPU and VM RAM.
    - The disk IOPS and throughput data for every disk attached to the VM.
    - The network I/O to handle performance-based sizing for each network adapter attached to a VM.

If any of these utilization numbers isn't available, the size recommendations might be unreliable.

> [!NOTE]
> Confidence ratings aren't assigned for servers assessed using an imported CSV file. Ratings also aren't applicable for as-is on-premises assessment.

### Ratings

This table shows the assessment confidence ratings, which depend on the percentage of available data points:

   **Availability of data points** | **Confidence rating**
   --- | ---
   0-20% | 1 star
   21-40% | 2 stars
   41-60% | 3 stars
   61-80% | 4 stars
   81-100% | 5 stars

### Low confidence ratings

Here are a few reasons why an assessment could get a low confidence rating:

- You didn't profile your environment for the duration for which you're creating the assessment. For example, if you create the assessment with performance duration set to one day, you must wait at least a day after you start discovery for all the data points to get collected.
- Some VMs were shut down during the time for which the assessment was calculated. If any VMs are turned off for some duration, Server Assessment can't collect the performance data for that period.
- Some VMs were created during the time for which the assessment was calculated. For example, assume you created an assessment for the performance history of the last month, but some VMs were created only a week ago. The performance history of the new VMs won't exist for the complete duration.

> [!NOTE]
> If the confidence rating of any assessment is less than five stars, we recommend that you wait at least a day for the appliance to profile the environment and then recalculate the assessment. Otherwise, performance-based sizing might be unreliable. In that case, we recommend that you switch the assessment to on-premises sizing.

## Calculate monthly costs

After sizing recommendations are complete, an Azure VM assessment in Azure Migrate calculates compute and storage costs for after migration.

- **Compute cost**: Azure Migrate uses the recommended Azure VM size and the Azure Billing API to calculate the monthly cost for the VM.

    The calculation takes into account the:
    - Operating system
    - Software assurance
    - Reserved instances
    - VM uptime
    - Location
    - Currency settings

    Server Assessment aggregates the cost across all machines to calculate the total monthly compute cost.

- **Storage cost**: The monthly storage cost for a machine is calculated by aggregating the monthly cost of all disks that are attached to the machine.

    Server Assessment calculates the total monthly storage costs by aggregating the storage costs of all machines. Currently, the calculation doesn't consider offers specified in the assessment settings.

Costs are displayed in the currency specified in the assessment settings.

## Next steps

[Review](best-practices-assessment.md) best practices for creating assessments. 

- Learn about running assessments for [VMware VMs](tutorial-prepare-vmware.md), [Hyper-V VMs](tutorial-prepare-hyper-v.md), and [physical servers](tutorial-prepare-physical.md).
- Learn about assessing servers [imported with a CSV file](tutorial-assess-import.md).
- Learn about setting up [dependency visualization](concepts-dependency-visualization.md).
