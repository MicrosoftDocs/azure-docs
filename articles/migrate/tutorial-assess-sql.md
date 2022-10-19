---
title: Tutorial to assess SQL instances for migration to SQL Server on Azure VM, Azure SQL Managed Instance and Azure SQL Database
description: Learn how to create assessment for Azure SQL in Azure Migrate
author: rashi-ms
ms.author: rajosh
ms.topic: tutorial
ms.date: 05/05/2022

---


# Tutorial: Assess SQL instances for migration to Azure SQL

As part of your migration journey to Azure, you assess your on-premises workloads to measure cloud readiness, identify risks, and estimate costs and complexity.
This article shows you how to assess discovered SQL Server instances and databases in preparation for migration to Azure SQL, using the Azure Migrate: Discovery and assessment tool.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Run an assessment based on configuration and performance data.
> * Review an Azure SQL assessment.

> [!NOTE]
> Tutorials show the quickest path for trying out a scenario, and use default options where possible. 

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.

- Before you follow this tutorial to assess your SQL Server instances for migration to Azure SQL, make sure you've discovered the SQL instances you want to assess using the Azure Migrate appliance, [follow this tutorial](tutorial-discover-vmware.md).
- If you want to try out this feature in an existing project, ensure that you have completed the [prerequisites](how-to-discover-sql-existing-project.md) in this article.


## Run an assessment
Run an assessment as follows:
1. On the **Overview** page > **Servers, databases and web apps**, select **Assess and migrate servers**.
    
    :::image type="content" source="./media/tutorial-assess-sql/assess-migrate-inline.png" alt-text="Screenshot of Overview page for Azure Migrate." lightbox="./media/tutorial-assess-sql/assess-migrate-expanded.png":::

1. In **Azure Migrate: Discovery and assessment**, select **Assess** and choose the assessment type as **Azure SQL**.
    
    :::image type="content" source="./media/tutorial-assess-sql/assess-inline.png" alt-text="Screenshot of Dropdown to choose assessment type as Azure SQL." lightbox="./media/tutorial-assess-sql/assess-expanded.png":::
    
1. In **Assess servers**, the assessment type is pre-selected as **Azure SQL** and the discovery source is defaulted to **Servers discovered from Azure Migrate appliance**.

1. Select **Edit** to review the assessment settings.
     :::image type="content" source="./media/tutorial-assess-sql/assess-servers-sql-inline.png" alt-text="Screenshot of Edit button from where assessment settings can be customized." lightbox="./media/tutorial-assess-sql/assess-servers-sql-expanded.png":::
1. In **Assessment settings** > **Target and pricing settings**, do the following:
    - In **Target location**, specify the Azure region to which you want to migrate. 
        - Azure SQL configuration and cost recommendations are based on the location that you specify. 
    - In **Environment type**, specify the environment for the SQL deployments to apply pricing applicable to Production or Dev/Test.
    - In **Offer/Licensing program**, specify the Azure offer if you're enrolled. Currently the field is defaulted to Pay-as-you-go, which will give you retail Azure prices.
        - You can avail additional discount by applying reserved capacity and Azure Hybrid Benefit on top of Pay-as-you-go offer. 
        - You can apply Azure Hybrid Benefit on top of the Pay-as-you-go offer and Dev/Test environment. The assessment does not support applying Reserved Capacity on top of the Pay-as-you-go offer and Dev/Test environment.
        - If the offer is set to *Pay-as-you-go* and Reserved capacity is set to *No reserved instances*, the monthly cost estimates are calculated by multiplying the number of hours chosen in the VM uptime field with the hourly price of the recommended SKU.
    - In **Reserved Capacity**, specify whether you want to use reserved capacity for the SQL server after migration.
        - If you select a reserved capacity option, you can't specify "Discount (%)" or "VM uptime".
        - If the Reserved capacity is set to *1 year reserved* or *3 years reserved*, the monthly cost estimates are calculated by multiplying 744 hours in the VM uptime field with the hourly price of the recommended SKU.
    - In **Currency**, select the billing currency for your account.
    - In **Discount (%)**, add any subscription-specific discounts you receive on top of the Azure offer. The default setting is 0%.
    - In **VM uptime**, specify the duration (days per month/hour per day) that servers/VMs will run. This is useful for computing cost estimates for SQL Server on Azure VM where you are aware that Azure VMs might not run continuously.
        - Cost estimates for servers where recommended target is *SQL Server on Azure VM* are based on the duration specified.
        - Default is 31 days per month/24 hours per day.
    - In **Azure Hybrid Benefit**, specify whether you already have a Windows Server and/or an SQL Server license. Azure Hybrid Benefit is a licensing benefit that helps you to significantly reduce the costs of running your workloads in the cloud. It works by letting you use your on-premises Software Assurance-enabled Windows Server and SQL Server licenses on Azure. For example, if you have an SQL Server license and they're covered with active Software Assurance of SQL Server Subscriptions, you can apply for the Azure Hybrid Benefit when you bring licenses to Azure.

1. In **Assessment settings** > **Assessment criteria**,
    - The **Sizing criteria** is defaulted to *Performance-based*, which means Azure migrate will collect performance metrics pertaining to SQL instances and the databases managed by it to recommend an optimal-sized SQL Server on Azure VM and/or Azure SQL Database and/or Azure SQL Managed Instance configuration. You can specify:
        - **Performance history** to indicate the data duration on which you want to base the assessment. (Default is one day.)
        - **Percentile utilization**, to indicate the percentile value you want to use for the performance sample. (Default is 95th percentile.)
    - In **Comfort factor**, indicate the buffer you want to use during assessment. This accounts for issues such as seasonal usage, short performance history, and likely increases in future usage. For example, the following table displays values if you use a comfort factor of two: 
        
        **Component** | **Effective utilization** | **Add comfort factor (2.0)**
        --- | --- | ---
        Cores | 2  | 4
        Memory | 8 GB | 16 GB

1. In **Assessment settings** > **Azure SQL Managed Instance sizing**,
    - In **Service Tier**, choose the most appropriate service tier option to accommodate your business needs for migration to Azure SQL Managed Instance: 
        - Select *Recommended* if you want Azure Migrate to recommend the best suited service tier for your servers. This can be General purpose or Business critical.
        - Select *General Purpose* if you want an Azure SQL configuration designed for budget-oriented workloads.
        - Select *Business Critical* if you want an Azure SQL configuration designed for low-latency workloads with high resiliency to failures and fast failovers.
    - **Instance type** - Default value is *Single instance*.
1. In **Assessment settings** > **SQL Server on Azure VM sizing**:
    - **Pricing Tier** - Default value is *Standard*.
    - In **VM series**, specify the Azure VM series you want to consider for *SQL Server on Azure VM* sizing. Based on the configuration and performance requirements of your SQL Server or SQL Server instance, the assessment will recommend a VM size from the selected list of VM series.
    - You can edit settings as needed. For example, if you don't want to include D-series VM, you can exclude D-series from this list.
      > [!NOTE]
      > As Azure SQL assessments are intended to give the best performance for your SQL workloads, the VM series list only has VMs that are optimized for running your SQL Server on Azure Virtual Machines (VMs). [Learn more](/azure/azure-sql/virtual-machines/windows/performance-guidelines-best-practices-checklist?preserve-view=true&view=azuresql#vm-size).
    - **Storage Type** is defaulted to *Recommended*, which means the assessment will recommend the best suited Azure Managed Disk based on the chosen environment type, on-premises disk size, IOPS, and throughput.

1. In **Assessment settings** > **Azure SQL Database sizing**,
    - In **Service Tier**, choose the most appropriate service tier option to accommodate your business needs for migration to Azure SQL Database.
        - Select **Recommended** if you want Azure Migrate to recommend the best suited service tier for your servers. This can be General purpose or Business critical.
        - Select **General Purpose** if you want an Azure SQL configuration designed for budget-oriented workloads.
        - Select **Business Critical** if you want an Azure SQL configuration designed for low-latency workloads with high resiliency to failures and fast failovers.
    - **Instance type** - Default value is *Single database*.
    - **Purchase model** - Default value is *vCore*.
    - **Compute tier** - Default value is *Provisioned*.

    - Select **Save** if you made changes.

     :::image type="content" source="./media/tutorial-assess-sql/view-all-inline.png" alt-text="Screenshot to save the assessment properties." lightbox="./media/tutorial-assess-sql/view-all-expanded.png":::

8. In **Assess Servers**, select **Next**.
9.	In **Select servers to assess** > **Assessment name** > specify a name for the assessment.
10.	In **Select or create a group** > select **Create New** and specify a group name.

     :::image type="content" source="./media/tutorial-assess-sql/assessment-add-servers-inline.png" alt-text="Screenshot of Location of New group button." lightbox="./media/tutorial-assess-sql/assessment-add-servers-expanded.png":::

11.	Select the appliance and select the servers you want to add to the group and select **Next**.
12.	In **Review + create assessment**, review the assessment details, and select **Create Assessment** to create the group and run the assessment.
13.	After the assessment is created, go to **Servers, databases and web apps** > **Azure Migrate: Discovery and assessment**, select the number next to Azure SQL assessment. If you do not see the number populated, select **Refresh** to get the latest updates.

     :::image type="content" source="./media/tutorial-assess-sql/assessment-sql-navigation.png" alt-text="Screenshot of Navigation to created assessment.":::

15.	Select the assessment name, which you wish to view.

> [!NOTE]
> As Azure SQL assessments are performance-based assessments, we recommend that you wait at least a day after starting discovery before you create an assessment. This provides time to collect performance data with higher confidence. If your discovery is still in progress, the readiness of your SQL instances will be marked as **Unknown**. Ideally, after you start discovery, **wait for the performance duration you specify (day/week/month)** to create or recalculate the assessment for a high-confidence rating. 

## Review an assessment

**To view an assessment**:

1. In **Servers, databases and web apps** > **Azure Migrate: Discovery and assessment**, select the number next to Azure SQL assessment.
2. Select the assessment name, which you wish to view. As an example(estimations and costs, for example, only):
      
      :::image type="content" source="./media/tutorial-assess-sql/assessment-sql-summary-inline.png" alt-text="Screenshot of Overview of SQL assessment." lightbox="./media/tutorial-assess-sql/assessment-sql-summary-expanded.png":::

3. Review the assessment summary. You can also edit the assessment settings or recalculate the assessment.

### Discovered entities

This indicates the number of SQL servers, instances, and databases that were assessed in this assessment.
    
### SQL Server migration scenarios

This indicates the different migration strategies that you can consider for your SQL deployments. You can review the readiness for target deployment types and the cost estimates for SQL Servers/Instances/Databases that are marked ready or ready with conditions: 

1. **Recommended deployment**: 
This is a strategy where an Azure SQL deployment type that is the most compatible with your SQL instance. It is the most cost-effective and is recommended. Migrating to a Microsoft-recommended target reduces your overall migration effort. If your instance is ready for SQL Server on Azure VM, Azure SQL Managed Instance and Azure SQL Database, the target deployment type, which has the least migration readiness issues and is the most cost-effective is recommended.
You can see the SQL Server instance readiness for different recommended deployment targets and monthly cost estimates for SQL instances marked *Ready* and *Ready with conditions*.

    - You can go to the Readiness report to:
        - Review the recommended Azure SQL configurations for migrating to SQL Server on Azure VM and/or Azure SQL databases and/or Azure SQL Managed Instances.
        - Understand details around migration issues/warnings that you can remediate before migration to the different Azure SQL targets. [Learn More](concepts-azure-sql-assessment-calculation.md).
    - You can go to the cost estimates report to review cost of each of the SQL instance after migrating to the recommended deployment target.

   > [!NOTE]
   > In the recommended deployment strategy, migrating instances to SQL Server on Azure VM is the recommended strategy for migrating SQL Server instances. When the SQL Server credentials are not available, the Azure SQL assessment provides right-sized lift-and-shift, that is, *Server to SQL Server on Azure VM* recommendations.

1. **Migrate all instances to Azure SQL MI**: 
In this strategy, you can see the readiness and cost estimates for migrating all SQL Server instances to Azure SQL Managed Instance. 

1. **Migrate all instances to SQL Server on Azure VM**: 
In this strategy, you can see the readiness and cost estimates for migrating all SQL Server instances to SQL Server on Azure VM.

1. **Migrate all servers to SQL Server on Azure VM**: 
In this strategy, you can see how you can rehost the servers running SQL Server to SQL Server on Azure VM and review the readiness and cost estimates.
Even when SQL Server credentials are not available, this report will provide right-sized lift-and-shift, that is, "Server to SQL Server on Azure VM" recommendations. The readiness and sizing logic is similar to Azure VM assessment type.

1. **Migrate all SQL databases to Azure SQL Database**
In this strategy, you can see how you can migrate individual databases to Azure SQL Database and review the readiness and cost estimates.


### Review readiness
You can review readiness reports for different migration strategies: 

1. Select the **Readiness** report for any of the migration strategies.

    :::image type="content" source="./media/tutorial-assess-sql/assessment-sql-readiness-inline.png" alt-text="Screenshot with Details of Azure SQL readiness" lightbox="./media/tutorial-assess-sql/assessment-sql-readiness-expanded.png":::

1. Review the readiness columns in the respective reports:
    
    **Migration strategy** | **Readiness Columns (Respective deployment target)**
    --- | --- 
    Recommended | MI readiness (Azure SQL MI), VM readiness (SQL Server on Azure VM), DB readiness (Azure SQL DB).
    Instances to Azure SQL MI | MI readiness (Azure SQL Managed Instance)
    Instances to SQL Server on Azure VM | VM readiness (SQL Server on Azure VM).
    Servers to SQL Server on Azure VM | Azure VM readiness (SQL Server on Azure VM).
    Databases to Azure SQL DB | DB readiness (Azure SQL Database)

1. Review the readiness for the assessed SQL instances/SQL Servers/Databases:
    - **Ready**: The instance/server is ready to be migrated to SQL Server on Azure VM/Azure SQL MI/Azure SQL DB without any migration issues or warnings. 
        - Ready: The instance is ready to be migrated to Azure VM/Azure SQL MI/Azure SQL DB without any migration issues but has some migration warnings that you need to review. You can select the hyperlink to review the migration warnings and the recommended remediation guidance.
    - **Ready with conditions**: The instance/server has one or more migration issues for migrating to Azure VM/Azure SQL MI/Azure SQL DB. You can select on the hyperlink and review the migration issues and the recommended remediation guidance.
    - **Not ready**: The assessment could not find a SQL Server on Azure VM/Azure SQL MI/Azure SQL DB configuration meeting the desired configuration and performance characteristics. Select the hyperlink to review the recommendation to make the instance/server ready for the desired target deployment type.
    - **Unknown**: Azure Migrate can't assess readiness, because the discovery is in progress or there are issues during discovery that need to be fixed from the notifications blade. If the issue persists, contact [Microsoft support](https://support.microsoft.com).

1. Select the instance name and drill-down to see the number of user databases, instance details including instance properties, compute (scoped to instance) and source database storage details.
1. Click the number of user databases to review the list of databases and their details.
1. Click review details in the **Migration issues** column to review the migration issues and warnings for a particular target deployment type.

### Review cost estimates
The assessment summary shows the estimated monthly compute and storage costs for Azure SQL configurations corresponding to the recommended SQL Server on Azure VM and/or Azure SQL Managed Instances and/or Azure SQL Database deployment type.

1. Review the monthly total costs. Costs are aggregated for all SQL instances in the assessed group.
    - Cost estimates are based on the recommended Azure SQL configuration for an instance/server/database.
    - Estimated total(compute and storage) monthly costs are displayed. As an example:
    
      :::image type="content" source="./media/tutorial-assess-sql/assessment-sql-cost-inline.png" alt-text="Screenshot of cost details." lightbox="./media/tutorial-assess-sql/assessment-sql-cost-expanded.png":::

    - The compute and storage costs are split in the individual cost estimates reports and at instance/server/database level.
1. You can drill down at an instance level to see Azure SQL configuration and cost estimates at an instance level.  
1. You can also drill down to the database list to review the Azure SQL configuration and cost estimates per database when an Azure SQL Database configuration is recommended.

### Review confidence rating
Azure Migrate assigns a confidence rating to all Azure SQL assessments based on the availability of the performance/utilization data points needed to compute the assessment for all the assessed SQL instances and databases. Rating is from one star (lowest) to five stars (highest).
The confidence rating helps you estimate the reliability of size recommendations in the assessment. Confidence ratings are as follows:

**Data point availability** | **Confidence rating**
--- | ---
0%-20% | 1 star
21%-40% | 2 stars
41%-60% | 3 stars
61%-80% | 4 stars
81%-100% | 5 stars

[Learn more](concepts-azure-sql-assessment-calculation.md#confidence-ratings) about confidence ratings.


## Next steps

- [Learn more](concepts-azure-sql-assessment-calculation.md) about how Azure SQL assessments are calculated.
- Start migrating SQL instances and databases using [Azure Database Migration Service](../dms/dms-overview.md).