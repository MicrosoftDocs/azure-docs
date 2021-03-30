---
title: Azure SQL assessments in Azure Migrate Discovery and assessment tool
description: Learn about Azure SQL assessments in Azure Migrate Discovery and assessment tool
author: rashi-ms
ms.author: rajosh
ms.topic: conceptual
ms.date: 02/07/2021

---

# Assessment Overview (migrate to Azure SQL)

This article provides an overview of assessments for migrating on-premises SQL Server instances from a VMware environment to Azure SQL databases or Managed Instances using the [Azure Migrate: Discovery and assessment tool](./migrate-services-overview.md#azure-migrate-discovery-and-assessment-tool).

## What's an assessment?
An assessment with the Discovery and assessment tool is a point in time snapshot of data and measures the readiness and estimates the effect of migrating on-premises servers to Azure.

## Types of assessments

There are three types of assessments you can create using the Azure Migrate: Discovery and assessment tool.

**Assessment Type** | **Details**
--- | --- 
**Azure VM** | Assessments to migrate your on-premises servers to Azure virtual machines. <br/><br/> You can assess your on-premises servers in [VMware](how-to-set-up-appliance-vmware.md) and [Hyper-V](how-to-set-up-appliance-hyper-v.md) environment, and [physical servers](how-to-set-up-appliance-physical.md) for migration to Azure VMs using this assessment type.
**Azure SQL** | Assessments to migrate your on-premises SQL servers from your VMware environment to Azure SQL Database or Azure SQL Managed Instance.
**Azure VMware Solution (AVS)** | Assessments to migrate your on-premises servers to [Azure VMware Solution (AVS)](../azure-vmware/introduction.md). <br/><br/> You can assess your on-premises [VMware VMs](how-to-set-up-appliance-vmware.md) for migration to Azure VMware Solution (AVS) using this assessment type. [Learn more](concepts-azure-vmware-solution-assessment-calculation.md)

An Azure SQL assessment provides one sizing criteria:

**Sizing criteria** | **Details** | **Data**
--- | --- | ---
**Performance-based** | Assessments that make recommendations based on collected performance data | The Azure SQL configuration is based on performance data of SQL instances and databases, which includes: CPU utilization, Memory utilization, IOPS (Data and Log files), throughput and latency of IO operations.

## How do I assess my on-premises SQL servers?

You can assess your on-premises SQL Server instances by using the configuration and utilization data collected by a lightweight Azure Migrate appliance. The appliance discovers on-premises SQL server instances and databases and sends the configuration and performance data to Azure Migrate. [Learn More](how-to-set-up-appliance-vmware.md)

## How do I assess with the appliance?
If you're deploying an Azure Migrate appliance to discover on-premises servers, do the following steps:
1.	Set up Azure and your on-premises environment to work with Azure Migrate.
2.	For your first assessment, create an Azure Migrate project and add the Azure Migrate: Discovery and assessment tool to it.
3.	Deploy a lightweight Azure Migrate appliance. The appliance continuously discovers on-premises servers and sends configuration and performance data to Azure Migrate. Deploy the appliance as a VM or a physical server. You don't need to install anything on servers that you want to assess.

After the appliance begins discovery, you can gather servers you want to assess into a group and run an assessment for the group with assessment type **Azure SQL**.

Follow our tutorial for assessing [SQL Server instances](tutorial-assess-sql.md) to try out these steps.

## How does the appliance calculate performance data for SQL instances and databases?

The appliance collects performance data for compute settings with these steps:
1. The appliance collects a real-time sample point. For SQL servers, a sample point is collected every 30 seconds.
2. The appliance aggregates the sample data points collected every 30 seconds over 10 minutes. To create the data point, the appliance selects the peak values from all samples. It sends the max, mean and variance for each counter to Azure.
3. Azure Migrate stores all the 10-minute data points for the last month.
4. When you create an assessment, Azure Migrate identifies the appropriate data point to use for rightsizing. Identification is based on the percentile values for performance history and percentile utilization.
    - For example, if the performance history is one week and the percentile utilization is the 95th percentile, the assessment sorts the 10-minute sample points for the last week. It sorts them in ascending order and picks the 95th percentile value for rightsizing.
    - The 95th percentile value makes sure you ignore any outliers, which might be included if you picked the 99th percentile.
    - If you want to pick the peak usage for the period and don't want to miss any outliers, select the 99th percentile for percentile utilization.
5. This value is multiplied by the comfort factor to get the effective performance utilization data for these metrics that the appliance collects:
    - CPU utilization (%)
    - Memory utilization (%)
    - Read IO/s and Write IO/s (Data and Log files)
    - Read MB/s and Write MB/s (Throughput)
    - Latency of IO operations

## What properties are used to create and customize an Azure SQL assessment?

Here's what's included in Azure SQL assessment properties:

**Property** | **Details**
--- | ---
**Target location** | The Azure region to which you want to migrate. Azure SQL configuration and cost recommendations are based on the location that you specify.
**Target deployment type** | The target deployment type you want to run the assessment on: <br/><br/> Select **Recommended**, if you want Azure Migrate to assess the readiness of your SQL servers for migrating to Azure SQL MI and Azure SQL DB, and recommend the best suited target deployment option, target tier, Azure SQL configuration and monthly estimates.<br/><br/>Select **Azure SQL DB**, if you want to assess your SQL servers for migrating to Azure SQL Databases only and review the target tier, Azure SQL DB configuration and monthly estimates.<br/><br/>Select **Azure SQL MI**, if you want to assess your SQL servers for migrating to Azure SQL Databases only and review the target tier, Azure SQL MI configuration and monthly estimates.
**Reserved capacity** | Specifies reserved capacity so that cost estimations in the assessment take them into account.<br/><br/> If you select a reserved capacity option, you can't specify “Discount (%)”.
**Sizing criteria** | This property is used to right-size the Azure SQL configuration. <br/><br/> It is defaulted to **Performance-based** which means the assessment will collect the SQL Server instances and databases performance metrics to recommend an optimal-sized Azure SQL Managed Instance and/or Azure SQL  Database tier/configuration recommendation.
**Performance history** | Performance history specifies the duration used when performance data is evaluated.
**Percentile utilization** | Percentile utilization specifies the percentile value of the performance sample used for rightsizing.
**Comfort factor** | The buffer used during assessment. It accounts for issues like seasonal usage, short performance history, and likely increases in future usage.<br/><br/> For example, a 10-core instance with 20% utilization normally results in a two-core instance. With a comfort factor of 2.0, the result is a four-core instance instead.
**Offer/Licensing program** | The [Azure offer](https://azure.microsoft.com/support/legal/offer-details/) in which you're enrolled. Currently you can only choose from Pay-as-you-go and Pay-as-you-go Dev/Test. Note that you can avail additional discount by applying reserved capacity and Azure Hybrid Benefit on top of Pay-as-you-go offer.
**Service tier** | The most appropriate service tier option to accommodate your business needs for migration to Azure SQL Database and/or Azure SQL Managed Instance:<br/><br/>**Recommended** if you want Azure Migrate to recommend the best suited service tier for your servers. This can be General purpose or Business critical. <br/><br/> **General Purpose** If you want an Azure SQL configuration designed for budget-oriented workloads. [Learn More](../azure-sql/database/service-tier-general-purpose.md) <br/><br/> **Business Critical** If you want an Azure SQL configuration designed for low-latency workloads with high resiliency to failures and fast failovers. [Learn More](../azure-sql/database/service-tier-business-critical.md)
**Currency** | The billing currency for your account.
**Discount (%)** | Any subscription-specific discounts you receive on top of the Azure offer. The default setting is 0%.
**Azure Hybrid Benefit** | Specifies whether you already have a SQL Server license. <br/><br/> If you do and they're covered with active Software Assurance of SQL Server Subscriptions, you can apply for the Azure Hybrid Benefit when you bring licenses to Azure.

[Review the best practices](best-practices-assessment.md) for creating an assessment with Azure Migrate.

## Calculate readiness

> [!NOTE]
The assessment only includes databases that are in online status. In case the database is in any other status, the assessment ignores the readiness, sizing and cost calculation for such databases. In case you wish you assess such databases, please change the status of the database and recalculate the assessment in some time.

### Azure SQL readiness

Azure SQL readiness for SQL instances and databases is based on a feature compatibility check with Azure SQL Database and Azure SQL Managed Instance:
1. The Azure SQL assessment considers the SQL Server instance features that are currently used by the source SQL Server workloads (SQL Agent jobs, linked servers, etc.) and the user databases schemas (tables, views, triggers, stored procedures etc.) to identify compatibility issues.
1. If there are no compatibility issues found, the readiness is marked as **Ready** for the target deployment type (Azure SQL Database or Azure SQL Managed Instance)
1. If there are non-critical compatibility issues, such as degraded or unsupported features that do not block the migration to a specific target deployment type, the readiness is marked as **Ready** (hyperlinked and blue information icon) with **warning** details and recommended remediation guidance.
1. If there are any compatibility issues that may block the migration to a specific target deployment type, the readiness is marked as **Not ready** with **issue** details and recommended remediation guidance.
    - If there is even one database in a SQL instance which is not ready for a particular target deployment type, the instance is marked as **Not ready** for that deployment type.
1. If the discovery is still in progress or there are any discovery issues for a SQL instance or database, the readiness is marked as **Unknown** as the assessment could not compute the readiness for that SQL instance.

### Recommended deployment type

If you select the target deployment type as **Recommended** in the Azure SQL assessment properties, Azure Migrate recommends an Azure SQL deployment type that is compatible with your SQL instance. Migrating to a Microsoft-recommended target reduces your overall migration effort. 

#### Recommended deployment type based on Azure SQL readiness

 **Azure SQL DB readiness** | **Azure SQL MI readiness** | **Recommended deployment type** | **Azure SQL configuration and cost estimates calculated?**
 --- | --- | --- | --- |
 Ready | Ready | Azure SQL DB or <br/>Azure SQL MI | Yes
 Ready | Not ready or<br/> Unknown | Azure SQL DB | Yes
 Not ready or<br/>Unknown | Ready | Azure SQL MI | Yes
 Not ready | Not ready | Potentially ready for Azure VM | No
 Not ready or<br/>Unknown | Not ready or<br/>Unknown | Unknown | No

> [!NOTE]
> If the recommended deployment type is selected as **Recommended** in assessment properties and if the source SQL Server is good fit for both Azure SQL DB single database and Azure SQL Managed Instance, the assessment recommends a specific option that optimizes your cost and fits within the size and performance boundaries.

#### Potentially ready for Azure VM

If the SQL instance is not ready for Azure SQL Database and Azure SQL Managed Instance, the Recommended deployment type is marked as *Potentially ready for Azure VM*.
- The user is recommended to create an assessment in Azure Migrate with assessment type as "Azure VM" to determine if the server on which the instance is running is ready to migrate to an Azure VM instead. Note that:
    - Azure VM assessments in Azure Migrate are currently lift and shift focused and will not consider the specific performance metrics for running SQL instances and databases on the Azure virtual machine. 
    - When you run an Azure VM assessment on a server, the recommended size and cost estimates will be for all instances running on the server and can be migrated to an Azure VM using the Server Migration tool. Before you migrate, [review the performance guidelines](../azure-sql/virtual-machines/windows/performance-guidelines-best-practices.md) for SQL Server on Azure virtual machines.


## Calculate sizing

### Azure SQL configuration

After the assessment determines the readiness and the recommended Azure SQL deployment type, it computes a specific service tier and Azure SQL configuration(SKU size) that can meet or exceed the on-premises SQL instance performance:
1. During the discovery process, Azure Migrate collects SQL instance configuration and performance that includes:
    - vCores (allocated) and CPU utilization (%)
        - CPU utilization for a SQL instance is the percentage of allocated CPU utilized by the instance on the SQL server
        - CPU utilization for a database is the percentage of allocated CPU utilized by the database on the SQL instance
    - Memory (allocated) and memory utilization (%)
    - Read IO/s and Write IO/s (Data and Log files)
        - Read IO/s and Write IO/s at a SQL instance level is calculated by adding the Read IO/s and Write IO/s of all databases discovered in that instance.
    - Read MB/s and Write MB/s (Throughput)
    - Latency of IO operations
    - Total DB size and database file organizations
        - Database size is calculated by adding all the data and log files.
1. The assessment aggregates all the configuration and performance data and tries to find the best match across various Azure SQL service tiers and configurations, and picks a configuration that can match or exceed the SQL instance performance requirements, optimizing the cost.

### Confidence ratings 
Each Azure SQL assessment is associated with a confidence rating. The rating ranges from one (lowest) to five (highest) stars. The confidence rating helps you estimate the reliability of the size recommendations Azure Migrate provides.
- The confidence rating is assigned to an assessment. The rating is based on the availability of data points that are needed to compute the assessment.
- For performance-based sizing, the assessment collects performance data of all the SQL instances and databases, which include:
    - CPU utilization (%)
    - Memory utilization (%)
    - Read IO/s and Write IO/s (Data and Log files)
    - Read MB/s and Write MB/s (Throughput)
    - Latency of IO operations
    
If any of these utilization numbers isn't available, the size recommendations might be unreliable.
This table shows the assessment confidence ratings, which depend on the percentage of available data points:

**Data point availability** | **Confidence rating**
--- | ---
0%-20% | 1 star
21%-40% | 2 stars
41%-60% | 3 stars
61%-80% | 4 stars
81%-100% | 5 stars

#### Low confidence ratings
Here are a few reasons why an assessment could get a low confidence rating:
- You didn't profile your environment for the duration for which you're creating the assessment. For example, if you create the assessment with performance duration set to one day, you must wait at least a day after you start discovery for all the data points to get collected.
- Assessment is not able to collect the performance data for some or all the servers in the assessment period. For a high confidence rating, please ensure that:
    - Servers are powered on for the duration of the assessment
    - Outbound connections on ports 443 are allowed
    - If Azure Migrate connection status of the SQL agent in Azure Migrate is 'Connected' and check the last heartbeat 
    - If Azure Migrate connection status for all SQL instances is "Connected" in the discovered SQL instance blade

    Please 'Recalculate' the assessment to reflect the latest changes in confidence rating.
- Some databases or instances were created during the time for which the assessment was calculated. For example, assume you created an assessment for the performance history of the last month, but some databases or instances were created only a week ago. In this case, the performance data for the new servers will not be available for the entire duration and the confidence rating would be low.

> [!NOTE]
> As Azure SQL assessments are performance-based assessments, if the confidence rating of any assessment is less than five stars, we recommend that you wait at least a day for the appliance to profile the environment and then recalculate the assessment. Otherwise, performance-based sizing might be unreliable.

## Calculate monthly costs
After sizing recommendations are complete, Azure SQL assessment calculates the compute and storage costs for the recommended Azure SQL configurations using an internal pricing API. It aggregates the compute and storage cost across all instances to calculate the total monthly compute cost. 
### Compute cost
- For calculating compute cost for an Azure SQL configuration, the assessment considers following properties:
    - Azure Hybrid Benefit for SQL licenses
    - Reserved capacity
    - Azure target location
    - Currency
    - Offer/Licensing program
    - Discount (%)

### Storage cost
- The storage cost estimates only include data files and not log files. 
- For calculating storage cost for an Azure SQL configuration, the assessment considers following properties:
    - Azure target location
    - Currency
    - Offer/Licensing program
    - Discount (%)
- Backup storage cost is not included in the assessment.
- **Azure SQL Database**
    - A minimum of 5GB storage cost is added in the cost estimate and additional storage cost is added for storage in 1GB increments. [Learn More](https://azure.microsoft.com/pricing/details/sql-database/single/)
- **Azure SQL Managed Instance**
    - There is no storage cost added for the first 32 GB/instance/month storage and additional storage cost is added for storage in 32GB increments. [Learn More](https://azure.microsoft.com/pricing/details/azure-sql/sql-managed-instance/single/)
        
## Next steps
- [Review](best-practices-assessment.md) best practices for creating assessments. 
- Learn how to run an [Azure SQL assessment](how-to-create-azure-sql-assessment.md).