---
title: Create an AVS assessment with Azure Migrate | Microsoft Docs
description: Describes how to create an AVS assessment with Azure Migrate
ms.service: azure-migrate
ms.topic: how-to
ms.date: 11/07/2024
ms.reviewer: v-uhabiba
ms.custom: sfi-image-nochange
# Customer intent: "As a cloud architect, I want to create an Azure VMware Solution assessment for on-premises VMs so that I can evaluate migration options and ensure compatibility with Azure's infrastructure."
---



# Create an Azure VMware Solution assessment

This article describes how to create an Azure VMware Solution assessment for on-premises VMs in a VMware vSphere environment with Azure Migrate: Discovery and assessment.

[Azure Migrate](migrate-services-overview.md) helps you to migrate to Azure. Azure Migrate provides a centralized hub to track discovery, assessment, and migration of on-premises infrastructure, applications, and data to Azure. The hub offers Azure Migrate tools for assessment and migration, along with partner independent software vendor (ISV) offerings.

## Before you start

- [Create](./create-manage-projects.md) an Azure Migrate project.
- [Add](how-to-assess.md) the Azure Migrate: Discovery and assessment tool if you've already created a project.
- Discover your on-premises inventory data using either of the following approach:
    - [Import your RVTools XLSX file](tutorial-import-vmware-using-rvtools-xlsx.md).
    - [Import the server metadata in comma-separated values (CSV) format](./tutorial-discover-import.md)
    - Set up an Azure Migrate appliance for [VMware vSphere](how-to-set-up-appliance-vmware.md), which discovers the on-premises servers, and sends metadata and performance data to Azure Migrate: Discovery and assessment. [Learn more](migrate-appliance.md).


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
**Performance-based** | For RVTools and CSV file-based assessments and performance-based assessments, the assessment considers the utilized storage by each VM. For appliance-based assessments, the assessment considers the CPU & memory utilization data of each VM. | **Recommended Node size**: Based on CPU and memory utilization data along with node type, storage type, and storage policies that you select for the assessment.
**As on-premises** | Assessments based on on-premises VM's resource allocation. | **Recommended Node size**: Based on the on-premises server size along with the node type, storage type, and storage policies that you select for the assessment.

## Run an Azure VMware Solution (AVS) assessment

1. In **Infrastructure**, select the list of all workloads you want to assess the cost for.

1. From the top menu, click on **Create assessment** drop-down, select **For Azure VMware Solution (AVS)**.

    :::image type="content" source="./media/tutorial-assess-vmware-azure-vmware-solution/create-azure-vmware-solution-assessment-v2.png" alt-text="Screenshot of page for selecting the assessment settings." lightbox="./media/tutorial-assess-vmware-azure-vmware-solution/create-azure-vmware-solution-assessment-v2.png" :::

1. Provide **Assessment name** for the assessment. Click on **Add workloads** in case you need additional workloads for the assessment. Click on **Next** once the page is ready to proceed.

    :::image type="content" source="./media/tutorial-assess-vmware-azure-vmware-solution/azure-vmware-solution-assessment-basics-tab-v2.png" alt-text="Screenshot of page for adding Basic details for the assessment." lightbox="./media/tutorial-assess-vmware-azure-vmware-solution/azure-vmware-solution-assessment-basics-tab-v2.png" :::

1. Under **General** settings, provide the **Target location** you want to provision your private cloud in, the **Currency**, **Program/offer** you want to have the assessment evaluated in, and other settings you may want to change.

    - In **Pricing**:
        - In **Program/Offer**, [Azure offer](https://azure.microsoft.com/support/legal/offer-details/) you're enrolled in is displayed. The Assessment estimates the cost for that offer.
        - In **Currency**, select the billing currency for your account.
        - In **Discount (%)**, add any subscription-specific discounts you receive on top of the Azure offer. The default setting is 0%.

    - In **Sizing criteria**, select if you want to base the assessment on static metadata, or on performance-based data. If you use performance data:
        - In **Performance history**, indicate the data duration on which you want to base the assessment
        - In **Percentile utilization**, specify the percentile value you want to use for the performance sample. 

    - In **Comfort factor**, indicate the buffer you want to use during assessment. This accounts for issues like seasonal usage, short performance history, and likely increases in future usage. For example, if you use a comfort factor of two:
    
        **Component** | **Effective utilization** | **Add comfort factor (2.0)**
        --- | --- | ---
        Cores | 2  | 4
        Memory | 8 GB | 16 GB  

    :::image type="content" source="./media/tutorial-assess-vmware-azure-vmware-solution/azure-vmware-solution-assessment-edit-settings-v2.png" alt-text="Screenshot of first page for editing settings for the assessment." lightbox="./media/tutorial-assess-vmware-azure-vmware-solution/azure-vmware-solution-assessment-edit-settings-v2.png" :::

    :::image type="content" source="./media/tutorial-assess-vmware-azure-vmware-solution/azure-vmware-solution-assessment-edit-settings-2-v2.png" alt-text="Screenshot of second page for editing settings for assessment." lightbox="./media/tutorial-assess-vmware-azure-vmware-solution/azure-vmware-solution-assessment-edit-settings-2-v2.png" :::

1. In **Advanced** settings, click on **Edit defaults** and ensure the **Target services** has "Azure VMware Solution (AVS)" and then click on **Edit defaults**:

    - In **SDDC type**, specify "New SDDC" if you are creating a new SDDC. Use "AVS SDDC expansion" if you already have an AVS SDDC with hosts deployed and want to add more VMs to the existing SDDC. When assessing for expanding an SDDC, it will not consider the available capacity in the AVS SDDC but will consider the capacity requirements for management appliances.
    - In **Target location**, specify the Azure region to which you want to migrate.
       - Size and cost recommendations are based on the location that you specify.
    - The **Storage type** is defaulted to consider all three: **vSAN**, **Elastic SAN** and **Azure NetApp Files (ANF)** (Standard, Premium and Ultra tiers). Elastic SAN and ANF are external storage types in AVS that will be used when storage is the limiting factor considering the configuration/performance of the incoming VMs. **Elastic SAN** can be selected if assessment needs to be performed using vSAN & elastic SAN as the storage datastores. When performance metrics are provided (IOPS and throughput) in settings or via the imported CSV file, the assessment selects the tier that satisfies the performance requirements of the incoming VMs’ disks. If the assessment is performed using an RVTools file or the Azure Migrate appliance without providing performance metrics like throughput and IOPS, **Elastic SAN** or **ANF - Standard** (the most cost-effective one among the two) is used for assessment by default.
   - In **Reserved Instances**, specify whether you want to use reserve instances for Azure VMware Solution nodes when you migrate your VMs.
    - If you select to use a reserved instance, you can't specify '**Discount (%)**. [Learn more](../azure-vmware/reserved-instance.md).

1. In **Storage Settings**:
    - In **FTT setting, RAID level**, select the Failure to Tolerate and RAID combination. **FTT 1, RAID 1 & FTT 2, RAID 6** are selected by default. The selected FTT option and other storage policies, combined with the on-premises server disk requirement, determines the total vSAN storage required in AVS.
    - In **Dedupe and compression factor**, specify the anticipated deduplication and compression factor for your workloads. Actual value can be obtained from on-premises vSAN or storage config and this might vary by workload. A value of 3 would mean 3x so for 300 GB disk only 100 GB storage would be used. A value of 1 would mean no dedupe or compression. You can only add values from 1 to 10 up to one decimal place. If you are using vSAN on-premises, you can refer to your on-premises vCenter statistics to get the dedupe and comparession factor for your on-premises VMs.
    - In **IOPS per GiB**, select the expected average read and write speed per gibibyte of the external storage device. This, along with the disk capacity requirement, helps Azure Migrate determine the external storage capacity needs.
    - In **Throughput per GiB**, select the expected average amount of data transfer speed per gibibyte of the storage device. This, along with the disk capacity requirement would help Azure Migrate determine the external storage capacity requirements.
1. In **Elastic SAN Settings**:
    - The **Networking ingress/egress cost** is used to determine the networking cost of attaching the elastic SAN datastore to the AVS SDDC. It's defaulted to **15%**.
1. In **CPU Settings**:
    - In **CPU Oversubscription**, specify the ratio of virtual cores associated with one physical core in the AVS node. Oversubscription of greater than 4:1 might cause performance degradation, but can be used for web server type workloads.
    - In **CPU headroom**, specify the CPU headroom you want to reserve for planned & unplanned management operations.
1. In **VM Size**:
    - The **Node type** is defaulted to use all the SKUs available in the given region. SKUs supported for assessment are AV36, AV36P, AV48, AV52 & AV64 (both Gen 1 & [Gen 2](/azure/azure-vmware/native-introduction)). Azure Migrate attempts to get the minimum number of nodes needed to host the VMs on the Azure VMware Solution private cloud. However, availability of the SKU will depend upon capacity availability.
    - In **Memory overcommit factor**, specify the ratio of memory over commit on the cluster. A value of 1 represents 100% memory use, 0.5, for example, is 50%, and 2 would be using 200% of available memory. You can only add values from 0.5 to 10 up to one decimal place.
    - In **Memory overcommit factor**, specify the ratio of memory over commit on the cluster. A value of 1 represents 100% memory use, 0.5, for example, is 50%, and 2 would be using 200% of available memory. You can only add values from 0.5 to 10 up to one decimal place.

1. Select **Save** if you make changes.

    :::image type="content" source="./media/tutorial-assess-vmware-azure-vmware-solution/azure-vmware-solution-assessment-settings-v2.png" alt-text="Screenshot of assessment properties." lightbox="./media/tutorial-assess-vmware-azure-vmware-solution/azure-vmware-solution-assessment-settings-v2.png":::

1. In **Assess Servers**, select **Next**.

1. In **Select servers to assess** > **Assessment name** > specify a name for the assessment. 
 
1. In **Select or create a group** > select **Create New** and specify a group name. 
    
    :::image type="content" source="./media/tutorial-assess-vmware-azure-vmware-solution/assess-group.png" alt-text="Add servers to a group":::
 
1. Select the appliance, and select the servers you want to add to the group. Then select **Next**.

1. In **Review + create assessment**, review the assessment details, and select **Create Assessment** to create the group and run the assessment.

    > [!NOTE]
    > For performance-based assessments, we recommend that you wait at least a day after starting discovery before you create an assessment. This provides time to collect performance data with higher confidence. Ideally, after you start discovery, wait for the performance duration you specify (day/week/month) for a high-confidence rating.



## Next steps

- Learn how to use [dependency mapping](how-to-create-group-machine-dependencies.md) to create high confidence groups.
- [Learn more](concepts-azure-vmware-solution-assessment-calculation.md) about how Azure VMware Solution assessments are calculated.
