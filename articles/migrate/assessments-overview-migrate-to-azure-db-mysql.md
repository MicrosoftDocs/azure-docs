---
title: Overview of Assessments for Migration to Azure Database for MySQL (preview)
description: Learn how to assess your on-premises MySQL database instances for migration to Azure Database for MySQL using the Azure Migrate Discovery and Assessment tool. This article provides an overview of the assessment process, types of assessments, and key criteria for evaluating readiness, sizing, and cost.
author: ankitsurkar06
ms.author: ankitsurkar
ms.topic: concept-article
ms.date: 05/08/2025
monikerRange: migrate-classic
# Customer intent: "As a database administrator, I want to use an assessment tool to evaluate my on-premises MySQL database for migration, so that I can understand readiness, sizing, and costs for transitioning to Azure Database for MySQL."
---

# Assessment overview - Migrate to Azure Database for MySQL (preview)

This article provides an overview of assessments for migrating on-premises MySQL database instances from a VMware, Microsoft Hyper-V, and Physical environment to Azure Database for MySQL using the [Azure Migrate: Discovery and assessment tool](migrate-services-overview.md).

## Overview

An assessment with the Discovery and assessment tool provides a point-in-time snapshot of data, measuring the readiness and estimating the impact of migrating on-premises servers, databases, and web apps to Azure, while also offering recommendations on suitable Azure SKUs and associated costs.

### Assessment Types

The Azure Migrate: Discovery and assessment tool supports the following types of assessments:

**Assessment Type** | **Details**
--- | ---
**Azure VM** | Assessments to migrate your on-premises servers to Azure virtual machines.<br/><br>You can assess your on-premises servers in [VMware environment](how-to-set-up-appliance-vmware.md), [Hyper-V environment](how-to-set-up-appliance-hyper-v.md), and [physical servers](how-to-set-up-appliance-physical.md) for migration to Azure VMs using this assessment type.
**Azure Databases** | Assessments to migrate your on-premises [SQL servers to Azure SQL Database or Azure SQL Managed Instance](concepts-azure-sql-assessment-calculation.md), or on-premises MySQL database instances to Azure Database for MySQL.
**Web apps on Azure** | Assessments to migrate your on-premises [Spring Boot apps to Azure Spring Apps](concepts-azure-spring-apps-assessment-calculation.md) or [ASP.NET/Java web apps to Azure App Service](concepts-azure-webapps-assessment-calculation.md).
**Azure VMware Solution (AVS)** | Assessments to migrate your on-premises [VMware VMs](how-to-set-up-appliance-vmware.md) to [Azure VMware Solution (AVS)](/azure/azure-vmware/introduction). [Learn more](concepts-azure-vmware-solution-assessment-calculation.md).


## MySQL assessments - Overview and sizing criteria

After you [discover MySQL instances and their attributes](tutorial-discover-mysql-database-instances.md) in your on-premises environment, a MySQL Assessment provides the following information on the instances:
 - An assessment of their readiness for migration to Azure Database for MySQL.
 - Recommendations on the suitable compute, storage, and IO SKUs for hosting the MySQL workloads on Azure Database for MySQL, along with the associated costs.

MySQL assessments are performed on the **performance-based** sizing criteria, making recommendations based on collected performance data of MySQL instances, including CPU utilization, Memory utilization, IOPS, IO Count, total number of connections and read-write ratio.  

> [!NOTE]
> The assessments only include MySQL database instances that are in online status. For instances with any other status, the assessment ignores the readiness, sizing, and cost calculation. In case you wish to assess such instances, change the status of the instance and recalculate the assessment later.

## Assess on-premises MySQL instances

You can assess your on-premises MySQL instances using the configuration and utilization data collected by lightweight Azure Migrate appliances, which discover the instances and databases and send the data to the Azure Migrate service.

1. Deploy the Azure Migrate appliances to discover the MySQL instances: See this [tutorial](tutorial-discover-mysql-database-instances.md) to deploy the Azure Migrate appliances and discover the MySQL instances that you want to assess.
1. Create a MySQL assessment: See this [tutorial](create-mysql-assessment.md) to create a new assessment and review the reports.

## Properties to create and customize a MySQL assessment

The Azure Database for MySQL assessment properties includes:

**Target and pricing settings**

| **Setting** | **Details**
| --- | ---
| **Target location**  | The Azure region to which you want to migrate. Azure Database for MySQL configuration and cost recommendations are based on the location that you specify.
|**Target and pricing settings**  **Environment type** | The environment for the MySQL deployments to apply Azure Database for MySQL configuration and cost recommendations applicable to Production or Development/Testing.
| **Licensing program**  | The Azure offer if you're enrolled. Currently, the field is Pay-as-you-go by default, which gives you retail Azure prices.
| **Currency** | The billing currency for your account.
| **Savings options**  | Specify the reserved capacity savings option that you want the assessment to consider to optimize your Azure compute cost. <br/><br> Azure reservations (one year or three years reserved) are a good option for the most consistently running resources. <br/><br> When you select None, the Azure compute cost is based on the Pay-as-you-go rate or based on actual usage. <br/><br> You need to select pay-as-you-go in the offer/licensing program to be able to use Reserved Instances. When you select any savings option other than None, the Discount (%) setting isn’t applicable. The monthly cost estimates are calculated by multiplying 744 hours with the hourly price of the recommended SKU.
| **Discount (%)** | Any subscription-specific discounts you receive on top of the Azure offer. The default setting is 0%.

**Assessment criteria**

| **Setting** | **Details**|
| --- | --- |
| **Sizing criteria**  | Set to be **Performance-based** by default, which means Azure Migrate collects performance metrics pertaining to MySQL instances to recommend an optimal-sized Azure Database for MySQL instance configuration.
| **Performance history** | Indicate the data duration on which you want to base the assessment (Default is one day).
| **Percentile utilization** | Indicate the percentile value you want to use for the performance sample (Default is 95th percentile).
| **Comfort factor** | Indicate the buffer you want to use during assessment. This accounts for issues like seasonal usage, short performance history, and likely increases in future usage.

**Azure DB for MySQL – Flexible Server sizing**

| **Setting** | **Details**
| --- | ---
| **Service Tier** | Choose the most appropriate service tier option to accommodate your business needs for migration to Azure Database for MySQL. <br/><br> By default, all three service tiers are selected. As per the assessment report, we recommend the best suited service tier for your servers based on your Environment Type and the collected performance data. <br/><br> - Select *General Purpose* if you want an Azure Database for MySQL configuration designed for business workloads that require balanced computing and memory with scalable I/O throughput. <br/><br> - Select *Business Critical* if you want an Azure Database for MySQL configuration designed for high-performance database workloads that require in-memory performance for faster transaction processing and higher concurrency.


## Performance data calculation for MySQL instances

The appliance collects the following performance data for compute settings: 

- The appliance collects a real-time sample point. For MySQL instances, it collects a sample point every 30 seconds.
- The appliance aggregates the sample data points collected every 30 seconds over 10 minutes. To create the data point, the appliance selects the peak values from all samples. It sends the max and means for each counter to Azure.
- Azure Migrate stores all the 10-minute data points for the last month.
- When you create an assessment, Azure Migrate identifies the appropriate data point to use for right sizing. Identification is based on the percentile values for performance history and percentile utilization.
    - For example, if the performance history spans a week and the utilization is at 95th percentile, the assessment sorts the 10-minute sample points for the last week. It sorts them in ascending order and picks the 95th percentile value for right-sizing.
    - The 95th percentile value ensures you ignore any outliers, which might be included if you picked the 99th percentile.
    - If you want to pick the peak usage for the period and don't want to miss any outliers, select the 99th percentile for percentile utilization.
- This value is multiplied by the comfort factor to get the effective performance utilization data for these metrics that the appliance collects:
    - CPU utilization (%)
    - Memory utilization (%)
    - IOPS and IO Count
    - Total number of connections to the instance
    - Read-write ratio


## Calculate readiness
Readiness to migrate a MySQL instance to Azure Database for MySQL is determined through various feature compatibility checks between the source and target instances. These checks include:

- Supported versions, editions, storage engines, plugins, configuration or parameter values, user permissions and privileges.
- Maximum supported storage size, vCores, Memory, IOPS, DB buffer pool size, connections, tablespace number, and size.
- Security settings, and more.

An instance is then marked as:
- **Ready**: If no major compatibility issues were found between source and target MySQL instances.
- **Ready with conditions**: If there are non-critical compatibility issues such as degraded or unsupported features that don't block the migration to Azure Database for MySQL. Azure Migrate displays the migration warnings with impact details and recommended remediation guidelines.
- **Not ready**: If there are any compatibility issues that may block the migration to Azure Database for MySQL. Azure Migrate displays the migration issues with impact details and recommended remediation guidance.
- **Unknown**:  If the discovery is still in progress or there are any discovery issues in the source instance.


## Calculate sizing

After the assessment determines the readiness, for every server that is either **Ready** or **Ready with conditions**, Azure Migrate uses the performance data to compute a specific Azure Database for MySQL service tier and configuration (SKU size) that can meet or exceed the on-premises MySQL performance. 

### Compute sizing

During the discovery process, Azure Migrate collects the MySQL instance configuration and performance data that includes:
- **vCores (allocated) and CPU utilization (%)**: CPU utilization for a MySQL instance is the percentage of allocated CPU utilized by the MySQL instance on the server.
- **Memory (allocated) and memory utilization (%)**: The amount of memory allocated to the MySQL instance, and its utilization percentage.
- **IOPS**: Calculated by adding the Read and Write IOPS for each instance.
- Total number of connections made to the MySQL instance.
- **Read-write ratio**: Used to determine whether the workload is memory-intensive or CPU-intensive, which in turn helps decide the appropriate service tier.

The assessment aggregates all the configuration and performance data and tries to find the best match across the [various Azure Database for MySQL service tiers and configurations](/azure/mysql/flexible-server/concepts-service-tiers-storage), selecting a configuration that can match or exceed the MySQL instance performance requirements, and  optimizing the cost.

### Storage sizing
Azure Migrate calculates the total disk space used by the MySQL instance (including database files, temporary files, transaction logs, and the MySQL server logs) and suggests the recommended storage to provision in Azure Database for MySQL. For Burstable and General Purpose service tiers, the storage range spans from a minimum of 20 GiB to a maximum of 16 TiB, while for the Business Critical service tier, the storage support extends up to 32 TiB. In all service tiers, storage is scaled in 1 GiB increments and can be scaled up (but not down) after the server is created.

### IOPS sizing
Azure Migrate recommends the [Autoscale IOPS feature in Azure Database for MySQL](/azure/mysql/flexible-server/concepts-service-tiers-storage#autoscale-iops), which enables the MySQL instance to automatically scale the database instance’s performance (IO) seamlessly and independent of the selected storage size, depending on the workload needs. With Autoscale IOPS, you pay only for the IO the server uses, eliminating the need to provision and pay for resources that aren't fully utilized, thereby saving time and money.

## Confidence ratings

Each MySQL assessment is associated with a confidence rating. The rating ranges from one (lowest) to five (highest) stars. The confidence rating helps you estimate the reliability of the size recommendations Azure Migrate provides.
-  The rating is based on the availability of data points that are required to compute the assessment.
- For performance-based sizing, the assessment collects performance data of all the MySQL instances and databases, which include:
  - CPU utilization (%)
  -	Memory utilization (%)
  -	IOPS
  - Number of connections to the MySQL instance
  - Read-write ratio
- If any of these utilization numbers aren't available, the size recommendations might be unreliable. This table shows the assessment confidence ratings, which depend on the percentage of available data points:

    **Data point availability** | **Confidence rating**
    --- | ---
    0%-20% | One star
    21%-40% | Two stars
    41%-60% | Three stars
    61%-80% | Four stars
    81%-100% | Five stars


### Low confidence ratings

Here are a few reasons why an assessment could get a low confidence rating:

- You didn't profile your environment for the duration for which you're creating the assessment. For example, if you create the assessment with performance duration set to one day, you must wait at least a day after you start discovery for all the data points to get collected.
- The Assessment isn't able to collect the performance data for some or all the servers in the assessment period. 

**Recalculate** the assessment to reflect the latest changes in confidence rating.

- Some database instances were created during the time for which the assessment was calculated. For example, you created an assessment for the performance history of the last month, but some instances were created only a week ago. In this case, the performance data for the new servers won't be available for the entire duration and the confidence rating would be low.

### High confidence ratings

Here are a few reasons why an assessment could have a high confidence rating:

  - Servers are powered on during the assessment.
  - Outbound connections on ports 3306 are allowed.
  - If Azure Migrate connection status of the MySQL agent in Azure Migrate is Connected, check the last heartbeat.
  - Azure Migrate connection status for all MySQL instances is Connected in the discovered MySQL instance section.

 **Recalculate** the assessment to reflect the latest changes in confidence rating.

> [!NOTE]
> As MySQL assessments are performance-based assessments, if the confidence rating of any assessment is fewer than five stars, we recommend that you wait at least a day for the appliance to profile the environment and then recalculate the assessment. Otherwise, performance-based sizing might be unreliable.

## Calculate monthly costs
Once the sizing recommendations are complete, MySQL assessment calculates the compute, storage, and IO costs for the recommended Azure Database for MySQL configurations using an internal pricing API. It aggregates these costs across all the instances to determine the total monthly cost.

To calculate the compute, storage and IO costs for an Azure Database for MySQL configuration, the assessment considers the following assessment properties:

- Licensing program
- Currency
- Savings option
- Discount (%)
- Azure target location

## Next steps

 - [Learn how to run a MySQL assessment](create-mysql-assessment.md).
 - [Get started on your MySQL migration journey to Azure Database for MySQL](/training/modules/choose-tool-to-migrate-data-to-azure-database-for-mysql/).

