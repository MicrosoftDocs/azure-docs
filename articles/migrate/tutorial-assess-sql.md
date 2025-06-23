---
title: Tutorial to assess SQL instances for migration to SQL Server on Azure VM, Azure SQL Managed Instance and Azure SQL Database
description: Learn how to create assessment for Azure SQL in Azure Migrate
ms.topic: tutorial
ms.service: azure-migrate
ms.date: 02/06/2025
ms.custom: engagement-fy24
# Customer intent: "As a database administrator, I want to assess my on-premises SQL Server instances for migration to Azure SQL, so that I can evaluate cloud readiness, identify potential risks, and estimate costs before executing the migration."
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

## Decide which sizing criteria to use

Decide whether you want to run an assessment using sizing criteria based on SQL Server configuration data/metadata that's collected as on-premises, or based on dynamic performance data.

**Assessment** | **Details** | **Recommendation**
--- | --- | ---
**As on-premises** | Assess based on SQL Server configuration data/metadata.  | Recommended Azure SQL configuration  is based on the on-premises SQL Server configuration, which includes cores allocated, total memory allocated and database sizes. This can be useful when the workload characteristics require a longer duration to capture a comprehensive performance metric profile.
**Performance-based** | Assess based on collected performance data. | Recommended Azure SQL configuration is based on performance data of SQL Server instances and databases, which includes CPU usage, core counts, database file organization and size, file IOs, and memory usage by each database. You can get optimal recommendations that are right-sized for the SQL workload.

## Run an assessment
Run an assessment as follows:
1. 1. On the **Get started** page > **Servers, databases and web apps**, select **Discover, assess and migrate**.
    
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
   Target and pricing settings | **Savings options - Azure SQL MI and DB (PaaS)** | Specify the reserved capacity savings option that you want the assessment to consider, helping to optimize your Azure compute cost. <br><br> [Azure reservations](../cost-management-billing/reservations/save-compute-costs-reservations.md) (1 year or 3 year reserved) are a good option for the most consistently running resources.<br><br> When you select 'None', the Azure compute cost is based on the Pay as you go rate or based on actual usage.<br><br> You need to select pay-as-you-go in offer/licensing program to be able to use Reserved Instances. When you select any savings option other than 'None', the 'Discount (%)' and "VM uptime" settings aren't applicable. The monthly cost estimates are calculated by multiplying 744 hours with the hourly price of the recommended SKU.
   Target and pricing settings | **Savings options - SQL Server on Azure VM (IaaS)** | Specify the savings option that you want the assessment to consider, helping to optimize your Azure compute cost. <br><br> [Azure reservations](../cost-management-billing/reservations/save-compute-costs-reservations.md) (1 year or 3 year reserved) are a good option for the most consistently running resources.<br><br> [Azure Savings Plan](../cost-management-billing/savings-plan/savings-plan-compute-overview.md) (1 year or 3 year savings plan) provide additional flexibility and automated cost optimization. Ideally post migration, you could use Azure reservation and savings plan at the same time (reservation is consumed first), but in the Azure Migrate assessments, you can only see cost estimates of 1 savings option at a time. <br><br> When you select 'None', the Azure compute cost is based on the Pay as you go rate or based on actual usage.<br><br> You need to select pay-as-you-go in offer/licensing program to be able to use Reserved Instances or Azure Savings Plan. When you select any savings option other than 'None', the 'Discount (%)' and "VM uptime" settings aren't applicable. The monthly cost estimates are calculated by multiplying 744 hours in the VM uptime field with the hourly price of the recommended SKU.
   Target and pricing settings | **Currency** | The billing currency for your account.
   Target and pricing settings | **Discount (%)** | Any subscription-specific discounts you receive on top of the Azure offer. The default setting is 0%.
   Target and pricing settings | **VM uptime** | Specify the duration (days per month/hour per day) that servers/VMs run. This is useful for computing cost estimates for SQL Server on Azure VM where you're aware that Azure VMs might not run continuously. <br/> Cost estimates for servers where recommended target is *SQL Server on Azure VM* are based on the duration specified. Default is 31 days per month/24 hours per day.
   Target and pricing settings | **Azure Hybrid Benefit** | Specify whether you already have a Windows Server and/or SQL Server license or Enterprise Linux subscription (RHEL and SLES). Azure Hybrid Benefit is a licensing benefit that helps you to significantly reduce the costs of running your workloads in the cloud. It works by letting you use your on-premises Software Assurance-enabled Windows Server and SQL Server licenses on Azure. For example, if you have a SQL Server license and they're covered with active Software Assurance of SQL Server Subscriptions, you can apply for the Azure Hybrid Benefit when you bring licenses to Azure.
   Assessment criteria | **Sizing criteria** | Set to *Performance-based* by default, which means Azure Migrate collects performance metrics pertaining to SQL instances and the databases managed by it to recommend an optimal-sized SQL Server on Azure VM and/or Azure SQL Database and/or Azure SQL Managed Instance configuration.<br/><br/> You can change this to *As on-premises* to get recommendations based on just the on-premises SQL Server configuration without the performance metric based optimizations.
   Assessment criteria | **Performance history** | Indicate the data duration on which you want to base the assessment. (Default is one day)
   Assessment criteria | **Percentile utilization** | Indicate the percentile value you want to use for the performance sample. (Default is 95th percentile)
   Assessment criteria | **Comfort factor** | Indicate the buffer you want to use during assessment. This accounts for issues like seasonal usage, short performance history, and likely increases in future usage.
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
   High availability and disaster recovery properties | **Disaster recovery region** | Defaulted to the [cross-region replication pair](../reliability/cross-region-replication-azure.md#azure-paired-regions) of the Target Location. In the unlikely event that the chosen Target Location doesn't yet have such a pair, the specified Target Location itself is chosen as the default disaster recovery region.
   High availability and disaster recovery properties | **Multi-subnet intent** | Defaulted to Disaster recovery. <br/><br/> Select **Disaster recovery** if you want asynchronous data replication where some replication delays are tolerable. This allows higher durability using geo-redundancy. In the event of failover, data that hasn't yet been replicated might be lost. <br/><br/> Select **High availability** if you desire the data replication to be synchronous and no data loss due to replication delay is allowable. This setting allows assessment to leverage built-in high availability options in Azure SQL Databases and Azure SQL Managed Instances, and availability zones and zone-redundancy in Azure Virtual Machines to provide higher availability. In the event of failover, no data is lost.  
   High availability and disaster recovery properties | **Internet Access** | Defaulted to Available.<br/><br/> Select **Available** if you allow outbound internet access from Azure VMs. This allows the use of [Cloud Witness](/azure/azure-sql/virtual-machines/windows/hadr-cluster-quorum-configure-how-to?view=azuresql&preserve-view=true&tabs=powershell) which is the recommended approach for Windows Server Failover Clusters in Azure Virtual Machines. <br/><br/> Select **Not available** if the Azure VMs have no outbound internet access. This requires the use of a Shared Disk as a witness for Windows Server Failover Clusters in Azure Virtual Machines. 
   High availability and disaster recovery properties | **Async commit mode intent** | Defaulted to Disaster recovery. <br/><br/> Select **Disaster recovery** if you're using asynchronous commit availability mode to enable higher durability for the data without affecting performance. In the event of failover, data that hasn't yet been replicated might be lost. <br/><br/> Select **High availability** if you're using asynchronous commit data availability mode to improve availability and scale out read traffic. This setting allows assessment to leverage built-in high availability features in Azure SQL Databases, Azure SQL Managed Instances, and Azure Virtual Machines to provide higher availability and scale out.

1. Select **Save** if you made changes.

1. In **Assess Servers**, select **Next**.
1.	In **Select servers to assess** > **Assessment name** > specify a name for the assessment.
1.	In **Select or create a group** > select **Create New** and specify a group name.

     :::image type="content" source="./media/tutorial-assess-sql/assessment-add-servers-inline.png" alt-text="Screenshot of Location of New group button." lightbox="./media/tutorial-assess-sql/assessment-add-servers-expanded.png":::

1.	Select the appliance and select the servers you want to add to the group and select **Next**.
1.	In **Review + create assessment**, review the assessment details, and select **Create Assessment** to create the group and run the assessment.
1.	After the assessment is created, go to **Servers, databases and web apps** > **Azure Migrate: Discovery and assessment**, select the number next to Azure SQL assessment. If you do not see the number populated, select **Refresh** to get the latest updates.

     :::image type="content" source="./media/tutorial-assess-sql/assessment-sql-navigation.png" alt-text="Screenshot of Navigation to created assessment.":::

1.	Select the assessment name, which you wish to view.

> [!NOTE]
> As Azure SQL assessments are performance-based assessments, we recommend that you wait at least a day after starting discovery before you create an assessment. This provides time to collect performance data with higher confidence. If your discovery is still in progress, the readiness of your SQL instances will be marked as **Unknown**. Ideally, after you start discovery, **wait for the performance duration you specify (day/week/month)** to create or recalculate the assessment for a high-confidence rating. 


## Next steps

- [Learn more](concepts-azure-sql-assessment-calculation.md) about how Azure SQL assessments are calculated.
- Start migrating SQL instances and databases using [Azure Database Migration Service](/azure/dms/dms-overview).
