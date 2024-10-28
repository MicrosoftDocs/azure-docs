--- 
title: Azure VM assessments in Azure Migrate  
description: Learn about assessments in Azure Migrate  
author: rashi-ms 
ms.author: rajosh 
ms.manager: abhemraj 
ms.service: azure-migrate 
ms.topic: conceptual 
ms.date: 06/24/2024 
ms.custom: engagement-fy24 
--- 
 
# Azure VM assessment (Lift and Shift) 
 
In this article, you'll learn more about the Azure VM assessments. To get familiar with the general Azure Migrate assessment concepts, see the [Assessment overview](concepts-assessment-overview.md). If you want to migrate your on-premises servers to Azure quickly using the lift and shift method, you should create an Azure VM assessment to find out readiness, cost, and migration advise for your server workloads. 
 
> [!NOTE] 
> All assessments you create with Azure Migrate are a point-in-time snapshot of data. The assessment results are subject to change based on aggregated server performance, data collected, or change in the source configuration. 
 
## Discovery Sources for Azure VM assessments  
 
You have two options to identify your inventory of servers: 
 
- Discover your servers with a light-weight Azure Migrate appliance  
    (or) 
- Upload configuration and performance data via the import method. 
 
 The Azure Migrate appliance is the preferred discovery source for servers hosted on-premises environment and cloud.   
 
## How do I start with assessment? 
 
Once you're done with discovery and the inventory of servers shows up in the portal you can start creating the assessment.   
 
 - Create a group of servers, which will be the scope of your assessment.  
 - Azure Migrate assessments take two inputs for assessment viz. the configuration and performance data available through discovery and assessment settings, which represent the user intent.  
 - The following are some Azure VM specific settings. Learn more about general assessment settings.  For more information, see [Create an Azure VM assessment](tutorial-assess-vmware-azure-vm.md). 
 
> [!NOTE] 
> In Azure Government, review the [supported target](supported-geographies.md#azure-government) assessment locations. Note that VM size recommendations in assessments will use the VM series specifically for Government Cloud regions. [Learn more](https://azure.microsoft.com/global-infrastructure/services/?regions=usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-iowa,usgov-texas,usgov-virginia&products=virtual-machines) about VM types. 
 
**Setting Category** | **Setting** | **Details** 
--- | --- | ---  
|**Target settings**| **Target VM series** | The Azure VM series that you want to consider for rightsizing. For example, if you don't have a production environment that needs A-series VMs in Azure, you can exclude A-series from the list of series. The availability of VM series depends on the target location selected. For more information, see [VM families](/azure/virtual-machines/sizes/overview)  
|**Target settings**| **Target storage disk** | specifies the type of target storage disk as Premium-managed, Standard HDD-managed, Standard SSD-managed, or Ultra disk. </br> **Premium or Standard or Ultra disk**: The assessment recommends a disk SKU within the storage type selected. </br> If you want a single-instance VM service-level agreement (SLA) of 99.9%, consider using Premium-managed disks. This would ensure that all disks are recommended as Premium-managed disks. </br> If you're looking to run data-intensive workloads that need high throughput, high IOPS, and consistent low latency disk storage, consider using Ultra disks. </br> Azure Migrate supports only managed disks for migration assessment.  
**Right-Sizing** | **Sizing criteria** | This attribute is used for right-sizing the target recommendations.  Use **as-is on-premises** sizing if you don't want to right-size the targets and identify the targets according to your configuration for on-premises workloads. Use **performance-based** sizing to calculate compute recommendation based on CPU and memory utilization data and storage recommendation based on the input/output operations per second (IOPS) and throughput of the on-premises disks. 
| | **Performance history** | Used with performance-based sizing. Performance history specifies the duration used when performance data is evaluated.  
| |**Percentile utilization** | Used with performance-based sizing. Percentile utilization specifies the percentile value of the performance sample used for rightsizing. For more information, see  [sampling mechanism]. 
| |**Comfort factor** | This is the buffer applied during assessment. It's a multiplying factor used with performance metrics of CPU, RAM, disk, and network data for VMs. It accounts for issues like seasonal usage, short performance history, and likely increases in future usage. The comfort factor is applied irrespective of type of assessment (As-is on premises or performance based). In the case of performance-based assessment, it's multiplied with utilization value of the resources, whereas in case of As-is on premises assessment it's multiplied by allocated resources. </br> The default values change. </br> For example, a 10-core VM with 20% utilization normally results in a two-core VM. With a comfort factor of 2.0, the result is a four-core VM instead.  
|**Pricing settings** | **Savings options (compute)** | Specify the savings option that you want the assessment to consider to help optimize your Azure compute cost. </br> [Azure reservations](../cost-management-billing/reservations/save-compute-costs-reservations.md) (One year or three years reserved) are a good option for the most consistently running resources. </br> [Azure Savings Plan](../cost-management-billing/savings-plan/savings-plan-compute-overview.md) (One year or three years savings plan) provide additional flexibility and automated cost optimization. </br> When you select **None**, the Azure compute cost is based on the Pay as you go rate considering 730 hours as VM uptime, unless specified otherwise in VM uptime attribute. 
| |**Offer/Licensing program**| The [Azure offer](https://azure.microsoft.com/support/legal/offer-details/) in which you're enrolled. The assessment estimates the cost for that offer. Select one of the Pay-as-you-Go, Enterprise Agreement support, or pay-as-you-go Dev/Test. </br> You need to select pay-as-you-go in offer/licensing program to be able to use Reserved Instances or Azure Savings Plan. When you select any savings option other than **None**, the *Discount (%)* and *VM uptime* properties aren't applicable. The monthly cost estimates are calculated by multiplying 744 hours in the VM uptime field with the hourly price of the recommended SKU. 
| |**Currency** | The billing currency for your account.| 
| |**Discount (%)** | Any subscription-specific discounts you receive on top of the Azure offer. The default setting is 0%. | 
| | **VM uptime** | The duration in days per month and hours per day for Azure VMs that won't run continuously. Cost estimates are based on that duration. The default values are 31 days per month and 24 hours per day. | 
| | Azure Hybrid Benefit| Specifies whether you have software assurance and are eligible for [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-use-benefit/) to use your existing OS licenses. For Azure VM assessments you can bring in both Windows and Linux licenses. If the setting is enabled, Azure prices for selected operating systems aren't considered for VM costing.  
|**Security** | **Security** | Specifies whether you want to assess readiness and cost for security tooling on Azure. If the setting has the default value **Yes, with Microsoft Defender for Cloud**, it will assess security readiness and costs for your Azure VM with Microsoft Defender for Cloud.  
 
> [!NOTE] 
> In Azure Government, review the [supported target](supported-geographies.md#azure-government) assessment locations. Note that VM size recommendations in assessments will use the VM series specifically for Government Cloud regions. [Learn more](https://azure.microsoft.com/global-infrastructure/services/?regions=usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-iowa,usgov-texas,usgov-virginia&products=virtual-machines) about VM types. Also, [review the best practices](best-practices-assessment.md) to create an assessment with Azure Migrate. 
  
## Assessment Report 
 
### Azure readiness for servers 
To calculate readiness, the assessment reviews the server properties and operating system settings are summarized in the following tables.   
 
#### Server properties 
 
For an Azure VM assessment, the assessment reviews the following properties of an on-premises VM to determine whether it can run on Azure VMs. 
 
**Property** | **Details** | **Azure readiness status** 
--- | --- | --- | 
|**Boot type** | Azure supports UEFI boot type for OS. [Learn more](common-questions-server-migration.md#which-operating-systems-are-supported-for-migration-of-uefi-based-machines-to-azure) | **Not ready** if the boot type is UEFI and Operating system running on the VM is: Windows Server 2003/Windows Server 2003 R2/ Windows Server 2008/ Windows Server 2008 R2 | 
|**Cores** | Azure VM supports <= 128 cores </br> If performance history is available, Azure Migrate considers the utilized cores for comparison. | Ready if the number of cores is within the limit. | 
|**Memory** |Each server must have no more than 3,892 GB of RAM, which is the maximum size an Azure M-series Standard_M128m <sup>2</sup> VM supports. [Learn more](/azure/virtual-machines/sizes/overview)| Ready if the amount of memory is within the limit. | 
|**Storage disk** | The allocated size of a disk must be <= 64 TB. </br> The number of disks attached to the server, including the OS disk, must be 65 or fewer. | Ready if the disk size and number are within the limits. |  
|**Networking** | A server must have no more than 32 network interfaces (NICs) attached to it. | Ready if the number of NICs is within the limit. | 
|**Guest Operating System** | Identify the OS supported by Azure and linked readiness support </br> </br> Windows Server 2022 and all SPs,</br> Windows Server 2019 and all SPs, </br> Windows Server 2016 and all SPs, </br> Windows Server 2012/2012 R2 and all SPs, </br> Windows Server 2008 R2 with all SPs, </br> Windows Server 2008 (64-bit) | Ready for Azure | 
| |Windows Server 2003 and Windows Server 2003 R2, </br> Windows 2000,</br> Windows 98, </br> Windows 95, </br> Windows NT, </br> Windows 3.1, and MS-DOS, </br> Windows 7, </br> Windows 8, and </br> Windows 10, </br> Windows 10 Pro, </br> Windows Vista, and </br> Windows XP Professional | Conditionally ready for Azure. We recommend that you upgrade the OS before migrating to Azure. |  
| | Linux </br> See the [Linux operating system](/azure/virtual-machines/linux/endorsed-distros) that Azure endorses. Other Linux operating systems might start in Azure. But we recommend that you upgrade the OS to an endorsed version. | Ready for Azure if the version is endorsed. </br> Conditionally ready if the version isn't endorsed. |  
| |Other operating systems like Oracle Solaris, Apple macOS, and FreeBSD | Conditionally ready for Azure. Azure doesn't endorse these operating systems. The server might start in Azure, but Azure doesn't provides OS support. |  
| | OS specified as Other in vCenter Server | Unknown readiness. Ensure that Azure supports the OS running inside the VM. | 
| | 32-bit operating systems | Not Ready | 
 
> [!NOTE] 
> To handle guest analysis for VMware VMs, the assessment uses the operating system specified for the VM in vCenter Server. However, vCenter Server doesn't provide the kernel version for Linux VM operating systems. To discover the version, you need to set up [application discovery](how-to-discover-applications.md). Then, the appliance discovers version information using the guest credentials you specify when you set up app-discovery.  
 
## Security readiness 
 
Assessments also determine readiness of the recommended target for Microsoft Defender for Servers. A server is marked as Ready for Microsoft Defender for Servers if it has the following:  
 
- Minimum 2 vCores (4 vCores preferred)  
- Minimum 1-GB RAM (4 GB preferred)  
- 2 GB of disk space  
- Runs any of the following Operating Systems: 
  - Windows Server 2008 R2, 2012 R2, 2016, 2019, 2022  
  - Red Hat Enterprise Linux Server 7.2+, 8+, 9+  
  - Ubuntu 16.04, 18.04, 20.04, 22.04  
  - SUSE Linux Enterprise Server 12, 15+  
  - Debian 9, 10, 11  
  - Oracle Linux 7.2+, 8 
  - Amazon Linux 2  
- For other Operating Systems, the server is marked as **Ready with Conditions**. If a server isn't ready to be migrated to Azure, it's marked as **Not Ready** for Microsoft Defender for Servers. 
 
 
## Target VM right-sizing 
 
After the server is marked as ready for Azure, the assessment makes sizing recommendations in the Azure VM assessment. These recommendations identify the Azure VM and disk SKU. Sizing calculations depend on whether you're using as-is on-premises sizing or performance-based sizing.  
 
### Calculate sizing (as-is-on-premises) 
 
If you use as-is on-premises sizing, the assessment doesn't consider the performance history of the VMs and disks in the Azure VM assessment.  
 
- **Compute sizing**: The assessment allocates an Azure VM SKU based on the size allocated on-premises.  
 
- **Storage and disk sizing**: The assessment looks at the storage type specified in assessment properties and recommends the appropriate disk type. Possible storage types are Standard HDD, Standard SSD, Premium, and Ultra disk.   
 
- **Network sizing**: The assessment considers the network adapter on the on-premises server.  
 
 
 
### Calculate sizing (performance-based) 
 
If you use performance-based sizing in an Azure VM assessment, the assessment makes sizing recommendations as follows:  
 
- The assessment considers the performance (resource utilization) history of the server along with the [processor benchmark](common-questions-discovery-assessment.md#i-see-a-banner-on-my-assessment-that-the-assessment-now-also-considers-processor-parameters-what-will-be-the-impact-of-recalculating-the-assessment) to identify the VM size and disk type in Azure.  
 
> [!NOTE] 
> If you import servers by using a CSV file, the performance values you specify (CPU utilization, Memory utilization, Disk IOPS and throughput) are used if you choose performance-based sizing. You will not be able to provide performance history and percentile information.  
 
- This method is especially helpful if you've over allocated the on-premises server, utilization is low, and you want to right-size the Azure VM to save costs.  
- If you don't want to use the performance data, reset the sizing criteria to as-is on-premises, as described in the previous section. 
 
### Storage sizing calculations 
 
For storage sizing in an Azure VM assessment, Azure Migrate tries to map each disk that is attached to the server to an Azure disk. Sizing works as follows:  
 
1. Assessment adds the read and write IOPS of a disk to get the total IOPS required. Similarly, it adds the read and write throughput values to get the total throughput of each disk. In the case of import-based assessments, you have the option to provide the total IOPS, total throughput, and total no. of disks in the imported file without specifying individual disk settings. If you do this, individual disk sizing is skipped and the supplied data is used directly to compute sizing, and select an appropriate VM SKU. 
  
1. Disks are selected as follows: 
 
   - If assessment can't find a disk with the required IOPS and throughput, it marks the server as unsuitable for Azure.  
   - If assessment finds a set of suitable disks, it selects the disks that support the location specified in the assessment settings.  
   - If there are multiple eligible disks, assessment selects the disk with the lowest cost.  
   - If performance data for any disk is unavailable, the configuration disk size is used to find a Standard SSD disk in Azure.  
   - For Ultra disks, there's a range of IOPS and throughput that is allowed for a particular disk size, and thus the logic used in sizing is different from Standard and Premium disks:  
    
    Three Ultra disk sizes are calculated: 
 
    - One disk (Disk 1) is found that can satisfy the disk size requirement.  
    - One disk (Disk 2) is found that can satisfy total IOPS requirement. IOPS to be provisioned = (source disk throughput) *1024/256. 
    - One disk (Disk 3) is found that can satisfy total throughput requirement/ 
 
    Out of the three disks, one with the max disk size is found and is rounded up to the next available [Ultra disk offering (Azure managed disk types)](/azure/virtual-machines/disks-types#ultra-disks). This is the provisioned Ultra disk size.
 
    Provisioned IOPS are calculated using the following logic:  
 
    - If source throughput discovered is in the allowable range for the Ultra disk size, provisioned IOPS are equal to source disk IOPS  
    - Else, provisioned IOPS are calculated using IOPS to be provisioned = (source disk throughput) *1024/256  
    - Provisioned throughput range is dependent on provisioned IOPS  
 
### Network sizing 
 
For an Azure VM assessment, assessment tries to find an Azure VM that supports the number and required performance of network adapters attached to the on-premises server.  
 
- To get the effective network performance of the on-premises server, assessment aggregates the data transmission rate out of the server (network out) across all network adapters. It then applies the comfort factor. It uses the resulting value to find an Azure VM that can support the required network performance.  
 
- Along with network performance, assessment also considers whether the Azure VM can support the required number of network adapters.  
 
- If network performance data is unavailable, assessment considers only the network adapter count for VM sizing.  
 
 
### Compute-sizing 
 
After it calculates storage and network requirements, the assessment considers CPU and RAM requirements to find a suitable VM size in Azure.  
 
- Azure Migrate looks at the effective utilized cores (including processor benchmark) and RAM to find a suitable Azure VM size.  
 
- If no suitable size is found, the server is marked as unsuitable for Azure.  
 
- If a suitable size is found, Azure Migrate applies the storage and networking calculations. It then applies location and pricing-tier settings for the final VM size recommendation.  
 
- If there are multiple eligible Azure VM sizes, the one with the lowest cost is recommended.  
 
### Monthly costs 
 
After sizing recommendations are done, an Azure VM assessment in Azure Migrate calculates compute and storage costs for after migration.  
 
#### Compute cost 
 
Azure Migrate uses the recommended Azure VM size and the Azure Billing API to calculate the monthly cost for the server.  
 
The calculation considers the following:  
 
- Operating system  
- Software assurance 
- Reserved instances  
- VM uptime  
- Location  
- Currency settings  
 
The assessment aggregates the cost across all servers to calculate the total monthly compute cost.  
 
#### Storage cost 
 
The monthly storage cost for a server is calculated by aggregating the monthly cost of all disks that are attached to the server. 
 
#### Standard and Premium disk 
 
The cost for Standard or Premium disks is calculated based on the selected/recommended disk size.  
 
#### Ultra disk 
 
The cost for Ultra disk is calculated based on the provisioned size, provisioned IOPS, and provisioned throughput. [Learn more](https://azure.microsoft.com/pricing/details/managed-disks/). 
 
Cost is calculated using the following logic: 
 
- Cost of disk size is calculated by multiplying provisioned disk size by hourly price of disk capacity. 
 
- Cost of provisioned IOPS is calculated by multiplying provisioned IOPS by hourly provisioned IOPS price.  
 
- Cost of provisioned throughput is calculated by multiplying provisioned throughput by hourly provisioned throughput price.  
 
- The Ultra disk VM reservation fee isn.t added in the total cost. [Learn more](https://azure.microsoft.com/pricing/details/managed-disks/). 
 
 
#### Security cost 
 
For servers recommended for Azure VM, if they're ready to run Defender for Server, the Defender for Server cost (Plan 2) per server for that region is added. The assessment aggregates the cost across all servers to calculate the total monthly security cost.  
 
Costs are displayed in the currency specified in the assessment settings.  
 
  
## Next steps 
 
- Review [best practices for creating assessments](best-practices-assessment.md).  
- Learn about running assessments for servers running in [VMware](./tutorial-discover-vmware.md) and [Hyper-V ](./tutorial-discover-hyper-v.md) environment, and [physical servers](./tutorial-discover-physical.md). 
- Learn about assessing servers [imported with a CSV file](./tutorial-discover-import.md). 
- Learn about setting up [dependency visualization](concepts-dependency-visualization.md). 