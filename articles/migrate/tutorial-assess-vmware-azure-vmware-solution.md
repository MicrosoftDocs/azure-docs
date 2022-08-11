---
title: Assess VMware servers for migration to Azure VMware Solution (AVS) with Azure Migrate
description: Learn how to assess servers in VMware environment for migration to AVS with Azure Migrate.
author: rashi-ms
ms.author: rajosh
ms.manager: abhemraj
ms.topic: tutorial
ms.date: 5/2/2022
ms.custom: MVC
#Customer intent: As a VMware VM admin, I want to assess my VMware VMs in preparation for migration to Azure VMware Solution (AVS)
---

# Tutorial: Assess VMware servers for migration to AVS

As part of your migration journey to Azure, you assess your on-premises workloads to measure cloud readiness, identify risks, and estimate costs and complexity.

This article shows you how to assess discovered VMware virtual machines/servers for migration to Azure VMware Solution (AVS), using the Azure Migrate. AVS is a managed service that allows you to run the VMware platform in Azure.

In this tutorial, you will learn how to:
> [!div class="checklist"]
- Run an assessment based on server metadata and configuration information.
- Run an assessment based on performance data.

> [!NOTE]
> Tutorials show the quickest path for trying out a scenario and using default options where possible. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.



## Prerequisites

Before you follow this tutorial to assess your servers for migration to AVS, make sure you've discovered the servers you want to assess:

- To discover servers using the Azure Migrate appliance, [follow this tutorial](tutorial-discover-vmware.md). 
- To discover servers using an imported CSV file, [follow this tutorial](tutorial-discover-import.md).


## Decide which assessment to run


Decide whether you want to run an assessment using sizing criteria based on server configuration data/metadata that's collected as-is on-premises, or on dynamic performance data.

**Assessment** | **Details** | **Recommendation**
--- | --- | ---
**As-is on-premises** | Assess based on server configuration data/metadata.  | Recommended node size in AVS is based on the on-premises VM/server size, along with the settings you specify in the assessment for the node type, storage type, and failure-to-tolerate setting.
**Performance-based** | Assess based on collected dynamic performance data. | Recommended node size in AVS is based on CPU and memory utilization data, along with the settings you specify in the assessment for the node type, storage type, and failure-to-tolerate setting.

> [!NOTE]
> Azure VMware Solution (AVS) assessment can be created for VMware VMs/servers only.

## Run an assessment

Run an assessment as follows:

1.  In **Servers, databases and web apps** > **Azure Migrate: Discovery and assessment**.

1. In **Azure Migrate: Discovery and assessment**, click **Assess**.

1. In **Assess servers** > **Assessment type**, select **Azure VMware Solution (AVS)**.

1. In **Discovery source**:

    - If you discovered servers using the appliance, select **Servers discovered from Azure Migrate appliance**.
    - If you discovered servers using an imported CSV file, select **Imported servers**. 
    
1. Click **Edit** to review the assessment properties.

    :::image type="content" source="./media/tutorial-assess-vmware-azure-vmware-solution/assess-servers.png" alt-text="Page for selecting the assessment settings":::
 

1. In **Assessment properties** > **Target Properties**:

    - In **Target location**, specify the Azure region to which you want to migrate.
       - Size and cost recommendations are based on the location that you specify.
   - The **Storage type** is defaulted to **vSAN**. This is the default storage type for an AVS private cloud.
   - In **Reserved Instance**, specify whether you want to use reserve instances for Azure VMware Solution nodes when you migrate your VMs.
    - If you decide to use a reserved instance, you can't specify **Discount (%)**.
    - [Learn more](../azure-vmware/reserved-instance.md) about reserved instances.
1. In **VM Size**:
    - The **Node type** is defaulted to **AV36**. Azure Migrate recommends the node of nodes needed to migrate the servers to AVS.
    - In **FTT setting, RAID level**, select the Failure to Tolerate and RAID combination.  The selected FTT option, combined with the on-premises server disk requirement, determines the total vSAN storage required in AVS.
    - In **CPU Oversubscription**, specify the ratio of virtual cores associated with one physical core in the AVS node. Oversubscription of greater than 4:1 might cause performance degradation, but can be used for web server type workloads.
    - In **Memory overcommit factor**, specify the ratio of memory over commit on the cluster. A value of 1 represents 100% memory use, 0.5 for example is 50%, and 2 would be using 200% of available memory. You can only add values from 0.5 to 10 up to one decimal place.
    - In **Dedupe and compression factor**, specify the anticipated dedupe and compression factor for your workloads. The actual value can be obtained from on-premises vSAN or storage config and this may vary by workload. A value of 3 would mean 3x so for a 300GB disk only 100GB storage would be used. A value of 1 would mean no dedupe or compression. You can only add values from 1 to 10 up to one decimal place.
1. In **Node Size**: 
    - In **Sizing criteria**, select if you want to base the assessment on static metadata, or on performance-based data. If you use performance data:
        - In **Performance history**, indicate the data duration on which you want to base the assessment
        - In **Percentile utilization**, specify the percentile value you want to use for the performance sample. 
    - In **Comfort factor**, indicate the buffer you want to use during assessment. This accounts for issues like seasonal usage, short performance history, and likely increases in future usage. For example, if you use a comfort factor of two:
    
        **Component** | **Effective utilization** | **Add comfort factor (2.0)**
        --- | --- | ---
        Cores | 2  | 4
        Memory | 8 GB | 16 GB  

1. In **Pricing**:
    - In **Offer/Licencing program**, [Azure offer](https://azure.microsoft.com/support/legal/offer-details/) you're enrolled in is displayed. The assessment estimates the cost for that offer.
    - In **Currency**, select the billing currency for your account.
    - In **Discount (%)**, add any subscription-specific discounts you receive on top of the Azure offer. The default setting is 0%.

1. Click **Save** if you make changes.

    :::image type="content" source="./media/tutorial-assess-vmware-azure-vmware-solution/avs-view-all.png" alt-text="Assessment properties":::

1. In **Assess Servers**, click **Next**.

1. In **Select servers to assess** > **Assessment name** > specify a name for the assessment. 
 
1. In **Select or create a group** > select **Create New** and specify a group name. 
    
    :::image type="content" source="./media/tutorial-assess-vmware-azure-vmware-solution/assess-group.png" alt-text="Add servers to a group":::
 
1. Select the appliance and select the servers that you want to add to the group. Then click **Next**.

1. In **Review + create assessment**, review the assessment details, and click **Create Assessment** to create the group and run the assessment.

    > [!NOTE]
    > For performance-based assessments, we recommend that you wait at least a day after starting discovery before you create an assessment. This provides time to collect performance data with higher confidence. Ideally, after you start discovery, wait for the performance duration you specify (day/week/month) for a high-confidence rating.

## Review an assessment

An AVS assessment describes:

- **Azure VMware Solution (AVS) readiness**: Whether the on-premises servers are suitable for migration to Azure VMware Solution (AVS).
- **Number of Azure VMware Solution nodes**: Estimated number of Azure VMware Solution nodes required to run the servers.
- **Utilization across AVS nodes**: Projected CPU, memory, and storage utilization across all nodes.
    - Utilization includes upfront factoring in the cluster management overheads such as the vCenter Server, NSX Manager (large),
NSX Edge, if HCX is deployed also the HCX Manager and IX appliance consuming ~ 44vCPU (11 CPU), 75GB of RAM and 722GB of storage before 
compression and deduplication.
    - Limiting factor determines the number of hosts/nodes required to accommodate the resources.
- **Monthly cost estimation**: The estimated monthly costs for all Azure VMware Solution (AVS) nodes running the on-premises VMs.

You can click on  **Sizing assumptions** to understand the assumptions that went in node sizing and resource utilization calculations. You can also edit the assessment properties or recalculate the assessment.

## View an assessment

To view an assessment:

1. In **Servers, databases and web apps** > **Azure Migrate: Discovery and assessment**, click the number next to **Azure VMware Solution**.

1. In **Assessments**, select an assessment to open it. As an example (estimations and costs for example only): 

    :::image type="content" source="./media/tutorial-assess-vmware-azure-vmware-solution/avs-assessment-summary.png" alt-text="AVS Assessment summary":::

1. Review the assessment summary.
 

### Review readiness

1. Click **Azure readiness**.
2. In **Azure readiness**, review the readiness status.

    - **Ready for AVS**: The server can be migrated as-is to Azure (AVS) without any changes. It will start in AVS with full AVS support.
    - **Ready with conditions**: There might be some compatibility issues, for example, internet protocol or deprecated OS in VMware and need to be remediated before migrating to Azure VMware Solution. To fix any readiness problems, follow the remediation guidance that the assessment suggests.
    - **Not ready for AVS**: The VM will not start in AVS. For example, if the on-premises VMware VM has an external device attached such as a CD-ROM the VMware VMotion operation will fail (if using VMware VMotion).
    - **Readiness unknown**: Azure Migrate couldn't determine the readiness of the server because of insufficient metadata collected from the on-premises environment.
3. Review the suggested tool.

    - VMware HCX or Enterprise: For VMware servers, the VMware Hybrid Cloud Extension (HCX) solution is the suggested migration tool to migrate your on-premises workload to your Azure VMware Solution (AVS) private cloud.
    - Unknown: For servers imported via a CSV file, the default migration tool is unknown. Though for VMware servers, it is suggested to use the VMware Hybrid Cloud Extension (HCX) solution.
4. Click on an AVS readiness status. You can view the server readiness details, and drill down to see server details, including compute, storage, and network settings.

### Review cost estimates

The assessment summary shows the estimated compute and storage cost of running servers in Azure. 

1. Review the monthly total costs. Costs are aggregated for all servers in the assessed group.

    - Cost estimates are based on the number of AVS nodes required considering the resource requirements of all the servers in total.
    - As the pricing is per node, the total cost does not have compute cost and storage cost distribution.
    - The cost estimation is for running the on-premises servers in AVS. The AVS assessment doesn't consider PaaS or SaaS costs.

2. Review monthly storage estimates. The view shows the aggregated storage costs for the assessed group, split over different types of storage disks. 
3. You can drill down to see cost details for specific servers.

### Review confidence rating

Server Assessment assigns a confidence rating to performance-based assessments. Rating is from one star (lowest) to five stars (highest).

The confidence rating helps you estimate the reliability of size recommendations in the assessment. The rating is based on the availability of data points needed to compute the assessment.

> [!NOTE]
> Confidence ratings aren't assigned if you create an assessment based on a CSV file.

Confidence ratings are as follows.

**Data point availability** | **Confidence rating**
--- | ---
0%-20% | 1 star
21%-40% | 2 stars
41%-60% | 3 stars
61%-80% | 4 stars
81%-100% | 5 stars

[Learn more](concepts-assessment-calculation.md#confidence-ratings-performance-based) about confidence ratings.

## Next steps

- Find server dependencies using [dependency mapping](concepts-dependency-visualization.md).
- Set up [agentless](how-to-create-group-machine-dependencies-agentless.md) or [agent-based](how-to-create-group-machine-dependencies.md) dependency mapping.
