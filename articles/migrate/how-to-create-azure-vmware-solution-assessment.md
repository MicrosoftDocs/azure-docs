---
title: Create an AVS assessment with Azure Migrate | Microsoft Docs
description: Describes how to create an AVS assessment with Azure Migrate
author: rashi-ms
ms.author: rajosh
ms.manager: abhemraj
ms.service: azure-migrate
ms.topic: how-to
ms.date: 05/09/2024
---



# Create an Azure VMware Solution assessment

This article describes how to create an Azure VMware Solution assessment for on-premises VMs in a VMware vSphere environment with Azure Migrate: Discovery and assessment.

[Azure Migrate](migrate-services-overview.md) helps you to migrate to Azure. Azure Migrate provides a centralized hub to track discovery, assessment, and migration of on-premises infrastructure, applications, and data to Azure. The hub provides Azure tools for assessment and migration, as well as Partner independent software vendor (ISV) offerings.

## Before you start

- [Create](./create-manage-projects.md) an Azure Migrate project.
- [Add](how-to-assess.md) the Azure Migrate: Discovery and assessment tool if you've already created a project.
- Set up an Azure Migrate appliance for [VMware vSphere](how-to-set-up-appliance-vmware.md), which discovers the on-premises servers, and sends metadata and performance data to Azure Migrate: Discovery and assessment. [Learn more](migrate-appliance.md).
- [Import](./tutorial-discover-import.md) the server metadata in comma-separated values (CSV) format or [import your RVTools XLSX file](./tutorial-import-vmware-using-rvtools-xlsx.md).


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

1.  On the **Overview** page > **Servers, databases and web apps**, select **Assess and migrate servers**.

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



## Next steps

- Learn how to use [dependency mapping](how-to-create-group-machine-dependencies.md) to create high confidence groups.
- [Learn more](concepts-azure-vmware-solution-assessment-calculation.md) about how Azure VMware Solution assessments are calculated.
