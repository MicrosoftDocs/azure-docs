---
title: Azure VM assessments in Azure Migrate 
description: Learn about assessments in Azure Migrate 
author: rashi-ms
ms.author: rajosh
ms.manager: abhemraj
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 08/29/2023
ms.custom: engagement-fy24
---

# Assessment overview (migrate to Azure VMs)

This article provides an overview of assessments in the [Azure Migrate: Discovery and assessment](migrate-services-overview.md#azure-migrate-discovery-and-assessment-tool) tool. The tool can assess on-premises servers in VMware virtual and Hyper-V environment, and physical servers for migration to Azure.

## What's an assessment?

An assessment with the Discovery and assessment tool measures the readiness and estimates the effect of migrating on-premises servers to Azure.

> [!NOTE]
> In Azure Government, review the [supported target](migrate-support-matrix.md#azure-government) assessment locations. Note that VM size recommendations in assessments will use the VM series specifically for Government Cloud regions. [Learn more](https://azure.microsoft.com/global-infrastructure/services/?regions=usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-iowa,usgov-texas,usgov-virginia&products=virtual-machines) about VM types.

## Types of assessments

There are three types of assessments you can create using Azure Migrate: Discovery and assessment.

**Assessment Type** | **Details**
--- | ---
**Azure VM** | Assessments to migrate your on-premises servers to Azure virtual machines. You can assess your on-premises servers in [VMware](how-to-set-up-appliance-vmware.md) and [Hyper-V](how-to-set-up-appliance-hyper-v.md) environment, and [physical servers](how-to-set-up-appliance-physical.md) for migration to Azure VMs using this assessment type.
**Azure SQL** | Assessments to migrate your on-premises SQL servers from your VMware environment to Azure SQL Database or Azure SQL Managed Instance.
**Azure App Service** | Assessments to migrate on-premises web apps from your VMware environment to Azure App Service.
**Azure VMware Solution (AVS)** | Assessments to migrate your on-premises servers to [Azure VMware Solution (AVS)](../azure-vmware/introduction.md). You can assess your on-premises [VMware VMs](how-to-set-up-appliance-vmware.md) for migration to Azure VMware Solution (AVS) using this assessment type. [Learn more](concepts-azure-vmware-solution-assessment-calculation.md)

> [!NOTE]
> If the number of Azure VM or AVS assessments are incorrect on the Discovery and assessment tool, click on the total number of assessments to navigate to all the assessments and recalculate the Azure VM or AVS assessments. The Discovery and assessment tool will then show the correct count for that assessment type. 

Assessments you create with Azure Migrate are a point-in-time snapshot of data. An Azure VM assessment provides two sizing criteria options:

**Assessment type** | **Details** | **Data**
--- | --- | ---
**Performance-based** | Assessments that make recommendations based on collected performance data | The VM size recommendation is based on CPU and RAM-utilization data.<br><br> The disk-type recommendation is based on the input/output operations per second (IOPS) and throughput of the on-premises disks. Disk types are Azure Standard HDD, Azure Standard SSD, Azure Premium disks, and Azure Ultra disks.
**As-is on-premises** | Assessments that don't use performance data to make recommendations | The VM size recommendation is based on the on-premises server size.<br><br> The recommended disk type is based on the selected storage type for the assessment.

## How do I run an assessment?

There are a couple of ways to run an assessment.

- Assess servers by using server metadata collected by a lightweight Azure Migrate appliance. The appliance discovers on-premises servers. It then sends server metadata and performance data to Azure Migrate.
- Assess servers by using server metadata that's imported in a comma-separated values (CSV) format.

## How do I assess with the appliance?

If you're deploying an Azure Migrate appliance to discover on-premises servers, do the following steps:

1. Set up Azure and your on-premises environment to work with Azure Migrate.
1. For your first assessment, create an Azure project and add the Discovery and assessment tool to it.
1. Deploy a lightweight Azure Migrate appliance. The appliance continuously discovers on-premises servers and sends server metadata and performance data to Azure Migrate. Deploy the appliance as a VM or a physical server. You don't need to install anything on servers that you want to assess.

After the appliance begins server discovery, you can gather servers you want to assess into a group and run an assessment for the group with assessment type **Azure VM**.

Follow our tutorials for [VMware](./tutorial-discover-vmware.md), [Hyper-V](./tutorial-discover-hyper-v.md), or [physical servers](./tutorial-discover-physical.md) to try out these steps.

## How do I assess with imported data?

If you're assessing servers by using a CSV file, you don't need an appliance. Instead, do the following steps:

1. Set up Azure to work with Azure Migrate
1. For your first assessment, create an Azure project and add the Discovery and assessment tool to it.
1. Download a CSV template and add server data to it.
1. Import the template into Azure Migrate
1. Discover servers added with the import, gather them into a group, and run an assessment for the group with assessment type **Azure VM**.

## What data does the appliance collect?

If you're using the Azure Migrate appliance for assessment, learn about the metadata and performance data that's collected for [VMware](discovered-metadata.md#collected-metadata-for-vmware-servers) and [Hyper-V](discovered-metadata.md#collected-metadata-for-hyper-v-servers).

## How does the appliance calculate performance data?

If you use the appliance for discovery, it collects performance data for compute settings with these steps:

1. The appliance collects a real-time sample point.

    - **VMware VMs**: A sample point is collected every 20 seconds.
    - **Hyper-V VMs**: A sample point is collected every 30 seconds.
    - **Physical servers**: A sample point is collected every five minutes.

1. The appliance combines the sample points to create a single data point every 10 minutes for VMware and Hyper-V servers, and every 5 minutes for physical servers. To create the data point, the appliance selects the peak values from all samples. It then sends the data point to Azure.
1. The assessment stores all the 10-minute data points for the last month.
1. When you create an assessment, the assessment identifies the appropriate data point to use for rightsizing. Identification is based on the percentile values for *performance history* and *percentile utilization*.

    - For example, if the performance history is one week and the percentile utilization is the 95th percentile, the assessment sorts the 10-minute sample points for the last week. It sorts them in ascending order and picks the 95th percentile value for rightsizing.
    - The 95th percentile value makes sure you ignore any outliers, which might be included if you picked the 99th percentile.
    - If you want to pick the peak usage for the period and don't want to miss any outliers, select the 99th percentile for percentile utilization.

1. This value is multiplied by the comfort factor to get the effective performance utilization data for these metrics that the appliance collects:

    - CPU utilization
    - RAM utilization
    - Disk IOPS (read and write)
    - Disk throughput (read and write)
    - Network throughput (in and out)

## How are Azure VM assessments calculated?

The assessment uses the on-premises servers' metadata and performance data to calculate assessments. If you deploy the Azure Migrate appliance, assessment uses the data the appliance collects. But if you run an assessment imported using a CSV file, you provide the metadata for the calculation.

Calculations occur in these three stages:

1. **Calculate Azure readiness**: Assess whether servers are suitable for migration to Azure.
1. **Calculate sizing recommendations**: Estimate compute, storage, and network sizing.
1. **Calculate monthly costs**: Calculate the estimated monthly compute, storage, and security costs for running the servers in Azure after migration.

Calculations are in the preceding order. A server moves to a later stage only if it passes the previous one. For example, if a server fails the Azure readiness stage, it's marked as unsuitable for Azure. Sizing and cost calculations aren't done for that server.

## What's in an Azure VM assessment?

Here's what's included in an Azure VM assessment:

**Setting** | **Details**
--- | ---
**Target location** | The location to which you want to migrate. The assessment currently supports these target Azure regions:<br><br> Australia Central, Australia Central 2, Australia East, Australia Southeast, Brazil South, Canada Central, Canada East, Central India, Central US, China East, China East 2,  China North, China North 2, East Asia, East US, East US 2, France Central, France South, Germany North, Germany West Central, Japan East, Japan West, Korea Central, Korea South, North Central US, North Europe, Norway East, Norway West, South Africa North, South Africa West, South Central US, Southeast Asia, South India, Switzerland North, Switzerland West, UAE Central, UAE North, UK South, UK West, West Central US, West Europe, West India, West US, West US 2, JioIndiaCentral, JioIndiaWest, US Gov Arizona, US Gov Iowa, US Gov Texas, US Gov Virginia.
**Target storage disk (as-is sizing)** | The type of disk to use for storage in Azure. <br><br> Specify the target storage disk as Premium-managed, Standard SSD-managed, Standard HDD-managed, or Ultra disk.
**Target storage disk (performance-based sizing)** | Specifies the type of target storage disk as Premium-managed, Standard HDD-managed, Standard SSD-managed, or Ultra disk.<br><br> **Premium or Standard or Ultra disk**:  The assessment recommends a disk SKU within the storage type selected.<br><br> If you want a single-instance VM service-level agreement (SLA) of 99.9%, consider using Premium-managed disks. This use ensures that all disks in the assessment are recommended as Premium-managed disks.<br><br> If you're looking to run data-intensive workloads that need high throughput, high IOPS, and consistent low latency disk storage, consider using Ultra disks.<br><br> Azure Migrate supports only managed disks for migration assessment.
**Savings options (compute)** | Specify the savings option that you want the assessment to consider to help optimize your Azure compute cost. <br><br> [Azure reservations](../cost-management-billing/reservations/save-compute-costs-reservations.md) (1 year or 3 year reserved) are a good option for the most consistently running resources.<br><br> [Azure Savings Plan](../cost-management-billing/savings-plan/savings-plan-compute-overview.md) (1 year or 3 year savings plan) provide additional flexibility and automated cost optimization. Ideally post migration, you could use Azure reservation and savings plan at the same time (reservation will be consumed first), but in the Azure Migrate assessments, you can only see cost estimates of 1 savings option at a time. <br><br> When you select 'None', the Azure compute cost is based on the Pay as you go rate or based on actual usage.<br><br> You need to select pay-as-you-go in offer/licensing program to be able to use Reserved Instances or Azure Savings Plan. When you select any savings option other than 'None', the 'Discount (%)' and 'VM uptime' properties are not applicable. The monthly cost estimates are calculated by multiplying 744 hours in the VM uptime field with the hourly price of the recommended SKU.
**Sizing criteria** | Used to rightsize the Azure VM.<br><br> Use as-is sizing or performance-based sizing.
**Performance history** | Used with performance-based sizing. Performance history specifies the duration used when performance data is evaluated.
**Percentile utilization** | Used with performance-based sizing. Percentile utilization specifies the percentile value of the performance sample used for rightsizing.
**VM series** | The Azure VM series that you want to consider for rightsizing. For example, if you don't have a production environment that needs A-series VMs in Azure, you can exclude A-series from the list of series.
**Comfort factor** | The buffer used during assessment. It's applied to the CPU, RAM, disk, and network data for VMs. It accounts for issues like seasonal usage, short performance history, and likely increases in future usage.<br><br> For example, a 10-core VM with 20% utilization normally results in a two-core VM. With a comfort factor of 2.0, the result is a four-core VM instead.
**Offer** | The [Azure offer](https://azure.microsoft.com/support/legal/offer-details/) in which you're enrolled. The assessment estimates the cost for that offer.
**Currency** | The billing currency for your account.
**Discount (%)** | Any subscription-specific discounts you receive on top of the Azure offer. The default setting is 0%.
**VM uptime** | The duration in days per month and hours per day for Azure VMs that won't run continuously. Cost estimates are based on that duration.<br><br> The default values are 31 days per month and 24 hours per day.
**Azure Hybrid Benefit** | Specifies whether you have software assurance and are eligible for [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-use-benefit/). If the setting has the default value "Yes," Azure prices for operating systems other than Windows are considered for Windows VMs.
**EA subscription** | Specifies that an Enterprise Agreement (EA) subscription is used for cost estimation. Takes into account the discount applicable to the subscription. <br><br> Leave the settings for reserved instances, discount (%) and VM uptime properties with their default settings.
**Security** | Specifies whether you want to assess readiness and cost for security tooling on Azure. If the setting has the default value **Yes, with Microsoft Defender for Cloud**, it will assess security readiness and costs for your Azure VM with Microsoft Defender for Cloud.   


[Review the best practices](best-practices-assessment.md) for creating an assessment with Azure Migrate.

## Calculate readiness

Not all servers are suitable to run in Azure. An Azure VM Assessment assesses all on-premises servers and assigns them a readiness category.

- **Ready for Azure**: The server can be migrated as-is to Azure without any changes. It will start in Azure with full Azure support.
- **Conditionally ready for Azure**: The server might start in Azure but might not have full Azure support. For example, Azure doesn't support a server that's running an old version of Windows Server. You must be careful before you migrate these servers to Azure. To fix any readiness problems, follow the remediation guidance the assessment suggests.
- **Not ready for Azure**: The server won't start in Azure. For example, if an on-premises server's disk stores more than 64 TB, Azure can't host the server. Follow the remediation guidance to fix the problem before migration.
- **Readiness unknown**: Azure Migrate can't determine the readiness of the server because of insufficient metadata.

To calculate readiness, the assessment reviews the server properties and operating system settings summarized in the following tables.

### Server properties

For an Azure VM Assessment, the assessment reviews the following properties of an on-premises VM to determine whether it can run on Azure VMs.

**Property** | **Details** | **Azure readiness status**
--- | --- | ---
**Boot type** | Azure supports UEFI boot type for OS mentioned [here](./common-questions-server-migration.md#which-operating-systems-are-supported-for-migration-of-uefi-based-machines-to-azure)| Not ready if the boot type is UEFI and Operating System running on the VM is: Windows Server 2003/Windows Server 2003 R2/Windows Server 2008/Windows Server 2008 R2
**Cores** | Each server must have no more than 128 cores, which is the maximum number an Azure VM supports.<br><br> If performance history is available, Azure Migrate considers the utilized cores for comparison. If the assessment settings specify a comfort factor, the number of utilized cores is multiplied by the comfort factor.<br><br> If there's no performance history, Azure Migrate uses the allocated cores to apply the comfort factor. | Ready if the number of cores is within the limit
**RAM** | Each server must have no more than 3,892 GB of RAM, which is the maximum size an Azure M-series Standard_M128m&nbsp;<sup>2</sup> VM supports. [Learn more](../virtual-machines/sizes.md).<br><br> If performance history is available, Azure Migrate considers the utilized RAM for comparison. If a comfort factor is specified, the utilized RAM is multiplied by the comfort factor.<br><br> If there's no history, the allocated RAM is used to apply a comfort factor.<br><br> | Ready if the amount of RAM is within the limit
**Storage disk** | The allocated size of a disk must be no more than 64 TB.<br><br> The number of disks attached to the server, including the OS disk, must be 65 or fewer. | Ready if the disk size and number are within the limits
**Networking** | A server must have no more than 32 network interfaces (NICs) attached to it. | Ready if the number of NICs is within the limit

### Guest operating system

For an Azure VM Assessment, along with reviewing VM properties, the assessment looks at the guest operating system of a server to determine whether it can run on Azure.

> [!NOTE]
> To handle guest analysis for VMware VMs, the assessment uses the operating system specified for the VM in vCenter Server. However, vCenter Server doesn't provide the kernel version for Linux VM operating systems. To discover the version, you need to set up [application discovery](./how-to-discover-applications.md). Then, the appliance discovers version information using the guest credentials you specify when you set up app-discovery.


The assessment uses the following logic to identify Azure readiness based on the operating system:

**Operating system** | **Details** | **Azure readiness status**
--- | --- | ---
Windows Server 2016 and all SPs | Azure provides full support. | Ready for Azure.
Windows Server 2012 R2 and all SPs | Azure provides full support. | Ready for Azure.
Windows Server 2012 and all SPs | Azure provides full support. | Ready for Azure.
Windows Server 2008 R2 with all SPs | Azure provides full support.| Ready for Azure.
Windows Server 2008 (32-bit and 64-bit) | Azure provides full support. | Ready for Azure.
Windows Server 2003 and Windows Server 2003 R2 | These operating systems have passed their end-of-support dates and need a [Custom Support Agreement (CSA)](/troubleshoot/azure/virtual-machines/server-software-support) for support in Azure. | Conditionally ready for Azure. Consider upgrading the OS before migrating to Azure.
Windows 2000, Windows 98, Windows 95, Windows NT, Windows 3.1, and MS-DOS | These operating systems have passed their end-of-support dates. The server might start in Azure, but Azure provides no OS support. | Conditionally ready for Azure. We recommend that you upgrade the OS before migrating to Azure.
Windows 7, Windows 8, and Windows 10 | Azure provides support with a [Visual Studio subscription only.](../virtual-machines/windows/client-images.md) | Conditionally ready for Azure.
Windows 10 Pro | Azure provides support with [Multitenant Hosting Rights.](../virtual-machines/windows/windows-desktop-multitenant-hosting-deployment.md) | Conditionally ready for Azure.
Windows Vista and Windows XP Professional | These operating systems have passed their end-of-support dates. The server might start in Azure, but Azure provides no OS support. | Conditionally ready for Azure. We recommend that you upgrade the OS before migrating to Azure.
Linux | See the [Linux operating systems](../virtual-machines/linux/endorsed-distros.md) that Azure endorses. Other Linux operating systems might start in Azure. But we recommend that you upgrade the OS to an endorsed version before you migrate to Azure. | Ready for Azure if the version is endorsed.<br><br>Conditionally ready if the version isn't endorsed.
Other operating systems like Oracle Solaris, Apple macOS, and FreeBSD | Azure doesn't endorse these operating systems. The server might start in Azure, but Azure provides no OS support. | Conditionally ready for Azure. We recommend that you install a supported OS before migrating to Azure.  
OS specified as **Other** in vCenter Server | Azure Migrate can't identify the OS in this case. | Unknown readiness. Ensure that Azure supports the OS running inside the VM.
32-bit operating systems | The server might start in Azure, but Azure might not provide full support. | Conditionally ready for Azure. Consider upgrading to a 64-bit OS before migrating to Azure.

### Security readiness

Assessments also determine readiness of the recommended target for Microsoft Defender for Servers. A server is marked as Ready for Microsoft Defender for Servers if it has the following:
- Minimum 2 vCores (4 vCores preferred)
- Minimum 1 GB RAM (4 GB preferred)
- 2 GB of disk space
- Runs any of the following Operating Systems:
   - Windows Server 2008 R2, 2012 R2, 2016, 2019, 2022
   - Red Hat Enterprise Linux Server 7.2+, 8+, 9+
   - Ubuntu 16.04, 18.04, 20.04, 22.04
   - SUSE Linux Enterprise Server 12, 15+
   - Debian 9, 10, 11
   - Oracle Linux 7.2+, 8
   - CentOS Linux 7.2+
   - Amazon Linux 2
- For other Operating Systems, the server is marked as **Ready with Conditions**.
If a server is not ready to be migrated to Azure, it is marked as **Not Ready** for Microsoft Defender for Servers.


## Calculating sizing

After the server is marked as ready for Azure, the assessment makes sizing recommendations in the Azure VM assessment. These recommendations identify the Azure VM and disk SKU. Sizing calculations depend on whether you're using as-is on-premises sizing or performance-based sizing.

### Calculate sizing (as-is on-premises)

 If you use as-is on-premises sizing, the assessment doesn't consider the performance history of the VMs and disks in the Azure VM assessment.

- **Compute sizing**: The assessment allocates an Azure VM SKU based on the size allocated on-premises.
- **Storage and disk sizing**: The assessment looks at the storage type specified in assessment properties and recommends the appropriate disk type. Possible storage types are Standard HDD, Standard SSD, Premium, and Ultra disk. The default storage type is Premium.
- **Network sizing**: The assessment considers the network adapter on the on-premises server.

### Calculate sizing (performance-based)

If you use performance-based sizing in an Azure VM assessment, the assessment makes sizing recommendations as follows:

- The assessment considers the performance (resource utilization) history of the server along with the [processor benchmark](common-questions-discovery-assessment.md#i-see-a-banner-on-my-assessment-that-the-assessment-now-also-considers-processor-parameters-what-will-be-the-impact-of-recalculating-the-assessment) to identify the VM size and disk type in Azure.

> [!NOTE] 
> If you import servers by using a CSV file, the performance values you specify (CPU utilization, Memory utilization, Disk IOPS and throughput) are used if you choose performance-based sizing. You will not be able to provide performance history and percentile information.

- This method is especially helpful if you've overallocated the on-premises server, utilization is low, and you want to right-size the Azure VM to save costs.
- If you don't want to use the performance data, reset the sizing criteria to as-is on-premises, as described in the previous section.


#### Calculate storage sizing

For storage sizing in an Azure VM assessment, Azure Migrate tries to map each disk that is attached to the server to an Azure disk. Sizing works as follows:

1. Assessment adds the read and write IOPS of a disk to get the total IOPS required. Similarly, it adds the read and write throughput values to get the total throughput of each disk. In the case of import-based assessments, you have the option to provide the total IOPS, total throughput and total no. of disks in the imported file without specifying individual disk settings. If you do this, individual disk sizing is skipped and the supplied data is used directly to compute sizing, and select an appropriate VM SKU.

1. Disks are selected as follows:
    - If assessment can't find a disk with the required IOPS and throughput, it marks the server as unsuitable for Azure.
    - If assessment finds a set of suitable disks, it selects the disks that support the location specified in the assessment settings.
    - If there are multiple eligible disks, assessment selects the disk with the lowest cost.
    - If performance data for any disk is unavailable, the configuration disk size is used to find a Standard SSD disk in Azure.

##### Ultra disk sizing

For Ultra disks, there is a range of IOPS and throughput that is allowed for a particular disk size, and thus the logic used in sizing is different from Standard and Premium disks:
1. Three Ultra disk sizes are calculated: 
    - One disk (Disk 1) is found that can satisfy the disk size requirement
    - One disk (Disk 2) is found that can satisfy total IOPS requirement
        - IOPS to be provisioned =  (source disk throughput) *1024/256
    - One disk (Disk 3) is found that can satisfy total throughput requirement
1. Out of the three disks, one with the max disk size is found and is rounded up to the next available [Ultra disk offering](../virtual-machines/disks-types.md#ultra-disks). This is the provisioned Ultra disk size.
1. Provisioned IOPS is calculated using the following logic:
    - If source throughput discovered is in the allowable range for the Ultra disk size, provisioned IOPS is equal to source disk IOPS
    - Else, provisioned IOPS is calculated using IOPS to be provisioned =  (source disk throughput) *1024/256
1. Provisioned throughput range is dependent on provisioned IOPS


#### Calculate network sizing

For an Azure VM assessment, assessment tries to find an Azure VM that supports the number and required performance of network adapters attached to the on-premises server.

- To get the effective network performance of the on-premises server, assessment aggregates the data transmission rate out of the server (network out) across all network adapters. It then applies the comfort factor. It uses the resulting value to find an Azure VM that can support the required network performance.
- Along with network performance, assessment also considers whether the Azure VM can support the required number of network adapters.
- If network performance data is unavailable, assessment considers only the network adapter count for VM sizing.

#### Calculate compute sizing

After it calculates storage and network requirements, the assessment considers CPU and RAM requirements to find a suitable VM size in Azure.

- Azure Migrate looks at the effective utilized cores (including [processor benchmark](common-questions-discovery-assessment.md#i-see-a-banner-on-my-assessment-that-the-assessment-now-also-considers-processor-parameters-what-will-be-the-impact-of-recalculating-the-assessment)) and RAM to find a suitable Azure VM size.
- If no suitable size is found, the server is marked as unsuitable for Azure.
- If a suitable size is found, Azure Migrate applies the storage and networking calculations. It then applies location and pricing-tier settings for the final VM size recommendation.
- If there are multiple eligible Azure VM sizes, the one with the lowest cost is recommended.

## Confidence ratings (performance-based)

Each performance-based Azure VM assessment in Azure Migrate is associated with a confidence rating. The rating ranges from one (lowest) to five (highest) stars. The confidence rating helps you estimate the reliability of the size recommendations Azure Migrate provides.

- The confidence rating is assigned to an assessment. The rating is based on the availability of data points that are needed to compute the assessment.
- For performance-based sizing, the assessment needs:
    - The utilization data for CPU and RAM.
    - The disk IOPS and throughput data for every disk attached to the server.
    - The network I/O to handle performance-based sizing for each network adapter attached to a server.

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
- Assessment is not able to collect the performance data for some or all the servers in the assessment period. For a high confidence rating, ensure that: 
    - Servers are powered on for the duration of the assessment
    - Outbound connections on ports 443 are allowed
    - For Hyper-V servers, dynamic memory is enabled 
    
    **Recalculate** the assessment to reflect the latest changes in confidence rating.

- Some servers were created during the time for which the assessment was calculated. For example, assume you created an assessment for the performance history of the last month, but some servers were created only a week ago. In this case, the performance data for the new servers will not be available for the entire duration and the confidence rating would be low.

> [!NOTE]
> If the confidence rating of any assessment is less than five stars, we recommend that you wait at least a day for the appliance to profile the environment and then recalculate the assessment. Otherwise, performance-based sizing might be unreliable. In that case, we recommend that you switch the assessment to on-premises sizing.

## Calculate monthly costs

After sizing recommendations are complete, an Azure VM assessment in Azure Migrate calculates compute and storage costs for after migration.

### Compute cost
Azure Migrate uses the recommended Azure VM size and the Azure Billing API to calculate the monthly cost for the server.

The calculation takes into account the:
- Operating system
- Software assurance
- Reserved instances
- VM uptime
- Location
- Currency settings

The assessment aggregates the cost across all servers to calculate the total monthly compute cost.

### Storage cost
The monthly storage cost for a server is calculated by aggregating the monthly cost of all disks that are attached to the server.

#### Standard and Premium disk
The cost for Standard or Premium disks is calculated based on the selected/recommended disk size. 

#### Ultra disk 

The cost for Ultra disk is calculated based on the provisioned size, provisioned IOPS and provisioned throughput. [Learn more](https://azure.microsoft.com/pricing/details/managed-disks/)

Cost is calculated using the following logic: 
- Cost of disk size is calculated by multiplying provisioned disk size by hourly price of disk capacity
- Cost of provisioned IOPS is calculated by multiplying provisioned IOPS by hourly provisioned IOPS price
- Cost of provisioned throughput is calculated by multiplying provisioned throughput by hourly provisioned throughput price
- The Ultra disk VM reservation fee is not added in the total cost. [Learn More](https://azure.microsoft.com/pricing/details/managed-disks/)

Assessment calculates the total monthly storage costs by aggregating the storage costs of all servers. Currently, the calculation doesn't consider offers specified in the assessment settings.

### Security cost
For servers recommended for Azure VM, if they're ready to run Defender for Server, the Defender for Server cost (Plan 2) per server for that region is added. The assessment aggregates the cost across all servers to calculate the total monthly security cost.

Costs are displayed in the currency specified in the assessment settings.

## Next steps

[Review](best-practices-assessment.md) best practices for creating assessments. 

- Learn about running assessments for servers running in [VMware](./tutorial-discover-vmware.md) and [Hyper-V ](./tutorial-discover-hyper-v.md) environment, and [physical servers](./tutorial-discover-physical.md).
- Learn about assessing servers [imported with a CSV file](./tutorial-discover-import.md).
- Learn about setting up [dependency visualization](concepts-dependency-visualization.md).
