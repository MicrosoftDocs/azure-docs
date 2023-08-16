---
title: Azure VMware Solution assessment calculations in Azure Migrate | Microsoft Docs
description: Provides an overview of Azure VMware Solution assessment calculations in the Azure Migrate service.
author: rashi-ms
ms.author: rajosh
ms.manager: abhemraj
ms.topic: conceptual
ms.service: azure-migrate
ms.date: 08/05/2022
ms.custom: engagement-fy23
---

# Assessment overview (migrate to Azure VMware Solution)

[Azure Migrate](migrate-services-overview.md) provides a central hub to track discovery, assessment, and migration of your on-premises apps and workloads. It also tracks your private and public cloud instances to Azure. The hub offers Azure Migrate tools for assessment and migration, as well as third-party independent software vendor (ISV) offerings.

Discovery and assessment tool in Azure Migrate assesses on-premises servers for migration to Azure virtual machines and Azure VMware Solution. This article provides information about how Azure VMware Solution assessments are calculated.

> [!NOTE]
> Azure VMware Solution assessment can be created for VMware vSphere VMs only.

## Types of assessments

Assessments you create with Azure Migrate are a point-in-time snapshot of data. There are two types of assessments you can create using Azure Migrate:

**Assessment Type** | **Details**
--- | --- 
**Azure VM** | Assessments to migrate your on-premises servers to Azure virtual machines. You can assess your on-premises servers in [VMware vSphere](how-to-set-up-appliance-vmware.md) and [Hyper-V](how-to-set-up-appliance-hyper-v.md) environment, and [physical servers](how-to-set-up-appliance-physical.md) for migration to Azure VMs using this assessment type.
**Azure SQL** | Assessments to migrate your on-premises SQL servers from your VMware environment to Azure SQL Database or Azure SQL Managed Instance.
**Azure App Service** | Assessments to migrate your on-premises ASP.NET web apps, running on IIS web servers, from your VMware vSphere environment to Azure App Service.
**Azure VMware Solution (AVS)** | Assessments to migrate your on-premises vSphere servers to [Azure VMware Solution](../azure-vmware/introduction.md). You can assess your on-premises [VMware vSphere VMs](how-to-set-up-appliance-vmware.md) for migration to Azure VMware Solution using this assessment type. [Learn more](concepts-azure-vmware-solution-assessment-calculation.md)

> [!NOTE]
> If the number of Azure VM or Azure VMware Solution assessments are incorrect on the Discovery and assessment tool, click on the total number of assessments to navigate to all the assessments and recalculate the Azure VM or Azure VMware Solution assessments. The Discovery and assessment tool will then show the correct count for that assessment type. 

Azure VMware Solution assessment provides two sizing criteria options:

| **Assessment** | **Details** | **Data** |
| - | - | - |
| **Performance-based** | Assessments based on collected performance data of on-premises VMs. | **Recommended Node size**: Based on CPU and memory utilization data along with node type, storage type, and FTT setting that you select for the assessment. |
| **As on-premises** | Assessments based on on-premises sizing. | **Recommended Node size**: Based on the on-premises VM size along with the node type, storage type, and FTT setting that you select for the assessment. |

## How do I run an assessment?

There are a couple of ways to run an assessment.

- Assess servers by using server metadata collected by a lightweight Azure Migrate appliance. The appliance discovers on-premises servers. It then sends server metadata and performance data to Azure Migrate. This allows for more precision.
- Assess servers by using server metadata that's imported in a comma-separated values (CSV) format.

## How do I assess with the appliance?

If you're deploying an Azure Migrate appliance to discover on-premises servers, do the following steps:

1. Set up Azure and your on-premises environment to work with Azure Migrate.
2. For your first assessment, create an Azure project and add the Discovery and assessment tool to it.
3. Deploy a lightweight Azure Migrate appliance. The appliance continuously discovers on-premises vSphere servers and sends server metadata and performance data to Azure Migrate. Deploy the appliance as a VM. You don't need to install anything on servers that you want to assess.

After the appliance begins server discovery, you can gather servers you want to assess into a group and run an assessment for the group with assessment type **Azure VMware Solution (AVS)**.

Create your first Azure VMware Solution assessment by following the steps [here](how-to-create-azure-vmware-solution-assessment.md).

## How do I assess with imported data?

If you're assessing servers by using a CSV file, you don't need an appliance. Instead, do the following steps:

1. Set up Azure to work with Azure Migrate.
2. For your first assessment, create an Azure project and add the Discovery and assessment tool to it.
3. Download a CSV template and add server data to it.
4. Import the template into Azure Migrate.
5. Discover servers added with the import, gather them into a group, and run an assessment for the group with assessment type **Azure VMware Solution (AVS)**.

## What data does the appliance collect?

If you're using the Azure Migrate appliance for assessment, learn about the metadata and performance data that's collected for [VMware vSphere](discovered-metadata.md#collected-metadata-for-vmware-servers).

## How does the appliance calculate performance data?

If you use the appliance for discovery, it collects performance data for compute settings with these steps:

1. The appliance collects a real-time sample point.

   - **VMware vSphere VMs**: A sample point is collected every 20 seconds.
2. The appliance combines the sample points to create a single data point every 10 minutes. To create the data point, the appliance selects the peak values from all samples. It then sends the data point to Azure.
3. Azure Migrate stores all the 10-minute data points for the last month.
4. When you create an assessment, the assessment identifies the appropriate data point to use for rightsizing. Identification is based on the percentile values for *performance history* and *percentile utilization*.

   - For example, if the performance history is one week and the percentile utilization is the 95th percentile, the assessment sorts the 10-minute sample points for the last week. It sorts them in ascending order and picks the 95th percentile value for rightsizing.
   - The 95th percentile value makes sure you ignore any outliers, which might be included if you picked the 99th percentile.
   - If you want to pick the peak usage for the period and don't want to miss any outliers, select the 99th percentile for percentile utilization.
5. This value is multiplied by the comfort factor to get the effective performance utilization data for these metrics that the appliance collects:

   - CPU utilization
   - RAM utilization

The following performance data is collected but not used in sizing recommendations for Azure VMware Solution assessments:

- The disk IOPS and throughput data for every disk attached to the VM.
- The network I/O to handle performance-based sizing for each network adapter attached to a VM.

## How are Azure VMware Solution assessments calculated?

Azure VMware Solution assessment uses the on-premises vSphere servers' metadata and performance data to calculate assessments. If you deploy the Azure Migrate appliance, assessment uses the data the appliance collects. But if you run an assessment imported using a CSV file, you provide the metadata for the calculation.

Calculations occur in these three stages:

1. **Calculate Azure VMware Solution readiness**: Whether the on-premises vSphere VMs are suitable for migration to Azure VMware Solution.
2. **Calculate number of Azure VMware Solution nodes and Utilization across nodes**: Estimated number of Azure VMware Solution nodes required to run the VMware vSphere VMs and projected CPU, memory, and storage utilization across all nodes.
3. **Monthly cost estimation**: The estimated monthly costs for all Azure VMware Solution nodes running the on-premises vSphere VMs.

Calculations are in the preceding order. A server moves to a later stage only if it passes the previous one. For example, if a server fails the Azure VMware Solution readiness stage, it's marked as unsuitable for Azure. Sizing and cost calculations aren't done for that server

## What's in an Azure VMware Solution assessment?

Here's what's included in an Azure VMware Solution assessment:

| **Property** | **Details** |
| - | - |
| **Target location** | Specifies the Azure VMware Solution private cloud location to which you want to migrate. |
| **Storage type** | Specifies the storage engine to be used in Azure VMware Solution. Azure VMware Solution currently only supports vSAN as a default storage type but more storage options will be coming as per roadmap. |
| **Reserved Instances (RIs)** | This property helps you specify Reserved Instances in Azure VMware Solution if purchased and the term of the Reserved Instance. Your cost estimates will take the option chosen into account.[Learn more](../azure-vmware/reserved-instance.md) <br/><br/> If you select reserved instances, you can't specify “Discount (%)”.|
| **Node type** | Specifies the [Azure VMware Solution Node type](../azure-vmware/concepts-private-clouds-clusters.md) used to be used in Azure. The default node type is AV36. More node types might be available in future.  Azure Migrate will recommend a required number of nodes for the VMs to be migrated to Azure VMware Solution. |
| **FTT Setting, RAID Level** | Specifies the valid combination of Failures to Tolerate and Raid combinations. The selected FTT option combined with RAID level and the on-premises vSphere VM disk requirement will determine the total vSAN storage required in Azure VMware Solution. Total available storage after calculations also includes a) space reserved for management objects such as vCenter Server and b) 25% storage slack required for vSAN operations. |
| **Sizing criterion** | Sets the criteria to be used to determine memory, cpu and storage requirements for Azure VMware Solution nodes. You can opt for *performance-based* sizing or *as on-premises* without considering the performance history. To simply lift and shift, choose as on-premises. To obtain usage based sizing, choose performance based. |
| **Performance history** | Sets the duration to consider in evaluating the performance data of servers. This property is applicable only when the sizing criteria is *performance-based*. |
| **Percentile utilization** | Specifies the percentile value of the performance sample set to be considered for right-sizing. This property is applicable only when the sizing is performance-based. |
| **Comfort factor** | Azure Migrate considers a buffer (comfort factor) during assessment. This buffer is applied on top of server utilization data for VMs (CPU, memory and disk). The comfort factor accounts for issues such as seasonal usage, short performance history, and likely increases in future usage. For example, a 10-core VM with 20% utilization normally results in a 2-core VM. However, with a comfort factor of 2.0x, the result is a 4-core VM instead. |
| **Offer** | Displays the [Azure offer](https://azure.microsoft.com/support/legal/offer-details/) you're enrolled in. Azure Migrate estimates the cost accordingly. |
| **Currency** | Shows the billing currency for your account. |
| **Discount (%)** | Lists any subscription-specific discount you receive on top of the Azure offer. The default setting is 0%. |
| **Azure Hybrid Benefit** | Specifies whether you have software assurance and are eligible for [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-use-benefit/). Although it has no impact on Azure VMware Solution pricing due to the node-based price, customers can still apply the on-premises OS or SQL licenses (Microsoft based) in Azure VMware Solution using Azure Hybrid Benefits. Other software OS vendors will have to provide their own licensing terms, such as RHEL for example. |
| **vCPU Oversubscription** | Specifies the ratio of number of virtual cores tied to one physical core in the Azure VMware Solution node. The default value in the calculations is 4 vCPU:1 physical core in Azure VMware Solution. API users can set this value as an integer. Note that vCPU Oversubscription > 4:1 may impact workloads depending on their CPU usage. When sizing, we always assume 100% utilization of the cores chosen. |
| **Memory overcommit factor** | Specifies the ratio of memory overcommit on the cluster. A value of 1 represents 100% memory use, 0.5, for example is 50%, and 2 would be using 200% of available memory. You can only add values from 0.5 to 10 up to one decimal place. |
| **Deduplication and compression factor** | Specifies the anticipated deduplication and compression factor for your workloads. Actual value can be obtained from on-premises vSAN or storage configurations. These vary by workload. A value of 3 would mean 3x so for 300GB disk only 100GB storage would be used. A value of 1 would mean no deduplication or compression. You can only add values from 1 to 10 up to one decimal place. |

## Azure VMware Solution suitability analysis

Azure VMware Solution assessments assess each on-premises vSphere VM for its suitability for Azure VMware Solution by reviewing the server properties. It also assigns each assessed server to one of the following suitability categories:

- **Ready for AVS**: The server can be migrated as-is to Azure VMware Solution without any changes. It will start in Azure VMware Solution with full support.
- **Ready with conditions**: There might be some compatibility issues example internet protocol or deprecated OS in VMware vSphere and need to be remediated before migrating to Azure VMware Solution. To fix any readiness problems, follow the remediation guidance the assessment suggests.
- **Not ready for AVS**: The VM will not start in Azure VMware Solution. For example, if the on-premises VMware vSphere VM has an external device attached, such as a cd-rom, the VMware vMotion operation will fail (if using VMware vMotion).
- **Readiness unknown**: Azure Migrate couldn't determine the readiness of the server because of insufficient metadata collected from the on-premises environment.

The assessment reviews the server properties to determine the Azure readiness of the on-premises vSphere server.

### Server properties

The assessment reviews the following property of the on-premises vSphere VM to determine whether it can run on Azure VMware Solution.

| **Property** | **Details** | **Azure VMware Solution readiness status** |
| - | - | - |
| **Internet Protocol** | Azure VMware Solution currently does not support end to end IPv6 internet addressing. Contact your local MSFT Azure VMware Solution GBB team for guidance on remediation guidance if your server is detected with IPv6. | Unsupported IPv6 |
| **Operating System** | Support for certain Operating System versions have been deprecated by VMware and the assessment recommends you to upgrade the operating system before migrating to Azure VMware Solution. [Learn more](https://www.vmware.com/resources/compatibility/search.php?deviceCategory=software)
 | Unsupported OS |

## Sizing

After a vSphere server is marked as ready for Azure VMware Solution, Azure VMware Solution Assessment makes node sizing recommendations, which involve identifying the appropriate on-premises vSphere VM requirements and finding the total number of Azure VMware Solution nodes required. These recommendations vary, depending on the assessment properties specified.

- If the assessment uses *performance-based sizing*, Azure Migrate considers the performance history of the server to make the appropriate sizing recommendation for Azure VMware Solution. This method is especially helpful if you've over-allocated the on-premises vSphere VM, but utilization is low and you want to right-size the VM in Azure VMware Solution to save costs. This method will help you optimize the sizes during migration.

> [!NOTE] 
>If your import serves by using a CSV file, the performance values you specify (CPU utilization, Memory utilization, Storage in use, Disk IOPS, and throughput) are used if you choose performance-based sizing. You will not be able to provide performance history and percentile information.

- If you don't want to consider the performance data for VM sizing and want to take the on-premises vSphere servers as-is to Azure VMware Solution, you can set the sizing criteria to *as on-premises*. Then, the assessment will size the VMs based on the on-premises vSphere configuration without considering the utilization data.

### FTT Sizing Parameters

The storage engine used in Azure VMware Solution is vSAN. vSAN storage policies define storage requirements for your servers. These policies guarantee the required level of service for your VMs because they determine how storage is allocated to the VM. The available FTT-Raid Combinations are:

| **Failures to Tolerate (FTT)** | **RAID Configuration** | **Minimum Hosts Required** | **Sizing consideration** |
| - | - | - | - |
| 1 | RAID-1 (Mirroring) | 3 | A 100GB VM would consume 200GB. |
| 1 | RAID-5 (Erasure Coding) | 4 | A 100GB VM would consume 133.33GB |
| 2 | RAID-1 (Mirroring) | 5 | A 100GB VM would consume 300GB. |
| 2 | RAID-6 (Erasure Coding) | 6 | A 100GB VM would consume 150GB. |
| 3 | RAID-1 (Mirroring) | 7 | A 100GB VM would consume 400GB. |

### Performance-based sizing

For performance-based sizing, Azure Migrate appliance profiles the on-premises vSphere environment to collect performance data for CPU, memory and disk. Thus, performance based sizing for Azure VMware Solution will take into consideration the allocated disk space and using the chosen percentile utilization of memory and CPU. For example if a VM has 4 vCPU allocated but only using 25% then Azure VMware Solution will size for 1 vCPU for that VM.

**Performance data collection steps:**

1. For VMware vSphere VMs, the Azure Migrate appliance collects a real-time sample point at every 20-second interval.
2. The appliance rolls up the sample points collected every 10 minutes and sends the maximum value for the last 10 minutes to Azure Migrate.
3. Azure Migrate stores all the 10-minute sample points for the last one month. Then, depending on the assessment properties specified for *Performance history* and *Percentile utilization*, it identifies the appropriate data point to use for right-sizing. For example, if the performance history is set to 1 day and the percentile utilization is the 95th percentile, Azure Migrate uses the 10-minute sample points for the last one day, sorts them in ascending order, and picks the 95th percentile value for right-sizing.
4. This value is multiplied by the comfort factor to get the effective performance utilization data for each metric (CPU utilization and memory utilization) that the appliance collects.

After the effective utilization value is determined, the storage, network, and compute sizing is handled as follows.

**Storage sizing**: Azure Migrate uses the total on-premises VM disk space as a calculation parameter to determine Azure VMware Solution vSAN storage requirements in addition to the customer-selected FTT setting. FTT - Failures to tolerate as well as requiring a minimum number of nodes per FTT option will determine the total vSAN storage required combined with the VM disk requirement. If your import serves by using a CSV file, storage utilization is taken into consideration when you create a performance based assessment. If you create an as-on-premises assessment, the logic only looks at allocated storage per VM.

**Network sizing**:  Azure VMware Solution assessments currently do not take any network settings into consideration for node sizing. While migrating to Azure VMware Solution, minimums and maximums as per VMware NSX- T Data Center standards are used.

**Compute sizing**: After it calculates storage requirements (FTT Sizing Parameters), Azure VMware Solution assessment considers CPU and memory requirements to determine the number of nodes required for Azure VMware Solution based on the node type.

- Based on the sizing criteria, Azure VMware Solution assessment looks at either the performance-based VM data or the on-premises vSphere VM configuration. The comfort factor setting allows for specifying growth factor of the cluster. Currently by default, hyperthreading is enabled and thus a 36 core nodes will have 72 vCores. 4 vCores per physical is used to determine CPU thresholds per cluster using the VMware standard of not exceeding 80% utilization to allow for maintenance or failures to be handled without compromising cluster availability. There is currently no override available to change the oversubscription values and we may have this in future versions.

### As on-premises sizing

If you use *as on-premises sizing*, Azure VMware Solution assessment doesn't consider the performance history of the VMs and disks. Instead, it allocates Azure VMware Solution nodes based on the size allocated on-premises. The default storage type is vSAN in Azure VMware Solution.

[Learn more](./tutorial-assess-vmware-azure-vmware-solution.md#review-an-assessment) about how to review an Azure VMware Solution assessment.

### CPU utilization on Azure VMware Solution nodes

CPU utilization assumes 100% usage of the available cores. To reduce the number of nodes required, one can increase the oversubscription from 4:1 to say 6:1 based on workload characteristics and on-premises vSphere experience. Unlike for disk, Azure VMware Solution does not place any limits on CPU utilization. It's up to customers to ensure their cluster performs optimally so if "running hot" is required, adjust accordingly. To allow more room for growth, reduce the oversubscription or increase the value for growth factor.

CPU utilization also already accounts for management overhead from vCenter Server, NSX-T Manager and other smaller resources.

### Memory utilization on Azure VMware Solution nodes

Memory utilization shows the total memory from all nodes vs. requirements from Server or workloads. Memory can be over subscribed and again Azure VMware Solution places no limits and it's up the customer to run optimal cluster performance for their workloads.

Memory utilization also already accounts for management overhead from vCenter Server, NSX-T Manager and other smaller resources.

### Storage utilization on Azure VMware Solution nodes

Storage utilization is calculated based on the following sequence:

1. Size required for VMs (either allocated as is or performance based used space)
2. Apply growth factor if any
3. Add management overhead and apply FTT ratio
4. Apply deduplication and compression factor
5. Apply required 25% slack for vSAN
6. Result available storage for VMs out of total storage including management overhead.

The available storage on a 3 node cluster will be based on the default storage policy, which is Raid-1 and uses thick provisioning. When calculating for erasure coding or Raid-5 for example, a minimum of 4 nodes is required. Note that in Azure VMware Solution, the storage policy for customer workload can be changed by the administrator or Run Command(Currently in Preview). [Learn more] (./azure-vmware/configure-storage-policy.md)

### Limiting factor

The limiting factor shown in assessments could be CPU or memory or storage resources based on the utilization on nodes. It is the resource, which is limiting or determining the number of hosts/nodes required to accommodate the resources. For example, in an assessment if it was found that after migrating 8 VMware VMs to Azure VMware Solution, 50% of CPU resources will be utilized, 14% of memory is utilized and 18% of storage will be utilized on the 3 Av36 nodes and thus CPU is the limiting factor.

## Confidence ratings

Each performance-based assessment in Azure Migrate is associated with a confidence rating that ranges from one (lowest) to five stars (highest).

- The confidence rating is assigned to an assessment based on the availability of data points needed to compute the assessment.
- The confidence rating of an assessment helps you estimate the reliability of the size recommendations provided by Azure Migrate.
- Confidence ratings aren't applicable for *as on-premises* assessments.
- For performance-based sizing, Azure VMware Solution assessments need the utilization data for CPU and VM memory. The following data is collected but not used in sizing recommendations for Azure VMware Solution:

  - The disk IOPS and throughput data for every disk attached to the VM.
  - The network I/O to handle performance-based sizing for each network adapter attached to a VM.

  If any of these utilization numbers are unavailable in vCenter Server, the size recommendation might not be reliable.

Depending on the percentage of data points available, the confidence rating for the assessment goes as follows.

| **Availability of data points** | **Confidence rating** |
| - | - |
| 0-20% | 1 star |
| 21-40% | 2 stars |
| 41-60% | 3 stars |
| 61-80% | 4 stars |
| 81-100% | 5 stars |

### Low confidence ratings

Here are a few reasons why an assessment could get a low confidence rating:

- You didn't profile your environment for the duration for which you're creating the assessment. For example, if you create the assessment with performance duration set to one day, you must wait at least a day after you start discovery for all the data points to get collected.
- Assessment is not able to collect the performance data for some or all the VMs in the assessment period. For a high confidence rating, please ensure that:

  - VMs are powered on for the duration of the assessment
  - Outbound connections on ports 443 are allowed
  - For Hyper-V VMs, dynamic memory is enabled

  Please 'Recalculate' the assessment to reflect the latest changes in confidence rating.
- Some VMs were created during the time for which the assessment was calculated. For example, assume you created an assessment for the performance history of the last month, but some VMs were created only a week ago. In this case, the performance data for the new VMs will not be available for the entire duration and the confidence rating would be low.

> [!NOTE]
> If the confidence rating of any assessment is less than five stars, we recommend that you wait at least a day for the appliance to profile the environment, and then recalculate the assessment. If you don't, performance-based sizing might not be reliable. In that case, we recommend that you switch the assessment to on-premises sizing.

## Monthly cost estimation

After sizing recommendations are complete, Azure Migrate calculates the total cost of running the on-premises vSphere workloads in Azure VMware Solution by multiplying the number of Azure VMware Solution nodes required by the node price. The cost per VM cost is calculated by dividing the total cost by the number of VMs in the assessment.

- The calculation takes the number of nodes required, node type and location into account.
- It aggregates the cost across all nodes to calculate the total monthly cost.
- Costs are displayed in the currency specified in the assessment settings.

As the pricing for Azure VMware Solution is per node, the total cost does not have compute cost and storage cost distribution. [Learn More](../azure-vmware/introduction.md)

## Migration Tool Guidance

In the Azure readiness report for Azure VMware Solution assessment, you can see the following suggested tools:

- **VMware HCX or Enterprise**: For VMware vSphere servers, VMware Hybrid Cloud Extension (HCX) solution is the suggested migration tool to migrate your on-premises vSphere workload to your Azure VMware Solution private cloud. [Learn More](../azure-vmware/install-vmware-hcx.md).
- **Unknown**: For servers imported via a CSV file, the default migration tool is unknown. Though for VMware vSphere servers, it is recommended to use the VMware Hybrid Cloud Extension (HCX) solution.

## Next steps

Create an assessment for [Azure VMware Solution VMs](how-to-create-azure-vmware-solution-assessment.md).
