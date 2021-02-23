---
title: Create an AVS assessment with Azure Migrate Server Assessment | Microsoft Docs
description: Describes how to create an AVS assessment with the Azure Migrate Server Assessment tool
author: rashi-ms
ms.author: rajosh
ms.manager: abhemraj
ms.topic: how-to
ms.date: 06/26/2020
---



# Create an Azure VMware Solution (AVS) assessment

This article describes how to create an Azure VMware Solution (AVS) assessment for on-premises VMware VMs with Azure Migrate: Server Assessment.

[Azure Migrate](migrate-services-overview.md) helps you to migrate to Azure. Azure Migrate provides a centralized hub to track discovery, assessment, and migration of on-premises infrastructure, applications, and data to Azure. The hub provides Azure tools for assessment and migration, as well as third-party independent software vendor (ISV) offerings.

## Before you start

- Make sure you've [created](./create-manage-projects.md) an Azure Migrate project.
- If you've already created a project, make sure you've [added](how-to-assess.md) the Azure Migrate: Server Assessment tool.
- To create an assessment, you need to set up an Azure Migrate appliance for [VMware](how-to-set-up-appliance-vmware.md), which discovers the on-premises machines, and sends metadata and performance data to Azure Migrate: Server Assessment. [Learn more](migrate-appliance.md).
- You could also [import the server metadata](./tutorial-discover-import.md) in comma-separated values (CSV) format.


## Azure VMware Solution (AVS) Assessment overview

There are two types of assessments you can create using Azure Migrate: Server Assessment.

**Assessment Type** | **Details**
--- | --- 
**Azure VM** | Assessments to migrate your on-premises servers to Azure virtual machines. <br/><br/> You can assess your on-premises [VMware VMs](how-to-set-up-appliance-vmware.md), [Hyper-V VMs](how-to-set-up-appliance-hyper-v.md), and [physical servers](how-to-set-up-appliance-physical.md) for migration to Azure using this assessment type.[Learn more](concepts-assessment-calculation.md)
**Azure VMware Solution (AVS)** | Assessments to migrate your on-premises servers to [Azure VMware Solution (AVS)](../azure-vmware/introduction.md). <br/><br/> You can assess your on-premises [VMware VMs](how-to-set-up-appliance-vmware.md) for migration to Azure VMware Solution (AVS) using this assessment type.[Learn more](concepts-azure-vmware-solution-assessment-calculation.md)

> [!NOTE]
> Azure VMware Solution (AVS) assessment can be created for VMware VMs only.


There are two types of sizing criteria that you can use to create Azure VMware Solution (AVS) assessments:

**Assessment** | **Details** | **Data**
--- | --- | ---
**Performance-based** | Assessments based on collected performance data of on-premises VMs. | **Recommended Node size**: Based on CPU and memory utilization data along with node type, storage type, and FTT setting that you select for the assessment.
**As on-premises** | Assessments based on on-premises sizing. | **Recommended Node size**: Based on the on-premises VM size along with the node type, storage type, and FTT setting that you select for the assessment.


## Run an Azure VMware Solution (AVS) assessment

1. On the **Servers** page > **Windows and Linux servers**, click **Assess and migrate servers**.

   ![Location of Assess and migrate servers button](./media/tutorial-assess-vmware-azure-vmware-solution/assess.png)

1. In **Azure Migrate: Server Assessment**, click **Assess**.

1. In **Assess servers** > **Assessment type**, select **Azure VMware Solution (AVS)**.

1. In **Discovery source**:

    - If you discovered machines using the appliance, select **Machines discovered from Azure Migrate appliance**.
    - If you discovered machines using an imported CSV file, select **Imported machines**. 
    
1. Click **Edit** to review the assessment properties.

    :::image type="content" source="./media/tutorial-assess-vmware-azure-vmware-solution/assess-servers.png" alt-text="Page for selecting the assessment settings":::
 

1. In **Assessment properties** > **Target Properties**:

    - In **Target location**, specify the Azure region to which you want to migrate.
       - Size and cost recommendations are based on the location that you specify.
   - The **Storage type** is defaulted to **vSAN**. This is the default storage type for an AVS private cloud.
   - **Reserved Instances** aren't currently supported for AVS nodes.
1. In **VM Size**:
    - The **Node type** is defaulted to **AV36**. Azure Migrate recommends the node of nodes needed to migrate the VMs to AVS.
    - In **FTT setting, RAID level**, select the Failure to Tolerate and RAID combination.  The selected FTT option, combined with the on-premises VM disk requirement, determines the total vSAN storage required in AVS.
    - In **CPU Oversubscription**, specify the ratio of virtual cores associated with one physical core in the AVS node. Oversubscription of greater than 4:1 might cause performance degradation, but can be used for web server type workloads.
    - In **Memory overcommit factor**, specify the ratio of memory over commit on the cluster. A value of 1 represents 100% memory use, 0.5 for example is 50%, and 2 would be using 200% of available memory. You can only add values from 0.5 to 10 up to one decimal place.
    - In **Dedupe and compression factor**, specify the anticipated dedupe and compression factor for your workloads. Actual value can be obtained from on-premises vSAN or storage config and this may vary by workload. A value of 3 would mean 3x so for 300GB disk only 100GB storage would be used. A value of 1 would mean no dedupe or compression. You can only add values from 1 to 10 up to one decimal place.
1. In **Node Size**: 
    - In **Sizing criterion**, select if you want to base the assessment on static metadata, or on performance-based data. If you use performance data:
        - In **Performance history**, indicate the data duration on which you want to base the assessment
        - In **Percentile utilization**, specify the percentile value you want to use for the performance sample. 
    - In **Comfort factor**, indicate the buffer you want to use during assessment. This accounts for issues like seasonal usage, short performance history, and likely increases in future usage. For example, if you use a comfort factor of two:
    
        **Component** | **Effective utilization** | **Add comfort factor (2.0)**
        --- | --- | ---
        Cores | 2  | 4
        Memory | 8 GB | 16 GB  

1. In **Pricing**:
    - In **Offer**, [Azure offer](https://azure.microsoft.com/support/legal/offer-details/) you're enrolled in is displayed Server Assessment estimates the cost for that offer.
    - In **Currency**, select the billing currency for your account.
    - In **Discount (%)**, add any subscription-specific discounts you receive on top of the Azure offer. The default setting is 0%.

1. Click **Save** if you make changes.

    :::image type="content" source="./media/tutorial-assess-vmware-azure-vmware-solution/avs-view-all.png" alt-text="Assessment properties":::

1. In **Assess Servers**, click **Next**.

1. In **Select machines to assess** > **Assessment name** > specify a name for the assessment. 
 
1. In **Select or create a group** > select **Create New** and specify a group name. 
    
    :::image type="content" source="./media/tutorial-assess-vmware-azure-vmware-solution/assess-group.png" alt-text="Add VMs to a group":::
 
1. Select the appliance, and select the VMs you want to add to the group. Then click **Next**.

1. In **Review + create assessment**, review the assessment details, and click **Create Assessment** to create the group and run the assessment.

    > [!NOTE]
    > For performance-based assessments, we recommend that you wait at least a day after starting discovery before you create an assessment. This provides time to collect performance data with higher confidence. Ideally, after you start discovery, wait for the performance duration you specify (day/week/month) for a high-confidence rating.


## Review an Azure VMware Solution (AVS) assessment

An Azure VMware Solution (AVS) assessment describes:

- **Azure VMware Solution (AVS) readiness**: Whether the on-premises VMs are suitable for migration to Azure VMware Solution (AVS).
- **Number of AVS nodes**: Estimated number of AVS nodes required to run the VMs.
- **Utilization across AVS nodes**: Projected CPU, memory, and storage utilization across all nodes.
    - Utilization includes up front factoring in the following cluster management overheads such as the vCenter Server, NSX Manager (large),
NSX Edge, if HCX is deployed also the HCX Manager and IX appliance consuming ~ 44vCPU (11 CPU), 75GB of RAM and 722GB of storage before 
compression and deduplication.
- **Monthly cost estimation**: The estimated monthly costs for all Azure VMware Solution (AVS) nodes running the on-premises VMs.


### View an assessment

1. In **Migration goals** >  **Servers**, click **Assessments** in **Azure Migrate: Server Assessment**.

2. In **Assessments**, click on an assessment to open it.

    :::image type="content" source="./media/how-to-create-avs-assessment/avs-assessment-summary.png" alt-text="AVS Assessment summary":::

### Review Azure VMware Solution (AVS) readiness

1. In **Azure readiness**, verify whether VMs are ready for migration to AVS.

2. Review the VM status:
    - **Ready for AVS**: The machine can be migrated as-is to Azure (AVS) without any changes. It will start in AVS with full AVS support.
    - **Ready with conditions**: The VM might have compatibility issues with the current vSphere version as well as requiring possibly VMware tools and or other settings before full functionality from the VM can be achieved in AVS.
    - **Not ready for AVS**: The VM will not start in AVS. For example, if the on-premises VMware VM has an external device attached such as a cd-rom the VMotion operation will fail (if using VMware VMotion).
    - **Readiness unknown**: Azure Migrate couldn't determine the readiness of the machine because of insufficient metadata collected from the on-premises environment.

3. Review the Suggested tool:
    - **VMware HCX or Enterprise**: For VMware machines, VMware Hybrid Cloud Extension (HCX) solution is the suggested migration tool to migrate your on-premises workload to your Azure VMware Solution (AVS) private cloud. [Learn More](../azure-vmware/tutorial-deploy-vmware-hcx.md).
    - **Unknown**: For machines imported via a CSV file, the default migration tool is unknown. Though for VMware machines, it is suggested to use the VMware Hybrid Cloud Extension (HCX) solution. 

4. Click on an **AVS readiness** status. You can view VM readiness details, and drill down to see VM details, including compute, storage, and network settings.

### Review cost details

This view shows the estimated cost of running VMs in Azure VMware Solution (AVS).

1. Review the monthly total costs. Costs are aggregated for all VMs in the assessed group. 

    - Cost estimates are based on the number of AVS nodes required considering the resource requirements of all the  VMs in total.
    - As the pricing for Azure VMware Solution (AVS) is per node, the total cost does not have compute cost and storage cost distribution.
    - The cost estimation is for running the on-premises VMs in AVS. AVS assessment doesn't consider PaaS or SaaS costs.
    
2. You can review monthly storage cost estimates. This view shows aggregated storage costs for the assessed group, split over different types of storage disks.

3. You can drill down to see details for specific VMs.


### Review confidence rating

When you run performance-based assessments, a confidence rating is assigned to the assessment.

![Confidence rating](./media/how-to-create-assessment/confidence-rating.png)

- A rating from 1-star (lowest) to 5-star (highest) is awarded.
- The confidence rating helps you estimate the reliability of the size recommendations provided by the assessment.
- The confidence rating is based on the availability of data points needed to compute the assessment.
- For performance-based sizing, AVS assessments in Server Assessment need the utilization data for CPU and VM memory. The following performance data is collected but not used in sizing recommendations for AVS assessments:
  - The disk IOPS and throughput data for every disk attached to the VM.
  - The network I/O to handle performance-based sizing for each network adapter attached to a VM.

Confidence ratings for an assessment are as follows.

**Data point availability** | **Confidence rating**
--- | ---
0%-20% | 1 Star
21%-40% | 2 Star
41%-60% | 3 Star
61%-80% | 4 Star
81%-100% | 5 Star

[Learn more](concepts-azure-vmware-solution-assessment-calculation.md) about performance data 


## Next steps

- Learn how to use [dependency mapping](how-to-create-group-machine-dependencies.md) to create high confidence groups.
- [Learn more](concepts-azure-vmware-solution-assessment-calculation.md) about how AVS assessments are calculated.