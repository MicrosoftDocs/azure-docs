---
title: Tutorial - Create a MySQL Assessment for Migration to Azure Database for MySQL (Preview)
description: Learn how to create a MySQL assessment using Azure Migrate to evaluate your on-premises MySQL database instances for migration to Azure Database for MySQL. This tutorial provides step-by-step instructions for running assessments, reviewing results, and understanding readiness and cost estimates.
author: ankitsurkar06
ms.author: ankitsurkar
ms.topic: tutorial
ms.date: 02/24/2025
ms.custom: mvc, subject-rbac-steps, engagement-fy25, references_regions
monikerRange: migrate-classic
---

# Tutorial: Assess MySQL databases for migration to Azure Database for MySQL (preview)


As part of your migration journey to Azure, you assess the workloads to measure cloud readiness, identify risks, and estimate costs and complexity. This tutorial describes how to assess discovered MySQL database instances before migrating to Azure Database for MySQL, using the Azure Migrate: Discovery and assessment tool.

In this tutorial, you learn how to:
> [!div class="checklist"]
> - [Run an assessment based on MySQL performance and configuration data](#run-an-assessment).
> - [View a MySQL assessment](#view-an-assessment).
> - [Review confidence ratings](#review-confidence-ratings)


## Prerequisites

 - An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/pricing/free-trial/). 
 - Before you assess your MySQL database instance migration to Azure Database for MySQL, ensure you've [discovered the MySQL instances](tutorial-discover-mysql-database-instances.md) that you want to assess using the Azure Migrate appliances.


## Run an assessment

To create and run a MySQL assessment, follow these steps:

1. In **Servers, databases and web apps**, select **Discover, assess and migrate**.

   :::image type="content" source="./media/create-mysql-assessment/assess-migrate.png" alt-text="Screenshot on how to get started with assessment.":::
   
1. On **Azure Migrate: Discovery and assessment**, select **Assess**, and choose the assessment type as **MySQL database**.
   
   :::image type="content" source="./media/create-mysql-assessment/assess-mysql-database.png" alt-text="Screenshot on how to get started with assessment of mysql database.":::
   
1. In **Create assessment**, you can see the **Assessment type** as *MySQL assessment* and the **Discovery source** as *Servers discovered from Azure Migrate appliance* selected by default.

1. Select **Edit** to review the assessment settings. 

   :::image type="content" source="./media/create-mysql-assessment/edit-mysql-assessment-settings.png" alt-text="Screenshot on how to edit mysql assessment settings.":::

1. In **Assessment properties**, you can retain the default values or set the necessary values:

   **Target and pricing settings**

   | **Setting** | **Details** |
   | --- | --- |
   | **Target location**  | The Azure region to which you want to migrate. Azure Database for MySQL configuration and cost recommendations are based on the location that you specify.
   | **Environment type** | The environment for the MySQL deployments to apply Azure Database for MySQL configuration and cost recommendations applicable to Production or Dev/Test.
   | **Licensing program**  | The Azure offer if you're enrolled. Currently, the field is Pay-as-you-go by default, which gives you retail Azure prices.
   | **Currency** | The billing currency for your account.
   | **Savings options**  | Specify the reserved capacity savings option that you want the assessment to consider and optimize your Azure compute cost. <br/><br> [Azure reservations](/azure/cost-management-billing/reservations/save-compute-costs-reservations) (one year or three years reserved) are a good option for the most consistently running resources. <br/><br> When you select **None**, the Azure compute cost is based on the Pay-as-you-go rate or based on actual usage. <br/><br> You need to select pay-as-you-go in the offer/licensing program to be able to use Reserved Instances. When you select any savings option other than 'None', the 'Discount (%)' setting isn’t applicable. The monthly cost estimates are calculated by multiplying 744 hours with the hourly price of the recommended SKU.
   | **Discount (%)** | Any subscription-specific discounts you receive on top of the Azure offer. The default setting is 0%.

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
   | **Service Tier** | Choose the most appropriate service tier option to accommodate your business needs for migration to Azure Database for MySQL. <br/><br> By default, all three service tiers are selected. As per the assessment report,  we recommend the best suited service tier for your servers based on your Environment Type and the collected performance data. <br/><br> - Select only *General Purpose* if you want an Azure Database for MySQL configuration designed for business workloads that require balanced computing and memory with scalable I/O throughput. <br/><br> - Select only *Business Critical* if you want an Azure Database for MySQL configuration designed for high-performance database workloads that require in-memory performance for faster transaction processing and higher concurrency.

1. Select **OK**.

   :::image type="content" source="./media/create-mysql-assessment/save-mysql-assessment-settings.png" alt-text="Screenshot on how to save mysql assessment settings.":::
   
1. In **Assess Servers**, select **Next**.
1. In **Select servers to assess**, specify a name for the assessment in the **Assessment name**.
1. In **Select or create a group**, select **Create New**, and specify a group name.
1. Select the appliance and select the servers you want to add to the group and select **Next Review + Create assessment**. 
   
    :::image type="content" source="./media/create-mysql-assessment/select-servers-mysql-assessment.png" alt-text="Screenshot on how to select servers to assess.":::

1. In **Review + create assessment**, review the assessment details, and select **Create Assessment** to create the group and run the assessment.


## View an assessment

To view an assessment, follow these steps:

1. In **Servers, databases and web apps** > **Azure Migrate: Discovery and assessment**, select the number next to **Databases** assessment. If you don't see the number populated, select **Refresh** to get the latest updates. 
    
   :::image type="content" source="./media/create-mysql-assessment/databases-assessments.png" alt-text="Screenshot on how to review the assessment.":::
   
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

 - **Assessed workloads:** This section indicates the number of MySQL servers, instances, and databases assessed. It also highlights the number of instances running on MySQL versions that are past their End of Life (EOL), and the discovery success percentage, which represents the percentage of MySQL performance data points collected out of the total expected data points.
 
 - **Migration scenarios:** This section summarizes the readiness and cost estimates for migrating all the assessed MySQL database instances to Azure Database for MySQL. Selecting **View Details** takes you to the **Instances to Azure Database for MySQL** tab, where you can select the **Instances to Azure Database for MySQL** recommended strategy to view the detailed assessment report.


### View MySQL version and End of life details

Select **View version and End of life** to see a graphical distribution of the MySQL versions of all the instances and their EOL status. 

 :::image type="content" source="./media/create-mysql-assessment/view-version-eol-details.png" alt-text="Screenshot on how to view the MySQL version and the details on its end of life.":::

## Review readiness recommended Azure configuration and cost estimates

To view MySQL instances's readiness for migration to Azure Database for MySQL, and obtain recommendations on the suitable compute, and storage options along with the associated costs, follow these steps:

- The **Instances to Azure DB for MySQL** page displays a Readiness chart and a Monthly cost estimate chart aggregated for all MySQL instances in the assessed group. It also highlights the top recommended Azure DB for MySQL configurations and top migration issues/warnings, as shown below. 

   :::image type="content" source="./media/create-mysql-assessment/mysql-assessment-instances-to-azure.png" alt-text="Screenshot that shows a summary of readiness and cost.":::

- The grid at the bottom of the page contains more details about each instance, including the instance and server name, number of user databases, readiness, MySQL version EOL status, recommended Azure Database for MySQL compute configuration and total monthly cost estimates.

- Review the **Readiness** column for the assessed MySQL instances. 

    - **Ready**: The instance is ready to be migrated to Azure Database for MySQL without any migration issues or warnings.
    - **Ready with conditions**: The instance has one or more non-critical compatibility issues or migration warnings for migrating to Azure Database for MySQL. You can select on the hyperlink and review the migration warnings and the recommended remediation guidance.
    - **Not ready**: The instance has compatibility issues that may block the migration to Azure Database for MySQL, or the assessment couldn't find an Azure Database for MySQL configuration meeting the desired configuration and performance characteristics. Select the hyperlink to review the migration issues and recommendation to make the instance ready for the desired target deployment type.
    - **Unknown**: Azure Migrate can't assess readiness, because the discovery is in progress or there are issues during discovery that need to be fixed from the notifications blade. 
    
- Select the instance name to drill down to a detailed summary of the instance, including readiness, source instance properties, recommended Azure configuration and a monthly cost estimate breakdown between compute, storage, and IO. 

    :::image type="content" source="./media/create-mysql-assessment/mysql-assessment-instance-drilldown.png" alt-text="Screenshot that shows the readiness for the assessed MySQL instances.":::

- Select the **Readiness** tab to view the migration issues and warnings for that instance.
- Select the **Source properties** tab to view source instance details like MySQL edition, version, version EOL status, and total storage size. Here, you can also review the source instance’s aggregated performance data used to recommend target Azure configuration. Including:
        - vCores utilized
        - Memory utilized (GB)
        - IOPS
        - Connections
        - Read-write %
        
- Select the **Target recommendations** tab for a detailed view of the recommended Azure configuration and cost estimates, along with the reasons for the suggested configuration.
- Select the **User databases** tab to review the list of user databases and their sizes.


## Review confidence ratings

Azure Migrate assigns a confidence rating to all MySQL assessments based on the availability of the performance/utilization data points needed to compute the assessment for all the assessed MySQL instances. The rating ranges from one star (lowest) to five stars (highest) and helps estimate the reliability of size recommendations in the assessment. For more information, see [confidence ratings](assessments-overview-migrate-to-azure-db-mysql.md#confidence-ratings).

## Next steps

 - Learn more about [how MySQL assessments are calculated](assessments-overview-migrate-to-azure-db-mysql.md).
 - [Get started on your MySQL migration journey to Azure Database for MySQL](/training/modules/choose-tool-to-migrate-data-to-azure-database-for-mysql/).
