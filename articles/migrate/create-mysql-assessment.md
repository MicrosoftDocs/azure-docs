---
title: Tutorial - Create a MySQL Assessment for Migration to Azure Database for MySQL (Preview)
description: Learn how to create a MySQL assessment using Azure Migrate to evaluate your on-premises MySQL database instances for migration to Azure Database for MySQL. This tutorial provides step-by-step instructions for running assessments, reviewing results, and understanding readiness and cost estimates.
author: ankitsurkar06
ms.author: ankitsurkar
ms.topic: tutorial
ms.date: 02/24/2025
ms.reviewer: v-uhabiba
ms.custom: mvc, subject-rbac-steps, engagement-fy25, references_regions
monikerRange:
# Customer intent: As a database administrator, I want to assess my on-premises MySQL instances for migration to a cloud-based database service, so that I can identify readiness, costs, and potential risks associated with the migration process.
---

# Assess MySQL databases for migration to Azure Database for MySQL (preview)


As part of your Azure migration journey, you assess your workloads to evaluate cloud readiness, identify potential risks, and estimate costs and migration complexity. This article explains how to assess discovered MySQL and MariaDB database instances by using Azure Migrate: Discovery and assessment before migrating them to Azure Database for MySQL.

## Prerequisites

 - An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/pricing/free-trial/). 
 - Before you assess your MySQL database instance migration to Azure Database for MySQL, ensure you've [discovered the MySQL instances](tutorial-discover-mysql-database-instances.md) that you want to assess using the Azure Migrate appliances.


## Run an assessment

To create and run a MySQL assessment, follow these steps:

1. In the **Azure Migrate** portal, select **Database** under **Explore inventory**
1. Select **MySQL/MariaDB** to view MySQL and MariaDB databases. Select the MySQL instances to be assessed for Azure Database for MySQL. 1. On command bar select **Create Assessment** on task bar. 

   :::image type="content" source="./media/create-mysql-assessment/mysql-scope-addition.png" alt-text="Screenshot on how to get started with creating scope for MySQL databases.":::
   
1. Provide a friendly name for the assessment, review the scope, and then select **Next**.
   
1. Update the assessment settings to reflect your preferences for calculating the assessment. Select **Next** to continue.

   **Target and pricing settings**

   | **Setting** | **Details** |
   | --- | --- |
   | **Target location**  | The Azure region to which you want to migrate. Azure Database for MySQL configuration and cost recommendations are based on the location that you specify.
   | **Environment type** | The environment for the MySQL deployments to apply Azure Database for MySQL configuration and cost recommendations applicable to Production or Dev/Test.
   | **Licensing program**  | The Azure offer if you're enrolled. Currently, the field is Pay-as-you-go by default, which gives you retail Azure prices.
   | **Currency** | The billing currency for your account.
   | **Savings options**  | Specify the reserved capacity savings option that you want the assessment to consider and optimize your Azure compute cost. <br/><br> [Azure reservations](/azure/cost-management-billing/reservations/save-compute-costs-reservations) (one year or three years reserved) are a good option for the most consistently running resources. <br/><br> When you select **None**, the Azure compute cost is based on the Pay-as-you-go rate or based on actual usage. <br/><br> You need to select pay-as-you-go in the offer/licensing program to be able to use Reserved Instances. When you select any savings option other than 'None', the 'Discount (%)' setting isn’t applicable. The monthly cost estimates are calculated by multiplying 744 hours with the hourly price of the recommended SKU.
   | **Discount (%)** | Any subscription-specific discounts you receive on top of the Azure offer. The default setting is 0%.

1. Select **Edit** against MySQL under Database settings to review the settings. 

   :::image type="content" source="./media/create-mysql-assessment/edit-settings.png" alt-text="Screenshot on how to edit MySQL assessment settings.":::

1. In **Assessment properties**, you can retain the default values or set the necessary values:

   **Assessment criteria**

   | **Setting** | **Details** |
   | --- | --- |
   | **Sizing criteria**  | Set to *Performance-based* by default, which means Azure Migrate collects performance metrics pertaining to MySQL instances to recommend an optimal-sized Azure Database for MySQL instance configuration.
   | **Performance history** | Indicate the data duration on which you want to base the assessment. (Default is one day)
   | **Percentile utilization** | Indicate the percentile value you want to use for the performance sample. (Default is 95th percentile)
   | **Comfort factor** | Indicate the buffer you want to use during assessment. This accounts for issues such as seasonal usage, short performance history, and likely increases in future usage.

   **Azure DB for MySQL – Flexible Server sizing**

   | **Setting** | **Details** |
   | --- | --- |
   | **Service Tier** | Choose the most appropriate service tier option to accommodate your business needs for migration to Azure Database for MySQL. <br/><br> By default, all three service tiers are selected. As per the assessment report,  we recommend the best suited service tier for your servers based on your Environment Type and the collected performance data. <br/><br> - Select only *General Purpose* if you want an Azure Database for MySQL configuration designed for business workloads that require balanced computing and memory with scalable I/O throughput. <br/><br> - Select only *Memory-Optimized* if you want an Azure Database for MySQL configuration designed for high-performance database workloads that require in-memory performance for faster transaction processing and higher concurrency.


## View an assessment

To view an assessment, follow these steps:

1. In **Decide and plan** > **Assessments**, select **Workloads** from the upper-right. Search for the assessment friendly name to locate the assessment.  
   
1. Select the MySQL assessment which you wish to view.
1. Review the assessment summary. 
   - Select **Settings** to edit the assessment settings.
   - Select **Recalculate assessment** to recalculate the assessment.
   - Select **Export** to export the assessment into an Excel spreadsheet. 
 
    :::image type="content" source="./media/create-mysql-assessment/mysql-assessment-overview.png" alt-text="Screenshot on how to recalculate the assessment.":::
   

> [!NOTE]
> As MySQL assessments are performance-based assessments, we recommend that you wait at least a day after starting discovery before you create an assessment. This provides time to collect performance data with higher confidence. If your discovery is still in progress, the readiness of your MySQL instances is marked as **Unknown**. Ideally, after you start discovery, **wait for the performance duration you specify (day/week/month)** to create or recalculate the assessment for a high-confidence rating.
 
 
### Assessment overview

The assessment overview page provides the following information:

 - **Assessed workloads:** This section indicates the number of MySQL servers, instances, and databases assessed. It also highlights the number of instances running on MySQL versions that are past their End of Life, and the discovery success percentage, which represents the percentage of MySQL performance data points collected out of the total expected data points.
 
 - **Migration scenarios:** This section summarizes the readiness and cost estimates for migrating all the assessed MySQL database instances to Azure Database for MySQL. Selecting **View Details** takes you to the **Instances to Azure Database for MySQL** tab, where you can select the **Instances to Azure Database for MySQL** recommended strategy to view the detailed assessment report.


### View MySQL version and End of life details

Select **View version and End of life** to see a graphical distribution of the MySQL versions of all the instances and their end of support status. 

 :::image type="content" source="./media/create-mysql-assessment/view-version-eol-details.png" alt-text="Screenshot on how to view the MySQL version and the details on its end of life.":::

## Review readiness recommended Azure configuration and cost estimates

To view readiness of MySQL instance for migration to Azure Database for MySQL, and obtain recommendations on the suitable compute, and storage options along with the associated costs, follow these steps:

- The **Instances to Azure DB for MySQL** page displays a Readiness chart and a Monthly cost estimate chart aggregated for all MySQL instances in the assessed group. It also highlights the top recommended Azure DB for MySQL configurations and top migration issues/warnings, as shown below. 

   :::image type="content" source="./media/create-mysql-assessment/mysql-assessment-instances-to-azure.png" alt-text="Screenshot that shows a summary of readiness and cost.":::

- The grid at the bottom of the page contains more details about each instance, including the instance and server name, number of user databases, readiness, MySQL version end of support status, recommended Azure Database for MySQL compute configuration and total monthly cost estimates.

- Review the **Readiness** column for the assessed MySQL instances. 

    - **Ready**: The instance is ready to be migrated to Azure Database for MySQL without any migration issues or warnings.
    - **Ready with conditions**: The instance has one or more non-critical compatibility issues or migration warnings for migrating to Azure Database for MySQL. You can select the hyperlink and review the migration warnings and the recommended remediation guidance.
    - **Not ready**: The instance has compatibility issues that may block the migration to Azure Database for MySQL, or the assessment couldn't find an Azure Database for MySQL configuration meeting the desired configuration and performance characteristics. Select the hyperlink to review the migration issues and recommendation to make the instance ready for the desired target deployment type.
    - **Unknown**: Azure Migrate can't assess readiness, because the discovery is in progress or there are issues during discovery that need to be fixed from the notifications blade. 
    
- Select the instance name to drill down to a detailed summary of the instance, including readiness, source instance properties, recommended Azure configuration and a monthly cost estimate breakdown between compute, storage, and IO. 

    :::image type="content" source="./media/create-mysql-assessment/mysql-assessment-instance-drilldown.png" alt-text="Screenshot that shows the readiness for the assessed MySQL instances.":::

- Select the **Readiness** tab to view the migration issues and warnings for that instance.
- Select the **Source properties** tab to view source instance details like MySQL edition, version, version end of support status, and total storage size. Here, you can also review the source instance’s aggregated performance data used to recommend target Azure configuration. Including:
        - vCores utilized
        - Memory utilized (GB)
        - IOPS
        - Connections
        - Read-write %
        
- Select the **Target recommendations** tab for a detailed view of the recommended Azure configuration and cost estimates, along with the reasons for the suggested configuration.
- Select the **User databases** tab to review the list of user databases and their sizes.

## Next steps

 - Learn more about [how MySQL assessments are calculated](assessments-overview-migrate-to-azure-db-mysql.md).
 - [Get started on your MySQL migration journey to Azure Database for MySQL](/training/modules/choose-tool-to-migrate-data-to-azure-database-for-mysql/).
