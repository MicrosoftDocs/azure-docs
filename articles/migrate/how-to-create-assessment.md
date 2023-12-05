---
title: Create an Azure VM assessment with Azure Migrate Discovery and assessment tool | Microsoft Docs
description: Describes how to create an Azure VM assessment with the Azure Migrate Discovery and assessment tool
author: rashi-ms
ms.author: rajosh
ms.manager: abhemraj
ms.service: azure-migrate
ms.topic: how-to
ms.date: 10/21/2022
ms.custom: engagement-fy23
---



# Create an Azure VM assessment

This article describes how to create an Azure VM assessment for on-premises servers in your VMware, Hyper-V or physical/other cloud environments with Azure Migrate: Discovery and assessment.

[Azure Migrate](migrate-services-overview.md) helps you to migrate to Azure. Azure Migrate provides a centralized hub to track discovery, assessment, and migration of on-premises infrastructure, applications, and data to Azure. The hub provides Azure tools for assessment and migration, as well as third-party Independent Software Vendor (ISV) offerings. 

## Before you start

- Make sure you've [created](./create-manage-projects.md) an Azure Migrate project.
- If you've already created a project, make sure you've [added](how-to-assess.md) the Azure Migrate: Discovery and assessment tool.
- To create an assessment, you need to set up an Azure Migrate appliance for [VMware](how-to-set-up-appliance-vmware.md) or [Hyper-V](how-to-set-up-appliance-hyper-v.md). The appliance discovers on-premises servers, and sends metadata and performance data to Azure Migrate: Discovery and assessment. [Learn more](migrate-appliance.md).


## Azure VM Assessment overview
There are two types of sizing criteria that you can use to create an Azure VM assessment using Azure Migrate: Discovery and assessment.

**Assessment** | **Details** | **Data**
--- | --- | ---
**Performance-based** | Assessments based on collected performance data. | **Recommended VM size**: Based on CPU and memory utilization data.<br/><br/> **Recommended disk type (standard or premium managed disk)**: Based on the IOPS and throughput of the on-premises disks.
**As on-premises** | Assessments based on on-premises sizing. | **Recommended VM size**: Based on the on-premises VM size.<br/><br> **Recommended disk type**: Based on the storage type setting you select for the assessment.

[Learn more](concepts-assessment-calculation.md) about assessments.

## Run an assessment

Run an assessment as follows:

1. On the **Get started** page > **Servers, databases and web apps**, select **Discover, assess and migrate**.

   :::image type="content" source="./media/tutorial-assess-vmware-azure-vm/assess.png" alt-text="Screenshot of Get started screen.":::

2. In **Azure Migrate: Discovery and assessment**, select **Assess** and select **Azure VM**.

    :::image type="content" source="./media/tutorial-assess-vmware-azure-vm/assess-servers.png" alt-text="Screenshot of Assess VM selection.":::

3. The **Create assessment** wizard appears with **Azure VM** as the **Assessment type**.
4. In **Discovery source**:

    - If you discovered servers using the appliance, select **Servers discovered from Azure Migrate appliance**.
    - If you discovered servers using an imported CSV file, select **Imported servers**. 
    
1. Select **Edit** to review the assessment properties.

    :::image type="content" source="./media/tutorial-assess-vmware-azure-vm/assessment-name.png" alt-text="Screenshot of View all button to review assessment properties.":::
    

1. In **Assessment properties** > **Target Properties**:
    - In **Target location**, specify the Azure region to which you want to migrate.
        - Size and cost recommendations are based on the location that you specify. Once you change the target location from default, you'll be prompted to specify **Reserved Instances** and **VM series**.
        - In Azure Government, you can target assessments in [these regions](migrate-support-matrix.md#azure-government).
    - In **Storage type**,
        - If you want to use performance-based data in the assessment, select **Automatic** for Azure Migrate to recommend a storage type, based on disk IOPS and throughput.
        - Alternatively, select the storage type you want to use for VM when you migrate it.
- In **Savings options (compute)**, specify the savings option that you want the assessment to consider to help optimize your Azure compute cost. 
        - [Azure reservations](../cost-management-billing/reservations/save-compute-costs-reservations.md) (1 year or 3 year reserved) are a good option for the most consistently running resources.
        - [Azure Savings Plan](../cost-management-billing/savings-plan/savings-plan-compute-overview.md) (1 year or 3 year savings plan) provide additional flexibility and automated cost optimization. Ideally post migration, you could use Azure reservation and savings plan at the same time (reservation will be consumed first), but in the Azure Migrate assessments, you can only see cost estimates of 1 savings option at a time. 
        - When you select 'None', the Azure compute cost is based on the Pay as you go rate or based on actual usage.
        - You need to select pay-as-you-go in offer/licensing program to be able to use Reserved Instances or Azure Savings Plan. When you select any savings option other than 'None', the 'Discount (%)' and 'VM uptime' properties are not applicable.
 1. In **VM Size**:
     - In **Sizing criterion**, select if you want to base the assessment on server configuration data/metadata, or on performance-based data. If you use performance data:
        - In **Performance history**, indicate the data duration on which you want to base the assessment.
        - In **Percentile utilization**, specify the percentile value you want to use for the performance sample. 
    - In **VM Series**, specify the Azure VM series that you want to consider.
        - If you're using performance-based assessment, Azure Migrate suggests a value for you.
        - Tweak the settings as needed. For example, if you don't have a production environment that needs A-series VMs in Azure, you can exclude A-series from the list of series.
    - In **Comfort factor**, indicate the buffer you want to use during assessment. This accounts for issues like seasonal usage, short performance history, and likely increases in future usage. For example, if you use a comfort factor of two:
    
        **Component** | **Effective utilization** | **Add comfort factor (2.0)**
        --- | --- | ---
        Cores | 2  | 4
        Memory | 8 GB | 16 GB
   
1. In **Pricing**:
    - In **Offer**, specify the [Azure offer](https://azure.microsoft.com/support/legal/offer-details/) if you're enrolled. The assessment estimates the cost for that offer.
    - In **Currency**, select the billing currency for your account.
    - In **Discount (%)**, add any subscription-specific discounts you receive on top of the Azure offer. The default setting is 0%.
    - In **VM Uptime**, specify the duration (days per month/hour per day) that the VMs will run.
        - This is useful for Azure VMs that won't run continuously.
        - Cost estimates are based on the duration specified.
        - Default is 31 days per month/24 hours per day.
    - In **EA Subscription**, specify whether to take an Enterprise Agreement (EA) subscription discount into account for cost estimation. 
    - In **Azure Hybrid Benefit**, specify whether you already have a Windows Server license. If you do and they're covered with active Software Assurance of Windows Server Subscriptions, you can apply for the [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-use-benefit/) when you bring licenses to Azure.

1. Select **Save** if you make changes.

1. In **Assess Servers**, select **Next**.

1. In **Select servers to assess** > **Assessment name** > specify a name for the assessment. 

1. In **Select or create a group** > select **Create New** and specify a group name. 
    
     :::image type="content" source="./media/tutorial-assess-vmware-azure-vm/assess-group.png" alt-text="Screenshot of adding VMs to a group.":::


1. Select the appliance, and select the VMs you want to add to the group. Then select **Next**. We recommend that you prioritize migrations for servers in extended support/out of support.

1. In **Review + create assessment**, review the assessment details, and select **Create Assessment** to create the group and run the assessment.

1. After the assessment is created, view it in **Servers, databases and web apps** > **Azure Migrate: Discovery and assessment** > **Assessments**.

1. Select the name of the assessment that you want to view.
1. Select **Export assessment** to download it as an Excel file.
    > [!NOTE]
    > For performance-based assessments, we recommend that you wait at least a day after starting discovery before you create an assessment. This provides time to collect performance data with higher confidence. Ideally, after you start discovery, wait for the performance duration you specify (day/week/month) for a high-confidence rating.

## Review an Azure VM assessment

An Azure VM assessment describes:

- **Azure readiness**: Whether servers are suitable for migration to Azure.
- **Monthly cost estimation**: The estimated monthly compute and storage costs for running the VMs in Azure.
- **Monthly storage cost estimation**: Estimated costs for disk storage after migration.

### View an Azure VM assessment

1. In **Servers, databases and web apps** > **Azure Migrate: Discovery and assessment**, select the number next to **Azure VM**.
2. In **Assessments**, select an assessment to open it. As an example (estimations and costs, for example, only): 

    :::image type="content" source="./media/how-to-create-assessment/assessment-summary.png" alt-text="Screenshot of an Assessment summary.":::

### Review support status

The assessment summary displays the support status of the Operating system licenses.

1. Select the graph in the **Supportability** section to view a list of the assessed VMs.
2. The **Operating system license support status** column displays the support status of the Operating system, whether it is in mainstream support, extended support, or out of support. Selecting the support status opens a pane on the right which shows the type of support status, duration of support, and the recommended steps to secure their workloads. 
   - To view the remaining duration of support, that is, the number of months for which the license is valid, 
select **Columns** > **Support ends in** > **Submit**. The **Support ends in** column displays the duration in months. 


### Review Azure readiness

1. In **Azure readiness**, verify whether servers are ready for migration to Azure.
2. Review the server status:
    - **Ready**: Azure Migrate recommends a VM size and cost estimates for VMs in the assessment.
    - **Ready with conditions**: Shows issues and suggested remediation.
    - **Not ready**: Shows issues and suggested remediation.
    - **Readiness unknown**: Used when Azure Migrate can't assess readiness, due to data availability issues.

3. Select an **Azure readiness** status. You can view server readiness details and drill down to see server details, including compute, storage, and network settings.

### Review cost details

This view shows the estimated compute and storage cost of running VMs in Azure.

1. Review the monthly compute and storage costs. Costs are aggregated for all servers in the assessed group.

    - Cost estimates are based on the size recommendations for a server, and its disks and properties.
    - Estimated monthly costs for compute and storage are shown.
    - The cost estimation is for running the on-premises servers as IaaS VMs. Azure VM assessment doesn't consider PaaS or SaaS costs.
2. You can review monthly storage cost estimates. This view shows aggregated storage costs for the assessed group, split over different types of storage disks.
3. You can drill down to see details for specific servers.


### Review confidence rating

When you run performance-based assessments, a confidence rating is assigned to the assessment.

:::image type="content" source="./media/how-to-create-assessment/confidence-rating.png" alt-text="Screenshot of Confidence rating.":::

- A rating from 1-star (lowest) to 5-star (highest) is awarded.
- The confidence rating helps you estimate the reliability of the size recommendations provided by the assessment.
- The confidence rating is based on the availability of data points needed to compute the assessment.

Confidence ratings for an assessment are as follows.

**Data point availability** | **Confidence rating**
--- | ---
0%-20% | 1 Star
21%-40% | 2 Star
41%-60% | 3 Star
61%-80% | 4 Star
81%-100% | 5 Star

## Next steps

- Learn how to use [dependency mapping](how-to-create-group-machine-dependencies.md) to create high confidence groups.
- [Learn more](concepts-assessment-calculation.md) about how assessments are calculated.