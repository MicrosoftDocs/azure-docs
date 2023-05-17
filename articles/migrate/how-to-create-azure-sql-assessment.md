---
title: Create an Azure SQL assessment
description: Learn how to assess SQL instances for migration to Azure SQL Managed Instance and Azure SQL Database
author: rashi-ms
ms.author: rajosh
ms.topic: tutorial
ms.date: 03/15/2023
ms.custom: engagement-fy23
---

# Create an Azure SQL assessment

As part of your migration journey to Azure, you assess your on-premises workloads to measure cloud readiness, identify risks, and estimate costs and complexity.
This article shows you how to assess discovered SQL instances in preparation for migration to Azure SQL, using the Azure Migrate: Discovery and assessment tool.

## Before you start

- Make sure you've [created](./create-manage-projects.md) an Azure Migrate project and have the Azure Migrate: Discovery and assessment tool added.
- To create an assessment, you need to set up an Azure Migrate appliance for VMware, Hyper-V or Physical environment, whichever applicable. The appliance discovers on-premises servers, and sends metadata and performance data to Azure Migrate. [Learn more](migrate-appliance.md).

## Azure SQL assessment overview
You can create an Azure SQL assessment with sizing criteria as **Performance-based**. 

**Sizing criteria** | **Details** | **Data**
--- | --- | ---
**Performance-based** | Assessments based on collected performance data | The recommended **Azure SQL configuration** is based on performance data of SQL instances and databases, which includes CPU usage, core counts, database file organizations and sizes, file IOs, batch query per second and memory size and usage by each of the database.

[Learn more](concepts-azure-sql-assessment-calculation.md) about Azure SQL assessments.

## Run an assessment
Run an assessment as follows:
1. On the **Overview** page > **Servers, databases and web apps**, select **Assess and migrate servers**.
    
    :::image type="content" source="./media/tutorial-assess-sql/assess-migrate-inline.png" alt-text="Screenshot of Overview page for Azure Migrate." lightbox="./media/tutorial-assess-sql/assess-migrate-expanded.png":::

1. In **Azure Migrate: Discovery and assessment**, select **Assess** and choose the assessment type as **Azure SQL**.
    
    :::image type="content" source="./media/tutorial-assess-sql/assess-inline.png" alt-text="Screenshot of Dropdown to choose assessment type as Azure SQL." lightbox="./media/tutorial-assess-sql/assess-expanded.png":::
    
1. In **Assess servers**, the assessment type is pre-selected as **Azure SQL** and the discovery source is defaulted to **Servers discovered from Azure Migrate appliance**.

1. Select **Edit** to review the assessment settings.
     :::image type="content" source="./media/tutorial-assess-sql/assess-servers-sql-inline.png" alt-text="Screenshot of Edit button from where assessment settings can be customized." lightbox="./media/tutorial-assess-sql/assess-servers-sql-expanded.png":::
1. In **Assessment settings**, set the necessary values or retain the default values:

   **Section** | **Setting** | **Details**
   | --- | --- | ---
   Target and pricing settings | **Target location** | The Azure region to which you want to migrate. Azure SQL configuration and cost recommendations are based on the location that you specify.
   Target and pricing settings | **Environment type** | The environment for the SQL deployments to apply pricing applicable to Production or Dev/Test.
   Target and pricing settings | **Offer/Licensing program** |The Azure offer if you're enrolled. Currently, the field is Pay-as-you-go by default, which gives you retail Azure prices. <br/><br/>You can avail additional discount by applying reserved capacity and Azure Hybrid Benefit on top of Pay-as-you-go offer.<br/>You can apply Azure Hybrid Benefit on top of Pay-as-you-go offer and Dev/Test environment. The assessment doesn't support applying Reserved Capacity on top of Pay-as-you-go offer and Dev/Test environment. <br/>If the offer is set to *Pay-as-you-go* and Reserved capacity is set to *No reserved instances*, the monthly cost estimates are calculated by multiplying the number of hours chosen in the VM uptime field with the hourly price of the recommended SKU.
   Target and pricing settings | **Savings options - Azure SQL MI and DB (PaaS)** | Specify the reserved capacity savings option that you want the assessment to consider to help optimize your Azure compute cost. <br><br> [Azure reservations](../cost-management-billing/reservations/save-compute-costs-reservations.md) (1 year or 3 year reserved) are a good option for the most consistently running resources.<br><br> When you select 'None', the Azure compute cost is based on the Pay as you go rate or based on actual usage.<br><br> You need to select pay-as-you-go in offer/licensing program to be able to use Reserved Instances. When you select any savings option other than 'None', the 'Discount (%)' and "VM uptime" settings aren't applicable. The monthly cost estimates are calculated by multiplying 744 hours with the hourly price of the recommended SKU.
   Target and pricing settings | **Savings options - SQL Server on Azure VM (IaaS)** | Specify the savings option that you want the assessment to consider to help optimize your Azure compute cost. <br><br> [Azure reservations](../cost-management-billing/reservations/save-compute-costs-reservations.md) (1 year or 3 year reserved) are a good option for the most consistently running resources.<br><br> [Azure Savings Plan](../cost-management-billing/savings-plan/savings-plan-compute-overview.md) (1 year or 3 year savings plan) provide additional flexibility and automated cost optimization. Ideally post migration, you could use Azure reservation and savings plan at the same time (reservation is consumed first), but in the Azure Migrate assessments, you can only see cost estimates of 1 savings option at a time. <br><br> When you select 'None', the Azure compute cost is based on the Pay as you go rate or based on actual usage.<br><br> You need to select pay-as-you-go in offer/licensing program to be able to use Reserved Instances or Azure Savings Plan. When you select any savings option other than 'None', the 'Discount (%)' and "VM uptime" settings aren't applicable. The monthly cost estimates are calculated by multiplying 744 hours in the VM uptime field with the hourly price of the recommended SKU.
   Target and pricing settings | **Currency** | The billing currency for your account.
   Target and pricing settings | **Discount (%)** | Any subscription-specific discounts you receive on top of the Azure offer. The default setting is 0%.
   Target and pricing settings | **VM uptime** | Specify the duration (days per month/hour per day) that servers/VMs run. This is useful for computing cost estimates for SQL Server on Azure VM where you're aware that Azure VMs might not run continuously. <br/> Cost estimates for servers where recommended target is *SQL Server on Azure VM* are based on the duration specified. Default is 31 days per month/24 hours per day.
   Target and pricing settings | **Azure Hybrid Benefit** | Specify whether you already have a Windows Server and/or SQL Server license. Azure Hybrid Benefit is a licensing benefit that helps you to significantly reduce the costs of running your workloads in the cloud. It works by letting you use your on-premises Software Assurance-enabled Windows Server and SQL Server licenses on Azure. For example, if you have a SQL Server license and they're covered with active Software Assurance of SQL Server Subscriptions, you can apply for the Azure Hybrid Benefit when you bring licenses to Azure.
   Assessment criteria | **Sizing criteria** | Set to *Performance-based* by default, which means Azure Migrate collects performance metrics pertaining to SQL instances and the databases managed by it to recommend an optimal-sized SQL Server on Azure VM and/or Azure SQL Database and/or Azure SQL Managed Instance configuration. 
   Assessment criteria | **Performance history** | Indicate the data duration on which you want to base the assessment. (Default is one day)
   Assessment criteria | **Percentile utilization** | Indicate the percentile value you want to use for the performance sample. (Default is 95th percentile)
   Assessment criteria | **Comfort factor** | Indicate the buffer you want to use during assessment. This accounts for issues like seasonal usage, short performance history, and likely increases in future usage. For example, consider a comfort factor of 2 for effective utilization of 2 Cores. In this case, the assessment considers the effective cores as 4 cores. Similarly, for the same comfort factor and an effective utilization of 8 GB memory, the assessment considers effective memory as 16 GB.
   Assessment criteria | **Optimization preference** | Specify the preference for the recommended assessment report. Selecting **Minimize cost** would result in the Recommended assessment report recommending those deployment types that have least migration issues and are most cost effective, whereas selecting **Modernize to PaaS** would result in Recommended assessment report recommending PaaS(Azure SQL MI or DB) deployment types over IaaS Azure(VMs), wherever the SQL Server instance is ready for migration to PaaS irrespective of cost.
   Azure SQL Managed Instance sizing | **Service Tier** | Choose the most appropriate service tier option to accommodate your business needs for migration to Azure SQL Managed Instance:<br/><br/>Select *Recommended* if you want Azure Migrate to recommend the best suited service tier for your servers. This can be General purpose or Business critical.<br/><br/>Select *General Purpose* if you want an Azure SQL configuration designed for budget-oriented workloads.<br/><br/>Select *Business Critical* if you want an Azure SQL configuration designed for low-latency workloads with high resiliency to failures and fast failovers.
   Azure SQL Managed Instance sizing | **Instance type** | Defaulted to *Single instance*.
   Azure SQL Managed Instance sizing | **Pricing Tier** | Defaulted to *Standard*.
   SQL Server on Azure VM sizing | **VM series** | Specify the Azure VM series you want to consider for *SQL Server on Azure VM* sizing. Based on the configuration and performance requirements of your SQL Server or SQL Server instance, the assessment recommends a VM size from the selected list of VM series. <br/>You can edit settings as needed. For example, if you don't want to include D-series VM, you can exclude D-series from this list.<br/> As Azure SQL assessments intend to give the best performance for your SQL workloads, the VM series list only has VMs that are optimized for running your SQL Server on Azure Virtual Machines (VMs). [Learn more](/azure/azure-sql/virtual-machines/windows/performance-guidelines-best-practices-checklist?preserve-view=true&view=azuresql#vm-size).
   SQL Server on Azure VM sizing | **Storage Type** | Defaulted to *Recommended*, which means the assessment recommends the best suited Azure Managed Disk based on the chosen environment type, on-premises disk size, IOPS and throughput.
   Azure SQL Database sizing | **Service Tier** | Choose the most appropriate service tier option to accommodate your business needs for migration to Azure SQL Database:<br/><br/>Select **Recommended** if you want Azure Migrate to recommend the best suited service tier for your servers. This can be General purpose or Business critical.<br/><br/>Select **General Purpose** if you want an Azure SQL configuration designed for budget-oriented workloads.<br/><br/>Select **Business Critical** if you want an Azure SQL configuration designed for low-latency workloads with high resiliency to failures and fast failovers.
   Azure SQL Database sizing | **Instance type** | Defaulted to *Single database*.
   Azure SQL Database sizing | **Purchase model** | Defaulted to *vCore*.
   Azure SQL Database sizing | **Compute tier** | Defaulted to *Provisioned*.
   High availability and disaster recovery properties | **Disaster recovery region** | Defaulted to the [cross-region replication pair](../reliability/cross-region-replication-azure.md#azure-cross-region-replication-pairings-for-all-geographies) of the Target Location. In the unlikely event that the chosen Target Location doesn't yet have such a pair, the specified Target Location itself is chosen as the default disaster recovery region.
   High availability and disaster recovery properties | **Multi-subnet intent** | Defaulted to Disaster recovery. <br/><br/> Select **Disaster recovery** if you want asynchronous data replication where some replication delays are tolerable. This allows higher durability using geo-redundancy. In the event of failover, data that hasn't yet been replicated may be lost. <br/><br/> Select **High availability** if you desire the data replication to be synchronous and no data loss due to replication delay is allowable. This setting allows assessment to leverage built-in high availability options in Azure SQL Databases and Azure SQL Managed Instances, and availability zones and zone-redundancy in Azure Virtual Machines to provide higher availability. In the event of failover, no data is lost.  
   High availability and disaster recovery properties | **Internet Access** | Defaulted to Available.<br/><br/> Select **Available** if you allow outbound internet access from Azure VMs. This allows the use of [Cloud Witness](https://learn.microsoft.com/azure/azure-sql/virtual-machines/windows/hadr-cluster-quorum-configure-how-to?view=azuresql&tabs=powershell) which is the recommended approach for Windows Server Failover Clusters in Azure Virtual Machines. <br/><br/> Select **Not available** if the Azure VMs have no outbound internet access. This requires the use of a Shared Disk as a witness for Windows Server Failover Clusters in Azure Virtual Machines. 
   High availability and disaster recovery properties | **Async commit mode intent** | Defaulted to Disaster recovery. <br/><br/> Select **Disaster recovery** if you're using asynchronous commit availability mode to enable higher durability for the data without affecting performance. In the event of failover, data that hasn't yet been replicated may be lost. <br/><br/> Select **High availability** if you're using asynchronous commit data availability mode to improve availability and scale out read traffic. This setting allows assessment to leverage built-in high availability features in Azure SQL Databases, Azure SQL Managed Instances, and Azure Virtual Machines to provide higher availability and scale out.

1. Select **Save** if you made changes.
8. In **Assess Servers**, select **Next**.
9.  In **Select servers to assess** > **Assessment name** > specify a name for the assessment.
10. In **Select or create a group** > select **Create New** and specify a group name.

     :::image type="content" source="./media/tutorial-assess-sql/assessment-add-servers-inline.png" alt-text="Screenshot of Location of New group button." lightbox="./media/tutorial-assess-sql/assessment-add-servers-expanded.png":::

11. Select the appliance and select the servers you want to add to the group and select **Next**.
12. In **Review + create assessment**, review the assessment details, and select **Create Assessment** to create the group and run the assessment.
13. After the assessment is created, go to **Servers, databases and web apps** > **Azure Migrate: Discovery and assessment**, select the number next to Azure SQL assessment. If you do not see the number populated, select **Refresh** to get the latest updates.

     :::image type="content" source="./media/tutorial-assess-sql/assessment-sql-navigation.png" alt-text="Screenshot of Navigation to created assessment.":::

15. Select the assessment name, which you wish to view.

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