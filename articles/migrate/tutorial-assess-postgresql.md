---
title: Assessing On-Premises PostgreSQL for Migration to Azure Flexible Server
description: Learn how to assess on-premises PostgreSQL workloads for Azure migration using Azure Migrate, including how to run configuration-based assessments and analyze readiness, risks, and cost estimates.
author: habibaum
ms.author: v-uhabiba
ms.service: azure-migrate 
ms.topic: tutorial
ms.date: 08/05/2025
ms.custom: engagement-fy24 
# Customer intent: Customers want to assess on-premises PostgreSQL workloads using Azure Migrate to prepare for migration to Azure Database for PostgreSQL flexible server. They aim to evaluate cloud readiness, risks, and costs through configuration-based assessments.
---

# Tutorial: Assess PostgreSQL workloads for migration using Azure Migrate (preview)

This article guides you through assessing discovered PostgreSQL instances and databases using the Azure Migrate: Discovery and assessment tool, helping you prepare for migration to Azure Database for PostgreSQL flexible server.

As you plan your migration to Azure, it's important to assess your on-premises PostgreSQL workloads to determine cloud readiness, identify potential risks, and estimate migration costs and complexity. 

In this tutorial, you'll learn how to:

- Run a configuration-based assessment for PostgreSQL.
- Review the results of an Azure Database for PostgreSQL assessment.

## Prerequisites

Before you begin, ensure that you've the following:

- An Azure subscription and discover your on-premises PostgreSQL instances using Azure Migrate.
- If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.
- Before you assess your PostgreSQL instances for migration to Azure Database for PostgreSQL flexible server, ensure you discover the instances using the Azure Migrate appliance. For more information, follow the [discovery tutorial](tutorial-discover-vmware.md).
- If you use an existing Azure Migrate project, ensure you complete all [prerequisites](how-to-discover-applications.md) outlined in this article.
- Before you proceed further, ensure you’ve reviewed the discovered application. [Learn more](how-to-discover-applications.md).

## Decide sizing strategy for assessment

For the public preview, Azure Migrate supports configuration-based sizing criteria for PostgreSQL assessments:

| Assessment   | Details | Recommendation |
|--------------| -----------|----------------|
| As on-premises  | Assess based on PostgreSQL configuration data/metadata. | The recommended Azure Database for PostgreSQL flexible server configuration is based on the on-premises PostgreSQL configuration, which includes server parameters (`postgresql.conf`), allocated memory and connection settings, and database sizes. This assessment type is ideal for understanding configuration compatibility and planning migrations where performance baselines aren't yet available or when workload characteristics require a longer duration to capture comprehensive performance metrics. |

## Run an assessment

Start an assessment to evaluate your PostgreSQL workloads. 

To run an assessment, follow these steps:

1.	In the overview pane, select **Create Assessment**

    :::image type="content" source="./media/tutorial-assess-postgresql/create-assessment.png" alt-text="Screenshot shows how to create assessment." lightbox="./media/tutorial-assess-postgresql/create-assessment.png":::

1. Enter an assessment name, select the **PostgreSQL workloads**, and then select **Add**.

    :::image type="content" source="./media/tutorial-assess-postgresql/assessment-name.png" alt-text="Screenshot shows how to add assessment name." lightbox="./media/tutorial-assess-postgresql/assessment-name.png":::

    :::image type="content" source="./media/tutorial-assess-postgresql/select-workloads.png" alt-text="Screenshot shows how to select workloads." lightbox="./media/tutorial-assess-postgresql/select-workloads.png":::

1.  After adding the PostgreSQL workloads, select **Next** to proceed.

    :::image type="content" source="./media/tutorial-assess-postgresql/review-selected-workloads.png" alt-text="Screenshot shows how to review selected workloads." lightbox="./media/tutorial-assess-postgresql/review-selected-workloads.png":::

1. In the **General** tab, either set custom values or keep the default assessment settings, and then select **Next**.

    :::image type="content" source="./media/tutorial-assess-postgresql/review-created-assessment.png" alt-text="Screenshot shows review the created assessment." lightbox="./media/tutorial-assess-postgresql/review-created-assessment.png":::

    | Section | Setting | Details|
    |---------|---------|--------|
    | Target and pricing settings | Default target location | The Azure region to which you want to migrate. Azure Database for PostgreSQL flexible server configuration and cost recommendations are based on the location that you specify|
    | Target and pricing settings | Default environment | Choose the environment type (Production or Dev/Test) for PostgreSQL deployments to apply the appropriate pricing.|  
    | Target and pricing settings | Currency   | The billing currency for your account.|
    | Target and pricing settings | Program/Offer | Specify the Microsoft licensing program you would like to use for cost estimation. Select Enterprise Agreement if you have a negotiated Enterprise Agreement with Microsoft. Choose the Azure offer in which you're enrolled. By default, this field is set to pay-as-you-go, which provides retail Azure prices.<br>You can apply another discount by using Reserved Capacity and Azure Hybrid Benefit on top of the pay-as-you-go offer.<br>You can apply Azure Hybrid Benefit to both pay-as-you-go and Dev/Test environments. However, the assessment doesn't support applying Reserved Capacity to Dev/Test environments.<br>If the offer is pay-as-you-go and Reserved Capacity is set to 'No reserved instances,' the monthly cost is calculated by multiplying the VM uptime hours by the hourly price of the recommended SKU. |
    | Target and pricing settings | Default Savings options - Azure Database for PostgreSQL flexible server (PaaS) | Specify the reserved capacity savings option that you want the assessment to consider, helping to optimize your Azure cost.</br> </br> Azure reservations (one or three years reserved) are a good option for the most consistently running resources.<br>When you select 'None', the Azure compute cost is based on the pay as you go rate or based on actual usage.|
    | Target and pricing settings | Discount (%) | Any subscription-specific discounts you receive on top of the Azure offer. The default setting is 0%. |
    | Target and pricing settings | Uptime | Specify the duration (days per month/hour per day) that servers/VMs run. This is useful for computing cost estimates for PostgreSQL on Azure VM where you're aware that Azure VMs might not run continuously.   |
    | Assessment criteria | Sizing criteria | You can change this to As on-premises to get recommendations based on just the on-premises PostgreSQL Server configuration without the performance metric-based optimizations.  |
    | Assessment criteria  | Performance history  | Indicate the data duration on which you want to base the assessment. This setting isn't applicable for PostgreSQL instances as the sizing criteria is "Configuration-based". Performance history is relevant when performance-based assessments are available.|
    | Assessment criteria | Percentile utilization | Indicate the percentile value you want to use for the performance sample. This setting isn't applicable for PostgreSQL instances as the sizing criteria is "Configuration-based". Performance history is relevant when performance-based assessments are available.  | 
    | Assessment criteria  | Comfort factor | Indicate the buffer you want to use during assessment. This accounts for issues like seasonal usage, short performance history, and likely increases in future usage. |

1. In the **Advanced** tab, select **Edit Defaults** to enter PostgreSQL-specific settings.

    :::image type="content" source="./media/tutorial-assess-postgresql/edit-defaults.png" alt-text="Screenshot shows users how to configure PostgreSQL-specific settings by selecting edit defaults." lightbox="./media/tutorial-assess-postgresql/edit-defaults.png":::

1. Select **Edit Defaults** for PostgreSQL, configure the required settings, select **Save**, return to the **Advanced** tab, and then select **Next**.

    :::image type="content" source="./media/tutorial-assess-postgresql/postgresql-database-settings.png" alt-text="Screenshot shows the user how to configure PostgreSQL settings." lightbox="./media/tutorial-assess-postgresql/postgresql-database-settings.png":::

    | Section | Setting |  Details  |
    |---------|---------| ----------|
    | Azure Database for PostgreSQL sizing | Service Tier   | Choose the most appropriate service tier option to accommodate your business needs for migration to Azure Database for PostgreSQL flexible server. Options include Burstable, General Purpose, or Memory Optimized.<br>- **Burstable**: For workloads that don't need full CPU continuously and are in a Dev/Test environment.<br>- **General Purpose**: For budget-oriented workloads.<br>- **Memory Optimized**: For memory-intensive workloads. |
    | Azure Database for PostgreSQL sizing | Instance Series | Defaulted to Single instance. |
    | Azure Database for PostgreSQL sizing | Storage Type    | Defaulted to Premium SSD.|

1. In the **Review + Create Assessment** step, check the details and select **Create** to start the assessment.

    :::image type="content" source="./media/tutorial-assess-postgresql/review-create-assessment.png" alt-text="Screenshot shows users how to create and run the assessment." lightbox="./media/tutorial-assess-postgresql/review-create-assessment.png":::

1. After creating the assessment, go to the **Overview** pane and select **View** all reports, or under **Decide and plan**, and then select **Assessments** to view the report.

    :::image type="content" source="./media/tutorial-assess-postgresql/assessments.png" alt-text="Screenshot shows users how to decide and plan the assessment." lightbox="./media/tutorial-assess-postgresql/assessments.png":::

1. Select the name of the assessment you want to view.
    
    :::image type="content" source="./media/tutorial-assess-postgresql/assessments-two.png" alt-text="Screenshot shows users how to select the required assessment." lightbox="./media/tutorial-assess-postgresql/assessments-two.png":::

> [!NOTE]
> This is a configuration-based assessment that analyses your PostgreSQL setup for compatibility with Azure Database for PostgreSQL flexible server.

## Next steps

- [Review PostgreSQL assessment](tutorial-review-postgresql-report.md).