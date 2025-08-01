---
title: Assessing On-Premises PostgreSQL for Migration to Azure Flexible Server
description: Learn how to assess on-premises PostgreSQL workloads for migration to Azure using Azure Migrate. Learn to run configuration-based assessments and review results to gauge readiness, risks, and costs.
author: habibaum
ms.author: v-uhabiba
ms.service: azure-migrate 
ms.topic: tutorial
ms.date: 08/01/2025
ms.custom: engagement-fy24 
# Customer intent: Customers want to assess on-premises PostgreSQL workloads using Azure Migrate to prepare for migration to Azure Database for PostgreSQL flexible server. They aim to evaluate cloud readiness, risks, and costs through configuration-based assessments.
---

# Evaluate PostgreSQL workloads for Migration to Azure flexible server

As you plan your migration to Azure, it's important to assess your on-premises PostgreSQL workloads to determine cloud readiness, identify potential risks, and estimate migration costs and complexity. This article guides you through assessing discovered PostgreSQL instances and databases using the Azure Migrate: Discovery and assessment tool, helping you prepare for migration to Azure Database for PostgreSQL flexible server.

In this tutorial, you will learn how to:

- Run a configuration-based assessment for PostgreSQL.
- Review the results of an Azure Database for PostgreSQL assessment.

## Prerequisites

Ensure you have an Azure subscription and have discovered your on-premises PostgreSQL instances using Azure Migrate.

- If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.
- Before assessing your PostgreSQL instances for migration to Azure Database for PostgreSQL flexible server, ensure you've already discovered the instances you want to assess using the Azure Migrate appliance. For guidance, follow the [discovery tutorial](tutorial-discover-vmware.md).
- If you're using an existing Azure Migrate project, ensure you've completed all [prerequisites](how-to-discover-applications.md) outlined in this article.


## Determine sizing strategy for assessment

For the public preview, Azure Migrate supports configuration-based sizing criteria for PostgreSQL assessments:

| Assessment   | Details | Recommendation |
|--------------| -----------|----------------|
| As on-premises  | Assess based on PostgreSQL configuration data/metadata. | Recommended Azure Database for PostgreSQL flexible server configuration is based on the on-premises PostgreSQL configuration, which includes server parameters (`postgresql.conf`), allocated memory and connection settings, and database sizes. This assessment type is ideal for understanding configuration compatibility and planning migrations where performance baselines are not yet available or when workload characteristics require a longer duration to capture comprehensive performance metrics. |

### Run an assessment

Run an assessment as follows:

1.	In the overview page, select **Create Assessment**

:::image type="content" source="./media/tutorial-postgre-sql-assessment-for-flexible-azure-migration/create-assessment.png" alt-text="Screenshot shows how to create assessment" lightbox="./media/tutorial-postgre-sql-assessment-for-flexible-azure-migration/create-assessment.png":::

1. Enter an assessment name, select the **PostgreSQL workloads**, and then select **Add**.

:::image type="content" source="./media/tutorial-postgre-sql-assessment-for-flexible-azure-migration/assessment-name.png" alt-text="Screenshot shows how to add assessment name" lightbox="./media/tutorial-postgre-sql-assessment-for-flexible-azure-migration/assessment-name.png":::

:::image type="content" source="./media/tutorial-postgre-sql-assessment-for-flexible-azure-migration/select-workloads.png" alt-text="Screenshot shows how to select workloads" lightbox="./media/tutorial-postgre-sql-assessment-for-flexible-azure-migration/select-workloads.png":::

1.  After selecting the PostgreSQL workloads, select **Next** to proceed.

:::image type="content" source="./media/tutorial-postgre-sql-assessment-for-flexible-azure-migration/review-selected-workloads.png" alt-text="Screenshot shows how to review selected workloads" lightbox="./media/tutorial-postgre-sql-assessment-for-flexible-azure-migration/rreview-selected-workloads.png":::

1. In the **General** tab, either set custom values or keep the default assessment settings, and then select **Next**.

:::image type="content" source="./media/tutorial-postgre-sql-assessment-for-flexible-azure-migration/review-created-assessment.png" alt-text="Screenshot shows review the created assessment" lightbox="./media/tutorial-postgre-sql-assessment-for-flexible-azure-migration/review-created-assessment.png":::

| Section | Setting | Details|
|---------|---------|--------|
| Target and pricing settings | Default target location | The Azure region to which you want to migrate. Azure Database for PostgreSQL flexible server configuration and cost recommendations are based on the location that you specify|
| Target and pricing settings | Default environment | Choose the environment type (Production or Dev/Test) for PostgreSQL deployments to apply the appropriate pricing.|  
| Target and pricing settings | Currency   | The billing currency for your account.|
| Target and pricing settings | Program/Offer | Specify the Microsoft licensing program you would like to use for cost estimation. Select Enterprise Agreement if you have a negotiated Enterprise Agreement with Microsoft. Choose the Azure offer in which you're enrolled. By default, this field is set to Pay-as-you-go, which provides retail Azure prices.<br>You can apply additional discounts by using Reserved Capacity and Azure Hybrid Benefit on top of the Pay-as-you-go offer.<br>You can apply Azure Hybrid Benefit to both Pay-as-you-go and Dev/Test environments. However, the assessment doesn't support applying Reserved Capacity to Dev/Test environments.<br>If the offer is set to Pay-as-you-go and Reserved Capacity is set to 'No reserved instances,' the monthly cost estimates are calculated by multiplying the number of hours specified in the VM uptime field by the hourly price of the recommended SKU. |
| Target and pricing settings | Default Savings options - Azure Database for PostgreSQL flexible server (PaaS) | Specify the reserved capacity savings option that you want the assessment to consider, helping to optimize your Azure cost.<br>Azure reservations (1 year or 3 year reserved) are a good option for the most consistently running resources.<br>When you select 'None', the Azure compute cost is based on the Pay as you go rate or based on actual usage.|
| Target and pricing settings | Discount (%) | Any subscription-specific discounts you receive on top of the Azure offer. The default setting is 0%. |
| Target and pricing settings | Uptime | Specify the duration (days per month/hour per day) that servers/VMs run. This is useful for computing cost estimates for PostgreSQL on Azure VM where you're aware that Azure VMs might not run continuously.   |
| Assessment criteria | Sizing criteria | You can change this to As on-premises to get recommendations based on just the on-premises PostgreSQL Server configuration without the performance metric-based optimizations.  |
| Assessment criteria  | Performance history  | Indicate the data duration on which you want to base the assessment. This setting is not applicable for PostgreSQL instances as the sizing criteria is "Configuration-based". Performance history will be relevant when performance-based assessments are available.|
| Assessment criteria | Percentile utilization | Indicate the percentile value you want to use for the performance sample. This setting is not applicable for PostgreSQL instances as the sizing criteria is "Configuration-based". Performance history will be relevant when performance-based assessments are available.  | 
| Assessment criteria  | Comfort factor | Indicate the buffer you want to use during assessment. This accounts for issues like seasonal usage, short performance history, and likely increases in future usage. |