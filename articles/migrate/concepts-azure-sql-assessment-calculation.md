--- 
title: Azure SQL assessments in Azure Migrate Discovery and assessment tool 
description: Learn about Azure SQL assessments in Azure Migrate Discovery and assessment tool 
author: ankitsurkar06 
ms.service: azure-migrate 
ms.topic: conceptual 
ms.date: 05/16/2024 
ms.custom: engagement-fy24 
--- 
 
# Azure SQL assessments 
 
This article provides an overview of assessments for migrating on-premises SQL Server instances from a VMware, Microsoft Hyper-V, and Physical environment to SQL Server on Azure VM or Azure SQL Database or Azure SQL Managed Instance using the [Azure Migrate: Discovery and assessment tool](migrate-services-overview.md) 
 
## Discovery Sources for Azure SQL assessments 
 
For Azure SQL assessments you will have to necessarily discover your inventory of SQL workloads using light-weight Azure Migrate. During the discovery process you need to provide guest credentials to the VMs and SQL credentials for identifying the configuration of SQL workloads. The appliance discovers on-premises SQL server instances and databases and sends the configuration and performance data to Azure Migrate [Learn More](how-to-set-up-appliance-vmware.md). Once the SQL servers start appearing in the inventory you can start with SQL Assessment. 
 
### Assessment Settings 
 
| **Section** | **Setting** | **Details** | 
|---|---|---| 
| **Target and pricing settings** | **Target location** | The Azure region to which you want to migrate. Azure SQL configuration and cost recommendations are based on the location that you specify. | 
| **Target and pricing settings** | **Environment type** | The environment for the SQL deployments to apply pricing applicable to Production or Dev/Test. | 
| **Target and pricing settings** | **Offer/Licensing program** | The [Azure offer](https://azure.microsoft.com/support/legal/offer-details/) in which you're enrolled. The assessment estimates the cost for that offer. Select one of Pay-as-you Go, Enterprise Agreement support.  Currently, the field is Pay-as-you-go by default, which gives you retail Azure prices.<br>If the offer is set to _Pay-as-you-go_ and Reserved capacity is set to _No reserved instances_, the monthly cost estimates are calculated by multiplying the number of hours chosen in the VM uptime field with the hourly price of the recommended SKU. | 
| **Target and pricing settings** | **Savings options - Azure SQL MI and DB (PaaS)** | Specify the reserved capacity savings option that you want the assessment to consider to help optimize your Azure compute cost.<br><br>[Azure reservations](/azure/cost-management-billing/reservations/save-compute-costs-reservations) (1 year or 3 year reserved) are a good option for the most consistently running resources.<br>When you select 'None', the Azure compute cost is based on the Pay as you go rate or based on actual usage.<br><br>You need to select pay-as-you-go in offer/licensing program to be able to use Reserved Instances. The monthly cost estimates are calculated by multiplying 744 hours with the hourly price of the recommended SKU. | 
| **Target and pricing settings** | **Savings options - SQL Server on Azure VM (IaaS)** | Specify the savings option that you want the assessment to consider to help optimize your Azure compute cost.<br><br>[Azure reservations](/azure/cost-management-billing/reservations/save-compute-costs-reservations) (1 year or 3 year reserved) are a good option for the most consistently running resources.<br><br>[Azure Savings Plan](/azure/cost-management-billing/savings-plan/savings-plan-compute-overview) (1 year or 3 year savings plan) provide additional flexibility and automated cost optimization. Ideally post migration, you could use Azure reservation and savings plan at the same time (reservation is consumed first), but in the Azure Migrate assessments, you can only see cost estimates of 1 savings option at a time.<br><br>When you select 'None', the Azure compute cost is based on the Pay as you go rate or based on actual usage.<br><br>You need to select pay-as-you-go in offer/licensing program to be able to use Reserved Instances or Azure Savings Plan. The monthly cost estimates are calculated by multiplying 744 hours in the VM uptime field with the hourly price of the recommended SKU. | 
| **Target and pricing settings** | **Currency** | The billing currency for your account. | 
| **Target and pricing settings** | **Discount (%)** | Any subscription-specific discounts you receive on top of the Azure offer. The default setting is 0%. | 
| **Target and pricing settings** | **VM uptime** | Specify the duration (days per month/hour per day) that servers/VMs run. This is useful for computing cost estimates for SQL Server on Azure VM where you're aware that Azure VMs might not run continuously.<br>Cost estimates for servers where recommended target is _SQL Server on Azure VM_ are based on the duration specified. Default is 31 days per month/24 hours per day. | 
| **Target and pricing settings** | **Azure Hybrid Benefit** | Specify whether you already have a Windows Server and/or SQL Server license or Enterprise Linux subscription (RHEL and SLES). Azure Hybrid Benefit is a licensing benefit that helps you to significantly reduce the costs of running your workloads in the cloud. It works by letting you use your on-premises Software Assurance-enabled Windows Server and SQL Server licenses on Azure. For example, if you have a SQL Server license and they're covered with active Software Assurance of SQL Server Subscriptions, you can apply for the Azure Hybrid Benefit when you bring licenses to Azure. | 
| **Assessment criteria** | **Sizing criteria** | Set to _Performance-based_ by default, which means Azure Migrate collects performance metrics pertaining to SQL instances and the databases managed by it to recommend an optimal-sized SQL Server on Azure VM and/or Azure SQL Database and/or Azure SQL Managed Instance configuration.<br><br>You can change this to _As on-premises_ to get recommendations based on just the on-premises SQL Server configuration without the performance metric based optimizations. | 
| **Assessment criteria** | **Performance history** | Indicate the data duration on which you want to base the assessment. (Default is one day) | 
| **Assessment criteria** | **Percentile utilization** | Indicate the percentile value you want to use for the performance sample. (Default is 95th percentile) | 
| **Assessment criteria** | **Comfort factor** | Indicate the buffer you want to use during assessment. This accounts for issues like seasonal usage, short performance history, and likely increases in future usage. | 
| **Assessment criteria** | **Optimization preference** | Specify the preference for the recommended assessment report. Selecting **Minimize cost** would result in the Recommended assessment report recommending those deployment types that have least migration issues and are most cost effective, whereas selecting **Modernize to PaaS** would result in Recommended assessment report recommending PaaS(Azure SQL MI or DB) deployment types over IaaS Azure(VMs), wherever the SQL Server instance is ready for migration to PaaS irrespective of cost. | 
| **Azure SQL Managed Instance sizing** | **Service Tier** | Choose the most appropriate service tier option to accommodate your business needs for migration to Azure SQL Managed Instance:<br><br>Select _Recommended_ if you want Azure Migrate to recommend the best suited service tier for your servers. This can be General purpose or Business critical.<br><br>Select _General Purpose_ if you want an Azure SQL configuration designed for budget-oriented workloads.<br><br>Select _Business Critical_ if you want an Azure SQL configuration designed for low-latency workloads with high resiliency to failures and fast failovers. | 
| **Azure SQL Managed Instance sizing** | **Instance type** | Defaulted to _Single instance_. | 
| **Azure SQL Managed Instance sizing** | **Pricing Tier** | Defaulted to _Standard_. | 
| **SQL Server on Azure VM sizing** | **VM series** | Specify the Azure VM series you want to consider for _SQL Server on Azure VM_ sizing. Based on the configuration and performance requirements of your SQL Server or SQL Server instance, the assessment recommends a VM size from the selected list of VM series.<br>You can edit settings as needed. For example, if you don't want to include D-series VM, you can exclude D-series from this list.<br>As Azure SQL assessments intend to give the best performance for your SQL workloads, the VM series list only has VMs that are optimized for running your SQL Server on Azure Virtual Machines (VMs). [Learn more](/azure/azure-sql/virtual-machines/windows/performance-guidelines-best-practices-checklist?preserve-view=true&view=azuresql). | 
| **SQL Server on Azure VM sizing** | **Storage Type** | Defaulted to _Recommended_, which means the assessment recommends the best suited Azure Managed Disk based on the chosen environment type, on-premises disk size, IOPS and throughput. | 
| **Azure SQL Database sizing** | **Service Tier** | Choose the most appropriate service tier option to accommodate your business needs for migration to Azure SQL Database:<br><br>Select **Recommended** if you want Azure Migrate to recommend the best suited service tier for your servers. This can be General purpose or Business critical.<br><br>Select **General Purpose** if you want an Azure SQL configuration designed for budget-oriented workloads.<br><br>Select **Business Critical** if you want an Azure SQL configuration designed for low-latency workloads with high resiliency to failures and fast failovers. | 
| **Azure SQL Database sizing** | **Instance type** | Defaulted to _Single database_. | 
| **Azure SQL Database sizing** | **Purchase model** | Defaulted to _vCore_. | 
| **Azure SQL Database sizing** | **Compute tier** | Defaulted to _Provisioned_. | 
| **High availability and disaster recovery properties** | **Disaster recovery region** | Defaulted to the [cross-region replication pair](/azure/reliability/cross-region-replication-azure) of the Target location. In an unlikely event when the chosen Target location doesn't yet have such a pair, the specified Target location itself is chosen as the default disaster recovery region. | 
| **High availability and disaster recovery properties** | **Multi-subnet intent** | Defaulted to Disaster recovery.<br><br>Select **Disaster recovery** if you want asynchronous data replication where some replication delays are tolerable. This allows higher durability using geo-redundancy. In the event of failover, data that hasn't yet been replicated might be lost.<br><br>Select **High availability** if you desire the data replication to be synchronous and no data loss due to replication delay is allowable. This setting allows assessment to leverage built-in high availability options in Azure SQL Databases and Azure SQL Managed Instances, and availability zones and zone-redundancy in Azure Virtual Machines to provide higher availability. In the event of failover, no data is lost. | 
| **High availability and disaster recovery properties** | **Internet Access** | Defaulted to Available.<br><br>Select **Available** if you allow outbound Internet access from Azure VMs. This allows the use of [Cloud Witness](/azure/azure-sql/virtual-machines/windows/hadr-cluster-quorum-configure-how-to?tabs=powershell) which is the recommended approach for Windows Server Failover Clusters in Azure Virtual Machines.<br><br>Select **Not available** if the Azure VMs have no outbound Internet access. This requires the use of a Shared Disk as a witness for Windows Server Failover Clusters in Azure Virtual Machines. | 
| **High availability and disaster recovery properties** | **Async commit mode intent** | Defaulted to Disaster recovery.<br><br>Select **Disaster recovery** if you're using asynchronous commit availability mode to enable higher durability for the data without affecting performance. In the event of failover, data that hasn't yet been replicated might be lost.<br><br>Select **High availability** if you're using asynchronous commit data availability mode to improve availability and scale out read traffic. This setting allows assessment to leverage built-in high availability features in Azure SQL Databases, Azure SQL Managed Instances, and Azure Virtual Machines to provide higher availability and scale out. | 
| **Security** | **Security** | Defaulted to Yes, with Microsoft Defender for Cloud.<br><br>Specifies whether you want to assess readiness and cost for security tooling on Azure. If the setting has the default value **Yes, with Microsoft Defender for Cloud**, it will assess security readiness and costs for your Azure SQL MI/DB with Microsoft Defender for Cloud. | 
 
[Review the best practices](best-practices-assessment.md) for creating an assessment with Azure Migrate. 
 
## Assessment Report 
 
### Azure readiness for SQL Workloads 
 
> [!NOTE] 
> The assessment only includes databases that are in online status. In case the database is in any other  status, the assessment ignores the readiness, sizing and cost calculation for such databases. In case you wish to assess such databases, change the status of the database and recalculate the assessment in some time. 
 
### Readiness checks for different migration strategies 
 
Azure SQL readiness for SQL instances and databases is based on a feature compatibility check with SQL Server on Azure VM, [Azure SQL Database](/azure/azure-sql/migration-guides/database/sql-server-to-sql-database-assessment-rules), and [Azure SQL Managed Instance](/azure/azure-sql/migration-guides/managed-instance/sql-server-to-sql-managed-instance-assessment-rules). The Azure SQL assessment considers the SQL Server instance features that are currently used by the source SQL Server workloads (SQL Agent jobs, linked servers, etc.) and the user databases schemas (tables, views, triggers, stored procedures etc.) to identify compatibility issues. 
 
| **Azure Readiness** | **Probable** **Compatibility Issues** | **Details** | **Recommended Remediation Guidance** | 
|---|---|---|---| 
| Ready | No compatibility issues found | Instance is ready for the target deployment type (SQL Server on Azure VM or Azure SQL Database or Azure SQL Managed Instance) | N/A | 
| Ready | Non-critical compatibility issues | Deprecated or unsupported features that don't block the migration to a specific target deployment type | Recommended remediation guidance provided | 
| Ready with conditions | Compatibility issues that might block migration to a specific target | | Recommended remediation guidance provided | 
| Ready with conditions | In the Recommended deployment, Instances to Azure SQL MI, and Instances to SQL Server on Azure VM readiness reports, if there's even one database in a SQL instance, which isn't ready for a particular target deployment type, the instance is marked as **Ready with conditions** for that deployment type | Instance is marked as Ready with conditions for that deployment type | Recommended remediation guidance provided | 
| Not ready | No suitable configuration found | The assessment couldn't find a SQL Server on Azure VM/Azure SQL MI/Azure SQL DB configuration meeting the desired configuration and performance characteristics<br>eg. If the assessment can't find a disk for the required size, it marks the instance as unsuitable | Review the recommendation to make the instance/server ready for the desired target deployment type | 
| Unknown | Discovery in progress or discovery issues | The assessment couldn't compute the readiness for that SQL instance | N/A | 
 
> [!NOTE] 
> In the recommended deployment strategy, migrating instances to SQL Server on Azure VM is the recommended strategy for migrating SQL Server instances.  
 
### Security readiness 
 
If the database/instance is marked as **Ready** for the target deployment type Azure SQL DB/MI, it's automatically considered **Ready** for Microsoft Defender for SQL. If the database/instance is marked as **Ready** for the target deployment type SQL Server on Azure VM, it's considered **Ready** for Microsoft Defender for SQL if it's running any of these versions: 
 
SQL Server versions 2012, 2014, 2016, 2017, 2019, 2022 
 
For all other versions, it's marked as **Ready with Conditions**. 
 
### Target rightsizing 
 
After the assessment determines the readiness and the recommended Azure SQL deployment type, it computes a specific service tier and Azure SQL configuration (SKU size) that can meet or exceed the on-premises SQL Server performance. This calculation depends on whether you're using _As on-premises_ or _Performance-based_ sizing criteria. 
 
| **Sizing criteria** | **Details** | **Data** | 
|---|---|---| 
| **As on-premises** | Assessments that make recommendations based on the on-premises SQL Server configuration alone | The Azure SQL configuration is based on the on-premises SQL Server configuration, which includes cores allocated, total memory allocated and database sizes. | 
| **Performance-based** | Assessments that make recommendations based on collected performance data | The Azure SQL configuration is based on performance data of SQL instances and databases, which includes CPU utilization, Memory utilization, IOPS (Data and Log files), throughput, and latency of IO operations. | 
 
 
## Rightsizing for Azure SQL MI and Azure SQL DB  
 
### As on-premises sizing calculation 
 
The assessment computes and identifies a service tier and Azure SQL configuration (SKU sizes) that can meet or exceed the on-premises SQL instance configuration. Azure Migrate collects the following SQL instance configuration datapoints from on-premises servers: 
 
- vCores (allocated) 
- Memory (allocated) 
- Total DB size and database file organizations (DB size is calculated by adding all the data and log files) 
 
The assessment aggregates all the configuration datapoints to identify the best match across available Azure SQL service tiers and picks a configuration that can match or exceed the SQL instance requirements while optimizing the cost. 
 
### Performance-based sizing calculation 
 
The assessment computes and identifies a service tier and Azure SQL configuration (SKU size) that can meet or exceed the on-premises SQL instance performance requirements based on following datapoints: 
 
- vCores (allocated) and CPU utilization (%) 
  - CPU utilization for a SQL instance is the percentage of allocated  
  CPU utilized by the instance on the SQL server. 
  - CPU utilization for a database is the percentage of allocated CPU utilized by the database on the SQL instance. 
 
- Memory (allocated) and memory utilization (%) 
- Read IO/s and Write IO/s (Data and Log files) 
  - Read IO/s and Write IO/s at a SQL instance level is calculated by adding the Read IO/s and Write IO/s of all databases discovered in that instance. 
- Read MB/s and Write MB/s (Throughput) 
- Latency of IO operations 
- Total DB size and database file organizations 
  - Database size is calculated by adding all the data and log files. 
- Always On Failover Cluster Instance network subnet configuration (Single Subnet or Multi-Subnet) 
- Always On Availability Group configurations 
  - Network configuration of participating instances (Single Subnet or Multi-Subnet) 
  - Number and type of secondary replicas. 
    - Availability Mode: Synchronous Commit vs Asynchronous Commit 
    - Connection Mode: Read-only vs None 
 
The assessment aggregates all the configuration and performance data and tries to find the best match across various Azure SQL service tiers and configurations and picks a configuration that can match or exceed the SQL-instance performance requirements, optimizing the cost. 
 
## Rightsizing for Instances to SQL Server on Azure VM configuration 
 
### As on-premises sizing calculation 
 
_Instance to SQL Server on Azure VM_ assessment report covers the ideal approach for migrating SQL Server instances to SQL Server on Azure VM, adhering to the best practices. [Learn more](/azure/azure-sql/virtual-machines/windows/performance-guidelines-best-practices-checklist?preserve-view=true&view=azuresql). 
 
#### Storage sizing  
 
For storage sizing, the assessment maps each disk on the on-premises instance to an Azure disk.  
 
- The disk size required is the sum of size of SQL Data and SQL Log drives. 
 
- The assessment recommends creating a storage disk pool for all SQL Log and SQL Data drives. For temporary drives, the assessment recommends storing the files in the local drive. 
 
- If the assessment can't find a disk for the required size, it marks the instance as unsuitable for migrating to SQL Server on Azure VM 
 
- If the environment type is _Production_, the assessment tries to find Premium disks to map each of the disks, else it tries to find a suitable disk, which could either be Premium or Standard SSD disk. If there are multiple eligible disks, assessment selects the disk with the lowest cost. 
 
#### Compute sizing 
 
After storage disks are identified, the assessment considers CPU and memory requirements of the instance to find a suitable VM SKU in Azure. 
 
- The assessment uses allocated cores and memory to find a suitable Azure VM size. 
- If a suitable size is found, Azure Migrate applies the storage calculations to check disk-VM compatibility.  
- If there are multiple eligible Azure VM sizes, the one with the lowest cost is recommended. 
 
> [!Note] 
> As Azure SQL assessments are intended to give the best performance for your SQL workloads, the VM series list only has VMs that are optimized for running your SQL Server on Azure Virtual Machines (VMs). [Learn more](/azure/azure-sql/virtual-machines/windows/performance-guidelines-best-practices-checklist?preserve-view=true&view=azuresql). 
 
### Performance-based sizing calculation 
 
If the source is a SQL Server Always On Failover Cluster Instance (FCI), the assessment report covers the approach for migrating to a two-node SQL Server Failover Cluster Instance. This preserves the high availability and disaster recovery intents while adhering to the best practices. [Learn more](/azure/azure-sql/virtual-machines/windows/hadr-cluster-best-practices?view=azuresql&preserve-view=true&tabs=windows2012) 
 
#### Storage sizing 
 
For storage sizing, the assessment maps each disk on the on-premises instance to an Azure disk.  
 
The min. disk size required is the sum of size of SQL Data and SQL Log drives 
 
The IO/s and throughput required is identified by adding read and write IO/s and the read and write throughput. Candidate disks are identified that can provide required throughput and mapped to required size.  
 
- The assessment recommends creating a storage disk pool for all SQL Log and SQL Data drives. For temp drives, the assessment recommends storing the files in the local drive. 
 
- If the source is a SQL Server Always On Failover Cluster Instance, shared disk configuration is selected. 
 
- If the environment type is _Production_, the assessment tries to find Premium disks to map each of the disks, else it tries to find a suitable disk, which could either be Premium or Standard SSD disk. If there are multiple eligible disks, assessment selects the disk with the lowest cost. 
 
### Compute sizing 
 
After storage disks are identified, the assessment considers CPU and memory requirements of the instance to find a suitable VM SKU in Azure. 
 
The assessment calculates effective utilized cores and memory to find a suitable Azure VM size. _Effective_ _utilized RAM or memory_ for an instance is calculated by aggregating the buffer cache (buffer pool size in MB) for all the databases running in an instance. 
 
If there are multiple eligible Azure VM sizes, the one with the lowest cost is recommended. 
 
If the source is a SQL Server Always On Failover Cluster Instance, the compute size is used again for a second Azure VM to meet the need for two nodes. 
 
## Rightsizing for Lift and Shift Migration to Azure VM 
 
For lift and shift migration refer compute and storage sizing [here](/azure/migrate/concepts-assessment-calculation). 
 
## Recommendation details 
 
Once the readiness and sizing calculation is complete, the optimization preference is applied to arrive at a recommended target and configuration. The Recommendation Details provide a detailed explanation of the readiness and sizing calculations behind the recommendation. 
 
## Migration guidance 
 
This section provides guidance to configure the target resource and steps to migrate. The steps are specific to the source and the target deployment combinations. This guidance is specifically useful for users who intend to migrate Always On Failover Cluster Instances (FCI) and Availability Groups (AG). 
 
## Monthly costs 
 
After the candidate SKUs are selected, Azure SQL assessment calculates the compute and storage costs for the recommended Azure SQL configurations using an internal pricing API. It aggregates the compute and storage cost across all instances to calculate the total monthly compute cost. 
 
### Compute cost 
 
To calculate the compute cost for an Azure SQL configuration, the assessment considers the following properties: 
 
- Azure Hybrid Benefit for SQL and Windows licenses or Enterprise Linux subscription (RHEL and SLES) 
- Environment type 
- Reserved capacity 
- Azure target location 
- Currency 
- Offer/Licensing program 
- Discount (%) 
 
### Storage cost 
 
The storage cost estimates only include data files and not log files. 
 
For calculating storage cost for an Azure SQL configuration, the assessment considers following properties: 
 
### SQL Server migration scenarios 
 
The SQL Assessment provides a combined report which allows you to compare migration of your on-premises workloads to available SQL targets. The report defines different migration strategies that you can consider for your SQL deployments. You can review the readiness and cost for target deployment types and the cost estimates for SQL Servers/Instances/Databases that are marked ready or ready with conditions: 
 
**Recommended deployment**: This is a strategy where an Azure SQL deployment type that is the most compatible with your SQL instance. It is the most cost-effective and is recommended by Microsoft. Migrating to a Microsoft-recommended target reduces your overall migration effort. If your instance is ready for SQL Server on Azure VM, Azure SQL Managed Instance and Azure SQL Database, the target deployment type, which has the least migration readiness issues and is the most cost-effective is recommended. You can see the SQL Server instance readiness for different recommended deployment targets and monthly cost estimates for SQL instances marked _Ready_ and _Ready with conditions_. 
 
> [!Note] 
> In the recommended deployment strategy, migrating instances to SQL Server on Azure VM is the recommended strategy for migrating SQL Server instances. When the SQL Server credentials are not available, the Azure SQL assessment provides right-sized lift-and-shift, that is, _Server to SQL Server on Azure VM_ recommendations. 
 
**Migrate all instances to Azure SQL MI**: In this strategy, you can see the readiness and cost estimates for migrating all SQL Server instances to Azure SQL Managed Instance. There's no storage cost added for the first 32 GB/instance/month storage and additional storage cost is added for storage in 32 GB increments. [Learn More](https://azure.microsoft.com/pricing/details/azure-sql/sql-managed-instance/single/). 
 
**Migrate all instances to SQL Server on Azure VM**: In this strategy, you can see the readiness and cost estimates for migrating all SQL Server instances to SQL Server on Azure VM. 
 
**Migrate all servers to SQL Server on Azure VM**: In this strategy, you can see how you can rehost the servers running SQL Server to SQL Server on Azure VM and review the readiness and cost estimates. Even when SQL Server credentials are not available, this report will provide right-sized lift-and-shift, that is, "Server to SQL Server on Azure VM" recommendations. The readiness and sizing logic is similar to Azure VM assessment type. 
 
**Migrate all SQL databases to Azure SQL Database** In this strategy, you can see how you can migrate individual databases to Azure SQL Database and review the readiness and cost estimates. 
 
- Azure target location 
- Currency 
- Offer/Licensing program 
- Discount (%) 
 
>[!NOTE] 
> Backup storage cost isn't included in the assessment. 
 
A minimum of 5 GB storage cost is added in the cost estimate and additional storage cost is added for storage in 1 GB increments. [Learn More](https://azure.microsoft.com/pricing/details/sql-database/single/). 
 
 
## Next steps 
 
- [Review](best-practices-assessment.md) best practices for creating assessments. 
- Learn how to run an [Azure SQL assessment](how-to-create-azure-sql-assessment.md). 