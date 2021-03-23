---
title: Create an Azure SQL assessment
description: Learn how to assess SQL instances for migration to Azure SQL Managed Instance and Azure SQL Database
author: rashi-ms
ms.author: rajosh
ms.topic: tutorial
ms.date: 02/07/2021

---


# Create an Azure SQL assessment

As part of your migration journey to Azure, you assess your on-premises workloads to measure cloud readiness, identify risks, and estimate costs and complexity.
This article shows you how to assess discovered SQL instances in preparation for migration to Azure SQL, using the Azure Migrate: Discovery and assessment tool.

> [!Note]
> Discovery and assessment of SQL Server instances and databases running in your VMware environment is now in preview. 

## Before you start

- Make sure you've [created](./create-manage-projects.md) an Azure Migrate project and have the Azure Migrate: Discovery and assessment tool added.
- To create an assessment, you need to set up an Azure Migrate appliance for [VMware](how-to-set-up-appliance-vmware.md). The appliance discovers on-premises servers, and sends metadata and performance data to Azure Migrate. [Learn more](migrate-appliance.md)

## Azure SQL assessment overview
You can create an Azure SQL assessment with sizing criteria as **Performance-based**. 

**Sizing criteria** | **Details** | **Data**
--- | --- | ---
**Performance-based** | Assessments based on collected performance data | The recommended **Azure SQL configuration** is based on performance data of SQL instances and databases, which includes CPU usage, core counts, database file organizations and sizes, file IOs, batch query per second and memory size and usage by each of the database.

[Learn more](concepts-azure-sql-assessment-calculation.md) about Azure SQL assessments.

## Run an assessment
Run an assessment as follows:
1. On the **Overview** page > **Windows, Linux and SQL Server**, click **Assess and migrate servers**.
    :::image type="content" source="./media/tutorial-assess-sql/assess-migrate.png" alt-text="Overview page for Azure Migrate":::
2. On **Azure Migrate: Discovery and assessment**, click **Assess** and choose the assessment type as **Azure SQL**.
    :::image type="content" source="./media/tutorial-assess-sql/assess.png" alt-text="Dropdown to choose assessment type as Azure SQL":::
3. In **Assess servers** > you will be able to see the assessment type pre-selected as **Azure SQL** and the discovery source defaulted to **Servers discovered from Azure Migrate appliance**.

4. Click **Edit** to review the assessment properties.
     :::image type="content" source="./media/tutorial-assess-sql/assess-servers-sql.png" alt-text="Edit button from where assessment properties can be customized":::
5. In Assessment properties > **Target Properties**:
    - In **Target location**, specify the Azure region to which you want to migrate. 
        - Azure SQL configuration and cost recommendations are based on the location that you specify. 
    - In **Target deployment type**,
        - Select **Recommended**, if you want Azure Migrate to assess the readiness of your SQL instances for migrating to Azure SQL MI and Azure SQL DB, and recommend the best suited target deployment option, target tier, Azure SQL configuration and monthly estimates. [Learn More](concepts-azure-sql-assessment-calculation.md)
        - Select **Azure SQL DB**, if you want to assess the readiness of your SQL instances for migrating to Azure SQL Databases only and review the target tier, Azure SQL configuration and monthly estimates.
        - Select **Azure SQL MI**, if you want to assess the readiness of your SQL instances for migrating to Azure SQL Managed Instance only and review the target tier, Azure SQL configuration and monthly estimates.
    - In **Reserved Capacity**, specify whether you want to use reserved capacity for the SQL server after migration.
        - If you select a reserved capacity option, you can't specify “Discount (%)”.

6. In Assessment properties > **Assessment criteria**:
    - The Sizing criteria is defaulted to **Performance-based** which means Azure migrate will collect performance metrics pertaining to SQL instances and the databases managed by it to recommend an optimal-sized Azure SQL Database and/or Azure SQL Managed Instance configuration. You can specify:
        - **Performance history** to indicate the data duration on which you want to base the assessment. (Default is one day)
        - **Percentile utilization**, to indicate the percentile value you want to use for the performance sample. (Default is 95th percentile)
    - In **Comfort factor**, indicate the buffer you want to use during assessment. This accounts for issues like seasonal usage, short performance history, and likely increases in future usage. For example, if you use a comfort factor of two: 
        
        **Component** | **Effective utilization** | **Add comfort factor (2.0)**
        --- | --- | ---
        Cores | 2  | 4
        Memory | 8 GB | 16 GB
   
7. In **Pricing**:
    - In **Offer/Licensing program**, specify the Azure offer if you're enrolled. Currently you can only choose from Pay-as-you-go and Pay-as-you-go Dev/Test. 
        - You can avail additional discount by applying reserved capacity and Azure Hybrid Benefit on top of Pay-as-you-go offer. 
        - You can apply Azure Hybrid Benefit on top of Pay-as-you-go Dev/Test. The assessment currently does not support applying Reserved Capacity on top of Pay-as-you-go Dev/Test offer.
    - In **Service Tier**, choose the most appropriate service tier option to accommodate your business needs for migration to Azure SQL Database and/or Azure SQL Managed Instance: 
        - Select **Recommended** if you want Azure Migrate to recommend the best suited service tier for your servers. This can be General purpose or Business critical. Learn More
        - Select **General Purpose** if you want an Azure SQL configuration designed for budget-oriented workloads.
        - Select **Business Critical** if you want an Azure SQL configuration designed for low-latency workloads with high resiliency to failures and fast failovers.
    - In **Discount (%)**, add any subscription-specific discounts you receive on top of the Azure offer. The default setting is 0%.
    - In **Currency**, select the billing currency for your account.
    - In **Azure Hybrid Benefit**, specify whether you already have a SQL Server license. If you do and they're covered with active Software Assurance of SQL Server Subscriptions, you can apply for the Azure Hybrid Benefit when you bring licenses to Azure.
    - Click Save if you make changes.
     :::image type="content" source="./media/tutorial-assess-sql/view-all.png" alt-text="Save button on assessment properties":::
8. In **Assess Servers** > click Next.
9.	In **Select servers to assess** > **Assessment name** > specify a name for the assessment.
10.	In **Select or create a group** > select **Create New** and specify a group name.
     :::image type="content" source="./media/tutorial-assess-sql/assessment-add-servers.png" alt-text="Location of New group button":::
11.	Select the appliance, and select the servers you want to add to the group. Then click Next.
12.	In **Review + create assessment**, review the assessment details, and click Create Assessment to create the group and run the assessment.
     :::image type="content" source="./media/tutorial-assess-sql/assessment-create.png" alt-text="Location of Review and create assessment button.":::
13.	After the assessment is created, go to **Windows, Linux and SQL Server** > **Azure Migrate: Discovery and assessment** tile > Click on the number next to Azure SQL assessment.
     :::image type="content" source="./media/tutorial-assess-sql/assessment-sql-navigation.png" alt-text="Navigation to created assessment":::
15.	Click on the assessment name which you wish to view.

> [!NOTE]
> As Azure SQL assessments are performance-based assessments, we recommend that you wait at least a day after starting discovery before you create an assessment. This provides time to collect performance data with higher confidence. If your discovery is still in progress, the readiness of your SQL instances will be marked as **Unknown**. Ideally, after you start discovery, **wait for the performance duration you specify (day/week/month)** to create or recalculate the assessment for a high-confidence rating. 

## Review an assessment

**To view an assessment**:

1. **Windows, Linux and SQL Server** > **Azure Migrate: Discovery and assessment** > Click on the number next to Azure SQL assessment.
2. Click on the assessment name which you wish to view. As an example(estimations and costs for example only):
      :::image type="content" source="./media/tutorial-assess-sql/assessment-sql-summary.png" alt-text="SQL assessment overview":::
3. Review the assessment summary. You can also edit the assessment properties or recalculate the assessment.

#### Discovered items

This indicates the number of SQL servers, instances and databases that were assessed in this assessment.
    
#### Azure readiness

This indicates the distribution of assessed SQL instances: 
    
**Target deployment type (in assessment properties)** | **Readiness**   
--- | --- |
**Recommended** |  Ready for Azure SQL Database, Ready for Azure SQL Managed Instance, Potentially ready for Azure VM, Readiness unknown (In case the discovery is in progress or there are some discovery issues to be fixed)
**Azure SQL DB** or **Azure SQL MI** | Ready for Azure SQL Database or Azure SQL Managed Instance, Not ready for Azure SQL Database or Azure SQL Managed Instance, Readiness unknown (In case the discovery is in progress or there are some discovery issues to be fixed)
     
You can drill-down to understand details around migration issues/warnings that you can remediate before migration to Azure SQL. [Learn More](concepts-azure-sql-assessment-calculation.md)
You can also review the recommended Azure SQL configurations for migrating to Azure SQL databases and/or Managed Instances.
    
#### Azure SQL Database and Managed Instance cost details

The monthly cost estimate includes compute and storage costs for Azure SQL configurations corresponding to the recommended Azure SQL Database and/or Azure SQL Managed Instance deployment type. [Learn More](concepts-azure-sql-assessment-calculation.md#calculate-monthly-costs)


### Review readiness

1. Click **Azure SQL readiness**.
    :::image type="content" source="./media/tutorial-assess-sql/assessment-sql-readiness.png" alt-text="Azure SQL readiness details":::
1. In Azure SQL readiness, review the **Azure SQL DB readiness** and **Azure SQL MI readiness** for the assessed SQL instances:
    - **Ready**: The instance is ready to be migrated to Azure SQL DB/MI without any migration issues or warnings. 
        - Ready(hyperlinked and blue information icon): The instance is ready to be migrated to Azure SQL DB/MI without any migration issues but has some migration warnings that you need to review. You can click on the hyperlink to review the migration warnings and the recommended remediation guidance:
        :::image type="content" source="./media/tutorial-assess-sql/assess-ready.png" alt-text="Assessment with ready status":::       
    - **Not ready**: The instance has one or more migration issues for migrating to Azure SQL DB/MI. You can click on the hyperlink and review the migration issues and the recommended remediation guidance.
    - **Unknown**: Azure Migrate can't assess readiness, because the discovery is in progress or there are issues during discovery that need to be fixed from the notifications blade. If the issue persists, please contact Microsoft support. 
1. Review the recommended deployment type for the SQL instance which is determined as per the matrix below:

    - **Target deployment type** (as selected in assessment properties): **Recommended**

        **Azure SQL DB readiness** | **Azure SQL MI readiness** | **Recommended deployment type** | **Azure SQL configuration and cost estimates calculated?**
         --- | --- | --- | --- |
        Ready | Ready | Azure SQL DB or Azure SQL MI [Learn more](concepts-azure-sql-assessment-calculation.md#recommended-deployment-type) | Yes
        Ready | Not ready or Unknown | Azure SQL DB | Yes
        Not ready or Unknown | Ready | Azure SQL MI | Yes
        Not ready | Not ready | Potentially ready for Azure VM [Learn more](concepts-azure-sql-assessment-calculation.md#potentially-ready-for-azure-vm) | No
        Not ready or Unknown | Not ready or Unknown | Unknown | No
    
    - **Target deployment type** (as selected in assessment properties): **Azure SQL DB**
    
        **Azure SQL DB readiness** | **Azure SQL configuration and cost estimates calculated?**
        --- | --- |
        Ready | Yes
        Not ready | No
        Unknown | No
    
    - **Target deployment type** (as selected in assessment properties): **Azure SQL MI**
    
        **Azure SQL MI readiness** | **Azure SQL configuration and cost estimates calculated?**
         --- | --- |
        Ready | Yes
        Not ready | No
        Unknown | No

4. Click on the instance name drill down to see the number of user databases, instance details including instance properties, compute (scoped to instance) and source database storage details.
5. Click on the number of user databases to review the list of databases and their details. As an example(estimations and costs for example only):
    :::image type="content" source="./media/tutorial-assess-sql/assessment-db.png" alt-text="SQL instance detail":::
5. Click on review details in the Migration issues column to review the migration issues and warnings for a particular target deployment type. 
    :::image type="content" source="./media/tutorial-assess-sql/assessment-db-issues.png" alt-text="DB migration issues and warnings":::

### Review cost estimates
The assessment summary shows the estimated monthly compute and storage costs for Azure SQL configurations corresponding to the recommended Azure SQL databases and/or Managed Instances deployment type.

1. Review the monthly total costs. Costs are aggregated for all SQL instances in the assessed group.
    - Cost estimates are based on the recommended Azure SQL configuration for an instance. 
    - Estimated monthly costs for compute and storage are shown. As an example(estimations and costs for example only):
    
    :::image type="content" source="./media/tutorial-assess-sql/assessment-sql-cost.png" alt-text="Cost details":::

1. You can drill down at an instance level to see Azure SQL configuration and cost estimates at an instance level.  
1. You can also drill down to the database list to review the Azure SQL configuration and cost estimates per database when an Azure SQL Database configuration is recommended.

### Review confidence rating
Azure Migrate assigns a confidence rating to all Azure SQL assessments based on the availability of the performance/utilization data points needed to compute the assessment for all the assessed SQL instances and databases. Rating is from one star (lowest) to five stars (highest).
 
The confidence rating helps you estimate the reliability of size recommendations in the assessment.  Confidence ratings are as follows.

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
- Start migrating SQL instances and databases using [Azure Database Migration Service](https://docs.microsoft.com/azure/dms/dms-overview).
