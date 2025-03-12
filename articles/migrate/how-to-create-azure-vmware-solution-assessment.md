---
title: Create an AVS assessment with Azure Migrate | Microsoft Docs
description: Describes how to create an AVS assessment with Azure Migrate
author: rashi-ms
ms.author: rajosh
ms.manager: abhemraj
ms.service: azure-migrate
ms.topic: how-to
ms.date: 11/07/2024
---



# Create an Azure VMware Solution assessment

This article describes how to create an Azure VMware Solution assessment for on-premises VMs in a VMware vSphere environment with Azure Migrate: Discovery and assessment.

[Azure Migrate](migrate-services-overview.md) helps you to migrate to Azure. Azure Migrate provides a centralized hub to track discovery, assessment, and migration of on-premises infrastructure, applications, and data to Azure. The hub provides Azure tools for assessment and migration, as well as Partner independent software vendor (ISV) offerings.

## Before you start

- [Create](./create-manage-projects.md) an Azure Migrate project.
- [Add](how-to-assess.md) the Azure Migrate: Discovery and assessment tool if you've already created a project.
- Set up an Azure Migrate appliance for [VMware vSphere](how-to-set-up-appliance-vmware.md), which discovers the on-premises servers, and sends metadata and performance data to Azure Migrate: Discovery and assessment. [Learn more](migrate-appliance.md).
- [Import](./tutorial-discover-import.md) the server metadata in comma-separated values (CSV) format or [import your RVTools XLSX file](tutorial-import-vmware-using-rvtools-xlsx.md).


## Azure VMware Solution (AVS) Assessment overview

There are four types of assessments you can create using Azure Migrate: Discovery and assessment.

**Assessment Type** | **Details**
--- | --- 
**Azure VM** | Assessments to migrate your on-premises servers to Azure virtual machines. You can assess your on-premises VMs in [VMware vSphere](how-to-set-up-appliance-vmware.md) and [Hyper-V](how-to-set-up-appliance-hyper-v.md) environment, and [physical servers](how-to-set-up-appliance-physical.md) for migration to Azure VMs using this assessment type.
**Azure SQL** | Assessments to migrate your on-premises SQL servers from your VMware environment to Azure SQL Database or Azure SQL Managed Instance.
**Azure App Service** | Assessments to migrate your on-premises ASP.NET/Java web apps, running on IIS web servers, from your VMware vSphere environment to Azure App Service.
**Azure VMware Solution (AVS)** | Assessments to migrate your on-premises servers to [Azure VMware Solution (AVS)](../azure-vmware/introduction.md). You can assess your on-premises VMs in [VMware vSphere environment](how-to-set-up-appliance-vmware.md) for migration to Azure VMware Solution (AVS) using this assessment type. [Learn more](concepts-azure-vmware-solution-assessment-calculation.md)

> [!NOTE]
> Azure VMware Solution (AVS) assessment can be created for virtual machines in VMware vSphere environment only.


There are two types of sizing criteria that you can use to create Azure VMware Solution (AVS) assessments:

**Assessment** | **Details** | **Data**
--- | --- | ---
**Performance-based** | For RVTools and CSV file-based assessments and performance-based assessments, the assessment considers the **In Use MiB** and **Storage In Use** respectively for storage configuration of each VM. For appliance-based assessments and performance-based assessments, the assessment considers the collected CPU & memory performance data of on-premises servers. | **Recommended Node size**: Based on CPU and memory utilization data along with node type, storage type, and FTT setting that you select for the assessment.
**As on-premises** | Assessments based on on-premises sizing. | **Recommended Node size**: Based on the on-premises server size along with the node type, storage type, and FTT setting that you select for the assessment.

## Run an Azure VMware Solution (AVS) assessment

1. In **Servers, databases and web apps**, select **Assess and migrate servers**.

1. In **Azure Migrate: Discovery and assessment**, select **Assess**.

1. In **Assess servers** > **Assessment type**, select **Azure VMware Solution (AVS)**.

1. In **Discovery source**:

    - If you discovered servers using the appliance, select **Servers discovered from Azure Migrate appliance**.
    - If you discovered servers using an imported CSV or RVTools file, select **Imported servers**. 
    
1. Select **Edit** to review the assessment properties.

    :::image type="content" source="./media/tutorial-assess-vmware-azure-vmware-solution/assess-servers.png" alt-text="Page for selecting the assessment settings":::
 

1. In **Assessment properties** > **Target Properties**:

    - In **Target location**, specify the Azure region to which you want to migrate.
       - Size and cost recommendations are based on the location that you specify.
    - The **Storage type** is defaulted to **vSAN** and **Azure NetApp Files (ANF) - Standard**, **ANF - Premium**, and **ANF - Ultra** tiers. ANF is an external storage type in AVS that will be used when storage is the limiting factor considering the configuration/performance of the incoming VMs. When performance metrics are provided using the Azure Migrate appliance or the CSV, the assessment selects the tier that satisfies the performance requirements of the incoming VMs’ disks. If the assessment is performed using a RVTools file or without providing performance metrics like throughput and IOPS, **ANF - Standard** tier is used for assessment by default. 
   - In **Reserved Instances**, specify whether you want to use reserve instances for Azure VMware Solution nodes when you migrate your VMs.
    - If you select to use a reserved instance, you can't specify '**Discount (%)**. [Learn more](../azure-vmware/reserved-instance.md).
1. In **VM Size**:
    - The **Node type** is defaulted to **AV36**. Azure Migrate recommends the number of nodes needed to migrate the servers to Azure VMware Solution.
    - In **FTT setting, RAID level**, select the Failure to Tolerate and RAID combination. The selected FTT option, combined with the on-premises server disk requirement, determines the total vSAN storage required in AVS.
    - In **CPU Oversubscription**, specify the ratio of virtual cores associated with one physical core in the AVS node. Oversubscription of greater than 4:1 might cause performance degradation, but can be used for web server type workloads.
    - In **Memory overcommit factor**, specify the ratio of memory over commit on the cluster. A value of 1 represents 100% memory use, 0.5, for example, is 50%, and 2 would be using 200% of available memory. You can only add values from 0.5 to 10 up to one decimal place.
    - In **Dedupe and compression factor**, specify the anticipated deduplication and compression factor for your workloads. Actual value can be obtained from on-premises vSAN or storage config and this might vary by workload. A value of 3 would mean 3x so for 300 GB disk only 100 GB storage would be used. A value of 1 would mean no dedupe or compression. You can only add values from 1 to 10 up to one decimal place.
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
    - In **Offer**, [Azure offer](https://azure.microsoft.com/support/legal/offer-details/) you're enrolled in is displayed. The Assessment estimates the cost for that offer.
    - In **Currency**, select the billing currency for your account.
    - In **Discount (%)**, add any subscription-specific discounts you receive on top of the Azure offer. The default setting is 0%.

1. Select **Save** if you make changes.

    :::image type="content" source="./media/tutorial-assess-vmware-azure-vmware-solution/avs-view-all-inline.png" alt-text="Assessment properties" lightbox="./media/tutorial-assess-vmware-azure-vmware-solution/avs-view-all-expanded.png":::

1. In **Assess Servers**, select **Next**.

1. In **Select servers to assess** > **Assessment name** > specify a name for the assessment. 
 
1. In **Select or create a group** > select **Create New** and specify a group name. 
    
    :::image type="content" source="./media/tutorial-assess-vmware-azure-vmware-solution/assess-group.png" alt-text="Add servers to a group":::
 
1. Select the appliance, and select the servers you want to add to the group. Then select **Next**.

1. In **Review + create assessment**, review the assessment details, and select **Create Assessment** to create the group and run the assessment.

    > [!NOTE]
    > For performance-based assessments, we recommend that you wait at least a day after starting discovery before you create an assessment. This provides time to collect performance data with higher confidence. Ideally, after you start discovery, wait for the performance duration you specify (day/week/month) for a high-confidence rating.


## Review an Azure VMware Solution (AVS) assessment

An Azure VMware Solution (AVS) assessment describes:

- **Azure VMware Solution (AVS) readiness**: Whether the on-premises VMs are suitable for migration to Azure VMware Solution (AVS).
- **Number of Azure VMware Solution nodes**: Estimated number of Azure VMware Solution nodes required to run the servers.
- **Utilization across AVS nodes**: Projected CPU, memory, and storage utilization across all nodes.
    - Utilization includes up front factoring in the following cluster management overheads such as the vCenter Server, NSX Manager (large), NSX Edge, if HCX is deployed also the HCX Manager and IX appliance consuming ~ 44vCPU (11 CPU), 75 GB of RAM and 722 GB of storage before compression and deduplication.
    - Limiting factor determines the number of hosts/nodes required to accommodate the resources.
- **Monthly cost estimation**: The estimated monthly costs for all Azure VMware Solution (AVS) nodes running the on-premises VMs.

You can select  **Sizing assumptions** to understand the assumptions that went in node sizing and resource utilization calculations. You can also edit the assessment properties, or recalculate the assessment.

### View an assessment

1. In **Windows, Linux and SQL Server** > **Azure Migrate: Discovery and assessment**, select the number next to **Azure VMware Solution**.

1. In **Assessments**, select an assessment to open it. As an example (estimations and costs, for example,  only): 

    :::image type="content" source="./media/tutorial-assess-vmware-azure-vmware-solution/avs-assessment-summary-inline.png" alt-text="Assessment Summary" lightbox="./media/tutorial-assess-vmware-azure-vmware-solution/avs-assessment-summary-expanded.png":::

1. Review the assessment summary. You can select  **Sizing assumptions** to understand the assumptions that went in node sizing and resource utilization calculations. You can also edit the assessment properties, or recalculate the assessment.

   :::image type="content" source="./media/tutorial-assess-vmware-azure-vmware-solution/avs-utilization-inline.png" alt-text="Screenshot of AVS Utilization summary." lightbox="./media/tutorial-assess-vmware-azure-vmware-solution/avs-utilization-expanded.png":::

### Review Azure VMware Solution (AVS) readiness

1. In **Azure readiness**, verify whether servers are ready for migration to AVS.

2. [Review](concepts-azure-vmware-solution-assessment-calculation.md#server-properties) the server status:
    - **Ready for AVS**: The server can be migrated as-is to Azure (AVS) without any changes. It starts in AVS with full AVS support.
    - **Ready with conditions**: There might be some compatibility issues, for example, internet protocol or deprecated OS in VMware and need to be remediated before migrating to Azure VMware Solution. To fix any readiness problems, follow the remediation guidance the assessment suggests.
    - **Not ready for AVS**: The VM won't start in AVS. For example, if the on-premises VMware VM has an external device attached such as a cd-rom the VMware vMotion operation fails (if using VMware vMotion).
    - **Readiness unknown**: Azure Migrate couldn't determine the readiness of the server because of insufficient metadata collected from the on-premises environment.

3. Review the Suggested tool:
    - **VMware HCX Advanced or Enterprise**: For VMware vSphere VMs, VMware Hybrid Cloud Extension (HCX) solution is the suggested migration tool to migrate your on-premises workload to your Azure VMware Solution (AVS) private cloud. [Learn More](../azure-vmware/configure-vmware-hcx.md).
    - **Unknown**: For servers imported via a CSV or RVTools file, the default migration tool is unknown. Though for VMware vSphere VMs, it's suggested to use the VMware Hybrid Cloud Extension (HCX) solution. 

4. Select an **AVS readiness** status. You can view VM readiness details, and drill down to see VM details, including compute, storage, and network settings.

### Review cost details

This view shows the estimated cost of running servers in Azure VMware Solution.

1. Review the monthly total costs. Costs are aggregated for all servers in the assessed group. 

    - Cost estimates are based on the number of AVS nodes required considering the resource requirements of all the  servers in total.
    - As the pricing for Azure VMware Solution is per node, the total cost doesn't have compute cost and storage cost distribution.
    - The cost estimation is for running the on-premises servers in AVS. AVS assessment doesn't consider PaaS or SaaS costs.

2. Review Estimated AVS cost: This cost indicates the estimated monthly AVS cost that would be incurred for hosting the VMs imported or discovered. It includes categorical costs of the AVS nodes, external storage costs, and the associated networking costs (if applicable).
    
2. You can review monthly storage cost estimates. This view shows aggregated storage costs for the assessed group, split over different types of storage disks.

3. You can drill down to see details for specific servers.


### Review confidence rating

When you run performance-based assessments, a confidence rating is assigned to the assessment.

- A rating from 1-star (lowest) to 5-star (highest) is awarded.
- The confidence rating helps you estimate the reliability of the size recommendations provided by the assessment.
- The confidence rating is based on the availability of data points needed to compute the assessment.
- For performance-based sizing, AVS assessments need the utilization data for CPU and server memory. The following performance data is collected but not used in sizing recommendations for AVS assessments:
  - The disk IOPS and throughput data for every disk attached to the server.
  - The network I/O to handle performance-based sizing for each network adapter attached to a server.

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
- [Learn more](concepts-azure-vmware-solution-assessment-calculation.md) about how Azure VMware Solution assessments are calculated.
