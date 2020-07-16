---
title: AVS assessment calculations in Azure Migrate | Microsoft Docs
description: Provides an overview of AVS assessment calculations in the Azure Migrate service.
author: rashi-ms
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 06/25/2020
ms.author: mahain
---

# AVS assessments in Azure Migrate: Server Assessment

[Azure Migrate](migrate-services-overview.md) provides a central hub to track discovery, assessment, and migration of your on-premises apps and workloads. It also tracks your private and public cloud instances to Azure. The hub offers Azure Migrate tools for assessment and migration, as well as third-party independent software vendor (ISV) offerings.

Server Assessment is a tool in Azure Migrate that assesses on-premises servers for migration to Azure IaaS virtual machines and Azure VMware Solution (AVS). This article provides information about how Azure VMware Solution (AVS) assessments are calculated.

> [!NOTE]
> Azure VMware Solution (AVS) assessment is currently in preview and can be created for VMware VMs only.

## Types of assessments

Assessments you create with Server Assessment are a point-in-time snapshot of data. There are two types of assessments you can create using Azure Migrate: Server Assessment.

**Assessment Type** | **Details**
--- | --- 
**Azure VM** | Assessments to migrate your on-premises servers to Azure virtual machines. <br/><br/> You can assess your on-premises [VMware VMs](how-to-set-up-appliance-vmware.md), [Hyper-V VMs](how-to-set-up-appliance-hyper-v.md), and [physical servers](how-to-set-up-appliance-physical.md) for migration to Azure using this assessment type.[Learn more](concepts-assessment-calculation.md)
**Azure VMware Solution (AVS)** | Assessments to migrate your on-premises servers to [Azure VMware Solution (AVS)](https://docs.microsoft.com/azure/azure-vmware/introduction). <br/><br/> You can assess your on-premises [VMware VMs](how-to-set-up-appliance-vmware.md) for migration to Azure VMware Solution (AVS) using this assessment type.[Learn more](concepts-azure-vmware-solution-assessment-calculation.md)

Azure VMware Solution (AVS) assessment in Server Assessment provides two sizing criteria options:

**Assessment** | **Details** | **Data**
--- | --- | ---
**Performance-based** | Assessments based on collected performance data of on-premises VMs. | **Recommended Node size**: Based on CPU and memory utilization data along with node type, storage type, and FTT setting that you select for the assessment.
**As on-premises** | Assessments based on on-premises sizing. | **Recommended Node size**: Based on the on-premises VM size along with the node type, storage type, and FTT setting that you select for the assessment.

## How do I run an assessment?

There are a couple of ways to run an assessment.

- Assess machines by using server metadata collected by a lightweight Azure Migrate appliance. The appliance discovers on-premises machines. It then sends machine metadata and performance data to Azure Migrate.
- Assess machines by using server metadata that's imported in a comma-separated values (CSV) format.

## How do I assess with the appliance?

If you're deploying an Azure Migrate appliance to discover on-premises servers, do the following steps:

1. Set up Azure and your on-premises environment to work with Server Assessment.
2. For your first assessment, create an Azure project and add the Server Assessment tool to it.
3. Deploy a lightweight Azure Migrate appliance. The appliance continuously discovers on-premises machines and sends machine metadata and performance data to Azure Migrate. Deploy the appliance as a VM. You don't need to install anything on machines that you want to assess.

After the appliance begins machine discovery, you can gather machines you want to assess into a group and run an assessment for the group with assessment type **Azure VMware Solution (AVS)**.

Create your first Azure VMware Solution (AVS) assessment by following the steps [here](how-to-create-azure-vmware-solution-assessment.md).

## How do I assess with imported data?

If you're assessing servers by using a CSV file, you don't need an appliance. Instead, do the following steps:

1. Set up Azure to work with Server Assessment.
2. For your first assessment, create an Azure project and add the Server Assessment tool to it.
3. Download a CSV template and add server data to it.
4. Import the template into Server Assessment.
5. Discover servers added with the import, gather them into a group, and run an assessment for the group with assessment type **Azure VMware Solution (AVS)**.

## What data does the appliance collect?

If you're using the Azure Migrate appliance for assessment, learn about the metadata and performance data that's collected for [VMware](migrate-appliance.md#collected-data---vmware).

## How does the appliance calculate performance data?

If you use the appliance for discovery, it collects performance data for compute settings with these steps:

1. The appliance collects a real-time sample point.

    - **VMware VMs**: A sample point is collected every 20 seconds.

2. The appliance combines the sample points to create a single data point every 10 minutes. To create the data point, the appliance selects the peak values from all samples. It then sends the data point to Azure.
3. Server Assessment stores all the 10-minute data points for the last month.
4. When you create an assessment, Server Assessment identifies the appropriate data point to use for rightsizing. Identification is based on the percentile values for *performance history* and *percentile utilization*.

    - For example, if the performance history is one week and the percentile utilization is the 95th percentile, Server Assessment sorts the 10-minute sample points for the last week. It sorts them in ascending order and picks the 95th percentile value for rightsizing.
    - The 95th percentile value makes sure you ignore any outliers, which might be included if you picked the 99th percentile.
    - If you want to pick the peak usage for the period and don't want to miss any outliers, select the 99th percentile for percentile utilization.

5. This value is multiplied by the comfort factor to get the effective performance utilization data for these metrics that the appliance collects:

    - CPU utilization
    - RAM utilization
    - Disk IOPS (read and write)
    - Disk throughput (read and write)
    - Network throughput (in and out)

The following performance data is collected but not used in sizing recommendations for AVS assessments:
  - The disk IOPS and throughput data for every disk attached to the VM.
  - The network I/O to handle performance-based sizing for each network adapter attached to a VM.

## How are AVS assessments calculated?

Server Assessment uses the on-premises machines' metadata and performance data to calculate assessments. If you deploy the Azure Migrate appliance, assessment uses the data the appliance collects. But if you run an assessment imported using a CSV file, you provide the metadata for the calculation.

Calculations occur in these three stages:

1. **Calculate Azure VMware Solution (AVS) readiness**: Whether the on-premises VMs are suitable for migration to Azure VMware Solution (AVS).
2. **Calculate number of AVS nodes and Utilization across nodes**: Estimated number of AVS nodes required to run the VMs and projected CPU, memory, and storage utilization across all nodes.
3. **Monthly cost estimation**: The estimated monthly costs for all Azure VMware Solution (AVS) nodes running the on-premises VMs.

Calculations are in the preceding order. A machine server moves to a later stage only if it passes the previous one. For example, if a server fails the AVS readiness stage, it's marked as unsuitable for Azure. Sizing and cost calculations aren't done for that server

## What's in an Azure VMware Solution (AVS) assessment?

Here's what's included in an AVS assessment in Server Assessment:


| **Property** | **Details** 
| - | - 
| **Target location** | Specifies the AVS private cloud location to which you want to migrate.<br/><br/> AVS Assessment in Server Assessment currently supports these target regions: East US, West Europe, West US. 
| **Storage type** | Specifies the storage engine to be used in AVS.<br/><br/> AVS assessments only support vSAN as a default storage type. 
**Reserved Instances (RIs)** | This property helps you specify Reserved Instances in AVS. RIs are currently not supported for AVS nodes. 
**Node type** | Specifies the [AVS Node type](https://docs.microsoft.com/azure/azure-vmware/concepts-private-clouds-clusters) used to map the on-premises VMs. The default node type is AV36. <br/><br/> Azure Migrate will recommend a required number of nodes for the VMs to be migrated to AVS. 
**FTT Setting, RAID Level** | Specifies the applicable Failure to Tolerate and Raid combinations. The selected FTT option combined with the on-premises VM disk requirement will determine the total vSAN storage required in AVS. 
**Sizing criterion** | Sets the criteria to be used to *right-size* VMs for AVS. You can opt for *performance-based* sizing or *as on-premises* without considering the performance history. 
**Performance history** | Sets the duration to consider in evaluating the performance data of machines. This property is applicable only when the sizing criteria is *performance-based*. 
**Percentile utilization** | Specifies the percentile value of the performance sample set to be considered for right-sizing. This property is applicable only when the sizing is performance-based.
**Comfort factor** | Azure Migrate Server Assessment considers a buffer (comfort factor) during assessment. This buffer is applied on top of machine utilization data for VMs (CPU, memory, disk, and network). The comfort factor accounts for issues such as seasonal usage, short performance history, and likely increases in future usage.<br/><br/> For example, a 10-core VM with 20% utilization normally results in a 2-core VM. However, with a comfort factor of 2.0x, the result is a 4-core VM instead. 
**Offer** | Displays the [Azure offer](https://azure.microsoft.com/support/legal/offer-details/) you're enrolled in. Azure Migrate estimates the cost accordingly.
**Currency** | Shows the billing currency for your account. 
**Discount (%)** | Lists any subscription-specific discount you receive on top of the Azure offer. The default setting is 0%. 
**Azure Hybrid Benefit** | Specifies whether you have software assurance and are eligible for [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-use-benefit/). Although it has no impact on Azure VMware solutions pricing due to the node-based price, customers can still apply the on-premises OS licenses (Microsoft based) in AVS using Azure Hybrid Benefits. Other software OS vendors will have to provide their own licensing terms such as RHEL for example. 
**vCPU Oversubscription** | Specifies the ratio of number of virtual cores tied to one physical core in the AVS node. The default value in the calculations is 4 vCPU:1 physical core in AVS. <br/><br/> API users can set this value as an integer. Note that vCPU Oversubscription > 4:1 may impact workloads depending on their CPU usage. 


## Azure VMware Solution (AVS) suitability analysis

AVS Assessments in Server Assessment assess each on-premises VMs for its suitability for AVS by reviewing the machine properties. It also assigns each assessed machine to one of the following suitability categories:

- **Ready for AVS**: The machine can be migrated as-is to Azure (AVS) without any changes. It will start in AVS with full AVS support.
- **Ready with conditions**: The VM might have compatibility issues with the current vSphere version as well as requiring possibly VMware tools and or other settings before full functionality from the VM can be achieved in AVS.
- **Not ready for AVS**: The VM will not start in AVS. For example, if the on-premises VMware VM has an external device attached such as a cd-rom the VMware VMotion operation will fail (if using VMware VMotion).
- **Readiness unknown**: Azure Migrate couldn't determine the readiness of the machine because of insufficient metadata collected from the on-premises environment.

Server Assessment reviews the machine properties to determine the Azure readiness of the on-premises machine.

### Machine properties

Server Assessment reviews the following property of the on-premises VM to determine whether it can run on Azure VMware Solution (AVS).


| **Property** | **Details** | **AVS readiness status** 
| - | - | - 
| **Internet Protocol** | AVS currently does not support IPv6 internet addressing.<br/><br/> Contact your local MSFT AVS GBB team for guidance on remediation guidance if your machine is detected with IPv6.| Conditionally Ready Internet Protocol


### Guest operating system

Currently, AVS assessments do not review operating system as part of the suitability analysis. All operating systems running on on-premises VMs are likely to run on Azure VMware Solution (AVS).

Along with VM properties, Server Assessment looks at the guest operating system of the machines to determine whether it can run on Azure.


## Sizing

After a machine is marked as ready for AVS, AVS Assessment in Server Assessment makes node sizing recommendations, which involve identifying the appropriate on-premises VM requirements and finding the total number of AVS nodes required. These recommendations vary, depending on the assessment properties specified.

- If the assessment uses *performance-based sizing*, Azure Migrate considers the performance history of the machine to make the appropriate sizing recommendation for AVS. This method is especially helpful if you've over-allocated the on-premises VM, but utilization is low and you want to right-size the VM in AVS to save costs. This method will help you optimize the sizes during migration.
- If you don't want to consider the performance data for VM sizing and want to take the on-premises machines as-is to AVS, you can set the sizing criteria to *as on-premises*. Then, Server Assessment will size the VMs based on the on-premises configuration without considering the utilization data. 


### FTT Sizing Parameters

The storage engine used in AVS is vSAN. vSAN storage policies define storage requirements for your virtual machines. These policies guarantee the required level of service for your VMs because they determine how storage is allocated to the VM. The available FTT-Raid Combinations are: 

**Failures to Tolerate (FTT)** | **RAID Configuration** | **Minimum Hosts Required** | **Sizing consideration**
--- | --- | --- | --- 
1 | RAID-1 (Mirroring) | 3 | A 100GB VM would consume 200GB.
1 | RAID-5 (Erasure Coding) | 4 | A 100GB VM would consume 133.33GB
2 | RAID-1 (Mirroring) | 5 | A 100GB VM would consume 300GB.
2 | RAID-6 (Erasure Coding) | 6 | A 100GB VM would consume 150GB.
3 | RAID-1 (Mirroring) | 7 | A 100GB VM would consume 400GB.

### Performance-based sizing

For performance-based sizing, Server Assessment starts with the disks attached to the VM, followed by network adapters. It then maps the VM requirements to an appropriate no of nodes for AVS. The Azure Migrate appliance profiles the on-premises environment to collect performance data for CPU, memory, disks, and network adapter.

**Performance data collection steps:**

1. For VMware VMs, the Azure Migrate appliance collects a real-time sample point at every 20-second interval. 
2. The appliance rolls up the sample points collected every 10 minutes and sends the maximum value for the last 10 minutes to Server Assessment.
3. Server Assessment stores all the 10-minute sample points for the last one month. Then, depending on the assessment properties specified for *Performance history* and *Percentile utilization*, it identifies the appropriate data point to use for right-sizing. For example, if the performance history is set to 1 day and the percentile utilization is the 95th percentile, Server Assessment uses the 10-minute sample points for the last one day, sorts them in ascending order, and picks the 95th percentile value for right-sizing.
4. This value is multiplied by the comfort factor to get the effective performance utilization data for each metric (CPU utilization, memory utilization, disk IOPS (read and write), disk throughput (read and write), and network throughput (in and out) that the appliance collects.

After the effective utilization value is determined, the storage, network, and compute sizing is handled as follows.

**Storage sizing**: Azure Migrate uses the total on-premises VM disk space as a calculation parameter to determine AVS vSAN storage requirements in addition to the customer-selected FTT setting. FTT - Failures to tolerate as well as requiring a minimum no of nodes per FTT option will determine the total vSAN storage required combined with the VM disk requirement.

**Network sizing**: Server Assessment currently does not take any network settings into consideration for AVS Assessments.

**Compute sizing**: After it calculates storage requirements, Server Assessment considers CPU and memory requirements to determine the number of nodes required for AVS based on the node type.

- Based on the sizing criteria, Server Assessment looks at either the performance-based VM data or the on-premises VM configuration. The comfort factor setting allows for specifying growth factor of the cluster. Currently by default, hyperthreading is enabled and thus a 36 core nodes will have 72 vCores. 4 vCores per physical is used to determine CPU thresholds per cluster using the VMware standard of not exceeding 80% utilization to allow for maintenance or failures to be handled without compromising cluster availability. There is currently no override available to change the oversubscription values and we may have this in future versions.

### As on-premises sizing

If you use *as on-premises sizing*, Server Assessment doesn't consider the performance history of the VMs and disks. Instead, it allocates AVS nodes based on the size allocated on-premises. The default storage type is vSAN in AVS.

## Confidence ratings

Each performance-based assessment in Azure Migrate is associated with a confidence rating that ranges from one (lowest) to five stars (highest).

- The confidence rating is assigned to an assessment based on the availability of data points needed to compute the assessment.
- The confidence rating of an assessment helps you estimate the reliability of the size recommendations provided by Azure Migrate.
- Confidence ratings aren't applicable for *as on-premises* assessments.
- For performance-based sizing, AVS assessments in Server Assessment need the utilization data for CPU and VM memory. The following data is collected but not used in sizing recommendations for AVS:
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

- You didn't profile your environment for the duration for which you are creating the assessment. For example, if you create the assessment with performance duration set to one day, you must wait for at least a day after you start discovery for all the data points to get collected.
- Some VMs were shut down during the period for which the assessment was calculated. If any VMs are turned off for some duration, Server Assessment can't collect the performance data for that period.
- Some VMs were created during the period for which the assessment was calculated. For example, if you created an assessment for the performance history of the last month, but some VMs were created in the environment only a week ago, the performance history of the new VMs won't exist for the complete duration.

> [!NOTE]
> If the confidence rating of any assessment is less than five stars, we recommend that you wait at least a day for the appliance to profile the environment, and then recalculate the assessment. If you don't, performance-based sizing might not be reliable. In that case, we recommend that you switch the assessment to on-premises sizing.

## Monthly cost estimation

After sizing recommendations are complete, Azure Migrate calculates the total cost of running the on-premises workloads in AVS by multiplying the number of AVS nodes required by the node price. The cost per VM cost is calculated by dividing the total cost by the number of VMs in the assessment. 
- The calculation takes the number of nodes required, node type and location into account.
- It aggregates the cost across all nodes to calculate the total monthly cost.
- Costs are displayed in the currency specified in the assessment settings.

As the pricing for Azure VMware Solution (AVS) is per node, the total cost does not have compute cost and storage cost distribution. [Learn More](https://docs.microsoft.com/azure/azure-vmware/introduction)

Note that as Azure VMware Solution (AVS) is in Preview, the node prices in the assessment are Preview prices. Please contact your local MSFT AVS GBB team for guidance.

## Migration Tool Guidance

In the Azure readiness report for Azure VMware Solution (AVS) assessment, you can see the following suggested tools: 
- **VMware HCX or Enterprise**: For VMware machines, VMWare Hybrid Cloud Extension (HCX) solution is the suggested migration tool to migrate your on-premises workload to your Azure VMWare Solution (AVS) private cloud. [Learn More](https://docs.microsoft.com/azure/azure-vmware/hybrid-cloud-extension-installation).
- **Unknown**: For machines imported via a CSV file, the default migration tool is unknown. Though for VMware machines, it is recommended to use the VMWare Hybrid Cloud Extension (HCX) solution.

## Next steps

Create an assessment for [AVS VMware VMs](how-to-create-azure-vmware-solution-assessment.md).
